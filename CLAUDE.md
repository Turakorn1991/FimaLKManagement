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
| `ToggleSwitch` | Active/inactive toggle used in Permissions |
| `StatusBadge` | Pill badge for active/inactive states |
| `LogPage` | Reusable log viewer component — **NOT used by LogLinkage or LogLicense** (both pages are fully self-contained). Reserved for future log pages. |

`Breadcrumb` component exists at `src/app/components/Breadcrumb.tsx` but is not rendered on any page.

`src/app/components/ui/` contains a full shadcn/ui component library (Radix UI + Tailwind). These are available but most pages use inline styles instead.

### DataTable Text Standards

`<td>` base style: `fontSize: "13px"`, `fontWeight: 500`, `color: "#111827"`. All custom `render` functions for main cell text must match these values. Exceptions that intentionally deviate:

- **Sub-text / descriptions** (clientId, serviceId, entityId below the main label): `fontSize: "10px"`, color `#6B7280`, monospace
- **Badges / pills** (สถานะ, ผลลัพธ์, การกระทำ, รหัสตอบกลับ, entity chip): keep their own `fontSize` (`10px`–`12px`) and `fontWeight` (`600`–`700`)

### Log Pages — Shared Badge Standards

สถานะ pill (all 3 log pages): `padding "3px 9px"`, `minWidth "82px"`, `borderRadius "20px"`, `inline-flex + justifyContent center`
- สำเร็จ: bg `#ECFDF5`, color `#059669`, border `#A7F3D0`
- ไม่สำเร็จ: bg `#FEF2F2`, color `#DC2626`, border `#FECACA`

รหัสตอบกลับ badge: `padding "3px 9px"`, `borderRadius "20px"`, `fontSize 12px`, `fontWeight 700`, monospace
- 2xx: bg `#ECFDF5`, color `#059669`
- 4xx: bg `#FFFBEB`, color `#D97706`
- 5xx: bg `#FEF2F2`, color `#DC2626`

IP Address column header: always **"IP Address"** (not "IP"), width `140px`, monospace, `fontWeight 500`

Filter dropdown สถานะ options always: `"สถานะ ทั้งหมด"` / `"สำเร็จ"` / `"ไม่สำเร็จ"` (never use "ผิดพลาด")

---

### ประวัติการเชื่อมโยง Linkage (LogLinkage)

**File**: `src/app/pages/LogLinkage.tsx` — fully self-contained; no imports from `LogPage`.

**Theme & constants**
```ts
CHART_COLOR = "#003087"   // Navy
PALETTE     = ["#003087","#0A4DAA","#2B6CC4","#5B8FD8","#8FB5E8"]
TITLE       = "ประวัติการเชื่อมโยง Linkage (linkage logs)"
SUBTITLE    = "ข้อมูลประวัติการเชื่อมโยงข้อมูลกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน"
CHART_TITLE = "Linkage Request"
SEARCH_PLACEHOLDER = "ค้นหา Log ID, แอปพลิเคชัน, บริการ..."
```

**Data** — 586 entries: `failureSample` (id `LNK-09999`, statusCode `401`, timestamp ล่าสุด) prepended first + 585 LCG-generated entries
- statusPool weights: 85% `200` / 8% `401` / 5% `404` / 2% `500`
- Clients: ระบบสารบรรณ, MilLogistics, Intel App, Procurement, MapThai GIS, HR-Defence (`CLT-001`…`CLT-006`)
- Services: ข้อมูลทะเบียนราษฎร, ทะเบียนหนังสือรับรองนิติบุคคล, ทะเบียนรายชื่อผู้ถือหุ้น, ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20, ทะเบียนประวัติอาชญากรรม (`DOPA-0001`, `DBD-0001`, `DBD-0002`, `RD-0001`, `RTP-0001`)

**Columns** — LOG ID (130px) → วัน-เวลา (185px, sortable) → แอปพลิเคชัน (auto, name + clientId sub-text) → บริการ (auto, name + serviceId sub-text) → สถานะ (118px) → รหัสตอบกลับ (90px) → IP Address (140px) → # (44px)

**Filter** — unified grid `"1fr 1fr 1fr auto auto"`:

