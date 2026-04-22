import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, LayoutList, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 3600;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
export async function generateStaticParams() {
  const templates = await db.pathTemplate.findMany({
    where: { isPublished: true },
    select: { slug: true },
    take: 50
  });
  return templates.map((t: any) => ({ slug: t.slug }));
}
**/

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await db.pathTemplate.findUnique({ where: { slug } });
  return {
    title: template?.title || "Template",
    description: template?.goal || "LearnLoop AI verified path template.",
  };
}

export default async function TemplateDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await db.pathTemplate.findUnique({
    where: { slug },
    include: { mentor: { select: { name: true, bio: true } } },
  });

  if (!template || !template.isPublished) notFound();

  // The structure is guaranteed to be a JSON object holding a modules array
  interface TemplateModule {
    title: string;
    description: string;
    lessons: { title: string; duration: number }[];
  }

  interface TemplateModule {
    title: string;
    description: string;
    lessons: { title: string; duration: number }[];
  }

  const structure = template.structure as any as { modules: TemplateModule[] }; // eslint-disable-line @typescript-eslint/no-explicit-any
  const modules = structure?.modules || [];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Main Left Content */}
        <div className="md:col-span-2 space-y-10">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="px-3 bg-primary/10 text-primary hover:bg-primary/20"
              >
                {template.level}
              </Badge>
              <Badge variant="outline" className="px-3">
                <Users className="w-3 h-3 mr-1" /> {template.enrollmentCount} Enrolled
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-[1.1]">
              {template.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{template.goal}</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <LayoutList className="text-primary" /> Syllabus Overview
            </h2>
            <div className="space-y-4">
              {modules.length === 0 ? (
                <p className="text-muted-foreground italic">
                  Syllabus content currently undergoing review.
                </p>
              ) : (
                modules.map((m, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border bg-card/40 shadow-sm transition-all hover:bg-card/80"
                  >
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      {m.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 mb-3 leading-relaxed">
                      {m.description || "In-depth conceptual module."}
                    </p>
                    <ul className="space-y-1.5 ml-2 border-l-2 border-muted pl-4">
                      {Array.isArray(m.lessons) &&
                        m.lessons.map((l: { title: string }, j: number) => (
                          <li
                            key={j}
                            className="text-sm font-medium text-foreground/80 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/60" />{" "}
                            {l.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar CTA */}
        <aside className="space-y-6">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5">
            <div className="text-center mb-6 border-b pb-6">
              <h3 className="text-lg font-bold mb-1">Ready to commit?</h3>
              <p className="text-sm text-muted-foreground">
                Enroll to generate an AI-tailored instance of this syllabus track to your dashboard
                instantly.
              </p>
            </div>
            <div className="space-y-4">
              <Button size="lg" className="w-full text-md h-12 font-bold shadow-md" asChild>
                {/* The CTA realistically maps to an enrollment API or page. Next.js 15 App router approach defaults to auth requirement */}
                <Link href="/login?redirect=/dashboard">Sign up to Enroll &rarr;</Link>
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground pt-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {template.avgRating > 0
                  ? `${template.avgRating.toFixed(1)} / 5 Rating`
                  : "No ratings yet"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-5 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg text-primary">
                {template.mentor.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight text-foreground">
                  Verified Mentor
                </h4>
                <p className="text-xs text-muted-foreground">{template.mentor.name}</p>
              </div>
            </div>
            <p className="text-sm mt-3 text-muted-foreground/80 italic leading-relaxed">
              &quot;{template.mentor.bio || "An industry leader sharing their exact roadmap."}&quot;
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
