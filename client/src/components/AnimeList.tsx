import { useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAnimeSearch } from '@/hooks/useSearch';
import { animeEpisodes, overseasEpisodes } from '@/data/conanData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';
import { formatCompositeEpisode } from '@/lib/episodeParser';

interface AnimeListProps {
  version?: 'official' | 'overseas';
}

export default function AnimeList({ version = 'official' }: AnimeListProps) {
  const { isSimplified } = useLanguage();
  const episodesData = useMemo(() => version === 'official' 
    ? animeEpisodes
    : overseasEpisodes, [version]);
  const { searchTerm, setSearchTerm: updateSearchTerm, filteredEpisodes } = useAnimeSearch(episodesData);
  
  // 使用穩定的 setter 引用
  const setSearchTerm = updateSearchTerm;

  // 當版本改變時，重置搜尋狀態
  useEffect(() => {
    setSearchTerm('');
  }, [version]);

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

      {version === 'official' && (
        <div className="text-sm text-muted-foreground">
          共 {episodesData.length} 集
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredEpisodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isSimplified ? "未找到匹配的集数" : "未找到匹配的集數"}
          </div>
        ) : (
          filteredEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {version === 'official'
                      ? `第 ${ep.episode} 集`
                      : `第 ${formatCompositeEpisode(ep.overseas_ep?.toString() || ep.episode.toString()).replace(/^第 /, '').replace(/ 集$/, '')} 集`
                    }
                  </div>
                  <div className="text-sm text-foreground mt-1">
                    {ep.title_zh}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {ep.title_ja}
                  </div>
                  {ep.manga && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {isSimplified ? "对应漫画" : "對應漫畫"}：{ep.manga}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {ep.year}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
