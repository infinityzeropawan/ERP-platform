// RESPONSIBILITY: Renders the modal form to add or edit a syllabus unit.
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SyllabusFormState, SyllabusStatus } from '../syllabus_types/syllabus_types';

export interface SyllabusFormModalProps {
  open: boolean;
  editId: string | null;
  form: SyllabusFormState;
  setForm: React.Dispatch<React.SetStateAction<SyllabusFormState>>;
  onClose: () => void;
  onSave: () => void;
}

export default function SyllabusFormModal({
  open,
  editId,
  form,
  setForm,
  onClose,
  onSave,
}: SyllabusFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full max-w-lg bg-bg-card border-border z-40">
        <DialogHeader>
          <DialogTitle className="text-text-primary text-lg font-bold">
            {editId ? 'Edit Unit' : 'Add Syllabus Unit'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Subject *</label>
              <Input
                placeholder="IOT & Embedded Systems"
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                className="bg-bg-input border-border text-text-primary focus:border-border-focus"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Subject Code</label>
              <Input
                placeholder="IOT101"
                value={form.subjectCode}
                onChange={(e) => setForm((p) => ({ ...p, subjectCode: e.target.value }))}
                className="bg-bg-input border-border text-text-primary focus:border-border-focus"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Unit Title *</label>
            <Input
              placeholder="Introduction to IoT"
              value={form.unitTitle}
              onChange={(e) => setForm((p) => ({ ...p, unitTitle: e.target.value }))}
              className="bg-bg-input border-border text-text-primary focus:border-border-focus"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Topics (comma separated)</label>
            <Input
              placeholder="Sensors, Arduino, MQTT"
              value={form.topics}
              onChange={(e) => setForm((p) => ({ ...p, topics: e.target.value }))}
              className="bg-bg-input border-border text-text-primary focus:border-border-focus"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Total Hours</label>
              <Input
                type="number"
                placeholder="10"
                value={form.totalHours}
                onChange={(e) => setForm((p) => ({ ...p, totalHours: e.target.value }))}
                className="bg-bg-input border-border text-text-primary focus:border-border-focus"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Done Hours</label>
              <Input
                type="number"
                placeholder="0"
                value={form.completedHours}
                onChange={(e) => setForm((p) => ({ ...p, completedHours: e.target.value }))}
                className="bg-bg-input border-border text-text-primary focus:border-border-focus"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Status</label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v as SyllabusStatus }))}
              >
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-border text-text-primary hover:bg-bg-input transition-all duration-200">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!form.subject || !form.unitTitle} className="bg-primary text-white hover:bg-primary-hover transition-all duration-200">
            {editId ? 'Update' : 'Add Unit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
