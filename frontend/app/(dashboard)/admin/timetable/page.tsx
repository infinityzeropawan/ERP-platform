'use client';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ResourceState, useResource } from '@/lib/useResource';
import { Clock, Plus, Trash2, Edit, AlertCircle, CheckCircle, HelpCircle, MapPin, User, BookOpen } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface TimetableItem {
  id: string;
  name: string;
  timee: string;
  subject: string;
  subjectCode: string;
  class: string;
  room: string;
  teacherName: string;
}

export default function AdminTimetablePage() {
  const { data: periods, loading, error, create, update, remove } = useResource<{
    id: string; dayOfWeek: number; periodNo: number; startTime: string; endTime: string;
    subject: string; subjectCode?: string; className: string; section?: string;
    room?: string; teacherName?: string;
  }>('timetable');
  const [timetableData, setTimetableData] = useState<Record<string, TimetableItem[]>>({});
  const [activeTeachers, setActiveTeachers] = useState<Array<{ id: string; name: string }>>([]);
  useEffect(() => {
    const data: Record<string, TimetableItem[]> = Object.fromEntries(DAYS.map(day => [day, []]));
    periods.forEach(period => data[DAYS[period.dayOfWeek - 1]]?.push({
      id: period.id,
      name: `Period ${period.periodNo}`,
      time: `${period.startTime} – ${period.endTime}`,
      subject: period.subject,
      subjectCode: period.subjectCode || '',
      class: `${period.className}${period.section ? ` – ${period.section}` : ''}`,
      room: period.room || '',
      teacherName: period.teacherName || '',
    }));
    setTimetableData(data);
  }, [periods]);
  useEffect(() => {
    fetch('/api/v1/admin/users?role=teacher').then(response => response.json()).then(setActiveTeachers);
  }, []);

  const [selectedClass, setSelectedClass] = useState<string>('IOT-2026 – Evening');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [activeSlot, setActiveSlot] = useState<Partial<TimetableItem> & { day?: string } | null>(null);

  // Validation Warnings
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const classes = [
    'IOT-2026 – Evening',
    'CS-2026 – Morning',
    'MECH-2026 – Afternoon',
  ];

  const subjects = [
    { code: 'IOT101', name: 'IOT & Embedded Systems' },
    { code: 'IOT102', name: 'Embedded C Programming' },
    { code: 'IOT103', name: 'Network Protocols' },
    { code: 'CS101', name: 'Computer Science Fundamentals' },
  ];

  // Helper to convert "HH:MM AM/PM" to minutes from midnight for overlap checking
  const timeToMinutes = (timeStr: string): number => {
    const cleanStr = timeStr.trim().toUpperCase();
    const match = cleanStr.match(/^(\d+):(\d+)\s*(AM|PM)$/);
    if (!match) return 0;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const ampm = match[3];

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Helper to parse interval "8:30 PM – 9:30 PM" (supports dash/hyphen variants)
  const parseInterval = (intervalStr: string): { start: number; end: number } => {
    const parts = intervalStr.split(/[–-]/);
    if (parts.length < 2) return { start: 0, end: 0 };
    return {
      start: timeToMinutes(parts[0]),
      end: timeToMinutes(parts[1])
    };
  };

  // Check conflicts (overlapping slots for the same teacher or room on the same day)
  const checkConflict = (
    day: string,
    intervalStr: string,
    teacher: string,
    room: string,
    ignoreId?: string
  ): string | null => {
    const newTimes = parseInterval(intervalStr);
    if (newTimes.start >= newTimes.end) return 'Invalid time range: Start time must be before end time.';

    // Check all days and classes in timetableData
    for (const d of DAYS) {
      if (d !== day) continue;

      const slots = timetableData[d] || [];
      for (const slot of slots) {
        if (slot.id === ignoreId) continue;

        const existingTimes = parseInterval(slot.time);

        // Overlap condition: startA < endB && endA > startB
        const isOverlapping = newTimes.start < existingTimes.end && newTimes.end > existingTimes.start;

        if (isOverlapping) {
          if (slot.teacherName === teacher) {
            return `Conflict: Teacher "${teacher}" is already assigned to "${slot.subject}" for class "${slot.class}" during this time (${slot.time}) on ${day}.`;
          }
          if (slot.room === room && room !== 'Online') {
            return `Conflict: Room "${room}" is already booked for class "${slot.class}" during this time (${slot.time}) on ${day}.`;
          }
        }
      }
    }
    return null;
  };

  // Open create dialog
  const handleOpenAdd = (day: string) => {
    setConflictWarning(null);
    setActiveSlot({
      id: `slot-${Date.now()}`,
      day,
      name: 'Period 1',
      time: '8:30 PM – 9:30 PM',
      subject: 'IOT & Embedded Systems',
      subjectCode: 'IOT101',
      class: selectedClass,
      room: 'Lab-3',
      teacherName: 'Pawan Kumar Dubey'
    });
    setIsAddOpen(true);
  };

  // Submit new slot
  const handleAddSubmit = async () => {
    if (!activeSlot || !activeSlot.day || !activeSlot.time) return;

    const conflict = checkConflict(
      activeSlot.day,
      activeSlot.time,
      activeSlot.teacherName || '',
      activeSlot.room || ''
    );

    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    const sub = subjects.find(s => s.code === activeSlot.subjectCode);
    const newSlot: TimetableItem = {
      id: activeSlot.id || `slot-${Date.now()}`,
      name: activeSlot.name || 'Period 1',
      time: activeSlot.time,
      subject: sub ? sub.name : (activeSlot.subject || ''),
      subjectCode: activeSlot.subjectCode || 'IOT101',
      class: selectedClass,
      room: activeSlot.room || 'Lab-3',
      teacherName: activeSlot.teacherName || 'Pawan Kumar Dubey'
    };

    const [startTime, endTime] = newSlot.time.split(/[–-]/).map(value => value.trim());
    const [className, section] = selectedClass.split(' – ');
    await create({
      dayOfWeek: DAYS.indexOf(activeSlot.day) + 1,
      periodNo: Number(newSlot.name.replace(/\D/g, '')) || 1,
      startTime, endTime, subject: newSlot.subject, subjectCode: newSlot.subjectCode,
      className, section, room: newSlot.room, teacherName: newSlot.teacherName,
    });
    setIsAddOpen(false);
  };

  // Open edit dialog
  const handleOpenEdit = (day: string, slot: TimetableItem) => {
    setConflictWarning(null);
    setActiveSlot({ ...slot, day });
    setIsEditOpen(true);
  };

  // Submit edit slot
  const handleEditSubmit = async () => {
    if (!activeSlot || !activeSlot.day || !activeSlot.id || !activeSlot.time) return;

    const conflict = checkConflict(
      activeSlot.day,
      activeSlot.time,
      activeSlot.teacherName || '',
      activeSlot.room || '',
      activeSlot.id
    );

    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    const sub = subjects.find(s => s.code === activeSlot.subjectCode);
    const updatedSlot: TimetableItem = {
      id: activeSlot.id,
      name: activeSlot.name || 'Period 1',
      time: activeSlot.time,
      subject: sub ? sub.name : (activeSlot.subject || ''),
      subjectCode: activeSlot.subjectCode || 'IOT101',
      class: selectedClass,
      room: activeSlot.room || 'Lab-3',
      teacherName: activeSlot.teacherName || 'Pawan Kumar Dubey'
    };

    const [startTime, endTime] = updatedSlot.time.split(/[–-]/).map(value => value.trim());
    const [className, section] = selectedClass.split(' – ');
    await update(updatedSlot.id, {
      dayOfWeek: DAYS.indexOf(activeSlot.day) + 1,
      periodNo: Number(updatedSlot.name.replace(/\D/g, '')) || 1,
      startTime, endTime, subject: updatedSlot.subject, subjectCode: updatedSlot.subjectCode,
      className, section, room: updatedSlot.room, teacherName: updatedSlot.teacherName,
    });
    setIsEditOpen(false);
  };

  // Delete slot
  const handleDeleteSlot = (_day: string, slotId: string) => { void remove(slotId); };
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Assign subjects, teachers, rooms, and detect scheduling conflicts dynamically.</p>
        </div>
      </div>

      {/* Class selector */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Select Class & Batch:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
          >
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Daily Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        {DAYS.map(day => {
          const slots = (timetableData[day] || []).filter(s => s.class === selectedClass);

          return (
            <Card key={day} className="flex flex-col min-h-[300px] border-gray-150">
              <CardHeader className="bg-gray-50/50 py-2.5 px-3 border-b flex flex-row items-center justify-between">
                <span className="font-bold text-sm text-gray-700">{day}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenAdd(day)}
                  className="h-7 w-7 p-0 rounded-full text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-2 flex-1 space-y-2">
                {slots.map(s => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-gradient-to-br from-teal-50 to-blue-50/40 rounded-xl border border-teal-100 hover:shadow-sm transition-shadow text-xs space-y-1.5 relative group"
                  >
                    {/* Action buttons on hover */}
                    <div className="absolute right-1 top-1 hidden group-hover:flex items-center gap-1 bg-white/90 p-0.5 rounded shadow-sm">
                      <button
                        onClick={() => handleOpenEdit(day, s)}
                        className="p-1 hover:bg-gray-100 rounded text-teal-600"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(day, s.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pr-8">
                      <span className="font-semibold text-teal-800">{s.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5"><Clock className="h-3 w-3" /> {s.time.split(' ')[0]}</span>
                    </div>

                    <p className="font-bold text-gray-950 truncate">{s.subject}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{s.teacherName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="font-mono bg-teal-100/50 text-teal-800 px-1 rounded">{s.subjectCode}</span>
                      <span className="flex items-center gap-0.5 text-gray-500 font-medium"><MapPin className="h-3 w-3" /> {s.room}</span>
                    </div>
                  </div>
                ))}

                {slots.length === 0 && (
                  <div className="h-full flex items-center justify-center py-10 text-gray-300 text-center flex-col gap-1 select-none">
                    <span className="text-xl">—</span>
                    <span className="text-[10px]">No Periods</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Timetable Slot</DialogTitle>
          </DialogHeader>
          {activeSlot && (
            <div className="space-y-4 py-3">
              {conflictWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>{conflictWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Day of Week</label>
                  <select
                    value={activeSlot.day}
                    onChange={(ev) => {
                      setConflictWarning(null);
                      setActiveSlot({ ...activeSlot, day: ev.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Period Name</label>
                  <Input
                    value={activeSlot.name}
                    onChange={(ev) => setActiveSlot({ ...activeSlot, name: ev.target.value })}
                    placeholder="Period 1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Time Slot (e.g. "8:30 PM – 9:30 PM")</label>
                <Input
                  value={activeSlot.time}
                  onChange={(ev) => {
                    setConflictWarning(null);
                    setActiveSlot({ ...activeSlot, time: ev.target.value });
                  }}
                  placeholder="8:30 PM – 9:30 PM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Subject</label>
                  <select
                    value={activeSlot.subjectCode}
                    onChange={(ev) => setActiveSlot({ ...activeSlot, subjectCode: ev.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {subjects.map(s => (
                      <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Assigned Teacher</label>
                  <select
                    value={activeSlot.teacherName}
                    onChange={(ev) => {
                      setConflictWarning(null);
                      setActiveSlot({ ...activeSlot, teacherName: ev.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {activeTeachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Room Assignment</label>
                <Input
                  value={activeSlot.room}
                  onChange={(ev) => {
                    setConflictWarning(null);
                    setActiveSlot({ ...activeSlot, room: ev.target.value });
                  }}
                  placeholder="Lab-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Timetable Slot</DialogTitle>
          </DialogHeader>
          {activeSlot && (
            <div className="space-y-4 py-3">
              {conflictWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>{conflictWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Day of Week</label>
                  <select
                    value={activeSlot.day}
                    onChange={(ev) => {
                      setConflictWarning(null);
                      setActiveSlot({ ...activeSlot, day: ev.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Period Name</label>
                  <Input
                    value={activeSlot.name}
                    onChange={(ev) => setActiveSlot({ ...activeSlot, name: ev.target.value })}
                    placeholder="Period 1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Time Slot (e.g. "8:30 PM – 9:30 PM")</label>
                <Input
                  value={activeSlot.time}
                  onChange={(ev) => {
                    setConflictWarning(null);
                    setActiveSlot({ ...activeSlot, time: ev.target.value });
                  }}
                  placeholder="8:30 PM – 9:30 PM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Subject</label>
                  <select
                    value={activeSlot.subjectCode}
                    onChange={(ev) => setActiveSlot({ ...activeSlot, subjectCode: ev.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {subjects.map(s => (
                      <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Assigned Teacher</label>
                  <select
                    value={activeSlot.teacherName}
                    onChange={(ev) => {
                      setConflictWarning(null);
                      setActiveSlot({ ...activeSlot, teacherName: ev.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {activeTeachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Room Assignment</label>
                <Input
                  value={activeSlot.room}
                  onChange={(ev) => {
                    setConflictWarning(null);
                    setActiveSlot({ ...activeSlot, room: ev.target.value });
                  }}
                  placeholder="Lab-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
