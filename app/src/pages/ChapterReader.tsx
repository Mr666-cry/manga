import { useChapterImages } from '@/hooks/useManga';
import type { Chapter } from '@/types/manga';
import { mangaDexApi } from '@/services/mangadexApi';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Maximize,
  Minimize,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChapterReaderProps {
  chapter: Chapter;
  chapters: Chapter[];
  mangaTitle: string;
  onBack: () => void;
  onChapterChange: (chapter: Chapter) => void;
}

export function ChapterReader({
  chapter,
  chapters,
  mangaTitle,
  onBack,
  onChapterChange,
}: ChapterReaderProps) {
  const { images, loading, error } = useChapterImages(chapter.id);
  const [currentPage, setCurrentPage] = useState(0);
  const [quality, setQuality] = useState<'data' | 'data-saver'>('data');
  const [fullscreen, setFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  const currentIndex = chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  const pageUrls = images?.chapter.data.map((filename) =>
    mangaDexApi.getChapterPageUrl(images.baseUrl, images.chapter.hash, filename, quality)
  ) || [];

  const totalPages = pageUrls.length;

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (prevChapter) {
      onChapterChange(prevChapter);
    }
  }, [currentPage, prevChapter, onChapterChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nextChapter) {
      onChapterChange(nextChapter);
    }
  }, [currentPage, totalPages, nextChapter, onChapterChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'Escape') {
        if (fullscreen) {
          setFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPage, handleNextPage, fullscreen]);

  // Reset page when chapter changes
  useEffect(() => {
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load chapter</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
          showToolbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-sm font-medium text-white line-clamp-1">{mangaTitle}</h2>
                <p className="text-xs text-gray-500">
                  Ch. {chapter.attributes.chapter || '-'}
                  {chapter.attributes.title && ` - ${chapter.attributes.title}`}
                </p>
              </div>
            </div>

            {/* Center - Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0 && !prevChapter}
                className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm text-gray-400 min-w-[80px] text-center">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1 && !nextChapter}
                className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Right - Settings */}
            <div className="flex items-center gap-2">
              {/* Chapter Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-auto bg-gray-900 border-white/10">
                  {chapters.map((ch) => (
                    <DropdownMenuItem
                      key={ch.id}
                      onClick={() => onChapterChange(ch)}
                      className={`${
                        ch.id === chapter.id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Ch. {ch.attributes.chapter || '-'} {ch.attributes.title || ''}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quality Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
                  <DropdownMenuItem
                    onClick={() => setQuality('data')}
                    className={quality === 'data' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}
                  >
                    High Quality
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setQuality('data-saver')}
                    className={quality === 'data-saver' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}
                  >
                    Data Saver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {fullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {pageUrls.length > 0 && (
            <div className="space-y-4">
              {/* Current Page */}
              <div
                className="relative bg-gray-900 rounded-lg overflow-hidden"
                onClick={() => setShowToolbar(!showToolbar)}
              >
                <img
                  src={pageUrls[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>

              {/* Page Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 && !prevChapter}
                  variant="outline"
                  className="flex-1 border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1 && !nextChapter}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* All Pages (for scrolling) */}
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-500 mb-4">All Pages</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {pageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(index);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentPage
                          ? 'border-blue-500'
                          : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
          showToolbar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            {prevChapter && (
              <Button
                onClick={() => onChapterChange(prevChapter)}
                variant="outline"
                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Prev Chapter
              </Button>
            )}
            <span className="text-sm text-gray-500">
              Chapter {chapter.attributes.chapter || '-'}
            </span>
            {nextChapter && (
              <Button
                onClick={() => onChapterChange(nextChapter)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next Chapter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
