import type { Manga } from '@/types/manga';
import { mangaDexApi } from '@/services/mangadexApi';
import { Badge } from '@/components/ui/badge';
import { Eye, Star } from 'lucide-react';

interface MangaCardProps {
  manga: Manga;
  onClick: () => void;
  featured?: boolean;
}

export function MangaCard({ manga, onClick, featured = false }: MangaCardProps) {
  const coverArt = manga.relationships.find((r) => r.type === 'cover_art');
  const coverUrl = coverArt?.attributes?.fileName
    ? mangaDexApi.getCoverUrl(manga.id, coverArt.attributes.fileName)
    : null;

  const title = manga.attributes.title.en ||
    manga.attributes.title['ja-ro'] ||
    Object.values(manga.attributes.title)[0] ||
    'Untitled';

  const description = manga.attributes.description?.en || '';

  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === 'genre')
    .slice(0, 3)
    .map((tag) => tag.attributes.name.en);

  const status = manga.attributes.status;
  const contentRating = manga.attributes.contentRating;

  if (featured) {
    return (
      <div
        onClick={onClick}
        className="manga-card group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20"
      >
        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="relative w-full md:w-72 h-80 md:h-96 flex-shrink-0 overflow-hidden">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="manga-cover w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-blue-800/20 flex items-center justify-center">
                <span className="text-blue-400/50 text-lg">No Cover</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <Badge className="bg-blue-500 text-white border-0">
                Featured
              </Badge>
              {contentRating !== 'safe' && (
                <Badge className="bg-red-500/80 text-white border-0">
                  {contentRating}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 text-xs"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base line-clamp-3 mb-4 max-w-xl">
              {description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {status === 'ongoing' ? 'Ongoing' : 'Completed'}
              </span>
              {manga.attributes.year && (
                <span>{manga.attributes.year}</span>
              )}
            </div>

            <button className="mt-6 w-fit px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 glow-blue flex items-center gap-2">
              <Star className="w-4 h-4" />
              Read Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="manga-card group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/10 mb-3">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="manga-cover w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-blue-400/30 text-sm">No Cover</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`text-xs border-0 ${
            status === 'ongoing'
              ? 'bg-green-500/80 text-white'
              : 'bg-blue-500/80 text-white'
          }`}>
            {status}
          </Badge>
        </div>

        {/* Content Rating */}
        {contentRating !== 'safe' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-500/80 text-white border-0 text-xs">
              {contentRating}
            </Badge>
          </div>
        )}

        {/* Hover Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-gray-300 line-clamp-2">
            {description || 'No description available'}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <div className="flex flex-wrap gap-1">
          {genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-xs text-gray-500"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
