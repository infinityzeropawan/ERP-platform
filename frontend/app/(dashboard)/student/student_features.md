# Student Module Features

This document serves as an AI map for the `student` module. It adheres to an Enterprise-Grade, Highly Scalable, and AI-Friendly architecture.

## Architecture Guidelines

- **Micro-Modularization**: Complex UI components are broken down into small micro-components inside `student_components/[FeatureName]/`.
- **Logic Separation**: Heavy logic (`useState`, `useEffect`, fetching) is extracted to custom hooks inside `student_hooks/`.
- **Centralized Types**: All TypeScript interfaces are kept in `student_types.ts`.
- **Centralized Routing**: All internal and API routes are strictly defined in `student_url_config.ts`.
- **Centralized Styling**: Theming colors map to the Global Design System via `student.css`.
- **Server Components**: Top-level `page.tsx` files are Server Components.

## Sub-Features Directory

1. **Dashboard**: The main landing page `/student/page.tsx`.
2. *(More features will be documented as they are refactored...)*
