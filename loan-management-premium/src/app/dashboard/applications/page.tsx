"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft
} from "lucide-react";
import { getPaginatedApplications, ApplicationFilters } from "@/services/applications-paginated";
import type { LoanApplication } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { SimplePagination } from "@/components/ui/pagination";
import { DocumentSnapshot } from "firebase/firestore";

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [pageHistory, setPageHistory] = useState<DocumentSnapshot[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      await loadApplications();
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadApplications = async (loadNext = false, loadPrevious = false) => {
    setLoading(true);
    try {
      let currentLastDoc = null;
      
      if (loadNext && lastDoc) {
        currentLastDoc = lastDoc;
        setPageHistory([...pageHistory, lastDoc]);
      } else if (loadPrevious && pageHistory.length > 1) {
        const newHistory = [...pageHistory];
        newHistory.pop();
        currentLastDoc = newHistory[newHistory.length - 1] || null;
        setPageHistory(newHistory);
      } else if (!loadNext && !loadPrevious) {
        setPageHistory([]);
      }

      const filters: ApplicationFilters = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter as any;
      }
      if (searchQuery) {
        filters.searchTerm = searchQuery;
      }

      const result = await getPaginatedApplications(itemsPerPage, currentLastDoc, filters);
      
      // Get applications from Firestore only
      setApplications(result.data);
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500 bg-gray-500/10';
      case 'submitted':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'approved':
        return 'text-green-500 bg-green-500/10';
      case 'rejected':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      return new Date(date.toDate()).toLocaleDateString('en-IN');
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('en-IN');
    }
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-IN');
    }
    return 'N/A';
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info("Export feature coming soon!");
  };

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

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/[0.08] backdrop-blur-xl bg-white/[0.02]"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Loan Applications</h1>
                <p className="text-sm text-gray-400">Manage and track all loan applications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GradientButton
                onClick={handleExport}
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </GradientButton>
              <GradientButton
                onClick={() => router.push('/dashboard/applications/new')}
                icon={<Plus className="w-5 h-5" />}
              >
                New Application
              </GradientButton>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, mobile, or form number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <SelectField
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </SelectField>
            </div>
          </GlassCard>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            {applications.length > 0 ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Form Number</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Applicant</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <motion.tr
                          key={app.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-4">
                            <span className="font-medium text-white">{app.formNumber}</span>
                            {app.isTemporary && (
                              <span className="ml-2 text-xs text-yellow-500">(Local)</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-white">
                                {app.applicantDetails?.firstName} {app.applicantDetails?.lastName}
                              </p>
                              <p className="text-sm text-gray-400">{app.applicantDetails?.mobileNo}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-white">
                              {formatCurrency(app.loanDetails?.totalAmount || 0)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status || 'draft')}`}>
                              {getStatusIcon(app.status || 'draft')}
                              {app.status || 'Draft'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {formatDate(app.createdAt)}
                            </div>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4 p-4">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-white">{app.formNumber}</p>
                          <p className="text-sm text-gray-400">
                            {app.applicantDetails?.firstName} {app.applicantDetails?.lastName}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(app.status || 'draft')}`}>
                          {getStatusIcon(app.status || 'draft')}
                          {app.status || 'Draft'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Amount</span>
                          <span className="text-sm text-white font-medium">
                            {formatCurrency(app.loanDetails?.totalAmount || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Date</span>
                          <span className="text-sm text-white">
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                        className="w-full mt-4 p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-400 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/[0.08]">
                  <SimplePagination
                    hasMore={hasMore}
                    onNext={() => loadApplications(true)}
                    onPrevious={() => loadApplications(false, true)}
                    canGoPrevious={pageHistory.length > 0}
                    isLoading={loading}
                  />
                </div>
              </>
            ) : (
              <div className="p-16 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Applications Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? "Try adjusting your filters" 
                    : "Create your first loan application to get started"}
                </p>
                {(!searchQuery && statusFilter === 'all') && (
                  <GradientButton
                    onClick={() => router.push('/dashboard/applications/new')}
                    icon={<Plus className="w-5 h-5" />}
                  >
                    Create Application
                  </GradientButton>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}