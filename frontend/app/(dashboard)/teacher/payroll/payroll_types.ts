export interface PayrollRecord {
  id: string;
  month: string;
  year: number;
  basicSalary: number;
  netSalary: number;
  status: string;
  paidOn?: string;
  staffName?: string;
  role?: string;
  paymentMethod?: string;
}
