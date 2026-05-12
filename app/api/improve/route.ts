import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { IMPROVE_WRITING_PROMPT } from "@/lib/prompts";

export async function GET() {
  return NextResponse.json({ message: "Improve API is working" });
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
          content: `${IMPROVE_WRITING_PROMPT}\n\nText to improve:\n${text}`,
        },
      ],
    });

    const result =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Improve error:", error);
    return NextResponse.json(
      { error: "Failed to improve writing." },
      { status: 500 }
    );
  }
}
