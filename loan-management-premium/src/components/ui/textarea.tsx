"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative group">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl resize-none",
            "bg-white/[0.03] backdrop-blur-sm",
            "border border-white/[0.08]",
            "px-4 py-3 text-base",
            "text-white placeholder:text-gray-500",
            "transition-all duration-300",
            "hover:bg-white/[0.05] hover:border-white/[0.12]",
            "focus:bg-white/[0.05] focus:border-purple-500/50",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/[0.03] disabled:hover:border-white/[0.08]",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Premium focus glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-purple-500/10 blur-xl" />
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };