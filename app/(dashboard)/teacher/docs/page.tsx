'use client';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';
export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FolderOpen className="h-6 w-6 text-teal-600" />Docs & Components</h1>
        <p className="text-gray-500 text-sm mt-0.5">Documentation and resources</p>
      </div>
      <Card><CardContent className="p-16 text-center flex flex-col items-center gap-3 text-gray-400">
        <FolderOpen className="h-12 w-12 text-gray-300" />
        <p className="text-base font-medium">Docs & Components — Coming Soon</p>
        <p className="text-sm">This feature is under development</p>
      </CardContent></Card>
    </div>
  );
}
