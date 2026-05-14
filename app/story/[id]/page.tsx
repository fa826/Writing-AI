"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ScriptoraStory = {
  story_id: string;
  title: string;
  author: string;
  content: string;
  cover?: string | null;
  rating?: string;
  views?: number;
  source: "scriptora";
  type: "original";
  publishedAt: string;
};

export default function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [storyId, setStoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [scriptoraStory, setScriptoraStory] = useState<ScriptoraStory | null>(
    null
  );
  const [openLibraryStory, setOpenLibraryStory] = useState<any>(null);

  useEffect(() => {
    async function loadStory() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setStoryId(id);

      if (id.startsWith("scriptora-")) {
        const saved = localStorage.getItem("scriptora_published_stories");
        const stories: ScriptoraStory[] = saved ? JSON.parse(saved) : [];

        const found = stories.find((story) => story.story_id === id);
        setScriptoraStory(found || null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);

        if (res.ok) {
          const data = await res.json();
          setOpenLibraryStory(data);
        }
      } catch (error) {
        console.error("Story fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8">
        <p className="text-[#1F2A44]">Loading story...</p>
      </main>
    );
  }

  if (scriptoraStory) {
    return (
      <main className="min-h-screen bg-white p-4">
        <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              Scriptora
            </Link>

            <Link href="/reader-dashboard" className="text-sm">
              Back to Reader&apos;s Arena
            </Link>
          </header>

          <section className="mx-auto max-w-4xl px-10 py-12">
            <p className="text-sm font-semibold text-[#3B64BA]">
              Scriptora Original
            </p>

            <h1 className="mt-3 text-5xl font-bold text-[#1F2A44]">
              {scriptoraStory.title}
            </h1>

            <p className="mt-3 text-sm text-[#5E6B85]">
              By {scriptoraStory.author} · Published{" "}
              {new Date(scriptoraStory.publishedAt).toLocaleDateString()}
            </p>

            <article className="mt-10 whitespace-pre-wrap text-lg leading-9 text-[#1F2A44]">
              {scriptoraStory.content}
            </article>
          </section>
        </div>
      </main>
    );
  }

  if (!openLibraryStory) {
    return (
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-[#1F2A44]">Story not found</h1>
        <Link href="/reader-dashboard" className="mt-4 block text-[#3B64BA]">
          Back to Reader&apos;s Arena
        </Link>
      </main>
    );
  }

  const coverId = openLibraryStory.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const description =
    typeof openLibraryStory.description === "string"
      ? openLibraryStory.description
      : openLibraryStory.description?.value || "No description available.";

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <Link href="/reader-dashboard" className="text-sm">
            Back to Reader&apos;s Arena
          </Link>
        </header>

        <section className="grid gap-8 px-10 py-10 md:grid-cols-[260px_1fr]">
          <div>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={openLibraryStory.title}
                className="h-[380px] w-full rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="h-[380px] rounded-2xl bg-[#E6EBF7]" />
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#1F2A44]">
              {openLibraryStory.title}
            </h1>

            <p className="mt-3 text-sm text-[#5E6B85]">
              Open Library ID: {storyId}
            </p>

            <p className="mt-6 max-w-3xl leading-8 text-[#1F2A44]">
              {description}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}