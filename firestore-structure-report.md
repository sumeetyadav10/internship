# Firestore Database Structure Report

**Project ID:** loanmanagement-ca7e1

**Analysis Date:** 9/7/2025, 11:55:52 AM

## Summary

- **Total Collections:** 5
- **Total Documents:** 30
- **Total Subcollections:** 3

## Collections Structure

### 📁 form_sequences

- **Path:** `form_sequences`
- **Document Count:** 6
- **Sample Document IDs:** 20250801, 20250807, 20250808, 20250822, 20250824...

#### Fields

| Field Path | Type |
|------------|------|
| `date` | timestamp |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |
| `lastNumber` | number |

#### Sample Document

```json
{
  "date": {
    "_seconds": 1754029309,
    "_nanoseconds": 234000000
  },
  "createdAt": {
    "_seconds": 1754029309,
    "_nanoseconds": 853000000
  },
  "updatedAt": {
    "_seconds": 1754029309,
    "_nanoseconds": 853000000
  },
  "lastNumber": 8
}
```

---

### 📁 loan_applications

- **Path:** `loan_applications`
- **Document Count:** 21
- **Sample Document IDs:** LMS202508080038, LMS202508080039, LMS202508080040, LMS202508080041, LMS202508080042...

#### Fields

| Field Path | Type |
|------------|------|
| `applicantDetails` | object |
| `applicantDetails.loanAccountNo` | string |
| `applicantDetails.year` | string |
| `applicantDetails.salutation` | string |
| `applicantDetails.firstName` | string |
| `applicantDetails.middleName` | string |
| `applicantDetails.lastName` | string |
| `applicantDetails.mobileNo` | string |
| `applicantDetails.email` | string |
| `applicantDetails.aadharNo` | string |
| `applicantDetails.district` | string |
| `applicantDetails.taluka` | string |
| `applicantDetails.villageCity` | string |
| `applicantDetails.pincode` | string |
| `applicantDetails.presentAddress` | string |
| `applicantDetails.permanentAddress` | string |
| `applicantDetails.sameAsPermanent` | boolean |
| `applicantDetails.industryName` | string |
| `applicantDetails.workingsheet` | string |
| `loanDetails` | object |
| `loanDetails.workingCapital1` | string |
| `loanDetails.katchaStructure1` | string |
| `loanDetails.machinery1` | string |
| `loanDetails.godown1` | string |
| `loanDetails.grant1` | string |
| `loanDetails.workingCapital2` | number |
| `loanDetails.katchaStructure2` | number |
| `loanDetails.machinery2` | number |
| `loanDetails.godown2` | number |
| `loanDetails.grant2` | number |
| `loanDetails.totalAmount` | number |
| `loanDetails.totalInWords` | string |
| `status` | string |
| `formNumber` | string |
| `createdBy` | string |
| `lastModified` | timestamp |
| `timestamps` | object |
| `timestamps.created` | timestamp |
| `timestamps.lastModified` | timestamp |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |
| `suretyDetails` | object |
| `suretyDetails.suretyName` | string |
| `suretyDetails.relation` | string |
| `suretyDetails.occupation` | string |
| `suretyDetails.designation` | string |
| `suretyDetails.employer` | string |
| `suretyDetails.workAddress` | string |
| `suretyDetails.email` | string |
| `suretyDetails.mobileNo` | string |
| `suretyDetails.aadharNo` | string |
| `suretyDetails.panNo` | string |
| `suretyDetails.monthlySalary` | string |
| `suretyDetails.otherIncome` | string |
| `suretyDetails.existingLiabilities` | string |
| `suretyDetails.propertyDetails` | string |
| `suretyDetails.bankName` | string |
| `suretyDetails.bankBranch` | string |
| `suretyDetails.accountNo` | string |
| `documents` | array |
| `documents.applicantPan` | object |
| `documents.applicantPan.url` | string |
| `documents.applicantPan.fileName` | string |
| `documents.applicantPan.uploadedAt` | timestamp |
| `documents.applicantAadhar` | object |
| `documents.applicantAadhar.url` | string |
| `documents.applicantAadhar.fileName` | string |
| `documents.applicantAadhar.uploadedAt` | timestamp |
| `documents.applicantPhoto` | object |
| `documents.applicantPhoto.url` | string |
| `documents.applicantPhoto.fileName` | string |
| `documents.applicantPhoto.uploadedAt` | timestamp |
| `documents.incomeCertificate` | object |
| `documents.incomeCertificate.url` | string |
| `documents.incomeCertificate.fileName` | string |
| `documents.incomeCertificate.uploadedAt` | timestamp |
| `documents.bankStatement` | object |
| `documents.bankStatement.url` | string |
| `documents.bankStatement.fileName` | string |
| `documents.bankStatement.uploadedAt` | timestamp |
| `documents.suretyPan` | object |
| `documents.suretyPan.url` | string |
| `documents.suretyPan.fileName` | string |
| `documents.suretyPan.uploadedAt` | timestamp |
| `documents.suretyAadhar` | object |
| `documents.suretyAadhar.url` | string |
| `documents.suretyAadhar.fileName` | string |
| `documents.suretyAadhar.uploadedAt` | timestamp |
| `documents.suretyPhoto` | object |
| `documents.suretyPhoto.url` | string |
| `documents.suretyPhoto.fileName` | string |
| `documents.suretyPhoto.uploadedAt` | timestamp |
| `documents.suretyIncome` | object |
| `documents.suretyIncome.url` | string |
| `documents.suretyIncome.fileName` | string |
| `documents.suretyIncome.uploadedAt` | timestamp |
| `submittedAt` | timestamp |
| `documents.businessLicense` | object |
| `documents.businessLicense.url` | string |
| `documents.businessLicense.fileName` | string |
| `documents.businessLicense.uploadedAt` | timestamp |
| `documents.propertyPapers` | object |
| `documents.propertyPapers.url` | string |
| `documents.propertyPapers.fileName` | string |
| `documents.propertyPapers.uploadedAt` | timestamp |
| `id` | string |
| `suretyDetails.residentialAddress` | string |
| `suretyDetails.employmentDuration` | string |
| `suretyDetails.bankerName` | string |
| `suretyDetails.suretyLoan` | string |
| `suretyDetails.district` | string |
| `suretyDetails.taluka` | string |
| `suretyDetails.villageCity` | string |
| `suretyDetails.pincode` | string |

