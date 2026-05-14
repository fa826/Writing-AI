"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Draft = {
  id: string;
  title: string;
  content: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PublishedStory = {
  story_id: string;
  title: string;
  author: string;
  content: string;
  cover: string | null;
  rating: string;
  views: number;
  source: "scriptora";
  type: "original";
  publishedAt: string;
};

function countWords(text?: string) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildHighlightedHtml(text: string, issues: any[]) {
  if (!text || issues.length === 0) return escapeHtml(text);

  const validIssues = issues
    .filter((issue) => typeof issue.offset === "number" && typeof issue.length === "number")
    .sort((a, b) => a.offset - b.offset);

  let result = "";
  let cursor = 0;

  validIssues.forEach((issue, index) => {
    const start = issue.offset;
    const end = issue.offset + issue.length;

    if (start < cursor) return;

    result += escapeHtml(text.slice(cursor, start));

    const errorText = text.slice(start, end);

    result += `<span data-issue-index="${index}" class="cursor-pointer underline decoration-red-500 decoration-2 underline-offset-4">${escapeHtml(errorText)}</span>`;

    cursor = end;
  });

  result += escapeHtml(text.slice(cursor));

  return result;
}

export default function WritePage() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Story");
  const [lastSaved, setLastSaved] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [grammarIssues, setGrammarIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);
  const [plagiarismIssues, setPlagiarismIssues] = useState<any[]>([]);
  const [plagiarismRisk, setPlagiarismRisk] = useState("");

  const words = useMemo(() => countWords(content), [content]);
  const readingTime = Math.max(1, Math.ceil(words / 200));
  const highlightedHtml = useMemo(
    () => buildHighlightedHtml(content, grammarIssues),
    [content, grammarIssues]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get("id");

    const setup = localStorage.getItem("scriptora_setup");
    if (setup) setType(JSON.parse(setup).type || "Story");

    const saved = localStorage.getItem("scriptora_drafts");
    const drafts: Draft[] = saved ? JSON.parse(saved) : [];

    if (draftId) {
      const existing = drafts.find((d) => d.id === draftId);

      if (existing) {
        setId(existing.id);
        setTitle(existing.title || "");
        setContent(existing.content || "");
        setType(existing.type || "Story");
        setLastSaved(existing.updatedAt || "");
        return;
      }

      setId(draftId);
    } else {
      setId(crypto.randomUUID());
    }
  }, []);

  function saveDraft(showAlert = true) {
    if (!id) return;

    const saved = localStorage.getItem("scriptora_drafts");
    const drafts: Draft[] = saved ? JSON.parse(saved) : [];
    const now = new Date().toISOString();

    const existing = drafts.find((d) => d.id === id);

    const draft: Draft = {
      id,
      title: title.trim() || "Untitled Part 1",
      content,
      type,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    const index = drafts.findIndex((d) => d.id === id);

    if (index >= 0) drafts[index] = draft;
    else drafts.unshift(draft);

    localStorage.setItem("scriptora_drafts", JSON.stringify(drafts));
    setLastSaved(now);

    if (showAlert) alert("Draft saved.");
  }

  function publishStory() {
    if (!title.trim() || !content.trim()) {
      alert("Please add a title and content before publishing.");
      return;
    }

    saveDraft(false);

    const saved = localStorage.getItem("scriptora_published_stories");
    const publishedStories: PublishedStory[] = saved ? JSON.parse(saved) : [];

    const story: PublishedStory = {
      story_id: `scriptora-${id}`,
      title: title.trim(),
      author: "Scriptora Writer",
      content,
      cover: image,
      rating: "★★★★★",
      views: 0,
      source: "scriptora",
      type: "original",
      publishedAt: new Date().toISOString(),
    };

    const index = publishedStories.findIndex(
      (item) => item.story_id === story.story_id
    );

    if (index >= 0) publishedStories[index] = story;
    else publishedStories.unshift(story);

    localStorage.setItem("scriptora_published_stories", JSON.stringify(publishedStories));

    alert("Published to Reader's Arena.");
    window.location.href = "/reader-dashboard";
  }

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      if (title.trim() || content.trim()) {
        saveDraft(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, id]);

  async function handleGrammarCheck() {
    setActiveTool("Grammar Check");

    try {
      const res = await fetch("/api/grammar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });

      const data = await res.json();

      if (data.success) {
        setGrammarIssues(data.issues || []);
        setSelectedIssue(null);
        setSelectedIssueIndex(null);
      } else {
        alert(data.message || "Grammar check failed");
      }
    } catch {
      alert("Grammar check failed");
    }

    setActiveTool(null);
  }

  async function handleGenerateImage() {
    const imagePrompt = window.prompt("Describe your image:");
    if (!imagePrompt) return;

    setActiveTool("Generate Image");

    try {
      const res = await fetch("/api/image-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const data = await res.json();

      if (data.success && data.image) {
        setImage(data.image);
      } else {
        alert(data.message || "Image generation failed");
      }
    } catch {
      alert("Image generation failed");
    }

    setActiveTool(null);
  }

  async function handlePlagiarismCheck() {
    setActiveTool("Plagiarism Check");

    try {
      const res = await fetch("/api/plagiarism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });

      const data = await res.json();

      if (data.success) {
        setPlagiarismIssues(data.matches || data.duplicates || []);
        setPlagiarismRisk(data.risk || "unknown");
      } else {
        alert(data.message || "Plagiarism check failed");
      }
    } catch {
      alert("Plagiarism check failed");
    }

    setActiveTool(null);
  }

  async function handleCitations() {
    setActiveTool("Citation Generator");

    try {
      const res = await fetch("/api/citations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          source: type,
          year: new Date().getFullYear().toString(),
          style: "APA",
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.citation);
      } else {
        alert(data.message || "Citation generation failed");
      }
    } catch {
      alert("Citation generation failed");
    }

    setActiveTool(null);
  }

  function handleAskAI() {
    alert("Scriptora AI will be connected after the custom AI engine is ready.");
  }

  function applyGrammarFix() {
    if (!selectedIssue || selectedIssueIndex === null) return;

    const fix = selectedIssue.replacements?.[0]?.value;
    if (!fix) return;

    const start = selectedIssue.offset;
    const end = selectedIssue.offset + selectedIssue.length;

    const updatedContent = content.slice(0, start) + fix + content.slice(end);

    setContent(updatedContent);
    setGrammarIssues([]);
    setSelectedIssue(null);
    setSelectedIssueIndex(null);
  }

  return (
    <main className="min-h-screen bg-[#071A46] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#10255C]/95 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/writer-dashboard"
              className="rounded-full border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
            >
              ←
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6EA2FF] font-black text-[#071A46]">
                  S
                </span>
                <p className="text-xl font-bold">Scriptora</p>
              </div>

              <p className="mt-1 text-xs text-white/50">
                {type} · Draft · {words} words{" "}
                {lastSaved && (
                  <span className="text-[#7EE7B8]">
                    · Saved {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => saveDraft(true)}
              className="rounded-full border border-white/20 px-5 py-2 font-semibold hover:bg-white/10"
            >
              Save
            </button>

            <button
              type="button"
              onClick={publishStory}
              className="rounded-full bg-[#6EA2FF] px-5 py-2 font-semibold text-[#071A46] hover:bg-[#8BB6FF]"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-73px)] grid-cols-[1fr_360px] bg-[#F4F6FB] max-lg:grid-cols-1">
        <main className="px-8 py-10 text-[#1F2A44]">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[28px] bg-white px-10 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Part 1"
                className="w-full border-b border-[#E5E7EB] pb-4 text-center text-4xl font-semibold outline-none placeholder:text-[#9CA3AF]"
              />

              {image && (
                <img
                  src={image}
                  alt="Generated story visual"
                  className="mx-auto mt-6 max-h-[320px] rounded-2xl object-cover shadow-lg"
                />
              )}

              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setGrammarIssues([]);
                  setSelectedIssue(null);
                  setSelectedIssueIndex(null);
                }}
                placeholder="Type your text"
                className="mt-6 min-h-[420px] w-full resize-none border-none text-lg leading-9 outline-none placeholder:italic placeholder:text-[#9CA3AF]"
              />

              {grammarIssues.length > 0 && (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <h3 className="mb-3 font-bold text-red-700">
                    Grammar Highlight Preview
                  </h3>

                  <div
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const index = target.dataset.issueIndex;

                      if (index !== undefined) {
                        const issue = grammarIssues[Number(index)];
                        setSelectedIssue(issue);
                        setSelectedIssueIndex(Number(index));
                      }
                    }}
                    className="whitespace-pre-wrap text-lg leading-9 text-[#1F2A44]"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {selectedIssue && (
          <div className="fixed bottom-10 right-10 z-50 w-80 rounded-xl bg-[#10255C] p-4 text-white shadow-2xl">
            <p className="mb-2 font-semibold">{selectedIssue.message}</p>

            <p className="text-sm text-white/60">
              Suggestion: {selectedIssue.replacements?.[0]?.value || "N/A"}
            </p>

            <button
              type="button"
              onClick={applyGrammarFix}
              className="mt-4 w-full rounded-lg bg-[#6EA2FF] px-4 py-2 font-semibold text-[#071A46]"
            >
              Apply Fix
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedIssue(null);
                setSelectedIssueIndex(null);
              }}
              className="mt-2 w-full text-sm text-white/60"
            >
              Ignore
            </button>
          </div>
        )}

        <aside className="border-l border-white/10 bg-[#10255C] p-6 max-lg:border-l-0">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-lg font-bold">Document Stats</h2>

              <div className="mt-4 space-y-3 text-sm text-white/75">
                <div className="flex justify-between">
                  <span>Words</span>
                  <span>{words}</span>
                </div>

                <div className="flex justify-between">
                  <span>Characters</span>
                  <span>{content.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Reading Time</span>
                  <span>{readingTime} min</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-lg font-bold">Writing Assistant</h2>

              <div className="mt-4 space-y-3">
                {[
                  "Grammar Check",
                  "Generate Image",
                  "Plagiarism Check",
                  "Citation Generator",
                  "Ask Scriptora AI",
                  "Pull References",
                ].map((tool) => {
                  let onClick = () => {};

                  if (tool === "Grammar Check") onClick = handleGrammarCheck;
                  if (tool === "Generate Image") onClick = handleGenerateImage;
                  if (tool === "Plagiarism Check") onClick = handlePlagiarismCheck;
                  if (tool === "Citation Generator") onClick = handleCitations;
                  if (tool === "Ask Scriptora AI") onClick = handleAskAI;

                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={onClick}
                      disabled={activeTool !== null}
                      className="w-full rounded-xl bg-[#1C397E] px-4 py-3 text-left text-sm font-medium hover:bg-[#426DD8] disabled:opacity-50"
                    >
                      {activeTool === tool ? "Processing..." : tool}
                    </button>
                  );
                })}
              </div>
            </div>

            {grammarIssues.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <h3 className="mb-2 font-semibold">Grammar Issues</h3>

                <div className="max-h-48 space-y-2 overflow-y-auto text-sm text-white/80">
                  {grammarIssues.slice(0, 8).map((issue, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setSelectedIssueIndex(i);
                      }}
                      className="block w-full rounded-lg bg-white/5 p-3 text-left hover:bg-white/10"
                    >
                      <p>{issue.message}</p>
                      <p className="text-xs text-white/50">
                        Suggestion: {issue.replacements?.[0]?.value || "N/A"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plagiarismRisk && (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <h3 className="mb-2 font-semibold">Plagiarism Check</h3>
                <p className="text-sm text-white/70">Risk: {plagiarismRisk}</p>
                <p className="text-sm text-white/70">
                  Matches: {plagiarismIssues.length}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-lg font-bold">Export</h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {["PDF", "DOCX", "TXT", "Share"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-xl border border-white/15 px-4 py-3 font-semibold hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}