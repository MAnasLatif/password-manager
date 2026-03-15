'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─────────────────────────────────────────────
// Sign Up
// ─────────────────────────────────────────────

export async function signUpAction(formData: { name: string; email: string; password: string }) {
  try {
    const validated = signUpSchema.parse(formData)

    await auth.api.signUpEmail({
      body: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        password: validated.password
      },
      headers: await headers()
    })

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid input' }
    }
    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already exists') || msg.includes('email')) {
        return { success: false, error: 'An account with this email already exists.' }
      }
    }
    return { success: false, error: 'Failed to create account. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// Validate Email (format only, no DB call)
// ─────────────────────────────────────────────

export async function validateEmailAction(email: string) {
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  return { valid: true }
}

// ─────────────────────────────────────────────
// Sign In
// ─────────────────────────────────────────────

export async function signInAction(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const result = await auth.api.signInEmail({
      body: { email: email.toLowerCase().trim(), password }
    })

    if (!result) {
      return { success: false, error: 'Invalid email or password' }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('verify') || msg.includes('verification') || msg.includes('email')) {
        return {
          success: false,
          error: 'Please verify your email before signing in.',
          needsVerification: true
        }
      }
      if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('credentials')) {
        return { success: false, error: 'Invalid email or password' }
      }
      if (msg.includes('not found')) {
        return { success: false, error: 'Invalid email or password' }
      }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// Sign Out
// ─────────────────────────────────────────────

export async function signOutAction() {
  try {
    await auth.api.signOut({ headers: await headers() })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to sign out' }
  }
}

// ─────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────

export async function forgotPasswordAction(email: string) {
  try {
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    await auth.api.requestPasswordReset({
      body: {
        email: email.toLowerCase().trim(),
        redirectTo: '/reset-password'
      },
      headers: await headers()
    })

    return {
      success: true,
      message: 'If an account exists with this email, you will receive a reset link shortly.'
    }
  } catch {
    // Always return success for security — don't reveal if email exists
    return {
      success: true,
      message: 'If an account exists with this email, you will receive a reset link shortly.'
    }
  }
}

// ─────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────

export async function resetPasswordAction(token: string, password: string) {
  try {
    if (!token) {
      return { success: false, error: 'Invalid or missing reset token' }
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' }
    }

    const result = await auth.api.resetPassword({
      body: { token, newPassword: password },
      headers: await headers()
    })

    if (!result) {
      return { success: false, error: 'Failed to reset password. The link may have expired.' }
    }

    return { success: true, message: 'Password reset successfully. You can now sign in.' }
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('expired') || msg.includes('invalid') || msg.includes('token')) {
        return {
          success: false,
          error: 'This reset link has expired or is invalid. Please request a new one.'
        }
      }
    }
    return { success: false, error: 'Failed to reset password. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// Resend Verification Email
// ─────────────────────────────────────────────

export async function resendVerificationAction(email: string) {
  try {
    await auth.api.sendVerificationEmail({
      body: { email: email.toLowerCase().trim() },
      headers: await headers()
    })
    return { success: true }
  } catch {
    // Always return success for security
    return { success: true }
  }
}
