"use client";

import { Alert, Button, cn, Input, Label, Spinner, TextField } from "@heroui/react";
import { Eye, EyeOff, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { resendVerificationAction, signUpAction } from "@/app/actions/auth";

export default function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isPasswordValid = password.length >= 8;
  const isEmailValid = email.includes("@") && email.includes(".");
  const isFormValid = name.trim().length >= 2 && isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await signUpAction({ name, email, password });

      if (!result.success) {
        setError(result.error ?? "Failed to create account. Please try again.");
        return;
      }

      setSubmittedEmail(email);
      setIsSubmitted(true);
    });
  };

  const handleResend = async () => {
    setResendLoading(true);
    await resendVerificationAction(submittedEmail);
    setResendLoading(false);
    setResendSuccess(true);
  };

  // Success state — check your email
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
          </div>

          <div className="space-y-1 text-center">
            <h1 className="font-bold text-xl">Check Your Email</h1>
            <p className="text-muted text-sm">We&apos;ve sent a verification link to</p>
          </div>

          <div className="rounded-lg bg-accent-soft p-3 text-center">
            <p className="font-medium text-accent">{submittedEmail}</p>
          </div>

          <div className="space-y-2 text-center text-muted text-sm">
            <p>Click the link in the email to verify your address and access your vault.</p>
            <p>The link will expire in 24 hours.</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted" />
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

          <p className="text-center text-muted text-sm">
            Already verified?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Sign up form
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
            <h1 className="font-bold text-xl">Create your account</h1>
            <p className="text-muted text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert status="danger" className="w-full rounded-2xl border border-border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {/* Full Name */}
          <TextField
            type="text"
            isRequired
            value={name}
            onChange={(value) => {
              setName(value);
              setError("");
            }}
            isDisabled={isPending}
            autoFocus
          >
            <Label>Full Name</Label>
            <Input placeholder="John Doe" />
          </TextField>

          {/* Email */}
          <TextField
            type="email"
            isRequired
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError("");
            }}
            isDisabled={isPending}
          >
            <Label>Email</Label>
            <Input placeholder="you@example.com" />
          </TextField>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">
              Password <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isPending}
                required
                minLength={8}
                className="input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-foreground focus:outline-none"
                disabled={isPending}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && !isPasswordValid && (
              <p className="text-danger text-xs">Password must be at least 8 characters</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={!isFormValid || isPending}
            isPending={isPending}
            className="w-full"
          >
            {({ isPending: pending }) => (
              <>
                {pending && <Spinner color="current" size="sm" />}
                {pending ? "Creating account..." : "Create account"}
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="px-6 text-center text-muted text-xs">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
