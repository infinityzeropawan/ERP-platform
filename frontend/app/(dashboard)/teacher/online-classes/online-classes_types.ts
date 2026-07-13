export interface OnlineClass {
  id: string;
  subject: string;
  teacherName: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  recordingUrl?: string;
  status: 'live' | 'upcoming' | 'completed';
}

export interface OnlineClassForm {
  subject: string;
  title: string;
  description: string;
  platform: string;
  meetingLink: string;
  meetingId: string;
  date: string;
  time: string;
  durationMins: string;
}
