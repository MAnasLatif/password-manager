import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Provider from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "MAnasPM",
      template: `%s - MAnasPM`,
    },
    description: "MAnasPM is a simple password manager to organize and protect your passwords.",
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "any", type: "image/x-icon" },
        {
          url: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/favicon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      shortcut: "/favicon-16x16.png",
      apple: "/favicon/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} fixed top-0 right-0 bottom-0 left-0 z-0 flex flex-col overflow-hidden bg-background text-foreground antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
