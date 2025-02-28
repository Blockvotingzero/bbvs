
import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function NavLink({ 
  href, 
  className, 
  activeClassName, 
  children, 
  onClick,
  ...props 
}: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      {...props}
      className={cn(
        className,
        isActive && activeClassName
      )}
    >
      {children}
    </Link>
  );
}

export function ButtonLink({ 
  href, 
  className, 
  children,
  onClick,
  ...props 
}: Omit<NavLinkProps, 'activeClassName'>) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      {...props}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
        className
      )}
    >
      {children}
    </Link>
  );
}
