import { Filter } from 'lucide-react';

interface Props {
  filter: string;
  setFilter: (f: string) => void;
  subjects: string[];
}

export function PreviousPapersFilter({ filter, setFilter, subjects }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="h-4 w-4 text-[var(--text-secondary)]" />
      {subjects.map(s => (
        <button key={s} onClick={() => setFilter(s)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'}`}>
          {s}
        </button>
      ))}
    </div>
  );
}
