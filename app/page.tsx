import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Shield, Zap, Database } from "lucide-react";

export default async function HomePage() {
  // Check session directly on the server to prevent layout flashes
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b max-w-7xl mx-auto w-full">
        <Link className="flex items-center justify-center space-x-2" href="#">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Ai Knowledge Base</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          {session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Production Ready RAG Platform
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
              Chat With Your Knowledge Base, <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">In Seconds.</span>
            </h1>
            <p className="mx-auto max-w-175 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              An advanced, full-stack RAG SaaS application. Drop in PDFs, Markdown, or text files, and chat with your data using instant streaming responses and accurate inline citations.
            </p>
            <div className="space-x-4 pt-4">
              <Button asChild size="lg" className="px-8">
                <Link href="/dashboard" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://github.com/yourusername/your-repo" target="_blank" rel="noreferrer">
                  View Source code
                </a>
              </Button>
            </div>
          </div>
        </section>

        <hr className="border-muted max-w-7xl mx-auto" />

        {/* Features Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 max-w-7xl mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Engineered for Performance & Scale</h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Built using standard enterprise design patterns to provide secure isolation, precision context window matching, and rapid response delivery.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Isolated Multi-Tenancy</h3>
              <p className="text-sm text-muted-foreground">Secure row-level data boundaries. Every document, chunk, and vector index uniquely maps to authenticated user rows via Better Auth.</p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">pgvector Semantic Search</h3>
              <p className="text-sm text-muted-foreground">Converts data to 1536-dimensional OpenAI vectors. Performs super-fast cosine-similarity matching powered by HNSW indexes.</p>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Streaming with Citations</h3>
              <p className="text-sm text-muted-foreground">Vercel AI SDK streams dynamic tokens right to your screen. Answers are cleanly paired with transparent inline source references.</p>
            </div>
          </div>
        </section>

        <hr className="border-muted max-w-7xl mx-auto" />

        {/* Architecture Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Core RAG Pipeline</h2>
                <p className="text-muted-foreground">
                  The application transforms your documents into dynamic external engine knowledge instantly using a distinct ingestion and retrieval system.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-base">Ingest & Chunk</h4>
                      <p className="text-sm text-muted-foreground">Extracts native document text into cleanly balanced ~1000 character overlapping blocks.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-base">Vector Generation</h4>
                      <p className="text-sm text-muted-foreground">Passes chunks to <code>text-embedding-3-small</code> and maps them to physical server nodes using Neon PostgreSQL.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-base">Informed Synthesis</h4>
                      <p className="text-sm text-muted-foreground">Searches nearest vector fields on query, structures semantic fragments into custom model prompts, and crafts a grounded response.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm font-mono text-sm overflow-x-auto">
                <div className="flex items-center justify-between pb-4 border-b mb-4">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">System Stack</span>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="text-blue-500">const</span> techStack = &#123;</p>
                  <p className="pl-4">framework: {"\"Next.js 15 (App Router)\""},</p>
                  <p className="pl-4">database: {"\"Neon Serverless Postgres + pgvector\""},</p>
                  <p className="pl-4">orm: {"\"Drizzle ORM\""},</p>
                  <p className="pl-4">aiEngine: {"\"Vercel AI SDK 5 + OpenAI\""},</p>
                  <p className="pl-4">auth: {"\"Better Auth\""},</p>
                  <p className="pl-4">rateLimiter: {"\"Upstash Redis\""}</p>
                  <p>&#125;;</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t max-w-7xl mx-auto text-xs text-muted-foreground">
        <p>© 2026 ContextMind. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p>Built as a high-performance modern portfolio piece.</p>
        </nav>
      </footer>
    </div>
  );
}