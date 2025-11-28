"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "outline" | "secondary";
  size: "lg" | "sm";
  children: ReactNode;
}

export const Button = ({ 
  size, 
  variant, 
  className, 
  children,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" 
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md" 
          : variant === "secondary" 
          ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80" 
          : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        size === "lg" ? "h-12 px-6 text-base" : "h-9 px-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
