import { embed } from "ai";
import { db } from "@/db";
import { chunks, documents } from "@/db/schema";
import { cosineDistance, sql, eq, and, gt } from "drizzle-orm";
import { google } from "@ai-sdk/google";

export type RetrievedChunk = {
  id: string;
  content: string;
  similarity: number;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
};

export async function retrieveChunks(
  query: string,
  userId: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  // Step 7: Enforce a hard maximum/minimum ceiling on chunks retrieved
  const safeTopK = Math.min(Math.max(topK, 1), 10); // never below 1, never above 10

  // Step 1: Embed query (MUST match the ingestion model exactly)
  const { embedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-001"),
    value: query,
    providerOptions: {
      google: {
        outputDimensionality: 768, // Match the schema dimensions!
      },
    },
  });

  // Step 2: Compute distance + similarity
  const distance = cosineDistance(chunks.embedding, embedding);
  const similarity = sql<number>`1 - (${distance})`;

  // Step 3: Query database
  const results = await db
    .select({
      id: chunks.id,
      content: chunks.content,
      similarity,
      documentId: chunks.documentId,
      documentTitle: documents.title,
      chunkIndex: chunks.chunkIndex,
    })
    .from(chunks)
    .innerJoin(documents, eq(chunks.documentId, documents.id))
    .where(
      and(
        eq(documents.userId, userId),
        gt(similarity, 0.2) // Filter out weak matches
      )
    )
    .orderBy(distance)
    .limit(safeTopK); // Using the clamped safeTopK guard here

  return results;
}