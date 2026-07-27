import { Fragment } from 'react';
import type { CalendarState, MonthData } from '../../types/calendar';
import {
  resolveWeekdayNames,
  getWeekdayFullLabels,
  getDisplayTitle,
  getYearMonthTitle,
  getPrimaryCalendar,
} from '../../utils/calendarData';
import { DayCell } from './DayCell';
import { useApp } from '../../context/AppContext';

type MonthGridVariant = 'default' | 'year';

interface MonthGridProps {
  monthData: MonthData;
  state: CalendarState;
  variant?: MonthGridVariant;
}

export function MonthGrid({ monthData, state, variant = 'default' }: MonthGridProps) {
  const { locale } = useApp();
  const { colors, fonts, design } = state;
  const wd = state.content.weekdays;
  const isYear = variant === 'year';

  const fullWeekdays = getWeekdayFullLabels(state.content.weekStart, locale);
  const displayWeekdays = resolveWeekdayNames(wd, state.content.weekStart, locale, isYear);

  const primary = getPrimaryCalendar(state);
  const showDualDates = state.system === 'both';
  const showWeekNumbers = !isYear && state.content.showWeekNumbers;

  const title = isYear
    ? getYearMonthTitle(monthData, state.system, locale, primary)
    : getDisplayTitle(monthData, state.system, locale, state.content.customTitle, primary);

  const cellGap = isYear ? Math.min(design.cellGap, 2) : design.cellGap;

  const weekdayColor = wd.useCustomColor ? wd.color : colors.weekdayNames;
  const weekdayFont = wd.useCustomFont ? wd.fontFamily : fonts.family;
  const weekdaySize = isYear ? Math.max(8, Math.min(wd.fontSize * 0.8, 10)) : wd.fontSize;

  return (
    <div className="w-full">
      <h3
        className={`font-semibold ${isYear ? 'mb-1 text-[0.65rem] leading-snug' : 'mb-3 text-lg'}`}
        style={{
          color: colors.monthTitle,
          fontFamily: fonts.family,
          textAlign: isYear ? 'center' : fonts.align,
          fontWeight: fonts.weight + (isYear ? 100 : 0),
        }}
      >
        {title}
      </h3>

      <div
        className={`grid w-full ${isYear ? 'year-day-grid' : ''}`}
        style={{
          gridTemplateColumns: showWeekNumbers ? `20px repeat(7, minmax(0, 1fr))` : 'repeat(7, minmax(0, 1fr))',
          gap: isYear ? Math.min(cellGap, 1) : cellGap,
        }}
      >
        {showWeekNumbers && <div />}

        {wd.show &&
          displayWeekdays.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className={`truncate text-center leading-none ${isYear ? 'py-0.5' : 'py-1.5'}`}
              style={{
                color: weekdayColor,
                fontFamily: weekdayFont,
                fontSize: weekdaySize,
                fontWeight: wd.fontWeight,
              }}
              title={fullWeekdays[i]}
            >
              {name}
            </div>
          ))}

        {!wd.show && <div className="col-span-7" style={{ height: isYear ? 2 : 4 }} />}

        {monthData.weeks.map((week, wi) => (
          <Fragment key={wi}>
            {showWeekNumbers && (
              <div
                className="flex items-center justify-center text-[0.55rem] opacity-50"
                style={{ color: weekdayColor, fontFamily: weekdayFont }}
              >
                {week[0]?.weekNumber}
              </div>
            )}
            {week.map((day) => (
              <DayCell
                key={day.date}
                day={day}
                state={state}
                showDualDates={showDualDates}
                variant={isYear ? 'year' : 'default'}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
