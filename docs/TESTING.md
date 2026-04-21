# 🧪 LearnLoop AI — Complete Testing Commands Guide (npm)

> Har phase ke testing commands, order me. Har command ka expected output aur failure pe kya check karna hai, sab likha hai.

---

## 📝 IMPORTANT — npm-specific notes

1. **Args passing**: npm me script ke baad args dene ke liye `--` separator zaroori hai:
   - ✅ `npm test -- --watch` (sahi — `--watch` script ko jata hai)

2. **Lockfile**: `package-lock.json` commit karna, `pnpm-lock.yaml` nahi.

3. **CI me `npm ci` use karo** (faster + deterministic than `npm install`):
   ```bash
   npm ci   # CI/production ke liye
   npm install   # local development ke liye
   ```

---

## 📋 Prerequisites (ek baar setup)

```bash
# Node version check (Node 20+ chahiye Next.js 16 ke liye)
node --version                    # v20.x ya upar

# npm installed ho
npm --version                    # 9.x+

# Docker chalu ho (local Postgres ke liye, optional if using Neon)
docker --version
```

---

## 🚀 Phase 0 — Project Setup & Install

```bash
# 1. Dependencies install
npm install

# 2. Prisma client generate
npx prisma generate

# 3. Env file setup
cp .env.example .env.local

# 4. AUTH_SECRET generate karne ka command
openssl rand -base64 32
```

---

## 🗄️ Phase 1 — Database Testing

```bash
# 1. Database connection test
npx prisma db pull

# 2. Migrations apply karo
npm run db:migrate -- --name init

# 3. Seed data daalo (demo users)
npm run db:seed

# 4. Prisma Studio me DB visually check karo
npm run db:studio
```

---

## 🧑💻 Phase 2 — Development Server

```bash
# Dev server start karo
npm run dev

# Browser me check karo: http://localhost:3000
```

---

## ✅ Phase 3 — Type Checking & Linting

```bash
# 1. TypeScript type check
npm run typecheck

# 2. ESLint run karo
npm run lint

# 3. Prettier format check
npm run format:check
```

---

## 🧪 Phase 4 — Unit Tests (Vitest)

```bash
# 1. Saare unit tests run karo
npm test -- run

# 2. Watch mode
npm test

# 3. Coverage report
npm run test:coverage
```

---

## 🔄 Phase 5 — Integration Tests

```bash
# Integration tests
npm run test:integration
```

---

## 🎭 Phase 6 — E2E Tests (Playwright)

```bash
# 1. Playwright browsers install
npx playwright install --with-deps

# 2. Saare E2E tests run karo
npm run test:e2e
```

---

## ♿ Phase 7 — Accessibility Testing

```bash
# 1. axe-core tests
npm run test:e2e -- --grep "a11y"
```

---

## ⚡ Phase 8 — Performance Testing

```bash
# 1. Production build banao
npm run build

# 2. Production server start
npm start
```

---

## 🔒 Phase 9 — Security Testing

```bash
# 1. Dependency vulnerability scan
npm audit
```

---

## 📦 Phase 10 — Build Verification

```bash
# 1. Clean build
rm -rf .next node_modules/.cache
npm run build
```

---

## 🚢 Phase 11 — Pre-Deployment Checklist

```bash
npm run typecheck && \
npm run lint && \
npm run format:check && \
npm test && \
npm run test:e2e && \
npm run build
```

---

## 🌐 Phase 12 — Deployment Testing (Vercel)

```bash
vercel --prod
```

---

## 🐛 Phase 13 — Error Monitoring Verification

Check Sentry dashboard after throwing an intentional error.

---

## 🎥 Phase 14 — Final Submission Demo

Record a 3-5 min video of the production-ready app.

---

# END OF TESTING GUIDE
