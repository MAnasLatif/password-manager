"use client";

import { ThemeProvider } from "next-themes";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
