import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { retrieveChunks } from "@/lib/retrieve";
import { saveMessages } from "@/lib/chat-store";
import { google } from "@ai-sdk/google"; // 1. Import the Google provider

export async function POST(req: Request) {
  // 1. Authenticate — never skip this on a data endpoint
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, conversationId }: {
    messages: UIMessage[];
    conversationId: string;
  } = await req.json();

  // 2. Get the user's latest question (plain text)
  const lastMessage = messages[messages.length - 1];
  const question = lastMessage.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");

  // 3. RETRIEVE relevant chunks for THIS user
  const chunks = await retrieveChunks(question, session.user.id, 5);

  // 4. Build the context block with source labels for citations
  const context = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}] (from "${c.documentTitle}", chunk ${c.chunkIndex})\n${c.content}`
    )
    .join("\n\n---\n\n");

  // 5. Build a system prompt that grounds the model in the context
  const systemPrompt =
    chunks.length > 0
      ? `You are a helpful assistant that answers questions using ONLY the provided context from the user's documents.

Rules:
- Answer only from the context below. If the answer isn't there, say you don't have that information in the documents.
- Cite your sources inline using the format [Source N] where N matches the numbered sources.
- Be concise and accurate.

Context:
${context}`
      : `You are a helpful assistant. The user has no relevant documents for this question. Politely tell them you couldn't find anything relevant in their uploaded documents.`;

  // 6. STREAM the answer, grounded in the retrieved context using Gemini
  const result = streamText({
    model: google("gemini-2.5-flash"), // 2. Update to a fast Gemini model
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  // 7. Return the stream, and SAVE everything when it finishes
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onEnd: ({ messages: finalMessages }) => {
        // Save on the server after the full answer is generated
        saveMessages(conversationId, finalMessages);
      },
    }),
  });
}