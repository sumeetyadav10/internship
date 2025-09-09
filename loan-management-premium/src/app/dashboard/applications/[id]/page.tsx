"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  ArrowLeft,
  User,
  MapPin,
  Calculator,
  Shield,
  FileText,
  Download,
  Eye,
  Check,
  X,
  Clock,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Building2,
  Hash,
  Printer,
  Edit,
  Share2,
  Users,
  Briefcase,
  Building
} from "lucide-react";
import { getApplicationById, updateApplicationStatus } from "@/services/applications";
import type { LoanApplication } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { isValidDocument, getDocumentLabel } from "@/utils/document-validation";
import { toast } from "sonner";

export default function ApplicationViewPage() {
  // Add CSS styles to match loan form UI
  const pageStyles = `
    body {
      background: linear-gradient(to bottom, #e6f3ff, #f0f8ff) !important;
    }
  `;
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(false);
  const applicationId = params['id'] as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      if (applicationId) {
        try {
          const app = await getApplicationById(applicationId);
          if (app) {
            console.log(`=== Debug: Application ${applicationId} ===`);
            console.log('Application data:', app);
            console.log('Documents:', app.documents);
            console.log('Document count:', app.documents ? Object.keys(app.documents).length : 0);
            
            // Log each document
            if (app.documents) {
              Object.entries(app.documents).forEach(([key, doc]) => {
                console.log(`Document ${key}:`, doc);
                if (doc && typeof doc === 'object') {
                  console.log(`- Has URL: ${'url' in doc}`);
                  console.log(`- URL length: ${doc.url?.length || 0}`);
                  console.log(`- Structure:`, Object.keys(doc));
                }
              });
            }
            
            setApplication(app);
          } else {
            toast.error("Application not found");
            router.push("/dashboard/applications");
          }
        } catch (error) {
          console.error("Error fetching application:", error);
          toast.error("Failed to load application");
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [applicationId, router]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!application?.id) return;
    
    try {
      await updateApplicationStatus(application.id, newStatus as 'draft' | 'submitted' | 'approved' | 'rejected');
      setApplication({ ...application, status: newStatus as 'draft' | 'submitted' | 'approved' | 'rejected' });
      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Loan Application - ${application?.formNumber}`,
          text: `View loan application for ${application?.applicantDetails.firstName} ${application?.applicantDetails.lastName}`,
          url: window.location.href
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
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

  if (!application) {
    return null;
  }

  return (
    <>
      <style jsx global>{pageStyles}</style>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e6f3ff, #f0f8ff)',
        padding: '20px'
      }}>
      {/* Container */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#f8f9fa',
          padding: '25px 40px',
          borderBottom: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                <ArrowLeft style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                Back to Dashboard
              </button>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#495057', margin: '10px 0 5px 0' }}>Loan Application Form</h1>
              <div style={{ fontSize: '16px', color: '#6c757d' }}>
                Form Number: <span style={{ fontWeight: 'bold', color: '#17a2b8' }}>{application.formNumber}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrint}
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <Printer style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                Print
              </button>
              {application.status === 'draft' && (
                <button
                  onClick={() => router.push(`/dashboard/applications/edit/${application.id}`)}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div style={{ padding: '40px', background: '#f8f9fa' }}>
          {/* Status Card */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#495057', marginBottom: '10px' }}>
                  {application.applicantDetails.firstName} {application.applicantDetails.lastName}
                </h2>
                <div style={{ display: 'flex', gap: '20px', color: '#6c757d', fontSize: '14px' }}>
                  <span><Phone style={{ width: '14px', height: '14px', display: 'inline', marginRight: '5px' }} />{application.applicantDetails.mobileNo}</span>
                  <span><Mail style={{ width: '14px', height: '14px', display: 'inline', marginRight: '5px' }} />{application.applicantDetails.email}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  <span style={{ color: '#6c757d' }}>Status: </span>
                  <span style={{ 
                    fontWeight: '600',
                    color: application.status === 'approved' ? '#28a745' :
                           application.status === 'rejected' ? '#dc3545' :
                           application.status === 'submitted' ? '#007bff' :
                           '#6c757d'
                  }}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <span style={{ marginLeft: '20px', color: '#6c757d' }}>
                    <Calendar style={{ width: '14px', height: '14px', display: 'inline', marginRight: '5px' }} />
                    {application.createdAt?.toDate 
                      ? new Date(application.createdAt.toDate()).toLocaleDateString()
                      : typeof application.createdAt === 'string' || application.createdAt instanceof Date
                        ? new Date(application.createdAt as string | Date).toLocaleDateString()
                        : 'N/A'}
                  </span>
                </div>
              </div>
              
              {isAdmin && application.status === 'submitted' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Check style={{ width: '16px', height: '16px', display: 'inline', marginRight: '5px' }} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px', display: 'inline', marginRight: '5px' }} />
                    Reject
                  </button>
                </div>
              )}
            </div>

            {/* Loan Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan Amount</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#007bff' }}>
                  {formatCurrency(application.loanDetails.totalAmount)}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Industry</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#495057' }}>
                  {application.applicantDetails.industryName}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Location</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#495057' }}>
                  {application.applicantDetails.district}, {application.applicantDetails.taluka}
                </p>
              </div>
            </div>
          </div>
          {/* Applicant Details Section */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>Applicant Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan Account No</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.loanAccountNo || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Year</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.year || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Full Name</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>
                  {`${application.applicantDetails.salutation || ''} ${application.applicantDetails.firstName} ${application.applicantDetails.middleName || ''} ${application.applicantDetails.lastName}`.trim()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Mobile Number</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.mobileNo}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Email Address</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Aadhar Number</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.aadharNo}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>District</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.district}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Taluka</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.taluka}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Village/City</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.villageCity}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Pincode</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.pincode}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Industry/Unit Name</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.industryName}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Present Address</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.presentAddress}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Permanent Address</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.applicantDetails.permanentAddress}</p>
              </div>
            </div>
          </div>

          {/* Loan Details Section */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>Loan Details</h3>
            <div style={{ marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Particular</th>
                    <th style={{ textAlign: 'center', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '10px', borderBottom: '2px solid #dee2e6', color: '#495057', fontWeight: '600' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {Number(application.loanDetails.workingCapital1) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Working Capital</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for Working Capital</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.workingCapital1) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.katchaStructure1) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Katcha Structure</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for Katcha Structure</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.katchaStructure1) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.machinery1) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Machinery</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for Machinery</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.machinery1) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.godown1) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Godown</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for Godown</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.godown1) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.workingCapital2) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Short term loan</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Short term loan for stocking</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.workingCapital2) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.machinery2) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Pucca Structure</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for Pucca structure</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.machinery2) || 0)}
                      </td>
                    </tr>
                  )}
                  {Number(application.loanDetails.godown2) > 0 && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Share Capital</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Loan for share capital</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency(Number(application.loanDetails.godown2) || 0)}
                      </td>
                    </tr>
                  )}
                  {(Number(application.loanDetails.grant1) > 0 || Number(application.loanDetails.grant2) > 0) && (
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', color: '#495057' }}>Grant</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'center', color: '#6c757d' }}>Grant Amount</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'right', color: '#495057', fontWeight: '500' }}>
                        {formatCurrency((Number(application.loanDetails.grant1) || 0) + (Number(application.loanDetails.grant2) || 0))}
                      </td>
                    </tr>
                  )}
                  <tr style={{ background: '#f8f9fa' }}>
                    <td colSpan={2} style={{ padding: '15px', fontWeight: '600', color: '#495057', fontSize: '16px' }}>Total Amount</td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', color: '#007bff', fontSize: '20px' }}>
                      {formatCurrency(application.loanDetails.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {application.loanDetails.totalInWords && (
                <div style={{ marginTop: '15px', padding: '15px', background: '#e7f3ff', border: '1px solid #b8daff', borderRadius: '6px' }}>
                  <p style={{ fontSize: '14px', color: '#004085', margin: 0 }}>
                    <strong>Total in Words:</strong> {application.loanDetails.totalInWords}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Surety Details Section */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>Surety/Guarantor Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Surety Name</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.suretyName}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Relation</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.relation}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Occupation</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.occupation}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Mobile Number</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.mobileNo}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Email</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.email || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Aadhar Number</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.aadharNo}</p>
              </div>
              {application.suretyDetails.bankName && (
                <>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Bank Name</p>
                    <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.bankName}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Bank Branch</p>
                    <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.bankBranch}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Account Number</p>
                    <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.accountNo}</p>
                  </div>
                </>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Residential Address</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{application.suretyDetails.residentialAddress || '-'}</p>
              </div>
            </div>
          </div>
          
          {/* Documents Section */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>Uploaded Documents</h3>
            {application.documents && Object.keys(application.documents).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {Object.entries(application.documents).map(([key, doc]) => {
                  // Skip invalid documents
                  if (!isValidDocument(doc)) return null;
                  
                  // Use consistent property names from our standard structure
                  const { fileName, url, fileType } = doc;
                  
                  return (
                    <div
                      key={key}
                      style={{
                        padding: '15px',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        background: '#f8f9fa'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <FileText style={{ width: '20px', height: '20px', color: '#17a2b8', marginRight: '10px' }} />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: '#495057', margin: 0 }}>
                            {getDocumentLabel(key)}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>{fileName}</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            if (url) {
                              if (fileType?.startsWith('image/')) {
                                const newWindow = window.open('', '_blank');
                                if (newWindow) {
                                  newWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>${fileName}</title>
                                        <style>
                                          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
                                          img { max-width: 90%; max-height: 90vh; }
                                        </style>
                                      </head>
                                      <body>
                                        <img src="${url}" alt="${fileName}" />
                                      </body>
                                    </html>
                                  `);
                                  newWindow.document.close();
                                }
                              } else if (fileType === 'application/pdf') {
                                const newWindow = window.open('', '_blank');
                                if (newWindow) {
                                  newWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>${fileName}</title>
                                        <style>
                                          body { margin: 0; }
                                          iframe { width: 100%; height: 100vh; border: none; }
                                        </style>
                                      </head>
                                      <body>
                                        <iframe src="${url}" type="application/pdf"></iframe>
                                      </body>
                                    </html>
                                  `);
                                  newWindow.document.close();
                                }
                              } else {
                                window.open(url, '_blank');
                              }
                            } else {
                              console.error('No URL found for document:', fileName);
                              toast.error('Unable to view document - no URL found');
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            background: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px', display: 'inline', marginRight: '3px' }} />
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (url) {
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = fileName;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <Download style={{ width: '14px', height: '14px', display: 'inline', marginRight: '3px' }} />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                <FileText style={{ width: '48px', height: '48px', margin: '0 auto 10px', opacity: 0.5 }} />
                <p>No documents uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}