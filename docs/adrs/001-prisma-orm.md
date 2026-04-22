# Architecture Decision Record: Use of Prisma ORM

## Status

Accepted

## Context

We needed a robust, type-safe way to interact with our PostgreSQL database (managed via Neon). The options considered were Prisma and Drizzle.

## Decision

We chose **Prisma ORM** for the following reasons:

1. **Developer Velocity:** Prisma's declarative schema and auto-generated client allow for extremely fast iteration during the "Mega Build" phase.
2. **Type Safety:** The generated `PrismaClient` provides end-to-end type safety which is critical for satisfying the "Strict TypeScript" requirement of the assignment.
3. **Migration Management:** `prisma migrate` handles complex schema changes reliably.
4. **Rich Ecosystem:** Deep integration with Next-Auth and Shadcn-friendly patterns.

## Consequences

- **Build Complexity:** Prisma requires a 'stealth' instantiation pattern in Next.js 16 to avoid Edge runtime evaluation crashes during build-time static analysis.
- **Runtime Size:** The Prisma engine is larger than Drizzle's lightweight approach, but this is acceptable given the platform's focus on feature richness and strict data integrity.
