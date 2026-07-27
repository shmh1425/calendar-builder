import type { ColorTheme, DesignSettings, FontSettings, ContentSettings } from '../types/calendar';

export interface Template {
  id: string;
  nameKey: string;
  preview: string;
  state: {
    colors?: Partial<ColorTheme>;
    fonts?: Partial<FontSettings>;
    design?: Partial<DesignSettings>;
    content?: Partial<ContentSettings>;
  };
}

export const TEMPLATES: Template[] = [
  {
    id: 'minimal-bw',
    nameKey: 'templates.minimalBw',
    preview: '#ffffff',
    state: {
      colors: {
        pageBackground: '#fafafa',
        calendarBackground: '#ffffff',
        monthTitle: '#000000',
        weekdayNames: '#666666',
        dayNumbers: '#333333',
        weekendDays: '#999999',
        today: '#000000',
        borders: '#e5e5e5',
      },
      design: { style: 'minimal', showShadow: false, borderRadius: 0, showBorders: true },
      fonts: { family: 'Cairo', size: 14, weight: 400, align: 'center' },
    },
  },
  {
    id: 'earthy',
    nameKey: 'templates.earthy',
    preview: '#a68a64',
    state: {
      colors: {
        pageBackground: '#f5f0eb',
        calendarBackground: '#faf7f4',
        monthTitle: '#5c4033',
        weekdayNames: '#8b7355',
        dayNumbers: '#4a3728',
        weekendDays: '#b8860b',
        today: '#8b4513',
        borders: '#d4c4b0',
      },
      design: { style: 'elegant', showShadow: true, borderRadius: 16 },
      fonts: { family: 'Tajawal', size: 14, weight: 500, align: 'center' },
    },
  },
  {
    id: 'modern-blue',
    nameKey: 'templates.modernBlue',
    preview: '#2563eb',
    state: {
      colors: {
        pageBackground: '#eff6ff',
        calendarBackground: '#ffffff',
        monthTitle: '#1e40af',
        weekdayNames: '#3b82f6',
        dayNumbers: '#1e293b',
        weekendDays: '#6366f1',
        today: '#2563eb',
        borders: '#bfdbfe',
      },
      design: { style: 'modern', showShadow: true, borderRadius: 12 },
      fonts: { family: 'IBM Plex Sans Arabic', size: 14, weight: 500, align: 'center' },
    },
  },
  {
    id: 'dark',
    nameKey: 'templates.dark',
    preview: '#1e293b',
    state: {
      colors: {
        pageBackground: '#0f172a',
        calendarBackground: '#1e293b',
        monthTitle: '#f1f5f9',
        weekdayNames: '#94a3b8',
        dayNumbers: '#e2e8f0',
        weekendDays: '#f87171',
        today: '#38bdf8',
        borders: '#334155',
      },
      design: { style: 'modern', showShadow: true, borderRadius: 12 },
      fonts: { family: 'Cairo', size: 14, weight: 500, align: 'center' },
    },
  },
  {
    id: 'saudi-modern',
    nameKey: 'templates.saudiModern',
    preview: '#006c35',
    state: {
      colors: {
        pageBackground: '#f0fdf4',
        calendarBackground: '#ffffff',
        monthTitle: '#006c35',
        weekdayNames: '#15803d',
        dayNumbers: '#14532d',
        weekendDays: '#dc2626',
        today: '#006c35',
        borders: '#bbf7d0',
      },
      design: { style: 'elegant', showShadow: true, borderRadius: 8 },
      fonts: { family: 'Tajawal', size: 15, weight: 600, align: 'center' },
      content: { customTitle: '', quote: '', logoUrl: '', showWeekNumbers: false, weekStart: 'saturday' },
    },
  },
  {
    id: 'corporate',
    nameKey: 'templates.corporate',
    preview: '#475569',
    state: {
      colors: {
        pageBackground: '#f1f5f9',
        calendarBackground: '#ffffff',
        monthTitle: '#1e293b',
        weekdayNames: '#64748b',
        dayNumbers: '#334155',
        weekendDays: '#64748b',
        today: '#0f172a',
        borders: '#cbd5e1',
      },
      design: { style: 'minimal', showShadow: false, borderRadius: 4, showBorders: true },
      fonts: { family: 'IBM Plex Sans Arabic', size: 13, weight: 500, align: 'center' },
    },
  },
  {
    id: 'kids',
    nameKey: 'templates.kids',
    preview: '#f472b6',
    state: {
      colors: {
        pageBackground: '#fdf2f8',
        calendarBackground: '#fff7ed',
        monthTitle: '#db2777',
        weekdayNames: '#f97316',
        dayNumbers: '#7c3aed',
        weekendDays: '#ec4899',
        today: '#f59e0b',
        borders: '#fbcfe8',
      },
      design: { style: 'modern', showShadow: true, borderRadius: 20, cellGap: 6 },
      fonts: { family: 'Cairo', size: 15, weight: 700, align: 'center' },
    },
  },
];