| Row | Col 1 | Col 2 | Col 3 | Col 4–5 |
|---|---|---|---|---|
| Filters | ช่วงวันที่ | แอปพลิเคชัน | บริการ | สถานะ (`gridColumn:"4/6"`) |
| Separator | `gridColumn:"1/6"` | | | |
| Buttons | Search (`gridColumn:"1/4"`) | | | ค้นหา · ล้างตัวกรอง |

- Eye button hover: bg `#EEF2FF`, border `#C7D2FE` (indigo)
- ค้นหา hover: `#002470`

**KPI cards** (left of chart, 280px column)
- Request ทั้งหมด: bg `#EEF2FF`, color `#003087`
- สำเร็จ (2xx): bg `#ECFDF5`, color `#059669`
- ไม่สำเร็จ (4xx/5xx): bg `#FEF2F2`, color `#DC2626`

**Detail Modal** — `icon={<GitBranch size={17} color="#003087" />}` `iconBg="#EEF2FF"` `size="lg"`
- subtitle: `"การเชื่อมโยงข้อมูลกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน"`
- Metadata grid (2-col): Log ID · วัน-เวลา · แอปพลิเคชัน · บริการ · รหัสตอบกลับ · Response Time · IP Address
- Error box when `statusCode >= 400`: `⚠ ข้อมูลข้อผิดพลาด` + `responseBody.message` text only
- Request Body / Response Body: dark `#1F2937` pre blocks, `fontSize 11px` monospace

---

### ประวัติการให้บริการข้อมูล อท. (LogLicense)

**File**: `src/app/pages/LogLicense.tsx` — fully self-contained; no imports from `LogPage`.

**Theme & constants**
```ts
CHART_COLOR = "#003087"   // Navy (same as LogLinkage)
PALETTE     = ["#003087","#0A4DAA","#2B6CC4","#5B8FD8","#8FB5E8"]
TITLE       = "ประวัติการให้บริการข้อมูล อท. (License Logs)"
SUBTITLE    = "ข้อมูลประวัติการให้บริการข้อมูลใบอนุญาต/หนังสืออนุญาต ของ กรมการอุตสาหกรรมทหาร บน LinkageII"
CHART_TITLE = "License Request"
SEARCH_PLACEHOLDER = "ค้นหา Log ID, รหัสหน่วยงาน, บริการ..."
```

**Data** — 652 entries: 2 hardcoded pinned rows prepended + 650 LCG-generated entries
- `failureSample` id `LIC-09999`, statusCode `403`, timestamp "26 พ.ค. 2569, 07:55 น." → row 1
- `successSample` id `LIC-09998`, statusCode `200`, timestamp "26 พ.ค. 2569, 08:10 น." → row 2
- (both pinned timestamps อยู่ใน default 7-day filter range เสมอ)
- statusPool weights: 82% `200` / 10% `404` / 5% `403` / 3% `500`
- agencyCodes: 5 × 13-digit numeric juristic codes (`"0105543000011"` … `"0105562000055"`)
- Services: ใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (ยภ.2), ใบอนุญาตนำเข้ามาซึ่งยุทธภัณฑ์ (ยภ.3), ใบอนุญาตมีซึ่งยุทธภัณฑ์ (ยภ.5), หนังสืออนุญาตสั่ง/นำเข้าวัตถุ (อ.8), หนังสืออนุญาตขาย/จำหน่ายอาวุธ (อ.17) — serviceIds: `DOTI-0001`…`DOTI-0009`

**Columns** — LOG ID (130px) → วัน-เวลา (185px, sortable) → รหัสหน่วยงาน (160px, monospace, 13-digit) → บริการ (auto, name + serviceId sub-text) → สถานะ (118px) → รหัสตอบกลับ (90px) → IP Address (140px) → # (44px)

**No แอปพลิเคชัน column** — replaced by รหัสหน่วยงาน

