# Frontend Debugging Reference

## Table of Contents
- [Auth Folder](#auth-folder-structure)
- [Dashboard Folder](#dashboard-folder)
- [Components Folder](#components-folder)
- [Lib Folder](#lib-folder)
- [App Shell](#app-shell)

## Auth Folder Structure
### Login Page
- **File:** [frontend/app/(auth)/login/page.tsx](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx)
- **Description:** Multi-role authentication page allowing staff (teacher, admin, superadmin) and student logins
- **Key Features:**
  - Tab-based interface for staff vs student login
  - Role selection dropdown for staff members
  - Password visibility toggle
  - Institution details saving for school admins
  - Superadmin access restriction
  - Loading states and error handling
- **Common Issues:**
  - Token expiration handling
  - Institution data not saving properly
  - Role-based routing after login
- **API Endpoints Used:** `/api/v1/auth/login`, `/api/v1/admin/my-institution`
- **Related Files:** [frontend/lib/AuthContext.tsx](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/lib/AuthContext.tsx)
- **Last Updated:** 2026-07-14

#### Login Page - Specific Blocks:
- **Theme Colors Definition:** [frontend/app/(auth)/login/page.tsx#L5-L12](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L5-L12)
  - **Purpose:** Defines color scheme for the login page UI
  - **Changes needed for:** Updating theme colors, branding modifications
  - **Common Issues:** Color inconsistency across themes

- **State Variables Declaration:** [frontend/app/(auth)/login/page.tsx#L14-L21](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L14-L21)
  - **Purpose:** Manages form state (tab, role, email, password, showPass, error, loading)
  - **Changes needed for:** Adding new form fields, modifying state types
  - **Common Issues:** State not updating properly, incorrect initial values

- **Login Handler Function:** [frontend/app/(auth)/login/page.tsx#L24-L60](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L24-L60)
  - **Purpose:** Core authentication logic with API call to backend, handles institution data saving and role restrictions
  - **Changes needed for:** Modifying authentication flow, adding new validation, changing API endpoints
  - **Common Issues:** Failed login attempts, token handling, institution data not persisting

- **Main Container JSX:** [frontend/app/(auth)/login/page.tsx#L62-L80](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L62-L80)
  - **Purpose:** Sets up the main page container with branding and tab interface
  - **Changes needed for:** Updating branding, modifying layout structure
  - **Common Issues:** Layout shifting, branding not displaying correctly

- **Tab Switching Logic:** [frontend/app/(auth)/login/page.tsx#L107-L111](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L107-L111) and [frontend/app/(auth)/login/page.tsx#L112-L116](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L112-L116)
  - **Purpose:** Allows switching between staff and student login tabs
  - **Changes needed for:** Adding new login types, modifying tab behavior
  - **Common Issues:** Tab switching not working, state not resetting on switch

- **Staff Login Form JSX:** [frontend/app/(auth)/login/page.tsx#L81-L135](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L81-L135)
  - **Purpose:** Renders the staff login form with role selection, email, and password fields
  - **Changes needed for:** Adding new form fields, modifying layout, updating validation messages
  - **Common Issues:** Layout problems, conditional rendering bugs, validation display issues

- **Student Login Form JSX:** [frontend/app/(auth)/login/page.tsx#L136-L183](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/login/page.tsx#L136-L183)
  - **Purpose:** Renders the student login form with simplified fields
  - **Changes needed for:** Modifying student login fields, changing UI layout
  - **Common Issues:** Student login not working, inconsistent form behavior

### Pending Page
- **File:** [frontend/app/(auth)/pending/page.tsx](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/pending/page.tsx)
- **Description:** Registration pending approval page showing status to users
- **Key Features:**
  - Visual status indicators for registration workflow
  - Contact information for support
  - Link back to login page
- **Common Issues:**
  - Status indicator not updating
  - Contact information not displaying correctly
- **Related Files:** None
- **Last Updated:** 2026-07-14

#### Pending Page - Specific Blocks:
- **Status Steps Component:** [frontend/app/(auth)/pending/page.tsx#L21-L36](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/pending/page.tsx#L21-L36)
  - **Purpose:** Displays the registration workflow status steps
  - **Changes needed for:** Adding new status steps, modifying step descriptions
  - **Common Issues:** Status indicators not updating, styling inconsistencies

- **Contact Information Section:** [frontend/app/(auth)/pending/page.tsx#L38-L42](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/pending/page.tsx#L38-L42)
  - **Purpose:** Shows contact information for support
  - **Changes needed for:** Updating contact details, adding new communication channels
  - **Common Issues:** Contact info not displaying, formatting issues

### Register Page
- **File:** [frontend/app/(auth)/register/page.tsx](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx)
- **Description:** Multi-step registration form for students
- **Key Features:**
  - Two-step form (personal info + academic/security)
  - Form validation at each step
  - Password confirmation
  - Blood group and class selection
  - Institution slug requirement
- **Common Issues:**
  - Step validation not working properly
  - Password mismatch validation
  - Form submission failing
  - Institution slug validation
- **API Endpoints Used:** `/api/v1/auth/register`
- **Related Files:** [frontend/lib/AuthContext.tsx](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/lib/AuthContext.tsx)
- **Last Updated:** 2026-07-14

#### Register Page - Specific Blocks:
- **Form State Initialization:** [frontend/app/(auth)/register/page.tsx#L8-L17](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L8-L17)
  - **Purpose:** Initializes the form state with all required fields
  - **Changes needed for:** Adding new form fields, modifying initial values
  - **Common Issues:** Missing fields, incorrect initial values

- **Step 1 Validation Function:** [frontend/app/(auth)/register/page.tsx#L19-L31](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L19-L31)
  - **Purpose:** Validates personal information on step 1
  - **Changes needed for:** Adding new validation rules, modifying validation messages
  - **Common Issues:** Validation not catching errors, incorrect validation rules

- **Step 2 Validation Function:** [frontend/app/(auth)/register/page.tsx#L33-L43](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L33-L43)
  - **Purpose:** Validates academic and security information on step 2
  - **Changes needed for:** Adding new validation rules, modifying validation messages
  - **Common Issues:** Password mismatch not detected, missing required fields

- **Form Submission Handler:** [frontend/app/(auth)/register/page.tsx#L45-L61](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L45-L61)
  - **Purpose:** Handles form submission and API call to register user
  - **Changes needed for:** Modifying API endpoint, adding new data to send
  - **Common Issues:** Submission failing, API errors not handled properly

- **Custom Field Component:** [frontend/app/(auth)/register/page.tsx#L63-L72](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L63-L72)
  - **Purpose:** Reusable form field component with icon and validation display
  - **Changes needed for:** Adding new field types, modifying styling
  - **Common Issues:** Errors not displaying, icons not showing

- **Step 1 Form Fields:** [frontend/app/(auth)/register/page.tsx#L100-L126](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L100-L126)
  - **Purpose:** Renders personal information fields (name, email, phone, etc.)
  - **Changes needed for:** Adding new personal fields, modifying validations
  - **Common Issues:** Fields not updating state, validation not working

- **Step 2 Form Fields:** [frontend/app/(auth)/register/page.tsx#L127-L170](file:///home/pawan/Desktop/Buildroonix_ERP_Clean/frontend/app/(auth)/register/page.tsx#L127-L170)
  - **Purpose:** Renders academic and security fields (institution, parents, passwords, etc.)
  - **Changes needed for:** Adding new academic fields, modifying security requirements
  - **Common Issues:** Password confirmation not working, institution slug validation

### Auth Debugging Workflow
- **Goal:** Turn auth bugs into repeatable, traceable debugging steps.
- **When to use:** login failure, bad redirect, token error, or registration failure.

#### Step 1: Reproduce the issue
- Open `http://localhost:3000`
- Perform the failing flow:
  - login as staff or student
  - register a new user
  - use the pending approval page
- Capture the exact symptom:
  - visible error text
  - blank screen
  - redirect loop
  - failed network request

#### Step 2: Inspect the frontend
- Open browser DevTools
- Network tab:
  - filter `/api/v1/auth/*`
  - verify request payload and response status
- Console tab:
  - look for JS runtime errors or warnings
  - confirm `AuthContext`/state errors if present

#### Step 3: Check the auth files
- `frontend/app/(auth)/login/page.tsx`
  - login handler, role selection, state updates
  - API call structure and response handling
- `frontend/app/(auth)/register/page.tsx`
  - step validation logic and payload mapping
  - form submit handler
- `frontend/lib/AuthContext.tsx`
  - token storage/retrieval
  - redirect after login
  - auth state persistence

#### Step 4: Common fixes
- ensure backend is running at `http://localhost:5000`
- confirm `FRONTEND_URL` and CORS in backend `.env`
- verify frontend requests hit the correct auth endpoint
- update request field names if backend schema changed
- for token errors, validate JWT secret and storage flow

#### Example 1: Login returns `401 Invalid credentials`
- Symptom: login form shows an error even with correct credentials.
- Reproduce:
  1. Submit login form.
  2. Inspect `/api/v1/auth/login` request in Network.
  3. Confirm body contains `email`, `password`, and `role`.
- Likely cause:
  - wrong request field names
  - backend validation mismatch
  - incorrect token storage in `AuthContext`
- Fix:
  1. Compare login payload to backend auth route.
  2. Update `login/page.tsx` request body。
  3. Confirm token is stored and redirect occurs.
- Verify:
  - network response is `200`
  - token saved
  - user lands on dashboard

#### Example 2: Registration fails with validation error
- Symptom: `/api/v1/auth/register` returns `422` or request error.
- Reproduce:
  1. Submit the registration form.
  2. Inspect response body in Network.
- Likely cause:
  - missing required fields
  - invalid email/password mismatch
- Fix:
  1. Check validation in `register/page.tsx`.
  2. Confirm API payload includes all required fields.
  3. Improve error display so users see the reason.
- Verify:
  - response status `200` or `201`
  - registration flow advances

## Dashboard Folder

## Components Folder

## Lib Folder

## App Shell