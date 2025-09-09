"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, iconPosition = "left", ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative group">
          {iconPosition === "left" && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl",
              "bg-white/[0.03] backdrop-blur-sm",
              "border border-white/[0.08]",
              "px-4 py-3 text-base",
              "text-white placeholder:text-gray-500",
              "transition-all duration-300",
              "hover:bg-white/[0.05] hover:border-white/[0.12]",
              "focus:bg-white/[0.05] focus:border-purple-500/50",
              "focus:outline-none focus:ring-2 focus:ring-purple-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/[0.03] disabled:hover:border-white/[0.08]",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              iconPosition === "left" && "pl-12",
              iconPosition === "right" && "pr-12",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {iconPosition === "right" && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10">
              {icon}
            </div>
          )}
          
          {/* Premium focus glow effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-purple-500/10 blur-xl" />
          </div>
        </div>
      );
    }
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl",
          "bg-white/[0.03] backdrop-blur-sm",
          "border border-white/[0.08]",
          "px-4 py-3 text-base",
          "text-white placeholder:text-gray-500",
          "transition-all duration-300",
          "hover:bg-white/[0.05] hover:border-white/[0.12]",
          "focus:bg-white/[0.05] focus:border-purple-500/50",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/[0.03] disabled:hover:border-white/[0.08]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };