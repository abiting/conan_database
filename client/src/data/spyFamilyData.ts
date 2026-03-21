import rawData from './spy_family_episodes.json';

export interface SpyFamilyEpisode {
  id: string | number;
  episode: number | string;
  title_zh: string;
  title_ja: string;
  chapters: string;
  year: number;
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

// 間諜家家酒集數資料
export const spyFamilyEpisodes: SpyFamilyEpisode[] = rawData
  .filter((ep: any) => ep.episode && parseInt(ep.episode, 10) > 0)
  .map((ep: any, index: number) => {
    const episodeNum = parseInt(ep.episode, 10);
    return {
      id: index + 1,
      episode: episodeNum,
      title_zh: ep.title_zh || '',
      title_ja: ep.title_ja || '',
      chapters: ep.chapters || '',
      year: parseInt(ep.year, 10),
    };
  });

// 延遲計算簡體中文版本（只在需要時才轉換）
let cachedSpyFamilyEpisodesSimplified: SpyFamilyEpisode[] | null = null;

export function getSpyFamilyEpisodesSimplified(): SpyFamilyEpisode[] {
  if (!cachedSpyFamilyEpisodesSimplified) {
    cachedSpyFamilyEpisodesSimplified = spyFamilyEpisodes.map(ep => ({
      ...ep,
      title_zh: ep.title_zh ? convertToSimplified(ep.title_zh) : '',
      chapters: ep.chapters ? convertToSimplified(ep.chapters) : '',
    }));
  }
  return cachedSpyFamilyEpisodesSimplified;
}

// 保持向後相容性
export const spyFamilyEpisodesSimplified = spyFamilyEpisodes;
