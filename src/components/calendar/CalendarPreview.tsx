import { useMemo } from 'react';
import type { CalendarState } from '../../types/calendar';
import { getMonthData, getYearMonths, getDisplayTitle, getDualYearLabel, getActiveYear, formatHijriYearOption } from '../../utils/calendarData';
import { MonthGrid } from './MonthGrid';
import { YearCalendarLayout } from './YearCalendarLayout';
import { useApp } from '../../context/AppContext';

interface CalendarPreviewProps {
  state: CalendarState;
  /** true = full size for print/export (no screen scaling) */
  exportMode?: boolean;
}

export function CalendarPreview({ state, exportMode = false }: CalendarPreviewProps) {
  const { locale } = useApp();
  const { colors, fonts, design, content } = state;

  const activeYear = getActiveYear(state);

  const monthData = useMemo(
    () => getMonthData(activeYear, state.month, state.system, content.weekStart, locale),
    [activeYear, state.month, state.system, content.weekStart, locale],
  );

  const yearMonths = useMemo(
    () => getYearMonths(activeYear, state.system, content.weekStart, locale),
    [activeYear, state.system, content.weekStart, locale],
  );

  const isYearly = state.view === 'yearly';

  const yearTitle = useMemo(() => {
    if (content.customTitle) return content.customTitle;
    if (state.system === 'both') return getDualYearLabel(state.gregorianYear, state.hijriYear, locale);
    if (state.system === 'hijri') return formatHijriYearOption(state.hijriYear, locale);
    return `${state.gregorianYear}`;
  }, [content.customTitle, state.gregorianYear, state.hijriYear, state.system, locale]);

  const styleClasses = {
    minimal: 'border border-slate-200',
    modern: '',
    elegant: 'ring-1 ring-black/5',
  };

  return (
    <div
      id="calendar-print-area"
      data-view={state.view}
      data-export={exportMode ? 'true' : 'false'}
      className={[
        'calendar-print-root mx-auto w-full transition-all duration-300',
        exportMode ? 'calendar-export-mode' : '',
        isYearly ? 'calendar-yearly max-w-6xl' : 'max-w-3xl',
        !isYearly && design.orientation === 'landscape' ? 'max-w-5xl' : '',
        styleClasses[design.style],
      ].join(' ')}
      style={{
        backgroundColor: colors.calendarBackground,
        fontFamily: fonts.family,
        borderRadius: design.borderRadius + 4,
        boxShadow: exportMode || !design.showShadow ? 'none' : '0 8px 32px rgba(0,0,0,0.08)',
        padding: isYearly ? (exportMode ? '16px' : '24px') : '24px',
      }}
    >
      {content.logoUrl && (
        <div className={`flex justify-center ${isYearly ? 'mb-3' : 'mb-4'}`}>
          <img
            src={content.logoUrl}
            alt="Logo"
            className={`object-contain ${isYearly ? 'max-h-12 max-w-[160px]' : 'max-h-16 max-w-[200px]'}`}
          />
        </div>
      )}

      {isYearly ? (
        <YearCalendarLayout
          yearTitle={yearTitle}
          yearMonths={yearMonths}
          state={state}
          exportMode={exportMode}
        />
      ) : (
        <MonthGrid monthData={monthData} state={state} variant="default" />
      )}

      {content.quote && (
        <p
          className={`text-center italic opacity-70 ${isYearly ? 'mt-3 text-xs' : 'mt-6 text-sm'}`}
          style={{ color: colors.monthTitle, fontFamily: fonts.family }}
        >
          {content.quote}
        </p>
      )}

      {!isYearly && !content.customTitle && (
        <span className="sr-only">{getDisplayTitle(monthData, state.system, locale, '')}</span>
      )}
    </div>
  );
}
