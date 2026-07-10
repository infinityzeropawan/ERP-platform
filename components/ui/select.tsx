'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children, placeholder, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = React.Children.toArray(children) as React.ReactElement<SelectItemProps>[];
  const selected = items.find(i => i.props.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.props.children : placeholder || 'Select...'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {items.map((item) => (
            <div
              key={item.props.value}
              onClick={() => { onValueChange(item.props.value); setOpen(false); }}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm hover:bg-teal-50 hover:text-teal-700',
                item.props.value === value && 'bg-teal-50 text-teal-700 font-medium'
              )}
            >
              {item.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  return <div data-value={value}>{children}</div>;
}
