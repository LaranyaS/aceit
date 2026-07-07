import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import CreditButton from "@/components/CreditButton";
import { syncCurrentUser } from "@/lib/syncCurrentUser";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export async function Header() {
  const user = await syncCurrentUser();

  const userRole =
    user?.role === "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE";

  const visibleCredits =
    user?.role === "INTERVIEWER"
      ? user?.interviewerProfile?.creditBalance ?? 0
      : user?.credits ?? 0;

  return (
    <div className="flex items-center justify-between py-6">
      <Link href="/" className="text-2xl font-bold">
        AceIt
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          {user?.role === "INTERVIEWER" && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user?.role === "INTERVIEWEE" && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/explore" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden md:inline">Explore</span>
                </Link>
              </Button>

              <Button variant="default" asChild>
                <Link href="/appointments" className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span className="hidden md:inline">My Appointments</span>
                </Link>
              </Button>
            </>
          )}

          <div className="flex items-center gap-3">
            <CreditButton role={userRole} credits={visibleCredits} />

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}