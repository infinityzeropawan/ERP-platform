/**
 * Types and Interfaces for the Auth Module
 */

export interface AuthUser {
  role: string;
  institutionId?: string;
  [key: string]: any;
}

export interface RegisterFormDetails {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  fatherName: string;
  motherName: string;
  address: string;
  bloodGroup: string;
  class: string;
  password?: string;
  confirmPassword?: string;
  institutionSlug: string;
}

export type LoginTabType = 'staff' | 'student';
