import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SubjectOption } from '../daily_diary_types';

interface Props {
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  subjectOptions: SubjectOption[];
}

export function DailyDiaryFilters({ selectedSubject, setSelectedSubject, searchQuery, setSearchQuery, subjectOptions }: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Filter Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Subjects</option>
            {subjectOptions.map(o => (
              <option key={o.code} value={o.code}>{o.name}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search diary logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
