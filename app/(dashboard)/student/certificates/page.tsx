'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Printer, Star, Calendar, Building2 } from 'lucide-react';

type Certificate = { id: string; title: string; description: string; type: string; issuedOn: string; issuedBy: string; grade?: string; badgeColor: string; icon: string; };
const typeConfig = {
  academic:      { label: 'Academic',      variant: 'success' as const },
  attendance:    { label: 'Attendance',    variant: 'info'    as const },
  participation: { label: 'Participation', variant: 'default' as const },
  achievement:   { label: 'Achievement',   variant: 'warning' as const },
  completion:    { label: 'Completion',    variant: 'success' as const },
};
const certificates: Certificate[] = [];

export default function StudentCertificatesPage() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-6 w-6 text-teal-600" />My Certificates
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Your achievements, awards and completion certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',       value: certificates.length,                                          color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
          { label: 'Academic',    value: certificates.filter(c => c.type === 'academic').length,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
          { label: 'Achievement', value: certificates.filter(c => c.type === 'achievement').length,    color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
          { label: 'Completion',  value: certificates.filter(c => c.type === 'completion').length,     color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Certificates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert, i) => (
          <div key={cert.id}
            onClick={() => setSelected(cert)}
            className="cursor-pointer group animate-fade-in-up card-hover"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Badge gradient top */}
              <div className={`h-24 bg-gradient-to-br ${cert.badgeColor} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <span className="text-5xl animate-float">{cert.icon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{cert.title}</h3>
                  <Badge variant={typeConfig[cert.type as keyof typeof typeConfig].variant} className="flex-shrink-0 text-[10px] py-0">
                    {typeConfig[cert.type as keyof typeof typeConfig].label}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{cert.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cert.issuedOn}</span>
                  {cert.grade && <span className="font-bold text-green-600">Grade: {cert.grade}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate View Dialog */}
      <Dialog open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-teal-600" />Certificate
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <DialogBody className="p-0">
              {/* Certificate design */}
              <div className="mx-6 my-5 border-4 border-double border-amber-300 rounded-2xl overflow-hidden">
                <div className={`bg-gradient-to-br ${selected.badgeColor} px-6 py-6 text-white text-center`}>
                  <span className="text-6xl block mb-2 animate-float">{selected.icon}</span>
                  <p className="text-xs uppercase tracking-widest opacity-80">Certificate of</p>
                  <h2 className="text-xl font-black mt-1">{typeConfig[selected.type as keyof typeof typeConfig].label}</h2>
                </div>
                <div className="bg-gradient-to-b from-amber-50 to-white px-6 py-6 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-widest">This is to certify that</p>
                  <p className="text-2xl font-black text-gray-900 mt-2 mb-1">Aarav Sharma</p>
                  <p className="text-xs text-gray-500">Roll No: 001 · IOT-2026 · Evening Section</p>
                  <div className="my-4 border-t border-dashed border-amber-200" />
                  <p className="text-sm font-semibold text-gray-800 mb-2">{selected.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{selected.description}</p>
                  {selected.grade && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                      <Star className="h-3.5 w-3.5" />Grade: {selected.grade}
                    </div>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="text-center">
                      <div className="h-8 border-b border-dashed border-gray-300 mb-1" />
                      <p>Date: {selected.issuedOn}</p>
                    </div>
                    <div className="text-center">
                      <div className="h-8 border-b border-dashed border-gray-300 mb-1" />
                      <p className="flex items-center justify-center gap-1"><Building2 className="h-3 w-3" />{selected.issuedBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />Print Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
