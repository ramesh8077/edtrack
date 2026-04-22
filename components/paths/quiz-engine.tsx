"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { submitQuizAttempt } from "@/server/actions/progress";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  type: "MCQ" | "MSQ" | "OPEN";
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
}

interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export function QuizEngine({
  quiz: rawQuiz,
  pathId,
}: {
  quiz: Record<string, unknown>;
  pathId: string;
}) {
  const quiz = rawQuiz as unknown as Quiz;
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    aiFeedback?: string;
    itemizedFeedback?: Record<string, string>;
  } | null>(null);

  const handleSelect = (questionId: string, val: string, type: string) => {
    if (type === "MSQ") {
      setAnswers((prev) => {
        const current = (prev[questionId] as string[]) || [];
        if (current.includes(val))
          return { ...prev, [questionId]: current.filter((x) => x !== val) };
        return { ...prev, [questionId]: [...current, val] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: val }));
    }
  };

  const handleText = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    const maxScore = quiz.questions.length * 10;
    let combinedAiFeedback = "";
    const itemizedDetails: Record<string, string> = {};

    try {
      for (const q of quiz.questions) {
        const ans = answers[q.id];

        if (q.type === "OPEN") {
          // AI Grade mapping
          if (!ans) continue;
          const res = await fetch("/api/ai/grade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: q.prompt,
              answer: ans,
              rubric:
                q.correctAnswer ||
                "Provide reasonable, historically/technically accurate analysis.",
            }),
          });
          const { data } = await res.json();
          totalScore += data.score; // 0 to 10
          itemizedDetails[q.id] = data.feedback;
          combinedAiFeedback += `Q: ${q.prompt}\nFeedback: ${data.feedback}\n\n`;
        } else {
          // Local strict MCQ grading
          if (q.type === "MCQ") {
            if (ans === q.correctAnswer) totalScore += 10;
          } else if (q.type === "MSQ") {
            const ansArr = (ans as string[]) || [];
            const correctArr = (q.correctAnswer as string[]) || [];
            if (
              ansArr.length === correctArr.length &&
              ansArr.every((x) => correctArr.includes(x))
            ) {
              totalScore += 10;
            }
          }
          itemizedDetails[q.id] = q.explanation || "No explanation provided.";
        }
      }

      const finalPercentage = Math.round((totalScore / maxScore) * 100);
      const passed = finalPercentage >= quiz.passingScore;

      // Map to Data Mutation
      await submitQuizAttempt(quiz.id, finalPercentage, answers, combinedAiFeedback);

      setResult({
        score: finalPercentage,
        passed,
        aiFeedback: combinedAiFeedback,
        itemizedFeedback: itemizedDetails,
      });
      if (passed) toast.success("Quiz passed! Awesome logic mapping.");
      else toast.error("Quiz failed. Make sure to review the explanations.");
    } catch {
      toast.error("Failed to grade the quiz payload successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <Card className="border-border/50 bg-card p-6 shadow-md">
        <div className="flex flex-col items-center justify-center text-center py-6 border-b border-border/40">
          {result.passed ? (
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mb-4" />
          )}
          <h2 className="text-3xl font-bold">{result.score}%</h2>
          <p className="text-muted-foreground mt-2">
            {result.passed
              ? "Congratulations, you passed the assessment!"
              : "You did not reach the passing threshold. Don't worry, read the feedback and try again."}
          </p>
        </div>

        <div className="py-6 space-y-6">
          <h3 className="font-semibold text-xl">Feedback Breakdown</h3>
          {quiz.questions.map((q: QuizQuestion, i: number) => (
            <div key={q.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm">
              <p className="font-medium mb-2">
                Q{i + 1}: {q.prompt}
              </p>
              <div className="text-muted-foreground mt-2 border-l-2 border-primary/40 pl-3">
                {result.itemizedFeedback?.[q.id] || "No feedback mapped."}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button asChild>
            <Link href={`/paths/${pathId}`}>Return to Path Overview</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      {quiz.questions.map((q: QuizQuestion, i: number) => {
        const isMCQ = q.type === "MCQ";
        const isMSQ = q.type === "MSQ";
        const options = (q.options as string[]) || [];

        return (
          <Card key={q.id} className="border-border/50 bg-card overflow-hidden">
            <div className="bg-muted/30 p-4 border-b border-border/40">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                Question {i + 1}
              </span>
              <p className="font-medium mt-1 leading-snug">{q.prompt}</p>
            </div>
            <CardContent className="p-4 pt-6 space-y-3">
              {isMCQ || isMSQ ? (
                <div className="space-y-2">
                  {options.map((opt) => {
                    const isSelected = isMSQ
                      ? ((answers[q.id] as string[]) || []).includes(opt)
                      : answers[q.id] === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleSelect(q.id, opt, q.type)}
                        className={`p-3 rounded-md border text-sm cursor-pointer transition-colors ${isSelected ? "bg-primary/10 border-primary text-foreground" : "border-border/60 hover:bg-muted text-muted-foreground"}`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Textarea
                  placeholder="Type out your explanation securely..."
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleText(q.id, e.target.value)}
                  className="min-h-[120px]"
                />
              )}
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto font-semibold"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Yield Submissions
        </Button>
      </div>
    </div>
  );
}
