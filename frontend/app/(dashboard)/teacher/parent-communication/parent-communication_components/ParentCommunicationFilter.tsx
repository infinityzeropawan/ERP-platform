import { Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Props {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categories: string[];
}

export function ParentCommunicationFilter({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, categories }: Props) {
  return (
    <Card className="rounded-2xl border-[var(--border)] shadow-sm bg-[var(--bg-card)]">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
            <Filter className="h-4 w-4" /> Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
