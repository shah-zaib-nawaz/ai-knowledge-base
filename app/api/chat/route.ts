import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
  type UIMessage,
} from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { buildTools } from "@/lib/tools";
import { saveMessages } from "@/lib/chat-store";
import { google } from "@ai-sdk/google";

export const maxDuration = 30; // allow up to 30s for multi-step responses

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { messages, conversationId }: {
    messages: UIMessage[];
    conversationId: string;
  } = await req.json();

  const systemPrompt = `You are a helpful assistant for the user's personal knowledge base.

- When the user asks a question that could be answered by their documents, use the searchDocuments tool to find relevant information, then answer based on what you find.
- Cite sources inline as [Source N] using the source numbers returned by searchDocuments.
- Use listDocuments when the user asks what they've uploaded.
- Use createNote only when the user explicitly asks to save or remember something.
- If a search returns nothing relevant, say you couldn't find it in their documents rather than guessing.`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: buildTools(session.user.id),
    stopWhen: isStepCount(5), // guard: never loop more than 5 steps
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onError: (error) =>
        error instanceof Error ? error.message : "An error occurred",
      onEnd: ({ messages: finalMessages }) => {
        saveMessages(conversationId, finalMessages);
      },
    }),
  });
}
