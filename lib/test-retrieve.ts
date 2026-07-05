import "dotenv/config";
import { retrieveChunks } from "./retrieve";

async function main() {
  const userId = "x628WPHqckjYpRB8dUd9IfbpwDfn9qkz"; // grab from Drizzle Studio
  const query = "who is shahzaib nawaz?"; // ask something your doc covers

  const results = await retrieveChunks(query, userId, 5);

  console.log(`\nQuery: "${query}"`);
  console.log(`Found ${results.length} chunks:\n`);
  for (const r of results) {
    console.log(`[${r.similarity.toFixed(3)}] ${r.documentTitle} #${r.chunkIndex}`);
    console.log(`   ${r.content.slice(0, 150)}...\n`);
  }
}

main();
