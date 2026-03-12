import { BookMeta } from '@/lib/types';
import { getProgress } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface BookCoverProps {
  book: BookMeta;
  onClick: () => void;
  className?: string;
}

export function BookCover({ book, onClick, className }: BookCoverProps) {
  const progress = getProgress(book.id);

  const progressPercent = progress
    ? Math.round((progress.lastPage / progress.totalPages) * 100)
    : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
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
        {progressPercent > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{progressPercent}%</span>
          </div>
        )}
      </div>
    </button>
  );
}
