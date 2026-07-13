Hey, I want you to deeply analyze the @[app/(app)/[MODULE_NAME]] folder and refactor it into an Enterprise-Grade, Highly Scalable, and strictly "AI-Friendly" architecture. 

Currently, no one writes code manually; AI writes it. Because of this, my primary goal is extreme isolation. Tomorrow, if I ask an AI to fix a specific bug, I should only need to provide ONE exact file to the AI, completely eliminating the risk of the AI hallucinating and breaking other working functionalities. However, the folder architecture must remain highly organized and visually logical so that human developers can easily navigate it without getting lost in a flat directory of 50+ files.

Please follow these strict architectural rules:

1. **Micro-Modularization & Feature-Based Sub-folders (Crucial)**: 
Break down all large or mixed files. Every file must contain only one React component and handle only one specific micro-functionality. **CRITICAL:** Do not dump all these micro-files into a single flat directory. Group them logically into cohesive sub-folders within the module. 
**IMPORTANT FOLDER NAMING:** Always prefix the main internal folders with the module name (e.g., use `[moduleName]_components/`, `[moduleName]_context/`, `[moduleName]_utils/` instead of generic names like `components/`). This ensures that when providing context to an AI (using `@`), the AI only loads the exact folder for this module, avoiding cross-module hallucinations. Inside these prefixed folders, group files logically (e.g., `[moduleName]_components/Header/`).
Next.js App Router uses Server Components by default, so you MUST explicitly include `"use client";` at the top of any file that uses hooks (`useState`, `useEffect`) or event listeners.

2. **Highly Descriptive, Self-Documenting Filenames**: 
Rename all components and files to be extremely descriptive based on exactly what they do (e.g., `[ModuleName]SearchFilter.tsx`, `[ModuleName]PaymentOptions.tsx`). Filename length doesn't matter; instant clarity for a new developer (or an AI context window) is the only priority.

3. **Backend-Ready Centralized Data (Single Source of Truth)**: 
Find all hardcoded UI data (dropdown options, filter lists, default preset arrays, payment modes, etc.) scattered across the UI components. Extract them into feature-specific constant files alongside their components (e.g., `HeaderConstants.ts` inside the `/Header` folder) or a module-level `[ModuleName]SharedConstants.ts` for data used across multiple sub-folders.
*Why?* Because tomorrow, this hardcoded data will be replaced by a Backend API call. By keeping it all in one file today, I will only have to change one file tomorrow to integrate the API, without touching the UI components. Derive your TypeScript types directly from these central arrays.

4. **Theme Independence (No Inline Colors)**: 
Remove all hardcoded Tailwind color utilities (like `text-primary`, `bg-card`) from the JSX. Replace them with custom CSS variables (e.g., `var(--[moduleName]-primary-bg)`) and define all these variables centrally in @[[MODULE_NAME].css]. This ensures that I can copy-paste this entire folder to another project and theme it entirely from one CSS file.

