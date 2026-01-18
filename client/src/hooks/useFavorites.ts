import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'conan_favorites';
const DB_NAME = 'conan_db';
const STORE_NAME = 'favorites';

// IndexedDB 操作
class FavoritesDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async getFavorites(): Promise<string[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(FAVORITES_STORAGE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result?.data || []);
      };
    });
  }

  async saveFavorites(favorites: string[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ data: favorites }, FAVORITES_STORAGE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

const favoritesDB = new FavoritesDB();

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // 從 IndexedDB 載入最愛列表
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await favoritesDB.getFavorites();
        setFavorites(new Set(Array.isArray(stored) ? stored : []));
      } catch (error) {
        console.error('Failed to load favorites from IndexedDB:', error);
        // 降級到 localStorage
        try {
          const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setFavorites(new Set(Array.isArray(parsed) ? parsed : []));
          }
        } catch (e) {
          console.error('Failed to load favorites from localStorage:', e);
        }
      }
      setIsLoaded(true);
    };

    loadFavorites();
  }, []);

  // 當最愛列表改變時，保存到 IndexedDB
  useEffect(() => {
    if (isLoaded) {
      const saveFavorites = async () => {
        try {
          await favoritesDB.saveFavorites(Array.from(favorites));
        } catch (error) {
          console.error('Failed to save favorites to IndexedDB:', error);
          // 降級到 localStorage
          try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
          } catch (e) {
            console.error('Failed to save favorites to localStorage:', e);
          }
        }
      };

      saveFavorites();
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((episodeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(episodeId)) {
        newFavorites.delete(episodeId);
      } else {
        newFavorites.add(episodeId);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((episodeId: string) => {
    return favorites.has(episodeId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
