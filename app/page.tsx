"use client";

import Link from "next/link";
import { useState } from "react";

const services = [
  { name: "Editing", icon: "✏️" },
  { name: "Proofreading", icon: "🖊️" },
  { name: "Formatting", icon: "📋" },
  { name: "Book Cover Design", icon: "📚" },
  { name: "Ghostwriting", icon: "📖" },
  { name: "Translation", icon: "🌐" },
  { name: "Captioning", icon: "💬" },
  { name: "Academic Research", icon: "🧠" },
];

const plans = [
  {
    name: "Basic Plan",
    featured: false,
    points: ["Basic writing tools", "Limited AI support", "Community access"],
  },
  {
    name: "Premium Plan",
    featured: true,
    points: ["Advanced AI writing help", "Citation support", "Priority features"],
  },
  {
    name: "Business Plan",
    featured: false,
    points: ["Team collaboration", "Extended storage", "Professional support"],
  },
];

export default function HomePage() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginTarget, setLoginTarget] = useState<"reader" | "writer" | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  async function handleLogin() {
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      alert("Please enter your email/username and password.");
      return;
    }

    if (!loginTarget) {
      alert("Please choose Reader's Arena or Writer's Board.");
      return;
    }

    try {
      setLoginLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("scriptora_user", JSON.stringify(data.user));

      if (loginTarget === "reader") {
        if (!data.user.is_reader) {
          alert("You do not have access to Reader's Arena.");
          return;
        }

        window.location.href = "/reader-dashboard";
        return;
      }

      if (loginTarget === "writer") {
        if (!data.user.is_writer) {
          alert("You do not have access to Writer's Board.");
          return;
        }

        window.location.href = "/writer-dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white p-4 text-white">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
              Join Community
            </a>

            <button
              type="button"
              onClick={() => {
                setLoginTarget("writer");
                setShowLoginPopup(true);
              }}
              className="text-white/90 transition hover:text-[#C7D7FF]"
            >
              Writers&apos; Board
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginTarget("reader");
                setShowLoginPopup(true);
              }}
              className="text-white/90 transition hover:text-[#C7D7FF]"
            >
              Readers&apos; Arena
            </button>

            <Link
              href="/auth"
              className="rounded-xl bg-[#3B64BA] px-4 py-2 font-medium text-white transition hover:bg-[#2D53A0]"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-10 px-10 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-[#1F2A44]">
              Empower Your Writing
              <br />
              with AI Assistance
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-black">
              Build your writing, research, and publishing workflow in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="#"
                className="rounded-xl border border-[#B8C7E8] bg-[#E6EBF7] px-6 py-3 font-semibold text-[#3B64BA] shadow-sm transition hover:bg-[#3B64BA] hover:text-white"
              >
                Contact Us
              </Link>

              <button className="rounded-xl border border-[#B8C7E8] bg-[#E6EBF7] px-6 py-3 font-semibold text-[#3B64BA] shadow-sm transition hover:bg-[#3B64BA] hover:text-white">
                Learn More
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#D7DEEE] bg-white p-6 shadow-[0_14px_35px_rgba(59,100,186,0.12)]">
            <div className="mb-4 h-4 w-32 rounded bg-[#9EB7EA]" />
            <div className="mb-3 h-4 w-48 rounded bg-[#C9D7F3]" />
            <div className="mb-6 h-4 w-40 rounded bg-[#C9D7F3]" />
            <div className="mb-6 h-28 rounded-xl bg-[#EEF3FC]" />

            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 rounded-xl bg-[#EEF3FC]" />
              <div className="h-20 rounded-xl bg-[#EEF3FC]" />
            </div>
          </div>
        </section>

        <section className="bg-[#F4F7FD] px-10 py-8">
          <div className="flex flex-wrap gap-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-3 rounded-2xl border border-[#D7DEEE] bg-white px-5 py-4 text-sm font-semibold text-black shadow-sm"
              >
                <span className="text-lg">{service.icon}</span>
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-10 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold text-[#1F2A44]">
              Subscription
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="group rounded-[28px] border border-[#D7DEEE] bg-white p-7 text-[#1F2A44] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#3B64BA] hover:text-white hover:shadow-[0_20px_40px_rgba(59,100,186,0.25)]"
              >
                <h3 className="text-3xl font-semibold">{plan.name}</h3>

                <ul className="mt-6 space-y-3 text-sm leading-6 text-black group-hover:text-white/90">
                  {plan.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>

                <Link
                  href="/auth"
                  className="mt-8 block w-full rounded-xl bg-[#E6EBF7] px-4 py-3 text-center font-semibold text-[#3B64BA] transition-all duration-200 group-hover:bg-white group-hover:text-[#3B64BA]"
                >
                  Sign Up
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-center text-xl font-bold text-[#1F2A44]">
              Log In
            </h2>

            <p className="mt-2 text-center text-sm text-[#6B7690]">
              Logging into{" "}
              {loginTarget === "reader" ? "Reader's Arena" : "Writer's Board"}
            </p>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Email or Username"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-black outline-none focus:border-[#3B64BA]"
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-black outline-none focus:border-[#3B64BA]"
              />

              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="cursor-pointer text-sm font-medium text-[#3B64BA] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLoginPopup(false);
                  setLoginPassword("");
                }}
                className="w-1/2 rounded-xl bg-[#E6EBF7] px-4 py-3 font-semibold text-[#3B64BA]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-1/2 rounded-xl bg-[#3B64BA] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                {loginLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}