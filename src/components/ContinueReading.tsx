import { getReadingHistory, removeFromHistory } from '@/lib/storage';
import { getBookById } from '@/lib/library';
import { useNavigate } from 'react-router-dom';
import { BookOpen, X } from 'lucide-react';
import { useState } from 'react';

export function ContinueReading() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(() => getReadingHistory());

  const entries = history
    .map((e) => ({ entry: e, book: getBookById(e.bookId) }))
    .filter((x) => x.book != null);

  if (entries.length === 0) return null;

  const handleRemove = (bookId: string, ev: React.MouseEvent) => {
    ev.stopPropagation();
    removeFromHistory(bookId);
    setHistory(getReadingHistory());
  };

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-foreground/80 tracking-tight">
        Continue Reading
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {entries.map(({ entry, book }) => (
          <button
            key={book!.id}
            onClick={() => navigate(`/read/${book!.id}`)}
            className="group relative flex w-36 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            {/* Return to shelf / dismiss */}
            <span
              onClick={(ev) => handleRemove(book!.id, ev)}
              title="Return to shelf"
              className="absolute top-1.5 right-1.5 rounded-full bg-muted/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </span>

            <div className="h-20 w-14 overflow-hidden rounded-lg bg-muted flex-shrink-0">
              {book!.coverImage && (
                <img src={book!.coverImage} alt={book!.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="w-full text-center min-w-0">
              <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{book!.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{book!.author}</p>
            </div>
            <BookOpen className="h-3.5 w-3.5 text-primary/50" />
          </button>
        ))}
      </div>
    </div>
  );
}
