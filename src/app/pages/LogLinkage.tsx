import { useState, useRef } from "react";
import {
  Search,
  FileSpreadsheet,
  Eye,
  ImageDown,
  RotateCcw,
  SlidersHorizontal,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DataTable, Column } from "../components/DataTable";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { DatePicker } from "../components/ui/date-picker";

/* ── Types ──────────────────────────────────────────────────── */
interface LogEntry {
  id: string;
  timestamp: string;
  client: string;
  clientId: string;
  service: string;
  serviceId: string;
  statusCode: number;
  responseTime: string;
  ipAddress: string;
  requestBody: string;
  responseBody: string;
}

/* ── Constants ──────────────────────────────────────────────── */
const TITLE = "ประวัติการเชื่อมโยง Linkage (linkage logs)";
const SUBTITLE = "ข้อมูลประวัติการเชื่อมโยงข้อมูลกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน";
const CHART_TITLE = "Linkage Request";
const CHART_COLOR = "#003087";
const SEARCH_PLACEHOLDER = "ค้นหา Log ID, แอปพลิเคชัน, บริการ...";
const FF = "'Noto Sans Thai', 'Inter', sans-serif";

const PALETTE = ["#003087", "#0A4DAA", "#2B6CC4", "#5B8FD8", "#8FB5E8"];

/* ── Deterministic weighted picker ─────────────────────────── */
function lcg(seed: number) {
  return ((seed * 1664525 + 1013904223) >>> 0) / 0xffffffff;
}
function pick<T>(arr: T[], weights: number[], seed: number): T {
  const r = lcg(seed);
  let cum = 0;
  const total = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < arr.length; i++) {
    cum += weights[i] / total;
    if (r < cum) return arr[i];
  }
  return arr[arr.length - 1];
}

/* ── Static lists ───────────────────────────────────────────── */
const clients = [
  "ระบบสารบรรณ",
  "MilLogistics",
  "Intel App",
  "Procurement",
  "MapThai GIS",
  "HR-Defence",
];
const cids = ["CLT-001", "CLT-002", "CLT-007", "CLT-008", "CLT-005", "CLT-006"];
const clientW = [30, 22, 18, 12, 10, 8];

const services = [
  "ข้อมูลทะเบียนราษฎร",
  "ทะเบียนหนังสือรับรองนิติบุคคล",
  "ทะเบียนรายชื่อผู้ถือหุ้น",
  "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
  "ทะเบียนประวัติอาชญากรรม",
];
const sids = ["DOPA-0001", "DBD-0001", "DBD-0002", "RD-0001", "RTP-0001"];
const serviceW = [40, 25, 18, 10, 7];

const statusPool = [
  ...Array(85).fill(200),
  ...Array(8).fill(401),
  ...Array(5).fill(404),
  ...Array(2).fill(500),
];
const times = ["42ms","55ms","67ms","88ms","95ms","112ms","123ms","156ms","201ms","312ms"];
const hours = ["08","09","10","11","12","13","14","15"];
const dates = [
  "14 พ.ค. 2569","15 พ.ค. 2569","16 พ.ค. 2569","17 พ.ค. 2569",
  "18 พ.ค. 2569","19 พ.ค. 2569","20 พ.ค. 2569","21 พ.ค. 2569",
  "22 พ.ค. 2569","23 พ.ค. 2569","24 พ.ค. 2569","25 พ.ค. 2569",
  "26 พ.ค. 2569",
];

/* ── Generate logs ──────────────────────────────────────────── */
const failureSample: LogEntry = {
  id: "LNK-09999",
  timestamp: "26 พ.ค. 2569, 16:42 น.",
  client: "Intel App",
  clientId: "CLT-007",
  service: "ทะเบียนประวัติอาชญากรรม",
  serviceId: "RTP-0001",
  statusCode: 401,
  responseTime: "88ms",
  ipAddress: "10.200.16.142",
  requestBody: `{"clientId":"CLT-007","serviceId":"RTP-0001","query":{"refId":2456099}}`,
  responseBody: `{"status":"error","code":401,"message":"Unauthorized – invalid token"}`,
};

