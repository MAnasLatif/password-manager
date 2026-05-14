import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | MAnasPM",
  description: "Sign in to your MAnasPM account",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-t-accent" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
