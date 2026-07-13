Hey, I want you to deeply analyze the @[app/(app)/[MODULE_NAME]] folder and refactor it into an Enterprise-Grade, Highly Scalable, and strictly "AI-Friendly" architecture. 

Currently, no one writes code manually; AI writes it. Because of this, my primary goal is extreme isolation. Tomorrow, if I ask an AI to fix a specific bug, I should only need to provide ONE exact file to the AI, completely eliminating the risk of the AI hallucinating and breaking other working functionalities. However, the folder architecture must remain highly organized and visually logical so that human developers can easily navigate it without getting lost in a flat directory of 50+ files.

Please follow these strict architectural rules:

1. **Micro-Modularization & Feature-Based Sub-folders (Crucial)**: 
Break down all large or mixed files. Every file must contain only one React component and handle only one specific micro-functionality. **CRITICAL:** Do not dump all these micro-files into a single flat directory. Group them logically into cohesive sub-folders within the module. 
**IMPORTANT FOLDER NAMING:** Always prefix the main internal folders with the module name (e.g., use `[moduleName]_components/`, `[moduleName]_context/`, `[moduleName]_utils/` instead of generic names like `components/`). This ensures that when providing context to an AI (using `@`), the AI only loads the exact folder for this module, avoiding cross-module hallucinations. Inside these prefixed folders, group files logically (e.g., `[moduleName]_components/Header/`).
Next.js App Router uses Server Components by default, so you MUST explicitly include `"use client";` at the top of any file that uses hooks (`useState`, `useEffect`) or event listeners.

