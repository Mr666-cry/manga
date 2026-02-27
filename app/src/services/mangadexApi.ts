import type { Manga, Chapter, ChapterImages } from '@/types/manga';

const BASE_URL = 'https://api.mangadex.org';
const COVER_URL = 'https://uploads.mangadex.org/covers';

class MangaDexAPI {
  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  getCoverUrl(mangaId: string, filename: string): string {
    return `${COVER_URL}/${mangaId}/${filename}`;
  }

  async getLatestManga(limit: number = 20, offset: number = 0): Promise<Manga[]> {
    const data = await this.fetch<{
      data: Manga[];
    }>(`/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&order[updatedAt]=desc&availableTranslatedLanguage[]=en`);
    return data.data;
  }

  async getPopularManga(limit: number = 20, offset: number = 0): Promise<Manga[]> {
    const data = await this.fetch<{
      data: Manga[];
    }>(`/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&order[followedCount]=desc&availableTranslatedLanguage[]=en`);
    return data.data;
  }

  async searchManga(query: string, limit: number = 20): Promise<Manga[]> {
    const data = await this.fetch<{
      data: Manga[];
    }>(`/manga?limit=${limit}&includes[]=cover_art&includes[]=author&title=${encodeURIComponent(query)}&availableTranslatedLanguage[]=en`);
    return data.data;
  }

  async getMangaById(mangaId: string): Promise<Manga> {
    const data = await this.fetch<{
      data: Manga;
    }>(`/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`);
    return data.data;
  }

  async getMangaChapters(mangaId: string, limit: number = 100): Promise<Chapter[]> {
    const data = await this.fetch<{
      data: Chapter[];
    }>(`/manga/${mangaId}/feed?limit=${limit}&translatedLanguage[]=en&order[chapter]=desc&includes[]=scanlation_group`);
    return data.data;
  }

  async getChapterImages(chapterId: string): Promise<ChapterImages> {
    const data = await this.fetch<ChapterImages>(`/at-home/server/${chapterId}`);
    return data;
  }

  getChapterPageUrl(baseUrl: string, hash: string, filename: string, quality: 'data' | 'data-saver' = 'data'): string {
    return `${baseUrl}/${quality}/${hash}/${filename}`;
  }
}

export const mangaDexApi = new MangaDexAPI();
