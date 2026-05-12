"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Draft = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function WritePage() {
  const [draftId, setDraftId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const wordCount = useMemo(() => countWords(content), [content]);

  useEffect(() => {
    setDraftId(crypto.randomUUID());
  }, []);

  function saveDraft() {
    if (!title.trim() && !content.trim()) {
      alert("Please write a title or content before saving.");
      return;
    }

    const saved = localStorage.getItem("scriptora_drafts");
    const drafts: Draft[] = saved ? JSON.parse(saved) : [];
    const now = new Date().toISOString();

    const newDraft: Draft = {
      id: draftId || crypto.randomUUID(),
      title: title.trim() || "Untitled Document",
      content,
      createdAt: now,
      updatedAt: now,
    };

    const existingIndex = drafts.findIndex((draft) => draft.id === newDraft.id);

    if (existingIndex >= 0) {
      drafts[existingIndex] = {
        ...drafts[existingIndex],
        title: newDraft.title,
        content: newDraft.content,
        updatedAt: now,
      };
    } else {
      drafts.unshift(newDraft);
    }

    localStorage.setItem("scriptora_drafts", JSON.stringify(drafts));
    alert("Draft saved.");
  }

  return (
    <main className="min-h-screen bg-[#10255C] p-4 text-white">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-[#142B68] shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-8 py-5 max-sm:flex-col max-sm:items-stretch">
          <Link href="/writer-dashboard" className="text-2xl font-bold">
            Scriptora
          </Link>

          <div className="flex gap-3 max-sm:flex-col">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl bg-[#6EA2FF] px-5 py-3 font-semibold text-[#081B43]"
            >
              Save Draft
            </button>

            <Link
              href="/writer-dashboard"
              className="rounded-xl border border-white/20 px-5 py-3 text-center font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="grid gap-6 p-8 max-sm:p-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl bg-white p-6 text-[#1F2A44]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Story title..."
              className="w-full border-none text-4xl font-bold outline-none placeholder:text-gray-300 max-sm:text-3xl"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story..."
              className="mt-8 min-h-[560px] w-full resize-none border-none text-lg leading-8 outline-none placeholder:text-gray-300"
            />
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Document Stats</h2>

              <div className="mt-5 space-y-3 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Words</span>
                  <span>{wordCount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Characters</span>
                  <span>{content.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span>Draft</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <h2 className="text-xl font-semibold">Writing Tools</h2>

              <div className="mt-4 space-y-3">
                <button className="w-full rounded-xl bg-[#1C397E] px-4 py-3 text-left text-sm">
                  Grammar Check
                </button>

                <button className="w-full rounded-xl bg-[#1C397E] px-4 py-3 text-left text-sm">
                  Improve Paragraph
                </button>

                <button className="w-full rounded-xl bg-[#1C397E] px-4 py-3 text-left text-sm">
                  Generate Ideas
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}