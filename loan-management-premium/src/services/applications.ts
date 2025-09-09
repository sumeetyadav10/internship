import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LoanApplication } from '@/types';

// Helper function to remove undefined values from objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefinedValues);
  }
  
  if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = cleanUndefinedValues(value);
        }
      }
    }
    return cleaned;
  }
  
  return obj;
}

// Generate unique form number with retry logic
export async function generateFormNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Retry logic for handling concurrent updates
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      const formNumber = await runTransaction(db, async (transaction) => {
        const sequenceRef = doc(db, 'form_sequences', dateStr);
        const sequenceDoc = await transaction.get(sequenceRef);
        
        let lastNumber = 0;
        
        if (sequenceDoc.exists()) {
          const data = sequenceDoc.data();
          lastNumber = data['lastNumber'] || 0;
        }
        
        const newNumber = lastNumber + 1;
        
        // Use update for existing documents to avoid conflicts
        if (sequenceDoc.exists()) {
          transaction.update(sequenceRef, {
            lastNumber: newNumber,
            updatedAt: serverTimestamp(),
          });
        } else {
          transaction.set(sequenceRef, {
            date: Timestamp.now(),
            lastNumber: newNumber,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        
        // Format: LMS + YYYYMMDD + 4-digit sequence
        const formattedNumber = `LMS${dateStr}${String(newNumber).padStart(4, '0')}`;
        return formattedNumber;
      });
      
      return formNumber;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      retryCount++;
      console.error(`Error generating form number (attempt ${retryCount}):`, error);
      
      
      // If it's a version mismatch error and we have retries left, try again
      if (error.code === 'aborted' && retryCount < maxRetries) {
        // Add a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
        continue;
      }
      
      // If max retries reached or different error, throw
      throw new Error('Failed to generate form number after retries');
    }
  }
  
  throw new Error('Failed to generate form number');
}

// Create new loan application
export async function createLoanApplication(
  data: Partial<LoanApplication>,
  userId: string
): Promise<string> {
  try {
    // Generate form number from Firestore
    const formNumber = await generateFormNumber();
    const applicationId = formNumber;
    
    // Prepare application data
    const applicationData = cleanUndefinedValues({
      ...data,
      id: applicationId,
      formNumber,
      status: data.status || 'draft',
      createdBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      timestamps: {
        created: Timestamp.now(),
        lastModified: Timestamp.now(),
      },
    });
    
    // Save directly to Firestore
    await setDoc(doc(db, 'loan_applications', applicationId), applicationData);
    
    // Update statistics
    await updateStatistics('increment', 'totalApplications');
    if (applicationData.status === 'draft') {
      await updateStatistics('increment', 'draftApplications');
    } else if (applicationData.status === 'submitted') {
      await updateStatistics('increment', 'submittedApplications');
    }
    
    return applicationId;
  } catch (error: any) {
    console.error('Error creating loan application:', error);
    throw new Error('Failed to create loan application');
  }
}

// Update loan application
export async function updateLoanApplication(
  applicationId: string,
  data: Partial<LoanApplication>
): Promise<void> {
  try {
    const updateData = cleanUndefinedValues({
      ...data,
      updatedAt: Timestamp.now(),
      lastModified: Timestamp.now(),
      'timestamps.lastModified': Timestamp.now(),
    });
    
    await updateDoc(doc(db, 'loan_applications', applicationId), updateData);
  } catch (error) {
    console.error('Error updating loan application:', error);
    throw new Error('Failed to update loan application');
  }
}

// Save draft application (for auto-save functionality)
export async function saveDraftApplication(
  data: Partial<LoanApplication>,
  userId: string
): Promise<{ id: string }> {
  try {
    // Check if we need to create a new draft
    const formNumber = data.formNumber || await generateFormNumber();
    const applicationId = formNumber;
    
    // Ensure it stays as draft
    const applicationData = cleanUndefinedValues({
      ...data,
      id: applicationId,
      formNumber,
      status: 'draft',
      createdBy: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      timestamps: {
        created: Timestamp.now(),
        lastModified: Timestamp.now(),
      },
    });
    
    await setDoc(doc(db, 'loan_applications', applicationId), applicationData);
    
    // Update statistics for new draft
    await updateStatistics('increment', 'totalApplications');
    await updateStatistics('increment', 'draftApplications');
    
    return { id: applicationId };
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error; // Re-throw for proper error handling in auto-save
  }
}

