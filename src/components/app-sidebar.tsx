"use client";

import { Accordion, Button, cn } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Circle,
  Code2,
  LockKeyhole,
  Palette,
  Plus,
  Rocket,
  Star,
  User,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import type { SidebarItem as SidebarItemType } from "@/types";

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
  {
    id: "social",
    type: "tag",
    label: "Social",
    slug: "social",
    icon: "",
    color: "#3b82f6",
  },
  {
    id: "email",
    type: "tag",
    label: "Email",
    slug: "email",
    icon: "",
    color: "#a855f7",
  },
  {
    id: "finance",
    type: "tag",
    label: "Finance",
    slug: "finance",
    icon: "",
    color: "#22c55e",
  },
  {
    id: "work",
    type: "tag",
    label: "Work",
    slug: "work-tag",
    icon: "",
    color: "#f97316",
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
  { title: "Tags", items: data.filter((item) => item.type === "tag") },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const normalizePath = (value: string) => value.replace(/\/+$/, "") || "/";
  const isClient = useIsClient();

  // Store expanded accordion sections in localStorage
  const [expandedKeysArray, setExpandedKeysArray] = useLocalStorage<string[]>(
    "sidebar-expanded-sections",
    menuItems.map((section) => section.title),
  );

  // Use default expanded keys during SSR/hydration, then switch to localStorage value
  const expandedKeys = isClient
    ? new Set(expandedKeysArray)
    : new Set(menuItems.map((section) => section.title));

  const getItemHref = (section: SidebarSection, item: SidebarItemType) => {
    const segments = [section.title[0].toLocaleLowerCase(), item.slug].filter(Boolean);
    return segments.length ? `/${segments.join("/")}` : "/";
  };

  const isActive = (section: SidebarSection, item: SidebarItemType) =>
    normalizePath(pathname) === normalizePath(getItemHref(section, item));

  return (
    <aside className={cn(className)}>
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
          href="/favorites"
          aria-current={normalizePath(pathname) === "/favorites" ? "page" : undefined}
        >
          <Button
            variant={normalizePath(pathname) === "/favorites" ? "primary" : "ghost"}
            className="w-full justify-start gap-3"
            size="sm"
          >
            <Star />
            Favorites
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
                expandedKeys={expandedKeys}
                onExpandedChange={(keys) => setExpandedKeysArray(Array.from(keys).map(String))}
              >
                <Accordion.Item id={section.title}>
                  <Accordion.Heading>
                    <Accordion.Trigger className="flex w-full items-center justify-between rounded-3xl px-3 py-1">
                      <span className="text-muted text-xs uppercase">{section.title}</span>
                      <Accordion.Indicator className="text-muted">
                        <ChevronDown className="size-4" />
                      </Accordion.Indicator>
                    </Accordion.Trigger>
                    {section.title !== "Tags" && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={`Add ${section?.title?.slice(0, -1)}`}
                      >
                        <Plus className="size-4 text-muted" />
                      </Button>
                    )}
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
                              {item.type === "tag" ? (
                                <Circle
                                  className="size-3.5 shrink-0"
                                  fill={item.color}
                                  stroke={item.color}
                                />
                              ) : (
                                ICon && <ICon />
                              )}
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
