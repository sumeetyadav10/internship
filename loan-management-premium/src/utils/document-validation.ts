import type { Document } from '@/types';

/**
 * Validates if an object has the correct document structure
 * @param doc - The document object to validate
 * @returns boolean indicating if the document is valid
 */
export function isValidDocument(doc: any): doc is Document {
  return (
    doc &&
    typeof doc === 'object' &&
    typeof doc.url === 'string' &&
    typeof doc.fileName === 'string' &&
    typeof doc.fileSize === 'number' &&
    typeof doc.fileType === 'string' &&
    typeof doc.uploadedAt === 'string' &&
    doc.url.startsWith('data:') &&
    doc.url.includes('base64,')
  );
}

/**
 * Validates if a base64 URL contains valid data
 * @param url - The base64 data URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidBase64URL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid data URL
  const dataUrlRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/;
  const matches = url.match(dataUrlRegex);
  
  if (!matches) return false;
  
  const [, mimeType, base64Data] = matches;
  
  // Check if the base64 data is valid
  try {
    // Basic validation - check if it can be decoded
    const decoded = atob(base64Data.substring(0, 100)); // Check first 100 chars
    
    // Check if it contains HTML (which would indicate corruption)
    if (decoded.includes('<!DOCTYPE') || decoded.includes('<html')) {
      console.error('Base64 data contains HTML - likely corrupted');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid base64 data:', error);
    return false;
  }
}

/**
 * Sanitizes and validates all documents in a documents object
 * @param documents - The documents object to validate
 * @returns Validated documents object with invalid entries removed
 */
export function validateDocuments(documents: Record<string, any>): Record<string, Document> {
  const validatedDocs: Record<string, Document> = {};
  
  Object.entries(documents).forEach(([key, doc]) => {
    if (isValidDocument(doc) && isValidBase64URL(doc.url)) {
      validatedDocs[key] = doc;
    } else {
      console.warn(`Invalid document structure for ${key}:`, doc);
    }
  });
  
  return validatedDocs;
}

/**
 * Gets a readable label for a document type
 * @param docType - The document type key
 * @returns Human readable label
 */
export function getDocumentLabel(docType: string): string {
  const labels: Record<string, string> = {
    'applicantPan': 'Applicant PAN Card',
    'applicantAadhar': 'Applicant Aadhar Card',
    'applicantPhoto': 'Applicant Passport Photo',
    'incomeCertificate': 'Income Certificate',
    'bankStatement': 'Bank Statement',
    'businessLicense': 'Business License',
    'propertyPapers': 'Property Papers',
    'suretyPan': 'Surety PAN Card',
    'suretyAadhar': 'Surety Aadhar Card',
    'suretyPhoto': 'Surety Passport Photo',
    'suretyIncome': 'Surety Income Proof'
  };
  
  return labels[docType] || docType.replace(/([A-Z])/g, ' $1').trim();
}