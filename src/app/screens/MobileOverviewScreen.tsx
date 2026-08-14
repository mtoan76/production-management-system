import { useState, useEffect, useMemo } from "react";
import {
  X, ChevronRight, ChevronDown, RefreshCw, Clock, CalendarDays,
  Container, BoxSelect, Scissors, HardHat, ChartBar, Droplets,
  Sun, CloudSun, CloudRain, CheckCircle, XCircle, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TabId, MonthSummary, DaySummary, KpiSummary, TunnelChiTiet, CongTruongChiTiet, CanhBaoListItem, SeverityType,
} from '../types';
import { N8N_OVERVIEW_URL, N8N_DUONG_LO_URL, N8N_CANH_BAO_LIST_URL, N8N_CONG_TRUONG_CHITIET_URL, N8N_CONG_TRUONG_URL } from '../utils/constants';
import { SeverityBadge, ProductionTooltip, ProgressTooltip } from '../components/mobile';
import { simplifySiteName } from '../utils/format';
import { C } from '../components/mobile';
import Header from '../components/Header';

// ─── Caches ───────────────────────────────────────────────────
type MobileOverviewCache = { kpi: any; monthSummary: any; daySummary: any[]; monthList: any[]; tunnelRows: any[] };
const mobileOverviewCache: Map<string, MobileOverviewCache> = new Map();
type MobileCongTruongCache = { thang: number; nam: number; remainingDays: number; keHoachThang: { lo_cho: number; dao_lo: number; xen_lo: number; chong_doi: number }; khaiThac: any[]; daoLo: any[] };
const mobileCongTruongCache: Map<string, MobileCongTruongCache> = new Map();

function fmtNum(n: number, d = 0): string { return n.toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d }); }