// Get loan application by ID
export async function getLoanApplication(applicationId: string): Promise<LoanApplication | null> {
  try {
    const docRef = doc(db, 'loan_applications', applicationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LoanApplication;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting loan application:', error);
    return null;
  }
}

// Get user's loan applications
export async function getUserApplications(userId: string): Promise<LoanApplication[]> {
  try {
    const q = query(
      collection(db, 'loan_applications'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications: LoanApplication[] = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as LoanApplication);
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting user applications:', error);
    return [];
  }
}

// Get recent applications (for dashboard) - Shows ALL applications including drafts
export async function getRecentApplications(limit: number = 5): Promise<LoanApplication[]> {
  try {
    // Simple query without composite index requirement
    const q = query(
      collection(db, 'loan_applications'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const applications: LoanApplication[] = [];
    
    // Include ALL applications (drafts, submitted, approved, rejected)
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      applications.push({ id: doc.id, ...data } as LoanApplication);
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting recent applications:', error);
    return [];
  }
}

// Get single application by ID
export async function getApplicationById(applicationId: string): Promise<LoanApplication | null> {
  try {
    const docRef = doc(db, 'loan_applications', applicationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LoanApplication;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting application by ID:', error);
    return null;
  }
}

// Update application status
export async function updateApplicationStatus(applicationId: string, status: 'draft' | 'submitted' | 'approved' | 'rejected'): Promise<void> {
  try {
    const updateData = {
      status,
      [`statusTimestamps.${status}`]: Timestamp.now(),
      updatedAt: Timestamp.now(),
      'timestamps.lastModified': Timestamp.now(),
    };
    
    await updateDoc(doc(db, 'loan_applications', applicationId), updateData);
    
    // Update statistics based on status change
    if (status === 'approved') {
      await updateStatistics('increment', 'approvedApplications');
      await updateStatistics('decrement', 'submittedApplications');
    } else if (status === 'rejected') {
      await updateStatistics('increment', 'rejectedApplications');
      await updateStatistics('decrement', 'submittedApplications');
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}

// Get all applications - Shows ALL forms including drafts
export async function getApplications(): Promise<LoanApplication[]> {
  try {
    const q = query(
      collection(db, 'loan_applications'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications: LoanApplication[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure status exists (default to 'draft' if missing)
      applications.push({ 
        id: doc.id, 
        ...data,
        status: data['status'] || 'draft'
      } as LoanApplication);
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting all applications:', error);
    return [];
  }
}

// Submit application
export async function submitApplication(applicationId: string): Promise<void> {
  try {
    const updateData = {
      status: 'submitted',
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      'timestamps.lastModified': Timestamp.now(),
    };
    
    await updateDoc(doc(db, 'loan_applications', applicationId), updateData);
    
    // Update statistics
    await updateStatistics('decrement', 'draftApplications');
    await updateStatistics('increment', 'submittedApplications');
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error('Failed to submit application');
  }
}

// Update statistics helper
async function updateStatistics(
  operation: 'increment' | 'decrement',
  field: string
): Promise<void> {
  try {
    const statsRef = doc(db, 'statistics', 'dashboard');
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      const currentValue = statsDoc.data()[field] || 0;
      const newValue = operation === 'increment' ? currentValue + 1 : Math.max(0, currentValue - 1);
      
      await updateDoc(statsRef, {
        [field]: newValue,
        lastUpdated: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create initial statistics document
      const initialStats = {
        totalApplications: 0,
        draftApplications: 0,
        submittedApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        [field]: operation === 'increment' ? 1 : 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastUpdated: Timestamp.now(),
      };
      
      await setDoc(statsRef, initialStats);
    }
  } catch (error) {
    console.error('Error updating statistics:', error);
  }
}