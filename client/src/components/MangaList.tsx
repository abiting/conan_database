import { useMemo, useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMangaSearch } from '@/hooks/useSearch';
import { mangaVolumes, mangaVolumesZhCN } from '@/data/conanData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { Search, Star } from 'lucide-react';

const ITEM_HEIGHT = 130; // 每個卷的高度（像素）
const CONTAINER_HEIGHT = 600; // 容器高度（與 max-h-[600px] 對應）

export default function MangaList() {
  const { isSimplified } = useLanguage();
  const { toggleFavorite, isFavorite, favorites } = useFavoritesContext();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const volumes = isSimplified ? mangaVolumesZhCN : mangaVolumes;
  const { searchTerm, setSearchTerm, filteredVolumes } = useMangaSearch(volumes);

  // 根據最愛篩選進一步過濾結果
  const displayedVolumes = useMemo(() => {
    if (!showOnlyFavorites) {
      return filteredVolumes;
    }
    return filteredVolumes.filter((vol) => isFavorite(String(vol.id)));
  }, [filteredVolumes, showOnlyFavorites, favorites]);

  // 虛擬滾動計算
  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 1);
  const endIndex = Math.min(displayedVolumes.length, startIndex + visibleCount);
  const visibleVolumes = displayedVolumes.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={isSimplified ? "搜索卷数、标题..." : "搜尋卷數、標題..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {isSimplified ? `共 ${filteredVolumes.length} 卷` : `共 ${filteredVolumes.length} 卷`}
          {showOnlyFavorites && ` · 最愛 ${displayedVolumes.length} 卷`}
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
        {displayedVolumes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {showOnlyFavorites 
              ? (isSimplified ? "還沒有加入最愛的卷數" : "還沒有加入最愛的卷數")
              : (isSimplified ? "未找到匹配的卷数" : "未找到匹配的卷數")
            }
          </div>
        ) : (
          <>
            {/* 頂部占位符 */}
            <div style={{ height: offsetY }} />
            
            {/* 可見項目 */}
            {visibleVolumes.map((vol) => {
              const volumeId = String(vol.id);
              const favorited = isFavorite(volumeId);
              return (
              <div
                key={vol.id}
                className="p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {isSimplified ? `第 ${vol.volume} 卷` : `第 ${vol.volume} 卷`}
                    </div>
                    <div className="text-sm text-foreground mt-1">
                      {vol.titleZh}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {vol.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {isSimplified ? `话数: ${vol.chapters}` : `話數: ${vol.chapters}`}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(volumeId)}
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
            );
            })}
            
            {/* 底部占位符 */}
            <div style={{ height: Math.max(0, (displayedVolumes.length - endIndex) * ITEM_HEIGHT) }} />
          </>
        )}
      </div>
    </div>
  );
}
