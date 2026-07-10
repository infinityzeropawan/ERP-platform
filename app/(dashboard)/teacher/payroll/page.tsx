'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { IndianRupee, TrendingUp, FileText, Eye } from 'lucide-react';

const statusConfig = {
  paid: { variant: 'success' as const, label: 'Paid' },
  pending: { variant: 'warning' as const, label: 'Pending' },
  processing: { variant: 'info' as const, label: 'Processing' },
};

export default function PayrollPage() {
  const { token } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [slipRecord, setSlipRecord] = useState<any | null>(null);

  const fetchPayroll = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/teacher/payroll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPayrollRecords(data);
    } catch (err) {
      console.error('Error fetching teacher payrolls:', err);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [token]);

  const latestPaid = payrollRecords.filter(r => r.status === 'paid')[0];
  const totalEarned = payrollRecords.filter(r => r.status === 'paid').reduce((a, r) => a + r.netSalary, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-teal-600" />My Payroll</h1>
        <p className="text-gray-500 text-sm mt-0.5">Salary slips and payroll history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white border-0">
          <CardContent className="p-5">
            <p className="text-teal-100 text-xs font-medium uppercase tracking-wide">Last Paid Salary</p>
            <p className="text-3xl font-bold mt-1">₹{(latestPaid?.netSalary || 0).toLocaleString('en-IN')}</p>
            <p className="text-teal-200 text-xs mt-1">{latestPaid?.month} {latestPaid?.year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Earned (2026)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalEarned.toLocaleString('en-IN')}</p>
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />All payments received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Basic Salary</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{(latestPaid?.basicSalary || 45000).toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1">Per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-teal-600" />Salary History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Month', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Slip'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payrollRecords.map(r => {
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{r.month} {r.year}</p>
                        {r.paidOn && <p className="text-xs text-gray-400">Paid: {r.paidOn}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">₹{r.basicSalary.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">+₹0</td>
                      <td className="px-4 py-3 text-red-500 font-medium">-₹0</td>
                      <td className="px-4 py-3 font-bold text-teal-700">₹{r.netSalary.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[r.status as keyof typeof statusConfig]?.variant || 'warning'}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => setSlipRecord(r)} className="flex items-center gap-1 text-xs">
                          <Eye className="h-3 w-3" />View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {payrollRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">No payroll history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Salary Slip Dialog */}
      <Dialog open={!!slipRecord} onOpenChange={() => setSlipRecord(null)}>
        <DialogContent className="w-full max-w-lg">
          <div className="p-4 space-y-4">
            <div className="text-center border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900">Buildroonix International School</h2>
              <p className="text-xs text-gray-500">SALARY SLIP FOR THE MONTH OF {slipRecord?.month?.toUpperCase()} {slipRecord?.year}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-600">
              <div>
                <p>Employee Name: <span className="text-gray-900">{slipRecord?.staffName}</span></p>
                <p>Designation: <span className="text-gray-900">{slipRecord?.role}</span></p>
              </div>
              <div className="text-right">
                <p>Payment Date: <span className="text-gray-900">{slipRecord?.paidOn || 'Pending'}</span></p>
                <p>Payment Method: <span className="text-gray-900">{slipRecord?.paymentMethod || 'N/A'}</span></p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-2 bg-gray-50 border-b font-bold px-3 py-2 text-gray-700">
                <p>Description</p>
                <p className="text-right">Amount (INR)</p>
              </div>
              <div className="px-3 py-2 space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <p>Basic Salary</p>
                  <p className="font-semibold text-gray-900">₹{slipRecord?.basicSalary?.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between text-green-600">
                  <p>Allowances</p>
                  <p className="font-semibold">+₹0</p>
                </div>
                <div className="flex justify-between text-red-500">
                  <p>Deductions (TDS/PF)</p>
                  <p className="font-semibold">-₹0</p>
                </div>
              </div>
              <div className="grid grid-cols-2 bg-teal-50 border-t font-bold px-3 py-2 text-teal-800">
                <p>Net Salary Payout</p>
                <p className="text-right">₹{slipRecord?.netSalary?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSlipRecord(null)}>Close</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
