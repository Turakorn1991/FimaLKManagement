import { useState } from "react";
import { Search, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { DatePicker } from "../components/ui/date-picker";
import { DataTable, Column } from "../components/DataTable";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "REVOKE"
    | "GRANT";
  entity: string;
  entityId: string;
  details: string;
  updatedAt: string;
  result: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
}

const mockAudit: AuditEntry[] = [
  {
    id: "AUD-0001",
    timestamp: "14 พ.ค. 2569, 14:28 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-011",
    details:
      "ให้สิทธิ์ CLT-006 เข้าถึง DOPA-0001 (ข้อมูลทะเบียนราษฎร)",
    updatedAt: "14 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0002",
    timestamp: "14 พ.ค. 2569, 13:55 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Service",
    entityId: "DOTI-0010",
    details:
      'ปิดการให้บริการ "หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก (อ.16)" ชั่วคราว',
    updatedAt: "14 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0003",
    timestamp: "14 พ.ค. 2569, 11:30 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "CREATE",
    entity: "Provider",
    entityId: "PRV-012",
    details: "สร้าง Provider ใหม่: กรมที่ดิน (DL)",
    updatedAt: "14 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0004",
    timestamp: "14 พ.ค. 2569, 10:15 น.",
    user: "นาย อนันต์ บุญมา",
    userRole: "ผู้ใช้ภายนอก",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "พยายามเข้าสู่ระบบ — บัญชีถูกระงับ",
    updatedAt: "14 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-AUTH-403",
    errorMessage:
      "บัญชีผู้ใช้ถูกระงับโดยผู้ดูแลระบบ กรุณาติดต่อ helpdesk@mod.go.th",
  },
  {
    id: "AUD-0005",
    timestamp: "14 พ.ค. 2569, 09:48 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "14 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0006",
    timestamp: "14 พ.ค. 2569, 09:22 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "REVOKE",
    entity: "Permission",
    entityId: "PRM-010",
    details:
      "เพิกถอนสิทธิ์ CLT-009 เข้าถึง DOTI-0005 (หนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์)",
    updatedAt: "14 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0007",
    timestamp: "13 พ.ค. 2569, 17:05 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "DELETE",
    entity: "Service",
    entityId: "SVC-OLD",
    details: "ลบ Service: DOPA-OLD-v1 ที่ไม่ใช้งาน",
    updatedAt: "13 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-DEP-409",
    errorMessage:
      "ไม่สามารถลบได้ — มี Client ที่ยังใช้งาน Service นี้อยู่ (2 Client) กรุณาเพิกถอนสิทธิ์ก่อน",
  },
  {
    id: "AUD-0008",
    timestamp: "13 พ.ค. 2569, 15:30 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Client",
    entityId: "CLT-004",
    details:
      "เปลี่ยนสถานะ CLT-004 (FinanceArmy Connect) เป็น Inactive",
    updatedAt: "13 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0009",
    timestamp: "13 พ.ค. 2569, 14:10 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Permission",
    entityId: "PRM-002",
    details: "ขยายวันหมดอายุ PRM-002 ถึง 17 พ.ค. 2568",
    updatedAt: "13 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0010",
    timestamp: "13 พ.ค. 2569, 11:00 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Service",
    entityId: "LOGI-0001",
    details:
      "สร้างบริการใหม่: จัดซื้อจัดจ้าง (กรมส่งกำลังบำรุงทหาร)",
    updatedAt: "13 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0011",
    timestamp: "12 พ.ค. 2569, 16:45 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-008",
    details:
      "ให้สิทธิ์ CLT-007 (Intel App) เข้าถึง DOTI-0001 ชั่วคราว",
    updatedAt: "12 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0012",
    timestamp: "12 พ.ค. 2569, 10:20 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Provider",
    entityId: "PRV-002",
    details: "แก้ไข Contact Email ของ DOPA",
    updatedAt: "12 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-VALID-422",
    errorMessage:
      "อีเมลที่ระบุไม่ถูกต้อง: ต้องเป็น domain ภายใต้ .go.th",
  },
  // ── 15 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0013",
    timestamp: "15 พ.ค. 2569, 15:10 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-012",
    details:
      "ให้สิทธิ์ CLT-003 (DefLicense Portal) เข้าถึง DOTI-0006 (หนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์)",
    updatedAt: "15 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0014",
    timestamp: "15 พ.ค. 2569, 11:30 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Provider",
    entityId: "PRV-012",
    details: "สร้าง Provider ใหม่: กรมที่ดิน (DL)",
    updatedAt: "15 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0015",
    timestamp: "15 พ.ค. 2569, 09:05 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "15 พ.ค. 2569",
    result: "success",
  },
  // ── 16 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0016",
    timestamp: "16 พ.ค. 2569, 14:22 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Permission",
    entityId: "PRM-003",
    details:
      "ขยายวันหมดอายุสิทธิ์ CLT-001 → DOPA-0001 ถึง 31 ธ.ค. 2569",
    updatedAt: "16 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0017",
    timestamp: "16 พ.ค. 2569, 10:45 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Service",
    entityId: "DL-0001",
    details: "เปิดการให้บริการ DL-0001 (เอกสารสิทธิที่ดิน)",
    updatedAt: "16 พ.ค. 2569",
    result: "success",
  },
  // ── 17 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0018",
    timestamp: "17 พ.ค. 2569, 13:55 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-013",
    details:
      "ให้สิทธิ์ CLT-008 (Procurement Portal) เข้าถึง DL-0001 (เอกสารสิทธิที่ดิน)",
    updatedAt: "17 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0019",
    timestamp: "17 พ.ค. 2569, 09:30 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Service",
    entityId: "DPIM-0001",
    details:
      "สร้างบริการใหม่: ข้อมูลประทานบัตร (กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่)",
    updatedAt: "17 พ.ค. 2569",
    result: "success",
  },
  // ── 18 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0020",
    timestamp: "18 พ.ค. 2569, 16:10 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "REVOKE",
    entity: "Permission",
    entityId: "PRM-004",
    details:
      "เพิกถอนสิทธิ์ CLT-004 (FinanceArmy Connect) เข้าถึง RTP-0001 หมดอายุ",
    updatedAt: "18 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0021",
    timestamp: "18 พ.ค. 2569, 11:00 น.",
    user: "นาย อนันต์ บุญมา",
    userRole: "ผู้ใช้ภายนอก",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "พยายามเข้าสู่ระบบโดยไม่มีสิทธิ์",
    updatedAt: "18 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-AUTH-403",
    errorMessage:
      "ไม่มีสิทธิ์เข้าใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
  },
  {
    id: "AUD-0022",
    timestamp: "18 พ.ค. 2569, 08:50 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Provider",
    entityId: "PRV-009",
    details:
      "แก้ไขข้อมูล DMF (กรมเชื้อเพลิงธรรมชาติ) — อัปเดต Contact Email",
    updatedAt: "18 พ.ค. 2569",
    result: "success",
  },
  // ── 19 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0023",
    timestamp: "19 พ.ค. 2569, 15:40 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-014",
    details:
      "ให้สิทธิ์ CLT-002 (MilLogistics Platform) เข้าถึง DPIM-0001 (ข้อมูลประทานบัตร)",
    updatedAt: "19 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0024",
    timestamp: "19 พ.ค. 2569, 13:15 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Service",
    entityId: "DMF-0002",
    details:
      "อัปเดตคำอธิบาย DMF-0002 (ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด)",
    updatedAt: "19 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0025",
    timestamp: "19 พ.ค. 2569, 09:00 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "19 พ.ค. 2569",
    result: "success",
  },
  // ── 20 พ.ค. ───────────────────────────────────────────────────
  {
    id: "AUD-0026",
    timestamp: "20 พ.ค. 2569, 14:30 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Permission",
    entityId: "PRM-005",
    details:
      "ขยายวันหมดอายุสิทธิ์ CLT-007 → DOTI-0001 ถึง 30 มิ.ย. 2570",
    updatedAt: "20 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0027",
    timestamp: "20 พ.ค. 2569, 11:20 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Service",
    entityId: "IEAT-0001",
    details:
      "สร้างบริการใหม่: ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม (การนิคมอุตสาหกรรมแห่งประเทศไทย)",
    updatedAt: "20 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0028",
    timestamp: "20 พ.ค. 2569, 08:45 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "DELETE",
    entity: "Service",
    entityId: "RD-OLD",
    details: "ลบ Service: RD-OLD ที่ไม่ใช้งาน",
    updatedAt: "20 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-DEP-409",
    errorMessage:
      "ไม่สามารถลบได้ — มี Client ที่ยังใช้งาน Service นี้อยู่ (1 Client)",
  },
  // ── 21 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0029",
    timestamp: "21 พ.ค. 2569, 16:55 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-015",
    details:
      "ให้สิทธิ์ CLT-005 (MapThai Military GIS) เข้าถึง IEAT-0001 (ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม)",
    updatedAt: "21 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0030",
    timestamp: "21 พ.ค. 2569, 14:05 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Service",
    entityId: "DOTI-0010",
    details:
      "เปิดการให้บริการ DOTI-0010 (หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก อ.16) อีกครั้ง",
    updatedAt: "21 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0031",
    timestamp: "21 พ.ค. 2569, 10:30 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "REVOKE",
    entity: "Permission",
    entityId: "PRM-006",
    details: "เพิกถอนสิทธิ์ CLT-006 → LED-0001 ตามคำขอหน่วยงาน",
    updatedAt: "21 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0032",
    timestamp: "21 พ.ค. 2569, 08:30 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "21 พ.ค. 2569",
    result: "success",
  },
  // ── 22 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0033",
    timestamp: "22 พ.ค. 2569, 15:20 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-016",
    details:
      "ให้สิทธิ์ CLT-001 (ระบบสารบรรณ) เข้าถึง DBD-0003 (ทะเบียนธุรกิจของคนต่างด้าว)",
    updatedAt: "22 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0034",
    timestamp: "22 พ.ค. 2569, 11:45 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Service",
    entityId: "DOTI-0008",
    details:
      "อัปเดตคำอธิบาย DOTI-0008 (หนังสืออนุญาตขนย้ายวัตถุ/อาวุธจากโรงงาน อ.10)",
    updatedAt: "22 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0035",
    timestamp: "22 พ.ค. 2569, 09:10 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "22 พ.ค. 2569",
    result: "success",
  },
  // ── 23 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0036",
    timestamp: "23 พ.ค. 2569, 14:50 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Permission",
    entityId: "PRM-007",
    details:
      "ขยายวันหมดอายุสิทธิ์ CLT-003 → DOTI-0003 ถึง 31 ธ.ค. 2570",
    updatedAt: "23 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0037",
    timestamp: "23 พ.ค. 2569, 10:30 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Service",
    entityId: "DOL-0001",
    details:
      "สร้างบริการใหม่: ทะเบียนแรงงานต่างด้าว (กรมแรงงาน)",
    updatedAt: "23 พ.ค. 2569",
    result: "success",
  },
  // ── 24 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0038",
    timestamp: "24 พ.ค. 2569, 16:00 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-017",
    details:
      "ให้สิทธิ์ CLT-006 (HR-Defence System) เข้าถึง DOL-0001 (ทะเบียนแรงงานต่างด้าว)",
    updatedAt: "24 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0039",
    timestamp: "24 พ.ค. 2569, 13:25 น.",
    user: "นาย อนันต์ บุญมา",
    userRole: "ผู้ใช้ภายนอก",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details:
      "พยายามเข้าสู่ระบบ — รหัสผ่านไม่ถูกต้องเกิน 3 ครั้ง บัญชีถูกล็อก",
    updatedAt: "24 พ.ค. 2569",
    result: "failure",
    errorCode: "ERR-AUTH-429",
    errorMessage:
      "บัญชีถูกล็อกชั่วคราว กรุณาติดต่อ helpdesk@mod.go.th",
  },
  {
    id: "AUD-0040",
    timestamp: "24 พ.ค. 2569, 09:00 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "UPDATE",
    entity: "Provider",
    entityId: "PRV-010",
    details:
      "แก้ไขข้อมูล RTP (สำนักงานตำรวจแห่งชาติ) — อัปเดต Contact Email",
    updatedAt: "24 พ.ค. 2569",
    result: "success",
  },
  // ── 25 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0041",
    timestamp: "25 พ.ค. 2569, 15:35 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "REVOKE",
    entity: "Permission",
    entityId: "PRM-009",
    details: "เพิกถอนสิทธิ์ CLT-004 → DOTI-0007 หมดสัญญา",
    updatedAt: "25 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0042",
    timestamp: "25 พ.ค. 2569, 11:10 น.",
    user: "ร.ท. สมหมาย จันทร์ดี",
    userRole: "เจ้าหน้าที่",
    action: "UPDATE",
    entity: "Service",
    entityId: "DOPA-0003",
    details:
      "อัปเดตคำอธิบาย DOPA-0003 (ข้อมูลใบอนุญาตสั่ง/นำเข้าอาวุธปืน เครื่องกระสุนฯ)",
    updatedAt: "25 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0043",
    timestamp: "25 พ.ค. 2569, 08:55 น.",
    user: "พ.ต. ประเสริฐ แก้วมณี",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "25 พ.ค. 2569",
    result: "success",
  },
  // ── 26 พ.ค. 2569 ──────────────────────────────────────────────
  {
    id: "AUD-0044",
    timestamp: "26 พ.ค. 2569, 14:15 น.",
    user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ",
    userRole: "ผู้ดูแลระบบ",
    action: "GRANT",
    entity: "Permission",
    entityId: "PRM-018",
    details:
      "ให้สิทธิ์ CLT-002 (MilLogistics Platform) เข้าถึง DOL-0001 (ทะเบียนแรงงานต่างด้าว)",
    updatedAt: "26 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0045",
    timestamp: "26 พ.ค. 2569, 11:00 น.",
    user: "ส.ท. ธนพล สุขใจ",
    userRole: "ผู้ดูแลระบบ",
    action: "CREATE",
    entity: "Service",
    entityId: "DMF-0002",
    details:
      "เปิดใช้งานบริการ DMF-0002 (ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด)",
    updatedAt: "26 พ.ค. 2569",
    result: "success",
  },
  {
    id: "AUD-0046",
    timestamp: "26 พ.ค. 2569, 09:00 น.",
    user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์",
    userRole: "เจ้าหน้าที่",
    action: "LOGIN",
    entity: "System",
    entityId: "SYS",
    details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ",
    updatedAt: "26 พ.ค. 2569",
    result: "success",
  },
];

