import rawData from './conan_episodes.json';

export interface AnimeEpisode {
  id: string | number;
  episode: number;
  title_zh: string;
  title_ja: string;
  manga?: string;
  year: number;
  overseas_ep?: number;
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
      overseas_ep: ep.overseas_ep ? parseInt(ep.overseas_ep, 10) : undefined,
      episode_digits: episodeNum.toString().length,
    };
  });

// 需要拆分的特別篇（1小時或以上）
const specialEpisodesToSplit: Record<number, { start: number; count: number }> = {
  11: { start: 11, count: 2 },    // 1小時特別篇（鋼琴奏鳴曲）
  52: { start: 53, count: 2 },    // 1小時特別篇（霧天狗傳說）
  61: { start: 63, count: 1 },    // 1小時特別篇（上集）
  62: { start: 64, count: 1 },    // 1小時特別篇（下集）
  109: { start: 114, count: 2 },  // 1小時特別篇
  156: { start: 165, count: 2 },  // 1小時特別篇
  185: { start: 199, count: 2 },  // 1小時特別篇
  204: { start: 218, count: 2 },  // 1小時特別篇
  131: { start: 138, count: 4 },  // 2小時特別篇
  176: { start: 187, count: 4 },  // 2小時特別篇
  227: { start: 243, count: 4 },  // 2小時特別篇
  300: { start: 319, count: 4 },  // 2小時特別篇
  314: { start: 336, count: 4 },  // 2小時特別篇
};

// 海外版集數資料（拆分特別篇）
const overseasEpisodesArray: AnimeEpisode[] = [];

animeEpisodes.forEach((ep) => {
  if (!ep.overseas_ep || ep.overseas_ep <= 0) return;
  
  const splitInfo = specialEpisodesToSplit[ep.episode];
  
  if (splitInfo) {
    // 拆分特別篇
    for (let i = 0; i < splitInfo.count; i++) {
      overseasEpisodesArray.push({
        ...ep,
        id: overseasEpisodesArray.length + 1,
        episode: splitInfo.start + i,
      });
    }
  } else {
    // 普通集數
    overseasEpisodesArray.push({
      ...ep,
      id: overseasEpisodesArray.length + 1,
      episode: ep.overseas_ep,
    });
  }
});

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