2. **Hyper-Descriptive Naming (Length Doesn't Matter)**: 
Rename all components, files, and folders to be extremely descriptive based on exactly what they do. **It does not matter if a filename becomes exceptionally long** (e.g., `MembersSubscriptionRenewalForm.tsx` instead of `RenewForm.tsx`). Meaningfulness and convenience are the only priorities. Just by reading the filename, a developer or an AI must know exactly what the file does and what module it belongs to. 
- **No Abbreviations**: Never use `Btn`, `Nav`, `Utils`. Use `Button`, `Navigation`, `Utilities`.
- **Strict Suffixing**: Component names must end with their exact UI structural type (e.g., `...Modal.tsx`, `...Table.tsx`, `...Form.tsx`, `...Card.tsx`, `...Dropdown.tsx`).
- **Prop Naming**: Do not export generic `Props` or `Data` interfaces. Always prefix them (e.g., `export interface InquiriesTableProps`).

3. **Backend-Ready Centralized Data (Single Source of Truth)**: 
Find all hardcoded UI data (dropdown options, filter lists, default preset arrays, payment modes, etc.) scattered across the UI components. Extract them into feature-specific constant files alongside their components (e.g., `HeaderConstants.ts` inside the `/Header` folder) or a module-level `[ModuleName]SharedConstants.ts` for data used across multiple sub-folders.
*Why?* Because tomorrow, this hardcoded data will be replaced by a Backend API call. By keeping it all in one file today, I will only have to change one file tomorrow to integrate the API, without touching the UI components. Derive your TypeScript types directly from these central arrays.

4. **Theme Independence (No Inline Colors)**: 
Remove all hardcoded Tailwind color utilities from the JSX. Map all CSS variables (e.g., `--bg-card`, `--text-primary`) in `tailwind.config.ts` as named tokens so you can use standard Tailwind classes like `bg-card` or `text-primary` **without** arbitrary bracket values. **The one canonical pattern is: define the variable in `globals.css`, map it in `tailwind.config.ts`, and use the Tailwind class name (e.g., `bg-card`) in JSX. Never use `bg-[var(--bg-card)]` or `bg-[#1A1A2E]` directly in JSX.** This ensures that I can copy-paste this entire folder to another project and theme it entirely from one CSS file.

5. **Smart & Isolated State Management (Avoid Excessive Prop Drilling)**: 
Because the components will be heavily micro-modularized (Rule #1), avoid creating a massive web of prop drilling (passing data through 5 layers of components). If multiple micro-components need to share the same state, create a state store exclusively for this module. **See Rule 58 for the strict decision boundary between React Context and Zustand.** Do NOT bloat the global app state; keep the state architecture isolated to this feature. Since components are heavily micro-modularized, if you use React Context, you MUST implement proper memoization (`useMemo`, `useCallback`) to prevent massive re-render chains across the sub-folders.

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
- **Pessimistic UI Updates (Cache Mutation)**: This rule applies universally to ALL mutations, not just financial ones. After successfully mutating data on the backend (e.g., editing, deleting, or adding an entity), do NOT trigger a full page refresh or a redundant API `GET` request just to see the changes. Instead, await the successful response from the backend, and then manually mutate the centralized Zustand store (see Rule 58) using the updated data. This eliminates unnecessary network calls while ensuring the UI is strictly synchronized with the actual backend state (avoiding "fake" optimistic updates that apply before the backend confirms success).

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

29. **Multi-Medium Sending Selection (Radio Buttons)**:
Whenever the user performs an action that sends a proof or document (like sending a bill, receipt, or alert), the UI MUST present an option to choose between at least **two mediums** (e.g., WhatsApp vs. Email). 
* **Implementation:** Use rounded Radio Buttons (`<input type="radio">`) so that the user can visually see both options but can only select one preferred medium at a time. Do NOT use checkboxes if only one medium should be selected. The frontend must then pass the selected medium back to the API payload.

30. **Mandatory Table Controls (Pagination, Sorting, & Filtering)**:
Whenever displaying tabular data (like Orders, Members, or Transactions), you MUST always implement pagination, column sorting (e.g., Sort by Date ASC/DESC), and relevant filtering (e.g., Date Range pickers, status dropdowns, or search boxes) directly above the table. It is unacceptable to display a massive raw table without giving the user these enterprise-grade data management controls.

31. **Modularized API Clients (No Centralized API Blob)**:
Do not define module-specific API routes in a giant global file (like `src/lib/api.ts`). Every module MUST have its own API file inside a dedicated folder (e.g., `[moduleName]_api/[moduleName]_api.ts`). This file should import the core base fetcher (`apiFetch` from `src/lib/api.ts`) and define only the endpoints strictly needed for that specific module. 
*Why?* This guarantees **Extreme Isolation**. When a module is extracted to feed an AI, the AI will receive all the API fetching logic specific to that module, eliminating missing context errors.

32. **The "No Barrel File" Rule (Avoid `index.ts`)**:
Strictly avoid using `index.ts` or `index.js` files to re-export modules. Always import directly from the explicitly named file (e.g., `import X from './Folder/X.tsx'`).
*Why?* Barrel files completely destroy the "Extreme Isolation" philosophy. They cause circular dependencies and force the AI (and humans) to trace imports through multiple files just to find the actual source of a component.

33. **Framework-Specific Media Optimization**:
Never use standard HTML `<img>` tags for remote or static assets if the framework provides an optimized alternative. 
- **If Next.js**: You must strictly mandate the use of the Next.js `<Image>` component (`next/image`). This ensures automatic WebP conversion, lazy loading, and prevents layout shifts.
- **If React (Vite) / Angular**: Use the respective optimized image handling libraries or directives available in those ecosystems to ensure heavy assets do not block rendering.

34. **Environment Variable Segregation & Security**:
Strictly segregate public and private environment variables according to the framework's specific rules.
- **If Next.js**: Prefix public variables with `NEXT_PUBLIC_`.
- **If React (Vite/CRA)**: Prefix with `VITE_` or `REACT_APP_`.
- **If Angular**: Manage securely through `environment.ts` files.
Never leak secret backend API keys, database credentials, or secret tokens into the frontend client bundle.

35. **Strict Prohibition of Magic Strings & Numbers**:
Never use raw strings (e.g., `if (status === 'PENDING')`) or raw numbers (e.g., `setTimeout(..., 5000)`) directly in the logic or UI components. All magic values must be defined as TypeScript `enums` or `const` objects in the module's `_utils` or `_constants` file.
*Why for AI?* AIs frequently hallucinate string casings. Enforcing enums entirely eliminates this class of bugs because TypeScript will throw an error if the AI guesses the wrong enum key.

36. **No Arbitrary Tailwind Values (Strict Design System)**:
Never use arbitrary, hardcoded pixel or hex values in Tailwind classes (e.g., `w-[325px]`, `text-[15px]`, `p-[11px]`). You must strictly adhere to the framework's configured design system scales (e.g., `w-80`, `text-sm`, `p-3`).
*Why?* Arbitrary values destroy UI consistency. Forcing the AI to use the standard Tailwind scale ensures perfect visual rhythm across the entire app.

37. **JSDoc for Complex Logic (AI Context Enhancer)**:
Every custom hook, utility function, and complex data transformation MUST be prefixed with a short, descriptive JSDoc block (`/** ... */`).
*Why for AI?* When you feed a 200-line custom hook to an AI, a JSDoc comment instantly tells the AI the *intent* of the function. This prevents the AI from having to reverse-engineer the math, leading to vastly faster and safer code generation.

38. **Strict Component Responsibility Contract (The "One Reason to Change" Rule)**:
Every component file must have a single-line comment at the very top (after `"use client"`) declaring its exact responsibility:
`// RESPONSIBILITY: Renders the read-only member profile header. Receives data via props. No API calls.`
*Why for AI?* When you feed a file to an AI, it immediately knows the boundary of what it should and shouldn't touch, preventing it from hallucinating API calls inside pure view components.

39. **Explicit Data Flow Direction Comments**:
In every Context file and custom hook, document the data flow direction at the top:
`// DATA FLOW: API → useMembersTable.ts → MembersContext → MembersTable → MembersTableRow`
*Why for AI?* AIs hallucinate circular dependencies. This comment makes the unidirectional flow explicit and machine-readable.

40. **Forbidden Patterns File (`[moduleName]_forbidden.md`)**:
Every module must have a tiny markdown file listing what is explicitly NOT allowed in that module (e.g., "Do not add global auth logic here", "Do not import from the billing module"). Telling the AI what NOT to do is as important as telling it what to do.

41. **Strict Pessimistic UI for Financial/Destructive Actions**:
As a strict enforcement of Rule 15 (which applies universally to all mutations), this rule adds an additional constraint specifically for financial and destructive actions: for any action involving money (payments, refunds, fee collection) or irreversible operations (delete, blacklist, suspend), the submit button MUST additionally transition to a disabled loading state (spinner) for the entire duration of the API call. The UI must only mutate the Zustand store after the backend confirms with `2xx`. Optimistic updates are completely forbidden for these action types.

42. **URL as State for Shareable Views**:
Any filterable, searchable, or paginated list page MUST sync its state (search query, page number, active filters, sort column) to the URL as query parameters using `useSearchParams` / `useRouter`.
*Why?* Enterprise users share filtered table URLs with colleagues constantly. This means a filtered view is always shareable and the browser back button works correctly.

43. **Typed Error Boundaries per Module**:
Beyond `error.tsx`, every module must have a typed React Error Boundary component (`[ModuleName]ErrorBoundary.tsx`) that wraps the module's root client component. It must display a module-specific fallback UI (not a generic "Something went wrong") and include a "Retry" button that calls `reset()`.

44. **Network State Enum (No Boolean `isLoading` Flags)**:
Never use multiple boolean flags (`isLoading`, `isError`, `isSuccess`) to represent async state. This leads to impossible states. Always use a single typed enum defined in the module's `_types.ts`:
`type FetchState = 'idle' | 'loading' | 'success' | 'error'`

45. **Sensitive Data Masking in UI**:
Any field displaying sensitive data (phone numbers, email addresses, Aadhaar/ID numbers, bank accounts) must be masked by default in list/table views (e.g., `98****2310`, `j***@gmail.com`). A dedicated `maskSensitiveData()` utility must be used universally. Full data is only shown in the dedicated detail/profile view.

46. **No `console.log` in Production**:
All `console.log`, `console.error`, and `console.warn` calls are strictly forbidden in committed UI components. Use a centralized logger utility (`src/lib/logger.ts`) that is a no-op in production (`process.env.NODE_ENV === 'production'`) and logs normally in development. 

47. **Co-located Test Files**:
Every custom hook (`use[X].ts`) and utility function must have a co-located test file (`use[X].test.ts`) in the same folder. UI component tests are optional, but logic layer tests are mandatory. This is the minimum safety net for an AI-driven codebase.

48. **Unsaved Changes Warning**:
Any form or edit modal that has been modified but not submitted must intercept the browser's `beforeunload` event and Next.js router navigation to warn the user: "You have unsaved changes. Are you sure you want to leave?" Use React Hook Form's `formState.isDirty` to detect this.

49. **Copy-to-Clipboard on Sensitive IDs**:
Any field displaying a unique ID, reference number, transaction ID, or tracking code must have a small copy icon next to it. Clicking it copies the value to clipboard and shows a brief "Copied!" tooltip.

50. **Consistent Empty State per Entity**:
Every list/table must have a dedicated empty state component (`[Module]EmptyState.tsx`) — not an inline conditional. It must show a relevant icon, a descriptive message, and a CTA button (if the user has permission to create). Generic "No data found" messages are forbidden.

51. **Strict Import Order Convention**:
To prevent random shuffling of imports by AI, enforce a strict order using ESLint `import/order`. Order must be: 1) React/Next.js core, 2) Third-party libraries, 3) Absolute internal imports (`@/lib`), 4) Module-specific imports (`@/app/(erp)/...`), 5) Types-only imports (`import type ...`).

