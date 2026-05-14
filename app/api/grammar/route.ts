import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Text is required." },
        { status: 400 }
      );
    }

    const res = await fetch("http://127.0.0.1:8000/grammar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Grammar engine request failed.");
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      issues: data.issues || [],
    });
  } catch (error) {
    console.error("Grammar API error:", error);

    return NextResponse.json(
      { success: false, message: "Grammar engine failed." },
      { status: 500 }
    );
  }
}