import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuizEngine } from "@/components/paths/quiz-engine";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ pathId: string; quizId: string }>;
}) {
  const { pathId, quizId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Load the quiz including questions
  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      module: {
        include: { path: true },
      },
    },
  });

  if (!quiz || quiz.module.path.userId !== session.user.id) {
    redirect(`/paths/${pathId}`);
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-6 lg:p-10 pb-24">
      <div className="mb-8 space-y-2">
        <div className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          {quiz.module.title} • Knowledge Check
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tight">{quiz.title}</h1>
        <div className="text-sm text-muted-foreground pt-2">
          Passing Score: {quiz.passingScore}%
        </div>
      </div>

      <div className="mt-8">
        <QuizEngine quiz={quiz} pathId={pathId} />
      </div>
    </div>
  );
}
