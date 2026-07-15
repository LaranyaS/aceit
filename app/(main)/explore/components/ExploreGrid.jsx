"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";
import InterviewerCard from "./InterviewerCard";

export default function ExploreGrid({ interviewers = [] }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const filteredInterviewers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return interviewers.filter((interviewer) => {
      const profile = interviewer.interviewerProfile;

      if (!profile) return false;

      const matchesCategory =
        activeCategory === null ||
        profile.categories?.includes(activeCategory);

      const matchesSearch =
        !query ||
        interviewer.name?.toLowerCase().includes(query) ||
        profile.title?.toLowerCase().includes(query) ||
        profile.company?.toLowerCase().includes(query) ||
        profile.bio?.toLowerCase().includes(query) ||
        profile.categories?.some((category) =>
          category.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [interviewers, activeCategory, search]);

  const clearFilters = () => {
    setActiveCategory(null);
    setSearch("");
  };

  const filtersActive = activeCategory !== null || search.trim() !== "";

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by coach, role, company, or interview type..."
              className="pl-10"
            />
          </div>

          {filtersActive && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category.value;

            return (
              <button
                key={String(category.value)}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                  active
                    ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                    : "border-border text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredInterviewers.length === 0
            ? "No coaches found"
            : `${filteredInterviewers.length} coach${
                filteredInterviewers.length === 1 ? "" : "es"
              } found`}
        </p>

        {filtersActive && filteredInterviewers.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-300"
          >
            Reset
          </button>
        )}
      </div>

      {filteredInterviewers.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/70 px-6 py-16 text-center shadow-lg backdrop-blur-xl">
          <Search className="mx-auto h-10 w-10 text-violet-600 dark:text-violet-300" />

          <h2 className="mt-5 text-2xl font-bold">
            No matching coaches found
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Try another interview type or search by a different name, role, or
            company.
          </p>

          {filtersActive && (
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredInterviewers.map((interviewer) => (
            <InterviewerCard
              key={interviewer.id}
              interviewer={interviewer}
            />
          ))}
        </div>
      )}
    </div>
  );
}