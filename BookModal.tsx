import type { Book } from '../types/book';
import { parseAuthorAndTitle } from '../lib/books';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

export function BookModal({ book, onClose }: BookModalProps) {
  if (!book) return null;
  const { author, title } = parseAuthorAndTitle(book.title);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{author}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a
              href={book.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Open in Drive ↗
            </a>
            <a
              href={book.downloadUrl}
              download
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="ml-1 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <iframe
          src={book.viewUrl}
          title={title}
          className="w-full flex-1 min-h-[60vh]"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
