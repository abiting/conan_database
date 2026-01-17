import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'conan_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // 從 localStorage 載入最愛列表
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // 當最愛列表改變時，保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (episodeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(episodeId)) {
        newFavorites.delete(episodeId);
      } else {
        newFavorites.add(episodeId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (episodeId: string) => favorites.has(episodeId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
