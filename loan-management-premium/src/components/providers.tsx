"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(17, 24, 39, 0.9)",
            color: "#e5e7eb",
            border: "1px solid rgba(75, 85, 99, 0.3)",
            backdropFilter: "blur(10px)",
          },
        }}
      />
    </AuthProvider>
  );
}