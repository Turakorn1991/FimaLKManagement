import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  X,
  Save,
  Eye,
  Edit2,
} from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { DatePicker } from "../components/ui/date-picker";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DataTable, Column } from "../components/DataTable";

const FF = "'Noto Sans Thai', 'Inter', sans-serif";
const NAVY = "#003087";
const TEAL = "#00A8A8";
const DANGER = "#DC2626";

/* ─── Types ─────────────────────────────────────────────────── */
type ModalMode = "create" | "edit" | "view";

interface ModalServiceRow {
  serviceId: string;
  serviceName: string;
  provider: string;
  checked: boolean;
  isPermanent: boolean;
  expireDate: string;
}

interface ClientPerm {
  clientId: string;
  clientName: string;
  department: string;
  updatedAt: string;
  updatedBy: string;
  grants: {
    serviceId: string;
    isPermanent: boolean;
    expireDate: string;
  }[];
}

/* ─── Static data ───────────────────────────────────────────── */
const ALL_SERVICES = [
  // DOTI — กรมการอุตสาหกรรมทหาร
  {
    serviceId: "DOTI-0001",
    serviceName: "ใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (ยภ.2)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0002",
    serviceName: "ใบอนุญาตนำเข้ามาซึ่งยุทธภัณฑ์ (ยภ.3)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0003",
    serviceName: "ใบอนุญาตผลิตซึ่งยุทธภัณฑ์ (ยภ.4)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0004",
    serviceName: "ใบอนุญาตมีซึ่งยุทธภัณฑ์ (ยภ.5)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0005",
    serviceName: "หนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0006",
    serviceName: "หนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0007",
    serviceName:
      "หนังสืออนุญาตสั่ง/นำเข้าวัตถุ/อาวุธเพื่อผลิต (อ.8)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0008",
    serviceName:
      "หนังสืออนุญาตขนย้ายวัตถุ/อาวุธจากโรงงาน (อ.10)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0009",
    serviceName:
      "หนังสืออนุญาตขาย/จำหน่ายอาวุธในราชอาณาจักร (อ.17)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  {
    serviceId: "DOTI-0010",
    serviceName: "หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก (อ.16)",
    provider: "กรมการอุตสาหกรรมทหาร",
  },
  // DOPA — กรมการปกครอง
  {
    serviceId: "DOPA-0001",
    serviceName: "ข้อมูลทะเบียนราษฎร",
    provider: "กรมการปกครอง",
  },
  {
    serviceId: "DOPA-0002",
    serviceName: "ข้อมูลทะเบียนบ้าน (บุคคลทุกประเภท)",
    provider: "กรมการปกครอง",
  },
  {
    serviceId: "DOPA-0003",
    serviceName:
      "ข้อมูลใบอนุญาตสั่ง/นำเข้าอาวุธปืน เครื่องกระสุนฯ",
    provider: "กรมการปกครอง",
  },
  {
    serviceId: "DOPA-0004",
    serviceName: "ข้อมูลใบอนุญาตจำหน่ายอาวุธปืน เครื่องกระสุนฯ",
    provider: "กรมการปกครอง",
  },
  // RD — กรมสรรพากร
  {
    serviceId: "RD-0001",
    serviceName: "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
    provider: "กรมสรรพากร",
  },
  // DBD — กรมพัฒนาธุรกิจการค้า
  {
    serviceId: "DBD-0001",
    serviceName: "ทะเบียนหนังสือรับรองนิติบุคคล",
    provider: "กรมพัฒนาธุรกิจการค้า",
  },
  {
    serviceId: "DBD-0002",
    serviceName: "ทะเบียนรายชื่อผู้ถือหุ้น",
    provider: "กรมพัฒนาธุรกิจการค้า",
  },
  {
    serviceId: "DBD-0003",
    serviceName: "ทะเบียนธุรกิจของคนต่างด้าว",
    provider: "กรมพัฒนาธุรกิจการค้า",
  },
  // DIW — กรมโรงงานอุตสาหกรรม
  {
    serviceId: "DIW-0001",
    serviceName: "ใบอนุญาตประกอบกิจการโรงงาน (ร.ง. 4)",
    provider: "กรมโรงงานอุตสาหกรรม",
  },
  // RTP — สำนักงานตำรวจแห่งชาติ
  {
    serviceId: "RTP-0001",
    serviceName: "ทะเบียนประวัติอาชญากรรม",
    provider: "สำนักงานตำรวจแห่งชาติ",
  },
  // LED — กรมบังคับคดี
  {
    serviceId: "LED-0001",
    serviceName: "ข้อมูลบุคคลล้มละลาย",
    provider: "กรมบังคับคดี",
  },
  // DL — กรมที่ดิน
  {
    serviceId: "DL-0001",
    serviceName: "เอกสารสิทธิที่ดิน",
    provider: "กรมที่ดิน",
  },
];

