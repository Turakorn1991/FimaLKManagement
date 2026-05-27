import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";
import { DataTable, Column } from "../components/DataTable";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface Service {
  id: string;
  name: string;
  provider: string;
  providerCode: string;
  seq: number;
  isActive: boolean;
  description: string;
}

const mockServices: Service[] = [
  // DOTI — กรมการอุตสาหกรรมทหาร (10 services)
  {
    id: "DOTI-0001",
    name: "ใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (ยภ.2)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
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
    seq: 2,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตนำเข้ายุทธภัณฑ์",
  },
  {
    id: "DOTI-0003",
    name: "ใบอนุญาตผลิตซึ่งยุทธภัณฑ์ (ยภ.4)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    seq: 3,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตผลิตยุทธภัณฑ์ที่ยังไม่หมดอายุ",
  },
  {
    id: "DOTI-0004",
    name: "ใบอนุญาตมีซึ่งยุทธภัณฑ์ (ยภ.5)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    seq: 4,
    isActive: true,
    description: "ตรวจสอบใบอนุญาตครอบครองยุทธภัณฑ์",
  },
  {
    id: "DOTI-0005",
    name: "หนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    seq: 5,
    isActive: true,
    description: "ตรวจสอบหนังสืออนุญาตส่งออกยุทธภัณฑ์",
  },
  {
    id: "DOTI-0006",
    name: "หนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    seq: 6,
    isActive: true,
    description: "ตรวจสอบหนังสืออนุญาตผ่านแดนยุทธภัณฑ์",
  },
  {
    id: "DOTI-0007",
    name: "หนังสืออนุญาตสั่ง/นำเข้าวัตถุ/อาวุธเพื่อผลิต (อ.8)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
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
    seq: 9,
    isActive: true,
    description: "หนังสืออนุญาตขายอาวุธให้บุคคลอื่นในประเทศ",
  },
  {
    id: "DOTI-0010",
    name: "หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก (อ.16)",
    provider: "กรมการอุตสาหกรรมทหาร",
    providerCode: "DOTI",
    seq: 10,
    isActive: false,
    description: "หนังสืออนุญาตขายอาวุธให้บุคคลอื่นโดยส่งออก",
  },
  // DOPA — กรมการปกครอง (4 services)
  {
    id: "DOPA-0001",
    name: "ข้อมูลทะเบียนราษฎร",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนราษฎรบุคคลทุกประเภท",
  },
  {
    id: "DOPA-0002",
    name: "ข้อมูลทะเบียนบ้าน (บุคคลทุกประเภท)",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
    seq: 2,
    isActive: true,
    description: "ข้อมูลทะเบียนบ้านบุคคลทุกประเภท",
  },
  {
    id: "DOPA-0003",
    name: "ข้อมูลใบอนุญาตสั่ง/นำเข้าอาวุธปืน เครื่องกระสุนฯ",
    provider: "กรมการปกครอง",
    providerCode: "DOPA",
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
    seq: 4,
    isActive: true,
    description:
      "ใบอนุญาตทำ ประกอบ ซ่อมแซม เปลี่ยนลักษณะ หรือจำหน่ายอาวุธปืนฯ",
  },
  // RD — กรมสรรพากร (1 service)
  {
    id: "RD-0001",
    name: "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
    provider: "กรมสรรพากร",
    providerCode: "RD",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
  },
  // DBD — กรมพัฒนาธุรกิจการค้า (3 services)
  {
    id: "DBD-0001",
    name: "ทะเบียนหนังสือรับรองนิติบุคคล",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนหนังสือรับรองนิติบุคคล",
  },
  {
    id: "DBD-0002",
    name: "ทะเบียนรายชื่อผู้ถือหุ้น",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    seq: 2,
    isActive: true,
    description: "ข้อมูลทะเบียนรายชื่อผู้ถือหุ้น",
  },
  {
    id: "DBD-0003",
    name: "ทะเบียนธุรกิจของคนต่างด้าว",
    provider: "กรมพัฒนาธุรกิจการค้า",
    providerCode: "DBD",
    seq: 3,
    isActive: true,
    description:
      "หนังสือรับรองและทะเบียนการประกอบธุรกิจของคนต่างด้าว",
  },
  // DIW — กรมโรงงานอุตสาหกรรม (1 service)
  {
    id: "DIW-0001",
    name: "ใบอนุญาตประกอบกิจการโรงงาน (ร.ง. 4)",
    provider: "กรมโรงงานอุตสาหกรรม",
    providerCode: "DIW",
    seq: 1,
    isActive: true,
    description: "ข้อมูลใบอนุญาตประกอบกิจการโรงงาน",
  },
  // DPIM — กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่ (1 service)
  {
    id: "DPIM-0001",
    name: "ข้อมูลประทานบัตร",
    provider: "กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่",
    providerCode: "DPIM",
    seq: 1,
    isActive: true,
    description: "ข้อมูลประทานบัตรเหมืองแร่",
  },
  // IEAT — การนิคมอุตสาหกรรมแห่งประเทศไทย (1 service)
  {
    id: "IEAT-0001",
    name: "ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม (กนอ.01/2)",
    provider: "การนิคมอุตสาหกรรมแห่งประเทศไทย",
    providerCode: "IEAT",
    seq: 1,
    isActive: true,
    description:
      "การอนุมัติอนุญาตใช้ที่ดินในนิคมอุตสาหกรรมตามใบอนุญาต กนอ.01/2",
  },
  // DOL — กรมแรงงาน (1 service)
  {
    id: "DOL-0001",
    name: "ทะเบียนแรงงานต่างด้าว (ทุกกลุ่ม)",
    provider: "กรมแรงงาน",
    providerCode: "DOL",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนแรงงานต่างด้าวทุกกลุ่ม",
  },
  // DMF — กรมเชื้อเพลิงธรรมชาติ (2 services)
  {
    id: "DMF-0001",
    name: "ข้อมูลสัมปทานปิโตรเลียม",
    provider: "กรมเชื้อเพลิงธรรมชาติ",
    providerCode: "DMF",
    seq: 1,
    isActive: true,
    description: "ข้อมูลสัมปทานปิโตรเลียม",
  },
  {
    id: "DMF-0002",
    name: "ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด",
    provider: "กรมเชื้อเพลิงธรรมชาติ",
    providerCode: "DMF",
    seq: 2,
    isActive: true,
    description: "แบบตรวจสอบปริมาณวัตถุระเบิด",
  },
  // RTP — สำนักงานตำรวจแห่งชาติ (1 service)
  {
    id: "RTP-0001",
    name: "ทะเบียนประวัติอาชญากรรม",
    provider: "สำนักงานตำรวจแห่งชาติ",
    providerCode: "RTP",
    seq: 1,
    isActive: true,
    description: "ข้อมูลทะเบียนประวัติอาชญากรรม",
  },
  // LED — กรมบังคับคดี (1 service)
  {
    id: "LED-0001",
    name: "ข้อมูลบุคคลล้มละลาย",
    provider: "กรมบังคับคดี",
    providerCode: "LED",
    seq: 1,
    isActive: true,
    description: "ข้อมูลบุคคลล้มละลายและฟื้นฟูกิจการ",
  },
  // DL — กรมที่ดิน (1 service)
  {
    id: "DL-0001",
    name: "เอกสารสิทธิที่ดิน",
    provider: "กรมที่ดิน",
    providerCode: "DL",
    seq: 1,
    isActive: true,
    description: "ตรวจสอบเอกสารสิทธิที่ดินและโฉนด",
  },
];

