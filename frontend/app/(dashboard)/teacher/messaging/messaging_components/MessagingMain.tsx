'use client';
import { useMessaging } from '../messaging_hooks/useMessaging';
import { MessagingHeader } from './MessagingHeader';
import { MessagingSidebar } from './MessagingSidebar';
import { MessagingContent } from './MessagingContent';

export function MessagingMain() {
  const {
    selected, setSelected,
    search, setSearch,
    compose, setCompose,
    form, setForm,
    filtered, students,
    send
  } = useMessaging();

  return (
    <div className="space-y-4">
      <MessagingHeader onCompose={() => setCompose(true)} />
      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        <MessagingSidebar 
          search={search} setSearch={setSearch} 
          filtered={filtered} 
          selected={selected} setSelected={setSelected} 
        />
        <MessagingContent 
          compose={compose} setCompose={setCompose} 
          selected={selected} 
          form={form} setForm={setForm} 
          students={students} 
          send={send} 
        />
      </div>
    </div>
  );
}
