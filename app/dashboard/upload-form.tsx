"use client";

import { useState, useRef } from "react";
import { uploadDocument } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

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
      formRef.current?.reset();
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Input
          type="file"
          name="file"
          accept=".txt,.md,.pdf"
          required
          disabled={status === "uploading"}
          className="cursor-pointer file:font-medium file:text-muted-foreground"
        />
      </div>
      <Button type="submit" disabled={status === "uploading"} className="w-full">
        {status === "uploading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing document...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload file
          </>
        )}
      </Button>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium">
          {error}
        </div>
      )}
    </form>
  );
}