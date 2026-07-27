import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ConfirmDialog() {
  const { confirmOpen, confirmTitle, confirmMessage, closeConfirm, handleConfirm, t } = useApp();

  if (!confirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeConfirm} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{confirmTitle}</h3>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{confirmMessage}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirm}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
