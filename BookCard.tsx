import { useState } from 'react';
import type { Book } from '../types/book';
import { parseAuthorAndTitle } from '../lib/books';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const { author, title } = parseAuthorAndTitle(book.title);

  return (
    <div
      className="group cursor-pointer flex flex-col rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick?.(book)}
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {!imgError ? (
          <img
            src={book.thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          // Fallback: styled placeholder with title
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-4">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-center text-xs font-medium text-amber-800 dark:text-amber-200 line-clamp-4">
              {title}
            </p>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold leading-tight line-clamp-2">{title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
      </div>
    </div>
  );
}
