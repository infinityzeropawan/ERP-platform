import { CheckCircle, Clock, Circle } from 'lucide-react';
import { SyllabusStatus } from '../syllabus_types/syllabus_types';

export const SYLLABUS_STATUS_CONFIG: Record<SyllabusStatus, { label: string; variant: 'success' | 'warning' | 'default'; icon: any; color: string }> = {
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle, color: 'text-success' },
  in_progress: { label: 'In Progress', variant: 'warning', icon: Clock, color: 'text-warning' },
  pending: { label: 'Pending', variant: 'default', icon: Circle, color: 'text-text-disabled' },
};
