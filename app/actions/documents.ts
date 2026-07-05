"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { extractTextFromFile } from "@/lib/extract-text";
import { revalidatePath } from "next/cache";
import { ingestDocument } from "@/lib/ingest";
import { eq, and } from "drizzle-orm";

/**
 * Uploads a document, extracts text, creates a DB entry, and runs the ingestion pipeline.
 */
export async function uploadDocument(formData: FormData) {
  // 1. Make sure someone is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("You must be signed in to upload.");
  }

  // 2. Pull the file from the form
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    throw new Error("No file provided.");
  }

  // 3. Guard against huge files
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Max 5 MB.");
  }

  // 4. Extract text from the uploaded file
  let text: string;

  try {
    text = await extractTextFromFile(file);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Could not read the file."
    );
  }

  if (!text.trim()) {
    throw new Error("No text found in that file.");
  }

  // 5. Create the document row with "processing" status
  const [doc] = await db
    .insert(documents)
    .values({
      userId: session.user.id,
      title: file.name.replace(/\.[^.]+$/, ""), // filename without extension
      fileName: file.name,
      status: "processing",
    })
    .returning();

  // 5b. Run the ingestion pipeline: chunk + embed + store
  try {
    await ingestDocument(doc.id, text);
  } catch (err) {
    // Mark the document as failed if embedding/chunking breaks
    await db
      .update(documents)
      .set({ status: "error" })
      .where(eq(documents.id, doc.id));

    console.error("Ingestion failed:", err);

    throw new Error(
      "Uploaded, but processing failed. Please try again."
    );
  }

  // 6. Refresh the dashboard
  revalidatePath("/dashboard");

  return {
    documentId: doc.id,
  };
}

/**
 * Deletes a specific document belonging to the current user.
 * Cascading foreign keys handle removing the associated chunks automatically.
 */
export async function deleteDocument(documentId: string) {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Security check: Only delete if this document belongs to the current user
  await db
    .delete(documents)
    .where(
      and(
        eq(documents.id, documentId), 
        eq(documents.userId, session.user.id)
      )
    );

  // Refresh the dashboard to reflect the deletion
  revalidatePath("/dashboard");
}