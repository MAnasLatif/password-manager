"use client";

import { Button, ButtonGroup, Card, Chip, Input, Link } from "@heroui/react";
import { ThemeToggle } from "./ThemeSwitcher";

const capabilityCards = [
  {
    eyebrow: "Design system",
    title: "Semantic tokens are ready",
    description:
      "HeroUI theme variables are available globally, so new screens can use shared color and spacing language immediately.",
  },
  {
    eyebrow: "Components",
    title: "React 19-friendly primitives",
    description:
      "Buttons, inputs, cards, and the rest of the HeroUI surface area are available from the v3 release candidate line.",
  },
  {
    eyebrow: "Workflow",
    title: "Tailwind v4 stays in charge",
    description:
      "HeroUI layers cleanly on top of Tailwind, which means your utility-first workflow still feels natural and fast.",
  },
];

const integrationChecks = [
  "Installed @heroui/react and @heroui/styles on the v3 rc channel",
  "Imported HeroUI styles after Tailwind in the global stylesheet",
  "Replaced the starter page with live HeroUI components",
];

export function HeroUIShowcase() {
  return (
    <main className="relative isolate overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-end px-6">
        <ThemeToggle />
      </header>
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Chip color="success" variant="soft">
              HeroUI v3 is configured
            </Chip>

            <div className="space-y-4">
              <p className="text-accent text-sm font-semibold tracking-[0.32em] uppercase">
                MAnasPM
              </p>
              <h1 className="text-foreground max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                A polished UI foundation for the password management workspace.
              </h1>
              <p className="text-muted max-w-2xl text-lg leading-8">
                HeroUI is now wired into this Next.js app with Tailwind v4, so we can move from
                starter templates to real product screens without fighting the design system.
              </p>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                aria-label="Workspace email"
                fullWidth
                placeholder="team@manaspm.com"
                variant="secondary"
              />

              <ButtonGroup className="w-full sm:w-auto" variant="secondary">
                <Button>Preview dashboard</Button>
                <Button>
                  <ButtonGroup.Separator />
                  Build next screen
                </Button>
              </ButtonGroup>
            </div>

            <div className="text-muted flex flex-wrap items-center gap-4 text-sm">
              <Link
                className="text-foreground font-medium"
                href="https://v3.heroui.com/docs/react/getting-started/quick-start"
                target="_blank"
              >
                HeroUI quick start
              </Link>
              <Link
                className="text-foreground font-medium"
                href="https://v3.heroui.com/themes"
                target="_blank"
              >
                Theme builder
              </Link>
            </div>
          </div>

          <Card className="border border-white/70 bg-white/75 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 dark:shadow-[0_24px_80px_-32px_rgba(0,0,0,0.8)]">
            <Card.Header className="gap-4">
              <div className="flex flex-wrap gap-2">
                <Chip color="accent" size="sm" variant="soft">
                  Tailwind v4
                </Chip>
                <Chip color="success" size="sm" variant="soft">
                  React 19
                </Chip>
                <Chip color="warning" size="sm" variant="soft">
                  v3 rc
                </Chip>
              </div>
              <Card.Title className="text-2xl">Integration status</Card.Title>
              <Card.Description className="text-muted max-w-lg text-sm leading-7">
                The project now uses HeroUI&apos;s global styles and component primitives. This card
                is rendered with HeroUI itself, so if you can see it, the setup is live.
              </Card.Description>
            </Card.Header>

            <Card.Content className="grid gap-3">
              {integrationChecks.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-black/5 bg-black/2 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="bg-accent-soft text-accent flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    0{index + 1}
                  </div>
                  <p className="text-foreground text-sm leading-6">{item}</p>
                </div>
              ))}
            </Card.Content>

            <Card.Footer className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-foreground text-sm font-medium">Next step</p>
                <p className="text-muted text-sm">
                  Swap this showcase for your first product flow.
                </p>
              </div>
              <Button variant="secondary">Start composing</Button>
            </Card.Footer>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {capabilityCards.map((card) => (
            <Card
              key={card.title}
              className="border border-white/70 bg-white/70 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.5)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-[0_18px_50px_-36px_rgba(0,0,0,0.8)]"
            >
              <Card.Header className="gap-2">
                <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
                  {card.eyebrow}
                </p>
                <Card.Title className="text-xl">{card.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-muted text-sm leading-7">{card.description}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
