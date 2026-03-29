import { useState, useEffect, useMemo } from 'react';
import {
  getAllBooks,
  getBookById,
  searchBooks,
  getPaginatedBooks,
} from '../lib/books';
import type { Book } from '../types/book';

// ─── useBooks: all books, with optional search ────────────────────────────────
export function useBooks(searchQuery = '') {
  const books = useMemo(
    () => (searchQuery ? searchBooks(searchQuery) : getAllBooks()),
    [searchQuery]
  );
  return { books, isLoading: false, error: null };
}

// ─── usePaginatedBooks: paginated list with search ────────────────────────────
export function usePaginatedBooks(page = 1, pageSize = 24, searchQuery = '') {
  const result = useMemo(() => {
    const filtered = searchQuery ? searchBooks(searchQuery) : getAllBooks();
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);
    return { data, total, totalPages, page };
  }, [page, pageSize, searchQuery]);

  return { ...result, isLoading: false, error: null };
}

// ─── useBook: single book by id ───────────────────────────────────────────────
export function useBook(id: string | undefined) {
  const book = useMemo(() => (id ? getBookById(id) : undefined), [id]);
  return { book, isLoading: false, error: null };
}

// ─── useBookSearch: debounced search ─────────────────────────────────────────
export function useBookSearch(delay = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  const results = useMemo(
    () => searchBooks(debouncedQuery),
    [debouncedQuery]
  );

  return { query, setQuery, results, isLoading: false };
}