#### Sample Document

```json
{
  "applicantDetails": {
    "loanAccountNo": "LN2024001",
    "year": "2024",
    "salutation": "Mr",
    "firstName": "Rajesh",
    "middleName": "Kumar",
    "lastName": "Sharma",
    "mobileNo": "9876543210",
    "email": "rajesh.sharma@example.com",
    "aadharNo": "123456789012",
    "district": "NG",
    "taluka": "BARDEZ",
    "villageCity": "MAPUSA",
    "pincode": "403507",
    "presentAddress": "123 Main Street, Near SBI Bank, Mapusa",
    "permanentAddress": "123 Main Street, Near SBI Bank, Mapusa",
    "sameAsPermanent": true,
    "industryName": "Sharma Electronics",
    "workingsheet": "Electronics Retail"
  },
  "loanDetails": {
    "workingCapital1": "300000",
    "katchaStructure1": "50000",
    "machinery1": "150000",
    "godown1": "0",
    "grant1": "0",
    "workingCapital2": "0",
    "katchaStructure2": "0",
    "machinery2": "0",
    "godown2": "0",
    "grant2": "0",
    "totalAmount": 500000,
    "totalInWords": "Five Lakh Rupees Only"
  },
  "status": "draft",
  "formNumber": "LMS202508080038",
  "createdBy": "KNBLDx9NyDTcA9wlGIjTAMKbFCG2",
  "lastModified": {
    "_seconds": 1754637393,
    "_nanoseconds": 958000000
  },
  "timestamps": {
    "created": {
      "_seconds": 1754291793,
      "_nanoseconds": 958000000
    },
    "lastModified": {
      "_seconds": 1754637393,
      "_nanoseconds": 958000000
    }
  },
  "createdAt": {
    "_seconds": 1754637394,
    "_nanoseconds": 401000000
  },
  "updatedAt": {
    "_seconds": 1754637394,
    "_nanoseconds": 401000000
  }
}
```

---

### 📁 masters

- **Path:** `masters`
- **Document Count:** 1
- **Sample Document IDs:** locations

#### Fields

| Field Path | Type |
|------------|------|
| `districts` | array<object> |
| `talukas` | array<object> |
| `villages` | array<object> |

#### Subcollections

##### 📂 districts

- **Total Documents:** 2
- **Found in Documents:** locations

**Fields:**

| Field Path | Type |
|------------|------|
| `name` | string |
| `code` | string |
| `active` | boolean |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

##### 📂 talukas

- **Total Documents:** 12
- **Found in Documents:** locations

**Fields:**

| Field Path | Type |
|------------|------|
| `name` | string |
| `code` | string |
| `districtCode` | string |
| `active` | boolean |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

##### 📂 villages

- **Total Documents:** 317
- **Found in Documents:** locations

**Fields:**

| Field Path | Type |
|------------|------|
| `name` | string |
| `code` | string |
| `talukaCode` | string |
| `districtCode` | string |
| `pincode` | string |
| `active` | boolean |
| `createdBy` | string |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

#### Sample Document