const CLIENT_OPTIONS = [
  {
    clientId: "CLT-001",
    clientName: "ระบบสารบรรณอิเล็กทรอนิกส์",
    department: "กรมอุตสาหกรรมทหาร",
  },
  {
    clientId: "CLT-002",
    clientName: "MilLogistics Platform",
    department: "กรมพลาธิการทหาร",
  },
  {
    clientId: "CLT-003",
    clientName: "DefLicense Portal",
    department: "กรมสรรพาวุธทหาร",
  },
  {
    clientId: "CLT-004",
    clientName: "FinanceArmy Connect",
    department: "กรมการเงินทหาร",
  },
  {
    clientId: "CLT-005",
    clientName: "MapThai Military GIS",
    department: "กรมแผนที่ทหาร",
  },
  {
    clientId: "CLT-006",
    clientName: "HR-Defence System",
    department: "สำนักงานเลขา กห.",
  },
  {
    clientId: "CLT-007",
    clientName: "Intel Management App",
    department: "กรมข่าวทหาร",
  },
  {
    clientId: "CLT-008",
    clientName: "Procurement Portal",
    department: "กรมส่งกำลังบำรุงทหาร",
  },
];

const initClients: ClientPerm[] = [
  {
    clientId: "CLT-001",
    clientName: "ระบบสารบรรณอิเล็กทรอนิกส์",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "14 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOTI-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOTI-0002",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOPA-0001",
        isPermanent: false,
        expireDate: "2025-12-31",
      },
    ],
  },
  {
    clientId: "CLT-002",
    clientName: "MilLogistics Platform",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "12 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DBD-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "RD-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DIW-0001",
        isPermanent: true,
        expireDate: "",
      },
    ],
  },
  {
    clientId: "CLT-003",
    clientName: "DefLicense Portal",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "11 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOTI-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOTI-0002",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOTI-0003",
        isPermanent: false,
        expireDate: "2026-06-30",
      },
      {
        serviceId: "DOTI-0004",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOTI-0005",
        isPermanent: true,
        expireDate: "",
      },
    ],
  },
  {
    clientId: "CLT-004",
    clientName: "FinanceArmy Connect",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "9 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOTI-0007",
        isPermanent: false,
        expireDate: "2025-12-31",
      },
      {
        serviceId: "RTP-0001",
        isPermanent: false,
        expireDate: "2025-12-31",
      },
    ],
  },
  {
    clientId: "CLT-005",
    clientName: "MapThai Military GIS",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "14 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOPA-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOPA-0002",
        isPermanent: true,
        expireDate: "",
      },
    ],
  },
  {
    clientId: "CLT-006",
    clientName: "HR-Defence System",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "8 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOPA-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DOPA-0002",
        isPermanent: false,
        expireDate: "2026-03-31",
      },
      {
        serviceId: "LED-0001",
        isPermanent: false,
        expireDate: "2026-03-31",
      },
    ],
  },
  {
    clientId: "CLT-007",
    clientName: "Intel Management App",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "7 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DOTI-0001",
        isPermanent: false,
        expireDate: "2025-12-31",
      },
      {
        serviceId: "RTP-0001",
        isPermanent: false,
        expireDate: "2025-12-31",
      },
    ],
  },
  {
    clientId: "CLT-008",
    clientName: "Procurement Portal",
    department: "กรมการอุตสาหกรรมทหาร",
    updatedAt: "6 พ.ค. 2568",
    updatedBy: "ผู้ดูแลระบบ",
    grants: [
      {
        serviceId: "DBD-0001",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DBD-0002",
        isPermanent: true,
        expireDate: "",
      },
      {
        serviceId: "DL-0001",
        isPermanent: true,
        expireDate: "",
      },
    ],
  },
];

/* ─── Helper ─────────────────────────────────────────────────── */
function buildModalRows(
  grants: ClientPerm["grants"],
): ModalServiceRow[] {
  const map = new Map(grants.map((g) => [g.serviceId, g]));
  return ALL_SERVICES.map((svc) => {
    const g = map.get(svc.serviceId);
    return {
      ...svc,
      checked: !!g,
      isPermanent: g?.isPermanent ?? true,
      expireDate: g?.expireDate ?? "",
    };
  });
}

