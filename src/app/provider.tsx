"use client";

import { RouterProvider, Toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem>
        <NextTopLoader color="#6f42c1" showSpinner={false} />
        <Toast.Provider />
        {children}
      </ThemeProvider>
    </RouterProvider>
  );
}