interface Provider {
  id: string;
  code: string;
  name: string;
  updatedAt: string;
  updatedBy: string;
  serviceCount: number;
  description: string;
  contactEmail: string;
}

const mockProviders: Provider[] = [
  {
    id: "PRV-001",
    code: "DOTI",
    name: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "14 พ.ค. 2568",
    updatedBy: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    serviceCount: 10,
    description: "ข้อมูลใบอนุญาตยุทธภัณฑ์และอาวุธ",
    contactEmail: "api@doti.mod.go.th",
  },
  {
    id: "PRV-002",
    code: "DOPA",
    name: "กรมการปกครอง",
    updatedAt: "13 พ.ค. 2568",
    updatedBy: "ส.ท. ธนพล สุขใจ",
    serviceCount: 4,
    description: "ทะเบียนราษฎรและใบอนุญาตอาวุธปืน",
    contactEmail: "api@dopa.go.th",
  },
  {
    id: "PRV-003",
    code: "RD",
    name: "กรมสรรพากร",
    updatedAt: "12 พ.ค. 2568",
    updatedBy: "ร.ท. สมหมาย จันทร์ดี",
    serviceCount: 1,
    description: "ทะเบียนภาษีมูลค่าเพิ่ม",
    contactEmail: "api@rd.go.th",
  },
  {
    id: "PRV-004",
    code: "DBD",
    name: "กรมพัฒนาธุรกิจการค้า",
    updatedAt: "12 พ.ค. 2568",
    updatedBy: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    serviceCount: 3,
    description: "ทะเบียนนิติบุคคลและธุรกิจ",
    contactEmail: "api@dbd.go.th",
  },
  {
    id: "PRV-005",
    code: "DIW",
    name: "กรมโรงงานอุตสาหกรรม",
    updatedAt: "11 พ.ค. 2568",
    updatedBy: "พ.ต. ประเสริฐ แก้วมณี",
    serviceCount: 1,
    description: "ใบอนุญาตประกอบกิจการโรงงาน",
    contactEmail: "api@diw.go.th",
  },
  {
    id: "PRV-006",
    code: "DPIM",
    name: "กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่",
    updatedAt: "11 พ.ค. 2568",
    updatedBy: "ส.ท. ธนพล สุขใจ",
    serviceCount: 1,
    description: "ประทานบัตรเหมืองแร่",
    contactEmail: "api@dpim.go.th",
  },
  {
    id: "PRV-007",
    code: "IEAT",
    name: "การนิคมอุตสาหกรรมแห่งประเทศไทย",
    updatedAt: "10 พ.ค. 2568",
    updatedBy: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    serviceCount: 1,
    description: "การใช้ที่ดินในนิคมอุตสาหกรรม",
    contactEmail: "api@ieat.go.th",
  },
  {
    id: "PRV-008",
    code: "DOL",
    name: "กรมแรงงาน",
    updatedAt: "10 พ.ค. 2568",
    updatedBy: "ร.ท. สมหมาย จันทร์ดี",
    serviceCount: 1,
    description: "ทะเบียนแรงงานต่างด้าว",
    contactEmail: "api@dol.go.th",
  },
  {
    id: "PRV-009",
    code: "DMF",
    name: "กรมเชื้อเพลิงธรรมชาติ",
    updatedAt: "9 พ.ค. 2568",
    updatedBy: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    serviceCount: 2,
    description: "สัมปทานปิโตรเลียมและวัตถุระเบิด",
    contactEmail: "api@dmf.go.th",
  },
  {
    id: "PRV-010",
    code: "RTP",
    name: "สำนักงานตำรวจแห่งชาติ",
    updatedAt: "8 พ.ค. 2568",
    updatedBy: "ส.ท. ธนพล สุขใจ",
    serviceCount: 1,
    description: "ทะเบียนประวัติอาชญากรรม",
    contactEmail: "api@royalthaipolice.go.th",
  },
  {
    id: "PRV-011",
    code: "LED",
    name: "กรมบังคับคดี",
    updatedAt: "8 พ.ค. 2568",
    updatedBy: "พ.ต. ประเสริฐ แก้วมณี",
    serviceCount: 1,
    description: "ข้อมูลบุคคลล้มละลาย",
    contactEmail: "api@led.go.th",
  },
  {
    id: "PRV-012",
    code: "DL",
    name: "กรมที่ดิน",
    updatedAt: "7 พ.ค. 2568",
    updatedBy: "ร.ท. สมหมาย จันทร์ดี",
    serviceCount: 1,
    description: "เอกสารสิทธิที่ดิน",
    contactEmail: "api@lands.go.th",
  },
];

