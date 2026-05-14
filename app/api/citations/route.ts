import { NextRequest, NextResponse } from "next/server";

function formatAPA({
  author,
  title,
  year,
  source,
  url,
}: {
  author?: string;
  title?: string;
  year?: string;
  source?: string;
  url?: string;
}) {
  const safeAuthor = author || "Unknown Author";
  const safeYear = year || "n.d.";
  const safeTitle = title || "Untitled";
  const safeSource = source || "";
  const safeUrl = url || "";

  return `${safeAuthor}. (${safeYear}). ${safeTitle}. ${safeSource}${
    safeUrl ? `. ${safeUrl}` : "."
  }`;
}

export async function POST(req: NextRequest) {
  try {
    const { author, title, year, source, url, style = "APA" } = await req.json();

    if (!title && !url) {
      return NextResponse.json(
        { success: false, message: "Title or URL is required." },
        { status: 400 }
      );
    }

    const citation = formatAPA({ author, title, year, source, url });

    return NextResponse.json({
      success: true,
      style,
      citation,
    });
  } catch (error) {
    console.error("Citation API error:", error);

    return NextResponse.json(
      { success: false, message: "Citation generation failed." },
      { status: 500 }
    );
  }
}