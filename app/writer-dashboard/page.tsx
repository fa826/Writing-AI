"use client";

import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { label: "Document Library", icon: "📁" },
  { label: "Resources List", icon: "📋" },
  { label: "Citations", icon: "📎" },
  { label: "Doc History", icon: "🕒" },
  { label: "Plagiarism Check", icon: "🔍" },
  { label: "Notes", icon: "📝" },
  { label: "Publish", icon: "🚀" },
];

const examplePrompts = [
  "Explain the ethical concerns of AI in writing.",
  "List key milestones in the history of artificial intelligence.",
  'Improve: "The report is written in a concise manner and is very informative".',
  "Provide counterarguments against the use of AI in writing.",
];

type ActiveTool = "improve" | "draft" | "feedback" | "plagiarism" | "cover" | "citation";

type Citations = { apa: string; mla: string; chicago: string };
type Feedback = {
  grammar: { issue: string; suggestion: string }[];
  clarity: { issue: string; suggestion: string }[];
  structure: { issue: string; suggestion: string }[];
  overall: string;
};
type PlagiarismResult = {
  similarityScore: number;
  flaggedPhrases: { phrase: string; reason: string }[];
  verdict: string;
  notes: string;
};

export default function WriterDashboardPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("improve");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [coverTitle, setCoverTitle] = useState("");
  const [coverGenre, setCoverGenre] = useState("");
  const [coverDescription, setCoverDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [citationTitle, setCitationTitle] = useState("");
  const [citationAuthor, setCitationAuthor] = useState("");
  const [citationYear, setCitationYear] = useState("");
  const [citationUrl, setCitationUrl] = useState("");
  const [citationType, setCitationType] = useState("book");
  const [citations, setCitations] = useState<Citations | null>(null);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null);

  async function handleImprove() {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No response received.");
    } catch {
      setResult("Error improving text.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDraft() {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No response received.");
    } catch {
      setResult("Error generating draft.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback() {
    if (!input.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setFeedback(data.feedback || null);
    } catch {
      setResult("Error getting feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePlagiarism() {
    if (!input.trim()) return;
    setLoading(true);
    setPlagiarismResult(null);
    try {
      const res = await fetch("/api/plagiarism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setPlagiarismResult(data.result || null);
    } catch {
      setResult("Error checking plagiarism.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateCover() {
    if (!coverTitle || !coverGenre || !coverDescription) return;
    setLoading(true);
    setCoverImage(null);
    try {
      const res = await fetch("/api/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: coverTitle,
          genre: coverGenre,
          description: coverDescription,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) setCoverImage(data.imageUrl);
    } catch {
      setResult("Error generating cover.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateCitation() {
    if (!citationTitle) return;
    setLoading(true);
    setCitations(null);
    try {
      const res = await fetch("/api/citation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: citationTitle,
          author: citationAuthor,
          year: citationYear,
          url: citationUrl,
          type: citationType,
        }),
      });
      const data = await res.json();
      if (data.citations) setCitations(data.citations);
    } catch {
      setResult("Error generating citations.");
    } finally {
      setLoading(false);
    }
  }

  const tools: { id: ActiveTool; label: string; icon: string }[] = [
    { id: "improve", label: "Improve", icon: "✨" },
    { id: "draft", label: "Draft", icon: "📝" },
    { id: "feedback", label: "Feedback", icon: "💬" },
    { id: "plagiarism", label: "Plagiarism", icon: "🔍" },
    { id: "cover", label: "Cover Art", icon: "🎨" },
    { id: "citation", label: "Citations", icon: "📎" },
  ];

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] border border-[#D7DEEE] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <header className="flex items-center justify-between border-b border-[#E4EAF5] bg-[#1F3772] px-10 py-6">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
            Scriptora
          </Link>
          <div className="flex w-[38%] items-center rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-[#1F2A44] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
              Language
            </button>
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
              Light
            </button>
            <button className="rounded-xl bg-[#3B64BA] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2D53A0]">
              Share
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8E1F5] text-sm font-semibold text-[#3B64BA]">
              U
            </div>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-88px)] grid-cols-[220px_1fr_380px] overflow-hidden">

          <aside className="bg-[#1F3772] px-5 py-6 text-white">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:bg-white/10"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">Current Writer</p>
              <p className="mt-1 text-xs text-white/70">workspace active</p>
            </div>
          </aside>

          <section className="overflow-y-auto border-r border-[#E4EAF5] bg-[#F6F8FD] px-5 py-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex-1 rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] shadow-sm">
                Research Paper on AI
              </div>
              <div className="flex gap-3">
                <button className="rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm font-medium text-[#42526B] shadow-sm hover:bg-[#EEF3FC]">
                  Share
                </button>
                <button className="rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm font-medium text-[#42526B] shadow-sm hover:bg-[#EEF3FC]">
                  Download
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#D7DEEE] bg-white shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-3 text-sm text-[#5E6B85]">
                Style • Normal text • B I U
              </div>
              <div className="px-6 py-6">
                <h1 className="text-[42px] font-bold leading-tight text-[#1F2A44]">
                  Artificial Intelligence in Modern Writing
                </h1>
                <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#42526B]">
                  <p>In the modern writing environment, AI has transformed how authors, researchers, and students draft, refine, and organize their work.</p>
                  <p>AI-powered tools support brainstorming, grammar correction, sentence restructuring, summarization, and citation generation, helping writers produce stronger work more efficiently.</p>
                  <p>At the same time, the use of AI in writing raises important questions about ethics, originality, transparency, and the balance between human creativity and automation.</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#E4EAF5] px-5 py-3 text-sm text-[#5E6B85]">
                <div className="flex items-center gap-4">
                  <span>Autosaved</span>
                  <div className="h-2 w-40 rounded-full bg-[#E6EBF7]">
                    <div className="h-2 w-3/4 rounded-full bg-[#59D1D1]" />
                  </div>
                  <span>452 words</span>
                </div>
                <span>Grammar: Good</span>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#D7DEEE] bg-white shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-4">
                <h2 className="text-[22px] font-semibold text-[#1F2A44]">Writing Space</h2>
              </div>
              <div className="px-6 py-6">
                <h3 className="text-[32px] font-bold text-[#1F2A44]">
                  Artificial Intelligence in Modern Writing
                </h3>
                <p className="mt-5 text-[16px] leading-8 text-[#42526B]">
                  Introductions supporting the AI-researching models are impacting the writing environment and enabling authors to produce, revise, and strengthen their work through intelligent tools for clarity, structure, citation, and grammar.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[#E4EAF5] px-5 py-3 text-sm text-[#5E6B85]">
                <div className="flex items-center gap-4">
                  <span>Word</span>
                  <div className="h-2 w-40 rounded-full bg-[#E6EBF7]">
                    <div className="h-2 w-3/4 rounded-full bg-[#59D1D1]" />
                  </div>
                  <span>492 words</span>
                </div>
                <span>Grammar: Good</span>
              </div>
            </div>
          </section>

          <aside className="overflow-y-auto bg-white px-4 py-5">
            <div className="rounded-[24px] border border-[#D7DEEE] bg-[#FBFCFF] shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-4">
                <h2 className="text-[22px] font-semibold text-[#1F2A44]">Writing AI</h2>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 pt-4">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setResult("");
                      setFeedback(null);
                      setPlagiarismResult(null);
                      setCoverImage(null);
                      setCitations(null);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-xs font-medium transition ${
                      activeTool === tool.id
                        ? "border-[#3B64BA] bg-[#3B64BA] text-white"
                        : "border-[#D7DEEE] bg-white text-[#42526B] hover:bg-[#EEF3FC]"
                    }`}
                  >
                    <span className="text-base">{tool.icon}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4 pt-4">

                {(activeTool === "improve" || activeTool === "draft" || activeTool === "feedback" || activeTool === "plagiarism") && (
                  <>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={activeTool === "draft" ? "Enter a topic or prompt to draft..." : "Paste your paragraph or essay here..."}
                      className="min-h-[140px] w-full rounded-2xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]"
                    />
                    <button
                      onClick={
                        activeTool === "improve" ? handleImprove :
                        activeTool === "draft" ? handleDraft :
                        activeTool === "feedback" ? handleFeedback :
                        handlePlagiarism
                      }
                      disabled={loading}
                      className="mt-3 w-full rounded-xl bg-[#3B64BA] py-3 font-semibold text-white transition hover:bg-[#2D53A0] disabled:opacity-60"
                    >
                      {loading ? "Processing..." :
                        activeTool === "improve" ? "Improve Writing" :
                        activeTool === "draft" ? "Generate Draft" :
                        activeTool === "feedback" ? "Get Feedback" :
                        "Check Plagiarism"
                      }
                    </button>

                    {(activeTool === "improve" || activeTool === "draft") && (
                      <div className="mt-4 min-h-[120px] whitespace-pre-wrap rounded-2xl border border-[#D7DEEE] bg-white px-4 py-4 text-sm leading-6 text-[#42526B]">
                        {loading ? "Processing..." : result || "AI response will appear here."}
                      </div>
                    )}

                    {activeTool === "feedback" && feedback && (
                      <div className="mt-4 space-y-3">
                        {(["grammar", "clarity", "structure"] as const).map((cat) =>
                          feedback[cat].length > 0 && (
                            <div key={cat} className="rounded-xl border border-[#D7DEEE] bg-white p-4">
                              <p className="mb-2 text-xs font-bold uppercase text-[#3B64BA]">{cat}</p>
                              {feedback[cat].map((item, i) => (
                                <div key={i} className="mb-2 text-sm text-[#42526B]">
                                  <p className="font-medium text-[#B91C3E]">⚠ {item.issue}</p>
                                  <p>→ {item.suggestion}</p>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                        <div className="rounded-xl border border-[#D7DEEE] bg-[#F0F7FF] p-4 text-sm text-[#1F2A44]">
                          <p className="mb-1 text-xs font-bold uppercase text-[#3B64BA]">Overall</p>
                          {feedback.overall}
                        </div>
                      </div>
                    )}

                    {activeTool === "plagiarism" && plagiarismResult && (
                      <div className="mt-4 space-y-3">
                        <div className={`rounded-xl border p-4 ${
                          plagiarismResult.verdict === "Original" ? "border-green-200 bg-green-50" :
                          plagiarismResult.verdict === "High Similarity" ? "border-red-200 bg-red-50" :
                          "border-yellow-200 bg-yellow-50"
                        }`}>
                          <p className="text-sm font-bold text-[#1F2A44]">{plagiarismResult.verdict}</p>
                          <p className="text-2xl font-bold text-[#3B64BA]">
                            {plagiarismResult.similarityScore}%
                            <span className="text-sm font-normal text-[#5E6B85]"> similarity</span>
                          </p>
                          <p className="mt-1 text-sm text-[#42526B]">{plagiarismResult.notes}</p>
                        </div>
                        {plagiarismResult.flaggedPhrases.length > 0 && (
                          <div className="rounded-xl border border-[#D7DEEE] bg-white p-4">
                            <p className="mb-2 text-xs font-bold uppercase text-[#3B64BA]">Flagged Phrases</p>
                            {plagiarismResult.flaggedPhrases.map((p, i) => (
                              <div key={i} className="mb-2 text-sm">
                                <p className="font-medium text-[#B91C3E]">"{p.phrase}"</p>
                                <p className="text-[#5E6B85]">{p.reason}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {(activeTool === "improve" || activeTool === "draft") && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-[#1F2A44]">Example Prompts</h3>
                        <div className="mt-3 space-y-2">
                          {examplePrompts.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => setInput(prompt)}
                              className="block w-full rounded-2xl border border-[#E4EAF5] bg-white px-4 py-3 text-left text-xs leading-5 text-[#42526B] hover:bg-[#F6F8FD]"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTool === "cover" && (
                  <>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Book title *"
                        value={coverTitle}
                        onChange={(e) => setCoverTitle(e.target.value)}
                        className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]"
                      />
                      <input
                        type="text"
                        placeholder="Genre (e.g. Fantasy, Romance, Thriller)"
                        value={coverGenre}
                        onChange={(e) => setCoverGenre(e.target.value)}
                        className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]"
                      />
                      <textarea
                        placeholder="Brief description of your story..."
                        value={coverDescription}
                        onChange={(e) => setCoverDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]"
                      />
                      <button
                        onClick={handleGenerateCover}
                        disabled={loading || !coverTitle || !coverGenre || !coverDescription}
                        className="w-full rounded-xl bg-[#3B64BA] py-3 font-semibold text-white transition hover:bg-[#2D53A0] disabled:opacity-60"
                      >
                        {loading ? "Generating cover..." : "🎨 Generate Cover"}
                      </button>
                    </div>
                    {coverImage && (
                      <div className="mt-4 text-center">
                        <img src={coverImage} alt="Generated book cover" className="mx-auto h-64 rounded-xl object-cover shadow-md" />
                        <a href={coverImage} download="book-cover.png" className="mt-3 inline-block text-sm font-medium text-[#3B64BA] underline">
                          Download Cover
                        </a>
                      </div>
                    )}
                    {!coverImage && !loading && (
                      <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-[#D7DEEE] bg-[#F8FAFF] text-sm text-[#94A3B8]">
                        Your generated cover will appear here
                      </div>
                    )}
                  </>
                )}

                {activeTool === "citation" && (
                  <>
                    <div className="space-y-3">
                      <select
                        value={citationType}
                        onChange={(e) => setCitationType(e.target.value)}
                        className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]"
                      >
                        <option value="book">Book</option>
                        <option value="article">Journal Article</option>
                        <option value="website">Website</option>
                        <option value="video">Video</option>
                      </select>
                      <input type="text" placeholder="Title *" value={citationTitle} onChange={(e) => setCitationTitle(e.target.value)} className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]" />
                      <input type="text" placeholder="Author(s)" value={citationAuthor} onChange={(e) => setCitationAuthor(e.target.value)} className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]" />
                      <input type="text" placeholder="Year published" value={citationYear} onChange={(e) => setCitationYear(e.target.value)} className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]" />
                      <input type="text" placeholder="URL (optional)" value={citationUrl} onChange={(e) => setCitationUrl(e.target.value)} className="w-full rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] outline-none focus:border-[#3B64BA]" />
                      <button
                        onClick={handleGenerateCitation}
                        disabled={loading || !citationTitle}
                        className="w-full rounded-xl bg-[#3B64BA] py-3 font-semibold text-white transition hover:bg-[#2D53A0] disabled:opacity-60"
                      >
                        {loading ? "Generating..." : "📎 Generate Citations"}
                      </button>
                    </div>
                    {citations && (
                      <div className="mt-4 space-y-3">
                        {(["apa", "mla", "chicago"] as const).map((format) => (
                          <div key={format} className="rounded-xl border border-[#D7DEEE] bg-white p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase text-[#3B64BA]">{format}</p>
                              <button onClick={() => navigator.clipboard.writeText(citations[format])} className="rounded-lg border border-[#D7DEEE] px-2 py-1 text-xs text-[#3B64BA] hover:bg-[#EEF3FC]">
                                Copy
                              </button>
                            </div>
                            <p className="text-sm leading-6 text-[#42526B]">{citations[format]}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {!citations && !loading && (
                      <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#D7DEEE] bg-[#F8FAFF] text-sm text-[#94A3B8]">
                        APA, MLA & Chicago citations will appear here
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}