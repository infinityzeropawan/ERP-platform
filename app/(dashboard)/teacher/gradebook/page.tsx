'use client';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trophy, ArrowDown, ArrowUp, Percent, Search, Edit2, Download, Check, Save } from 'lucide-react';

export default function GradebookPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('IOT & Embedded Systems');
  const [selectedClass, setSelectedClass] = useState<string>('Class-X');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editMap, setEditMap] = useState<Record<string, any>>({});
  
  // Dialog state for a detailed review/edit
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const fetchGradebook = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/teacher/gradebook?subject=${encodeURIComponent(selectedSubject)}&class=${selectedClass}&section=${selectedSection}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setEntries(data);
    } catch (err) {
      console.error('Error fetching gradebook:', err);
    }
  };

  useEffect(() => {
    fetchGradebook();
  }, [token, selectedSubject, selectedClass, selectedSection]);

  // Filtered entries by search query
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.studentName.toLowerCase().includes(query) ||
          e.rollNo.includes(query)
        );
      }
      return true;
    });
  }, [entries, searchQuery]);

  // Statistics calculations
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0 };
    }
    let totalPct = 0;
    let highest = 0;
    let lowest = 100;
    let passed = 0;

    filteredEntries.forEach(e => {
      totalPct += e.percentage;
      if (e.percentage > highest) highest = e.percentage;
      if (e.percentage < lowest) lowest = e.percentage;
      if (e.percentage >= 40) passed++;
    });

    return {
      average: Math.round(totalPct / filteredEntries.length),
      highest,
      lowest,
      passRate: Math.round((passed / filteredEntries.length) * 100)
    };
  }, [filteredEntries]);

  // Calculations for total score, percentage, and grade mapping
  const calculateResult = (entry: Partial<any>): { total: number; pct: number; grade: string } => {
    const ut1 = entry.unitTest1 || 0;
    const ut2 = entry.unitTest2 || 0;
    const mid = entry.midTerm || 0;
    const asgn = entry.assignment || 0;
    const prac = entry.practical || 0;
    
    const total = ut1 + ut2 + mid + asgn + prac;
    const max = 225; // standard total max
    const pct = Math.round((total / max) * 100);
    
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 40) grade = 'D';

    return { total, pct, grade };
  };

  // Turn on edit mode and populate temporary state
  const handleStartEdit = () => {
    const map: Record<string, any> = {};
    filteredEntries.forEach(e => {
      map[e.id] = { ...e };
    });
    setEditMap(map);
    setIsEditing(true);
  };

  // Handle single cell input changes during edit mode
  const handleCellChange = (id: string, field: string, value: string) => {
    const numVal = value === '' ? 0 : Number(value);
    setEditMap(prev => {
      const updatedEntry = { ...prev[id], [field]: numVal };
      const { total, pct, grade } = calculateResult(updatedEntry);
      
      return {
        ...prev,
        [id]: {
          ...updatedEntry,
          totalScore: total,
          percentage: pct,
          grade
        }
      };
    });
  };

  // Save changes from edit mode back to database
  const handleSaveAll = async () => {
    if (!token) return;

    try {
      const res = await fetch('/api/v1/teacher/gradebook/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: selectedSubject,
          entries: Object.values(editMap)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save batch grades');

      alert('Grades saved successfully!');
      fetchGradebook();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save batch grades');
    }
  };

  // Modal detailed editor handlers
  const handleOpenDetails = (entry: any) => {
    setSelectedEntry({ ...entry });
    setIsDetailsOpen(true);
  };

  const handleSaveDetail = async () => {
    if (!selectedEntry || !token) return;
    const { total, pct, grade } = calculateResult(selectedEntry);
    const updated = {
      ...selectedEntry,
      totalScore: total,
      percentage: pct,
      grade
    };

    try {
      const res = await fetch('/api/v1/teacher/gradebook/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: selectedSubject,
          entries: [updated]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save grade details');

      alert('Grade entry saved successfully!');
      fetchGradebook();
      setIsDetailsOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save grade details');
    }
  };

  const triggerExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Gradebook</h1>
          <p className="text-gray-500 text-sm mt-0.5">Aggregate scores, view performance statistics, and publish final marks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={triggerExport} className="flex items-center gap-2">
            {exportSuccess ? <Check className="h-4 w-4 text-green-600" /> : <Download className="h-4 w-4" />}
            {exportSuccess ? 'Exported CSV!' : 'Export Gradebook'}
          </Button>
          {isEditing ? (
            <Button onClick={handleSaveAll} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Grades
            </Button>
          ) : (
            <Button onClick={handleStartEdit} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
              <Edit2 className="h-4 w-4" /> Quick Edit Mode
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Class-X">Class-X</option>
                <option value="Class-XI">Class-XI</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="IOT & Embedded Systems">IOT & Embedded Systems</option>
                <option value="Embedded C Programming">Embedded C Programming</option>
                <option value="Network Protocols">Network Protocols</option>
              </select>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by student or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${stats.average}%`, icon: Percent, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Highest Score', value: `${stats.highest}%`, icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Lowest Score', value: `${stats.lowest}%`, icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Passing Rate', value: `${stats.passRate}%`, icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Spreadsheet Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Roll No', 'Student Name', 'UT 1 (25)', 'UT 2 (25)', 'Mid Term (100)', 'Assignment (25)', 'Practical (50)', 'Total (225)', 'Percentage', 'Grade', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(e => {
                const isItemEditing = isEditing && editMap[e.id];
                const activeData = isItemEditing ? editMap[e.id] : e;
                return (
                  <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{activeData.rollNo}</td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 text-xs">{activeData.studentName}</td>
                    {['unitTest1', 'unitTest2', 'midTerm', 'assignment', 'practical'].map(field => (
                      <td key={field} className="px-4 py-3.5">
                        {isItemEditing ? (
                          <input
                            type="number"
                            value={activeData[field] === 0 ? '' : activeData[field]}
                            onChange={el => handleCellChange(e.id, field, el.target.value)}
                            className="w-16 h-8 px-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          <span className="text-xs text-gray-700 font-medium">{activeData[field]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-xs text-gray-900 font-bold">
                      {activeData.totalScore}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 font-semibold">
                      {activeData.percentage}%
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={activeData.percentage >= 40 ? 'success' : 'danger'} className="text-[9px] uppercase font-bold tracking-wider">
                        {activeData.grade}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenDetails(activeData)} className="text-teal-600 hover:bg-teal-50 text-xs font-bold h-8">
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-xs">No student grade records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detailed Modal Editor */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Edit Grades: {selectedEntry?.studentName}</DialogTitle></DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Unit Test 1 (25)</label>
                  <Input type="number" value={selectedEntry.unitTest1} onChange={el => setSelectedEntry((p: any) => ({ ...p, unitTest1: Number(el.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Unit Test 2 (25)</label>
                  <Input type="number" value={selectedEntry.unitTest2} onChange={el => setSelectedEntry((p: any) => ({ ...p, unitTest2: Number(el.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Mid Term (100)</label>
                  <Input type="number" value={selectedEntry.midTerm} onChange={el => setSelectedEntry((p: any) => ({ ...p, midTerm: Number(el.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Assignment (25)</label>
                  <Input type="number" value={selectedEntry.assignment} onChange={el => setSelectedEntry((p: any) => ({ ...p, assignment: Number(el.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Practical (50)</label>
                  <Input type="number" value={selectedEntry.practical} onChange={el => setSelectedEntry((p: any) => ({ ...p, practical: Number(el.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Remarks</label>
                  <Input value={selectedEntry.remarks || ''} onChange={el => setSelectedEntry((p: any) => ({ ...p, remarks: el.target.value }))} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDetail} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
