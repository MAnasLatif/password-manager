import type { Metadata } from "next";
import { Suspense } from "react";

import VerifyEmail from "@/components/auth/verify-email";

export const metadata: Metadata = {
  title: "Verify Email | MAnasPM",
  description: "Verify your MAnasPM email address",
};

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-t-accent" />
          </div>
        }
      >
        <VerifyEmail />
      </Suspense>
    </div>
  );
}
