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
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { messages, conversationId: id } };
      },
    }),
  });

  const isLoading =
    status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user" ? "text-right" : "text-left"
            }
          >
            <div
              className={`inline-block rounded-lg px-3 py-2 ${
                m.role === "user"
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              {m.parts.map((part, i) => {
                // TEXT
                if (part.type === "text") {
                  return (
                    <span
                      key={i}
                      className="whitespace-pre-wrap"
                    >
                      {renderWithCitations(part.text)}
                    </span>
                  );
                }

                // TOOL: searchDocuments
                if (part.type === "tool-searchDocuments") {
                  switch (part.state) {
                    case "input-streaming":
                    case "input-available":
                      return (
                        <div
                          key={i}
                          className="text-xs text-gray-500 italic"
                        >
                          🔍 Searching your documents…
                        </div>
                      );

                    case "output-available":
                      return (
                        <div
                          key={i}
                          className="text-xs text-gray-500 italic"
                        >
                          ✓ Searched your documents
                        </div>
                      );

                    case "output-error":
                      return (
                        <div
                          key={i}
                          className="text-xs text-red-500"
                        >
                          Search failed: {part.errorText}
                        </div>
                      );
                  }
                }

                // TOOL: listDocuments
                if (part.type === "tool-listDocuments") {
                  if (part.state === "output-available") {
                    return (
                      <div
                        key={i}
                        className="text-xs text-gray-500 italic"
                      >
                        ✓ Listed your documents
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="text-xs text-gray-500 italic"
                    >
                      📄 Checking your documents…
                    </div>
                  );
                }

                // TOOL: createNote
                if (part.type === "tool-createNote") {
                  if (part.state === "output-available") {
                    return (
                      <div
                        key={i}
                        className="text-xs text-green-600 italic"
                      >
                        ✓ Note saved
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="text-xs text-gray-500 italic"
                    >
                      💾 Saving note…
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <p className="text-sm text-gray-400">
            Thinking…
          </p>
        )}
      </div>

      {/* Input */}
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

/**
 * Turn [Source N] mentions into styled citation badges
 */
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