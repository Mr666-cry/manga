import { useMangaDetail } from '@/hooks/useManga';
import type { Manga, Chapter } from '@/types/manga';
import { mangaDexApi } from '@/services/mangadexApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  Tag,
  Eye,
  Clock,
  ChevronRight,
  Star,
} from 'lucide-react';

interface MangaDetailProps {
  manga: Manga;
  onBack: () => void;
  onChapterClick: (chapter: Chapter, chapters: Chapter[]) => void;
}

export function MangaDetail({ manga, onBack, onChapterClick }: MangaDetailProps) {
  const { chapters, loading } = useMangaDetail(manga.id);

  const coverArt = manga.relationships.find((r) => r.type === 'cover_art');
  const coverUrl = coverArt?.attributes?.fileName
    ? mangaDexApi.getCoverUrl(manga.id, coverArt.attributes.fileName)
    : null;

  const author = manga.relationships.find((r) => r.type === 'author');
  const artist = manga.relationships.find((r) => r.type === 'artist');

  const title = manga.attributes.title.en ||
    manga.attributes.title['ja-ro'] ||
    Object.values(manga.attributes.title)[0] ||
    'Untitled';

  const description = manga.attributes.description?.en || 'No description available.';

  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === 'genre')
    .map((tag) => tag.attributes.name.en);

  const themes = manga.attributes.tags
    .filter((tag) => tag.attributes.group === 'theme')
    .map((tag) => tag.attributes.name.en);

  const format = manga.attributes.tags
    .filter((tag) => tag.attributes.group === 'format')
    .map((tag) => tag.attributes.name.en);

  const latestChapter = chapters[0];
  const firstChapter = chapters[chapters.length - 1];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cover & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Cover */}
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/30 to-blue-800/20 mb-6 glow-blue">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-blue-400/50">No Cover</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3">
                {firstChapter && (
                  <Button
                    onClick={() => onChapterClick(firstChapter, chapters)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white glow-blue"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read First Chapter
                  </Button>
                )}
                {latestChapter && latestChapter.id !== firstChapter?.id && (
                  <Button
                    onClick={() => onChapterClick(latestChapter, chapters)}
                    variant="outline"
                    className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Read Latest
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div className="fade-in">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${
                  manga.attributes.status === 'ongoing'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {manga.attributes.status}
                </Badge>
                {manga.attributes.contentRating !== 'safe' && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {manga.attributes.contentRating}
                  </Badge>
                )}
                {manga.attributes.year && (
                  <Badge variant="outline" className="border-white/10 text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {manga.attributes.year}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {title}
              </h1>

              {/* Authors */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                {author && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {author.attributes?.name || 'Unknown'}
                  </span>
                )}
                {artist && artist.id !== author?.id && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {artist.attributes?.name || 'Unknown'}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 fade-in">
              <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-4 fade-in">
              {genres.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 cursor-pointer"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {themes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => (
                      <Badge
                        key={theme}
                        variant="outline"
                        className="border-white/10 text-gray-400"
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {format.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Format</h4>
                  <div className="flex flex-wrap gap-2">
                    {format.map((f) => (
                      <Badge
                        key={f}
                        variant="outline"
                        className="border-white/10 text-gray-400"
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapters */}
            <div className="fade-in">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Chapters
                <span className="text-sm font-normal text-gray-500">
                  ({chapters.length})
                </span>
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : chapters.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-xl">
                  <p className="text-gray-500">No chapters available</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] rounded-xl border border-white/5">
                  <div className="p-2 space-y-1">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => onChapterClick(chapter, chapters)}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500 w-12">
                            Ch. {chapter.attributes.chapter || '-'}
                          </span>
                          <div className="text-left">
                            <p className="text-sm text-white group-hover:text-blue-400 transition-colors">
                              {chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(chapter.attributes.readableAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
