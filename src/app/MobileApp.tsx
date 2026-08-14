// ─────────────────────────────────────────────────────────────────────────────
// MobileApp.tsx
// Giao diện mobile (auto-render khi useDeviceDetect() === true) của Production
// Management System. Cùng backend, cùng API endpoints với DesktopApp.tsx.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { TabId } from './types';
import { BottomNav, C } from './components/mobile';

// ─── Screen Components ─────────────────────────────────────────
import MobileOverviewScreen from './screens/MobileOverviewScreen';
import MobileDetailScreen from './screens/MobileDetailScreen';
import MobileSubmitScreen from './screens/MobileSubmitScreen';
import MobileHistoryScreen from './screens/MobileHistoryScreen';
import MobileAlertScreen from './screens/MobileAlertScreen';

// ─── Root MobileApp ────────────────────────────────────────────
export default function MobileApp() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="mobile-frame mobile-shell">
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {tab === "overview" && <MobileOverviewScreen onNav={setTab} />}
        {tab === "detail" && <MobileDetailScreen onNav={setTab} />}
        {tab === "submit" && <MobileSubmitScreen onNav={setTab} />}
        {tab === "history" && <MobileHistoryScreen />}
        {tab === "alerts" && <MobileAlertScreen />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}