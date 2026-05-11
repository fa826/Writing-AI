import Link from "next/link";

type StoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const workId = id;

  let story: any = null;

  try {
    const res = await fetch(`https://openlibrary.org/works/${workId}.json`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      story = await res.json();
    }
  } catch (error) {
    console.error("Story fetch error:", error);
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-[#1F2A44]">Story not found</h1>
        <Link href="/reader-dashboard" className="mt-4 block text-[#3B64BA]">
          Back to Reader&apos;s Arena
        </Link>
      </main>
    );
  }

  const coverId = story.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const description =
    typeof story.description === "string"
      ? story.description
      : story.description?.value || "No description available.";

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <Link href="/reader-dashboard" className="text-sm">
            Back to Reader&apos;s Arena
          </Link>
        </header>

        <section className="grid gap-8 px-10 py-10 md:grid-cols-[260px_1fr]">
          <div>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={story.title || "Book cover"}
                className="h-[380px] w-full rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="h-[380px] rounded-2xl bg-[#E6EBF7]" />
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#1F2A44]">
              {story.title || "Untitled Book"}
            </h1>

            <p className="mt-3 text-sm text-[#5E6B85]">
              Open Library ID: {workId}
            </p>

            <p className="mt-6 max-w-3xl leading-8 text-[#1F2A44]">
              {description}
            </p>

            <a
                href={`https://openlibrary.org/works/${workId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#3B64BA] px-6 py-3 font-semibold text-white"
            >
                Start Reading
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}