/* ─── Permission Modal ───────────────────────────────────────── */
interface PermissionModalProps {
  mode: ModalMode;
  editClient: ClientPerm | null;
  onClose: () => void;
  onSave: (clientId: string, rows: ModalServiceRow[]) => void;
}

function PermissionModal({
  mode,
  editClient,
  onClose,
  onSave,
}: PermissionModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const isReadOnly = isView;

  const [selectedClientId, setSelectedClientId] = useState(
    isCreate ? "" : (editClient?.clientId ?? ""),
  );
  const [rows, setRows] = useState<ModalServiceRow[]>(() =>
    editClient
      ? buildModalRows(editClient.grants)
      : buildModalRows([]),
  );

  useEffect(() => {
    if (editClient) {
      setSelectedClientId(editClient.clientId);
      setRows(buildModalRows(editClient.grants));
    } else {
      setSelectedClientId("");
      setRows(buildModalRows([]));
    }
  }, [editClient, mode]);

  const updateRow = (
    serviceId: string,
    patch: Partial<ModalServiceRow>,
  ) => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) =>
        r.serviceId === serviceId ? { ...r, ...patch } : r,
      ),
    );
  };

  const checkedCount = rows.filter((r) => r.checked).length;

  /* modal title */
  const title = isCreate
    ? "เพิ่มสิทธิ์ใหม่"
    : isEdit
      ? `แก้ไขสิทธิ์สำหรับ ${editClient?.clientName}`
      : `รายละเอียดสิทธิ์สำหรับ ${editClient?.clientName}`;

  /* header icon / badge color */
  const headerColor = isView ? "#7C3AED" : NAVY;
  const headerBg = isView ? "#F5F3FF" : "#EEF2FF";

  /* mode badge */
  const modeBadge = isCreate
    ? { label: "Create Mode", bg: "#ECFDF5", color: "#059669" }
    : isEdit
      ? { label: "Edit Mode", bg: "#FEF3C7", color: "#D97706" }
      : {
          label: "View Only Mode",
          bg: "#F3F4F6",
          color: "#6B7280",
        };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "820px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          fontFamily: FF,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                backgroundColor: headerBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isView ? (
                <Eye size={17} color={headerColor} />
              ) : (
                <ShieldCheck size={17} color={headerColor} />
              )}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {title}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    backgroundColor: modeBadge.bg,
                    color: modeBadge.color,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {modeBadge.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  marginTop: "2px",
                }}
              >
                {isCreate
                  ? "เลือก Client และกำหนดสิทธิ์การเข้าถึงบริการ"
                  : `Client ID: ${editClient?.clientId}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#F3F4F6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "transparent")
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: "4px",
              borderRadius: "6px",
              transition: "background-color 0.15s",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
          }}
        >
          {/* Client dropdown */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "7px",
              }}
            >
              Client / แอปพลิเคชัน
              {isCreate && (
                <span
                  style={{ color: DANGER, marginLeft: "2px" }}
                >
                  *
                </span>
              )}
            </label>
            <select
              value={selectedClientId}
              onChange={(e) =>
                isCreate && setSelectedClientId(e.target.value)
              }
              disabled={!isCreate}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
                fontFamily: FF,
                outline: "none",
                backgroundColor: !isCreate
                  ? "#F3F4F6"
                  : "white",
                color: !isCreate ? "#6B7280" : "#111827",
                cursor: !isCreate ? "not-allowed" : "pointer",
                appearance: !isCreate ? "none" : "auto",
              }}
            >
              {isCreate && (
                <option value="">-- เลือก Client --</option>
              )}
              {CLIENT_OPTIONS.map((c) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientId} — {c.clientName}
                </option>
              ))}
            </select>
            {!isCreate && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  marginTop: "5px",
                }}
              >
                {isView
                  ? "โหมดดูข้อมูลเท่านั้น — ไม่สามารถแก้ไขได้"
                  : "ไม่สามารถเปลี่ยน Client ได้ในโหมดแก้ไข"}
              </p>
            )}
          </div>

          {/* Service table label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {isCreate
                ? "เลือกบริการที่ต้องการให้สิทธิ์"
                : "บริการที่มีสิทธิ์"}
              {isView && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "10px",
                    color: "#7C3AED",
                    backgroundColor: "#F5F3FF",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  อ่านอย่างเดียว
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: NAVY,
                backgroundColor: "#EEF2FF",
                padding: "3px 10px",
                borderRadius: "20px",
              }}
            >
              {checkedCount} บริการ
            </span>
          </div>

          {/* Service table */}
          <div
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Head */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isView
                  ? "44px 1fr 140px 80px 150px"
                  : "44px 1fr 140px 80px 150px 90px",
                backgroundColor: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
                padding: "9px 14px",
                gap: "8px",
              }}
            >
              {[
                "เลือก",
                "ชื่อบริการ / Service ID",
                "Provider",
                "ถาวร",
                "วันที่หมดอายุ",
                ...(isView ? [] : [""]),
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textAlign:
                      i === 0 || i === 5 ? "center" : "left",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div
              style={{ maxHeight: "340px", overflowY: "auto" }}
            >
              {rows.map((row, idx) => (
                <div
                  key={row.serviceId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isView
                      ? "44px 1fr 140px 80px 150px"
                      : "44px 1fr 140px 80px 150px 90px",
                    padding: "10px 14px",
                    gap: "8px",
                    alignItems: "center",
                    borderBottom:
                      idx < rows.length - 1
                        ? "1px solid #F3F4F6"
                        : "none",
                    backgroundColor: row.checked
                      ? isView
                        ? "#FAFAFA"
                        : "#FAFEFF"
                      : "white",
                    transition: "background-color 0.1s",
                    opacity: isView && !row.checked ? 0.45 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={(e) =>
                        !isView &&
                        updateRow(row.serviceId, {
                          checked: e.target.checked,
                        })
                      }
                      disabled={isView}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: NAVY,
                        cursor: isView
                          ? "not-allowed"
                          : "pointer",
                        opacity: isView ? 0.6 : 1,
                      }}
                    />
                  </div>

                  {/* Service name + ID */}
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: row.checked
                          ? "#111827"
                          : "#9CA3AF",
                      }}
                    >
                      {row.serviceName}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#9CA3AF",
                        fontFamily: "monospace",
                        marginTop: "1px",
                      }}
                    >
                      {row.serviceId}
                    </div>
                  </div>

                  {/* Provider */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      lineHeight: 1.3,
                    }}
                  >
                    {row.provider}
                  </div>

                  {/* ถาวร toggle */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ToggleSwitch
                      checked={row.isPermanent}
                      onChange={(v) =>
                        !isView &&
                        updateRow(row.serviceId, {
                          isPermanent: v,
                          expireDate: v ? "" : row.expireDate,
                        })
                      }
                      disabled={!row.checked || isView}
                    />
                  </div>

                  {/* วันที่หมดอายุ */}
                  <div>
                    {row.checked && !row.isPermanent ? (
                      isView ? (
                        <div
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#374151",
                            fontFamily: "Inter, sans-serif",
                            cursor: "not-allowed",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          {row.expireDate || "—"}
                        </div>
                      ) : (
                        <DatePicker
                          value={
                            row.expireDate
                              ? row.expireDate.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            updateRow(row.serviceId, {
                              expireDate: (
                                e.target as HTMLInputElement
                              ).value,
                            })
                          }
                          min={
                            new Date()
                              .toISOString()
                              .split("T")[0]
                          }
                        />
                      )
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9CA3AF",
                        }}
                      >
                        {!row.checked ? "—" : "ไม่มีกำหนด"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isView && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                backgroundColor: "#F5F3FF",
                borderRadius: "8px",
                border: "1px solid #DDD6FE",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Eye size={14} color="#7C3AED" />
              <span
                style={{
                  fontSize: "12px",
                  color: "#7C3AED",
                  fontFamily: FF,
                }}
              >
                โหมดดูข้อมูลเท่านั้น — ไม่สามารถแก้ไขสิทธิ์ได้
                กรุณากด "แก้ไข" หากต้องการเปลี่ยนแปลง
              </span>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isView
              ? "flex-end"
              : "space-between",
            gap: "10px",
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            flexShrink: 0,
            backgroundColor: "#FAFAFA",
          }}
        >
          {/* Left: Delete button (Edit mode only) */}
          {!isView && <div>{isCreate && <div />}</div>}

          {/* Right: action buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#374151",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: FF,
              }}
            >
              {isView ? "ปิด" : "ยกเลิก"}
            </button>
            {!isView && (
              <button
                onClick={() => {
                  const id = isEdit
                    ? editClient!.clientId
                    : selectedClientId;
                  if (!id) return;
                  onSave(id, rows);
                  onClose();
                }}
                disabled={isCreate && !selectedClientId}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 22px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor:
                    isCreate && !selectedClientId
                      ? "#CBD5E1"
                      : NAVY,
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor:
                    isCreate && !selectedClientId
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: FF,
                }}
              >
                <Save size={14} />
                บันทึก
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Permissions Page ─────────────────────────────────── */
export function Permissions() {
  const [clients, setClients] =
    useState<ClientPerm[]>(initClients);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    mode: ModalMode;
    client: ClientPerm | null;
  }>({
    open: false,
    mode: "create",
    client: null,
  });
  const [confirm, setConfirm] = useState<ClientPerm | null>(
    null,
  );

  const openCreate = () =>
    setModal({ open: true, mode: "create", client: null });
  const openEdit = (c: ClientPerm) =>
    setModal({ open: true, mode: "edit", client: c });
  const openView = (c: ClientPerm) =>
    setModal({ open: true, mode: "view", client: c });
  const closeModal = () =>
    setModal((m) => ({ ...m, open: false }));

  const handleSave = (
    clientId: string,
    rows: ModalServiceRow[],
  ) => {
    const grants = rows
      .filter((r) => r.checked)
      .map((r) => ({
        serviceId: r.serviceId,
        isPermanent: r.isPermanent,
        expireDate: r.expireDate,
      }));
    setClients((prev) => {
      const exists = prev.find((c) => c.clientId === clientId);
      if (exists) {
        return prev.map((c) =>
          c.clientId === clientId
            ? { ...c, grants, updatedAt: "14 พ.ค. 2568" }
            : c,
        );
      }
      const opt = CLIENT_OPTIONS.find(
        (o) => o.clientId === clientId,
      )!;
      return [
        ...prev,
        {
          clientId: opt.clientId,
          clientName: opt.clientName,
          department: opt.department,
          updatedAt: "14 พ.ค. 2568",
          updatedBy: "ผู้ดูแลระบบ",
          grants,
        },
      ];
    });
  };

  const handleDelete = (clientId: string) => {
    setClients((prev) =>
      prev.filter((c) => c.clientId !== clientId),
    );
    setConfirm(null);
  };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.clientId.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  const columns: Column<ClientPerm>[] = [
    {
      key: "clientId",
      header: "Client ID",
      width: "110px",
      render: (row) => (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: NAVY,
            backgroundColor: "#EEF2FF",
            padding: "3px 8px",
            borderRadius: "5px",
          }}
        >
          {row.clientId}
        </span>
      ),
    },
    {
      key: "clientName",
      header: "แอปพลิเคชัน",
      render: (row) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              color: "#111827",
              fontSize: "13px",
              fontFamily: FF,
            }}
          >
            {row.clientName}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              marginTop: "2px",
              fontFamily: FF,
            }}
          >
            {row.department}
          </div>
        </div>
      ),
    },
    {
      key: "grants",
      header: "จำนวนบริการ",
      width: "180px",
      align: "center",
      render: (row) => (
        <button
          onClick={() => openView(row)}
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
            fontFamily: FF,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
        >
          {row.grants.length} บริการ
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
      ),
    },
    {
      key: "updatedAt",
      header: "อัปเดตล่าสุด",
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
                fontFamily: FF,
              }}
            >
              {dateStr}, {time} น.
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                marginTop: "2px",
                fontFamily: FF,
              }}
            >
              โดย {row.updatedBy}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "จัดการ",
      width: "120px",
      render: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
              color: NAVY,
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
    <div style={{ fontFamily: FF }}>
{/* Page header */}
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
              fontFamily: FF,
            }}
          >
            จัดการสิทธิ์บริการเชื่อมโยง
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              marginTop: "4px",
              fontFamily: FF,
            }}
          >
            คลิกตัวเลขจำนวน Services เพื่อดูรายละเอียด · คลิก
            "แก้ไข" เพื่อจัดการสิทธิ์
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          เพิ่มสิทธิ์ใหม่
        </Button>
      </div>

      {/* Table card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Search */}
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
        </div>

        {/* Table */}
        <DataTable
          key={search}
          columns={columns}
          data={filtered}
          keyField="clientId"
          emptyText="ไม่พบข้อมูล"
        />
      </div>

      {/* Modal */}
      {modal.open && (
        <PermissionModal
          mode={modal.mode}
          editClient={modal.client}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() =>
          confirm && handleDelete(confirm.clientId)
        }
        title="ยืนยันการลบสิทธิ์"
        message={`คุณต้องการลบสิทธิ์ทั้งหมดของ "${confirm?.clientName}" ออกจากระบบหรือไม่? Client จะไม่สามารถเข้าถึงบริการใดๆ ได้อีก`}
        confirmLabel="ลบสิทธิ์ทั้งหมด"
      />
    </div>
  );
}