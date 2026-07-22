// ─────────────────────────────────────────────────────────────────────────────
// MobileApp.tsx
// Giao diện mobile (auto-render khi useDeviceDetect() === true) của Production
// Management System. Cùng backend, cùng API endpoints với DesktopApp.tsx.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import {
  Upload, Bell, LayoutDashboard, FileText, PlusCircle, History,
  AlertTriangle, CheckCircle, AlertCircle, Search, X, ChevronRight, ChevronDown,
  Loader2, Download, Clock, MapPin, User, Layers, Package, ArrowUpRight,
  Info, Calendar, RefreshCw, Eye, Filter, Sparkles, Shield, CheckCircle2,
} from "lucide-react";

// ─── URL server (đồng bộ với Desktop) ────────────────────────────────────────
const N8N_WEBHOOK_URL =
  (import.meta as any)?.env?.VITE_N8N_WEBHOOK_URL
  || "https://n8n-proxy.manhtoan7620005.workers.dev/webhook/nhap-bao-cao";
const N8N_OVERVIEW_URL =
  (import.meta as any)?.env?.VITE_N8N_OVERVIEW_URL || "/api/tong-quan";
const N8N_DUONG_LO_URL =
  (import.meta as any)?.env?.VITE_N8N_DUONG_LO_URL || "/api/duong-lo";
const N8N_BAO_CAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_LIST_URL || "/api/bao-cao";
const N8N_BAO_CAO_DETAIL_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_DETAIL_URL || "/api/bao-cao";
const N8N_CANH_BAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_CANH_BAO_LIST_URL || "/api/canh-bao";

// ─── Bảng màu dùng chung cho giao diện mobile ────────────────────────────────
const C = {
  primary:       "#2563EB",
  primaryLight:  "#DBEAFE",
  success:       "#059669",
  successLight:  "#D1FAE5",
  warning:       "#D97706",
  warningLight:  "#FEF3C7",
  danger:        "#DC2626",
  dangerLight:   "#FEE2E2",
  dark:          "#0F172A",
  bg:            "#F8FAFC",
  card:          "#FFFFFF",
  border:        "#E2E8F0",
  muted:         "#64748B",
  text:          "#1E293B",
  textLight:     "#94A3B8",
};

// ─── Các kiểu dữ liệu (đồng bộ với Desktop) ──────────────────────────────────
type MonthSummary = {
  thang: string;
  tong_san_luong: string;
  tong_tien_do: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};
type DaySummary = {
  ngay: string;
  san_luong_ngay: string;
  tien_do_ngay: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};
type KpiSummary = {
  san_luong_thuc_te: number;
  san_luong_ke_hoach: number;
  san_luong_ty_le: number;
  tien_do_thuc_te: number;
  tien_do_ke_hoach: number;
  tien_do_ty_le: number;
};
type TunnelData = {
  duong_lo: string;
  ngay_bao_cao: string;
  thoi_gian_bao_cao: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};
type BaoCaoListItem = {
  report_id: number;
  created_at: string;
  ngay: string | null;
  ca: number | string | null;
  duong_lo: string | null;
  don_vi_thi_cong: string | null;
  nguoi_bao_cao: string | null;
  so_dong_ai: number;
  so_dong_duong_lo: number;
  co_text: boolean;
  tinh_trang: string;
};
type BaoCaoDetail = {
  report: { id: number; created_at: string };
  ai_output: any[];
  duong_lo: any[];
  text_raw: { report_id: number; noi_dung: string } | null;
};
type CanhBaoListItem = {
  id: number;
  report_id: number;
  ngay: string | null;
  ca: number | null;
  duong_lo: string | null;
  vi_tri: string | null;
  severity: string;
  noi_dung: string;
  mo_ta: string | null;
  trang_thai: string;
  nguoi_xu_ly: string | null;
  ghi_chu_xu_ly: string | null;
  created_at: string;
  updated_at: string;
};
type ReportItem = {
  ma_bao_cao?: string;
  ngay?: string;
  ca?: string | number;
  don_vi_thi_cong?: string;
  nguoi_bao_cao?: string;
  so_lao_dong?: string | number;
  san_luong?: string | number;
  san_luong_tan?: string | number;
  tien_do_dao_lo?: string | number;
  dao_lo_2?: string | number;
  xen_lo_2?: string | number;
  bo_tri_lao_dong?: string;
  ghi_chu?: string | number;
  tinh_trang?: string;
  noi_dung_canh_bao?: string;
  [key: string]: any;
};
type SubmitStatus = "idle" | "processing" | "success" | "error";
type AlertTab = "all" | "critical" | "warning" | "normal";
type SeverityType = "Nghiêm trọng" | "Cảnh báo" | "Bình thường";
type AlertStatus = "Mới" | "Đang xử lý" | "Chờ tiếp nhận" | "Đã hoàn thành";

// ─── Cấu hình badge / severity / status ──────────────────────────────────────
const SEVERITY_CFG: Record<SeverityType, { dot: string; badge: string; text: string; border: string }> = {
  "Nghiêm trọng": { dot:"bg-red-500",    badge:"bg-red-50 border-red-200",    text:"text-red-700",    border:"border-l-red-500" },
  "Cảnh báo":     { dot:"bg-amber-500",  badge:"bg-amber-50 border-amber-200", text:"text-amber-700",  border:"border-l-amber-500" },
  "Bình thường":  { dot:"bg-emerald-500",badge:"bg-emerald-50 border-emerald-200", text:"text-emerald-700", border:"border-l-emerald-500" },
};

const ALERT_STATUS_CFG: Record<AlertStatus, { badge: string; text: string }> = {
  "Mới":           { badge:"bg-orange-50 border-orange-200", text:"text-orange-700" },
  "Đang xử lý":    { badge:"bg-blue-50 border-blue-200",   text:"text-blue-700" },
  "Chờ tiếp nhận": { badge:"bg-slate-100 border-slate-200",text:"text-slate-600" },
  "Đã hoàn thành": { badge:"bg-emerald-50 border-emerald-200", text:"text-emerald-700" },
};

const HISTORY_STATUS_CFG: Record<string, { badge: string; text: string; dot: string }> = {
  "Hoàn thành":   { badge:"bg-emerald-50 border-emerald-200", text:"text-emerald-700", dot:"bg-emerald-500" },
  "Đang xử lý":  { badge:"bg-orange-50 border-orange-200",   text:"text-orange-700",  dot:"bg-orange-500" },
  "Nháp":        { badge:"bg-slate-100 border-slate-200",    text:"text-slate-600",   dot:"bg-slate-400" },
};

const TAB_SEVERITY: Record<AlertTab, SeverityType | null> = {
  all: null, critical: "Nghiêm trọng", warning: "Cảnh báo", normal: "Bình thường",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, "0");

