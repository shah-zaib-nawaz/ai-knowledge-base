"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, FileText, Save, SendHorizonal, AlertCircle, Bot, User } from "lucide-react";

export function ChatUI({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { messages, conversationId: id } };
      },
    }),
    onError: (error) => {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background border-x">
      {/* Top Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Document Copilot</h2>
          <p className="text-xs text-muted-foreground">Ask questions regarding your loaded workspace</p>
        </div>
      </header>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Profile Bubble icon */}
              <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm ${
                isUser ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Payload */}
              <div className="flex flex-col gap-2 w-full max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                    isUser 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted/60 text-foreground border rounded-tl-none"
                  }`}
                >
                  {m.parts.map((part, i) => {
                    // TEXT
                    if (part.type === "text") {
                      return (
                        <p key={i} className="whitespace-pre-wrap">
                          {renderWithCitations(part.text)}
                        </p>
                      );
                    }

                    // TOOL UI Callouts
                    if (part.type.startsWith("tool-")) {
                      return (
                        <div key={i} className="my-2 border rounded-lg bg-card p-2.5 flex items-center gap-2.5 text-xs text-muted-foreground shadow-sm">
                          {part.type === "tool-searchDocuments" && (
                            <>
                              <Search className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                              <span>
                                {part.state === "output-error" ? `Search failed: ${part.errorText}` : "Searching documents…"}
                              </span>
                            </>
                          )}
                          {part.type === "tool-listDocuments" && (
                            <>
                              <FileText className="h-3.5 w-3.5 text-amber-500" />
                              <span>{part.state === "output-available" ? "Listed documents" : "Checking documents…"}</span>
                            </>
                          )}
                          {part.type === "tool-createNote" && (
                            <>
                              <Save className="h-3.5 w-3.5 text-emerald-500" />
                              <span className={part.state === "output-available" ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                                {part.state === "output-available" ? "Note saved successfully" : "Saving note…"}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-3xl mr-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted/40 text-muted-foreground border rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Controller */}
      <div className="border-t bg-card/30 p-4 backdrop-blur">
        {errorMsg && (
          <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              setErrorMsg("");
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="max-w-3xl mx-auto flex gap-2 items-center bg-background rounded-xl border p-1.5 shadow-sm focus-within:ring-1 focus-within:ring-ring"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents…"
            disabled={isLoading}
            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent py-6"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-10 w-10 shrink-0 rounded-lg">
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send Message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function renderWithCitations(text: string) {
  const parts = text.split(/(\[Source \d+\])/g);

  return parts.map((part, i) =>
    /^\[Source \d+\]$/.test(part) ? (
      <span
        key={i}
        className="mx-0.5 inline-flex items-center justify-center rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 cursor-help transition-colors hover:bg-amber-200"
        title="Citation from your documents"
      >
        {part.replace(/[\[\]]/g, "")}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}