52. **Prop Spreading is Forbidden (`...props` ban)**:
Never write `<Component {...props} />` as it destroys TypeScript safety and leaks unknown props to the DOM. All props must be explicitly named. The only exception is primitive HTML wrappers (like a custom `<Button>` extending native `<button>`).

53. **Conditional Rendering Pattern (No Inline Ternary Hell)**:
Deeply nested ternaries (`a ? b : c ? d : e`) are strictly forbidden in JSX. For 3+ conditions, use an early return pattern or a dedicated `renderContent()` helper function. JSX must only have one level of ternary.

54. **Event Handler Naming Convention**:
Props must use the `on` prefix (e.g., `onSubmit`, `onRowClick`). The internal handler functions must use the `handle` prefix (e.g., `handleSubmit`, `handleRowClick`). Ensure this is documented in `[moduleName]_types.ts`.

55. **`useEffect` Dependency Array Audit Comment**:
Every `useEffect` must have a comment immediately above it explaining EXACTLY why those variables are in the dependency array. E.g., `// Refetch when memberId changes on navigation`. This prevents AI from blindly adding `// eslint-disable-next-line`.

56. **Global Shared Components Strict Scope**:
`src/components/ui/` is ONLY for generic, zero-business-logic primitives (Button, Input). `src/components/layout/` is for AppShell, Sidebar, etc. Global components must NEVER contain module-specific API calls or business terminology. If a component is only shared by 2 modules, duplicate it in those modules (WET principle).

