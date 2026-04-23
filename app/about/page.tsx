"use client";

import { motion } from "framer-motion";
import { Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GenericPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background grid-pattern">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 text-center space-y-8 rounded-[2.5rem]"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
          <Info className="h-10 w-10" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tighter">Information Hub</h1>
          <p className="text-muted-foreground font-medium leading-relaxed">
            This section of the EdTrack platform is currently being updated with professional engineering resources.
          </p>
        </div>
        <Button asChild className="w-full h-12 rounded-xl">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Workspace</Link>
        </Button>
      </motion.div>
    </div>
  );
}
