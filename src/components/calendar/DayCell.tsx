import type { CalendarDay, CalendarState } from '../../types/calendar';
import type { DayEvent, DayHighlight, DayNote } from '../../types/calendar';
import { getGregorianDayFromKey, getPrimaryCalendar } from '../../utils/calendarData';

type DayCellVariant = 'default' | 'year';

interface DayCellProps {
  day: CalendarDay;
  state: CalendarState;
  showDualDates: boolean;
  variant?: DayCellVariant;
}

export function DayCell({ day, state, showDualDates, variant = 'default' }: DayCellProps) {
  const { colors, fonts, design } = state;
  const isYear = variant === 'year';
  const note = state.notes.find((n: DayNote) => n.date === day.date);
  const events = state.events.filter((e: DayEvent) => e.date === day.date);
  const highlight = state.highlights.find((h: DayHighlight) => h.date === day.date);
  const hasMarker = note || events.length > 0;

  let textColor = day.isCurrentMonth ? colors.dayNumbers : `${colors.dayNumbers}80`;
  if (day.isWeekend && day.isCurrentMonth) textColor = colors.weekendDays;
  if (day.isToday) textColor = colors.today;

  const bgColor = highlight?.color ?? (day.isToday ? `${colors.today}18` : 'transparent');

  const cellSize = isYear ? Math.max(22, design.cellSize * 0.44) : design.cellSize;
  const fontSize = isYear ? Math.max(9, fonts.size * 0.65) : fonts.size;
  const radius = isYear ? Math.min(design.borderRadius, 4) : design.borderRadius;

  const cellStyle: React.CSSProperties = {
    minHeight: cellSize,
    borderRadius: radius,
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: fonts.family,
    fontSize,
    fontWeight: day.isToday ? Math.min(fonts.weight + 100, 700) : fonts.weight,
    textAlign: 'center',
    border: design.showBorders ? `1px solid ${colors.borders}` : 'none',
    opacity: day.isCurrentMonth ? 1 : 0.4,
    boxShadow: day.isToday && design.style === 'elegant' ? `inset 0 0 0 1.5px ${colors.today}` : undefined,
  };

  const primary = getPrimaryCalendar(state);
  const secondaryDay =
    showDualDates && day.isCurrentMonth
      ? primary === 'hijri'
        ? getGregorianDayFromKey(day.date)
        : day.hijriDay
      : null;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${isYear ? 'gap-px p-px' : 'p-1'}`}
      style={cellStyle}
    >
      <span className="leading-none tabular-nums">{day.day}</span>

      {secondaryDay != null && (
        <span
          className="leading-none tabular-nums"
          style={{
            fontSize: isYear ? '0.58em' : '0.62em',
            color: colors.weekdayNames,
            fontWeight: 600,
            opacity: 0.85,
          }}
        >
          {secondaryDay}
        </span>
      )}

      {!isYear && note && (
        <span className="mt-0.5 line-clamp-1 w-full text-[0.55em] opacity-70">{note.text}</span>
      )}

      {!isYear &&
        events.map((event) => (
          <span
            key={event.id}
            className="mt-0.5 line-clamp-1 w-full rounded px-0.5 text-[0.5em]"
            style={{ backgroundColor: event.color ?? `${colors.today}20`, color: event.color ?? colors.today }}
          >
            {event.title}
          </span>
        ))}

      {isYear && hasMarker && (
        <span
          className="mt-px block h-1 w-1 rounded-full"
          style={{ backgroundColor: events[0]?.color ?? colors.today }}
        />
      )}
    </div>
  );
}
