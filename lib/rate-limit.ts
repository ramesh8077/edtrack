import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Create a rate limiter instance. Returns null if Upstash is not configured.
 */
function createRateLimiter(config: {
  requests: number;
  window: `${number} ${"s" | "m" | "h" | "d"}`;
  prefix: string;
}) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("⚠️  Upstash not configured — rate limiting disabled");
    return null;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `ratelimit:${config.prefix}`,
    analytics: true,
  });
}

/**
 * Rate limiter for AI endpoints: 20 requests per minute
 */
export const aiRateLimiter = createRateLimiter({
  requests: 20,
  window: "1 m",
  prefix: "ai",
});

/**
 * Rate limiter for auth endpoints: 5 requests per minute
 */
export const authRateLimiter = createRateLimiter({
  requests: 5,
  window: "1 m",
  prefix: "auth",
});

/**
 * Rate limiter for general API endpoints: 60 requests per minute
 */
export const apiRateLimiter = createRateLimiter({
  requests: 60,
  window: "1 m",
  prefix: "api",
});

/**
 * Check rate limit for a given identifier. Returns { success, remaining, reset }.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!limiter) {
    return { success: true, remaining: Infinity, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
