import type { Metadata } from "next";
import { Suspense } from "react";

import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | MAnasPM",
  description: "Set a new password for your MAnasPM account",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-t-accent" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
