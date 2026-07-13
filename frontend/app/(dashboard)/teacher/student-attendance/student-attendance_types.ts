export interface AttendanceFilter {
  session: string;
  cls: string;
  section: string;
  month: string;
  year: string;
}

export interface StudentMatrix {
  name: string;
  attendance: boolean[];
}
