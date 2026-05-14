import { NextRequest, NextResponse } from "next/server";

const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, message: "Prompt is required." },
        { status: 400 }
      );
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { success: false, message: "Missing HF_TOKEN in .env.local." },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const errorText = await res.text();
      console.error("HF IMAGE ERROR:", errorText);

      return NextResponse.json(
        {
          success: false,
          message:
            "Hugging Face image generation failed. Check token access or model permissions.",
          details: errorText,
        },
        { status: 500 }
      );
    }

    if (contentType.includes("application/json")) {
      const data = await res.json();
      console.error("HF JSON RESPONSE:", data);

      return NextResponse.json(
        {
          success: false,
          message: data.error || "Model is still loading. Try again.",
        },
        { status: 500 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    console.error("Image generation API error:", error);

    return NextResponse.json(
      { success: false, message: "Image generation failed." },
      { status: 500 }
    );
  }
}