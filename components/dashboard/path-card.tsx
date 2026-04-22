import { LearningPath } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function PathCard({ path }: { path: LearningPath }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "ADVANCED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "COMPLETED":
        return "outline";
      case "PAUSED":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge
            variant={getStatusColor(path.status) as "default" | "outline" | "secondary"}
            className="text-[10px] font-semibold uppercase tracking-wider"
          >
            {path.status}
          </Badge>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getLevelColor(path.level)}`}
          >
            {path.level}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          <Link
            href={`/paths/${path.id}`}
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            {path.title || "Untitled Path"}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4 text-sm text-muted-foreground flex flex-col justify-end">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Progress</span>
            <span>{Math.round(path.progress)}%</span>
          </div>
          <Progress value={path.progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 bg-muted/20 px-6 py-3 mt-auto">
        <span>Updated {formatDistanceToNow(new Date(path.updatedAt), { addSuffix: true })}</span>
        <Button variant="ghost" size="sm" asChild className="h-8 px-2 -mr-2">
          <Link href={`/paths/${path.id}`}>Continue &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
