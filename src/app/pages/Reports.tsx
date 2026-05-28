import { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/Button";

type Tab = "linkage" | "license";

// Linkage2 data
const linkageDailyData = [
  { date: "8 พ.ค.", requests: 3120, success: 3050, error: 70 },
  { date: "9 พ.ค.", requests: 2980, success: 2910, error: 70 },
  { date: "10 พ.ค.", requests: 3540, success: 3480, error: 60 },
  { date: "11 พ.ค.", requests: 2100, success: 2060, error: 40 },
  { date: "12 พ.ค.", requests: 3820, success: 3750, error: 70 },
  { date: "13 พ.ค.", requests: 4100, success: 4020, error: 80 },
  { date: "14 พ.ค.", requests: 3280, success: 3210, error: 70 },
];

const linkageByClient = [
  { name: "ระบบสารบรรณ", requests: 5840 },
  { name: "MilLogistics", requests: 4210 },
  { name: "Intel App", requests: 3320 },
  { name: "Procurement", requests: 2760 },
  { name: "MapThai GIS", requests: 2340 },
  { name: "HR-Defence", requests: 1890 },
];

const linkageByService = [
  { name: "Linkage2 บุคลากร", value: 42, fill: "#003087" },
  { name: "ทะเบียนนายทหาร", value: 28, fill: "#00A8A8" },
  { name: "ข้อมูลบุคลากร กห.", value: 18, fill: "#7C3AED" },
  { name: "อื่นๆ", value: 12, fill: "#E5E7EB" },
];

// License data
const licenseDailyData = [
  { date: "8 พ.ค.", total: 980, gun: 720, explosive: 260 },
  { date: "9 พ.ค.", total: 870, gun: 640, explosive: 230 },
  { date: "10 พ.ค.", total: 1120, gun: 830, explosive: 290 },
  { date: "11 พ.ค.", total: 650, gun: 480, explosive: 170 },
  { date: "12 พ.ค.", total: 1340, gun: 990, explosive: 350 },
  { date: "13 พ.ค.", total: 1180, gun: 870, explosive: 310 },
  { date: "14 พ.ค.", total: 1007, gun: 740, explosive: 267 },
];

const licenseByClient = [
  { name: "DefLicense Portal", requests: 4280 },
  { name: "FinanceArmy", requests: 1840 },
  { name: "MilLogistics", requests: 890 },
  { name: "ระบบสารบรรณ", requests: 540 },
  { name: "Intel App", requests: 370 },
];

const licenseType = [
  { name: "ใบอนุญาตอาวุธปืน", value: 73, fill: "#003087" },
  { name: "ใบอนุญาตระเบิด", value: 27, fill: "#00A8A8" },
];

type SummaryItem = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
};

const linkageSummary: SummaryItem[] = [
  {
    label: "Request ทั้งหมด (7 วัน)",
    value: "22,940",
    delta: "+14.2%",
    positive: true,
  },
  {
    label: "สำเร็จ (2xx)",
    value: "22,480",
    delta: "97.9%",
    positive: true,
  },
  {
    label: "ข้อผิดพลาด",
    value: "460",
    delta: "2.1%",
    positive: false,
  },
  {
    label: "Latency เฉลี่ย",
    value: "84ms",
    delta: "-8ms",
    positive: true,
  },
];

const licenseSummary: SummaryItem[] = [
  {
    label: "การค้นหาทั้งหมด (7 วัน)",
    value: "7,147",
    delta: "+9.8%",
    positive: true,
  },
  {
    label: "พบใบอนุญาต (Found)",
    value: "6,890",
    delta: "96.4%",
    positive: true,
  },
  {
    label: "ไม่พบใบอนุญาต",
    value: "257",
    delta: "3.6%",
    positive: false,
  },
  {
    label: "เวลาค้นหาเฉลี่ย",
    value: "112ms",
    delta: "-5ms",
    positive: true,
  },
];

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  fontSize: "12px",
  fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
};

