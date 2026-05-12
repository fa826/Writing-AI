import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import Replicate from "replicate";
import { BOOK_COVER_PROMPT } from "@/lib/prompts";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET() {
  return NextResponse.json({ message: "Generate cover API is working" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, genre, description } = body;

    if (!title || !genre || !description) {
      return NextResponse.json(
        { error: "Title, genre, and description are required." },
        { status: 400 }
      );
    }

    // Step 1: Use Claude to write a good image prompt
    const promptMessage = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${BOOK_COVER_PROMPT}\n\nBook Title: ${title}\nGenre: ${genre}\nDescription: ${description}`,
        },
      ],
    });

    const imagePrompt =
      promptMessage.content[0].type === "text"
        ? promptMessage.content[0].text
        : "";

    // Step 2: Generate the image with Stable Diffusion
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: `book cover art, ${imagePrompt}`,
          negative_prompt: "text, words, letters, watermark, blurry, low quality",
          width: 512,
          height: 768,
          num_outputs: 1,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ imageUrl, imagePrompt });
  } catch (error) {
    console.error("Cover generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover." },
      { status: 500 }
    );
  }
}