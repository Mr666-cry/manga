import { useState, useEffect, useCallback } from 'react';
import type { Manga, Chapter, ChapterImages } from '@/types/manga';
import { mangaDexApi } from '@/services/mangadexApi';

export function useLatestManga(limit: number = 20) {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        const data = await mangaDexApi.getLatestManga(limit);
        setManga(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch manga');
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [limit]);

  return { manga, loading, error };
}

export function usePopularManga(limit: number = 20) {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        const data = await mangaDexApi.getPopularManga(limit);
        setManga(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch manga');
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [limit]);

  return { manga, loading, error };
}

export function useMangaSearch(query: string) {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setManga([]);
      return;
    }
    try {
      setLoading(true);
      const data = await mangaDexApi.searchManga(searchQuery);
      setManga(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search manga');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  return { manga, loading, error, search };
}

export function useMangaDetail(mangaId: string) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [mangaData, chaptersData] = await Promise.all([
          mangaDexApi.getMangaById(mangaId),
          mangaDexApi.getMangaChapters(mangaId),
        ]);
        setManga(mangaData);
        setChapters(chaptersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch manga detail');
      } finally {
        setLoading(false);
      }
    };

    if (mangaId) {
      fetchDetail();
    }
  }, [mangaId]);

  return { manga, chapters, loading, error };
}

export function useChapterImages(chapterId: string) {
  const [images, setImages] = useState<ChapterImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await mangaDexApi.getChapterImages(chapterId);
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter images');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchImages();
    }
  }, [chapterId]);

  return { images, loading, error };
}
