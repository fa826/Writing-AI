"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const types = ["Story", "Academic", "Article", "Poetry"];

export default function SetupPage() {
  const router = useRouter();
  const [type, setType] = useState("");

  function handleContinue() {
    if (!type) return alert("Select a type");

    const id = crypto.randomUUID();

    localStorage.setItem(
      "scriptora_setup",
      JSON.stringify({ type })
    );

    router.push(`/write?id=${id}`);
  }

  return (
    <main className="min-h-screen bg-[#071A46] flex items-center justify-center text-white">
      <div className="w-full max-w-xl bg-[#10255C] p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">What are you writing?</h1>

        <div className="space-y-3">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`w-full p-4 rounded-xl text-left ${
                type === t ? "bg-[#6EA2FF] text-black" : "bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="mt-6 w-full bg-[#6EA2FF] py-3 rounded-xl font-bold text-black"
        >
          Continue
        </button>
      </div>
    </main>
  );
}