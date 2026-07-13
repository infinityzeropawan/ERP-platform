'use client';

import { useAiNotes } from '../ai_notes_hooks/useAiNotes';
import { AiNotesHeader } from './AiNotesHeader';
import { AiNotesGeneratorForm } from './AiNotesGeneratorForm';
import { AiNotesResult } from './AiNotesResult';

export function AiNotesMain() {
  const {
    subject,
    setSubject,
    topic,
    setTopic,
    loading,
    notes,
    provider,
    error,
    generate,
    renderMarkdown
  } = useAiNotes();

  return (
    <div className="space-y-6">
      <AiNotesHeader />
      <AiNotesGeneratorForm 
        subject={subject}
        setSubject={setSubject}
        topic={topic}
        setTopic={setTopic}
        loading={loading}
        generate={generate}
      />
      <AiNotesResult 
        notes={notes}
        provider={provider}
        error={error}
        renderMarkdown={renderMarkdown}
      />
    </div>
  );
}
