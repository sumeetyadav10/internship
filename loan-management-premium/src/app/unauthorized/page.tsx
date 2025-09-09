"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <GlassCard className="p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
            >
              <ShieldX className="w-10 h-10 text-red-500" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Access Denied
            </h1>
            
            <p className="text-gray-400 mb-8">
              You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <GradientButton
                onClick={() => router.back()}
                variant="secondary"
                icon={<ArrowLeft className="w-4 h-4" />}
                fullWidth
              >
                Go Back
              </GradientButton>
              
              <GradientButton
                onClick={() => router.push('/dashboard')}
                icon={<Home className="w-4 h-4" />}
                fullWidth
              >
                Dashboard
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}