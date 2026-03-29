import { useState } from 'react';
import { BookCard } from './BookCard';
import { BookModal } from './BookModal';
import { usePaginatedBooks, useBookSearch } from '../hooks/useBooks';
import type { Book } from '../types/book';

export function BookGrid() {
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { query, setQuery, results: searchResults } = useBookSearch();

  const PAGE_SIZE = 24;
  const isSearching = query.trim().length > 0;

  const { data: pageBooks, total, totalPages } = usePaginatedBooks(
    page,
    PAGE_SIZE,
    query
  );

  const booksToShow = pageBooks;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Library</h1>
        <p className="text-muted-foreground">{total} books available</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by title or author..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Grid */}
      {booksToShow.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No books found for "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {booksToShow.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={setSelectedBook}
            />
          ))}
        </div>
      )}

      {/* Pagination (hidden during search) */}
      {!isSearching && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Book modal */}
      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
