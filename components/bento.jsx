import {
  Bot,
  Calendar,
  FileText,
  MessageCircle,
  Video,
  Wallet,
} from "lucide-react";

const tags = [
  "Software",
  "Business",
  "Consulting",
  "Healthcare",
  "Finance",
  "Behavioral",
];

const features = [
  {
    icon: Bot,
    title: "AI Question Generator",
    description:
      "Generate company and role-specific interview questions tailored to every session.",
    className: "md:col-span-2",
    extra: (
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              i < 3
                ? "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Wallet,
    title: "Credits",
    description:
      "Purchase monthly credits and use them to book mock interviews.",
    className: "md:col-span-1",
    extra: (
      <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-5">
        <p className="text-sm text-muted-foreground">Your Balance</p>

        <div className="mt-2 flex items-end justify-between">
          <span className="text-5xl font-bold text-violet-600 dark:text-violet-400">
            28
          </span>

          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-600 dark:text-violet-300">
            +10 this month
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Credits remaining
        </p>
      </div>
    ),
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description:
      "Experience realistic HD interview sessions with built-in recording and screen sharing.",
    extra: (
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted/60">
        <div className="flex gap-2 border-b border-border px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>

        <div className="space-y-3 p-4">
          <div className="h-3 w-full rounded bg-background/80" />
          <div className="h-3 w-3/4 rounded bg-background/80" />
          <div className="h-3 w-1/2 rounded bg-violet-500/20" />
        </div>
      </div>
    ),
  },
  {
    icon: MessageCircle,
    title: "Persistent Chat",
    description:
      "Stay connected with your interviewer before and after every session.",
    extra: (
      <div className="mt-6 space-y-2">
        <div className="w-fit rounded-xl bg-violet-500/10 px-3 py-2 text-sm text-violet-700 dark:text-violet-200">
          Ready for tomorrow?
        </div>

        <div className="ml-auto w-fit rounded-xl bg-muted px-3 py-2 text-sm">
          Absolutely! 🚀
        </div>

        <div className="w-fit rounded-xl bg-violet-500/10 px-3 py-2 text-sm text-violet-700 dark:text-violet-200">
          Good luck!
        </div>
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description:
      "Upload your resume and receive AI-powered interview preparation based on your experience.",
    extra: (
      <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-4">
        <p className="font-medium">resume.pdf</p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Projects</span>
            <span className="text-violet-600 dark:text-violet-300">
              ★★★★★
            </span>
          </div>

          <div className="flex justify-between">
            <span>Experience</span>
            <span className="text-violet-600 dark:text-violet-300">
              ★★★★☆
            </span>
          </div>

          <div className="flex justify-between">
            <span>Skills</span>
            <span className="text-violet-600 dark:text-violet-300">
              ★★★★★
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Choose available interview slots and book sessions in seconds.",
    extra: (
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-600 dark:text-violet-300">
          Mon 10:00
        </span>

        <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm">
          Tue 2:00
        </span>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400">
          Wed 9:00 ✓
        </span>

        <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm">
          Thu 3:00
        </span>
      </div>
    ),
  },
];

export default function Bento() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className={`group rounded-3xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl ${
              feature.className || ""
            }`}
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Icon className="h-6 w-6" />
            </div>

            <h3 className="text-2xl font-semibold tracking-tight">
              {feature.title}
            </h3>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {feature.description}
            </p>

            {feature.extra}
          </div>
        );
      })}
    </div>
  );
}