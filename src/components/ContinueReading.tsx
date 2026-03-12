import { getLastReadBook } from '@/lib/storage';
import { getBookById } from '@/lib/library';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function ContinueReading() {
  const lastProgress = getLastReadBook();
  const book = lastProgress ? getBookById(lastProgress.bookId) : null;
  const navigate = useNavigate();

  if (!book || !lastProgress) return null;

  const percent = Math.round((lastProgress.lastPage / lastProgress.totalPages) * 100);

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-foreground/80 tracking-tight">
        Continue Reading
      </h2>
      <button
        onClick={() => navigate(`/read/${book.id}`)}
        className="flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
      >
        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {book.coverImage && (
            <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex flex-1 flex-col items-start gap-1.5 text-left">
          <h3 className="text-base font-semibold text-foreground">{book.title}</h3>
          <p className="text-xs text-muted-foreground">{book.author}</p>
          <div className="flex w-full items-center gap-2 mt-1">
            <div className="h-1.5 flex-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{percent}%</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Page {lastProgress.lastPage} of {lastProgress.totalPages}
          </span>
        </div>
        <BookOpen className="h-5 w-5 text-primary/60 flex-shrink-0" />
      </button>
    </div>
  );
}
