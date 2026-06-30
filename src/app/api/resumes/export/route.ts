import { Document, Packer, Paragraph, TextRun } from "docx";
import { NextResponse } from "next/server";
import { buildJsonExport, buildTextExport } from "@/features/export/export-readiness";
import type { AnalysisPayload } from "@/types/resume";

export const runtime = "nodejs";

type ExportBody = {
  payload: AnalysisPayload;
  format: "txt" | "json" | "docx";
  filename?: string;
};

function safeFilename(name?: string) {
  return (name || "ResumeForge_AI_Resume").replace(/[^a-zA-Z0-9_-]+/g, "_");
}

async function buildDocx(text: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: text.split(/\n/).map(
          (line) =>
            new Paragraph({
              children: [new TextRun({ text: line, size: line === line.toUpperCase() ? 28 : 22, bold: line === line.toUpperCase() })],
              spacing: { after: 120 }
            })
        )
      }
    ]
  });
  return Packer.toBuffer(doc);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExportBody;
    const filename = safeFilename(body.filename);

    if (body.format === "json") {
      return new NextResponse(buildJsonExport(body.payload), {
        headers: {
          "content-type": "application/json",
          "content-disposition": `attachment; filename="${filename}.json"`
        }
      });
    }

    if (body.format === "docx") {
      const buffer = await buildDocx(buildTextExport(body.payload));
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "content-disposition": `attachment; filename="${filename}.docx"`
        }
      });
    }

    return new NextResponse(buildTextExport(body.payload), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}.txt"`
      }
    });
  } catch {
    return NextResponse.json({ error: "Export failed. Check readiness issues and try again." }, { status: 400 });
  }
}
