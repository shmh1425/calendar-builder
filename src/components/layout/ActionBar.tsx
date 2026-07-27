import {
  RotateCcw,
  Save,
  Copy,
  Download,
  FileDown,
  Printer,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCalendar } from '../../context/CalendarContext';
import { exportToPng, exportToPdf, printCalendar, copyDesignToClipboard } from '../../utils/exportUtils';
import { saveDesignToLibrary, getShareUrl } from '../../utils/storage';

export function ActionBar() {
  const { t, showToast, openConfirm } = useApp();
  const { state, resetState } = useCalendar();

  const getPreviewElement = () => document.getElementById('calendar-print-area');

  const fileBase = state.view === 'yearly'
    ? `calendar-year-${state.year}`
    : `calendar-${state.year}-${state.month}`;

  const handleReset = () => {
    openConfirm(t('confirmReset'), t('confirmResetMessage'), resetState);
  };

  const handleSave = () => {
    saveDesignToLibrary(state);
    showToast(t('saved'));
  };

  const handleCopy = async () => {
    await copyDesignToClipboard(state);
    showToast(t('copied'));
  };

  const handlePng = async () => {
    const el = getPreviewElement();
    if (!el) return;
    await exportToPng(el, `${fileBase}.png`, state.view);
    showToast(t('downloaded'));
  };

  const handlePdf = async () => {
    const el = getPreviewElement();
    if (!el) return;
    await exportToPdf(el, `${fileBase}.pdf`, state.design.orientation, state.view);
    showToast(t('downloaded'));
  };

  const handlePrint = () => {
    printCalendar(state.view, state.design.orientation);
  };

  const handleShare = async () => {
    const url = getShareUrl(state);
    await navigator.clipboard.writeText(url);
    showToast(t('shared'));
  };

  const actions = [
    { icon: RotateCcw, label: t('reset'), onClick: handleReset, variant: 'ghost' as const },
    { icon: Save, label: t('save'), onClick: handleSave, variant: 'ghost' as const },
    { icon: Copy, label: t('copy'), onClick: handleCopy, variant: 'ghost' as const },
    { icon: Download, label: t('downloadPng'), onClick: handlePng, variant: 'primary' as const },
    { icon: FileDown, label: t('downloadPdf'), onClick: handlePdf, variant: 'primary' as const },
    { icon: Printer, label: t('print'), onClick: handlePrint, variant: 'ghost' as const },
    { icon: Share2, label: t('share'), onClick: handleShare, variant: 'ghost' as const },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 lg:p-4">
      {actions.map(({ icon: Icon, label, onClick, variant }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition duration-200 ${
            variant === 'primary'
              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
