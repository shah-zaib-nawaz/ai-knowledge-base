import { tool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { retrieveChunks } from "./retrieve";

// A factory that builds the tool set for a specific user
export function buildTools(userId: string) {
  return {
    searchDocuments: tool({
      description:
        "Search the user's uploaded documents for information relevant to a question. Use this whenever the user asks something that might be answered by their documents.",
      inputSchema: z.object({
        query: z.string().describe("The search query or question to look up"),
      }),
      execute: async ({ query }) => {
        const chunks = await retrieveChunks(query, userId, 5);
        return {
          results: chunks.map((c, i) => ({
            source: i + 1,
            documentTitle: c.documentTitle,
            content: c.content,
            similarity: Number(c.similarity.toFixed(3)),
          })),
        };
      },
    }),

    listDocuments: tool({
      description:
        "List all documents the user has uploaded, with their titles and status.",
      inputSchema: z.object({}), // no input needed
      execute: async () => {
        const docs = await db
          .select({
            title: documents.title,
            fileName: documents.fileName,
            status: documents.status,
          })
          .from(documents)
          .where(eq(documents.userId, userId))
          .orderBy(desc(documents.createdAt));
        return { documents: docs };
      },
    }),

    createNote: tool({
      description:
        "Save a short note or task for the user. Use when the user explicitly asks to remember or save something.",
      inputSchema: z.object({
        content: z.string().describe("The note text to save"),
      }),
      execute: async ({ content }) => {
        // For learning: we'll store notes as a special 'note' document.
        // In a real app you'd have a dedicated notes/tasks table.
        const [note] = await db
          .insert(documents)
          .values({
            userId,
            title: `Note: ${content.slice(0, 40)}`,
            fileName: "note.txt",
            status: "ready",
          })
          .returning();
        return { saved: true, id: note.id };
      },
    }),
  };
}
