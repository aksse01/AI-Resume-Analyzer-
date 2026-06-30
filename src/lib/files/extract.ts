import mammoth from "mammoth";
import { normalizeText } from "@/lib/utils";

export type ExtractedFile = {
  text: string;
  metadata: {
    name: string;
    type: string;
    size: number;
    pageCount?: number;
    scannedLikely?: boolean;
  };
};

const maxFileBytes = Number(process.env.RESUME_FILE_MAX_MB ?? 8) * 1024 * 1024;

export async function extractResumeFile(file: File): Promise<ExtractedFile> {
  if (file.size > maxFileBytes) {
    throw new Error(`File is too large. Maximum size is ${Math.round(maxFileBytes / 1024 / 1024)} MB.`);
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";
  let pageCount: number | undefined;

  if (extension === "txt" || file.type === "text/plain") {
    text = buffer.toString("utf-8");
  } else if (extension === "docx" || file.type.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (extension === "pdf" || file.type === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    text = result.text;
    pageCount = result.numpages;
  } else {
    throw new Error("Unsupported file type. Upload PDF, DOCX, or TXT.");
  }

  const clean = normalizeText(text);
  if (!clean || clean.length < 20) {
    throw new Error("No readable resume text was found. If this is a scanned PDF, paste the resume text manually.");
  }

  return {
    text: clean,
    metadata: {
      name: file.name,
      type: file.type || extension || "unknown",
      size: file.size,
      pageCount,
      scannedLikely: extension === "pdf" && clean.length < 150
    }
  };
}
