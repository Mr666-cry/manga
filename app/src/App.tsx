import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { MangaDetail } from '@/pages/MangaDetail';
import { ChapterReader } from '@/pages/ChapterReader';
import { Search } from '@/pages/Search';
import type { Manga, Chapter, ViewState } from '@/types/manga';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMangaClick = useCallback((manga: Manga) => {
    setSelectedManga(manga);
    setView('manga-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChapterClick = useCallback((chapter: Chapter, allChapters: Chapter[]) => {
    setSelectedChapter(chapter);
    setChapters(allChapters);
    setView('chapter-reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChapterChange = useCallback((chapter: Chapter) => {
    setSelectedChapter(chapter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    if (view === 'chapter-reader') {
      setView('manga-detail');
    } else if (view === 'manga-detail') {
      setView('home');
      setSelectedManga(null);
    } else if (view === 'search') {
      setView('home');
    }
  }, [view]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setView('search');
  }, []);

  const handleViewChange = useCallback((newView: string) => {
    if (newView === 'home' || newView === 'popular' || newView === 'latest') {
      setView('home');
    } else {
      setView(newView as ViewState);
    }
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'manga-detail':
        return selectedManga ? (
          <MangaDetail
            manga={selectedManga}
            onBack={handleBack}
            onChapterClick={handleChapterClick}
          />
        ) : null;

      case 'chapter-reader':
        return selectedChapter && selectedManga ? (
          <ChapterReader
            chapter={selectedChapter}
            chapters={chapters}
            mangaTitle={selectedManga.attributes.title.en ||
              selectedManga.attributes.title['ja-ro'] ||
              Object.values(selectedManga.attributes.title)[0] ||
              'Untitled'}
            onBack={handleBack}
            onChapterChange={handleChapterChange}
          />
        ) : null;

      case 'search':
        return (
          <Search
            onMangaClick={handleMangaClick}
            initialQuery={searchQuery}
          />
        );

      case 'home':
      default:
        return <Home onMangaClick={handleMangaClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {view !== 'chapter-reader' && (
        <Header
          currentView={view}
          onViewChange={handleViewChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      <main className="animate-in fade-in duration-300">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
