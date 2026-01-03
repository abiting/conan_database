import { useMemo, useState } from 'react';
import { AnimeEpisode, MangaVolume } from '@/data/conanData';

export function useAnimeSearch(episodes: AnimeEpisode[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return episodes;
    }

    const term = searchTerm.toLowerCase();
    return episodes.filter(ep => {
      const numberStr = ep.episode?.toString() || '';
      const titleMatch = (ep.title_ja || '').toLowerCase().includes(term);
      const titleZhMatch = (ep.title_zh || '').toLowerCase().includes(term);
      const numberMatch = numberStr.includes(term);
      
      return titleMatch || titleZhMatch || numberMatch;
    });
  }, [episodes, searchTerm]);

  return { searchTerm, setSearchTerm, filteredEpisodes };
}

export function useMangaSearch(volumes: MangaVolume[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVolumes = useMemo(() => {
    if (!searchTerm.trim()) {
      return volumes;
    }

    const term = searchTerm.toLowerCase();
    return volumes.filter(vol => {
      const volumeStr = vol.volume.toString();
      const titleMatch = vol.title?.toLowerCase().includes(term) ?? false;
      const titleZhMatch = vol.titleZh.toLowerCase().includes(term);
      const volumeMatch = volumeStr.includes(term);
      const chaptersMatch = vol.chapters.includes(term);
      
      return titleMatch || titleZhMatch || volumeMatch || chaptersMatch;
    });
  }, [volumes, searchTerm]);

  return { searchTerm, setSearchTerm, filteredVolumes };
}
