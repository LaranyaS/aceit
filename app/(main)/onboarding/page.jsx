"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  MessageSquareText,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { PrimaryTitle, AccentTitle, SectionLabel } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/action/onboarding";
import useFetch from "@/hook/use-fetch";
import { CATEGORIES, ONBOARDING_ROLES, YEARS_OPTIONS } from "@/lib/data";

const candidateBenefits = [
  {
    icon: Target,
    title: "Find coaches",
    desc: "Explore coaches across different interview styles and industries.",
  },
  {
    icon: MessageSquareText,
    title: "Practice answers",
    desc: "Build stronger responses for behavioral, situational, and role-based interviews.",
  },
  {
    icon: BarChart3,
    title: "Improve faster",
    desc: "Use feedback to spot weak areas and track your progress.",
  },
];

const coachBenefits = [
  {
    icon: CalendarCheck,
    title: "Flexible schedule",
    desc: "Choose when you want to coach candidates.",
  },
  {
    icon: Video,
    title: "Mock sessions",
    desc: "Run realistic interviews and help candidates prepare with confidence.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted feedback",
    desc: "Use AI support to create questions and structure better feedback.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, loading, fn: onboardingFn } = useFetch(completeOnboarding);

  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    yearsExp: "",
    bio: "",
    categories: [],
  });

  useEffect(() => {
    if (data && !loading) {
      router.push(role === "INTERVIEWER" ? "/dashboard" : "/explore");
    }
  }, [data, loading, role, router]);

  const selectedRole = ONBOARDING_ROLES.find((item) => item.value === role);

  const completedFields = useMemo(() => {
    if (role === "INTERVIEWEE") return 1;

    return [
      form.title.trim(),
      form.company.trim(),
      form.yearsExp,
      form.bio.trim(),
      form.categories.length > 0,
    ].filter(Boolean).length;
  }, [role, form]);

  const completionPercent =
    role === "INTERVIEWEE" ? 100 : Math.round((completedFields / 5) * 100);

  const isInterviewerValid =
    form.title.trim() &&
    form.company.trim() &&
    form.yearsExp &&
    form.bio.trim() &&
    form.categories.length > 0;

  const canSubmit =
    role === "INTERVIEWEE" || (role === "INTERVIEWER" && isInterviewerValid);

  const benefits = role === "INTERVIEWER" ? coachBenefits : candidateBenefits;

  const toggleCategory = (value) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((category) => category !== value)
        : [...prev.categories, value],
    }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    onboardingFn({
      role,
      ...(role === "INTERVIEWER" && {
        title: form.title,
        company: form.company,
        yearsExp: Number(form.yearsExp),
        bio: form.bio,
        categories: form.categories,
      }),
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-20 text-foreground">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-10 text-center">
          <SectionLabel>Welcome to AceIt</SectionLabel>

          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            {!role ? (
              <>
                <PrimaryTitle>Choose your </PrimaryTitle>
                <AccentTitle>interview path.</AccentTitle>
              </>
            ) : (
              <>
                <PrimaryTitle>Great choice. </PrimaryTitle>
                <AccentTitle>
                  {role === "INTERVIEWER"
                    ? "Build your coach profile."
                    : "Your practice space is ready."}
                </AccentTitle>
              </>
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            AceIt helps candidates prepare for interviews across industries with
            mock practice, useful feedback, and structured improvement.
          </p>
        </div>

        {!role && (
          <>
            <div className="mb-10 rounded-3xl border border-border bg-card/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="text-violet-600 dark:text-violet-300">
                  1. Choose role
                </span>
                <span>2. Personalize</span>
                <span>3. Start</span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-muted">
                <div className="h-2 w-1/5 rounded-full bg-violet-600" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {ONBOARDING_ROLES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 text-left shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-violet-500/20"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-400 to-violet-600 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="absolute right-5 top-5 rounded-full border border-violet-500/30 bg-violet-500/10 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Check className="h-4 w-4 text-violet-600" />
                  </div>

                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-2xl">
                    {item.icon}
                  </span>

                  <h3 className="mb-3 text-2xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-300">
                    Continue <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {role && (
          <div className="flex flex-col gap-6">
            {role === "INTERVIEWER" && (
              <>
                <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span className="text-violet-600 dark:text-violet-300">
                      1. Choose role
                    </span>
                    <span className="text-violet-600 dark:text-violet-300">
                      2. Complete profile
                    </span>
                    <span
                      className={
                        canSubmit ? "text-violet-600 dark:text-violet-300" : ""
                      }
                    >
                      3. Start
                    </span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-violet-600 transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-border bg-card/80 px-6 py-4 shadow-lg backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-lg">
                      {selectedRole?.icon}
                    </span>

                    <div>
                      <p className="text-sm font-semibold">
                        {selectedRole?.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {completedFields}/5 profile fields complete
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRole(null)}
                  >
                    Change
                  </Button>
                </div>
              </>
            )}

            {role === "INTERVIEWEE" && (
              <div className="rounded-3xl border border-violet-500/30 bg-card/80 p-8 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-500/30 bg-violet-500/10 text-3xl">
                  🎯
                </div>

                <h2 className="text-3xl font-bold">
                  You&apos;re ready to practice.
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Explore coaches, book mock interviews, and use your credits to
                  sharpen your answers before the real interview.
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => setRole(null)}
                >
                  Change role
                </Button>
              </div>
            )}

            {role === "INTERVIEWER" && (
              <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
                  <Sparkles className="h-4 w-4" />
                  Coach profile setup
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Current title</Label>
                    <Input
                      id="title"
                      placeholder="Hiring Manager, Recruiter, Designer..."
                      value={form.title}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="company">Company / organization</Label>
                    <Input
                      id="company"
                      placeholder="Company, school, organization..."
                      value={form.company}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          company: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Years of experience</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {YEARS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            yearsExp: option.value,
                          }))
                        }
                        className={`rounded-full border px-4 py-2 text-xs transition ${
                          form.yearsExp === option.value
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                            : "border-border text-muted-foreground hover:border-violet-500/30"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Interview types you can coach</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => {
                      if (!category?.value) return null;

                      const active = form.categories.includes(category.value);

                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => toggleCategory(category.value)}
                          className={`rounded-full border px-4 py-2 text-xs transition ${
                            active
                              ? "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                              : "border-border text-muted-foreground hover:border-violet-500/30"
                          }`}
                        >
                          {active ? "✓ " : ""}
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bio">Bio</Label>
                    <span className="text-xs text-muted-foreground">
                      {form.bio.length}/300
                    </span>
                  </div>

                  <Textarea
                    id="bio"
                    rows={4}
                    maxLength={300}
                    placeholder="Tell candidates about your background, the roles or industries you can help with, and what they can expect from a session with you."
                    value={form.bio}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, bio: event.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl"
                  >
                    <Icon className="mb-4 h-5 w-5 text-violet-600 dark:text-violet-300" />
                    <h3 className="text-sm font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Setting up your account..."
                : role === "INTERVIEWER"
                ? "Complete Profile"
                : "Explore Coaches"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}