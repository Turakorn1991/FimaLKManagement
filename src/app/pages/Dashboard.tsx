import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Layers,
  GitBranch,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart2,
  ImageDown,
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

const NAVY = "#003087";
const TEAL = "#00A8A8";
const FF = "'Noto Sans Thai', 'Inter', sans-serif";

/* ─── Data ──────────────────────────────────────────────────── */

// All 10 อท. services with mock request counts (7-day total)
// Top 5 will be sliced from this sorted list
const ALL_OT_SERVICES = [
  {
    code: "ยภ.2",
    label: "แบบ ยภ.2",
    fullName:
      "บริการข้อมูลใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (แบบ ยภ.2) ที่ยังไม่หมดอายุ",
    value: 3842,
  },
  {
    code: "ยภ.3",
    label: "แบบ ยภ.3",
    fullName:
      "บริการข้อมูลใบอนุญาตนำเข้ามาซึ่งยุทธภัณฑ์ (แบบ ยภ.3)",
    value: 2960,
  },
  {
    code: "ยภ.5",
    label: "แบบ ยภ.5",
    fullName: "บริการข้อมูลใบอนุญาตมีซึ่งยุทธภัณฑ์ (แบบ ยภ.5)",
    value: 2340,
  },
  {
    code: "อ.8",
    label: "แบบ อ.8",
    fullName:
      "ข้อมูลหนังสืออนุญาตให้สั่งหรือนำเข้ามาในราชอาณาจักรซึ่งวัตถุหรืออาวุธ เพื่อใช้ในการผลิตอาวุธ ฯ ที่ยังไม่หมดอายุ (แบบ อ.8)",
    value: 1870,
  },
  {
    code: "อ.17",
    label: "แบบ อ.17",
    fullName:
      "ข้อมูลหนังสืออนุญาตให้ขาย หรือจำหน่ายอาวุธให้แก่บุคคลอื่น นอกจากหน่วยงานตามมาตรา 7 ในราชอาณาจักร ที่ยังไม่หมดอายุ (แบบ อ.17)",
    value: 1420,
  },
  {
    code: "ยภ.4",
    label: "แบบ ยภ.4",
    fullName:
      "บริการข้อมูลใบอนุญาตผลิตซึ่งยุทธภัณฑ์ (แบบ ยภ.4) ที่ยังไม่หมดอายุ",
    value: 1180,
  },
  {
    code: "ส่งออก",
    label: "หนังสือส่งออก",
    fullName: "บริการข้อมูลหนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์",
    value: 980,
  },
  {
    code: "ผ่านแดน",
    label: "หนังสือผ่านแดน",
    fullName: "บริการข้อมูลหนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์",
    value: 740,
  },
  {
    code: "อ.10",
    label: "แบบ อ.10",
    fullName:
      "ข้อมูลหนังสืออนุญาตให้ขนย้ายวัตถุหรืออาวุธที่ใช้ในการผลิตอาวุธ หรืออาวุธที่ผลิตขึ้นออกจากโรงงานหรือสถานที่เก็บที่ยังไม่หมดอายุ (แบบ อ.10)",
    value: 560,
  },
  {
    code: "อ.16",
    label: "แบบ อ.16",
    fullName:
      "ข้อมูลหนังสืออนุญาตให้ขาย หรือจำหน่ายอาวุธให้แก่บุคคลอื่นนอกจากหน่วยงานตามมาตรา 7 โดยการส่งออกไปนอกราชอาณาจักร ที่ยังไม่หมดอายุ (แบบ อ.16)",
    value: 390,
  },
];

// Top 5 (already sorted desc)
const top5 = ALL_OT_SERVICES.slice(0, 5);

// Bar colors: navy → lighter gradient
const BAR_COLORS = [
  "#003087",
  "#0A4DAA",
  "#2B6CC4",
  "#5B8FD8",
  "#8FB5E8",
];

