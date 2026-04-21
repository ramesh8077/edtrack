# 🧠 LearnLoop AI

> **Your AI Learning Coach — from goal to mastery.**

[![Project Status](https://img.shields.io/badge/Status-Production--Ready-success)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black)](https://nextjs.org)
[![AI SDK](https://img.shields.io/badge/AI--SDK-v6-blue)](https://sdk.vercel.ai)

LearnLoop AI is a production-grade adaptive learning platform where self-learners declare career goals and receive personalized, AI-generated learning paths, expert-verified syllabus tracks, and on-demand AI tutoring.

---

## 🚀 Live Demo & Visuals

- **Live URL:** [https://learnloop-ai.vercel.app](https://learnloop-ai.vercel.app)
- **Demo Video:** [Watch the Loom Walkthrough](https://loom.com)

---

## ✨ Features

- **AI Path Generation (O1):** Transform plain-english goals into structured multi-week learning paths.
- **Context-Aware AI Tutor (H4):** A persistent chat assistant that knows exactly what you are studying.
- **Adaptive Quiz Engine (F6):** AI generates and grades open-ended assessments with constructive feedback.
- **Mentor Studio (Step 4):** Industry experts can publish verified "Master Curriculums" as templates.
- **Admin Dashboard (Step 5):** Global moderation, user management, and mentor verification.
- **RBAC Protection (A2):** Strict Learner, Mentor, and Admin role-based access control.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Auth.js v5 (NextAuth)
- **AI:** Vercel AI SDK v6 (Google & Groq)
- **Styling:** Tailwind CSS (Modern Glassmorphism)
- **UI Components:** Shadcn UI + Framer Motion
- **Testing:** Vitest (Unit) + Playwright (E2E)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- npm or pnpm
- A free Neon.tech account (Postgres) or Docker

### Steps
1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   cd edtrack
   npm install
   ```
2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `GROQ_API_KEY` (AI Engine)
3. **Database Initialization:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
4. **Development Mode:**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

```bash
# Run unit tests (RBAC, Validations)
npm run test:unit

# Run E2E tests (Playwright)
npm run test:e2e
```

---

## 🛡️ Security & Scalability

- **Security:** CSRF protection, rate limiting (Upstash Redis), XSS headers, and multi-layer Zod validation.
- **Scalability:** Serverless architecture, Edge-compatible middleware, and Prisma connection pooling via Neon.

---

## 📜 License

MIT © 2026 LearnLoop AI
