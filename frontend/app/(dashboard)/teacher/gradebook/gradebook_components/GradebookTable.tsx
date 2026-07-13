import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GradebookEntry } from '../gradebook_types';

interface Props {
  filteredEntries: GradebookEntry[];
  isEditing: boolean;
  editMap: Record<string, GradebookEntry>;
  handleCellChange: (id: string, field: keyof GradebookEntry, value: string) => void;
  handleOpenDetails: (entry: GradebookEntry) => void;
}

export function GradebookTable({ filteredEntries, isEditing, editMap, handleCellChange, handleOpenDetails }: Props) {
  const fields: Array<{key: keyof GradebookEntry, label: string}> = [
    { key: 'unitTest1', label: 'UT 1 (25)' },
    { key: 'unitTest2', label: 'UT 2 (25)' },
    { key: 'midTerm', label: 'Mid Term (100)' },
    { key: 'assignment', label: 'Assignment (25)' },
    { key: 'practical', label: 'Practical (50)' }
  ];

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border)] overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-input)] border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Roll No</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Student Name</th>
              {fields.map(f => (
                <th key={f.key} className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">{f.label}</th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Total (225)</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Percentage</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Grade</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-[var(--text-secondary)] uppercase whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(e => {
              const isItemEditing = isEditing && editMap[e.id];
              const activeData = isItemEditing ? editMap[e.id] : e;
              return (
                <tr key={e.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-input)]">
                  <td className="px-4 py-3.5 font-mono text-xs text-[var(--text-secondary)]">{activeData.rollNo}</td>
                  <td className="px-4 py-3.5 font-semibold text-[var(--text-primary)] text-xs">{activeData.studentName}</td>
                  {fields.map(f => (
                    <td key={f.key} className="px-4 py-3.5">
                      {isItemEditing ? (
                        <input
                          type="number"
                          value={activeData[f.key] === 0 ? '' : activeData[f.key]}
                          onChange={el => handleCellChange(e.id, f.key, el.target.value)}
                          className="w-16 h-8 px-2 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                      ) : (
                        <span className="text-xs text-[var(--text-primary)] font-medium">{activeData[f.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-xs text-[var(--text-primary)] font-bold">
                    {activeData.totalScore}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[var(--text-secondary)] font-semibold">
                    {activeData.percentage}%
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge className={activeData.percentage && activeData.percentage >= 40 ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]' : 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]'}>
                      {activeData.grade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Button size="sm" variant="ghost" onClick={() => handleOpenDetails(activeData)} className="text-[var(--primary)] hover:bg-[var(--primary-subtle)] text-xs font-bold h-8">
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-[var(--text-secondary)] text-xs">No student grade records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
