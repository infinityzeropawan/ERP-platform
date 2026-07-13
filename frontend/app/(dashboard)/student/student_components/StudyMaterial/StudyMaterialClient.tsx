'use client';

import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Play, FileText, File, Link2, Filter, Sparkles } from 'lucide-react';
import { useStudyMaterial, StudyMaterial } from '../../student_hooks/useStudyMaterial';
import '../../student.css';

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string }> = {
  pdf:   { icon: FileText, label: 'PDF',   color: 'var(--student-danger)',   bg: 'var(--student-danger-bg)',   border: 'var(--student-danger)' },
  video: { icon: Play,     label: 'Video', color: 'var(--student-purple)',   bg: 'var(--student-purple-bg)',   border: 'var(--student-purple)' },
  doc:   { icon: FileText, label: 'DOC',   color: 'var(--student-info)',     bg: 'var(--student-info-bg)',     border: 'var(--student-info)' },
  ppt:   { icon: File,     label: 'PPT',   color: 'var(--student-warning)',  bg: 'var(--student-warning-bg)',  border: 'var(--student-warning)' },
  link:  { icon: Link2,    label: 'Link',  color: 'var(--student-primary)',  bg: 'var(--student-primary-subtle)',  border: 'var(--student-primary)' },
};

export default function StudyMaterialClient() {
  const { subject, setSubject, subjects, filtered, newCount, stats } = useStudyMaterial();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <BookOpen className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Study Materials
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Notes, slides, videos and resources from your teachers</p>
        </div>
        {newCount > 0 && (
          <Badge className="flex items-center gap-1 animate-bounce-in" style={{ backgroundColor: 'var(--student-info-bg)', color: 'var(--student-info)', border: '1px solid var(--student-info)' }}>
            <Sparkles className="h-3 w-3" />{newCount} New
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: stats.totalFiles, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'PDFs', value: stats.pdfCount, color: 'var(--student-danger)', bg: 'var(--student-danger-bg)', border: 'var(--student-danger)' },
          { label: 'Videos', value: stats.videoCount, color: 'var(--student-purple)', bg: 'var(--student-purple-bg)', border: 'var(--student-purple)' },
          { label: 'New This Week', value: stats.newThisWeek, color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-info)' },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 transition-all hover:shadow-md animate-fade-in-up border"
               style={{ backgroundColor: s.bg, borderColor: s.border, animationDelay: `${i * 70}ms` }}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80" style={{ color: s.color }}>{s.label}</p>
            <p className="text-3xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap animate-fade-in delay-200">
        <Filter className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--student-text-disabled)' }} />
        {subjects.map(s => {
          const isActive = subject === s;
          return (
            <button key={s} onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isActive ? 'shadow-md' : 'hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: isActive ? 'var(--student-primary)' : 'var(--student-bg-card)',
                color: isActive ? 'white' : 'var(--student-text-secondary)',
                borderColor: isActive ? 'var(--student-primary)' : 'var(--student-border)'
              }}>
              {s}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m: StudyMaterial, i) => {
          const cfg = typeConfig[m.type] || typeConfig['link'];
          const Icon = cfg.icon;
          return (
            <div key={m.id}
              className="rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group animate-fade-in-up flex flex-col"
              style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', animationDelay: `${i * 60}ms` }}>
              <div className="h-1 w-full" style={{ backgroundColor: cfg.color }} />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                       style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}>
                    <Icon className="h-6 w-6" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {m.isNew && (
                      <Badge className="text-[10px] py-0" style={{ backgroundColor: 'var(--student-info-bg)', color: 'var(--student-info)', border: '1px solid var(--student-info)' }}>New</Badge>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}>{cfg.label}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1 leading-snug" style={{ color: 'var(--student-text-primary)' }}>{m.title}</h3>
                <p className="text-xs mb-3 leading-relaxed line-clamp-2 flex-1" style={{ color: 'var(--student-text-secondary)' }}>{m.description}</p>
                <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--student-text-disabled)' }}>
                  <span className="flex items-center gap-1 font-medium">📚 {m.chapter || 'General'}</span>
                  <span className="font-medium">{m.fileSize || 'Stream'}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--student-border)' }}>
                  <span className="text-[10px] font-medium" style={{ color: 'var(--student-text-disabled)' }}>By {m.uploadedBy.split(' ')[0]}</span>
                  <a href={m.fileUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all group-hover:shadow-md hover:opacity-90"
                    style={{ backgroundColor: m.type === 'video' ? 'var(--student-purple)' : 'var(--student-primary)' }}>
                    {m.type === 'video' ? <><Play className="h-3 w-3" />Watch</> : <><Download className="h-3 w-3" />Download</>}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed" style={{ borderColor: 'var(--student-border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--student-text-disabled)' }}>No materials found for the selected subject.</p>
          </div>
        )}
      </div>
    </div>
  );
}
