import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'conan_favorites';

// 嘗試使用 localStorage，如果失敗則使用內存存儲
function getStorageMethod() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return 'localStorage';
  } catch (e) {
    console.warn('localStorage not available, using sessionStorage as fallback');
    return 'sessionStorage';
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageMethod] = useState(() => getStorageMethod());

  // 從存儲中載入最愛列表
  useEffect(() => {
    try {
      const storage = storageMethod === 'localStorage' ? localStorage : sessionStorage;
      const stored = storage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(Array.isArray(parsed) ? parsed : []));
      }
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
    setIsLoaded(true);
  }, [storageMethod]);

  // 當最愛列表改變時，保存到存儲
  useEffect(() => {
    if (isLoaded) {
      try {
        const storage = storageMethod === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error('Failed to save favorites to storage:', error);
      }
    }
  }, [favorites, isLoaded, storageMethod]);

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
