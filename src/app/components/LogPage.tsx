import { useState, useRef } from "react";
import {
  Search,
  Download,
  Eye,
  Calendar,
  FileSpreadsheet,
  ImageDown,
  RotateCcw,
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
import { Breadcrumb } from "./Breadcrumb";
import { DataTable, Column } from "./DataTable";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { DatePicker } from "./ui/date-picker";

export interface LogEntry {
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

interface LogPageProps {
  title: string;
  breadcrumbLabel: string;
  chartTitle: string;
  logs: LogEntry[];
  chartColor: string;
  clientOptions: string[];
  serviceOptions: string[];
}

const THAI_MONTHS: Record<string, string> = {
  "ม.ค.": "01",
  "ก.พ.": "02",
  "มี.ค.": "03",
  "เม.ย.": "04",
  "พ.ค.": "05",
  "มิ.ย.": "06",
  "ก.ค.": "07",
  "ส.ค.": "08",
  "ก.ย.": "09",
  "ต.ค.": "10",
  "พ.ย.": "11",
  "ธ.ค.": "12",
};

function parseThaiDate(ts: string): string {
  const match = ts.match(/(\d+)\s+(\S+\.\S+)\s+(\d{4})/);
  if (!match) return "";
  const [, day, monthThai, yearBE] = match;
  const month = THAI_MONTHS[monthThai] ?? "01";
  const yearCE = parseInt(yearBE) - 543;
  return `${yearCE}-${month}-${day.padStart(2, "0")}`;
}

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  fontSize: "12px",
  fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
};

const NAVY_PALETTE = [
  "#003087",
  "#0A4DAA",
  "#2B6CC4",
  "#5B8FD8",
  "#8FB5E8",
];
const TEAL_PALETTE = [
  "#00A8A8",
  "#00BFC0",
  "#22D3D3",
  "#5CE0E0",
  "#99ECEC",
];

function buildTopServices(logs: LogEntry[]) {
  const counts: Record<
    string,
    { name: string; value: number }
  > = {};
  for (const l of logs) {
    if (!counts[l.serviceId])
      counts[l.serviceId] = { name: l.service, value: 0 };
    counts[l.serviceId].value += 1;
  }
  return Object.values(counts)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((d, i) => ({
      name: `svc-${i}`,
      label: d.name,
      value: d.value,
      fullName: d.name,
    }));
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#6B7280",
          marginBottom: "4px",
          lineHeight: 1.5,
        }}
      >
        {d.fullName}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#003087",
        }}
      >
        {d.value.toLocaleString()}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 400,
            color: "#9CA3AF",
            marginLeft: "4px",
          }}
        >
          requests
        </span>
      </div>
    </div>
  );
}

