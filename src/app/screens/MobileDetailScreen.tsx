import { useState, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import {
  Search, ChevronRight, ChevronDown, RefreshCw, Loader2, Layers, Package, Clock,
  AlertTriangle, AlertCircle, PlusCircle,
} from "lucide-react";
import { useSessionCache } from "../hooks/useSessionCache";
import { TabId, TunnelData } from '../types';
import { N8N_DUONG_LO_URL } from '../utils/constants';
import { C, ProductionTooltip, ProgressTooltip, Sheet } from '../components/mobile';

export default function MobileDetail({ onNav }: { onNav: (t: TabId) => void }) {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [selected, setSelected] = useState<TunnelData | null>(null);

  const detailKey = `mobile-duong-lo:${month}|${year}`;
  const {
    data: tunnelData = [],
    loading,
    error: errorMsg,
    refresh,
  } = useSessionCache<TunnelData[]>(
    detailKey,
    async () => {
      const res = await fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`);
      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [month, year]
  );

  const latestByTunnel = useMemo(() => {
    const map = new Map<string, TunnelData>();
    for (const row of tunnelData) map.set(row.duong_lo, row);
    return Array.from(map.values());
  }, [tunnelData]);

  const filtered = latestByTunnel.filter(t => t.duong_lo.toLowerCase().includes(search.toLowerCase()));
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="font-extrabold text-white text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Báo cáo chi tiết</div>
        <div className="flex items-center gap-2 mt-2.5 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <Search size={14} color="#64748B" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm đường lò…" className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500" />
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="relative flex-1">
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-[12px] font-semibold text-slate-200">
              {months.map(m => <option key={m} value={m} className="text-slate-900">Tháng {m}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          <button onClick={refresh} disabled={loading} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 active:bg-white/10 disabled:opacity-50" aria-label="Làm mới">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">{errorMsg}</div>}

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-blue-50 flex items-center justify-center"><Layers size={14} className="text-blue-600" /></div>
              <div className="font-extrabold text-blue-700 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{latestByTunnel.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Tổng đường lò</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-50 flex items-center justify-center"><AlertTriangle size={14} className="text-amber-600" /></div>
              <div className="font-extrabold text-amber-600 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>0</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Cảnh báo</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-sm">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-red-50 flex items-center justify-center"><AlertCircle size={14} className="text-red-600" /></div>
              <div className="font-extrabold text-red-600 text-[20px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>0</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Nghiêm trọng</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map(t => (
              <button key={t.duong_lo} onClick={() => setSelected(t)} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 text-left shadow-sm active:bg-slate-50">
                <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1E3A5F,#2563EB)" }}>
                  <Layers size={18} color="#93C5FD" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-[13px] truncate" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t.duong_lo}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><Package size={10} className="text-blue-600" />{Number(t.san_luong_luy_ke).toLocaleString("vi-VN")} tấn</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><Clock size={10} className="text-amber-600" />{Number(t.tien_do_luy_ke).toLocaleString("vi-VN")} m</div>
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

      <button
        onClick={() => onNav("submit")}
        className="absolute z-40 active:opacity-80"
        style={{ bottom: 92, right: 16, width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", boxShadow: "0 6px 20px rgba(37,99,235,0.45)" }}
        aria-label="Nhập báo cáo mới"
      >
        <PlusCircle size={22} color="#fff" className="m-auto" />
      </button>

      {selected && (() => {
        const rows = tunnelData.filter(r => r.duong_lo === selected.duong_lo);
        const chartData = rows.map(r => ({ date: r.ngay_bao_cao, prod: Number(r.san_luong_luy_ke) || 0, prog: Number(r.tien_do_luy_ke) || 0 }));
        const lastRow = rows[rows.length - 1];
        return (
          <Sheet open onClose={() => setSelected(null)} title={selected.duong_lo} subtitle={lastRow?.thoi_gian_bao_cao}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <div className="text-[10px] text-slate-500">Sản lượng</div>
                <div className="font-extrabold text-blue-700 text-[18px] mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{Number(lastRow?.san_luong_luy_ke).toLocaleString("vi-VN")}<span className="text-[11px] text-slate-500 font-medium ml-1">tấn</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <div className="text-[10px] text-slate-500">Tiến độ đào</div>
                <div className="font-extrabold text-amber-600 text-[18px] mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{Number(lastRow?.tien_do_luy_ke).toLocaleString("vi-VN")}<span className="text-[11px] text-slate-500 font-medium ml-1">mét</span></div>
              </div>
            </div>
            {chartData.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-4">Chưa có dữ liệu cho {selected.duong_lo} trong tháng này.</div>
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
                      <Bar dataKey="prod" fill={C.primary} radius={[3, 3, 0, 0]} />
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
                      <Area type="monotone" dataKey="prog" stroke={C.warning} strokeWidth={2} fill="url(#mobDetailOrange)" dot={false} />
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