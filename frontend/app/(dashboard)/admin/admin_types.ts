export interface AdminInstitutionStats {
  students: number;
  teachers: number;
  name?: string;
}

export interface AdminStatCard {
  label: string;
  value: string | number;
  icon: any; // Lucide icon
  color: string;
  bg: string;
  sub: string;
}
