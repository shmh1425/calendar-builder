import type { CalendarState, ColorTheme, WeekdaySettings } from '../types/calendar';
import { getPresetNames } from './weekdayPresets';
import { getCurrentHijriYear } from '../utils/calendarData';

export const DEFAULT_COLORS: ColorTheme = {
  pageBackground: '#f8fafc',
  calendarBackground: '#ffffff',
  monthTitle: '#0f172a',
  weekdayNames: '#64748b',
  dayNumbers: '#334155',
  weekendDays: '#dc2626',
  today: '#2563eb',
  borders: '#e2e8f0',
};

export const DEFAULT_WEEKDAYS: WeekdaySettings = {
  style: 'double',
  customNames: getPresetNames('double', 'ar'),
  show: true,
  color: '#64748b',
  useCustomColor: false,
  fontFamily: 'Cairo',
  useCustomFont: false,
  fontSize: 11,
  fontWeight: 600,
  gap: 2,
};

export const DEFAULT_STATE: CalendarState = {
  view: 'monthly',
  system: 'gregorian',
  gregorianYear: new Date().getFullYear(),
  hijriYear: getCurrentHijriYear(),
  month: new Date().getMonth() + 1,
  colors: { ...DEFAULT_COLORS },
  fonts: {
    family: 'Cairo',
    size: 14,
    weight: 500,
    align: 'center',
  },
  design: {
    borderRadius: 12,
    showBorders: true,
    cellGap: 4,
    cellSize: 48,
    showShadow: true,
    style: 'modern',
    orientation: 'portrait',
    scale: 100,
  },
  content: {
    customTitle: '',
    quote: '',
    logoUrl: '',
    showWeekNumbers: false,
    weekStart: 'saturday',
    weekdays: { ...DEFAULT_WEEKDAYS, customNames: [...DEFAULT_WEEKDAYS.customNames] },
  },
  events: [],
  notes: [],
  highlights: [],
};

export const STORAGE_KEYS = {
  currentDesign: 'calendar-builder-current',
  savedDesigns: 'calendar-builder-saved',
  lastDesign: 'calendar-builder-last',
  theme: 'calendar-builder-theme',
  locale: 'calendar-builder-locale',
  weekdayDefault: 'calendar-builder-weekday-default',
} as const;

export const FONT_OPTIONS = [
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Tajawal', label: 'Tajawal' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
] as const;

export const WEEK_START_OPTIONS = [
  { value: 'saturday', labelKey: 'weekStart.saturday' },
  { value: 'sunday', labelKey: 'weekStart.sunday' },
  { value: 'monday', labelKey: 'weekStart.monday' },
] as const;

export const DESIGN_STYLE_OPTIONS = [
  { value: 'minimal', labelKey: 'design.minimal' },
  { value: 'modern', labelKey: 'design.modern' },
  { value: 'elegant', labelKey: 'design.elegant' },
] as const;
