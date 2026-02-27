import { useLatestManga, usePopularManga } from '@/hooks/useManga';
import { MangaGrid } from '@/components/MangaGrid';
import type { Manga } from '@/types/manga';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

interface HomeProps {
  onMangaClick: (manga: Manga) => void;
}

export function Home({ onMangaClick }: HomeProps) {
  const { manga: latestManga, loading: latestLoading } = useLatestManga(24);
  const { manga: popularManga, loading: popularLoading } = usePopularManga(24);

  const featuredManga = latestManga[0] || null;
  const regularManga = latestManga.slice(1);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-10 fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-black border border-blue-500/20 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Discover Your Next{' '}
                <span className="gradient-text">Adventure</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-6">
                Read thousands of manga chapters for free. From action-packed shonen to heartwarming slice-of-life.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">
                  90,000+ Manga
                </span>
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">
                  Free to Read
                </span>
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">
                  Daily Updates
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="w-full md:w-auto bg-white/5 border border-white/10 p-1 mb-6">
            <TabsTrigger
              value="latest"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Latest Updates
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-0">
            <MangaGrid
              manga={regularManga}
              loading={latestLoading}
              onMangaClick={onMangaClick}
              featured={featuredManga}
              title="Recently Updated"
            />
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <MangaGrid
              manga={popularManga}
              loading={popularLoading}
              onMangaClick={onMangaClick}
              title="Most Popular"
            />
          </TabsContent>

          <TabsContent value="featured" className="mt-0">
            <MangaGrid
              manga={latestManga.slice(0, 12)}
              loading={latestLoading}
              onMangaClick={onMangaClick}
              featured={featuredManga}
              title="Editor's Pick"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
