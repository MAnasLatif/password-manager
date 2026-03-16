"use client";

import { Button } from "@heroui/react";
import { Plus, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";
import type { SidebarItem as SidebarItemType } from "@/types";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  LockKeyhole,
  Palette,
  Rocket,
  UserRound,
} from "lucide-react";

const Icons: {
  [key: string]: LucideIcon;
} = {
  User: User,
  Users: Users,
  ArrowUpRight: ArrowUpRight,
  BriefcaseBusiness: BriefcaseBusiness,
  Code2: Code2,
  LockKeyhole: LockKeyhole,
  Palette: Palette,
  Rocket: Rocket,
  UserRound: UserRound,
};

const data: SidebarItemType[] = [
  {
    id: "vault",
    label: "My Vault",
    slug: "",
    icon: "User",
    description:
      "Your personal vault for all credentials and notes. Access your most important items and recent activity here.",
  },
  {
    id: "shared",
    label: "Shared With Me",
    slug: "shared",
    icon: "Users",
    description: "Credentials and notes shared with you by teammates across active projects.",
  },
  {
    id: "work",
    type: "collection",
    label: "Work",
    slug: "work",
    icon: "BriefcaseBusiness",
    description:
      "Store company tools, back-office portals, and everyday business credentials in one place.",
  },
  {
    id: "personal",
    type: "collection",
    label: "Personal",
    slug: "personal",
    icon: "UserRound",
    description:
      "Separate personal accounts from the rest of your stack without losing easy access.",
  },
  {
    id: "development",
    type: "collection",
    label: "Development",
    slug: "development",
    icon: "Code2",
    description:
      "Keep development credentials organized and separate from production and personal items.",
  },
  {
    id: "frontend-team",
    type: "team",
    label: "Frontend Team",
    slug: "frontend-team",
    icon: "Palette",
    description:
      "Coordinate design system access, analytics tools, and preview environments for the UI crew.",
  },
  {
    id: "devops-team",
    type: "team",
    label: "DevOps Team",
    slug: "devops-team",
    icon: "Rocket",
    description:
      "Keep infrastructure access, production credentials, and runbooks easy to audit and rotate.",
  },
];

interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarItemType[];
}

const menuItems: SidebarSection[] = [
  { id: "main", items: data.filter((item) => !item.type) },
  {
    id: "collections",
    title: "Collections",
    items: data.filter((item) => item.type === "collection"),
  },
  { id: "teams", title: "Teams", items: data.filter((item) => item.type === "team") },
];

export function AppSidebar() {
  const pathname = usePathname();
  const getItemHref = (item: SidebarItemType) =>
    `/${item.type && `${item.type}/`}${item.slug || ""}`;

  const isActive = (item: SidebarItemType) => pathname === getItemHref(item);

  return (
    <aside className="w-full max-w-52 shrink-0 px-2 py-4">
      <nav className="flex h-full flex-col gap-2">
        {menuItems.map((section) => (
          <div key={section.id}>
            {section.title && (
              <div className="flex items-center justify-between px-3">
                <p className="text-muted text-xs uppercase">{section.title}</p>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  aria-label={`Add ${section.title.slice(0, -1)}`}
                >
                  <Plus className="text-muted size-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {section?.items?.map((item) => {
                const ICon = Icons[item.icon];
                return (
                  <Link
                    key={item.id}
                    href={getItemHref(item)}
                    aria-current={isActive(item) ? "page" : undefined}
                  >
                    <Button
                      variant={isActive(item) ? "primary" : "ghost"}
                      className="w-full justify-start gap-3"
                      size="sm"
                    >
                      <ICon />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
