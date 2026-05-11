export default function MyLibraryPage() {
  const savedBooks = [
    "The Last Page",
    "Ink Between Us",
    "Midnight Drafts",
  ];

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-[#1F2A44] mb-6">
        My Library
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {savedBooks.map((book, index) => (
          <div
            key={index}
            className="h-48 flex items-center justify-center rounded-xl bg-[#E6EBF7] text-[#1F2A44] font-medium"
          >
            {book}
          </div>
        ))}
      </div>
    </main>
  );
}