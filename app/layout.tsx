import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Knowledge Base - Chat With Your Documents",
    template: "%s | AI Knowledge Base",
  },
  description: "A full-stack SaaS to upload documents and get streaming, cited AI answers using RAG, pgvector, and Next.js.",
  keywords: [
    "AI Knowledge Base",
    "RAG",
    "Retrieval-Augmented Generation",
    "Next.js AI",
    "pgvector",
    "SaaS",
    "AI Document Chat",
  ],
  authors: [{ name: "Your Name/Company" }],
  openGraph: {
    title: "AI Knowledge Base - Chat With Your Documents",
    description: "Upload .txt, .md, and .pdf documents and get real-time streaming answers with inline citations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Knowledge Base - Chat With Your Documents",
    description: "Full-stack RAG SaaS built with Next.js, Vercel AI SDK, and pgvector.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}