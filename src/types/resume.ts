export type ClaimStatus = "verified-from-resume" | "confirmed-by-user" | "needs-confirmation";

export type Severity = "critical" | "high" | "medium" | "low" | "passed";

export type ResumeGoal =
  | "general-ats"
  | "job-match"
  | "writing"
  | "formatting"
  | "fresher"
  | "internship"
  | "technical"
  | "management"
  | "career-change";

export type ContactDetails = {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type ResumeBullet = {
  id: string;
  originalText: string;
  currentText: string;
  suggestedText?: string;
  approved: boolean;
  sourceConfirmed: boolean;
  claimStatus: ClaimStatus;
  detectedSkills: string[];
  detectedMetrics: string[];
  warnings: string[];
};

export type ExperienceEntry = {
  id: string;
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bullets: ResumeBullet[];
};

export type ProjectEntry = {
  id: string;
  name: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  bullets: ResumeBullet[];
};

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  startDate?: string;
  endDate?: string;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
};

export type SkillGroup = {
  id: string;
  name: string;
  skills: string[];
};

export type CustomSection = {
  id: string;
  title: string;
  content: string[];
};

export type FileMetadata = {
  name: string;
  type: string;
  size: number;
  pageCount?: number;
  scannedLikely?: boolean;
};

export type ResumeDocument = {
  id: string;
  userId: string;
  title: string;
  targetRole?: string;
  targetCompany?: string;
  contact: ContactDetails;
  summary?: string;
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: CustomSection[];
  languages: CustomSection[];
  volunteering: CustomSection[];
  publications: CustomSection[];
  customSections: CustomSection[];
  sourceFile?: FileMetadata;
  originalText: string;
  uncategorizedContent: string[];
  createdAt: string;
  updatedAt: string;
};

export type CategoryScores = {
  jobMatch: number;
  experienceQuality: number;
  parseability: number;
  structure: number;
  writing: number;
  formatting: number;
  contactDetails: number;
};

export type ResumeIssue = {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  explanation: string;
  location: string;
  currentText?: string;
  suggestedText?: string;
  expectedScoreImpact: number;
  confidence: number;
  requiresConfirmation: boolean;
  claimStatus: ClaimStatus;
};

export type ResumeSuggestion = {
  id: string;
  type: "grammar" | "ats" | "job-match" | "impact" | "formatting";
  originalText: string;
  suggestedText: string;
  reason: string;
  expectedScoreImpact: number;
  confidence: number;
  factualRisk: "low" | "medium" | "high";
  requiresConfirmation: boolean;
  accepted: boolean;
};

export type KeywordMatrixRow = {
  keyword: string;
  importance: "required" | "preferred" | "context";
  jobFrequency: number;
  resumeFrequency: number;
  sections: string[];
  classification:
    | "present-strong"
    | "present-weak"
    | "missing-supported"
    | "missing-needs-confirmation"
    | "irrelevant"
    | "overused";
  recommendation: string;
  verified: boolean;
};

export type ResumeAnalysis = {
  overallScore: number;
  potentialScore: number;
  optimizedScore: number;
  confidence: number;
  categoryScores: CategoryScores;
  scoreReasons: string[];
  issues: ResumeIssue[];
  suggestions: ResumeSuggestion[];
  keywordMatrix: KeywordMatrixRow[];
  jobMatchPercentage: number;
  keywordCoveragePercentage: number;
  parseabilityStatus: "excellent" | "good" | "needs-review" | "high-risk";
  recruiterReadabilityScore: number;
  wordCount: number;
  estimatedReadingTimeMinutes: number;
  criticalIssueCount: number;
  recommendedImprovementCount: number;
  autoFixableIssueCount: number;
  stopReason: string;
};

export type AnalysisPayload = {
  resume: ResumeDocument;
  analysis: ResumeAnalysis;
  improvedResumeText: string;
  versions: Array<{
    id: string;
    label: string;
    score: number;
    createdAt: string;
  }>;
};
