import { GraduationCap, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  total: number;
  search: string;
  setSearch: (s: string) => void;
}

export function StudentsHeader({ total, search, setSearch }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-[var(--primary)]" />Student Directory
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">{total} students in your class</p>
      </div>
      <div className="relative w-64">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <Input 
          placeholder="Search students..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pl-8 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" 
        />
      </div>
    </div>
  );
}
