export interface GradebookEntry {
  id: string;
  studentName: string;
  rollNo: string;
  unitTest1?: number;
  unitTest2?: number;
  midTerm?: number;
  assignment?: number;
  practical?: number;
  totalScore?: number;
  percentage?: number;
  grade?: string;
  remarks?: string;
}

export interface GradebookStats {
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
}
