'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

type PreviousPaper = { id: string; subject: string; year: string; examType: string; downloadUrl: string; pages: number; };
import { FileQuestion, Plus, Download, Trash2, Filter } from 'lucide-react';

export default function TeacherPreviousPapersPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileQuestion className="h-6 w-6 text-teal-600" />Previous Papers</h1>
          <p className="text-gray-500 text-sm mt-0.5">Upload and manage previous year question papers</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Upload Paper</Button>
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
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold rounded-lg">{p.year}</span>
                  <button onClick={() => deletePaper(p.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{p.subject}</h3>
              <p className="text-xs text-gray-500 mb-3">{p.examType}{p.pages > 0 ? ` · ${p.pages} pages` : ''}</p>
              <a href={p.downloadUrl}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all">
                <Download className="h-4 w-4" />Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader><DialogTitle>Upload Previous Paper</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label>
              <Select value={form.subject} onValueChange={v => setForm(p => ({ ...p, subject: v }))} placeholder="Select Subject">
                <SelectItem value="IOT & Embedded Systems">IOT & Embedded Systems</SelectItem>
                <SelectItem value="Embedded C Programming">Embedded C Programming</SelectItem>
                <SelectItem value="Network Protocols">Network Protocols</SelectItem>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Year *</label><Input placeholder="2025" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Pages</label><Input type="number" placeholder="8" value={form.pages} onChange={e => setForm(p => ({ ...p, pages: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Exam Type *</label>
              <Select value={form.examType} onValueChange={v => setForm(p => ({ ...p, examType: v }))} placeholder="Select type">
                <SelectItem value="Final Exam">Final Exam</SelectItem>
                <SelectItem value="Mid Term">Mid Term</SelectItem>
                <SelectItem value="Unit Test">Unit Test</SelectItem>
              </Select>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <FileQuestion className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Click to upload PDF file</p>
              <p className="text-xs text-gray-300 mt-1">(File upload will work when backend is connected)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload Paper</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
