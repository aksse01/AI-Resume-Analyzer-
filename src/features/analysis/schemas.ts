import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  potentialScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  categoryScores: z.object({
    jobMatch: z.number().min(0).max(25),
    experienceQuality: z.number().min(0).max(20),
    parseability: z.number().min(0).max(15),
    structure: z.number().min(0).max(15),
    writing: z.number().min(0).max(10),
    formatting: z.number().min(0).max(10),
    contactDetails: z.number().min(0).max(5)
  }),
  issues: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      severity: z.enum(["critical", "high", "medium", "low", "passed"]),
      title: z.string(),
      explanation: z.string(),
      location: z.string(),
      currentText: z.string().optional(),
      suggestedText: z.string().optional(),
      expectedScoreImpact: z.number(),
      confidence: z.number().min(0).max(1),
      requiresConfirmation: z.boolean()
    })
  )
});

export const ResumeUploadSchema = z.object({
  resumeText: z.string().min(20, "Resume text is too short to analyze."),
  jobDescription: z.string().optional(),
  goal: z.string().optional()
});
