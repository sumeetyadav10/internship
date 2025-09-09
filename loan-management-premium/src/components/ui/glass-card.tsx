"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "highlight" | "danger" | "premium";
  delay?: number;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, hover = true, variant = "default", delay = 0, ...props }, ref) => {
    const variantClasses = {
      default: "",
      highlight: "before:from-purple-600/20 before:to-pink-600/20",
      danger: "before:from-red-600/20 before:to-orange-600/20", 
      premium: "before:from-purple-600/30 before:via-pink-600/30 before:to-blue-600/30"
    };
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative glass glass-hover group",
          "before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px]",
          "before:bg-gradient-to-br before:from-white/10 before:to-white/5",
          "before:mask-[linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)]",
          "before:mask-composite-exclude before:pointer-events-none",
          variantClasses[variant],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          delay,
          ease: [0.21, 0.47, 0.32, 0.98]
        }}
        whileHover={hover ? { 
          y: -4,
          transition: { duration: 0.3, ease: "easeOut" }
        } : undefined}
        {...props}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
          <div className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 group-hover:animate-shimmer transition-opacity duration-500" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Premium gradient glow on hover */}
        {variant === "premium" && (
          <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-xl" />
          </div>
        )}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";