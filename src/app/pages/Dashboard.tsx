import {
  MonitorSmartphone,
  Layers,
  ShieldCheck,
  Activity,
  CheckCircle2,
  XCircle,
  BarChart2,
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
  trendValue,
  trendLabel,
  trendUp,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trendValue: string;
  trendLabel: string;
  trendUp: boolean;
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
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
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
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: trendUp ? "#059669" : "#DC2626",
            backgroundColor: trendUp ? "#ECFDF5" : "#FEF2F2",
            padding: "3px 8px",
            borderRadius: "20px",
            fontFamily: FF,
          }}
        >
          {trendValue}
        </span>
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
          {sub} {trendLabel && "·"} {trendLabel}
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
          <div
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              marginTop: "4px",
              fontFamily: FF,
            }}
          >
            รวมวันนี้
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
              color: TEAL,
              lineHeight: 1,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {success.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#059669",
              marginTop: "4px",
              fontFamily: FF,
              fontWeight: 600,
            }}
          >
            {successPct}%
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
            ล้มเหลว
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
          <div
            style={{
              fontSize: "10px",
              color: "#DC2626",
              marginTop: "4px",
              fontFamily: FF,
              fontWeight: 600,
            }}
          >
            {failPct}%
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
            backgroundColor: TEAL,
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
            color: TEAL,
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
          ล้มเหลว {failPct}%
        </span>
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export function Dashboard() {
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
          ภาพรวมระบบ
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            marginTop: "3px",
            fontFamily: FF,
          }}
        >
          Management Services Center · กรมอุตสาหกรรมทหาร (อท.)
        </p>
      </div>

      {/* Row 1 – 4 stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          title="Client ทั้งหมด"
          value="47"
          sub="แอปพลิเคชันที่ลงทะเบียน"
          icon={MonitorSmartphone}
          iconColor={NAVY}
          iconBg="#EEF2FF"
          trendUp={true}
        />
        <StatCard
          title="Services ทั้งหมด"
          value="128"
          sub="บริการเชื่อมโยงที่เปิดใช้"
          icon={Layers}
          iconColor={TEAL}
          iconBg="#F0FDFD"
          trendUp={true}
        />
        <StatCard
          title="Client ที่มี Permission"
          value="38"
          sub="มีสิทธิ์ใช้งานอย่างน้อย 1 บริการ"
          icon={ShieldCheck}
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          trendUp={true}
        />
        <StatCard
          title="Request ทั้งหมด"
          value="312,237"
          sub="Services ของ อท."
          icon={Activity}
          iconColor={NAVY}
          iconBg="#EEF2FF"
          trendUp={true}
        />
        <StatCard
          title="Request ทั้งหมด"
          value="423,287"
          sub="Services Linkage2"
          icon={Activity}
          iconColor={TEAL}
          iconBg="#F0FDFD"
          trendUp={true}
        />
      </div>

      {/* Middle – Two charts side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
                  Top 5 Services ของ อท.
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    margin: "3px 0 0",
                    fontFamily: FF,
                  }}
                >
                  กรมอุตสาหกรรมทหาร · Request 7 วัน
                  เรียงจากสูงสุด
                </p>
              </div>
            </div>
          </div>

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
                  Top 5 บริการ Linkage2
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    margin: "3px 0 0",
                    fontFamily: FF,
                  }}
                >
                  บริการเชื่อมโยงข้อมูล · Request 7 วัน
                  เรียงจากสูงสุด
                </p>
              </div>
            </div>
          </div>

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
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <SummaryCard
          title="สรุป Request – Services ของ อท."
          subtitle="เฉพาะบริการของกรมอุตสาหกรรมทหาร (อท.) · วันนี้"
          total={summaryOT.total}
          success={summaryOT.success}
          failure={summaryOT.failure}
        />
        <SummaryCard
          title="สรุป Request – ทุก Services"
          subtitle="รวมทุกบริการในระบบ Management Services Center · วันนี้"
          total={summaryAll.total}
          success={summaryAll.success}
          failure={summaryAll.failure}
        />
      </div>
    </div>
  );
}