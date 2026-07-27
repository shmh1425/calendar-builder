import { Calendar, Globe, Moon, Sun, Undo2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCalendar } from '../../context/CalendarContext';

export function Header() {
  const { t, locale, setLocale, theme, toggleTheme } = useApp();
  const { undoLast, hasUndo } = useCalendar();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">{t('appTitle')}</h1>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">{t('appSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUndo && (
            <button
              type="button"
              onClick={undoLast}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Undo2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('undo')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Globe className="h-4 w-4" />
            {locale === 'ar' ? 'EN' : 'ع'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
