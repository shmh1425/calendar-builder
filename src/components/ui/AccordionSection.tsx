import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({ title, icon, defaultOpen = true, children }: AccordionSectionProps) {
  return (
    <details open={defaultOpen} className="group border-b border-slate-200/80 dark:border-slate-700/80 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/50 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 px-4 pb-4">{children}</div>
    </details>
  );
}
