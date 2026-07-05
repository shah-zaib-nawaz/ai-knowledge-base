import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export async function DocumentList({ userId }: { userId: string }) {
  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));

  if (docs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documents yet. Upload one to get started.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-md border">
      {docs.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between p-3">
          <span className="font-medium">{doc.title}</span>
          <Badge variant={doc.status === "ready" ? "default" : "secondary"}>
            {doc.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
