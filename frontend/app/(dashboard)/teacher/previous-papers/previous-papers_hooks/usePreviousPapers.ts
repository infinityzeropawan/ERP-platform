import { useState } from 'react';
import { PreviousPaper } from '../previous-papers_types';

export function usePreviousPapers() {
  const [papers, setPapers] = useState<PreviousPaper[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ subject: '', year: '', examType: '', pages: '' });

  const subjects = ['All', ...new Set(papers.map(p => p.subject))];
  const filtered = filter === 'All' ? papers : papers.filter(p => p.subject === filter);

  const handleUpload = () => {
    if (!form.subject || !form.year || !form.examType) return;
    setPapers(p => [{
      id: `pp-${Date.now()}`, subject: form.subject, year: form.year,
      examType: form.examType, downloadUrl: '#', pages: Number(form.pages) || 0,
    }, ...p]);
    setForm({ subject: '', year: '', examType: '', pages: '' });
    setOpen(false);
  };

  const deletePaper = (id: string) => setPapers(p => p.filter(pp => pp.id !== id));

  return {
    papers, setPapers,
    open, setOpen,
    filter, setFilter,
    form, setForm,
    subjects,
    filtered,
    handleUpload,
    deletePaper
  };
}
