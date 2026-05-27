import { useState } from "react";
import { Search, Download, Eye, Calendar } from "lucide-react";
import { DataTable, Column } from "../components/DataTable";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";

interface LogEntry {
  id: string;
  timestamp: string;
  client: string;
  clientId: string;
  service: string;
  serviceId: string;
  method: string;
  statusCode: number;
  responseTime: string;
  ipAddress: string;
  requestBody: string;
  responseBody: string;
}

const clients = [
  "CLT-001",
  "CLT-002",
  "CLT-003",
  "CLT-005",
  "CLT-007",
  "CLT-008",
];
const clientNames = [
  "ระบบสารบรรณ",
  "MilLogistics",
  "DefLicense",
  "MapThai GIS",
  "Intel App",
  "Procurement",
];
const serviceIds = [
  "ARMO-0001",
  "ARMO-0002",
  "ARMO-0003",
  "MODS-0001",
  "RTSD-0001",
  "LOGI-0001",
];
const serviceNames = [
  "Linkage2 บุคลากร",
  "ใบอนุญาตอาวุธปืน",
  "ใบอนุญาตระเบิด",
  "ทะเบียนนายทหาร",
  "GIS แผนที่",
  "จัดซื้อจัดจ้าง",
];
const codes = [200, 200, 200, 200, 200, 401, 403, 404, 500];
const times = [
  "42ms",
  "67ms",
  "88ms",
  "95ms",
  "123ms",
  "201ms",
  "312ms",
  "845ms",
];
const hours = ["08", "09", "10", "11", "12", "13", "14"];

const mockLogs: LogEntry[] = Array.from(
  { length: 80 },
  (_, i) => {
    const ci = i % 6;
    const si = i % 6;
    const code = codes[i % codes.length];
    return {
      id: `LOG-${String(50000 + i).padStart(5, "0")}`,
      timestamp: `14 พ.ค. 2568, ${hours[i % hours.length]}:${String((i * 7) % 60).padStart(2, "0")}:${String((i * 11) % 60).padStart(2, "0")} น.`,
      client: clientNames[ci],
      clientId: clients[ci],
      service: serviceNames[si],
      serviceId: serviceIds[si],
      method: i % 5 === 0 ? "POST" : "GET",
      statusCode: code,
      responseTime: times[i % times.length],
      ipAddress: `10.200.${10 + ci}.${100 + (i % 50)}`,
      requestBody: `{"clientId":"${clients[ci]}","serviceId":"${serviceIds[si]}","timestamp":"2025-05-14T${hours[i % hours.length]}:${String((i * 7) % 60).padStart(2, "0")}:00Z"}`,
      responseBody:
        code === 200
          ? `{"status":"success","data":{"recordId":${2456300 + i},"name":"ข้อมูลตัวอย่าง ${i}"},"timestamp":"2025-05-14T..."}`
          : `{"status":"error","code":${code},"message":"${code === 401 ? "Unauthorized" : code === 404 ? "Not Found" : "Server Error"}"}`,
    };
  },
);

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

const allClients = [
  "ทั้งหมด",
  ...Array.from(new Set(clientNames)),
];
const allServices = [
  "ทั้งหมด",
  ...Array.from(new Set(serviceNames)),
];

export function Logs() {
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("ทั้งหมด");
  const [serviceFilter, setServiceFilter] = useState("ทั้งหมด");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] =
    useState<LogEntry | null>(null);

  const filtered = mockLogs.filter((l) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      l.id.toLowerCase().includes(q) ||
      l.client.toLowerCase().includes(q) ||
      l.service.toLowerCase().includes(q) ||
      l.serviceId.toLowerCase().includes(q);
    const matchC =
      clientFilter === "ทั้งหมด" || l.client === clientFilter;
    const matchS =
      serviceFilter === "ทั้งหมด" ||
      l.service === serviceFilter;
    return matchQ && matchC && matchS;
  });

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
      width: "120px",
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
      header: "Client",
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
              fontSize: "11px",
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
      header: "Service / บริการ",
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
              fontSize: "11px",
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
      key: "method",
      header: "Method",
      width: "75px",
      align: "center",
      render: (row) => (
        <span
          style={{
            backgroundColor:
              row.method === "POST" ? "#FFF7ED" : "#EEF2FF",
            color:
              row.method === "POST" ? "#C2410C" : "#4338CA",
            borderRadius: "4px",
            padding: "2px 7px",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          {row.method}
        </span>
      ),
    },
    {
      key: "statusCode",
      header: "Status",
      width: "72px",
      align: "center",
      render: (row) => {
        const cfg = statusColor(row.statusCode);
        return (
          <span
            style={{
              backgroundColor: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              borderRadius: "6px",
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
      key: "responseTime",
      header: "Latency",
      width: "80px",
      align: "center",
      render: (row) => {
        const ms = parseInt(row.responseTime);
        return (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: ms > 300 ? "#D97706" : "#059669",
              fontFamily: "monospace",
            }}
          >
            {row.responseTime}
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
      width: "48px",
      align: "center",
      render: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          style={{
            padding: "5px",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            background: "white",
            cursor: "pointer",
            color: "#003087",
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
            Log การใช้งาน
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
            บันทึก API Request ทั้งหมดของระบบ — ค้นหา กรอง
            และดูรายละเอียด
          </p>
        </div>
        <Button icon={Download} variant="secondary">
          ส่งออก CSV
        </Button>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Request ทั้งหมด (ผลลัพธ์)",
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
            label: "ข้อผิดพลาด (4xx/5xx)",
            value: errorCount.toLocaleString(),
            color: "#DC2626",
            bg: "#FEF2F2",
          },
          {
            label: "Latency เฉลี่ย",
            value: "87ms",
            color: "#7C3AED",
            bg: "#F5F3FF",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "14px 16px",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Advanced filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา Log ID, Client, Service..."
              style={{
                width: "100%",
                padding: "8px 10px 8px 30px",
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
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
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
            }}
          >
            {allClients.map((c) => (
              <option key={c} value={c}>
                {c === "ทั้งหมด" ? "Client ทั้งหมด" : c}
              </option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
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
            }}
          >
            {allServices.map((s) => (
              <option key={s} value={s}>
                {s === "ทั้งหมด" ? "Service ทั้งหมด" : s}
              </option>
            ))}
          </select>
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
                padding: "7px 9px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                cursor: "pointer",
              }}
            />
            <span
              style={{ fontSize: "12px", color: "#9CA3AF" }}
            >
              –
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                padding: "7px 9px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                cursor: "pointer",
              }}
            />
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
                ["Method", selectedLog.method],
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
                        "Method",
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