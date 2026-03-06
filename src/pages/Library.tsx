import { useNavigate } from 'react-router-dom';
import { getLibrary } from '@/lib/library';
import { BookCover } from '@/components/BookCover';
import { ContinueReading } from '@/components/ContinueReading';
import { BookOpen } from 'lucide-react';

const Library = () => {
  const navigate = useNavigate();
  const books = getLibrary();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">My Library</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <ContinueReading />

        <h2 className="mb-4 text-lg font-semibold text-foreground/80 tracking-tight">
          All Books
        </h2>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-lg font-medium text-muted-foreground">No books yet</h3>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Add PDF files to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">public/books/</code> and update the library in <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/lib/library.ts</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <BookCover
                key={book.id}
                book={book}
                onClick={() => navigate(`/read/${book.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;
