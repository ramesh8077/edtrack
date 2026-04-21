import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default async function PathLandingPage({ params }: { params: Promise<{ pathId: string }> }) {
  const { pathId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const path = await db.learningPath.findUnique({
    where: { id: pathId, userId: session.user.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, take: 1 } }
      }
    }
  });

  if (!path) redirect("/dashboard");

  // Determine the first uncompleted lesson to jump to, otherwise fallback to first lesson
  const firstLesson = path.modules[0]?.lessons[0];
  if (firstLesson) {
    redirect(`/paths/${pathId}/lessons/${firstLesson.id}`);
  }

  // If literally no lessons exist
  return (
    <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground flex-col">
       <CheckCircle2 className="h-12 w-12 text-primary/40 mb-4" />
       <h2 className="text-xl font-semibold mb-2">Empty Syllabus</h2>
       <p className="max-w-md">This learning path generated no lessons. It may have been aborted or is a malformed template. Please generate a new trajectory.</p>
    </div>
  );
}
