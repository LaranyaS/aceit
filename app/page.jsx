import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6">
      {/* Top Navigation */}
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
            <UserButton />
          </Show>
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center text-center space-y-6">
        <p className="text-sm font-medium text-muted-foreground">
          AI-powered interview preparation
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Practice smarter. Interview better.
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          AceIt helps you prepare for interviews with realistic mock practice,
          instant feedback, and personalized improvement tips.
        </p>

        <div className="flex gap-4">
          <Button size="lg">Get Started</Button>

          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>
    </main>
  );
}