import AddPasswordPage from "@/components/app/add-password-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add Password",
  description: "Add a new account password to your vault.",
};

export default function NewPage() {
  return (
    <>
      <div className="max-w-2xl flex-1">
        <Suspense>
          <AddPasswordPage />
        </Suspense>
      </div>
      <div className="w-24" />
    </>
  );
}
