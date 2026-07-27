import { toGregorian, toHijri } from 'hijri-converter';
import type {
  CalendarDay,
  CalendarSystem,
  Locale,
  MonthData,
  WeekStart,
  WeekdaySettings,
} from '../types/calendar';
import { getPresetNames, WEEKDAY_LABELS_AR, WEEKDAY_LABELS_EN } from '../constants/weekdayPresets';
import {
  GREGORIAN_MONTHS_AR,
  GREGORIAN_MONTHS_EN,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from '../constants/monthNames';

const WEEKDAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const WEEKDAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKDAYS_SHORT_AR = ['سب', 'أحد', 'اث', 'ثل', 'أرب', 'خم', 'جم'];
const WEEKDAYS_SHORT_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function getWeekStartIndex(weekStart: WeekStart): number {
  const map: Record<WeekStart, number> = { saturday: 0, sunday: 1, monday: 2 };
  return map[weekStart];
}

function adjustDayOfWeek(day: number, weekStart: WeekStart): number {
  const start = getWeekStartIndex(weekStart);
  const saturdayBased = (day + 1) % 7;
  return (saturdayBased - start + 7) % 7;
}

function isWeekend(dayOfWeek: number, weekStart: WeekStart): boolean {
  const fridayIndex = (5 - getWeekStartIndex(weekStart) + 7) % 7;
  const saturdayIndex = (6 - getWeekStartIndex(weekStart) + 7) % 7;
  const adjusted = adjustDayOfWeek(dayOfWeek, weekStart);
  return adjusted === fridayIndex || adjusted === saturdayIndex;
}

function getHijriInfo(gYear: number, gMonth: number, gDay: number, locale: Locale) {
  try {
    const hijri = toHijri(gYear, gMonth, gDay);
    const months = locale === 'ar' ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
    return {
      hijriDay: hijri.hd,
      hijriMonth: hijri.hm,
      hijriYear: hijri.hy,
      hijriMonthName: months[hijri.hm - 1],
    };
  } catch {
    return {};
  }
}

function getGregorianFromHijri(hYear: number, hMonth: number, hDay: number) {
  try {
    const g = toGregorian(hYear, hMonth, hDay);
    return { year: g.gy, month: g.gm, day: g.gd };
  } catch {
    return null;
  }
}

function getHijriMonthLength(hYear: number, hMonth: number): number {
  const nextMonth = hMonth === 12 ? { year: hYear + 1, month: 1 } : { year: hYear, month: hMonth + 1 };
  const first = getGregorianFromHijri(hYear, hMonth, 1);
  const next = getGregorianFromHijri(nextMonth.year, nextMonth.month, 1);
  if (!first || !next) return 30;
  const d1 = new Date(first.year, first.month - 1, first.day);
  const d2 = new Date(next.year, next.month - 1, next.day);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function buildGregorianMonth(
  year: number,
  month: number,
  weekStart: WeekStart,
  locale: Locale,
  system: CalendarSystem,
): MonthData {
  const monthNames = locale === 'ar' ? GREGORIAN_MONTHS_AR : GREGORIAN_MONTHS_EN;
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = adjustDayOfWeek(firstDay.getDay(), weekStart);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  const days: CalendarDay[] = [];
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth - 1, day);
    const dateKey = formatDateKey(prevYear, prevMonth, day);
    const hijriInfo = system !== 'gregorian' ? getHijriInfo(prevYear, prevMonth, day, locale) : {};
    days.push({
      date: dateKey,
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isWeekend: isWeekend(date.getDay(), weekStart),
      weekNumber: getWeekNumber(date),
      ...hijriInfo,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateKey = formatDateKey(year, month, day);
    const hijriInfo = system !== 'gregorian' ? getHijriInfo(year, month, day, locale) : {};
    days.push({
      date: dateKey,
      day,
      month,
      year,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      isWeekend: isWeekend(date.getDay(), weekStart),
      weekNumber: getWeekNumber(date),
      ...hijriInfo,
    });
  }

  const remaining = 42 - days.length;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let day = 1; day <= remaining; day++) {
    const date = new Date(nextYear, nextMonth - 1, day);
    const dateKey = formatDateKey(nextYear, nextMonth, day);
    const hijriInfo = system !== 'gregorian' ? getHijriInfo(nextYear, nextMonth, day, locale) : {};
    days.push({
      date: dateKey,
      day,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isWeekend: isWeekend(date.getDay(), weekStart),
      weekNumber: getWeekNumber(date),
      ...hijriInfo,
    });
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  let hijriMonthName: string | undefined;
  if (system !== 'gregorian') {
    const midHijri = getHijriInfo(year, month, 15, locale);
    hijriMonthName = midHijri.hijriMonthName;
  }

  return {
    month,
    year,
    monthName: monthNames[month - 1],
    hijriMonthName,
    days,
    weeks,
  };
}

function buildHijriMonth(
  hYear: number,
  hMonth: number,
  weekStart: WeekStart,
  locale: Locale,
): MonthData {
  const monthNames = locale === 'ar' ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
  const daysInMonth = getHijriMonthLength(hYear, hMonth);
  const firstGregorian = getGregorianFromHijri(hYear, hMonth, 1);
  if (!firstGregorian) {
    return buildGregorianMonth(new Date().getFullYear(), new Date().getMonth() + 1, weekStart, locale, 'hijri');
  }

  const firstDate = new Date(firstGregorian.year, firstGregorian.month - 1, firstGregorian.day);
  const startOffset = adjustDayOfWeek(firstDate.getDay(), weekStart);

  const days: CalendarDay[] = [];
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  if (startOffset > 0) {
    const prevHMonth = hMonth === 1 ? 12 : hMonth - 1;
    const prevHYear = hMonth === 1 ? hYear - 1 : hYear;
    const prevLength = getHijriMonthLength(prevHYear, prevHMonth);
    for (let i = startOffset - 1; i >= 0; i--) {
      const hDay = prevLength - i;
      const g = getGregorianFromHijri(prevHYear, prevHMonth, hDay);
      if (!g) continue;
      const date = new Date(g.year, g.month - 1, g.day);
      const dateKey = formatDateKey(g.year, g.month, g.day);
      days.push({
        date: dateKey,
        day: hDay,
        month: prevHMonth,
        year: prevHYear,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
        isWeekend: isWeekend(date.getDay(), weekStart),
        weekNumber: getWeekNumber(date),
        hijriDay: hDay,
        hijriMonth: prevHMonth,
        hijriYear: prevHYear,
        hijriMonthName: monthNames[prevHMonth - 1],
      });
    }
  }

  for (let hDay = 1; hDay <= daysInMonth; hDay++) {
    const g = getGregorianFromHijri(hYear, hMonth, hDay);
    if (!g) continue;
    const date = new Date(g.year, g.month - 1, g.day);
    const dateKey = formatDateKey(g.year, g.month, g.day);
    days.push({
      date: dateKey,
      day: hDay,
      month: hMonth,
      year: hYear,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      isWeekend: isWeekend(date.getDay(), weekStart),
      weekNumber: getWeekNumber(date),
      hijriDay: hDay,
      hijriMonth: hMonth,
      hijriYear: hYear,
      hijriMonthName: monthNames[hMonth - 1],
    });
  }

  const nextHMonth = hMonth === 12 ? 1 : hMonth + 1;
  const nextHYear = hMonth === 12 ? hYear + 1 : hYear;
  let nextDay = 1;
  while (days.length < 42) {
    const g = getGregorianFromHijri(nextHYear, nextHMonth, nextDay);
    if (!g) break;
    const date = new Date(g.year, g.month - 1, g.day);
    const dateKey = formatDateKey(g.year, g.month, g.day);
    days.push({
      date: dateKey,
      day: nextDay,
      month: nextHMonth,
      year: nextHYear,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isWeekend: isWeekend(date.getDay(), weekStart),
      weekNumber: getWeekNumber(date),
      hijriDay: nextDay,
      hijriMonth: nextHMonth,
      hijriYear: nextHYear,
      hijriMonthName: monthNames[nextHMonth - 1],
    });
    nextDay++;
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return {
    month: hMonth,
    year: hYear,
    monthName: monthNames[hMonth - 1],
    days,
    weeks,
  };
}

export function getMonthData(
  year: number,
  month: number,
  system: CalendarSystem,
  weekStart: WeekStart,
  locale: Locale,
): MonthData {
  if (system === 'hijri') {
    return buildHijriMonth(year, month, weekStart, locale);
  }
  return buildGregorianMonth(year, month, weekStart, locale, system);
}

export function getYearMonths(
  year: number,
  system: CalendarSystem,
  weekStart: WeekStart,
  locale: Locale,
): MonthData[] {
  const months: MonthData[] = [];
  for (let m = 1; m <= 12; m++) {
    if (system === 'hijri') {
      months.push(buildHijriMonth(year, m, weekStart, locale));
    } else {
      months.push(buildGregorianMonth(year, m, weekStart, locale, system));
    }
  }
  return months;
}

export function getWeekdayNames(weekStart: WeekStart, locale: Locale): string[] {
  const names = locale === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN;
  const start = getWeekStartIndex(weekStart);
  return [...names.slice(start), ...names.slice(0, start)];
}

export function getWeekdayShortNames(weekStart: WeekStart, locale: Locale): string[] {
  const names = locale === 'ar' ? WEEKDAYS_SHORT_AR : WEEKDAYS_SHORT_EN;
  const start = getWeekStartIndex(weekStart);
  return [...names.slice(start), ...names.slice(0, start)];
}

export function resolveWeekdayNames(
  settings: WeekdaySettings,
  weekStart: WeekStart,
  locale: Locale,
  compact = false,
): string[] {
  let style = settings.style;
  if (compact && style !== 'custom' && (style === 'single' || style === 'full' || style === 'triple')) {
    style = 'double';
  }

  let names: string[];
  if (style === 'custom') {
    names = settings.customNames.length === 7 ? [...settings.customNames] : getPresetNames('double', locale);
  } else {
    names = getPresetNames(style, locale);
  }
  const start = getWeekStartIndex(weekStart);
  return [...names.slice(start), ...names.slice(0, start)];
}

export function getWeekdayFullLabels(weekStart: WeekStart, locale: Locale): string[] {
  const names = locale === 'ar' ? WEEKDAY_LABELS_AR : WEEKDAY_LABELS_EN;
  const start = getWeekStartIndex(weekStart);
  return [...names.slice(start), ...names.slice(0, start)];
}

export function getYearMonthTitle(monthData: MonthData, system: CalendarSystem, locale: Locale): string {
  if (system === 'both') {
    const hijriName =
      monthData.hijriMonthName ??
      monthData.days.find((d) => d.isCurrentMonth && d.hijriMonthName)?.hijriMonthName;
    if (hijriName) {
      return locale === 'ar'
        ? `${monthData.monthName} — ${hijriName}`
        : `${monthData.monthName} — ${hijriName}`;
    }
  }
  return monthData.monthName;
}

export function getDualYearLabel(year: number, locale: Locale): string {
  const hijriYear = toHijri(year, 7, 1).hy;
  return locale === 'ar' ? `${year} — ${hijriYear} هـ` : `${year} — ${hijriYear} AH`;
}

export function navigateMonth(
  year: number,
  month: number,
  direction: -1 | 1,
): { year: number; month: number } {
  let newMonth = month + direction;
  let newYear = year;
  if (newMonth < 1) {
    newMonth = 12;
    newYear -= 1;
  } else if (newMonth > 12) {
    newMonth = 1;
    newYear += 1;
  }
  return { year: newYear, month: newMonth };
}

export function getDisplayTitle(
  monthData: MonthData,
  system: CalendarSystem,
  locale: Locale,
  customTitle: string,
): string {
  if (customTitle) return customTitle;
  if (system === 'hijri') {
    return `${monthData.monthName} ${monthData.year}${locale === 'ar' ? ' هـ' : ' AH'}`;
  }
  if (system === 'both' && monthData.hijriMonthName) {
    const hijriYear = monthData.days.find((d) => d.isCurrentMonth && d.hijriYear)?.hijriYear;
    const hijriPart = hijriYear
      ? `${monthData.hijriMonthName} ${hijriYear}${locale === 'ar' ? ' هـ' : ' AH'}`
      : monthData.hijriMonthName;
    return locale === 'ar'
      ? `${monthData.monthName} ${monthData.year} — ${hijriPart}`
      : `${monthData.monthName} ${monthData.year} — ${hijriPart}`;
  }
  return `${monthData.monthName} ${monthData.year}`;
}

export function getCurrentHijriYear(): number {
  const today = new Date();
  return toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate()).hy;
}

export function getCurrentHijriMonth(): number {
  const today = new Date();
  return toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate()).hm;
}

export function hijriYearForGregorianYear(gYear: number): number {
  return toHijri(gYear, 7, 1).hy;
}

export function gregorianYearForHijriYear(hYear: number): number {
  return toGregorian(hYear, 7, 1).gy;
}

export function getYearRange(system: CalendarSystem): number[] {
  const currentGregorian = new Date().getFullYear();
  const currentHijri = getCurrentHijriYear();
  const base = system === 'hijri' ? currentHijri : currentGregorian;
  return Array.from({ length: 24 }, (_, i) => base - 12 + i);
}

export function gregorianFromHijriMonth(hYear: number, hMonth: number): { year: number; month: number } {
  const g = toGregorian(hYear, hMonth, 1);
  return { year: g.gy, month: g.gm };
}

export function formatYearOption(year: number, system: CalendarSystem, locale: Locale): string {
  if (system === 'hijri') {
    return locale === 'ar' ? `${year} هـ` : `${year} AH`;
  }
  return String(year);
}

export function formatHijriYearOption(year: number, locale: Locale): string {
  return locale === 'ar' ? `${year} هـ` : `${year} AH`;
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) hex = `#${hex}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}
