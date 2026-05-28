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
| `Modal` | Centered overlay with `title`, `subtitle?`, `icon?`, `iconBg?`, `size` (`sm`/`md`/`lg`/`xl`), `footer` slot |
| `ConfirmDialog` | Standalone confirm overlay (not wrapping Modal) with `variant`, `title`, `message`, `confirmLabel`, `cancelLabel`, `loading` |
| `Button` | `variant`: `primary`/`secondary`/`danger`/`teal`; optional `icon` prop (Lucide component) prepends icon |
| `ToggleSwitch` | Active/inactive toggle; `checked`, `onChange(val?)`, optional `disabled` |
| `StatusBadge` | Pill badge for active/inactive states |
| `LogPage` | Reusable log viewer — **NOT used by any page** (all log pages are self-contained). Reserved for future use. |

`Breadcrumb` exists at `src/app/components/Breadcrumb.tsx` but is not rendered anywhere.

`src/app/components/ui/` — full shadcn/ui library (Radix UI + Tailwind). Available but most pages use inline styles.

### ConfirmDialog Variants

`ConfirmDialog` has its own fixed overlay (not wrapping `Modal`). Icon: single circle `56px`, icon `28px` inside — **no outer ring**.

```ts
type ConfirmVariant = "danger" | "warning" | "info" | "success"
```

| Variant | Icon | iconBg | iconColor | confirmVariant (Button) |
|---|---|---|---|---|
| `danger` | `Trash2` | `#FEF2F2` | `#DC2626` | `danger` (red) |
| `warning` | `AlertTriangle` | `#FFFBEB` | `#D97706` | `primary` (navy) |
| `info` | `Info` | `#EEF2FF` | `#4338CA` | `primary` (navy) |
| `success` | `CheckCircle` | `#F0FDF4` | `#16A34A` | `primary` (navy) |

**Save pattern** (add/edit in Providers & Services) — always `variant="success"`, `confirmLabel="ยืนยัน"`.  
**Delete pattern** — always `variant="danger"` (default), confirmLabel "ลบ…".  
**Toggle pattern** (Services) — `variant="warning"` (disable) / `"success"` (enable).

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

**Chart download** — `downloadChartPNG(ref, title, filename, legend?)`:
- `chartRef1` / `chartRef2` — `useRef<HTMLDivElement>` wrapping each `<ResponsiveContainer>`
- `legend?: Array<{ label, value, color }>` — optional; draws divider + colored 7×7 square + bold label + gray "N,NNN requests" below chart
- Canvas: scale `sc=2`, `padX=24`, `headerH=56`; header text = title (bold 13px) + subtitle "ข้อมูลรวมทั้งหมด · เรียงจากสูงสุด" (gray 10px)
- Chart 1 button hover: `borderColor = NAVY`; Chart 2 button hover: `borderColor = TEAL`
- Filenames: `"OT-License-Top5.png"` / `"Linkage2-Top5.png"`

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

### แอปพลิเคชัน (Clients)

**File**: `src/app/pages/Clients.tsx` — **read-only** (no add/edit/delete).

**Data** — 15 hardcoded mock clients (`CLT-001` … `CLT-015`); no CRUD mutations.

**Page structure** (top to bottom):
1. Blue info banner — `Info` icon + "ข้อมูลแอปพลิเคชัน ดึงมาจากระบบ SSO Management โดยอัตโนมัติ — ไม่สามารถเพิ่ม แก้ไข หรือลบได้จากระบบนี้"
2. Filter chips row — `ทั้งหมด` / `เปิดใช้งาน` / `ปิดใช้งาน` with live count badge; active chip highlights with matching color
3. White card — search input (`width: "75%"`) + `DataTable`

**Columns** — Client ID (110px, monospace, `fontWeight 400`) → แอปพลิเคชัน (auto, `fontWeight 400`) → หน่วยงาน (auto, `fontWeight 400`) → สถานะ (120px, center, `StatusBadge`) → วันที่ลงทะเบียน (150px, sortable, `fontWeight 400`)

**Font weight rule**: all `<td>` data `fontWeight: 400` — no bold text in this table (no clickable elements in rows).

---

### ผู้ให้บริการ (Providers)

**File**: `src/app/pages/Providers.tsx` — full CRUD (add / edit / delete).

**Data** — 12 mock providers (`PRV-001` … `PRV-012`): DOTI, DOPA, RD, DBD, DIW, DPIM, IEAT, DOL, DMF, RTP, LED, DL. Each provider has a `mockServices` array (25 services total) used for the service-list modal.

