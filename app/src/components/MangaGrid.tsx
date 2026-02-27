import type { Manga } from '@/types/manga';
import { MangaCard } from './MangaCard';
import { Loader2 } from 'lucide-react';

interface MangaGridProps {
  manga: Manga[];
  loading: boolean;
  onMangaClick: (manga: Manga) => void;
  featured?: Manga | null;
  title?: string;
}

export function MangaGrid({
  manga,
  loading,
  onMangaClick,
  featured,
  title,
}: MangaGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (manga.length === 0 && !featured) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No manga found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Manga */}
      {featured && (
        <section className="fade-in">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Featured
          </h2>
          <MangaCard
            manga={featured}
            onClick={() => onMangaClick(featured)}
            featured
          />
        </section>
      )}

      {/* Manga Grid */}
      <section>
        {title && (
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 stagger-children">
          {manga.map((m) => (
            <MangaCard
              key={m.id}
              manga={m}
              onClick={() => onMangaClick(m)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
