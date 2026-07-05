export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  // Normalize whitespace so chunk boundaries are cleaner
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= chunkSize) {
    return clean.length > 0 ? [clean] : [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = start + chunkSize;

    // Try to break at a sentence or space near the end, not mid-word
    if (end < clean.length) {
      const slice = clean.slice(start, end);
      const lastBreak = Math.max(
        slice.lastIndexOf(". "),
        slice.lastIndexOf("? "),
        slice.lastIndexOf("! "),
        slice.lastIndexOf("\n")
      );
      // Only use the break if it's not too early in the chunk
      if (lastBreak > chunkSize * 0.5) {
        end = start + lastBreak + 1;
      }
    }

    const chunk = clean.slice(start, end).trim();
    if (chunk) chunks.push(chunk);

    // Move forward, but step back by `overlap` so chunks overlap
    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}
