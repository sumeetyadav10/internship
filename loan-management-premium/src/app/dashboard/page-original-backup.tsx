"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Calendar,
  LogOut,
  Plus,
  Eye,
  Settings,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { Statistics, LoanApplication } from "@/types";
import { getRecentApplications } from "@/services/applications";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [recentApplications, setRecentApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        return;
      }

      try {

          // Get statistics
          const statsDoc = await getDoc(doc(db, "statistics", "dashboard"));
          if (statsDoc.exists()) {
            setStats(statsDoc.data() as Statistics);
          }

          // Get recent applications from Firestore only
          const applications = await getRecentApplications(5);
          setRecentApplications(applications);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: FileText,
      trend: { value: 12, up: true },
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Draft Applications",
      value: stats?.draftApplications || 0,
      icon: Clock,
      trend: { value: 8, up: false },
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-500/10",
      iconColor: "text-gray-500",
    },
    {
      title: "Submitted",
      value: stats?.submittedApplications || 0,
      icon: Clock,
      trend: { value: 8, up: false },
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Approved",
      value: stats?.approvedApplications || 0,
      icon: CheckCircle,
      trend: { value: 24, up: true },
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
    },
  ];

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Loan Management System
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {getGreeting()}, {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Activity className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="h-8 w-px bg-white/10" />
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.displayName || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              
              <GradientButton
                size="sm"
                variant="secondary"
                onClick={logout}
                icon={<LogOut className="w-4 h-4" />}
                iconPosition="right"
              >
                Sign Out
              </GradientButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Dashboard Overview
              </h2>
              <p className="text-gray-400">
                Track and manage loan applications in real-time
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Date</p>
              <p className="text-lg font-semibold text-white">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 relative overflow-hidden group" hover>
                {/* Background decoration */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} backdrop-blur-sm`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend.up ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend.up ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.trend.value}%
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-8 mb-8" variant="premium">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <GradientButton
                  fullWidth
                  size="lg"
                  variant="primary"
                  icon={<Plus className="w-5 h-5" />}
                  onClick={() => router.push("/dashboard/applications/new")}
                  className="h-24 flex-col gap-2"
                >
                  <span className="text-lg font-semibold">New Application</span>
                  <span className="text-sm opacity-80">Start a new loan process</span>
                </GradientButton>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => router.push("/dashboard/applications")}
                  className="w-full h-24 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                >
                  <Eye className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-lg font-semibold text-white">View Applications</span>
                  <span className="text-sm text-gray-400">Track all submissions</span>
                </button>
              </motion.div>
              
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => router.push("/dashboard/masters")}
                    className="w-full h-24 px-6 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                  >
                    <Settings className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-lg font-semibold text-white">Manage Masters</span>
                    <span className="text-sm text-gray-400">System configuration</span>
                  </button>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Applications with Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                </div>
                <button
                  onClick={() => router.push("/dashboard/applications")}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <AnimatePresence>
                {recentApplications.length > 0 ? (
                  <div className="space-y-3">
                    {recentApplications.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer group"
                        onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                              {app.applicantDetails.firstName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                {app.applicantDetails.firstName} {app.applicantDetails.lastName}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">Form: {app.formNumber}</p>
                                {(app as any).isTemporary && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                    Saved Locally
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              app.status === 'submitted'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : app.status === 'approved'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : app.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                            <p className="text-sm font-semibold text-white">
                              {formatCurrency(app.loanDetails.totalAmount || 0)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Industry</p>
                            <p className="text-sm text-gray-300 truncate">
                              {app.applicantDetails.industryName || '-'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">District</p>
                            <p className="text-sm text-gray-300">
                              {app.applicantDetails.district || '-'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 mb-2">No recent applications</p>
                    <p className="text-sm text-gray-500">Create your first application to get started</p>
                  </div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Activity Overview</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Applications</span>
                    <span className="text-white font-medium">72%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Approvals</span>
                    <span className="text-white font-medium">58%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: "58%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Disbursements</span>
                    <span className="text-white font-medium">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Active</p>
                    <p className="text-2xl font-bold text-white">124</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">89%</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}