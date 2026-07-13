'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type StudyMaterial = { id: string; subjectCode: string; subjectName: string; title: string; description: string; type: 'pdf' | 'video' | 'doc' | 'ppt' | 'link'; fileUrl: string; fileSize?: string; uploadedBy: string; uploadedAt: string; chapter?: string; isNew?: boolean; };
import {
  Library, Plus, FileText, Video, FileSpreadsheet, Presentation, Link2,
  Search, Filter, Upload, Edit3, Trash2, Eye, EyeOff, Calendar, HardDrive,
  BookOpen, MoreVertical, Download, BarChart3, CheckCircle2, XCircle,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────── */
const typeIcons: Record<StudyMaterial['type'], React.ElementType> = {
  pdf: FileText, video: Video, doc: FileSpreadsheet, ppt: Presentation, link: Link2,
};
const typeColors: Record<StudyMaterial['type'], string> = {
  pdf: 'text-red-500 bg-red-50', video: 'text-violet-500 bg-violet-50',
  doc: 'text-blue-500 bg-blue-50', ppt: 'text-orange-500 bg-orange-50',
  link: 'text-teal-500 bg-teal-50',
};
const typeLabels: Record<StudyMaterial['type'], string> = {
  pdf: 'PDF Document', video: 'Video Lecture', doc: 'Word Document', ppt: 'Presentation', link: 'External Link',
};

function emptyForm() {
  return { title: '', description: '', subjectCode: '', subjectName: '', type: 'pdf' as StudyMaterial['type'], fileUrl: '#', fileSize: '', chapter: '', uploadedBy: 'Pawan Kumar Dubey' };
}

/* ── page ────────────────────────────────────────────────────── */
export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(null);
  const [form, setForm] = useState(emptyForm());

  /* ── derived ──────────────────────────────────────────────── */
  const subjects = useMemo(() => [...new Set(materials.map(m => m.subjectCode))], [materials]);
  const filtered = useMemo(() => {
    return materials.filter(m => {
      if (filterSubject !== 'all' && m.subjectCode !== filterSubject) return false;
      if (filterType !== 'all' && m.type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.title.toLowerCase().includes(q) || m.subjectName.toLowerCase().includes(q) || (m.chapter || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [materials, search, filterSubject, filterType]);

  const stats = useMemo(() => ({
    total: materials.length,
    pdf: materials.filter(m => m.type === 'pdf').length,
    video: materials.filter(m => m.type === 'video').length,
    recent: materials.filter(m => m.isNew).length,
  }), [materials]);

  /* ── handlers ─────────────────────────────────────────────── */
  const handleCreate = () => {
    if (!form.title || !form.subjectCode || !form.subjectName) return;
    const newMat: StudyMaterial = {
      id: `sm-${Date.now()}`,
      subjectCode: form.subjectCode,
      subjectName: form.subjectName,
      title: form.title,
      description: form.description,
      type: form.type,
      fileUrl: form.fileUrl || '#',
      fileSize: form.fileSize || undefined,
      uploadedBy: form.uploadedBy,
      uploadedAt: new Date().toISOString().split('T')[0],
      chapter: form.chapter || undefined,
      isNew: true,
    };
    setMaterials(prev => [newMat, ...prev]);
    setForm(emptyForm());
    setCreateOpen(false);
  };

  const handleEditOpen = (m: StudyMaterial) => {
    setActiveMaterial(m);
    setForm({
      title: m.title, description: m.description, subjectCode: m.subjectCode,
      subjectName: m.subjectName, type: m.type, fileUrl: m.fileUrl,
      fileSize: m.fileSize || '', chapter: m.chapter || '', uploadedBy: m.uploadedBy,
    });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!activeMaterial || !form.title) return;
    setMaterials(prev => prev.map(m => m.id === activeMaterial.id ? {
      ...m, title: form.title, description: form.description, subjectCode: form.subjectCode,
      subjectName: form.subjectName, type: form.type, fileUrl: form.fileUrl,
      fileSize: form.fileSize || undefined, chapter: form.chapter || undefined,
    } : m));
    setEditOpen(false);
    setActiveMaterial(null);
    setForm(emptyForm());
  };

  const handleDelete = () => {
    if (!activeMaterial) return;
    setMaterials(prev => prev.filter(m => m.id !== activeMaterial.id));
    setDeleteOpen(false);
    setActiveMaterial(null);
  };

  const togglePublish = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isNew: !m.isNew } : m));
  };

  /* ── form fields (shared between create & edit) ──────────── */
  const renderFormFields = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Material Title *</label>
        <Input placeholder="e.g. Unit 1 - IoT Architecture Notes" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Subject Name *</label>
          <Input placeholder="IOT & Embedded Systems" value={form.subjectName} onChange={e => setForm(p => ({ ...p, subjectName: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Subject Code *</label>
          <Input placeholder="IOT101" value={form.subjectCode} onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Material Type</label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as StudyMaterial['type'] }))}>
            <SelectItem value="pdf">PDF Document</SelectItem>
            <SelectItem value="video">Video Lecture</SelectItem>
            <SelectItem value="doc">Word Document</SelectItem>
            <SelectItem value="ppt">Presentation</SelectItem>
            <SelectItem value="link">External Link</SelectItem>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Chapter / Unit</label>
          <Input placeholder="Unit 1" value={form.chapter} onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">File URL / Link</label>
          <Input placeholder="https://..." value={form.fileUrl} onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">File Size</label>
          <Input placeholder="2.4 MB" value={form.fileSize} onChange={e => setForm(p => ({ ...p, fileSize: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
        <Textarea placeholder="Brief description of the material..." rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>
    </div>
  );

  /* ── render ────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Library className="h-6 w-6 text-teal-600" />Study Material Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Upload, manage and share course materials with your students</p>
        </div>
        <Button onClick={() => { setForm(emptyForm()); setCreateOpen(true); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />Upload Material
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: stats.total, icon: Library, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'PDF Documents', value: stats.pdf, icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Video Lectures', value: stats.video, icon: Video, color: 'text-violet-500', bg: 'bg-violet-50' },
          { label: 'Recently Added', value: stats.recent, icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search materials..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="w-48">
              <Select value={filterSubject} onValueChange={setFilterSubject} placeholder="All Subjects">
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </Select>
            </div>
            <div className="w-44">
              <Select value={filterType} onValueChange={setFilterType} placeholder="All Types">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="doc">Document</SelectItem>
                <SelectItem value="ppt">Presentation</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-gray-400">
            <Library className="h-12 w-12 text-gray-300" />
            <p className="text-base font-medium">No materials found</p>
            <p className="text-sm">Upload your first study material using the button above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(mat => {
            const TypeIcon = typeIcons[mat.type];
            return (
              <Card key={mat.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-teal-300">
                <CardContent className="p-0">
                  {/* Card header accent */}
                  <div className={`h-1.5 rounded-t-xl ${mat.type === 'pdf' ? 'bg-gradient-to-r from-red-400 to-red-500' : mat.type === 'video' ? 'bg-gradient-to-r from-violet-400 to-violet-500' : mat.type === 'doc' ? 'bg-gradient-to-r from-blue-400 to-blue-500' : mat.type === 'ppt' ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-teal-400 to-teal-500'}`} />

                  <div className="p-4 space-y-3">
                    {/* Top row: type icon + badges */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-lg ${typeColors[mat.type]} flex items-center justify-center`}>
                          <TypeIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-[10px]">{typeLabels[mat.type]}</Badge>
                          {mat.chapter && <p className="text-[10px] text-gray-400 mt-0.5">{mat.chapter}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {mat.isNew && <Badge variant="success" className="text-[10px]">New</Badge>}
                      </div>
                    </div>

                    {/* Title & description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">{mat.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{mat.description}</p>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{mat.subjectCode}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{mat.uploadedAt}</span>
                      {mat.fileSize && <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{mat.fileSize}</span>}
                    </div>

                    {/* Uploaded by */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-[9px] font-bold text-white">
                        {mat.uploadedBy.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-[11px] text-gray-500">{mat.uploadedBy}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Button size="sm" variant="outline" className="flex-1 text-xs flex items-center gap-1" onClick={() => { setActiveMaterial(mat); setViewOpen(true); }}>
                        <Eye className="h-3 w-3" />View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs flex items-center gap-1" onClick={() => handleEditOpen(mat)}>
                        <Edit3 className="h-3 w-3" />Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2" onClick={() => togglePublish(mat.id)} title={mat.isNew ? 'Mark as not new' : 'Mark as new'}>
                        {mat.isNew ? <EyeOff className="h-3 w-3 text-amber-500" /> : <CheckCircle2 className="h-3 w-3 text-green-500" />}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => { setActiveMaterial(mat); setDeleteOpen(true); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── CREATE DIALOG ──────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-teal-600" />Upload Study Material</DialogTitle>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="flex items-center gap-2"><Upload className="h-4 w-4" />Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT DIALOG ────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit3 className="h-5 w-5 text-blue-600" />Edit Study Material</DialogTitle>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── VIEW DIALOG ────────────────────────────────────────── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeMaterial && (() => { const I = typeIcons[activeMaterial.type]; return <I className={`h-5 w-5 ${typeColors[activeMaterial.type].split(' ')[0]}`} />; })()}
              <span className="truncate">{activeMaterial?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {activeMaterial && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Subject</p>
                  <p className="font-medium">{activeMaterial.subjectName}</p>
                  <p className="text-xs text-gray-400">{activeMaterial.subjectCode}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Type & Size</p>
                  <p className="font-medium">{typeLabels[activeMaterial.type]}</p>
                  {activeMaterial.fileSize && <p className="text-xs text-gray-400">{activeMaterial.fileSize}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Uploaded By</p>
                  <p className="font-medium">{activeMaterial.uploadedBy}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Upload Date</p>
                  <p className="font-medium">{activeMaterial.uploadedAt}</p>
                </div>
              </div>
              {activeMaterial.chapter && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Chapter / Unit</p>
                  <p className="text-gray-700">{activeMaterial.chapter}</p>
                </div>
              )}
              {activeMaterial.description && (
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-xs text-teal-600 font-semibold mb-1">Description</p>
                  <p className="text-gray-700">{activeMaterial.description}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <Badge variant={activeMaterial.isNew ? 'success' : 'outline'}>
                  {activeMaterial.isNew ? 'New / Published' : 'Standard'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
            <Button onClick={() => { setViewOpen(false); if (activeMaterial) handleEditOpen(activeMaterial); }} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />Edit Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRMATION ─────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />Delete Material
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Are you sure you want to delete this material? This action cannot be undone.</p>
            {activeMaterial && (
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="font-medium text-sm text-gray-900">{activeMaterial.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activeMaterial.subjectName} · {activeMaterial.uploadedAt}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4" />Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
