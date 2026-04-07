"use client";
import Link from "next/link";

import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)] overflow-hidden">
        
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
              Join Community
            </a>
            <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
              Use Writing AI
            </a>
          </nav>
        </header>

        {/* Main Auth Section */}
        <section className="flex min-h-[calc(100vh-120px)] items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[28px] border border-[#D7DEEE] bg-white p-8 shadow-[0_14px_35px_rgba(59,100,186,0.12)]">
            
            {/* Toggle */}
            <div className="mb-8 flex justify-center rounded-2xl bg-[#EEF3FC] p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-[#3B64BA] text-white"
                    : "text-[#3B64BA] hover:bg-[#D8E1F5]"
                }`}
              >
                Log In
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-[#3B64BA] text-white"
                    : "text-[#3B64BA] hover:bg-[#D8E1F5]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Title */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-[#1F2A44]">
                {isLogin ? "Welcome Back" : "Create New Account"}
              </h1>
              <p className="mt-2 text-sm text-[#5E6B85]">
                {isLogin
                  ? "Log in to continue your writing journey."
                  : "Join Scriptora and start writing smarter."}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your country"
                      className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                    Confirm Email
                  </label>
                  <input
                    type="email"
                    placeholder="Confirm your email"
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your zip code"
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                  />
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <a className="cursor-pointer text-sm font-medium text-[#3B64BA] hover:underline">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#E6EBF7] px-4 py-3 font-semibold text-[#3B64BA] transition-all duration-200 hover:bg-[#3B64BA] hover:text-white"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>

            {/* Bottom text */}
            <p className="mt-6 text-center text-sm text-[#6B7690]">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-[#3B64BA] hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}