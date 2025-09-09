import { getStorage } from 'firebase-admin/storage';
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Try using the default bucket which is usually projectId.appspot.com
const bucketName = `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`;
const bucket = getStorage().bucket(bucketName);

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

/**
 * Upload a file to Firebase Storage from server side
 */
export async function uploadFileServer(
  file: File,
  path: string,
  fileName?: string
): Promise<FileUploadResult> {
  try {
    // Generate unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}_${file.name}`;
    const fullPath = `${path}/${uniqueFileName}`;
    
    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create file reference
    const fileRef = bucket.file(fullPath);
    
    // Upload file
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }
      }
    });
    
    // Make file publicly accessible
    await fileRef.makePublic();
    
    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fullPath}`;
    
    return {
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message || error}`);
  }
}