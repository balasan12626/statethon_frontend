interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired items first
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let active = 0;
    let expired = 0;

    for (const [, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expired++;
      } else {
        active++;
      }
    }

    return { active, expired, total: this.cache.size };
  }
}

// Create global cache instance
export const apiCache = new APICache();

// Search results cache with longer TTL
export const searchCache = new APICache();

// Utility function for cached API calls
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = apiCache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Make API call
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache the result
  apiCache.set(cacheKey, data, ttl);
  
  return data;
}

// Search-specific cached fetch with different TTL
export async function cachedSearchFetch<T>(
  url: string,
  searchData: any,
  ttl: number = 10 * 60 * 1000 // 10 minutes for search results
): Promise<T> {
  const cacheKey = `search:${JSON.stringify(searchData)}`;
  
  const cached = searchCache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(searchData)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  searchCache.set(cacheKey, data, ttl);
  
  return data;
}