5. **Smart & Isolated State Management (Avoid Excessive Prop Drilling)**: 
Because the components will be heavily micro-modularized (Rule #1), avoid creating a massive web of prop drilling (passing data through 5 layers of components). If multiple micro-components need to share the same state, create a state store exclusively for this module (e.g., a local React Context `[ModuleName]Context.tsx` or a feature-sliced Zustand/Redux store placed strictly inside this module's folder). Do NOT bloat the global app state; keep the state architecture isolated to this feature. Since components are heavily micro-modularized, if you use React Context, you MUST implement proper memoization (`useMemo`, `useCallback`) to prevent massive re-render chains across the sub-folders.

6. **Separation of Logic and UI (Custom Hooks for Extreme Isolation)**: 
Do not mix complex React logic (`useEffect`, multi-step state calculations, data transformations) with JSX markup.
Extract all heavy logic into an adjacent custom hook file (e.g., `use[ComponentName].ts`). The actual `.tsx` file should act purely as a "View" layer that consumes the hook.
*Why?* If there is a bug in the calculation logic, you feed the AI only the `use...` file. It fixes the logic with zero risk of accidentally deleting a `<div>` or altering the UI structure.

7. **Interface & Type Isolation (The Prop Blueprint)**: 
Never define complex `Interfaces` or `Types` directly inside the component files. Extract all TypeScript definitions (Component Props, API Payloads, State Shapes) into a dedicated `[moduleName]_types.ts` file or folder.
*Why?* When an AI is generating a new micro-component, you only need to provide the `types` file. The AI instantly knows the exact data shape it is working with, drastically reducing hallucinations.

8. **Strict Server vs. Client Component Boundaries (Next.js Specific)**: 
Respect the Next.js App Router architecture. Keep top-level files like `page.tsx` or `layout.tsx` strictly as **Server Components** (no `"use client"`). Use these to fetch initial data securely. Pass this data downwards as props into your micro-modularized **Client Components**.
*Why?* It creates a clean separation of concerns. Data fetching issues are solved in the Server Component; interactivity issues are solved in the Client Component. You will never need to feed an AI both files at the same time.

9. **Leverage Next.js Native Features**: 
Ensure that the module properly utilizes Next.js native routing features for a great user experience. Extract loading states into `loading.tsx` and error boundaries into `error.tsx` wherever applicable in the module's directory.

10. **Absolute Imports Only (No Relative Paths)**: 
Never use relative imports (like `../../` or `./`) for importing components, contexts, utilities, or types. Always use absolute imports starting with `@/` (e.g., `@/app/(erp)/workout/workout_context/WorkoutContext`).
*Why?* This allows files to be moved around easily without breaking import paths and makes it much easier to copy-paste code snippets or have an AI generate standalone code without worrying about relative directory depth.

11. **Centralized URL Configuration (No Hardcoded URLs)**: 
Never hardcode URLs (e.g., `/api/auth/refresh`, `/login`, etc.) directly into API wrappers or React components. Each module must have exactly one centralized URL configuration file, named exactly `[moduleName]_url_config.ts` (e.g., `auth_url_config.ts`). This file must export all internal page routes and external API routes used by that module as named constants. Any file in the module or global utilities that needs to call an endpoint or navigate to a page must import the URL from this specific config file.
*Why?* If the backend controller path changes or the frontend route structure is updated, we only need to change the path in ONE file instead of hunting down string literals across multiple components and API clients.

12. **No Hardcoded HTTP Status Codes**: 
Never hardcode numeric HTTP status codes (e.g., `401`, `500`, `200`) in API routes, proxies, or fetch wrappers. Always use standard enums/constants from libraries like `http-status-codes` (e.g., `StatusCodes.UNAUTHORIZED`). This improves code readability and prevents silly typos in status codes.

13. **Update AI-Context Documentation**: 
Once the entire refactor is complete, update the project documentation in @[[MODULE_NAME]_features.md]. This document must serve as a map for future AI sessions. Clearly document the new "Feature-Based Sub-folder" directory structure, what each file precisely does, and where the centralized data/state is kept.

14. **Backend-Driven UI Messages (No Hardcoded Toasts/Alerts)**: 
Never hardcode success or error messages (e.g., "User created successfully" or "Invalid credentials") in the frontend components, hooks, or toast notifications. The frontend must strictly display the `message` string provided by the backend's standardized JSON response envelope.
*Why?* If the business requirement for a message changes, or if we need to implement localization/translations tomorrow, we only want to update the text in one place: the backend. The frontend should act purely as a dumb display layer for API messages.

15. **Performance & Optimization Architecture**:
- **Debounce API Calls**: Any search input or filter that triggers backend API calls MUST be debounced (e.g., using a custom `useDebounce` hook or a library like `lodash.debounce`) with at least a 300ms delay. Never fire an API request on every single keystroke.
- **Server-Side Pagination & Filtering**: Do not fetch thousands of records and paginate/filter them on the client. Always implement robust server-side pagination, sorting, and filtering. The frontend should only manage page numbers and search states, passing them as query parameters.
- **Lazy Loading & Suspense**: For heavy components that are not immediately visible on initial load (e.g., complex charts, heavy modals, or detailed tabs), use React's `lazy()` or Next.js `next/dynamic` to code-split them. Wrap them in `<Suspense>` with skeleton loaders. This dramatically reduces the initial JS bundle size.
- **Strict Memoization for Contexts**: If you are using React Context to avoid prop drilling, ensure that the Context Provider's value object is strictly memoized using `useMemo`, and all functions passed inside it are wrapped in `useCallback`. This prevents the entire module from re-rendering whenever a single context state updates.
- **Pessimistic UI Updates (Cache Mutation)**: After successfully mutating data on the backend (e.g., editing, deleting, or adding an entity), do NOT trigger a full page refresh or a redundant API `GET` request just to see the changes. Instead, await the successful response from the backend, and then manually mutate the centralized frontend state (Context, Redux, or SWR/React Query cache) using the updated data. This eliminates unnecessary network calls while ensuring the UI is strictly synchronized with the actual backend state (avoiding "fake" optimistic updates that apply before the backend confirms success).

16. **Robust Form Handling & Validation**:
For any forms with more than two inputs, strictly avoid using individual `useState` hooks for every field, as this triggers unnecessary re-renders on every keystroke. Use a robust form management library (like **React Hook Form**) paired with a schema validation library (like **Zod** ). Define the validation schema in your `_types` or `_utils` folder to enforce strict frontend validation before making API calls.

17. **Centralized API Error Interception**:
Never handle generic global errors (like `401 Unauthorized` token expiries or `500 Server Errors`) inside individual UI components. Implement a centralized API wrapper or interceptor (in your `api.ts` or fetch utilities) that catches these global status codes, triggers a global toast/redirect, and smoothly refreshes tokens without the UI components ever needing to know about it.

18. **Enterprise Accessibility (a11y)**:
Ensure UI components are accessible. Use semantic HTML (e.g., `<button>` instead of `<div onClick={...}>`), include `aria-label` tags for icon-only buttons (like the Eye/Edit/Delete icons), and ensure modals and dropdowns can be navigated via keyboard (Tab trapping, Esc to close).

19. **Interactive Data Tables (Clickable Rows)**:
Whenever displaying a list of entities in a table (e.g., Members, Inquiries, Staff, Orders...etc ), the entire row MUST be clickable. Clicking anywhere on the row should open the detailed profile/modal view for that entity. 
* **Implementation Details:** Add `cursor-pointer` to the `<tr>` element, bind the `onClick` handler to the row to open the details view, and strictly remove redundant "View/Eye" buttons from the actions column to keep the UI clean. Any other action buttons (Edit, Delete, Email) inside the row must have `e.stopPropagation()` to prevent accidentally triggering the row click.

20. **Searchable Dropdowns for Large Datasets**:
Whenever presenting a dropdown that selects from a potentially large dataset (e.g., selecting Gyms, Users, Plans, Members..etc), you MUST NOT use a native HTML `<select>` element. Instead, you must implement a custom popover/dropdown component that includes a search `<input>` field at the top.
*Why?* If there are 500 gyms, a user cannot scroll through a native dropdown to find one. A search box inside the dropdown is mandatory for a scalable enterprise UI.

21. **Real-Time Communication (In-House WebSocket Architecture)**:
For any real-time in-app communication (e.g., Support chat, global maintenance broadcasts, or instant notifications), the project strictly uses an in-house WebSocket architecture.
- Do NOT rely on long-polling or Server-Sent Events (SSE) for bi-directional or urgent data.
- Do NOT integrate external managed services (like Pusher, Ably, or Supabase).
- The Next.js frontend must act purely as a WebSocket client (using `socket.io-client`) connecting directly to the dedicated Node.js backend server.
- All persistent connections and socket rooms are managed strictly inside the Node.js backend on the same VPS, avoiding Next.js serverless connection drop limitations.

22. **Tenant Context & Centralized Headers (Multi-Tenancy)**:
The backend utilizes a strict Database-per-Tenant architecture. Therefore, the frontend MUST NOT rely on individual components to manually send tenant information. You must implement a centralized API fetch wrapper (e.g., `src/lib/api.ts`) that automatically intercepts every outgoing request and injects the required `x-tenant-id` header (extracted from the authenticated user's session, JWT, or subdomain) along with the `Authorization` token. Individual UI components and hooks must remain completely unaware of the tenant routing logic.

23. **Password Visibility Toggle**:
Whenever there is a password input field (e.g., Login, Registration, Change Password, Provision Tenant), you MUST include an eye icon (visibility toggle) inside or next to the input field. Clicking this icon should toggle the input type between `password` and `text`, allowing the user to see the password they have typed. Use standard icons (like `Eye` and `EyeOff` from lucide-react) for this functionality.
24. **Date & Time Standardization (Timezone Safety)**:
Frontend UI components must never send raw `new Date()` objects directly to the backend. The backend must always receive dates in **UTC (ISO 8601 format)**. When displaying dates back to the user, the frontend must intercept the UTC string and convert it to the user's local timezone using a standard library (like `date-fns` or `dayjs`). This guarantees zero offset clashes for a global SaaS.

25. **Role-Based UI Hiding (RBAC)**:
Never rely solely on the backend to block unauthorized actions while leaving the action button visible on the frontend. The frontend must implement a centralized `usePermissions()` or `useAuth()` hook that checks the active user's role (e.g., SUPERADMIN, STAFF, MEMBER). Destructive or restricted UI elements (like 'Delete Gym' or 'Refund Payment') MUST be completely hidden or safely disabled if the user lacks the required role.

26. **Skeleton Loaders over Generic Spinners**:
When fetching complex layout data or lists (like a Dashboard or Member List), do NOT use full-page generic spinning circles that cause massive layout shifts once data loads. Instead, implement **Skeleton Loaders** (using Tailwind's `animate-pulse` utility or a skeleton library) that mimic the shape of the incoming data. This provides a vastly superior, premium user experience.

27. **Strict TypeScript (No `any` Rule)**:
The use of the `any` type is strictly forbidden across the frontend architecture. If an API payload or dynamic structure's exact shape is temporarily unknown, use the `unknown` type and assert or validate it safely (using Zod) at runtime. This prevents AI code generation from taking shortcuts that eventually cause runtime crashes in production.

28. **Icon-Driven Action Columns**:
Whenever displaying action buttons in data tables, lists, or dense UI components (e.g., Edit, Delete, Restore, Settings, Re-activate, Deactivate,etc), strictly prioritize using semantic icons (e.g., from `lucide-react`) instead of bulky text labels. 
*Why?* It drastically saves horizontal space, makes the UI look significantly cleaner and more premium, and ensures the layout doesn't break on mobile views. Always include descriptive tooltips (e.g., `title="Edit User"`) and proper `aria-label`s for screen readers.

Think step-by-step. Create a detailed implementation plan first so I can review it, and then execute it perfectly without breaking existing data flows!