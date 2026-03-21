import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { spyFamilyEpisodes } from '@/data/spyFamilyData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { Search, Star } from 'lucide-react';

const ITEM_HEIGHT = 130; // 每個集數卡片的高度（像素）
const CONTAINER_HEIGHT = 600; // 容器高度（與 max-h-[600px] 對應）

// 優化的集數卡片組件
interface EpisodeCardProps {
  ep: any;
  isSimplified: boolean;
  favorited: boolean;
  onToggleFavorite: (id: string) => void;
}

const EpisodeCard = memo(({ ep, isSimplified, favorited, onToggleFavorite }: EpisodeCardProps) => {
  const episodeId = String(ep.id);
  
  // 判斷季數
  const getSeason = (episodeNum: number) => {
    if (episodeNum <= 25) return 1;
    if (episodeNum <= 37) return 2;
    return 3;
  };
  
  const season = getSeason(ep.episode);
  const seasonText = season === 1 ? '第一季' : season === 2 ? '第二季' : '第三季';
  
  return (
    <div className="p-3 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold text-sm">
            第 {ep.episode} 集
          </div>
          <div className="text-sm text-foreground mt-1">
            {ep.title_zh.replace(/！ \n/g, '！').replace(/\n/g, '')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {ep.title_ja.replace(/！ \n/g, '！').replace(/\n/g, '')}
          </div>
          {ep.chapters && (
            <div className="text-xs text-muted-foreground mt-2">
              {isSimplified ? "漫画话数" : "漫畫話數"}：{ep.chapters}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {seasonText}
          </div>
          <button
            onClick={() => onToggleFavorite(episodeId)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            title={isSimplified ? "加入最愛" : "加入最愛"}
          >
            <Star
              size={18}
              className={`transition-all ${
                favorited
                  ? 'fill-purple-400 text-purple-400'
                  : 'text-muted-foreground hover:text-purple-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
});

EpisodeCard.displayName = 'EpisodeCard';

export default function SpyFamilyList() {
  const { isSimplified } = useLanguage();
  const { toggleFavorite, isFavorite, favorites } = useFavoritesContext();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const episodesData = useMemo(() => spyFamilyEpisodes, []);

  // 簡單的搜尋過濾
  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return episodesData;
    }
    
    const term = searchTerm.toLowerCase();
    return episodesData.filter((ep: any) => {
      const episodeStr = String(ep.episode).toLowerCase();
      const titleZh = ep.title_zh.toLowerCase();
      const titleJa = ep.title_ja.toLowerCase();
      
      return (
        episodeStr.includes(term) ||
        titleZh.includes(term) ||
        titleJa.includes(term)
      );
    });
  }, [episodesData, searchTerm]);

  // 根據最愛篩選進一步過濾結果
  const displayedEpisodes = useMemo(() => {
    if (!showOnlyFavorites) {
      return filteredEpisodes;
    }
    return filteredEpisodes.filter((ep: any) => isFavorite(String(ep.id)));
  }, [filteredEpisodes, showOnlyFavorites, favorites]);

  // 虛擬滾動計算
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2; // 多渲染 2 個以避免閃爍
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 1);
  const endIndex = Math.min(displayedEpisodes.length, startIndex + visibleCount);
  const visibleEpisodes = useMemo(() => 
    displayedEpisodes.slice(startIndex, endIndex),
    [displayedEpisodes, startIndex, endIndex]
  );
  const offsetY = startIndex * ITEM_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleToggleFavorite = useCallback((episodeId: string) => {
    toggleFavorite(episodeId);
  }, [toggleFavorite]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={isSimplified ? "搜索集数、标题..." : "搜尋集數、標題..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          共 {episodesData.length} 集
          {showOnlyFavorites && ` · 最愛 ${displayedEpisodes.length} 集`}
        </div>
        <Button
          variant={showOnlyFavorites ? "default" : "outline"}
          size="sm"
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className="gap-1"
        >
          <Star size={16} className={showOnlyFavorites ? 'fill-white text-white' : 'fill-purple-400 text-purple-400'} />
          {isSimplified ? "我的最愛" : "我的最愛"}
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="space-y-2 max-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {displayedEpisodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {showOnlyFavorites 
              ? (isSimplified ? "還沒有加入最愛的集數" : "還沒有加入最愛的集數")
              : (isSimplified ? "未找到匹配的集数" : "未找到匹配的集數")
            }
          </div>
        ) : (
          <>
            {/* 頂部占位符 */}
            <div style={{ height: offsetY }} />
            
            {/* 可見項目 */}
            {visibleEpisodes.map((ep: any) => {
              const episodeId = String(ep.id);
              const favorited = isFavorite(episodeId);
              return (
                <EpisodeCard
                  key={ep.id}
                  ep={ep}
                  isSimplified={isSimplified}
                  favorited={favorited}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
            
            {/* 底部占位符 */}
            <div style={{ height: Math.max(0, (displayedEpisodes.length - endIndex) * ITEM_HEIGHT) }} />
          </>
        )}
      </div>
    </div>
  );
}