function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
}
function getColor(name: string): string {
  const colors = ["#047857", "#1D4ED8", "#7C3AED", "#DC2626", "#D97706", "#0891B2", "#BE185D"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}
function normalizeVN(s?: string) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function getSanLuong(item: ReportItem) {
  const v = item.san_luong_tan ?? item.san_luong;
  return v === undefined || v === null || v === "" ? undefined : v;
}

// ─── Shared badges ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CFG[severity as SeverityType] ?? SEVERITY_CFG["Cảnh báo"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {severity}
    </span>
  );
}
function AlertStatusBadge({ status }: { status: string }) {
  const cfg = ALERT_STATUS_CFG[status as AlertStatus] ?? ALERT_STATUS_CFG["Mới"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.badge} ${cfg.text}`}>
      {status}
    </span>
  );
}
function HistoryStatusBadge({ status }: { status: string }) {
  const cfg = HISTORY_STATUS_CFG[status] ?? HISTORY_STATUS_CFG["Hoàn thành"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
function StatusPill({ status }: { status?: string }) {
  const norm = normalizeVN(status);
  let label = "Không rõ";
  let bg = "#F1F5F9";
  let color = "#475569";
  if (norm.includes("nghiem trong"))      { label = "Nghiêm trọng"; bg = "#FEE2E2"; color = "#DC2626"; }
  else if (norm.includes("canh bao"))     { label = "Cảnh báo";     bg = "#FEF3C7"; color = "#D97706"; }
  else if (norm.includes("binh thuong"))  { label = "Bình thường";  bg = "#D1FAE5"; color = "#059669"; }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: bg, color }}>
      {label}
    </span>
  );
}
function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  return (
    <div
      className="flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: getColor(name), fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

// ─── Tooltip biểu đồ ─────────────────────────────────────────────────────────
const ProductionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
      <div className="text-slate-400 mb-0.5">{label}</div>
      <div className="font-semibold">{Number(payload[0].value).toLocaleString("vi-VN")} tấn</div>
    </div>
  );
};
const ProgressTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
      <div className="text-slate-400 mb-0.5">{label}</div>
      <div className="font-semibold">{payload[0].value} mét</div>
    </div>
  );
};

// ─── AppBar ───────────────────────────────────────────────────────────────────
function AppBar() {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base"
          style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          N
        </div>
        <div>
          <div className="text-white font-bold text-[15px] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Núi Béo
          </div>
          <div className="text-[10px] text-slate-500 font-medium leading-tight">Hệ thống quản lý sản xuất</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="Nguyễn Văn An" size={32} />
      </div>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
type TabId = "overview" | "detail" | "submit" | "history" | "alerts";
function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string; icon: any; center?: boolean }[] = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "detail",   label: "Chi tiết",  icon: FileText },
    { id: "submit",   label: "Nhập",      icon: PlusCircle, center: true },
    { id: "history",  label: "Lịch sử",   icon: History },
    { id: "alerts",   label: "Cảnh báo",  icon: Bell },
  ];

  return (
    <div
      className="mobile-bottom-nav flex items-center px-1 pt-2 border-t"
      style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        if (tab.center) {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 px-1 -mt-3 active:opacity-80"
              aria-label={tab.label}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg,#3B82F6,#1D4ED8)"
                    : "linear-gradient(135deg,#2563EB,#1E40AF)",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.45)",
                }}
              >
                <Icon size={22} color="#fff" />
              </div>
              <span className={`text-[10px] font-semibold leading-none ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        }
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 px-1 py-1 active:opacity-80"
            aria-label={tab.label}
          >
            <Icon size={20} color={isActive ? C.primary : "#475569"} strokeWidth={isActive ? 2.5 : 1.6} />
            <span
              className={`text-[10px] leading-none ${isActive ? "font-semibold text-blue-400" : "font-normal text-slate-400"}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Sheet (bottom-sheet modal chung cho mọi màn hình mobile) ────────────────
function Sheet({
  open, onClose, title, subtitle, maxHeight = "88%", children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxHeight?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/55"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl overflow-y-auto scrollbar-hide animate-m-slideUp pb-10"
        style={{ maxHeight }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-slate-200" />
        </div>
        {(title || subtitle) && (
          <div className="px-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <div className="font-extrabold text-slate-900 text-[17px] leading-snug" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {title}
                </div>
              )}
              {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
            </div>
            <button
              onClick={onClose}
              className="bg-slate-100 rounded-lg p-1.5 flex-shrink-0 active:bg-slate-200"
              aria-label="Đóng"
            >
              <X size={16} color={C.muted} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Màn hình 1: TỔNG QUAN ────────────────────────────────────────────────────
function MobileOverview({
  onNav,
}: {
  onNav: (t: TabId) => void;
}) {
  // viewMode = "day" → xem theo ngày trong tháng (dropdown tháng + năm)
  // viewMode = "month" → xem theo tháng trong năm (chỉ dropdown năm, fetch full 12 tháng)
  const [viewMode, setViewMode] = useState<"day" | "month">("day");
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [monthList, setMonthList] = useState<MonthSummary[]>([]);
  const [monthSummary, setMonthSummary] = useState<MonthSummary | null>(null);
  const [daySummary, setDaySummary] = useState<DaySummary[]>([]);
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [alerts, setAlerts] = useState<CanhBaoListItem[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        // "Tháng" view luôn lấy full 12 tháng (thang=12); "Ngày" view lấy đúng tháng đang chọn
        const thangParam = viewMode === "month" ? 12 : month;
        const [resOV, resAL] = await Promise.all([
          fetch(`${N8N_OVERVIEW_URL}?thang=${thangParam}&nam=${year}`),
          fetch(`${N8N_CANH_BAO_LIST_URL}?limit=5`),
        ]);
        if (!resOV.ok) throw new Error("Lỗi tải tổng quan");
        const dataOV = await resOV.json();
        if (cancelled) return;
        const list: MonthSummary[] = Array.isArray(dataOV?.month) ? dataOV.month : dataOV?.month ? [dataOV.month] : [];
        setMonthList(list);
        // monthSummary (1 dòng) dùng cho KPI = tháng đang chọn, hoặc tháng cuối cùng nếu đang ở chế độ "Tháng"
        const focusMonth = viewMode === "month" ? Number(year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12) : month;
        setMonthSummary(list.find(m => Number(m.thang) === focusMonth) || list[list.length - 1] || null);
        setDaySummary(Array.isArray(dataOV?.day) ? dataOV.day : []);
        setKpi(dataOV?.kpi ?? null);

        if (resAL.ok) {
          const dataAL = await resAL.json();
          if (!cancelled) setAlerts(Array.isArray(dataAL?.data) ? dataAL.data : []);
        }
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Không tải được dữ liệu tổng quan");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [month, year, refreshTick, viewMode]);

  const kpiSanLuong = kpi?.san_luong_thuc_te ?? (monthSummary ? Number(monthSummary.san_luong_luy_ke) || 0 : 0);
  const kpiSLKH = kpi?.san_luong_ke_hoach ?? 0;
  const kpiSLPct = kpi?.san_luong_ty_le ?? 0;
  const kpiTienDo = kpi?.tien_do_thuc_te ?? (monthSummary ? Number(monthSummary.tien_do_luy_ke) || 0 : 0);
  const kpiTDKH = kpi?.tien_do_ke_hoach ?? 0;
  const kpiTDPct = kpi?.tien_do_ty_le ?? 0;

  // ── Tính "còn lại" và "trung bình cần/ngày" để đạt kế hoạch (tháng hoặc năm tuỳ viewMode) ──
  const today = new Date();
  const daysInSelectedMonth = new Date(year, month, 0).getDate();
  const isSelectedCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const isSelectedFutureMonth = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1);
  const remainingDaysMonth = isSelectedCurrentMonth
    ? Math.max(daysInSelectedMonth - today.getDate(), 0)
    : isSelectedFutureMonth
      ? daysInSelectedMonth
      : 0;

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalDaysYear = isLeapYear(year) ? 366 : 365;
  const isSelectedCurrentYear = year === today.getFullYear();
  const isSelectedFutureYear = year > today.getFullYear();
  const dayOfYearToday = Math.floor((today.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
  const remainingDaysYear = isSelectedCurrentYear
    ? Math.max(totalDaysYear - dayOfYearToday, 0)
    : isSelectedFutureYear
      ? totalDaysYear
      : 0;

  // monthSL/TD = lũy kế tháng hiện tại (từ API monthSummary)
  const monthSL = monthSummary ? Number(monthSummary.san_luong_luy_ke) || 0 : 0;
  const monthTD = monthSummary ? Number(monthSummary.tien_do_luy_ke) || 0 : 0;
  // Kế hoạch tháng = kế hoạch năm / 12
  const keHoachThangSL = kpiSLKH / 12;
  const keHoachThangTD = kpiTDKH / 12;

  const remainingDaysPeriod = viewMode === "month" ? remainingDaysYear : remainingDaysMonth;
  // viewMode = "month" (năm): Còn lại = KH năm - lũy kế năm
  // viewMode = "day" (tháng): Còn lại = KH tháng - lũy kế tháng
  const conLaiSanLuong = viewMode === "month"
    ? Math.max(kpiSLKH - kpiSanLuong, 0)
    : Math.max(keHoachThangSL - monthSL, 0);
  const conLaiTienDo = viewMode === "month"
    ? Math.max(kpiTDKH - kpiTienDo, 0)
    : Math.max(keHoachThangTD - monthTD, 0);
  const tbSanLuongNgay = remainingDaysPeriod > 0 ? conLaiSanLuong / remainingDaysPeriod : 0;
  const tbTienDoNgay = remainingDaysPeriod > 0 ? conLaiTienDo / remainingDaysPeriod : 0;

  // Dữ liệu 2 biểu đồ: thay đổi nguồn theo viewMode
  const chartProd = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.san_luong_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.san_luong_luy_ke) || 0 }));
  const chartProg = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.tien_do_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.tien_do_luy_ke) || 0 }));

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026, 2027];
  const chartBadge = viewMode === "month" ? `Năm ${year}` : `Tháng ${month}`;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <AppBar />

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-4">
          {/* Filter row gọn: toggle + tháng + năm + refresh trên cùng 1 hàng */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition-colors ${
                  viewMode === "day" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 active:text-slate-700"
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition-colors ${
                  viewMode === "month" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 active:text-slate-700"
                }`}
              >
                Tháng
              </button>
            </div>

            {viewMode === "day" && (
              <div className="relative flex-1 min-w-0">
                <select
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm"
                >
                  {months.map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
            <div className="relative flex-1 min-w-0">
              <select
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm"
              >
                {years.map(y => <option key={y} value={y}>Năm {y}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setRefreshTick(t => t + 1)}
              disabled={loading}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 active:bg-slate-50 disabled:opacity-50 flex-shrink-0"
              aria-label="Làm mới"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">
              {errorMsg}
            </div>
          )}

          {/* 2 KPI gradient cards */}
          <div className="flex flex-col gap-3 mb-4">
            <div
              className="rounded-2xl p-4 shadow-lg"
              style={{ background: "linear-gradient(135deg,#1E40AF,#2563EB)", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="text-[15px] text-white font-semibold leading-tight">Sản lượng lũy kế</div>
                <div className="bg-white/20 rounded-full px-3 py-1.5 text-[20px] font-bold text-white flex items-center gap-1 flex-shrink-0 leading-none">
                  <ArrowUpRight size={16} />
                  {Math.round(kpiSLPct).toLocaleString("vi-VN")}%
                </div>
              </div>
              <div className="font-extrabold text-white text-[42px] leading-none mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {Math.round(kpiSanLuong).toLocaleString("vi-VN")}
                <span className="text-xl font-medium ml-2 opacity-80">
                  / {Math.round(viewMode === "month" ? kpiSLKH : keHoachThangSL).toLocaleString("vi-VN")} tấn
                </span>
              </div>
              <div className="text-[15px] text-white/85 mb-3 font-medium">
                Kế hoạch {viewMode === "month" ? "năm" : "tháng"}: <strong className="text-white">
                  {Math.round(viewMode === "month" ? kpiSLKH : keHoachThangSL).toLocaleString("vi-VN")}
                </strong> tấn
              </div>
              <div className="flex items-stretch gap-3 mb-2.5 bg-black/15 rounded-xl px-3.5 py-3">
                <div className="flex-1 text-left">
                  <div className="text-[15px] text-white/85 mb-1.5 font-medium">Còn lại {viewMode === "month" ? "(năm)" : "(tháng)"}</div>
                  <div className="text-[24px] font-extrabold text-white leading-tight">
                    {Math.round(conLaiSanLuong).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">tấn</span>
                  </div>
                </div>
                <div className="w-px bg-white/25 self-stretch" />
                <div className="flex-1 text-left">
                  <div className="text-[15px] text-white/85 mb-1.5 font-medium">TB cần/ngày ({remainingDaysPeriod} ngày)</div>
                  <div className="text-[24px] font-extrabold text-white leading-tight">
                    {Math.round(tbSanLuongNgay).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">tấn</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-200 rounded-full transition-all" style={{ width: `${Math.min(100, kpiSLPct)}%` }} />
              </div>
            </div>

            <div
              className="rounded-2xl p-4 shadow-lg"
              style={{ background: "linear-gradient(135deg,#92400E,#D97706)", boxShadow: "0 4px 20px rgba(217,119,6,0.3)" }}
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="text-[15px] text-white font-semibold leading-tight">Tiến độ đào lò lũy kế</div>
                <div className="bg-white/20 rounded-full px-3 py-1.5 text-[20px] font-bold text-white flex items-center gap-1 flex-shrink-0 leading-none">
                  <ArrowUpRight size={16} />
                  {Math.round(kpiTDPct).toLocaleString("vi-VN")}%
                </div>
              </div>
              <div className="font-extrabold text-white text-[42px] leading-none mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {Math.round(kpiTienDo).toLocaleString("vi-VN")}
                <span className="text-xl font-medium ml-2 opacity-80">
                  / {Math.round(viewMode === "month" ? kpiTDKH : keHoachThangTD).toLocaleString("vi-VN")} mét
                </span>
              </div>
              <div className="text-[15px] text-white/85 mb-3 font-medium">
                Kế hoạch {viewMode === "month" ? "năm" : "tháng"}: <strong className="text-white">
                  {Math.round(viewMode === "month" ? kpiTDKH : keHoachThangTD).toLocaleString("vi-VN")}
                </strong> mét
              </div>
              <div className="flex items-stretch gap-3 mb-2.5 bg-black/15 rounded-xl px-3.5 py-3">
                <div className="flex-1 text-left">
                  <div className="text-[15px] text-white/85 mb-1.5 font-medium">Còn lại {viewMode === "month" ? "(năm)" : "(tháng)"}</div>
                  <div className="text-[24px] font-extrabold text-white leading-tight">
                    {Math.round(conLaiTienDo).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">mét</span>
                  </div>
                </div>
                <div className="w-px bg-white/25 self-stretch" />
                <div className="flex-1 text-left">
                  <div className="text-[15px] text-white/85 mb-1.5 font-medium">TB cần/ngày ({remainingDaysPeriod} ngày)</div>
                  <div className="text-[24px] font-extrabold text-white leading-tight">
                    {Math.round(tbTienDoNgay).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">mét</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-200 rounded-full transition-all" style={{ width: `${Math.min(100, kpiTDPct)}%` }} />
              </div>
            </div>
          </div>

          {/* Biểu đồ sản lượng */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-slate-800 text-[14px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sản lượng (lũy kế)</div>
                <div className="text-[10px] text-slate-500">{viewMode === "month" ? "Theo tháng trong năm (tấn)" : "Theo ngày trong tháng (tấn)"}</div>
              </div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md px-2 py-0.5">{chartBadge}</span>
            </div>
            {chartProd.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-6">
                {loading ? "Đang tải…" : "Chưa có dữ liệu"}
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide -mx-2">
                <div style={{ minWidth: Math.max(320, chartProd.length * (viewMode === "month" ? 28 : 36)) }}>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={chartProd} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ProductionTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                      <Bar dataKey="value" fill={C.primary} radius={[3, 3, 0, 0]} maxBarSize={viewMode === "month" ? 24 : 20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Biểu đồ tiến độ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-slate-800 text-[14px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Tiến độ đào lò (lũy kế)</div>
                <div className="text-[10px] text-slate-500">{viewMode === "month" ? "Theo tháng trong năm (mét)" : "Theo ngày trong tháng (mét)"}</div>
              </div>
              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md px-2 py-0.5">{chartBadge}</span>
            </div>
            {chartProg.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-6">
                {loading ? "Đang tải…" : "Chưa có dữ liệu"}
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide -mx-2">
                <div style={{ minWidth: Math.max(320, chartProg.length * (viewMode === "month" ? 28 : 36)) }}>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={chartProg} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <defs>
                        <linearGradient id="mobileOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.warning} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C.warning} stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ProgressTooltip />} />
                      <Area type="monotone" dataKey="value" stroke={C.warning} strokeWidth={2}
                        fill="url(#mobileOrangeGrad)" dot={{ r: 2.5, fill: C.warning }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Cảnh báo gần đây */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-slate-800 text-[14px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Cảnh báo gần đây</div>
              <button onClick={() => onNav("alerts")} className="text-[11px] font-bold text-blue-600 active:opacity-70">
                Xem tất cả
              </button>
            </div>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center text-slate-400 py-4 text-xs">
                <Shield size={28} className="text-slate-200" />
                <div className="mt-2 font-semibold">Không có cảnh báo</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {alerts.slice(0, 3).map(a => {
                  const cfg = SEVERITY_CFG[a.severity as SeverityType];
                  return (
                    <button
                      key={a.id}
                      onClick={() => onNav("alerts")}
                      className={`text-left bg-white rounded-xl border border-slate-200 border-l-4 ${cfg?.border || ""} p-3 active:bg-slate-50`}
                    >
                      <div className="flex items-start gap-2">
                        {a.severity === "Nghiêm trọng" ? <AlertCircle size={14} className="text-red-500 mt-0.5" />
                          : a.severity === "Cảnh báo" ? <AlertTriangle size={14} className="text-amber-500 mt-0.5" />
                          : <Info size={14} className="text-blue-500 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold text-slate-800 line-clamp-2 leading-snug">{a.noi_dung}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 truncate">{a.duong_lo || "—"}</span>
                            <span className="text-[10px] text-slate-400">{fmtTime(a.created_at)}</span>
                          </div>
                        </div>
                        <SeverityBadge severity={a.severity} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Màn hình 2: CHI TIẾT ─────────────────────────────────────────────────────
function MobileDetail({ onNav }: { onNav: (t: TabId) => void }) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [tunnelData, setTunnelData] = useState<TunnelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState<TunnelData | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setTunnelData(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải dữ liệu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [month, year, refreshTick]);

  // Mỗi đường lò giữ 1 dòng cuối (lũy kế mới nhất)
  const latestByTunnel = useMemo(() => {
    const map = new Map<string, TunnelData>();
    for (const row of tunnelData) map.set(row.duong_lo, row);
    return Array.from(map.values());
  }, [tunnelData]);

  const filtered = latestByTunnel.filter(t =>
    t.duong_lo.toLowerCase().includes(search.toLowerCase())
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="font-extrabold text-slate-100 text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Chi tiết sản xuất
        </div>
        <div className="flex items-center gap-2 mt-2.5 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <Search size={14} color="#64748B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm đường lò…"
            className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="relative flex-1">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-[12px] font-semibold text-slate-200"
            >
              {months.map(m => <option key={m} value={m} className="text-slate-900">Tháng {m}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          <button
            onClick={() => setRefreshTick(t => t + 1)}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 active:bg-white/10 disabled:opacity-50"
            aria-label="Làm mới"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">
              {errorMsg}
            </div>
          )}

          {/* 3 summary cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-blue-50 flex items-center justify-center">
                <Layers size={14} className="text-blue-600" />
              </div>
              <div className="font-extrabold text-blue-700 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {latestByTunnel.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Tổng đường lò</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={14} className="text-amber-600" />
              </div>
              <div className="font-extrabold text-amber-600 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>0</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Cảnh báo</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle size={14} className="text-red-600" />
              </div>
              <div className="font-extrabold text-red-600 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>0</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Nghiêm trọng</div>
            </div>
          </div>

          {/* Danh sách đường lò */}
          <div className="flex flex-col gap-2">
            {filtered.map(t => (
              <button
                key={t.duong_lo}
                onClick={() => setSelected(t)}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 text-left shadow-sm active:bg-slate-50"
              >
                <div
                  className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#1E3A5F,#2563EB)" }}
                >
                  <Layers size={18} color="#93C5FD" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-[13px] truncate" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {t.duong_lo}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Package size={10} className="text-blue-600" />
                      {Number(t.san_luong_luy_ke).toLocaleString("vi-VN")} tấn
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock size={10} className="text-amber-600" />
                      {Number(t.tien_do_luy_ke).toLocaleString("vi-VN")} m
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[9px] text-slate-400">{t.ngay_bao_cao}</span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </button>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center text-slate-400 py-10">
                <Search size={36} className="text-slate-200" />
                <div className="mt-3 text-[13px] font-semibold">Không tìm thấy đường lò</div>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center py-10 text-slate-400 text-xs gap-2">
                <Loader2 size={14} className="animate-spin" /> Đang tải…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => onNav("submit")}
        className="absolute z-40 active:opacity-80"
        style={{
          bottom: 92, right: 16, width: 52, height: 52, borderRadius: 16,
          background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
          boxShadow: "0 6px 20px rgba(37,99,235,0.45)",
        }}
        aria-label="Nhập báo cáo mới"
      >
        <PlusCircle size={22} color="#fff" className="m-auto" />
      </button>

      {/* Bottom sheet chi tiết đường lò */}
      {selected && (() => {
        const rows = tunnelData.filter(r => r.duong_lo === selected.duong_lo);
        const chartData = rows.map(r => ({
          date: r.ngay_bao_cao,
          prod: Number(r.san_luong_luy_ke) || 0,
          prog: Number(r.tien_do_luy_ke) || 0,
        }));
        const lastRow = rows[rows.length - 1];
        return (
          <Sheet open onClose={() => setSelected(null)} title={selected.duong_lo} subtitle={lastRow?.thoi_gian_bao_cao}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <div className="text-[10px] text-slate-500">Sản lượng</div>
                <div className="font-extrabold text-blue-700 text-[18px] mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {Number(lastRow?.san_luong_luy_ke).toLocaleString("vi-VN")}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">tấn</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <div className="text-[10px] text-slate-500">Tiến độ đào</div>
                <div className="font-extrabold text-amber-600 text-[18px] mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {Number(lastRow?.tien_do_luy_ke).toLocaleString("vi-VN")}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">mét</span>
                </div>
              </div>
            </div>
            {chartData.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-4">
                Chưa có dữ liệu cho {selected.duong_lo} trong tháng này.
              </div>
            ) : (
              <>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Sản lượng theo ngày (tấn)</div>
                <div style={{ height: 140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: -24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ProductionTooltip />} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                      <Bar dataKey="prod" fill={C.primary} radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-3">Tiến độ theo ngày (mét)</div>
                <div style={{ height: 100 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: -24 }}>
                      <defs>
                        <linearGradient id="mobDetailOrange" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.warning} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C.warning} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ProgressTooltip />} />
                      <Area type="monotone" dataKey="prog" stroke={C.warning} strokeWidth={2}
                        fill="url(#mobDetailOrange)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </Sheet>
        );
      })()}
    </div>
  );
}

// ─── Màn hình 3: NHẬP BÁO CÁO ────────────────────────────────────────────────
function MobileSubmit({ onNav }: { onNav: (t: TabId) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState<ReportItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (status === "processing") return;
    if (!file && !text.trim()) {
      alert("Vui lòng tải lên tệp hoặc nhập nội dung báo cáo!");
      return;
    }
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text.trim()) formData.append("report_text", text);
    const today = new Date();
    formData.append("ngay_bao_cao", `${pad2(today.getDate())}/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`);

    setStatus("processing");
    setErrMsg("");
    try {
      const res = await fetch(N8N_WEBHOOK_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const data = await res.json().catch(() => null);
      let result: ReportItem[] = [];
      if (Array.isArray(data)) result = data;
      else if (data && Array.isArray(data.data)) result = data.data;
      else if (data && typeof data === "object" && Object.keys(data).length > 0) result = [data];

      const hasErr = !!(data?.error || data?.success === false ||
        (typeof data?.message === "string" && /error|lỗi|exception/i.test(data.message)));

      if (result.length === 0 || hasErr) {
        setErrMsg(hasErr && typeof data.error === "string"
          ? `n8n báo lỗi: ${data.error}`
          : "n8n đã xử lý xong nhưng không trả về dữ liệu. Kiểm tra workflow.");
        setStatus("error");
        return;
      }
      setItems(result);
      setStatus("success");
      setFile(null);
      setText("");
    } catch (err: any) {
      setErrMsg(err?.message || "Không thể kết nối n8n. Kiểm tra URL webhook.");
      setStatus("error");
    }
  };

  const closeOverlay = () => { setStatus("idle"); setItems([]); };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/templates/Report_Template.xlsx";
    link.download = "Report_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ background: C.dark }}>
        <div className="font-extrabold text-slate-100 text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Nhập báo cáo mới
        </div>
        <div className="text-[11px] text-slate-500 mt-1">Tải lên file Excel hoặc nhập thông tin thủ công</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3 pb-32">
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault(); setDragging(false);
              const f = e.dataTransfer?.files?.[0];
              if (f) setFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl p-5 text-center mb-3 cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? C.primary : file ? C.success : C.border}`,
              background: dragging ? C.primaryLight : file ? C.successLight : C.card,
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
            {file ? (
              <>
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ background: C.successLight }}>
                  <CheckCircle2 size={26} className="text-emerald-600" />
                </div>
                <div className="font-bold text-emerald-700 text-[13px]">{file.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null); }}
                  className="mt-2 text-[11px] font-semibold text-red-600 bg-red-50 rounded-md px-3 py-1"
                >
                  Xóa file
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ background: dragging ? C.primaryLight : "#F1F5F9" }}
                >
                  <Upload size={22} color={dragging ? C.primary : "#94A3B8"} />
                </div>
                <div className="font-bold text-slate-800 text-[13px]">Kéo thả file hoặc nhấn để chọn</div>
                <div className="text-[11px] text-slate-500 mt-1 mb-3">Chỉ hỗ trợ file Excel (.xlsx) — tối đa 25MB</div>
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[12px] font-bold active:opacity-80"
                >
                  Chọn tệp
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded-md px-2 py-0.5">XLSX</span>
            </div>
            <button
              onClick={handleDownload}
              className="text-blue-600 text-[11px] font-bold flex items-center gap-1 active:opacity-70"
            >
              <Download size={11} /> Template mẫu
            </button>
          </div>

          {/* Nhập báo cáo */}
          <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Nhập báo cáo</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Nhập nội dung báo cáo, ghi chú sự cố hoặc hướng dẫn cho AI phân tích file Excel…"
            rows={6}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[13px] text-slate-700 outline-none focus:border-blue-400 leading-relaxed resize-none font-sans"
          />
        </div>
      </div>

      {/* Footer button sticky */}
      <div
        className="absolute left-0 right-0 flex gap-2 p-3 border-t bg-white"
        style={{ bottom: 80, borderColor: C.border }}
      >
        <button
          onClick={() => { setFile(null); setText(""); }}
          className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-[13px] active:opacity-70"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={status === "processing" || (!file && !text.trim())}
          className="flex-[2] py-3 rounded-xl text-white font-bold text-[13px] flex items-center justify-center gap-2 disabled:cursor-not-allowed active:opacity-80"
          style={{
            background: (!file && !text.trim())
              ? "#CBD5E1"
              : "linear-gradient(135deg,#2563EB,#1D4ED8)",
          }}
        >
          {status === "processing"
            ? <><Loader2 size={14} className="animate-spin" />Đang xử lý…</>
            : "Lưu báo cáo"}
        </button>
      </div>

      {/* Loading overlay */}
      {status === "processing" && (
        <div className="absolute inset-0 z-50 bg-slate-900/85 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <Loader2 size={36} className="text-blue-500 animate-spin" />
          </div>
          <div className="text-white font-bold text-[15px]">Đang xử lý…</div>
          <div className="text-slate-500 text-[12px]">AI đang phân tích báo cáo của bạn</div>
        </div>
      )}

      {/* Success / Error sheet */}
      {status === "success" && (
        <Sheet open onClose={closeOverlay} title="Đã xử lý xong báo cáo!" subtitle={`n8n trả về ${items.length} dòng dữ liệu`}>
          <div className="flex flex-col gap-2.5 mb-4">
            {items.map((it, idx) => (
              <ReportItemCard key={it.ma_bao_cao || idx} item={it} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={closeOverlay}
              className="w-full py-3 rounded-xl text-white font-bold text-[13px] active:opacity-80"
              style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
            >
              Đóng và nhập báo cáo khác
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { closeOverlay(); onNav("overview"); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard size={12} />Tổng quan
              </button>
              <button
                onClick={() => { closeOverlay(); onNav("history"); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1.5"
              >
                <History size={12} />Lịch sử
              </button>
            </div>
          </div>
        </Sheet>
      )}
      {status === "error" && (
        <Sheet open onClose={closeOverlay} title="Gửi báo cáo thất bại" subtitle={errMsg}>
          <button
            onClick={closeOverlay}
            className="w-full py-3 rounded-xl text-white font-bold text-[13px] active:opacity-80"
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
          >
            Thử lại
          </button>
        </Sheet>
      )}
    </div>
  );
}

// Card hiển thị 1 dòng báo cáo trả về từ n8n
function ReportItemCard({ item }: { item: ReportItem }) {
  const sanLuong = getSanLuong(item);
  const tienDo = item.tien_do_dao_lo ?? item.xen_lo_2 ?? item.dao_lo_2;
  const canhBao = item.noi_dung_canh_bao;
  const hasCanhBao = !!canhBao && !normalizeVN(canhBao).includes("khong co");
  return (
    <div className="border border-slate-200 rounded-xl p-3 text-left">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-900 text-[12px] truncate">{item.don_vi_thi_cong || "Không rõ đơn vị"}</div>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><Clock size={9} />{item.ngay || "--"} · Ca {item.ca ?? "--"}</span>
            {item.duong_lo && <span className="flex items-center gap-1"><MapPin size={9} />{item.duong_lo}</span>}
          </div>
        </div>
        {item.tinh_trang && <StatusPill status={item.tinh_trang} />}
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-blue-50 border border-blue-100 rounded-md p-1.5 text-center">
          <div className="font-extrabold text-blue-700 text-[13px]">{sanLuong !== undefined ? Number(sanLuong).toLocaleString("vi-VN") : "—"}</div>
          <div className="text-[9px] text-slate-500">Sản lượng (tấn)</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-md p-1.5 text-center">
          <div className="font-extrabold text-amber-600 text-[13px]">{tienDo !== undefined && tienDo !== null ? tienDo : "—"}</div>
          <div className="text-[9px] text-slate-500">Tiến độ đào</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-md p-1.5 text-center">
          <div className="font-bold text-slate-900 text-[11px] truncate">{item.bo_tri_lao_dong || (item.so_lao_dong ? `${item.so_lao_dong} LĐ` : "—")}</div>
          <div className="text-[9px] text-slate-500">Bố trí / LĐ</div>
        </div>
      </div>
      {item.ghi_chu && (
        <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-md px-2 py-1 mb-1">
          <span className="text-slate-400 font-bold">Ghi chú:</span> {item.ghi_chu}
        </p>
      )}
      <div
        className="flex items-start gap-1.5 mt-1 px-2 py-1.5 rounded-md"
        style={
          hasCanhBao
            ? { background: "#FEE2E2", border: "1px solid #FECACA" }
            : { background: "#F9FAFB", border: "1px solid #E5E7EB" }
        }
      >
        <AlertTriangle size={11} className={`mt-0.5 flex-shrink-0 ${hasCanhBao ? "text-red-600" : "text-slate-400"}`} />
        <p className={`text-[11px] ${hasCanhBao ? "text-red-800" : "text-slate-500"}`}>
          <span className="font-bold">Cảnh báo: </span>
          {hasCanhBao ? canhBao : "Không có"}
        </p>
      </div>
    </div>
  );
}

// ─── Màn hình 4: LỊCH SỬ ──────────────────────────────────────────────────────
function MobileHistory() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<BaoCaoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<BaoCaoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(N8N_BAO_CAO_LIST_URL);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setList(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải lịch sử báo cáo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [refreshTick]);

  useEffect(() => {
    if (selectedId == null) { setDetail(null); return; }
    let cancelled = false;
    async function loadDetail() {
      setDetailLoading(true);
      try {
        const res = await fetch(`${N8N_BAO_CAO_DETAIL_URL}/${selectedId}`);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setDetail({
            report: data.report,
            ai_output: data.ai_output || [],
            duong_lo: data.duong_lo || [],
            text_raw: data.text_raw || null,
          });
        }
      } catch {
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    }
    loadDetail();
    return () => { cancelled = true; };
  }, [selectedId]);

  const filtered = list.filter(it => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (it.duong_lo || "").toLowerCase().includes(q)
      || (it.don_vi_thi_cong || "").toLowerCase().includes(q)
      || (it.nguoi_bao_cao || "").toLowerCase().includes(q);
  });

  const aiRows = detail?.ai_output ?? [];
  const duongLoRows = detail?.duong_lo ?? [];
  const textRaw = detail?.text_raw;
  const firstAi = aiRows[0];
  const worstStatus = (() => {
    const order: Record<string, number> = { "Nghiêm trọng": 3, "Cảnh báo": 2, "Bình thường": 1 };
    let best = "Bình thường";
    let bestRank = 1;
    for (const r of aiRows) {
      const t = (r.tinh_trang || "Bình thường").trim();
      const rank = order[t] || 0;
      if (rank > bestRank) { best = t; bestRank = rank; }
    }
    return best;
  })();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="font-extrabold text-slate-100 text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Lịch sử báo cáo
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            <Search size={14} color="#64748B" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm…"
              className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={() => setRefreshTick(t => t + 1)}
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 active:bg-white/10 disabled:opacity-50"
            aria-label="Làm mới"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">
              {errorMsg}
            </div>
          )}
          {loading && filtered.length === 0 && (
            <div className="flex items-center justify-center text-slate-400 py-8 gap-2 text-xs">
              <Loader2 size={14} className="animate-spin" />Đang tải lịch sử…
            </div>
          )}
          <div className="flex flex-col gap-2">
            {filtered.map(it => {
              const [datePart, timePart] = fmtDateTime(it.created_at).split(" ");
              return (
                <button
                  key={it.report_id}
                  onClick={() => setSelectedId(it.report_id)}
                  className="bg-white border border-slate-200 rounded-xl p-3 text-left shadow-sm active:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md px-1.5 py-0.5">
                        Ca {it.ca ?? "—"}
                      </span>
                      <HistoryStatusBadge status={it.tinh_trang} />
                    </div>
                    <div className="text-right text-[10px] text-slate-400 leading-tight">
                      <div>{datePart || "—"}</div>
                      <div>{timePart || ""}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {it.duong_lo || "—"}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                    <span>{it.don_vi_thi_cong || "—"}</span>
                    <span>•</span>
                    <span>{it.nguoi_bao_cao || "—"}</span>
                  </div>
                  {it.so_dong_ai > 1 && (
                    <span className="inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      +{it.so_dong_ai - 1} dòng
                    </span>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center text-slate-400 py-10">
                <History size={36} className="text-slate-200" />
                <div className="mt-3 text-[13px] font-semibold">Chưa có báo cáo nào trong hệ thống.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet chi tiết */}
      <Sheet
        open={selectedId != null}
        onClose={() => setSelectedId(null)}
        title="Chi tiết báo cáo"
        subtitle={`#${selectedId}`}
        maxHeight="92%"
      >
        {detailLoading && (
          <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
            <Loader2 size={14} className="animate-spin" />Đang tải chi tiết…
          </div>
        )}
        {!detailLoading && detail && (
          <>
            {/* Thông tin chung */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-3">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thông tin báo cáo</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Ca</div>
                  <div className="font-bold text-slate-900 text-[13px] mt-0.5">{firstAi?.ca ?? "—"}</div>
                </div>
                <div className="px-3 py-2.5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">ĐV thi công</div>
                  <div className="font-bold text-slate-900 text-[12px] mt-0.5 truncate">{firstAi?.don_vi_thi_cong || "—"}</div>
                </div>
                <div className="px-3 py-2.5 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Người BC</div>
                  <div className="font-bold text-slate-900 text-[12px] mt-0.5 truncate">{firstAi?.nguoi_bao_cao || "—"}</div>
                </div>
                <div className="px-3 py-2.5 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Số dòng AI</div>
                  <div className="font-bold text-blue-700 text-[13px] mt-0.5">{aiRows.length}</div>
                </div>
                <div className="px-3 py-2.5 border-t border-slate-100 col-span-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Trạng thái</div>
                  <div className="mt-1"><HistoryStatusBadge status={worstStatus} /></div>
                </div>
              </div>
            </div>

            {/* Dữ liệu Excel */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-3">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <FileText size={12} className="text-blue-600" />
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex-1">Dữ liệu file Excel</div>
                <span className="text-[10px] font-semibold text-slate-400">{duongLoRows.length} dòng</span>
              </div>
              <div className="p-2.5">
                {duongLoRows.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-1">Báo cáo này không có dữ liệu Excel.</div>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-hide">
                    {duongLoRows.map((r: any) => (
                      <div key={r.id} className="rounded-md border border-slate-100 p-2 bg-slate-50">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5 text-[10px]">
                          <span className="font-bold text-slate-800">{fmtDate(r.ngay)}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600">Ca {r.ca ?? "—"}</span>
                          {r.duong_lo && (
                            <>
                              <span className="text-slate-400">·</span>
                              <span className="font-bold text-blue-700">{r.duong_lo}</span>
                            </>
                          )}
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-center text-[9px]">
                          <div className="bg-white rounded p-1"><div className="font-bold text-blue-700">{Number(r.san_luong_than || 0).toLocaleString("vi-VN")}</div><div className="text-slate-400">SL(t)</div></div>
                          <div className="bg-white rounded p-1"><div className="font-bold text-slate-900">{Number(r.dao_lo_thuc_hien_m || 0)}</div><div className="text-slate-400">Đào(m)</div></div>
                          <div className="bg-white rounded p-1"><div className="font-bold text-slate-900">{Number(r.xen_lo_thuc_hien_m || 0)}</div><div className="text-slate-400">Xén(m)</div></div>
                          <div className="bg-white rounded p-1"><div className="font-bold text-slate-900">{Number(r.chong_thuc_hien_m || 0)}</div><div className="text-slate-400">Chống(m)</div></div>
                          <div className="bg-white rounded p-1"><div className="font-bold text-amber-600">{Number(r.khau_lo_thuc_hien_m || 0)}</div><div className="text-slate-400">Khấu(m)</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Text raw */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-3">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <FileText size={12} className="text-amber-600" />
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Nội dung text gốc</div>
              </div>
              <div className="p-3">
                {textRaw?.noi_dung ? (
                  <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-md p-2 border border-slate-100">
                    {textRaw.noi_dung}
                  </p>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">Báo cáo này không có nội dung text.</div>
                )}
              </div>
            </div>

            {/* AI Output */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2" style={{ background: "linear-gradient(to right,#EFF6FF,#F8FAFC)" }}>
                <Sparkles size={12} className="text-blue-600" />
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex-1">Báo cáo phân tích AI</div>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded-full border border-blue-200">
                  {aiRows.length} dòng
                </span>
              </div>
              <div className="p-2.5">
                {aiRows.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-1">Chưa có dữ liệu AI.</div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-hide">
                    {aiRows.map((row: any, idx: number) => (
                      <div key={row.id ?? idx} className="rounded-lg border border-slate-200 p-2.5 bg-white">
                        <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 text-[12px]">#{idx + 1}. {row.ten_lo_vi_tri || row.duong_lo || "—"}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {fmtDate(row.ngay)} · Ca {row.ca ?? "—"} · {row.don_vi_thi_cong || "—"} · {row.nguoi_bao_cao || "—"}
                            </p>
                          </div>
                          <StatusPill status={row.tinh_trang} />
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          <div className="bg-blue-50 border border-blue-100 rounded p-1.5 text-center">
                            <div className="font-extrabold text-blue-700 text-[12px]">{Number(row.san_luong_tan || 0).toLocaleString("vi-VN")}</div>
                            <div className="text-[8px] text-blue-600 font-bold mt-0.5">tấn than</div>
                          </div>
                          <div className="bg-amber-50 border border-amber-100 rounded p-1.5 text-center">
                            <div className="font-extrabold text-amber-600 text-[12px]">{Number(row.tien_do_dao_lo || 0)}</div>
                            <div className="text-[8px] text-amber-600 font-bold mt-0.5">mét đào</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-center">
                            <div className="font-extrabold text-slate-900 text-[12px]">{Number(row.so_lao_dong || 0)}</div>
                            <div className="text-[8px] text-slate-500 font-bold mt-0.5">lao động</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-center">
                            <div className="font-bold text-slate-700 text-[10px] truncate" title={row.bo_tri_lao_dong}>{row.bo_tri_lao_dong || "—"}</div>
                            <div className="text-[8px] text-slate-500 font-bold mt-0.5">bố trí</div>
                          </div>
                        </div>
                        {row.ghi_chu && (
                          <div className="text-[11px] text-slate-600 mt-2 px-2 py-1 rounded bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 font-bold">Ghi chú:</span> {row.ghi_chu}
                          </div>
                        )}
                        {row.noi_dung_canh_bao && !normalizeVN(row.noi_dung_canh_bao).includes("khong co") && (
                          <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-md mt-1.5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                            <AlertTriangle size={11} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-red-900">{row.noi_dung_canh_bao}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}

// ─── Màn hình 5: CẢNH BÁO ─────────────────────────────────────────────────────
function MobileAlerts() {
  const [tab, setTab] = useState<AlertTab>("all");
  const [search, setSearch] = useState("");
  const [list, setList] = useState<CanhBaoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState<CanhBaoListItem | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams();
        if (tab !== "all") {
          const sev = TAB_SEVERITY[tab];
          if (sev) params.set("severity", sev);
        }
        if (search.trim()) params.set("search", search.trim());
        const url = `${N8N_CANH_BAO_LIST_URL}${params.toString() ? "?" + params.toString() : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setList(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải cảnh báo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tab, search, refreshTick]);

  const counts = {
    all: list.length,
    critical: list.filter(a => a.severity === "Nghiêm trọng").length,
    warning: list.filter(a => a.severity === "Cảnh báo").length,
    resolved: list.filter(a => a.trang_thai === "Đã hoàn thành").length,
  };

  const tabs: { id: AlertTab; label: string }[] = [
    { id: "all", label: "Tất cả" },
    { id: "critical", label: "Nghiêm trọng" },
    { id: "warning", label: "Cảnh báo" },
    { id: "normal", label: "Bình thường" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="font-extrabold text-slate-100 text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Cảnh báo
          </div>
          <button
            onClick={() => setRefreshTick(t => t + 1)}
            disabled={loading}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 active:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <Search size={14} color="#64748B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm cảnh báo…"
            className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">
              {errorMsg}
            </div>
          )}
          {/* 4 summary cards 2x2 */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <SummaryCard icon={Bell} color={C.primary} bg={C.primaryLight} label="Tổng cảnh báo" value={counts.all} />
            <SummaryCard icon={AlertCircle} color={C.danger} bg={C.dangerLight} label="Nghiêm trọng" value={counts.critical} />
            <SummaryCard icon={AlertTriangle} color={C.warning} bg={C.warningLight} label="Cảnh báo" value={counts.warning} />
            <SummaryCard icon={CheckCircle} color={C.success} bg={C.successLight} label="Đã xử lý" value={counts.resolved} />
          </div>

          {/* Tabs filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 -mx-1 px-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap flex-shrink-0 ${
                  tab === t.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {list.map(a => {
              const cfg = SEVERITY_CFG[a.severity as SeverityType];
              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`bg-white border border-slate-200 ${cfg?.border || ""} border-l-4 rounded-xl p-3 text-left shadow-sm active:bg-slate-50`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock size={10} />
                      {fmtTime(a.created_at)} · {fmtDate(a.ngay || a.created_at)}
                    </div>
                    <div className="flex gap-1">
                      <SeverityBadge severity={a.severity} />
                      <AlertStatusBadge status={a.trang_thai} />
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-slate-800 leading-snug">{a.noi_dung}</div>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500">
                    <MapPin size={10} />
                    {[a.duong_lo, a.vi_tri].filter(Boolean).join(" · ") || "—"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {a.nguoi_xu_ly ? (
                      <>
                        <Avatar name={a.nguoi_xu_ly} size={20} />
                        <span className="text-[11px] text-slate-600">{a.nguoi_xu_ly}</span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Chưa phân công</span>
                    )}
                  </div>
                </button>
              );
            })}
            {list.length === 0 && !loading && (
              <div className="flex flex-col items-center text-slate-400 py-10">
                <Shield size={42} className="text-slate-200" />
                <div className="mt-3 text-[13px] font-semibold">Không có cảnh báo</div>
                <div className="text-[11px] text-slate-400 mt-1">Khu vực này đang hoạt động an toàn</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet chi tiết cảnh báo */}
      {selected && (
        <Sheet open onClose={() => setSelected(null)}>
          <div className="flex items-center justify-between mb-3 -mt-2">
            <div className="flex items-center gap-1.5">
              <SeverityBadge severity={selected.severity} />
              <AlertStatusBadge status={selected.trang_thai} />
            </div>
            <div className="text-[10px] text-slate-400">{fmtDate(selected.ngay || selected.created_at)}</div>
          </div>
          <h3 className="font-extrabold text-slate-900 text-[15px] leading-snug mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {selected.noi_dung}
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
            <InfoCol icon={Clock} label="Thời gian" value={`${fmtTime(selected.created_at)}`} sub={fmtDate(selected.ngay || selected.created_at)} />
            <InfoCol icon={MapPin} label="Vị trí" value={selected.duong_lo || "—"} sub={selected.vi_tri || ""} />
            <InfoCol
              icon={User}
              label="Người xử lý"
              value={selected.nguoi_xu_ly || "—"}
              sub={selected.nguoi_xu_ly ? "" : "Chưa phân công"}
              avatarName={selected.nguoi_xu_ly || undefined}
            />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả chi tiết</div>
          <div className="text-[12px] text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
            {selected.mo_ta || selected.noi_dung}
          </div>
          {selected.trang_thai !== "Đã hoàn thành" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 rounded-xl text-white font-bold text-[12px] active:opacity-80"
                style={{ background: "linear-gradient(135deg,#059669,#047857)" }}
              >
                Đánh dấu đã xử lý
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-[12px] active:opacity-70"
              >
                Phân công
              </button>
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}

// Small helpers dùng trong MobileAlerts
function SummaryCard({ icon: Icon, color, bg, label, value }: { icon: any; color: string; bg: string; label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <div className="w-8 h-8 mb-2 rounded-lg flex items-center justify-center" style={{ background: bg }}>
        <Icon size={16} color={color} />
      </div>
      <div className="font-extrabold text-[22px] leading-none" style={{ color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}
function InfoCol({ icon: Icon, label, value, sub, avatarName }: { icon: any; label: string; value: string; sub?: string; avatarName?: string }) {
  return (
    <div className="text-center">
      <div className="w-9 h-9 mx-auto mb-1.5 rounded-xl bg-blue-50 flex items-center justify-center">
        {avatarName ? <Avatar name={avatarName} size={28} /> : <Icon size={16} className="text-blue-600" />}
      </div>
      <div className="text-[9px] text-slate-500">{label}</div>
      <div className="text-[11px] font-bold text-slate-900 mt-0.5 leading-tight">{value}</div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  );
}

// ─── Root MobileApp ───────────────────────────────────────────────────────────
export default function MobileApp() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="mobile-frame mobile-shell">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {tab === "overview" && <MobileOverview onNav={setTab} />}
        {tab === "detail" && <MobileDetail onNav={setTab} />}
        {tab === "submit" && <MobileSubmit onNav={setTab} />}
        {tab === "history" && <MobileHistory />}
        {tab === "alerts" && <MobileAlerts />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
