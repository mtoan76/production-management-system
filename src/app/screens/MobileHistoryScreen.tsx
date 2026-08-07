import { useState, useEffect } from "react";
import {
  Search, X, Calendar, RefreshCw, Loader2, History, ChevronDown, Clock, MapPin,
  AlertTriangle, Filter,
} from "lucide-react";
import { BaoCaoListItem, BaoCaoDetail } from '../types';
import { N8N_BAO_CAO_LIST_URL, N8N_BAO_CAO_DETAIL_URL } from '../utils/constants';
import { useSessionCache } from '../hooks/useSessionCache';
import { C, Sheet, InfoCell } from '../components/mobile';
import { fmtDate, fmtTime } from '../utils/format';

export default function MobileHistory() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<BaoCaoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedCas, setExpandedCas] = useState<Set<number>>(new Set());

  const historyKey = `mobile-bao-cao-list:${search.trim()}|${fromDate}|${toDate}`;
  const {
    data: listData = [],
    loading,
    error: errorMsg,
    refresh,
  } = useSessionCache<BaoCaoListItem[]>(
    historyKey,
    async () => {
      const params = new URLSearchParams();
      if (fromDate) params.set("tu_ngay", fromDate);
      if (toDate) params.set("den_ngay", toDate);
      if (search.trim()) params.set("cong_truong", search.trim());
      const qs = params.toString();
      const url = `${N8N_BAO_CAO_LIST_URL}${qs ? "?" + qs : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [search, fromDate, toDate]
  );
  const list = listData;

  useEffect(() => {
    if (selectedId == null) { setDetail(null); return; }
    setExpandedCas(new Set());
    let cancelled = false;
    async function loadDetail() {
      setDetailLoading(true);
      try {
        const res = await fetch(`${N8N_BAO_CAO_DETAIL_URL}/${selectedId}`);
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setDetail({ report: data.report, ca_list: Array.isArray(data.ca_list) ? data.ca_list : [] });
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

  const fmtDateTimeLocal = (iso: string) => {
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

  const TYPE_CFG: Record<string, { label: string; unit: string; gradient: [string, string]; textColor: string }> = {
    lo_cho: { label: "Sản lượng (lò chợ)", unit: "tấn", gradient: ["#065F46", "#10B981"], textColor: "text-emerald-700" },
    dao_lo: { label: "Đào lò", unit: "mét", gradient: ["#1E40AF", "#2563EB"], textColor: "text-blue-700" },
    xen_lo: { label: "Xén lò", unit: "mét", gradient: ["#9A3412", "#EA580C"], textColor: "text-orange-700" },
    chong_doi: { label: "Chống đội", unit: "mét", gradient: ["#6B21A8", "#A855F7"], textColor: "text-purple-700" },
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 border-b" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="font-extrabold text-white text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Lịch sử báo cáo</div>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            <Search size={14} color="#64748B" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm theo công trường…" className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-100 placeholder:text-slate-500" />
          </div>
          <button onClick={refresh} disabled={loading} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 active:bg-white/10 disabled:opacity-50" aria-label="Làm mới">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-2 bg-white/5 rounded-lg border border-white/10 px-2.5 py-1.5">
          <Calendar size={12} color="#64748B" />
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} title="Từ ngày" className="bg-transparent text-[12px] text-slate-100 outline-none flex-1 min-w-0 [color-scheme:dark]" />
          <span className="text-slate-500 text-[10px]">→</span>
          <input type="date" value={toDate} min={fromDate || undefined} onChange={e => setToDate(e.target.value)} title="Đến ngày" className="bg-transparent text-[12px] text-slate-100 outline-none flex-1 min-w-0 [color-scheme:dark]" />
          {(fromDate || toDate) && (
            <button onClick={() => { setFromDate(""); setToDate(""); }} title="Xoá khoảng ngày" className="text-slate-400 active:text-red-400 transition-colors p-1" aria-label="Xoá khoảng ngày">
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
              <span>{filtered.length} kết quả{search && ` · "${search}"`}{fromDate && ` · từ ${fromDate}`}{toDate && ` · đến ${toDate}`}</span>
            </div>
          )}
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg px-3 py-2 mb-3">{errorMsg}</div>}
          {loading && filtered.length === 0 && <div className="flex items-center justify-center text-slate-400 py-8 gap-2 text-xs"><Loader2 size={14} className="animate-spin" />Đang tải lịch sử…</div>}
          <div className="flex flex-col gap-2">
            {filtered.map(it => {
              const [datePart, timePart] = fmtDateTimeLocal(it.created_at).split(" ");
              return (
                <button key={it.report_id} onClick={() => setSelectedId(it.report_id)} className="bg-white border border-slate-200 rounded-xl p-3 text-left shadow-sm active:bg-slate-50">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-slate-900 text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{fmtDate(it.ngay)}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[12px] text-slate-700 font-semibold truncate">{it.cong_truong || "—"}</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 leading-tight flex-shrink-0">
                      <div>{datePart || "—"}</div>
                      <div>{timePart || ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><strong>{it.so_ca}</strong> ca</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">{it.tong_so_lao_dong ?? 0} LĐ</span>
                    {it.co_su_co ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><span className="w-1 h-1 rounded-full bg-red-500" /> Có sự cố</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200"><span className="w-1 h-1 rounded-full bg-green-500" /> Bình thường</span>
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

      <Sheet open={selectedId != null} onClose={() => setSelectedId(null)} title="Chi tiết báo cáo" subtitle={`#${selectedId} · ${caList.length} ca`} maxHeight="92%">
        {detailLoading && <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2"><Loader2 size={14} className="animate-spin" />Đang tải chi tiết…</div>}
        {!detailLoading && detail && caList.length === 0 && <div className="text-xs text-slate-400 italic py-10 text-center">Báo cáo này chưa có dữ liệu ca nào.</div>}
        {!detailLoading && caList.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {caList.map((ca, idx) => {
              const isOpen = expandedCas.has(ca.ca);
              const s = (ca.su_co || "").trim();
              const isInc = s && !s.toLowerCase().includes("bình thường") && !s.toLowerCase().includes("không có sự cố");
              return (
                <div key={ca.ca ?? idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => toggleCa(ca.ca)} className="w-full flex items-center justify-between px-3 py-3 active:bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#1E40AF,#2563EB)" }}>Ca {ca.ca}</span>
                      <span className="text-[12px] font-bold text-slate-900">{fmtDate(ca.ngay)}</span>
                      {isInc ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><span className="w-1 h-1 rounded-full bg-red-500" /> Sự cố</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200"><span className="w-1 h-1 rounded-full bg-green-500" /> BT</span>
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
                              <div className="flex items-center justify-between px-3 py-2" style={{ background: `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1]})` }}>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                                  <span className="text-[12px] font-bold text-white">{cfg.label}</span>
                                </div>
                                <span className="text-[10px] font-semibold text-white/90 bg-white/15 px-1.5 py-0.5 rounded-full border border-white/20">{items.length} mục · {cfg.unit}</span>
                              </div>
                              {items.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic px-3 py-2">Không có hạng mục trong ca này.</p>
                              ) : (
                                <div className="divide-y divide-slate-100">
                                  {items.map(h => (
                                    <div key={h.id} className="px-3 py-2">
                                      <p className="text-[12px] font-semibold text-slate-900 truncate" title={h.duong_lo || ""}>{h.duong_lo || "—"}</p>
                                      <div className="flex items-center justify-between mt-0.5">
                                        {h.tiet_dien ? (
                                          <p className="text-[10px] text-slate-500">TD: <strong className="text-slate-700">{Number(h.tiet_dien).toLocaleString("vi-VN")}</strong> {h.tiet_dien_don_vi || "m²"}</p>
                                        ) : <span />}
                                        <p className={`text-[13px] font-black tabular-nums ${cfg.textColor}`}>{Number(h.san_luong || 0).toLocaleString("vi-VN")} <span className="text-[10px] font-medium text-slate-400">{cfg.unit}</span></p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="px-3 py-1.5 bg-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Tổng</span>
                                    <span className="text-[12px] font-black tabular-nums text-slate-900">{total.toLocaleString("vi-VN")} {cfg.unit}</span>
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