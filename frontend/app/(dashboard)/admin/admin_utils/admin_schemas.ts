import { z } from 'zod';

export const userBaseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().optional(),
});

export const studentSchema = userBaseSchema.extend({
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  rollNo: z.string().optional(),
});

export const teacherSchema = userBaseSchema.extend({
  subject: z.string().min(1, "Subject is required"),
});

export const supportStaffSchema = userBaseSchema.extend({
  role: z.enum(['guard', 'driver', 'receptionist', 'cleaner', 'accountant', 'helper']),
  shift: z.enum(['morning', 'evening', 'night']),
  salary: z.coerce.number().min(0),
  busNumber: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type SupportStaffFormData = z.infer<typeof supportStaffSchema>;
