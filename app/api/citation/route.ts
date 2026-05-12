import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { CITATION_PROMPT } from "@/lib/prompts";

export async function GET() {
  return NextResponse.json({ message: "Citation API is working" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, title, year, publisher, url, journal, volume, issue, pages, type } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    // Build source info string from whatever fields are provided
    const sourceInfo = `
Source Type: ${type || "book"}
Title: ${title}
Author(s): ${author || "Unknown"}
Year: ${year || "n.d."}
Publisher: ${publisher || ""}
Journal: ${journal || ""}
Volume: ${volume || ""}
Issue: ${issue || ""}
Pages: ${pages || ""}
URL: ${url || ""}
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${CITATION_PROMPT}\n\nSource information:\n${sourceInfo}`,
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "{}";

    const citations = JSON.parse(raw);
    return NextResponse.json({ citations });
  } catch (error) {
    console.error("Citation error:", error);
    return NextResponse.json(
      { error: "Failed to generate citations." },
      { status: 500 }
    );
  }
}