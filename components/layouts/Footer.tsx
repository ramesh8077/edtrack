import Link from "next/link";

export function Footer() {
  const devName = process.env.NEXT_PUBLIC_DEV_NAME || "Ramesh";
  const githubLink = process.env.NEXT_PUBLIC_DEV_GITHUB || "https://github.com/ramesh";
  const linkedinLink = process.env.NEXT_PUBLIC_DEV_LINKEDIN || "https://linkedin.com/in/ramesh";

  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
          <p>© {new Date().getFullYear()} Build for House of Edtech — Fullstack Assignment 2026</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row md:gap-4">
          <span className="font-medium text-foreground">Developed by {devName}</span>
          <span className="hidden sm:inline-block">|</span>
          <div className="flex items-center gap-4">
            <Link
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              aria-label="GitHub Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub</span>
            </Link>
            <span className="hidden sm:inline-block">|</span>
            <Link
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
              aria-label="LinkedIn Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
