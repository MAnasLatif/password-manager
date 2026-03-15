"use client";

import { Alert } from "@heroui/react";
import { Mail, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { resendVerificationAction } from "@/app/actions/auth";
import { cn } from "@heroui/styles";

export default function VerifyEmail({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const isPending = searchParams.get("pending") === "true";
  const errorParam = searchParams.get("error");
  const emailParam = searchParams.get("email") ?? "";

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    if (!emailParam) return;
    setResendLoading(true);
    await resendVerificationAction(emailParam);
    setResendLoading(false);
    setResendSuccess(true);
  };

  // Error state
  if (errorParam) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-danger/10 flex h-16 w-16 items-center justify-center rounded-full">
              <XCircle className="text-danger h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold">Verification Failed</h1>
            <p className="text-muted text-sm">This verification link is invalid or has expired.</p>
          </div>

          <Alert status="danger" className="border-border w-full rounded-2xl border shadow-none">
            <Alert.Indicator />
            <Alert.Content className="gap-1">
              <Alert.Title>Please sign up again or request a new verification email.</Alert.Title>
            </Alert.Content>
          </Alert>

          <Link
            href="/signup"
            className="bg-accent text-accent-foreground hover:bg-accent-hover flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors"
          >
            Back to Sign Up
          </Link>

          <p className="text-muted text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Pending verification state
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center rounded-full">
            <Image
              src="/logo.svg"
              alt="Account Manager logo"
              width={120}
              height={120}
              className="size-30"
            />
          </div>
          <h1 className="text-xl font-bold">Verify Your Email</h1>
          <p className="text-muted text-sm">
            {isPending
              ? "We've sent a verification link to your email address."
              : "Please verify your email to access your vault."}
          </p>
        </div>

        {emailParam && (
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-foreground font-medium">{emailParam}</p>
          </div>
        )}

        <div className="text-muted space-y-2 text-center text-sm">
          <p>Click the link in the email to verify your address.</p>
          <p>The link will expire in 24 hours.</p>
        </div>

        {emailParam && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="text-muted h-4 w-4" />
            <span className="text-muted">
              Didn&apos;t receive it?{" "}
              {resendSuccess ? (
                <span className="font-medium">Email sent!</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-accent hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend email"}
                </button>
              )}
            </span>
          </div>
        )}

        <p className="text-muted text-center text-sm">
          Already verified?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
