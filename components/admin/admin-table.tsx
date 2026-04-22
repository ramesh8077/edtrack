"use client";

import { useState } from "react";
import { verifyMentor } from "@/server/actions/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdminTable({
  users,
}: {
  users: { id: string; name: string; email: string; role: string; mentorVerified: boolean }[];
}) {
  const [localUsers, setLocalUsers] = useState(users);

  const handleVerify = async (id: string, isVerified: boolean) => {
    // Optimistic update wrapper
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, mentorVerified: isVerified } : u)),
    );

    const res = await verifyMentor(id, isVerified);
    if (res.success) {
      toast.success(`Mentor ${isVerified ? "approved" : "revoked"} successfully.`);
    } else {
      toast.error("Failed to action mentor status.");
      // Revert
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, mentorVerified: !isVerified } : u)),
      );
    }
  };

  return (
    <Card className="border border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm p-0">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border/40">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {localUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "default"
                        : user.role === "MENTOR"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-[10px]"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  {user.role === "MENTOR" && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.mentorVerified ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}`}
                    >
                      {user.mentorVerified ? "Verified" : "Pending Alignment"}
                    </span>
                  )}
                  {user.role !== "MENTOR" && (
                    <span className="text-muted-foreground opacity-50">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role === "MENTOR" && !user.mentorVerified && (
                    <Button
                      onClick={() => handleVerify(user.id, true)}
                      size="sm"
                      variant="outline"
                      className="h-8 shadow-sm"
                    >
                      <Check className="h-4 w-4 mr-2 text-emerald-500" />
                      Approve
                    </Button>
                  )}
                  {user.role === "MENTOR" && user.mentorVerified && (
                    <Button
                      onClick={() => handleVerify(user.id, false)}
                      size="sm"
                      variant="ghost"
                      className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" /> Revoke
                    </Button>
                  )}
                  {user.role === "LEARNER" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-muted-foreground hover:bg-muted"
                    >
                      <ShieldAlert className="h-4 w-4 mr-2" /> Flag
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {localUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No user records resolved.
          </div>
        )}
      </div>
    </Card>
  );
}
