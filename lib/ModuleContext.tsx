'use client';
import React, { createContext, useContext, useMemo } from 'react';
import type { ModuleKey, InstitutionType } from './modules';
import { getDefaultModules, isModuleEnabled, getTerm, INSTITUTION_TYPE_LABELS } from './modules';
import { useAuth } from './AuthContext';

// ─────────────────────────────────────────────────────────────
// For now, institution config comes from mock.
// When backend is ready, fetch from API on login.
// ─────────────────────────────────────────────────────────────
const MOCK_INSTITUTION = {
  id: 'inst-001',
  name: 'Buildroonix Demo Institute',
  slug: 'demo',
  type: 'school' as InstitutionType,
  // Super admin can override these — add/remove modules
  enabledModules: null as ModuleKey[] | null, // null = use defaults for type
};

interface ModuleContextType {
  institutionType: InstitutionType;
  enabledModules: ModuleKey[];
  hasModule: (key: ModuleKey) => boolean;
  term: (key: keyof typeof INSTITUTION_TYPE_LABELS[InstitutionType]['terms']) => string;
  institutionName: string;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const institutionType: InstitutionType = MOCK_INSTITUTION.type;

  const enabledModules: ModuleKey[] = useMemo(() => {
    // If super admin has customized modules, use those
    // Otherwise use the defaults for the institution type
    return MOCK_INSTITUTION.enabledModules ?? getDefaultModules(institutionType);
  }, [institutionType]);

  const hasModule = (key: ModuleKey) => isModuleEnabled(enabledModules, key);

  const term = (key: keyof typeof INSTITUTION_TYPE_LABELS[InstitutionType]['terms']) =>
    getTerm(institutionType, key);

  return (
    <ModuleContext.Provider value={{
      institutionType,
      enabledModules,
      hasModule,
      term,
      institutionName: MOCK_INSTITUTION.name,
    }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModules must be used within ModuleProvider');
  return ctx;
}
