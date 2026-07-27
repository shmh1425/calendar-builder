import type { WeekdayNameStyle } from '../types/calendar';

/** Saturday → Friday order */
export const WEEKDAY_LABELS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
export const WEEKDAY_LABELS_EN = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const WEEKDAY_PRESETS_AR: Record<Exclude<WeekdayNameStyle, 'custom'>, string[]> = {
  single: ['س', 'أ', 'إ', 'ث', 'ر', 'خ', 'ج'],
  double: ['سب', 'أح', 'إث', 'ثل', 'أرب', 'خم', 'جمع'],
  triple: ['سبت', 'أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع'],
  full: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
};

export const WEEKDAY_PRESETS_EN: Record<Exclude<WeekdayNameStyle, 'custom'>, string[]> = {
  single: ['S', 'S', 'M', 'T', 'W', 'T', 'F'],
  double: ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'],
  triple: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  full: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

export const WEEKDAY_STYLE_OPTIONS: { value: WeekdayNameStyle; labelKey: string }[] = [
  { value: 'single', labelKey: 'weekdayStyle.single' },
  { value: 'double', labelKey: 'weekdayStyle.double' },
  { value: 'triple', labelKey: 'weekdayStyle.triple' },
  { value: 'full', labelKey: 'weekdayStyle.full' },
  { value: 'custom', labelKey: 'weekdayStyle.custom' },
];

export function getPresetNames(style: WeekdayNameStyle, locale: 'ar' | 'en'): string[] {
  if (style === 'custom') return [...WEEKDAY_PRESETS_AR.double];
  const presets = locale === 'ar' ? WEEKDAY_PRESETS_AR : WEEKDAY_PRESETS_EN;
  return [...presets[style]];
}
