import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { auth } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LearnLoop AI — Your AI Learning Coach",
    template: "%s | LearnLoop AI",
  },
  description:
    "From goal to mastery. AI-powered personalized learning paths, adaptive quizzes, and a context-aware AI tutor for self-learners and students.",
  keywords: [
    "AI learning",
    "personalized education",
    "adaptive learning",
    "AI tutor",
    "learning path",
    "online education",
  ],
  authors: [{ name: "LearnLoop AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "LearnLoop AI",
    title: "LearnLoop AI — Your AI Learning Coach",
    description:
      "From goal to mastery. AI-powered personalized learning paths, adaptive quizzes, and a context-aware AI tutor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnLoop AI — Your AI Learning Coach",
    description:
      "From goal to mastery. AI-powered personalized learning paths, adaptive quizzes, and a context-aware AI tutor.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Navbar session={session} />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
