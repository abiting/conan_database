import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { AnimeEpisode, MangaVolume } from '@/data/conanData';

// 快速包含檢查（不使用複雜的 Levenshtein 距離）
function quickMatch(text: string, term: string): boolean {
  // 精確包含匹配
  if (text.includes(term)) return true;
  
  // 檢查每個字符是否都在文本中（不考慮順序）
  let termIndex = 0;
  for (let i = 0; i < text.length && termIndex < term.length; i++) {
    if (text[i] === term[termIndex]) {
      termIndex++;
    }
  }
  return termIndex === term.length;
}

// 計算匹配得分（簡化版本）
function calculateMatchScore(text: string, searchTerm: string): number {
  // 精確匹配得分最高
  if (text === searchTerm) return 100;
  
  // 包含匹配
  if (text.includes(searchTerm)) return 90;
  
  // 快速模糊匹配
  if (quickMatch(text, searchTerm)) return 70;
  
  return 0;
}

export function useAnimeSearch(episodes: AnimeEpisode[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchCacheRef = useRef<Map<string, AnimeEpisode[]>>(new Map());

  // 防抖搜尋詞
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms 防抖

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const filteredEpisodes = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return episodes;
    }

    // 檢查緩存
    if (searchCacheRef.current.has(debouncedSearchTerm)) {
      return searchCacheRef.current.get(debouncedSearchTerm)!;
    }

    const term = debouncedSearchTerm.toLowerCase().trim();
    
    // 快速過濾和排序
    const scored = episodes
      .map(ep => {
        const numberStr = ep.episode?.toString() || '';
        const titleJa = (ep.title_ja || '').toLowerCase();
        const titleZh = (ep.title_zh || '').toLowerCase();
        
        let score = 0;
        
        if (numberStr === term) score = 100; // 完全匹配集數
        else if (titleZh.includes(term)) score = 95; // 中文標題包含
        else if (titleJa.includes(term)) score = 90; // 日文標題包含
        else {
          // 簡化的模糊匹配
          const zhScore = calculateMatchScore(titleZh, term);
          const jaScore = calculateMatchScore(titleJa, term);
          const numberScore = numberStr.includes(term) ? 50 : 0;
          
          score = Math.max(zhScore, jaScore, numberScore);
        }
        
        return { ep, score };
      })
      .filter(({ score }) => score > 0) // 只保留有匹配的結果
      .sort((a, b) => b.score - a.score) // 按得分降序排列
      .map(({ ep }) => ep);

    // 保存到緩存（最多保留 20 個搜尋結果）
    if (searchCacheRef.current.size >= 20) {
      const firstKey = searchCacheRef.current.keys().next().value;
      if (firstKey !== undefined) {
        searchCacheRef.current.delete(firstKey);
      }
    }
    searchCacheRef.current.set(debouncedSearchTerm, scored);

    return scored;
  }, [episodes, debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, filteredEpisodes };
}

export function useMangaSearch(volumes: MangaVolume[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchCacheRef = useRef<Map<string, MangaVolume[]>>(new Map());

  // 防抖搜尋詞
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms 防抖

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const filteredVolumes = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return volumes;
    }

    // 檢查緩存
    if (searchCacheRef.current.has(debouncedSearchTerm)) {
      return searchCacheRef.current.get(debouncedSearchTerm)!;
    }

    const term = debouncedSearchTerm.toLowerCase().trim();
    
    // 快速過濾和排序
    const scored = volumes
      .map(vol => {
        const volumeStr = vol.volume.toString();
        const titleEn = (vol.title || '').toLowerCase();
        const titleZh = vol.titleZh.toLowerCase();
        const chapters = vol.chapters.toLowerCase();
        
        let score = 0;
        
        if (volumeStr === term) score = 100; // 完全匹配卷數
        else if (titleZh.includes(term)) score = 95; // 中文標題包含
        else if (titleEn.includes(term)) score = 90; // 英文標題包含
        else if (chapters.includes(term)) score = 85; // 話數包含
        else {
          // 簡化的模糊匹配
          const zhScore = calculateMatchScore(titleZh, term);
          const enScore = calculateMatchScore(titleEn || '', term);
          const volScore = volumeStr.includes(term) ? 50 : 0;
          
          score = Math.max(zhScore, enScore, volScore);
        }
        
        return { vol, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ vol }) => vol);

    // 保存到緩存（最多保留 20 個搜尋結果）
    if (searchCacheRef.current.size >= 20) {
      const firstKey = searchCacheRef.current.keys().next().value;
      if (firstKey !== undefined) {
        searchCacheRef.current.delete(firstKey);
      }
    }
    searchCacheRef.current.set(debouncedSearchTerm, scored);

    return scored;
  }, [volumes, debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, filteredVolumes };
}
