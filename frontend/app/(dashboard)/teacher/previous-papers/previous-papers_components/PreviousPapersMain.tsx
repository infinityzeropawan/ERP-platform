'use client';
import { usePreviousPapers } from '../previous-papers_hooks/usePreviousPapers';
import { PreviousPapersHeader } from './PreviousPapersHeader';
import { PreviousPapersFilter } from './PreviousPapersFilter';
import { PreviousPapersList } from './PreviousPapersList';
import { PreviousPapersModals } from './PreviousPapersModals';

export function PreviousPapersMain() {
  const {
    papers,
    open, setOpen,
    filter, setFilter,
    form, setForm,
    subjects,
    filtered,
    handleUpload,
    deletePaper
  } = usePreviousPapers();

  return (
    <div className="space-y-6">
      <PreviousPapersHeader onOpenCreate={() => setOpen(true)} />
      <PreviousPapersFilter filter={filter} setFilter={setFilter} subjects={subjects} />
      <PreviousPapersList papers={filtered} onDelete={deletePaper} />
      <PreviousPapersModals open={open} setOpen={setOpen} form={form} setForm={setForm} handleUpload={handleUpload} />
    </div>
  );
}
