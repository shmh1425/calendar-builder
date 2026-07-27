export type CalendarView = 'monthly' | 'yearly';
export type CalendarSystem = 'gregorian' | 'hijri' | 'both';
export type WeekStart = 'saturday' | 'sunday' | 'monday';
export type DesignStyle = 'minimal' | 'modern' | 'elegant';
export type Orientation = 'portrait' | 'landscape';
export type TextAlign = 'right' | 'center' | 'left';
export type FontFamily = 'Cairo' | 'Tajawal' | 'IBM Plex Sans Arabic';
export type Locale = 'ar' | 'en';

export interface DayEvent {
  id: string;
  date: string;
  title: string;
  color?: string;
}

export interface DayNote {
  date: string;
  text: string;
}

export interface DayHighlight {
  date: string;
  color: string;
}

export interface ColorTheme {
  pageBackground: string;
  calendarBackground: string;
  monthTitle: string;
  weekdayNames: string;
  dayNumbers: string;
  weekendDays: string;
  today: string;
  borders: string;
}

export interface FontSettings {
  family: FontFamily;
  size: number;
  weight: number;
  align: TextAlign;
}

export interface DesignSettings {
  borderRadius: number;
  showBorders: boolean;
  cellGap: number;
  cellSize: number;
  showShadow: boolean;
  style: DesignStyle;
  orientation: Orientation;
  scale: number;
}

export type WeekdayNameStyle = 'single' | 'double' | 'triple' | 'full' | 'custom';

export interface WeekdaySettings {
  style: WeekdayNameStyle;
  /** Saturday → Friday */
  customNames: string[];
  show: boolean;
  color: string;
  useCustomColor: boolean;
  fontFamily: FontFamily;
  useCustomFont: boolean;
  fontSize: number;
  fontWeight: number;
  gap: number;
}

export interface ContentSettings {
  customTitle: string;
  quote: string;
  logoUrl: string;
  showWeekNumbers: boolean;
  weekStart: WeekStart;
  weekdays: WeekdaySettings;
}

export interface CalendarState {
  view: CalendarView;
  system: CalendarSystem;
  gregorianYear: number;
  hijriYear: number;
  month: number;
  colors: ColorTheme;
  fonts: FontSettings;
  design: DesignSettings;
  content: ContentSettings;
  events: DayEvent[];
  notes: DayNote[];
  highlights: DayHighlight[];
}

export interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  hijriDay?: number;
  hijriMonth?: number;
  hijriYear?: number;
  hijriMonthName?: string;
  weekNumber?: number;
}

export interface MonthData {
  month: number;
  year: number;
  monthName: string;
  hijriMonthName?: string;
  days: CalendarDay[];
  weeks: CalendarDay[][];
}

export interface SavedDesign {
  id: string;
  name: string;
  state: CalendarState;
  savedAt: string;
}
