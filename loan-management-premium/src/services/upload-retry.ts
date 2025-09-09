import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FileUploadResult } from './uploads';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onProgress?: (progress: number) => void;
  onRetry?: (attempt: number, error: Error) => void;
}

interface PendingUpload {
  file: File;
  path: string;
  fileName: string;
  docType: string;
  retries: number;
  lastError?: string;
}

const PENDING_UPLOADS_KEY = 'pendingUploads';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Save pending upload to localStorage for retry
 */
function savePendingUpload(upload: PendingUpload): void {
  try {
    const pending = localStorage.getItem(PENDING_UPLOADS_KEY);
    const uploads = pending ? JSON.parse(pending) : [];
    
    // Avoid duplicates
    const exists = uploads.some((u: any) => 
      u.fileName === upload.fileName && u.docType === upload.docType
    );
    
    if (!exists) {
      uploads.push({
        ...upload,
        fileData: null, // Can't store File object directly
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(uploads));
    }
  } catch (error) {
    console.error('Error saving pending upload:', error);
  }
}

/**
 * Get pending uploads from localStorage
 */
export function getPendingUploads(): PendingUpload[] {
  try {
    const pending = localStorage.getItem(PENDING_UPLOADS_KEY);
    return pending ? JSON.parse(pending) : [];
  } catch (error) {
    console.error('Error getting pending uploads:', error);
    return [];
  }
}

/**
 * Remove successful upload from pending list
 */
function removePendingUpload(fileName: string, docType: string): void {
  try {
    const pending = getPendingUploads();
    const filtered = pending.filter((u: any) => 
      !(u.fileName === fileName && u.docType === docType)
    );
    localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing pending upload:', error);
  }
}

/**
 * Upload file with retry mechanism
 */
export async function uploadFileWithRetry(
  file: File,
  path: string,
  fileName: string,
  docType: string,
  options: RetryOptions = {}
): Promise<FileUploadResult> {
  const {
    maxRetries = MAX_RETRIES,
    retryDelay = RETRY_DELAY,
    onProgress,
    onRetry
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // If this is a retry, wait before attempting
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        onRetry?.(attempt, lastError!);
      }

      const storageRef = ref(storage, `${path}/${fileName}`);
      
      // Use resumable upload for better reliability
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          docType: docType
        }
      });

      // Track upload progress
      if (onProgress) {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        );
      }

      // Wait for upload to complete
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Remove from pending if successful
      removePendingUpload(fileName, docType);
      
      return {
        url: downloadURL,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      };
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Upload attempt ${attempt + 1} failed:`, error);
      
      // Save to pending uploads if this is the last retry
      if (attempt === maxRetries) {
        savePendingUpload({
          file,
          path,
          fileName,
          docType,
          retries: attempt,
          lastError: lastError.message
        });
      }
    }
  }

  throw lastError || new Error('Upload failed after all retries');
}

/**
 * Process pending uploads (called on app startup or manually)
 */
export async function processPendingUploads(
  getFileForUpload: (fileName: string, docType: string) => File | null
): Promise<{ successful: number; failed: number }> {
  const pending = getPendingUploads();
  let successful = 0;
  let failed = 0;

  for (const upload of pending) {
    try {
      // Get the file (this needs to be provided by the caller)
      const file = getFileForUpload(upload.fileName, upload.docType);
      
      if (!file) {
        console.warn(`File not found for pending upload: ${upload.fileName}`);
        failed++;
        continue;
      }

      await uploadFileWithRetry(
        file,
        upload.path,
        upload.fileName,
        upload.docType,
        { maxRetries: 1 } // Less retries for background processing
      );
      
      successful++;
    } catch (error) {
      console.error(`Failed to process pending upload: ${upload.fileName}`, error);
      failed++;
    }
  }

  return { successful, failed };
}

/**
 * Clear old pending uploads (older than 7 days)
 */
export function clearOldPendingUploads(): void {
  try {
    const pending = getPendingUploads();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const filtered = pending.filter((upload: any) => {
      const uploadDate = new Date(upload.timestamp);
      return uploadDate > oneWeekAgo;
    });
    
    localStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing old pending uploads:', error);
  }
}