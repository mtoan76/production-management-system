import { useState } from "react";
import {
  Search, RefreshCw, Clock, MapPin, Bell, AlertCircle, AlertTriangle, CheckCircle, Shield, ChevronDown,
} from "lucide-react";
import { AlertTab, SeverityType, AlertStatus, CanhBaoListItem } from '../types';
import { N8N_CANH_BAO_LIST_URL } from '../utils/constants';
import { useSessionCache } from '../hooks/useSessionCache';
import { C, Sheet, SeverityBadge, AlertStatusBadge, Avatar, InfoCell } from '../components/mobile';
import { fmtTime, fmtDate } from '../utils/format';

function SummaryCard({ icon: Icon, color, bg, label, value }: { icon: any; color: string; bg: string; label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <div className="w-8 h-8 mb-2 rounded-lg flex items-center justify-center" style={{ background: bg }}><Icon size={16} color={color} /></div>
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

export default function MobileAlerts() {
  const [tab, setTab] = useState<AlertTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CanhBaoListItem | null>(null);

  const alertsKey = `mobile-canh-bao-list:${tab}|${search.trim()}`;
  const {
    data: list = [],
    loading,
    error: errorMsg,
    refresh,
  } = useSessionCache<CanhBaoListItem[]>(
    alertsKey,
    async () => {
      const params = new URLSearchParams();
      if (tab !== "all") {
        const sev = tab === "critical" ? "Nghiêm trọng" : tab === "warning" ? "Cảnh báo" : "Bình thường";
        params.set("severity", sev);
      }
      if (search.trim()) params.set("search", search.trim());
      const url = `${N8N_CANH_BAO_LIST_URL}${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [tab, search]
  );

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
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="font-extrabold text-white text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Trung tâm cảnh báo</div>
          <button onClick={refresh} disabled={loading} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 active:bg-white/10 disabled:opacity-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <Search size={14} color="#64748B" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm cảnh báo…" className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">{errorMsg}</div>}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <SummaryCard icon={Bell} color={C.primary} bg={C.primaryLight} label="Tổng cảnh báo" value={counts.all} />
            <SummaryCard icon={AlertCircle} color={C.danger} bg={C.dangerLight} label="Nghiêm trọng" value={counts.critical} />
            <SummaryCard icon={AlertTriangle} color={C.warning} bg={C.warningLight} label="Cảnh báo" value={counts.warning} />
            <SummaryCard icon={CheckCircle} color={C.success} bg={C.successLight} label="Đã xử lý" value={counts.resolved} />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 -mx-1 px-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap flex-shrink-0 ${tab === t.id ? "bg-blue-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500"}`}>{t.label}</button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {list.map(a => {
              const cfg = SEVERITY_CFG[a.severity as SeverityType];
              return (
                <button key={a.id} onClick={() => setSelected(a)} className={`bg-white border border-slate-200 ${cfg?.border || ""} border-l-4 rounded-xl p-3 text-left shadow-sm active:bg-slate-50`}>
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

      {selected && (
        <Sheet open onClose={() => setSelected(null)}>
          <div className="flex items-center justify-between mb-3 -mt-2">
            <div className="flex items-center gap-1.5">
              <SeverityBadge severity={selected.severity} />
              <AlertStatusBadge status={selected.trang_thai} />
            </div>
            <div className="text-[10px] text-slate-400">{fmtDate(selected.ngay || selected.created_at)}</div>
          </div>
          <h3 className="font-extrabold text-slate-900 text-[15px] leading-snug mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{selected.noi_dung}</h3>
          <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
            <InfoCol icon={Clock} label="Thời gian" value={`${fmtTime(selected.created_at)}`} sub={fmtDate(selected.ngay || selected.created_at)} />
            <InfoCol icon={MapPin} label="Vị trí" value={selected.duong_lo || "—"} sub={selected.vi_tri || ""} />
            <InfoCol icon={User} label="Người xử lý" value={selected.nguoi_xu_ly || "—"} sub={selected.nguoi_xu_ly ? "" : "Chưa phân công"} avatarName={selected.nguoi_xu_ly || undefined} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả chi tiết</div>
          <div className="text-[12px] text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">{selected.mo_ta || selected.noi_dung}</div>
          {selected.trang_thai !== "Đã hoàn thành" && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl text-white font-bold text-[12px] active:opacity-80" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>Đánh dấu đã xử lý</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-[12px] active:opacity-70">Phân công</button>
            </div>
          )}
        </Sheet>
      )}
    </div>
  );
}