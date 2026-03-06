export interface BookMeta {
  id: string;
  title: string;
  author: string;
  filename: string;
}

export interface ReadingProgress {
  bookId: string;
  lastPage: number;
  totalPages: number;
  lastRead: number; // timestamp
}

export type ReaderTheme = 'light' | 'dark' | 'sepia';
