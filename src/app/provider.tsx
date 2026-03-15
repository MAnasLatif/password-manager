"use client";

import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem>
      <NextTopLoader color="#6f42c1" showSpinner={false} />
      <Toast.Provider />
      {children}
    </ThemeProvider>
  );
}
