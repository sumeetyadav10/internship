"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createLoanApplication } from "@/services/applications";
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

// Form validation schema - KEPT EXACTLY THE SAME
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

export default function NewApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formNumber, setFormNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const methods = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      applicantDetails: {
        sameAsPermanent: false
      },
      suretyDetails: {
        sameAsPermanent: false
      }
    }
  });

  const { handleSubmit, watch } = methods;

  // Generate form number - KEPT EXACTLY THE SAME
  useEffect(() => {
    const date = new Date();
    const formNum = `LF${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;
    setFormNumber(formNum);
  }, []);

  // Check authentication - KEPT EXACTLY THE SAME
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // KEEPING ALL THE FIRESTORE SUBMISSION LOGIC EXACTLY THE SAME
  const onSubmit = async (data: FormData) => {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Submit button clicked');
    console.log('Form data:', data);
    console.log('Documents in form data:', data.documents);
    
    // Check if we have all required data
    if (!data.applicantDetails || !data.loanDetails || !data.suretyDetails) {
      console.error('Missing required form sections');
      toast.error("Please complete all form sections");
      return;
    }
    
    setIsSubmitting(true);
    try {
      toast.info("Submitting your application...");
      
      // Documents are already in base64 format from the upload step
      const documentsData: Record<string, Base64FileResult & { docType: string }> = {};

      // Simply copy the documents as they are already converted
      if (data.documents) {
        Object.entries(data.documents).forEach(([docType, docData]) => {
          if (docData && typeof docData === 'object' && 'url' in docData) {
            // Document is already in base64 format
            documentsData[docType] = docData as Base64FileResult & { docType: string };
          }
        });
      }

      const applicationData = {
        formNumber: formNumber,
        status: "submitted" as const,
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
        documents: documentsData
      };
      
      console.log('Application data to submit:', applicationData);

      // Create new submitted application - saves directly to Firestore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('About to create loan application with userId:', userId);
      const newApplicationId = await createLoanApplication(applicationData as any, userId!);
      console.log('New application ID:', newApplicationId);
      
      toast.success("Application submitted successfully!");
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("=== FORM SUBMISSION ERROR ===");
      console.error("Error submitting application:", error);
      console.error("Error details:", error.message, error.stack);
      toast.error("Failed to submit application: " + (error.message || "Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // KEEPING ALL VALIDATION LOGIC EXACTLY THE SAME
  const nextStep = async () => {
    try {
      const fields = getFieldsForStep(currentStep);
      console.log('Step:', currentStep, 'Fields to validate:', fields);
      
      // Get current form values for debugging
      const values = methods.getValues();
      console.log('Current form values:', values);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isValid = await methods.trigger(fields as any);
      console.log('Validation result:', isValid);
      
      if (!isValid) {
        // Show validation errors in console and toast
        const errors = methods.formState.errors;
        console.error('Validation failed. Errors:', errors);
        
        // Show first error in toast - handle nested errors
        let errorMessage = 'Please check all required fields';
        
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

        .form-select {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          color: #495057;
          cursor: pointer;
        }

        .textarea-input {
          width: 100%;
          min-height: 100px;
          padding: 10px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          color: #495057;
          resize: vertical;
          font-family: inherit;
        }

        .textarea-input::placeholder {
          color: #6c757d;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 8px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: #007bff;
        }

        .checkbox-label {
          font-size: 14px;
          color: #495057;
          font-weight: normal;
          width: auto;
          margin: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #495057;
          margin: 40px 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #dee2e6;
        }

        .funds-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 20px;
        }

        .funds-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .total-row {
          grid-column: 1 / -1;
          margin-top: 10px;
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
          padding: 12px 30px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        .btn-save {
          background: #17a2b8;
          color: white;
        }

        .btn-save:hover {
          background: #138496;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0056b3;
        }

        .year-select {
          width: 200px;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
          display: none;
        }
        
        .form-input.error {
          border-color: #dc3545;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-left: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          body {
            padding: 10px;
          }
          
          .form-container {
            border-radius: 8px;
          }
          
          .form-grid,
          .funds-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .form-content {
            padding: 20px;
          }
          
          .form-header {
            padding: 15px;
          }
          
          .form-title {
            font-size: 20px;
          }
          
          .form-row {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .form-label {
            width: 100%;
            margin-bottom: 5px;
          }
          
          .form-input,
          .form-select,
          .textarea-input {
            width: 100%;
          }
          
          .button-container {
            flex-direction: column;
            gap: 10px;
          }
          
          .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* Progress Bar */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        maxWidth: '1200px', 
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

      <div className="form-container">
        <div className="form-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>
                <Link href="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>Dashboard</Link> 
                <span style={{ margin: '0 5px' }}>/</span>
                <span>New Loan Application</span>
              </div>
              <h1 className="form-title" style={{ margin: 0 }}>Loan Application Form</h1>
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>Form Number: </span>
                <span style={{ fontWeight: 'bold', color: '#17a2b8', fontSize: '16px' }}>{formNumber}</span>
              </div>
            </div>
            <Link href="/dashboard" className="btn btn-cancel" style={{ textDecoration: 'none' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="form-content">
          <FormProvider {...methods}>
            <form onSubmit={(e) => {
              console.log('Form onSubmit event triggered');
              e.preventDefault();
              
              // Get form state and errors
              console.log('Form state:', methods.formState);
              console.log('Form errors:', methods.formState.errors);
              console.log('Is form valid:', methods.formState.isValid);
              
              // Try to submit with error handling
              handleSubmit(
                (data) => {
                  console.log('handleSubmit success callback reached');
                  onSubmit(data);
                },
                (errors) => {
                  console.error('Form validation errors:', errors);
                  
                  // Find and display the first error
                  let firstError = '';
                  if (errors.applicantDetails) {
                    const key = Object.keys(errors.applicantDetails)[0];
                    firstError = errors.applicantDetails[key]?.message || 'Invalid applicant details';
                  } else if (errors.loanDetails) {
                    const key = Object.keys(errors.loanDetails)[0];
                    firstError = errors.loanDetails[key]?.message || 'Invalid loan details';
                  } else if (errors.suretyDetails) {
                    const key = Object.keys(errors.suretyDetails)[0];
                    firstError = errors.suretyDetails[key]?.message || 'Invalid surety details';
                  } else {
                    firstError = 'Please check all required fields';
                  }
                  
                  toast.error(firstError);
                }
              )(e);
            }}>
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
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                    onClick={async (e) => {
                      console.log('Submit button clicked directly');
                      console.log('Current step:', currentStep);
                      console.log('Is submitting:', isSubmitting);
                      
                      // Force validation of all fields
                      const isValid = await methods.trigger();
                      console.log('Manual validation result:', isValid);
                      
                      if (!isValid) {
                        const errors = methods.formState.errors;
                        console.log('Validation errors found:', errors);
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        Submitting
                        <span className="loading-spinner"></span>
                      </>
                    ) : (
                      'Submit Application'
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