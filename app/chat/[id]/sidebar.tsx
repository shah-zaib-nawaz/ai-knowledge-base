import Link from "next/link";
import { listConversations } from "@/lib/chat-store";
import { startNewChat } from "@/app/actions/chat";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, LayoutDashboard } from "lucide-react"; // Imported LayoutDashboard

export async function Sidebar({
  userId,
  activeId,
}: {
  userId: string;
  activeId: string;
}) {
  const convos = await listConversations(userId);

  return (
    <aside className="w-64 border-r h-screen flex flex-col p-4 gap-4 bg-muted/20">
      {/* Back to Dashboard Link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 group"
      >
        <LayoutDashboard className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      <hr className="border-border/60 -mx-1" />

      {/* New Chat CTA */}
      <form action={startNewChat}>
        <Button type="submit" className="w-full gap-2 justify-center font-medium shadow-sm">
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </form>

      <div className="flex flex-col gap-1 flex-1 overflow-hidden">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-3 mb-1">
          History
        </p>
        
        <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
          {convos.map((c) => {
            const isActive = c.id === activeId;
            return (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                className={`flex items-center gap-2.5 truncate rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-secondary text-secondary-foreground font-medium border shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground/60"}`} />
                <span className="truncate flex-1">{c.title}</span>
              </Link>
            );
          })}
          {convos.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-center">
              <p className="text-xs text-muted-foreground">No conversations yet.</p>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}