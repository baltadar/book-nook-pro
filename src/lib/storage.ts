const HISTORY_KEY = 'ebook-reader-history';
const MAX_HISTORY = 5;

export interface ReadingHistoryEntry {
  bookId: string;
  lastOpened: number; // timestamp
}

export function getReadingHistory(): ReadingHistoryEntry[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function trackBookOpened(bookId: string): void {
  let history = getReadingHistory().filter((e) => e.bookId !== bookId);
  history.unshift({ bookId, lastOpened: Date.now() });
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function removeFromHistory(bookId: string): void {
  const history = getReadingHistory().filter((e) => e.bookId !== bookId);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