export function Reports() {
  const [tab, setTab] = useState<Tab>("linkage");
  const [period, setPeriod] = useState("7d");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const isLinkage = tab === "linkage";
  const summary = isLinkage ? linkageSummary : licenseSummary;
  const dailyData = isLinkage
    ? linkageDailyData
    : licenseDailyData;
  const clientData = isLinkage
    ? linkageByClient
    : licenseByClient;
  const pieData = isLinkage ? linkageByService : licenseType;

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
            รายงานสรุป (Reports)
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              marginTop: "4px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            วิเคราะห์และสรุปการใช้งานบริการเชื่อมโยง
          </p>
        </div>
        <Button icon={Download} variant="secondary">
          ส่งออกรายงาน
        </Button>
      </div>

      {/* Period + Date filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "3px",
            border: "1px solid #E5E7EB",
          }}
        >
          {[
            { val: "7d", label: "7 วัน" },
            { val: "30d", label: "30 วัน" },
            { val: "90d", label: "3 เดือน" },
            { val: "custom", label: "กำหนดเอง" },
          ].map((p) => (
            <button
              key={p.val}
              onClick={() => setPeriod(p.val)}
              onMouseEnter={(e) => {
                if (period !== p.val)
                  e.currentTarget.style.backgroundColor =
                    "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                if (period !== p.val)
                  e.currentTarget.style.backgroundColor =
                    "transparent";
              }}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor:
                  period === p.val ? "#003087" : "transparent",
                color: period === p.val ? "white" : "#6B7280",
                fontSize: "12px",
                fontWeight: period === p.val ? 600 : 400,
                cursor: "pointer",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                transition: "all 0.15s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {period === "custom" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Calendar size={13} color="#6B7280" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{ color: "#9CA3AF", fontSize: "12px" }}
            >
              –
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #E5E7EB",
          marginBottom: "0",
        }}
      >
        {[
          {
            key: "linkage",
            label: "รายงานการเชื่อมโยง Linkage2",
          },
          { key: "license", label: "รายงานการค้นหาใบอนุญาต" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            onMouseEnter={(e) => {
              if (tab !== t.key)
                e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              if (tab !== t.key)
                e.currentTarget.style.color = "#6B7280";
            }}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: tab === t.key ? "#003087" : "#6B7280",
              borderBottom: `2px solid ${tab === t.key ? "#003087" : "transparent"}`,
              marginBottom: "-2px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0 0 12px 12px",
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderTop: "none",
        }}
      >
        {/* Summary KPI cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {summary.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "10px",
                padding: "14px 16px",
                border: "1px solid #F3F4F6",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#6B7280",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                  marginBottom: "5px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                }}
              >
                {s.positive ? (
                  <TrendingUp size={12} color="#059669" />
                ) : (
                  <TrendingDown size={12} color="#DC2626" />
                )}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: s.positive ? "#059669" : "#DC2626",
                  }}
                >
                  {s.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily trend chart */}
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
              margin: "0 0 12px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {isLinkage
              ? "Linkage2 Request รายวัน"
              : "การค้นหาใบอนุญาตรายวัน"}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            {isLinkage ? (
              <BarChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#9CA3AF",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                />
                <Bar
                  dataKey="success"
                  fill="#003087"
                  radius={[3, 3, 0, 0]}
                  name="สำเร็จ"
                  stackId="a"
                />
                <Bar
                  dataKey="error"
                  fill="#EF4444"
                  radius={[3, 3, 0, 0]}
                  name="ผิดพลาด"
                  stackId="a"
                />
              </BarChart>
            ) : (
              <LineChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#9CA3AF",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gun"
                  stroke="#003087"
                  strokeWidth={2.5}
                  dot={false}
                  name="ใบอนุญาตอาวุธปืน"
                />
                <Line
                  type="monotone"
                  dataKey="explosive"
                  stroke="#00A8A8"
                  strokeWidth={2.5}
                  dot={false}
                  name="ใบอนุญาตระเบิด"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom row: By-client bar + Pie */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: "20px",
          }}
        >
          {/* By client */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                margin: "0 0 12px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {isLinkage
                ? "Request แยกตาม Client (7 วัน)"
                : "การค้นหาแยกตาม Client (7 วัน)"}
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={clientData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#374151",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                  width={120}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [
                    `${v.toLocaleString()}`,
                    "Request",
                  ]}
                />
                <Bar
                  dataKey="requests"
                  fill="#00A8A8"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                margin: "0 0 12px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {isLinkage
                ? "สัดส่วนตามบริการ"
                : "สัดส่วนตามประเภทใบอนุญาต"}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <PieChart width={160} height={160}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [`${v}%`, "สัดส่วน"]}
                />
              </PieChart>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "100%",
                }}
              >
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "2px",
                        backgroundColor: d.fill,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        fontSize: "11px",
                        color: "#374151",
                        fontFamily:
                          "'Noto Sans Thai', 'Inter', sans-serif",
                        lineHeight: 1.3,
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {d.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}