const actionConfig: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  CREATE: {
    label: "CREATE",
    bg: "#ECFDF5",
    color: "#059669",
    border: "#A7F3D0",
  },
  UPDATE: {
    label: "UPDATE",
    bg: "#EEF2FF",
    color: "#4338CA",
    border: "#C7D2FE",
  },
  DELETE: {
    label: "DELETE",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
  },
  LOGIN: {
    label: "LOGIN",
    bg: "#F9FAFB",
    color: "#6B7280",
    border: "#E5E7EB",
  },
  REVOKE: {
    label: "REVOKE",
    bg: "#FFF7ED",
    color: "#C2410C",
    border: "#FDBA74",
  },
  GRANT: {
    label: "GRANT",
    bg: "#F0FDFA",
    color: "#0F766E",
    border: "#99F6E4",
  },
};

const ENTITIES = [
  "ทั้งหมด",
  "Permission",
  "Service",
  "Provider",
  "Client",
  "System",
];

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

export function AuditLog() {
  const today = new Date().toISOString().split("T")[0];
  const todayMinus7Days = new Date();
  todayMinus7Days.setDate(todayMinus7Days.getDate() - 7);
  const todayMinus7DaysStr = todayMinus7Days
    .toISOString()
    .split("T")[0];

  // Draft state
  const [dSearch, setDSearch] = useState("");
  const [dEntity, setDEntity] = useState("ทั้งหมด");
  const [dAction, setDAction] = useState("การกระทำ ทั้งหมด");
  const [dResult, setDResult] = useState("ผลลัพธ์ ทั้งหมด");
  const [dFrom, setDFrom] = useState(todayMinus7DaysStr);
  const [dTo, setDTo] = useState(today);

  // Applied state
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("ทั้งหมด");
  const [actionFilter, setActionFilter] = useState(
    "การกระทำ ทั้งหมด",
  );
  const [resultFilter, setResultFilter] = useState(
    "ผลลัพธ์ ทั้งหมด",
  );
  const [fromFilter, setFromFilter] = useState(
    todayMinus7DaysStr,
  );
  const [toFilter, setToFilter] = useState(today);

  const [selectedAudit, setSelectedAudit] =
    useState<AuditEntry | null>(null);

  const applyFilters = () => {
    setSearch(dSearch);
    setEntityFilter(dEntity);
    setActionFilter(dAction);
    setResultFilter(dResult);
    setFromFilter(dFrom);
    setToFilter(dTo);
  };

  const clearFilters = () => {
    setDSearch("");
    setDEntity("ทั้งหมด");
    setDAction("การกระทำ ทั้งหมด");
    setDResult("ผลลัพธ์ ทั้งหมด");
    setDFrom("");
    setDTo("");
    setSearch("");
    setEntityFilter("ทั้งหมด");
    setActionFilter("การกระทำ ทั้งหมด");
    setResultFilter("ผลลัพธ์ ทั้งหมด");
    setFromFilter("");
    setToFilter("");
  };

  const filtered = mockAudit.filter((a) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      a.user.toLowerCase().includes(q) ||
      a.entity.toLowerCase().includes(q) ||
      a.entityId.toLowerCase().includes(q) ||
      a.details.toLowerCase().includes(q);
    const matchE =
      entityFilter === "ทั้งหมด" || a.entity === entityFilter;
    const matchA =
      actionFilter === "การกระทำ ทั้งหมด" ||
      a.action === actionFilter;
    const matchR =
      resultFilter === "ผลลัพธ์ ทั้งหมด" ||
      (resultFilter === "สำเร็จ" && a.result === "success") ||
      (resultFilter === "ไม่สำเร็จ" && a.result === "failure");
    const entryDate = parseThaiDate(a.timestamp);
    const matchFrom = !fromFilter || entryDate >= fromFilter;
    const matchTo = !toFilter || entryDate <= toFilter;
    return (
      matchQ &&
      matchE &&
      matchA &&
      matchR &&
      matchFrom &&
      matchTo
    );
  });

  const columns: Column<AuditEntry>[] = [
    {
      key: "timestamp",
      header: "เวลา",
      width: "170px",
      render: (a) => (
        <span
          style={{
            fontSize: "12px",
            color: "#374151",
            fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {a.timestamp}
        </span>
      ),
    },
    {
      key: "user",
      header: "ผู้ดำเนินการ",
      render: (a) => (
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#111827",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {a.user}
          </div>
          <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
            {a.userRole}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "การกระทำ",
      width: "110px",
      render: (a) => {
        const cfg = actionConfig[a.action];
        return (
          <span
            style={{
              display: "inline-block",
              padding: "3px 8px",
              borderRadius: "20px",
              backgroundColor: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "entity",
      header: "ระบบ",
      width: "130px",
      render: (a) => (
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#374151",
              fontFamily: "monospace",
            }}
          >
            {a.entity}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              fontFamily: "monospace",
            }}
          >
            {a.entityId}
          </div>
        </div>
      ),
    },
    {
      key: "details",
      header: "รายละเอียด",
      render: (a) => (
        <span
          style={{
            fontSize: "12px",
            color: "#374151",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          {a.details}
        </span>
      ),
    },
    {
      key: "result",
      header: "ผลลัพธ์",
      width: "120px",
      render: (a) => {
        const isFailed = a.result === "failure";
        return (
          <button
            onClick={() => isFailed && setSelectedAudit(a)}
            onMouseEnter={(e) => {
              if (isFailed)
                e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: isFailed ? "pointer" : "default",
              transition: "opacity 0.15s",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "20px",
                backgroundColor: isFailed
                  ? "#FEF2F2"
                  : "#ECFDF5",
                color: isFailed ? "#DC2626" : "#059669",
                border: `1px solid ${isFailed ? "#FECACA" : "#A7F3D0"}`,
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {isFailed ? (
                <AlertTriangle size={10} />
              ) : (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#059669",
                    display: "inline-block",
                  }}
                />
              )}
              {isFailed ? "ไม่สำเร็จ" : "สำเร็จ"}
            </span>
          </button>
        );
      },
    },
  ];

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
          รายงาน Event ระบบ (Audit Log)
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            marginTop: "3px",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          บันทึกการกระทำทุกประเภทภายในระบบ —
          ไม่สามารถแก้ไขหรือลบได้
        </p>
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
            gridTemplateColumns: "repeat(24, 1fr)",
            gap: "8px",
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
              gridColumn: "span 6",
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

          {/* Entity */}
          <select
            value={dEntity}
            onChange={(e) => setDEntity(e.target.value)}
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
            {ENTITIES.map((e) => (
              <option key={e} value={e}>
                {e === "ทั้งหมด" ? "ระบบ ทั้งหมด" : e}
              </option>
            ))}
          </select>

          {/* Action */}
          <select
            value={dAction}
            onChange={(e) => setDAction(e.target.value)}
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
            <option>การกระทำ ทั้งหมด</option>
            {Object.keys(actionConfig).map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          {/* Result */}
          <select
            value={dResult}
            onChange={(e) => setDResult(e.target.value)}
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
            <option>ผลลัพธ์ ทั้งหมด</option>
            <option>สำเร็จ</option>
            <option>ไม่สำเร็จ</option>
          </select>
        </div>

        {/* Row 2: search + buttons */}
        <div
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
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
              placeholder="ค้นหาผู้ดำเนินการ, Entity, รายละเอียด..."
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
        {/* Card header */}
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
            รายการ Audit Log
            {filtered.filter((a) => a.result === "failure")
              .length > 0 && (
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "12px",
                  color: "#DC2626",
                  fontWeight: 500,
                }}
              >
                ·{" "}
                {
                  filtered.filter((a) => a.result === "failure")
                    .length
                }{" "}
                รายการล้มเหลว
              </span>
            )}
          </div>
          <Button variant="secondary" size="sm">
            Export Audit Log
          </Button>
        </div>

        <DataTable
          key={`${search}-${entityFilter}-${actionFilter}-${resultFilter}-${fromFilter}-${toFilter}`}
          columns={columns}
          data={filtered}
          keyField="id"
          emptyText="ไม่พบรายการ Audit Log"
        />
      </div>

      {/* Error detail modal */}
      <Modal
        open={!!selectedAudit}
        onClose={() => setSelectedAudit(null)}
        title="รายละเอียดข้อผิดพลาด"
        subtitle={selectedAudit?.id}
        size="lg"
        footer={
          <Button
            variant="secondary"
            onClick={() => setSelectedAudit(null)}
          >
            ปิด
          </Button>
        }
      >
        {selectedAudit && (
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
                ["Audit ID", selectedAudit.id],
                ["เวลา", selectedAudit.timestamp],
                [
                  "ผู้ดำเนินการ",
                  `${selectedAudit.user} (${selectedAudit.userRole})`,
                ],
                ["การกระทำ", selectedAudit.action],
                [
                  "ระบบ",
                  `${selectedAudit.entity} (${selectedAudit.entityId})`,
                ],
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
                        "Audit ID",
                        "การกระทำ",
                        "ระบบ",
                      ].includes(label)
                        ? "monospace"
                        : "'Noto Sans Thai', 'Inter', sans-serif",
                      fontWeight:
                        label === "Audit ID" ? 700 : 400,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
              <div
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  gridColumn: "span 2",
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
                  รายละเอียด
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#111827",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                >
                  {selectedAudit.details}
                </div>
              </div>
            </div>

            {/* Error section */}
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#DC2626",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <AlertTriangle size={14} />
                ข้อมูลข้อผิดพลาด
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "3px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Error Code
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#DC2626",
                      backgroundColor: "#FEE2E2",
                      padding: "3px 10px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedAudit.errorCode}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "3px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Error Message
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#7F1D1D",
                      fontFamily:
                        "'Noto Sans Thai', 'Inter', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedAudit.errorMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}