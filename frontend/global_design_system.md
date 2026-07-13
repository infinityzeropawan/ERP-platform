# 🎨 SMART LIBRARY 360 — GLOBAL DESIGN SYSTEM
> **Prepend this block to EVERY module you give to Stitch.**
> This ensures visual consistency across all 109 pages.
> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS (or Vanilla CSS) · shadcn/ui components

---

## 1. COLOR PALETTE

| Token | Hex Value | Usage |
|---|---|---|
| `--primary` | `#6366F1` (Indigo-500) | Primary buttons, active nav item, links, highlights |
| `--primary-hover` | `#4F46E5` (Indigo-600) | Primary button hover state |
| `--primary-subtle` | `#EEF2FF` (Indigo-50) | Soft badge backgrounds, selected row highlight |
| `--bg-page` | `#0F0F1A` | Main page background (dark) |
| `--bg-card` | `#1A1A2E` | Card, panel, table background |
| `--bg-sidebar` | `#12121F` | Sidebar background |
| `--bg-header` | `#16162A` | Top header background |
| `--bg-input` | `#1E1E32` | Input field background |
| `--border` | `#2A2A3E` | Card borders, table dividers, input borders |
| `--border-focus` | `#6366F1` | Input border on focus |
| `--text-primary` | `#F0F0FF` | All primary text, headings, table values |
| `--text-secondary` | `#8888AA` | Labels, captions, placeholder text, subtitles |
| `--text-disabled` | `#44445A` | Disabled states |
| `--success` | `#10B981` (Emerald-500) | Success state, active/working/present/paid badges |
| `--success-bg` | `#064E3B` (Emerald-900) | Success badge background |
| `--warning` | `#F59E0B` (Amber-500) | Warning state, pending/expiring/moderate badges |
| `--warning-bg` | `#451A03` (Amber-900) | Warning badge background |
| `--danger` | `#EF4444` (Red-500) | Error state, overdue/suspended/blacklisted/broken badges |
| `--danger-bg` | `#450A0A` (Red-900/dark) | Danger badge background |
| `--info` | `#3B82F6` (Blue-500) | Info state, new/neutral/cash mode badges |
| `--info-bg` | `#1E3A5F` | Info badge background |
| `--purple` | `#8B5CF6` (Violet-500) | Alumni badge, UPI mode, special callouts |
| `--purple-bg` | `#2E1065` | Purple badge background |

---

## 2. TYPOGRAPHY

