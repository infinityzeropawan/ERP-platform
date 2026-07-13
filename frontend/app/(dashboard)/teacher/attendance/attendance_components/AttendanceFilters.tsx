import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Calendar, Users } from 'lucide-react';

interface Props {
  date: string;
  setDate: (v: string) => void;
  period: string;
  setPeriod: (v: string) => void;
  handleFetch: () => void;
}

export function AttendanceFilters({ date, setDate, period, setPeriod, handleFetch }: Props) {
  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)]">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1"><Calendar className="h-3 w-3" />Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Select Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectItem value="morning">Morning Period (9:00am)</SelectItem>
              <SelectItem value="afternoon">Afternoon Period (2:00pm)</SelectItem>
              <SelectItem value="evening">Evening Period (8:30pm)</SelectItem>
            </Select>
          </div>
          <Button onClick={handleFetch} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
            <Users className="h-4 w-4" />Fetch Students
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
