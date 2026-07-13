import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { STUDENT_ROUTES } from '../student_url_config';

export interface Assignment {
  id: string; title: string; description: string; subject: string; dueDate: string;
  maxMarks: number; status: string; submittedBy?: string[];
}
export interface AssignmentSubmission {
  id: string; assignmentId: string; submittedAt: string; submissionText?: string; contentUrl?: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  marksObtained?: number; feedback?: string;
}

export function useAssignments() {
  const { data: rawAssignments, loading, error } = useResource<{
    id: string; title: string; description: string; subject: string; dueAt: string;
    maxMarks: number; status: string;
  }>('assignments');

  const { data: rawSubmissions, create: submitAssignmentApi } = useResource<{
    id: string; assignmentId: string; submittedAt: string; notes?: string; contentUrl?: string;
    marks?: number; feedback?: string;
  }>('assignment-submissions');

  const assignments: Assignment[] = rawAssignments.map(item => ({
    ...item, dueDate: new Date(item.dueAt).toLocaleDateString(),
  }));

  const submissions: AssignmentSubmission[] = rawSubmissions.map(item => ({
    ...item,
    submissionText: item.notes,
    status: item.marks == null ? 'submitted' : 'graded',
    marksObtained: item.marks,
  }));

  const [uploading, setUploading] = useState(false);

  const getSubmission = (id: string) => submissions.find(s => s.assignmentId === id);

  const submitAssignment = async (assignmentId: string, text: string, file: File | null) => {
    setUploading(true);
    let contentUrl = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(STUDENT_ROUTES.API.UPLOAD, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) contentUrl = data.url;
      } catch (err) {
        console.error('File upload failed', err);
      }
    }

    await submitAssignmentApi({ assignmentId, notes: text, contentUrl });
    setUploading(false);
  };

  return {
    assignments,
    submissions,
    loading,
    error,
    uploading,
    getSubmission,
    submitAssignment
  };
}
