import { LogPage, LogEntry } from "../components/LogPage";

/* ── Deterministic weighted picker ─────────────────────────── */
function lcg(seed: number) {
  return ((seed * 1664525 + 1013904223) >>> 0) / 0xffffffff;
}
function pick<T>(arr: T[], weights: number[], seed: number): T {
  const r = lcg(seed);
  let cum = 0;
  const total = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < arr.length; i++) {
    cum += weights[i] / total;
    if (r < cum) return arr[i];
  }
  return arr[arr.length - 1];
}

/* ── Static lists ───────────────────────────────────────────── */
const clients = [
  "DefLicense Portal",
  "FinanceArmy",
  "MilLogistics",
  "ระบบสารบรรณ",
  "Intel App",
];
const cids = [
  "CLT-003",
  "CLT-004",
  "CLT-002",
  "CLT-001",
  "CLT-007",
];
const clientW = [38, 24, 18, 13, 7]; // DefLicense dominates อท. usage

// 5 services matching Dashboard's Top 5 อท. services
const services = [
  "ใบอนุญาตสั่งเข้ามาซึ่งยุทธภัณฑ์ (ยภ.2)",
  "ใบอนุญาตนำเข้ามาซึ่งยุทธภัณฑ์ (ยภ.3)",
  "ใบอนุญาตมีซึ่งยุทธภัณฑ์ (ยภ.5)",
  "หนังสืออนุญาตสั่ง/นำเข้าวัตถุ/อาวุธเพื่อผลิต (อ.8)",
  "หนังสืออนุญาตขาย/จำหน่ายอาวุธในราชอาณาจักร (อ.17)",
];
const sids = [
  "DOTI-0001",
  "DOTI-0002",
  "DOTI-0004",
  "DOTI-0007",
  "DOTI-0009",
];
const serviceW = [38, 29, 22, 7, 4]; // proportional to Dashboard อท. volumes

// Status: 82% success, 10% 404, 5% 403, 3% 500
const statusPool = [
  ...Array(82).fill(200),
  ...Array(10).fill(404),
  ...Array(5).fill(403),
  ...Array(3).fill(500),
];
const times = [
  "55ms",
  "72ms",
  "88ms",
  "112ms",
  "134ms",
  "178ms",
  "201ms",
  "256ms",
  "312ms",
  "445ms",
];
const hours = ["08", "09", "10", "11", "12", "13", "14"];
const dates = [
  "14 พ.ค. 2569",
  "15 พ.ค. 2569",
  "16 พ.ค. 2569",
  "17 พ.ค. 2569",
  "18 พ.ค. 2569",
  "19 พ.ค. 2569",
  "20 พ.ค. 2569",
  "21 พ.ค. 2569",
  "22 พ.ค. 2569",
  "23 พ.ค. 2569",
  "24 พ.ค. 2569",
  "25 พ.ค. 2569",
  "26 พ.ค. 2569",
];

/* ── Generate 650 logs (13 days × 50/day) ───────────────────── */
const logs: LogEntry[] = Array.from({ length: 650 }, (_, i) => {
  const ci = clients.indexOf(pick(clients, clientW, i * 5 + 1));
  const si = services.indexOf(
    pick(services, serviceW, i * 11 + 3),
  );
  const code =
    statusPool[(lcg(i * 17 + 7) * statusPool.length) | 0];
  const time = times[(lcg(i * 13 + 9) * times.length) | 0];
  const min = String((i * 17) % 60).padStart(2, "0");
  const dateLabel = dates[Math.floor(i / 50) % dates.length];
  const licType =
    si === 0
      ? "ORDER_IN"
      : si === 1
        ? "IMPORT"
        : si === 2
          ? "POSSESS"
          : si === 3
            ? "RAW_IMPORT"
            : "SELL_OUT";

  return {
    id: `LIC-${String(20000 + i).padStart(5, "0")}`,
    timestamp: `${dateLabel}, ${hours[i % hours.length]}:${min} น.`,
    client: clients[ci],
    clientId: cids[ci],
    service: services[si],
    serviceId: sids[si],
    statusCode: code,
    responseTime: time,
    ipAddress: `10.201.${20 + ci}.${50 + (i % 40)}`,
    requestBody: `{"clientId":"${cids[ci]}","licenseType":"${licType}","idNumber":"${1234567 + i}","serviceId":"${sids[si]}"}`,
    responseBody:
      code === 200
        ? `{"status":"success","data":{"licenseNo":"WPN-${2024000 + i * 3}","type":"${services[si]}","holder":"นาย ตัวอย่าง ${i}","expiry":"2026-12-31","status":"valid"}}`
        : `{"status":"error","code":${code},"message":"${
            code === 404
              ? "License record not found"
              : code === 403
                ? "Access denied – insufficient permission"
                : "Service temporarily unavailable"
          }"}`,
  };
});

export function LogLicense() {
  return (
    <LogPage
      title="Log หนังสือ อท."
      breadcrumbLabel="Log หนังสือ อท."
      chartTitle="ค้นหาใบคำขอ/หนังสือ Request"
      logs={logs}
      chartColor="#00A8A8"
      clientOptions={clients}
      serviceOptions={services}
    />
  );
}