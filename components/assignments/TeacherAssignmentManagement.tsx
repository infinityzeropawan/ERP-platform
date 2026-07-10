
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TeacherAssignmentManagement() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Assignment Management</h1>
      <div className="flex gap-4 mb-8">
        <Input placeholder="Search assignments..." className="max-w-sm" />
        <Button>Create New</Button>
      </div>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No assignments found. Start by creating one.
      </div>
    </div>
  );
}
