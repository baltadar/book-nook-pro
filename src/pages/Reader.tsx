import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '@/lib/library';
import { useReaderTheme } from '@/hooks/use-reader-theme';
import { ReaderSettings } from '@/components/ReaderSettings';
import { ArrowLeft, Download, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const book = bookId ? getBookById(bookId) : null;
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme, getBgColor, getTextColor } = useReaderTheme();

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Book not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const driveViewUrl = (book as any).driveViewUrl as string | undefined;
  const driveDownloadUrl = (book as any).driveDownloadUrl as string | undefined;

  if (!driveViewUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-lg font-medium">{book.title}</p>
          <p className="text-muted-foreground">This book is not available for reading yet.</p>
          <Button variant="ghost" onClick={() => navigate('/')}>Back to Library</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: getBgColor(), color: getTextColor() }}
    >
      {/* Top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 border-b border-border/30"
        style={{ backgroundColor: `${getBgColor()}f0` }}
      >
        {/* Left: back */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full shrink-0"
          style={{ color: getTextColor() }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Centre: title */}
        <div className="flex flex-col items-center min-w-0 px-2">
          <span className="text-sm font-medium line-clamp-1">{book.title}</span>
          <span className="text-[11px] opacity-60">{book.author}</span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0">
          {driveDownloadUrl && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              style={{ color: getTextColor() }}
            >
              <a href={driveDownloadUrl} download title="Download PDF">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full"
            style={{ color: getTextColor() }}
          >
            <a href={driveViewUrl} target="_blank" rel="noreferrer" title="Open in Drive">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="rounded-full"
            style={{ color: getTextColor() }}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* PDF iframe — fills the rest of the screen below the header */}
      <main className="flex-1 pt-14">
        <iframe
          src={driveViewUrl}
          title={book.title}
          className="w-full h-full"
          style={{ minHeight: 'calc(100vh - 3.5rem)', border: 'none' }}
          allow="autoplay"
        />
      </main>

      {/* Settings overlay */}
      {showSettings && (
        <ReaderSettings
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Reader;
