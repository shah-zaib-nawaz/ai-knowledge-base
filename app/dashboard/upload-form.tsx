"use client";

import { useState, useRef } from "react";
import { uploadDocument } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UploadForm() {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("uploading");
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await uploadDocument(formData);
      formRef.current?.reset(); // clear the file input on success
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="file"
        name="file"
        accept=".txt,.md,.pdf"
        required
        disabled={status === "uploading"}
      />
      <Button type="submit" disabled={status === "uploading"}>
        {status === "uploading" ? "Uploading…" : "Upload document"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