**Filter** — unified grid `"1fr 2fr auto auto"` (ช่วงวันที่ = 1fr ≈ same width as LogLinkage's 1/3):

| Row | Col 1 | Col 2 | Col 3–4 |
|---|---|---|---|
| Filters | ช่วงวันที่ | บริการ | สถานะ (`gridColumn:"3/5"`) |
| Separator | `gridColumn:"1/5"` | | |
| Buttons | Search (`gridColumn:"1/3"`) | | ค้นหา · ล้างตัวกรอง |

- Eye button hover: bg `#EEF2FF`, border `#C7D2FE` (indigo)
- ค้นหา hover: `#002470`
- KPI "Request ทั้งหมด" bg: `#EEF2FF`, color `#003087`

**Detail Modal** — `icon={<FileSearch size={17} color="#003087" />}` `iconBg="#EEF2FF"` `size="lg"`
- subtitle: `"การให้บริการข้อมูลใบอนุญาต/หนังสืออนุญาต ของ กรมการอุตสาหกรรมทหาร"`
- Metadata grid (2-col): Log ID · วัน-เวลา · รหัสหน่วยงาน · บริการ · รหัสตอบกลับ · Response Time · IP Address
- Error box when `statusCode >= 400`: `⚠ ข้อมูลข้อผิดพลาด` + `responseBody.message` text only
- Request Body / Response Body: dark `#1F2937` pre blocks, `fontSize 11px` monospace

---

### ประวัติการใช้งานระบบ (AuditLog)

**File**: `src/app/pages/AuditLog.tsx` — fully self-contained; no imports from `LogPage`.

**Theme & constants**
```ts
CHART_COLOR = "#003087"   // Navy
FF = "'Noto Sans Thai', 'Inter', sans-serif"
```

**Types**
```ts
interface AuditEntry {
  id: string; timestamp: string; user: string; userRole: string;
  action: "CREATE"|"UPDATE"|"DELETE"|"LOGIN"|"REVOKE"|"GRANT";
  entity: string; entityId: string; details: string; updatedAt: string;
  result: "success"|"failure"; errorCode?: string; errorMessage?: string;
}
```

**Data** — 47 entries total:
- `AUD-0000` (failure, LOGIN, timestamp "26 พ.ค. 2569, 15:10 น.", ERR-AUTH-403) → row 1, always in default 7-day filter
- `AUD-0001` to `AUD-0046`: hardcoded success entries spanning 12–26 พ.ค. 2569
- IP resolved via `userIpMap: Record<string, string>` keyed by `user` display name (6 users → 6 IPs)
- `getStatusCode(a)`: `result === "success"` → `200`; otherwise regex `/(\d{3})$/` on `errorCode` → fallback `500`

**Action badge config**
```ts
CREATE: bg #ECFDF5 / color #059669   UPDATE: bg #EEF2FF / color #4338CA
DELETE: bg #FEF2F2 / color #DC2626   LOGIN:  bg #F9FAFB / color #6B7280
REVOKE: bg #FFF7ED / color #C2410C   GRANT:  bg #F0FDFA / color #0F766E
```

**Columns** — LOG ID (120px) → วัน-เวลา (185px, sortable) → ผู้ดำเนินการ (auto) → การกระทำ (110px, center, colored badge) → เหตุการณ์ (auto, entity chip + entityId + details text) → สถานะ (118px, green/red pill) → รหัสตอบกลับ (90px, derived) → IP Address (140px) → # (44px, Eye — ALL rows)

**Filter** — unified grid `"1fr 1fr 1fr auto auto"` (identical to LogLinkage):

| Row | Col 1 | Col 2 | Col 3 | Col 4–5 |
|---|---|---|---|---|
| Filters | ช่วงวันที่ | การกระทำ | เหตุการณ์ | สถานะ (`gridColumn:"4/6"`) |
| Separator | `gridColumn:"1/6"` | | | |
| Buttons | Search (`gridColumn:"1/4"`) | | | ค้นหา · ล้างตัวกรอง |

- Eye button hover: bg `#EEF2FF`, border `#C7D2FE` (indigo)
- ค้นหา hover: `#002470`

**Detail Modal** — `icon={<ClipboardList size={17} color="#003087" />}` `iconBg="#EEF2FF"` `size="lg"`
- subtitle: `"ประวัติการใช้งานระบบ กรมการอุตสาหกรรมทหาร"`
- Metadata grid (2-col, 8 cells + 1 span): Log ID · วัน-เวลา · ผู้ดำเนินการ · การกระทำ · รหัสตอบกลับ · Response Time · IP Address · เหตุการณ์ + รายละเอียด (span 2)
- Response Time: computed as `rtPool[idNum % 10]` where `rtPool = ["45ms","67ms","88ms","112ms","134ms","156ms","201ms","245ms","312ms","389ms"]`
- Request Body: JSON `{ action, entity, entityId, operator, role, ipAddress }` — computed, not stored
- Response Body: success → `{ status, statusCode:200, message, timestamp }` / failure → `{ status, statusCode, errorCode, message }` — computed, not stored
- Error box (failure only): `⚠ ข้อมูลข้อผิดพลาด` + `errorMessage` text only (no errorCode chip)

### หน้าหลัก (Dashboard)

**File**: `src/app/pages/Dashboard.tsx`

**Internal components** (all defined in the same file — not shared):

| Component | Purpose |
|---|---|
| `StatCard` | Single KPI tile — icon box + big number + title + sub-text. No trend props. |
| `SummaryCard` | 3-metric card (total / success / failure) + progress bar |
| `ChartTooltip` | Custom Recharts tooltip showing `fullName` + request count |
| `useWindowWidth` | `useState + useEffect + window.addEventListener("resize")` — returns current `window.innerWidth`; used instead of CSS media queries because all styles are inline |

**Responsive breakpoints**
```ts
const statCols = w >= 1200 ? "repeat(5, 1fr)" : w >= 768 ? "repeat(3, 1fr)" : "repeat(2, 1fr)";
const twoCols  = w >= 900  ? "1fr 1fr" : "1fr";
```
`statCols` drives the 5 KPI cards row; `twoCols` drives both the charts row and the summary cards row.

**Page layout** (top to bottom):
1. **Stat cards** — 5-column grid using `statCols`
2. **Two bar charts** side-by-side using `twoCols` (Recharts `BarChart` horizontal layout, `ResponsiveContainer height={260}`)
3. **Two summary cards** side-by-side using `twoCols`

**StatCard props**
```ts
{ title: string; value: string; sub: string; icon: React.ElementType; iconColor: string; iconBg: string; }
```
No `trendValue`, `trendLabel`, or `trendUp` — those props do not exist.

**5 StatCards** (in order):

| Title | Value | Icon | iconColor | iconBg |
|---|---|---|---|---|
| แอปพลิเคชันที่มีสิทธิ์ใช้งาน | 38 | `ShieldCheck` | `#7C3AED` | `#F5F3FF` |
| บริการใบอนุญาต/หนังสืออนุญาต อท. | 47 | `Layers` | `#003087` | `#EEF2FF` |
| บริการเชื่อมโยงข้อมูล (Linkage II) | 128 | `GitBranch` | `#00A8A8` | `#F0FDFA` |
| Request อท. ทั้งหมด | 312,237 | `Activity` | `#003087` | `#EEF2FF` |
| Request Linkage II ทั้งหมด | 423,287 | `BarChart2` | `#00A8A8` | `#F0FDFA` |

**Chart data constants**
```ts
ALL_OT_SERVICES  // 10 อท. services sorted desc by value — { code, label, fullName, value }
top5             // ALL_OT_SERVICES.slice(0, 5) — fed to left BarChart
BAR_COLORS       // ["#003087","#0A4DAA","#2B6CC4","#5B8FD8","#8FB5E8"] — navy gradient

LINKAGE2_SERVICES // 5 Linkage II services — { label, fullName, value } — fed to right BarChart
TEAL_COLORS      // ["#00A8A8","#00BFC0","#22D3D3","#5CE0E0","#99ECEC"] — teal gradient
```
Both charts: horizontal bar (`layout="vertical"`), each bar colored via `<Cell fill={COLORS[i]} />`, `maxBarSize={38}`, `radius={[0, 7, 7, 0]}`. A legend list below each chart shows `label · N,NNN requests`.

**SummaryCard data**
```ts
summaryOT  = { total: 12_432, success: 11_980, failure: 452 }   // อท. licenses
summaryAll = { total: 28_750, success: 27_340, failure: 1_410 }  // Linkage II
```
- Metrics displayed: Request ทั้งหมด (black) · สำเร็จ (`#059669`) · ไม่สำเร็จ (`#DC2626`)
- **No % labels** directly under the big numbers (removed) — percentages only appear as `สำเร็จ xx.x%` / `ไม่สำเร็จ xx.x%` in the small text below the progress bar
- Progress bar: bg `#FEE2E2`, fill `#059669`, width = `successPct%`
- Success color is **`#059669`** (green) — not TEAL (`#00A8A8`)

---

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

### Search Input Standard

All search inputs above tables share this exact spec — do not deviate:

```
icon: lucide Search, size 15, position absolute, left 12px, color #9CA3AF
input padding: "8px 12px 8px 36px"
input fontSize: 13px
wrapper: position relative, flex 1, minWidth 280px
```

### Filter Section Pattern

Pages with filters use a white card with a header row: `SlidersHorizontal` icon in an indigo box (`#EEF2FF`/`#4338CA`) + label "ตัวกรองข้อมูล". Select style: `height 38px`, `padding 0 12px`, `fontSize 13px`, `border 1px solid #E5E7EB`, `borderRadius 8px`. Labels above selects: `fontSize 11px`, `fontWeight 600`, `textTransform uppercase`, `letterSpacing 0.05em`.

All three log pages use a **unified single CSS grid** spanning both filter row and button row — CSS grid shares column track sizes across all rows, so สถานะ dropdown has the exact same pixel width as ค้นหา + gap + ล้างตัวกรอง.

**LogLinkage & AuditLog** — `gridTemplateColumns: "1fr 1fr 1fr auto auto"`:

| Row | Col 1 | Col 2 | Col 3 | Col 4–5 |
|---|---|---|---|---|
| Filters | ช่วงวันที่ | แอปพลิเคชัน / การกระทำ | บริการ / เหตุการณ์ | สถานะ (`gridColumn:"4/6"`) |
| Separator | `gridColumn:"1/6"` divider | | | |
| Buttons | Search (`gridColumn:"1/4"`) | | | ค้นหา · ล้างตัวกรอง |

**LogLicense** — `gridTemplateColumns: "1fr 2fr auto auto"` (ช่วงวันที่ = 1fr ≈ 1/3 width, same visual proportion):

| Row | Col 1 | Col 2 | Col 3–4 |
|---|---|---|---|
| Filters | ช่วงวันที่ | บริการ | สถานะ (`gridColumn:"3/5"`) |
| Separator | `gridColumn:"1/5"` divider | | |
| Buttons | Search (`gridColumn:"1/3"`) | | ค้นหา · ล้างตัวกรอง |

**All pages — button styles:**
- Both buttons: `height 38px`, `padding 0 20px`, `borderRadius 8px`, `inline-flex + justifyContent center`
- ค้นหา: bg `CHART_COLOR` (`#003087`), hover `#002470`, white text
- ล้างตัวกรอง: `RotateCcw` icon, bg `#F9FAFB`, border `1px solid #D1D5DB`, color `#6B7280`

### Sidebar

No submenu exists — the Sidebar active state has no arrow/chevron indicator. Menu items show Thai label + English subtitle. Collapse toggle is in the Navbar.

Icons per menu item (do not change):
- หน้าหลัก → `Home`
- แอปพลิเคชัน (Clients) → `MonitorSmartphone`
- ผู้ให้บริการ (Providers) → `Building2`
- บริการ → `Layers`
- จัดการสิทธิ์ → `ShieldCheck`
- ประวัติการเชื่อมโยง Linkage → `GitBranch`
- ประวัติการให้บริการข้อมูล อท. → `FileSearch`
- ประวัติการใช้งานระบบ → `ClipboardList`

### Data

All data is **hardcoded mock arrays** inside each page file — there is no backend API, no fetching, and no global state library. CRUD operations mutate local `useState` arrays. Provider codes follow the pattern `DOTI`, `DOPA`, `RD`, `DBD`, etc.; service IDs follow `{CODE}-{NNNN}` (e.g., `DOTI-0001`).

**LogLinkage** — 586 entries (`LNK-` prefix). See ประวัติการเชื่อมโยง Linkage section above.

**LogLicense** — 652 entries (`LIC-` prefix, 2 pinned + 650 generated). See ประวัติการให้บริการข้อมูล อท. section above. `CHART_COLOR = "#003087"` (Navy — not teal).

**AuditLog** — 47 hardcoded entries (`AUD-` prefix, AUD-0000 to AUD-0046). See ประวัติการใช้งานระบบ section above. No LCG generation — all entries hand-written.

### Vite Config

- Path alias `@` → `src/`
- `figma:asset/{filename}` imports resolve to `src/assets/{filename}`
- Raw imports supported for `.svg` and `.csv`
- Both `react()` and `tailwindcss()` plugins must remain even if Tailwind is not actively used
