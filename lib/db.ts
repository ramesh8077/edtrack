const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any;
};

export const getDb = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
  const isEdge = typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge";

  if (!isNode || isEdge) {
    return new Proxy({}, {
      get() {
        throw new Error(`Prisma accessed in non-Node.js environment (${process.env.NEXT_RUNTIME}).`);
      },
    }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  // Stealth load to bypass Next.js 16 build-time static analysis
  const { PrismaClient } = eval("require('@prisma/client')");
  
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  return prisma;
};

export const db = new Proxy({}, {
  get(target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
