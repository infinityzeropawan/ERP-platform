'use client';
import { ResourceState } from '@/lib/useResource';
import { useOnlineClasses } from '../online-classes_hooks/useOnlineClasses';
import { OnlineClassesHeader } from './OnlineClassesHeader';
import { OnlineClassesStats } from './OnlineClassesStats';
import { OnlineClassesList } from './OnlineClassesList';
import { OnlineClassesModals } from './OnlineClassesModals';

export function OnlineClassesMain() {
  const {
    loading, error,
    live, upcoming, completed,
    open, setOpen,
    form, setForm,
    handleCreate, deleteClass
  } = useOnlineClasses();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <OnlineClassesHeader onOpenCreate={() => setOpen(true)} />
      <OnlineClassesStats 
        liveCount={live.length} 
        upcomingCount={upcoming.length} 
        completedCount={completed.length} 
      />
      <OnlineClassesList 
        live={live} 
        upcoming={upcoming} 
        completed={completed} 
        onDelete={deleteClass} 
      />
      <OnlineClassesModals 
        open={open} 
        setOpen={setOpen} 
        form={form} 
        setForm={setForm} 
        handleCreate={handleCreate} 
      />
    </div>
  );
}
