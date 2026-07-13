import { MessageCircle, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Message, Student, ComposeForm } from '../messaging_types';

interface Props {
  compose: boolean;
  setCompose: (v: boolean) => void;
  selected: Message | null;
  form: ComposeForm;
  setForm: (v: ComposeForm | ((prev: ComposeForm) => ComposeForm)) => void;
  students: Student[];
  send: () => void;
}

export function MessagingContent({ compose, setCompose, selected, form, setForm, students, send }: Props) {
  return (
    <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] flex flex-col">
      {compose ? (
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <h3 className="font-semibold text-[var(--text-primary)]">New Message to Parent</h3>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Student *</label>
            <select 
              value={form.studentId} 
              onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}
              className="w-full border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Parent Name</label>
            <Input placeholder="Parent name" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Subject *</label>
            <Input placeholder="Message subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Message *</label>
            <Textarea placeholder="Write your message..." rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCompose(false)} className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-input)]">Cancel</Button>
            <Button onClick={send} disabled={!form.studentId || !form.subject || !form.body} className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
              <Send className="h-4 w-4" />Send Message
            </Button>
          </div>
        </div>
      ) : selected ? (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <h3 className="font-bold text-[var(--text-primary)] text-lg">{selected.subject}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />To: {selected.parentName} (Parent of {selected.studentName})</span>
              <span>{new Date(selected.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="capitalize border-[var(--border)] text-[var(--text-primary)]">{selected.category}</Badge>
              <Badge className={`capitalize ${selected.priority === 'urgent' ? 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-bg)]' : selected.priority === 'important' ? 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]' : 'bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)] hover:bg-[var(--info-bg)]'}`}>{selected.priority}</Badge>
            </div>
          </div>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{selected.body}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)]">
          <MessageCircle className="h-12 w-12 text-[var(--text-secondary)] opacity-30 mb-3" />
          <p className="font-medium">Select a message or compose new</p>
        </div>
      )}
    </div>
  );
}
