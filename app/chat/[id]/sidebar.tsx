import Link from "next/link";
import { listConversations } from "@/lib/chat-store";
import { startNewChat } from "@/app/actions/chat";
import { Button } from "@/components/ui/button";

export async function Sidebar({
  userId,
  activeId,
}: {
  userId: string;
  activeId: string;
}) {
  const convos = await listConversations(userId);

  return (
    <aside className="w-64 border-r h-screen flex flex-col p-3 gap-3">
      <form action={startNewChat}>
        <Button type="submit" className="w-full">
          + New chat
        </Button>
      </form>

      <nav className="flex-1 overflow-y-auto space-y-1">
        {convos.map((c) => (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className={`block truncate rounded px-3 py-2 text-sm ${
              c.id === activeId ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
            }`}
          >
            {c.title}
          </Link>
        ))}
        {convos.length === 0 && (
          <p className="text-xs text-gray-400 px-3">No conversations yet.</p>
        )}
      </nav>
    </aside>
  );
}
