import { PrimaryTitle, AccentTitle } from "@/components/reusables";

export const AI_TAGS = [
  { label: "Frontend Engineer", active: true },
  { label: "Junior Level", active: true },
  { label: "React Performance", active: false },
  { label: "System Design", active: false },
  { label: "Behavioral", active: true },
  { label: "DSA", active: false },
];

export const SLOTS = [
  {
    label: "Mon 10:00 AM",
    cls: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    label: "Mon 2:00 PM",
    cls: "border-border text-muted-foreground",
  },
  {
    label: "Tue 11:00 AM",
    cls: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    label: "Wed 9:00 AM ✓",
    cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Thu 3:00 PM",
    cls: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
];

export const ROLES = [
  {
    label: "Interviewee",
    title: (
      <>
        <PrimaryTitle>Land the role </PrimaryTitle>
        <AccentTitle>you deserve.</AccentTitle>
      </>
    ),
    desc:
      "Practice mock interviews with experienced engineers, receive AI-powered feedback, and build the confidence to succeed in real interviews.",
    perks: [
      "Browse interviewers by Frontend, Backend, DSA, System Design, and Behavioral",
      "Book sessions using your monthly credits",
      "Receive detailed AI feedback after every interview",
      "Replay interview recordings to track your progress",
      "Chat with your interviewer before and after each session",
    ],
  },
  {
    label: "Interviewer",
    title: (
      <>
        <PrimaryTitle>Help others </PrimaryTitle>
        <AccentTitle>grow their careers.</AccentTitle>
      </>
    ),
    desc:
      "Share your industry experience, conduct mock interviews, and help candidates improve while earning through the platform.",
    perks: [
      "Choose your own availability",
      "Conduct technical and behavioral interviews",
      "Use AI-generated questions tailored to each candidate",
      "Track your sessions and earnings from one dashboard",
    ],
  },
];