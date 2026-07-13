import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { GradebookEntry, GradebookStats } from '../gradebook_types';

export function useGradebook() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<GradebookEntry[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('IOT & Embedded Systems');
  const [selectedClass, setSelectedClass] = useState<string>('Class-X');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editMap, setEditMap] = useState<Record<string, GradebookEntry>>({});
  
  const [selectedEntry, setSelectedEntry] = useState<GradebookEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const fetchGradebook = useCallback(async () => {
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
  }, [token, selectedSubject, selectedClass, selectedSection]);

  useEffect(() => {
    fetchGradebook();
  }, [fetchGradebook]);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.studentName.toLowerCase().includes(query) ||
          e.rollNo.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [entries, searchQuery]);

  const stats = useMemo<GradebookStats>(() => {
    if (filteredEntries.length === 0) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0 };
    }
    let totalPct = 0;
    let highest = 0;
    let lowest = 100;
    let passed = 0;

    filteredEntries.forEach(e => {
      const pct = e.percentage || 0;
      totalPct += pct;
      if (pct > highest) highest = pct;
      if (pct < lowest) lowest = pct;
      if (pct >= 40) passed++;
    });

    return {
      average: Math.round(totalPct / filteredEntries.length),
      highest,
      lowest,
      passRate: Math.round((passed / filteredEntries.length) * 100)
    };
  }, [filteredEntries]);

  const calculateResult = (entry: Partial<GradebookEntry>) => {
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

  const handleStartEdit = () => {
    const map: Record<string, GradebookEntry> = {};
    filteredEntries.forEach(e => {
      map[e.id] = { ...e };
    });
    setEditMap(map);
    setIsEditing(true);
  };

  const handleCellChange = (id: string, field: keyof GradebookEntry, value: string) => {
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

  const handleOpenDetails = (entry: GradebookEntry) => {
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

  return {
    selectedSubject, setSelectedSubject,
    selectedClass, setSelectedClass,
    selectedSection, setSelectedSection,
    searchQuery, setSearchQuery,
    isEditing, setIsEditing,
    editMap, handleCellChange,
    filteredEntries, stats,
    exportSuccess, triggerExport,
    handleStartEdit, handleSaveAll,
    selectedEntry, setSelectedEntry,
    isDetailsOpen, setIsDetailsOpen,
    handleOpenDetails, handleSaveDetail
  };
}
