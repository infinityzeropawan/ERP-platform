import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Student } from '../students_types';

interface Props {
  students: Student[];
}

export function StudentsList({ students }: Props) {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-card)]">
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-input)] border-b border-[var(--border)]">
            <tr>
              {['Student', 'Roll No', 'Class', 'Email'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{s.rollNo || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant="default" className="bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-bg)] hover:bg-[var(--info-bg)] hover:opacity-90">{s.class || '—'}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{s.email}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--text-secondary)] text-sm">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
