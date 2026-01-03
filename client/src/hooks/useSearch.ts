import { useMemo, useState } from 'react';
import { AnimeEpisode, MangaVolume } from '@/data/conanData';

// 計算編輯距離（Levenshtein distance）
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

// 計算相似度（0-1，1 表示完全相同）
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  return 1 - distance / maxLen;
}

// 檢查是否為模糊匹配（相似度 > 0.6）
function isFuzzyMatch(text: string, term: string, threshold: number = 0.6): boolean {
  // 先檢查包含關係
  if (text.includes(term)) return true;

  // 檢查相似度
  const similarity = calculateSimilarity(text, term);
  return similarity >= threshold;
}

// 搜尋單個詞彙的相似度
function findBestMatch(text: string, term: string): number {
  // 精確包含匹配得分最高
  if (text.includes(term)) return 1;

  // 檢查是否有相似的子串
  let bestSimilarity = 0;
  const words = text.split(/[\s\-_]+/);
  
  for (const word of words) {
    const similarity = calculateSimilarity(word, term);
    bestSimilarity = Math.max(bestSimilarity, similarity);
  }

  // 也檢查整個文本與搜尋詞的相似度
  const textSimilarity = calculateSimilarity(text, term);
  bestSimilarity = Math.max(bestSimilarity, textSimilarity);

  return bestSimilarity;
}

// 計算整個搜尋詞的匹配得分
function calculateMatchScore(text: string, searchTerm: string): number {
  const terms = searchTerm.split(/[\s\-_]+/).filter(t => t.length > 0);
  if (terms.length === 0) return 0;

  let totalScore = 0;
  for (const term of terms) {
    totalScore += findBestMatch(text, term);
  }

  return totalScore / terms.length;
}

export function useAnimeSearch(episodes: AnimeEpisode[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return episodes;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // 計算每個集數的匹配得分
    const scored = episodes
      .map(ep => {
        const numberStr = ep.episode?.toString() || '';
        const titleJa = (ep.title_ja || '').toLowerCase();
        const titleZh = (ep.title_zh || '').toLowerCase();
        
        // 精確匹配得分最高
        let score = 0;
        
        if (numberStr === term) score = 100; // 完全匹配集數
        else if (titleZh.includes(term) || titleJa.includes(term)) score = 90; // 包含匹配
        else {
          // 模糊匹配
          const zhScore = calculateMatchScore(titleZh, term);
          const jaScore = calculateMatchScore(titleJa, term);
          const numberScore = numberStr.includes(term) ? 0.8 : 0;
          
          score = Math.max(zhScore, jaScore, numberScore) * 80;
        }
        
        return { ep, score };
      })
      .filter(({ score }) => score > 20) // 只保留相似度 > 0.25 的結果
      .sort((a, b) => b.score - a.score) // 按得分降序排列
      .map(({ ep }) => ep);

    return scored;
  }, [episodes, searchTerm]);

  return { searchTerm, setSearchTerm, filteredEpisodes };
}

export function useMangaSearch(volumes: MangaVolume[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVolumes = useMemo(() => {
    if (!searchTerm.trim()) {
      return volumes;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // 計算每個卷的匹配得分
    const scored = volumes
      .map(vol => {
        const volumeStr = vol.volume.toString();
        const titleEn = (vol.title || '').toLowerCase();
        const titleZh = vol.titleZh.toLowerCase();
        const chapters = vol.chapters.toLowerCase();
        
        let score = 0;
        
        if (volumeStr === term) score = 100; // 完全匹配卷數
        else if (titleZh.includes(term) || titleEn.includes(term) || chapters.includes(term)) score = 90;
        else {
          // 模糊匹配
          const zhScore = calculateMatchScore(titleZh, term);
          const enScore = calculateMatchScore(titleEn, term);
          const volScore = volumeStr.includes(term) ? 0.8 : 0;
          
          score = Math.max(zhScore, enScore, volScore) * 80;
        }
        
        return { vol, score };
      })
      .filter(({ score }) => score > 20)
      .sort((a, b) => b.score - a.score)
      .map(({ vol }) => vol);

    return scored;
  }, [volumes, searchTerm]);

  return { searchTerm, setSearchTerm, filteredVolumes };
}
