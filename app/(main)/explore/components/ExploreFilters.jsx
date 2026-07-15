"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";

export default function ExploreFilters() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by coach, role, or company..."
            className="pl-10"
          />
        </div>

        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          More filters
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category.value;

          return (
            <button
              key={category.label}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
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
  );
}