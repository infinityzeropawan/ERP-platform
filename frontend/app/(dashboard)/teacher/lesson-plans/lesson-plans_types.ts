export type LessonPlan = { 
  id: string; 
  subject: string; 
  subjectCode: string; 
  topic: string; 
  objectives: string; 
  content: string; 
  teachingAids: string; 
  plannedDate: string; 
  durationMins: number; 
  status: 'draft' | 'approved' | 'completed'; 
};

export type LessonPlanForm = Omit<LessonPlan, 'id' | 'durationMins'> & { durationMins: string };
