import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TemplateBuilder } from "@/components/studio/template-builder";

export default async function BuilderPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "MENTOR") {
    redirect("/dashboard");
  }

  const template = await db.pathTemplate.findUnique({
    where: { id: templateId, mentorId: session.user.id }
  });

  if (!template) {
    redirect("/studio");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-[calc(100vh-4rem)] flex flex-col">
       <TemplateBuilder initialData={template} />
    </div>
  );
}
