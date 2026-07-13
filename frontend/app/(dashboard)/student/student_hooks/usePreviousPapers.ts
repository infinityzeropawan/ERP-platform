import { useState } from 'react';

export type PreviousPaper = {
  id: string;
  subject: string;
  year: string;
  examType: string;
  downloadUrl: string;
  pages: number;
};

export function usePreviousPapers() {
  const [filter, setFilter] = useState('All');
  const subjects: string[] = ['All']; // Could fetch from a resource if available
  const papers: PreviousPaper[] = []; // Dummy data

  const filtered = filter === 'All' ? papers : papers.filter(p => p.subject === filter);

  return {
    filter,
    setFilter,
    subjects,
    filtered
  };
}
