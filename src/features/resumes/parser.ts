import { groupedSkillCategories, findSkills } from "./skill-taxonomy";
import { normalizeText, uid } from "@/lib/utils";
import type { ResumeBullet, ResumeDocument } from "@/types/resume";

const sectionMap: Record<string, string[]> = {
  summary: ["summary", "profile", "professional summary", "objective"],
  skills: ["skills", "technical skills", "tools", "technologies"],
  experience: ["experience", "work experience", "employment", "internship"],
  projects: ["projects", "project experience"],
  education: ["education", "academic"],
  certifications: ["certifications", "awards & certifications", "awards and certifications", "licenses"],
  awards: ["awards", "honors"],
  languages: ["languages"],
  volunteering: ["volunteering", "volunteer"],
  publications: ["publications"]
};

function detectSection(line: string) {
  const clean = line.toLowerCase().replace(/[^a-z& ]/g, "").trim();
  for (const [section, names] of Object.entries(sectionMap)) {
    if (names.includes(clean)) {
      return section;
    }
  }
  return null;
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function extractPhone(text: string) {
  return text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}/)?.[0];
}

function bulletFromText(text: string): ResumeBullet {
  const detectedMetrics = text.match(/\b\d+(?:\.\d+)?%?|\b\d{1,3}(?:,\d{3})+\b/g) ?? [];
  return {
    id: uid("bullet"),
    originalText: text,
    currentText: text,
    approved: false,
    sourceConfirmed: true,
    claimStatus: "verified-from-resume",
    detectedSkills: findSkills(text),
    detectedMetrics,
    warnings: detectedMetrics.length === 0 ? ["No measurable outcome detected."] : []
  };
}

function splitSections(text: string) {
  const lines = normalizeText(text).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections: Record<string, string[]> = { uncategorized: [] };
  let current = "uncategorized";

  for (const line of lines) {
    const detected = detectSection(line);
    if (detected) {
      current = detected;
      sections[current] = sections[current] ?? [];
      continue;
    }
    sections[current] = sections[current] ?? [];
    sections[current].push(line);
  }

  return sections;
}

export function parseResumeText(text: string, file?: ResumeDocument["sourceFile"]): ResumeDocument {
  const cleanText = normalizeText(text);
  const lines = cleanText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sections = splitSections(cleanText);
  const now = new Date().toISOString();
  const name = lines[0]?.replace(/[^a-zA-Z .'-]/g, "").trim() || "Untitled Candidate";
  const allSkills = findSkills(cleanText);

  const skillGroups = Object.entries(groupedSkillCategories)
    .map(([name, skills]) => ({
      id: uid("skills"),
      name,
      skills: skills.filter((skill) => allSkills.includes(skill))
    }))
    .filter((group) => group.skills.length > 0);

  const experienceBullets = (sections.experience ?? [])
    .filter((line) => /^[-*]|\d+%|\b(collaborated|built|created|managed|developed|optimized|analyzed|implemented)\b/i.test(line))
    .map((line) => bulletFromText(line.replace(/^[-*]\s*/, "")));

  const projectLines = sections.projects ?? [];
  const projectBullets = projectLines
    .filter((line) => /^[-*]|\d+%|\b(analyzed|built|created|generated|designed|queried|detected|engineered)\b/i.test(line))
    .map((line) => bulletFromText(line.replace(/^[-*]\s*/, "")));

  return {
    id: uid("resume"),
    userId: "guest",
    title: `${name} Resume`,
    contact: {
      fullName: name,
      email: extractEmail(cleanText),
      phone: extractPhone(cleanText),
      linkedin: cleanText.match(/linkedin\.com\/[^\s]+/i)?.[0],
      github: cleanText.match(/github\.com\/[^\s]+/i)?.[0]
    },
    summary: (sections.summary ?? []).slice(0, 3).join(" "),
    skills: skillGroups,
    experience: [
      {
        id: uid("exp"),
        company: "Needs review",
        title: sections.experience?.[0] ?? "Experience",
        bullets: experienceBullets
      }
    ],
    projects: [
      {
        id: uid("project"),
        name: projectLines[0] ?? "Projects",
        technologies: allSkills,
        bullets: projectBullets
      }
    ],
    education: (sections.education ?? []).length
      ? [
          {
            id: uid("edu"),
            institution: sections.education?.[1] ?? "Needs review",
            degree: sections.education?.[0] ?? "Education"
          }
        ]
      : [],
    certifications: (sections.certifications ?? []).map((line) => ({
      id: uid("cert"),
      name: line
    })),
    awards: [],
    languages: [],
    volunteering: [],
    publications: [],
    customSections: [],
    sourceFile: file,
    originalText: cleanText,
    uncategorizedContent: sections.uncategorized ?? [],
    createdAt: now,
    updatedAt: now
  };
}
