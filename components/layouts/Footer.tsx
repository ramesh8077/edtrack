import Link from "next/link";
import { Cpu, Code2, Globe, Briefcase, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { name: "All Courses", href: "/courses" },
      { name: "Learning Paths", href: "/paths" },
      { name: "Certifications", href: "/certs" },
      { name: "Lab Access", href: "/lab" },
    ],
  },
  {
    title: "Engineering",
    links: [
      { name: "VLSI Design", href: "#" },
      { name: "Embedded Systems", href: "#" },
      { name: "Robotics", href: "#" },
      { name: "AI Hardware", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Partner Program", href: "/partners" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Cpu className="text-primary-foreground h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">
                Ed<span className="text-primary">Track</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-lg max-w-xs">
              Empowering the next generation of Electronics and Computer Engineers with industry-grade tools and training.
            </p>
            <div className="flex gap-4">
              {[Code2, Globe, Briefcase, Mail].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="font-bold text-lg">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>© 2026 EdTrack Engineering. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
