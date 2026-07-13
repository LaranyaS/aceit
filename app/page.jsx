import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Header } from "@/components/header";
import Bento from "@/components/bento";
import {
  SectionLabel,
  PrimaryTitle,
  AccentTitle,
} from "@/components/reusables";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { Roles } from "@/components/roles";
import { Membership } from "@/components/Membership";
import { FinalCTA } from "@/components/FinalCTA";
import { syncCurrentUser } from "@/lib/syncCurrentUser";

export default async function Home() {
  const user = await syncCurrentUser();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0 block dark:hidden">
        <HexagonBackground />
      </div>

      <div className="absolute inset-0 z-0 hidden dark:block">
        <StarsBackground />
      </div>

      <div className="relative z-10 px-6">
        <Header />

        <section className="flex min-h-[80vh] flex-col items-center justify-center text-center space-y-6">
          <SectionLabel>AI-powered interview preparation</SectionLabel>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl leading-tight">
            <PrimaryTitle>Practice smarter.</PrimaryTitle>{" "}
            <AccentTitle>Interview better.</AccentTitle>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground leading-8">
            AceIt helps you prepare for interviews with realistic mock practice,
            instant feedback, and personalized improvement tips.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button size="lg">Start Practicing</Button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Button size="lg" asChild>
                <Link href="/onboarding">Start Practicing</Link>
              </Button>
            </Show>

            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
        </section>

        <section
          id="features"
          className="relative py-28 max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              Everything you need to land your next offer.
            </h2>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Practice with experienced engineers, receive AI-powered feedback,
              and improve with every interview.
            </p>
          </div>

          <Bento />
          <Roles />
          <Membership currentPlan={user?.currentPlan ?? "free"} />
          <FinalCTA />
        </section>
      </div>
    </main>
  );
}