- **Font Family:** `Inter` — import via Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`
- **Base font-size:** 14px

| Role | Size | Weight | Color | Usage |
|---|---|---|---|---|
| Page Title (H1) | 22px | 700 Bold | `--text-primary` | One per page, top-left |
| Section Heading (H2) | 16px | 600 SemiBold | `--text-primary` | Section titles inside cards |
| Card Label | 11px | 500 Medium | `--text-secondary` | UPPERCASED stat card labels |
| Stat Number | 28px | 700 Bold | `--text-primary` | Big KPI numbers on dashboard cards |
| Table Header | 12px | 600 SemiBold | `--text-secondary` | UPPERCASED column headers |
| Table Cell | 14px | 400 Normal | `--text-primary` | Row data values |
| Button Text | 14px | 500 Medium | White / `--primary` | Primary / ghost buttons |
| Input Text | 14px | 400 Normal | `--text-primary` | User-typed values |
| Caption / Helper | 12px | 400 Normal | `--text-secondary` | Below inputs, footnotes |
| Error Message | 12px | 400 Normal | `--danger` | Below invalid input fields |
| Badge Text | 11px | 600 SemiBold | Varies | Status pill labels |

---

## 3. APP SHELL LAYOUT

Every authenticated page uses this shell. Auth pages (`login`, `signup`, `forgot-password`, `reset-password`) do NOT use this shell.

```
┌──────────────────────────────────────────────────────────────────┐
│  TOP HEADER (height: 64px, position: fixed, top: 0, full-width)  │
│  [☰ Collapse] [📚 Smart Library 360 Logo]  ··· [🏢 Branch Name ▼] [🔔 Bell (badge count)] [👤 Avatar + Name ▼]  │
├────────────────┬─────────────────────────────────────────────────┤
│  SIDEBAR       │  MAIN CONTENT AREA                              │
│  width: 240px  │  margin-left: 240px                            │
│  (collapsible  │  padding: 24px                                 │
│   to 60px,     │  margin-top: 64px (below header)               │
│   icon-only    │                                                 │
│   mode on      │  [Breadcrumb: Dashboard > Students > Profile]  │
│   toggle)      │  [Page Title (H1) + subtitle]                  │
│                │  [Action Bar: filters left + CTA buttons right] │
│  position:     │  [Page Content: table / form / grid / charts]  │
│  fixed, left:0 │                                                 │
│  bg: --bg-sidebar                                               │
│  border-right: │                                                 │
│  1px --border  │                                                 │
└────────────────┴─────────────────────────────────────────────────┘
```

### Sidebar Nav Groups & Items (in order)
Each nav item has: [Icon] Label · Active state = Indigo left border + `--primary-subtle` background

```
📊  Dashboard
📈  Reports
── CRM ──────────────────────
📞  Enquiries
── Students ─────────────────
🎓  All Students
➕  New Admission
👥  Group Admission
🎓  Alumni
🗄️  Document Vault
🏅  Referral Bonus
── Seats & Shifts ───────────
🗺️  Seat Matrix
🪑  Seats
🔄  Shifts
↔️  Shift Migration
📋  Allocations
📜  Seat History
🔒  Lockers
🗺️  Locker Matrix
── Finance ──────────────────
💰  Collect Fee
📋  Subscriptions
🔁  Renewals
💳  Payments
🤝  Payment Promises
🛡️  Trust Scores
💼  Security Deposits
⏰  Late Fees
🚫  Auto-Suspend
🧾  Invoice
🧾  Receipt
👥  Referrals
💸  Refunds
── Operations ───────────────
📅  Attendance
📋  Absentee Report
📷  QR Scanner
📅  Holiday Calendar
── Accounts & Assets ────────
💸  Expenses
📊  Financial Reports
📊  Daily Settlement
🪑  Seat Gap Report
🔍  Shift Gap Analyzer
🏭  Assets
🔧  Asset Maintenance
── Communication ─────────────
📢  Notices
💬  Complaints
🔔  Notification Center
📱  WhatsApp Logs
📱  WhatsApp Templates
── Admin ─────────────────────
🏢  Branches
👥  Staff & Users
🔑  Permissions
💰  Plans
🎟️  Coupons
⏳  Waitlist
🚫  Blacklist
🔍  Audit Logs
📤  Bulk Import
📥  Data Export
💾  Backups
🧾  GST & Tax Settings
── System ────────────────────
⚙️  Settings
👤  Profile
🎨  Branding
📱  WhatsApp Integration
```

---

## 4. STATUS BADGE RULES (Universal — Apply to ALL pages)

Badges are small pill-shaped labels: `border-radius: 999px`, `padding: 2px 10px`, `font-size: 11px`, `font-weight: 600`.

| Status Value | Text Color | Background | Icon |
|---|---|---|---|
| Active / Working / Present / Sent / Delivered / Resolved / Paid / Fulfilled | `--success` | `--success-bg` | ✅ |
| Expiring Soon / Pending / In-Progress / Moderate / Maintenance / Held / Late | `--warning` | `--warning-bg` | ⚠️ |
| Occupied / Suspended / Failed / Low Trust / Overdue / Due / Broken | `--danger` | `--danger-bg` | 🔴 |
| Exited / Inactive / Expired / Lost / Cancelled / Forfeited / Gray | `--text-secondary` | `#1E1E2E` | — |
| New / Interested / Visited / Cash (payment mode) | `--info` | `--info-bg` | 🔵 |
| Alumni / UPI (payment mode) | `--purple` | `--purple-bg` | 🟣 |
| Blacklisted | `#FCA5A5` (light red) | `#7F1D1D` (dark red) | ⛔ |
| Card (payment mode) | `#A78BFA` | `#2E1065` | 💳 |
| Bank Transfer | `#6EE7B7` | `#064E3B` | 🏦 |

---

## 5. REUSABLE COMPONENT PATTERNS

### 5a. KPI / Stat Card
- Size: roughly 200–260px wide, height ~120px
- Structure: Top-left icon (32px, in a rounded square with subtle color background) + label (UPPERCASE, 11px, `--text-secondary`) · Below: Big number (28px bold, `--text-primary`) · Bottom: Trend line ("↑ 12% vs last month" in green, or "↓ 3%" in red)
- Background: `--bg-card`, border: `1px solid --border`, border-radius: 12px
- Arranged in a row of 3–5 cards at the top of dashboard/report pages

### 5b. Data Table
- Header row: `background: rgba(99,102,241,0.08)`, UPPERCASE 12px `--text-secondary`, sortable columns show ↑↓ arrows on hover
- Data rows: alternating subtle zebra stripe (`--bg-card` / slightly lighter), 48px row height
- Row hover: `background: rgba(99,102,241,0.06)`, subtle highlight
- Inline row actions (rightmost column): small icon buttons — 👁️ View, ✏️ Edit, 🗑️ Delete — shown on row hover
- Pagination bar (below table): "Showing 1–25 of 143 results" + Previous / Next buttons + rows-per-page selector (10 / 25 / 50)
- Empty state (no rows): Centered SVG illustration + "No [items] found" (16px, `--text-secondary`) + optional CTA button

