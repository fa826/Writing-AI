import { NextRequest, NextResponse } from "next/server";

function normalize(sentence: string) {
  return sentence.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Text is required." },
        { status: 400 }
      );
    }

    const sentences = text
      .split(/[.!?]/)
      .map((sentence: string) => sentence.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const sentence of sentences) {
      const cleaned = normalize(sentence);

      if (cleaned.length < 20) continue;

      if (seen.has(cleaned)) {
        duplicates.push(sentence);
      }

      seen.add(cleaned);
    }

    return NextResponse.json({
      success: true,
      risk: duplicates.length > 0 ? "medium" : "low",
      duplicates,
      message:
        duplicates.length > 0
          ? "Possible repeated content found."
          : "No repeated content found locally.",
    });
  } catch (error) {
    console.error("Plagiarism API error:", error);

    return NextResponse.json(
      { success: false, message: "Plagiarism check failed." },
      { status: 500 }
    );
  }
}