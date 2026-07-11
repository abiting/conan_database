import rawData from './conan_episodes.json';

export interface AnimeEpisode {
  id: string | number;
  episode: number | string;
  title_zh: string;
  title_ja: string;
  manga?: string;
  year: number;
  overseas_ep?: number | string;
  episode_digits?: number; // 官方版集數的位數
  is_special?: boolean; // 特別篇（不佔日版集數）
}

export interface MangaVolume {
  volume: number;
  title: string;
  titleZh: string;
  chapters: string;
  id?: string;
}

// 簡體中文轉換函數（使用緩存避免重複計算）
const simplifiedCache = new Map<string, string>();
const SIMPLIFIED_MAP: Record<string, string> = {
  '偵': '侦', '訊': '讯', '詢': '询', '調': '调',
  '謎': '谜', '謝': '谢', '謀': '谋', '謊': '谎', '誘': '诱',
  '誰': '谁', '誤': '误', '說': '说', '請': '请', '論': '论',
  '誠': '诚', '誇': '夸', '誌': '志', '誕': '诞',
  '認': '认', '誼': '谊',
};

function convertToSimplified(text: string): string {
  if (!text) return text;
  if (simplifiedCache.has(text)) {
    return simplifiedCache.get(text)!;
  }
  
  let result = text;
  for (const [trad, simp] of Object.entries(SIMPLIFIED_MAP)) {
    result = result.replace(new RegExp(trad, 'g'), simp);
  }
  
  simplifiedCache.set(text, result);
  return result;
}

// 官方版集數資料
export const animeEpisodes: AnimeEpisode[] = rawData
  .filter((ep: any) => ep.episode || ep.is_special)
  .map((ep: any, index: number) => {
    const episodeNum = parseInt(ep.episode, 10);
    const isSpecial = ep.is_special || isNaN(episodeNum); // 特別篇（episode 為 null 或非數字）
    const yearValue = ep.year ? parseInt(ep.year, 10) : 0;
    return {
      id: ep.id ?? index + 1,
      episode: isSpecial ? (ep.special_label || ep.episode || '') : episodeNum,
      title_zh: ep.title_zh || '',
      title_ja: ep.title_ja || '',
      manga: ep.manga || undefined,
      year: isNaN(yearValue) ? 0 : yearValue,
      overseas_ep: ep.overseas_ep ? ep.overseas_ep : undefined,
      episode_digits: isSpecial ? 0 : episodeNum.toString().length,
      is_special: isSpecial,
    };
  })
  .sort((a, b) => {
    // 特別篇排最後
    if (a.is_special && !b.is_special) return 1;
    if (!a.is_special && b.is_special) return -1;
    // 一般集數按集數排序
    const aNum = typeof a.episode === 'number' ? a.episode : 0;
    const bNum = typeof b.episode === 'number' ? b.episode : 0;
    return aNum - bNum;
  });

// 需要拆分的特別篇（1小時或以上）
// 已移除 specialEpisodesToSplit - 海外版集數不再拆分

// 海外版集數資料（不拆分，保持複合集數在同一欄位）
const overseasEpisodesArray: AnimeEpisode[] = animeEpisodes
  .filter(ep => ep.overseas_ep && (typeof ep.overseas_ep === 'string' || (typeof ep.overseas_ep === 'number' && ep.overseas_ep > 0)))
  .map((ep, idx) => ({
    ...ep,
    id: idx + 1,
    episode: ep.overseas_ep as string | number,
  }))
  .sort((a, b) => {
    // 特別篇排最後
    if (a.is_special && !b.is_special) return 1;
    if (!a.is_special && b.is_special) return -1;
    // 按海外集數排序
    const aNum = typeof a.episode === 'number' ? a.episode : parseInt(String(a.episode), 10) || 0;
    const bNum = typeof b.episode === 'number' ? b.episode : parseInt(String(b.episode), 10) || 0;
    return aNum - bNum;
  });

export const overseasEpisodes = overseasEpisodesArray;

// 延遲計算簡體中文版本（只在需要時才轉換）
let cachedAnimeEpisodesSimplified: AnimeEpisode[] | null = null;
let cachedOverseasEpisodesSimplified: AnimeEpisode[] | null = null;

export function getAnimeEpisodesSimplified(): AnimeEpisode[] {
  if (!cachedAnimeEpisodesSimplified) {
    cachedAnimeEpisodesSimplified = animeEpisodes.map(ep => ({
      ...ep,
      title_zh: ep.title_zh ? convertToSimplified(ep.title_zh) : '',
      manga: ep.manga ? convertToSimplified(ep.manga) : '',
    }));
  }
  return cachedAnimeEpisodesSimplified;
}

export function getOverseasEpisodesSimplified(): AnimeEpisode[] {
  if (!cachedOverseasEpisodesSimplified) {
    cachedOverseasEpisodesSimplified = overseasEpisodes.map(ep => ({
      ...ep,
      title_zh: ep.title_zh ? convertToSimplified(ep.title_zh) : '',
      manga: ep.manga ? convertToSimplified(ep.manga) : '',
    }));
  }
  return cachedOverseasEpisodesSimplified;
}

// 保持向後相容性
export const animeEpisodesSimplified = animeEpisodes;
export const overseasEpisodesSimplified = overseasEpisodes;

// 漫畫卷數資料
export const mangaVolumes: MangaVolume[] = [
  {
    volume: 1,
    title: 'Detective Conan Vol. 1',
    titleZh: '名偵探柯南 第 1 卷',
    chapters: 'File 1-10',
  },
];

// 簡體中文漫畫卷數資料
export const mangaVolumesZhCN = mangaVolumes.map(vol => ({
  ...vol,
  titleZh: convertToSimplified(vol.titleZh),
}));
