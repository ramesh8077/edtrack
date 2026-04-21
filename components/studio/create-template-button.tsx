"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTemplate } from "@/server/actions/templates";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateTemplateButton({ variant = "outline" }: { variant?: "default" | "outline" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await createTemplate({ title: "New Assessment Draft", goal: "Define your outcomes here.", level: "INTERMEDIATE" });
    if (res.success && res.data) {
       toast.success("Template draft initialized successfully");
       router.push(`/studio/builder/${res.data.id}`);
    } else {
       toast.error(res.error || "Failed to initialize draft");
       setLoading(false);
    }
  }

  return (
    <Button variant={variant} onClick={handleCreate} disabled={loading} className="font-semibold shadow-sm">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
      Design New Curriculum
    </Button>
  )
}
