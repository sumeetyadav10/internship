import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoanApplication } from '@/types';
import { cleanUndefinedValues } from './applications';

interface SyncStatus {
  lastSyncAt: string | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

interface LocalData {
  applications: LoanApplication[];
  timestamp: string;
}

const SYNC_STATUS_KEY = 'syncStatus';
const LOCAL_DATA_KEY = 'localApplicationData';
const SYNC_INTERVAL = 30000; // 30 seconds

export class DataSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private syncInProgress = false;
  
  constructor(private userId: string) {}

  /**
   * Start automatic sync
   */
  startSync(): void {
    // Initial sync
    this.syncData();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, SYNC_INTERVAL);
  }

  /**
   * Stop automatic sync
   */
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    try {
      const stored = localStorage.getItem(SYNC_STATUS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading sync status:', error);
    }
    
    return {
      lastSyncAt: null,
      pendingChanges: 0,
      syncInProgress: false
    };
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(updates: Partial<SyncStatus>): void {
    const current = this.getSyncStatus();
    const updated = { ...current, ...updates };
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(updated));
  }

  /**
   * Get local data
   */
  getLocalData(): LocalData | null {
    try {
      const stored = localStorage.getItem(LOCAL_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading local data:', error);
    }
    return null;
  }

  /**
   * Save data locally
   */
  saveLocalData(applications: LoanApplication[]): void {
    const data: LocalData = {
      applications,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
    
    // Update pending changes count
    this.updateSyncStatus({
      pendingChanges: applications.filter(app => app.isTemporary).length
    });
  }

  /**
   * Sync data between localStorage and Firestore
   */
  async syncData(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    try {
      this.syncInProgress = true;
      this.updateSyncStatus({ syncInProgress: true });

      const localData = this.getLocalData();
      if (!localData || localData.applications.length === 0) {
        return;
      }

      // Filter temporary applications that need syncing
      const tempApps = localData.applications.filter(app => app.isTemporary);
      
      if (tempApps.length === 0) {
        this.updateSyncStatus({
          lastSyncAt: new Date().toISOString(),
          pendingChanges: 0
        });
        return;
      }

      // Use batch write for efficiency
      const batch = writeBatch(db);
      const syncedApps: string[] = [];

      for (const app of tempApps) {
        if (!app.id) {
          console.warn('Skipping app without ID');
          continue;
        }
        
        try {
          const docRef = doc(db, 'applications', app.id);
          
          // Clean the data before saving
          const cleanedData = cleanUndefinedValues({
            ...app,
            isTemporary: false,
            syncedAt: new Date().toISOString()
          });

          batch.set(docRef, cleanedData);
          syncedApps.push(app.id);
        } catch (error) {
          console.error(`Error preparing sync for ${app.id}:`, error);
        }
      }

      // Commit the batch
      if (syncedApps.length > 0) {
        await batch.commit();
        
        // Update local data to mark synced applications
        const updatedApps = localData.applications.map(app => {
          if (app.id && syncedApps.includes(app.id)) {
            return { ...app, isTemporary: false };
          }
          return app;
        });
        
        this.saveLocalData(updatedApps);
        
        // Clear temporary applications from localStorage
        this.clearSyncedTemporaryApplications(syncedApps);
      }

      this.updateSyncStatus({
        lastSyncAt: new Date().toISOString(),
        pendingChanges: tempApps.length - syncedApps.length
      });

    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
      this.updateSyncStatus({ syncInProgress: false });
    }
  }

  /**
   * Clear synced temporary applications from localStorage
   */
  private clearSyncedTemporaryApplications(syncedIds: string[]): void {
    try {
      const tempAppsStr = localStorage.getItem('temporaryApplications');
      if (tempAppsStr) {
        const tempApps = JSON.parse(tempAppsStr) as LoanApplication[];
        const remaining = tempApps.filter(app => app.id && !syncedIds.includes(app.id));
        
        if (remaining.length === 0) {
          localStorage.removeItem('temporaryApplications');
        } else {
          localStorage.setItem('temporaryApplications', JSON.stringify(remaining));
        }
      }
    } catch (error) {
      console.error('Error clearing synced applications:', error);
    }
  }

  /**
   * Force sync immediately
   */
  async forceSync(): Promise<void> {
    await this.syncData();
  }

  /**
   * Check if online and can sync
   */
  canSync(): boolean {
    return navigator.onLine && !this.syncInProgress;
  }

  /**
   * Clear all local data
   */
  clearLocalData(): void {
    localStorage.removeItem(LOCAL_DATA_KEY);
    localStorage.removeItem(SYNC_STATUS_KEY);
    localStorage.removeItem('temporaryApplications');
  }
}

/**
 * Create a singleton instance of sync service
 */
let syncServiceInstance: DataSyncService | null = null;

export function getDataSyncService(userId: string): DataSyncService {
  if (!syncServiceInstance || syncServiceInstance['userId'] !== userId) {
    if (syncServiceInstance) {
      syncServiceInstance.stopSync();
    }
    syncServiceInstance = new DataSyncService(userId);
  }
  return syncServiceInstance;
}

/**
 * Hook to monitor online/offline status and sync accordingly
 */
export function setupNetworkListener(syncService: DataSyncService): () => void {
  const handleOnline = () => {
    console.log('Network connected, syncing data...');
    syncService.forceSync();
  };

  const handleOffline = () => {
    console.log('Network disconnected');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}