const logs: LogEntry[] = [failureSample, ...Array.from({ length: 585 }, (_, i) => {
  const ci = clients.indexOf(pick(clients, clientW, i * 3 + 1));
  const si = services.indexOf(pick(services, serviceW, i * 7 + 2));
  const code = statusPool[(lcg(i * 11 + 3) * statusPool.length) | 0];
  const time = times[(lcg(i * 13 + 5) * times.length) | 0];
  const min = String((i * 19) % 60).padStart(2, "0");
  const dateLabel = dates[Math.floor(i / 45) % dates.length];
  return {
    id: `LNK-${String(10000 + i).padStart(5, "0")}`,
    timestamp: `${dateLabel}, ${hours[i % hours.length]}:${min} น.`,
    client: clients[ci],
    clientId: cids[ci],
    service: services[si],
    serviceId: sids[si],
    statusCode: code,
    responseTime: time,
    ipAddress: `10.200.${10 + ci}.${100 + (i % 50)}`,
    requestBody: `{"clientId":"${cids[ci]}","serviceId":"${sids[si]}","query":{"refId":${2456300 + i}}}`,
    responseBody:
      code === 200
        ? `{"status":"success","data":{"id":${2456300 + i},"name":"ตัวอย่าง ${i}","service":"${services[si]}"}}`
        : `{"status":"error","code":${code},"message":"${
            code === 401 ? "Unauthorized – invalid token"
            : code === 404 ? "Record not found"
            : "Internal server error"
          }"}`,
  };
})];

/* ── Helpers ────────────────────────────────────────────────── */
const THAI_MONTHS: Record<string, string> = {
  "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
  "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
  "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12",
};
function parseThaiDate(ts: string): string {
  const match = ts.match(/(\d+)\s+(\S+\.\S+)\s+(\d{4})/);
  if (!match) return "";
  const [, day, monthThai, yearBE] = match;
  const month = THAI_MONTHS[monthThai] ?? "01";
  return `${parseInt(yearBE) - 543}-${month}-${day.padStart(2, "0")}`;
}

function buildTopServices(data: LogEntry[]) {
  const counts: Record<string, { name: string; value: number }> = {};
  for (const l of data) {
    if (!counts[l.serviceId]) counts[l.serviceId] = { name: l.service, value: 0 };
    counts[l.serviceId].value += 1;
  }
  return Object.values(counts)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((d, i) => ({ name: `svc-${i}`, label: d.name, value: d.value, fullName: d.name }));
}

const statusColor = (code: number) => {
  if (code >= 200 && code < 300) return { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" };
  if (code >= 400 && code < 500) return { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" };
  return { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" };
};

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontFamily: FF }}>
      <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px", lineHeight: 1.5 }}>{d.fullName}</div>
      <div style={{ fontSize: "15px", fontWeight: 700, color: CHART_COLOR }}>
        {d.value.toLocaleString()}
        <span style={{ fontSize: "11px", fontWeight: 400, color: "#9CA3AF", marginLeft: "4px" }}>requests</span>
      </div>
    </div>
  );
}

