import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminTable } from "@/components/admin/admin-table";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-heading font-bold">Platform Governance</h1>
        <p className="text-muted-foreground mt-2">Manage personnel, mentor verifications, and monitor platform abuse.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">User Directory</h2>
        <AdminTable users={users} />
      </div>
    </div>
  );
}
