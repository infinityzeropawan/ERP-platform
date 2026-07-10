'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save, Globe, Shield, Bell, Database, CreditCard } from 'lucide-react';

export default function SuperadminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Settings className="h-6 w-6 text-teal-600" />Platform Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure Buildroonix platform-wide settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'Platform Info', icon: Globe, fields: [{ label: 'Platform Name', value: 'Buildroonix' }, { label: 'Domain', value: 'buildroonix.com' }, { label: 'Support Email', value: 'support@buildroonix.com' }] },
          { title: 'Security', icon: Shield, fields: [{ label: 'Session Timeout (mins)', value: '60' }, { label: 'Max Login Attempts', value: '5' }, { label: 'JWT Expiry (hours)', value: '24' }] },
          { title: 'Notifications', icon: Bell, fields: [{ label: 'SMTP Host', value: 'smtp.sendgrid.net' }, { label: 'SMS Gateway', value: 'Twilio' }, { label: 'Alert Email', value: 'alerts@buildroonix.com' }] },
          { title: 'Billing', icon: CreditCard, fields: [{ label: 'Payment Gateway', value: 'Razorpay' }, { label: 'Currency', value: 'INR' }, { label: 'Invoice Prefix', value: 'BRX-INV' }] },
          { title: 'Database', icon: Database, fields: [{ label: 'Backup Frequency', value: 'Daily' }, { label: 'Retention (days)', value: '90' }, { label: 'Max Tenant DBs', value: '500' }] },
        ].map(section => (
          <Card key={section.title}>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><section.icon className="h-4 w-4 text-teal-600" />{section.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {section.fields.map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                  <Input defaultValue={f.value} />
                </div>
              ))}
              <Button size="sm" className="flex items-center gap-2 mt-2"><Save className="h-3.5 w-3.5" />Save</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
