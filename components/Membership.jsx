"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, AccentTitle } from "@/components/reusables";
import { Show, SignInButton } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";

const plans = [
  {
    name: "Free",
    slug: "free",
    price: "$0",
    credits: "1 credit / month",
    button: "Get started free",
    featured: false,
    planId: null,
    features: ["1 mock interview session", "AI feedback preview", "Basic interview history"],
  },
  {
    name: "Starter",
    slug: "starter",
    price: "$20",
    credits: "10 credits / month",
    button: "Start practicing",
    featured: true,
    planId: "cplan_3G9O6ssiOg9uUMSeuPyvciR8nme",
    features: [
      "10 monthly credits",
      "Full AI feedback reports",
      "HD video calls",
      "Persistent chat thread",
      "Credits roll over monthly",
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$45",
    credits: "25 credits / month",
    button: "Go Pro",
    featured: false,
    planId: "cplan_3G9ONvMnFRrgaQ8WYArOfpW4U0A",
    features: [
      "25 monthly credits",
      "Full AI feedback reports",
      "HD video calls",
      "Persistent chat thread",
      "Recording playback links",
      "Resume-based preparation",
    ],
  },
];

export function Membership({ currentPlan = "free" }) {
  return (
<section id="membership" className="relative z-10 py-28 max-w-7xl mx-auto px-6">      <div className="text-center mb-16">
        <SectionLabel>Membership</SectionLabel>

        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          Credit-based plans for <AccentTitle>every interview goal.</AccentTitle>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Start free, upgrade when you need more practice, and use credits to
          book mock interview sessions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isActivePlan = currentPlan === plan.slug;

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-card/80 p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isActivePlan
                  ? "border-violet-600 shadow-violet-500/20"
                  : plan.featured
                  ? "border-violet-500/50 shadow-violet-500/10"
                  : "border-border hover:border-violet-500/30"
              }`}
            >
              {isActivePlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  Active Plan
                </div>
              )}

              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {plan.name}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold text-violet-600 dark:text-violet-400">
                  {plan.price}
                </span>
                <span className="pb-2 text-muted-foreground">/month</span>
              </div>

              <p className="mt-3 font-medium text-violet-600 dark:text-violet-300">
                {plan.credits}
              </p>

              <div className="my-8 border-t border-border" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Show when="signed-in">
                {isActivePlan ? (
                  <Button className="mt-10 w-full" size="lg" disabled>
                    Active
                  </Button>
                ) : plan.planId ? (
                  <CheckoutButton
                    planId={plan.planId}
                    planPeriod="month"
                    newSubscriptionRedirectUrl="/"
                  >
                    <Button
                      className="mt-10 w-full"
                      variant={plan.featured ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.button}
                    </Button>
                  </CheckoutButton>
                ) : (
                  <Button className="mt-10 w-full" variant="outline" size="lg">
                    {plan.button}
                  </Button>
                )}
              </Show>

              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    className="mt-10 w-full"
                    variant={plan.featured ? "default" : "outline"}
                    size="lg"
                  >
                    Sign in to choose plan
                  </Button>
                </SignInButton>
              </Show>
            </div>
          );
        })}
      </div>
    </section>
  );
}