// Linkage2 services (Top 5 by request volume)
const LINKAGE2_SERVICES = [
  {
    label: "ทะเบียนราษฎร",
    fullName: "ข้อมูลทะเบียนราษฎร (DOPA-0001) — กรมการปกครอง",
    value: 5840,
  },
  {
    label: "ทะเบียนนิติบุคคล",
    fullName:
      "ทะเบียนหนังสือรับรองนิติบุคคล (DBD-0001) — กรมพัฒนาธุรกิจการค้า",
    value: 4210,
  },
  {
    label: "ทะเบียนรายชื่อผู้ถือหุ้น",
    fullName:
      "ทะเบียนรายชื่อผู้ถือหุ้น (DBD-0002) — กรมพัฒนาธุรกิจการค้า",
    value: 3320,
  },
  {
    label: "ภาษีมูลค่าเพิ่ม ภพ.20",
    fullName:
      "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20 (RD-0001) — กรมสรรพากร",
    value: 2760,
  },
  {
    label: "ประวัติอาชญากรรม",
    fullName:
      "ทะเบียนประวัติอาชญากรรม (RTP-0001) — สำนักงานตำรวจแห่งชาติ",
    value: 1890,
  },
];
const TEAL_COLORS = [
  "#00A8A8",
  "#00BFC0",
  "#22D3D3",
  "#5CE0E0",
  "#99ECEC",
];

// Summary data
const summaryOT = {
  total: 12_432,
  success: 11_980,
  failure: 452,
};
const summaryAll = {
  total: 28_750,
  success: 27_340,
  failure: 1_410,
};

