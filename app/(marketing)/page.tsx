"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Cpu, 
  ArrowRight, 
  CircuitBoard, 
  Bot, 
  Binary, 
  Layers, 
  Zap, 
  Shield, 
  Terminal,
  Globe,
  Code2,
  Microchip,
  Wrench
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const disciplines = [
  {
    title: "VLSI & Chip Design",
    description: "Master CMOS layout, digital logic synthesis, and FPGA prototyping for next-gen silicon.",
    icon: Microchip,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Embedded Systems",
    description: "Firmware engineering, RTOS development, and IoT architecture for smart devices.",
    icon: CircuitBoard,
    color: "from-emerald-500 to-teal-400",
  },
  {
    title: "Robotics & Control",
    description: "Mechatronics, automated control theory, and machine vision for autonomous systems.",
    icon: Bot,
    color: "from-orange-500 to-amber-400",
  },
  {
    title: "AI & Signal Processing",
    description: "Optimizing neural networks for edge computing and advanced DSP algorithms.",
    icon: Binary,
    color: "from-purple-500 to-indigo-400",
  },
];

export default function HomePage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 grid-pattern pointer-events-none -z-10 opacity-20" />
      <div className="fixed top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 text-center space-y-10 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            <Zap className="h-3.5 w-3.5 fill-current" /> Next-Gen Engineering Workbench
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl mx-auto"
          >
            Build the Future of <br />
            <span className="text-gradient">Intelligent Systems.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            A professional platform for Computer & Electronics Engineers. Master complex hardware, optimize firmware, and deploy AI at the edge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
              <Link href="/signup">Start Your Track <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-black text-lg glass-card">
              <Link href="/courses">Explore Lab Modules</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Decorative Elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full pointer-events-none -z-10"
        />
      </section>

      {/* Engineering Verticals */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Professional Verticals</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Specialized tracks designed by industry veterans to bridge the gap between academia and professional excellence.
              </p>
            </div>
            <Button variant="ghost" className="font-bold group">
              View All Curriculums <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplines.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl glass-card relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.description}
                </p>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <item.icon className="h-24 w-24" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engineering Assistant Section */}
      <section className="py-32 bg-primary/5 border-y border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                <Terminal className="h-3.5 w-3.5" /> Intelligent EDA Assistant
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                Design Smarter. <br />
                Debug Faster.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our proprietary AI model is trained on millions of hardware schematics and firmware repos. It assists you in Verilog synthesis, PCB layout optimization, and real-time power analysis.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Shield, text: "Schematic Validation" },
                  { icon: Globe, text: "Global Standards" },
                  { icon: Code2, text: "Verilog Debugging" },
                  { icon: Wrench, text: "Auto-Component Sourcing" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-[2rem] bg-background border border-border p-2 shadow-2xl overflow-hidden">
                <TerminalContent />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative">
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Ready to Accelerate Your <br />
            <span className="text-gradient">Engineering Career?</span>
          </motion.h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            Join 50,000+ engineering students and professionals mastering the next generation of technology.
          </p>
          <div className="flex justify-center gap-6">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TerminalContent() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "INITIALIZING AI_ENGINEER_V4.0..." },
    { type: "system", text: "SYSTEM READY. ENTER GOAL OR CIRCUIT DATA." },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userCommand = input;
    setHistory(prev => [...prev, { type: "user", text: `$ ${userCommand}` }]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let response = "Analysis complete. No critical issues found.";
      if (userCommand.toLowerCase().includes("circuit") || userCommand.toLowerCase().includes("pcb")) {
        response = "RECOMENDATION: Replace IC_7408 with SN74LS08D to reduce leakage current by 12%. Check junction temperature at 85°C.";
      } else if (userCommand.toLowerCase().includes("verilog") || userCommand.toLowerCase().includes("code")) {
        response = "OPTIMIZATION: Loop unrolling detected in line 42. Consider using pipelining for 20% throughput increase.";
      }

      setHistory(prev => [...prev, { type: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-muted/30 rounded-[1.5rem] p-8 aspect-square flex flex-col font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="ml-2 text-xs text-muted-foreground">edtrack_assistant --v4.0</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
        {history.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              ${line.type === "user" ? "text-emerald-500" : ""}
              ${line.type === "ai" ? "p-4 rounded-xl bg-card border border-border text-primary font-bold" : ""}
              ${line.type === "system" ? "text-muted-foreground" : ""}
            `}
          >
            {line.text}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center animate-pulse">
            <div className="w-2 h-4 bg-primary rounded-full" />
            <p className="text-xs text-muted-foreground">AI is processing data...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleCommand} className="mt-4 flex gap-2 border-t border-border/50 pt-4">
        <span className="text-emerald-500">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command..."
          className="bg-transparent border-none outline-none flex-1 text-foreground"
          autoFocus
        />
      </form>
    </div>
  );
}
