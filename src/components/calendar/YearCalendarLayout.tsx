import { getDualYearLabel, formatHijriYearOption } from '../../utils/calendarData';
import type { CalendarState, MonthData } from '../../types/calendar';
import { MonthGrid } from './MonthGrid';
import { useApp } from '../../context/AppContext';

interface YearCalendarLayoutProps {
  yearTitle: string;
  yearMonths: MonthData[];
  state: CalendarState;
  exportMode?: boolean;
}

export function YearCalendarLayout({ yearTitle, yearMonths, state, exportMode }: YearCalendarLayoutProps) {
  const { locale, t } = useApp();
  const { colors, fonts, design } = state;

  const gridCols = design.orientation === 'landscape' ? 4 : 3;

  return (
    <div className="year-calendar-layout">
      <header className="year-calendar-header mb-4 text-center">
        <h1
          className={`font-bold leading-tight ${exportMode ? 'text-2xl' : 'text-xl lg:text-2xl'}`}
          style={{ color: colors.monthTitle, fontFamily: fonts.family, fontWeight: fonts.weight + 100 }}
        >
          {yearTitle}
        </h1>
        <p
          className="mt-1 text-xs opacity-60"
          style={{ color: colors.weekdayNames, fontFamily: fonts.family }}
        >
          {state.system === 'both'
            ? getDualYearLabel(state.gregorianYear, state.hijriYear, locale)
            : state.system === 'hijri'
              ? `${t('yearly')} — ${formatHijriYearOption(state.hijriYear, locale)}`
              : `${t('yearly')} — ${state.gregorianYear}`}
        </p>
      </header>

      <div
        className="year-calendar-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: design.orientation === 'landscape' ? 'repeat(3, auto)' : 'repeat(4, auto)',
          gap: exportMode ? '10px' : `${Math.max(design.cellGap, 8)}px`,
        }}
      >
        {yearMonths.map((month) => (
          <div
            key={`${month.year}-${month.month}`}
            className="year-month-card overflow-visible rounded-lg"
            style={{
              borderRadius: Math.min(design.borderRadius, 8),
              border: design.showBorders ? `1px solid ${colors.borders}` : 'none',
              padding: '4px',
              backgroundColor: colors.calendarBackground,
              minWidth: 0,
            }}
          >
            <MonthGrid monthData={month} state={state} variant="year" />
          </div>
        ))}
      </div>
    </div>
  );
}
