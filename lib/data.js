import {
  PrimaryTitle,
  AccentTitle,
} from "@/components/reusables";

export const AI_TAGS = [
  { label: "Behavioral", active: true },
  { label: "Case Study", active: false },
  { label: "Technical", active: true },
  { label: "Leadership", active: false },
  { label: "Situational", active: true },
  { label: "Panel Interview", active: false },
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
    label: "Candidate",
    title: (
      <>
        <PrimaryTitle>
          Practice with purpose.{" "}
        </PrimaryTitle>

        <AccentTitle>
          Interview with confidence.
        </AccentTitle>
      </>
    ),
    desc:
      "Prepare for interviews across roles and industries with realistic mock sessions, clear feedback, and focused improvement.",
    perks: [
      "Browse coaches by industry and interview type",
      "Book sessions using your monthly credits",
      "Receive AI-powered feedback after every interview",
      "Review recordings to spot patterns and improve faster",
      "Chat with your coach before and after each session",
    ],
  },
  {
    label: "Coach",
    title: (
      <>
        <PrimaryTitle>
          Help candidates{" "}
        </PrimaryTitle>

        <AccentTitle>
          perform at their best.
        </AccentTitle>
      </>
    ),
    desc:
      "Share your experience, run mock interviews, give useful feedback, and help candidates prepare for real opportunities.",
    perks: [
      "Choose your own availability",
      "Coach candidates across different industries",
      "Use AI-generated questions tailored to each candidate",
      "Track your sessions and earnings from one dashboard",
    ],
  },
];

export const CATEGORIES = [
  { value: null, label: "All" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "CASE_STUDY", label: "Case Study" },
  { value: "LEADERSHIP", label: "Leadership" },
  { value: "SITUATIONAL", label: "Situational" },
  { value: "PANEL", label: "Panel Interview" },
  { value: "GENERAL", label: "General" },
];

export const CATEGORY_LABEL = {
  BEHAVIORAL: "Behavioral",
  TECHNICAL: "Technical",
  CASE_STUDY: "Case Study",
  LEADERSHIP: "Leadership",
  SITUATIONAL: "Situational",
  PANEL: "Panel Interview",
  GENERAL: "General",
};

export const INDUSTRIES = [
  { value: "TECH", label: "Technology" },
  { value: "FINANCE", label: "Finance" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "MARKETING", label: "Marketing" },
  { value: "SALES", label: "Sales" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "EDUCATION", label: "Education" },
  { value: "LEGAL", label: "Legal" },
  {
    value: "HUMAN_RESOURCES",
    label: "Human Resources",
  },
  { value: "GENERAL", label: "General" },
];

export const INDUSTRY_LABEL = {
  TECH: "Technology",
  FINANCE: "Finance",
  CONSULTING: "Consulting",
  MARKETING: "Marketing",
  SALES: "Sales",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  LEGAL: "Legal",
  HUMAN_RESOURCES: "Human Resources",
  GENERAL: "General",
};

export const YEARS_OPTIONS = [
  { value: 1, label: "1 Year" },
  { value: 2, label: "2 Years" },
  { value: 3, label: "3 Years" },
  { value: 5, label: "5 Years" },
  { value: 7, label: "7 Years" },
  { value: 10, label: "10+ Years" },
];

export const ONBOARDING_ROLES = [
  {
    value: "INTERVIEWEE",
    icon: "🎯",
    title: "Practice Interviews",
    desc:
      "Prepare for interviews in any field, improve your answers, and build confidence before the real thing.",
  },
  {
    value: "INTERVIEWER",
    icon: "🧑‍🏫",
    title: "Coach Candidates",
    desc:
      "Help candidates prepare by sharing your experience, running mock sessions, and giving practical feedback.",
  },
];

export const RATING_CONFIG = {
  POOR: {
    label: "Needs Improvement",
    emoji: "⚠️",
    className:
      "border-red-500/25 text-red-600 dark:text-red-400",
    bg: "from-red-500/15",
  },

  AVERAGE: {
    label: "Average",
    emoji: "📈",
    className:
      "border-amber-500/25 text-amber-600 dark:text-amber-400",
    bg: "from-amber-500/15",
  },

  GOOD: {
    label: "Good",
    emoji: "✨",
    className:
      "border-violet-500/25 text-violet-600 dark:text-violet-300",
    bg: "from-violet-500/15",
  },

  EXCELLENT: {
    label: "Excellent",
    emoji: "🏆",
    className:
      "border-emerald-500/25 text-emerald-600 dark:text-emerald-400",
    bg: "from-emerald-500/15",
  },
};

export const RATING_LABEL = {
  POOR: "Needs Improvement",
  AVERAGE: "Average",
  GOOD: "Good",
  EXCELLENT: "Excellent",
};

export const RATING_STYLES = {
  POOR:
    "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",

  AVERAGE:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",

  GOOD:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-300",

  EXCELLENT:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export const STATUS_STYLES = {
  SCHEDULED:
    "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",

  COMPLETED:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

  CANCELLED:
    "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",

  NO_SHOW:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};