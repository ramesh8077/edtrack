"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { authRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import { z } from "zod";

/**
 * Helper to get the IP address for rate limiting
 */
async function getIpIdentifier() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";
  return ip ?? "127.0.0.1";
}

/**
 * Register a new user
 */
export async function registerUser(formData: z.infer<typeof signupSchema>) {
  // 1. Rate limit check
  const ip = await getIpIdentifier();
  const limit = await checkRateLimit(authRateLimiter, `register:${ip}`);
  if (!limit.success) {
    return { error: "Too many requests. Please try again later." };
  }

  try {
    // 2. Validate input
    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: "Invalid form data.", details: parsed.error.flatten().fieldErrors };
    }
    const { email, password, name } = parsed.data;

    // 3. Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    // 4. Hash password
    const argon2 = await import("argon2");
    const passwordHash = await argon2.hash(password);

    // 5. Create user
    await db.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // 6. Generate verification token
    const token = crypto.randomUUID();
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // 7. Send verification email (non-blocking)
    sendVerificationEmail(email, token).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred during registration." };
  }
}

/**
 * Authenticate with email and password
 */
export async function authenticate(prevState: string | undefined, formData: FormData) {
  // 1. Rate limit check
  const ip = await getIpIdentifier();
  const limit = await checkRateLimit(authRateLimiter, `login:${ip}`);
  if (!limit.success) {
    return "Too many requests. Please try again later.";
  }

  try {
    // We pass the raw Object.fromEntries(formData) for signIn
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    // Required for redirect handling
    if (isRedirectError(error)) {
      throw error;
    }
    throw error;
  }
}

/**
 * Log out user
 */
export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

/**
 * Verify a user's email using a token
 */
export async function verifyEmail(token: string) {
  try {
    const existingToken = await db.verificationToken.findFirst({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or missing token." };
    }

    if (new Date(existingToken.expires) < new Date()) {
      return { error: "Token has expired." };
    }

    await db.user.update({
      where: { email: existingToken.identifier },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { identifier_token: { identifier: existingToken.identifier, token } },
    });

    return { success: true };
  } catch {
    return { error: "Failed to verify email." };
  }
}

/**
 * Request password reset
 */
export async function resetPassword(email: string) {
  // 1. Rate limit
  const ip = await getIpIdentifier();
  const limit = await checkRateLimit(authRateLimiter, `reset:${ip}`);
  if (!limit.success) {
    return { error: "Too many requests. Please try again later." };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success to prevent email enumeration
      return { success: true };
    }

    const token = crypto.randomUUID();
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    // Currently we reuse the sendVerificationEmail flow placeholder for simplicity,
    // typically you'd have a separate sendResetPasswordEmail.
    sendVerificationEmail(email, token).catch(console.error);

    return { success: true };
  } catch {
    return { error: "Failed to process reset request." };
  }
}

/**
 * Update password using reset token
 */
export async function updatePassword(token: string, password: string) {
  try {
    const existingToken = await db.verificationToken.findFirst({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or missing token." };
    }

    if (new Date(existingToken.expires) < new Date()) {
      return { error: "Token has expired." };
    }

    const argon2 = await import("argon2");
    const passwordHash = await argon2.hash(password);

    await db.user.update({
      where: { email: existingToken.identifier },
      data: { passwordHash },
    });

    await db.verificationToken.delete({
      where: { identifier_token: { identifier: existingToken.identifier, token } },
    });

    return { success: true };
  } catch {
    return { error: "Failed to update password." };
  }
}
