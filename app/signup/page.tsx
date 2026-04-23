"use client";

import { motion } from "framer-motion";
import { Cpu, Mail, Lock, User, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background grid-pattern">
      <div className="fixed top-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="text-primary-foreground h-7 w-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter">Ed<span className="text-primary">Track</span></span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter">Join the Elite</h1>
          <p className="text-muted-foreground font-medium">Start your engineering specialization today.</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border border-border/50 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Engineer Name" 
                  className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
             <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Zap className="h-3 w-3" /> Career Track Included
             </div>
             <p className="text-[10px] text-muted-foreground leading-tight">
                By signing up, you agree to our Terms of Service and Privacy Policy. You will receive 1 month of premium lab access.
             </p>
          </div>

          <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
            Create Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium">
          Already a member?{" "}
          <Link href="/login" className="text-primary font-black hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
