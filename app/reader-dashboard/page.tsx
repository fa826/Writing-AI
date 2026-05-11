"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Story = {
  story_id: string | number;
  title: string;
  author?: string;
  year?: number | null;
  cover?: string | null;
  rating?: string;
  views?: number;
  current_part?: number;
  source?: "open-library" | "openalex" | "scriptora" | "google-books";
  type?: "book" | "article" | "original";
};

type Author = {
  author_id: number;
  name: string;
  rating?: string;
};

type ForumUser = {
  user_id: number;
  name: string;
};

function StoryRow({
  title,
  stories,
}: {
  title: string;
  stories: Story[];
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-[#1F2A44]">{title}</h2>
        <p className="text-sm text-[#3B64BA]">View All</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-6">
        {stories.map((story) => {
          const href =
            story.type === "article"
              ? `/article/${story.story_id}`
              : `/story/${story.story_id}`;

          return (
            <Link key={story.story_id} href={href}>
              <div>
                {story.cover ? (
                  <img
                    src={story.cover}
                    alt={story.title}
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-2xl bg-[#E6EBF7] p-4 text-center text-sm font-medium text-[#1F2A44]">
                    {story.title}
                  </div>
                )}

                <p className="mt-2 font-medium text-[#1F2A44]">
                  {story.title}
                </p>

                <p className="text-sm text-[#5E6B85]">
                  {story.author || story.rating || "★★★★☆"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ReaderDashboard() {
  const [newReleases, setNewReleases] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [continueReading, setContinueReading] = useState<Story[]>([]);
  const [romanceBooks, setRomanceBooks] = useState<Story[]>([]);
  const [fantasyBooks, setFantasyBooks] = useState<Story[]>([]);
  const [academicArticles, setAcademicArticles] = useState<Story[]>([]);
  const [scriptoraOriginals, setScriptoraOriginals] = useState<Story[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [forumUsers, setForumUsers] = useState<ForumUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [googleBooks, setGoogleBooks] = useState<Story[]>([]);


  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/auth/reader-dashboard");

        if (!res.ok) {
          throw new Error("Failed to load dashboard.");
        }

        const data = await res.json();

        setNewReleases(data.newReleases || []);
        setTrendingStories(data.trendingStories || []);
        setContinueReading(data.continueReading || []);
        setRomanceBooks(data.romanceBooks || []);
        setFantasyBooks(data.fantasyBooks || []);
        setAcademicArticles(data.academicArticles || []);
        setScriptoraOriginals(data.scriptoraOriginals || []);
        setAuthors(data.authors || []);
        setForumUsers(data.forumUsers || []);
        setGoogleBooks(data.googleBooks || []);
      } catch (error) {
        console.error("Reader dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const filteredNewReleases = useMemo(() => {
    return newReleases.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newReleases, searchTerm]);

  const filteredTrendingStories = useMemo(() => {
    return trendingStories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trendingStories, searchTerm]);

  async function addToList(storyId: string | number) {
    try {
      await fetch("/api/user/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId }),
      });

      alert("Added to your list.");
    } catch (error) {
      console.error("Add to list error:", error);
      alert("Could not add story to your list.");
    }
  }

  async function followAuthor(authorId: number) {
    try {
      await fetch("/api/follow/author", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorId }),
      });

      alert("Author followed.");
    } catch (error) {
      console.error("Follow author error:", error);
      alert("Could not follow author.");
    }
  }

  async function followUser(userId: number) {
    try {
      await fetch("/api/follow/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      alert("User followed.");
    } catch (error) {
      console.error("Follow user error:", error);
      alert("Could not follow user.");
    }
  }

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between border-b border-[#E4EAF5] bg-[#1F3772] px-10 py-6">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
            Scriptora
          </Link>

          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 rounded-xl border px-4 py-2 text-sm outline-none"
          />

          <div className="flex gap-4">
            <Link href="/notifications" title="Notifications">🔔</Link>
            <Link href="/my-library" title="My Library">📚</Link>
            <Link href="/profile" title="Profile">👤</Link>
          </div>
        </header>

        <div className="space-y-10 px-8 py-8">
          {loading && (
            <p className="text-sm text-[#5E6B85]">Loading dashboard...</p>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                New Releases
              </h2>

              <div className="mt-4 flex gap-6">
                {filteredNewReleases.map((story) => (
                  <div key={story.story_id} className="w-40">
                    <Link href={`/story/${story.story_id}`}>
                      {story.cover ? (
                        <img
                          src={story.cover}
                          alt={story.title}
                          className="h-56 w-full rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-56 rounded-2xl bg-[#E6EBF7]" />
                      )}
                    </Link>

                    <p className="mt-3 font-medium text-[#1F2A44]">
                      {story.title}
                    </p>

                    <p className="text-sm text-[#5E6B85]">
                      {story.author || story.rating || "★★★★☆"}
                    </p>

                    <button
                      type="button"
                      onClick={() => addToList(story.story_id)}
                      className="mt-2 text-sm text-[#3B64BA]"
                    >
                      + Add to List
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-[#1F2A44]">
                Authors to Follow
              </h3>

              {authors.map((author) => (
                <div
                  key={author.author_id}
                  className="mt-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{author.name}</p>
                    <p className="text-xs text-[#5E6B85]">
                      {author.rating || "★★★★★"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => followAuthor(author.author_id)}
                    className="text-sm text-[#3B64BA]"
                  >
                    Follow
                  </button>
                </div>
              ))}

              <button className="mt-5 w-full rounded-xl bg-[#3B64BA] py-2 text-white">
                Follow
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                Trending Stories
              </h2>
              <Link href="/stories/trending" className="text-sm text-[#3B64BA]">
                View All
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-6">
              {filteredTrendingStories.map((story) => (
                <Link key={story.story_id} href={`/story/${story.story_id}`}>
                  <div>
                    {story.cover ? (
                      <img
                        src={story.cover}
                        alt={story.title}
                        className="h-48 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="h-48 rounded-2xl bg-[#E6EBF7]" />
                    )}

                    <p className="mt-2 font-medium text-[#1F2A44]">
                      {story.title}
                    </p>

                    <p className="text-sm text-[#5E6B85]">
                      {story.author || story.rating || "★★★★☆"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <StoryRow title="Romance Books" stories={romanceBooks} />
          <StoryRow title="Fantasy Books" stories={fantasyBooks} />
          <StoryRow title="Academic Articles" stories={academicArticles} />
          <StoryRow title="Scriptora Originals" stories={scriptoraOriginals} />
          <StoryRow title="Popular Books" stories={googleBooks}/>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Continue Reading</h3>

              <div className="mt-4 flex gap-4">
                {continueReading.map((story) => (
                  <Link
                    key={story.story_id}
                    href={`/story/${story.story_id}`}
                    className="w-36"
                  >
                    {story.cover ? (
                      <img
                        src={story.cover}
                        alt={story.title}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-40 rounded-xl bg-[#E6EBF7]" />
                    )}

                    <p className="mt-2 text-sm text-[#1F2A44]">
                      {story.title}
                    </p>

                    <p className="text-xs text-[#5E6B85]">
                      Continue Part {story.current_part || 1}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Community Forum</h3>

              {forumUsers.map((user) => (
                <div key={user.user_id} className="mt-4 flex justify-between">
                  <p>{user.name}</p>
                  <button
                    type="button"
                    onClick={() => followUser(user.user_id)}
                    className="text-[#3B64BA]"
                  >
                    Follow
                  </button>
                </div>
              ))}

              <button className="mt-5 w-full rounded-xl bg-[#3B64BA] py-2 text-white">
                Follow
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-10 bg-[#1F3772] px-8 py-6 text-white">
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