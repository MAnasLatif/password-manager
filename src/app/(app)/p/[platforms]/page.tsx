import PlatformDetailPage from "@/components/app/platform-detail-page";
import type { Account, Platform } from "@/types";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Platform Accounts",
  description: "View and manage accounts for this platform.",
};

// Mock data - replace with actual data fetching
const platformsData: Record<string, Platform> = {
  "google.com": { name: "Google", domain: "google.com", count: 3 },
  "github.com": { name: "GitHub", domain: "github.com", count: 2 },
  "netflix.com": { name: "Netflix", domain: "netflix.com", count: 1 },
  "figma.com": { name: "Figma", domain: "figma.com", count: 4 },
  "linkedin.com": { name: "LinkedIn", domain: "linkedin.com", count: 2 },
  "aws.amazon.com": { name: "AWS", domain: "aws.amazon.com", count: 1 },
  "upvave.com": { name: "Upvave", domain: "upvave.com", count: 1 },
};

// Mock accounts data - replace with actual data fetching
const accountsData: Record<string, Account[]> = {
  "google.com": [
    {
      id: "1",
      email: "manas@example.com",
      username: "Manas Latif",
      hasPassword: true,
      label: "Personal",
    },
    {
      id: "2",
      email: "work@company.com",
      username: "Work Account",
      hasPassword: true,
      label: "Work",
      notes: "Main work Google account",
      sharedWith: [
        {
          id: "u1",
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
        },
        {
          id: "u2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          image: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
        },
        {
          id: "u3",
          name: "Bob Wilson",
          email: "bob.wilson@example.com",
          image: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/yellow.jpg",
        },
        {
          id: "u4",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          image: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
        },
      ],
    },
    {
      id: "3",
      email: "dev@gmail.com",
      label: "Development",
      notes: "For testing APIs",
    },
  ],
  "github.com": [
    {
      id: "4",
      email: "manas@github.com",
      username: "manaslatif",
    },
    {
      id: "5",
      email: "team@company.com",
      username: "company-team",
      hasPassword: true,
      label: "Team",
      sharedWith: [
        { id: "u1", name: "John Doe" },
        { id: "u2", name: "Jane Smith" },
        { id: "u3", name: "Bob Wilson" },
      ],
    },
  ],
  "netflix.com": [
    {
      id: "6",
      email: "family@example.com",
      username: "Family Account",
      hasPassword: true,
      notes: "Shared family Netflix",
      sharedWith: [
        { id: "u1", name: "Mom" },
        { id: "u2", name: "Dad" },
        { id: "u3", name: "Sister" },
      ],
    },
  ],
  "figma.com": [
    {
      id: "7",
      email: "design@company.com",
      username: "Design Team",
      label: "Design",
      hasPassword: true,
      sharedWith: [
        {
          id: "u1",
          name: "Sarah Designer",
          image: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
        },
      ],
    },
    {
      id: "8",
      email: "manas@figma.com",
      username: "Personal Figma",
    },
    {
      id: "9",
      email: "freelance@gmail.com",
      hasPassword: true,
      label: "Freelance",
      notes: "Client projects",
    },
    {
      id: "10",
      email: "education@edu.com",
      label: "Education",
      hasPassword: true,
      notes: "Figma Education plan",
    },
  ],
  "linkedin.com": [
    {
      id: "11",
      email: "manas@linkedin.com",
      hasPassword: true,
      username: "Manas Latif",
    },
    {
      id: "12",
      email: "recruiter@company.com",
      label: "Recruiting",
      notes: "Company recruiting account",
    },
  ],
  "aws.amazon.com": [
    {
      id: "13",
      email: "aws@company.com",
      username: "AWS Root",
      label: "Production",
      hasPassword: true,
      notes: "IMPORTANT: Root account - use IAM users",
    },
  ],
  "upvave.com": [
    {
      id: "14",
      email: "admin@upvave.com",
      label: "Admin",
    },
  ],
};

export default async function PlatformPage({ params }: { params: Promise<{ platforms: string }> }) {
  const { platforms: platformSlug } = await params;
  const decodedSlug = decodeURIComponent(platformSlug);

  const platform = platformsData[decodedSlug] || {
    name: decodedSlug.split(".")[0],
    domain: decodedSlug,
    count: 0,
  };

  const accounts = accountsData[decodedSlug] || [];

  return (
    <Suspense>
      <PlatformDetailPage platform={platform} accounts={accounts} />
    </Suspense>
  );
}
