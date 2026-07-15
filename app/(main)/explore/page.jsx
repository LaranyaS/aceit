import { getInterviewers } from "@/action/explore";
import { PageHeader } from "@/components/reusables";
import ExploreGrid from "./components/ExploreGrid";

export default async function ExplorePage() {
  const interviewers = await getInterviewers();

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        label="Explore"
        gray="Find the right"
        gold="interview coach"
        description="Browse experienced professionals across industries, compare coaching styles, and book mock interview sessions."
      />

      <div className="mx-auto max-w-7xl px-6 pb-16">
        <ExploreGrid interviewers={interviewers} />
      </div>
    </main>
  );
}