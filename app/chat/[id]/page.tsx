import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { loadMessages } from "@/lib/chat-store";
import { ChatUI } from "./chat-ui";
import { Sidebar } from "./sidebar";

export default async function ChatPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, session.user.id)));
  if (!conv) redirect("/dashboard");

  const initialMessages = await loadMessages(id);

  return (
    <div className="flex">
      <Sidebar userId={session.user.id} activeId={id} />
      <div className="flex-1">
        <ChatUI conversationId={id} initialMessages={initialMessages} />
      </div>
    </div>
  );
}