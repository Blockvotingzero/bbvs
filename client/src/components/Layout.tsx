import { Link, useLocation } from "wouter";
import { Moon, Sun, Vote } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">
              BlockVote
            </a>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/">
              <a className={`${location === "/" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors flex items-center gap-2`}>
                Statistics
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
              </a>
            </Link>

            <Link href="/explorer">
              <a className={`${location === "/explorer" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}>
                Explorer
              </a>
            </Link>

            <Link href="/login">
              <Button variant="default" className="gap-2">
                <Vote className="h-4 w-4" />
                Vote
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 BlockVote. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Link } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="vote">🗳️</span>
            BlockVote
          </Link>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link className="hover:text-primary" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" to="/liveness-check">
                  Vote
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" to="/results">
                  Results
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          BlockVote © 2023 - Powered by Blockchain Technology
        </div>
      </footer>
    </div>
  );
}
