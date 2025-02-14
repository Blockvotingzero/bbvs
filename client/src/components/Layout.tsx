import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
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

          <ul className="flex gap-6">
            <li>
              <Link href="/">
                <a className={`${location === "/" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors flex items-center gap-2`}>
                  Statistics
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                </a>
              </Link>
            </li>
            
            <li>
              <Link href="/explorer">
                <a className={`${location === "/explorer" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}>
                  Explorer
                </a>
              </Link>
            </li>
          </ul>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-4"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
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