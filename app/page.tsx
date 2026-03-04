import { LandingHeader } from "@/components/landingpage/lading-header";
import { LandingHero } from "@/components/landingpage/landing-hero";
import { LandingFooter } from "@/components/landingpage/landing-footer";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />
      <LandingHero />
      <Suspense fallback={<div>Loading...</div>}>
        <LandingFooter />
      </Suspense>
    </main>
  );
}
