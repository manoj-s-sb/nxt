export default function ChatDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Chat session: {params.id}</p>
    </main>
  );
}
