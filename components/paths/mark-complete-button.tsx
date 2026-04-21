"use client";

import { useOptimistic, useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { completeLesson } from "@/server/actions/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export function MarkCompleteButton({ lessonId, isCompleted }: { lessonId: string, isCompleted: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(isCompleted);

  // useOptimistic to instantly update UI and snap states without latency waiting manually.
  const [optimisticComplete, addOptimisticComplete] = useOptimistic(
    completed,
    (state, newComplete: boolean) => newComplete
  );

  const handleComplete = () => {
    if (optimisticComplete) return;

    startTransition(async () => {
      addOptimisticComplete(true);
      const res = await completeLesson(lessonId);
      if (res.success) {
        setCompleted(true);
        toast.success("Lesson marked complete! Your velocity increased.");
      } else {
        toast.error(res.error || "Failed to mark complete");
      }
    });
  };

  return (
    <Button 
      onClick={handleComplete} 
      disabled={optimisticComplete || isPending}
      variant={optimisticComplete ? "default" : "outline"}
      className="w-full sm:w-auto h-12 px-8 font-medium shadow-sm transition-all group"
    >
      {optimisticComplete ? (
        <>
           <CheckCircle2 className="mr-2 h-5 w-5" />
           Completed
        </>
      ) : (
        <>
           <Circle className="mr-2 h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
           Mark as Complete
        </>
      )}
    </Button>
  );
}
