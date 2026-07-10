'use client';
import { useModules } from '@/lib/ModuleContext';
import type { ModuleKey } from '@/lib/modules';

interface ModuleGuardProps {
  module: ModuleKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the module is enabled for this institution.
 * Use this to wrap any feature that depends on a module.
 *
 * Example:
 *   <ModuleGuard module="mod_attendance">
 *     <AttendancePage />
 *   </ModuleGuard>
 */
export default function ModuleGuard({ module, children, fallback = null }: ModuleGuardProps) {
  const { hasModule } = useModules();
  if (!hasModule(module)) return <>{fallback}</>;
  return <>{children}</>;
}
