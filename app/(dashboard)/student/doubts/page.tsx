'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useResource, ResourceState } from '@/lib/useResource';
import { HelpCircle, Plus, MessageSquare, CheckCircle, Clock, Filter, ChevronDown, ChevronUp, Send, GraduationCap, User } from 'lucide-react';

type Doubt = {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  askedBy: string;
  createdAt: string;
  status: 'open' | 'answered' | 'closed';
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: 'teacher' | 'student';
    content: string;
    createdAt: string;
    isAccepted?: boolean;
  }>;
  tags: string[];
};

const statusConfig = {
  open:     { variant: 'warning' as const, label: 'Open' },
  answered: { variant: 'success' as const, label: 'Answered' },
  closed:   { variant: 'outline' as const, label: 'Closed' },
};

export default function StudentDoubtsPage() {
  const { user } = useAuth();
  const { data: allDoubts, loading, error, reload: reloadDoubts, create: createDoubt } = useResource<Doubt>('doubts');
  const { create: createReply } = useResource<any>('doubt-replies');

  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [askOpen, setAskOpen] = useState(false);
  const [form, setForm] = useState({ subject: 'IOT101', title: '', description: '', tags: '' });
  const [submitted, setSubmitted] = useState(false);

  const subjects = ['All', 'IOT101', 'IOT102', 'IOT103'];
  const subjectNames: Record<string, string> = {
    IOT101: 'IOT & Embedded Systems',
    IOT102: 'Embedded C Programming',
    IOT103: 'Network Protocols'
  };

  const filtered = filter === 'All' ? allDoubts : allDoubts.filter(d => d.subjectCode === filter);

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const submitReply = async (doubtId: string) => {
    const text = replyText[doubtId]?.trim();
    if (!text) return;

    try {
      await createReply({
        doubtId,
        authorName: user?.name || 'Aarav Sharma',
        authorRole: user?.role === 'teacher' ? 'teacher' : 'student',
        content: text,
        isAccepted: false
      });
      setReplyText(p => ({ ...p, [doubtId]: '' }));
      await reloadDoubts();
    } catch (err: any) {
      alert(`Error posting reply: ${err.message}`);
    }
  };

  const askDoubt = async () => {
    if (!form.title.trim() || !form.description.trim()) return;

    try {
      await createDoubt({
        subjectCode: form.subject,
        subjectName: subjectNames[form.subject] || 'General',
        title: form.title,
        description: form.description,
        askedBy: user?.name || 'Student',
        status: 'open',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
      setTimeout(() => {
        setAskOpen(false);
        setSubmitted(false);
        setForm({ subject: 'IOT101', title: '', description: '', tags: '' });
      }, 1600);
    } catch (err: any) {
      alert(`Error posting doubt: ${err.message}`);
    }
  };

  function timeAgo(iso: string) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-teal-600" />Doubts & Q&A
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Ask questions, get answers from teachers and classmates</p>
        </div>
        <Button onClick={() => setAskOpen(true)} className="flex items-center gap-2 shadow-lg">
          <Plus className="h-4 w-4" />Ask a Doubt
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Doubts', value: allDoubts.length,                                    color: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-200' },
          { label: 'Answered',     value: allDoubts.filter(d => d.status === 'answered').length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Open',         value: allDoubts.filter(d => d.status === 'open').length,     color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-400" />
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === s ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {s === 'All' ? 'All Subjects' : s}
          </button>
        ))}
      </div>

      {/* Doubts list */}
      <div className="space-y-4">
        {filtered.map((d, i) => {
          const isExpanded = expanded[d.id];
          const stCfg = statusConfig[d.status] || { variant: 'outline', label: d.status };
          const replies = d.replies || [];
          return (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Question */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">{d.subjectCode}</span>
                      <Badge variant={stCfg.variant as any} className="text-[10px] py-0">{stCfg.label}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{d.title}</h3>
                  </div>
                  <button onClick={() => toggleExpand(d.id)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{d.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(d.tags || []).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{replies.length} replies</span>
                    <span>{timeAgo(d.createdAt)}</span>
                    <span>by {d.askedBy?.split(' ')[0] || 'Student'}</span>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {isExpanded && (
                <div className="border-t border-gray-50">
                  {replies.length > 0 && (
                    <div className="px-5 py-4 space-y-3 bg-gray-50/50">
                      {replies.map(r => (
                        <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border ${r.isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${r.authorRole === 'teacher' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                            {r.authorRole === 'teacher' ? <GraduationCap className="h-4 w-4 text-teal-600" /> : <User className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-900">{r.authorName}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${r.authorRole === 'teacher' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'}`}>
                                {r.authorRole === 'teacher' ? 'Teacher' : 'Student'}
                              </span>
                              {r.isAccepted && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-0.5"><CheckCircle className="h-2.5 w-2.5" />Accepted</span>}
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{r.content}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{timeAgo(r.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  {d.status !== 'closed' && (
                    <div className="px-5 py-4 flex items-end gap-3 border-t border-gray-50">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyText[d.id] || ''}
                          onChange={e => setReplyText(p => ({ ...p, [d.id]: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <Button size="sm" onClick={() => submitReply(d.id)} disabled={!replyText[d.id]?.trim()} className="flex items-center gap-1.5 flex-shrink-0">
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

      {/* Ask Doubt Dialog */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal-600" />Ask a Doubt
            </DialogTitle>
          </DialogHeader>
          {submitted ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <CheckCircle className="h-8 w-8 text-teal-500" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Doubt Posted!</p>
              <p className="text-sm text-gray-500 mt-1">Your teacher and classmates will answer soon.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Subject</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(subjectNames).map(([code, name]) => (
                      <button key={code} onClick={() => setForm(p => ({ ...p, subject: code }))}
                        className={`p-2 rounded-xl border text-xs font-medium transition-all text-center ${form.subject === code ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Question Title</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. What is the difference between MQTT QoS 0 and 1?"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Description</label>
                  <Textarea placeholder="Describe your doubt in detail..." value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    placeholder="e.g. MQTT, Unit 3, Protocol"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white" />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAskOpen(false)}>Cancel</Button>
                <Button onClick={askDoubt} disabled={!form.title.trim() || !form.description.trim()}>Post Doubt</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
