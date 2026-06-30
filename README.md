# AI Resume Analyzer

A lightweight Streamlit app that compares a resume with a job description and gives an ATS-style match report.

## Features

- Upload resumes as PDF, DOCX, or TXT files.
- Paste a target job description.
- Get a match score, keyword coverage, missing skills, and improvement tips.
- Run the core analyzer without any paid API key.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
streamlit run app.py
```

Then open the local URL shown by Streamlit.

## Test

```bash
python -m unittest discover -s tests
```

## Project Structure

```text
app.py                 Streamlit web app
resume_analyzer.py     Resume parsing and scoring logic
tests/                 Unit tests for the analyzer
requirements.txt       Python dependencies
```
