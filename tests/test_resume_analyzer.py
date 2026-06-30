import unittest

from resume_analyzer import analyze_resume, check_sections, find_skills


class ResumeAnalyzerTests(unittest.TestCase):
    def test_find_skills_matches_multi_word_terms(self):
        skills = find_skills("Built NLP pipelines with Python, SQL, and machine learning.")

        self.assertIn("python", skills)
        self.assertIn("sql", skills)
        self.assertIn("machine learning", skills)
        self.assertIn("nlp", skills)

    def test_analyze_resume_reports_missing_skills(self):
        result = analyze_resume(
            "Experience building Python APIs with Flask and SQL.",
            "Looking for Python, React, SQL, and AWS experience.",
        )

        self.assertGreater(result.score, 0)
        self.assertIn("python", result.matched_skills)
        self.assertIn("sql", result.matched_skills)
        self.assertIn("react", result.missing_skills)
        self.assertIn("aws", result.missing_skills)

    def test_check_sections_detects_common_resume_sections(self):
        sections = check_sections(
            "Education\nB.Tech\nExperience\nSoftware Intern\nProjects\nResume parser"
        )

        self.assertTrue(sections["education"])
        self.assertTrue(sections["experience"])
        self.assertTrue(sections["projects"])
        self.assertFalse(sections["certifications"])


if __name__ == "__main__":
    unittest.main()
