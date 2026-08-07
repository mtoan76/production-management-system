import React from 'react';
import {
  Upload, Bell, LayoutDashboard, FileText, PlusCircle, History,
  AlertTriangle, CheckCircle, AlertCircle, Search, X, ChevronRight, ChevronDown,
  Loader2, Download, Clock, MapPin, User, Layers, Package, ArrowUpRight,
  Info, Calendar, RefreshCw, Eye, Filter, Sparkles, Shield, CheckCircle2,
  FileSpreadsheet, FileImage,
} from 'lucide-react';
import { TabId, SeverityType, AlertStatus } from '../types';
import { fmtTime, fmtDate, getInitials, getColor, normalizeVN, getSanLuong } from '../utils/format';
import { SEVERITY_CFG, ALERT_STATUS_CFG } from '../utils/format';

// ─── Color constants ──────────────────────────────────────────
export const C = {
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  success: "#059669",
  successLight: "#D1FAE5",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  dark: "#0F172A",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  muted: "#64748B",
  text: "#1E293B",
  textLight: "#94A3B8",
};

// ─── Shared badges ────────────────────────────────────────────
export function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CFG[severity as SeverityType] ?? SEVERITY_CFG["Cảnh báo"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {severity}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: string }) {
  const cfg = ALERT_STATUS_CFG[status as AlertStatus] ?? ALERT_STATUS_CFG["Mới"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.badge} ${cfg.text}`}>
      {status}
    </span>
  );
}

export function StatusPill({ status }: { status?: string }) {
  const norm = normalizeVN(status);
  let label = "Không rõ";
  let bg = "#F1F5F9";
  let color = "#475569";
  if (norm.includes("nghiem trong")) { label = "Nghiêm trọng"; bg = "#FEE2E2"; color = "#DC2626"; }
  else if (norm.includes("canh bao")) { label = "Cảnh báo"; bg = "#FEF3C7"; color = "#D97706"; }
  else if (norm.includes("binh thuong")) { label = "Bình thường"; bg = "#D1FAE5"; color = "#059669"; }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white" style={{ width: size, height: size, background: getColor(name), fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

// ─── Tooltip biểu đồ ─────────────────────────────────────────
export const ProductionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
      <div className="text-slate-400 mb-0.5">{label}</div>
      <div className="font-semibold">{Number(payload[0].value).toLocaleString("vi-VN")} tấn</div>
    </div>
  );
};

export const ProgressTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
      <div className="text-slate-400 mb-0.5">{label}</div>
      <div className="font-semibold">{payload[0].value} mét</div>
    </div>
  );
};

// ─── AppBar ───────────────────────────────────────────────────
export function AppBar({ title = "Báo cáo tổng quan" }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base" style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", border: "1px solid rgba(255,255,255,0.12)" }}>N</div>
        <div>
          <div className="text-white font-bold text-[15px] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</div>
          </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="Nguyễn Văn A" size={32} />
      </div>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────
export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const tabs: { id: TabId; label: string; icon: any; center?: boolean }[] = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "detail", label: "Chi tiết", icon: FileText },
    { id: "submit", label: "Nhập", icon: PlusCircle, center: true },
    { id: "history", label: "Lịch sử", icon: History },
    { id: "alerts", label: "Cảnh báo", icon: Bell },
  ];

  return (
    <div className="mobile-bottom-nav flex items-center px-1 pt-2 border-t" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.08)" }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        if (tab.center) {
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)} className="flex-1 flex flex-col items-center gap-1 px-1 -mt-3 active:opacity-80" aria-label={tab.label}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: isActive ? "linear-gradient(135deg,#3B82F6,#1D4ED8)" : "linear-gradient(135deg,#2563EB,#1E40AF)", boxShadow: "0 4px 12px rgba(37,99,235,0.45)" }}>
                <Icon size={22} color="#fff" />
              </div>
              <span className={`text-[10px] font-semibold leading-none ${isActive ? "text-blue-400" : "text-slate-400"}`}>{tab.label}</span>
            </button>
          );
        }
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} className="flex-1 flex flex-col items-center gap-1 px-1 py-1 active:opacity-80" aria-label={tab.label}>
            <Icon size={20} color={isActive ? C.primary : "#475569"} strokeWidth={isActive ? 2.5 : 1.6} />
            <span className={`text-[10px] leading-none ${isActive ? "font-semibold text-blue-400" : "font-normal text-slate-400"}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Sheet (bottom-sheet modal) ──────────────────────────────
export function Sheet({ open, onClose, title, subtitle, maxHeight = "88%", children }: {
  open: boolean; onClose: () => void; title?: string; subtitle?: string; maxHeight?: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/55" onClick={onClose}>
      <div className="bg-white rounded-t-3xl overflow-y-auto scrollbar-hide animate-m-slideUp pb-10" style={{ maxHeight }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-slate-200" />
        </div>
        {(title || subtitle) && (
          <div className="px-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && <div className="font-extrabold text-slate-900 text-[17px] leading-snug" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</div>}
              {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
            </div>
            <button onClick={onClose} className="bg-slate-100 rounded-lg p-1.5 flex-shrink-0 active:bg-slate-200" aria-label="Đóng">
              <X size={16} color={C.muted} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── InfoCell (for mobile sheets) ─────────────────────────────
export function InfoCell({ label, value, tone = "gray" }: { label: string; value: string; tone?: "gray" | "red" | "green" }) {
  const valueClass = tone === "red" ? "text-red-700" : tone === "green" ? "text-green-700" : "text-slate-900";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-[12px] font-semibold mt-0.5 break-words ${valueClass}`}>{value}</p>
    </div>
  );
}

// ─── Report Item Card (for mobile submit overlay) ─────────────
import { ReportItem } from '../types';

export function ReportItemCard({ item }: { item: ReportItem }) {
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
      <div className="flex items-start gap-1.5 mt-1 px-2 py-1.5 rounded-md" style={hasCanhBao ? { background: "#FEE2E2", border: "1px solid #FECACA" } : { background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
        <AlertTriangle size={11} className={`mt-0.5 flex-shrink-0 ${hasCanhBao ? "text-red-600" : "text-slate-400"}`} />
        <p className={`text-[11px] ${hasCanhBao ? "text-red-800" : "text-slate-500"}`}>
          <span className="font-bold">Cảnh báo: </span>{hasCanhBao ? canhBao : "Không có"}
        </p>
      </div>
    </div>
  );
}