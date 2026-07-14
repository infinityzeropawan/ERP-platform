'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResource, ResourceState } from '@/lib/useResource';
import { Settings, Save, Shield, Bell, Database, Globe, MapPin } from 'lucide-react';
import { useModules } from '@/lib/ModuleContext';

export default function AdminSettingsPage() {
  const { hasModule } = useModules();
  const { data: dbSettings, loading, error, create, update } = useResource<{ id: string; key: string; value: string }>('settings');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  
  const [instLat, setInstLat] = useState('');
  const [instLng, setInstLng] = useState('');
  const [instRadius, setInstRadius] = useState('');
  const [savingInst, setSavingInst] = useState(false);
  
  useEffect(() => {
    if (dbSettings && dbSettings.length > 0) {
      const initial: Record<string, string> = {};
      dbSettings.forEach(s => {
        initial[s.key] = s.value;
      });
      setFormValues(initial);
    }
  }, [dbSettings]);

  useEffect(() => {
    fetch('/api/v1/admin/my-institution')
      .then(r => r.json())
      .then(data => {
        if (data.latitude) setInstLat(String(data.latitude));
        if (data.longitude) setInstLng(String(data.longitude));
        if (data.geofenceRadius) setInstRadius(String(data.geofenceRadius));
      })
      .catch(e => console.error('Failed to load institution', e));
  }, []);

  const handleSave = async (keys: string[]) => {
    try {
      for (const key of keys) {
        const val = formValues[key] !== undefined ? formValues[key] : '';
        const existing = dbSettings.find(s => s.key === key);
        if (existing) {
          if (existing.value !== val) {
            await update(existing.id, { value: val });
          }
        } else {
          await create({ key, value: val });
        }
      }
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    }
  };

  const handleSaveInstitution = async () => {
    setSavingInst(true);
    try {
      const res = await fetch('/api/v1/admin/my-institution', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: instLat ? parseFloat(instLat) : null,
          longitude: instLng ? parseFloat(instLng) : null,
          geofenceRadius: instRadius ? parseFloat(instRadius) : 500
        })
      });
      if (!res.ok) throw new Error('Failed to save institution location');
      alert('Geofence settings saved successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingInst(false);
    }
  };

  const sections = [
    {
      title: 'General Settings',
      icon: Globe,
      fields: [
        { label: 'Platform Name', key: 'general_platform_name', default: 'Buildroonix' },
        { label: 'Academic Year', key: 'general_academic_year', default: '2026-2027' },
        { label: 'Institution Name', key: 'general_institution_name', default: 'Buildroonix Institute' }
      ]
    },
    {
      title: 'Security Settings',
      icon: Shield,
      fields: [
        { label: 'Session Timeout (mins)', key: 'security_session_timeout', default: '30' },
        { label: 'Max Login Attempts', key: 'security_max_login_attempts', default: '5' },
        { label: 'Password Min Length', key: 'security_min_password_length', default: '8' }
      ]
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      fields: [
        { label: 'Admin Email', key: 'notification_admin_email', default: 'admin@buildroonix.com' },
        { label: 'SMS Gateway', key: 'notification_sms_gateway', default: 'Twilio' },
        { label: 'Notification Frequency', key: 'notification_frequency', default: 'Daily' }
      ]
    },
    {
      title: 'Database Settings',
      icon: Database,
      fields: [
        { label: 'Backup Frequency', key: 'database_backup_frequency', default: 'Daily' },
        { label: 'Retention Period (days)', key: 'database_retention_period', default: '90' },
        { label: 'Storage Limit (GB)', key: 'database_storage_limit', default: '50' }
      ]
    }
  ];

  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Settings className="h-6 w-6 text-teal-600" />System Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure platform-wide settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map(section => {
          const sectionKeys = section.fields.map(f => f.key);
          return (
            <Card key={section.title}>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><section.icon className="h-4 w-4 text-teal-600" />{section.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {section.fields.map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                    <Input
                      value={formValues[f.key] !== undefined ? formValues[f.key] : f.default}
                      onChange={e => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <Button size="sm" onClick={() => handleSave(sectionKeys)} className="flex items-center gap-2 mt-2"><Save className="h-3.5 w-3.5" />Save Changes</Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Premium Geofencing Settings */}
        {hasModule('mod_face_attendance') && (
          <Card className="border-purple-200 shadow-sm bg-purple-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-purple-800">
                <MapPin className="h-4 w-4 text-purple-600" />
                Attendance Geofencing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">Set coordinates to restrict Face Attendance within a specific radius.</p>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Latitude</label>
                <Input value={instLat} onChange={e => setInstLat(e.target.value)} placeholder="e.g. 28.6139" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Longitude</label>
                <Input value={instLng} onChange={e => setInstLng(e.target.value)} placeholder="e.g. 77.2090" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Geofence Radius (meters)</label>
                <Input value={instRadius} onChange={e => setInstRadius(e.target.value)} placeholder="e.g. 500" />
              </div>
              <Button size="sm" onClick={handleSaveInstitution} disabled={savingInst} className="flex items-center gap-2 mt-2 bg-purple-600 hover:bg-purple-700">
                <Save className="h-3.5 w-3.5" /> {savingInst ? 'Saving...' : 'Save Geofence'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
