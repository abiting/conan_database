import { Input } from '@/components/ui/input';
import { useAnimeSearch } from '@/hooks/useSearch';
import { animeEpisodes, animeEpisodesZhCN } from '@/data/conanData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';

export default function AnimeList() {
  const { isSimplified } = useLanguage();
  const episodes = isSimplified ? animeEpisodesZhCN : animeEpisodes;
  const { searchTerm, setSearchTerm, filteredEpisodes } = useAnimeSearch(episodes);

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

      <div className="text-sm text-muted-foreground">
        {isSimplified ? `共 ${filteredEpisodes.length} 集` : `共 ${filteredEpisodes.length} 集`}
      </div>

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
                    {isSimplified ? `第 ${ep.number} 集` : `第 ${ep.number} 集`}
                  </div>
                  <div className="text-sm text-foreground mt-1">
                    {ep.titleZh}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {ep.title}
                  </div>
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
