import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getMyAvailability } from "@/action/availability";
import AvailabilityManager from "./components/AvailabilityManager";
import { Button } from "@/components/ui/button";
import {
  AccentTitle,
  PrimaryTitle,
  SectionLabel,
} from "@/components/reusables";

export default async function AvailabilityPage() {
  const availability = await getMyAvailability();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-12 text-foreground">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Button
          variant="ghost"
          className="mb-8 gap-2"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <header className="mb-12">
          <SectionLabel>
            Coach availability
          </SectionLabel>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            <PrimaryTitle>
              Choose when candidates{" "}
            </PrimaryTitle>

            <AccentTitle>
              can book you.
            </AccentTitle>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Add the dates and time windows when you are
            available. AceIt will automatically turn each
            window into 45-minute mock-interview slots.
          </p>
        </header>

        <AvailabilityManager
          initialAvailability={availability}
        />
      </div>
    </main>
  );
}