**Columns** — Provider ID (120px, monospace, sortable, `fontWeight 400`) → หน่วยงาน (auto) → จำนวนบริการ (150px, center) → อัปเดตล่าสุด (200px) → จัดการ (90px, center)

**Font weight rule**: all static data `fontWeight: 400`. Exceptions that stay bold:
- Code badge (navy 38×38 box inside หน่วยงาน column): `fontWeight 700` — visual identifier, not text data
- "N บริการ" pill button: `fontWeight 700` — clickable, opens service list

**หน่วยงาน column** — navy badge (38×38, `#003087`, monospace, `fontWeight 700`) + name text (`fontWeight 400`) + description sub-text (`fontSize 11px`, `#6B7280`)

**อัปเดตล่าสุด column** — date/time derived from `row.updatedAt` (year replaced 2568→2569) + time from `T[]` pool; sub-text "โดย {row.updatedBy}" — both `fontWeight 400`

**จำนวนบริการ button** — indigo pill (`#EEF2FF` / `#4338CA`), hover `#C7D2FE`; opens service-list Modal (`size="md"`) showing all services of that provider

**Add/Edit Modal** (`showModal`)
- `icon={<Building2 size={17} color="#003087" />}` `iconBg="#EEF2FF"`
- `title`: "เพิ่มข้อมูลผู้ให้บริการ" / "แก้ไขข้อมูลผู้ให้บริการ"
- `subtitle`: "เพิ่มหน่วยงานผู้ให้บริการข้อมูลใหม่เข้าสู่ระบบ" (add) / `` `Provider ID: ${editPrv.id}` `` (edit)
- Form fields: Code (monospace, `fontWeight 400`, maxLength 6, toUpperCase) + ชื่อหน่วยงาน + อีเมลผู้ดูแล + คำอธิบาย
- Footer: ยกเลิก (secondary) · บันทึก (`icon={Save}`, onClick → `setShowSaveConfirm(true)`)

**Save ConfirmDialog** (`showSaveConfirm`) — `variant="success"` (CheckCircle, green icon, navy primary button):
- Add: `title="ยืนยันการเพิ่มข้อมูล"` · `message="คุณต้องการเพิ่มข้อมูลหรือไม่?"`
- Edit: `title="ยืนยันการแก้ไขข้อมูล"` · `message="คุณต้องการแก้ไขข้อมูลหรือไม่?"`
- `confirmLabel="ยืนยัน"` · onConfirm: `setShowSaveConfirm(false); setShowModal(false)`

**Delete** — `ConfirmDialog` `variant="danger"`; removes provider from local `useState` array.

---

### บริการ (Services)

**File**: `src/app/pages/Services.tsx` — full CRUD (add / edit / delete / toggle active).

**Data** — 25 mock services across 12 providers: DOTI×10, DOPA×4, RD×1, DBD×3, DIW×1, DPIM×1, IEAT×1, DOL×1, DMF×2, RTP×1, LED×1, DL×1. Service IDs follow `{CODE}-{NNNN}` pattern.

**Interface**
```ts
interface Service {
  id: string; name: string; provider: string; providerCode: string;
  updatedAt: string; updatedBy: string; seq: number;
  isActive: boolean; description: string;
}
```

**Columns** — Service ID (130px, monospace, sortable, `fontWeight 400`) → บริการ (auto, name `fontWeight 400` + description sub-text `fontSize 11px #6B7280`) → หน่วยงาน (auto, dark badge `#1F2937` providerCode `fontWeight 700` + provider text `fontWeight 400`) → อัปเดตล่าสุด (200px, date `fontWeight 400` + "โดย {updatedBy}" sub-text) → สถานะ (160px, center, `ToggleSwitch` + label text) → จัดการ (90px, center, Edit + Delete icon buttons)

**Font weight rule**: all data `fontWeight: 400`. Exception: providerCode dark badge stays `fontWeight 700` — visual identifier.

**หน่วยงาน column** — dark badge (`#1F2937`, `padding "2px 7px"`, `fontSize 9px`, monospace, `fontWeight 700`) + provider name span (`fontWeight 400`)

**อัปเดตล่าสุด column** — date string with year replaced 2568→2569 + time from `T[]` pool; sub-text "โดย {row.updatedBy}" — both `fontWeight 400`

**Filter chips** — same pattern as Providers/Clients: ทั้งหมด (navy) / เปิดใช้งาน (green) / ปิดใช้งาน (gray) with live count badge

**Search + Provider filter** — `flex` row: search input (`flex: 1`, `minWidth 280px`) + Provider `<select>` dropdown (`height 38px`); `providerFilter` initialized from `useSearchParams().get("provider") ?? "all"`

