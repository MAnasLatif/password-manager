import HomePage from "@/components/app/page";
import type { Platform } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Vault",
  description: "my protected vault of accounts and passwords secured with MAnasPM.",
};

const platforms: Platform[] = [
  {
    name: "Google",
    domain: "google.com",
    count: 3,
  },
  {
    name: "GitHub",
    domain: "github.com",
    count: 2,
  },
  {
    name: "Netflix",
    domain: "netflix.com",
    count: 1,
  },
  {
    name: "Figma",
    domain: "figma.com",
    count: 4,
  },
  {
    name: "LinkedIn",
    domain: "linkedin.com",
    count: 2,
  },
  {
    name: "AWS",
    domain: "aws.amazon.com",
    count: 1,
  },
  {
    name: "Upvave",
    domain: "upvave.com",
    count: 1,
  },
];

export default function Home() {
  return (
    <>
      <div className="max-w-2xl flex-1">
        <HomePage platforms={platforms} />
      </div>
      <div className="w-24" />
    </>
  );
}
