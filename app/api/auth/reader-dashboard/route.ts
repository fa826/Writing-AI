import { NextResponse } from "next/server";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;
};

type OpenAlexWork = {
  id?: string;
  display_name?: string;
  publication_year?: number;
  cited_by_count?: number;
  authorships?: {
    author?: {
      display_name?: string;
    };
  }[];
};

function coverUrl(coverId?: number) {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

function formatRating(rating?: number) {
  if (!rating) return "★★★★☆";

  const rounded = Math.round(rating);

  return (
    "★".repeat(Math.min(rounded, 5)) +
    "☆".repeat(Math.max(5 - rounded, 0))
  );
}

function mapBook(doc: OpenLibraryDoc, index: number) {
  const id = doc.key?.replace("/works/", "") || String(index + 1);

  return {
    story_id: id,
    title: doc.title || "Untitled Book",
    author: doc.author_name?.[0] || "Unknown Author",
    year: doc.first_publish_year || null,
    cover: coverUrl(doc.cover_i),
    rating: formatRating(doc.ratings_average),
    views:
      (doc.want_to_read_count || 0) +
      (doc.currently_reading_count || 0) +
      (doc.already_read_count || 0),
    source: "open-library",
    type: "book",
  };
}

function mapArticle(work: OpenAlexWork, index: number) {
  const id = work.id?.split("/").pop() || String(index + 1);

  return {
    story_id: id,
    title: work.display_name || "Untitled Article",
    author: work.authorships?.[0]?.author?.display_name || "Unknown Author",
    year: work.publication_year || null,
    cover: null,
    rating: "Article",
    views: work.cited_by_count || 0,
    source: "openalex",
    type: "article",
  };
}

async function fetchOpenLibraryBooks(query: string, limit = 8) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}&language=eng&limit=${limit}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.docs || [])
    .filter((book: OpenLibraryDoc) => book.cover_i && book.title)
    .slice(0, limit)
    .map(mapBook);
}

async function fetchOpenAlexArticles(query: string, limit = 4) {
  const res = await fetch(
    `https://api.openalex.org/works?search=${encodeURIComponent(
      query
    )}&per-page=${limit}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.results || []).slice(0, limit).map(mapArticle);
}

async function fetchGoogleBooks(query: string, limit = 6) {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=${limit}`
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.items || []).map((item: any, index: number) => ({
    story_id: item.id,
    title: item.volumeInfo?.title || "Untitled Book",
    author: item.volumeInfo?.authors?.[0] || "Unknown Author",
    year: item.volumeInfo?.publishedDate || null,
    cover: item.volumeInfo?.imageLinks?.thumbnail || null,
    rating: item.volumeInfo?.averageRating
      ? "★".repeat(Math.round(item.volumeInfo.averageRating)) +
        "☆".repeat(5 - Math.round(item.volumeInfo.averageRating))
      : "★★★★☆",
    views: item.volumeInfo?.ratingsCount || 0,
    source: "google-books",
    type: "book",
  }));
}

export async function GET() {
  try {
    const [
        newReleases,
        trendingStories,
        romanceBooks,
        fantasyBooks,
        academicArticles,
        googleBooks,
        ] = await Promise.all([
        fetchOpenLibraryBooks("new fiction", 6),
        fetchOpenLibraryBooks("popular fiction", 8),
        fetchOpenLibraryBooks("romance novel", 6),
        fetchOpenLibraryBooks("fantasy novel", 6),
        fetchOpenAlexArticles("creative writing literature publishing", 4),
        fetchGoogleBooks("bestseller fiction", 6),
    ]);

    const scriptoraOriginals = [
      {
        story_id: "scriptora-1",
        title: "The Last Page",
        author: "Scriptora Writer",
        year: 2026,
        cover: null,
        rating: "★★★★★",
        views: 1200,
        source: "scriptora",
        type: "original",
      },
      {
        story_id: "scriptora-2",
        title: "Ink Between Us",
        author: "Scriptora Writer",
        year: 2026,
        cover: null,
        rating: "★★★★☆",
        views: 850,
        source: "scriptora",
        type: "original",
      },
      {
        story_id: "scriptora-3",
        title: "Midnight Drafts",
        author: "Scriptora Writer",
        year: 2026,
        cover: null,
        rating: "★★★★☆",
        views: 640,
        source: "scriptora",
        type: "original",
      },
      {
        story_id: "scriptora-4",
        title: "Letters Never Sent",
        author: "Scriptora Writer",
        year: 2026,
        cover: null,
        rating: "★★★★★",
        views: 2300,
        source: "scriptora",
        type: "original",
      },
    ];

    const continueReading = trendingStories
      .slice(0, 3)
      .map((book: any, i: number) => ({
        ...book,
        current_part: i + 1,
      }));

    const authors = trendingStories.slice(0, 3).map((book: any, i: number) => ({
      author_id: i + 1,
      name: book.author,
      rating: "★★★★★",
    }));

    const forumUsers = authors.map((author: any, i: number) => ({
      user_id: i + 1,
      name: author.name,
    }));

    return NextResponse.json({
      newReleases: newReleases.slice(0, 3),
      trendingStories: trendingStories.slice(0, 4),
      romanceBooks: romanceBooks.slice(0, 4),
      fantasyBooks: fantasyBooks.slice(0, 4),
      academicArticles,
      scriptoraOriginals,
      continueReading,
      authors,
      forumUsers,
      googleBooks: googleBooks.slice(0, 4),
    });
  } catch (error) {
    console.error("Reader dashboard API error:", error);

    return NextResponse.json(
      { message: "Failed to load reader dashboard." },
      { status: 500 }
    );
  }
}