import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  return (
    <div className="flex items-center justify-between py-6">
      <h1 className="text-2xl font-bold">AceIt</h1>

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
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
              💎 28 Credits
            </div>

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