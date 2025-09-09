"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  error?: boolean;
  icon?: React.ReactNode;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, error, icon, children, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors z-10 pointer-events-none">
            {icon}
          </div>
        )}
        
        <select
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl appearance-none cursor-pointer",
            "bg-white/[0.03] backdrop-blur-sm",
            "border border-white/[0.08]",
            "px-4 py-3 text-base",
            "text-white",
            "transition-all duration-300",
            "hover:bg-white/[0.05] hover:border-white/[0.12]",
            "focus:bg-white/[0.05] focus:border-purple-500/50",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/[0.03] disabled:hover:border-white/[0.08]",
            icon && "pl-12",
            "pr-12", // Space for chevron
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        >
          {children}
        </select>
        
        {/* Custom chevron icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-all duration-300 group-focus-within:rotate-180" />
        </div>
        
        {/* Premium focus glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-purple-500/10 blur-xl" />
        </div>
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export { SelectField };