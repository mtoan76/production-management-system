import { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle, CheckCircle, X, TrendingUp, TrendingDown,
  Package, CloudSun, CloudRain, Sun, RefreshCw, LineChart,
  Container, BoxSelect, Scissors, ChartBar, Droplets, Clock, CalendarDays,
  ChevronRight, ChevronDown, HardHat, CheckCircle2, XCircle, Truck,
  ShoppingCart, Wrench, Construction, Landmark, Ruler, Building2,
} from "lucide-react";
import {
  Screen, MonthSummary, DaySummary, KpiSummary, TunnelData, CongTruongChiTiet, TunnelChiTiet,
} from '../types';
import { N8N_OVERVIEW_URL, N8N_DUONG_LO_URL, N8N_CONG_TRUONG_CHITIET_URL } from '../utils/constants';
import Header from '../components/Header';

type ViewMode = "day" | "month" | "year";

type OverviewCacheData = { kpi: KpiSummary | null; monthSummary: MonthSummary | null; daySummary: DaySummary[]; monthList: any[]; tunnelRows: TunnelData[] };
const overviewCache: Map<string, OverviewCacheData> = new Map();

function useOverviewCache(month: number, year: number) {
  const key = `${year}-${month}`;
  const [data, setData] = useState<OverviewCacheData | null>(overviewCache.get(key) || null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (overviewCache.has(key) && refreshKey === 0) return;
    let cancelled = false; setLoading(true);
    Promise.all([
      fetch(`${N8N_OVERVIEW_URL}?thang=${month}&nam=${year}`).then(r => r.json()),
      fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`).then(r => r.json()),
    ]).then(([tq, dl]) => {
      if (cancelled) return;
      const ma = Array.isArray(tq?.month) ? tq.month : (tq?.month ? [tq?.month] : []);
      const da = Array.isArray(tq?.day) ? tq.day : [];
      const nd: OverviewCacheData = { kpi: tq?.kpi ?? null, monthSummary: ma[0] ?? null, daySummary: da, monthList: tq?.month ?? [], tunnelRows: dl?.data ?? [] };
      overviewCache.set(key, nd); setData(nd);
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [month, year, refreshKey]);
  return { data, loading, refresh: () => setRefreshKey(k => k + 1) };
}

type CongTruongCacheData = { thang: number; nam: number; remainingDays: number; keHoachThang: { lo_cho: number; dao_lo: number; xen_lo: number; chong_doi: number }; khaiThac: any[]; daoLo: any[] };
const congTruongCache: Map<string, CongTruongCacheData> = new Map();

function useCongTruongCache(month: number, year: number) {
  const key = `${year}-${month}`;
  const [data, setData] = useState<CongTruongCacheData | null>(congTruongCache.get(key) || null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (congTruongCache.has(key) && refreshKey === 0) return;
    let cancelled = false; setLoading(true);
    fetch(`${N8N_OVERVIEW_URL.replace('/tong-quan', '/cong-truong')}?thang=${month}&nam=${year}`)
      .then(r => r.json()).then(result => {
        if (cancelled) return;
        const nd: CongTruongCacheData = { thang: result.thang, nam: result.nam, remainingDays: result.remainingDays, keHoachThang: result.keHoachThang, khaiThac: result.khaiThac || [], daoLo: result.daoLo || [] };
        congTruongCache.set(key, nd); setData(nd);
      }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [month, year, refreshKey]);
  return { data, loading, refresh: () => setRefreshKey(k => k + 1) };
}

function fmt(n: number, d = 0): string { return n.toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d }); }

const METRIC_PALETTE = {
  primary:   { text: "#004ac6", bar: "#004ac6", track: "#dbe1ff" },
  secondary: { text: "#9d4300", bar: "#fd761a", track: "#ffdbca" },
  tertiary:  { text: "#006242", bar: "#007d55", track: "#6ffbbe" },
} as const;
type MetricPaletteKey = keyof typeof METRIC_PALETTE;

function MiniProgressBar({ percent, barColor, trackColor }: { percent: number; barColor: string; trackColor: string }) {
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-28 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: trackColor }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
    </div>
  );
}

function MetricCell({ value, plan, unit, palette, sep }: { value: number; plan: number; unit: string; palette: MetricPaletteKey; sep?: boolean }) {
  const p = METRIC_PALETTE[palette];
  const pct = plan > 0 ? Math.min(100, Math.round((value / plan) * 10000) / 100) : 0;
  return (
    <div className={`flex items-center justify-start gap-1 w-full${sep ? " border-l-[1.5px] border-gray-200 pl-3" : ""}`}>
      <span className="font-mono text-sm font-medium tabular-nums text-right shrink-0 w-11" style={{ color: p.text }}>{fmt(Math.round(value))}</span>
      <span className="text-[12px] text-gray-300 shrink-0 w-6 ml-0.5">{unit}</span>
      <MiniProgressBar percent={pct} barColor={p.bar} trackColor={p.track} />
      <span className="text-[12px] text-gray-500 w-7 text-right shrink-0 tabular-nums">{Math.round(pct)}%</span>
    </div>
  );
}

function relativeTimeCte(raw: string): string {
  if (!raw || raw === "—") return "—";
  let m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  let dd: string, mm: string, yyyy: string, hh: string, mi: string, ss: string;
  if (m) { [, dd, mm, yyyy, hh, mi, ss] = m; }
  else {
    m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (!m) return raw;
    [, dd, mm, yyyy] = m; hh = mi = ss = "00";
  }
  const then = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
  if (isNaN(then.getTime())) return raw;
  const diff = Math.max(0, (Date.now() - then.getTime()) / 1000);
  const min = Math.floor(diff / 60), hr = Math.floor(diff / 3600), day = Math.floor(diff / 86400);
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  if (hr < 24) return `${hr} giờ trước`;
  if (day === 1) return "Hôm qua";
  if (day < 7) return `${day} ngày trước`;
  if (day < 30) return `${Math.floor(day / 7)} tuần trước`;
  return `${dd}/${mm}/${yyyy}`;
}

type KpiSection = {
  id: string; num: number; label: string; icon: any;
  borderColor: string; bgColor: string; textColor: string; lightBg: string;
  actual: number; planDisplay: number; unit: string;
  pct: number; remaining: number; tbNeed: number;
};

function buildSection(id: string, num: number, label: string, icon: any, borderColor: string, bgColor: string, textColor: string, lightBg: string,
  actual: number, planDisplay: number, unit: string, remainingDays: number): KpiSection {
  const pct = planDisplay > 0 ? Math.round((actual / planDisplay) * 1000) / 10 : 0;
  const remaining = Math.max(planDisplay - actual, 0);
  const tbNeed = remainingDays > 0 ? remaining / remainingDays : 0;
  return { id, num, label, icon, borderColor, bgColor, textColor, lightBg, actual, planDisplay, unit, pct, remaining, tbNeed };
}

export default function OverviewScreen({ onOpenAlert }: { onOpenAlert: (alertId: number) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [khaiThacOpen, setKhaiThacOpen] = useState(true);
  const [daoLoOpen, setDaoLoOpen] = useState(true);

  const { data: overviewData, loading, refresh: refreshOverview } = useOverviewCache(selectedMonth, selectedYear);
  const kpi = overviewData?.kpi ?? null;
  const monthSummary = overviewData?.monthSummary ?? null;
  const daySummary = overviewData?.daySummary ?? [];

  const { data: congTruongData, loading: loadingCongTruong } = useCongTruongCache(selectedMonth, selectedYear);
  const [congTruongModalOpen, setCongTruongModalOpen] = useState<null | { site: any; type: "khai_thac" | "dao_lo" }>(null);
  const [congTruongChiTiet, setCongTruongChiTiet] = useState<CongTruongChiTiet | null>(null);
  const [loadingCongTruongChiTiet, setLoadingCongTruongChiTiet] = useState(false);

  useEffect(() => {
    if (!congTruongModalOpen) { setCongTruongChiTiet(null); return; }
    let cancelled = false; setLoadingCongTruongChiTiet(true);
    fetch(`${N8N_CONG_TRUONG_CHITIET_URL}?thang=${selectedMonth}&nam=${selectedYear}&site=${encodeURIComponent(congTruongModalOpen.site.originalTenCongTruong)}&type=${congTruongModalOpen.type}`)
      .then(r => r.ok ? r.json() : null).then(data => {
        if (cancelled) return;
        const d = data?.data || data || null;
        setCongTruongChiTiet(d && typeof d === "object" ? { daoLo: Array.isArray(d.daoLo) ? d.daoLo : [], xenLo: Array.isArray(d.xenLo) ? d.xenLo : [], chongDoi: Array.isArray(d.chongDoi) ? d.chongDoi : [] } : null);
      }).catch(() => { if (!cancelled) setCongTruongChiTiet(null); }).finally(() => { if (!cancelled) setLoadingCongTruongChiTiet(false); });
    return () => { cancelled = true; };
  }, [congTruongModalOpen, selectedMonth, selectedYear]);

  const lastDayRow = daySummary.length > 0 ? daySummary[daySummary.length - 1] : null;
  const today = new Date();
  const totalDaysYear = ((y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365)(selectedYear);
  const dayOfYear = Math.floor((today.getTime() - new Date(selectedYear, 0, 1).getTime()) / 86400000) + 1;
  const remainingDaysYear = Math.max(totalDaysYear - dayOfYear, 0);
  const elapsedPct = totalDaysYear > 0 ? Math.round((dayOfYear / totalDaysYear) * 1000) / 10 : 0;

const getKpi = (type: string) => {
  const keHoachNam = (kpi as any)?.[type]?.ke_hoach_nam || 0;
  const thucTe = Number((kpi as any)?.[type]?.thuc_te) || 0;
  const luyKe = lastDayRow ? Number((lastDayRow as any)[type + "_luy_ke"]) || 0 : 0;
  const yearActual = thucTe || luyKe;
  let actual = 0, plan = 0;
  switch (viewMode) {
    case "day": actual = luyKe; plan = keHoachNam / 12; break;
    case "month": actual = luyKe; plan = keHoachNam / 12; break;
    case "year": actual = yearActual; plan = keHoachNam; break;
  }
  return { actual, plan, keHoachNam, luyKe, yearActual };
};

  const loCho = getKpi("lo_cho");
  const daoLo = getKpi("dao_lo");
  const xenLo = getKpi("xen_lo");
  const doanhThuPlan = 120, tieuThuPlan = 50000;
  const doanhThuPlanView = viewMode === "year" ? doanhThuPlan : doanhThuPlan / 12;
  const tieuThuPlanView = viewMode === "year" ? tieuThuPlan : tieuThuPlan / 12;
  const doanhThuActual = loCho.plan > 0 ? (loCho.actual / loCho.plan) * doanhThuPlanView : 0;
  const tieuThuActual = daoLo.plan > 0 ? (daoLo.actual / daoLo.plan) * tieuThuPlanView : 0;

  const viewPlan = (keHoachNam: number) => viewMode === "year" ? keHoachNam : keHoachNam / 12;
  const sections: KpiSection[] = [
    buildSection("1", 1, "Sản Lượng Than Lũy Kế", Container, "#1a4980", "#1a4980", "#1a4980", "#e6f0ff", loCho.actual, viewPlan(loCho.keHoachNam), "tấn", remainingDaysYear),
    buildSection("2", 2, "Tiến Độ Đào Lò Lũy Kế", BoxSelect, "#e67e22", "#e67e22", "#e67e22", "#fef5eb", daoLo.actual, viewPlan(daoLo.keHoachNam), "m", remainingDaysYear),
    buildSection("3", 3, "Xén Lò Lũy Kế", Scissors, "#10B981", "#10B981", "#059669", "#ECFDF5", xenLo.actual, viewPlan(xenLo.keHoachNam), "m", remainingDaysYear),
    buildSection("4", 4, "Doanh Thu Lũy Kế", ChartBar, "#7C3AED", "#7C3AED", "#7C3AED", "#F5F3FF", doanhThuActual, viewMode === "year" ? doanhThuPlan : doanhThuPlanView, "tỷ", remainingDaysYear),
    buildSection("5", 5, "Tiêu Thụ Lũy Kế", Droplets, "#0891B2", "#0891B2", "#0891B2", "#ECFEFF", tieuThuActual, viewMode === "year" ? tieuThuPlan : tieuThuPlanView, "tấn", remainingDaysYear),
  ];

  const pctFor = (type: string, mode: ViewMode) => {
    const keHoachNam = (kpi as any)?.[type]?.ke_hoach_nam || 0;
    const thucTe = Number((kpi as any)?.[type]?.thuc_te) || 0;
    const luyKe = lastDayRow ? Number((lastDayRow as any)[type + "_luy_ke"]) || 0 : 0;
    const yearActual = thucTe || luyKe;
    let actual = 0;
    switch (mode) {
      case "day": actual = luyKe; break;
      case "month": actual = luyKe; break;
      case "year": actual = yearActual; break;
    }
    return keHoachNam > 0 ? Math.round((actual / keHoachNam) * 1000) / 10 : 0;
  };
  const chartData = [
    { name: "Sản Lượng", Ngày: pctFor("lo_cho", "day"), Tháng: pctFor("lo_cho", "month"), Năm: pctFor("lo_cho", "year") },
    { name: "Đào Lò", Ngày: pctFor("dao_lo", "day"), Tháng: pctFor("dao_lo", "month"), Năm: pctFor("dao_lo", "year") },
    { name: "Xén Lò", Ngày: pctFor("xen_lo", "day"), Tháng: pctFor("xen_lo", "month"), Năm: pctFor("xen_lo", "year") },
    { name: "Doanh Thu", Ngày: loCho.plan > 0 ? Math.round((loCho.luyKe / loCho.plan) * (12 / 365) * 1000) / 10 : 0, Tháng: loCho.plan > 0 ? Math.round((loCho.luyKe / loCho.plan) * 1000) / 10 : 0, Năm: loCho.plan > 0 ? Math.round((loCho.yearActual / loCho.plan) * 1000) / 10 : 0 },
    { name: "Tiêu Thụ", Ngày: daoLo.plan > 0 ? Math.round((daoLo.luyKe / daoLo.plan) * (12 / 365) * 1000) / 10 : 0, Tháng: daoLo.plan > 0 ? Math.round((daoLo.luyKe / daoLo.plan) * 1000) / 10 : 0, Năm: daoLo.plan > 0 ? Math.round((daoLo.yearActual / daoLo.plan) * 1000) / 10 : 0 },
  ];

  const khaiThacSites = (congTruongData?.khaiThac || []).map(s => ({ ...s, tenCongTruong: s.tenCongTruong, originalTenCongTruong: s.tenCongTruong }));
  const daoLoSites = (congTruongData?.daoLo || []).map(s => ({ ...s, tenCongTruong: s.tenCongTruong, originalTenCongTruong: s.tenCongTruong }));

  const weatherDays = [
    { day: "T6", icon: Sun, temp: "32°/26°" },
    { day: "T7", icon: CloudSun, temp: "31°/25°" },
    { day: "CN", icon: CloudRain, temp: "30°/24°" },
    { day: "T2", icon: Sun, temp: "30°/24°" },
  ];

  const getEvalStatus = (pct: number) => {
    if (pct < elapsedPct - 5) return { label: "CHẬM TIẾN ĐỘ", bg: "#FEE2E2", text: "#DC2626", border: "#FECACA", icon: XCircle };
    if (pct > elapsedPct + 5) return { label: "VƯỢT KẾ HOẠCH", bg: "#ECFDF5", text: "#059669", border: "#A7F3D0", icon: CheckCircle2 };
    return { label: "ĐÚNG TIẾN ĐỘ", bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE", icon: CheckCircle };
  };

  const planLabel = "Kế Hoạch Năm";

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 min-h-screen overflow-y-auto" style={{ background: "#F8F9FA" }}>
      <Header title="Báo cáo tổng quan" onRefresh={refreshOverview} loading={loading} avatar="NA" />

      <section className="rounded-xl p-4 shadow-sm flex items-center justify-between overflow-x-auto gap-4" style={{ background: "linear-gradient(180deg, #FFF6E5 0%, #FFECD2 100%)" }}>
        <div className="flex items-center shrink-0"><Sun size={36} className="text-yellow-500 mr-3" /><div><div className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">31°C</div><div className="font-semibold text-gray-800 text-sm">Quảng Ninh</div><div className="text-xs text-gray-600">Trời nắng, oi nóng</div></div></div>
        <div className="flex gap-4 md:gap-6 shrink-0 px-3 border-l border-orange-200/50">{weatherDays.map(w => (<div key={w.day} className="text-center"><div className="text-[10px] font-semibold text-gray-700">{w.day}</div><w.icon size={18} className="text-yellow-500 my-0.5 mx-auto" /><div className="text-[10px] font-semibold">{w.temp}</div></div>))}</div>
      </section>

      <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-3">
        <div className="flex items-center gap-4 flex-wrap"><div className="flex items-center"><Clock size={14} className="mr-2 text-gray-400" /><span className="text-xs">Cập nhật: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span></div></div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs">Chế độ xem:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">{([ "day", "month", "year" ] as ViewMode[]).map(m => (<button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all ${viewMode === m ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-200"}`}>{m === "day" ? "Ngày" : m === "month" ? "Tháng" : "Năm"}</button>))}</div>
          {viewMode === "day" && (<><select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-xs font-medium outline-none">{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>T{i + 1}</option>)}</select><select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-xs font-medium outline-none">{[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}</select></>)}
          {(viewMode === "month" || viewMode === "year") && (<select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-xs font-medium outline-none">{[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}</select>)}
          <button onClick={refreshOverview} className="p-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {sections.map(s => {
          const es = getEvalStatus(s.pct);
          const EvalIcon = es.icon;
          return (
            <section key={s.id} className="border-2 rounded-lg relative pt-7 pb-3 px-3 md:px-4 shadow-sm bg-[#fafbfc]" style={{ borderColor: s.borderColor }}>
              <div className="absolute -top-4 left-4 text-white rounded-full flex items-center pr-3 pl-1.5 py-1 shadow-md border-2 border-white" style={{ background: s.bgColor }}>
                <div className="rounded-full p-1 mr-1.5 border-2 border-white" style={{ background: s.bgColor, filter: "brightness(0.8)" }}><s.icon size={14} className="text-white" /></div>
                <h2 className="text-xs md:text-sm font-bold uppercase">{s.num}. {s.label}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: s.textColor }}>{loading ? "—" : fmt(Math.round(s.actual))} <span className="text-sm font-semibold text-gray-500">{s.unit}</span></div>
                  <div className="w-full h-px bg-gray-300 my-2" />
                  <div className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{planLabel}</div>
                  <div className="text-lg md:text-xl font-bold text-gray-800">{loading ? "—" : fmt(Math.round(s.planDisplay))} <span className="text-sm font-medium text-gray-500">{s.unit}</span></div>
                  <div className="mt-3 flex items-center gap-2 w-full px-2 py-1.5 rounded-lg border" style={{ background: s.lightBg, borderColor: s.borderColor + "40" }}>
                    <div className="p-1.5 rounded-full shrink-0" style={{ background: s.bgColor + "30" }}><CheckCircle size={14} style={{ color: s.textColor }} /></div>
                    <div className="text-left">
                      <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: s.textColor }}>Còn Phải Thực Hiện</div>
                      <div className="text-sm md:text-base font-bold" style={{ color: s.textColor }}>{loading ? "—" : fmt(Math.round(s.remaining))} <span className="text-[10px] font-medium text-gray-500">{s.unit}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded-lg border text-center flex-1 flex flex-col justify-center" style={{ background: s.lightBg, borderColor: s.borderColor + "40" }}>
                    <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: s.textColor }}>Tỷ Lệ Hoàn Thành</div>
                    <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: s.textColor }}>{loading ? "—" : s.pct + "%"}</div>
                    <div className="px-1">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, s.pct)}%`, background: s.bgColor }} /></div>
                      <div className="flex justify-between text-[8px] text-gray-500 font-medium mt-0.5"><span>0%</span><span>100%</span></div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg border flex items-center gap-2" style={{ background: s.lightBg, borderColor: s.borderColor + "40" }}>
                    <div className="p-1.5 rounded-full shrink-0" style={{ background: s.bgColor + "30" }}><TrendingUp size={14} style={{ color: s.textColor }} /></div>
                    <div><div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: s.textColor }}>Bình Quân Cần Đạt</div><div className="text-base md:text-lg font-bold" style={{ color: s.textColor }}>{loading ? "—" : fmt(Math.round(s.tbNeed))} <span className="text-[10px] font-medium text-gray-600">{s.unit}/ngày</span></div></div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <section className="mt-6 rounded-lg border border-gray-200 overflow-hidden bg-white flex flex-col md:flex-row">
        <div className="text-white p-4 md:p-6 flex items-center gap-3 md:w-1/3 shrink-0" style={{ background: "#1e3a8a" }}>
          <div className="bg-white/20 p-3 rounded-full"><ChartBar size={24} className="text-white" /></div>
          <h3 className="text-sm md:text-lg font-bold uppercase leading-tight">Đánh Giá Tiến Độ<br/>So Với Kế Hoạch<br/>Thời Gian</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-center text-xs md:text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wider text-left border-r border-gray-200">Chỉ Tiêu</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-r border-gray-200" style={{ color: "#1e40af" }}>Tỷ Lệ Hoàn Thành</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-r border-gray-200" style={{ color: "#1e40af" }}>Tiến Độ Thời Gian</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider" style={{ color: "#1e40af" }}>Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sections.map(s => {
                const es = getEvalStatus(s.pct);
                const EvalIcon = es.icon;
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 md:px-4 font-medium text-gray-800 text-left flex items-center gap-2 border-r border-gray-200"><s.icon size={16} style={{ color: s.textColor }} />{s.label.replace(" Lũy Kế", "")}</td>
                    <td className="py-3 px-2 md:px-4 text-base font-bold border-r border-gray-200" style={{ color: s.textColor }}>{s.pct}%</td>
                    <td className="py-3 px-2 md:px-4 font-semibold text-gray-700 border-r border-gray-200">~{elapsedPct}%</td>
                    <td className="py-3 px-2 md:px-4"><div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ background: es.bg, color: es.text, borderColor: es.border }}><EvalIcon size={12} />{es.label}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><ChartBar size={16} className="text-blue-600" /></div>
          <h3 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-wide">So Sánh Tiến Độ Kế Hoạch (Ngày / Tháng / Năm)</h3>
        </div>
        <div className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }} barGap={2} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Bar dataKey="Ngày" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="Tháng" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="Năm" fill="#1E40AF" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#93C5FD" }}></span><span className="text-xs text-gray-600">Ngày</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#3B82F6" }}></span><span className="text-xs text-gray-600">Tháng</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#1E40AF" }}></span><span className="text-xs text-gray-600">Năm</span></div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <section className="bg-white rounded-xl border border-[#c3c6d7] overflow-hidden shadow-sm">
          <button onClick={() => setKhaiThacOpen(!khaiThacOpen)} className="w-full flex items-center justify-between px-6 py-4 border-b border-[#c3c6d7] bg-[#f8f9ff] cursor-pointer hover:bg-[#eff4ff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffb690] flex items-center justify-center shrink-0"><Construction size={18} className="text-[#9d4300]" /></div>
              <h2 className="text-lg font-semibold text-[#0b1c30]">Công trường Khai thác</h2>
            </div>
            <span className={`text-[#737686] transition-transform ${khaiThacOpen ? "" : "rotate-180"}`}><ChevronDown size={20} /></span>
          </button>
          {khaiThacOpen && (<div className="overflow-x-auto">{loadingCongTruong ? (<div className="text-center py-6 text-xs text-gray-500">Đang tải...</div>) : khaiThacSites.length === 0 ? (<div className="text-center py-6 text-xs text-gray-500">Chưa có dữ liệu</div>) : (<table className="w-full text-left border-collapse table-fixed"><thead><tr className="border-b border-[#c3c6d7] bg-[#f8f9ff]"><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#434655] w-[190px]"><div className="flex items-center gap-2"><Building2 size={16} className="text-[#737686]" />CÔNG TRƯỜNG</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#004ac6] w-[255px]"><div className="flex items-center gap-2"><ShoppingCart size={16} />TẤN THAN</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9d4300] w-[270px] border-l-[1.5px] border-gray-200 pl-3"><div className="flex items-center gap-2"><Landmark size={16} />MÉT ĐÀO LÒ</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#006242] w-[270px] border-l-[1.5px] border-gray-200 pl-3"><div className="flex items-center gap-2"><Ruler size={16} />MÉT XÉN</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#434655] w-[110px]"><div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#737686]" />CẬP NHẬT</div></th></tr></thead><tbody>{khaiThacSites.map((site, idx) => (<tr key={site.tenCongTruong} onClick={() => setCongTruongModalOpen({ site, type: "khai_thac" })} className={`border-b border-[#c3c6d7] cursor-pointer transition-colors hover:bg-[#eff4ff] ${idx % 2 !== 0 ? "bg-[#f8f9ff]" : "bg-white"}`}><td className="px-4 py-2"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#ffdbca] flex items-center justify-center shrink-0"><ShoppingCart size={16} className="text-[#9d4300]" /></div><span className="text-sm font-semibold text-[#0b1c30]">{site.tenCongTruong}</span></div></td><td className="px-4 py-2"><MetricCell value={Number(site.lo_cho) || 0} plan={Number(congTruongData?.keHoachThang?.lo_cho) || 0} unit="tấn" palette="primary" /></td><td className="px-4 py-2"><MetricCell sep value={Number(site.dao_lo) || 0} plan={Number(congTruongData?.keHoachThang?.dao_lo) || 0} unit="m" palette="secondary" /></td><td className="px-4 py-2"><MetricCell sep value={Number(site.xen_lo) || 0} plan={Number(congTruongData?.keHoachThang?.xen_lo) || 0} unit="m" palette="tertiary" /></td><td className="px-4 py-2"><div className="flex items-center gap-2 text-[#737686]"><Clock size={14} /><span className="text-[12px] whitespace-nowrap">{relativeTimeCte(site.thoiGianBaoCao)}</span></div></td></tr>))}</tbody></table>)}</div>)}
        </section>
        <section className="bg-white rounded-xl border border-[#c3c6d7] overflow-hidden shadow-sm">
          <button onClick={() => setDaoLoOpen(!daoLoOpen)} className="w-full flex items-center justify-between px-6 py-4 border-b border-[#c3c6d7] bg-[#f8f9ff] cursor-pointer hover:bg-[#eff4ff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0"><Wrench size={18} className="text-[#004ac6]" /></div>
              <h2 className="text-lg font-semibold text-[#0b1c30]">Công trường Đào lò</h2>
            </div>
            <span className={`text-[#737686] transition-transform ${daoLoOpen ? "" : "rotate-180"}`}><ChevronDown size={20} /></span>
          </button>
          {daoLoOpen && (<div className="overflow-x-auto">{loadingCongTruong ? (<div className="text-center py-6 text-xs text-gray-500">Đang tải...</div>) : daoLoSites.length === 0 ? (<div className="text-center py-6 text-xs text-gray-500">Chưa có dữ liệu</div>) : (<table className="w-full text-left border-collapse table-fixed"><thead><tr className="border-b border-[#c3c6d7] bg-[#f8f9ff]"><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#434655] w-[240px]"><div className="flex items-center gap-2"><Building2 size={16} className="text-[#737686]" />CÔNG TRƯỜNG</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9d4300] w-[250px]"><div className="flex items-center gap-2"><Landmark size={16} />MÉT ĐÀO LÒ</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#006242] w-[265px] border-l-[1.5px] border-gray-200 pl-3"><div className="flex items-center gap-2"><Ruler size={16} />MÉT XÉN</div></th><th className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#434655] w-[130px]"><div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#737686]" />CẬP NHẬT</div></th></tr></thead><tbody>{daoLoSites.map((site, idx) => (<tr key={site.tenCongTruong} onClick={() => setCongTruongModalOpen({ site, type: "dao_lo" })} className={`border-b border-[#c3c6d7] cursor-pointer transition-colors hover:bg-[#eff4ff] ${idx % 2 !== 0 ? "bg-[#f8f9ff]" : "bg-white"}`}><td className="px-4 py-2"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0"><Wrench size={16} className="text-[#004ac6]" /></div><span className="text-sm font-semibold text-[#0b1c30]">{site.tenCongTruong}</span></div></td><td className="px-4 py-2"><MetricCell value={Number(site.dao_lo) || 0} plan={Number(congTruongData?.keHoachThang?.dao_lo) || 0} unit="m" palette="secondary" /></td><td className="px-4 py-2"><MetricCell sep value={Number(site.xen_lo) || 0} plan={Number(congTruongData?.keHoachThang?.xen_lo) || 0} unit="m" palette="tertiary" /></td><td className="px-4 py-2"><div className="flex items-center gap-2 text-[#737686]"><Clock size={14} /><span className="text-[12px] whitespace-nowrap">{relativeTimeCte(site.thoiGianBaoCao)}</span></div></td></tr>))}</tbody></table>)}</div>)}
        </section>
      </div>

      <footer className="pt-2"><p className="text-[10px] text-gray-500 italic">Ghi chú: Tiến độ thời gian của năm = (Số ngày đã qua / 365 ngày) x 100% ≈ {elapsedPct}% (tính đến ngày {today.toLocaleDateString("vi-VN")})</p><p className="text-[10px] text-gray-400 text-center mt-3">Dữ liệu được cập nhật định kỳ tự động</p></footer>

      {congTruongModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCongTruongModalOpen(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200"><div><h2 className="font-bold text-gray-900 text-lg">Chi tiết: {congTruongModalOpen.site.tenCongTruong}</h2><p className="text-sm text-gray-500">Tháng {selectedMonth}/{selectedYear}</p></div><button onClick={() => setCongTruongModalOpen(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button></div>
            <div className="p-4 overflow-auto"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{(() => { const s = congTruongModalOpen.site; const items = congTruongModalOpen.type === "khai_thac" ? [{ l: "Tấn than", v: s.lo_cho, u: "tấn", c: "#2563EB" }, { l: "Mét đào lò", v: s.dao_lo, u: "mét", c: "#F59E0B" }, { l: "Mét xén", v: s.xen_lo, u: "mét", c: "#10B981" }] : [{ l: "Mét đào lò", v: s.dao_lo, u: "mét", c: "#F59E0B" }, { l: "Mét xén", v: s.xen_lo, u: "mét", c: "#10B981" }]; return items.map((it, i) => (<div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-3"><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{it.l}</p><div className="text-2xl font-black" style={{ color: it.c }}>{fmt(Math.round(it.v))}<span className="text-xs font-bold ml-1 opacity-60">{it.u}</span></div></div>)); })()}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
