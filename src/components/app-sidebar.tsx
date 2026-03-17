"use client";

import { Accordion, Button } from "@heroui/react";
import { ChevronDown, Plus, User, Users } from "lucide-react";
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
  title: string;
  items: SidebarItemType[];
}

const menuItems: SidebarSection[] = [
  {
    title: "Collections",
    items: data.filter((item) => item.type === "collection"),
  },
  { title: "Teams", items: data.filter((item) => item.type === "team") },
];

export function AppSidebar() {
  const pathname = usePathname();
  const normalizePath = (value: string) => value.replace(/\/+$/, "") || "/";

  const getItemHref = (section: SidebarSection, item: SidebarItemType) => {
    const segments = [section.title[0].toLocaleLowerCase(), item.slug].filter(Boolean);
    return segments.length ? `/${segments.join("/")}` : "/";
  };

  const isActive = (section: SidebarSection, item: SidebarItemType) =>
    normalizePath(pathname) === normalizePath(getItemHref(section, item));

  return (
    <aside className="w-full max-w-52 shrink-0 px-2 py-4">
      <nav className="flex h-full flex-col gap-1">
        <Link href="/" aria-current={normalizePath(pathname) === "/" ? "page" : undefined}>
          <Button
            variant={normalizePath(pathname) === "/" ? "primary" : "ghost"}
            className="w-full justify-start gap-3"
            size="sm"
          >
            <User />
            My Vault
          </Button>
        </Link>
        <Link
          href="/shared"
          aria-current={normalizePath(pathname) === "/shared" ? "page" : undefined}
          className="mb-2"
        >
          <Button
            variant={normalizePath(pathname) === "/shared" ? "primary" : "ghost"}
            className="w-full justify-start gap-3"
            size="sm"
          >
            <Users />
            Shared With Me
          </Button>
        </Link>
        {menuItems.map((section) => {
          // Render sections with accordion
          return (
            <div key={section.title}>
              <Accordion
                className="w-full"
                allowsMultipleExpanded
                defaultExpandedKeys={[section.title]}
              >
                <Accordion.Item id={section.title}>
                  <Accordion.Heading>
                    <Accordion.Trigger className="flex w-full items-center justify-between rounded-3xl px-3 py-1">
                      <span className="text-muted text-xs uppercase">{section.title}</span>
                      <Accordion.Indicator className="text-muted">
                        <ChevronDown className="size-4" />
                      </Accordion.Indicator>
                    </Accordion.Trigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      aria-label={`Add ${section?.title?.slice(0, -1)}`}
                    >
                      <Plus className="text-muted size-4" />
                    </Button>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    <Accordion.Body className="flex flex-col gap-2 px-0 pt-2 pb-4">
                      {section?.items?.map((item) => {
                        const ICon = Icons[item.icon];
                        return (
                          <Link
                            key={item.id}
                            href={getItemHref(section, item)}
                            aria-current={isActive(section, item) ? "page" : undefined}
                          >
                            <Button
                              variant={isActive(section, item) ? "primary" : "ghost"}
                              className="w-full justify-start gap-3"
                              size="sm"
                            >
                              <ICon />
                              <span>{item.label}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
