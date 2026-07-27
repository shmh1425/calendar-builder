import { isValidHex, normalizeHex } from '../../utils/calendarData';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ label, value, onChange }: ColorInputProps) {
  const handleHexChange = (hex: string) => {
    if (hex === '' || hex === '#') {
      onChange(hex);
      return;
    }
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    if (isValidHex(normalized) || normalized.length <= 7) {
      onChange(normalized);
    }
  };

  const handleBlur = () => {
    if (isValidHex(value)) {
      onChange(normalizeHex(value));
    }
  };

  const pickerValue = isValidHex(value) ? normalizeHex(value) : '#000000';

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0.5 dark:border-slate-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexChange(e.target.value)}
          onBlur={handleBlur}
          maxLength={7}
          className="w-[72px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-mono uppercase text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-blue-900"
        />
      </div>
    </div>
  );
}
