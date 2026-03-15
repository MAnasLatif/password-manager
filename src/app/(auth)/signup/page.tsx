import type { Metadata } from "next";
import { Suspense } from "react";

import SignupForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account | MAnasPM",
  description: "Create your MAnasPM account",
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="border-t-accent h-8 w-8 animate-spin rounded-full border-4 border-transparent" />
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
