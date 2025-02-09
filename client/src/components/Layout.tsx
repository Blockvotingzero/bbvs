import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-primary cursor-pointer">
              BlockVote
            </span>
          </Link>

          <div className="flex gap-6">
            <Link href="/">
              <span className={`${location === "/" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors cursor-pointer`}>
                Statistics
              </span>
            </Link>
            <Link href="/vote">
              <span className={`${location === "/vote" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors cursor-pointer`}>
                Vote
              </span>
            </Link>
            <Link href="/explorer">
              <span className={`${location === "/explorer" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors cursor-pointer`}>
                Explorer
              </span>
            </Link>
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
            <Link href="/privacy">
              <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}