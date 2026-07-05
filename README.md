# AI Knowledge Base — Chat With Your Documents

A full-stack SaaS where authenticated users upload documents, and a
streaming chat answers questions from those documents using RAG
(retrieval-augmented generation) with inline citations.

## Features
- Email/password auth (Better Auth), every piece of data owned by a user
- Upload .txt, .md, and .pdf documents; automatic text extraction
- Chunking + embedding pipeline storing vectors in pgvector
- Semantic search over the user's own documents (cosine similarity)
- Streaming RAG chat with source citations
- Agentic tool calling (search, list documents, save notes)
- Conversation history with a sidebar
- Per-user usage tracking, rate limiting, and cost guards

## Tech Stack
Next.js (App Router, TypeScript), Vercel AI SDK 5, Postgres + pgvector
(Neon), Drizzle ORM, Better Auth, Upstash rate limiting, Tailwind +
shadcn/ui.

## How RAG Works Here
1. On upload, text is extracted, split into ~1000-char overlapping chunks.
2. Each chunk is embedded with OpenAI text-embedding-3-small (1536 dims)
   and stored in the `chunks.embedding` vector column.
3. On each question, the query is embedded with the same model, and a
   cosine-similarity search returns the top-k most relevant chunks scoped
   to the user's documents.
4. Those chunks are injected into the prompt with source labels, and the
   model streams a cited answer.

## Database Schema
Briefly describe: user/session (Better Auth), documents, chunks (with
vector column + HNSW index), conversations, messages, usage.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Enable pgvector: run `CREATE EXTENSION IF NOT EXISTS vector;`
4. `npx drizzle-kit push` (or `migrate` for production)
5. `npm run dev`

## Environment Variables
List each one and what it's for (DATABASE_URL, AI_GATEWAY_API_KEY,
BETTER_AUTH_SECRET, BETTER_AUTH_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).
