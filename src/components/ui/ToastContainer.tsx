import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2 dark:border-slate-700 dark:bg-slate-800"
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 shrink-0 text-red-500" />}
          {toast.type === 'info' && <Info className="h-5 w-5 shrink-0 text-blue-500" />}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ms-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
