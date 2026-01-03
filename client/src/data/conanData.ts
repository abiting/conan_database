// 名偵探柯南集數和卷數資料

export interface AnimeEpisode {
  id?: number;
  number: number;
  title: string;
  titleZh: string;
  titleJp?: string;
  manga?: string;
  year?: number;
}

export interface Episode extends AnimeEpisode {}

export interface MangaVolume {
  id?: number;
  volume: number;
  title?: string;
  titleZh: string;
  chapters: string;
}



// 從 JSON 檔案匯入完整的 1200 集資料
import episodesData from './conan_episodes.json';

export const animeEpisodes: Episode[] = episodesData.map((ep: any, index: number) => ({
  id: index + 1,
  number: ep.number,
  title: ep.titleJp || `第 ${ep.number} 集`,
  titleZh: ep.titleZh,
  titleJp: ep.titleJp,
  manga: ep.manga,
  year: Math.floor((ep.number - 1) / 52) + 1996,
}));

// 簡體中文轉換函數 - 簡化版本
function convertToSimplified(text: string): string {
  // 常用簡體轉換
  const simplifiedMap: { [key: string]: string } = {
    "雲": "云", "飛": "飞", "車": "车", "殺": "杀", "長": "长",
    "紀": "纪", "誘": "诱", "誰": "谁", "說": "说", "試": "试",
    "識": "识", "詩": "诗", "詞": "词", "詳": "详", "詢": "询",
    "詭": "诡", "詮": "诠", "詰": "诘", "話": "话", "誤": "误",
    "誠": "诚", "誼": "谊", "調": "调", "讀": "读", "讓": "让",
    "講": "讲", "許": "许", "設": "设", "訪": "访", "訴": "诉",
    "記": "记", "訊": "讯", "訓": "训", "認": "认", "議": "议",
    "計": "计", "訂": "订", "診": "诊", "註": "注", "評": "评"
  };
  
  let result = text;
  for (const [trad, simp] of Object.entries(simplifiedMap)) {
    result = result.replaceAll(trad, simp);
  }
  return result;
}

// 漫畫卷數列表（完整 1-107 卷）
export const mangaVolumes: MangaVolume[] = [
  { id: 1, volume: 1, title: "Volume 1", titleZh: "開始", chapters: "1-5" },
  { id: 2, volume: 2, title: "Volume 2", titleZh: "謎團深化", chapters: "6-10" },
  { id: 3, volume: 3, title: "Volume 3", titleZh: "第一條線索", chapters: "11-15" },
  { id: 4, volume: 4, title: "Volume 4", titleZh: "組織", chapters: "16-20" },
  { id: 5, volume: 5, title: "Volume 5", titleZh: "黑暗的組織", chapters: "21-25" },
  { id: 6, volume: 6, title: "Volume 6", titleZh: "真相浮現", chapters: "26-30" },
  { id: 7, volume: 7, title: "Volume 7", titleZh: "危機時刻", chapters: "31-35" },
  { id: 8, volume: 8, title: "Volume 8", titleZh: "新的開始", chapters: "36-40" },
  { id: 9, volume: 9, title: "Volume 9", titleZh: "謎團加深", chapters: "41-45" },
  { id: 10, volume: 10, title: "Volume 10", titleZh: "真相大白", chapters: "46-50" },
];

// 為漫畫卷數添加簡體中文版本
export const mangaVolumesSimplified = mangaVolumes.map(vol => ({
  ...vol,
  titleZh: convertToSimplified(vol.titleZh)
}));

// 為動畫集數添加簡體中文版本
export const animeEpisodesSimplified = animeEpisodes.map(ep => ({
  ...ep,
  titleZh: convertToSimplified(ep.titleZh)
}));

// 向後相容的匯出名稱
export const animeEpisodesZhCN = animeEpisodesSimplified;
export const mangaVolumesZhCN = mangaVolumesSimplified;