/* ─── Custom Tooltip ────────────────────────────────────────── */
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
        maxWidth: "300px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: FF,
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
          fontSize: "16px",
          fontWeight: 700,
          color: NAVY,
        }}
      >
        {d.value.toLocaleString()}
        <span
          style={{
            fontSize: "12px",
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

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "14px",
        padding: "22px 24px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "11px",
          backgroundColor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={iconColor} />
      </div>
      <div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            marginTop: "6px",
            fontFamily: FF,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            marginTop: "2px",
            fontFamily: FF,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

/* ─── Summary Card ──────────────────────────────────────────── */
function SummaryCard({
  title,
  subtitle,
  total,
  success,
  failure,
}: {
  title: string;
  subtitle: string;
  total: number;
  success: number;
  failure: number;
}) {
  const successPct = ((success / total) * 100).toFixed(1);
  const failPct = ((failure / total) * 100).toFixed(1);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "14px",
        padding: "24px 28px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
        flex: 1,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "3px",
          }}
        >
          <BarChart2 size={16} color={NAVY} />
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              fontFamily: FF,
            }}
          >
            {title}
          </h3>
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "#9CA3AF",
            margin: 0,
            fontFamily: FF,
            paddingLeft: "24px",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#F3F4F6",
          marginBottom: "20px",
        }}
      />

      {/* 3 metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Total */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontFamily: FF,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Request ทั้งหมด
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {total.toLocaleString()}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "60px",
            backgroundColor: "#E5E7EB",
            margin: "0 4px",
          }}
        />

        {/* Success */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              fontSize: "11px",
              color: "#059669",
              fontFamily: FF,
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} />
            สำเร็จ
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#059669",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {success.toLocaleString()}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "60px",
            backgroundColor: "#E5E7EB",
            margin: "0 4px",
          }}
        />

        {/* Failure */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              fontSize: "11px",
              color: "#DC2626",
              fontFamily: FF,
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            <XCircle size={13} />
            ไม่สำเร็จ
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#DC2626",
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {failure.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: "20px",
          height: "6px",
          borderRadius: "3px",
          backgroundColor: "#FEE2E2",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${successPct}%`,
            backgroundColor: "#059669",
            borderRadius: "3px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "5px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "#059669",
            fontFamily: FF,
          }}
        >
          สำเร็จ {successPct}%
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "#DC2626",
            fontFamily: FF,
          }}
        >
          ไม่สำเร็จ {failPct}%
        </span>
      </div>
    </div>
  );
}

/* ─── Responsive hook ───────────────────────────────────────── */
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export function Dashboard() {
  const w = useWindowWidth();
  const statCols  = w >= 1200 ? "repeat(5, 1fr)" : w >= 768 ? "repeat(3, 1fr)" : "repeat(2, 1fr)";
  const twoCols   = w >= 900  ? "1fr 1fr" : "1fr";

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  const downloadChartPNG = (
    ref: React.RefObject<HTMLDivElement>,
    title: string,
    filename: string,
    legend?: Array<{ label: string; value: number; color: string }>,
  ) => {
    const container = ref.current;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    const sc = 2;
    const padX = 24;
    const headerH = 56;
    const itemH = 20;
    const legendPad = 14;
    const footerH = 12;

    const svgW = svg.clientWidth;
    const svgH = svg.clientHeight;
    const legendH = legend && legend.length > 0
      ? 1 + legendPad + legend.length * itemH + legendPad
      : 0;

    const canvas = document.createElement("canvas");
    canvas.width  = (svgW + padX * 2) * sc;
    canvas.height = (headerH + svgH + legendH + footerH) * sc;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background & border
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = sc;
    ctx.strokeRect(sc / 2, sc / 2, canvas.width - sc, canvas.height - sc);

    // Header
    ctx.fillStyle = "#111827";
    ctx.font = `bold ${13 * sc}px Inter, sans-serif`;
    ctx.fillText(title, padX * sc, 24 * sc);
    ctx.fillStyle = "#9CA3AF";
    ctx.font = `${10 * sc}px Inter, sans-serif`;
    ctx.fillText("ข้อมูลรวมทั้งหมด · เรียงจากสูงสุด", padX * sc, 42 * sc);

    // Draw SVG chart
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padX * sc, headerH * sc, svgW * sc, svgH * sc);
      URL.revokeObjectURL(url);

      // Legend
      if (legend && legend.length > 0) {
        const legendY0 = headerH + svgH;

        // Divider line
        ctx.strokeStyle = "#F3F4F6";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX * sc, legendY0 * sc);
        ctx.lineTo((svgW + padX) * sc, legendY0 * sc);
        ctx.stroke();

        legend.forEach((item, i) => {
          const midY = legendY0 + 1 + legendPad + i * itemH + itemH / 2;

          // Colored square
          ctx.fillStyle = item.color;
          ctx.fillRect(padX * sc, (midY - 3.5) * sc, 7 * sc, 7 * sc);

          // Label (bold)
          ctx.fillStyle = "#374151";
          ctx.font = `600 ${10 * sc}px Inter, sans-serif`;
          const labelText = item.label;
          ctx.fillText(labelText, (padX + 13) * sc, (midY + 3.5) * sc);

          // " · N,NNN requests" (gray)
          const labelW = ctx.measureText(labelText).width;
          ctx.fillStyle = "#9CA3AF";
          ctx.font = `${10 * sc}px Inter, sans-serif`;
          ctx.fillText(` · ${item.value.toLocaleString()} requests`, (padX + 13) * sc + labelW, (midY + 3.5) * sc);
        });
      }

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  return (
    <div style={{ fontFamily: FF }}>
      {/* Page title */}
      <div style={{ marginBottom: "22px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            fontFamily: FF,
          }}
        >
          หน้าหลัก (Dashboard)
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            marginTop: "3px",
            fontFamily: FF,
          }}
        >
          ข้อมูลสรุปภาพรวมและสถิติการให้บริการข้อมูลและการเชื่อมโยงข้อมูลกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน
        </p>
      </div>

      {/* Row 1 – stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: statCols,
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          title="แอปพลิเคชันที่มีสิทธิ์ใช้งาน"
          value="38"
          sub="มีสิทธิ์ใช้งานอย่างน้อย 1 บริการ"
          icon={ShieldCheck}
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
        />
        <StatCard
          title="บริการใบอนุญาต/หนังสืออนุญาต อท."
          value="47"
          sub="บริการทั้งหมดของ กรมการอุตสาหกรรมทหาร"
          icon={Layers}
          iconColor={NAVY}
          iconBg="#EEF2FF"
        />
        <StatCard
          title="บริการเชื่อมโยงข้อมูล (Linkage II)"
          value="128"
          sub="บริการเชื่อมโยงทั้งหมดที่เปิดใช้ในระบบ"
          icon={GitBranch}
          iconColor={TEAL}
          iconBg="#F0FDFA"
        />
        <StatCard
          title="Request อท. ทั้งหมด"
          value="312,237"
          sub="รวมทุกบริการใบอนุญาต/หนังสืออนุญาต ของ อท."
          icon={Activity}
          iconColor={NAVY}
          iconBg="#EEF2FF"
        />
        <StatCard
          title="Request Linkage II ทั้งหมด"
          value="423,287"
          sub="รวมทุกบริการเชื่อมโยงข้อมูล (Linkage II)"
          icon={BarChart2}
          iconColor={TEAL}
          iconBg="#F0FDFA"
        />
      </div>

      {/* Middle – Two charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: twoCols,
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Left: Top 5 Services ของ อท. */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "22px 24px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                    fontFamily: FF,
                  }}
                >
                  Top 5 บริการใบอนุญาต/หนังสืออนุญาต ของ อท.
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    margin: "3px 0 0",
                    fontFamily: FF,
                  }}
                >
                  ข้อมูลรวมทั้งหมด · เรียงจากสูงสุด
                </p>
              </div>
              <button
                onClick={() => downloadChartPNG(chartRef1, "Top 5 บริการใบอนุญาต/หนังสืออนุญาต ของ อท.", "OT-License-Top5.png", top5.map((svc, i) => ({ label: svc.label, value: svc.value, color: BAR_COLORS[i] })))}
                title="ดาวน์โหลดกราฟ PNG"
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = NAVY; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: "7px",
                  backgroundColor: "white", color: "#374151", fontSize: "11px",
                  fontWeight: 500, cursor: "pointer", fontFamily: FF,
                  transition: "all 0.15s", flexShrink: 0,
                }}
              >
                <ImageDown size={13} />ดาวน์โหลดกราฟ
              </button>
            </div>
          </div>

          <div ref={chartRef1}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={top5}
              layout="vertical"
              margin={{ left: 8, right: 36, top: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                horizontal={false}
              />
              <XAxis
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
                type="category"
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "#374151",
                  fontFamily: FF,
                  fontWeight: 600,
                }}
                width={80}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "#F9FAFB" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 7, 7, 0]}
                maxBarSize={38}
              >
                {top5.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div
            style={{
              borderTop: "1px solid #F3F4F6",
              paddingTop: "12px",
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {top5.map((svc, i) => (
              <div
                key={svc.code}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: BAR_COLORS[i],
                    flexShrink: 0,
                    marginTop: "3px",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    fontFamily: FF,
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#374151" }}>
                    {svc.label}
                  </strong>
                  {" · "}
                  {svc.value.toLocaleString()} requests
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top 5 Linkage2 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "22px 24px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                    fontFamily: FF,
                  }}
                >
                  Top 5 บริการเชื่อมโยงข้อมูล (Linkage II)
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    margin: "3px 0 0",
                    fontFamily: FF,
                  }}
                >
                  ข้อมูลรวมทั้งหมด · เรียงจากสูงสุด
                </p>
              </div>
              <button
                onClick={() => downloadChartPNG(chartRef2, "Top 5 บริการเชื่อมโยงข้อมูล (Linkage II)", "Linkage2-Top5.png", LINKAGE2_SERVICES.map((svc, i) => ({ label: svc.label, value: svc.value, color: TEAL_COLORS[i] })))}
                title="ดาวน์โหลดกราฟ PNG"
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = TEAL; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: "7px",
                  backgroundColor: "white", color: "#374151", fontSize: "11px",
                  fontWeight: 500, cursor: "pointer", fontFamily: FF,
                  transition: "all 0.15s", flexShrink: 0,
                }}
              >
                <ImageDown size={13} />ดาวน์โหลดกราฟ
              </button>
            </div>
          </div>

          <div ref={chartRef2}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={LINKAGE2_SERVICES}
              layout="vertical"
              margin={{ left: 8, right: 36, top: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                horizontal={false}
              />
              <XAxis
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
                type="category"
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "#374151",
                  fontFamily: FF,
                  fontWeight: 600,
                }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "#F9FAFB" }}
              />
              <Bar
                dataKey="value"
                radius={[0, 7, 7, 0]}
                maxBarSize={38}
              >
                {LINKAGE2_SERVICES.map((_, i) => (
                  <Cell key={i} fill={TEAL_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div
            style={{
              borderTop: "1px solid #F3F4F6",
              paddingTop: "12px",
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {LINKAGE2_SERVICES.map((svc, i) => (
              <div
                key={svc.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: TEAL_COLORS[i],
                    flexShrink: 0,
                    marginTop: "3px",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    fontFamily: FF,
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#374151" }}>
                    {svc.label}
                  </strong>
                  {" · "}
                  {svc.value.toLocaleString()} requests
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom – Two summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: twoCols,
          gap: "16px",
        }}
      >
        <SummaryCard
          title="สรุป Request – บริการใบอนุญาต/หนังสืออนุญาต ของ อท."
          subtitle="รวมทุกบริการใบอนุญาต/หนังสืออนุญาตของ กรมการอุตสาหกรรมทหาร"
          total={summaryOT.total}
          success={summaryOT.success}
          failure={summaryOT.failure}
        />
        <SummaryCard
          title="สรุป Request – บริการเชื่อมโยงข้อมูล (Linkage II)"
          subtitle="รวมทุกบริการเชื่อมโยงข้อมูลกับหน่วยงานภาครัฐและเอกชน"
          total={summaryAll.total}
          success={summaryAll.success}
          failure={summaryAll.failure}
        />
      </div>
    </div>
  );
}