### 5c. Form Layout
- **Simple form** (≤6 fields): single column, centered card, max-width 560px
- **Complex form** (>6 fields): two-column grid inside a full-width card, grouped in labeled sections separated by a horizontal rule
- Each field: Label above (14px, `--text-secondary`, bold) → Input below → Helper/error text below input (12px)
- Required fields: Label has red asterisk `*`
- Input styling: `background: --bg-input`, `border: 1px solid --border`, border-radius: 8px, padding: 10px 14px, focus: `border-color: --border-focus` + subtle indigo glow
- Form footer: Buttons right-aligned — Cancel (ghost) | Save/Submit (primary)

### 5d. Modal / Dialog
- Overlay: `backdrop: rgba(0,0,0,0.6)`, centered, `z-index: 1000`
- Modal card: `background: --bg-card`, border-radius: 16px, padding: 28px, max-width: 480px
- Structure: Title (18px bold) + Description text + Content area + Footer buttons
- **Confirmation/Destructive modal:** Icon = ⚠️ (amber) or 🗑️ (red) · Description explains what will happen · Buttons: "Cancel" (ghost, left) + "Confirm" (danger red, right)
- **Form modal / Drawer:** Slide-in from right, width 480px, full-height, has its own form + Save/Cancel footer

### 5e. Visual Grid (Seat / Locker Matrix)
- CSS Grid, auto-fill columns (8–10 per row depending on count)
- Each cell: 64×64px, rounded 10px, colored by status (see badge rules above)
- Cell content: seat/locker number centered (bold, 13px)
- Hover: scales up slightly (transform: scale 1.05), shows tooltip popover (student name + shift + expiry)
- Empty cell (free): click → quick-assign action
- Occupied cell (red): click → navigates to `student-profile.tsx`

### 5f. Kanban Board
- Horizontal scrollable columns container
- Each column = a status lane: header with status badge + count · Cards stacked vertically below
- Card: `background: --bg-card`, border-radius: 10px, padding: 14px, border-left: 3px solid [status color]
- Card content: Name (bold), Phone (masked: 98****2310), tag/badge for shift or date

### 5g. Wizard / Stepper
- Left panel: vertical step list numbered 01–05, active step in `--primary`, completed steps with ✅ checkmark
- Right panel: current step form content
- Top: progress bar (fills from 0% → 100% as steps complete)
- Footer: "← Back" ghost button (left) + "Next →" primary button (right)

### 5h. Timeline (for follow-ups, history logs)
- Vertical line on left (2px, `--border`)
- Each entry: colored dot on line + date (bold, `--text-secondary`) + content card to the right
- Newest entry at top

---

## 6. FEEDBACK & STATE PATTERNS

### Toast Notifications
- Position: Bottom-right corner, fixed
- Size: 320px wide, padding: 16px, border-radius: 12px
- ✅ Success: green left border + "✅ [message]"
- ❌ Error: red left border + "❌ [message]"
- Auto-dismiss after 4 seconds with slide-out animation

### Loading State
- Show skeleton loaders (gray animated shimmer pulse) that match the exact layout of the page content
- Tables: show 5–8 skeleton rows with random widths
- Stat cards: show shimmer blocks the size of the card

### Empty State
- Centered in the content area
- Simple SVG icon (related to the entity — e.g., 🎓 for students, 💳 for payments)
- Heading: "No [items] yet" (16px, `--text-secondary`)
- Subtext: "Get started by adding your first [item]" (13px, `--text-secondary`)
- CTA button: Primary button "➕ Add [item]" (if user has permission)

### Form Validation
- Validate on submit + on blur
- Error: red border on input (`border-color: --danger`) + error message below (12px, `--danger`)
- Success: green border on input after valid value entered

### Confirmation Dialogs (REQUIRED FOR these actions)
Always show a modal before executing: Delete, Soft-Delete, Blacklist, Suspend, Mark Exit, Forfeit Deposit, Close Register, Process Refund, Remove from Waitlist, Revoke Permission.

---

## 7. BUTTON HIERARCHY RULES

