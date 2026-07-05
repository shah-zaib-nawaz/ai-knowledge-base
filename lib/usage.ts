import { db } from "@/db";
import { usage } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";

// Record tokens + one request for a user (upsert-style: increment today's row)
export async function recordUsage(userId: string, tokensUsed: number) {
  // Simplest reliable approach: always insert a usage event row.
  // Aggregation happens at read time. (Easy to reason about while learning.)
  await db.insert(usage).values({
    userId,
    tokensUsed,
    requestCount: 1,
  });
}

// Read a user's totals (optionally for the last N days)
export async function getUsageSummary(userId: string, sinceDays = 30) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  const [row] = await db
    .select({
      totalTokens: sql<number>`COALESCE(SUM(${usage.tokensUsed}), 0)`,
      totalRequests: sql<number>`COALESCE(SUM(${usage.requestCount}), 0)`,
    })
    .from(usage)
    .where(and(eq(usage.userId, userId), gte(usage.date, since)));

  return {
    totalTokens: Number(row?.totalTokens ?? 0),
    totalRequests: Number(row?.totalRequests ?? 0),
  };
}
