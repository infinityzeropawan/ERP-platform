import { Check, Download, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isEditing: boolean;
  exportSuccess: boolean;
  triggerExport: () => void;
  handleStartEdit: () => void;
  handleSaveAll: () => void;
}

export function GradebookHeader({ isEditing, exportSuccess, triggerExport, handleStartEdit, handleSaveAll }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Academic Gradebook</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">Aggregate scores, view performance statistics, and publish final marks.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={triggerExport} className="flex items-center gap-2 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)]">
          {exportSuccess ? <Check className="h-4 w-4 text-[var(--success)]" /> : <Download className="h-4 w-4" />}
          {exportSuccess ? 'Exported CSV!' : 'Export Gradebook'}
        </Button>
        {isEditing ? (
          <Button onClick={handleSaveAll} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Grades
          </Button>
        ) : (
          <Button onClick={handleStartEdit} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> Quick Edit Mode
          </Button>
        )}
      </div>
    </div>
  );
}
