// 名偵探柯南集數資料
// 包含動畫和漫畫的基本資訊

export interface AnimeEpisode {
  id: number;
  number: number;
  title: string;
  titleZh: string;
  year: number;
}

export interface MangaVolume {
  id: number;
  volume: number;
  title: string;
  titleZh: string;
  chapters: string; // 例如 "1-5" 或 "1, 3, 5"
}

// 動畫集數列表（部分代表性集數）
export const animeEpisodes: AnimeEpisode[] = [
  // 1996-1997
  { id: 1, number: 1, title: "Roller Coaster Murder Case", titleZh: "雲霄飛車殺人事件", year: 1996 },
  { id: 2, number: 2, title: "President's Daughter Kidnapping Case", titleZh: "董事長千金綁架事件", year: 1996 },
  { id: 3, number: 3, title: "An Idol's Locked Room Murder Case", titleZh: "偶像密室殺人事件", year: 1996 },
  { id: 4, number: 4, title: "The Coded Map of the City", titleZh: "大都會暗號地圖事件", year: 1996 },
  { id: 5, number: 5, title: "The Shinkansen's Bomb Case", titleZh: "新幹線大爆破事件", year: 1996 },
  { id: 6, number: 6, title: "Valentine Murder Case", titleZh: "情人節殺人事件", year: 1996 },
  { id: 7, number: 7, title: "Once-A-Month Present Threat Case", titleZh: "每月一次的威脅事件", year: 1996 },
  { id: 8, number: 8, title: "Art Museum Owner Murder Case", titleZh: "美術館老闆娘殺人事件", year: 1996 },
  { id: 9, number: 9, title: "The Diplomat's Assassination Case", titleZh: "外交官殺人事件", year: 1996 },
  { id: 10, number: 10, title: "The Moonlight Sonata Murder Case", titleZh: "月光奏鳴曲殺人事件", year: 1996 },
  
  // 1998-1999
  { id: 51, number: 51, title: "Karaoke Box Murder Case", titleZh: "卡拉OK包廂殺人事件", year: 1998 },
  { id: 52, number: 52, title: "The Hateful Karate Tournament Case", titleZh: "可恨的空手道大賽事件", year: 1998 },
  { id: 53, number: 53, title: "The Bloody Valentines", titleZh: "血色情人節", year: 1998 },
  
  // 2000-2001
  { id: 101, number: 101, title: "The Hatchet Man Murder Case", titleZh: "斧頭殺人事件", year: 2000 },
  { id: 102, number: 102, title: "The Mysterious Traveler Murder Case", titleZh: "神秘旅人殺人事件", year: 2000 },
  
  // 2010-2011
  { id: 501, number: 501, title: "The Scarlet Alibi", titleZh: "緋色的不在場證明", year: 2010 },
  { id: 502, number: 502, title: "The Scarlet Return", titleZh: "緋色的歸來", year: 2010 },
  
  // 最新集數
  { id: 901, number: 901, title: "The Chaotic Key Moment", titleZh: "混沌的關鍵時刻", year: 2024 },
  { id: 902, number: 902, title: "Visitor from Chaos", titleZh: "來自混沌的來訪者", year: 2024 },
];

