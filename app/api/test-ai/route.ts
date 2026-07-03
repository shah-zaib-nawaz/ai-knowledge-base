import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET() {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "Reply with exactly: foundation works",
  });

  return Response.json({ text });
}