import { HistoryStatus, SeverityType, AlertStatus, ReportItem } from '../types';

// ─── Shared utility functions ─────────────────────────────────

// Chuyển "dd/MM/yyyy" + "HH:mm" thành timestamp để sắp xếp đúng theo thời gian thực tế
export function parseVNDateTime(ngay: string, gio: string): number {
  const [d, m, y] = ngay.split("/").map(Number);
  const [hh, mm] = gio.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0).getTime();
}

// Parse Vietnamese date string "DD/MM/YYYY HH:MM:SS"
export function parseVNDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!m) return null;
  const [, dd, mm, yyyy, hh = "0", mi = "0", ss = "0"] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
  return isNaN(d.getTime()) ? null : d;
}

// Format helpers
export const pad2 = (n: number) => String(n).padStart(2, "0");

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
}

export function getColor(name: string): string {
  const colors = ["#047857", "#1D4ED8", "#7C3AED", "#DC2626", "#D97706", "#0891B2", "#BE185D"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

// Bỏ dấu tiếng Việt + viết thường để so khớp linh hoạt
export function normalizeVN(s?: string) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Lấy sản lượng bất kể n8n đặt tên field là san_luong_tan hay san_luong
export function getSanLuong(item: ReportItem) {
  const v = item.san_luong_tan ?? item.san_luong;
  return v === undefined || v === null || v === "" ? undefined : v;
}

// Số ngày thực tế của 1 tháng trong năm
export function getDaysInMonth(month: number, year = 2026) {
  return new Date(year, month, 0).getDate();
}

// Sinh dữ liệu sản lượng theo ngày cho đúng tháng/năm được chọn
export function genProdByDay(month: number, year = 2026) {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const value = 450 + Math.round(Math.sin(dayNum / 3 + month) * 90);
    return { day: `${String(dayNum).padStart(2, "0")}/${String(month).padStart(2, "0")}`, value };
  });
}

export function genProgByDay(month: number, year = 2026) {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const value = 25 + Math.round(Math.cos(dayNum / 4 + month) * 7);
    return { day: `${String(dayNum).padStart(2, "0")}/${String(month).padStart(2, "0")}`, value };
  });
}

// Rút gọn tên công trường
export function simplifySiteName(name: string) {
  if (!name) return name;
  if (/^Cơ giới hóa\b/i.test(name)) return name;
  const daoLoMatch = name.match(/^Đào lò\s+(\d+)$/i);
  if (daoLoMatch) return `Đào lò ${daoLoMatch[1]}`;
  const khaiThacMatch = name.match(/^Khai thác\s+(\d+)$/i);
  if (khaiThacMatch) return `Khai thác ${khaiThacMatch[1]}`;
  const numMatch = name.match(/(\d+)$/);
  if (numMatch) return numMatch[1];
  return name;
}

// Config maps
export const SEVERITY_CFG: Record<SeverityType, { dot: string; badge: string; textColor: string }> = {
  "Nghiêm trọng": { dot: "bg-red-500",    badge: "bg-red-50 border border-red-200",    textColor: "text-red-700" },
  "Cảnh báo":     { dot: "bg-yellow-500", badge: "bg-yellow-50 border border-yellow-200", textColor: "text-yellow-700" },
  "Bình thường":  { dot: "bg-green-500",  badge: "bg-green-50 border border-green-200",  textColor: "text-green-700" },
};

export const ALERT_STATUS_CFG: Record<AlertStatus, { badge: string; textColor: string }> = {
  "Mới":          { badge: "bg-orange-50 border border-orange-200", textColor: "text-orange-700" },
  "Đang xử lý":   { badge: "bg-blue-50 border border-blue-200",   textColor: "text-blue-700" },
  "Chờ tiếp nhận": { badge: "bg-gray-100 border border-gray-200", textColor: "text-gray-600" },
  "Đã hoàn thành": { badge: "bg-green-50 border border-green-200", textColor: "text-green-700" },
};

export const HISTORY_STATUS_CFG: Record<HistoryStatus, { badge: string; textColor: string; dot: string }> = {
  "Hoàn thành":  { badge: "bg-green-50 border border-green-200",  textColor: "text-green-700",  dot: "bg-green-500" },
  "Đang xử lý": { badge: "bg-orange-50 border border-orange-200", textColor: "text-orange-700", dot: "bg-orange-500" },
  "Nháp":       { badge: "bg-gray-100 border border-gray-200",   textColor: "text-gray-600",   dot: "bg-gray-400" },
};

export const TAB_SEVERITY: Record<string, SeverityType | null> = {
  all: null, critical: "Nghiêm trọng", warning: "Cảnh báo", normal: "Bình thường",
};