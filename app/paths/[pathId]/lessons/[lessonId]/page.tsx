import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { MarkCompleteButton } from "@/components/paths/mark-complete-button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ pathId: string; lessonId: string }>;
}) {
  const { pathId, lessonId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: { path: true },
      },
    },
  });

  if (!lesson || lesson.module.path.userId !== session.user.id) {
    redirect(`/paths/${pathId}`);
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-6 lg:p-10 pb-24">
      <div className="mb-8 space-y-2">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {lesson.module.title} • Lesson {lesson.order}
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tight">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <span>⏱ {lesson.estimatedMinutes} min read</span>
          {lesson.completedAt && (
            <span className="text-primary font-medium flex items-center gap-1">✓ Completed</span>
          )}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{lesson.contentMd}</ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-border/40 pb-10 flex sm:justify-end">
        <MarkCompleteButton lessonId={lesson.id} isCompleted={!!lesson.completedAt} />
      </div>
    </div>
  );
}
