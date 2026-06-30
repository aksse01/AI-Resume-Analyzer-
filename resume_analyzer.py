from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Iterable


SKILL_KEYWORDS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "django",
    "flask",
    "fastapi",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "git",
    "linux",
    "machine learning",
    "deep learning",
    "nlp",
    "data analysis",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "excel",
    "power bi",
    "tableau",
    "communication",
    "leadership",
    "problem solving",
    "project management",
    "agile",
    "scrum",
}

SECTION_KEYWORDS = {
    "experience": ("experience", "employment", "work history", "internship"),
    "education": ("education", "degree", "university", "college"),
    "skills": ("skills", "technical skills", "tools", "technologies"),
    "projects": ("projects", "portfolio", "case study"),
    "certifications": ("certification", "certifications", "license"),
}


@dataclass(frozen=True)
class AnalysisResult:
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    resume_keywords: list[str]
    job_keywords: list[str]
    suggestions: list[str]
    section_checks: dict[str, bool]


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9+#\s-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_keywords(text: str, max_keywords: int = 30) -> list[str]:
    normalized = normalize_text(text)
    words = re.findall(r"[a-z][a-z0-9+#.-]{2,}", normalized)
    stop_words = {
        "and",
        "the",
        "for",
        "with",
        "from",
        "this",
        "that",
        "you",
        "are",
        "will",
        "have",
        "has",
        "your",
        "our",
        "job",
        "role",
        "team",
        "work",
        "using",
        "based",
        "years",
        "skills",
        "experience",
    }
    counts = Counter(word for word in words if word not in stop_words)
    return [word for word, _ in counts.most_common(max_keywords)]


def find_skills(text: str, skill_set: Iterable[str] = SKILL_KEYWORDS) -> set[str]:
    normalized = normalize_text(text)
    found: set[str] = set()
    for skill in skill_set:
        pattern = r"(?<![a-z0-9+#])" + re.escape(skill) + r"(?![a-z0-9+#])"
        if re.search(pattern, normalized):
            found.add(skill)
    return found


def check_sections(resume_text: str) -> dict[str, bool]:
    normalized = normalize_text(resume_text)
    return {
        section: any(keyword in normalized for keyword in keywords)
        for section, keywords in SECTION_KEYWORDS.items()
    }


def analyze_resume(resume_text: str, job_description: str) -> AnalysisResult:
    resume_skills = find_skills(resume_text)
    job_skills = find_skills(job_description)
    matched = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)

    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)
    keyword_overlap = set(resume_keywords) & set(job_keywords)
    section_checks = check_sections(resume_text)

    skill_score = 100 if not job_skills else round((len(matched) / len(job_skills)) * 100)
    keyword_score = 100 if not job_keywords else round((len(keyword_overlap) / min(len(job_keywords), 20)) * 100)
    section_score = round((sum(section_checks.values()) / len(section_checks)) * 100)
    score = round((skill_score * 0.55) + (keyword_score * 0.25) + (section_score * 0.20))

    suggestions = build_suggestions(missing, section_checks, score)

    return AnalysisResult(
        score=max(0, min(score, 100)),
        matched_skills=matched,
        missing_skills=missing,
        resume_keywords=resume_keywords,
        job_keywords=job_keywords,
        suggestions=suggestions,
        section_checks=section_checks,
    )


def build_suggestions(missing_skills: list[str], section_checks: dict[str, bool], score: int) -> list[str]:
    suggestions: list[str] = []
    if missing_skills:
        suggestions.append("Add evidence for these job keywords where truthful: " + ", ".join(missing_skills[:8]) + ".")
    if not section_checks.get("projects"):
        suggestions.append("Add a projects section with measurable outcomes and the tools used.")
    if not section_checks.get("certifications"):
        suggestions.append("List relevant certifications, coursework, or training if you have them.")
    if score < 70:
        suggestions.append("Mirror the job description language more closely in your summary and bullet points.")
    suggestions.append("Use action verbs and metrics, for example reduced time, improved accuracy, or served users.")
    return suggestions


def read_resume_file(file_name: str, content: bytes) -> str:
    suffix = Path(file_name).suffix.lower()
    if suffix == ".txt":
        return content.decode("utf-8", errors="ignore")
    if suffix == ".pdf":
        return read_pdf(content)
    if suffix == ".docx":
        return read_docx(content)
    raise ValueError("Upload a PDF, DOCX, or TXT resume.")


def read_pdf(content: bytes) -> str:
    import pdfplumber

    text_parts: list[str] = []
    with pdfplumber.open(BytesIO(content)) as pdf:
        for page in pdf.pages:
            text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts).strip()


def read_docx(content: bytes) -> str:
    from docx import Document

    document = Document(BytesIO(content))
    return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()
