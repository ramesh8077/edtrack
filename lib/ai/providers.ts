import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Groq AI Provider.
 * Using OpenAI compatibility layer as Groq exposes an OpenAI-compatible API.
 */
export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Google AI Studio / Vertex AI Provider.
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "",
});

/**
 * Helper to select the active model based on environment config.
 * For path generation structured output we recommend Gemini Flash to save costs or Groq LLama-3-70B.
 *
 * Available values for NEXT_PUBLIC_PRIMARY_AI_PROVIDER: 'groq' | 'google'
 */
export function getAIModel(type: "fast" | "structured" = "fast") {
  const provider =
    process.env.NEXT_PUBLIC_PRIMARY_AI_PROVIDER === "google" ? "google" : "groq";

  if (provider === "google") {
    return google(
      type === "structured" ? "gemini-2.5-flash" : "gemini-2.5-flash-lite"
    );
  }

  return groq(
    type === "structured" ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant"
  );
}