export default function MobileOverview({ onNav }: { onNav: (t: TabId) => void }) {
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [refreshTick, setRefreshTick] = useState(0);
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [khaiThacOpen, setKhaiThacOpen] = useState(false);
  const [daoLoOpen, setDaoLoOpen] = useState(false);

  const [monthList, setMonthList] = useState<MonthSummary[]>([]);
  const [monthSummary, setMonthSummary] = useState<MonthSummary | null>(null);
  const [daySummary, setDaySummary] = useState<DaySummary[]>([]);
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [alerts, setAlerts] = useState<CanhBaoListItem[]>([]);
  const [tunnelRows, setTunnelRows] = useState<any[]>([]);

  const [congTruongData, setCongTruongData] = useState<MobileCongTruongCache | null>(null);
  const [loadingCongTruong, setLoadingCongTruong] = useState(true);
  const [congTruongModalOpen, setCongTruongModalOpen] = useState<null | { site: any; type: "khai_thac" | "dao_lo" }>(null);
  const [congTruongChiTiet, setCongTruongChiTiet] = useState<CongTruongChiTiet | null>(null);
  const [loadingCongTruongChiTiet, setLoadingCongTruongChiTiet] = useState(false);

  // ─── Fetch Overview ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const key = `${year}-${viewMode}-${month}`;
    if (mobileOverviewCache.has(key) && refreshTick === 0) {
      const c = mobileOverviewCache.get(key)!;
      setMonthList(c.monthList); setMonthSummary(c.monthSummary); setDaySummary(c.daySummary); setKpi(c.kpi); setTunnelRows(c.tunnelRows); setLoading(false);
      return;
    }
    setLoading(true); setErrorMsg("");
    async function load() {
      try {
        const thangParam = viewMode === "month" ? 12 : month;
        const [resOV, resAL, resDL] = await Promise.all([
          fetch(`${N8N_OVERVIEW_URL}?thang=${thangParam}&nam=${year}`),
          fetch(`${N8N_CANH_BAO_LIST_URL}?limit=5`),
          fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`),
        ]);
        if (!resOV.ok) throw new Error("Lỗi tải tổng quan");
        const d = await resOV.json();
        if (cancelled) return;
        const list: MonthSummary[] = Array.isArray(d?.month) ? d.month : d?.month ? [d.month] : [];
        const focusMonth = viewMode === "month" ? Number(year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12) : month;
        const mSum = list.find(m => Number(m.thang) === focusMonth) || list[list.length - 1] || null;
        const dSum = Array.isArray(d?.day) ? d.day : [];
        mobileOverviewCache.set(key, { kpi: d?.kpi ?? null, monthSummary: mSum, daySummary: dSum, monthList: list, tunnelRows: (resDL.ok ? ((await resDL.json())?.data || []) : []) });
        setMonthList(list); setMonthSummary(mSum); setDaySummary(dSum); setKpi(d?.kpi ?? null); setTunnelRows((resDL.ok ? ((await resDL.json())?.data || []) : []));
        if (resAL.ok) { const da = await resAL.json(); if (!cancelled) setAlerts(Array.isArray(da?.data) ? da.data : []); }
      } catch (e: any) { if (!cancelled) setErrorMsg(e?.message || "Lỗi tải dữ liệu"); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [month, year, refreshTick, viewMode]);

  // ─── Fetch CongTruong ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const key = `${year}-${month}`;
    if (mobileCongTruongCache.has(key) && refreshTick === 0) {
      setCongTruongData(mobileCongTruongCache.get(key)!); setLoadingCongTruong(false); return;
    }
    setLoadingCongTruong(true);
    async function load() {
      try {
        const r = await fetch(`${N8N_CONG_TRUONG_URL}?thang=${month}&nam=${year}`);
        if (!r.ok) throw new Error("Lỗi công trường");
        const d = await r.json();
        if (cancelled) return;
        const nd: MobileCongTruongCache = { thang: d.thang, nam: d.nam, remainingDays: d.remainingDays, keHoachThang: d.keHoachThang, khaiThac: d.khaiThac || [], daoLo: d.daoLo || [] };
        mobileCongTruongCache.set(key, nd); setCongTruongData(nd);
      } catch { if (!cancelled) { } }
      finally { if (!cancelled) setLoadingCongTruong(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [month, year, refreshTick]);

  // ─── Modal chi tiết công trường ───────────────────────────────
  useEffect(() => {
    if (!congTruongModalOpen) { setCongTruongChiTiet(null); return; }
    let cancelled = false;
    setLoadingCongTruongChiTiet(true);
    fetch(`${N8N_CONG_TRUONG_CHITIET_URL}?thang=${month}&nam=${year}&site=${encodeURIComponent(congTruongModalOpen.site.originalTenCongTruong)}&type=${congTruongModalOpen.type}`)
      .then(r => r.ok ? r.json() : null).then(data => {
        if (cancelled) return;
        const d = data?.data || data || null;
        setCongTruongChiTiet(d && typeof d === "object" ? { daoLo: Array.isArray(d.daoLo) ? d.daoLo : [], xenLo: Array.isArray(d.xenLo) ? d.xenLo : [], chongDoi: Array.isArray(d.chongDoi) ? d.chongDoi : [] } : null);
      }).catch(() => { if (!cancelled) setCongTruongChiTiet(null); })
      .finally(() => { if (!cancelled) setLoadingCongTruongChiTiet(false); });
    return () => { cancelled = true; };
  }, [congTruongModalOpen, month, year]);

  // ─── Calculations ─────────────────────────────────────────────
  const lastDayRow = daySummary.length > 0 ? daySummary[daySummary.length - 1] : null;
  const today = new Date();
  const totalDaysYear = ((y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365)(year);
  const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1;
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

  // Doanh thu / Tiêu thụ tính tỷ lệ
  const loCho = getKpi("lo_cho");
  const daoLo = getKpi("dao_lo");
  const xenLo = getKpi("xen_lo");

  const doanhThuPlan = 120;
  const tieuThuPlan = 50000;
  const doanhThuPlanView = viewMode === "year" ? doanhThuPlan : doanhThuPlan / 12;
  const tieuThuPlanView = viewMode === "year" ? tieuThuPlan : tieuThuPlan / 12;
  const doanhThuActual = loCho.plan > 0 ? (loCho.actual / loCho.plan) * doanhThuPlanView : 0;
  const tieuThuActual = daoLo.plan > 0 ? (daoLo.actual / daoLo.plan) * tieuThuPlanView : 0;

  const remainingDaysInMode = useMemo(() => {
    if (viewMode === "day") return Math.max(new Date(year, month, 0).getDate() - today.getDate(), 0);
    if (viewMode === "month") return Math.max(12 - today.getMonth() - 1, 0);
    return remainingDaysYear;
  }, [viewMode, month, year, remainingDaysYear]);

  const periodLabel = viewMode === "month" ? "tháng" : "ngày";
  const remainingLabel = viewMode === "year" ? "Còn lại (năm)" : viewMode === "month" ? "Còn lại (tháng)" : "Còn lại (ngày)";
  const tbLabel = viewMode === "month" ? "TB cần/tháng" : "TB cần/ngày";

  const getEvalStatus = (pct: number) => {
    if (pct < elapsedPct - 5) return { label: "CHẬM TIẾN ĐỘ", bg: "#FEE2E2", text: "#DC2626", border: "#FECACA", icon: XCircle };
    if (pct > elapsedPct + 5) return { label: "VƯỢT KẾ HOẠCH", bg: "#ECFDF5", text: "#059669", border: "#A7F3D0", icon: CheckCircle2 };
    return { label: "ĐÚNG TIẾN ĐỘ", bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE", icon: CheckCircle };
  };

  const buildCard = (id: string, label: string, icon: any, actual: number, planDisplay: number, unit: string, iconColor: string, barColor: string) => {
    const pct = planDisplay > 0 ? Math.round((actual / planDisplay) * 1000) / 10 : 0;
    const status = pct < 90 ? "LAGGING" : pct > 105 ? "EXCEEDED" : "ON_TRACK";
    const statusCfg = status === "LAGGING" ? { label: "Chậm", dot: "bg-red-500", text: "text-red-500" } : status === "ON_TRACK" ? { label: "Đúng", dot: "bg-blue-500", text: "text-blue-600" } : { label: "Vượt", dot: "bg-green-500", text: "text-green-600" };
    const remaining = Math.max(planDisplay - actual, 0);
    const tbNeed = remainingDaysYear > 0 ? remaining / remainingDaysYear : 0;
    return { id, label, icon, actual, planDisplay, unit, pct, status, statusCfg, iconColor, barColor, remaining, tbNeed };
  };

  const kpiCards = [
    buildCard("lo_cho", "Sản lượng than", Container, loCho.actual, loCho.keHoachNam, "tấn", "#1a4980", "#1a4980"),
    buildCard("dao_lo", "Tiến độ đào lò", BoxSelect, daoLo.actual, daoLo.keHoachNam, "m", "#e67e22", "#e67e22"),
    buildCard("xen_lo", "Xén lò", Scissors, xenLo.actual, xenLo.keHoachNam, "m", "#10B981", "#10B981"),
    buildCard("doanh_thu", "Doanh thu", ChartBar, doanhThuActual, doanhThuPlan, "tỷ", "#7C3AED", "#7C3AED"),
    buildCard("tieu_thu", "Tiêu thụ", Droplets, tieuThuActual, tieuThuPlan, "tấn", "#0891B2", "#0891B2"),
  ];

  const planLabel = "Kế Hoạch Năm";

  const weatherDays = [
    { day: "T6", icon: Sun, temp: "32°/26°" },
    { day: "T7", icon: CloudSun, temp: "31°/25°" },
    { day: "CN", icon: CloudRain, temp: "30°/24°" },
    { day: "T2", icon: Sun, temp: "30°/24°" },
  ];

  // ─── Chart data ───────────────────────────────────────────────
  const pctFor = (type: string, mode: "day" | "month" | "year") => {
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
    { name: "Doanh Thu", Ngày: pctFor("doanh_thu" as any, "day"), Tháng: pctFor("doanh_thu" as any, "month"), Năm: pctFor("doanh_thu" as any, "year") },
    { name: "Tiêu Thụ", Ngày: pctFor("tieu_thu" as any, "day"), Tháng: pctFor("tieu_thu" as any, "month"), Năm: pctFor("tieu_thu" as any, "year") },
  ];

  // ─── Relative time helper ───
  function relativeTimeMobile(raw: string): string {
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
    if (min < 60) return `${min}p trước`;
    if (hr < 24) return `${hr}h trước`;
    if (day === 1) return "Hôm qua";
    if (day < 7) return `${day}d trước`;
    return `${dd}/${mm}/${yyyy}`;
  }

  function MiniBar({ pct, color, track }: { pct: number; color: string; track: string }) {
    const p = Math.min(100, Math.max(0, pct));
    return (
      <div className="w-full h-1 rounded-full mt-1" style={{ background: track }}>
        <div className="h-full rounded-full" style={{ width: `${p}%`, background: color }} />
      </div>
    );
  }

  function MetricMobile({ value, plan, unit, color }: { value: number; plan: number; unit: string; color: string }) {
    const pct = plan > 0 ? Math.min(100, Math.round((value / plan) * 100)) : 0;
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-baseline gap-0.5">
          <span className="text-xs font-bold" style={{ color }}>{fmtNum(Math.round(value))}</span>
          <span className="text-[8px] text-gray-300">{unit}</span>
        </div>
        <MiniBar pct={pct} color={color} track="#f3f4f6" />
        <span className="text-[8px] mt-0.5" style={{ color }}>{pct}%</span>
      </div>
    );
  }

  const khaiThacSites = (congTruongData?.khaiThac || []).map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong), originalTenCongTruong: s.tenCongTruong }));
  const daoLoSites = (congTruongData?.daoLo || []).map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong), originalTenCongTruong: s.tenCongTruong }));

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Báo cáo tổng quan" onRefresh={() => setRefreshTick(t => t + 1)} loading={loading} avatar="NA" />

      <div className="flex-1 overflow-y-auto" style={{ background: "#F2F4F7" }}>
        <div className="px-4 py-4 space-y-4 pb-6">
          {/* Weather */}
          <section className="rounded-2xl p-4 shadow-sm relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF6E5 0%, #FFECD2 100%)" }}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Sun size={40} className="text-yellow-500" />
                <div>
                  <div className="text-3xl font-bold text-gray-900 leading-none">31°C</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">Quảng Ninh</div>
                  <div className="text-xs text-gray-600">Trời nắng, oi nóng</div>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                {weatherDays.map(w => (
                  <div key={w.day} className="flex flex-col items-center">
                    <span className="text-[10px] font-semibold text-gray-700">{w.day}</span>
                    <w.icon size={16} className="text-yellow-500 my-0.5" />
                    <span className="text-[10px] text-gray-600">{w.temp}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Time + Remaining */}
          <section className="flex flex-wrap items-center justify-between bg-white rounded-xl py-2 px-3 shadow-sm text-xs text-gray-600 gap-2">
            <div className="flex items-center gap-1"><Clock size={12} /><span>Cập nhật: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span></div>
            <div className="flex items-center gap-1"><CalendarDays size={12} /><span>Còn lại: <strong>{remainingDaysYear} ngày</strong></span></div>
          </section>

          {/* Controls */}
          <section className="space-y-3">
            <div className="flex bg-white rounded-xl p-1 shadow-sm">
              {(["day", "month", "year"] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${viewMode === m ? "bg-indigo-50 text-indigo-600" : "text-gray-600"}`}>
                  {m === "day" ? "Ngày" : m === "month" ? "Tháng" : "Năm"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {viewMode === "day" && (
                <>
                  <select value={month} onChange={e => setMonth(Number(e.target.value))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium shadow-sm outline-none">
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                  </select>
                  <select value={year} onChange={e => setYear(Number(e.target.value))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium shadow-sm outline-none">
                    {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </>
              )}
              {(viewMode === "month" || viewMode === "year") && (
                <select value={year} onChange={e => setYear(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-medium shadow-sm outline-none">
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>Năm {y}</option>)}
                </select>
              )}
            </div>
          </section>

          {/* KPI Cards - Mobile: horizontal row layout */}
          <section className="flex flex-col gap-3 w-full">
            {kpiCards.map(card => (
              <div key={card.id}
                className="bg-white rounded-xl px-3 py-2.5 shadow-sm border-2 flex items-center gap-3"
                style={{ borderColor: card.barColor }}>
                {/* Left: Icon badge + label */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.iconColor + "15" }}>
                    <card.icon size={16} style={{ color: card.iconColor }} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase leading-tight w-14">{card.label}</span>
                </div>
                {/* Right: value + status */}
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <div className="min-w-0">
                    <div className="text-base font-black leading-tight" style={{ color: card.iconColor }}>
                      {loading ? "—" : fmtNum(Math.round(card.actual))} <span className="text-[9px] font-semibold text-gray-400">{card.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${card.statusCfg.dot}`} />
                      <span className={`text-[9px] font-bold ${card.statusCfg.text}`}>{card.statusCfg.label}</span>
                      <span className="text-[9px] text-gray-400">{card.pct}%</span>
                    </div>
                  </div>
                  <div className="w-12 shrink-0 ml-2">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, card.pct)}%`, background: card.iconColor }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Evaluation Table - Mobile: card list */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <ChartBar size={14} className="text-blue-600" />
                <h3 className="text-xs font-bold text-gray-800 uppercase">Đánh Giá Tiến Độ So Với Kế Hoạch Thời Gian</h3>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {kpiCards.map(s => {
                const es = getEvalStatus(s.pct);
                const EvalIcon = es.icon;
                return (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <s.icon size={14} style={{ color: s.iconColor }} />
                      <span className="text-[10px] font-medium text-gray-700">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold" style={{ color: s.iconColor }}>{s.pct}%</span>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border" style={{ background: es.bg, color: es.text, borderColor: es.border }}>
                        <EvalIcon size={8} />{es.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100">
              <p className="text-[9px] text-gray-400 italic">Tiến độ thời gian: ~{elapsedPct}% (tính đến ngày {today.toLocaleDateString("vi-VN")})</p>
            </div>
          </section>

          {/* Chart - Mobile */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 uppercase">So Sánh Tiến Độ (Ngày / Tháng / Năm)</h3>
            </div>
            <div className="p-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }} barGap={1} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} dy={4} />
                  <YAxis tick={{ fontSize: 8, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 11 }} />
                  <Bar dataKey="Ngày" fill="#93C5FD" radius={[2, 2, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="Tháng" fill="#3B82F6" radius={[2, 2, 0, 0]} maxBarSize={16} />
                  <Bar dataKey="Năm" fill="#1E40AF" radius={[2, 2, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#93C5FD" }}></span><span className="text-[9px] text-gray-500">Ngày</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#3B82F6" }}></span><span className="text-[9px] text-gray-500">Tháng</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#1E40AF" }}></span><span className="text-[9px] text-gray-500">Năm</span></div>
              </div>
            </div>
          </section>

          {/* Worksite Accordions */}
          <section className="space-y-3">
            {/* Khai thác */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button onClick={() => setKhaiThacOpen(!khaiThacOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 transition-colors border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                    <HardHat size={13} className="text-amber-600" />
                  </span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Công trường Khai thác</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${khaiThacOpen ? "rotate-180" : ""}`} />
              </button>
              {khaiThacOpen && (
                <div className="overflow-x-auto">
                  {loadingCongTruong ? (
                    <div className="text-center text-xs text-gray-400 py-6">Đang tải...</div>
                  ) : khaiThacSites.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 py-6">Chưa có dữ liệu</div>
                  ) : (
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                          <th className="px-3 py-2 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Công trường</th>
                          <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#004ac6" }}>Tấn than</th>
                          <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-right border-l border-gray-200" style={{ color: "#9d4300" }}>Mét đào lò</th>
                          <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-right border-l border-gray-200" style={{ color: "#006242" }}>Mét xén</th>
                          <th className="px-3 py-2 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {khaiThacSites.map((site, idx) => (
                          <tr key={site.tenCongTruong} onClick={() => setCongTruongModalOpen({ site, type: "khai_thac" })}
                            className={`cursor-pointer transition-colors hover:bg-blue-50/30 ${idx % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                                  <HardHat size={9} className="text-orange-500" />
                                </span>
                                <span className="text-[11px] font-semibold text-gray-900">{site.tenCongTruong}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5"><MetricMobile value={site.lo_cho} plan={congTruongData?.keHoachThang?.lo_cho || 0} unit="tấn" color="#2563EB" /></td>
                            <td className="px-3 py-2.5 border-l border-gray-200"><MetricMobile value={site.dao_lo} plan={congTruongData?.keHoachThang?.dao_lo || 0} unit="m" color="#F59E0B" /></td>
                            <td className="px-3 py-2.5 border-l border-gray-200"><MetricMobile value={site.xen_lo} plan={congTruongData?.keHoachThang?.xen_lo || 0} unit="m" color="#10B981" /></td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <Clock size={9} />
                                <span>{relativeTimeMobile(site.thoiGianBaoCao)}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            {/* Đào lò */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button onClick={() => setDaoLoOpen(!daoLoOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                    <HardHat size={13} className="text-blue-600" />
                  </span>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Công trường Đào lò</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${daoLoOpen ? "rotate-180" : ""}`} />
              </button>
              {daoLoOpen && (
                <div className="overflow-x-auto">
                  {loadingCongTruong ? (
                    <div className="text-center text-xs text-gray-400 py-6">Đang tải...</div>
                  ) : daoLoSites.length === 0 ? (
                    <div className="text-center text-xs text-gray-400 py-6">Chưa có dữ liệu</div>
                  ) : (
                    <table className="w-full text-left min-w-[420px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                          <th className="px-3 py-2 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Công trường</th>
                          <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#9d4300" }}>Mét đào lò</th>
                          <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-right border-l border-gray-200" style={{ color: "#006242" }}>Mét xén</th>
                          <th className="px-3 py-2 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daoLoSites.map((site, idx) => (
                          <tr key={site.tenCongTruong} onClick={() => setCongTruongModalOpen({ site, type: "dao_lo" })}
                            className={`cursor-pointer transition-colors hover:bg-blue-50/30 ${idx % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                                  <HardHat size={9} className="text-blue-600" />
                                </span>
                                <span className="text-[11px] font-semibold text-gray-900">{site.tenCongTruong}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5"><MetricMobile value={site.dao_lo} plan={congTruongData?.keHoachThang?.dao_lo || 0} unit="m" color="#F59E0B" /></td>
                            <td className="px-3 py-2.5 border-l border-gray-200"><MetricMobile value={site.xen_lo} plan={congTruongData?.keHoachThang?.xen_lo || 0} unit="m" color="#10B981" /></td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <Clock size={9} />
                                <span>{relativeTimeMobile(site.thoiGianBaoCao)}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-3">
            <p className="text-[10px] text-gray-400">Dữ liệu được cập nhật định kỳ tự động</p>
            <div className="w-1/3 h-0.5 bg-black rounded-full mx-auto mt-3" />
          </footer>
        </div>
      </div>

      {/* Modal chi tiết công trường */}
      {congTruongModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center" onClick={() => setCongTruongModalOpen(null)}>
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()} style={{ animation: "m-slideUp 0.32s cubic-bezier(0.32,0.72,0,1)" }}>
            <div className="flex justify-center py-3"><div className="w-9 h-1 rounded-full bg-gray-200" /></div>
            <div className="px-5 pb-3 border-b border-gray-200">
              <h2 className="font-bold text-gray-900 text-lg">Chi tiết: {congTruongModalOpen.site.tenCongTruong}</h2>
              <p className="text-xs text-gray-500 mt-1">Tháng {month}/{year}</p>
            </div>
            <div className="p-5">
              {loadingCongTruongChiTiet ? (
                <div className="text-center py-6 text-sm text-gray-500">Đang tải...</div>
              ) : !congTruongChiTiet ? (
                <div className="text-center py-6 text-sm text-gray-400">Không có dữ liệu chi tiết.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    const site = congTruongModalOpen.site;
                    const items = congTruongModalOpen.type === "khai_thac"
                      ? [
                          { label: "Tấn than", value: site.lo_cho, unit: "tấn", color: "#2563EB" },
                          { label: "Mét đào lò", value: site.dao_lo, unit: "mét", color: "#F59E0B" },
                          { label: "Mét xén", value: site.xen_lo, unit: "mét", color: "#8B5CF6" },
                          { label: "Mét chống đội", value: site.chong_doi, unit: "mét", color: "#EF4444" },
                        ]
                      : [
                          { label: "Mét đào lò", value: site.dao_lo, unit: "mét", color: "#F59E0B" },
                          { label: "Mét xén", value: site.xen_lo, unit: "mét", color: "#8B5CF6" },
                          { label: "Mét chống đội", value: site.chong_doi, unit: "mét", color: "#EF4444" },
                        ];
                    return items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                        <div className="text-2xl font-black text-gray-900 leading-none">
                          {fmtNum(Math.round(item.value))}<span className="text-xs font-bold ml-1 opacity-60">{item.unit}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            <button onClick={() => setCongTruongModalOpen(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-lg"><X size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
