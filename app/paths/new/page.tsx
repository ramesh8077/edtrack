"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

// formSchema is intentionally omitted if not using formal zod-hook-form here
// but stay compatible with validation logic in lib/validations if needed.

export default function NewPathPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");
  const [weeks, setWeeks] = useState(4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.length < 20) {
      toast.error("Please provide a more descriptive goal (at least 20 characters).");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading(
      "Generating your highly personalized path. This can take up to 30 seconds...",
    );

    try {
      // 1. Call AI Generation Route
      const res = await fetch("/api/ai/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level, targetWeeks: weeks }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Failed to generate path");
      }

      const { data } = await res.json();

      // 2. We now have a generated 'LearningPath' from the server action mapped within `generate-path`
      toast.success("Learning Track established! Redirecting...", { id: loadingToastId });
      router.push(`/paths/${data.id}`);
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "An error occurred generating your path.";
      toast.error(message, { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-border/50 shadow-md">
        <CardHeader className="space-y-1 bg-muted/20 border-b border-border/40 pb-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <h1 className="font-heading font-medium tracking-tight h3">Generate Learning Path</h1>
          </div>
          <CardTitle className="text-3xl font-bold">What is your objective?</CardTitle>
          <CardDescription className="text-base break-words">
            Describe the career, concept, or deep-skill you wish to master. Our AI will compute a
            structured syllabus spanning 4–8 modules containing actionable lessons and quizzes.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="goal">Your Goal</Label>
              <Textarea
                id="goal"
                placeholder="I want to learn Next.js 15, Prisma constraints, and server-side forms. I have basic React knowledge."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                required
                minLength={20}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground flex justify-between">
                <span>Be as specific as possible regarding frameworks, toolings, or concepts.</span>
                <span className={goal.length > 500 ? "text-destructive" : ""}>
                  {goal.length}/500
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Current Proficiency</Label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) =>
                    setLevel(e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeks">Target Weeks ({weeks})</Label>
                <Input
                  id="weeks"
                  type="number"
                  min={2}
                  max={24}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-border/40 py-4 flex justify-end">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Roadmap <Sparkles className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
