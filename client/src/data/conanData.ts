export interface AnimeEpisode {
  id?: number;
  episode?: number;
  title_ja?: string;
  title_zh?: string;
  manga?: string;
  year?: number;
  overseas_ep?: number;
}

export interface Episode extends AnimeEpisode {}

export interface MangaVolume {
  id?: number;
  volume: number;
  title?: string;
  titleZh: string;
  chapters: string;
}

// 從 JSON 檔案匯入完整集數資料
import episodesData from './conan_episodes.json';

// 簡體中文轉換函數 - 完整映射表（無重複鍵）
function convertToSimplified(text: string): string {
  const simplifiedMap: { [key: string]: string } = {
    // 常用簡體轉換
    "雲": "云", "飛": "飞", "車": "车", "殺": "杀", "長": "长",
    "紀": "纪", "誘": "诱", "誰": "谁", "說": "说", "試": "试",
    "識": "识", "詩": "诗", "詞": "词", "詳": "详", "詢": "询",
    "詭": "诡", "詮": "诠", "詰": "诘", "話": "话", "誤": "误",
    "誠": "诚", "誼": "谊", "調": "调", "讀": "读", "讓": "让",
    "講": "讲", "許": "许", "設": "设", "訪": "访", "訴": "诉",
    "記": "记", "訊": "讯", "訓": "训", "認": "认", "議": "议",
    "計": "计", "訂": "订", "診": "诊", "註": "注", "評": "评",
    "對": "对", "應": "应", "漫": "漫", "卷": "卷",
    "數": "数", "標": "标", "題": "题", "中": "中",
    "文": "文", "譯": "译", "名": "名", "日": "日", "本": "本",
    "動": "动", "原": "原", "創": "创", "無": "无",
    "版": "版", "海": "海", "外": "外", "官": "官",
    "方": "方", "篇": "篇", "第": "第",
    // 擴展詞彙
    "與": "与", "為": "为", "還": "还", "來": "来", "去": "去",
    "個": "个", "們": "们", "從": "从", "這": "这", "那": "那",
    "裡": "里", "點": "点", "種": "种", "樣": "样",
    "經": "经", "過": "过", "現": "现", "實": "实", "情": "情",
    "況": "况", "問": "问", "答": "答", "案": "案",
    "時": "时", "間": "间", "地": "地", "線": "线",
    "面": "面", "體": "体", "系": "系", "統": "统", "學": "学",
    "習": "习", "教": "教", "育": "育", "生": "生",
    "老": "老", "師": "师", "家": "家", "族": "族", "親": "亲",
    "戚": "戚", "朋": "朋", "友": "友", "愛": "爱",
    "婚": "婚", "姻": "姻", "夫": "夫", "妻": "妻", "兒": "儿",
    "女": "女", "兄": "兄", "弟": "弟", "姐": "姐", "妹": "妹",
    "爺": "爷", "奶": "奶", "叔": "叔",
    "嬸": "婶", "伯": "伯", "母": "母", "舅": "舅", "姨": "姨",
    "堂": "堂", "表": "表", "遠": "远", "近": "近",
    // 特殊術語
    "偵": "侦", "探": "探", "謎": "谜", "團": "团", "組": "组", "織": "织",
    "黑": "黑", "暗": "暗", "勢": "势", "力": "力", "犯": "犯",
    "罪": "罪", "嫌": "嫌", "疑": "疑", "人": "人", "證": "证",
    "據": "据", "索": "索", "真": "真", "相": "相",
    "大": "大", "白": "白", "解": "解",
    // 地點相關
    "街": "街", "道": "道", "路": "路", "巷": "巷", "弄": "弄",
    "樓": "楼", "棟": "栋", "房": "房", "屋": "屋", "室": "室",
    "廳": "厅", "廚": "厨", "浴": "浴", "衛": "卫",
    "客": "客", "餐": "餐",
    "書": "书", "臥": "卧",
    // 職業相關
    "醫": "医", "律": "律", "警": "警",
    "察": "察", "職": "职", "員": "员",
    "工": "工", "作": "作", "者": "者", "藝": "艺",
    "術": "术", "建": "建", "築": "筑",
    "機": "机", "械": "械", "電": "电",
    "程": "程", "式": "式",
    "分": "分", "析": "析",
    "會": "会", "財": "财", "務": "务",
    "銷": "销", "售": "售",
    "市": "市", "場": "场", "營": "营",
  };
  
  let result = text;
  for (const [trad, simp] of Object.entries(simplifiedMap)) {
    result = result.replaceAll(trad, simp);
  }
  return result;
}

// 處理官方版集數資料
export const animeEpisodes: Episode[] = episodesData.map((ep: any, index: number) => ({
  id: index + 1,
  episode: parseInt(ep.episode, 10),
  title_ja: ep.title_ja,
  title_zh: ep.title_zh,
  manga: ep.manga || '無',
  year: parseInt(ep.year, 10),
  overseas_ep: ep.overseas_ep ? parseInt(ep.overseas_ep, 10) : undefined,
}));

// 海外版集數資料（使用 overseas_ep 作為集數號）
export const overseasEpisodes: Episode[] = animeEpisodes
  .filter(ep => ep.overseas_ep && ep.overseas_ep > 0)
  .map((ep, index) => ({
    ...ep,
    id: index + 1,
    episode: ep.overseas_ep,  // 使用海外版集數（1-1244）
  })) as Episode[];

// 驗證海外版集數數量
const overseasCount = overseasEpisodes.length;

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

// 向後相容的匯出名稱
export const animeEpisodesZhCN = animeEpisodesSimplified;
export const overseasEpisodesZhCN = overseasEpisodesSimplified;

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

// 漫畫卷數簡體中文版本
export const mangaVolumesZhCN = mangaVolumes.map(vol => ({
  ...vol,
  titleZh: convertToSimplified(vol.titleZh),
}));
