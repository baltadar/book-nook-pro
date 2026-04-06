import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { getLibrary } from '@/lib/library';
import { BookCover } from '@/components/BookCover';
import { ContinueReading } from '@/components/ContinueReading';

const Library = () => {
  const navigate = useNavigate();
  const books = useMemo(() => getLibrary(), []);
  const handleBookClick = useCallback((id: string) => {
    navigate(`/read/${id}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full border-b border-border/30 py-2.5" style={{ backgroundColor: 'hsl(var(--sepia-bg, 45 30% 96%))' }}>
        <p className="text-center text-xs font-medium tracking-widest uppercase" style={{ color: 'hsl(var(--sepia-text))' }}>
          The Full Collection of the African Writers Series
        </p>
      </div>

      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Afrary</h1>
          <a
            href="https://github.com/baltadar/book-nook-pro/releases/download/v1.0.0/app-debug.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download App</span>
            <span className="sm:hidden">App</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <ContinueReading />

        <h2 className="mb-4 text-lg font-semibold text-foreground/80 tracking-tight">
          All Books
        </h2>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-muted-foreground">No books yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ contain: 'layout style' }}>
            {books.map((book, i) => (
              <BookCover
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book.id)}
                priority={i < 10}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;
