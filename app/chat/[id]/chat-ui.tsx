"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatUI({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // send the conversationId along with the messages
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { messages, conversationId: id } };
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block rounded-lg px-3 py-2 ${
                m.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <span key={i} className="whitespace-pre-wrap">
                    {renderWithCitations(part.text)}
                  </span>
                ) : null
              )}
            </div>
          </div>
        ))}
        {isLoading && <p className="text-sm text-gray-400">Thinking…</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        className="flex gap-2 p-4 border-t"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents…"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}

// Turn [Source N] mentions into little highlighted badges
function renderWithCitations(text: string) {
  const parts = text.split(/(\[Source \d+\])/g);
  return parts.map((part, i) =>
    /^\[Source \d+\]$/.test(part) ? (
      <sup
        key={i}
        className="mx-0.5 rounded bg-amber-200 px-1 text-xs font-medium text-amber-900"
        title="Citation from your documents"
      >
        {part}
      </sup>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
