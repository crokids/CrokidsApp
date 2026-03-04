import { CrokidsLogo } from "@/components/landingpage/crokids-logo"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react"

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <CrokidsLogo />
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Suspense>
              <AuthButton />
            </Suspense>
        </div>
      </nav>
    </header>
  )
}
