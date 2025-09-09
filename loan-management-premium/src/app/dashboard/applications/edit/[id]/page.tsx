"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getApplicationById, updateLoanApplication } from "@/services/applications";
import { filesToBase64, type Base64FileResult } from "@/services/base64-upload";
import { toast } from "sonner";

// Import form step components
import { ApplicantDetailsStep } from "@/components/forms/loan-application/applicant-details-step";
import { LoanDetailsStep } from "@/components/forms/loan-application/loan-details-step";
import { SuretyDetailsStep } from "@/components/forms/loan-application/surety-details-step";
import { DocumentUploadStep } from "@/components/forms/loan-application/document-upload-step";
import { ReviewStep } from "@/components/forms/loan-application/review-step";

// Document schema for validation
const documentSchema = z.object({
  url: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  uploadedAt: z.string(),
  docType: z.string().optional(),
  isImage: z.boolean().optional(),
  isPDF: z.boolean().optional()
}).optional();

// Form validation schema - SAME AS NEW APPLICATION
const formSchema = z.object({
  applicantDetails: z.object({
    loanAccountNo: z.string().optional(),
    year: z.string().optional(),
    salutation: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    mobileNo: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    email: z.string().email("Invalid email address"),
    aadharNo: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits"),
    district: z.string().min(1, "District is required"),
    taluka: z.string().min(1, "Taluka is required"),
    villageCity: z.string().min(1, "Village/City is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
    presentAddress: z.string().min(1, "Present address is required"),
    permanentAddress: z.string().min(1, "Permanent address is required"),
    sameAsPermanent: z.boolean().default(false),
    industryName: z.string().min(1, "Industry name is required"),
    workingsheet: z.string().optional()
  }),
  loanDetails: z.object({
    workingCapital1: z.union([z.string(), z.number()]).optional(),
    katchaStructure1: z.union([z.string(), z.number()]).optional(),
    machinery1: z.union([z.string(), z.number()]).optional(),
    godown1: z.union([z.string(), z.number()]).optional(),
    grant1: z.union([z.string(), z.number()]).optional(),
    workingCapital2: z.union([z.string(), z.number()]).optional(),
    katchaStructure2: z.union([z.string(), z.number()]).optional(),
    machinery2: z.union([z.string(), z.number()]).optional(),
    godown2: z.union([z.string(), z.number()]).optional(),
    grant2: z.union([z.string(), z.number()]).optional(),
    totalAmount: z.number().min(1, "Total amount must be greater than 0"),
    totalInWords: z.string()
  }),
  suretyDetails: z.object({
    suretyName: z.string().min(1, "Surety name is required"),
    relation: z.string().min(1, "Relation is required"),
    occupation: z.string().min(1, "Occupation is required"),
    designation: z.string().optional(),
    employer: z.string().optional(),
    workAddress: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    mobileNo: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    aadharNo: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits"),
    panNo: z.string().optional(),
    monthlySalary: z.string().optional(),
    otherIncome: z.string().optional(),
    existingLiabilities: z.string().optional(),
    propertyDetails: z.string().optional(),
    bankName: z.string().min(1, "Bank name is required"),
    bankBranch: z.string().min(1, "Bank branch is required"),
    accountNo: z.string().min(1, "Account number is required"),
    residentialAddress: z.string().min(1, "Residential address is required"),
    employmentDuration: z.string().optional(),
    bankerName: z.string().optional(),
    suretyLoan: z.string().optional(),
    district: z.string().min(1, "District is required"),
    taluka: z.string().min(1, "Taluka is required"),
    villageCity: z.string().min(1, "Village/City is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    sameAsPermanent: z.boolean().default(false)
  }),
  documents: z.object({
    applicantPan: documentSchema,
    applicantAadhar: documentSchema,
    applicantPhoto: documentSchema,
    incomeCertificate: documentSchema,
    bankStatement: documentSchema,
    businessLicense: documentSchema,
    propertyPapers: documentSchema,
    suretyPan: documentSchema,
    suretyAadhar: documentSchema,
    suretyPhoto: documentSchema,
    suretyIncome: documentSchema
  })
});

type FormData = z.infer<typeof formSchema>;

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params['id'] as string;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formNumber, setFormNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [application, setApplication] = useState<any>(null);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantDetails: {
        loanAccountNo: "",
        year: "",
        salutation: "Mr",
        firstName: "",
        middleName: "",
        lastName: "",
        mobileNo: "",
        email: "",
        aadharNo: "",
        district: "",
        taluka: "",
        villageCity: "",
        pincode: "",
        presentAddress: "",
        permanentAddress: "",
        sameAsPermanent: false,
        industryName: "",
        workingsheet: ""
      },
      loanDetails: {
        workingCapital1: "",
        workingCapital2: "",
        katchaStructure1: "",
        katchaStructure2: "",
        machinery1: "",
        machinery2: "",
        godown1: "",
        godown2: "",
        grant1: "",
        grant2: "",
        totalAmount: 0,
        totalInWords: ""
      },
      suretyDetails: {
        suretyName: "",
        relation: "",
        occupation: "",
        designation: "",
        employer: "",
        workAddress: "",
        email: "",
        mobileNo: "",
        aadharNo: "",
        panNo: "",
        monthlySalary: "",
        otherIncome: "",
        existingLiabilities: "",
        propertyDetails: "",
        bankName: "",
        bankBranch: "",
        accountNo: "",
        residentialAddress: "",
        employmentDuration: "",
        bankerName: "",
        suretyLoan: "",
        district: "",
        taluka: "",
        villageCity: "",
        pincode: "",
        presentAddress: "",
        permanentAddress: "",
        sameAsPermanent: false
      }
    }
  });

  const { handleSubmit, watch, reset } = methods;

  // Check authentication and load application data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);

      // Load application data
      if (applicationId) {
        try {
          const app = await getApplicationById(applicationId);
          if (app) {
            setApplication(app);
            setFormNumber(app.formNumber || '');
            
            // Reset form with existing data
            reset({
              applicantDetails: app.applicantDetails || {},
              loanDetails: app.loanDetails || {},
              suretyDetails: app.suretyDetails || {},
              documents: app.documents || {}
            });
          } else {
            toast.error("Application not found");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error loading application:", error);
          toast.error("Failed to load application");
          router.push("/dashboard");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [applicationId, router, reset]);

  // Submit handler
  const onSubmit = async (data: FormData) => {
    console.log('Update button clicked');
    console.log('Form data:', data);
    setIsSubmitting(true);
    try {
      toast.info("Updating your application...");
      
      // Documents are handled differently now - they're already in base64 format
      const documentsData: Record<string, Base64FileResult & { docType: string }> = {};

      // Keep existing documents from the application
      if (application?.documents) {
        Object.entries(application.documents).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            documentsData[key] = value as Base64FileResult & { docType: string };
          }
        });
      }

      // Process new/updated documents (already in base64 format from upload step)
      if (data.documents) {
        Object.entries(data.documents).forEach(([docType, docData]) => {
          if (docData && typeof docData === 'object' && 'url' in docData) {
            // New document is already in base64 format
            documentsData[docType] = docData as Base64FileResult & { docType: string };
          }
        });
      }
      
      console.log('Documents data for update:', documentsData);

      const updateData = {
        applicantDetails: data.applicantDetails,
        loanDetails: data.loanDetails,
        suretyDetails: {
          ...data.suretyDetails,
          // Add default values for missing fields
          bankName: data.suretyDetails.bankName || "",
          bankBranch: data.suretyDetails.bankBranch || "",
          accountNo: data.suretyDetails.accountNo || "",
          residentialAddress: data.suretyDetails.residentialAddress || "",
          district: data.suretyDetails.district || "",
          taluka: data.suretyDetails.taluka || "",
          villageCity: data.suretyDetails.villageCity || "",
          pincode: data.suretyDetails.pincode || ""
        },
        documents: documentsData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Update data:', updateData);

      await updateLoanApplication(applicationId, updateData);
      
      toast.success("Application updated successfully!");
      router.push(`/dashboard/applications/${applicationId}`);
    } catch (error: any) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextStep = async () => {
    try {
      const fields = getFieldsForStep(currentStep);
      console.log('Step:', currentStep, 'Fields to validate:', fields);
      
      // Get current form values for debugging
      const values = methods.getValues();
      console.log('Current form values:', values);
      
      // Trigger validation for current step fields
      const isValid = await methods.trigger(fields as any);
      console.log('Validation result:', isValid);
      
      if (!isValid) {
        // Get all form errors
        const errors = methods.formState.errors;
        console.log('Form errors:', errors);
        
        // Try to find the first error message
        let errorMessage = 'Please fill in all required fields';
        
        if (errors.applicantDetails) {
          const firstFieldError = Object.values(errors.applicantDetails)[0] as any;
          if (firstFieldError?.message) {
            errorMessage = firstFieldError.message;
          }
        } else if (errors.loanDetails) {
          const firstFieldError = Object.values(errors.loanDetails)[0] as any;
          if (firstFieldError?.message) {
            errorMessage = firstFieldError.message;
          }
        } else if (errors.suretyDetails) {
          const firstFieldError = Object.values(errors.suretyDetails)[0] as any;
          if (firstFieldError?.message) {
            errorMessage = firstFieldError.message;
          }
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        // Scroll to top when moving to next step
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0:
        // Basic Information step - validate ALL required fields including addresses
        return Object.keys(formSchema.shape.applicantDetails.shape)
          .filter(key => key !== 'loanAccountNo' && key !== 'year' && key !== 'salutation' && key !== 'middleName' && key !== 'workingsheet' && key !== 'sameAsPermanent')
          .map(key => `applicantDetails.${key}`);
      case 1:
        // Surety Details step
        return Object.keys(formSchema.shape.suretyDetails.shape)
          .filter(key => key !== 'designation' && key !== 'employer' && key !== 'workAddress' && key !== 'email' && key !== 'panNo' && key !== 'monthlySalary' && key !== 'otherIncome' && key !== 'existingLiabilities' && key !== 'propertyDetails' && key !== 'employmentDuration' && key !== 'bankerName' && key !== 'suretyLoan' && key !== 'presentAddress' && key !== 'permanentAddress' && key !== 'sameAsPermanent')
          .map(key => `suretyDetails.${key}`);
      case 2:
        // Documents step - all documents are optional
        return [];
      case 3:
        // Review & Submit step - no validation needed
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #e6f3ff, #f0f8ff)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #007bff', 
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#495057', fontSize: '16px' }}>Loading application...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
          background: linear-gradient(to bottom, #e6f3ff, #f0f8ff);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: 100vh;
          padding: 20px;
        }

        .form-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .form-header {
          background: #f8f9fa;
          padding: 25px 40px;
          border-bottom: 1px solid #e9ecef;
        }

        .form-title {
          font-size: 24px;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }

        .form-content {
          padding: 40px;
          background: #f8f9fa;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          margin-bottom: 8px;
          width: 150px;
          text-align: left;
        }
        
        .required::after {
          content: ' *';
          color: #dc3545;
          font-weight: bold;
        }

        .form-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          color: #495057;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .form-input:disabled {
          background-color: #e9ecef;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #dee2e6;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #dee2e6;
        }

        .btn {
          padding: 10px 24px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .btn-cancel {
          background-color: #6c757d;
          color: white;
        }

        .btn-cancel:hover {
          background-color: #5a6268;
        }

        .loading-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-left: 8px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
        }

        .checkbox-container input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .form-content {
            padding: 20px;
          }

          .form-header {
            padding: 20px;
          }

          .button-container {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="form-container">
        <div className="form-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h1 className="form-title">Edit Loan Application Form</h1>
            <Link href="/dashboard" style={{ color: '#6c757d', textDecoration: 'none', fontSize: '14px' }}>
              Back to Dashboard
            </Link>
          </div>
          <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
            Form Number: <span style={{ fontWeight: 'bold' }}>{formNumber}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          background: 'white', 
          padding: '20px 40px', 
          borderBottom: '1px solid #e9ecef', 
          maxWidth: '800px', 
          marginLeft: 'auto', 
          marginRight: 'auto' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#495057' }}>Application Progress</h3>
            <span style={{ fontSize: '14px', color: '#6c757d' }}>Step {currentStep + 1} of 4</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: currentStep >= 0 ? '#007bff' : '#e9ecef', 
                color: currentStep >= 0 ? 'white' : '#6c757d', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 10px', 
                fontWeight: 'bold' 
              }}>1</div>
              <div style={{ fontSize: '12px', color: currentStep >= 0 ? '#495057' : '#6c757d' }}>Basic Information</div>
            </div>
            <div style={{ flex: 1, height: '2px', background: currentStep > 0 ? '#007bff' : '#dee2e6' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: currentStep >= 1 ? '#007bff' : '#e9ecef', 
                color: currentStep >= 1 ? 'white' : '#6c757d', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 10px', 
                fontWeight: 'bold' 
              }}>2</div>
              <div style={{ fontSize: '12px', color: currentStep >= 1 ? '#495057' : '#6c757d' }}>Surety Details</div>
            </div>
            <div style={{ flex: 1, height: '2px', background: currentStep > 1 ? '#007bff' : '#dee2e6' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: currentStep >= 2 ? '#007bff' : '#e9ecef', 
                color: currentStep >= 2 ? 'white' : '#6c757d', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 10px', 
                fontWeight: 'bold' 
              }}>3</div>
              <div style={{ fontSize: '12px', color: currentStep >= 2 ? '#495057' : '#6c757d' }}>Documents</div>
            </div>
            <div style={{ flex: 1, height: '2px', background: currentStep > 2 ? '#007bff' : '#dee2e6' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: currentStep >= 3 ? '#007bff' : '#e9ecef', 
                color: currentStep >= 3 ? 'white' : '#6c757d', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 10px', 
                fontWeight: 'bold' 
              }}>4</div>
              <div style={{ fontSize: '12px', color: currentStep >= 3 ? '#495057' : '#6c757d' }}>Review & Submit</div>
            </div>
          </div>
        </div>
        
        <div className="form-content">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApplicantDetailsStep />
                    <LoanDetailsStep />
                  </motion.div>
                )}
                
                {currentStep === 1 && (
                  <motion.div
                    key="surety"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SuretyDetailsStep />
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div
                    key="documents"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DocumentUploadStep />
                  </motion.div>
                )}
                
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReviewStep />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="button-container">
                {currentStep > 0 && (
                  <button type="button" className="btn btn-cancel" onClick={previousStep}>
                    Previous
                  </button>
                )}
                <button type="button" className="btn btn-cancel" onClick={() => router.push('/dashboard')}>
                  Cancel
                </button>
                {currentStep < 3 ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Save & Next
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        Updating
                        <span className="loading-spinner"></span>
                      </>
                    ) : (
                      'Update Application'
                    )}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}