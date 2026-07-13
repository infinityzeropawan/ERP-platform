// RESPONSIBILITY: Renders the holiday notices section in the Timetable module.
"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sun, Calendar } from 'lucide-react';
import { TimetableNotice } from '../timetable_types/timetable_types';

export interface TimetableHolidayNoticesProps {
  notices: TimetableNotice[];
}

export default function TimetableHolidayNotices({ notices }: TimetableHolidayNoticesProps) {
  if (notices.length === 0) return null;

  return (
    <Card className="bg-bg-card border-border hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-text-primary">
          <Sun className="h-4 w-4 text-warning" />
          Holiday Notices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notices.map((h) => (
            <div
              key={h.id}
              className="flex items-center gap-3 p-3 bg-warning-bg rounded-xl border border-warning/20 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{h.title}</p>
                <p className="text-xs text-warning">
                  {new Date(h.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
