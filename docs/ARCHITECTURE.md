# LearnLoop AI — Technical Architecture

## System Overview
LearnLoop AI is a multi-tenant adaptive learning platform built on the **Next.js 16 (App Router)** framework. It leverages AI for curriculum generation, lesson tutoring, and quiz grading.

## Data Flow
1. **User Request:** User interacts with a Client Component (e.g., `ChatPanel`).
2. **Server Logic:** Request sent to Server Action or API Route (e.g., `/api/ai/chat`).
3. **AI Interface:** Backend calls Vercel AI SDK (v6) with transport-based streaming.
4. **Data Persistence:** Results stored in PostgreSQL via Prisma.
5. **Real-time Updates:** Progress and state revalidated via `revalidatePath`.

## Core Components
- **Auth Engine:** Auth.js v5 with Edge-runtime isolation.
- **AI Core:** Transport-aware AI integration supporting multiple providers (Groq, Google).
- **RBAC:** Centralized permission matrix in `lib/rbac.ts`.
- **Infrastructure:** Neon DB, Vercel Hosting, Upstash Redis (Rate Limiting).

## Security Model
- **Input Sanitization:** Every mutation guarded by Zod.
- **Access Control:** Middleware-level path protection + Component-level RBAC checks.
- **Secrets:** Environment isolation via Vercel secrets.
