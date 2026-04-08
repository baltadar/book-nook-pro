import { memo, useState } from 'react';
import { BookMeta } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BookCoverProps {
  book: BookMeta;
  onClick: () => void;
  className?: string;
  priority?: boolean;
}

export const BookCover = memo(function BookCover({ book, onClick, className, priority = false }: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
      style={{ contain: 'layout style paint' }}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.coverImage ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <img
              src={book.coverImage}
              alt={book.title}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'low'}
              onLoad={() => setLoaded(true)}
              className={cn(
                'h-full w-full object-cover transition-opacity duration-300',
                loaded ? 'opacity-100' : 'opacity-0'
              )}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <span className="text-3xl">📖</span>
            <span className="text-xs text-muted-foreground text-center line-clamp-2">{book.title}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 text-left">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground">{book.author}</p>
      </div>
    </button>
  );
});
