'use client';

import { useState } from 'react';
import { ResourceState } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calendar, Award, BookOpen, Upload, CheckCircle, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { useAssignments, Assignment } from @/app/(dashboard)/student/assignments/assignments_hooks/useAssignments;
import '../../student.css';

const subStatusConfig = {
  submitted: { label: 'Submitted',  color: 'var(--student-info)' },
  graded:    { label: 'Graded',     color: 'var(--student-success)' },
  late:      { label: 'Late',       color: 'var(--student-warning)' },
  missing:   { label: 'Missing',    color: 'var(--student-danger)' },
};

export default function AssignmentsClient() {
  const { assignments, submissions, loading, error, uploading, getSubmission, submitAssignment } = useAssignments();

  const [selected, setSelected] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!selected || (!text.trim() && !file)) return;
    await submitAssignment(selected.id, text, file);
    setDone(true);
    setTimeout(() => { setSelected(null); setDone(false); setText(''); setFile(null); }, 1800);
  };

  const active = assignments.filter(a => a.status === 'active');
  const closed = assignments.filter(a => a.status !== 'active');

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <FileText className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Assignments
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>View, submit and track your assignments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: assignments.length, color: 'var(--student-text-primary)', bg: 'var(--student-bg-card)', border: 'var(--student-border)' },
          { label: 'Pending', value: active.filter(a => !getSubmission(a.id)).length, color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-border)' },
          { label: 'Submitted', value: submissions.filter(s => s.status === 'submitted').length, color: 'var(--student-info)', bg: 'var(--student-info-bg)', border: 'var(--student-border)' },
          { label: 'Graded', value: submissions.filter(s => s.status === 'graded').length, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-border)' },
        ].map((s, i) => (
          <div key={s.label} className="border rounded-2xl p-4 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 70}ms`, backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-xs font-medium" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {active.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--student-text-secondary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--student-success)' }} />Active Assignments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((a, i) => {
              const sub = getSubmission(a.id);
              return (
                <div key={a.id} className="rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', borderLeftColor: 'var(--student-primary)', borderLeftWidth: '4px' }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--student-text-primary)' }}>{a.title}</h3>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--student-text-secondary)' }}>
                          <BookOpen className="h-3 w-3" />{a.subject}
                        </p>
                      </div>
                      <Badge variant="info" className="flex items-center gap-1 flex-shrink-0" style={{ backgroundColor: 'var(--student-info-bg)', color: 'var(--student-info)' }}>
                        <Award className="h-3 w-3" />{a.maxMarks} Marks
                      </Badge>
                    </div>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{a.description}</p>
                    <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--student-text-disabled)' }}>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {a.dueDate}</span>
                      <span>{(a.submittedBy || []).length} submitted</span>
                    </div>

                    {sub ? (
                      <div className="rounded-xl p-3 border" style={{ backgroundColor: sub.status === 'graded' ? 'var(--student-success-bg)' : 'var(--student-info-bg)', borderColor: 'var(--student-border)' }}>
                        {sub.status === 'graded' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--student-success)' }}>
                                <CheckCircle className="h-3.5 w-3.5" />Graded
                              </span>
                              <span className="text-sm font-bold" style={{ color: 'var(--student-success)' }}>{sub.marksObtained}/{a.maxMarks}</span>
                            </div>
                            {sub.feedback && (
                              <div className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--student-success)' }}>
                                <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{sub.feedback}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--student-info)' }}>
                              <Clock className="h-3.5 w-3.5" />Submitted — awaiting grading
                            </span>
                            <div className="flex items-center gap-2">
                              {sub.contentUrl && (
                                <a href={sub.contentUrl} target="_blank" rel="noreferrer" className="text-[10px] underline flex items-center gap-1" style={{ color: 'var(--student-info)' }}>
                                  <Paperclip className="h-3 w-3" /> View Attached
                                </a>
                              )}
                              <span className="text-[10px]" style={{ color: 'var(--student-text-disabled)' }}>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => setSelected(a)} className="w-full flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: '#fff' }}>
                        <Upload className="h-4 w-4" />Submit Assignment
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {closed.length > 0 && (
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--student-text-secondary)' }}>Past Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closed.map((a, i) => {
              const sub = getSubmission(a.id);
              const subCfg = sub ? subStatusConfig[sub.status] : null;
              return (
                <div key={a.id} className="rounded-2xl border shadow-sm opacity-80 hover:opacity-100 transition-all card-hover animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)', borderLeftColor: 'var(--student-text-disabled)', borderLeftWidth: '4px' }}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--student-text-primary)' }}>{a.title}</h3>
                      <Badge variant="default" style={{ backgroundColor: 'var(--student-text-disabled)' }}>{a.status}</Badge>
                    </div>
                    <p className="text-xs flex items-center gap-1 mb-2" style={{ color: 'var(--student-text-secondary)' }}>
                      <BookOpen className="h-3 w-3" />{a.subject} · Due: {a.dueDate}
                    </p>
                    {subCfg ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: subCfg.color }}>
                          {subCfg.label}
                        </span>
                        {sub?.marksObtained !== undefined && (
                          <span className="text-xs font-bold" style={{ color: 'var(--student-success)' }}>{sub.marksObtained}/{a.maxMarks}</span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="danger" style={{ backgroundColor: 'var(--student-danger-bg)', color: 'var(--student-danger)' }}>Not Submitted</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={v => { if (!v) { setSelected(null); setText(''); setDone(false); } }}>
        <DialogContent style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <Upload className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Submit Assignment
            </DialogTitle>
            {selected && <p className="text-sm mt-1" style={{ color: 'var(--student-text-secondary)' }}>{selected.title} · {selected.maxMarks} Marks</p>}
          </DialogHeader>

          {done ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ backgroundColor: 'var(--student-success-bg)' }}>
                <CheckCircle className="h-8 w-8" style={{ color: 'var(--student-success)' }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: 'var(--student-text-primary)' }}>Submitted Successfully!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--student-text-secondary)' }}>Your assignment has been sent for review.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Your Answer / Solution</label>
                  <Textarea
                    placeholder="Write your answer, solution, or paste your content here..."
                    value={text} onChange={e => setText(e.target.value)} rows={6}
                    style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--student-text-disabled)' }}>{text.length} characters</p>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Attachment</label>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed transition-all relative" style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)' }}>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Paperclip className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} />
                    <span className="text-sm truncate" style={{ color: 'var(--student-text-secondary)' }}>{file ? file.name : 'Attach file (PDF, DOC, ZIP)'}</span>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setSelected(null); setText(''); setFile(null); }} disabled={uploading} style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={(!text.trim() && !file) || uploading} className="flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: '#fff' }}>
                  <Upload className="h-4 w-4" />{uploading ? 'Submitting...' : 'Submit'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
