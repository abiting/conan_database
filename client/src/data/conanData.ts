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
}

export interface MangaVolume {
  volume: number;
  title: string;
  titleZh: string;
  chapters: string;
  id?: string;
}

// 簡體中文轉換函數
function convertToSimplified(text: string): string {
  const map: Record<string, string> = {
    '偵': '侦', '訊': '讯', '詢': '询', '調': '调',
    '謎': '谜', '謝': '谢', '謀': '谋', '謊': '谎', '誘': '诱',
    '誰': '谁', '誤': '误', '說': '说', '請': '请', '論': '论',
    '誠': '诚', '誇': '夸', '誌': '志', '誕': '诞',
    '認': '认', '誼': '谊',
  };
  
  let result = text;
  for (const [trad, simp] of Object.entries(map)) {
    result = result.replace(new RegExp(trad, 'g'), simp);
  }
  return result;
}

// 官方版集數資料
export const animeEpisodes: AnimeEpisode[] = rawData
  .filter((ep: any) => ep.episode && parseInt(ep.episode, 10) > 0)
  .map((ep: any, index: number) => {
    const episodeNum = parseInt(ep.episode, 10);
    return {
      id: index + 1,
      episode: episodeNum,
      title_zh: ep.title_zh || '',
      title_ja: ep.title_jp || '',
      manga: ep.manga || undefined,
      year: parseInt(ep.year, 10),
      overseas_ep: ep.overseas_ep ? ep.overseas_ep : undefined,
      episode_digits: episodeNum.toString().length,
    };
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
  }));

export const overseasEpisodes = overseasEpisodesArray;

// 為動畫集數添加簡體中文版本
export const animeEpisodesSimplified = animeEpisodes.map(ep => ({
  ...ep,
  title_zh: ep.title_zh ? convertToSimplified(ep.title_zh) : '',
  manga: ep.manga ? convertToSimplified(ep.manga) : '',
}));

// 為海外版動畫集數添加簡體中文版本
export const overseasEpisodesSimplified = overseasEpisodes.map(ep => ({
  ...ep,
  title_zh: ep.title_zh ? convertToSimplified(ep.title_zh) : '',
  manga: ep.manga ? convertToSimplified(ep.manga) : '',
}));

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
