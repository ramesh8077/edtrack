"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  completedAt: Date | null;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: { id: string } | null;
}

export function ModuleTree({ modules, pathId }: { modules: Module[]; pathId: string }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {modules.map((module, i) => (
        <div key={module.id} className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
            Module {i + 1}: {module.title}
          </div>
          <div className="flex flex-col space-y-0.5 mt-1">
            {module.lessons.map((lesson) => {
              const active = pathname.includes(`/lessons/${lesson.id}`);
              return (
                <Link
                  key={lesson.id}
                  href={`/paths/${pathId}/lessons/${lesson.id}`}
                  className={`flex items-start gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {lesson.completedAt ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <span className="line-clamp-2 leading-snug">{lesson.title}</span>
                </Link>
              );
            })}

            {module.quiz && (
              <Link
                href={`/paths/${pathId}/quiz/${module.quiz.id}`}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${pathname.includes(`/quiz/${module.quiz.id}`) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
              >
                <HelpCircle className="h-4 w-4 text-purple-500" />
                <span>Module Quiz</span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
