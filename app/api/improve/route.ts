import { NextRequest, NextResponse } from "next/server";

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

    const improvedText = `Improved version:\n\n${text}`;

    return NextResponse.json({ result: improvedText });
  } catch {
    return NextResponse.json(
      { error: "Failed to improve writing." },
      { status: 500 }
    );
  }
}