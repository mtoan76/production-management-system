import { useState, useEffect, useRef } from "react";
import {
  Search, X, Calendar, AlertTriangle, ChevronDown, Clock, Loader2,
} from "lucide-react";
import {
  HistoryStatus, BaoCaoListItem, BaoCaoDetail, CaData, CaHangMuc,
} from '../types';
import { N8N_BAO_CAO_LIST_URL, N8N_BAO_CAO_DETAIL_URL, HISTORY_STATUS_CFG } from '../utils/constants';
import { useSessionCache } from '../hooks/useSessionCache';
import { InfoCell, SeverityBadge, AlertStatusBadge } from '../components/shared';
import Header from '../components/Header';

// ─── History Detail Modal ─────────────────────────────────────

function HistoryDetailModal({ historyId, onClose }: { historyId: number | null; onClose: () => void }) {
  const [detail, setDetail] = useState<BaoCaoDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedCas, setExpandedCas] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (historyId == null) return;
    setExpandedCas(new Set());
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${N8N_BAO_CAO_DETAIL_URL}/${historyId}`);
        if (!res.ok) throw new Error(`Server trả về ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setDetail({
          report: data.report,
          ca_list: Array.isArray(data.ca_list) ? data.ca_list : [],
        });
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải chi tiết báo cáo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [historyId]);

  if (historyId == null) return null;

  const caList = detail?.ca_list ?? [];

  const pad = (n: number) => String(n).padStart(2, "0");
  const parseDate = (s?: string | null): Date | null => {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const fmtDate = (date?: string | null) => {
    const d = parseDate(date);
    if (!d) return "—";
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };
  const splitDateTime = (date?: string | null) => {
    const d = parseDate(date);
    if (!d) return ["—", "—"];
    return [
      `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
      `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    ];
  };

  const [ngayGui, gioGui] = splitDateTime(detail?.report?.created_at);

  const hasIncident = caList.some(ca => {
    const s = (ca.su_co || "").trim().toLowerCase();
    return s && !s.includes("bình thường") && !s.includes("không có sự cố");
  });

  const TYPE_CFG: Record<string, { label: string; unit: string; gradient: [string, string]; accent: string; dot: string }> = {
    lo_cho:    { label: "Sản lượng (lò chợ)", unit: "tấn", gradient: ["#065F46", "#10B981"], accent: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
    dao_lo:    { label: "Đào lò",             unit: "mét",  gradient: ["#1E40AF", "#2563EB"], accent: "bg-blue-50 border-blue-200 text-blue-700",       dot: "bg-blue-500" },
    xen_lo:    { label: "Xén lò",             unit: "mét",  gradient: ["#9A3412", "#EA580C"], accent: "bg-orange-50 border-orange-200 text-orange-700", dot: "bg-orange-500" },
    chong_doi: { label: "Chống đội",          unit: "mét",  gradient: ["#6B21A8", "#A855F7"], accent: "bg-purple-50 border-purple-200 text-purple-700", dot: "bg-purple-500" },
  };

  const toggleCa = (ca: number) => {
    setExpandedCas(prev => {
      const next = new Set(prev);
      next.has(ca) ? next.delete(ca) : next.add(ca);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[92vh] overflow-y-auto p-7 flex flex-col gap-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Chi tiết báo cáo</h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
              <span>Mã báo cáo: <span className="font-mono font-semibold">#{historyId}</span></span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                Gửi lúc:&nbsp;<span className="font-semibold">{ngayGui}</span>
                <span className="text-gray-400">lúc</span>
                <span className="font-semibold">{gioGui}</span>
              </span>
              <span className="text-gray-300">|</span>
              <span>{caList.length} ca</span>
              <span className="text-gray-300">|</span>
              {hasIncident ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Có sự cố
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Bình thường
                </span>
              )}
            </p>
          </div>
          <button onClick={onClose} title="Đóng" className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {loading && <div className="text-sm text-gray-500 py-8 text-center">Đang tải chi tiết báo cáo...</div>}
        {errorMsg && !loading && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
            <AlertTriangle size={14} />{errorMsg}
          </div>
        )}

        {!loading && !errorMsg && detail && caList.length === 0 && (
          <div className="text-sm text-gray-400 italic py-12 text-center">Báo cáo này chưa có dữ liệu ca nào.</div>
        )}

        {!loading && !errorMsg && caList.length > 0 && (
          <div className="flex flex-col gap-3">
            {caList.map((ca, idx) => {
              const isOpen = expandedCas.has(ca.ca);
              const s = (ca.su_co || "").trim();
              const isInc = s && !s.toLowerCase().includes("bình thường") && !s.toLowerCase().includes("không có sự cố");
              return (
                <div key={ca.ca ?? idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button onClick={() => toggleCa(ca.ca)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors text-left">
                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                      <span className="inline-flex items-center justify-center min-w-[44px] px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#1E40AF,#2563EB)" }}>Ca {ca.ca}</span>
                      <span className="text-sm font-semibold text-gray-900">{fmtDate(ca.ngay)}</span>
                      <span className="text-xs text-gray-500">· {ca.cong_truong || "—"}</span>
                      <span className="text-xs text-gray-500">· <strong className="text-gray-800">{Number(ca.so_lao_dong) || 0}</strong> LĐ</span>
                      {isInc ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Sự cố
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Bình thường
                        </span>
                      )}
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-4" style={{ background: "#FAFBFC" }}>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <InfoCell label="Ngày" value={fmtDate(ca.ngay)} />
                        <InfoCell label="Công trường" value={ca.cong_truong || "—"} />
                        <InfoCell label="Số lao động" value={`${Number(ca.so_lao_dong) || 0} người`} />
                        <InfoCell label="Trạng thái" value={isInc ? "Có sự cố" : "Bình thường"} tone={isInc ? "red" : "green"} />
                      </div>

                      {(ca.cong_viec_khac || ca.su_co || ca.ghi_chu) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {ca.cong_viec_khac && <InfoCell label="Công việc khác" value={ca.cong_viec_khac} />}
                          {ca.su_co && <InfoCell label="Sự cố" value={ca.su_co} tone={isInc ? "red" : "gray"} />}
                          {ca.ghi_chu && <InfoCell label="Ghi chú" value={ca.ghi_chu} />}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {(["lo_cho", "dao_lo", "xen_lo", "chong_doi"] as const).map(type => {
                          const cfg = TYPE_CFG[type];
                          const items = (ca.hang_muc_by_type?.[type] as any[]) || [];
                          const total = items.reduce((sum, h) => sum + (Number(h.san_luong) || 0), 0);
                          return (
                            <div key={type} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1]})` }}>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                  <span className="text-sm font-bold text-white">{cfg.label}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">{items.length} mục · {cfg.unit}</span>
                              </div>
                              {items.length === 0 ? (
                                <p className="text-xs text-gray-400 italic px-4 py-3">Không có hạng mục {cfg.label.toLowerCase()} trong ca này.</p>
                              ) : (
                                <div className="divide-y divide-gray-100">
                                  {items.map(h => (
                                    <div key={h.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                                      <div className="col-span-7 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate" title={h.duong_lo || ""}>{h.duong_lo || "—"}</p>
                                        {h.tiet_dien && (
                                          <p className="text-[11px] text-gray-500 mt-0.5">
                                            Tiết diện: <strong className="text-gray-700">{Number(h.tiet_dien).toLocaleString("vi-VN")}</strong> {h.tiet_dien_don_vi || "m²"}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-span-5 text-right">
                                        <p className={`text-base font-black tabular-nums ${cfg.accent.split(" ")[2]}`}>{Number(h.san_luong || 0).toLocaleString("vi-VN")}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{cfg.unit}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className={`px-4 py-2 flex items-center justify-between ${cfg.accent}`}>
                                    <span className="text-[11px] font-bold uppercase tracking-wide">Tổng {cfg.label.toLowerCase()}</span>
                                    <span className="text-sm font-black tabular-nums">{total.toLocaleString("vi-VN")} {cfg.unit}</span>
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
      </div>
    </div>
  );
}

// ─── HistoryScreen Component ──────────────────────────────────

export default function HistoryScreen() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const PAGE_SIZE = 5;

  const cacheKey = `bao-cao-list:${search.trim()}|${fromDate}|${toDate}`;
  const {
    data: listData,
    loading,
    error: errorMsg,
    refresh,
  } = useSessionCache<BaoCaoListItem[]>(
    cacheKey,
    async () => {
      const params = new URLSearchParams();
      if (fromDate) params.set("tu_ngay", fromDate);
      if (toDate) params.set("den_ngay", toDate);
      if (search.trim()) params.set("cong_truong", search.trim());
      const qs = params.toString();
      const url = `${N8N_BAO_CAO_LIST_URL}${qs ? "?" + qs : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [search, fromDate, toDate]
  );
  const list = listData ?? [];

  const filtered = list;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginated = filtered.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const rangeStart = total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(activePage * PAGE_SIZE, total);

  const fmtDateTime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fmtDateOnly = (iso: string) => fmtDateTime(iso).split(" ")[0];

  const fmtDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6 min-h-screen bg-[#F8FAFC]">
      <Header title="Lịch sử báo cáo" subtitle="Tra cứu, tìm kiếm và xem lại toàn bộ báo cáo đã nhập" avatar="NA" />

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm theo công trường..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
          <Calendar size={14} className="text-gray-400" />
          <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }} title="Từ ngày" className="bg-transparent text-sm text-gray-700 outline-none w-[130px]" />
          <span className="text-gray-400 text-xs">→</span>
          <input type="date" value={toDate} min={fromDate || undefined} onChange={e => { setToDate(e.target.value); setCurrentPage(1); }} title="Đến ngày" className="bg-transparent text-sm text-gray-700 outline-none w-[130px]" />
          {(fromDate || toDate) && (
            <button onClick={() => { setFromDate(""); setToDate(""); setCurrentPage(1); }} title="Xoá khoảng ngày" className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-60" style={{ background: "#2563EB" }} title="Làm mới">
          <Loader2 size={14} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertTriangle size={14} />
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Ngày</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Công trường</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap text-center">Số ca</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap text-center">Số LĐ</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap text-center">Sự cố</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Cập nhật</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(item => (
                <tr key={item.report_id} onClick={() => setSelectedId(item.report_id)} className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap align-top text-xs">{fmtDate(item.ngay)}</td>
                  <td className="px-6 py-4 text-gray-700 align-top">{item.cong_truong || <span className="text-gray-400 italic">—</span>}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top text-center font-semibold">{item.so_ca}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top text-center font-semibold tabular-nums">{item.tong_so_lao_dong ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-top text-center">
                    {item.co_su_co ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Có</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Không</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-top text-xs">
                    {item.created_at ? fmtDateTime(item.created_at) : <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    {item.co_su_co ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Có sự cố
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Bình thường
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">{errorMsg ? "" : "Chưa có báo cáo nào trong hệ thống."}</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">Đang tải dữ liệu...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-gray-500">
            Hiển thị {rangeStart}-{rangeEnd} trong tổng số {total} báo cáo
            {(search || fromDate || toDate) && (
              <span className="ml-2 text-xs text-blue-600 font-medium">
                (đang lọc{search ? ` · công trường: "${search}"` : ""}{fromDate ? ` · từ ${fromDate}` : ""}{toDate ? ` · đến ${toDate}` : ""})
              </span>
            )}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={activePage === 1} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${activePage === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={activePage === totalPages} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
            </div>
          )}
        </div>
      </div>

      {selectedId != null && (
        <HistoryDetailModal historyId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}