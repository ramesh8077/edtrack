import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModuleTree } from "@/components/paths/module-tree";

export default async function PathLayout({
  children,
  tutor,
  params,
}: {
  children: React.ReactNode;
  tutor: React.ReactNode;
  params: Promise<{ pathId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { pathId } = await params;

  // Retrieve the path with its full module->lesson tree
  const path = await db.learningPath.findUnique({
    where: { id: pathId, userId: session.user.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quiz: true,
        },
      },
    },
  });

  if (!path) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Left Sidebar: Module Tree */}
      <aside className="w-full md:w-64 border-r border-border/40 bg-muted/10 h-1/3 md:h-full overflow-y-auto shrink-0 flex flex-col">
        <div className="p-4 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur z-10 shadow-sm">
          <h2 className="font-semibold text-sm line-clamp-2 leading-tight">{path.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground font-medium">{Math.round(path.progress)}% Complete</span>
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${path.progress}%` }} 
              />
            </div>
          </div>
        </div>
        <div className="p-3">
          <ModuleTree modules={path.modules} pathId={path.id} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background flex flex-col relative h-full">
        {children}
      </main>

      {/* Right Sidebar: AI Tutor Parallel Slot */}
      {tutor}
    </div>
  );
}
