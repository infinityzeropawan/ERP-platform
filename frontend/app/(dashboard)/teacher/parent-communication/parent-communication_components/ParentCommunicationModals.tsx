import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { Student, ParentMessage, MessageTemplate } from '../parent-communication_types';
import { categories } from '../parent-communication_hooks/useParentCommunication';

interface Props {
  isComposeOpen: boolean;
  setIsComposeOpen: (v: boolean) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (v: boolean) => void;
  isBroadcast: boolean;
  setIsBroadcast: (v: boolean) => void;
  selectedStudentId: string;
  setSelectedStudentId: (v: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  priority: string;
  setPriority: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  selectedMessage: ParentMessage | null;
  sendSuccess: boolean;
  students: Student[];
  currentStudent?: Student;
  handleSendMessage: () => void;
  messageTemplates: MessageTemplate[];
}

export function ParentCommunicationModals({
  isComposeOpen, setIsComposeOpen,
  isDetailsOpen, setIsDetailsOpen,
  isBroadcast, setIsBroadcast,
  selectedStudentId, setSelectedStudentId,
  selectedTemplateId, setSelectedTemplateId,
  category, setCategory,
  priority, setPriority,
  subject, setSubject,
  body, setBody,
  selectedMessage, sendSuccess,
  students, currentStudent,
  handleSendMessage, messageTemplates
}: Props) {
  return (
    <>
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-xl rounded-2xl bg-[var(--bg-card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">Send Message to Parents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            
            <div className="flex items-center gap-4 bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border)]">
              <label className="text-xs text-[var(--text-secondary)] font-medium block">Send To:</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio" id="mode-single" name="delivery-mode"
                  checked={!isBroadcast} onChange={() => setIsBroadcast(false)}
                  className="text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <label htmlFor="mode-single" className="text-sm font-medium text-[var(--text-primary)] cursor-pointer">Single Parent</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio" id="mode-broadcast" name="delivery-mode"
                  checked={isBroadcast} onChange={() => setIsBroadcast(true)}
                  className="text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <label htmlFor="mode-broadcast" className="text-sm font-medium text-[var(--text-primary)] cursor-pointer">Broadcast (All Class Parents)</label>
              </div>
            </div>

            {!isBroadcast && (
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(ev) => setSelectedStudentId(ev.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Class: {s.class})</option>
                  ))}
                </select>
                {currentStudent && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-80">
                    Primary Parent: {currentStudent.fatherName || 'Not specified'} · Contact: {currentStudent.email}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Select Template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="custom">-- Custom Message --</option>
                {messageTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Subject</label>
              <Input
                placeholder="Alert Subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">Message Content</label>
              <Textarea
                placeholder="Type your communication details here..."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="rounded-xl bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            {sendSuccess && (
              <div className="p-3 bg-[var(--success-bg)] text-[var(--success)] text-xs font-semibold rounded-xl text-center border border-[var(--success)]">
                ✓ Message sent successfully to target parent(s)!
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSendMessage} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl shadow-md flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-[var(--bg-card)] border-[var(--border)]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">{selectedMessage.subject}</DialogTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Sent on {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize border-[var(--border)] text-[var(--text-primary)]">{selectedMessage.category}</Badge>
                  <Badge className="bg-[var(--warning)] text-white uppercase">{selectedMessage.priority}</Badge>
                </div>
                <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border)] text-sm font-mono whitespace-pre-line text-[var(--text-primary)]">
                  {selectedMessage.body}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  <p><strong>Student Ref:</strong> {selectedMessage.studentName}</p>
                  <p className="mt-1"><strong>Parent Receiver:</strong> {selectedMessage.parentName}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)} className="w-full bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-xl">
                  Close Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
