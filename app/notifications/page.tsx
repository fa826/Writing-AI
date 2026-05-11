export default function NotificationsPage() {
  const notifications = [
    "You have a new follower",
    "A story in your list has a new chapter",
    "New books added in your favorite category",
  ];

  return (
    <main className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-[#1F2A44] mb-6">
        Notifications
      </h1>

      <div className="space-y-4">
        {notifications.map((note, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border bg-[#F8FAFF] text-[#1F2A44]"
          >
            {note}
          </div>
        ))}
      </div>
    </main>
  );
}