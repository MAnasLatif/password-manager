import HomePage from "@/components/app/page";
import type { Platform } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Vault",
  description: "my protected vault of accounts and passwords secured with MAnasPM.",
};

const platforms: Platform[] = [
  {
    id: "1",
    name: "Google",
    domain: "google.com",
    count: 3,
  },
  {
    id: "2",
    name: "GitHub",
    domain: "github.com",
    count: 2,
  },
  {
    id: "3",
    name: "Netflix",
    domain: "netflix.com",
    count: 1,
  },
  {
    id: "4",
    name: "Figma",
    domain: "figma.com",
    count: 4,
  },
  {
    id: "5",
    name: "LinkedIn",
    domain: "linkedin.com",
    count: 2,
  },
  {
    id: "6",
    name: "AWS",
    domain: "aws.amazon.com",
    count: 1,
  },
  {
    id: "7",
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
