import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Summarize API is working" });
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

    const shortened = text.length > 180 ? `${text.slice(0, 180)}...` : text;
    const summary = `Summary:\n\n${shortened}`;

    return NextResponse.json({ result: summary });
  } catch {
    return NextResponse.json(
      { error: "Failed to summarize writing." },
      { status: 500 }
    );
  }
}