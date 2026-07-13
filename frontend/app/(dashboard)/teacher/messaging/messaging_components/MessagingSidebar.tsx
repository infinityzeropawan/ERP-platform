import { Search, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Message } from '../messaging_types';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  filtered: Message[];
  selected: Message | null;
  setSelected: (m: Message) => void;
}

export function MessagingSidebar({ search, setSearch, filtered, selected, setSelected }: Props) {
  return (
    <div className="w-80 flex-shrink-0 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] flex flex-col">
      <div className="p-3 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <Input 
            placeholder="Search messages..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-8 h-8 text-xs bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" 
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
        {filtered.map(m => (
          <button 
            key={m.id} 
            onClick={() => setSelected(m)}
            className={`w-full text-left px-4 py-3 hover:bg-[var(--bg-input)] transition-colors ${selected?.id === m.id ? 'bg-[var(--primary-subtle)] border-l-2 border-l-[var(--primary)]' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{m.studentName}</p>
              <span className="text-[10px] text-[var(--text-secondary)]">{new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] truncate">{m.subject}</p>
            <Badge variant="outline" className="mt-1 text-[10px] py-0 capitalize border-[var(--border)] text-[var(--text-primary)]">{m.category}</Badge>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-[var(--text-secondary)]">
            <Mail className="h-8 w-8 text-[var(--text-secondary)] opacity-50" />
            <p className="text-sm">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
