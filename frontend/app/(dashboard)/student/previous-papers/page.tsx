'use client';
import { FileQuestion, Download, BookOpen, Filter } from 'lucide-react';
import { useState } from 'react';

export default function PreviousPapersPage() {
  const [filter, setFilter] = useState('All');
  const subjects: string[] = ['All'];
  type PP = { id: string; subject: string; year: string; examType: string; downloadUrl: string; pages: number; };
  const filtered: PP[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileQuestion className="h-6 w-6 text-teal-600" />Previous Papers</h1>
        <p className="text-gray-500 text-sm mt-0.5">Download past exam papers for practice</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-400" />
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <FileQuestion className="h-6 w-6 text-teal-600" />
                </div>
                <span className="px-2 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold rounded-lg">{p.year}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{p.subject}</h3>
              <p className="text-xs text-gray-500 mb-3">{p.examType} · {p.pages} pages</p>
              <a href={p.downloadUrl}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all group-hover:shadow-lg">
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