// 漫畫卷數列表（部分代表性卷數）
export const mangaVolumes: MangaVolume[] = [
  { id: 1, volume: 1, title: "The Beginning", titleZh: "開始", chapters: "1-5" },
  { id: 2, volume: 2, title: "The Mystery Deepens", titleZh: "謎團深化", chapters: "6-10" },
  { id: 3, volume: 3, title: "The First Clue", titleZh: "第一條線索", chapters: "11-15" },
  { id: 4, volume: 4, title: "The Organization", titleZh: "組織", chapters: "16-20" },
  { id: 5, volume: 5, title: "The Scarlet Truth", titleZh: "緋色的真相", chapters: "21-25" },
  { id: 6, volume: 6, title: "The Detective's Secret", titleZh: "名偵探的秘密", chapters: "26-30" },
  { id: 7, volume: 7, title: "The Kid's Identity", titleZh: "怪盜基德的身份", chapters: "31-35" },
  { id: 8, volume: 8, title: "The Phantom Thief", titleZh: "幻影怪盜", chapters: "36-40" },
  { id: 9, volume: 9, title: "The Betrayal", titleZh: "背叛", chapters: "41-45" },
  { id: 10, volume: 10, title: "The Truth Revealed", titleZh: "真相大白", chapters: "46-50" },
  
  // 中期卷數
  { id: 51, volume: 51, title: "The Chaos Begins", titleZh: "混沌開始", chapters: "451-455" },
  { id: 52, volume: 52, title: "The Dark Organization", titleZh: "黑暗組織", chapters: "456-460" },
  { id: 53, volume: 53, title: "The Final Battle", titleZh: "最終決戰", chapters: "461-465" },
  
  // 最新卷數
  { id: 101, volume: 101, title: "The New Beginning", titleZh: "新的開始", chapters: "951-955" },
  { id: 102, volume: 102, title: "The Chaos Key", titleZh: "混沌的關鍵", chapters: "956-960" },
  { id: 103, volume: 103, title: "The Truth of Chaos", titleZh: "混沌的真相", chapters: "961-965" },
  { id: 104, volume: 104, title: "The Ring and Hot Spring", titleZh: "戒指與溫泉", chapters: "966-970" },
  { id: 105, volume: 105, title: "The Direction of the Ring", titleZh: "戒指的去向", chapters: "971-975" },
  { id: 106, volume: 106, title: "The Dangerous Photograph", titleZh: "危險的照片", chapters: "976-980" },
  { id: 107, volume: 107, title: "The Truth in the Photograph", titleZh: "照片中的真相", chapters: "981-985" },
];

// 簡體中文翻譯對照表
const simplifiedMapping: Record<string, string> = {
  "雲": "云",
  "飛": "飞",
  "車": "车",
  "殺": "杀",
  "董": "董",
  "長": "长",
  "綁": "绑",
  "偶": "偶",
  "密": "密",
  "室": "室",
  "都": "都",
  "會": "会",
  "暗": "暗",
  "號": "号",
  "圖": "图",
  "幹": "干",
  "線": "线",
  "爆": "爆",
  "破": "破",
  "節": "节",
  "脅": "胁",
  "術": "术",
  "館": "馆",
  "闆": "板",
  "交": "交",
  "鳴": "鸣",
  "廂": "厢",
  "賽": "赛",
  "血": "血",
  "場": "场",
  "證": "证",
  "歸": "归",
  "來": "来",
  "混": "混",
  "沌": "沌",
  "關": "关",
  "鍵": "键",
  "時": "时",
  "刻": "刻",
  "訪": "访",
  "開": "开",
  "始": "始",
  "謎": "谜",
  "團": "团",
  "深": "深",
  "化": "化",
  "條": "条",
  "索": "索",
  "組": "组",
  "織": "织",
  "緋": "绯",
  "色": "色",
  "真": "真",
  "相": "相",
  "偵": "侦",
  "探": "探",
  "秘": "秘",
  "怪": "怪",
  "盜": "盗",
  "基": "基",
  "德": "德",
  "身": "身",
  "份": "份",
  "幻": "幻",
  "影": "影",
  "背": "背",
  "叛": "叛",
  "白": "白",
  "最": "最",
  "終": "终",
  "決": "决",
  "戰": "战",
  "戒": "戒",
  "指": "指",
  "溫": "温",
  "泉": "泉",
  "去": "去",
  "向": "向",
  "危": "危",
  "險": "险",
  "照": "照",
  "片": "片",
  "中": "中",
};

// 簡單的繁體轉簡體轉換函數
function convertToSimplified(text: string): string {
  return text.split("").map(char => simplifiedMapping[char] || char).join("");
}

// 簡體中文翻譯版本
export const animeEpisodesZhCN = animeEpisodes.map(ep => ({
  ...ep,
  titleZh: convertToSimplified(ep.titleZh),
}));

export const mangaVolumesZhCN = mangaVolumes.map(vol => ({
  ...vol,
  titleZh: convertToSimplified(vol.titleZh),
}));
