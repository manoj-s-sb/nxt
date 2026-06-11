export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">AI Chat</h1>
      <p className="text-lg text-gray-500 mb-8">
        Frontend is running ✅
      </p>
      <a
        href="/chat"
        className="rounded-lg bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition"
      >
        Start chatting
      </a>
    </main>
  );
}
