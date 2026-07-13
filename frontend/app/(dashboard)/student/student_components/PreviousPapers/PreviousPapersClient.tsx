'use client';

import { FileQuestion, Download, Filter } from 'lucide-react';
import { usePreviousPapers } from '../../student_hooks/usePreviousPapers';
import '../../student.css';

export default function PreviousPapersClient() {
  const { filter, setFilter, subjects, filtered } = usePreviousPapers();

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <FileQuestion className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Previous Papers
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Download past exam papers for practice</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap animate-fade-in-up delay-100">
        <Filter className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} />
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md`}
            style={{
              backgroundColor: filter === s ? 'var(--student-primary)' : 'var(--student-bg-card)',
              color: filter === s ? 'white' : 'var(--student-text-primary)',
              borderColor: filter === s ? 'var(--student-primary)' : 'var(--student-border)',
              borderWidth: '1px'
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up delay-200">
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group"
               style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                     style={{ backgroundColor: 'var(--student-primary-subtle)', borderColor: 'var(--student-primary)', color: 'var(--student-primary)' }}>
                  <FileQuestion className="h-6 w-6" />
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-lg border"
                      style={{ color: 'var(--student-info)', backgroundColor: 'var(--student-info-bg)', borderColor: 'var(--student-info)' }}>
                  {p.year}
                </span>
              </div>
              <h3 className="text-base font-bold mb-2 leading-tight" style={{ color: 'var(--student-text-primary)' }}>{p.subject}</h3>
              <p className="text-xs font-medium mb-5" style={{ color: 'var(--student-text-secondary)' }}>{p.examType} · {p.pages} pages</p>
              
              <a href={p.downloadUrl}
                className="flex items-center justify-center gap-2 w-full py-3 text-white rounded-xl text-sm font-bold transition-opacity hover:opacity-90 shadow-md group-hover:shadow-lg"
                style={{ backgroundColor: 'var(--student-primary)' }}>
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm font-medium rounded-2xl border border-dashed"
               style={{ color: 'var(--student-text-disabled)', backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
            No previous papers available for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
