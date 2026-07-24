import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAnimeSearch } from '@/hooks/useSearch';
import { animeEpisodes, overseasEpisodes } from '@/data/conanData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { Search, Star } from 'lucide-react';

interface AnimeListProps {
  version?: 'official' | 'overseas';
}

// 優化的集數卡片組件
interface EpisodeCardProps {
  ep: any;
  version: 'official' | 'overseas';
  isSimplified: boolean;
  favorited: boolean;
  onToggleFavorite: (id: string) => void;
}

const EpisodeCard = memo(({ ep, version, isSimplified, favorited, onToggleFavorite }: EpisodeCardProps) => {
  const episodeId = String(ep.id);
  
  return (
    <div className="p-3 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {version === 'official'
              ? ep.is_special
                ? ep.episode  // 特別篇：直接顯示標籤（如「光之美少女特別篇」）
                : `第 ${ep.episode} 集`
              : `第 ${ep.overseas_ep?.toString() || ep.episode.toString()} 集`
            }
          </div>
          <div className="text-sm text-foreground mt-1">
            {ep.title_zh.replace(/！ \n/g, '！').replace(/\n/g, '')}
          </div>
          {ep.title_ja && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {ep.title_ja}
            </div>
          )}
          {ep.manga && (
            <div className="text-xs text-muted-foreground mt-2">
              {isSimplified ? "对应漫画" : "對應漫畫"}：{ep.manga}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {ep.year}
          </div>
          <button
            onClick={() => onToggleFavorite(episodeId)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            title="加入最愛"
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

export default function AnimeList({ version = 'official' }: AnimeListProps) {
  const { isSimplified } = useLanguage();
  const { toggleFavorite, isFavorite, favorites } = useFavoritesContext();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const episodesData = useMemo(() => version === 'official' 
    ? animeEpisodes
    : overseasEpisodes, [version]);
  const { searchTerm, setSearchTerm: updateSearchTerm, filteredEpisodes } = useAnimeSearch(episodesData);
  
  const setSearchTerm = updateSearchTerm;

  // 當版本改變時，重置搜尋狀態
  useEffect(() => {
    setSearchTerm('');
  }, [version, setSearchTerm]);

  // 根據最愛篩選進一步過濾結果
  const displayedEpisodes = useMemo(() => {
    if (!showOnlyFavorites) {
      return filteredEpisodes;
    }
    return filteredEpisodes.filter((ep) => isFavorite(String(ep.id)));
  }, [filteredEpisodes, showOnlyFavorites, favorites]);

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
          {version === 'official' && (
            <>
              共 {episodesData.length} 集
              {showOnlyFavorites && ` · 最愛 ${displayedEpisodes.length} 集`}
            </>
          )}
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

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {displayedEpisodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {showOnlyFavorites 
              ? "還沒有加入最愛的集數"
              : (isSimplified ? "未找到匹配的集数" : "未找到匹配的集數")
            }
          </div>
        ) : (
          displayedEpisodes.map((ep) => {
            const episodeId = String(ep.id);
            const favorited = isFavorite(episodeId);
            return (
              <EpisodeCard
                key={ep.id}
                ep={ep}
                version={version}
                isSimplified={isSimplified}
                favorited={favorited}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
