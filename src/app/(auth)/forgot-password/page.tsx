import type { Metadata } from "next";
import { Suspense } from "react";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | MAnasPM",
  description: "Reset your MAnasPM password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="border-t-accent h-8 w-8 animate-spin rounded-full border-4 border-transparent" />
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
