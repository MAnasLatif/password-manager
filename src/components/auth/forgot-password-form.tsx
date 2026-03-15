"use client";

import { Alert, Button, cn, Input, Label, Spinner, TextField } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isEmailValid = email.includes("@") && email.includes(".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await forgotPasswordAction(email);

      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    });
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full">
              <Image
                src="/logo.svg"
                alt="MAnasPM logo"
                width={120}
                height={120}
                className="size-30"
              />
            </div>
            <h1 className="text-xl font-bold">Check Your Email</h1>
            <p className="text-muted text-sm">
              If an account exists with <span className="text-foreground font-medium">{email}</span>
              on MAnasPM, you will receive a password reset link shortly.
            </p>
          </div>

          <Alert status="accent" className="border-border w-full rounded-2xl border shadow-none">
            <Alert.Indicator />
            <Alert.Content className="gap-1">
              <Alert.Description>
                Please check your inbox and spam folder. The reset link will expire in 1 hour.
              </Alert.Description>
            </Alert.Content>
          </Alert>

          <Link
            href="/login"
            className="bg-accent text-accent-foreground hover:bg-accent-hover flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full">
              <Image
                src="/logo.svg"
                alt="MAnasPM logo"
                width={120}
                height={120}
                className="size-30"
              />
            </div>
            <h1 className="text-xl font-bold">Forgot your password?</h1>
            <p className="text-muted text-sm">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert status="danger" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {/* Email Field */}
          <TextField
            type="email"
            isRequired
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError("");
            }}
            isDisabled={isPending}
            autoFocus
          >
            <Label>Email</Label>
            <Input placeholder="you@example.com" />
          </TextField>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={!isEmailValid || isPending}
            isPending={isPending}
            className="w-full"
          >
            {({ isPending: pending }) => (
              <>
                {pending && <Spinner color="current" size="sm" />}
                {pending ? "Sending..." : "Send reset link"}
              </>
            )}
          </Button>

          {/* Back to login */}
          <p className="text-muted text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