const statusColor = (code: number) => {
  if (code >= 200 && code < 300)
    return {
      bg: "#ECFDF5",
      color: "#059669",
      border: "#A7F3D0",
    };
  if (code >= 400 && code < 500)
    return {
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
    };
  return { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" };
};

export function LogPage({
  title,
  breadcrumbLabel,
  chartTitle,
  logs,
  chartColor,
  clientOptions,
  serviceOptions,
}: LogPageProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayMinus7Days = new Date();
  todayMinus7Days.setDate(todayMinus7Days.getDate() - 7);
  const todayMinus7DaysStr = todayMinus7Days
    .toISOString()
    .split("T")[0];
  // Draft state — what user is currently editing in the form
  const [dSearch, setDSearch] = useState("");
  const [dClient, setDClient] = useState("แอปพลิเคชัน ทั้งหมด");
  const [dService, setDService] = useState("บริการ ทั้งหมด");
  const [dStatus, setDStatus] = useState("สถานะ ทั้งหมด");
  const [dFrom, setDFrom] = useState(todayMinus7DaysStr);
  const [dTo, setDTo] = useState(today);

  // Applied state — drives actual filtering
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState(
    "แอปพลิเคชัน ทั้งหมด",
  );
  const [serviceFilter, setServiceFilter] =
    useState("บริการ ทั้งหมด");
  const [statusFilter, setStatusFilter] =
    useState("สถานะ ทั้งหมด");
  const [dateFrom, setDateFrom] = useState(todayMinus7DaysStr);
  const [dateTo, setDateTo] = useState(today);

  const [selectedLog, setSelectedLog] =
    useState<LogEntry | null>(null);

  const applyFilters = () => {
    setSearch(dSearch);
    setClientFilter(dClient);
    setServiceFilter(dService);
    setStatusFilter(dStatus);
    setDateFrom(dFrom);
    setDateTo(dTo);
  };

  const clearFilters = () => {
    setDSearch("");
    setDClient("แอปพลิเคชัน ทั้งหมด");
    setDService("บริการ ทั้งหมด");
    setDStatus("สถานะ ทั้งหมด");
    setDFrom("");
    setDTo("");
    setSearch("");
    setClientFilter("แอปพลิเคชัน ทั้งหมด");
    setServiceFilter("บริการ ทั้งหมด");
    setStatusFilter("สถานะ ทั้งหมด");
    setDateFrom("");
    setDateTo("");
  };

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      l.id.toLowerCase().includes(q) ||
      l.client.toLowerCase().includes(q) ||
      l.service.toLowerCase().includes(q);
    const matchC =
      clientFilter === "แอปพลิเคชัน ทั้งหมด" ||
      l.client === clientFilter;
    const matchS =
      serviceFilter === "บริการ ทั้งหมด" ||
      l.service === serviceFilter;
    const matchSt =
      statusFilter === "สถานะ ทั้งหมด"
        ? true
        : statusFilter === "สำเร็จ"
          ? l.statusCode >= 200 && l.statusCode < 300
          : l.statusCode >= 400;
    const entryDate = parseThaiDate(l.timestamp);
    const matchFrom = !dateFrom || entryDate >= dateFrom;
    const matchTo = !dateTo || entryDate <= dateTo;
    return (
      matchQ &&
      matchC &&
      matchS &&
      matchSt &&
      matchFrom &&
      matchTo
    );
  });

  const topServices = buildTopServices(filtered);
  const palette =
    chartColor === "#003087" ? NAVY_PALETTE : TEAL_PALETTE;
  const chartRef = useRef<HTMLDivElement>(null);

  const downloadChartPNG = () => {
    const container = chartRef.current;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const scale = 2;
    const padX = 24; // horizontal padding (logical px)
    const headerH = 56; // space reserved for title + subtitle (logical px)
    const footerH = 12; // bottom breathing room
    const svgW = svg.clientWidth;
    const svgH = svg.clientHeight;

    const canvas = document.createElement("canvas");
    canvas.width = (svgW + padX * 2) * scale;
    canvas.height = (headerH + svgH + footerH) * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White background + subtle border
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = scale;
    ctx.strokeRect(
      scale / 2,
      scale / 2,
      canvas.width - scale,
      canvas.height - scale,
    );

    // Title text
    ctx.fillStyle = "#111827";
    ctx.font = `bold ${13 * scale}px Inter, sans-serif`;
    ctx.fillText(
      `${chartTitle} — Top 5 บริการ`,
      padX * scale,
      24 * scale,
    );

    // Subtitle text
    ctx.fillStyle = "#9CA3AF";
    ctx.font = `${10 * scale}px Inter, sans-serif`;
    ctx.fillText(
      "เรียงตามจำนวน Request สูงสุด · อัปเดตตามตัวกรอง",
      padX * scale,
      42 * scale,
    );

    // Thin divider between header and chart
    ctx.strokeStyle = "#F3F4F6";
    ctx.lineWidth = scale;
    ctx.beginPath();
    ctx.moveTo(padX * scale, headerH * scale);
    ctx.lineTo((svgW + padX) * scale, headerH * scale);
    ctx.stroke();

    // Render the SVG chart onto the canvas below the header
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(
        img,
        padX * scale,
        headerH * scale,
        svgW * scale,
        svgH * scale,
      );
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = `${chartTitle}-top5.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };
  const successCount = filtered.filter(
    (l) => l.statusCode >= 200 && l.statusCode < 300,
  ).length;
  const errorCount = filtered.filter(
    (l) => l.statusCode >= 400,
  ).length;

  const columns: Column<LogEntry>[] = [
    {
      key: "id",
      header: "Log ID",
      width: "130px",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          {row.id}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "เวลา",
      width: "185px",
      sortable: true,
    },
    {
      key: "client",
      header: "แอปพลิเคชัน",
      render: (row) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              color: "#111827",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {row.client}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              fontFamily: "monospace",
            }}
          >
            {row.clientId}
          </div>
        </div>
      ),
    },
    {
      key: "service",
      header: "บริการ",
      sortable: true,
      render: (row) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              color: "#111827",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {row.service}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              fontFamily: "monospace",
            }}
          >
            {row.serviceId}
          </div>
        </div>
      ),
    },
    {
      key: "statusCode",
      header: "สถานะ",
      width: "75px",
      align: "center",
      render: (row) => {
        const cfg = statusColor(row.statusCode);
        return (
          <span
            style={{
              backgroundColor: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              borderRadius: "20px",
              padding: "2px 7px",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {row.statusCode}
          </span>
        );
      },
    },
    {
      key: "ipAddress",
      header: "IP",
      width: "120px",
      render: (row) => (
        <span
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#6B7280",
          }}
        >
          {row.ipAddress}
        </span>
      ),
    },
    {
      key: "detail",
      header: "",
      width: "44px",
      align: "center",
      render: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#EEF2FF";
            e.currentTarget.style.borderColor = "#C7D2FE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
          style={{
            padding: "5px",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            background: "white",
            cursor: "pointer",
            color: "#003087",
            transition:
              "background-color 0.15s, border-color 0.15s",
          }}
        >
          <Eye size={13} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              marginTop: "3px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            ค้นหา กรอง และวิเคราะห์ Log การใช้งาน
          </p>
        </div>
        <div />
      </div>

      {/* Filter section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "18px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ตัวกรองข้อมูล
        </div>
        {/* Row 1: date + dropdowns */}
        <div
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "flex-end",
            marginBottom: "10px",
          }}
        >
          {/* Date range */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flex: "0 0 auto",
              gridColumn: "span 3",
            }}
          >
            <div style={{ width: "50%" }}>
              <DatePicker
                value={dFrom}
                onChange={(e) => setDFrom(e.target.value)}
                placeholder="วันเริ่มต้น"
              />
            </div>
            <span
              style={{ fontSize: "12px", color: "#9CA3AF" }}
            >
              ถึง
            </span>
            <div style={{ width: "50%" }}>
              <DatePicker
                value={dTo}
                onChange={(e) => setDTo(e.target.value)}
                placeholder="วันสิ้นสุด"
                min={dFrom || undefined}
              />
            </div>
          </div>
          {/* Client */}
          <select
            value={dClient}
            onChange={(e) => setDClient(e.target.value)}
            style={{
              padding: "8px 10px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              outline: "none",
              backgroundColor: "white",
              cursor: "pointer",
              gridColumn: "span 3",
            }}
          >
            <option>แอปพลิเคชัน ทั้งหมด</option>
            {clientOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {/* Service */}
          <select
            value={dService}
            onChange={(e) => setDService(e.target.value)}
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "8px 10px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              outline: "none",
              backgroundColor: "white",
              cursor: "pointer",
              gridColumn: "span 5",
            }}
          >
            <option>บริการ ทั้งหมด</option>
            {serviceOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {/* Status */}
          <select
            value={dStatus}
            onChange={(e) => setDStatus(e.target.value)}
            style={{
              flex: "0 0 auto",
              padding: "8px 10px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              outline: "none",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option>สถานะ ทั้งหมด</option>
            <option>สำเร็จ</option>
            <option>ผิดพลาด</option>
          </select>
        </div>

        {/* Row 2: search text + action buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            width: "100%",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              gridColumn: "span 10",
            }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF",
              }}
            />
            <input
              value={dSearch}
              onChange={(e) => setDSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && applyFilters()
              }
              placeholder="ค้นหา Log ID, Client, บริการ..."
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={applyFilters}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#002470")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#003087")
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              backgroundColor: "#003087",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s",
            }}
          >
            <Search size={13} />
            ค้นหา
          </button>
          <button
            onClick={clearFilters}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
              e.currentTarget.style.borderColor = "#9CA3AF";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.color = "#6B7280";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#F9FAFB",
              color: "#6B7280",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            <RotateCcw size={13} />
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* Quick stats + Chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        {/* KPI cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            {
              label: "Request ทั้งหมด",
              value: filtered.length.toLocaleString(),
              color: "#003087",
              bg: "#EEF2FF",
            },
            {
              label: "สำเร็จ (2xx)",
              value: successCount.toLocaleString(),
              color: "#059669",
              bg: "#ECFDF5",
            },
            {
              label: "ผิดพลาด (4xx/5xx)",
              value: errorCount.toLocaleString(),
              color: "#DC2626",
              bg: "#FEF2F2",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "12px 16px",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: s.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "18px 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                {chartTitle} — Top 5 บริการ
              </h3>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  margin: "2px 0 0",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                เรียงตามจำนวน Request สูงสุด · อัปเดตตามตัวกรอง
              </p>
            </div>
            <button
              onClick={downloadChartPNG}
              disabled={topServices.length === 0}
              title="ดาวน์โหลดกราฟ PNG"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "7px",
                backgroundColor:
                  topServices.length === 0
                    ? "#F9FAFB"
                    : "white",
                color:
                  topServices.length === 0
                    ? "#D1D5DB"
                    : "#374151",
                fontSize: "11px",
                fontWeight: 500,
                cursor:
                  topServices.length === 0
                    ? "not-allowed"
                    : "pointer",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (topServices.length > 0)
                  (
                    e.currentTarget as HTMLButtonElement
                  ).style.borderColor = chartColor;
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLButtonElement
                ).style.borderColor = "#E5E7EB";
              }}
            >
              <ImageDown size={13} />
              ดาวน์โหลดกราฟ
            </button>
          </div>

          {topServices.length === 0 ? (
            <div
              style={{
                height: "155px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
                fontSize: "13px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              ไม่พบข้อมูล — ลองปรับตัวกรอง
            </div>
          ) : (
            <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={155}>
                <BarChart
                  data={topServices}
                  layout="vertical"
                  margin={{
                    left: 8,
                    right: 32,
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    key="grid"
                    strokeDasharray="3 3"
                    stroke="#F3F4F6"
                    horizontal={false}
                  />
                  <XAxis
                    key="x-axis"
                    type="number"
                    tick={{
                      fontSize: 10,
                      fill: "#9CA3AF",
                      fontFamily: "Inter, sans-serif",
                    }}
                    tickFormatter={(v) => v.toLocaleString()}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    key="y-axis"
                    type="category"
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "#374151",
                      fontFamily:
                        "'Noto Sans Thai', 'Inter', sans-serif",
                      fontWeight: 600,
                    }}
                    width={130}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    key="tooltip"
                    content={<ChartTooltip />}
                    cursor={{ fill: "#F9FAFB" }}
                  />
                  <Bar
                    key="bar"
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={28}
                  >
                    {topServices.map((entry, i) => (
                      <Cell
                        key={`cell-${entry.name}-${i}`}
                        fill={
                          palette[i] ??
                          palette[palette.length - 1]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Data table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            รายการ Log
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              icon={FileSpreadsheet}
              variant="secondary"
              size="sm"
            >
              Export Excel
            </Button>
            <Button
              icon={Download}
              variant="secondary"
              size="sm"
            >
              Export CSV
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
        />
      </div>

      {/* Detail modal */}
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="รายละเอียด Log"
        subtitle={selectedLog?.id}
        size="lg"
        footer={
          <Button
            variant="secondary"
            onClick={() => setSelectedLog(null)}
          >
            ปิด
          </Button>
        }
      >
        {selectedLog && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                ["Log ID", selectedLog.id],
                ["เวลา", selectedLog.timestamp],
                [
                  "Client",
                  `${selectedLog.client} (${selectedLog.clientId})`,
                ],
                [
                  "Service",
                  `${selectedLog.service} (${selectedLog.serviceId})`,
                ],
                ["Status Code", String(selectedLog.statusCode)],
                ["Response Time", selectedLog.responseTime],
                ["IP Address", selectedLog.ipAddress],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "3px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#111827",
                      fontFamily: [
                        "Status Code",
                        "Response Time",
                        "IP Address",
                        "Log ID",
                      ].includes(label)
                        ? "monospace"
                        : "'Noto Sans Thai', 'Inter', sans-serif",
                      fontWeight:
                        label === "Log ID" ? 700 : 400,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Request Body
              </div>
              <pre
                style={{
                  backgroundColor: "#1F2937",
                  color: "#E5E7EB",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  overflowX: "auto",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {selectedLog.requestBody}
              </pre>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Response Body
              </div>
              <pre
                style={{
                  backgroundColor: "#1F2937",
                  color: "#E5E7EB",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  overflowX: "auto",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {selectedLog.responseBody}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}