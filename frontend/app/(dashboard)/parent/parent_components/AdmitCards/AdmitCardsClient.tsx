'use client';

import { ResourceState } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar, Clock, MapPin, BookOpen, CheckCircle } from 'lucide-react';
import { useAdmitCards } from '../../parent_hooks/useAdmitCards';
import '../../parent.css';

export default function AdmitCardsClient() {
  const { exams, loading, error, handlePrint } = useAdmitCards();

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--parent-text-primary)' }}>
          <Ticket className="h-6 w-6" style={{ color: 'var(--parent-primary)' }} />Admit Cards
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--parent-text-secondary)' }}>Hall Tickets for upcoming examinations</p>
      </div>

      {exams.length === 0 ? (
        <div className="rounded-2xl border shadow-sm p-10 text-center animate-fade-in-up" style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--parent-success-bg)' }}>
            <CheckCircle className="h-8 w-8" style={{ color: 'var(--parent-success)' }} />
          </div>
          <p className="text-base font-bold" style={{ color: 'var(--parent-text-primary)' }}>No Admit Cards Issued</p>
          <p className="text-sm mt-1" style={{ color: 'var(--parent-text-secondary)' }}>Admit cards for upcoming exams will appear here once issued.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {exams.map((exam, i) => (
            <div key={exam.id} className="rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up" 
                 style={{ backgroundColor: 'var(--parent-bg-card)', borderColor: 'var(--parent-border)', animationDelay: `${i * 100}ms` }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--parent-border)', backgroundColor: 'var(--parent-bg-hover)' }}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-primary)' }}>{exam.subject}</h3>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--parent-text-secondary)' }}>Examination</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm"
                      style={{ 
                        color: 'var(--parent-success)', 
                        backgroundColor: 'var(--parent-success-bg)', 
                        borderColor: 'var(--parent-success)' 
                      }}>
                  Scheduled
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                  {[
                    { icon: Calendar, label: 'Exam Date', value: new Date(exam.startsAt).toLocaleDateString() },
                    { icon: Clock, label: 'Exam Time', value: new Date(exam.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { icon: Clock, label: 'Duration', value: `${exam.durationMins} minutes` },
                    { icon: MapPin, label: 'Venue', value: exam.room || 'TBA' },
                    { icon: BookOpen, label: 'Max Marks', value: String(exam.maxMarks) },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--parent-bg-input)' }}>
                        <item.icon className="h-4 w-4" style={{ color: 'var(--parent-primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--parent-text-secondary)' }}>{item.label}</p>
                        <p className="font-semibold mt-0.5" style={{ color: 'var(--parent-text-primary)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {exam.syllabus && (
                  <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--parent-border)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--parent-text-secondary)' }}>Syllabus</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--parent-text-primary)' }}>{exam.syllabus}</p>
                  </div>
                )}
              </div>
              <div className="px-5 py-4 border-t flex justify-end" style={{ borderColor: 'var(--parent-border)', backgroundColor: 'var(--parent-bg-hover)' }}>
                <button onClick={handlePrint}
                  className="text-sm font-bold px-5 py-2.5 rounded-xl transition-transform hover:scale-105 shadow-md flex items-center gap-2"
                  style={{ backgroundColor: 'var(--parent-primary)', color: 'white' }}>
                  Print Admit Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
