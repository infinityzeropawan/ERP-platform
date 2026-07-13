// RESPONSIBILITY: Renders the header section of the Timetable page.
"use client";

import { Clock } from 'lucide-react';

export default function TimetableHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
        <Clock className="h-6 w-6 text-primary" />
        My Weekly Timetable
      </h1>
      <p className="text-text-secondary text-sm mt-0.5">Your scheduled classes for the week</p>
    </div>
  );
}
