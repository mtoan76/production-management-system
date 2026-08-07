import { useState, useEffect, useRef } from "react";
import {
  Search, X, Loader2, AlertTriangle, BarChart2, AlertCircle, CheckCircle,
} from "lucide-react";
import {
  AlertTab, SeverityType, AlertStatus, CanhBaoListItem,
} from '../types';
import { N8N_CANH_BAO_LIST_URL } from '../utils/constants';
import { TAB_SEVERITY } from '../utils/format';
import { useSessionCache } from '../hooks/useSessionCache';
import { SeverityBadge, AlertStatusBadge } from '../components/shared';
import Header from '../components/Header';
import { fmtDate, fmtTime, getInitials, getColor } from '../utils/format';

// ─── Alert Modal ──────────────────────────────────────────────

function AlertModal({ alert, onClose }: { alert: CanhBaoListItem; onClose: () => void }) {
  const isCritical = alert.severity === "Nghiêm trọng";

  const viTriParts = [alert.duong_lo, alert.vi_tri].filter(Boolean);
  const viTri = viTriParts.join(" · ") || "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[680px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-5 border-b border-gray-100 relative">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onClose}
              title="Quay lại danh sách cảnh báo"
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isCritical ? "bg-red-50 border border-red-100 text-red-500 hover:bg-red-100" : "bg-yellow-50 border border-yellow-100 text-yellow-500 hover:bg-yellow-100"}`}
            >
              <X size={20} strokeWidth={2} />
            </button>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={alert.severity as SeverityType} />
              <AlertStatusBadge status={alert.trang_thai as AlertStatus} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 pr-8">{alert.noi_dung}</h2>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100">
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">THỜI GIAN</p>
            <p className="text-sm font-bold text-gray-900">{fmtTime(alert.created_at)}</p>
            <p className="text-sm text-gray-500 mt-0.5">{fmtDate(alert.ngay || alert.created_at)}</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">VỊ TRÍ</p>
            <p className="text-sm font-bold text-gray-900 leading-snug">{viTri}</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">NGƯỜI XỬ LÝ</p>
            {alert.nguoi_xu_ly ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: getColor(alert.nguoi_xu_ly) }}>
                  {getInitials(alert.nguoi_xu_ly)}
                </div>
                <span className="text-sm font-bold text-gray-900">{alert.nguoi_xu_ly}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic block mt-1">Chưa phân công</span>
            )}
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">MÔ TẢ CHI TIẾT</p>
          <div className="rounded-xl p-5 text-sm text-gray-700 leading-relaxed border border-gray-100" style={{ background: "#F8FAFC" }}>
            {alert.mo_ta || alert.noi_dung}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AlertScreen Component ────────────────────────────────────

const ALERT_TABS: { id: AlertTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "critical", label: "Nghiêm trọng" },
  { id: "warning", label: "Cảnh báo" },
  { id: "normal", label: "Bình thường" },
];

export default function AlertScreen({ initialAlertId }: { initialAlertId?: number | null }) {
  const [tab, setTab] = useState<AlertTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CanhBaoListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const alertsKey = `canh-bao-list:${tab}|${search.trim()}`;
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
        const sev = TAB_SEVERITY[tab];
        if (sev) params.set("severity", sev);
      }
      if (search.trim()) params.set("search", search.trim());
      const url = `${N8N_CANH_BAO_LIST_URL}${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [tab, search]
  );

  const consumedAlertIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (initialAlertId == null) return;
    if (consumedAlertIdRef.current === initialAlertId) return;
    const found = list.find(a => a.id === initialAlertId);
    if (found) {
      consumedAlertIdRef.current = initialAlertId;
      setTab("all");
      setSelected(found);
    }
  }, [initialAlertId, list]);

  useEffect(() => {
    if (selected == null) consumedAlertIdRef.current = null;
  }, [selected]);

  const counts = {
    all: list.length,
    critical: list.filter(a => a.severity === "Nghiêm trọng").length,
    warning: list.filter(a => a.severity === "Cảnh báo").length,
    normal: list.filter(a => a.severity === "Bình thường").length,
    resolved: list.filter(a => a.trang_thai === "Đã hoàn thành").length,
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = list.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-8 pb-12 flex flex-col gap-6">
      <Header title="Trung tâm cảnh báo" onRefresh={refresh} loading={loading} avatar="NA" />

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertTriangle size={14} />{errorMsg}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tổng cảnh báo", value: counts.all, sub: "Tất cả trong hệ thống", color: "#2563EB", bg: "#EFF6FF", Icon: BarChart2 },
          { label: "Nghiêm trọng", value: counts.critical, sub: "Cần xử lý ngay", color: "#DC2626", bg: "#FEF2F2", Icon: X },
          { label: "Cảnh báo", value: counts.warning, sub: "Đang theo dõi", color: "#D97706", bg: "#FFFBEB", Icon: AlertTriangle },
          { label: "Đã xử lý", value: counts.resolved, sub: `Tỉ lệ ${counts.all ? Math.round(counts.resolved / counts.all * 100) : 0}%`, color: "#059669", bg: "#ECFDF5", Icon: CheckCircle },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 px-6 py-5 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                <c.Icon size={20} style={{ color: c.color }} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 mb-0.5">{c.label}</p>
                <p className="text-3xl font-bold" style={{ color: c.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{c.value}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm cảnh báo..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-700 w-full bg-gray-50/50"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center p-1 bg-gray-100/80 rounded-lg">
            {ALERT_TABS.map(t => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setCurrentPage(1); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Thời gian</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Vị trí</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Nội dung</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Loại cảnh báo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Trạng thái</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Người xử lý</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(a => {
                const viTri = [a.duong_lo, a.vi_tri].filter(Boolean).join(" · ") || "—";
                return (
                  <tr key={a.id} onClick={() => setSelected(a)} className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900" style={{ whiteSpace: "nowrap" }}>{fmtTime(a.created_at)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{fmtDate(a.ngay || a.created_at)}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{viTri}</td>
                    <td className="px-6 py-4 text-gray-600">{a.noi_dung}</td>
                    <td className="px-6 py-4"><SeverityBadge severity={a.severity as SeverityType} /></td>
                    <td className="px-6 py-4"><AlertStatusBadge status={a.trang_thai as AlertStatus} /></td>
                    <td className="px-6 py-4">
                      {a.nguoi_xu_ly ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: getColor(a.nguoi_xu_ly) }}>
                            {getInitials(a.nguoi_xu_ly)}
                          </div>
                          <span className="text-sm text-gray-700">{a.nguoi_xu_ly}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Chưa phân công</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginatedData.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                  {errorMsg ? "Lỗi tải dữ liệu — xem chi tiết ở banner phía trên." : "Chưa có cảnh báo nào trong hệ thống."}
                </td></tr>
              )}
              {loading && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">Đang tải cảnh báo...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Hiển thị {list.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, list.length)} trong tổng số {list.length} cảnh báo
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${safePage === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
            </div>
          )}
        </div>
      </div>

      {selected && <AlertModal alert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}