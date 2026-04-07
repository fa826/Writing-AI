import Image from "next/image";
import Link from "next/link";

export default function ReaderDashboard() {
  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)] overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 border-b border-[#E4EAF5]">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <input
            placeholder="Search..."
            className="w-1/3 rounded-xl border px-4 py-2 text-sm outline-none"
          />

          <div className="flex gap-4">
            <div>🔔</div>
            <div>📚</div>
            <div>👤</div>
          </div>
        </header>

        <div className="px-8 py-8 space-y-10">

          {/* New Releases */}
          <div className="grid grid-cols-3 gap-6">

            {/* Left Books */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                New Releases
              </h2>

              <div className="flex gap-6 mt-4">
                {["Book 1", "Book 2", "Book 3"].map((b, i) => (
                  <div key={i} className="w-40">
                    <div className="h-56 bg-[#E6EBF7] rounded-2xl" />
                    <p className="mt-3 font-medium text-[#1F2A44]">{b}</p>
                    <p className="text-sm text-[#5E6B85]">★★★★☆</p>
                    <button className="mt-2 text-sm text-[#3B64BA]">
                      + Add to List
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Authors */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="font-semibold text-[#1F2A44]">
                Authors to Follow
              </h3>

              {["Luna Grey", "Mark Young", "Jessica Snow"].map((a, i) => (
                <div key={i} className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm font-medium">{a}</p>
                    <p className="text-xs text-[#5E6B85]">★★★★★</p>
                  </div>
                  <button className="text-sm text-[#3B64BA]">
                    Follow
                  </button>
                </div>
              ))}

              <button className="mt-5 w-full bg-[#3B64BA] text-white py-2 rounded-xl">
                Follow
              </button>
            </div>
          </div>

          {/* Trending Stories */}
          <div>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                Trending Stories
              </h2>
              <p className="text-sm text-[#3B64BA]">View All</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i}>
                  <div className="h-48 bg-[#E6EBF7] rounded-2xl" />
                  <p className="mt-2 font-medium">Story Title</p>
                  <p className="text-sm text-[#5E6B85]">★★★★☆</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-6">

            {/* Left */}
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="font-semibold">Trending Stories</h3>

              <div className="flex gap-4 mt-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-36">
                    <div className="h-40 bg-[#E6EBF7] rounded-xl" />
                    <p className="mt-2 text-sm">Story</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="font-semibold">Community Forum</h3>

              {["User 1", "User 2", "User 3"].map((u, i) => (
                <div key={i} className="flex justify-between mt-4">
                  <p>{u}</p>
                  <button className="text-[#3B64BA]">Follow</button>
                </div>
              ))}

              <button className="mt-5 w-full bg-[#3B64BA] text-white py-2 rounded-xl">
                Follow
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-[#1F3772] text-white px-8 py-6 mt-10">
          <div className="flex justify-between">
            <p>Scriptora</p>
            <div className="flex gap-6">
              <p>Home</p>
              <p>About</p>
              <p>Help</p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}