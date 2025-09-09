interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(
    private windowMs: number = 60000, // 1 minute
    private maxRequests: number = 10
  ) {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.store[identifier];

    if (!record || now > record.resetAt) {
      // Create new record or reset expired one
      this.store[identifier] = {
        count: 1,
        resetAt: now + this.windowMs
      };
      return true;
    }

    if (record.count < this.maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemaining(identifier: string): number {
    const record = this.store[identifier];
    if (!record || Date.now() > record.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - record.count);
  }

  /**
   * Get time until reset in milliseconds
   */
  getResetTime(identifier: string): number {
    const record = this.store[identifier];
    if (!record || Date.now() > record.resetAt) {
      return 0;
    }
    return Math.max(0, record.resetAt - Date.now());
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    delete this.store[identifier];
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      const record = this.store[key];
      if (record && record.resetAt < now) {
        delete this.store[key];
      }
    }
  }

  /**
   * Destroy the rate limiter and clean up
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store = {};
  }
}

/**
 * Create a rate limiter middleware for API routes
 */
export function createRateLimiterMiddleware(
  windowMs: number = 60000,
  maxRequests: number = 10
) {
  const limiter = new RateLimiter(windowMs, maxRequests);

  return (getIdentifier: (req: Request) => string) => {
    return (req: Request): { allowed: boolean; remaining: number; resetTime: number } => {
      const identifier = getIdentifier(req);
      const allowed = limiter.isAllowed(identifier);
      const remaining = limiter.getRemaining(identifier);
      const resetTime = limiter.getResetTime(identifier);

      return { allowed, remaining, resetTime };
    };
  };
}

/**
 * Browser-based rate limiter using localStorage
 */
export class LocalStorageRateLimiter {
  private readonly storageKey = 'rateLimiter';

  constructor(
    private windowMs: number = 60000,
    private maxRequests: number = 10
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const store = this.getStore();
    const record = store[identifier];

    if (!record || now > record.resetAt) {
      store[identifier] = {
        count: 1,
        resetAt: now + this.windowMs
      };
      this.saveStore(store);
      return true;
    }

    if (record.count < this.maxRequests) {
      record.count++;
      this.saveStore(store);
      return true;
    }

    return false;
  }

  getRemaining(identifier: string): number {
    const store = this.getStore();
    const record = store[identifier];
    
    if (!record || Date.now() > record.resetAt) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - record.count);
  }

  private getStore(): RateLimitStore {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const store = JSON.parse(stored);
        // Clean up expired entries
        const now = Date.now();
        for (const key in store) {
          if (store[key].resetAt < now) {
            delete store[key];
          }
        }
        return store;
      }
    } catch (error) {
      console.error('Error reading rate limiter store:', error);
    }
    return {};
  }

  private saveStore(store: RateLimitStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
    } catch (error) {
      console.error('Error saving rate limiter store:', error);
    }
  }
}