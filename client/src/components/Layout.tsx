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
          <div> {/* Added div to wrap the Link */}
            <Link href="/">
              <a className="text-xl sm:text-2xl font-bold text-primary">
                BlockVote
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div> {/* Added div to wrap the Link */}
              <Link href="/">
                <a className={`${location === "/" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors flex items-center gap-2 text-sm sm:text-base`}>
                  <span>Statistics</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                </a>
              </Link>
            </div>

            <div> {/* Added div to wrap the Link */}
              <Link href="/explorer">
                <a className={`${location === "/explorer" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors text-sm sm:text-base hidden sm:block`}>
                  Explorer
                </a>
              </Link>
            </div>

            <div> {/* Added div to wrap the Link */}
              <Link href="/login">
                <Button variant="default" size="sm" className="gap-2">
                  <Vote className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-sm">Vote</span>
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={toggleTheme}
            >
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <p>© 2024 BlockVote. All rights reserved.</p>
          <div className="flex gap-2 sm:gap-4">
            <div> {/* Added div to wrap the a tag */}
              <a href="#" className="hover:text-primary">Privacy Policy</a>
            </div>
            <div> {/* Added div to wrap the a tag */}
              <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}