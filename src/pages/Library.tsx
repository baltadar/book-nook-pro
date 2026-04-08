import { useNavigate } from 'react-router-dom';
import { Download, Search, X } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { getLibrary } from '@/lib/library';
import { BookCover } from '@/components/BookCover';
import { ContinueReading } from '@/components/ContinueReading';

const Library = () => {
  const navigate = useNavigate();
  const allBooks = useMemo(() => getLibrary(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'title' | 'author'>('all');

  const books = useMemo(() => {
    if (!searchQuery.trim()) return allBooks;
    const q = searchQuery.toLowerCase();
    return allBooks.filter((book) => {
      if (filterBy === 'title') return book.title.toLowerCase().includes(q);
      if (filterBy === 'author') return book.author.toLowerCase().includes(q);
      return book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    });
  }, [allBooks, searchQuery, filterBy]);

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

        {/* Search & Filter */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'title', 'author'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filterBy === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {f === 'all' ? 'All' : f === 'title' ? 'Title' : 'Author'}
              </button>
            ))}
            {searchQuery && (
              <span className="ml-auto text-xs text-muted-foreground">
                {books.length} result{books.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-foreground/80 tracking-tight">
          {searchQuery ? 'Search Results' : 'All Books'}
        </h2>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-muted-foreground">
              {searchQuery ? `No books found for "${searchQuery}"` : 'No books yet'}
            </h3>
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
