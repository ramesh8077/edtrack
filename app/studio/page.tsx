import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Globe, Lock, ArrowRight, Star } from "lucide-react";
import { CreateTemplateButton } from "@/components/studio/create-template-button";

export default async function MentorStudioPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MENTOR") {
    redirect("/dashboard");
  }

  const templates = await db.pathTemplate.findMany({
    where: { mentorId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Mentor Studio</h1>
          <p className="text-muted-foreground mt-1 tracking-tight">
            Draft, edit, and publish premium learning structures as standardized verifiable
            templates.
          </p>
        </div>
        <CreateTemplateButton />
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-14 text-center rounded-xl border border-dashed bg-muted/10">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No Master Templates Created</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mb-6">
            You haven&apos;t structured any courses yet. Launch your first expert curriculum and
            start getting enrolled learners.
          </p>
          <CreateTemplateButton variant="default" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {templates.map((t: any) => (
            <Card
              key={t.id}
              className="flex flex-col overflow-hidden w-full h-full bg-card/60 border-border/50 shadow-sm transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={t.isPublished ? "default" : "secondary"}
                    className="tracking-wider uppercase text-[10px] font-bold"
                  >
                    {t.isPublished ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" /> Published
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Draft
                      </>
                    )}
                  </Badge>
                  {t.isPublished && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{" "}
                      {t.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl line-clamp-2 leading-tight">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground">
                <p className="line-clamp-2">{t.goal}</p>
                <div className="mt-4 flex items-center justify-between text-xs font-medium px-2 py-1.5 bg-muted/20 border rounded-md">
                  <span className="text-foreground/80">{t.enrollmentCount} Active Enrollments</span>
                  <span
                    className={`px-2 rounded-full ${t.level === "BEGINNER" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"}`}
                  >
                    {t.level}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t bg-muted/10 py-3 mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Edited {new Date(t.updatedAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" asChild className="h-8 font-semibold">
                  <Link href={`/studio/builder/${t.id}`}>
                    Enter Builder <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
