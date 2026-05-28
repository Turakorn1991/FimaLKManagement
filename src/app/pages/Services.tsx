import { useState } from "react";
import { useSearchParams } from "react-router";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { DataTable, Column } from "../components/DataTable";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface Service {
  id: string;
  name: string;
  provider: string;
  providerCode: string;
  updatedAt: string;
  updatedBy: string;
  seq: number;
  isActive: boolean;
  description: string;
}

const mockServices: Service[] = [
  // DOTI — กรมการอุตสาหกรรมทหาร
  {
    id: "DOTI-0001",
    name: "ใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (ยภ.2)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "14 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description:
      "ตรวจสอบใบอนุญาตสั่งเข้ายุทธภัณฑ์ที่ยังไม่หมดอายุ",
  },
  {
    id: "DOTI-0002",
    name: "ใบอนุญาตนำเข้ามาซึ่งยุทธภัณฑ์ (ยภ.3)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "14 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 2,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตนำเข้ายุทธภัณฑ์",
  },
  {
    id: "DOTI-0003",
    name: "ใบอนุญาตผลิตซึ่งยุทธภัณฑ์ (ยภ.4)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "13 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 3,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตผลิตยุทธภัณฑ์ที่ยังไม่หมดอายุ",
  },
  {
    id: "DOTI-0004",
    name: "ใบอนุญาตมีซึ่งยุทธภัณฑ์ (ยภ.5)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "13 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 4,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตครอบครองยุทธภัณฑ์",
  },
  {
    id: "DOTI-0005",
    name: "หนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "12 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 5,
    isActive: true,
    description: "ตรวจสอบหนังสืออนุญาตส่งออกยุทธภัณฑ์",
  },
  {
    id: "DOTI-0006",
    name: "หนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "12 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 6,
    isActive: true,
    description: "ตรวจสอบหนังสืออนุญาตผ่านแดนยุทธภัณฑ์",
  },
  {
    id: "DOTI-0007",
    name: "หนังสืออนุญาตสั่ง/นำเข้าวัตถุ/อาวุธเพื่อผลิต (อ.8)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "11 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 7,
    isActive: true,
    description:
      "หนังสืออนุญาตนำเข้าวัตถุหรืออาวุธเพื่อใช้ผลิตอาวุธ",
  },
  {
    id: "DOTI-0008",
    name: "หนังสืออนุญาตขนย้ายวัตถุ/อาวุธจากโรงงาน (อ.10)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "11 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 8,
    isActive: true,
    description:
      "หนังสืออนุญาตขนย้ายวัตถุหรืออาวุธออกจากโรงงาน",
  },
  {
    id: "DOTI-0009",
    name: "หนังสืออนุญาตขาย/จำหน่ายอาวุธในราชอาณาจักร (อ.17)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "10 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 9,
    isActive: true,
    description: "หนังสืออนุญาตขายอาวุธให้บุคคลอื่นในประเทศ",
  },
  {
    id: "DOTI-0010",
    name: "หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก (อ.16)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    updatedAt: "10 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 10,
    isActive: false,
    description: "หนังสืออนุญาตขายอาวุธให้บุคคลอื่นโดยส่งออก",
  },
  // DOPA — กรมการปกครอง
  {
    id: "DOPA-0001",
    name: "ข้อมูลทะเบียนราษฎร",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    updatedAt: "9 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนราษฎรบุคคลทุกประเภท",
  },
  {
    id: "DOPA-0002",
    name: "ข้อมูลทะเบียนบ้าน (บุคคลทุกประเภท)",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    updatedAt: "9 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 2,
    isActive: true,
    description: "ข้อมูลทะเบียนบ้านบุคคลทุกประเภท",
  },
  {
    id: "DOPA-0003",
    name: "ข้อมูลใบอนุญาตสั่ง/นำเข้าอาวุธปืน เครื่องกระสุนฯ",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    updatedAt: "8 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 3,
    isActive: true,
    description:
      "ใบอนุญาตให้สั่งหรือนำเข้าซึ่งอาวุธปืน เครื่องกระสุนฯ",
  },
  {
    id: "DOPA-0004",
    name: "ข้อมูลใบอนุญาตจำหน่ายอาวุธปืน เครื่องกระสุนฯ",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    updatedAt: "8 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 4,
    isActive: true,
    description:
      "ใบอนุญาตทำ ประกอบ ซ่อมแซม เปลี่ยนลักษณะ หรือจำหน่ายอาวุธปืนฯ",
  },
  // RD — กรมสรรพากร
  {
    id: "RD-0001",
    name: "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
    provider: "กรมสรรพากร",
    providerCode: "RD",
    updatedAt: "7 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
  },
  // DBD — กรมพัฒนาธุรกิจการค้า
  {
    id: "DBD-0001",
    name: "ทะเบียนหนังสือรับรองนิติบุคคล",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    updatedAt: "7 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนหนังสือรับรองนิติบุคคล",
  },
  {
    id: "DBD-0002",
    name: "ทะเบียนรายชื่อผู้ถือหุ้น",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    updatedAt: "6 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 2,
    isActive: true,
    description: "ข้อมูลทะเบียนรายชื่อผู้ถือหุ้น",
  },
  {
    id: "DBD-0003",
    name: "ทะเบียนธุรกิจของคนต่างด้าว",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    updatedAt: "6 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 3,
    isActive: true,
    description:
      "หนังสือรับรองและทะเบียนการประกอบธุรกิจของคนต่างด้าว",
  },
  // DIW — กรมโรงงานอุตสาหกรรม
  {
    id: "DIW-0001",
    name: "ใบอนุญาตประกอบกิจการโรงงาน (ร.ง. 4)",
    provider: "กรมโรงงานอุตสาหกรรม",
    providerCode: "DIW",
    updatedAt: "5 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลใบอนุญาตประกอบกิจการโรงงาน",
  },
  // DPIM — กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่
  {
    id: "DPIM-0001",
    name: "ข้อมูลประทานบัตร",
    provider: "กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่",
    providerCode: "DPIM",
    updatedAt: "5 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลประทานบัตรเหมืองแร่",
  },
  // IEAT — การนิคมอุตสาหกรรมแห่งประเทศไทย
  {
    id: "IEAT-0001",
    name: "ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม (กนอ.01/2)",
    provider: "การนิคมอุตสาหกรรมแห่งประเทศไทย",
    providerCode: "IEAT",
    updatedAt: "4 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description:
      "การอนุมัติอนุญาตใช้ที่ดินในนิคมอุตสาหกรรมตามใบอนุญาต กนอ.01/2",
  },
  // DOL — กรมแรงงาน
  {
    id: "DOL-0001",
    name: "ทะเบียนแรงงานต่างด้าว (ทุกกลุ่ม)",
    provider: "กรมแรงงาน",
    providerCode: "DOL",
    updatedAt: "4 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนแรงงานต่างด้าวทุกกลุ่ม",
  },
  // DMF — กรมเชื้อเพลิงธรรมชาติ
  {
    id: "DMF-0001",
    name: "ข้อมูลสัมปทานปิโตรเลียม",
    provider: "กรมเชื้อเพลิงธรรมชาติ",
    providerCode: "DMF",
    updatedAt: "3 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลสัมปทานปิโตรเลียม",
  },
  {
    id: "DMF-0002",
    name: "ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด",
    provider: "กรมเชื้อเพลิงธรรมชาติ",
    providerCode: "DMF",
    updatedAt: "3 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 2,
    isActive: true,
    description: "แบบตรวจสอบปริมาณวัตถุระเบิด",
  },
  // RTP — สำนักงานตำรวจแห่งชาติ
  {
    id: "RTP-0001",
    name: "ทะเบียนประวัติอาชญากรรม",
    provider: "สำนักงานตำรวจแห่งชาติ",
    providerCode: "RTP",
    updatedAt: "2 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนประวัติอาชญากรรม",
  },
  // LED — กรมบังคับคดี
  {
    id: "LED-0001",
    name: "ข้อมูลบุคคลล้มละลาย",
    provider: "กรมบังคับคดี",
    providerCode: "LED",
    updatedAt: "2 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ข้อมูลบุคคลล้มละลายและฟื้นฟูกิจการ",
  },
  // DL — กรมที่ดิน
  {
    id: "DL-0001",
    name: "เอกสารสิทธิที่ดิน",
    provider: "กรมที่ดิน",
    providerCode: "DL",
    updatedAt: "1 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    seq: 1,
    isActive: true,
    description: "ตรวจสอบเอกสารสิทธิที่ดินและโฉนด",
  },
];

