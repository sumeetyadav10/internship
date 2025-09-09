"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GradientButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success" | "premium";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary: "from-purple-600 to-pink-600 shadow-purple-600/30 hover:shadow-purple-600/50 hover:from-purple-700 hover:to-pink-700",
  secondary: "from-gray-700 to-gray-900 shadow-gray-800/30 hover:shadow-gray-800/50 hover:from-gray-800 hover:to-black",
  danger: "from-red-600 to-rose-600 shadow-red-600/30 hover:shadow-red-600/50 hover:from-red-700 hover:to-rose-700",
  success: "from-emerald-600 to-green-600 shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:from-emerald-700 hover:to-green-700",
  premium: "from-amber-500 via-purple-600 to-pink-600 shadow-purple-600/30 hover:shadow-purple-600/50 animate-gradient bg-[length:200%_100%]",
};

const sizes = {
  sm: "h-9 px-4 text-sm font-medium",
  md: "h-11 px-6 text-base font-semibold", 
  lg: "h-12 px-8 text-lg font-semibold",
  xl: "h-14 px-10 text-xl font-bold",
};

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "md",
    disabled,
    loading,
    fullWidth,
    icon,
    iconPosition = "left",
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          "rounded-xl text-white font-semibold",
          "bg-gradient-to-r shadow-2xl",
          "transform-gpu transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:-translate-y-0.5",
          "active:scale-[0.98] active:translate-y-0",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "disabled:hover:scale-100 disabled:hover:translate-y-0",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black",
          "group overflow-hidden",
          fullWidth && "w-full",
          variants[variant],
          sizes[size],
          className
        )}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        disabled={isDisabled}
        {...props}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="h-full w-full bg-gradient-to-b from-white/25 via-transparent to-transparent rounded-xl" />
        </div>
        
        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          {loading ? (
            <>
              <motion.svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </motion.svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              {icon && iconPosition === "left" && <span className="w-5 h-5">{icon}</span>}
              {children}
              {icon && iconPosition === "right" && <span className="w-5 h-5">{icon}</span>}
            </>
          )}
        </span>
        
        {/* Premium animated background */}
        {variant === "premium" && (
          <motion.div
            className="absolute inset-0 opacity-50 blur-xl"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "linear-gradient(270deg, #f59e0b, #8b5cf6, #ec4899, #f59e0b)",
              backgroundSize: "200% 200%",
            }}
          />
        )}
        
        {/* Glow effect */}
        <div className={cn(
          "absolute -inset-1 rounded-xl bg-gradient-to-r blur-lg opacity-30 transition-opacity duration-500",
          "group-hover:opacity-50",
          variants[variant],
          isDisabled && "opacity-0"
        )} />
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";