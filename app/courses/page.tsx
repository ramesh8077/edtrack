"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  BarChart, 
  Users, 
  Search, 
  Filter,
  Cpu,
  CircuitBoard,
  Bot,
  Binary,
  Microchip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: 1,
    title: "Advanced VLSI Design",
    description: "Deep dive into 7nm CMOS layout, digital logic synthesis, and parasitic extraction.",
    level: "Advanced",
    duration: "12 Weeks",
    students: "1.2k",
    icon: Microchip,
    category: "VLSI",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Embedded RTOS Mastery",
    description: "Programming real-time kernels on STM32 and FreeRTOS for safety-critical systems.",
    level: "Intermediate",
    duration: "8 Weeks",
    students: "2.5k",
    icon: CircuitBoard,
    category: "Embedded",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "Robotics & PID Control",
    description: "Designing closed-loop control systems for autonomous drones and mechatronic arms.",
    level: "Intermediate",
    duration: "10 Weeks",
    students: "800",
    icon: Bot,
    category: "Robotics",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 4,
    title: "AI Hardware Accelerators",
    description: "Optimizing neural network inference on FPGAs and custom TPU architectures.",
    level: "Advanced",
    duration: "14 Weeks",
    students: "1.5k",
    icon: Binary,
    category: "AI",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 5,
    title: "Computer Architecture",
    description: "From instruction set architecture (ISA) to out-of-order execution and cache coherence.",
    level: "Intermediate",
    duration: "9 Weeks",
    students: "3k",
    icon: Cpu,
    category: "Architecture",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: 6,
    title: "Digital Signal Processing",
    description: "Fast Fourier Transforms, digital filtering, and real-time audio processing algorithms.",
    level: "Intermediate",
    duration: "8 Weeks",
    students: "1.8k",
    icon: Binary,
    category: "Signal Processing",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tracks");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Tracks" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All Tracks", "VLSI", "Embedded", "Robotics", "AI Hardware", "Architecture", "DSP"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black tracking-tighter"
            >
              Engineering <span className="text-primary">Curriculum</span>
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Professional-grade courses designed for Electronics and Computer Engineers.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search engineering tracks..." 
                className="pl-10 h-12 rounded-xl glass-card border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 w-12 rounded-xl p-0 glass-card">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar mb-8">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"} 
              className="rounded-full px-6 whitespace-nowrap h-10 font-bold"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group rounded-3xl glass-card border border-border/40 overflow-hidden flex flex-col h-full"
              >
                <div className="p-8 space-y-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl ${course.bgColor} ${course.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <course.icon className="h-7 w-7" />
                    </div>
                    <Badge variant="secondary" className="font-bold rounded-full px-3 py-1 bg-primary/5 text-primary">
                      {course.level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight">{course.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> {course.students}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 border-t border-border/20">
                  <Button className="w-full font-black h-12 rounded-xl group-hover:glow transition-all">
                    Enroll in Track
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No tracks found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter.</p>
              <Button variant="ghost" onClick={() => { setSearchQuery(""); setActiveCategory("All Tracks"); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Certification Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[2.5rem] bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CircuitBoard className="w-64 h-64" />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Get Professional <br /> Engineering Certifications
            </h2>
            <p className="text-lg text-primary-foreground/90 font-medium leading-relaxed">
              Our certificates are recognized by top silicon valley firms. Each course includes a hands-on project and code review.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-xl font-black text-lg">
              Learn More About Certs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
