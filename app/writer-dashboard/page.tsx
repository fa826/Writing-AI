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

type DropdownType = "notifications" | "library" | "messages" | "profile" | null;

const sidebarItems = [
  { label: "Writer Dashboard", icon: "▣" },
  { label: "Document Library", icon: "▤" },
  { label: "Resources List", icon: "▧" },
  { label: "Citation", icon: "♜" },
  { label: "Doc History", icon: "◉" },
  { label: "Plagiarism Check", icon: "◆" },
];

function countWords(text?: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function WriterDashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [tasks, setTasks] = useState([
    { text: "Create a new story draft", done: false },
    { text: "Revise your latest chapter", done: false },
    { text: "Prepare one story for publishing", done: false },
    { text: "Edit chapter for grammar errors", done: false },
  ]);
  const [showProjectsPopup, setShowProjectsPopup] = useState(false);

  useEffect(() => {
    const savedDrafts = localStorage.getItem("scriptora_drafts");
    const savedTasks = localStorage.getItem("scriptora_writer_tasks");

    if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    function handleClickOutside() {
      setActiveDropdown(null);
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const totalWords = useMemo(() => {
    return drafts.reduce((sum, draft) => sum + countWords(draft.content), 0);
  }, [drafts]);

  const completedTasks = tasks.filter((task) => task.done).length;

  const notifications = [
    `${drafts.length} draft${drafts.length === 1 ? "" : "s"} saved locally.`,
    `${completedTasks} writing task${completedTasks === 1 ? "" : "s"} completed.`,
    totalWords > 0 ? `${totalWords} total words written.` : "Start writing your first draft.",
  ];

  const messages = ["No new messages yet.", "Writer community chat coming soon."];

  const libraryItems = drafts.slice(0, 3).map((draft) => draft.title);

  function toggleTask(index: number) {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );

    setTasks(updated);
    localStorage.setItem("scriptora_writer_tasks", JSON.stringify(updated));
  }

  function toggleDropdown(type: DropdownType) {
    setActiveDropdown((current) => (current === type ? null : type));
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#071A46] bg-[radial-gradient(circle_at_top,#5D80E6_0%,#183A83_35%,#071A46_100%)] p-4 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_35%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-32px)] w-full max-w-7xl grid-cols-[280px_1fr] overflow-hidden rounded-2xl border border-white/20 bg-[#10255C]/70 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md max-lg:grid-cols-1">
        <aside className="border-r border-white/10 bg-[#071A46]/50 p-5 max-lg:border-r-0 max-lg:border-b">
          <Link href="/" className="mb-8 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6EA2FF] text-xl font-black text-[#071A46] shadow-lg">
              S
            </span>
            <span>Scriptora</span>
          </Link>

          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  index === 0
                    ? "bg-[#4D79E6] text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg text-[#8FB4FF]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">My Projects</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowProjectsPopup((current) => !current);
              }}
              className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#1C397E] px-3 py-3"
            >
              <span className="text-sm font-semibold">{drafts.length} drafts</span>
              <span>›</span>
            </button>
            {showProjectsPopup && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-full top-8 z-40 ml-3 w-72 rounded-2xl border border-white/15 bg-[#0D1E4B] p-4 shadow-2xl"
              >
                <h3 className="font-semibold">My Projects</h3>
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {drafts.length === 0 ? (
                    <p className="text-sm text-white/50">No drafts yet.</p>
                  ) : (
                    drafts.map((draft) => (
                      <Link
                        key={draft.id}
                        href={`/write?id=${draft.id}`}
                        className="block rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        {draft.title}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>


          <div className="mt-10 rounded-xl border border-white/10 bg-[#4D79E6]/30 p-4">
            <p className="text-xs text-white/60">Current Space</p>
            <p className="mt-1 text-lg font-bold">Writer Dashboard</p>
          </div>
        </aside>

        <section className="flex min-h-full flex-col">
          <header className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-[#18336F]/50 px-7 py-5 max-md:flex-col max-md:items-stretch">
            <input
              placeholder="Search documents..."
              className="w-[55%] rounded-xl border border-white/20 bg-[#10275F]/80 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 max-md:w-full"
            />

            <div className="flex items-center gap-5 text-[#B8CCFF]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("notifications");
                }}
                className="relative rounded-xl p-2 hover:bg-white/10"
              >
                <IconBell />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("library");
                }}
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <IconBook />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("messages");
                }}
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <IconMessage />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("profile");
                }}
                className="h-11 w-11 overflow-hidden rounded-full border-2 border-white/30 bg-gradient-to-br from-[#E6ECFF] to-[#6EA2FF]"
              >
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#10255C]">
                  FQ
                </div>
              </button>
            </div>

            {activeDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-7 top-[76px] z-30 w-72 rounded-2xl border border-white/15 bg-[#0D1E4B] p-4 shadow-2xl"
              >
                {activeDropdown === "notifications" && (
                  <>
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="mt-3 space-y-3 text-sm text-white/70">
                      {notifications.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </>
                )}

                {activeDropdown === "library" && (
                  <>
                    <h3 className="font-semibold">Recent Drafts</h3>
                    <div className="mt-3 space-y-3 text-sm text-white/70">
                      {libraryItems.length === 0 ? (
                        <p>No drafts saved yet.</p>
                      ) : (
                        libraryItems.map((item) => <p key={item}>{item}</p>)
                      )}
                    </div>
                  </>
                )}

                {activeDropdown === "messages" && (
                  <>
                    <h3 className="font-semibold">Messages</h3>
                    <div className="mt-3 space-y-3 text-sm text-white/70">
                      {messages.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </>
                )}

                {activeDropdown === "profile" && (
                  <>
                    <h3 className="font-semibold">Profile</h3>
                    <div className="mt-3 space-y-3 text-sm text-white/70">
                      <Link href="/profile" className="block hover:text-white">
                        View Profile
                      </Link>
                      <Link href="/" className="block hover:text-white">
                        Back Home
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </header>

          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_320px] gap-5 p-6 max-lg:grid-cols-1 max-sm:p-4">
            <div className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h2 className="text-4xl font-bold">Welcome back!</h2>
                <p className="mt-2 text-xl text-white/70">Ready to write something great?</p>

                <div className="mt-6 flex gap-4">
                  <Link href="/write/setup" className="rounded-xl bg-[#6EA2FF] px-5 py-3 font-semibold text-[#081B43]">
                    + New Document
                  </Link>

                  <button className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white">
                    Open Library
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">Recent Documents</h3>
                  <button className="text-sm text-white/60">View All</button>
                </div>

                {drafts.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-white/20 p-8 text-center text-white/60">
                    No drafts yet. Click “New Document” to start writing.
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
                    {drafts.slice(0, 3).map((draft) => (
                      <Link key={draft.id} href={`/write?id=${draft.id}`}>
                        <div>
                          <div className="flex h-44 items-end rounded-xl bg-gradient-to-br from-[#4F7BEA] to-[#081B43] p-4 shadow-lg transition hover:scale-[1.02]">
                            <p className="text-xl font-bold leading-tight">{draft.title}</p>
                          </div>

                          <p className="mt-3 text-sm font-semibold">
                            {countWords(draft.content)} words
                          </p>

                          <p className="text-xs text-white/50">
                            Updated {new Date(draft.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-2xl font-semibold">Writing Tasks</h3>

                <div className="mt-4 space-y-3">
                  {tasks.map((task, index) => (
                    <label key={task.text} className="flex items-center gap-3 border-b border-white/10 pb-3 text-white/80">
                      <input type="checkbox" checked={task.done} onChange={() => toggleTask(index)} className="h-4 w-4" />
                      <span className={task.done ? "text-white/40 line-through" : ""}>
                        {task.text}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-2xl font-semibold">Writing Stats</h3>

                <div className="mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[#6EA2FF] shadow-[0_0_35px_rgba(110,162,255,0.35)]">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{totalWords}</p>
                    <p className="text-sm text-white/60">total words</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Total Drafts</span>
                    <span>{drafts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Tasks</span>
                    <span>{completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>Active Writer</span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h3 className="text-xl font-semibold">Writing Resources</h3>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {["Plot", "Grammar", "Characters", "Citations"].map((resource) => (
                    <button key={resource} className="rounded-xl border border-white/10 bg-[#1C397E]/80 px-3 py-6 text-sm font-semibold hover:bg-[#426DD8]">
                      {resource}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}