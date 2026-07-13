# Auth Module Features

## Overview
This module handles all authentication-related features, including Staff and Student login, new student registration, and pending approval views. The architecture has been deeply refactored to adhere to enterprise-grade isolation rules.

## Directory Structure
- **`auth_components/`**: Contains purely presentational, micro-modularized React components. Includes `AuthLoginForm.tsx`, `AuthRegisterForm.tsx`, `AuthStaffLogin.tsx`, `AuthStudentLogin.tsx`, and `AuthPendingView.tsx`.
- **`auth_hooks/`**: Contains the logic and state management for components. `useAuthLogin.ts` manages login API integration and `useAuthRegister.ts` manages registration form state and submission.
- **`auth_utils/`**: Contains `auth_constants.ts` with centralized static lists like roles, genders, and blood groups to avoid UI hardcoding.
- **`auth_types.ts`**: Central source of truth for TypeScript interfaces (e.g., `RegisterFormDetails`) used across the module.
- **`auth_url_config.ts`**: Contains centralized frontend routes and API endpoints. No hardcoded URLs exist inside the UI components or hooks.
- **`auth.css`**: Centralized CSS variable definitions (e.g., `--auth-primary`, `--auth-bg-start`) to ensure the module is fully theme-independent and easily portable.

## Server & Client Component Boundary
All Next.js App Router endpoints (`login/page.tsx`, `register/page.tsx`, `pending/page.tsx`) act as clean Server Component wrappers that import and render the `"use client"` micro-components from the `auth_components` folder.

## AI-Friendly Isolation
- When fixing logic bugs, the AI only needs the `auth_hooks/` file.
- When fixing a UI bug, the AI only needs the specific `auth_components/` file.
- When adding a new field, the AI updates `auth_types.ts` and `auth_utils/` without rewriting complex logic.
