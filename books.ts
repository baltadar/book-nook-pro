import booksData from '../data/books.json';
import type { Book } from '../types/book';

const books: Book[] = booksData as Book[];

// Formats raw slug-style title to readable title
export function formatTitle(raw: string): string {
  return raw
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Parses author from filename convention: "author-name-book-title"
// Tries to split on known patterns — works well for your African lit filenames
export function parseAuthorAndTitle(raw: string): { author: string; title: string } {
  const words = raw.split('-');
  // Heuristic: first 2-3 words are likely the author
  // e.g. "alex-la-guma-a-walk-in-the-night" → author: "Alex La Guma"
  const twoWordAuthor = words.slice(0, 2).join(' ');
  const threeWordAuthor = words.slice(0, 3).join(' ');

  // If 3rd word is short (like "la", "de", "di"), use 3-word author
  const isParticle = words[2] && words[2].length <= 3;
  const authorWords = isParticle ? 3 : 2;
  const author = words
    .slice(0, authorWords)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const title = words
    .slice(authorWords)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return { author, title };
}

// ─── Data access functions (drop-in replacements for Supabase queries) ────────

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function searchBooks(query: string): Book[] {
  if (!query.trim()) return books;
  const q = query.toLowerCase();
  return books.filter((b) => b.title.toLowerCase().includes(q));
}

export function getPaginatedBooks(page: number, pageSize = 24): {
  data: Book[];
  total: number;
  totalPages: number;
  page: number;
} {
  const total = books.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = books.slice(start, start + pageSize);
  return { data, total, totalPages, page };
}

export function getTotalCount(): number {
  return books.length;
}
