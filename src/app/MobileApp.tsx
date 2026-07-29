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
  FileSpreadsheet, FileImage,
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
const N8N_CONG_TRUONG_URL =
  (import.meta as any)?.env?.VITE_N8N_CONG_TRUONG_URL || "/api/cong-truong";

// URL lấy danh sách đường lò chi tiết (tiết diện + mét theo ca) cho từng công trường
const N8N_CONG_TRUONG_CHITIET_URL =
  (import.meta as any)?.env?.VITE_N8N_CONG_TRUONG_CHITIET_URL || "/api/cong-truong-chi-tiet";

// ─── VN date parser (API trả "DD/MM/YYYY HH:MM:SS" - JS Date() không parse được) ──
function parseVNDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!m) return null;
  const [, dd, mm, yyyy, hh = "0", mi = "0", ss = "0"] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
  return isNaN(d.getTime()) ? null : d;
}

// ─── Module-level cache cho Overview data (mobile) ──────────────────────────
type MobileOverviewCache = {
  kpi: any | null;
  monthSummary: any | null;
  daySummary: any[];
  monthList: any[];
  tunnelRows: any[];
};
const mobileOverviewCache: Map<string, MobileOverviewCache> = new Map();

// ─── Module-level cache cho Công trường data (mobile) ────────────────────────
type MobileCongTruongCache = {
  thang: number;
  nam: number;
  remainingDays: number;
  keHoachThang: { lo_cho: number; dao_lo: number; xen_lo: number; chong_doi: number };
  khaiThac: any[];
  daoLo: any[];
};
const mobileCongTruongCache: Map<string, MobileCongTruongCache> = new Map();

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

// ─── Các kiểu dữ liệu (đồng bộ với Desktop, theo schema 3 bảng mới) ──────────
type MonthSummary = {
  thang: string | number;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};
type DaySummary = {
  ngay: string;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};
type KpiLoaiItem = { thuc_te: number; ke_hoach_nam: number; ty_le: number };
type KpiSummary = {
  lo_cho: KpiLoaiItem;
  dao_lo: KpiLoaiItem;
  xen_lo: KpiLoaiItem;
  chong_doi: KpiLoaiItem;
};

// 4 loại chỉ số KPI — render 4 thẻ gradient, xếp dọc full-width (mobile)
const MOBILE_LOAI_LIST: {
  type: "lo_cho" | "dao_lo" | "xen_lo" | "chong_doi";
  label: string;
  gradient: [string, string];
  accentBg: string;
  shadowRgba: string;
  unit: string;
  modalKey: "lo_cho" | "dao_lo" | "xen_lo" | "chong_doi";
}[] = [
  { type: "lo_cho",    label: "Sản lượng lũy kế",    gradient: ["#1E40AF", "#2563EB"], accentBg: "bg-blue-200",   shadowRgba: "rgba(37,99,235,0.3)",  unit: "tấn", modalKey: "lo_cho" },
  { type: "dao_lo",    label: "Tiến độ đào lò lũy kế", gradient: ["#92400E", "#D97706"], accentBg: "bg-amber-200",  shadowRgba: "rgba(217,119,6,0.3)", unit: "mét", modalKey: "dao_lo" },
  { type: "xen_lo",    label: "Xén lò lũy kế",        gradient: ["#065F46", "#10B981"], accentBg: "bg-emerald-200", shadowRgba: "rgba(16,185,129,0.3)", unit: "mét", modalKey: "xen_lo" },
  { type: "chong_doi", label: "Chống đội lũy kế",     gradient: ["#7C2D12", "#EA580C"], accentBg: "bg-orange-200",  shadowRgba: "rgba(234,88,12,0.3)",  unit: "mét", modalKey: "chong_doi" },
];
type CaHangMuc = {
  id: number;
  duong_lo: string | null;
  loai_cong_viec: string;
  san_luong: string | number | null;
  tiet_dien: string | number | null;
  tiet_dien_don_vi: string | null;
};
type CaData = {
  ca: number;
  ngay: string | null;
  cong_truong: string | null;
  so_lao_dong: string | number | null;
  cong_viec_khac: string | null;
  su_co: string | null;
  ghi_chu: string | null;
  hang_muc_by_type: {
    lo_cho: CaHangMuc[];
    dao_lo: CaHangMuc[];
    xen_lo: CaHangMuc[];
    chong_doi: CaHangMuc[];
  };
};
// Chi tiết đường lò trong 1 công trường (dùng cho bảng drill-down bên trong popup công trường)
type TunnelChiTiet = {
  duong_lo: string;
  tiet_dien?: number;
  tien_do: number;
  ca1: number;
  ca2: number;
  ca3: number;
};
type CongTruongChiTiet = {
  daoLo: TunnelChiTiet[];
  xenLo: TunnelChiTiet[];
  chongDoi: TunnelChiTiet[];
};
type BaoCaoListItem = {
  report_id: number;
  created_at: string;
  ngay: string | null;
  cong_truong: string | null;
  so_lao_dong: number | null;
  so_ca: number;
  tong_so_lao_dong: number;
  co_su_co: boolean;
};

