import rawData from './conan_episodes.json';

export interface AnimeEpisode {
  id: string | number;
  episode: number;
  title_zh: string;
  title_ja: string;
  manga?: string;
  year: number;
  overseas_ep?: number;
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
  .map((ep: any, index: number) => ({
    id: index + 1,
    episode: parseInt(ep.episode, 10),
    title_zh: ep.title_zh || '',
    title_ja: ep.title_jp || '',
    manga: ep.manga || undefined,
    year: parseInt(ep.year, 10),
    overseas_ep: ep.overseas_ep ? parseInt(ep.overseas_ep, 10) : undefined,
  }));

// 海外版集數資料（使用 overseas_ep 作為集數號，不進行複合集數分解）
export const overseasEpisodes: AnimeEpisode[] = animeEpisodes
  .filter(ep => ep.overseas_ep && ep.overseas_ep > 0)
  .map((ep, index) => ({
    ...ep,
    id: index + 1,
    episode: ep.overseas_ep as number,  // 使用海外版集數
  }));

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
