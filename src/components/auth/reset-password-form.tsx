"use client";

import { Alert, Button, cn, Spinner } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { resetPasswordAction } from "@/app/actions/auth";

export default function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login?error=invalid-reset-token");
    }
  }, [token, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(token, password);

      if (!result.success) {
        setError(result.error ?? "Failed to reset password");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    });
  };

  // Success state
  if (success) {
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
            <h1 className="text-xl font-bold">Password Reset Successful</h1>
            <p className="text-muted text-sm">Your password has been updated.</p>
          </div>

          <Alert status="accent" className="border-border w-full rounded-2xl border shadow-none">
            <Alert.Indicator />
            <Alert.Content className="gap-1">
              <Alert.Description>
                You can now sign in with your new password. Redirecting to login page...
              </Alert.Description>
            </Alert.Content>
          </Alert>

          <Link
            href="/login"
            className="bg-accent text-accent-foreground hover:bg-accent-hover flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors"
          >
            Go to Sign In
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
            <h1 className="text-xl font-bold">Reset your password</h1>
            <p className="text-muted text-sm">Enter your new password below.</p>
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

          {!token && (
            <Alert status="danger" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>
                  Invalid or missing reset token. Please request a new password reset link.
                </Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              New Password <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isPending || !token}
                required
                autoFocus
                minLength={8}
                className="input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={isPending || !token}
                required
                minLength={8}
                className={cn("input w-full pr-10", {
                  "border-danger": confirmPassword && !doPasswordsMatch,
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                disabled={isPending}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !doPasswordsMatch && (
              <p className="text-danger text-xs">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={!isPasswordValid || !doPasswordsMatch || isPending || !token}
            isPending={isPending}
            className="w-full"
          >
            {({ isPending: pending }) => (
              <>
                {pending && <Spinner color="current" size="sm" />}
                {pending ? "Resetting..." : "Reset password"}
              </>
            )}
          </Button>

          <p className="text-muted text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <p className="text-muted px-6 text-center text-xs">
        If you didn&apos;t request a password reset, you can safely ignore this page.
      </p>
    </div>
  );
}
