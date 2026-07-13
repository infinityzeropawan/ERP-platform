import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
  selectedClass: string;
  setSelectedClass: (v: string) => void;
  selectedSection: string;
  setSelectedSection: (v: string) => void;
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export function GradebookFilters({
  selectedClass, setSelectedClass,
  selectedSection, setSelectedSection,
  selectedSubject, setSelectedSubject,
  searchQuery, setSearchQuery
}: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="Class-X">Class-X</option>
              <option value="Class-XI">Class-XI</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="IOT & Embedded Systems">IOT & Embedded Systems</option>
              <option value="Embedded C Programming">Embedded C Programming</option>
              <option value="Network Protocols">Network Protocols</option>
            </select>
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search by student or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
