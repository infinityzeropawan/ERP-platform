import { useState, useEffect } from 'react';
import { Student } from '../students_types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/teacher/students').then(r => r.ok ? r.json() : []).then(setStudents);
  }, []);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return { students, search, setSearch, filtered };
}
