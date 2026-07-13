'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Printer, Star, Calendar, Building2 } from 'lucide-react';
import { useCertificates, Certificate } from @/app/(dashboard)/student/certificates/certificates_hooks/useCertificates;
import '../../student.css';

const typeConfig = {
  academic:      { label: 'Academic',      bg: 'var(--student-success-bg)', color: 'var(--student-success)' },
  attendance:    { label: 'Attendance',    bg: 'var(--student-info-bg)',    color: 'var(--student-info)' },
  participation: { label: 'Participation', bg: 'var(--student-primary-subtle)', color: 'var(--student-primary)' },
  achievement:   { label: 'Achievement',   bg: 'var(--student-warning-bg)', color: 'var(--student-warning)' },
  completion:    { label: 'Completion',    bg: 'var(--student-success-bg)', color: 'var(--student-success)' },
};

export default function CertificatesClient() {
  const { certificates } = useCertificates();
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <Award className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Certificates
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>Your achievements, awards and completion certificates</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',       value: certificates.length,                                          color: 'var(--student-primary)', bg: 'var(--student-primary-subtle)', border: 'var(--student-primary)' },
          { label: 'Academic',    value: certificates.filter(c => c.type === 'academic').length,       color: 'var(--student-success)', bg: 'var(--student-success-bg)', border: 'var(--student-success)' },
          { label: 'Achievement', value: certificates.filter(c => c.type === 'achievement').length,    color: 'var(--student-warning)', bg: 'var(--student-warning-bg)', border: 'var(--student-warning)' },
          { label: 'Completion',  value: certificates.filter(c => c.type === 'completion').length,     color: 'var(--student-info)',    bg: 'var(--student-info-bg)',    border: 'var(--student-info)' },
        ].map((s, i) => (
          <div key={s.label} className="border rounded-2xl p-4 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 70}ms`, backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-xs font-medium" style={{ color: 'var(--student-text-secondary)' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert, i) => {
          const cfg = typeConfig[cert.type as keyof typeof typeConfig] || typeConfig.participation;
          return (
            <div key={cert.id}
              onClick={() => setSelected(cert)}
              className="cursor-pointer group animate-fade-in-up card-hover"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
                <div className="h-24 flex items-center justify-center relative overflow-hidden" style={{ background: cert.badgeColor }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <span className="text-5xl animate-float">{cert.icon}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--student-text-primary)' }}>{cert.title}</h3>
                    <Badge className="flex-shrink-0 text-[10px] py-0" style={{ backgroundColor: cfg.bg, color: cfg.color, border: 'none' }}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--student-text-secondary)' }}>{cert.description}</p>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--student-text-disabled)' }}>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cert.issuedOn}</span>
                    {cert.grade && <span className="font-bold" style={{ color: 'var(--student-success)' }}>Grade: {cert.grade}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-lg" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
              <Award className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />Certificate
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <DialogBody className="p-0">
              <div className="mx-6 my-5 border-4 border-double rounded-2xl overflow-hidden" style={{ borderColor: 'var(--student-warning)' }}>
                <div className="px-6 py-6 text-white text-center" style={{ background: selected.badgeColor }}>
                  <span className="text-6xl block mb-2 animate-float">{selected.icon}</span>
                  <p className="text-xs uppercase tracking-widest opacity-80">Certificate of</p>
                  <h2 className="text-xl font-black mt-1">{typeConfig[selected.type as keyof typeof typeConfig]?.label}</h2>
                </div>
                <div className="px-6 py-6 text-center" style={{ backgroundColor: 'var(--student-bg-page)' }}>
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--student-text-disabled)' }}>This is to certify that</p>
                  <p className="text-2xl font-black mt-2 mb-1" style={{ color: 'var(--student-text-primary)' }}>Aarav Sharma</p>
                  <p className="text-xs" style={{ color: 'var(--student-text-disabled)' }}>Roll No: 001 · IOT-2026 · Evening Section</p>
                  <div className="my-4 border-t border-dashed" style={{ borderColor: 'var(--student-border)' }} />
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--student-text-primary)' }}>{selected.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--student-text-secondary)' }}>{selected.description}</p>
                  {selected.grade && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border" style={{ backgroundColor: 'var(--student-success-bg)', color: 'var(--student-success)', borderColor: 'var(--student-success)' }}>
                      <Star className="h-3.5 w-3.5" />Grade: {selected.grade}
                    </div>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-4 text-xs" style={{ color: 'var(--student-text-disabled)' }}>
                    <div className="text-center">
                      <div className="h-8 border-b border-dashed mb-1" style={{ borderColor: 'var(--student-border)' }} />
                      <p>Date: {selected.issuedOn}</p>
                    </div>
                    <div className="text-center">
                      <div className="h-8 border-b border-dashed mb-1" style={{ borderColor: 'var(--student-border)' }} />
                      <p className="flex items-center justify-center gap-1"><Building2 className="h-3 w-3" />{selected.issuedBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)} style={{ borderColor: 'var(--student-border)', color: 'var(--student-text-primary)' }}>Close</Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2" style={{ backgroundColor: 'var(--student-primary)', color: '#fff' }}>
              <Printer className="h-4 w-4" />Print Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
