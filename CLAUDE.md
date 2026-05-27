# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DID045-Management-Services-Center** — Thai government web application for กรมอุตสาหกรรมทหาร (Defense Industry Department / อท.) that manages military equipment license data services and the Linkage Center II integration platform.

## Commands

```bash
npm i          # install dependencies
npm run dev    # start dev server (Vite)
npm run build  # production build
```

No test runner or linter is configured.

## Architecture

### Routing & Layout

`src/app/routes.ts` defines a single root route with `Layout` as the shell and all pages as children. `Layout` renders `Navbar` (fixed, 64px tall) + collapsible `Sidebar` (fixed left, 260px expanded / 72px collapsed) + `<Outlet>` for page content. Sidebar collapse state lives in `Layout` and is passed as props — no global state manager is used.

Pages (`src/app/pages/`):
- `Dashboard` — overview stats and Recharts bar charts
- `Providers` — government agency data providers (DOTI, DOPA, RD, DBD, etc.)
- `Clients` — registered applications
- `Services` — API services per provider
- `Permissions` — client-to-service access grants with expiry dates
- `LogLinkage` — Linkage2 request logs
- `LogLicense` — อท. license request logs
- `AuditLog` — system audit trail

### Shared Components (`src/app/components/`)

| Component | Purpose |
|---|---|
| `DataTable<T>` | Generic sortable/paginated table; takes `columns: Column<T>[]`, `data: T[]`, `keyField` |
| `Modal` | Centered overlay with `title`, `size` (`sm`/`md`/`lg`/`xl`), `footer` slot |
| `ConfirmDialog` | Destructive-action confirmation wrapping `Modal` |
| `Button` | Primary/secondary/danger variants with optional `icon` prop |
| `Breadcrumb` | Page-level breadcrumb trail |
| `ToggleSwitch` | Active/inactive toggle used in Permissions |
| `StatusBadge` | Pill badge for active/inactive states |
| `LogPage` | Reusable log viewer shared by LogLinkage and LogLicense |

`src/app/components/ui/` contains a full shadcn/ui component library (Radix UI + Tailwind). These are available but most pages use inline styles instead.

### Styling Conventions

All pages use **inline styles** (not Tailwind classes). Consistent design tokens used throughout:

```
Primary (Navy):   #003087
Accent (Teal):    #00A8A8
Background:       #F0F4F8
Sidebar:          #111827
Danger:           #DC2626
Font:             'Noto Sans Thai', 'Inter', sans-serif
Card radius:      14px
Card shadow:      0 1px 6px rgba(0,0,0,0.07)
```

Each page file typically declares `const NAVY`, `const TEAL`, `const FF` (font family) at the top and reuses them.

### Data

All data is **hardcoded mock arrays** inside each page file — there is no backend API, no fetching, and no global state library. CRUD operations mutate local `useState` arrays. Provider codes follow the pattern `DOTI`, `DOPA`, `RD`, `DBD`, etc.; service IDs follow `{CODE}-{NNNN}` (e.g., `DOTI-0001`).

### Vite Config

- Path alias `@` → `src/`
- `figma:asset/{filename}` imports resolve to `src/assets/{filename}`
- Raw imports supported for `.svg` and `.csv`
- Both `react()` and `tailwindcss()` plugins must remain even if Tailwind is not actively used
