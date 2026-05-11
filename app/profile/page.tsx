"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  is_reader?: boolean;
  is_writer?: boolean;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("scriptora_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#1F2A44]">Profile</h1>
        <p className="text-[#5E6B85]">No user logged in.</p>

        <Link href="/" className="mt-4 block text-[#3B64BA]">
          Go back to login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold text-[#1F2A44]">Profile</h1>

      <div className="max-w-md rounded-xl border bg-[#F8FAFF] p-6">
        <p className="text-lg font-medium text-[#1F2A44]">
          Name: {user.first_name} {user.last_name}
        </p>

        <p className="mt-2 text-[#5E6B85]">
          Username: {user.username}
        </p>

        <p className="mt-2 text-[#5E6B85]">
          Email: {user.email}
        </p>

        <p className="mt-2 text-[#5E6B85]">
          Reader Access: {user.is_reader ? "Yes" : "No"}
        </p>

        <p className="mt-2 text-[#5E6B85]">
          Writer Access: {user.is_writer ? "Yes" : "No"}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("scriptora_user");
            window.location.href = "/";
          }}
          className="mt-6 rounded-xl bg-[#3B64BA] px-4 py-3 font-semibold text-white"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}