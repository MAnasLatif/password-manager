import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppStateProvider } from "@/contexts/app-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Vault",
  description: "",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppStateProvider>
      <div className="h-screen w-screen">
        <AppHeader />
        <div className="flex h-[calc(100dvh-72px)] w-full overflow-auto p-4">
          <AppSidebar className="sticky top-0 h-[calc(100dvh-104px)] w-full max-w-50 overflow-auto" />
          <div className="m-auto h-full w-full max-w-2xl">{children}</div>
          <div className="w-full max-w-25" />
        </div>
      </div>
    </AppStateProvider>
  );
}
