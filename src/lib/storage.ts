import { ReadingProgress } from './types';

const PROGRESS_KEY = 'ebook-reader-progress';

export function getAllProgress(): Record<string, ReadingProgress> {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getProgress(bookId: string): ReadingProgress | null {
  return getAllProgress()[bookId] || null;
}

export function saveProgress(progress: ReadingProgress): void {
  const all = getAllProgress();
  all[progress.bookId] = { ...progress, lastRead: Date.now() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function getLastReadBook(): ReadingProgress | null {
  const all = getAllProgress();
  const entries = Object.values(all);
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => (a.lastRead > b.lastRead ? a : b));
}
