import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2 } from "lucide-react";

export async function DocumentList({ userId }: { userId: string }) {
  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
        <FileText className="h-8 w-8 text-muted-foreground/60 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No documents yet.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Upload one above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-md border bg-card">
      {docs.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium text-sm truncate">{doc.title}</span>
          </div>
          <Badge 
            variant={doc.status === "ready" ? "outline" : "secondary"}
            className={doc.status === "ready" ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" : ""}
          >
            {doc.status === "processing" && <Loader2 className="h-3 w-3 animate-spin mr-1 inline" />}
            {doc.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}