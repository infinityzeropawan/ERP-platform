'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { IndianRupee, TrendingUp, AlertCircle, Clock, Search, Download } from 'lucide-react';

const plans = [
  { name: 'Basic', price: 1999, features: ['Up to 100 students', '5 teachers', 'Core modules', 'Email support'] },
  { name: 'Pro', price: 4999, features: ['Up to 500 students', '30 teachers', 'All academic modules', 'Priority support', 'AI Notes'] },
  { name: 'Enterprise', price: 9999, features: ['Unlimited students', 'Unlimited teachers', 'All modules', '24/7 support', 'Custom branding', 'API access'] },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(i =>
    (filter === 'all' || i.status === filter) &&
    i.institutionName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((a, i) => a + i.amount, 0);
  const overdueRevenue = invoices.filter(i => i.status === 'overdue').reduce((a, i) => a + i.amount, 0);

  const markPaid = (id: string) => setInvoices(p => p.map(i => i.id === id ? { ...i, status: 'paid' as const } : i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-teal-600" />Billing & Subscriptions</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage institution subscriptions and invoices</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0">
          <CardContent className="p-5">
            <p className="text-green-100 text-xs font-medium uppercase">Total Collected</p>
            <p className="text-3xl font-bold mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-green-200 text-xs mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{invoices.filter(i => i.status === 'paid').length} invoices paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">₹{pendingRevenue.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{invoices.filter(i => i.status === 'pending').length} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₹{overdueRevenue.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{invoices.filter(i => i.status === 'overdue').length} invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Subscription Plans</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <div key={plan.name} className={`rounded-2xl border-2 p-5 ${i === 1 ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                {i === 1 && <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-medium mb-2 inline-block">Most Popular</span>}
                <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
                <p className="text-2xl font-bold text-teal-700 mt-1">₹{plan.price.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span className="text-teal-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Invoices</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input placeholder="Search institution..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 w-48 text-xs" />
              </div>
              <div className="flex gap-1">
                {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Invoice', 'Institution', 'Plan', 'Amount', 'Date', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-xs">
                    No billing history or invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{inv.id.toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{inv.institutionName}</td>
                    <td className="px-4 py-3 text-gray-600">{inv.plan}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.date}</td>
                    <td className="px-4 py-3 text-gray-500">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>{inv.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {inv.status !== 'paid' && (
                          <Button size="sm" variant="success" onClick={() => markPaid(inv.id)} className="text-xs h-7">Mark Paid</Button>
                        )}
                        <Button size="sm" variant="outline" className="text-xs h-7 flex items-center gap-1"><Download className="h-3 w-3" />PDF</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
