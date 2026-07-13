# Admin Module Features

This document serves as an AI map for the `admin` module. It follows an Enterprise-Grade, Highly Scalable, and AI-Friendly architecture.

## Architecture Guidelines

- **Micro-Modularization**: Complex UI components are broken down into small micro-components and placed inside `admin_components/[FeatureName]/`.
- **Logic Separation**: Heavy React logic (`useState`, `useEffect`, fetching) is extracted to custom hooks inside `admin_hooks/`.
- **Centralized Types**: All TypeScript interfaces are kept in `admin_types.ts`.
- **Centralized Routing**: All internal and API routes are strictly defined in `admin_url_config.ts`.
- **Centralized Styling**: Theming colors map to the Global Design System via `admin.css`.
- **Server Components**: Top-level `page.tsx` files are Server Components whenever possible.

## Sub-Features Directory

1. **Dashboard**: The main landing page `/admin/page.tsx` displaying statistics.
2. **Users**: Management of Students, Teachers, and Support Staff.
3. **Institutions**: Management of Institutions by Super Admin.
4. **Classes**: Class management.
5. *(More features will be documented as they are refactored...)*