/* ── Page Component ─────────────────────────────────────────── */
export function LogLinkage() {
  const today = new Date().toISOString().split("T")[0];
  const minus7 = new Date();
  minus7.setDate(minus7.getDate() - 7);
  const minus7Str = minus7.toISOString().split("T")[0];

  const [dSearch, setDSearch] = useState("");
  const [dClient, setDClient] = useState("แอปพลิเคชัน ทั้งหมด");
  const [dService, setDService] = useState("บริการ ทั้งหมด");
  const [dStatus, setDStatus] = useState("สถานะ ทั้งหมด");
  const [dFrom, setDFrom] = useState(minus7Str);
  const [dTo, setDTo] = useState(today);

  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("แอปพลิเคชัน ทั้งหมด");
  const [serviceFilter, setServiceFilter] = useState("บริการ ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("สถานะ ทั้งหมด");
  const [dateFrom, setDateFrom] = useState(minus7Str);
  const [dateTo, setDateTo] = useState(today);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const applyFilters = () => {
    setSearch(dSearch); setClientFilter(dClient); setServiceFilter(dService);
    setStatusFilter(dStatus); setDateFrom(dFrom); setDateTo(dTo);
  };
  const clearFilters = () => {
    setDSearch(""); setDClient("แอปพลิเคชัน ทั้งหมด"); setDService("บริการ ทั้งหมด");
    setDStatus("สถานะ ทั้งหมด"); setDFrom(""); setDTo("");
    setSearch(""); setClientFilter("แอปพลิเคชัน ทั้งหมด"); setServiceFilter("บริการ ทั้งหมด");
    setStatusFilter("สถานะ ทั้งหมด"); setDateFrom(""); setDateTo("");
  };

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchQ = !q || l.id.toLowerCase().includes(q) || l.client.toLowerCase().includes(q) || l.service.toLowerCase().includes(q);
    const matchC = clientFilter === "แอปพลิเคชัน ทั้งหมด" || l.client === clientFilter;
    const matchS = serviceFilter === "บริการ ทั้งหมด" || l.service === serviceFilter;
    const matchSt = statusFilter === "สถานะ ทั้งหมด" ? true : statusFilter === "สำเร็จ" ? l.statusCode >= 200 && l.statusCode < 300 : l.statusCode >= 400;
    const entryDate = parseThaiDate(l.timestamp);
    return matchQ && matchC && matchS && matchSt && (!dateFrom || entryDate >= dateFrom) && (!dateTo || entryDate <= dateTo);
  });

  const topServices = buildTopServices(filtered);
  const successCount = filtered.filter((l) => l.statusCode >= 200 && l.statusCode < 300).length;
  const errorCount = filtered.filter((l) => l.statusCode >= 400).length;
  const chartRef = useRef<HTMLDivElement>(null);

  const downloadChartPNG = () => {
    const container = chartRef.current;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;
    const scale = 2, padX = 24, headerH = 56, footerH = 12;
    const svgW = svg.clientWidth, svgH = svg.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = (svgW + padX * 2) * scale;
    canvas.height = (headerH + svgH + footerH) * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = scale;
    ctx.strokeRect(scale / 2, scale / 2, canvas.width - scale, canvas.height - scale);
    ctx.fillStyle = "#111827"; ctx.font = `bold ${13 * scale}px Inter, sans-serif`;
    ctx.fillText(`${CHART_TITLE} — Top 5 บริการ`, padX * scale, 24 * scale);
    ctx.fillStyle = "#9CA3AF"; ctx.font = `${10 * scale}px Inter, sans-serif`;
    ctx.fillText("เรียงตามจำนวน Request สูงสุด · อัปเดตตามตัวกรอง", padX * scale, 42 * scale);
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padX * scale, headerH * scale, svgW * scale, svgH * scale);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `${CHART_TITLE}-top5.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  const columns: Column<LogEntry>[] = [
    {
      key: "id", header: "LOG ID", width: "130px", sortable: true,
      render: (row) => (
        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 400, color: "#374151" }}>
          {row.id}
        </span>
      ),
    },
    { key: "timestamp", header: "วัน-เวลา", width: "185px", sortable: true,
      render: (row) => (
        <span style={{ fontSize: "13px", fontWeight: 400, color: "#374151", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
          {row.timestamp}
        </span>
      ),
    },
    {
      key: "client", header: "แอปพลิเคชัน",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 400, color: "#111827", fontFamily: FF }}>{row.client}</div>
          <div style={{ fontSize: "10px", color: "#6B7280", fontFamily: "monospace" }}>{row.clientId}</div>
        </div>
      ),
    },
    {
      key: "service", header: "บริการ", sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 400, color: "#111827", fontFamily: FF }}>{row.service}</div>
          <div style={{ fontSize: "10px", color: "#6B7280", fontFamily: "monospace" }}>{row.serviceId}</div>
        </div>
      ),
    },
    {
      key: "status", header: "สถานะ", width: "118px", align: "center",
      render: (row) => {
        const ok = row.statusCode >= 200 && row.statusCode < 300;
        return (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "24px", padding: "0 9px", minWidth: "82px", borderRadius: "20px", backgroundColor: ok ? "#ECFDF5" : "#FEF2F2", color: ok ? "#059669" : "#DC2626", border: `1px solid ${ok ? "#A7F3D0" : "#FECACA"}`, fontSize: "11px", fontWeight: 600, fontFamily: FF, whiteSpace: "nowrap" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: ok ? "#059669" : "#DC2626", display: "inline-block", flexShrink: 0 }} />
            {ok ? "สำเร็จ" : "ไม่สำเร็จ"}
          </span>
        );
      },
    },
    {
      key: "statusCode", header: "รหัสตอบกลับ", width: "90px", align: "center",
      render: (row) => {
        const cfg = statusColor(row.statusCode);
        return (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: "20px", height: "24px", padding: "0 9px", fontSize: "12px", fontWeight: 700, fontFamily: "monospace" }}>
            {row.statusCode}
          </span>
        );
      },
    },
    {
      key: "ipAddress", header: "IP Address", width: "140px",
      render: (row) => (
        <span style={{ fontSize: "13px", fontWeight: 400, fontFamily: "monospace", color: "#374151" }}>
          {row.ipAddress}
        </span>
      ),
    },
    {
      key: "detail", header: "#", width: "44px", align: "center",
      render: (row) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setSelectedLog(row)}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EEF2FF"; e.currentTarget.style.borderColor = "#C7D2FE"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
            style={{ padding: "5px", border: "1px solid #E5E7EB", borderRadius: "6px", background: "white", cursor: "pointer", color: CHART_COLOR, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s, border-color 0.15s" }}
          >
            <Eye size={13} />
          </button>
        </div>
      ),
    },
  ];

  const selectStyle: React.CSSProperties = {
    width: "100%", height: "38px", padding: "0 12px", border: "1px solid #E5E7EB",
    borderRadius: "8px", fontSize: "13px", fontFamily: FF, outline: "none",
    backgroundColor: "white", cursor: "pointer", color: "#374151", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: "#4B5563",
    textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Inter, sans-serif",
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: FF }}>{TITLE}</h1>
        <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "3px", fontFamily: FF }}>{SUBTITLE}</p>
      </div>

      {/* Filter section */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "18px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SlidersHorizontal size={14} color="#4338CA" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: FF }}>ตัวกรองข้อมูล</span>
        </div>

        {/* Unified grid — columns shared across both rows so สถานะ aligns with buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", columnGap: "12px" }}>

          {/* ── Row 1: filter dropdowns ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>ช่วงวันที่</label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ flex: 1 }}><DatePicker value={dFrom} onChange={(e) => setDFrom(e.target.value)} placeholder="วันเริ่มต้น" /></div>
              <span style={{ fontSize: "12px", color: "#D1D5DB", flexShrink: 0 }}>—</span>
              <div style={{ flex: 1 }}><DatePicker value={dTo} onChange={(e) => setDTo(e.target.value)} placeholder="วันสิ้นสุด" min={dFrom || undefined} /></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>แอปพลิเคชัน</label>
            <select value={dClient} onChange={(e) => setDClient(e.target.value)} style={selectStyle}>
              <option>แอปพลิเคชัน ทั้งหมด</option>
              {clients.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>บริการ</label>
            <select value={dService} onChange={(e) => setDService(e.target.value)} style={selectStyle}>
              <option>บริการ ทั้งหมด</option>
              {services.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {/* สถานะ spans cols 4-5 → same total width as the two buttons below */}
          <div style={{ gridColumn: "4 / 6", display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>สถานะ</label>
            <select value={dStatus} onChange={(e) => setDStatus(e.target.value)} style={selectStyle}>
              <option>สถานะ ทั้งหมด</option>
              <option>สำเร็จ</option>
              <option>ไม่สำเร็จ</option>
            </select>
          </div>

          {/* ── Separator ── */}
          <div style={{ gridColumn: "1 / 6", height: "1px", backgroundColor: "#F3F4F6", marginBottom: "14px" }} />

          {/* ── Row 2: search + buttons ── */}
          {/* Search spans cols 1-3 → same total width as the three filter cells above */}
          <div style={{ gridColumn: "1 / 4", position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input value={dSearch} onChange={(e) => setDSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyFilters()} placeholder={SEARCH_PLACEHOLDER}
              style={{ width: "100%", height: "38px", padding: "0 12px 0 36px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", fontFamily: FF, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={applyFilters} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#002470")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = CHART_COLOR)}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "38px", padding: "0 20px", backgroundColor: CHART_COLOR, color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap", transition: "background-color 0.15s" }}>
            <Search size={13} />ค้นหา
          </button>
          <button onClick={clearFilters}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F3F4F6"; e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#6B7280"; }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "38px", padding: "0 20px", backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap", transition: "all 0.15s" }}>
            <RotateCcw size={13} />ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* KPI + Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "14px", marginBottom: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Request ทั้งหมด", value: filtered.length.toLocaleString(), color: CHART_COLOR, bg: "#EEF2FF" },
            { label: "สำเร็จ (2xx)", value: successCount.toLocaleString(), color: "#059669", bg: "#ECFDF5" },
            { label: "ไม่สำเร็จ (4xx/5xx)", value: errorCount.toLocaleString(), color: "#DC2626", bg: "#FEF2F2" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: "white", borderRadius: "10px", padding: "12px 16px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", color: "#6B7280", fontFamily: FF }}>{s.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "18px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: FF }}>{CHART_TITLE} — Top 5 บริการ</h3>
              <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: FF }}>เรียงตามจำนวน Request สูงสุด · อัปเดตตามตัวกรอง</p>
            </div>
            <button onClick={downloadChartPNG} disabled={topServices.length === 0} title="ดาวน์โหลดกราฟ PNG"
              onMouseEnter={(e) => { if (topServices.length > 0) (e.currentTarget as HTMLButtonElement).style.borderColor = CHART_COLOR; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: "7px", backgroundColor: topServices.length === 0 ? "#F9FAFB" : "white", color: topServices.length === 0 ? "#D1D5DB" : "#374151", fontSize: "11px", fontWeight: 500, cursor: topServices.length === 0 ? "not-allowed" : "pointer", fontFamily: FF, transition: "all 0.15s" }}>
              <ImageDown size={13} />ดาวน์โหลดกราฟ
            </button>
          </div>
          {topServices.length === 0 ? (
            <div style={{ height: "155px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "13px", fontFamily: FF }}>ไม่พบข้อมูล — ลองปรับตัวกรอง</div>
          ) : (
            <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={155}>
                <BarChart data={topServices} layout="vertical" margin={{ left: 8, right: 32, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" }} tickFormatter={(v) => v.toLocaleString()} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: "#374151", fontFamily: FF, fontWeight: 600 }} width={130} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F9FAFB" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {topServices.map((entry, i) => <Cell key={`cell-${entry.name}-${i}`} fill={PALETTE[i] ?? PALETTE[PALETTE.length - 1]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: FF }}>รายการข้อมูล Log</div>
          <Button icon={FileSpreadsheet} variant="success" size="sm">Export Excel</Button>
        </div>
        <DataTable columns={columns} data={filtered} keyField="id" />
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedLog} onClose={() => setSelectedLog(null)} title="รายละเอียด Log" subtitle="การเชื่อมโยงข้อมูลกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน" size="lg"
        icon={<GitBranch size={17} color={CHART_COLOR} />} iconBg="#EEF2FF"
        footer={<Button variant="secondary" onClick={() => setSelectedLog(null)}>ปิด</Button>}>
        {selectedLog && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {([
                ["Log ID", selectedLog.id],
                ["วัน-เวลา", selectedLog.timestamp],
                ["แอปพลิเคชัน", `${selectedLog.client} (${selectedLog.clientId})`],
                ["บริการ", `${selectedLog.service} (${selectedLog.serviceId})`],
                ["รหัสตอบกลับ", String(selectedLog.statusCode)],
                ["Response Time", selectedLog.responseTime],
                ["IP Address", selectedLog.ipAddress],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: "13px", color: "#111827", fontFamily: ["Status Code","Response Time","IP Address","Log ID"].includes(label) ? "monospace" : FF, fontWeight: label === "" ? 700 : 400 }}>{value}</div>
                </div>
              ))}
            </div>
            {selectedLog.statusCode >= 400 && (() => {
              let errMsg = "—";
              try { errMsg = JSON.parse(selectedLog.responseBody).message ?? "—"; } catch {}
              return (
                <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#DC2626", fontFamily: "Inter, sans-serif" }}>
                    <AlertTriangle size={14} />ข้อมูลข้อผิดพลาด
                  </div>
                  <div style={{ fontSize: "13px", color: "#7F1D1D", fontFamily: FF, lineHeight: 1.6 }}>{errMsg}</div>
                </div>
              );
            })()}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Request Body</div>
              <pre style={{ backgroundColor: "#1F2937", color: "#E5E7EB", borderRadius: "8px", padding: "12px", fontSize: "11px", fontFamily: "monospace", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{selectedLog.requestBody}</pre>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Response Body</div>
              <pre style={{ backgroundColor: "#1F2937", color: "#E5E7EB", borderRadius: "8px", padding: "12px", fontSize: "11px", fontFamily: "monospace", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{selectedLog.responseBody}</pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
