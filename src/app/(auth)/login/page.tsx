import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Account Manager",
  description: "Sign in to your Account Manager account",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="border-t-accent h-8 w-8 animate-spin rounded-full border-4 border-transparent" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
