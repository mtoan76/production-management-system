import * as React from 'react';
import { useState, useEffect, createElement, Component, ErrorInfo, ReactNode } from "react";
import {
  BarChart2, Upload, Bell, List, History, LogOut, ChevronLeft, ChevronRight,
  Layers, FileText,
} from "lucide-react";
import MobileApp from "./MobileApp";
import { useDeviceDetect } from "./hooks/useDeviceDetect";
import { N8N_CANH_BAO_LIST_URL } from './utils/constants';
import { Screen } from './types';

// ─── Screen Components ─────────────────────────────────────────
import UploadScreen from './screens/UploadScreen';
import OverviewScreen from './screens/OverviewScreen';
import DetailScreen from './screens/DetailScreen';
import HistoryScreen from './screens/HistoryScreen';
import AlertScreen from './screens/AlertScreen';

// ─── Sidebar ───────────────────────────────────────────────────
function Sidebar({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavButton = ({ id, label, icon: Icon, isActive }: { id: Screen; label: string; icon: any; isActive: boolean }) => (
    <button
      onClick={() => onNav(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left relative ${
        isActive ? "text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
      style={isActive ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)" } : {}}
      title={isCollapsed ? label : undefined}
    >
      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-white/60 block" />}
      <Icon size={18} className="flex-shrink-0" />
      {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
    </button>
  );

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? "w-[72px]" : "w-[260px]"}`}
      style={{ background: "#0F172A" }}
    >
      {/* Brand - Ảnh 2: Avatar "N" xanh dương, "Núi Béo", "Hệ thống quản lý sản xuất" */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-base"
          style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
        >
          N
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Núi Béo</p>
            <p className="text-[11px] leading-tight mt-0.5 truncate" style={{ color: "#94A3B8" }}>Hệ thống quản lý sản xuất</p>
          </div>
        )}
      </div>

      {/* Nav - Ảnh 2: 5 items với text mới */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <NavButton id="overview" label="Báo cáo tổng quan" icon={BarChart2} isActive={active === "overview"} />
        <NavButton id="detail" label="Báo cáo chi tiết" icon={List} isActive={active === "detail"} />
        <NavButton id="input" label="Nhập báo cáo mới" icon={Upload} isActive={active === "input"} />
        <NavButton id="history" label="Lịch sử báo cáo" icon={History} isActive={active === "history"} />
        <NavButton id="alerts" label="Trung tâm cảnh báo" icon={Bell} isActive={active === "alerts"} />
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Thu gọn</span></>}
        </button>
      </div>

      {/* User - Ảnh 2: Avatar "NA", "Nguyễn Văn A", Logout */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : "px-2"}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff" }}
          >
            NA
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">Nguyễn Văn A</p>
                <p className="text-[10px] text-slate-500 truncate">Quản trị viên</p>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors" title="Đăng xuất">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── App root (Desktop) ───────────────────────────────────────
const SCREEN_STORAGE_KEY = "pms_active_screen";
const VALID_SCREENS: Screen[] = ["input", "history", "overview", "detail", "alerts"];

function DesktopApp() {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = sessionStorage.getItem(SCREEN_STORAGE_KEY);
      if (saved && (VALID_SCREENS as string[]).includes(saved)) {
        return saved as Screen;
      }
    } catch {}
    return "overview";
  });
  const [pendingAlertId, setPendingAlertId] = useState<number | null>(null);
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_STORAGE_KEY, screen);
    } catch {}
  }, [screen]);

  useEffect(() => {
    let cancelled = false;
    async function loadCritical() {
      try {
        const res = await fetch(`${N8N_CANH_BAO_LIST_URL}?severity=${encodeURIComponent("Nghiêm trọng")}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const list: any[] = Array.isArray(data?.data) ? data.data : [];
        const open = list.filter((a: any) => a.trang_thai !== "Đã hoàn thành");
        setCriticalAlertCount(open.length);
      } catch {}
    }
    loadCritical();
    const interval = setInterval(loadCritical, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const goToAlert = (alertId: number) => {
    setPendingAlertId(alertId);
    setScreen("alerts");
  };

  const handleNav = (s: Screen) => {
    setPendingAlertId(null);
    setScreen(s);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter',sans-serif", background: "#F4F6F9" }}>
      <Sidebar active={screen} onNav={handleNav} />
      <main className="flex-1 overflow-auto min-w-0">
        {screen === "input" && <UploadScreen onNavigate={handleNav} />}
        {screen === "history" && <HistoryScreen />}
        {screen === "overview" && <OverviewScreen onOpenAlert={goToAlert} />}
        {screen === "detail" && <DetailScreen />}
        {screen === "alerts" && <AlertScreen initialAlertId={pendingAlertId} />}
      </main>
    </div>
  );
}

// ─── ErrorBoundary ────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", { className: "p-8 bg-red-50 border border-red-200 rounded-xl m-4" },
        React.createElement("h2", { className: "text-red-700 text-lg font-bold mb-2" }, "Đã xảy ra lỗi"),
        React.createElement("pre", { className: "text-red-600 text-xs whitespace-pre-wrap overflow-auto max-h-96" },
          (this.state.error?.message || "Unknown error") + "\n\n" + (this.state.error?.stack || "")
        ),
        React.createElement("button", {
          className: "mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold",
          onClick: () => { this.setState({ hasError: false, error: null }); window.location.reload(); }
        }, "Tải lại trang")
      );
    }
    return this.props.children;
  }
}

// ─── App root (auto-detect thiết bị) ──────────────────────────
export default function App() {
  const isMobile = useDeviceDetect();
  return <ErrorBoundary>{isMobile ? <MobileApp /> : <DesktopApp />}</ErrorBoundary>;
}