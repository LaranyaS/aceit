import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABEL } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/helpers";

export default function InterviewerCard({ interviewer }) {
  const { id, name, imageUrl, interviewerProfile } = interviewer;

  const {
    title,
    company,
    yearsExp,
    bio,
    categories = [],
    creditRate = 1,
    availabilities = [],
  } = interviewerProfile ?? {};

  const nextAvailability = availabilities[0];

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <Card className="group relative flex h-full overflow-hidden border border-border bg-card/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-violet-500/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="relative flex w-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0 border border-border">
              <AvatarImage
                src={imageUrl || undefined}
                alt={name || "Interview coach"}
              />

              <AvatarFallback className="border border-violet-500/20 bg-violet-500/10 text-sm font-semibold text-violet-600 dark:text-violet-300">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold">
                {name || "AceIt Coach"}
              </p>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {title || "Interview Coach"}
                {company ? ` · ${company}` : ""}
              </p>
            </div>
          </div>

          {yearsExp ? (
            <Badge
              variant="outline"
              className="shrink-0 border-border text-xs text-muted-foreground"
            >
              {yearsExp}+ yrs
            </Badge>
          ) : null}
        </div>

        <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-muted-foreground">
          {bio || "This coach has not added a profile description yet."}
        </p>

        <div className="flex min-h-8 flex-wrap gap-2">
          {categories.slice(0, 4).map((category) => (
            <span
              key={category}
              className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-600 dark:text-violet-300"
            >
              {CATEGORY_LABEL[category] ||
                category.replaceAll("_", " ")}
            </span>
          ))}

          {categories.length > 4 && (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              +{categories.length - 4} more
            </span>
          )}
        </div>

        <Separator />

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-lg font-bold text-violet-600 dark:text-violet-300">
              {creditRate}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {creditRate === 1 ? "credit" : "credits"} / session
              </span>
            </p>

            {nextAvailability ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Next: {formatDate(nextAvailability.startTime)} at{" "}
                {formatTime(nextAvailability.startTime)}
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                No availability set
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-300"
            asChild
          >
            <Link href={`/interviewers/${id}`}>View profile →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}