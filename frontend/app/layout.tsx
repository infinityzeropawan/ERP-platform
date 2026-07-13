import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { ModuleProvider } from '@/lib/ModuleContext';
import { ThemeProvider } from '@/components/providers/theme-provider';

export const metadata: Metadata = {
  title: 'Buildroonix — Smart School ERP & LMS',
  description: 'A modern, role-based School ERP & LMS platform powered by Buildroonix',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ModuleProvider>
              {children}
            </ModuleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
