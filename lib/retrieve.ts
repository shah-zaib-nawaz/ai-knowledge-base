import { embed } from "ai";
import { db } from "@/db";
import { chunks, documents } from "@/db/schema";
import { cosineDistance, sql, eq, and, gt } from "drizzle-orm";
import { google } from "@ai-sdk/google"; // 1. Import the Google provider

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
        gt(similarity, 0.2) // Now this filter will actually catch valid matches!
      )
    )
    .orderBy(distance)
    .limit(topK);

  return results;
}