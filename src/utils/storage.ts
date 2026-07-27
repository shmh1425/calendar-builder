import type { CalendarState, SavedDesign, WeekdaySettings } from '../types/calendar';
import { DEFAULT_STATE, STORAGE_KEYS } from '../constants/defaults';

export function normalizeCalendarState(partial: Partial<CalendarState>): CalendarState {
  const parsed = partial as Partial<CalendarState> & Record<string, unknown>;
  return {
    ...DEFAULT_STATE,
    ...parsed,
    colors: { ...DEFAULT_STATE.colors, ...parsed.colors },
    fonts: { ...DEFAULT_STATE.fonts, ...parsed.fonts },
    design: { ...DEFAULT_STATE.design, ...parsed.design },
    content: {
      ...DEFAULT_STATE.content,
      ...parsed.content,
      weekdays: {
        ...DEFAULT_STATE.content.weekdays,
        ...parsed.content?.weekdays,
        customNames:
          parsed.content?.weekdays?.customNames?.length === 7
            ? [...parsed.content.weekdays.customNames]
            : [...DEFAULT_STATE.content.weekdays.customNames],
      },
    },
    events: parsed.events ?? [],
    notes: parsed.notes ?? [],
    highlights: parsed.highlights ?? [],
  };
}

export function saveCurrentDesign(state: CalendarState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.currentDesign, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function loadCurrentDesign(): CalendarState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.currentDesign);
    if (!raw) return null;
    return normalizeCalendarState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveLastDesign(state: CalendarState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.lastDesign, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function loadLastDesign(): CalendarState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lastDesign);
    if (!raw) return null;
    return normalizeCalendarState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function getSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedDesigns);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDesignToLibrary(state: CalendarState, name?: string): SavedDesign {
  const designs = getSavedDesigns();
  const design: SavedDesign = {
    id: crypto.randomUUID(),
    name: name || `Design ${designs.length + 1}`,
    state,
    savedAt: new Date().toISOString(),
  };
  designs.unshift(design);
  localStorage.setItem(STORAGE_KEYS.savedDesigns, JSON.stringify(designs.slice(0, 20)));
  return design;
}

export function deleteSavedDesign(id: string): void {
  const designs = getSavedDesigns().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.savedDesigns, JSON.stringify(designs));
}

export function getThemePreference(): 'light' | 'dark' {
  return (localStorage.getItem(STORAGE_KEYS.theme) as 'light' | 'dark') || 'light';
}

export function setThemePreference(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function getLocalePreference(): 'ar' | 'en' {
  return (localStorage.getItem(STORAGE_KEYS.locale) as 'ar' | 'en') || 'ar';
}

export function setLocalePreference(locale: 'ar' | 'en'): void {
  localStorage.setItem(STORAGE_KEYS.locale, locale);
}

export function saveWeekdayDefault(settings: WeekdaySettings): void {
  localStorage.setItem(STORAGE_KEYS.weekdayDefault, JSON.stringify(settings));
}

export function loadWeekdayDefault(): WeekdaySettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.weekdayDefault);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WeekdaySettings;
    return {
      ...DEFAULT_STATE.content.weekdays,
      ...parsed,
      customNames:
        parsed.customNames?.length === 7
          ? [...parsed.customNames]
          : [...DEFAULT_STATE.content.weekdays.customNames],
    };
  } catch {
    return null;
  }
}

export function encodeStateForShare(state: CalendarState): string {
  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json));
}

export function decodeStateFromShare(encoded: string): CalendarState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return normalizeCalendarState(JSON.parse(json));
  } catch {
    return null;
  }
}

export function getShareUrl(state: CalendarState): string {
  const encoded = encodeStateForShare(state);
  const url = new URL(window.location.href);
  url.searchParams.set('design', encoded);
  return url.toString();
}

export function loadStateFromUrl(): CalendarState | null {
  const params = new URLSearchParams(window.location.search);
  const design = params.get('design');
  if (!design) return null;
  return decodeStateFromShare(design);
}

export function applyWeekdayDefault(state: CalendarState): CalendarState {
  const weekdayDefault = loadWeekdayDefault();
  if (!weekdayDefault) return state;
  return {
    ...state,
    content: {
      ...state.content,
      weekdays: weekdayDefault,
    },
  };
}
