import { BookMeta } from './types';

// Sample library — users can update this list with their own PDFs placed in public/books/
const library: BookMeta[] = [
  {
    id: 'sample-book',
    title: 'Sample Book',
    author: 'Unknown Author',
    filename: 'sample.pdf',
  },
];

export function getLibrary(): BookMeta[] {
  return library;
}

export function getBookById(id: string): BookMeta | undefined {
  return library.find((b) => b.id === id);
}

export function getBookUrl(book: BookMeta): string {
  return `/books/${book.filename}`;
}