**Add/Edit Modal** (`showModal`)
- `icon={<Layers size={17} color="#003087" />}` `iconBg="#EEF2FF"`
- `title`: "เพิ่มบริการใหม่" / "แก้ไขข้อมูลบริการ"
- `subtitle`: `"Service ID จะถูกสร้างอัตโนมัติจาก Provider Code"` (add) / `` `Service ID: ${editSvc.id}` `` (edit)
- Form fields (add only: Provider select) + ชื่อบริการ + คำอธิบาย — **no Service ID preview box**
- Footer: ยกเลิก (secondary) · บันทึก (`icon={Save}`, onClick → `setShowSaveConfirm(true)`)

**Save ConfirmDialog** (`showSaveConfirm`) — same pattern as Providers:
- Add: `title="ยืนยันการเพิ่มข้อมูล"` · `message="คุณต้องการเพิ่มข้อมูลหรือไม่?"`
- Edit: `title="ยืนยันการแก้ไขข้อมูล"` · `message="คุณต้องการแก้ไขข้อมูลหรือไม่?"`
- `variant="success"` · `confirmLabel="ยืนยัน"` · onConfirm: `setShowSaveConfirm(false); setShowModal(false)`

**Toggle ConfirmDialog** (`toggleConfirm`) — `variant="warning"` (disable) / `"success"` (enable); confirmLabel "ปิดบริการ" / "เปิดบริการ"

**Delete ConfirmDialog** (`confirm`) — `variant="danger"` (default); confirmLabel "ลบบริการ"

---

### จัดการสิทธิ์ (Permissions)

**File**: `src/app/pages/Permissions.tsx` — full CRUD for client-to-service access grants.

**Types**
```ts
type ModalMode = "create" | "edit" | "view"

interface ClientPerm {
  clientId: string; clientName: string; department: string;
  updatedAt: string; updatedBy: string;
  grants: { serviceId: string; isPermanent: boolean; expireDate: string; }[];
}

interface ModalServiceRow {
  serviceId: string; serviceName: string; provider: string;
  checked: boolean; isPermanent: boolean; expireDate: string;
}
```

**Data** — `initClients`: 8 hardcoded `ClientPerm` entries (`CLT-001`…`CLT-008`). `ALL_SERVICES`: 22 services (same as Services page subset). `CLIENT_OPTIONS`: 8 client options for dropdown.

**Main table columns** — Client ID (110px, navy indigo pill `#EEF2FF/#003087`, monospace, `fontWeight 700`) → แอปพลิเคชัน (auto, name + department sub-text) → จำนวนบริการ (180px, center, indigo pill button opens view modal) → อัปเดตล่าสุด (200px, date + "โดย" sub-text) → จัดการ (120px, Edit + Delete icon buttons)

**Search** — `maxWidth: "380px"` (not 75% — this page predates the standard)

**PermissionModal** (inline component, not using shared `Modal`):
- Size: `maxWidth: 820px`, `maxHeight: 90vh`, scrollable body
- Header icon: `ShieldCheck` (edit/create, navy `#EEF2FF`) or `Eye` (view, purple `#F5F3FF` / `#7C3AED`)
- Mode badge: Create=green `#ECFDF5/#059669` · Edit=yellow `#FEF3C7/#D97706` · View=gray `#F3F4F6/#6B7280`
- Body: Client `<select>` (disabled in edit/view) + service grid table
- Service grid columns: เลือก (44px checkbox) · ชื่อบริการ/Service ID (1fr) · Provider (140px) · ถาวร (80px, `ToggleSwitch`) · วันที่หมดอายุ (150px, `DatePicker` from shadcn/ui) · delete (90px, view mode hidden)
- `gridTemplateColumns`: `"44px 1fr 140px 80px 150px 90px"` (edit/create) / `"44px 1fr 140px 80px 150px"` (view)
- Unchecked rows: `opacity: 0.45` in view mode
- Footer: ยกเลิก/ปิด + บันทึก (`Save` icon, navy); บันทึก disabled if create mode and no client selected (bg `#CBD5E1`)
- No ConfirmDialog on save — saves immediately via `onSave(clientId, rows)` + `onClose()`

**Delete** — `ConfirmDialog` `variant="danger"`, `confirmLabel="ลบสิทธิ์ทั้งหมด"`

**`buildModalRows(grants)`** — merges `ALL_SERVICES` with grants map; returns all 22 services with `checked/isPermanent/expireDate` filled from grants.

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
