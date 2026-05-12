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

const sidebarItems = [
  "Writer Dashboard",
  "Document Library",
  "Resources List",
  "Citation",
  "Doc History",
  "Plagiarism Check",
];

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function WriterDashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [tasks, setTasks] = useState([
    { text: "Create a new story draft", done: false },
    { text: "Revise your latest chapter", done: false },
    { text: "Prepare one story for publishing", done: false },
  ]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem("scriptora_drafts");
    const savedTasks = localStorage.getItem("scriptora_writer_tasks");

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const totalWords = useMemo(() => {
    return drafts.reduce((sum, draft) => sum + countWords(draft.content), 0);
  }, [drafts]);

  function toggleTask(index: number) {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );

    setTasks(updated);
    localStorage.setItem("scriptora_writer_tasks", JSON.stringify(updated));
  }

  return (
    <main className="h-screen bg-[#10255C] p-4 text-white">
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="text-5xl font-black text-[#6EA2FF]">S</div>
        <h1 className="text-5xl font-semibold tracking-tight">Scriptora</h1>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl grid-cols-[280px_1fr] overflow-hidden rounded-2xl border border-white/20 bg-[#142B68]/80 shadow-2xl max-lg:grid-cols-1">
        <aside className="border-r border-white/10 bg-[#0D1E4B]/80 p-5 max-lg:border-r-0 max-lg:border-b">
          <Link href="/" className="mb-8 flex items-center gap-3 text-2xl font-bold">
            <span className="text-[#6EA2FF]">S</span>
            Scriptora
          </Link>

          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  index === 0
                    ? "bg-[#426DD8] text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">My Projects</p>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#1C397E] px-3 py-3">
              <span className="text-sm font-semibold">{drafts.length} drafts</span>
              <span>›</span>
            </div>
          </div>
        </aside>

        <section className="flex min-h-full flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#18336F]/70 px-7 py-5 max-md:flex-col max-md:items-stretch">
            <input
              placeholder="Search documents..."
              className="w-[55%] rounded-xl border border-white/20 bg-[#10275F] px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 max-md:w-full"
            />

            <div className="flex items-center gap-5 text-xl">
              <Link href="/notifications">🔔</Link>
              <Link href="/my-library">📚</Link>
              <Link href="/profile">👤</Link>
            </div>
          </header>

          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_320px] gap-5 p-6 max-lg:grid-cols-1 max-sm:p-4">
            <div className="space-y-5">
              <section className="rounded-2xl bg-white/5 p-6">
                <h2 className="text-4xl font-bold">Welcome back!</h2>
                <p className="mt-2 text-xl text-white/70">
                  Ready to write something great?
                </p>

                <div className="mt-6 flex gap-4">
                  <Link
                    href="/write"
                    className="rounded-xl bg-[#6EA2FF] px-5 py-3 font-semibold text-[#081B43]"
                  >
                    + New Document
                  </Link>

                  <button className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white">
                    Open Library
                  </button>
                </div>
              </section>

              <section className="rounded-2xl bg-white/5 p-6">
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
                      <div key={draft.id}>
                        <div className="flex h-44 items-end rounded-xl bg-gradient-to-br from-[#365FAC] to-[#081B43] p-4 shadow-lg">
                          <p className="text-xl font-bold leading-tight">
                            {draft.title}
                          </p>
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          {countWords(draft.content)} words
                        </p>

                        <p className="text-xs text-white/50">
                          Updated {new Date(draft.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-2xl font-semibold">Writing Tasks</h3>

                <div className="mt-4 space-y-3">
                  {tasks.map((task, index) => (
                    <label
                      key={task.text}
                      className="flex items-center gap-3 border-b border-white/10 pb-3 text-white/80"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(index)}
                        className="h-4 w-4"
                      />
                      <span className={task.done ? "line-through text-white/40" : ""}>
                        {task.text}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-2xl font-semibold">Writing Stats</h3>

                <div className="mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[#6EA2FF]">
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
                    <span>{tasks.filter((task) => task.done).length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>Active Writer</span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-xl font-semibold">Writing Resources</h3>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {["Plot", "Grammar", "Characters", "Citations"].map((resource) => (
                    <button
                      key={resource}
                      className="rounded-xl border border-white/10 bg-[#1C397E] px-3 py-6 text-sm font-semibold hover:bg-[#426DD8]"
                    >
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