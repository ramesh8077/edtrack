"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export function VerifyClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token ? "Verifying your email..." : "No verification token provided."
  );

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then((res) => {
        if (res.error) {
          setStatus("error");
          setMessage(res.error);
        } else {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      });
  }, [token]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify Email</h1>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}

      {status === "success" && (
        <Alert className="border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {(status === "success" || status === "error") && (
        <Button asChild className="w-full">
          <Link href="/login">Go to Login</Link>
        </Button>
      )}
    </div>
  );
}
