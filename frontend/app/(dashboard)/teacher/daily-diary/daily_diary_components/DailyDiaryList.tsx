import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit2, Trash2, BookOpen } from 'lucide-react';
import { DiaryEntry } from '../daily_diary_types';

interface Props {
  filteredEntries: DiaryEntry[];
  togglePublish: (e: DiaryEntry) => void;
  handleOpenEdit: (e: DiaryEntry) => void;
  handleOpenDelete: (e: DiaryEntry) => void;
}

export function DailyDiaryList({ filteredEntries, togglePublish, handleOpenEdit, handleOpenDelete }: Props) {
  return (
    <div className="space-y-4">
      {filteredEntries.map(e => (
        <Card key={e.id} className="overflow-hidden hover:shadow-md transition-shadow bg-[var(--bg-card)] border-[var(--border)]">
          <CardHeader className="bg-[var(--primary-subtle)] py-3 border-b border-[var(--border)] flex flex-row items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Badge className={e.isPublished ? 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)] hover:bg-[var(--success-bg)]' : 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]'}>
                {e.isPublished ? 'Published' : 'Draft'}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                <Calendar className="h-3.5 w-3.5" />
                {e.date}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">by {e.teacherName}</div>
              <div className="text-xs font-semibold text-[var(--primary)]">Class: {e.className}-{e.section}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePublish(e)}
                className="text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-input)]"
              >
                {e.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenEdit(e)}
                className="text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-subtle)]"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenDelete(e)}
                className="text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" /> Subject Details
                </h3>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{e.subject}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  📚 Classwork Covered
                </h3>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">{e.classwork || 'No classwork logged.'}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  📝 Homework Assigned
                </h3>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">{e.homework || 'No homework assigned.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredEntries.length === 0 && (
        <Card className="p-8 text-center text-[var(--text-secondary)] text-xs border-dashed border-[var(--border)] bg-[var(--bg-card)]">
          No class diary entries found matching the selection.
        </Card>
      )}
    </div>
  );
}
