import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { AccentTitle } from "@/components/reusables";

export function FinalCTA() {
  return (
    <section className="relative z-10 py-28 max-w-7xl mx-auto px-6">
      <div className="rounded-3xl border border-border bg-card/80 p-10 md:p-16 backdrop-blur-xl shadow-lg text-center md:text-left">
        <h2 className="max-w-3xl text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Your next interview <AccentTitle>starts here.</AccentTitle>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Practice smarter, get personalized feedback, and walk into your next
          interview with confidence.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row md:justify-start justify-center">
          <SignUpButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignUpButton>

          <Button size="lg" variant="outline">
            Browse Interviewers
          </Button>
        </div>
      </div>
    </section>
  );
}