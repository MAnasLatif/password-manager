import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAnasPM",
  description: "HeroUI-powered foundation for the MAnasPM application.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
