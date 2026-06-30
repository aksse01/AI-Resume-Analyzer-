import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeResume } from "@/features/analysis/scoring";
import { ResumeUploadSchema } from "@/features/analysis/schemas";
import { parseResumeText } from "@/features/resumes/parser";
import { extractResumeFile } from "@/lib/files/extract";

export const runtime = "nodejs";

const formSchema = z.object({
  resumeText: z.string().optional(),
  jobDescription: z.string().optional(),
  goal: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let resumeText = "";
    let jobDescription = "";
    let fileMetadata;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const parsed = formSchema.parse({
        resumeText: formData.get("resumeText")?.toString(),
        jobDescription: formData.get("jobDescription")?.toString(),
        goal: formData.get("goal")?.toString()
      });
      jobDescription = parsed.jobDescription ?? "";
      const file = formData.get("file");

      if (file instanceof File && file.size > 0) {
        const extracted = await extractResumeFile(file);
        resumeText = extracted.text;
        fileMetadata = extracted.metadata;
      } else {
        resumeText = parsed.resumeText ?? "";
      }
    } else {
      const rawBody = await request.json();
      const body = ResumeUploadSchema.parse({
        resumeText: typeof rawBody.resumeText === "string" ? rawBody.resumeText : "",
        jobDescription: typeof rawBody.jobDescription === "string" ? rawBody.jobDescription : "",
        goal: typeof rawBody.goal === "string" ? rawBody.goal : undefined
      });
      resumeText = body.resumeText;
      jobDescription = body.jobDescription ?? "";
    }

    const validation = ResumeUploadSchema.safeParse({ resumeText, jobDescription });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0]?.message ?? "Invalid resume input." }, { status: 400 });
    }

    const resume = parseResumeText(resumeText, fileMetadata);
    const payload = analyzeResume(resume, jobDescription);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume analysis failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
