import Link from "next/link";

const sidebarItems = [
  "Document Library",
  "Resources List",
  "Citations",
  "Doc History",
  "Plagiarism Check",
  "Notes",
  "Publish",
];

const prompts = [
  "Explain the ethical concerns of AI in writing.",
  "List key milestones in the history of artificial intelligence.",
  'Improve the sentence: "The report is written in a concise manner and is very informative".',
  "Provide counterarguments against the use of AI in writing.",
];

export default function WriterDashboardPage() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] border border-[#D7DEEE] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 border-b border-[#E4EAF5]">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              Scriptora
            </Link>
          </div>

          <div className="flex w-[38%] items-center rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-[#1F2A44] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-[#EEF3FC]">
              Language
            </button>
            <button className="rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-[#EEF3FC]">
              Light
            </button>
            <button className="rounded-xl bg-[#3B64BA] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2D53A0]">
              Share
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D8E1F5] text-sm text-[#3B64BA]">
              U
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid min-h-[calc(100vh-88px)] grid-cols-[240px_1fr_300px]">
          {/* Sidebar */}
          <aside className="bg-[#1F3772] px-5 py-6 text-white">
            <div className="space-y-3">
              {sidebarItems.map((item, index) => (
                <button
                  key={item}
                  className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition">
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium">Current Writer</p>
                <p className="mt-1 text-xs text-white/70">workspace active</p>
              </div>
            </div>
          </aside>

          {/* Center Panel */}
          <section className="border-r border-[#E4EAF5] bg-[#F6F8FD] px-5 py-5">
            {/* Toolbar Row */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="flex-1 rounded-xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#1F2A44] shadow-sm">
                  Research Paper on AI
                </div>
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

            {/* Editor Card */}
            <div className="rounded-[24px] border border-[#D7DEEE] bg-white shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-3 text-sm text-[#5E6B85]">
                Style • Normal text • B I U
              </div>

              <div className="px-6 py-6">
                <h1 className="text-[42px] font-bold leading-tight text-[#1F2A44]">
                  Artificial Intelligence in Modern Writing
                </h1>

                <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#42526B]">
                  <p>
                    In the modern writing environment, AI has transformed how
                    authors, researchers, and students draft, refine, and
                    organize their work.
                  </p>
                  <p>
                    AI-powered tools support brainstorming, grammar correction,
                    sentence restructuring, summarization, and citation
                    generation, helping writers produce stronger work more
                    efficiently.
                  </p>
                  <p>
                    At the same time, the use of AI in writing raises important
                    questions about ethics, originality, transparency, and the
                    balance between human creativity and automation.
                  </p>
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

            {/* Writing Space Preview */}
            <div className="mt-5 rounded-[24px] border border-[#D7DEEE] bg-white shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-4">
                <h2 className="text-[22px] font-semibold text-[#1F2A44]">
                  Writing Space
                </h2>
              </div>

              <div className="px-6 py-6">
                <h3 className="text-[32px] font-bold text-[#1F2A44]">
                  Artificial Intelligence in Modern Writing
                </h3>

                <p className="mt-5 text-[16px] leading-8 text-[#42526B]">
                  Introductions supporting the AI-researching models are
                  impacting the writing environment and enabling authors to
                  produce, revise, and strengthen their work through intelligent
                  tools for clarity, structure, citation, and grammar.
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

          {/* Right AI Panel */}
          <aside className="bg-white px-4 py-5">
            <div className="rounded-[24px] border border-[#D7DEEE] bg-[#FBFCFF] shadow-sm">
              <div className="border-b border-[#E4EAF5] px-5 py-4">
                <h2 className="text-[24px] font-semibold text-[#1F2A44]">
                  Writing AI
                </h2>
              </div>

              <div className="px-4 py-4">
                <div className="rounded-2xl border border-[#D7DEEE] bg-white px-4 py-3 text-sm text-[#5E6B85]">
                  How can I help you write today?
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-[#1F2A44]">
                    Example Prompts
                  </h3>

                  <div className="mt-3 space-y-3">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt}
                        className="rounded-2xl border border-[#E4EAF5] bg-white px-4 py-4 text-sm leading-6 text-[#42526B]"
                      >
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>

                <button className="mt-5 w-full rounded-xl bg-[#3B64BA] px-4 py-3 font-semibold text-white transition hover:bg-[#2D53A0]">
                  Send
                </button>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-[#1F2A44]">
                    Quick Actions
                  </h3>

                  <div className="mt-3 space-y-3 text-sm text-[#42526B]">
                    <div className="rounded-xl bg-[#F6F8FD] px-4 py-3">
                      Fix grammar issues
                    </div>
                    <div className="rounded-xl bg-[#F6F8FD] px-4 py-3">
                      Check sentence structure
                    </div>
                    <div className="rounded-xl bg-[#F6F8FD] px-4 py-3">
                      Generate citation
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-xl bg-[#3B64BA] px-4 py-3 font-semibold text-white transition hover:bg-[#2D53A0]">
                  Send
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}