/**
 * Centralized URL configuration for the Auth module.
 * No hardcoded URLs should exist inside the components.
 */

export const AUTH_URLS = {
  // Frontend Page Routes
  LOGIN: '/login',
  REGISTER: '/register',
  PENDING: '/pending',
  
  // Backend API Endpoints
  API_LOGIN: '/api/v1/auth/login',
  API_REGISTER: '/api/v1/auth/register',
  API_MY_INSTITUTION: '/api/v1/admin/my-institution'
} as const;
