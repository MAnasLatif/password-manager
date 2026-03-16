import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppStateProvider } from "@/contexts/app-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Vault",
  description: "HeroUI-powered foundation for the MAnasPM application.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppStateProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1 gap-4">
          <AppSidebar />
          <main className="flex-1 p-2">{children}</main>
        </div>
      </div>
    </AppStateProvider>
  );
}
