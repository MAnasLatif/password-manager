import { ThemeToggle } from '@/components/ThemeSwitcher'

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-svh">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="ghost" />
      </div>
      <main className="flex min-h-svh items-center justify-center px-4 py-16">{children}</main>
    </div>
  )
}
