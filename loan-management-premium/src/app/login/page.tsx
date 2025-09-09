"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  Building2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data();
      
      // Show success message
      toast.success(`Welcome back, ${userData['name'] || "User"}!`);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      const authError = error as { code?: string; message?: string };
      if (authError.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (authError.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (authError.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (authError.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(authError.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials component
  const DemoCredentials = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
    >
      <p className="text-xs font-medium text-purple-300 mb-2">Demo Credentials</p>
      <div className="space-y-1 text-xs text-gray-400">
        <p>Email: demo@example.com</p>
        <p>Password: demo123</p>
      </div>
    </motion.div>
  );

  const features = [
    { icon: Shield, title: "Secure", desc: "Bank-grade security" },
    { icon: TrendingUp, title: "Fast", desc: "Quick loan processing" },
    { icon: Building2, title: "Trusted", desc: "10+ years of service" }
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: i === 0 
                ? "radial-gradient(circle, #8b5cf6, transparent)" 
                : i === 1 
                ? "radial-gradient(circle, #ec4899, transparent)"
                : "radial-gradient(circle, #3b82f6, transparent)",
            }}
          />
        ))}
      </div>

      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to manage your loan applications
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-400">{error}</span>
                  </motion.div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-gray-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-gray-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <GradientButton
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={isLoading}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="mt-8"
                >
                  Sign In
                </GradientButton>
              </form>

              <DemoCredentials />
            </GlassCard>
          </motion.div>

          <motion.p 
            className="text-center text-sm text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            © 2024 Loan Management System. All rights reserved.
          </motion.p>
        </motion.div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Streamline Your Loan Management
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Our platform helps you process loan applications faster and more efficiently than ever before.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">10K+</p>
              <p className="text-sm text-gray-400 mt-1">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">₹50M</p>
              <p className="text-sm text-gray-400 mt-1">Loans Processed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">99.9%</p>
              <p className="text-sm text-gray-400 mt-1">Uptime</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}