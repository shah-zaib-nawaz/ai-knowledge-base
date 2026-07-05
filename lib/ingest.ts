// ingest.ts
import { embedMany } from "ai";
import { db } from "@/db";
import { chunks, documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { chunkText } from "./chunk";
import { google } from "@ai-sdk/google";

export async function ingestDocument(documentId: string, text: string) {
  // 1. Split the text into overlapping chunks
  const pieces = chunkText(text);

  if (pieces.length === 0) {
    await db
      .update(documents)
      .set({ status: "ready" })
      .where(eq(documents.id, documentId));
    return { chunkCount: 0, tokensUsed: 0 };
  }

  // 2. Embed all chunks in a single batch call using the correct model ID
 const { embeddings, usage } = await embedMany({
  model: google.textEmbeddingModel("gemini-embedding-001"),
  values: pieces,
  providerOptions: {
    google: {
      outputDimensionality: 768,
    },
  },
});

  // 3. Build the rows to insert
  const rows = pieces.map((content, index) => ({
    documentId,
    content,
    embedding: embeddings[index], 
    chunkIndex: index,
  }));

  // 4. Insert all chunks at once
  await db.insert(chunks).values(rows);

  // 5. Mark the document ready
  await db
    .update(documents)
    .set({ status: "ready" })
    .where(eq(documents.id, documentId));

  return { chunkCount: pieces.length, tokensUsed: usage?.tokens ?? 0 };
}