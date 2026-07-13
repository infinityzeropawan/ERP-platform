/**
 * Centralized constants for the Auth Module to avoid hardcoded strings and lists in UI.
 */

export const STAFF_ROLES = [
  { value: 'teacher', label: 'Teacher / Instructor' },
  { value: 'school_admin', label: 'Institution Admin' },
  { value: 'superadmin', label: 'Super Administrator' },
] as const;

export const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
] as const;

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
] as const;

export const CLASSES = [
  { value: 'Class-X', label: 'Class-X' },
  { value: 'Class-XI', label: 'Class-XI' },
] as const;
