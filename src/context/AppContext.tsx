import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale, TranslationKey } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { getLocalePreference, setLocalePreference } from '../utils/storage';

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  confirmOpen: boolean;
  confirmMessage: string;
  confirmTitle: string;
  openConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
  handleConfirm: () => void;
}

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocalePreference);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('calendar-builder-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setLocalePreference(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('calendar-builder-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmCallback(() => onConfirm);
    setConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setConfirmCallback(null);
  }, []);

  const handleConfirm = useCallback(() => {
    confirmCallback?.();
    closeConfirm();
  }, [confirmCallback, closeConfirm]);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? key,
    [locale],
  );

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
        confirmOpen,
        confirmMessage,
        confirmTitle,
        openConfirm,
        closeConfirm,
        handleConfirm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
