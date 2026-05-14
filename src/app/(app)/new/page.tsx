import type { Metadata } from "next";
import { Suspense } from "react";
import AddPasswordPage from "@/components/app/add-password-page";

export const metadata: Metadata = {
  title: "Add Password",
  description: "Add a new account password to your vault.",
};

export default function NewPage() {
  return (
    <Suspense>
      <AddPasswordPage />
    </Suspense>
  );
}
