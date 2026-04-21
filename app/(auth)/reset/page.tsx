import { Suspense } from "react";
import { ResetClient } from "./reset-client";

export const metadata = {
  title: "Reset Password",
  description: "Reset your LearnLoop AI password",
};

export default function ResetPage() {
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetClient />
        </Suspense>
      </div>
    </div>
  );
}
