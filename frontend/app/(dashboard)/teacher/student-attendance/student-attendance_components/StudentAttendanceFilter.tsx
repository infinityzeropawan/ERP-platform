import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { AttendanceFilter } from '../student-attendance_types';

interface Props {
  filter: AttendanceFilter;
  setFilter: (f: AttendanceFilter) => void;
  onGenerate: () => void;
}

export function StudentAttendanceFilter({ filter, setFilter, onGenerate }: Props) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
          <BarChart3 className="h-4 w-4 text-[var(--primary)]" />Filter & Generate Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Session</label>
            <Select value={filter.session} onValueChange={(v) => setFilter({ ...filter, session: v })}>
              <SelectItem value="2026-2027">2026-2027</SelectItem>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Class</label>
            <Select value={filter.cls} onValueChange={(v) => setFilter({ ...filter, cls: v })} placeholder="Select Class">
              <SelectItem value="IOT-2026">IOT-2026</SelectItem>
              <SelectItem value="CS-2026">CS-2026</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Section</label>
            <Select value={filter.section} onValueChange={(v) => setFilter({ ...filter, section: v })} placeholder="Select Section">
              <SelectItem value="Evening">Evening</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Month</label>
            <Select value={filter.month} onValueChange={(v) => setFilter({ ...filter, month: v })} placeholder="Month">
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Year</label>
            <Select value={filter.year} onValueChange={(v) => setFilter({ ...filter, year: v })}>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </Select>
          </div>
          <Button onClick={onGenerate} className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <BarChart3 className="h-4 w-4" />Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
