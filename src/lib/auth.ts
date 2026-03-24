import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { name: string; email: string };
      url: string;
    }) => {
      await sendPasswordResetEmail(user.email, {
        name: user.name,
        resetUrl: url,
        expiresInMinutes: 60,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { name: string; email: string };
      url: string;
    }) => {
      await sendVerificationEmail(user.email, {
        name: user.name,
        verificationUrl: url,
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "pm-auth",
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
