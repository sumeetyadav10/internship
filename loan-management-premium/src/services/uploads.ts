import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'applications/{applicationId}/documents')
 * @param fileName - Optional custom file name
 * @returns Promise with upload result
 */
export async function uploadFile(
  file: File,
  path: string,
  fileName?: string
): Promise<FileUploadResult> {
  try {
    // Generate unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${uniqueFileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param basePath - The base storage path
 * @returns Promise with array of upload results
 */
export async function uploadMultipleFiles(
  files: { file: File; docType: string }[],
  basePath: string
): Promise<Record<string, FileUploadResult>> {
  const results: Record<string, FileUploadResult> = {};
  
  const uploadPromises = files.map(async ({ file, docType }) => {
    try {
      const result = await uploadFile(file, `${basePath}/${docType}`);
      results[docType] = result;
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      throw error;
    }
  });
  
  await Promise.all(uploadPromises);
  return results;
}

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The file URL or path to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // If it's a full URL, extract the path
    let path = fileUrl;
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      const url = new URL(fileUrl);
      const pathSegments = url.pathname.split('/o/');
      if (pathSegments.length > 1 && pathSegments[1]) {
        const segments = pathSegments[1].split('?');
        path = decodeURIComponent(segments[0] || '');
      }
    }
    
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Get the file size in a readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file type and size
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns Validation result
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number = 5 * 1024 * 1024
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size should not exceed ${formatFileSize(maxSize)}`
    };
  }
  
  // Check file type
  const isTypeAllowed = allowedTypes.some(type => {
    if (type === 'image/*') {
      return file.type.startsWith('image/');
    }
    return file.type === type || file.name.endsWith(type);
  });
  
  if (!isTypeAllowed) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}