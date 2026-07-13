import { useState } from 'react';

export type StudyMaterial = {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'doc' | 'ppt' | 'link';
  fileUrl: string;
  fileSize?: string;
  uploadedBy: string;
  uploadedAt: string;
  chapter?: string;
  isNew?: boolean;
};

export function useStudyMaterial() {
  const [subject, setSubject] = useState('All');
  const subjects: string[] = ['All']; // To be populated from data if we fetch
  const materials: StudyMaterial[] = []; // Placeholder for fetched data

  const filtered = subject === 'All' ? materials : materials.filter(m => m.subjectName === subject);
  const newCount = materials.filter(m => m.isNew).length;
  
  const totalFiles = materials.length;
  const pdfCount = materials.filter(m => m.type === 'pdf').length;
  const videoCount = materials.filter(m => m.type === 'video').length;

  return {
    subject,
    setSubject,
    subjects,
    filtered,
    newCount,
    stats: {
      totalFiles,
      pdfCount,
      videoCount,
      newThisWeek: newCount
    }
  };
}