type BaoCaoDetail = {
  report: { id: number; created_at: string };
  ca_list: CaData[];
};

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
  // State cho chart modal + dữ liệu đường lò
  const [chartModalOpen, setChartModalOpen] = useState<null | "lo_cho" | "dao_lo" | "xen_lo" | "chong_doi">(null);
  const [tunnelRows, setTunnelRows] = useState<any[]>([]);
  // State cho modal công trường
  const [congTruongModalOpen, setCongTruongModalOpen] = useState<null | { site: any; type: "khai_thac" | "dao_lo" }>(null);
  // Drill-down: bảng đường lò bên trong popup công trường + modal chi tiết 1 đường lò
  const [congTruongChiTiet, setCongTruongChiTiet] = useState<CongTruongChiTiet | null>(null);
  const [loadingCongTruongChiTiet, setLoadingCongTruongChiTiet] = useState(false);
  const [tunnelDetailModal, setTunnelDetailModal] = useState<null | {
    duong_lo: string;
    loaiCongViec: string;
    row: TunnelChiTiet;
  }>(null);

  useEffect(() => {
    if (!congTruongModalOpen) {
      setCongTruongChiTiet(null);
      setTunnelDetailModal(null);
      return;
    }
    let cancelled = false;
    setLoadingCongTruongChiTiet(true);
    fetch(`${N8N_CONG_TRUONG_CHITIET_URL}?thang=${month}&nam=${year}&site=${encodeURIComponent(congTruongModalOpen.site.tenCongTruong)}&type=${congTruongModalOpen.type}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled) return;
        const d = data?.data || data || null;
        setCongTruongChiTiet(d && typeof d === "object" ? {
          daoLo: Array.isArray(d.daoLo) ? d.daoLo : [],
          xenLo: Array.isArray(d.xenLo) ? d.xenLo : [],
          chongDoi: Array.isArray(d.chongDoi) ? d.chongDoi : [],
        } : null);
      })
      .catch(() => { if (!cancelled) setCongTruongChiTiet(null); })
      .finally(() => { if (!cancelled) setLoadingCongTruongChiTiet(false); });
    return () => { cancelled = true; };
  }, [congTruongModalOpen, month, year]);

  useEffect(() => {
    let cancelled = false;
    const key = `${year}-${viewMode}-${month}`;

    // Module-level cache: nếu đã có + chưa bấm refresh → dùng lại, không fetch
    if (mobileOverviewCache.has(key) && refreshTick === 0) {
      const cached = mobileOverviewCache.get(key)!;
      setMonthList(cached.monthList);
      setMonthSummary(cached.monthSummary);
      setDaySummary(cached.daySummary);
      setKpi(cached.kpi);
      setTunnelRows(cached.tunnelRows);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        // "Tháng" view luôn lấy full 12 tháng (thang=12); "Ngày" view lấy đúng tháng đang chọn
        const thangParam = viewMode === "month" ? 12 : month;
        const [resOV, resAL, resDL] = await Promise.all([
          fetch(`${N8N_OVERVIEW_URL}?thang=${thangParam}&nam=${year}`),
          fetch(`${N8N_CANH_BAO_LIST_URL}?limit=5`),
          fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`),
        ]);
        if (!resOV.ok) throw new Error("Lỗi tải tổng quan");
        const dataOV = await resOV.json();
        if (cancelled) return;
        const list: MonthSummary[] = Array.isArray(dataOV?.month) ? dataOV.month : dataOV?.month ? [dataOV.month] : [];
        const focusMonth = viewMode === "month" ? Number(year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12) : month;
        const monthSum = list.find(m => Number(m.thang) === focusMonth) || list[list.length - 1] || null;
        const daySum = Array.isArray(dataOV?.day) ? dataOV.day : [];
        const kpiVal = dataOV?.kpi ?? null;

        // Tunnel data
        const tunnelData = (resDL.ok ? ((await resDL.json())?.data || []) : []) as any[];

        // Lưu vào cache
        mobileOverviewCache.set(key, {
          kpi: kpiVal,
          monthSummary: monthSum,
          daySummary: daySum,
          monthList: list,
          tunnelRows: tunnelData,
        });

        setMonthList(list);
        setMonthSummary(monthSum);
        setDaySummary(daySum);
        setKpi(kpiVal);
        setTunnelRows(tunnelData);

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

  // ─── Fetch Công trường data (caching như overview) ───────────────────────────
  const [congTruongData, setCongTruongData] = useState<MobileCongTruongCache | null>(null);
  const [loadingCongTruong, setLoadingCongTruong] = useState(true);
  const [congTruongError, setCongTruongError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const key = `${year}-${month}`;

    if (mobileCongTruongCache.has(key) && refreshTick === 0) {
      const cached = mobileCongTruongCache.get(key)!;
      setCongTruongData(cached);
      setLoadingCongTruong(false);
      return;
    }

    async function load() {
      setLoadingCongTruong(true);
      setCongTruongError("");
      try {
        const res = await fetch(`${N8N_CONG_TRUONG_URL}?thang=${month}&nam=${year}`);
        if (!res.ok) throw new Error("Lỗi tải công trường");
        const data = await res.json();
        if (cancelled) return;
        const newData: MobileCongTruongCache = {
          thang: data.thang,
          nam: data.nam,
          remainingDays: data.remainingDays,
          keHoachThang: data.keHoachThang,
          khaiThac: data.khaiThac || [],
          daoLo: data.daoLo || [],
        };
        mobileCongTruongCache.set(key, newData);
        setCongTruongData(newData);
      } catch (err: any) {
        if (!cancelled) setCongTruongError(err?.message || "Không tải được dữ liệu công trường");
      } finally {
        if (!cancelled) setLoadingCongTruong(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [month, year, refreshTick]);

  // Sản lượng (lo_cho): thực tế theo viewMode (năm/tháng) + KH năm + % hoàn thành
  const kpiSLYear = (kpi as any)?.lo_cho?.thuc_te ?? 0;
  const kpiSLMonth = monthSummary ? Number(monthSummary.lo_cho_luy_ke) || 0 : 0;
  const kpiSanLuong = kpiSLYear > 0 ? kpiSLYear : kpiSLMonth;
  const kpiSLKH = (kpi as any)?.lo_cho?.ke_hoach_nam ?? 0;
  const kpiSLPct = (kpi as any)?.lo_cho?.ty_le ?? 0;

  // Tiến độ đào lò (dao_lo): thực tế theo viewMode (năm/tháng) + KH năm + % hoàn thành
  const kpiTDYear = (kpi as any)?.dao_lo?.thuc_te ?? 0;
  const kpiTDMonth = monthSummary ? Number(monthSummary.dao_lo_luy_ke) || 0 : 0;
  const kpiTienDo = kpiTDYear > 0 ? kpiTDYear : kpiTDMonth;
  const kpiTDKH = (kpi as any)?.dao_lo?.ke_hoach_nam ?? 0;
  const kpiTDPct = (kpi as any)?.dao_lo?.ty_le ?? 0;

  // Xén lò (xen_lo)
  const kpiXLYear = (kpi as any)?.xen_lo?.thuc_te ?? 0;
  const kpiXLMonth = monthSummary ? Number(monthSummary.xen_lo_luy_ke) || 0 : 0;
  const kpiXenLo = kpiXLYear > 0 ? kpiXLYear : kpiXLMonth;
  const kpiXLKH = (kpi as any)?.xen_lo?.ke_hoach_nam ?? 0;
  const kpiXLPct = (kpi as any)?.xen_lo?.ty_le ?? 0;

  // Chống đội (chong_doi)
  const kpiCDYear = (kpi as any)?.chong_doi?.thuc_te ?? 0;
  const kpiCDMonth = monthSummary ? Number(monthSummary.chong_doi_luy_ke) || 0 : 0;
  const kpiChongDoi = kpiCDYear > 0 ? kpiCDYear : kpiCDMonth;
  const kpiCDKH = (kpi as any)?.chong_doi?.ke_hoach_nam ?? 0;
  const kpiCDPct = (kpi as any)?.chong_doi?.ty_le ?? 0;

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
  const monthSL = monthSummary ? Number(monthSummary.lo_cho_luy_ke) || 0 : 0;
  const monthTD = monthSummary ? Number(monthSummary.dao_lo_luy_ke) || 0 : 0;
  const monthXL = monthSummary ? Number(monthSummary.xen_lo_luy_ke) || 0 : 0;
  const monthCD = monthSummary ? Number(monthSummary.chong_doi_luy_ke) || 0 : 0;
  // Kế hoạch tháng = kế hoạch năm / 12
  const keHoachThangSL = kpiSLKH / 12;
  const keHoachThangTD = kpiTDKH / 12;
  const keHoachThangXL = kpiXLKH / 12;
  const keHoachThangCD = kpiCDKH / 12;

  const remainingDaysPeriod = viewMode === "month" ? remainingDaysYear : remainingDaysMonth;
  // viewMode = "month" (năm): Còn lại = KH năm - lũy kế năm
  // viewMode = "day" (tháng): Còn lại = KH tháng - lũy kế tháng
  const conLaiSanLuong = viewMode === "month"
    ? Math.max(kpiSLKH - kpiSanLuong, 0)
    : Math.max(keHoachThangSL - monthSL, 0);
  const conLaiTienDo = viewMode === "month"
    ? Math.max(kpiTDKH - kpiTienDo, 0)
    : Math.max(keHoachThangTD - monthTD, 0);
  const conLaiXenLo = viewMode === "month"
    ? Math.max(kpiXLKH - kpiXenLo, 0)
    : Math.max(keHoachThangXL - monthXL, 0);
  const conLaiChongDoi = viewMode === "month"
    ? Math.max(kpiCDKH - kpiChongDoi, 0)
    : Math.max(keHoachThangCD - monthCD, 0);
  const tbSanLuongNgay = remainingDaysPeriod > 0 ? conLaiSanLuong / remainingDaysPeriod : 0;
  const tbTienDoNgay = remainingDaysPeriod > 0 ? conLaiTienDo / remainingDaysPeriod : 0;
  const tbXenLoNgay = remainingDaysPeriod > 0 ? conLaiXenLo / remainingDaysPeriod : 0;
  const tbChongDoiNgay = remainingDaysPeriod > 0 ? conLaiChongDoi / remainingDaysPeriod : 0;

  // Dữ liệu biểu đồ cho 4 loại KPI: thay đổi nguồn theo viewMode
  const chartLoCho = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.lo_cho_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.lo_cho_luy_ke) || 0 }));
  const chartDaoLo = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.dao_lo_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.dao_lo_luy_ke) || 0 }));
  const chartXenLo = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.xen_lo_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.xen_lo_luy_ke) || 0 }));
  const chartChongDoi = viewMode === "month"
    ? monthList.map(m => ({ day: `T${m.thang}`, value: Number(m.chong_doi_luy_ke) || 0 }))
    : daySummary.map(d => ({ day: d.ngay, value: Number(d.chong_doi_luy_ke) || 0 }));

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026, 2027];

  // Rút gọn tên công trường (đồng bộ với Desktop):
  //  - "CT Khai thác 1"     -> "1"
  //  - "Cơ giới hóa 1"      -> "Cơ giới hóa 1"  (giữ nguyên để tránh trùng với CT Khai thác 1)
  //  - "CT Đào lò 1"        -> "Đào lò 1"
  function simplifySiteName(name: string) {
    if (!name) return name;
    if (/^Cơ giới hóa\b/i.test(name)) return name;
    const daoLoMatch = name.match(/^CT\s+Đào lò\s+(\d+)$/i);
    if (daoLoMatch) return `Đào lò ${daoLoMatch[1]}`;
    const khaiThacMatch = name.match(/(\d+)$/);
    if (khaiThacMatch) return khaiThacMatch[1];
    return name;
  }

  const khaiThacSites = (congTruongData?.khaiThac || []).map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong) }));
  const daoLoSites = (congTruongData?.daoLo || []).map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong) }));
  const remainingDays = congTruongData?.remainingDays ?? 0;
  const keHoachThang = congTruongData?.keHoachThang || { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
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

          {/* 4 KPI gradient cards - sắp xếp dọc, full-width, click để xem biểu đồ */}
          <div className="flex flex-col gap-3 mb-4">
            {MOBILE_LOAI_LIST.map(({ type, label, gradient, accentBg, shadowRgba, unit, modalKey }) => {
              const cardData = {
                lo_cho:    { current: kpiSanLuong, pct: kpiSLPct, khn: kpiSLKH,   conLai: conLaiSanLuong,  tb: tbSanLuongNgay },
                dao_lo:    { current: kpiTienDo,  pct: kpiTDPct, khn: kpiTDKH,   conLai: conLaiTienDo,    tb: tbTienDoNgay },
                xen_lo:    { current: kpiXenLo,   pct: kpiXLPct, khn: kpiXLKH,   conLai: conLaiXenLo,     tb: tbXenLoNgay },
                chong_doi: { current: kpiChongDoi,pct: kpiCDPct, khn: kpiCDKH,   conLai: conLaiChongDoi,  tb: tbChongDoiNgay },
              }[type];
              const keHoach = viewMode === "month" ? cardData.khn : cardData.khn / 12;
              return (
                <div
                  key={type}
                  onClick={() => setChartModalOpen(modalKey)}
                  className="rounded-2xl p-4 shadow-lg cursor-pointer active:opacity-90"
                  style={{ background: `linear-gradient(135deg,${gradient[0]},${gradient[1]})`, boxShadow: `0 4px 20px ${shadowRgba}` }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setChartModalOpen(modalKey); }}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="text-[16px] text-white font-bold leading-tight">{label}</div>
                    <div className="bg-white/20 rounded-full px-3 py-1.5 text-[20px] font-bold text-white flex items-center gap-1 flex-shrink-0 leading-none">
                      <ArrowUpRight size={16} />
                      {Math.round(cardData.pct).toLocaleString("vi-VN")}%
                    </div>
                  </div>
                  <div className="font-extrabold text-white text-[44px] leading-none mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {Math.round(cardData.current).toLocaleString("vi-VN")}
                    <span className="text-xl font-medium ml-2 opacity-90">
                      / {Math.round(keHoach).toLocaleString("vi-VN")} {unit}
                    </span>
                  </div>
                  <div className="flex items-stretch gap-3 mb-2.5 bg-black/15 rounded-xl px-3.5 py-3">
                    <div className="flex-1 text-left">
                      <div className="text-[15px] text-white/85 mb-1.5 font-medium">Còn lại {viewMode === "month" ? "(năm)" : "(tháng)"}</div>
                      <div className="text-[24px] font-extrabold text-white leading-tight">
                        {Math.round(cardData.conLai).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">{unit}</span>
                      </div>
                    </div>
                    <div className="w-px bg-white/25 self-stretch" />
                    <div className="flex-1 text-left">
                      <div className="text-[15px] text-white/85 mb-1.5 font-medium">TB cần/ngày ({remainingDaysPeriod} ngày)</div>
                      <div className="text-[24px] font-extrabold text-white leading-tight">
                        {Math.round(cardData.tb).toLocaleString("vi-VN")} <span className="text-sm font-medium opacity-80">{unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full ${accentBg} rounded-full transition-all`} style={{ width: `${Math.min(100, cardData.pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Bảng 1: Công trường Khai thác ────────────────────────────────────── */}
          {(khaiThacSites.length || 0) > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <Package size={20} className="text-orange-600" />
                <div className="text-xl font-bold text-slate-900">Công trường Khai thác</div>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">Lũy kế tháng {month}/{year} · Click công trường để xem chi tiết</div>
              {loadingCongTruong ? (
                <div className="text-center text-xs text-slate-400 py-6">Đang tải dữ liệu công trường…</div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide -mx-4">
                  <table className="w-full text-[12px] border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "90px" }} />
                      <col style={{ width: "85px" }} />
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "85px" }} />
                      <col style={{ width: "120px" }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-2 py-2 text-left font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Công trường</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Tấn than</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét lò đào</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét xén</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét chống đội</th>
                        <th className="px-2 py-2 text-left font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {khaiThacSites.map(site => (
                        <tr
                          key={site.tenCongTruong}
                          onClick={() => setCongTruongModalOpen({ site, type: "khai_thac" })}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-2 py-2 font-semibold text-slate-900 whitespace-nowrap">{site.tenCongTruong}</td>
                          <td className="px-2 py-2 text-right font-bold text-blue-700 tabular-nums">{Math.round(site.lo_cho).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-right font-bold text-orange-600 tabular-nums">{Math.round(site.dao_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-right font-bold text-green-600 tabular-nums">{Math.round(site.xen_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-right font-bold text-red-600 tabular-nums">{Math.round(site.chong_doi).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-[10px] text-slate-500 whitespace-nowrap">{site.thoiGianBaoCao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─── Bảng 2: Công trường Đào lò ──────────────────────────────────────── */}
          {(daoLoSites.length || 0) > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-3">
              <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <Layers size={20} className="text-blue-600" />
                <div className="text-xl font-bold text-slate-900">Công trường Đào lò</div>
              </div>
              <div className="text-[10px] text-slate-500 mb-2">Lũy kế tháng {month}/{year} · Click công trường để xem chi tiết</div>
              {loadingCongTruong ? (
                <div className="text-center text-xs text-slate-400 py-6">Đang tải dữ liệu công trường…</div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide -mx-4">
                  <table className="w-full text-[12px] border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "90px" }} />
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "90px" }} />
                      <col style={{ width: "120px" }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-2 py-2 text-left font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Công trường</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét lò đào</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét xén</th>
                        <th className="px-2 py-2 text-right font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Mét chống đội</th>
                        <th className="px-2 py-2 text-left font-semibold text-slate-600 text-[10px] uppercase tracking-wide">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daoLoSites.map(site => (
                        <tr
                          key={site.tenCongTruong}
                          onClick={() => setCongTruongModalOpen({ site, type: "dao_lo" })}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-2 py-2 font-semibold text-slate-900 whitespace-nowrap">{site.tenCongTruong}</td>
                          <td className="px-2 py-2 text-right font-bold text-orange-600 tabular-nums">{Math.round(site.dao_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-right font-bold text-green-600 tabular-nums">{Math.round(site.xen_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-right font-bold text-red-600 tabular-nums">{Math.round(site.chong_doi).toLocaleString("vi-VN")}</td>
                          <td className="px-2 py-2 text-[10px] text-slate-500 whitespace-nowrap">{site.thoiGianBaoCao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

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

      {/* ─── Modal biểu đồ (khi click vào thẻ KPI) ──────────────────────────── */}
      {chartModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setChartModalOpen(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: "m-slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)" }}
          >
            <div className="flex justify-center py-3">
              <div style={{ width: 40, height: 4, borderRadius: 99, background: "#CBD5E1" }} />
            </div>
            <div className="flex items-center justify-between px-5 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {(() => {
                    const labels: Record<string, string> = {
                      lo_cho: "Biểu đồ sản lượng (lũy kế)",
                      dao_lo: "Biểu đồ đào lò (lũy kế)",
                      xen_lo: "Biểu đồ xén lò (lũy kế)",
                      chong_doi: "Biểu đồ chống đội (lũy kế)",
                    };
                    return labels[chartModalOpen!] || "Biểu đồ";
                  })()}
                </h2>
                <p className="text-[10px] text-slate-500">
                  {viewMode === "month" ? "Theo tháng trong năm" : "Theo ngày trong tháng"} · {viewMode === "month" ? `Năm ${year}` : `Tháng ${month}/${year}`}
                </p>
              </div>
              <button
                onClick={() => setChartModalOpen(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-3 pb-5">
              {(() => {
                const cfg: Record<string, { data: { day: string; value: number }[]; color: string; unitLabel: string }> = {
                  lo_cho:    { data: chartLoCho,    color: C.primary,  unitLabel: "tấn" },
                  dao_lo:    { data: chartDaoLo,    color: C.warning,  unitLabel: "mét" },
                  xen_lo:    { data: chartXenLo,    color: "#10B981",  unitLabel: "mét" },
                  chong_doi: { data: chartChongDoi, color: "#EA580C",  unitLabel: "mét" },
                };
                const cur = cfg[chartModalOpen!] || cfg.lo_cho;
                const TooltipEl = cur.unitLabel === "tấn" ? ProductionTooltip : ProgressTooltip;
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cur.data} margin={{ top: 20, right: 8, bottom: 0, left: -8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<TooltipEl />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                      <Bar dataKey="value" fill={cur.color} radius={[3, 3, 0, 0]} maxBarSize={viewMode === "month" ? 24 : 20} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal chi tiết Công trường (khi click vào công trường) ───────────────── */}
      {congTruongModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setCongTruongModalOpen(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: "m-slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)" }}
          >
            <div className="flex justify-center py-3">
              <div style={{ width: 40, height: 4, borderRadius: 99, background: "#CBD5E1" }} />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-200 flex-shrink-0">
              <div>
                <h2 className="font-bold text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  Chi tiết: {congTruongModalOpen.site.tenCongTruong} ({congTruongModalOpen.type === "khai_thac" ? "Khai thác" : "Đào lò"})
                </h2>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  Tháng {month}/{year} · Cập nhật: {congTruongModalOpen.site.thoiGianBaoCao}
                </p>
              </div>
              <button
                onClick={() => setCongTruongModalOpen(null)}
                className="p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-3 pb-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {(() => {
                  const site = congTruongModalOpen.site;
                  const isKhaiThac = congTruongModalOpen.type === "khai_thac";
                  const items = isKhaiThac
                    ? [
                        { label: "Tấn than (lũy kế)", value: site.lo_cho, unit: "tấn", keHoach: keHoachThang.lo_cho, conLai: site.conLai?.lo_cho, tbNgay: site.tbNgay?.lo_cho },
                        { label: "Mét lò đào (lũy kế)", value: site.dao_lo, unit: "mét", keHoach: keHoachThang.dao_lo, conLai: site.conLai?.dao_lo, tbNgay: site.tbNgay?.dao_lo },
                        { label: "Mét xén (lũy kế)", value: site.xen_lo, unit: "mét", keHoach: keHoachThang.xen_lo, conLai: site.conLai?.xen_lo, tbNgay: site.tbNgay?.xen_lo },
                        { label: "Mét chống đội (lũy kế)", value: site.chong_doi, unit: "mét", keHoach: keHoachThang.chong_doi, conLai: site.conLai?.chong_doi, tbNgay: site.tbNgay?.chong_doi },
                      ]
                    : [
                        { label: "Mét lò đào (lũy kế)", value: site.dao_lo, unit: "mét", keHoach: keHoachThang.dao_lo, conLai: site.conLai?.dao_lo, tbNgay: site.tbNgay?.dao_lo },
                        { label: "Mét xén (lũy kế)", value: site.xen_lo, unit: "mét", keHoach: keHoachThang.xen_lo, conLai: site.conLai?.xen_lo, tbNgay: site.tbNgay?.xen_lo },
                        { label: "Mét chống đội (lũy kế)", value: site.chong_doi, unit: "mét", keHoach: keHoachThang.chong_doi, conLai: site.conLai?.chong_doi, tbNgay: site.tbNgay?.chong_doi },
                      ];
                  return items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">{item.label}</p>
                      <div className="text-[34px] font-black text-slate-900 leading-none">
                        {Math.round(item.value).toLocaleString("vi-VN")}
                        <span className="text-base font-bold ml-1.5 opacity-70">{item.unit}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t-2 border-slate-200 text-sm">
                        <div className="text-center">
                          <div className="text-slate-500 font-bold mb-1">KH tháng</div>
                          <div className="font-extrabold text-blue-700 text-base">{Math.round(item.keHoach).toLocaleString("vi-VN")}<span className="text-xs font-bold ml-0.5">{item.unit}</span></div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-500 font-bold mb-1">Còn thiếu</div>
                          <div className="font-extrabold text-red-600 text-base">{Math.round(item.conLai || 0).toLocaleString("vi-VN")}<span className="text-xs font-bold ml-0.5">{item.unit}</span></div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-500 font-bold mb-1">TB/ngày ({remainingDays} ng)</div>
                          <div className="font-extrabold text-orange-600 text-base">{Math.round(item.tbNgay || 0).toLocaleString("vi-VN")}<span className="text-xs font-bold ml-0.5">{item.unit}</span></div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Bảng drill-down: danh sách đường lò trong công trường */}
              <div className="border-t-2 border-slate-200 pt-4">
                <h3 className="text-base font-black text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  Danh sách đường lò trong công trường {congTruongModalOpen.type === "khai_thac" ? "Khai thác" : "Đào lò"} {congTruongModalOpen.site.tenCongTruong}
                </h3>
                {loadingCongTruongChiTiet ? (
                  <div className="text-center py-4 text-sm text-slate-500 font-medium">Đang tải dữ liệu đường lò...</div>
                ) : !congTruongChiTiet ? (
                  <div className="text-center py-4 text-sm text-slate-400">Chưa có dữ liệu đường lò cho công trường này.</div>
                ) : (() => {
                    const groups = [
                      { key: "daoLo"    as const, label: "Lò đào",      color: "#D97706", bgHeader: "#FEF3C7", rows: congTruongChiTiet.daoLo,    showTietDien: true  },
                      { key: "xenLo"    as const, label: "Lò xén",      color: "#10B981", bgHeader: "#D1FAE5", rows: congTruongChiTiet.xenLo,    showTietDien: true  },
                      { key: "chongDoi" as const, label: "Lò chống đội", color: "#EA580C", bgHeader: "#FFEDD5", rows: congTruongChiTiet.chongDoi, showTietDien: false },
                    ];
                    const maxRows = Math.max(...groups.map(g => g.rows.length));
                    const total = groups.reduce((s, g) => s + g.rows.length, 0);
                    if (total === 0) {
                      return <div className="text-center py-4 text-sm text-slate-400">Công trường này chưa có đường lò nào trong tháng.</div>;
                    }
                    return (
                      <div className="rounded-xl border-2 border-slate-200 overflow-hidden">
                        <table className="w-full text-sm table-fixed">
                          <thead>
                            <tr>
                              {groups.map(g => (
                                <th key={g.key} className="px-2 py-2.5 text-center font-black text-sm" style={{ background: g.bgHeader, color: g.color, width: "33.33%" }}>
                                  {g.label} <span className="font-bold opacity-70 text-xs">({g.rows.length})</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: maxRows }).map((_, idx) => (
                              <tr key={idx} className="border-t border-slate-100">
                                {groups.map(g => {
                                  const row = g.rows[idx];
                                  return (
                                    <td key={g.key} className="px-2 py-2.5 text-center align-middle">
                                      {row ? (
                                        <button
                                          onClick={() => setTunnelDetailModal({
                                            duong_lo: row.duong_lo,
                                            loaiCongViec: g.label,
                                            row,
                                          })}
                                          className="font-bold text-blue-700 text-sm hover:text-blue-900 hover:underline transition-colors break-words"
                                        >
                                          {row.duong_lo}
                                        </button>
                                      ) : (
                                        <span className="text-slate-300 text-sm">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phụ: chi tiết 1 đường lò (tiết diện + mét theo ca) */}
      {tunnelDetailModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setTunnelDetailModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: "m-slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)" }}
          >
            <div className="flex justify-center py-3">
              <div style={{ width: 40, height: 4, borderRadius: 99, background: "#CBD5E1" }} />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b-2 border-slate-200 flex-shrink-0">
              <div>
                <h3 className="font-black text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {tunnelDetailModal.duong_lo}
                </h3>
                <p className="text-sm font-bold text-slate-600 mt-1">
                  {tunnelDetailModal.loaiCongViec} · Lũy kế tháng {month}/{year}
                </p>
              </div>
              <button
                onClick={() => setTunnelDetailModal(null)}
                className="p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-700 uppercase mb-1.5">Tiết diện</p>
                  <div className="text-[34px] font-black text-slate-900 leading-none">
                    {tunnelDetailModal.row.tiet_dien !== undefined && tunnelDetailModal.row.tiet_dien !== null ? tunnelDetailModal.row.tiet_dien.toLocaleString("vi-VN") : "—"}
                    {tunnelDetailModal.row.tiet_dien !== undefined && tunnelDetailModal.row.tiet_dien !== null && <span className="text-base font-bold ml-1 opacity-70">m²</span>}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-700 uppercase mb-1.5">Mét lũy kế</p>
                  <div className="text-[34px] font-black text-slate-900 leading-none">
                    {Math.round(tunnelDetailModal.row.tien_do).toLocaleString("vi-VN")}
                    <span className="text-base font-bold ml-1 opacity-70">mét</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-700 uppercase mb-2.5">Mét theo ca</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { label: "Ca 1", value: tunnelDetailModal.row.ca1 },
                    { label: "Ca 2", value: tunnelDetailModal.row.ca2 },
                    { label: "Ca 3", value: tunnelDetailModal.row.ca3 },
                  ]).map(c => (
                    <div key={c.label} className="bg-white rounded-lg border-2 border-slate-200 p-2.5 text-center">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">{c.label}</div>
                      <div className="text-[28px] font-black text-blue-700 leading-none">
                        {Math.round(c.value || 0).toLocaleString("vi-VN")}
                      </div>
                      <div className="text-xs font-bold text-slate-500 mt-1">mét</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
type MobileTemplateType = "daolo" | "khai_thac";
type MobileFileValidation = { valid: boolean; type?: MobileTemplateType; error?: string };
const MOBILE_TEMPLATE_FILES: Record<MobileTemplateType, { url: string; name: string; label: string }> = {
  daolo: { url: "/templates/baocaocongtruong_daolo.xlsx", name: "baocaocongtruong_daolo.xlsx", label: "Đào lò" },
  khai_thac: { url: "/templates/baocaocongtruong_Khai thac.xlsx", name: "baocaocongtruong_Khai thac.xlsx", label: "Khai thác" },
};

// Validate file Excel: check Row 2 headers (giống desktop)
async function validateMobileExcelFile(file: File): Promise<MobileFileValidation> {
  if (!file.name.match(/\.xlsx$/i)) {
    return { valid: false, error: "Chỉ chấp nhận file Excel (.xlsx) theo đúng template mẫu. Vui lòng tải template Đào lò hoặc Khai thác." };
  }
  try {
    const buffer = await file.arrayBuffer();
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet?.["!ref"]) return { valid: false, error: "File Excel rỗng" };
    const range = XLSX.utils.decode_range(sheet["!ref"]!);
    const headers: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 2, c });
      headers.push(sheet[addr]?.v?.toString().trim() || "");
    }
    const col5 = (headers[5] || "").toLowerCase();
    if (col5.includes("tấn than") || col5.includes("lò chợ")) return { valid: true, type: "khai_thac" };
    if (col5.includes("đường lò đào")) return { valid: true, type: "daolo" };
    return {
      valid: false,
      error: "File không đúng cấu trúc template. Vui lòng tải template mẫu và điền theo đúng định dạng.",
    };
  } catch (e: any) {
    return { valid: false, error: "Không thể đọc file Excel: " + (e?.message || "lỗi không xác định") };
  }
}

function MobileSubmit({ onNav }: { onNav: (t: TabId) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [validation, setValidation] = useState<MobileFileValidation | null>(null);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState<ReportItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateAndSetMobileFile = async (f: File | null) => {
    setFile(f);
    setValidation(null);
    if (!f) return;
    setValidating(true);
    const result = await validateMobileExcelFile(f);
    setValidation(result);
    setValidating(false);
  };

  const handleDownloadMobileTemplate = (type: MobileTemplateType) => {
    const tpl = MOBILE_TEMPLATE_FILES[type];
    const link = document.createElement("a");
    link.href = tpl.url;
    link.download = tpl.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (status === "processing") return;
    if (!file) {
      alert("Vui lòng tải lên tệp báo cáo!");
      return;
    }
    if (validation && !validation.valid) {
      alert(validation.error || "File không hợp lệ");
      return;
    }
    const formData = new FormData();
    if (file) formData.append("file", file);
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
    } catch (err: any) {
      setErrMsg(err?.message || "Không thể kết nối n8n. Kiểm tra URL webhook.");
      setStatus("error");
    }
  };

  const closeOverlay = () => { setStatus("idle"); setItems([]); };

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
              if (f) validateAndSetMobileFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl p-6 text-center mb-3 cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? C.primary : (validation && !validation.valid ? "#FCA5A5" : file ? C.success : C.border)}`,
              background: dragging ? C.primaryLight : (validation && !validation.valid ? "#FEF2F2" : file ? C.successLight : C.card),
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.xlsx,.csv"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) validateAndSetMobileFile(f);
              }}
            />
            {file ? (
              <>
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{
                  background: validation && !validation.valid ? "#FEE2E2" : C.successLight
                }}>
                  {file.name.match(/\.(xlsx|csv)$/i) ? (
                    <FileSpreadsheet size={26} className={validation && !validation.valid ? "text-red-600" : "text-emerald-600"} />
                  ) : (
                    <FileImage size={26} className={validation && !validation.valid ? "text-red-600" : "text-emerald-600"} />
                  )}
                </div>
                <div className={`font-bold text-[13px] ${validation && !validation.valid ? "text-red-700" : "text-emerald-700"}`}>{file.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</div>

                {/* Validation status */}
                {validating && (
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-blue-600">
                    <Loader2 size={12} className="animate-spin" />
                    Đang kiểm tra...
                  </div>
                )}
                {!validating && validation?.valid && (
                  <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                    ✓ {validation.type === "daolo" ? "Đào lò" : validation.type === "khai_thac" ? "Khai thác" : "Ảnh"}
                  </div>
                )}
                {!validating && validation && !validation.valid && (
                  <div className="mt-2 text-[10px] text-red-700 bg-red-50 px-2 py-1.5 rounded-md leading-tight max-w-xs">
                    ⚠ {validation.error}
                  </div>
                )}

                <button
                  onClick={e => { e.stopPropagation(); validateAndSetMobileFile(null); }}
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
                <div className="text-[11px] text-slate-500 mt-1 mb-3">Excel (.xlsx, .csv) hoặc ảnh (.jpg, .png) — tối đa 25MB</div>
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[12px] font-bold active:opacity-80"
                >
                  Chọn tệp
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex gap-1 flex-1">
              <button
                onClick={() => handleDownloadMobileTemplate("daolo")}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-1 active:opacity-70"
              >
                <FileSpreadsheet size={11} /> Đào lò
              </button>
              <button
                onClick={() => handleDownloadMobileTemplate("khai_thac")}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-2 py-1 active:opacity-70"
              >
                <FileSpreadsheet size={11} /> Khai thác
              </button>
            </div>
            <span className="text-[10px] text-slate-500">tối đa 25MB</span>
          </div>
        </div>
      </div>

      {/* Footer button sticky */}
      <div
        className="absolute left-0 right-0 flex gap-2 p-3 border-t bg-white"
        style={{ bottom: 80, borderColor: C.border }}
      >
        <button
          onClick={() => { setFile(null); }}
          className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-[13px] active:opacity-70"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={status === "processing" || !file || (validation !== null && !validation.valid)}
          className="flex-[2] py-3 rounded-xl text-white font-bold text-[13px] flex items-center justify-center gap-2 disabled:cursor-not-allowed active:opacity-80"
          style={{
            background: !file
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [list, setList] = useState<BaoCaoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<BaoCaoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [expandedCas, setExpandedCas] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams();
        if (fromDate) params.set("tu_ngay", fromDate);
        if (toDate)   params.set("den_ngay", toDate);
        if (search.trim()) params.set("cong_truong", search.trim());
        const qs = params.toString();
        const url = `${N8N_BAO_CAO_LIST_URL}${qs ? "?" + qs : ""}`;
        const res = await fetch(url);
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
  }, [refreshTick, search, fromDate, toDate]);

  useEffect(() => {
    if (selectedId == null) { setDetail(null); return; }
    setExpandedCas(new Set()); // reset accordion khi mở report mới
    let cancelled = false;
    async function loadDetail() {
      setDetailLoading(true);
      try {
        const res = await fetch(`${N8N_BAO_CAO_DETAIL_URL}?id=${selectedId}`);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setDetail({
            report: data.report,
            ca_list: Array.isArray(data.ca_list) ? data.ca_list : [],
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

  const caList = detail?.ca_list ?? [];

  const filtered = list;
  const filterActive = !!(search || fromDate || toDate);

  // Format functions
  const fmtDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };
  const fmtDateTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad2 = (n: number) => String(n).padStart(2, "0");
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  const toggleCa = (ca: number) => {
    setExpandedCas(prev => {
      const next = new Set(prev);
      next.has(ca) ? next.delete(ca) : next.add(ca);
      return next;
    });
  };

  // Mapping 4 loại công việc → màu sắc (đồng bộ với Desktop)
  const TYPE_CFG: Record<string, { label: string; unit: string; gradient: [string, string]; textColor: string }> = {
    lo_cho:    { label: "Sản lượng (lò chợ)", unit: "tấn", gradient: ["#065F46", "#10B981"], textColor: "text-emerald-700" },
    dao_lo:    { label: "Đào lò",             unit: "mét",  gradient: ["#1E40AF", "#2563EB"], textColor: "text-blue-700" },
    xen_lo:    { label: "Xén lò",             unit: "mét",  gradient: ["#9A3412", "#EA580C"], textColor: "text-orange-700" },
    chong_doi: { label: "Chống đội",          unit: "mét",  gradient: ["#6B21A8", "#A855F7"], textColor: "text-purple-700" },
  };

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
              placeholder="Tìm kiếm theo công trường…"
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
        <div className="flex items-center gap-1.5 mt-2 bg-white/5 rounded-lg border border-white/10 px-2.5 py-1.5">
          <Calendar size={12} color="#64748B" />
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            title="Từ ngày"
            className="bg-transparent text-[12px] text-slate-100 outline-none flex-1 min-w-0 [color-scheme:dark]"
          />
          <span className="text-slate-500 text-[10px]">→</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={e => setToDate(e.target.value)}
            title="Đến ngày"
            className="bg-transparent text-[12px] text-slate-100 outline-none flex-1 min-w-0 [color-scheme:dark]"
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); }}
              title="Xoá khoảng ngày"
              className="text-slate-400 active:text-red-400 transition-colors p-1"
              aria-label="Xoá khoảng ngày"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {filterActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 mb-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
              <Filter size={11} />
              <span>
                {filtered.length} kết quả
                {search && ` · "${search}"`}
                {fromDate && ` · từ ${fromDate}`}
                {toDate && ` · đến ${toDate}`}
              </span>
            </div>
          )}
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
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-slate-900 text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        {fmtDate(it.ngay)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[12px] text-slate-700 font-semibold truncate">{it.cong_truong || "—"}</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 leading-tight flex-shrink-0">
                      <div>{datePart || "—"}</div>
                      <div>{timePart || ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <strong>{it.so_ca}</strong> ca
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
                      {it.tong_so_lao_dong ?? 0} LĐ
                    </span>
                    {it.co_su_co ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <span className="w-1 h-1 rounded-full bg-red-500" /> Có sự cố
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1 h-1 rounded-full bg-green-500" /> Bình thường
                      </span>
                    )}
                  </div>
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

      {/* Bottom sheet chi tiết — accordion theo Ca */}
      <Sheet
        open={selectedId != null}
        onClose={() => setSelectedId(null)}
        title="Chi tiết báo cáo"
        subtitle={`#${selectedId} · ${caList.length} ca`}
        maxHeight="92%"
      >
        {detailLoading && (
          <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
            <Loader2 size={14} className="animate-spin" />Đang tải chi tiết…
          </div>
        )}
        {!detailLoading && detail && caList.length === 0 && (
          <div className="text-xs text-slate-400 italic py-10 text-center">
            Báo cáo này chưa có dữ liệu ca nào.
          </div>
        )}
        {!detailLoading && caList.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {caList.map((ca, idx) => {
              const isOpen = expandedCas.has(ca.ca);
              const s = (ca.su_co || "").trim();
              const isInc = s && !s.toLowerCase().includes("bình thường") && !s.toLowerCase().includes("không có sự cố");
              return (
                <div key={ca.ca ?? idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCa(ca.ca)}
                    className="w-full flex items-center justify-between px-3 py-3 active:bg-slate-50"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#1E40AF,#2563EB)" }}>
                        Ca {ca.ca}
                      </span>
                      <span className="text-[12px] font-bold text-slate-900">{fmtDate(ca.ngay)}</span>
                      {isInc ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1 h-1 rounded-full bg-red-500" /> Sự cố
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1 h-1 rounded-full bg-green-500" /> BT
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">· {Number(ca.so_lao_dong) || 0} LĐ</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-3 py-3 flex flex-col gap-3" style={{ background: "#FAFBFC" }}>
                      <div className="grid grid-cols-2 gap-2">
                        <InfoCell label="Ngày" value={fmtDate(ca.ngay)} />
                        <InfoCell label="Công trường" value={ca.cong_truong || "—"} />
                        <InfoCell label="Số lao động" value={`${Number(ca.so_lao_dong) || 0} người`} />
                        <InfoCell label="Trạng thái" value={isInc ? "Có sự cố" : "Bình thường"} tone={isInc ? "red" : "green"} />
                      </div>

                      {(ca.cong_viec_khac || ca.su_co || ca.ghi_chu) && (
                        <div className="flex flex-col gap-2">
                          {ca.cong_viec_khac && <InfoCell label="Công việc khác" value={ca.cong_viec_khac} />}
                          {ca.su_co && <InfoCell label="Sự cố" value={ca.su_co} tone={isInc ? "red" : "gray"} />}
                          {ca.ghi_chu && <InfoCell label="Ghi chú" value={ca.ghi_chu} />}
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {(["lo_cho", "dao_lo", "xen_lo", "chong_doi"] as const).map(type => {
                          const cfg = TYPE_CFG[type];
                          const items = (ca.hang_muc_by_type?.[type] as any[]) || [];
                          const total = items.reduce((sum, h) => sum + (Number(h.san_luong) || 0), 0);
                          return (
                            <div key={type} className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                              <div
                                className="flex items-center justify-between px-3 py-2"
                                style={{ background: `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1]})` }}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                                  <span className="text-[12px] font-bold text-white">{cfg.label}</span>
                                </div>
                                <span className="text-[10px] font-semibold text-white/90 bg-white/15 px-1.5 py-0.5 rounded-full border border-white/20">
                                  {items.length} mục · {cfg.unit}
                                </span>
                              </div>
                              {items.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic px-3 py-2">Không có hạng mục trong ca này.</p>
                              ) : (
                                <div className="divide-y divide-slate-100">
                                  {items.map(h => (
                                    <div key={h.id} className="px-3 py-2">
                                      <p className="text-[12px] font-semibold text-slate-900 truncate" title={h.duong_lo || ""}>
                                        {h.duong_lo || "—"}
                                      </p>
                                      <div className="flex items-center justify-between mt-0.5">
                                        {h.tiet_dien ? (
                                          <p className="text-[10px] text-slate-500">
                                            TD: <strong className="text-slate-700">{Number(h.tiet_dien).toLocaleString("vi-VN")}</strong> {h.tiet_dien_don_vi || "m²"}
                                          </p>
                                        ) : <span />}
                                        <p className={`text-[13px] font-black tabular-nums ${cfg.textColor}`}>
                                          {Number(h.san_luong || 0).toLocaleString("vi-VN")} <span className="text-[10px] font-medium text-slate-400">{cfg.unit}</span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="px-3 py-1.5 bg-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Tổng</span>
                                    <span className="text-[12px] font-black tabular-nums text-slate-900">
                                      {total.toLocaleString("vi-VN")} {cfg.unit}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Sheet>
    </div>
  );
}

// Cell hiển thị thông tin nhỏ (dùng trong Mobile sheet)
function InfoCell({ label, value, tone = "gray" }: { label: string; value: string; tone?: "gray" | "red" | "green" }) {
  const valueClass = tone === "red" ? "text-red-700" : tone === "green" ? "text-green-700" : "text-slate-900";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-[12px] font-semibold mt-0.5 break-words ${valueClass}`}>{value}</p>
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


