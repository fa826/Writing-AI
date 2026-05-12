import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { FEEDBACK_WRITING_PROMPT } from "@/lib/prompts";

export async function GET() {
  return NextResponse.json({ message: "Feedback API is working" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${FEEDBACK_WRITING_PROMPT}\n\nText to analyze:\n${text}`,
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "{}";

    const feedback = JSON.parse(raw);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to get feedback." },
      { status: 500 }
    );
  }
}