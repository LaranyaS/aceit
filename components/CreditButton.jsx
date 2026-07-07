"use client";

import { Coins } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function CreditButton({ role, credits }) {
  const router = useRouter();
  const pathname = usePathname();

  const isInterviewer = role === "INTERVIEWER";

  const handleClick = () => {
    const membershipSection = document.getElementById("membership");

    console.log("Credit button clicked");
    console.log("Role:", role);
    console.log("Pathname:", pathname);
    console.log("Membership found:", !!membershipSection);

    if (isInterviewer) {
      console.log("Going to interviewer dashboard...");
      router.push("/dashboard");
      return;
    }

    if (pathname === "/" && membershipSection) {
      console.log("Scrolling to membership...");
      membershipSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    console.log("Navigating to homepage membership...");
    router.push("/#membership");
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="cursor-pointer border-violet-500/30 bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-300"
    >
      <Coins size={16} />
      <span>
        {isInterviewer ? `${credits} Earned` : `${credits} Credits`}
      </span>
    </Button>
  );
}