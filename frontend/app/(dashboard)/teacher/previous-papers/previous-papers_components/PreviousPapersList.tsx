import { FileQuestion, Trash2, Download } from 'lucide-react';
import { PreviousPaper } from '../previous-papers_types';

interface Props {
  papers: PreviousPaper[];
  onDelete: (id: string) => void;
}

export function PreviousPapersList({ papers, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {papers.map(p => (
        <div key={p.id} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-subtle)] flex items-center justify-center">
                <FileQuestion className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 bg-[var(--info-bg)] border border-[var(--info-bg)] text-[var(--info)] text-xs font-semibold rounded-lg">{p.year}</span>
                <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg bg-[var(--danger-bg)] hover:bg-[var(--danger-bg)] text-[var(--danger)] hover:opacity-80 transition-colors border border-[var(--danger-bg)]">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{p.subject}</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{p.examType}{p.pages > 0 ? ` · ${p.pages} pages` : ''}</p>
            <a href={p.downloadUrl}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all">
              <Download className="h-4 w-4" />Download PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
