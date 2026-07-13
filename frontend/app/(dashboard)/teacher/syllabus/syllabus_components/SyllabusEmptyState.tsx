// RESPONSIBILITY: Renders the empty state when no syllabus units exist.
"use client";

export default function SyllabusEmptyState() {
  return (
    <div className="text-sm text-text-secondary text-center py-10 bg-bg-card border border-border border-dashed rounded-2xl">
      No syllabus units tracked yet. Click "Add Unit" to begin tracking.
    </div>
  );
}
