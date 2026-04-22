import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-16 md:pb-12 md:pt-24 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
          <Link
            href="/templates"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            Explore AI Learning Paths
          </Link>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Your AI learning coach — from goal to mastery.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
            Tell us your career goal in plain English. LearnLoop AI generates a personalized,
            adaptive learning path with AI-driven quizzes and an context-aware tutor to keep you
            unstuck.
          </p>
          <div className="space-x-4 mt-6">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 bg-slate-50 dark:bg-transparent py-14 mx-auto md:py-20 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Stop wandering across incomplete tutorials. Let the AI structure a complete,
            comprehensive map of skills you actually need.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">AI Generated Paths</h3>
                <p className="text-sm text-muted-foreground">
                  Topics and curriculum structured logically specifically for your goal.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="M12 2v20" />
                <path d="m17 5-5-3-5 3v14l5 3 5-3z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Adaptive Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Assessments that adjust to your knowledge level dynamically.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Contextual AI Tutor</h3>
                <p className="text-sm text-muted-foreground">
                  Get answers aware of exactly what chapter you are studying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
