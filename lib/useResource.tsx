'use client';

import { useCallback, useEffect, useState } from 'react';

export function useResource<T>(resource: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/resources/${resource}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || `Unable to load ${resource}`);
      setData(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Unable to load ${resource}`);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { void reload(); }, [reload]);

  const create = useCallback(async (input: Record<string, unknown>) => {
    const response = await fetch(`/api/v1/resources/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(payload?.message || `Unable to create ${resource}`);
    setData(current => [payload as T, ...current]);
    return payload as T;
  }, [resource]);

  const update = useCallback(async (id: string, input: Record<string, unknown>) => {
    const response = await fetch(`/api/v1/resources/${resource}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(payload?.message || `Unable to update ${resource}`);
    await reload();
  }, [reload, resource]);

  const remove = useCallback(async (id: string) => {
    const response = await fetch(`/api/v1/resources/${resource}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload?.message || `Unable to delete ${resource}`);
    }
    setData(current => current.filter(item => (item as { id?: string }).id !== id));
  }, [resource]);

  return { data, setData, loading, error, reload, create, update, remove };
}

export function ResourceState({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Loading…</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  return null;
}
