"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Menu, X, BookOpen, Terminal, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Lab", href: "/lab", icon: Terminal },
  { name: "Community", href: "/community", icon: Shield },
  { name: "AI Tools", href: "/tools", icon: Zap },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow"
          >
            <Cpu className="text-primary-foreground h-6 w-6" />
          </motion.div>
          <span className="text-xl font-bold tracking-tighter">
            Ed<span className="text-primary">Track</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.name}
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                layoutId="underline"
              />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" className="font-bold" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="font-bold rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-b border-border"
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium"
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.name}
              </Link>
            ))}
            <hr className="border-border/50" />
            <Button className="w-full font-bold">Get Started</Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
