interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderInput({ label, value, min, max, step = 1, unit = '', onChange }: SliderInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 dark:bg-slate-700"
      />
    </div>
  );
}
