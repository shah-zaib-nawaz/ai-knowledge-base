// src/lib/chat-store.ts
import { db } from "@/db";
import { conversations, messages as messagesTable } from "@/db/schema";
import { eq, asc, desc, and } from "drizzle-orm";
import type { UIMessage } from "ai";

/**
 * Create a new conversation for a user, return its id
 */
export async function createConversation(userId: string, title = "New conversation") {
  const [conv] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();
  return conv.id;
}

/**
 * Load all messages for a conversation, as UIMessages the client understands
 */
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

/**
 * Save the full message list for a conversation (Clear and re-insert approach)
 * Includes Step 6: Automatic conversation titling based on the first user message.
 */
export async function saveMessages(conversationId: string, msgs: UIMessage[]) {
  // 1. Extract plain text from each UIMessage's parts
  const rows = msgs.map((m) => ({
    conversationId,
    role: m.role,
    content: m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { text: string }).text)
      .join(""),
  }));

  // 2. Clear out older records and insert the updated timeline
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, conversationId));
  if (rows.length > 0) {
    await db.insert(messagesTable).values(rows);
  }

  // 3. Step 6: Set a readable title from the first user message if it's still the default
  const firstUserMsg = rows.find((r) => r.role === "user");
  if (firstUserMsg) {
    await db
      .update(conversations)
      .set({ title: firstUserMsg.content.slice(0, 50) })
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.title, "New conversation")
        )
      );
  }
}

/**
 * List all conversations for a specific user, ordered by newest first
 */
export async function listConversations(userId: string) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.createdAt));
}