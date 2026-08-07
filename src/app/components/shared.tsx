import React from 'react';
import { SeverityType, AlertStatus, StatusType, HistoryStatus } from '../types';
import { SEVERITY_CFG, ALERT_STATUS_CFG, HISTORY_STATUS_CFG, normalizeVN, getSanLuong } from '../utils/format';

// ─── Shared badge components ──────────────────────────────────

export function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CFG[severity as SeverityType] ?? SEVERITY_CFG["Cảnh báo"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {severity}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: string }) {
  const cfg = ALERT_STATUS_CFG[status as AlertStatus] ?? ALERT_STATUS_CFG["Mới"];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge} ${cfg.textColor}`}>
      {status}
    </span>
  );
}

export function HistoryStatusBadge({ status }: { status: string }) {
  const cfg = HISTORY_STATUS_CFG[status as HistoryStatus] ?? HISTORY_STATUS_CFG["Hoàn thành"];
  const isFallback = !(HISTORY_STATUS_CFG[status as HistoryStatus]);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
      {isFallback && <span className="text-[10px] opacity-50">(?)</span>}
    </span>
  );
}

export function StatusDotBadge({ status }: { status: StatusType }) {
  if (status === "Không sản xuất") {
    return <span className="text-xs text-gray-400 italic">Không sản xuất</span>;
  }
  const map: Record<string, { dot: string; text: string }> = {
    "Bình thường":  { dot: "bg-green-500",  text: "text-green-700" },
    "Cảnh báo":     { dot: "bg-yellow-500", text: "text-yellow-700" },
    "Nghiêm trọng": { dot: "bg-red-500",    text: "text-red-700" },
  };
  const c = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {status}
    </span>
  );
}

export function StatusPill({ status }: { status?: string }) {
  const norm = normalizeVN(status);
  let label = "Không rõ";
  let bg = "#F3F4F6";
  let color = "#6B7280";
  if (norm.includes("nghiem trong")) {
    label = "Nghiêm trọng"; bg = "#FEF2F2"; color = "#DC2626";
  } else if (norm.includes("canh bao")) {
    label = "Cảnh báo"; bg = "#FFFBEB"; color = "#D97706";
  } else if (norm.includes("binh thuong")) {
    label = "Bình thường"; bg = "#ECFDF5"; color = "#059669";
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ─── Custom tooltips for charts ───────────────────────────────

const TT_BOX: React.CSSProperties = {
  background: "#fff", borderRadius: 8, padding: "8px 12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 12, color: "#191c1e",
  whiteSpace: "nowrap", border: "1px solid rgba(0,0,0,0.06)",
};

export const ProductionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_BOX}>
      <div style={{ color: "#94A3B8", marginBottom: 3 }}>{label}</div>
      <div>Sản lượng: <strong>{payload[0].value.toLocaleString("vi-VN")}</strong> tấn</div>
    </div>
  );
};

export const ProgressTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_BOX}>
      <div style={{ color: "#94A3B8", marginBottom: 3 }}>{label}</div>
      <div>Tiến độ: <strong>{payload[0].value}</strong> mét</div>
    </div>
  );
};

// ─── Report Item Card (for submit overlay) ────────────────────

import { Clock, User, MapPin, AlertTriangle } from 'lucide-react';
import { ReportItem } from '../types';

export function ReportItemCard({ item }: { item: ReportItem }) {
  const sanLuong  = getSanLuong(item);
  const tienDo    = item.tien_do_dao_lo ?? item.xen_lo_2;
  const tinhTrang = item.tinh_trang;
  const canhBao   = item.noi_dung_canh_bao;
  const hasCanhBao = !!canhBao && !normalizeVN(canhBao).includes("khong co");

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-left">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{item.don_vi_thi_cong || "Không rõ đơn vị"}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="inline-flex items-center gap-1"><Clock size={11} />{item.ngay || "--"} · Ca {item.ca ?? "--"}</span>
            {item.nguoi_bao_cao && (
              <span className="inline-flex items-center gap-1"><User size={11} />{item.nguoi_bao_cao}</span>
            )}
            {item.duong_lo && (
              <span className="inline-flex items-center gap-1"><MapPin size={11} />{item.duong_lo}</span>
            )}
          </div>
        </div>
        {tinhTrang && <StatusPill status={tinhTrang} />}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center">
          <p className="text-base font-black text-blue-700">
            {sanLuong !== undefined ? sanLuong.toLocaleString("vi-VN") : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Sản lượng (tấn)</p>
        </div>
        <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-center">
          <p className="text-base font-black text-orange-600">
            {tienDo !== undefined && tienDo !== null ? tienDo : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Tiến độ đào (mét)</p>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-center">
          <p className="text-sm font-bold text-gray-900 truncate" title={item.bo_tri_lao_dong || ""}>
            {item.bo_tri_lao_dong || (item.so_lao_dong ? `${item.so_lao_dong} LĐ` : "—")}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Bố trí / LĐ</p>
        </div>
      </div>

      {item.ghi_chu && (
        <p className="text-xs text-gray-600 mb-2 px-2 py-1 rounded bg-gray-50 border border-gray-100">
          <span className="text-gray-400 font-semibold">Ghi chú:</span> {item.ghi_chu}
        </p>
      )}

      <div
        className="flex items-start gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg"
        style={
          hasCanhBao
            ? { background: "#FEF2F2", border: "1px solid #FECACA" }
            : { background: "#F9FAFB", border: "1px solid #E5E7EB" }
        }
      >
        <AlertTriangle
          size={13}
          color={hasCanhBao ? "#DC2626" : "#9CA3AF"}
          className="mt-0.5 flex-shrink-0"
        />
        <p className="text-xs" style={{ color: hasCanhBao ? "#991B1B" : "#6B7280" }}>
          <span className="font-semibold">Cảnh báo: </span>
          {hasCanhBao ? canhBao : "Không có"}
        </p>
      </div>
    </div>
  );
}

// ─── Info Cell (for detail panels) ────────────────────────────

export function InfoCell({ label, value, tone = "gray" }: { label: string; value: string; tone?: "gray" | "red" | "green" }) {
  const valueClass = tone === "red"
    ? "text-red-700"
    : tone === "green"
      ? "text-green-700"
      : "text-gray-900";
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 break-words ${valueClass}`}>{value}</p>
    </div>
  );
}

// ─── Custom chart labels ──────────────────────────────────────

export const CustomBarLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width / 2} y={y - 12} fill="#2563EB" textAnchor="middle" fontSize={11} fontWeight="bold">
      {value.toLocaleString("vi-VN")} tấn
    </text>
  );
};

export const CustomLineLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x} y={y - 12} fill="#EA580C" textAnchor="middle" fontSize={11} fontWeight="bold">
      {value} mét
    </text>
  );
};

// ─── useContainerWidth hook ───────────────────────────────────

import { useState, useRef, useEffect } from 'react';

export function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}