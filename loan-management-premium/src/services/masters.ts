import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { District, Taluka, Village } from '@/types';

// Cache for masters data
let mastersCache: {
  districts: District[];
  talukas: Taluka[];
  villages: Village[];
  lastFetched: number;
} | null = null;

// Loading promise to prevent multiple simultaneous fetches
let loadingPromise: Promise<{districts: District[], talukas: Taluka[], villages: Village[]}> | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMastersData() {
  // Return from cache if available and fresh
  if (mastersCache && Date.now() - mastersCache.lastFetched < CACHE_DURATION) {
    return mastersCache;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create new loading promise
  loadingPromise = (async () => {
    try {
    // Check if data exists in subcollections (existing structure)
    const districtsSnapshot = await getDocs(collection(db, 'masters/locations/districts'));
    
    if (!districtsSnapshot.empty) {
      // Use subcollection structure
      const districts: District[] = [];
      districtsSnapshot.forEach(doc => {
        const data = doc.data();
        districts.push({
          code: data['code'] || doc.id,
          name: data['name'] || '',
          active: data['active'] ?? true,
        });
      });

      const talukasSnapshot = await getDocs(collection(db, 'masters/locations/talukas'));
      const talukas: Taluka[] = [];
      talukasSnapshot.forEach(doc => {
        const data = doc.data();
        talukas.push({
          code: data['code'] || doc.id,
          name: data['name'] || '',
          districtCode: data['districtCode'] || '',
          active: data['active'] ?? true,
        });
      });

      const villagesSnapshot = await getDocs(collection(db, 'masters/locations/villages'));
      const villages: Village[] = [];
      villagesSnapshot.forEach(doc => {
        const data = doc.data();
        villages.push({
          code: data['code'] || doc.id,
          name: data['name'] || '',
          talukaCode: data['talukaCode'] || '',
          districtCode: data['districtCode'] || '',
          pincode: data['pincode'] || '',
          active: data['active'] ?? true,
        });
      });

      // Update cache
      mastersCache = {
        districts,
        talukas,
        villages,
        lastFetched: Date.now(),
      };

      return mastersCache;
    }

    // Fallback to single document structure
    const mastersDoc = await getDoc(doc(db, 'masters', 'locations'));
    
    if (!mastersDoc.exists()) {
      console.error('Masters data not found in either format');
      return { districts: [], talukas: [], villages: [] };
    }

    const data = mastersDoc.data();
    
    // Extract and format the data
    const districts: District[] = (data['districts'] || []).map((d: { code: string; name: string; active?: boolean }) => ({
      code: d.code,
      name: d.name,
      active: d.active ?? true,
    }));

    const talukas: Taluka[] = (data['talukas'] || []).map((t: { code: string; name: string; districtCode: string; active?: boolean }) => ({
      code: t.code,
      name: t.name,
      districtCode: t.districtCode,
      active: t.active ?? true,
    }));

    const villages: Village[] = (data['villages'] || []).map((v: { code: string; name: string; talukaCode: string; districtCode: string; pincode?: string; active?: boolean }) => ({
      code: v.code,
      name: v.name,
      talukaCode: v.talukaCode,
      districtCode: v.districtCode,
      pincode: v.pincode || '',
      active: v.active ?? true,
    }));

    // Update cache
    mastersCache = {
      districts,
      talukas,
      villages,
      lastFetched: Date.now(),
    };

    loadingPromise = null; // Clear loading promise
    return mastersCache;
  } catch (error) {
    console.error('Error fetching masters data:', error);
    loadingPromise = null; // Clear loading promise on error
    return { districts: [], talukas: [], villages: [] };
  }
  })();
  
  return loadingPromise;
}

export async function getDistrictTalukas(districtCode: string): Promise<Taluka[]> {
  if (!districtCode) return [];
  
  try {
    const { talukas } = await getMastersData();
    return talukas.filter(t => t.districtCode === districtCode && t.active) || [];
  } catch (error) {
    console.error('Error getting talukas for district:', districtCode, error);
    return [];
  }
}

export async function getTalukaVillages(talukaCode: string): Promise<Village[]> {
  if (!talukaCode) return [];
  
  try {
    const { villages } = await getMastersData();
    return villages.filter(v => v.talukaCode === talukaCode && v.active) || [];
  } catch (error) {
    console.error('Error getting villages for taluka:', talukaCode, error);
    return [];
  }
}

export function clearMastersCache() {
  mastersCache = null;
  loadingPromise = null;
}

// CRUD Operations for Districts
export async function addDistrict(districtData: Omit<District, 'active'>) {
  try {
    const districtRef = doc(db, 'masters/locations/districts', districtData.code);
    await setDoc(districtRef, {
      ...districtData,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error adding district:', error);
    throw error;
  }
}

export async function updateDistrict(code: string, data: Partial<District>) {
  try {
    const districtRef = doc(db, 'masters/locations/districts', code);
    await updateDoc(districtRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error updating district:', error);
    throw error;
  }
}

export async function deleteDistrict(code: string) {
  try {
    const districtRef = doc(db, 'masters/locations/districts', code);
    await deleteDoc(districtRef);
    clearMastersCache();
  } catch (error) {
    console.error('Error deleting district:', error);
    throw error;
  }
}

// CRUD Operations for Talukas
export async function addTaluka(districtCode: string, talukaData: Omit<Taluka, 'active' | 'districtCode'>) {
  try {
    const talukaRef = doc(db, 'masters/locations/talukas', talukaData.code);
    await setDoc(talukaRef, {
      ...talukaData,
      districtCode,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error adding taluka:', error);
    throw error;
  }
}

export async function updateTaluka(_districtCode: string, code: string, data: Partial<Taluka>) {
  try {
    const talukaRef = doc(db, 'masters/locations/talukas', code);
    await updateDoc(talukaRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error updating taluka:', error);
    throw error;
  }
}

export async function deleteTaluka(_districtCode: string, code: string) {
  try {
    const talukaRef = doc(db, 'masters/locations/talukas', code);
    await deleteDoc(talukaRef);
    clearMastersCache();
  } catch (error) {
    console.error('Error deleting taluka:', error);
    throw error;
  }
}

// CRUD Operations for Villages
export async function addVillage(talukaCode: string, villageData: Omit<Village, 'active' | 'talukaCode' | 'districtCode'>) {
  try {
    // Get taluka to find district code
    const { talukas } = await getMastersData();
    const taluka = talukas.find(t => t.code === talukaCode);
    if (!taluka) throw new Error('Taluka not found');
    
    const villageRef = doc(db, 'masters/locations/villages', villageData.code);
    await setDoc(villageRef, {
      ...villageData,
      talukaCode,
      districtCode: taluka.districtCode,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error adding village:', error);
    throw error;
  }
}

export async function updateVillage(_talukaCode: string, code: string, data: Partial<Village>) {
  try {
    const villageRef = doc(db, 'masters/locations/villages', code);
    await updateDoc(villageRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    clearMastersCache();
  } catch (error) {
    console.error('Error updating village:', error);
    throw error;
  }
}

export async function deleteVillage(_talukaCode: string, code: string) {
  try {
    const villageRef = doc(db, 'masters/locations/villages', code);
    await deleteDoc(villageRef);
    clearMastersCache();
  } catch (error) {
    console.error('Error deleting village:', error);
    throw error;
  }
}