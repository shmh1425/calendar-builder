import { useCalendar } from '../../context/CalendarContext';
import { useApp } from '../../context/AppContext';
import { CalendarPreview } from '../calendar/CalendarPreview';
import { ActionBar } from './ActionBar';

export function PreviewPanel() {
  const { state } = useCalendar();
  const { t } = useApp();
  const scale = state.design.scale / 100;

  return (
    <main
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      data-orientation={state.design.orientation}
    >
      <div className="border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('preview')}</h2>
      </div>

      <div
        className="preview-scroll-area flex flex-1 items-start justify-center overflow-auto p-4 lg:p-8"
        style={{ backgroundColor: state.colors.pageBackground }}
      >
        <div
          className="preview-scale-wrapper w-full"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            marginBottom: scale < 1 ? `${(1 - scale) * -100}%` : undefined,
          }}
        >
          <CalendarPreview state={state} />
        </div>
      </div>

      <ActionBar />
    </main>
  );
}
