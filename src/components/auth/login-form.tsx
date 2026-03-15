"use client";

import { Alert, Button, cn, FieldError, Input, Label, Spinner, TextField } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  forgotPasswordAction,
  resendVerificationAction,
  signInAction,
  validateEmailAction,
} from "@/app/actions/auth";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const errorParam = searchParams.get("error");

  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    errorParam === "invalid-reset-token"
      ? "Invalid or expired reset link. Please request a new one."
      : "",
  );
  const [info, setInfo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Clean up error param from URL without re-rendering
  useEffect(() => {
    if (errorParam === "invalid-reset-token") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [errorParam, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (emailError) {
      const timer = setTimeout(() => setEmailError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [emailError]);

  const isPasswordValid = password.length >= 8;

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    startTransition(async () => {
      const result = await validateEmailAction(email);
      if (!result.valid) {
        setEmailError(result.error ?? "Invalid email");
        return;
      }
      setStep("password");
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await signInAction(email, password);

      if (!result.success) {
        if (result.needsVerification) {
          setNeedsVerification(true);
        }
        setError(result.error ?? "Login failed");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
    setError("");
    setNeedsVerification(false);
    setForgotPasswordSuccess(false);
    setResendSuccess(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setError("");
    setForgotPasswordLoading(true);
    setForgotPasswordSuccess(false);

    const result = await forgotPasswordAction(email);
    setForgotPasswordLoading(false);

    if (result.success) {
      setForgotPasswordSuccess(true);
    } else {
      setError(result.error ?? "Failed to send reset email");
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    await resendVerificationAction(email);
    setResendLoading(false);
    setResendSuccess(true);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={step === "email" ? handleEmailContinue : handleLogin}>
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
            <h1 className="text-xl font-bold">Welcome back to MAnasPM</h1>
            <p className="text-muted text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
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

          {/* Info Alert */}
          {info && (
            <Alert status="warning" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>{info}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {/* Needs Verification Banner */}
          {needsVerification && (
            <Alert status="warning" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>Verify your email</Alert.Title>
                <Alert.Description>
                  Your email is not verified. Please check your inbox.
                </Alert.Description>
                {resendSuccess ? (
                  <p className="mt-2 text-sm font-medium">Verification email sent!</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="text-accent mt-2 text-sm hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend verification email"}
                  </button>
                )}
              </Alert.Content>
            </Alert>
          )}

          {/* Forgot Password Success */}
          {forgotPasswordSuccess && (
            <Alert status="accent" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>Password Reset Email Sent!</Alert.Title>
                <Alert.Description>
                  If an account exists with this email, you will receive a reset link shortly.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          {/* Email Step */}
          {step === "email" && (
            <>
              <TextField
                type="email"
                isRequired
                isInvalid={!!emailError}
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setEmailError("");
                  setInfo("");
                }}
                isDisabled={isPending}
                autoFocus
              >
                <Label>Email</Label>
                <Input placeholder="you@example.com" />
                {emailError && <FieldError>{emailError}</FieldError>}
              </TextField>

              <Button
                type="submit"
                isDisabled={!email || isPending}
                isPending={isPending}
                className="w-full"
              >
                {({ isPending: pending }) => (
                  <>
                    {pending && <Spinner color="current" size="sm" />}
                    {pending ? "Validating..." : "Continue"}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Password Step */}
          {step === "password" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Email</label>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-muted hover:text-foreground text-sm"
                    disabled={isPending}
                  >
                    Change
                  </button>
                </div>
                <input type="email" value={email} disabled readOnly className="input w-full" />
              </div>

              {forgotPasswordSuccess ? (
                <Button type="button" onPress={() => router.push("/")} className="w-full">
                  Go to Home
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={forgotPasswordLoading || isPending}
                        className="text-muted hover:text-foreground text-sm disabled:opacity-50"
                      >
                        {forgotPasswordLoading ? "Sending..." : "Forgot password?"}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        disabled={isPending}
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {password && !isPasswordValid && (
                      <p className="text-danger text-xs">Password must be at least 8 characters</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    isDisabled={!isPasswordValid || isPending}
                    isPending={isPending}
                    className="w-full"
                  >
                    {({ isPending: pending }) => (
                      <>
                        {pending && <Spinner color="current" size="sm" />}
                        {pending ? "Signing in..." : "Sign in"}
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </form>

      <p className="text-muted px-6 text-center text-xs">
        By signing in, you agree to our{" "}
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
