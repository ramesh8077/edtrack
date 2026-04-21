"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-destructive">Oops!</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          An unexpected error occurred. Our team has been notified.
        </p>
      </div>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
