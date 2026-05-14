"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [articleId, setArticleId] = useState("");
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      const resolved = await params;
      const id = resolved.id;
      setArticleId(id);

      try {
        const res = await fetch(`https://api.openalex.org/works/${id}`);

        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (error) {
        console.error("Article fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [params]);

  if (loading) {
    return <main className="min-h-screen p-8">Loading article...</main>;
  }

  if (!article) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/reader-dashboard" className="mt-4 block text-[#3B64BA]">
          Back to Reader&apos;s Arena
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold">
            Scriptora
          </Link>

          <Link href="/reader-dashboard" className="text-sm">
            Back to Reader&apos;s Arena
          </Link>
        </header>

        <section className="mx-auto max-w-4xl px-10 py-12">
          <p className="text-sm font-semibold text-[#3B64BA]">
            Academic Article
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#1F2A44]">
            {article.display_name}
          </h1>

          <p className="mt-4 text-sm text-[#5E6B85]">
            {article.publication_year || "Unknown year"} · Cited by{" "}
            {article.cited_by_count || 0}
          </p>

          <p className="mt-8 leading-8 text-[#1F2A44]">
            {article.abstract_inverted_index
              ? "This article has abstract metadata available through OpenAlex."
              : "No abstract available."}
          </p>

          {article.doi && (
            <a
              href={article.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-xl bg-[#3B64BA] px-5 py-3 font-semibold text-white"
            >
              Open Source
            </a>
          )}
        </section>
      </div>
    </main>
  );
}