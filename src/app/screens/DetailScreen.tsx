import { useState, useEffect, useMemo } from "react";
import {
  BarChart2, List, AlertTriangle, AlertCircle, Search, X, Loader2, Clock,
} from "lucide-react";
import { Screen, TunnelData, CongTruongChiTiet, TunnelChiTiet } from '../types';
import { N8N_DUONG_LO_URL } from '../utils/constants';
import { useSessionCache } from '../hooks/useSessionCache';
import Header from '../components/Header';

// ─── Tunnel Modal Component ───────────────────────────────────

function TunnelModal({ tunnelName, dailyData, onClose }: {
  tunnelName: string;
  dailyData: TunnelData[];
  onClose: () => void;
}) {
  const tunnelRows = dailyData.filter(d => d.duong_lo === tunnelName);
  const modalChartData = tunnelRows.map(d => ({
    date: d.ngay_bao_cao,
    prod: Number(d.san_luong_luy_ke) || 0,
    prog: Number(d.tien_do_luy_ke) || 0,
  }));

  const svgWidth = 600;
  const svgHeight = 200;
  const stepX = modalChartData.length > 0 ? svgWidth / modalChartData.length : svgWidth;

  const maxProg = Math.max(...modalChartData.map(d => d.prog), 1);
  const points = modalChartData.map((d, i) => {
    const x = stepX * i + (stepX / 2);
    const y = 170 - (d.prog / maxProg) * 140;
    return { x, y, value: d.prog, date: d.date };
  });

  const linePath = points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : "";
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x},180 L ${points[0].x},180 Z` : "";

  const lastPoint = modalChartData[modalChartData.length - 1] ?? { prod: 0, prog: 0 };
  const totalProd = lastPoint.prod;
  const totalProg = lastPoint.prog;
  const maxProd = Math.max(...modalChartData.map(x => x.prod), 1);

  if (modalChartData.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{tunnelName}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500">Chưa có dữ liệu cho {tunnelName} trong tháng này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{tunnelName}</h2>
            <p className="text-sm text-gray-500">Tổng cộng lũy kế</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-8 border-b border-r border-gray-100">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Sản lượng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#1D4ED8]">{totalProd.toLocaleString('vi-VN')}</span>
              <span className="text-base text-gray-700 font-medium">tấn</span>
            </div>
          </div>
          <div className="p-8 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Tiến độ đào lò</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#F97316]">{totalProg}</span>
              <span className="text-base text-gray-700 font-medium">mét</span>
            </div>
          </div>
          <div className="p-8 border-r border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Sản lượng theo ngày (tấn)</p>
            <div className="flex items-end justify-between h-48">
              {modalChartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center group flex-1">
                  <span className="text-sm font-bold text-[#1D4ED8] mb-2">{d.prod.toLocaleString('vi-VN')}</span>
                  <div className="w-10 bg-[#2563EB] rounded-t-md transition-all group-hover:bg-[#1D4ED8]" style={{ height: `${(d.prod / maxProd) * 140}px` }}></div>
                  <span className="text-xs text-gray-400 mt-2 border-t border-gray-100 w-full text-center pt-2">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Tiến độ đào lò theo ngày (mét)</p>
            <div className="relative h-48 w-full">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientOrange" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FFF7ED" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#gradientOrange)" />
                <path d={linePath} fill="none" stroke="#F97316" strokeWidth="3" />
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#F97316" strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#EA580C" fontSize="14" fontWeight="bold">{p.value}</text>
                    <text x={p.x} y="196" textAnchor="middle" fill="#9CA3AF" fontSize="12">{p.date}</text>
                  </g>
                ))}
                <line x1="0" y1="180" x2="600" y2="180" stroke="#E5E7EB" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DetailScreen Component ───────────────────────────────────

export default function DetailScreen() {
  const [selectedTunnelName, setSelectedTunnelName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const ITEMS_PER_PAGE = 5;

  const detailKey = `duong-lo:${selectedMonth}|${selectedYear}`;
  const {
    data: tunnelData = [],
    loading: loadingDetail,
    error: detailError,
    refresh: refreshDetail,
  } = useSessionCache<TunnelData[]>(
    detailKey,
    async () => {
      const url = `${N8N_DUONG_LO_URL}?thang=${selectedMonth}&nam=${selectedYear}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    },
    [selectedMonth, selectedYear]
  );

  const latestByTunnel = useMemo(() => {
    const map = new Map<string, TunnelData>();
    for (const row of tunnelData) {
      map.set(row.duong_lo, row);
    }
    return Array.from(map.values());
  }, [tunnelData]);

  const filtered = latestByTunnel.filter(t =>
    t.duong_lo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedData = filtered.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  const totalTunnels = latestByTunnel.length;
  const warningCount = 0;
  const criticalCount = 0;

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6 bg-gray-50/30 select-none min-h-screen">
      <Header title="Báo cáo chi tiết" onRefresh={refreshDetail} loading={loadingDetail} avatar="NA" />

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 self-start flex-shrink-0">
        <BarChart2 size={15} className="text-blue-600" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tháng/Năm:</span>
        <select
          value={selectedMonth}
          onChange={e => { setSelectedMonth(Number(e.target.value)); setCurrentPage(1); }}
          className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg pl-2 pr-6 py-1 cursor-pointer"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>Tháng {m}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg pl-2 pr-6 py-1 cursor-pointer"
        >
          <option value={2026}>Năm 2026</option>
        </select>
        <button
          onClick={refreshDetail}
          disabled={loadingDetail}
          title="Làm mới"
          className="ml-1 flex items-center justify-center w-7 h-7 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <Loader2 size={14} className={loadingDetail ? "animate-spin" : ""} />
        </button>
      </div>

      {detailError && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertTriangle size={14} />
          {detailError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 flex-shrink-0">
        <div className="bg-[#EBF1FF] rounded-xl border border-[#DCE4FA] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1E40AF] flex items-center justify-center text-white shadow-sm">
              <List size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng đường lò</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1E40AF]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{totalTunnels}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-[#1E40AF] bg-[#D1DEFF] rounded-full">đang hoạt động</span>
        </div>
        <div className="bg-[#FFF9E5] rounded-xl border border-[#FBEAC0] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D97706] flex items-center justify-center text-white shadow-sm">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cảnh báo</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#D97706]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{warningCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FDEBEB] rounded-xl border border-[#F9D5D5] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#DC2626] flex items-center justify-center text-white shadow-sm">
              <AlertCircle size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nghiêm trọng</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#DC2626]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{criticalCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <div className="px-6 py-4.5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Danh sách đường lò</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-700 w-full bg-gray-50/50"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <span className="text-sm text-gray-400">{filtered.length} kết quả</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-base text-left table-fixed min-w-[700px]">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="w-[35%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Tên đường lò</th>
                <th className="w-[20%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Sản lượng</th>
                <th className="w-[20%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Tiến độ đào</th>
                <th className="w-[25%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Thời gian cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.duong_lo + idx}
                  onClick={() => setSelectedTunnelName(item.duong_lo)}
                  className="border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm truncate">{item.duong_lo}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{Number(item.san_luong_luy_ke).toLocaleString("vi-VN")}</span>
                    <span className="text-xs text-gray-400 ml-1">tấn</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{Number(item.tien_do_luy_ke).toLocaleString("vi-VN")}</span>
                    <span className="text-xs text-gray-400 ml-1">mét</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{item.thoi_gian_bao_cao}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && !loadingDetail && (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">{detailError ? "" : "Không có dữ liệu đường lò trong tháng này."}</td></tr>
              )}
              {loadingDetail && (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">Đang tải dữ liệu...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl flex-shrink-0">
          <span className="text-sm text-gray-500 font-medium">Trang {activePage} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={activePage === 1} className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${activePage === page ? "bg-[#2563EB] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={activePage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Sau</button>
          </div>
        </div>
      </div>

      {selectedTunnelName && (
        <TunnelModal
          tunnelName={selectedTunnelName}
          dailyData={tunnelData}
          onClose={() => setSelectedTunnelName(null)}
        />
      )}
    </div>
  );
}