```json
{
  "districts": [
    {
      "code": "NG",
      "name": "North Goa",
      "active": true
    },
    {
      "code": "SG",
      "name": "South Goa",
      "active": true
    }
  ],
  "talukas": [
    {
      "code": "TPM",
      "name": "Tiswadi",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "BDZ",
      "name": "Bardez",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "PND",
      "name": "Ponda",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "BCL",
      "name": "Bicholim",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "STP",
      "name": "Sattari",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "PRN",
      "name": "Pernem",
      "districtCode": "NG",
      "active": true
    },
    {
      "code": "CNC",
      "name": "Canacona",
      "districtCode": "SG",
      "active": true
    },
    {
      "code": "MRG",
      "name": "Mormugao",
      "districtCode": "SG",
      "active": true
    },
    {
      "code": "SLS",
      "name": "Salcete",
      "districtCode": "SG",
      "active": true
    },
    {
      "code": "SGM",
      "name": "Sanguem",
      "districtCode": "SG",
      "active": true
    },
    {
      "code": "QPN",
      "name": "Quepem",
      "districtCode": "SG",
      "active": true
    },
    {
      "code": "DHS",
      "name": "Dharbandora",
      "districtCode": "SG",
      "active": true
    }
  ],
  "villages": [
    {
      "code": "PNJ",
      "name": "Panaji",
      "districtCode": "NG",
      "talukaCode": "TPM",
      "pincode": "403001",
      "active": true
    },
    {
      "code": "STZ",
      "name": "St. Cruz",
      "districtCode": "NG",
      "talukaCode": "TPM",
      "pincode": "403005",
      "active": true
    },
    {
      "code": "MPM",
      "name": "Mapusa",
      "districtCode": "NG",
      "talukaCode": "BDZ",
      "pincode": "403507",
      "active": true
    },
    {
      "code": "CLG",
      "name": "Calangute",
      "districtCode": "NG",
      "talukaCode": "BDZ",
      "pincode": "403516",
      "active": true
    },
    {
      "code": "CND",
      "name": "Candolim",
      "districtCode": "NG",
      "talukaCode": "BDZ",
      "pincode": "403515",
      "active": true
    },
    {
      "code": "PND_CITY",
      "name": "Ponda City",
      "districtCode": "NG",
      "talukaCode": "PND",
      "pincode": "403401",
      "active": true
    },
    {
      "code": "VSC",
      "name": "Vasco",
      "districtCode": "SG",
      "talukaCode": "MRG",
      "pincode": "403802",
      "active": true
    },
    {
      "code": "DBO",
      "name": "Dabolim",
      "districtCode": "SG",
      "talukaCode": "MRG",
      "pincode": "403801",
      "active": true
    },
    {
      "code": "MRG_CITY",
      "name": "Margao",
      "districtCode": "SG",
      "talukaCode": "SLS",
      "pincode": "403601",
      "active": true
    },
    {
      "code": "BNL",
      "name": "Benaulim",
      "districtCode": "SG",
      "talukaCode": "SLS",
      "pincode": "403716",
      "active": true
    }
  ]
}
```

---

### 📁 statistics

- **Path:** `statistics`
- **Document Count:** 1
- **Sample Document IDs:** dashboard

#### Fields

| Field Path | Type |
|------------|------|
| `totalApplications` | number |
| `draftApplications` | number |
| `submittedApplications` | number |
| `approvedApplications` | number |
| `rejectedApplications` | number |
| `lastUpdated` | timestamp |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

#### Sample Document

```json
{
  "totalApplications": 0,
  "draftApplications": 0,
  "submittedApplications": 0,
  "approvedApplications": 0,
  "rejectedApplications": 0,
  "lastUpdated": {
    "_seconds": 1755842736,
    "_nanoseconds": 949000000
  },
  "createdAt": {
    "_seconds": 1755842736,
    "_nanoseconds": 330000000
  },
  "updatedAt": {
    "_seconds": 1755842736,
    "_nanoseconds": 330000000
  }
}
```

---

### 📁 users

- **Path:** `users`
- **Document Count:** 1
- **Sample Document IDs:** KNBLDx9NyDTcA9wlGIjTAMKbFCG2

#### Fields

| Field Path | Type |
|------------|------|
| `email` | string |
| `createdAt` | timestamp |
| `role` | string |
| `name` | string |
| `isAdmin` | boolean |
| `permissions` | object |
| `permissions.canAccessMasters` | boolean |
| `permissions.canManageUsers` | boolean |
| `permissions.canViewAllApplications` | boolean |
| `lastLogin` | timestamp |
| `updatedAt` | timestamp |

#### Sample Document

```json
{
  "email": "loangoa@admin.com",
  "createdAt": {
    "_seconds": 1755841137,
    "_nanoseconds": 951000000
  },
  "role": "admin",
  "name": "Admin User",
  "isAdmin": true,
  "permissions": {
    "canAccessMasters": true,
    "canManageUsers": true,
    "canViewAllApplications": true
  },
  "lastLogin": {
    "_seconds": 1757181262,
    "_nanoseconds": 785000000
  },
  "updatedAt": {
    "_seconds": 1757181264,
    "_nanoseconds": 238000000
  }
}
```

---

