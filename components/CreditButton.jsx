"use client";

import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function CreditButton({ role, credits }) {
  const router = useRouter();

  const isInterviewer = role === "INTERVIEWER";

  const handleClick = () => {
    if (isInterviewer) {
      router.push("/dashboard");
    } else {
      router.push("/#membership");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="cursor-pointer border-violet-500/30 bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-300"
    >
      <Coins size={16} />
      <span>
        {credits} {isInterviewer ? "Earned" : "Credits"}
      </span>
    </Button>
  );
}