import {
  CalendarDays,
  Palette,
  Type,
  Layout,
  FileText,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useApp } from '../../context/AppContext';
import { AccordionSection } from '../ui/AccordionSection';
import { ColorInput } from '../ui/ColorInput';
import { SliderInput } from '../ui/SliderInput';
import { ToggleInput } from '../ui/ToggleInput';
import { TEMPLATES } from '../../constants/templates';
import { FONT_OPTIONS, WEEK_START_OPTIONS, DESIGN_STYLE_OPTIONS } from '../../constants/defaults';
import { WeekdaySection } from '../sidebar/WeekdaySection';
import {
  navigateMonth,
  getYearRange,
  formatHijriYearOption,
  getActiveYear,
  getDualYearLabel,
  gregorianFromHijriMonth,
} from '../../utils/calendarData';
import { GREGORIAN_MONTHS_AR, MONTHS_SHORT_EN, HIJRI_MONTHS_AR } from '../../constants/monthNames';
import type { TranslationKey } from '../../i18n/translations';
import type { CalendarSystem, CalendarView, DesignStyle, FontFamily, Orientation, TextAlign, WeekStart } from '../../types/calendar';

export function CustomizationSidebar() {
  const { state, updateState } = useCalendar();
  const { t, locale } = useApp();

  const months = state.system === 'hijri'
    ? HIJRI_MONTHS_AR
    : locale === 'ar' ? GREGORIAN_MONTHS_AR : MONTHS_SHORT_EN;

  const isHijri = state.system === 'hijri';

  const gregorianYears = getYearRange('gregorian');
  const hijriYears = getYearRange('hijri');

  const navLabel = isHijri
    ? `${months[state.month - 1]} ${formatHijriYearOption(state.hijriYear, locale)}`
    : state.system === 'both'
      ? `${months[state.month - 1]} ${getDualYearLabel(state.gregorianYear, state.hijriYear, locale)}`
      : `${months[state.month - 1]} ${state.gregorianYear}`;

  const getEventDatePrefix = () => {
    if (state.system === 'hijri') {
      const g = gregorianFromHijriMonth(state.hijriYear, state.month);
      return `${g.year}-${String(g.month).padStart(2, '0')}`;
    }
    return `${state.gregorianYear}-${String(state.month).padStart(2, '0')}`;
  };

  const updateColors = (key: keyof typeof state.colors, value: string) => {
    updateState({ colors: { ...state.colors, [key]: value } });
  };

  const updateFonts = (partial: Partial<typeof state.fonts>) => {
    updateState({ fonts: { ...state.fonts, ...partial } });
  };

  const updateDesign = (partial: Partial<typeof state.design>) => {
    updateState({ design: { ...state.design, ...partial } });
  };

  const updateContent = (partial: Partial<typeof state.content>) => {
    updateState({ content: { ...state.content, ...partial } });
  };

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((tp) => tp.id === templateId);
    if (!template) return;
    updateState({
      colors: { ...state.colors, ...template.state.colors },
      fonts: { ...state.fonts, ...template.state.fonts },
      design: { ...state.design, ...template.state.design },
      content: { ...state.content, ...template.state.content },
    });
  };

  const handleSystemChange = (system: CalendarSystem) => {
    updateState({ system });
  };

  const nav = (dir: -1 | 1) => {
    const activeYear = getActiveYear(state);
    const next = navigateMonth(activeYear, state.month, dir);
    if (state.system === 'hijri') {
      updateState({ hijriYear: next.year, month: next.month });
    } else {
      updateState({ gregorianYear: next.year, month: next.month });
    }
  };

  const addEvent = () => {
    const date = `${getEventDatePrefix()}-01`;
    updateState({
      events: [
        ...state.events,
        { id: crypto.randomUUID(), date, title: t('addEvent'), color: state.colors.today },
      ],
    });
  };

  const addNote = () => {
    const date = `${getEventDatePrefix()}-01`;
    updateState({
      notes: [...state.notes, { date, text: '' }],
    });
  };

  const addHighlight = () => {
    const date = `${getEventDatePrefix()}-01`;
    updateState({
      highlights: [...state.highlights, { date, color: '#fef08a' }],
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateContent({ logoUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden border-s border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200/80 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('customize')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AccordionSection title={t('calendarType')} icon={<CalendarDays className="h-4 w-4 text-blue-500" />}>
          <div className="grid grid-cols-2 gap-2">
            {(['monthly', 'yearly'] as CalendarView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => updateState({ view: v })}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  state.view === v
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {t(v)}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            {(['gregorian', 'hijri', 'both'] as CalendarSystem[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSystemChange(s)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  state.system === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t('dateSelection')} icon={<CalendarDays className="h-4 w-4 text-emerald-500" />}>
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => nav(-1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-center text-sm font-semibold text-slate-800 dark:text-slate-200">
              {navLabel}
            </span>
            <button type="button" onClick={() => nav(1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">{t('gregorianYear')}</label>
              <select
                value={state.gregorianYear}
                onChange={(e) => updateState({ gregorianYear: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {gregorianYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">{t('hijriYear')}</label>
              <select
                value={state.hijriYear}
                onChange={(e) => updateState({ hijriYear: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {hijriYears.map((y) => (
                  <option key={y} value={y}>{formatHijriYearOption(y, locale)}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-slate-500">{t('month')}</label>
              <select
                value={state.month}
                onChange={(e) => updateState({ month: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {months.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title={t('colors')} icon={<Palette className="h-4 w-4 text-pink-500" />}>
          <div className="space-y-2.5">
            {(Object.keys(state.colors) as (keyof typeof state.colors)[])
              .filter((key) => key !== 'weekdayNames')
              .map((key) => (
              <ColorInput
                key={key}
                label={t(key as 'pageBackground')}
                value={state.colors[key]}
                onChange={(v) => updateColors(key, v)}
              />
            ))}
          </div>
        </AccordionSection>

        <WeekdaySection />

        <AccordionSection title={t('fonts')} icon={<Type className="h-4 w-4 text-violet-500" />}>
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('fontFamily')}</label>
            <select
              value={state.fonts.family}
              onChange={(e) => updateFonts({ family: e.target.value as FontFamily })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <SliderInput label={t('fontSize')} value={state.fonts.size} min={10} max={24} onChange={(v) => updateFonts({ size: v })} unit="px" />
          <SliderInput label={t('fontWeight')} value={state.fonts.weight} min={300} max={700} step={100} onChange={(v) => updateFonts({ weight: v })} />
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('textAlign')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['right', 'center', 'left'] as TextAlign[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateFonts({ align })}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
                    state.fonts.align === align ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {t(align === 'right' ? 'alignRight' : align === 'center' ? 'alignCenter' : 'alignLeft')}
                </button>
              ))}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title={t('design')} icon={<Layout className="h-4 w-4 text-orange-500" />}>
          <SliderInput label={t('borderRadius')} value={state.design.borderRadius} min={0} max={24} onChange={(v) => updateDesign({ borderRadius: v })} unit="px" />
          <ToggleInput label={t('showBorders')} checked={state.design.showBorders} onChange={(v) => updateDesign({ showBorders: v })} />
          <SliderInput label={t('cellGap')} value={state.design.cellGap} min={0} max={12} onChange={(v) => updateDesign({ cellGap: v })} unit="px" />
          <SliderInput label={t('cellSize')} value={state.design.cellSize} min={32} max={80} onChange={(v) => updateDesign({ cellSize: v })} unit="px" />
          <ToggleInput label={t('showShadow')} checked={state.design.showShadow} onChange={(v) => updateDesign({ showShadow: v })} />
          <SliderInput label={t('scale')} value={state.design.scale} min={60} max={120} onChange={(v) => updateDesign({ scale: v })} unit="%" />
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('designStyle')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {DESIGN_STYLE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => updateDesign({ style: s.value as DesignStyle })}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
                    state.design.style === s.value ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {t(s.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('orientation')}</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['portrait', 'landscape'] as Orientation[]).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => updateDesign({ orientation: o })}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
                    state.design.orientation === o ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {t(o)}
                </button>
              ))}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title={t('content')} icon={<FileText className="h-4 w-4 text-cyan-500" />}>
          <input
            type="text"
            placeholder={t('customTitle')}
            value={state.content.customTitle}
            onChange={(e) => updateContent({ customTitle: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <input
            type="text"
            placeholder={t('quote')}
            value={state.content.quote}
            onChange={(e) => updateContent({ quote: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('logo')}</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-xs" />
          </div>
          <ToggleInput label={t('showWeekNumbers')} checked={state.content.showWeekNumbers} onChange={(v) => updateContent({ showWeekNumbers: v })} />
          <div>
            <label className="mb-1 block text-xs text-slate-500">{t('weekStart')}</label>
            <select
              value={state.content.weekStart}
              onChange={(e) => updateContent({ weekStart: e.target.value as WeekStart })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {WEEK_START_OPTIONS.map((w) => (
                <option key={w.value} value={w.value}>{t(w.labelKey)}</option>
              ))}
            </select>
          </div>
        </AccordionSection>

        <AccordionSection title={t('events')} icon={<FileText className="h-4 w-4 text-red-400" />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addEvent} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white">{t('addEvent')}</button>
            <button type="button" onClick={addNote} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs dark:bg-slate-700">{t('addNote')}</button>
            <button type="button" onClick={addHighlight} className="rounded-lg bg-amber-200 px-3 py-1.5 text-xs">{t('highlightDay')}</button>
          </div>
          {state.events.map((event, i) => (
            <div key={event.id} className="space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              <input
                type="date"
                value={event.date}
                onChange={(e) => {
                  const events = [...state.events];
                  events[i] = { ...event, date: e.target.value };
                  updateState({ events });
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
              />
              <input
                type="text"
                value={event.title}
                placeholder={t('eventTitle')}
                onChange={(e) => {
                  const events = [...state.events];
                  events[i] = { ...event, title: e.target.value };
                  updateState({ events });
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => updateState({ events: state.events.filter((e) => e.id !== event.id) })}
                className="text-xs text-red-500"
              >
                {t('delete')}
              </button>
            </div>
          ))}
          {state.notes.map((note, i) => (
            <div key={note.date + i} className="space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
              <input
                type="date"
                value={note.date}
                onChange={(e) => {
                  const notes = [...state.notes];
                  notes[i] = { ...note, date: e.target.value };
                  updateState({ notes });
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
              />
              <input
                type="text"
                value={note.text}
                placeholder={t('noteText')}
                onChange={(e) => {
                  const notes = [...state.notes];
                  notes[i] = { ...note, text: e.target.value };
                  updateState({ notes });
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => updateState({ notes: state.notes.filter((_, idx) => idx !== i) })}
                className="text-xs text-red-500"
              >
                {t('delete')}
              </button>
            </div>
          ))}
        </AccordionSection>

        <AccordionSection title={t('templates')} icon={<LayoutTemplate className="h-4 w-4 text-indigo-500" />}>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-blue-600"
              >
                <div
                  className="h-8 w-full rounded-lg"
                  style={{ backgroundColor: template.preview }}
                />
                <span className="text-[0.65rem] font-medium text-slate-600 group-hover:text-blue-600 dark:text-slate-400">
                  {t(template.nameKey as TranslationKey)}
                </span>
              </button>
            ))}
          </div>
        </AccordionSection>
      </div>
    </aside>
  );
}
