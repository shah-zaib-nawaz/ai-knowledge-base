import { extractText as extractPdfText, getDocumentProxy } from "unpdf";

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // Plain text and markdown: the file IS the text
  if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
    return await file.text();
  }

  // PDF: use unpdf to pull the text out
  if (fileName.endsWith(".pdf")) {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractPdfText(pdf, { mergePages: true });
    return text;
  }

  throw new Error("Unsupported file type. Please upload .txt, .md, or .pdf");
}
