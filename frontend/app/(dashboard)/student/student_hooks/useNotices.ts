import { useResource } from '@/lib/useResource';

export interface Notice {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  authorName: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function useNotices() {
  const { data: notices, loading, error } = useResource<Notice>('notices');

  return {
    notices,
    loading,
    error
  };
}
