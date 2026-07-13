'use client';
import { useParentCommunication, categories } from '../parent-communication_hooks/useParentCommunication';
import { ParentCommunicationHeader } from './ParentCommunicationHeader';
import { ParentCommunicationFilter } from './ParentCommunicationFilter';
import { ParentCommunicationList } from './ParentCommunicationList';
import { ParentCommunicationModals } from './ParentCommunicationModals';

export function ParentCommunicationMain() {
  const {
    loading,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    isComposeOpen, setIsComposeOpen,
    isDetailsOpen, setIsDetailsOpen,
    isBroadcast, setIsBroadcast,
    selectedStudentId, setSelectedStudentId,
    selectedTemplateId, setSelectedTemplateId,
    category, setCategory,
    priority, setPriority,
    subject, setSubject,
    body, setBody,
    selectedMessage,
    sendSuccess,
    filteredMessages,
    students,
    currentStudent,
    handleSendMessage,
    handleOpenDetails,
    messageTemplates
  } = useParentCommunication();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ParentCommunicationHeader onOpenCompose={() => setIsComposeOpen(true)} />
      
      <ParentCommunicationFilter 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        categories={categories} 
      />

      <ParentCommunicationList 
        messages={filteredMessages} 
        onOpenDetails={handleOpenDetails} 
      />

      <ParentCommunicationModals 
        isComposeOpen={isComposeOpen} 
        setIsComposeOpen={setIsComposeOpen} 
        isDetailsOpen={isDetailsOpen} 
        setIsDetailsOpen={setIsDetailsOpen} 
        isBroadcast={isBroadcast} 
        setIsBroadcast={setIsBroadcast} 
        selectedStudentId={selectedStudentId} 
        setSelectedStudentId={setSelectedStudentId} 
        selectedTemplateId={selectedTemplateId} 
        setSelectedTemplateId={setSelectedTemplateId} 
        category={category} 
        setCategory={setCategory} 
        priority={priority} 
        setPriority={setPriority} 
        subject={subject} 
        setSubject={setSubject} 
        body={body} 
        setBody={setBody} 
        selectedMessage={selectedMessage} 
        sendSuccess={sendSuccess} 
        students={students} 
        currentStudent={currentStudent} 
        handleSendMessage={handleSendMessage} 
        messageTemplates={messageTemplates} 
      />
    </div>
  );
}
