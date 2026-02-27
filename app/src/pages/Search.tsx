import { useMangaSearch } from '@/hooks/useManga';
import { MangaGrid } from '@/components/MangaGrid';
import type { Manga } from '@/types/manga';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchProps {
  onMangaClick: (manga: Manga) => void;
  initialQuery?: string;
}

export function Search({ onMangaClick, initialQuery = '' }: SearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const { manga, loading, search } = useMangaSearch(query);

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Search <span className="gradient-text">Manga</span>
          </h1>

          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <Input
              type="text"
              placeholder="Search for manga titles, authors, or genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-12 bg-white/5 border-white/10 text-white text-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              autoFocus
            />
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Action', 'Romance', 'Fantasy', 'Comedy', 'Drama', 'Horror'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  search(tag);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-full text-sm text-gray-400 hover:text-blue-400 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="fade-in">
          {query && (
            <div className="mb-4">
              <p className="text-gray-500">
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    Found <span className="text-blue-400 font-medium">{manga.length}</span> results for "{query}"
                  </>
                )}
              </p>
            </div>
          )}

          <MangaGrid
            manga={manga}
            loading={loading}
            onMangaClick={onMangaClick}
            title={query ? 'Search Results' : 'Popular Manga'}
          />
        </div>
      </div>
    </div>
  );
}
