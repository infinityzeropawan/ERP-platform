// RESPONSIBILITY: Main client component for the Syllabus module, orchestrating state and child components.
"use client";

import { ResourceState } from '@/lib/useResource';
import { useSyllabus } from '../syllabus_hooks/useSyllabus';
import SyllabusHeader from './SyllabusHeader';
import SyllabusSubjectCard from './SyllabusSubjectCard';
import SyllabusEmptyState from './SyllabusEmptyState';
import SyllabusFormModal from './SyllabusFormModal';

export default function SyllabusClient() {
  const {
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
  } = useSyllabus();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <SyllabusHeader onAddUnit={handleOpenAdd} />

      {subjects.map((subject) => {
        const subjectUnits = units.filter((u) => u.subject === subject);
        return (
          <SyllabusSubjectCard
            key={subject}
            subject={subject}
            units={subjectUnits}
            onUpdateStatus={handleUpdateStatus}
            onEdit={handleOpenEdit}
          />
        );
      })}

      {units.length === 0 && <SyllabusEmptyState />}

      <SyllabusFormModal
        open={open}
        editId={editId}
        form={form}
        setForm={setForm}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
}
