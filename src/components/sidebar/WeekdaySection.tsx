import { Bookmark, CalendarRange } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useApp } from '../../context/AppContext';
import { AccordionSection } from '../ui/AccordionSection';
import { ColorInput } from '../ui/ColorInput';
import { SliderInput } from '../ui/SliderInput';
import { ToggleInput } from '../ui/ToggleInput';
import {
  WEEKDAY_LABELS_AR,
  WEEKDAY_LABELS_EN,
  WEEKDAY_STYLE_OPTIONS,
  getPresetNames,
} from '../../constants/weekdayPresets';
import { FONT_OPTIONS } from '../../constants/defaults';
import { saveWeekdayDefault } from '../../utils/storage';
import type { FontFamily, WeekdayNameStyle, WeekdaySettings } from '../../types/calendar';
import type { TranslationKey } from '../../i18n/translations';

export function WeekdaySection() {
  const { state, updateState } = useCalendar();
  const { t, locale, showToast } = useApp();
  const wd = state.content.weekdays;
  const dayLabels = locale === 'ar' ? WEEKDAY_LABELS_AR : WEEKDAY_LABELS_EN;

  const updateWeekdays = (partial: Partial<WeekdaySettings>) => {
    updateState({
      content: {
        ...state.content,
        weekdays: { ...wd, ...partial },
      },
    });
  };

  const applyStyle = (style: WeekdayNameStyle) => {
    const names = style === 'custom' ? wd.customNames : getPresetNames(style, locale);
    updateWeekdays({ style, customNames: [...names] });
  };

  const updateCustomName = (index: number, value: string) => {
    const customNames = [...wd.customNames];
    customNames[index] = value;
    updateWeekdays({ style: 'custom', customNames });
  };

  const handleSaveDefault = () => {
    saveWeekdayDefault(wd);
    showToast(t('weekdayDefaultSaved'));
  };

  return (
    <AccordionSection
      title={t('weekdayCustomization')}
      icon={<CalendarRange className="h-4 w-4 text-teal-500" />}
    >
      <ToggleInput
        label={t('showWeekdayNames')}
        checked={wd.show}
        onChange={(show) => updateWeekdays({ show })}
      />

      <div>
        <label className="mb-2 block text-xs font-medium text-slate-500">{t('weekdayStyleLabel')}</label>
        <div className="grid grid-cols-2 gap-1.5">
          {WEEKDAY_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => applyStyle(opt.value)}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
                wd.style === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t(opt.labelKey as TranslationKey)}
            </button>
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 text-center font-mono text-[0.65rem] text-slate-500 dark:bg-slate-800/50">
          {resolvePreview(wd, locale).join(' · ')}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-500">{t('editWeekdayNames')}</label>
        {dayLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[0.65rem] text-slate-400">{label}</span>
              <input
                type="text"
                value={wd.customNames[i] ?? ''}
                onChange={(e) => updateCustomName(i, e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          ))}
      </div>

      <ToggleInput
        label={t('useCustomWeekdayColor')}
        checked={wd.useCustomColor}
        onChange={(useCustomColor) => updateWeekdays({ useCustomColor })}
      />
      {wd.useCustomColor && (
        <ColorInput
          label={t('weekdayColor')}
          value={wd.color}
          onChange={(color) => updateWeekdays({ color })}
        />
      )}

      <ToggleInput
        label={t('useCustomWeekdayFont')}
        checked={wd.useCustomFont}
        onChange={(useCustomFont) => updateWeekdays({ useCustomFont })}
      />
      {wd.useCustomFont && (
        <div>
          <label className="mb-1 block text-xs text-slate-500">{t('fontFamily')}</label>
          <select
            value={wd.fontFamily}
            onChange={(e) => updateWeekdays({ fontFamily: e.target.value as FontFamily })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      )}

      <SliderInput
        label={t('weekdayFontSize')}
        value={wd.fontSize}
        min={8}
        max={18}
        onChange={(fontSize) => updateWeekdays({ fontSize })}
        unit="px"
      />
      <SliderInput
        label={t('weekdayFontWeight')}
        value={wd.fontWeight}
        min={300}
        max={700}
        step={100}
        onChange={(fontWeight) => updateWeekdays({ fontWeight })}
      />
      <SliderInput
        label={t('weekdayGap')}
        value={wd.gap}
        min={0}
        max={12}
        onChange={(gap) => updateWeekdays({ gap })}
        unit="px"
      />

      <button
        type="button"
        onClick={handleSaveDefault}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
      >
        <Bookmark className="h-4 w-4" />
        {t('saveWeekdayDefault')}
      </button>
    </AccordionSection>
  );
}

function resolvePreview(wd: WeekdaySettings, locale: 'ar' | 'en'): string[] {
  if (wd.style === 'custom') return wd.customNames;
  return getPresetNames(wd.style, locale);
}
