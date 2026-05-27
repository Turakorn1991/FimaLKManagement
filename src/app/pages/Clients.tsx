import { useState } from "react";
import { Search, Info } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { DataTable, Column } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";

interface Client {
  id: string;
  name: string;
  department: string;
  status: "active" | "inactive";
  registeredAt: string;
}

const mockClients: Client[] = [
  {
    id: "CLT-001",
    name: "ระบบสารบรรณอิเล็กทรอนิกส์",
    department: "กรมอุตสาหกรรมทหาร",
    status: "active",
    registeredAt: "12 ม.ค. 2567",
  },
  {
    id: "CLT-002",
    name: "MilLogistics Platform",
    department: "กรมพลาธิการทหาร",
    status: "active",
    registeredAt: "3 ก.พ. 2567",
  },
  {
    id: "CLT-003",
    name: "DefLicense Portal",
    department: "กรมสรรพาวุธทหาร",
    status: "active",
    registeredAt: "15 ก.พ. 2567",
  },
  {
    id: "CLT-004",
    name: "FinanceArmy Connect",
    department: "กรมการเงินทหาร",
    status: "inactive",
    registeredAt: "20 มี.ค. 2567",
  },
  {
    id: "CLT-005",
    name: "MapThai Military GIS",
    department: "กรมแผนที่ทหาร",
    status: "active",
    registeredAt: "1 เม.ย. 2567",
  },
  {
    id: "CLT-006",
    name: "HR-Defence System",
    department: "สำนักงานเลขา กห.",
    status: "active",
    registeredAt: "5 เม.ย. 2567",
  },
  {
    id: "CLT-007",
    name: "Intel Management App",
    department: "กรมข่าวทหาร",
    status: "active",
    registeredAt: "10 พ.ค. 2567",
  },
  {
    id: "CLT-008",
    name: "Procurement Portal",
    department: "กรมส่งกำลังบำรุงทหาร",
    status: "active",
    registeredAt: "18 พ.ค. 2567",
  },
  {
    id: "CLT-009",
    name: "Medical Records System",
    department: "กรมแพทย์ทหาร",
    status: "active",
    registeredAt: "22 พ.ค. 2567",
  },
  {
    id: "CLT-010",
    name: "Training Management",
    department: "โรงเรียนนายร้อย",
    status: "inactive",
    registeredAt: "30 พ.ค. 2567",
  },
  {
    id: "CLT-011",
    name: "Asset Tracking System",
    department: "กรมอุตสาหกรรมทหาร",
    status: "active",
    registeredAt: "8 มิ.ย. 2567",
  },
  {
    id: "CLT-012",
    name: "Communication Platform",
    department: "กรมการสื่อสารทหาร",
    status: "active",
    registeredAt: "15 มิ.ย. 2567",
  },
  {
    id: "CLT-013",
    name: "Navy Logistics App",
    department: "กองทัพเรือ",
    status: "active",
    registeredAt: "22 มิ.ย. 2567",
  },
  {
    id: "CLT-014",
    name: "Air Force HR Portal",
    department: "กองทัพอากาศ",
    status: "inactive",
    registeredAt: "1 ก.ค. 2567",
  },
  {
    id: "CLT-015",
    name: "Defence Procurement Hub",
    department: "สำนักงาน กพ. กห.",
    status: "active",
    registeredAt: "10 ก.ค. 2567",
  },
];

export function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filtered = mockClients.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    const matchS =
      statusFilter === "all" || c.status === statusFilter;
    return matchQ && matchS;
  });

  const columns: Column<Client>[] = [
    {
      key: "id",
      header: "Client ID",
      sortable: true,
      width: "110px",
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
      key: "name",
      header: "ชื่อแอปพลิเคชัน",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontWeight: 500,
            color: "#111827",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          {row.name}
        </span>
      ),
    },
    {
      key: "department",
      header: "หน่วยงาน",
      sortable: true,
    },
    {
      key: "status",
      header: "สถานะ",
      width: "120px",
      align: "center",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "registeredAt",
      header: "วันที่ลงทะเบียน",
      sortable: true,
      width: "150px",
    },
  ];

  const activeCount = mockClients.filter(
    (c) => c.status === "active",
  ).length;
  const inactiveCount = mockClients.filter(
    (c) => c.status === "inactive",
  ).length;

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          แอปพลิเคชัน (Clients)
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            marginTop: "4px",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          ข้อมูลแอปพลิเคชันที่ลงทะเบียนผ่านระบบ SSO Management
        </p>
      </div>

      {/* Read-only notice */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <Info
          size={15}
          color="#3B82F6"
          style={{ flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: "13px",
            color: "#1D4ED8",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          ข้อมูล Client ดึงมาจากระบบ SSO Management โดยอัตโนมัติ
          — ไม่สามารถเพิ่ม แก้ไข หรือลบได้จากระบบนี้
        </span>
      </div>

      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {[
          {
            val: "all",
            label: "ทั้งหมด",
            count: mockClients.length,
            color: "#003087",
            bg: "#EEF2FF",
          },
          {
            val: "active",
            label: "เปิดใช้งาน",
            count: activeCount,
            color: "#059669",
            bg: "#ECFDF5",
          },
          {
            val: "inactive",
            label: "ปิดใช้งาน",
            count: inactiveCount,
            color: "#6B7280",
            bg: "#F9FAFB",
          },
        ].map((chip) => (
          <button
            key={chip.val}
            onClick={() => setStatusFilter(chip.val as any)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              border: `1.5px solid ${statusFilter === chip.val ? chip.color : "#E5E7EB"}`,
              backgroundColor:
                statusFilter === chip.val ? chip.bg : "white",
              color:
                statusFilter === chip.val
                  ? chip.color
                  : "#6B7280",
              fontSize: "12px",
              fontWeight: statusFilter === chip.val ? 600 : 400,
              cursor: "pointer",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {chip.label}
            <span
              style={{
                backgroundColor:
                  statusFilter === chip.val
                    ? chip.color
                    : "#E5E7EB",
                color:
                  statusFilter === chip.val
                    ? "white"
                    : "#6B7280",
                borderRadius: "10px",
                padding: "0 6px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {chip.count}
            </span>
          </button>
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
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{ position: "relative", maxWidth: "380px" }}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา Client ID, ชื่อแอปพลิเคชัน, หน่วยงาน..."
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
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          emptyText="ไม่พบข้อมูล Client"
        />
      </div>
    </div>
  );
}