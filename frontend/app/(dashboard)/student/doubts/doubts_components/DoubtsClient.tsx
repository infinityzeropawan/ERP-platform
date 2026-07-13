'use client';

import { useState } from 'react';
import { ResourceState } from '@/lib/useResource';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Plus, MessageSquare, CheckCircle, Filter, ChevronDown, ChevronUp, Send, GraduationCap, User } from 'lucide-react';
import { useDoubts, subjectNames } from @/app/(dashboard)/student/doubts/doubts_hooks/useDoubts;
import '../../student.css';

const statusConfig = {
  open:     { color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', label: 'Open' },
  answered: { color: 'var(--student-success)', bg: 'var(--student-success-bg)', label: 'Answered' },
  closed:   { color: 'var(--student-text-secondary)', bg: 'var(--student-bg-input)', label: 'Closed' },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DoubtsClient() {
  const { allDoubts, loading, error, submitReply, askDoubt } = useDoubts();

  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [askOpen, setAskOpen] = useState(false);
  const [form, setForm] = useState({ subject: 'IOT101', title: '', description: '', tags: '' });
  const [submitted, setSubmitted] = useState(false);

  const subjects = ['All', 'IOT101', 'IOT102', 'IOT103'];
  const filtered = filter === 'All' ? allDoubts : allDoubts.filter(d => d.subjectCode === filter);

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handleReply = async (doubtId: string) => {
    try {
      await submitReply(doubtId, replyText[doubtId] || '');
      setReplyText(p => ({ ...p, [doubtId]: '' }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAsk = async () => {
    try {
      await askDoubt(form);
      setSubmitted(true);
      setTimeout(() => {
        setAskOpen(false);
        setSubmitted(false);
        setForm({ subject: 'IOT101', title: '', description: '', tags: '' });
      }, 1600);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
            <HelpCircle className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />Doubts & Q&A
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Ask questions, get answers from teachers and classmates</p>
        </div>
        <Button onClick={() => setAskOpen(true)} className="flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
          <Plus className="h-4 w-4" />Ask a Doubt
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Doubts', value: allDoubts.length, color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-border)' },
          { label: 'Answered', value: allDoubts.filter(d => d.status === 'answered').length, color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-border)' },
          { label: 'Open', value: allDoubts.filter(d => d.status === 'open').length, color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-border)' },
        ].map((s) => (
          <div key={s.label} className="border rounded-2xl p-4 text-center" style={{ backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4" style={{ color: 'var(--student-text-disabled)' }} />
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
            style={{ 
              backgroundColor: filter === s ? 'var(--student-primary)' : 'var(--student-bg-card)', 
              color: filter === s ? '#fff' : 'var(--student-text-secondary)',
              borderColor: filter === s ? 'var(--student-primary)' : 'var(--student-border)'
            }}>
            {s === 'All' ? 'All Subjects' : s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((d, i) => {
          const isExpanded = expanded[d.id];
          const stCfg = statusConfig[d.status] || { color: 'var(--student-text-secondary)', bg: 'var(--student-bg-input)', label: d.status };
          const replies = d.replies || [];
          return (
            <div key={d.id} className="rounded-2xl border shadow-sm transition-all overflow-hidden" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 border rounded-full" style={{ backgroundColor: 'var(--student-primary-subtle)', color: 'var(--student-primary)', borderColor: 'var(--student-primary)' }}>{d.subjectCode}</span>
                      <Badge className="text-[10px] py-0" style={{ backgroundColor: stCfg.bg, color: stCfg.color, border: 'none' }}>{stCfg.label}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--student-text-primary)' }}>{d.title}</h3>
                  </div>
                  <button onClick={() => toggleExpand(d.id)} className="flex-shrink-0 p-1.5 rounded-lg transition-colors" style={{ color: 'var(--student-text-secondary)', backgroundColor: 'var(--student-bg-input)' }}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--student-text-secondary)' }}>{d.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(d.tags || []).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--student-bg-input)', color: 'var(--student-text-secondary)' }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--student-text-disabled)' }}>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{replies.length} replies</span>
                    <span>{timeAgo(d.createdAt)}</span>
                    <span>by {d.askedBy?.split(' ')[0] || 'Student'}</span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t" style={{ borderColor: 'var(--student-border)' }}>
                  {replies.length > 0 && (
                    <div className="px-5 py-4 space-y-3" style={{ backgroundColor: 'var(--student-bg-page)' }}>
                      {replies.map(r => (
                        <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: r.isAccepted ? 'var(--student-success)' : 'var(--student-border)' }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: r.authorRole === 'teacher' ? 'var(--student-primary-subtle)' : 'var(--student-info-bg)' }}>
                            {r.authorRole === 'teacher' ? <GraduationCap className="h-4 w-4" style={{ color: 'var(--student-primary)' }} /> : <User className="h-4 w-4" style={{ color: 'var(--student-info)' }} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold" style={{ color: 'var(--student-text-primary)' }}>{r.authorName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: r.authorRole === 'teacher' ? 'var(--student-primary-subtle)' : 'var(--student-info-bg)', color: r.authorRole === 'teacher' ? 'var(--student-primary)' : 'var(--student-info)' }}>
                                {r.authorRole === 'teacher' ? 'Teacher' : 'Student'}
                              </span>
                              {r.isAccepted && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5" style={{ backgroundColor: 'var(--student-success-bg)', color: 'var(--student-success)' }}><CheckCircle className="h-2.5 w-2.5" />Accepted</span>}
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{r.content}</p>
                            <p className="text-[10px] mt-1" style={{ color: 'var(--student-text-disabled)' }}>{timeAgo(r.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {d.status !== 'closed' && (
                    <div className="px-5 py-4 flex items-end gap-3 border-t" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-card)' }}>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyText[d.id] || ''}
                          onChange={e => setReplyText(p => ({ ...p, [d.id]: e.target.value }))}
                          rows={2}
                          style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}
                        />
                      </div>
                      <Button size="sm" onClick={() => handleReply(d.id)} disabled={!replyText[d.id]?.trim()} className="flex items-center gap-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--student-primary)', color: 'white' }}>
                        <Send className="h-3.5 w-3.5" />Reply
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <HelpCircle className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Ask a Doubt
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ backgroundColor: 'var(--student-success-bg)' }}>
                <CheckCircle className="h-8 w-8" style={{ color: 'var(--student-success)' }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: 'var(--student-text-primary)' }}>Doubt Posted!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--student-text-secondary)' }}>Your teacher and classmates will answer soon.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Subject</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(subjectNames).map((code) => (
                      <button key={code} onClick={() => setForm(p => ({ ...p, subject: code }))}
                        className="p-2 rounded-xl border text-xs font-medium transition-all text-center"
                        style={{
                          backgroundColor: form.subject === code ? 'var(--student-primary-subtle)' : 'transparent',
                          borderColor: form.subject === code ? 'var(--student-primary)' : 'var(--student-border)',
                          color: form.subject === code ? 'var(--student-primary)' : 'var(--student-text-secondary)'
                        }}>
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Question Title</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. What is the difference between MQTT QoS 0 and 1?"
                    className="w-full h-10 px-3 rounded-xl border text-sm focus:outline-none transition-all"
                    style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Description</label>
                  <Textarea placeholder="Describe your doubt in detail..." value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                    style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--student-text-secondary)' }}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    placeholder="e.g. MQTT, Unit 3, Protocol"
                    className="w-full h-10 px-3 rounded-xl border text-sm focus:outline-none transition-all"
                    style={{ backgroundColor: 'var(--student-bg-input)', borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }} />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAskOpen(false)} style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Cancel</Button>
                <Button onClick={handleAsk} disabled={!form.title.trim() || !form.description.trim()} style={{ backgroundColor: 'var(--student-primary)', color: '#fff' }}>Post Doubt</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
