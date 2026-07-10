'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Play, FileText, File, Link2, Filter, Sparkles } from 'lucide-react';

const typeConfig = {
  pdf:   { icon: FileText, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'PDF' },
  video: { icon: Play,     color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Video' },
  doc:   { icon: FileText, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'DOC' },
  ppt:   { icon: File,     color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'PPT' },
  link:  { icon: Link2,    color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200',   label: 'Link' },
};

export default function StudyMaterialPage() {
  const [subject, setSubject] = useState('All');
  type SM = { id: string; subjectCode: string; subjectName: string; title: string; description: string; type: 'pdf'|'video'|'doc'|'ppt'|'link'; fileUrl: string; fileSize?: string; uploadedBy: string; uploadedAt: string; chapter?: string; isNew?: boolean; };
  const subjects: string[] = ['All'];
  const filtered: SM[] = [];
  const newCount = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-teal-600" />Study Materials
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Notes, slides, videos and resources from your teachers</p>
        </div>
        {newCount > 0 && (
          <Badge variant="info" className="flex items-center gap-1 animate-bounce-in">
            <Sparkles className="h-3 w-3" />{newCount} New
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files',  value: 0, color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
          { label: 'PDFs',         value: 0, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
          { label: 'Videos',       value: 0, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'New This Week',value: 0, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Subject filter */}
      <div className="flex items-center gap-2 flex-wrap animate-fade-in delay-200">
        <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
        {subjects.map(s => (
          <button key={s} onClick={() => setSubject(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${subject === s ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Materials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m: SM, i) => {
          const cfg = typeConfig[m.type];
          const Icon = cfg.icon;
          return (
            <div key={m.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 card-hover overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              {/* Top accent */}
              <div className={`h-1 w-full bg-gradient-to-r ${m.type === 'pdf' ? 'from-red-400 to-red-600' : m.type === 'video' ? 'from-purple-400 to-purple-600' : m.type === 'ppt' ? 'from-orange-400 to-orange-600' : 'from-blue-400 to-blue-600'}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${cfg.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {m.isNew && <Badge variant="info" className="text-[10px] py-0">New</Badge>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{cfg.label}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{m.title}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{m.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">📚 {m.chapter || 'General'}</span>
                  <span>{m.fileSize || 'Stream'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">By {m.uploadedBy.split(' ')[0]}</span>
                  <a href={m.fileUrl}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all group-hover:shadow-md ${m.type === 'video' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    {m.type === 'video' ? <><Play className="h-3 w-3" />Watch</> : <><Download className="h-3 w-3" />Download</>}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
