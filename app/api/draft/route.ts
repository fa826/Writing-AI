import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { DRAFT_WRITING_PROMPT } from "@/lib/prompts";

export async function GET() {
  return NextResponse.json({ message: "Draft API is working" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt?.trim();
    const type = body.type?.trim() || "essay";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${DRAFT_WRITING_PROMPT}\n\nWrite a ${type} about:\n${prompt}`,
        },
      ],
    });

    const result =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Draft error:", error);
    return NextResponse.json(
      { error: "Failed to generate draft." },
      { status: 500 }
    );
  }
}