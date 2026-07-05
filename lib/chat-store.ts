import { db } from "@/db";
import { conversations, messages as messagesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { UIMessage } from "ai";

// Create a new conversation for a user, return its id
export async function createConversation(userId: string, title = "New conversation") {
  const [conv] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();
  return conv.id;
}

// Load all messages for a conversation, as UIMessages the client understands
export async function loadMessages(conversationId: string): Promise<UIMessage[]> {
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(asc(messagesTable.createdAt));

  return rows.map((row) => ({
    id: row.id,
    role: row.role as "user" | "assistant",
    parts: [{ type: "text", text: row.content }],
  }));
}

// Save the full message list for a conversation (simple approach: replace all)
export async function saveMessages(conversationId: string, msgs: UIMessage[]) {
  // Extract plain text from each UIMessage's parts
  const rows = msgs.map((m) => ({
    conversationId,
    role: m.role,
    content: m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { text: string }).text)
      .join(""),
  }));

  // Simplest correct approach for learning: clear and re-insert
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, conversationId));
  if (rows.length > 0) {
    await db.insert(messagesTable).values(rows);
  }
}