export function Providers() {
  const [providers, setProviders] = useState(mockProviders);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPrv, setEditPrv] = useState<Provider | null>(null);
  const [confirm, setConfirm] = useState<Provider | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    contactEmail: "",
    description: "",
  });
  const [servicesModal, setServicesModal] =
    useState<Provider | null>(null);

  const handleDelete = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    setConfirm(null);
  };

  const filtered = providers.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditPrv(null);
    setForm({
      code: "",
      name: "",
      contactEmail: "",
      description: "",
    });
    setShowModal(true);
  };
  const openEdit = (prv: Provider) => {
    setEditPrv(prv);
    setForm({
      code: prv.code,
      name: prv.name,
      contactEmail: prv.contactEmail,
      description: prv.description,
    });
    setShowModal(true);
  };

  const columns: Column<Provider>[] = [
    {
      key: "name",
      header: "ชื่อหน่วยงาน / Provider",
      sortable: true,
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              backgroundColor: "#003087",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: 700,
              color: "white",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {row.code}
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#111827",
                fontSize: "13px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {row.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#9CA3AF",
                marginTop: "1px",
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {row.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "serviceCount",
      header: "จำนวน Services",
      width: "150px",
      align: "center",
      render: (row) =>
        row.serviceCount > 0 ? (
          <button
            onClick={() => setServicesModal(row)}
            title={`ดูบริการของ ${row.name}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "4px 14px",
              borderRadius: "20px",
              backgroundColor: "#EEF2FF",
              color: "#4338CA",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.backgroundColor = "#C7D2FE";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.backgroundColor = "#EEF2FF";
            }}
          >
            {row.serviceCount} บริการ
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 14px",
              borderRadius: "20px",
              backgroundColor: "#F3F4F6",
              color: "#9CA3AF",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            0 บริการ
          </span>
        ),
    },
    {
      key: "updatedAt",
      header: "อัปเดตล่าสุด",
      sortable: true,
      width: "260px",
      render: (row) => (
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
            {row.updatedAt}
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
            ผู้ให้บริการ (Providers)
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
            ข้อมุลหน่วยงานผู้ให้บริการเชื่อมโยงข้อมูล
          </p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          เพิ่มผู้ให้บริการ
        </Button>
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
              placeholder="ค้นหาหน่วยงาน, Code..."
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
        />
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && handleDelete(confirm.id)}
        title="ยืนยันการลบ Provider"
        message={`คุณต้องการลบ "${confirm?.name}" (${confirm?.code}) ออกจากระบบหรือไม่? บริการทั้งหมดในหน่วยงานนี้จะถูกลบด้วย`}
        confirmLabel="ลบ Provider"
      />

      <Modal
        open={!!servicesModal}
        onClose={() => setServicesModal(null)}
        title={`บริการของ ${servicesModal?.name ?? ""}`}
        size="md"
        footer={
          <Button onClick={() => setServicesModal(null)}>
            ปิด
          </Button>
        }
      >
        {servicesModal &&
          (() => {
            const svcs = mockServices.filter(
              (s) => s.providerCode === servicesModal.code,
            );
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {svcs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#9CA3AF",
                      fontSize: "13px",
                      padding: "24px 0",
                      fontFamily:
                        "'Noto Sans Thai', 'Inter', sans-serif",
                    }}
                  >
                    ไม่พบบริการ
                  </div>
                ) : (
                  svcs.map((svc) => (
                    <div
                      key={svc.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          padding: "3px 10px",
                          borderRadius: "6px",
                          backgroundColor: "#EEF2FF",
                          color: "#4338CA",
                          fontSize: "11px",
                          fontWeight: 700,
                          fontFamily: "monospace",
                          letterSpacing: "0.04em",
                          marginTop: "1px",
                        }}
                      >
                        {svc.id}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#111827",
                              fontFamily:
                                "'Noto Sans Thai', 'Inter', sans-serif",
                            }}
                          >
                            {svc.name}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: "20px",
                              backgroundColor: svc.isActive
                                ? "#DCFCE7"
                                : "#F3F4F6",
                              color: svc.isActive
                                ? "#16A34A"
                                : "#9CA3AF",
                              fontFamily:
                                "'Noto Sans Thai', 'Inter', sans-serif",
                            }}
                          >
                            {svc.isActive
                              ? "ใช้งาน"
                              : "ปิดใช้งาน"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            marginTop: "3px",
                            fontFamily:
                              "'Noto Sans Thai', 'Inter', sans-serif",
                          }}
                        >
                          {svc.description}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
      </Modal>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={
          editPrv ? "แก้ไข ผู้ให้บริการ" : "เพิ่ม ผู้ให้บริการ ใหม่"
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
              {editPrv ? "บันทึก" : "เพิ่ม ผู้ให้บริการ"}
            </Button>
          </>
        }
      >
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
              gridTemplateColumns: "120px 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: "5px",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                Code <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="ARMO"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#FAFAFA",
                  letterSpacing: "0.05em",
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
                  marginBottom: "5px",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                ชื่อหน่วยงาน{" "}
                <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="กรม..."
                style={{
                  width: "100%",
                  padding: "9px 12px",
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
          </div>
          {[
            {
              label: "อีเมลผู้ดูแล",
              key: "contactEmail",
              placeholder: "api@example.mod.go.th",
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  display: "block",
                  marginBottom: "5px",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                {f.label}
              </label>
              <input
                value={(form as any)[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                placeholder={f.placeholder}
                style={{
                  width: "100%",
                  padding: "9px 12px",
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
          ))}
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                display: "block",
                marginBottom: "5px",
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
              rows={2}
              placeholder="อธิบายบทบาทหน่วยงาน"
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