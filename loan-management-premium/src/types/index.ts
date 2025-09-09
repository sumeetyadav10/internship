import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  isAdmin: boolean;
  permissions: {
    canAccessMasters: boolean;
    canManageUsers: boolean;
    canViewAllApplications: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
}

// Applicant Details
export interface ApplicantDetails {
  loanAccountNo?: string;
  year?: string;
  salutation?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNo: string;
  email: string;
  aadharNo: string;
  district: string;
  taluka: string;
  villageCity: string;
  pincode: string;
  presentAddress: string;
  permanentAddress: string;
  sameAsPermanent?: boolean;
  industryName: string;
  workingsheet?: string;
}

// Loan Details
export interface LoanDetails {
  workingCapital1?: string | number;
  katchaStructure1?: string | number;
  machinery1?: string | number;
  godown1?: string | number;
  grant1?: string | number;
  workingCapital2?: string | number;
  katchaStructure2?: string | number;
  machinery2?: string | number;
  godown2?: string | number;
  grant2?: string | number;
  totalAmount: number;
  totalInWords: string;
}

// Surety Details
export interface SuretyDetails {
  suretyName: string;
  relation: string;
  occupation: string;
  designation?: string;
  employer?: string;
  workAddress?: string;
  email?: string;
  mobileNo: string;
  aadharNo: string;
  panNo?: string;
  monthlySalary?: string;
  otherIncome?: string;
  existingLiabilities?: string;
  propertyDetails?: string;
  bankName: string;
  bankBranch: string;
  accountNo: string;
  residentialAddress: string;
  employmentDuration?: string;
  bankerName?: string;
  suretyLoan?: string;
  district: string;
  taluka: string;
  villageCity: string;
  pincode: string;
  presentAddress?: string;
  permanentAddress?: string;
  sameAsPermanent?: boolean;
}

// Document type
export interface Document {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string | Timestamp;
  docType?: string;
  isImage?: boolean;
  isPDF?: boolean;
}

// Documents collection
export interface Documents {
  applicantPan?: Document;
  applicantAadhar?: Document;
  applicantPhoto?: Document;
  incomeCertificate?: Document;
  bankStatement?: Document;
  businessLicense?: Document;
  propertyPapers?: Document;
  suretyPan?: Document;
  suretyAadhar?: Document;
  suretyPhoto?: Document;
  suretyIncome?: Document;
}

// Loan Application
export interface LoanApplication {
  id?: string;
  formNumber: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  applicantDetails: ApplicantDetails;
  loanDetails: LoanDetails;
  suretyDetails: SuretyDetails;
  documents: Documents;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isTemporary?: boolean;
  lastModified?: Timestamp;
  submittedAt?: Timestamp;
  timestamps?: {
    created: Timestamp;
    lastModified: Timestamp;
  };
}

// Masters types
export interface District {
  code: string;
  name: string;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Taluka {
  code: string;
  name: string;
  districtCode: string;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Village {
  code: string;
  name: string;
  talukaCode: string;
  districtCode: string;
  pincode: string;
  active: boolean;
  createdBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Form sequence
export interface FormSequence {
  date: Timestamp;
  lastNumber: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Statistics
export interface Statistics {
  totalApplications: number;
  draftApplications: number;
  submittedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  lastUpdated: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}