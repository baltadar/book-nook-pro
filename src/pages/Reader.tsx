import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getBookById, getBookUrl } from '@/lib/library';
import { getProgress, saveProgress } from '@/lib/storage';
import { useReaderTheme } from '@/hooks/use-reader-theme';
import { renderPdfPage } from '@/lib/pdf-utils';
import { ReaderSettings } from '@/components/ReaderSettings';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  enter: (d: number) => ({
    rotateY: d > 0 ? 40 : -40,
    x: d > 0 ? '15%' : '-15%',
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (d: number) => ({
    rotateY: d > 0 ? -40 : 40,
    x: d > 0 ? '-15%' : '15%',
    opacity: 0,
    scale: 0.95,
  }),
};

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const book = bookId ? getBookById(bookId) : null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [direction, setDirection] = useState(0);

  const { theme, setTheme, getCanvasFilter, getBgColor, getTextColor } = useReaderTheme();

  // Load saved progress
  useEffect(() => {
    if (!bookId) return;
    const progress = getProgress(bookId);
    if (progress) {
      setCurrentPage(progress.lastPage);
    }
  }, [bookId]);

  // Render current page
  const renderPage = useCallback(async (page: number) => {
    if (!book || !canvasRef.current) return;
    setLoading(true);
    try {
      const total = await renderPdfPage(getBookUrl(book), page, canvasRef.current, 2);
      setTotalPages(total);
      // Save progress
      saveProgress({ bookId: book.id, lastPage: page, totalPages: total, lastRead: Date.now() });
    } catch (err) {
      console.error('Failed to render page:', err);
    } finally {
      setLoading(false);
    }
  }, [book]);

  useEffect(() => {
    renderPage(currentPage);
  }, [currentPage, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, totalPages]);

  // Touch swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Book not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const progressPercent = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: getBgColor(), color: getTextColor() }}
    >
      {/* Top bar */}
      <AnimatePresence>
        {showControls && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: `${getBgColor()}ee` }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
              style={{ color: getTextColor() }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium line-clamp-1">{book.title}</span>
              <span className="text-[11px] opacity-60">
                {currentPage} / {totalPages}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="rounded-full"
              style={{ color: getTextColor() }}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-0.5">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: 'hsl(var(--primary))' }}
        />
      </div>

      {/* Canvas area */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden pt-14 pb-4"
        style={{ perspective: '1800px' }}
        onClick={() => setShowControls((s) => !s)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent opacity-30" />
          </div>
        )}

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 28,
              mass: 0.8,
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[calc(100vh-2rem)] max-w-full object-contain"
              style={{
                filter: getCanvasFilter(),
                backfaceVisibility: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                borderRadius: '4px',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Side nav buttons */}
        <AnimatePresence>
          {showControls && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                disabled={currentPage <= 1}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all hover:bg-black/10 disabled:opacity-20"
                style={{ color: getTextColor() }}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                disabled={currentPage >= totalPages}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all hover:bg-black/10 disabled:opacity-20"
                style={{ color: getTextColor() }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Settings overlay */}
      {showSettings && (
        <ReaderSettings
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Reader;
