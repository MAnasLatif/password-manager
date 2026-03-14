import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Manager",
  description: "HeroUI-powered foundation for the Account Manager application.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
