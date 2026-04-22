import { db } from "@/lib/db";
import { PathTemplate, User } from "@prisma/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Users, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function TemplatesPage() {
  const templates = await db.pathTemplate.findMany({
    where: { isPublished: true },
    include: { mentor: true },
    orderBy: { enrollmentCount: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <Badge
          variant="outline"
          className="px-4 py-1 border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-bold"
        >
          Standardized Curricula
        </Badge>
        <h1 className="text-4xl md:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
          Master Marketplace
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Accelerate your career with expertly curated learning tracks designed by highly qualified
          industry professionals and mentors.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t: PathTemplate & { mentor: User }) => (
          <Card
            key={t.id}
            className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-border/50 group bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <Badge
                  variant="secondary"
                  className="uppercase font-semibold tracking-wider font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {t.level}
                </Badge>
                <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{(t.avgRating as unknown as number).toFixed(1)}</span>
                </div>
              </div>
              <Link href={`/templates/${t.slug}`}>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                  {t.title}
                </CardTitle>
              </Link>
              <div className="flex items-center gap-2 mt-2 pt-1">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold ring-2 ring-background">
                  {t.mentor.name.charAt(0)}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  By {t.mentor.name}
                </span>
                {t.mentor.mentorVerified && <CheckCircle2 className="w-3 h-3 text-primary" />}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
                {t.goal}
              </p>
              <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground font-medium border-t border-border/30 pt-4">
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.enrollmentCount} Enrollments</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                  <Clock className="w-3.5 h-3.5" />
                  <span>3-4 weeks</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-6 pr-6 justify-end">
              <Button
                asChild
                variant="ghost"
                className="group/btn font-semibold hover:bg-primary/5 hover:text-primary"
              >
                <Link href={`/templates/${t.slug}`}>
                  Initialize Path{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
