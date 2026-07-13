'use client';
import { useAssignments } from '../assignments_hooks/useAssignments';
import { ResourceState } from '@/lib/useResource';
import { AssignmentsHeader } from './AssignmentsHeader';
import { AssignmentsList } from './AssignmentsList';
import { CreateAssignmentModal } from './CreateAssignmentModal';

export function AssignmentsMain() {
  const {
    assignments,
    loading,
    error,
    open,
    setOpen,
    form,
    setForm,
    handleCreate
  } = useAssignments();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <AssignmentsHeader onOpenCreate={() => setOpen(true)} />
      <AssignmentsList assignments={assignments} />
      <CreateAssignmentModal 
        open={open} 
        onOpenChange={setOpen} 
        form={form} 
        setForm={setForm} 
        handleCreate={handleCreate} 
      />
    </div>
  );
}
