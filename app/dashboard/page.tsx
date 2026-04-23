"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  BookOpen, 
  Clock, 
  Trophy, 
  ArrowUpRight, 
  Cpu, 
  Terminal, 
  Layers,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const projects = [
    { title: "Advanced VLSI Layout", progress: 75, lastActive: "2 hours ago", icon: Cpu },
    { title: "STM32 Kernel Config", progress: 40, lastActive: "Yesterday", icon: Terminal },
    { title: "Robotics Control Loop", progress: 15, lastActive: "3 days ago", icon: Layers },
  ];

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background p-6 lg:p-10 mt-10"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Navigation / Stats Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter">
              Lab <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground font-medium">Welcome back, Engineer Ramesh.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Find projects..." 
                className="pl-10 pr-4 h-12 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 glass-card">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-12 w-12 rounded-xl border-2 border-primary/20 p-1">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>RE</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Learning Hours", value: "124.5h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Tracks Completed", value: "3", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Lab Score", value: "98/100", icon: BarChart, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Current Rank", value: "#142", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl glass-card border border-border/40 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-black">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Active Tracks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter">Current Projects</h2>
              <Button variant="ghost" className="font-bold text-primary">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
            
            <div className="grid gap-6">
              {filteredProjects.length > 0 ? filteredProjects.map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="p-6 rounded-3xl glass-card border border-border/40 group hover:border-primary/40"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <project.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-bold">{project.title}</h4>
                        <span className="text-xs font-bold text-muted-foreground">{project.lastActive}</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-muted/50" />
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-primary">{project.progress}% Complete</span>
                        <span className="text-muted-foreground">Level 4/12</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="p-12 text-center text-muted-foreground glass-card rounded-3xl border-dashed">
                  No projects found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Performance Analytics */}
            <div className="pt-10 space-y-6">
              <h2 className="text-2xl font-black tracking-tighter">Skill Proficiency</h2>
              <div className="p-8 rounded-[2rem] glass-card border border-border/40 h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <Activity className="w-full h-full text-primary" />
                </div>
                <div className="text-center space-y-4">
                  <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="font-bold text-lg">Engineering Performance Visualization</p>
                  <p className="text-sm text-muted-foreground max-w-xs">Connecting to Lab APIs for real-time proficiency mapping...</p>
                  <Button variant="outline" className="rounded-xl font-bold">Launch Analyzer</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black tracking-tighter">Lab Tools</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Verilog IDE", icon: Terminal },
                  { label: "Schematic", icon: Layers },
                  { label: "Hardware", icon: Cpu },
                  { label: "Settings", icon: Settings },
                ].map((tool) => (
                  <Button key={tool.label} variant="outline" className="h-28 rounded-3xl flex-col gap-3 glass-card hover:bg-primary hover:text-white transition-all">
                    <tool.icon className="h-6 w-6" />
                    <span className="font-bold">{tool.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Upcoming Mentorship */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black tracking-tighter">Upcoming Sessions</h2>
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                      <Users className="h-6 w-6" />
                   </div>
                   <div>
                      <h5 className="font-bold">VLSI Design Review</h5>
                      <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                   </div>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Join Session</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
