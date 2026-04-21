import { Suspense } from "react";
import { VerifyClient } from "./verify-client";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyPage() {
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyClient />
        </Suspense>
      </div>
    </div>
  );
}