57. **`key` Prop Rules for Lists**:
Using `key={index}` is strictly forbidden for any list that can be reordered, filtered, or paginated. Always use stable unique backend IDs (`key={member.id}`). If the backend isn't sending an ID, fix the backend; do not use `Math.random()` on the frontend.

58. **Zustand over Context for Cross-Component Async State (The Decision Boundary)**:
This is the canonical rule that resolves all state management decisions referenced in Rules 5 and 15:
- **React Context:** ONLY for synchronous, rarely-changing UI state (theme, sidebar open/close, locale). Never put API data or loading states in Context.
- **Zustand (module-scoped store):** For ALL async data (API responses), loading states, and any state shared across more than one component within a module.
- **Local `useState`:** Only for state that is strictly private to a single component and never needs to be shared.
This three-tier decision must be applied consistently. An AI must never use Context for API data.

59. **`next/font` for Font Loading**:
Never use Google Fonts CDN (`@import`) in global CSS as it causes layout shifts and performance drops. Always use `next/font/google` to self-host fonts natively in Next.js.

60. **Strict `tsconfig.json` Enforcement**:
The frontend MUST run with `strict: true`. No `implicitAny`, no `implicitThis`. AI must never add `@ts-ignore` or `@ts-nocheck` to bypass type errors.

61. **No Direct `localStorage` in Components**:
Never call `window.localStorage` directly inside a React component (it causes hydration mismatches in Next.js). Always use a dedicated `useLocalStorage` hook that handles the `typeof window !== 'undefined'` check and hydration sync.

62. **Standardized `ApiResponse<T>` Generic**:
Every API call must be typed using a global `ApiResponse<T>` generic interface that matches the backend's exact envelope (e.g., `{ success: boolean, data: T, message: string }`).

63. **No Direct `router.push('/login')` in Components**:
Individual UI components must never contain hardcoded redirection logic for unauthenticated states. This must be handled centrally in a middleware (`middleware.ts`) or an `axios`/`fetch` interceptor that catches `401` errors and redirects globally.

---
Think step-by-step. Create a detailed implementation plan first so I can review it, and then execute it perfectly without breaking existing data flows!
