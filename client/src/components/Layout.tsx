import React from "react";
import { useLocation } from "wouter";
import { useTheme } from "../hooks/use-theme";
import { ErrorBoundary } from "./ErrorBoundary";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Blockchain Voting System</h1>
            <nav className="flex space-x-4">
              <a href="/" className={location === '/' ? 'font-bold' : ''}>Home</a>
              <a href="/explorer" className={location === '/explorer' ? 'font-bold' : ''}>Explorer</a>
              <a href="/vote" className={location === '/vote' ? 'font-bold' : ''}>Vote</a>
              <button onClick={toggleTheme} className="ml-4">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center dark:bg-gray-800 dark:text-white">
          <p>© 2023 Blockchain Voting System</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}