import { ReaderTheme } from '@/lib/types';
import { Sun, Moon, Sunset } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReaderSettingsProps {
  theme: ReaderTheme;
  onThemeChange: (theme: ReaderTheme) => void;
  onClose: () => void;
}

const themes: { value: ReaderTheme; label: string; icon: typeof Sun; bg: string; fg: string }[] = [
  { value: 'light', label: 'Light', icon: Sun, bg: '#ffffff', fg: '#1a1a1a' },
  { value: 'sepia', label: 'Sepia', icon: Sunset, bg: '#f4ecd8', fg: '#5b4636' },
  { value: 'dark', label: 'Dark', icon: Moon, bg: '#1a1a2e', fg: '#e0e0e0' },
];

export function ReaderSettings({ theme, onThemeChange, onClose }: ReaderSettingsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-card border border-border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-base font-semibold text-foreground">Reading Theme</h3>
        <div className="flex gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => onThemeChange(t.value)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                  theme === t.value
                    ? 'border-primary shadow-md'
                    : 'border-border/50 hover:border-border'
                )}
                style={{ backgroundColor: t.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: t.fg }} />
                <span className="text-xs font-medium" style={{ color: t.fg }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
