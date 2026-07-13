import { useState, useCallback } from 'react';
import { useResource } from '@/lib/useResource';
import { SyllabusUnit, SyllabusFormState, SyllabusStatus } from '../syllabus_types/syllabus_types';
import { SYLLABUS_API_ENDPOINTS } from '../syllabus_url_config';

/**
 * Custom hook to manage syllabus state and logic.
 * Handles fetching, creating, updating, and formatting syllabus units.
 */
export function useSyllabus() {
  const { data: units, loading, error, create, update } = useResource<SyllabusUnit>(SYLLABUS_API_ENDPOINTS.BASE);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SyllabusFormState>({
    subject: '',
    subjectCode: '',
    unitTitle: '',
    topics: '',
    totalHours: '',
    completedHours: '',
    status: 'pending',
  });

  const subjects = [...new Set(units.map((u) => u.subject))];

  const handleOpenEdit = useCallback((u: SyllabusUnit) => {
    setEditId(u.id);
    setForm({
      subject: u.subject,
      subjectCode: u.subjectCode,
      unitTitle: u.unitTitle,
      topics: u.topics.join(', '),
      totalHours: String(u.totalHours),
      completedHours: String(u.completedHours),
      status: u.status,
    });
    setOpen(true);
  }, []);

  const handleOpenAdd = useCallback(() => {
    setEditId(null);
    setForm({ subject: '', subjectCode: '', unitTitle: '', topics: '', totalHours: '', completedHours: '', status: 'pending' });
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setEditId(null);
  }, []);

  const handleSave = async () => {
    if (!form.subject || !form.unitTitle) return;
    const topicsArr = form.topics.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (editId) {
        await update(editId, {
          subject: form.subject,
          subjectCode: form.subjectCode,
          unitTitle: form.unitTitle,
          topics: topicsArr,
          totalHours: Number(form.totalHours) || 0,
          completedHours: Number(form.completedHours) || 0,
          status: form.status,
        });
      } else {
        const maxUnit = Math.max(0, ...units.filter((u) => u.subject === form.subject).map((u) => u.unitNo));
        await create({
          subject: form.subject,
          subjectCode: form.subjectCode,
          unitNo: maxUnit + 1,
          unitTitle: form.unitTitle,
          topics: topicsArr,
          totalHours: Number(form.totalHours) || 0,
          completedHours: Number(form.completedHours) || 0,
          status: form.status,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      alert(`Error saving syllabus unit: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (id: string, status: SyllabusStatus) => {
    const unit = units.find((u) => u.id === id);
    if (!unit) return;
    try {
      await update(id, {
        status,
        completedHours: status === 'completed' ? unit.totalHours : unit.completedHours,
      });
    } catch (err: any) {
      alert(`Error updating unit status: ${err.message}`);
    }
  };

  return {
    units,
    subjects,
    loading,
    error,
    open,
    editId,
    form,
    setForm,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleUpdateStatus,
  };
}
