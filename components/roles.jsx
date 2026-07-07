import { CheckCircle2 } from "lucide-react";
import { AccentTitle, SectionLabel } from "@/components/reusables";

const roles = [
  {
    label: "Candidate",
    title: "Prepare with confidence.",
    description:
      "Build your interview skills through realistic mock interviews, personalized AI feedback, and expert guidance across different industries.",
    perks: [
      "Practice interviews across tech, business, consulting, healthcare, finance, and more",
      "Upload your resume for personalized interview preparation",
      "Receive AI-powered feedback after every session",
      "Review recordings and notes after the call",
      "Track your progress over time",
    ],
  },
  {
    label: "Interviewer",
    title: "Share your expertise.",
    description:
      "Help candidates grow by hosting mock interviews, sharing real-world experience, and earning rewards for completed sessions.",
    perks: [
      "Create your own interview schedule",
      "Conduct live mock interviews with candidates",
      "Use AI-assisted interview question generation",
      "Chat with candidates before and after sessions",
      "Manage interviews, earnings, and availability from one dashboard",
    ],
  },
];

export function Roles() {
  return (
    <section className="relative z-10 py-28 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <SectionLabel>Who it&apos;s for</SectionLabel>

        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          One platform.{" "}
          <AccentTitle>Two ways to grow.</AccentTitle>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Whether you&apos;re preparing for an interview or helping others
          improve, AceIt gives both sides the tools to make every session count.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.label}
            className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl"
          >
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              {role.label}
            </span>

            <h3 className="mt-8 text-3xl font-semibold">{role.title}</h3>

            <p className="mt-4 text-muted-foreground leading-7">
              {role.description}
            </p>

            <ul className="mt-8 space-y-4">
              {role.perks.map((perk) => (
                <li key={perk} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}