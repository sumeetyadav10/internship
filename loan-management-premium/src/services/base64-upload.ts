/**
 * Service for handling file uploads as base64 strings
 * Instead of uploading to Firebase Storage, this saves files directly as base64 in Firestore
 */

export interface Base64FileResult {
  url: string; // base64 data URL
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  isImage?: boolean;
  isPDF?: boolean;
}

/**
 * Convert file to base64 and prepare for Firestore storage
 * @param file - The file to convert
 * @returns Promise with base64 result
 */
export async function fileToBase64(file: File): Promise<Base64FileResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      
      resolve({
        url: base64, // This is the base64 data URL
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        isImage: file.type.startsWith('image/'),
        isPDF: file.type === 'application/pdf'
      });
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Convert multiple files to base64
 * @param files - Array of files to convert
 * @returns Promise with record of base64 results
 */
export async function filesToBase64(
  files: { file: File; docType: string }[]
): Promise<Record<string, Base64FileResult>> {
  const results: Record<string, Base64FileResult> = {};
  
  const conversionPromises = files.map(async ({ file, docType }) => {
    try {
      const result = await fileToBase64(file);
      results[docType] = result;
    } catch (error) {
      console.error(`Error converting ${docType} to base64:`, error);
      throw error;
    }
  });
  
  await Promise.all(conversionPromises);
  return results;
}

/**
 * Validate file size for base64 storage
 * Base64 increases file size by ~33%, so we need stricter limits
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 3MB for ~4MB base64)
 */
export function validateBase64FileSize(file: File, maxSizeMB: number = 3): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size should not exceed ${maxSizeMB}MB for base64 storage`
    };
  }
  
  return { valid: true };
}