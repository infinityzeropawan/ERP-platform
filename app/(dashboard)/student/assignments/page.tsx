'use client';
import { useState } from 'react';
import { ResourceState, useResource } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calendar, Award, BookOpen, Upload, CheckCircle, Clock, Star, MessageSquare, Paperclip } from 'lucide-react';

interface Assignment {
  id: string; title: string; description: string; subject: string; dueDate: string;
  maxMarks: number; status: string; submittedBy?: string[];
}
interface AssignmentSubmission {
  id: string; assignmentId: string; submittedAt: string; submissionText?: string; contentUrl?: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  marksObtained?: number; feedback?: string;
}

const statusColor: Record<string, 'success' | 'danger' | 'warning'> = {
  active: 'success', closed: 'danger', draft: 'warning',
};

const subStatusConfig = {
  submitted: { label: 'Submitted',  variant: 'info'    as const, icon: Clock },
  graded:    { label: 'Graded',     variant: 'success' as const, icon: CheckCircle },
  late:      { label: 'Late',       variant: 'warning' as const, icon: Clock },
  missing:   { label: 'Missing',    variant: 'danger'  as const, icon: FileText },
};

export default function StudentAssignmentsPage() {
  const { data: rawAssignments, loading, error } = useResource<{
    id: string; title: string; description: string; subject: string; dueAt: string;
    maxMarks: number; status: string;
  }>('assignments');
  const { data: rawSubmissions, create: submitAssignment } = useResource<{
    id: string; assignmentId: string; submittedAt: string; notes?: string; contentUrl?: string;
    marks?: number; feedback?: string;
  }>('assignment-submissions');
  const assignments: Assignment[] = rawAssignments.map(item => ({
    ...item, dueDate: new Date(item.dueAt).toLocaleDateString(),
  }));
  const submissions: AssignmentSubmission[] = rawSubmissions.map(item => ({
    ...item,
    submissionText: item.notes,
    status: item.marks == null ? 'submitted' : 'graded',
    marksObtained: item.marks,
  }));
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const getSubmission = (id: string) => submissions.find(s => s.assignmentId === id);

  const handleSubmit = async () => {
    if (!selected || (!text.trim() && !file)) return;
    setUploading(true);
    let contentUrl = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData,
          // note: authenticateToken requires cookie, which fetch sends automatically if credentials: 'same-origin' is set, or we can use our client fetcher if we have one. Since this is generic we just rely on cookies.
        });
        const data = await res.json();
        if (data.url) contentUrl = data.url;
      } catch (err) {
        console.error('File upload failed', err);
      }
    }

    await submitAssignment({ assignmentId: selected.id, notes: text, contentUrl });
    setUploading(false);
    setDone(true);
    setTimeout(() => { setSelected(null); setDone(false); setText(''); setFile(null); }, 1800);
  };

  const active   = assignments.filter(a => a.status === 'active');
  const closed   = assignments.filter(a => a.status !== 'active');
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-teal-600" />My Assignments
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">View, submit and track your assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: assignments.length,                                                    color: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-200' },
          { label: 'Pending',   value: active.filter(a => !getSubmission(a.id)).length,                       color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
          { label: 'Submitted', value: submissions.filter(s => s.status === 'submitted').length,              color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
          { label: 'Graded',    value: submissions.filter(s => s.status === 'graded').length,                 color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Active Assignments */}
      {active.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Active Assignments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((a, i) => {
              const sub = getSubmission(a.id);
              return (
                <div key={a.id}
                  className="bg-white rounded-2xl border border-l-4 border-l-teal-500 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{a.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />{a.subject}
                        </p>
                      </div>
                      <Badge variant="info" className="flex items-center gap-1 flex-shrink-0">
                        <Award className="h-3 w-3" />{a.maxMarks} Marks
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{a.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {a.dueDate}</span>
                      <span>{(a.submittedBy || []).length} submitted</span>
                    </div>

                    {/* Submission state */}
                    {sub ? (
                      <div className={`rounded-xl p-3 border ${sub.status === 'graded' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                        {sub.status === 'graded' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5" />Graded
                              </span>
                              <span className="text-sm font-bold text-green-700">{sub.marksObtained}/{a.maxMarks}</span>
                            </div>
                            {sub.feedback && (
                              <div className="flex items-start gap-1.5 text-xs text-green-700">
                                <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{sub.feedback}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />Submitted — awaiting grading
                            </span>
                            <div className="flex items-center gap-2">
                              {sub.contentUrl && (
                                <a href={sub.contentUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" /> View Attached
                                </a>
                              )}
                              <span className="text-[10px] text-blue-500">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => setSelected(a)} className="w-full flex items-center gap-2">
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

      {/* Closed Assignments */}
      {closed.length > 0 && (
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Past Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closed.map((a, i) => {
              const sub = getSubmission(a.id);
              const subCfg = sub ? subStatusConfig[sub.status] : null;
              return (
                <div key={a.id}
                  className="bg-white rounded-2xl border border-l-4 border-l-gray-300 border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-all card-hover animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-gray-700 text-sm">{a.title}</h3>
                      <Badge variant={statusColor[a.status]}>{a.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                      <BookOpen className="h-3 w-3" />{a.subject} · Due: {a.dueDate}
                    </p>
                    {subCfg ? (
                      <div className="flex items-center justify-between">
                        <Badge variant={subCfg.variant} className="flex items-center gap-1">
                          <subCfg.icon className="h-3 w-3" />{subCfg.label}
                        </Badge>
                        {sub?.marksObtained !== undefined && (
                          <span className="text-xs font-bold text-green-600">{sub.marksObtained}/{a.maxMarks}</span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="danger">Not Submitted</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={!!selected} onOpenChange={v => { if (!v) { setSelected(null); setText(''); setDone(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-600" />Submit Assignment
            </DialogTitle>
            {selected && <p className="text-sm text-gray-500 mt-1">{selected.title} · {selected.maxMarks} Marks</p>}
          </DialogHeader>

          {done ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Submitted Successfully!</p>
              <p className="text-sm text-gray-500 mt-1">Your assignment has been sent for review.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Your Answer / Solution</label>
                  <Textarea
                    placeholder="Write your answer, solution, or paste your content here..."
                    value={text} onChange={e => setText(e.target.value)} rows={6}
                  />
                  <p className="text-xs text-gray-400 mt-1">{text.length} characters</p>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Attachment</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-teal-400 hover:bg-teal-50 transition-all relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 truncate">{file ? file.name : 'Attach file (PDF, DOC, ZIP)'}</span>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setSelected(null); setText(''); setFile(null); }} disabled={uploading}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={(!text.trim() && !file) || uploading} className="flex items-center gap-2">
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
