'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModules } from '@/lib/ModuleContext';
import { AlertTriangle, MapPin, ScanFace, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type AttendanceLog = {
  id: string;
  user: { name: string; role: string; email: string };
  date: string;
  status: string;
  confidenceScore: number;
  latitude: number | null;
  longitude: number | null;
  verified: boolean;
};

export default function AdminFaceAttendanceLogs() {
  const { hasModule } = useModules();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasModule('mod_face_attendance')) return;
    
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/face/logs?date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch face logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [dateStr, hasModule]);

  if (!hasModule('mod_face_attendance')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Premium Feature</h2>
        <p className="text-gray-500 mt-2">Face Recognition Attendance is not enabled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ScanFace className="h-6 w-6 text-purple-600" /> Face Attendance Logs
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">View daily AI attendance and geofence verification results.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Records for {format(new Date(dateStr), 'PPP')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading records...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              No attendance records found for this date.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>AI Match Confidence</TableHead>
                  <TableHead>Location Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{log.user.name}</div>
                      <div className="text-xs text-gray-500">{log.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {log.user.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 font-mono text-sm">
                      {format(new Date(log.date), 'hh:mm a')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${log.confidenceScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`} 
                            style={{ width: \`\${Math.min(100, log.confidenceScore)}%\` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{log.confidenceScore.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.verified ? (
                        <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-md w-fit border border-green-200 text-xs font-medium">
                          <CheckCircle className="h-3.5 w-3.5" /> Inside Geofence
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded-md w-fit border border-red-200 text-xs font-medium">
                          <XCircle className="h-3.5 w-3.5" /> Outside/Unknown
                        </span>
                      )}
                      {log.latitude && log.longitude && (
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
