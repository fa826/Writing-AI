import Image from "next/image";
import Link from "next/link";

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
    points: [
      "Basic writing tools",
      "Limited AI support",
      "Community access",
    ],
  },
  {
    name: "Premium Plan",
    featured: true,
    points: [
      "Advanced AI writing help",
      "Citation support",
      "Priority features",
    ],
  },
  {
    name: "Business Plan",
    featured: false,
    points: [
      "Team collaboration",
      "Extended storage",
      "Professional support",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-white p-4">
      {/* Outer wrapper card */}
      <div className="min-h-[calc(100vh-32px)] rounded-[32px] overflow-hidden bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <div className="overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          
          {/* Navbar */}
          <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              Scriptora
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
                Join Community
              </a>
              <Link href="/writer-dashboard" className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
                Writer's Board
              </Link>
              
              <Link href="/reader-dashboard" className="hover:text-blue-500">
                Reader's Arena
              </Link>

              <Link href="/auth" className="rounded-xl bg-[#3B64BA] px-4 py-2 font-medium text-white transition hover:bg-[#2D53A0]">
                  Log in
              </Link>
              
            </nav>
          </header>

          {/* Main Section */}
          <section className="grid items-center gap-10 px-10 py-16 md:grid-cols-2">
            {/* LEFT */}
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
                <button className="rounded-xl border border-[#B8C7E8] bg-[#E6EBF7] px-6 py-3 font-semibold text-[#3B64BA] shadow-sm transition hover:bg-[#3B64BA] hover:text-white">
                  Get Started
                </button>

                <button className="rounded-xl border border-[#B8C7E8] bg-[#E6EBF7] px-6 py-3 font-semibold text-[#3B64BA] shadow-sm transition hover:bg-[#3B64BA] hover:text-white">
                  Learn More
                </button>
              </div>
            </div>

            {/* RIGHT MOCK UI */}
            <div className="rounded-3xl border border-[#D7DEEE] bg-white p-6 shadow-[0_14px_35px_rgba(59,100,186,0.12)]">
              <div className="h-4 w-32 rounded bg-[#9EB7EA] mb-4"></div>
              <div className="h-4 w-48 rounded bg-[#C9D7F3] mb-3"></div>
              <div className="h-4 w-40 rounded bg-[#C9D7F3] mb-6"></div>

              <div className="mb-6 h-28 rounded-xl bg-[#EEF3FC]"></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded-xl bg-[#EEF3FC]"></div>
                <div className="h-20 rounded-xl bg-[#EEF3FC]"></div>
              </div>
            </div>
          </section>

          {/* Services */}
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

          {/* Subscription */}
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
                  className="group rounded-[28px] border border-[#D7DEEE] bg-white p-7 text-[#1F2A44] shadow-sm transition-all duration-300 hover:bg-[#3B64BA] hover:text-white hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,100,186,0.25)]"
                >
                  {/* Title */}
                  <h3 className="text-3xl font-semibold">{plan.name}</h3>

                  {/* Points */}
                  <ul
                    className="mt-6 space-y-3 text-sm leading-6  text-black group-hover:text-white/90"
                  >
                    {plan.points.map((point) => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    className="mt-8 w-full rounded-xl bg-[#E6EBF7] px-4 py-3 font-semibold text-[#3B64BA] transition-all duration-200 group-hover:bg-white group-hover:text-[#3B64BA]">
                    Sign Up
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

console.log(process.env.DB_HOST);