"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { extractTextFromFile } from "@/lib/extract-text";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
  // 1. Make sure someone is logged in — this is real security, always check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("You must be signed in to upload.");
  }

  // 2. Pull the file out of the submitted form
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("No file provided.");
  }

  // 3. Guard against huge files (keep costs and memory sane)
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Max 5 MB.");
  }

  // 4. Extract the text
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

  // 5. Create the document row with status "processing"
  const [doc] = await db
    .insert(documents)
    .values({
      userId: session.user.id,
      title: file.name.replace(/\.[^.]+$/, ""), // filename without extension
      fileName: file.name,
      status: "processing",
    })
    .returning();

  // --- Day 13 will go HERE: chunk + embed `text`, then set status to "ready" ---
  // For today, we just have the text and the row. We'll leave status as "processing".

  // 6. Refresh the document list on the page
  revalidatePath("/dashboard");

  return { documentId: doc.id };
}
