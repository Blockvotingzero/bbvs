import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

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
                <a className={`${location === "/" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}>
                  Statistics
                </a>
              </Link>
            </li>
            <li>
              <Link href="/vote">
                <a className={`${location === "/vote" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}>
                  Vote
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