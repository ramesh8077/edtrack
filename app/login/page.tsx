"use client";

import { motion } from "framer-motion";
import { Cpu, Github, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background grid-pattern">
      <div className="fixed top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
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
          <h1 className="text-4xl font-black tracking-tighter">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Continue your engineering journey.</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border border-border/50 space-y-6">
          <div className="space-y-4">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold">Password</label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
            Sign In <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl font-bold glass-card">
               {/* Using generic icons since brand icons were missing in my earlier check */}
               <div className="w-5 h-5 mr-2 bg-foreground rounded-full flex items-center justify-center text-background text-[10px]">G</div>
               Google Account
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-black hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
