export interface BookMeta {
  id: string;
  title: string;
  author: string;
  filename: string;
  coverImage?: string; // optional custom cover image path
}

export interface ReadingProgress {
  bookId: string;
  lastPage: number;
  totalPages: number;
  lastRead: number; // timestamp
}

export type ReaderTheme = 'light' | 'dark' | 'sepia';
