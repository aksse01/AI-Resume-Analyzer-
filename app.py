from __future__ import annotations

import streamlit as st

from resume_analyzer import analyze_resume, read_resume_file


st.set_page_config(page_title="AI Resume Analyzer", page_icon=":page_facing_up:", layout="wide")


def render_metric(label: str, value: str) -> None:
    st.metric(label=label, value=value)


st.title("AI Resume Analyzer")
st.caption("Compare your resume with a job description and improve your ATS match.")

left, right = st.columns([1, 1])

with left:
    uploaded_resume = st.file_uploader("Upload resume", type=["pdf", "docx", "txt"])
    pasted_resume = st.text_area("Or paste resume text", height=260)

with right:
    job_description = st.text_area("Paste job description", height=345)

if st.button("Analyze resume", type="primary", use_container_width=True):
    resume_text = pasted_resume.strip()

    if uploaded_resume is not None:
        try:
            resume_text = read_resume_file(uploaded_resume.name, uploaded_resume.getvalue())
        except Exception as exc:
            st.error(str(exc))
            st.stop()

    if not resume_text:
        st.warning("Upload or paste a resume first.")
        st.stop()

    if not job_description.strip():
        st.warning("Paste a job description first.")
        st.stop()

    result = analyze_resume(resume_text, job_description)

    st.divider()
    metric_cols = st.columns(4)
    with metric_cols[0]:
        render_metric("Match score", f"{result.score}%")
    with metric_cols[1]:
        render_metric("Matched skills", str(len(result.matched_skills)))
    with metric_cols[2]:
        render_metric("Missing skills", str(len(result.missing_skills)))
    with metric_cols[3]:
        complete_sections = sum(result.section_checks.values())
        render_metric("Resume sections", f"{complete_sections}/{len(result.section_checks)}")

    skills_left, skills_right = st.columns(2)
    with skills_left:
        st.subheader("Matched Skills")
        if result.matched_skills:
            st.write(", ".join(result.matched_skills))
        else:
            st.info("No direct skill matches found yet.")

    with skills_right:
        st.subheader("Missing Skills")
        if result.missing_skills:
            st.write(", ".join(result.missing_skills))
        else:
            st.success("No missing tracked skills found.")

    st.subheader("Section Check")
    section_cols = st.columns(len(result.section_checks))
    for column, (section, present) in zip(section_cols, result.section_checks.items()):
        with column:
            status = "Present" if present else "Missing"
            st.metric(section.title(), status)

    st.subheader("Improvement Suggestions")
    for suggestion in result.suggestions:
        st.write(f"- {suggestion}")

    with st.expander("Keyword details"):
        st.write("Resume keywords:", ", ".join(result.resume_keywords))
        st.write("Job keywords:", ", ".join(result.job_keywords))
else:
    st.info("Upload or paste a resume, add a job description, then run the analyzer.")
