interface ToggleInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleInput({ label, checked, onChange }: ToggleInputProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? 'start-[22px]' : 'start-0.5'
        }`}
        />
      </button>
    </label>
  );
}
