"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getApplications } from "@/services/applications";
import type { LoanApplication } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Database, 
  Settings,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      try {
        const apps = await getApplications();
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Calculate real statistics from applications
  const stats = {
    total: applications.length,
    draft: applications.filter(app => app.status === 'draft').length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    approved: applications.filter(app => app.status === 'approved').length,
  };

  // Filter applications based on search and filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.formNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantDetails.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantDetails.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantDetails.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'drafts') return matchesSearch && app.status === 'draft';
    if (activeFilter === 'submitted') return matchesSearch && app.status === 'submitted';
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await auth.signOut();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      const names = currentUser.displayName.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase();
    }
    return 'LO';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#17a2b8]"></div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: #f8f9fa;
          height: 100vh;
          overflow: hidden;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 250px;
          background: #ffffff;
          border-right: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .user-profile {
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 12px;
          color: #6c757d;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          color: #6c757d;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          gap: 12px;
        }

        .nav-item:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .nav-item.active {
          background: #17a2b8;
          color: white;
        }

        .sidebar-footer {
          border-top: 1px solid #e9ecef;
        }

        .nav-item.logout {
          color: #dc3545;
        }

        .nav-item.logout:hover {
          background: #f8f9fa;
          color: #dc3545;
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .search-bar {
          background: white;
          padding: 20px 40px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
        }

        .search-bar input {
          width: 100%;
          max-width: 600px;
          padding: 12px 20px 12px 45px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 14px;
          background: #f8f9fa;
          outline: none;
        }

        .search-bar input:focus {
          border-color: #17a2b8;
        }

        .content-area {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .stats-container {
          margin-bottom: 40px;
        }

        .stats-title {
          font-size: 16px;
          font-weight: 500;
          color: #495057;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: flex;
          gap: 20px;
          margin-bottom: 50px;
        }

        .stat-card {
          flex: 1;
          padding: 24px 20px;
          border-radius: 8px;
          color: white;
          position: relative;
          overflow: hidden;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .stat-card.blue {
          background: linear-gradient(70deg,
            #b3e5fc 0%, #b3e5fc 30%,
            #81d4fa 30%, #81d4fa 60%,
            #6A9EDB 60%, #6A9EDB 85%,
            #354d7f 85%, #354d7f 100%
          );
        }

        .stat-card.teal {
          background: linear-gradient(70deg,
            #b2dfdb 0%, #b2dfdb 30%,
            #80cbc4 30%, #80cbc4 60%,
            #4db6ac 60%, #4db6ac 85%,
            #00897b 85%, #00897b 100%
          );
        }

        .stat-card.green {
          background: linear-gradient(70deg,
            #c8e6c9 0%, #c8e6c9 30%,
            #81c784 30%, #81c784 60%,
            #66bb6a 60%, #66bb6a 85%,
            #388e3c 85%, #388e3c 100%
          );
        }

        .stat-card.orange {
          background: linear-gradient(70deg,
            #ffe0b2 0%, #ffe0b2 30%,
            #ffcc80 30%, #ffcc80 60%,
            #ffa726 60%, #ffa726 85%,
            #f57c00 85%, #f57c00 100%
          );
        }

        .stat-number {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 4px;
          line-height: 1;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .stat-label {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.95;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Overview Section */
        .overview-section {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .overview-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-header {
          font-size: 20px;
          font-weight: 600;
          color: #495057;
        }

        .overview-subtitle {
          font-size: 14px;
          color: #6c757d;
        }

        .overview-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding: 8px 16px 8px 35px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 13px;
          width: 200px;
          outline: none;
        }

        .search-box input:focus {
          border-color: #17a2b8;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          background: white;
          font-size: 13px;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: #f8f9fa;
        }

        .filter-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        /* Table Styles */
        .applications-table {
          width: 100%;
        }

        .applications-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .applications-table thead {
          background: #f8f9fa;
        }

        .applications-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e9ecef;
        }

        .applications-table tr {
          border-bottom: 1px solid #f1f3f4;
        }

        .applications-table tbody tr:hover {
          background: #f8f9fa;
        }

        .applications-table td {
          padding: 20px;
          font-size: 14px;
          color: #495057;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }

        .status-badge.draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.submitted {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .view-btn {
          padding: 6px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .view-btn:hover {
          background: #0056b3;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .help-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
          transition: all 0.2s ease;
        }

        .help-button:hover {
          background: #0056b3;
          box-shadow: 0 4px 16px rgba(0, 123, 255, 0.4);
          transform: translateY(-2px);
        }

        /* Pagination Styles */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          background: white;
          color: #6c757d;
          font-size: 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 40px;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-info {
          color: #6c757d;
          font-size: 14px;
          margin: 0 16px;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -250px;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
          }
          
          .sidebar.active {
            left: 0;
          }
          
          .content-area {
            padding: 20px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="user-profile">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-info">
              <h3 className="user-name">{currentUser?.displayName || 'loangoa'}</h3>
              <p className="user-role">User</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <Link href="/dashboard" className="nav-item active">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/dashboard/applications/new" className="nav-item">
              <FileText size={20} />
              Fill New Form
            </Link>
            <Link href="/dashboard/applications" className="nav-item">
              <Search size={20} />
              Access Form by Number
            </Link>
            <Link href="/dashboard/masters" className="nav-item">
              <Database size={20} />
              Masters
            </Link>
          </nav>
          
          <div className="sidebar-footer">
            <Link href="#" className="nav-item">
              <Settings size={20} />
              Settings
            </Link>
            <a href="#" onClick={handleLogout} className="nav-item logout">
              <LogOut size={20} />
              Logout
            </a>
          </div>
        </aside>
        
        <main className="main-content">
          <div className="search-bar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF" style={{ position: 'absolute', left: '55px', top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M12.9 14.32C11.55 15.36 9.85 16 8 16C3.58 16 0 12.42 0 8C0 3.58 3.58 0 8 0C12.42 0 16 3.58 16 8C16 9.85 15.36 11.55 14.32 12.9L19.41 18L18 19.41L12.9 14.32ZM8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14Z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search by form number, name, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="content-area">
            <div className="stats-container">
              <h2 className="stats-title">Application Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card blue" onClick={() => setActiveFilter('all')}>
                  <h3 className="stat-number">{stats.total}</h3>
                  <p className="stat-label">Total Applications</p>
                </div>
                <div className="stat-card teal" onClick={() => setActiveFilter('drafts')}>
                  <h3 className="stat-number">{stats.draft}</h3>
                  <p className="stat-label">Draft Forms</p>
                </div>
                <div className="stat-card green" onClick={() => setActiveFilter('submitted')}>
                  <h3 className="stat-number">{stats.submitted}</h3>
                  <p className="stat-label">Submitted</p>
                </div>
                <div className="stat-card orange">
                  <h3 className="stat-number">{stats.approved}</h3>
                  <p className="stat-label">Approved</p>
                </div>
              </div>
            </div>
            
            <div className="overview-section">
              <div className="overview-header">
                <div className="overview-info">
                  <h2 className="section-header">Overview</h2>
                  <p className="overview-subtitle">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length} applications
                  </p>
                </div>
                <div className="overview-controls">
                  <div className="search-box">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                      <path d="M12.9 14.32C11.55 15.36 9.85 16 8 16C3.58 16 0 12.42 0 8C0 3.58 3.58 0 8 0C12.42 0 16 3.58 16 8C16 9.85 15.36 11.55 14.32 12.9L19.41 18L18 19.41L12.9 14.32ZM8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14Z"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-btn ${activeFilter === 'drafts' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('drafts')}
                    >
                      Drafts
                    </button>
                    <button 
                      className={`filter-btn ${activeFilter === 'submitted' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('submitted')}
                    >
                      Submitted
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="applications-table">
                {currentApplications.length > 0 ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>FORM NUMBER</th>
                          <th>APPLICANT NAME</th>
                          <th>STATUS</th>
                          <th>AMOUNT</th>
                          <th>DATE</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentApplications.map((app) => (
                          <tr key={app.id}>
                            <td>{app.formNumber}</td>
                            <td>{app.applicantDetails.firstName} {app.applicantDetails.lastName}</td>
                            <td>
                              <span className={`status-badge ${app.status}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </td>
                            <td>{formatCurrency(app.loanDetails?.totalAmount || 0)}</td>
                            <td>{formatDate(app.createdAt)}</td>
                            <td>
                              <button 
                                className="view-btn"
                                onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          className="pagination-btn"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = index + 1;
                          } else if (currentPage <= 3) {
                            pageNum = index + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + index;
                          } else {
                            pageNum = currentPage - 2 + index;
                          }
                          
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <span className="pagination-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        
                        <button 
                          className="pagination-btn"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    <p>No applications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <button className="help-button">Help</button>
    </>
  );
}