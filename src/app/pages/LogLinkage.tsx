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
  "ระบบสารบรรณ",
  "MilLogistics",
  "Intel App",
  "Procurement",
  "MapThai GIS",
  "HR-Defence",
];
const cids = [
  "CLT-001",
  "CLT-002",
  "CLT-007",
  "CLT-008",
  "CLT-005",
  "CLT-006",
];
const clientW = [30, 22, 18, 12, 10, 8]; // realistic client usage weights

const services = [
  "ข้อมูลทะเบียนราษฎร",
  "ทะเบียนหนังสือรับรองนิติบุคคล",
  "ทะเบียนรายชื่อผู้ถือหุ้น",
  "ทะเบียนภาษีมูลค่าเพิ่ม ภพ.20",
  "ทะเบียนประวัติอาชญากรรม",
];
const sids = [
  "DOPA-0001",
  "DBD-0001",
  "DBD-0002",
  "RD-0001",
  "RTP-0001",
];
const serviceW = [40, 25, 18, 10, 7]; // proportional to dashboard volumes

// Status: 85% success, 8% 401, 5% 404, 2% 500
const statusPool = [
  ...Array(85).fill(200),
  ...Array(8).fill(401),
  ...Array(5).fill(404),
  ...Array(2).fill(500),
];
const times = [
  "42ms",
  "55ms",
  "67ms",
  "88ms",
  "95ms",
  "112ms",
  "123ms",
  "156ms",
  "201ms",
  "312ms",
];
const hours = ["08", "09", "10", "11", "12", "13", "14", "15"];
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

/* ── Generate 585 logs (13 days × 45/day) ───────────────────── */
const logs: LogEntry[] = Array.from({ length: 585 }, (_, i) => {
  const ci = clients.indexOf(pick(clients, clientW, i * 3 + 1));
  const si = services.indexOf(
    pick(services, serviceW, i * 7 + 2),
  );
  const code =
    statusPool[(lcg(i * 11 + 3) * statusPool.length) | 0];
  const time = times[(lcg(i * 13 + 5) * times.length) | 0];
  const min = String((i * 19) % 60).padStart(2, "0");
  const dateLabel = dates[Math.floor(i / 45) % dates.length];

  return {
    id: `LNK-${String(10000 + i).padStart(5, "0")}`,
    timestamp: `${dateLabel}, ${hours[i % hours.length]}:${min} น.`,
    client: clients[ci],
    clientId: cids[ci],
    service: services[si],
    serviceId: sids[si],
    statusCode: code,
    responseTime: time,
    ipAddress: `10.200.${10 + ci}.${100 + (i % 50)}`,
    requestBody: `{"clientId":"${cids[ci]}","serviceId":"${sids[si]}","query":{"refId":${2456300 + i}}}`,
    responseBody:
      code === 200
        ? `{"status":"success","data":{"id":${2456300 + i},"name":"ตัวอย่าง ${i}","service":"${services[si]}"}}`
        : `{"status":"error","code":${code},"message":"${
            code === 401
              ? "Unauthorized – invalid token"
              : code === 404
                ? "Record not found"
                : "Internal server error"
          }"}`,
  };
});

export function LogLinkage() {
  return (
    <LogPage
      title="Log Linkage2"
      breadcrumbLabel="Log Linkage2"
      chartTitle="Linkage2 Request"
      logs={logs}
      chartColor="#003087"
      clientOptions={clients}
      serviceOptions={services}
    />
  );
}