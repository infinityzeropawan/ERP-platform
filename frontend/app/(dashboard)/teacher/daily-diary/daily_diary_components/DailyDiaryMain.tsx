'use client';
import { useDailyDiary } from '../daily_diary_hooks/useDailyDiary';
import { DailyDiaryHeader } from './DailyDiaryHeader';
import { DailyDiaryFilters } from './DailyDiaryFilters';
import { DailyDiaryList } from './DailyDiaryList';
import { DailyDiaryModals } from './DailyDiaryModals';

export function DailyDiaryMain() {
  const {
    searchQuery, setSearchQuery,
    selectedSubject, setSelectedSubject,
    isAddOpen, setIsAddOpen,
    isEditOpen, setIsEditOpen,
    isDeleteOpen, setIsDeleteOpen,
    activeEntry, setActiveEntry,
    subjectOptions,
    filteredEntries,
    handleOpenAdd,
    handleAddSubmit,
    handleOpenEdit,
    handleEditSubmit,
    handleOpenDelete,
    handleDeleteConfirm,
    togglePublish
  } = useDailyDiary();

  return (
    <div className="space-y-6">
      <DailyDiaryHeader onOpenAdd={handleOpenAdd} />
      <DailyDiaryFilters 
        selectedSubject={selectedSubject} 
        setSelectedSubject={setSelectedSubject}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        subjectOptions={subjectOptions}
      />
      <DailyDiaryList 
        filteredEntries={filteredEntries}
        togglePublish={togglePublish}
        handleOpenEdit={handleOpenEdit}
        handleOpenDelete={handleOpenDelete}
      />
      <DailyDiaryModals 
        isAddOpen={isAddOpen} setIsAddOpen={setIsAddOpen}
        isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen}
        activeEntry={activeEntry} setActiveEntry={setActiveEntry}
        handleAddSubmit={handleAddSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        subjectOptions={subjectOptions}
      />
    </div>
  );
}
