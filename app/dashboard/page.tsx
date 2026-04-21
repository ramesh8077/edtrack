import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PathCard } from "@/components/dashboard/path-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PathStatus, Level, LearningPath } from "@prisma/client";

// Expecting query params like ?status=active&level=beginner
type DashboardProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const awaitedSearchParams = await searchParams; // Wait for resolving promise in Next.js 15
  const statusFilter = awaitedSearchParams.status ? (awaitedSearchParams.status.toUpperCase() as PathStatus) : undefined;
  const levelFilter = awaitedSearchParams.level ? (awaitedSearchParams.level.toUpperCase() as Level) : undefined;

  const [paths, user] = await Promise.all([
    db.learningPath.findMany({
      where: {
        userId: session.user.id,
        ...(statusFilter && { status: statusFilter }),
        ...(levelFilter && { level: levelFilter }),
      },
      orderBy: { updatedAt: "desc" }
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true }
    })
  ]);

  // Aggregate mock minutes (From Quiz Attempts or actual lessons)
  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId: session.user.id },
    select: { completedAt: true, score: true }
  });
  
  // Create mock analytics graph bridging attempts to active minutes
  // In a real iteration, "minutes" would be mapped onto `completedAt` on `Lesson`
  const analyticsData = quizAttempts.map((q: { completedAt: Date; score: number }) => ({
    date: q.completedAt,
    minutes: Math.round(15 + (q.score % 20)) // Deterministic lesson active minutes proxy based on score
  }));

  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Pick up where you left off and review your knowledge velocity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/templates">Enrol from Template</Link>
          </Button>
          <Button asChild>
            <Link href="/paths/new">Generate Custom Path &rarr;</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold tracking-tight">Active Paths</h2>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {/* Query Param Links */}
              <Link href="/dashboard" className={`hover:text-primary ${!statusFilter ? "font-medium text-foreground" : ""}`}>All</Link>
              <Link href="/dashboard?status=active" className={`hover:text-primary ${statusFilter === "ACTIVE" ? "font-medium text-foreground" : ""}`}>Active</Link>
              <Link href="/dashboard?status=completed" className={`hover:text-primary ${statusFilter === "COMPLETED" ? "font-medium text-foreground" : ""}`}>Completed</Link>
            </div>
          </div>
          
          {paths.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-muted/10">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              </div>
              <h3 className="font-semibold text-lg">No paths found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm mb-4">You haven&apos;t instantiated any learning tracks yet. Generate a path directly using AI or enroll from a verified mentor.</p>
              <Button asChild><Link href="/paths/new">Create Path</Link></Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {paths.map((path: LearningPath) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Velocity Analytics</h3>
            <p className="text-xs text-muted-foreground -mt-3 mb-2">Minutes studied over last 30 assessments</p>
            <div className="rounded-xl border bg-card p-4">
               <AnalyticsChart data={analyticsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
