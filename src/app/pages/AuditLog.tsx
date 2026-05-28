import { useState } from "react";
import {
  Search,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  FileSpreadsheet,
  Eye,
  ClipboardList,
} from "lucide-react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { DatePicker } from "../components/ui/date-picker";
import { DataTable, Column } from "../components/DataTable";

/* ── Types ──────────────────────────────────────────────────── */
interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "REVOKE" | "GRANT";
  entity: string;
  entityId: string;
  details: string;
  updatedAt: string;
  result: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
}

/* ── Constants ──────────────────────────────────────────────── */
const CHART_COLOR = "#003087";
const FF = "'Noto Sans Thai', 'Inter', sans-serif";

/* ── Mock data ──────────────────────────────────────────────── */
const mockAudit: AuditEntry[] = [
  { id: "AUD-0000", timestamp: "26 พ.ค. 2569, 15:10 น.", user: "นาย อนันต์ บุญมา", userRole: "ผู้ใช้ภายนอก", action: "LOGIN", entity: "System", entityId: "SYS", details: "พยายามเข้าสู่ระบบ — บัญชีถูกระงับโดยผู้ดูแลระบบ", updatedAt: "26 พ.ค. 2569", result: "failure", errorCode: "ERR-AUTH-403", errorMessage: "บัญชีผู้ใช้ถูกระงับโดยผู้ดูแลระบบ กรุณาติดต่อ helpdesk@mod.go.th" },
  { id: "AUD-0001", timestamp: "14 พ.ค. 2569, 14:28 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-011", details: "ให้สิทธิ์ CLT-006 เข้าถึง DOPA-0001 (ข้อมูลทะเบียนราษฎร)", updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0002", timestamp: "14 พ.ค. 2569, 13:55 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Service", entityId: "DOTI-0010", details: 'ปิดการให้บริการ "หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก (อ.16)" ชั่วคราว', updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0003", timestamp: "14 พ.ค. 2569, 11:30 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "CREATE", entity: "Provider", entityId: "PRV-012", details: "สร้าง Provider ใหม่: กรมที่ดิน (DL)", updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0004", timestamp: "14 พ.ค. 2569, 10:15 น.", user: "นาย อนันต์ บุญมา", userRole: "ผู้ใช้ภายนอก", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0005", timestamp: "14 พ.ค. 2569, 09:48 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0006", timestamp: "14 พ.ค. 2569, 09:22 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "REVOKE", entity: "Permission", entityId: "PRM-010", details: "เพิกถอนสิทธิ์ CLT-009 เข้าถึง DOTI-0005 (หนังสืออนุญาตส่งออกซึ่งยุทธภัณฑ์)", updatedAt: "14 พ.ค. 2569", result: "success" },
  { id: "AUD-0007", timestamp: "13 พ.ค. 2569, 17:05 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "DELETE", entity: "Service", entityId: "SVC-OLD", details: "ลบ Service: DOPA-OLD-v1 ที่ไม่ใช้งาน เรียบร้อย", updatedAt: "13 พ.ค. 2569", result: "success" },
  { id: "AUD-0008", timestamp: "13 พ.ค. 2569, 15:30 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Client", entityId: "CLT-004", details: "เปลี่ยนสถานะ CLT-004 (FinanceArmy Connect) เป็น Inactive", updatedAt: "13 พ.ค. 2569", result: "success" },
  { id: "AUD-0009", timestamp: "13 พ.ค. 2569, 14:10 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Permission", entityId: "PRM-002", details: "ขยายวันหมดอายุ PRM-002 ถึง 17 พ.ค. 2568", updatedAt: "13 พ.ค. 2569", result: "success" },
  { id: "AUD-0010", timestamp: "13 พ.ค. 2569, 11:00 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Service", entityId: "LOGI-0001", details: "สร้างบริการใหม่: จัดซื้อจัดจ้าง (กรมส่งกำลังบำรุงทหาร)", updatedAt: "13 พ.ค. 2569", result: "success" },
  { id: "AUD-0011", timestamp: "12 พ.ค. 2569, 16:45 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-008", details: "ให้สิทธิ์ CLT-007 (Intel App) เข้าถึง DOTI-0001 ชั่วคราว", updatedAt: "12 พ.ค. 2569", result: "success" },
  { id: "AUD-0012", timestamp: "12 พ.ค. 2569, 10:20 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Provider", entityId: "PRV-002", details: "แก้ไข Contact Email ของ DOPA เรียบร้อย", updatedAt: "12 พ.ค. 2569", result: "success" },
  { id: "AUD-0013", timestamp: "15 พ.ค. 2569, 15:10 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-012", details: "ให้สิทธิ์ CLT-003 (DefLicense Portal) เข้าถึง DOTI-0006 (หนังสืออนุญาตผ่านแดนซึ่งยุทธภัณฑ์)", updatedAt: "15 พ.ค. 2569", result: "success" },
  { id: "AUD-0014", timestamp: "15 พ.ค. 2569, 11:30 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Provider", entityId: "PRV-012", details: "สร้าง Provider ใหม่: กรมที่ดิน (DL)", updatedAt: "15 พ.ค. 2569", result: "success" },
  { id: "AUD-0015", timestamp: "15 พ.ค. 2569, 09:05 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "15 พ.ค. 2569", result: "success" },
  { id: "AUD-0016", timestamp: "16 พ.ค. 2569, 14:22 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Permission", entityId: "PRM-003", details: "ขยายวันหมดอายุสิทธิ์ CLT-001 → DOPA-0001 ถึง 31 ธ.ค. 2569", updatedAt: "16 พ.ค. 2569", result: "success" },
  { id: "AUD-0017", timestamp: "16 พ.ค. 2569, 10:45 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Service", entityId: "DL-0001", details: "เปิดการให้บริการ DL-0001 (เอกสารสิทธิที่ดิน)", updatedAt: "16 พ.ค. 2569", result: "success" },
  { id: "AUD-0018", timestamp: "17 พ.ค. 2569, 13:55 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "GRANT", entity: "Permission", entityId: "PRM-013", details: "ให้สิทธิ์ CLT-008 (Procurement Portal) เข้าถึง DL-0001 (เอกสารสิทธิที่ดิน)", updatedAt: "17 พ.ค. 2569", result: "success" },
  { id: "AUD-0019", timestamp: "17 พ.ค. 2569, 09:30 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Service", entityId: "DPIM-0001", details: "สร้างบริการใหม่: ข้อมูลประทานบัตร (กรมอุตสาหกรรมพื้นฐานและการเหมืองแร่)", updatedAt: "17 พ.ค. 2569", result: "success" },
  { id: "AUD-0020", timestamp: "18 พ.ค. 2569, 16:10 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "REVOKE", entity: "Permission", entityId: "PRM-004", details: "เพิกถอนสิทธิ์ CLT-004 (FinanceArmy Connect) เข้าถึง RTP-0001 หมดอายุ", updatedAt: "18 พ.ค. 2569", result: "success" },
  { id: "AUD-0021", timestamp: "18 พ.ค. 2569, 11:00 น.", user: "นาย อนันต์ บุญมา", userRole: "ผู้ใช้ภายนอก", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "18 พ.ค. 2569", result: "success" },
  { id: "AUD-0022", timestamp: "18 พ.ค. 2569, 08:50 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Provider", entityId: "PRV-009", details: "แก้ไขข้อมูล DMF (กรมเชื้อเพลิงธรรมชาติ) — อัปเดต Contact Email", updatedAt: "18 พ.ค. 2569", result: "success" },
  { id: "AUD-0023", timestamp: "19 พ.ค. 2569, 15:40 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-014", details: "ให้สิทธิ์ CLT-002 (MilLogistics Platform) เข้าถึง DPIM-0001 (ข้อมูลประทานบัตร)", updatedAt: "19 พ.ค. 2569", result: "success" },
  { id: "AUD-0024", timestamp: "19 พ.ค. 2569, 13:15 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Service", entityId: "DMF-0002", details: "อัปเดตคำอธิบาย DMF-0002 (ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด)", updatedAt: "19 พ.ค. 2569", result: "success" },
  { id: "AUD-0025", timestamp: "19 พ.ค. 2569, 09:00 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "19 พ.ค. 2569", result: "success" },
  { id: "AUD-0026", timestamp: "20 พ.ค. 2569, 14:30 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Permission", entityId: "PRM-005", details: "ขยายวันหมดอายุสิทธิ์ CLT-007 → DOTI-0001 ถึง 30 มิ.ย. 2570", updatedAt: "20 พ.ค. 2569", result: "success" },
  { id: "AUD-0027", timestamp: "20 พ.ค. 2569, 11:20 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Service", entityId: "IEAT-0001", details: "สร้างบริการใหม่: ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม (การนิคมอุตสาหกรรมแห่งประเทศไทย)", updatedAt: "20 พ.ค. 2569", result: "success" },
  { id: "AUD-0028", timestamp: "20 พ.ค. 2569, 08:45 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "DELETE", entity: "Service", entityId: "RD-OLD", details: "ลบ Service: RD-OLD ที่ไม่ใช้งาน เรียบร้อย", updatedAt: "20 พ.ค. 2569", result: "success" },
  { id: "AUD-0029", timestamp: "21 พ.ค. 2569, 16:55 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-015", details: "ให้สิทธิ์ CLT-005 (MapThai Military GIS) เข้าถึง IEAT-0001 (ข้อมูลการใช้ที่ดินในนิคมอุตสาหกรรม)", updatedAt: "21 พ.ค. 2569", result: "success" },
  { id: "AUD-0030", timestamp: "21 พ.ค. 2569, 14:05 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Service", entityId: "DOTI-0010", details: "เปิดการให้บริการ DOTI-0010 (หนังสืออนุญาตขาย/จำหน่ายอาวุธส่งออก อ.16) อีกครั้ง", updatedAt: "21 พ.ค. 2569", result: "success" },
  { id: "AUD-0031", timestamp: "21 พ.ค. 2569, 10:30 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "REVOKE", entity: "Permission", entityId: "PRM-006", details: "เพิกถอนสิทธิ์ CLT-006 → LED-0001 ตามคำขอหน่วยงาน", updatedAt: "21 พ.ค. 2569", result: "success" },
  { id: "AUD-0032", timestamp: "21 พ.ค. 2569, 08:30 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "21 พ.ค. 2569", result: "success" },
  { id: "AUD-0033", timestamp: "22 พ.ค. 2569, 15:20 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-016", details: "ให้สิทธิ์ CLT-001 (ระบบสารบรรณ) เข้าถึง DBD-0003 (ทะเบียนธุรกิจของคนต่างด้าว)", updatedAt: "22 พ.ค. 2569", result: "success" },
  { id: "AUD-0034", timestamp: "22 พ.ค. 2569, 11:45 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Service", entityId: "DOTI-0008", details: "อัปเดตคำอธิบาย DOTI-0008 (หนังสืออนุญาตขนย้ายวัตถุ/อาวุธจากโรงงาน อ.10)", updatedAt: "22 พ.ค. 2569", result: "success" },
  { id: "AUD-0035", timestamp: "22 พ.ค. 2569, 09:10 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "22 พ.ค. 2569", result: "success" },
  { id: "AUD-0036", timestamp: "23 พ.ค. 2569, 14:50 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Permission", entityId: "PRM-007", details: "ขยายวันหมดอายุสิทธิ์ CLT-003 → DOTI-0003 ถึง 31 ธ.ค. 2570", updatedAt: "23 พ.ค. 2569", result: "success" },
  { id: "AUD-0037", timestamp: "23 พ.ค. 2569, 10:30 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Service", entityId: "DOL-0001", details: "สร้างบริการใหม่: ทะเบียนแรงงานต่างด้าว (กรมแรงงาน)", updatedAt: "23 พ.ค. 2569", result: "success" },
  { id: "AUD-0038", timestamp: "24 พ.ค. 2569, 16:00 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "GRANT", entity: "Permission", entityId: "PRM-017", details: "ให้สิทธิ์ CLT-006 (HR-Defence System) เข้าถึง DOL-0001 (ทะเบียนแรงงานต่างด้าว)", updatedAt: "24 พ.ค. 2569", result: "success" },
  { id: "AUD-0039", timestamp: "24 พ.ค. 2569, 13:25 น.", user: "นาย อนันต์ บุญมา", userRole: "ผู้ใช้ภายนอก", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "24 พ.ค. 2569", result: "success" },
  { id: "AUD-0040", timestamp: "24 พ.ค. 2569, 09:00 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "UPDATE", entity: "Provider", entityId: "PRV-010", details: "แก้ไขข้อมูล RTP (สำนักงานตำรวจแห่งชาติ) — อัปเดต Contact Email", updatedAt: "24 พ.ค. 2569", result: "success" },
  { id: "AUD-0041", timestamp: "25 พ.ค. 2569, 15:35 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "REVOKE", entity: "Permission", entityId: "PRM-009", details: "เพิกถอนสิทธิ์ CLT-004 → DOTI-0007 หมดสัญญา", updatedAt: "25 พ.ค. 2569", result: "success" },
  { id: "AUD-0042", timestamp: "25 พ.ค. 2569, 11:10 น.", user: "ร.ท. สมหมาย จันทร์ดี", userRole: "เจ้าหน้าที่", action: "UPDATE", entity: "Service", entityId: "DOPA-0003", details: "อัปเดตคำอธิบาย DOPA-0003 (ข้อมูลใบอนุญาตสั่ง/นำเข้าอาวุธปืน เครื่องกระสุนฯ)", updatedAt: "25 พ.ค. 2569", result: "success" },
  { id: "AUD-0043", timestamp: "25 พ.ค. 2569, 08:55 น.", user: "พ.ต. ประเสริฐ แก้วมณี", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "25 พ.ค. 2569", result: "success" },
  { id: "AUD-0044", timestamp: "26 พ.ค. 2569, 14:15 น.", user: "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ", userRole: "ผู้ดูแลระบบ", action: "GRANT", entity: "Permission", entityId: "PRM-018", details: "ให้สิทธิ์ CLT-002 (MilLogistics Platform) เข้าถึง DOL-0001 (ทะเบียนแรงงานต่างด้าว)", updatedAt: "26 พ.ค. 2569", result: "success" },
  { id: "AUD-0045", timestamp: "26 พ.ค. 2569, 11:00 น.", user: "ส.ท. ธนพล สุขใจ", userRole: "ผู้ดูแลระบบ", action: "CREATE", entity: "Service", entityId: "DMF-0002", details: "เปิดใช้งานบริการ DMF-0002 (ข้อมูลแบบตรวจสอบปริมาณวัตถุระเบิด)", updatedAt: "26 พ.ค. 2569", result: "success" },
  { id: "AUD-0046", timestamp: "26 พ.ค. 2569, 09:00 น.", user: "ร.ต. กิตติพงษ์ ศรีสวัสดิ์", userRole: "เจ้าหน้าที่", action: "LOGIN", entity: "System", entityId: "SYS", details: "เข้าสู่ระบบผ่าน ThaID SSO สำเร็จ", updatedAt: "26 พ.ค. 2569", result: "success" },
];

/* ── Config & helpers ───────────────────────────────────────── */
const actionConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  CREATE: { label: "CREATE", bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  UPDATE: { label: "UPDATE", bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE" },
  DELETE: { label: "DELETE", bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  LOGIN:  { label: "LOGIN",  bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" },
  REVOKE: { label: "REVOKE", bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  GRANT:  { label: "GRANT",  bg: "#F0FDFA", color: "#0F766E", border: "#99F6E4" },
};

const ENTITIES = ["ทั้งหมด", "Permission", "Service", "Provider", "Client", "System"];

const userIpMap: Record<string, string> = {
  "พ.อ. ณรงค์ศักดิ์ วงษ์สุวรรณ": "10.10.1.11",
  "ส.ท. ธนพล สุขใจ": "10.10.1.22",
  "ร.ท. สมหมาย จันทร์ดี": "10.10.2.15",
  "ร.ต. กิตติพงษ์ ศรีสวัสดิ์": "10.10.2.31",
  "พ.ต. ประเสริฐ แก้วมณี": "10.10.2.45",
  "นาย อนันต์ บุญมา": "203.151.88.74",
};

function getStatusCode(a: AuditEntry): number {
  if (a.result === "success") return 200;
  const match = a.errorCode?.match(/(\d{3})$/);
  return match ? parseInt(match[1]) : 500;
}

function statusCodeColor(code: number) {
  if (code >= 200 && code < 300) return { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" };
  if (code >= 400 && code < 500) return { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" };
  return { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" };
}

const THAI_MONTHS: Record<string, string> = {
  "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
  "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
  "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12",
};
function parseThaiDate(ts: string): string {
  const match = ts.match(/(\d+)\s+(\S+\.\S+)\s+(\d{4})/);
  if (!match) return "";
  const [, day, monthThai, yearBE] = match;
  const month = THAI_MONTHS[monthThai] ?? "01";
  return `${parseInt(yearBE) - 543}-${month}-${day.padStart(2, "0")}`;
}

/* ── Page Component ─────────────────────────────────────────── */
export function AuditLog() {
  const today = new Date().toISOString().split("T")[0];
  const minus7 = new Date();
  minus7.setDate(minus7.getDate() - 7);
  const minus7Str = minus7.toISOString().split("T")[0];

  // Draft state
  const [dSearch, setDSearch] = useState("");
  const [dAction, setDAction] = useState("การกระทำ ทั้งหมด");
  const [dEntity, setDEntity] = useState("ทั้งหมด");
  const [dStatus, setDStatus] = useState("สถานะ ทั้งหมด");
  const [dFrom, setDFrom] = useState(minus7Str);
  const [dTo, setDTo] = useState(today);

  // Applied state
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("การกระทำ ทั้งหมด");
  const [entityFilter, setEntityFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("สถานะ ทั้งหมด");
  const [fromFilter, setFromFilter] = useState(minus7Str);
  const [toFilter, setToFilter] = useState(today);
  const [selectedAudit, setSelectedAudit] = useState<AuditEntry | null>(null);

  const applyFilters = () => {
    setSearch(dSearch); setActionFilter(dAction); setEntityFilter(dEntity);
    setStatusFilter(dStatus); setFromFilter(dFrom); setToFilter(dTo);
  };
  const clearFilters = () => {
    setDSearch(""); setDAction("การกระทำ ทั้งหมด"); setDEntity("ทั้งหมด");
    setDStatus("สถานะ ทั้งหมด"); setDFrom(""); setDTo("");
    setSearch(""); setActionFilter("การกระทำ ทั้งหมด"); setEntityFilter("ทั้งหมด");
    setStatusFilter("สถานะ ทั้งหมด"); setFromFilter(""); setToFilter("");
  };

  const filtered = mockAudit.filter((a) => {
    const q = search.toLowerCase();
    const matchQ = !q || a.user.toLowerCase().includes(q) || a.entity.toLowerCase().includes(q) || a.entityId.toLowerCase().includes(q) || a.details.toLowerCase().includes(q);
    const matchA = actionFilter === "การกระทำ ทั้งหมด" || a.action === actionFilter;
    const matchE = entityFilter === "ทั้งหมด" || a.entity === entityFilter;
    const matchSt = statusFilter === "สถานะ ทั้งหมด" ? true : statusFilter === "สำเร็จ" ? a.result === "success" : a.result === "failure";
    const entryDate = parseThaiDate(a.timestamp);
    return matchQ && matchA && matchE && matchSt && (!fromFilter || entryDate >= fromFilter) && (!toFilter || entryDate <= toFilter);
  });

  const selectStyle: React.CSSProperties = {
    width: "100%", height: "38px", padding: "0 12px", border: "1px solid #E5E7EB",
    borderRadius: "8px", fontSize: "13px", fontFamily: FF, outline: "none",
    backgroundColor: "white", cursor: "pointer", color: "#374151", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: "#4B5563",
    textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Inter, sans-serif",
  };

  const columns: Column<AuditEntry>[] = [
    {
      key: "id", header: "LOG ID", width: "120px",
      render: (a) => (
        <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 500, color: "#374151" }}>
          {a.id}
        </span>
      ),
    },
    {
      key: "timestamp", header: "วัน-เวลา", width: "185px", sortable: true,
      render: (a) => (
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
          {a.timestamp}
        </span>
      ),
    },
    {
      key: "user", header: "ผู้ดำเนินการ",
      render: (a) => (
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827", fontFamily: FF }}>
          {a.user}
        </span>
      ),
    },
    {
      key: "action", header: "การกระทำ", width: "110px", align: "center",
      render: (a) => {
        const cfg = actionConfig[a.action];
        return (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "3px 9px", borderRadius: "20px", backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: "11px", fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap" }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "entity", header: "เหตุการณ์",
      render: (a) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "monospace", backgroundColor: "#F3F4F6", color: "#374151", padding: "1px 7px", borderRadius: "4px", border: "1px solid #E5E7EB" }}>
              {a.entity}
            </span>
            <span style={{ fontSize: "10px", color: "#6B7280", fontFamily: "monospace" }}>{a.entityId}</span>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#111827", fontFamily: FF, lineHeight: 1.5 }}>
            {a.details}
          </div>
        </div>
      ),
    },
    {
      key: "result", header: "สถานะ", width: "118px", align: "center",
      render: (a) => {
        const ok = a.result === "success";
        return (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "3px 9px", minWidth: "82px", borderRadius: "20px", backgroundColor: ok ? "#ECFDF5" : "#FEF2F2", color: ok ? "#059669" : "#DC2626", border: `1px solid ${ok ? "#A7F3D0" : "#FECACA"}`, fontSize: "11px", fontWeight: 600, fontFamily: FF, whiteSpace: "nowrap" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: ok ? "#059669" : "#DC2626", display: "inline-block", flexShrink: 0 }} />
            {ok ? "สำเร็จ" : "ไม่สำเร็จ"}
          </span>
        );
      },
    },
    {
      key: "statusCode", header: "รหัสตอบกลับ", width: "90px", align: "center",
      render: (a) => {
        const code = getStatusCode(a);
        const cfg = statusCodeColor(code);
        return (
          <span style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: "20px", padding: "3px 9px", fontSize: "12px", fontWeight: 700, fontFamily: "monospace" }}>
            {code}
          </span>
        );
      },
    },
    {
      key: "ipAddress", header: "IP Address", width: "140px",
      render: (a) => (
        <span style={{ fontSize: "13px", fontWeight: 500, fontFamily: "monospace", color: "#374151" }}>
          {userIpMap[a.user] ?? "—"}
        </span>
      ),
    },
    {
      key: "detail", header: "#", width: "44px", align: "center",
      render: (a) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setSelectedAudit(a)}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EEF2FF"; e.currentTarget.style.borderColor = "#C7D2FE"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
            style={{ padding: "5px", border: "1px solid #E5E7EB", borderRadius: "6px", background: "white", cursor: "pointer", color: CHART_COLOR, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s, border-color 0.15s" }}
          >
            <Eye size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: FF }}>ประวัติการใช้งานระบบ (Audit Logs)</h1>
        <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "3px", fontFamily: FF }}>ข้อมูลการกระทำทุกประเภทภายในระบบ</p>
      </div>

      {/* Filter section */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "18px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SlidersHorizontal size={14} color="#4338CA" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: FF }}>ตัวกรองข้อมูล</span>
        </div>

        {/* Unified grid — same pattern as LogLinkage */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", columnGap: "12px" }}>

          {/* ── Row 1: filters ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>ช่วงวันที่</label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ flex: 1 }}><DatePicker value={dFrom} onChange={(e) => setDFrom(e.target.value)} placeholder="วันเริ่มต้น" /></div>
              <span style={{ fontSize: "12px", color: "#D1D5DB", flexShrink: 0 }}>—</span>
              <div style={{ flex: 1 }}><DatePicker value={dTo} onChange={(e) => setDTo(e.target.value)} placeholder="วันสิ้นสุด" min={dFrom || undefined} /></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>การกระทำ</label>
            <select value={dAction} onChange={(e) => setDAction(e.target.value)} style={selectStyle}>
              <option>การกระทำ ทั้งหมด</option>
              {Object.keys(actionConfig).map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>เหตุการณ์</label>
            <select value={dEntity} onChange={(e) => setDEntity(e.target.value)} style={selectStyle}>
              {ENTITIES.map((e) => (
                <option key={e} value={e}>{e === "ทั้งหมด" ? "เหตุการณ์ ทั้งหมด" : e}</option>
              ))}
            </select>
          </div>
          {/* สถานะ spans cols 4-5 → same width as two buttons */}
          <div style={{ gridColumn: "4 / 6", display: "flex", flexDirection: "column", gap: "5px", paddingBottom: "14px" }}>
            <label style={labelStyle}>สถานะ</label>
            <select value={dStatus} onChange={(e) => setDStatus(e.target.value)} style={selectStyle}>
              <option>สถานะ ทั้งหมด</option>
              <option>สำเร็จ</option>
              <option>ไม่สำเร็จ</option>
            </select>
          </div>

          {/* ── Separator ── */}
          <div style={{ gridColumn: "1 / 6", height: "1px", backgroundColor: "#F3F4F6", marginBottom: "14px" }} />

          {/* ── Row 2: search + buttons ── */}
          <div style={{ gridColumn: "1 / 4", position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input value={dSearch} onChange={(e) => setDSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyFilters()} placeholder="ค้นหา Log ID, ผู้ดำเนินการ, การกระทำ, เหตุการณ์..."
              style={{ width: "100%", height: "38px", padding: "0 12px 0 36px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", fontFamily: FF, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={applyFilters} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#002470")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = CHART_COLOR)}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "38px", padding: "0 20px", backgroundColor: CHART_COLOR, color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap", transition: "background-color 0.15s" }}>
            <Search size={13} />ค้นหา
          </button>
          <button onClick={clearFilters}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F3F4F6"; e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#6B7280"; }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "38px", padding: "0 20px", backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: FF, whiteSpace: "nowrap", transition: "all 0.15s" }}>
            <RotateCcw size={13} />ล้างตัวกรอง
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: FF }}>รายการข้อมูล Log</div>
          <Button icon={FileSpreadsheet} variant="success" size="sm">Export Excel</Button>
        </div>
        <DataTable
          key={`${search}-${actionFilter}-${entityFilter}-${statusFilter}-${fromFilter}-${toFilter}`}
          columns={columns} data={filtered} keyField="id" emptyText="ไม่พบรายการ Audit Log"
        />
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedAudit} onClose={() => setSelectedAudit(null)} title="รายละเอียด Log" subtitle="ประวัติการใช้งานระบบ" size="lg"
        icon={<ClipboardList size={17} color={CHART_COLOR} />} iconBg="#EEF2FF"
        footer={<Button variant="secondary" onClick={() => setSelectedAudit(null)}>ปิด</Button>}>
        {selectedAudit && (() => {
          const code = getStatusCode(selectedAudit);
          const ip = userIpMap[selectedAudit.user] ?? "—";
          const rtPool = ["45ms","67ms","88ms","112ms","134ms","156ms","201ms","245ms","312ms","389ms"];
          const idNum = parseInt(selectedAudit.id.replace(/\D/g, "")) || 0;
          const responseTime = rtPool[idNum % rtPool.length];
          const requestBody = JSON.stringify({
            action: selectedAudit.action,
            entity: selectedAudit.entity,
            entityId: selectedAudit.entityId,
            operator: selectedAudit.user,
            role: selectedAudit.userRole,
            ipAddress: ip,
          }, null, 2);
          const responseBody = selectedAudit.result === "success"
            ? JSON.stringify({ status: "success", statusCode: 200, message: selectedAudit.details, timestamp: selectedAudit.timestamp }, null, 2)
            : JSON.stringify({ status: "error", statusCode: code, errorCode: selectedAudit.errorCode, message: selectedAudit.errorMessage }, null, 2);

          const monoFields = ["Log ID", "การกระทำ", "รหัสตอบกลับ", "Response Time", "IP Address"];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* ── Metadata grid ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {([
                  ["Log ID",         selectedAudit.id],
                  ["วัน-เวลา",       selectedAudit.timestamp],
                  ["ผู้ดำเนินการ",   selectedAudit.user],
                  ["การกระทำ",       selectedAudit.action],
                  ["รหัสตอบกลับ",    String(code)],
                  ["Response Time",  responseTime],
                  ["IP Address",     ip],
                  ["เหตุการณ์",      `${selectedAudit.entity} (${selectedAudit.entityId})`],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: "13px", color: "#111827", fontFamily: monoFields.includes(label) ? "monospace" : FF, fontWeight: 400 }}>{value}</div>
                  </div>
                ))}
                {/* รายละเอียด — span 2 cols */}
                <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "10px 12px", gridColumn: "span 2" }}>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>รายละเอียด</div>
                  <div style={{ fontSize: "13px", color: "#111827", fontFamily: FF, lineHeight: 1.6 }}>{selectedAudit.details}</div>
                </div>
              </div>

              {/* ── Error box (failure only) — ข้อความเดียว เหมือน Modal อื่น ── */}
              {selectedAudit.result === "failure" && (
                <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#DC2626", fontFamily: "Inter, sans-serif" }}>
                    <AlertTriangle size={14} />ข้อมูลข้อผิดพลาด
                  </div>
                  <div style={{ fontSize: "13px", color: "#7F1D1D", fontFamily: FF, lineHeight: 1.6 }}>{selectedAudit.errorMessage}</div>
                </div>
              )}

              {/* ── Request Body / Response Body — same as LogLicense ── */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Request Body</div>
                <pre style={{ backgroundColor: "#1F2937", color: "#E5E7EB", borderRadius: "8px", padding: "12px", fontSize: "11px", fontFamily: "monospace", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{requestBody}</pre>
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Response Body</div>
                <pre style={{ backgroundColor: "#1F2937", color: "#E5E7EB", borderRadius: "8px", padding: "12px", fontSize: "11px", fontFamily: "monospace", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{responseBody}</pre>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