| Type | Style | Usage |
|---|---|---|
| **Primary** | Solid `--primary` background, white text, border-radius: 8px, padding: 10px 20px | Main CTA per page (one per view) |
| **Danger Primary** | Solid `--danger` background, white text | Destructive confirm actions (Delete, Blacklist, Exit) |
| **Ghost / Outlined** | Transparent bg, `--border` border, `--text-primary` text | Secondary actions (Cancel, Export, Back) |
| **Ghost Danger** | Transparent bg, `--danger` border, `--danger` text | Soft destructive (Mark Lost, Deactivate) |
| **Icon Button** | 32×32px circle or square, icon only | Inline table row actions (View 👁️, Edit ✏️, Delete 🗑️) |
| **Text Link** | No bg, no border, `--primary` text, underline on hover | Navigation links, "Forgot Password?", "Add Category" |
| **Segmented Control** | Joined button group, selected = `--primary` bg | Payment mode selector (Cash/UPI/Card), view toggles |

### Button Placement Rules
- **Page-level CTA** (e.g., "Add Student", "New Admission"): TOP-RIGHT of the action bar
- **Form submit** (e.g., "Save", "Confirm"): BOTTOM-RIGHT of the form card
- **Destructive** (e.g., "Delete", "Blacklist"): Always paired with "Cancel" ghost button to its LEFT
- **Inline row actions**: Rightmost column of data tables, shown on row hover only
- **Wizard "Next/Back"**: Footer of wizard step — Back (left ghost) | Next (right primary)

---

## 8. RESPONSIVE BEHAVIOR

| Breakpoint | Behavior |
|---|---|
| Desktop ≥1280px | Full sidebar (240px) + full content. Tables show all columns. |
| Tablet 768–1279px | Sidebar collapses to icon-only (60px). Tables scroll horizontally. |
| Mobile <768px | Sidebar hidden, accessible via hamburger menu drawer. Tables become card-stacks. Forms single-column. |

---

## 9. ICONS

Use **Lucide Icons** (tree-shakeable, consistent style). Key icons:
- 🧑‍🎓 Students: `Users`, `UserPlus`, `UserCheck`, `UserX`
- 🪑 Seats: `Armchair`, `Grid`, `LayoutGrid`
- 💰 Finance: `IndianRupee`, `Receipt`, `CreditCard`, `Wallet`
- 📅 Dates: `Calendar`, `CalendarDays`, `Clock`
- 🔔 Alerts: `Bell`, `BellRing`, `AlertTriangle`
- 📊 Reports: `BarChart2`, `LineChart`, `PieChart`, `TrendingUp`
- ⚙️ Admin: `Settings`, `Shield`, `Lock`, `Key`
- 📤 Actions: `Upload`, `Download`, `FileText`, `Printer`
- 💬 Comms: `MessageSquare`, `Phone`, `Mail`
- ✅ Status: `CheckCircle`, `XCircle`, `Clock`, `AlertCircle`

---

## 10. CHART STYLE GUIDE (for `reports.tsx`, `financial-reports.tsx`, `dashboard.tsx`)

Use **Recharts** or **Chart.js** library.

| Chart Type | Colors | Usage |
|---|---|---|
| Bar Chart (grouped) | Income bars: `#6366F1` (Indigo) · Expense bars: `#EF4444` (Red) | Income vs Expense monthly comparison |
| Line Chart | Line: `#10B981` (Green) · Area fill: `rgba(16,185,129,0.15)` | Revenue trend over months |
| Pie / Donut Chart | Slice colors: Indigo, Emerald, Amber, Blue, Purple, Red (in that order) | Shift occupancy, expense category breakdown |
| Horizontal Bar | Single color: `#6366F1` | Seat utilization, student growth |

All charts: dark background (`--bg-card`), `--text-secondary` axis labels, gridlines `rgba(255,255,255,0.05)`, tooltips with dark card style matching the design system.

---

## 11. THEMING & DARK/LIGHT MODE

This design system intrinsically supports both Dark and Light modes using CSS variables. 
When building modules or components, **ALWAYS follow these rules** to ensure seamless theme switching:

1. **Never use hardcoded Tailwind colors** for backgrounds or text (e.g., `bg-white`, `bg-gray-900`, `text-black`, `text-white`) unless explicitly required for a specific UI element (like a primary button where text is always white).
2. **Always use CSS Variables**: Map all colors to the global CSS variables defined in this system (e.g., `bg-[var(--bg-card)]`, `text-[var(--text-primary)]`, `border-[var(--border)]`).
3. **Theme Provider**: Ensure the app is wrapped in a `ThemeProvider` (like `next-themes`) that toggles a `.dark` class on the `<html>` or `<body>` tag.
4. **CSS Setup**: In your global CSS file (e.g., `globals.css`), define the light mode variables inside `:root { ... }` and the dark mode variables inside `.dark { ... }`.
5. **Gradients & Shadows**: For gradients and shadows, use variables like `var(--primary)` instead of hardcoded hex/rgba to ensure they adapt naturally when the theme changes.

---

*END OF GLOBAL DESIGN SYSTEM — Paste this block before every module you give to Stitch.*