const providers = [
  { code: "DOTI", name: "กรมการอุตสาหกรรมทหาร" },
  { code: "DOPA", name: "กรมการปกครอง" },
  { code: "RD", name: "กรมสรรพากร" },
  { code: "DBD", name: "กรมพัฒนาธุรกิจการค้า" },
  { code: "DIW", name: "กรมโรงงานอุตสาหกรรม" },
  { code: "DPIM", name: "กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่" },
  { code: "IEAT", name: "การนิคมอุตสาหกรรมแห่งประเทศไทย" },
  { code: "DOL", name: "กรมแรงงาน" },
  { code: "DMF", name: "กรมเชื้อเพลิงธรรมชาติ" },
  { code: "RTP", name: "สำนักงานตำรวจแห่งชาติ" },
  { code: "LED", name: "กรมบังคับคดี" },
  { code: "DL", name: "กรมที่ดิน" },
];

export function Services() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState(mockServices);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState(
    searchParams.get("provider") ?? "all",
  );
  const [showModal, setShowModal] = useState(false);
  const [editSvc, setEditSvc] = useState<Service | null>(null);
  const [confirm, setConfirm] = useState<Service | null>(null);
  const [toggleConfirm, setToggleConfirm] =
    useState<Service | null>(null);
  const [form, setForm] = useState({
    providerCode: "DOTI",
    name: "",
    description: "",
  });

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q);
    const matchP =
      providerFilter === "all" ||
      s.providerCode === providerFilter;
    const matchS =
      statusFilter === "all" ||
      s.isActive === (statusFilter == "active" ? true : false);
    return matchQ && matchP && matchS;
  });

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s,
      ),
    );
    setToggleConfirm(null);
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setConfirm(null);
  };

  const openAdd = () => {
    setEditSvc(null);
    setForm({
      providerCode: "ARMO",
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEdit = (svc: Service) => {
    setEditSvc(svc);
    setForm({
      providerCode: svc.providerCode,
      name: svc.name,
      description: svc.description,
    });
    setShowModal(true);
  };

  // Compute next seq for selected provider
  const nextSeq =
    services.filter((s) => s.providerCode === form.providerCode)
      .length + 1;
  const previewId = `${form.providerCode}-${String(nextSeq).padStart(4, "0")}`;

  const columns: Column<Service>[] = [
    {
      key: "id",
      header: "Service ID",
      width: "130px",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#374151",
            letterSpacing: "0.02em",
          }}
        >
          {row.id}
        </span>
      ),
    },
    {
      key: "name",
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
            {row.name}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              marginTop: "1px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: "provider",
      header: "หน่วยงาน",
      sortable: true,
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              backgroundColor: "#1F2937",
              color: "white",
              fontSize: "9px",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            {row.providerCode}
          </div>
          <span
            style={{
              fontSize: "13px",
              color: "#374151",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {row.provider}
          </span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "อัปเดตล่าสุด",
      sortable: true,
      width: "200px",
      render: (row) => {
        const T = ["08:15","09:30","10:45","11:20","13:00","14:22","15:10","16:35"];
        const time = T[parseInt(row.updatedAt) % T.length];
        const dateStr = row.updatedAt.replace("2568","2569");
        return (
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#111827",
                fontWeight: 500,
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {dateStr}, {time} น.
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                marginTop: "2px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              โดย {row.updatedBy}
            </div>
          </div>
        );
      },
    },
    {
      key: "isActive",
      header: "สถานะ",
      width: "160px",
      align: "center",
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <ToggleSwitch
            checked={row.isActive}
            onChange={() => setToggleConfirm(row)}
          />
          <span
            style={{
              fontSize: "12px",
              color: row.isActive ? "#059669" : "#9CA3AF",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            {row.isActive ? "เปิดให้บริการ" : "ปิดการให้บริการ"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "จัดการ",
      width: "90px",
      align: "center",
      render: (row) => (
        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => openEdit(row)}
            title="แก้ไข"
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
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => setConfirm(row)}
            title="ลบ"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEE2E2";
              e.currentTarget.style.borderColor = "#FCA5A5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FEF2F2";
              e.currentTarget.style.borderColor = "#FECACA";
            }}
            style={{
              padding: "5px",
              border: "1px solid #FECACA",
              borderRadius: "6px",
              background: "#FEF2F2",
              cursor: "pointer",
              color: "#DC2626",
              transition:
                "background-color 0.15s, border-color 0.15s",
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
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
            บริการ (Services)
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
            ข้อมูลบริการที่เชื่อมโยงต่อกับหน่วยงานต่างๆ ทั้งภาครัฐและเอกชน
          </p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          เพิ่มบริการ
        </Button>
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
            count: services.length,
            color: "#003087",
            bg: "#EEF2FF",
          },
          {
            val: "active",
            label: "เปิดใช้งาน",
            count: services.filter((s) => s.isActive).length,
            color: "#059669",
            bg: "#ECFDF5",
          },
          {
            val: "inactive",
            label: "ปิดใช้งาน",
            count: services.filter((s) => !s.isActive).length,
            color: "#6B7280",
            bg: "#F9FAFB",
          },
        ].map((chip) => (
          <button
            key={chip.val}
            onClick={() => setStatusFilter(chip.val as any)}
            onMouseEnter={(e) => {
              if (statusFilter !== chip.val) {
                e.currentTarget.style.backgroundColor =
                  "#F9FAFB";
                e.currentTarget.style.borderColor = "#D1D5DB";
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== chip.val) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }
            }}
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
        {/* Search + Provider filter */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              minWidth: "280px",
              flex: 1,
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา Service ID, ชื่อบริการ, Provider..."
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px 0 36px",
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
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            style={{
              height: "38px",
              padding: "0 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              outline: "none",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <option value="all">Provider ทั้งหมด</option>
            {providers.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
        />
      </div>

      <ConfirmDialog
        open={!!toggleConfirm}
        onClose={() => setToggleConfirm(null)}
        onConfirm={() =>
          toggleConfirm && toggleActive(toggleConfirm.id)
        }
        title={
          toggleConfirm?.isActive
            ? "ยืนยันการปิดบริการ"
            : "ยืนยันการเปิดบริการ"
        }
        message={
          toggleConfirm?.isActive
            ? `คุณต้องการปิดการให้บริการ "${toggleConfirm?.name}" ชั่วคราวหรือไม่?`
            : `คุณต้องการเปิดการให้บริการ "${toggleConfirm?.name}" อีกครั้งหรือไม่?`
        }
        variant={
          toggleConfirm?.isActive ? "warning" : "success"
        }
        confirmLabel={
          toggleConfirm?.isActive ? "ปิดบริการ" : "เปิดบริการ"
        }
      />

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && handleDelete(confirm.id)}
        title="ยืนยันการลบบริการ"
        message={`คุณต้องการลบบริการ "${confirm?.name}" (${confirm?.id}) ออกจากระบบหรือไม่?`}
        confirmLabel="ลบบริการ"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={
          editSvc ? "แก้ไขข้อมูลบริการ" : "เพิ่มบริการใหม่"
        }
        subtitle={
          editSvc
            ? `Service ID: ${editSvc.id}`
            : "Service ID จะถูกสร้างอัตโนมัติจาก Provider Code"
        }
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              ยกเลิก
            </Button>
            <Button onClick={() => setShowModal(false)}>
              {editSvc ? "บันทึกการแก้ไข" : "เพิ่มบริการ"}
            </Button>
          </>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Provider selection (only on add) */}
          {!editSvc && (
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: "6px",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                Provider / หน่วยงาน{" "}
                <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <select
                value={form.providerCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    providerCode: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  height: "38px",
                  padding: "0 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                  outline: "none",
                  backgroundColor: "#FAFAFA",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {providers.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Auto-generated Service ID preview */}
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#F0F4F8",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6B7280",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              Service ID ที่จะสร้าง:
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: "#003087",
                letterSpacing: "0.05em",
              }}
            >
              {editSvc ? editSvc.id : previewId}
            </div>
            {!editSvc && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                (สร้างอัตโนมัติ)
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: "6px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              ชื่อบริการ{" "}
              <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="ระบุชื่อบริการ"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFA",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: "6px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              คำอธิบาย
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="อธิบายบริการนี้โดยย่อ"
              rows={3}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                backgroundColor: "#FAFAFA",
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}