'use client';
import { useGradebook } from '../gradebook_hooks/useGradebook';
import { GradebookHeader } from './GradebookHeader';
import { GradebookFilters } from './GradebookFilters';
import { GradebookStats } from './GradebookStats';
import { GradebookTable } from './GradebookTable';
import { GradebookModals } from './GradebookModals';

export function GradebookMain() {
  const {
    selectedSubject, setSelectedSubject,
    selectedClass, setSelectedClass,
    selectedSection, setSelectedSection,
    searchQuery, setSearchQuery,
    isEditing,
    editMap, handleCellChange,
    filteredEntries, stats,
    exportSuccess, triggerExport,
    handleStartEdit, handleSaveAll,
    selectedEntry, setSelectedEntry,
    isDetailsOpen, setIsDetailsOpen,
    handleOpenDetails, handleSaveDetail
  } = useGradebook();

  return (
    <div className="space-y-6">
      <GradebookHeader 
        isEditing={isEditing}
        exportSuccess={exportSuccess}
        triggerExport={triggerExport}
        handleStartEdit={handleStartEdit}
        handleSaveAll={handleSaveAll}
      />
      <GradebookFilters 
        selectedClass={selectedClass} setSelectedClass={setSelectedClass}
        selectedSection={selectedSection} setSelectedSection={setSelectedSection}
        selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      />
      <GradebookStats stats={stats} />
      <GradebookTable 
        filteredEntries={filteredEntries}
        isEditing={isEditing}
        editMap={editMap}
        handleCellChange={handleCellChange}
        handleOpenDetails={handleOpenDetails}
      />
      <GradebookModals 
        isDetailsOpen={isDetailsOpen} setIsDetailsOpen={setIsDetailsOpen}
        selectedEntry={selectedEntry} setSelectedEntry={setSelectedEntry}
        handleSaveDetail={handleSaveDetail}
      />
    </div>
  );
}
