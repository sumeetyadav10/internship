import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  getDocs,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoanApplication } from '@/types';

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc: DocumentSnapshot | null;
  total?: number;
}

export interface ApplicationFilters {
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

/**
 * Get paginated loan applications
 */
export async function getPaginatedApplications(
  pageSize: number = 10,
  lastDoc: DocumentSnapshot | null = null,
  filters?: ApplicationFilters
): Promise<PaginatedResult<LoanApplication>> {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Apply filters
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters?.userId) {
      constraints.push(where('createdBy', '==', filters.userId));
    }
    
    if (filters?.dateFrom) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
    }
    
    if (filters?.dateTo) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
    }
    
    // Always order by createdAt for consistent pagination
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Add pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    // Fetch one extra to check if there are more pages
    constraints.push(firestoreLimit(pageSize + 1));
    
    const q = query(collection(db, 'loan_applications'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const applications: LoanApplication[] = [];
    let hasMore = false;
    let newLastDoc: DocumentSnapshot | null = null;
    
    let index = 0;
    querySnapshot.forEach((doc) => {
      if (index < pageSize) {
        const data = doc.data();
        applications.push({ 
          id: doc.id, 
          ...data,
          // Ensure dates are properly formatted
          createdAt: data['createdAt']?.toDate?.() || data['createdAt'],
          updatedAt: data['updatedAt']?.toDate?.() || data['updatedAt'],
        } as LoanApplication);
        newLastDoc = doc;
      } else {
        hasMore = true;
      }
      index++;
    });
    
    // Apply client-side search if needed (for fields not indexed)
    let filteredApplications = applications;
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredApplications = applications.filter(app => {
        const searchableText = [
          app.formNumber,
          app.applicantDetails?.firstName,
          app.applicantDetails?.lastName,
          app.applicantDetails?.mobileNo,
          app.applicantDetails?.aadharNo,
          app.applicantDetails?.industryName
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }
    
    return {
      data: filteredApplications,
      hasMore,
      lastDoc: newLastDoc
    };
  } catch (error) {
    console.error('Error fetching paginated applications:', error);
    return {
      data: [],
      hasMore: false,
      lastDoc: null
    };
  }
}

/**
 * Get total count of applications (for display purposes)
 */
export async function getApplicationsCount(filters?: ApplicationFilters): Promise<number> {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters?.userId) {
      constraints.push(where('createdBy', '==', filters.userId));
    }
    
    if (filters?.dateFrom) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
    }
    
    if (filters?.dateTo) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
    }
    
    const q = query(collection(db, 'loan_applications'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting applications count:', error);
    return 0;
  }
}