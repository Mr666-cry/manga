export interface Manga {
  id: string;
  type: string;
  attributes: {
    title: {
      en?: string;
      ja?: string;
      'ja-ro'?: string;
    };
    altTitles?: Array<Record<string, string>>;
    description?: {
      en?: string;
    };
    status: string;
    year?: number;
    contentRating: string;
    tags: Tag[];
    lastChapter?: string;
    lastVolume?: string;
    availableTranslatedLanguages: string[];
    createdAt: string;
    updatedAt: string;
  };
  relationships: Relationship[];
}

export interface Tag {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
    group: string;
  };
}

export interface Relationship {
  id: string;
  type: string;
  attributes?: {
    fileName?: string;
    name?: string;
  };
}

export interface Chapter {
  id: string;
  type: string;
  attributes: {
    chapter: string;
    title: string | null;
    volume: string | null;
    translatedLanguage: string;
    pages: number;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
  };
  relationships: Relationship[];
}

export interface ChapterImages {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface MangaDetail extends Manga {
  chapters?: Chapter[];
}

export type ViewState = 'home' | 'manga-detail' | 'chapter-reader' | 'search';
