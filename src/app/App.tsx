import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,AreaChart, Area,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Upload, Bell, BarChart2, List, AlertTriangle, CheckCircle,
  Info, Search, X, Eye, Clock, MapPin, User, LogOut,
  AlertCircle, TrendingUp, ChevronLeft, ChevronRight,
  Layers, XCircle,Loader2, Download
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────
type Screen = "input" | "overview" | "detail" | "alerts";
type AlertTab = "all" | "critical" | "warning" | "normal";
type StatusType = "Bình thường" | "Cảnh báo" | "Nghiêm trọng" | "Không sản xuất";
type SeverityType = "Nghiêm trọng" | "Cảnh báo" | "Bình thường";
type AlertStatus = "Đang xử lý" | "Chờ tiếp nhận" | "Đã hoàn thành";

// ─── Daily chart data (no cumulative) ────────────────────
const DAILY_PRODUCTION = [
  { day: "T1", value: 1250 },
  { day: "T2", value: 980 },
  { day: "T3", value: 1420 },
  { day: "T4", value: 1180 },
  { day: "T5", value: 890 },
  { day: "T6", value: 1350 },
  { day: "T7", value: 1100 },
];
const DAILY_PROGRESS = [
  { day: "T1", value: 85 },
  { day: "T2", value: 62 },
  { day: "T3", value: 94 },
  { day: "T4", value: 78 },
  { day: "T5", value: 45 },
  { day: "T6", value: 88 },
  { day: "T7", value: 71 },
];

// ─── Tunnel / detail data ─────────────────────────────────
const TUNNEL_DATA = [
  { id: 1, name: "Lò 101 – Vận tải",   area: "Khu vực cửa lò",       production: "850 tấn",   pct: "94% kế hoạch", time: "10:45 AM", status: "Bình thường" as StatusType },
  { id: 2, name: "Lò 102 – Cung cấp",  area: "Khu vực cửa lò",       production: "720 tấn",   pct: "90% kế hoạch", time: "10:42 AM", status: "Bình thường" as StatusType },
  { id: 3, name: "Lò Chợ I-10-5",      area: "Diện khai thác chính", production: "1.240 tấn", pct: "83% kế hoạch", time: "10:48 AM", status: "Nghiêm trọng" as StatusType },
  { id: 4, name: "Lò Chợ I-10-6",      area: "Diện khai thác chính", production: "1.180 tấn", pct: "84% kế hoạch", time: "10:30 AM", status: "Bình thường" as StatusType },
  { id: 5, name: "Đường hối 201",       area: "Hệ thống thông gió",   production: "Không sản xuất", pct: "", time: "10:50 AM", status: "Cảnh báo" as StatusType },
  { id: 6, name: "Lò Chợ I-10-7",      area: "Diện khai thác chính", production: "1.150 tấn", pct: "92% kế hoạch", time: "10:25 AM", status: "Bình thường" as StatusType },
  { id: 7, name: "Đường hối 202",       area: "Hệ thống thông gió",   production: "Không sản xuất", pct: "", time: "10:20 AM", status: "Bình thường" as StatusType },
  { id: 8, name: "Lò 103 – Vận tải",   area: "Khu vực cửa lò",       production: "680 tấn",   pct: "85% kế hoạch", time: "10:15 AM", status: "Cảnh báo" as StatusType },
  { id: 9, name: "Lò Chợ I-10-8",      area: "Diện khai thác chính", production: "1.320 tấn", pct: "98% kế hoạch", time: "10:10 AM", status: "Bình thường" as StatusType },
];

const UNIT_CHART_DATA: Record<string, { production: {day:string;value:number}[]; progress: {day:string;value:number}[] }> = {
  "Lò 101 – Vận tải": {
    production: [{ day:"T1",value:750 },{ day:"T2",value:820 },{ day:"T3",value:890 },{ day:"T4",value:810 },{ day:"T5",value:780 },{ day:"T6",value:870 },{ day:"T7",value:850 }],
    progress:   [{ day:"T1",value:11 },{ day:"T2",value:13 },{ day:"T3",value:15 },{ day:"T4",value:12 },{ day:"T5",value:10 },{ day:"T6",value:14 },{ day:"T7",value:13 }],
  },
  "Lò Chợ I-10-5": {
    production: [{ day:"T1",value:1100 },{ day:"T2",value:980 },{ day:"T3",value:1300 },{ day:"T4",value:1180 },{ day:"T5",value:900 },{ day:"T6",value:1250 },{ day:"T7",value:1240 }],
    progress:   [{ day:"T1",value:8 },{ day:"T2",value:6 },{ day:"T3",value:10 },{ day:"T4",value:9 },{ day:"T5",value:5 },{ day:"T6",value:11 },{ day:"T7",value:9 }],
  },
};

// Dữ liệu giả lập cho biểu đồ trong Modal chi tiết (3.1.png)
const CHART_DATA = [
  { date: "10/10", prod: 200,  prog: 15 },
  { date: "11/10", prod: 450,  prog: 32 },
  { date: "12/10", prod: 780,  prog: 50 },
  { date: "13/10", prod: 1100, prog: 71 },
  { date: "14/10", prod: 1320, prog: 85 },
  { date: "15/10", prod: 1440, prog: 92 },
];

// ─── Alert data ───────────────────────────────────────────
type Assignee = { initials: string; color: string; name: string } | null;
const ALERT_DATA: {
  id: number; time: string; date: string; location: string; content: string;
  severity: SeverityType; status: AlertStatus; assignee: Assignee; description: string;
}[] = [
  { id:1, time:"14:22:15", date:"15/10/2023", location:"Lò thượng – Via 14",        content:"Nồng độ khí CH4 vượt mức",                     severity:"Nghiêm trọng", status:"Đang xử lý",    assignee:{ initials:"HP", color:"#047857", name:"Hoàng Văn Phong" }, description:"Nồng độ khí CH4 tại gương lò Lò thượng – Via 14 ghi nhận giá trị 1.8%, vượt mức cho phép 1.5%. Cần sơ tán nhân lực ngay lập tức và kiểm tra hệ thống thông gió." },
  { id:2, time:"13:50:02", date:"15/10/2023", location:"Đường lò vận tải 2",         content:"Băng tải số 3 quá nhiệt",                      severity:"Cảnh báo",     status:"Chờ tiếp nhận", assignee:null, description:"Nhiệt độ động cơ băng tải số 3 trên đường lò vận tải 2 đạt 85°C, vượt ngưỡng cảnh báo 80°C. Cần kiểm tra và bôi trơn hệ thống truyền động." },
  { id:3, time:"11:15:30", date:"15/10/2023", location:"Via 12 – Tây mỏ",            content:"Mất kết nối cảm biến áp suất",                 severity:"Cảnh báo",     status:"Đã hoàn thành", assignee:{ initials:"LN", color:"#1D4ED8", name:"Lê Nam" }, description:"Cảm biến áp suất thủy lực tại chân lò Via 12 mất kết nối lúc 11:15. Đã kiểm tra và khôi phục kết nối thành công. Theo dõi tiếp trong 24h." },
  { id:4, time:"10:05:00", date:"15/10/2023", location:"Trạm phát điện 1",           content:"Cập nhật phần mềm hệ thống định kỳ",           severity:"Bình thường",  status:"Đã hoàn thành", assignee:{ initials:"TV", color:"#7C3AED", name:"Trần Văn A" }, description:"Hoàn thành cập nhật phần mềm SCADA phiên bản 4.2.1. Hệ thống hoạt động bình thường sau khi khởi động lại." },
  { id:5, time:"09:40:12", date:"15/10/2023", location:"Phân xưởng Khai thác 5",     content:"Áp lực thông gió giảm nhẹ",                    severity:"Nghiêm trọng", status:"Chờ tiếp nhận", assignee:null, description:"Hệ thống đo áp lực tại gương lò Phân xưởng Khai thác 5 ghi nhận giá trị 18 Pa, thấp hơn mức tối thiểu quy định 25 Pa. Nguyên nhân nghi do quạt thông gió phụ số 2 bị sự cố. Cần kiểm tra và khởi động lại quạt. Tạm thời dừng tất cả hoạt động nổ mìn cho đến khi áp lực được phục hồi." },
  { id:6, time:"08:22:55", date:"15/10/2023", location:"Trạm bơm nước B3",           content:"Mức nước hầm vượt mức cấp 2",                  severity:"Cảnh báo",     status:"Đang xử lý",    assignee:{ initials:"NT", color:"#DC2626", name:"Nguyễn Thành" }, description:"Mức nước tại hầm bơm B3 đạt cấp độ 2 (85% dung tích). Máy bơm số 2 đã được kích hoạt bổ sung. Theo dõi liên tục mỗi 30 phút." },
  { id:7, time:"07:15:20", date:"15/10/2023", location:"Cổng ra sản phẩm",           content:"Kiểm tra cảm biến bụi",                        severity:"Bình thường",  status:"Đã hoàn thành", assignee:{ initials:"HV", color:"#047857", name:"Hoàng Văn" }, description:"Kiểm tra định kỳ cảm biến bụi tại cổng ra sản phẩm. Kết quả trong mức cho phép. Làm sạch bộ lọc và hiệu chỉnh thiết bị." },
];

const OVERVIEW_ALERTS = [
  { id:"01", alertId:1, location:"Khu vực Lò thượng",       content:"Nồng độ khí CH4 vượt mức cho phép (>1.5%) tại gương lò", type:"Nghiêm trọng" as SeverityType, status:"Đang xử lý" as AlertStatus },
  { id:"02", alertId:5, location:"Phân xưởng Khai thác 5",  content:"Áp lực thông gió giảm dưới mức tối thiểu tại gương lò", type:"Nghiêm trọng" as SeverityType, status:"Chờ tiếp nhận" as AlertStatus },
  { id:"03", alertId:2, location:"Đường lò vận tải số 2",   content:"Băng tải số 3 có dấu hiệu quá nhiệt động cơ chính",     type:"Cảnh báo" as SeverityType,     status:"Chờ tiếp nhận" as AlertStatus },
  { id:"04", alertId:3, location:"Via 12 – Tây mỏ",          content:"Mất kết nối cảm biến áp suất thủy lực chân lò",         type:"Cảnh báo" as SeverityType,     status:"Đã hoàn thành" as AlertStatus },
  { id:"05", alertId:6, location:"Trạm bơm nước ngầm B3",   content:"Mức nước hầm vượt cảnh báo cấp 2",                       type:"Cảnh báo" as SeverityType,     status:"Đang xử lý" as AlertStatus },
];

// ─── Config maps ──────────────────────────────────────────
const SEVERITY_CFG: Record<SeverityType, { dot: string; badge: string; textColor: string }> = {
  "Nghiêm trọng": { dot:"bg-red-500",    badge:"bg-red-50 border border-red-200",    textColor:"text-red-700" },
  "Cảnh báo":     { dot:"bg-yellow-500", badge:"bg-yellow-50 border border-yellow-200", textColor:"text-yellow-700" },
  "Bình thường":  { dot:"bg-green-500",  badge:"bg-green-50 border border-green-200",  textColor:"text-green-700" },
};

const ALERT_STATUS_CFG: Record<AlertStatus, { badge: string; textColor: string }> = {
  "Đang xử lý":    { badge:"bg-blue-50 border border-blue-200",   textColor:"text-blue-700" },
  "Chờ tiếp nhận": { badge:"bg-gray-100 border border-gray-200",  textColor:"text-gray-600" },
  "Đã hoàn thành": { badge:"bg-green-50 border border-green-200", textColor:"text-green-700" },
};

const TAB_SEVERITY: Record<AlertTab, SeverityType | null> = {
  all: null, critical:"Nghiêm trọng", warning:"Cảnh báo", normal:"Bình thường",
};

// ─── Custom tooltips ──────────────────────────────────────
const TT_BOX: React.CSSProperties = {
  background:"#fff", borderRadius:8, padding:"8px 12px",
  boxShadow:"0 4px 20px rgba(0,0,0,0.12)", fontSize:12, color:"#191c1e",
  whiteSpace:"nowrap", border:"1px solid rgba(0,0,0,0.06)",
};

const ProductionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_BOX}>
      <div style={{ color:"#94A3B8", marginBottom:3 }}>{label}</div>
      <div>Sản lượng: <strong>{payload[0].value.toLocaleString("vi-VN")}</strong> tấn</div>
    </div>
  );
};

const ProgressTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_BOX}>
      <div style={{ color:"#94A3B8", marginBottom:3 }}>{label}</div>
      <div>Tiến độ: <strong>{payload[0].value}</strong> mét</div>
    </div>
  );
};

// ─── Shared badge components ──────────────────────────────
function SeverityBadge({ severity }: { severity: SeverityType }) {
  const cfg = SEVERITY_CFG[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {severity}
    </span>
  );
}

function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const cfg = ALERT_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge} ${cfg.textColor}`}>
      {status}
    </span>
  );
}

function StatusDotBadge({ status }: { status: StatusType }) {
  if (status === "Không sản xuất") {
    return <span className="text-xs text-gray-400 italic">Không sản xuất</span>;
  }
  const map: Record<string, { dot: string; text: string }> = {
    "Bình thường":  { dot:"bg-green-500",  text:"text-green-700" },
    "Cảnh báo":     { dot:"bg-yellow-500", text:"text-yellow-700" },
    "Nghiêm trọng": { dot:"bg-red-500",    text:"text-red-700" },
  };
  const c = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {status}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────
const NAV: { id: Screen; label: string; Icon: any }[] = [
  { id:"input",    label:"Nhập báo cáo mới",   Icon: Upload },
  { id:"overview", label:"Báo cáo tổng quan",  Icon: BarChart2 },
  { id:"detail",   label:"Báo cáo chi tiết",   Icon: List },
  { id:"alerts",   label:"Trung tâm cảnh báo", Icon: Bell },
];

function Sidebar({ active, onNav }: { active: Screen; onNav:(s:Screen)=>void }) {
  const criticalCount = ALERT_DATA.filter(a => a.severity === "Nghiêm trọng" && a.status !== "Đã hoàn thành").length;
  return (
    <aside className="w-[210px] flex-shrink-0 flex flex-col h-full" style={{ background:"#0F172A" }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-base" style={{ background:"#2563EB", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          N
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Núi Béo</p>
          <p className="text-[11px] leading-tight mt-0.5" style={{ color:"#D8DADC" }}>Hệ thống quản lý sản xuất</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {NAV.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left relative"
              style={{
                background: isActive ? "#2563EB" : "transparent",
                color: isActive ? "#fff" : "#BEC6E0",
                whiteSpace: "nowrap",
              }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-white/40 block" />
              )}
              <Icon size={15} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {id === "alerts" && criticalCount > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: isActive ? "rgba(255,255,255,0.25)" : "#DC2626", color:"#fff" }}>
                  {criticalCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-5 border-t pt-4" style={{ borderColor:"rgba(196,197,215,0.2)" }}>
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background:"#ECEEF0", color:"#191c1e" }}>
            NA
          </div>
          <span className="flex-1 text-xs font-medium min-w-0 truncate" style={{ color:"#BEC6E0" }}>Nguyễn Văn A</span>
          <button className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// URL webhook n8n — dùng biến môi trường nếu có, mặc định trỏ vào webhook production (không có "-test")
const N8N_WEBHOOK_URL =
  (import.meta as any)?.env?.VITE_N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/luu-bao-cao";

type SubmitStatus = "idle" | "processing" | "success" | "error";

// ─── Overlay: đang xử lý / thành công / lỗi ────────────────
function SubmitOverlay({
  status,
  errorMessage,
  onClose,
  onNavigate,
}: {
  status: SubmitStatus;
  errorMessage: string;
  onClose: () => void;
  onNavigate: (s: Screen) => void;
}) {
  if (status === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.45)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-[420px] max-w-[90vw] p-8 flex flex-col items-center text-center">
        {status === "processing" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#EFF6FF" }}>
              <Loader2 size={30} color="#2563EB" className="animate-spin" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đang xử lý dữ liệu báo cáo...
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hệ thống đang gửi báo cáo lên n8n để trích xuất và phân tích dữ liệu. Vui lòng chờ trong giây lát.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#ECFDF5" }}>
              <CheckCircle size={30} color="#059669" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đã xử lý xong báo cáo!
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Dữ liệu đã được lưu và phân tích thành công. Bạn có thể xem kết quả chi tiết ở các mục bên dưới.
            </p>

            <div className="flex flex-col gap-2 w-full mt-6">
              <button
                onClick={() => onNavigate("overview")}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "#2563EB" }}
              >
                <BarChart2 size={15} />
                Xem báo cáo tổng quan
              </button>
              <button
                onClick={() => onNavigate("detail")}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <List size={15} />
                Xem báo cáo chi tiết
              </button>
            </div>

            <button onClick={onClose} className="text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors">
              Đóng và nhập báo cáo khác
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#FEF2F2" }}>
              <XCircle size={30} color="#DC2626" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Gửi báo cáo thất bại
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{errorMessage}</p>
            <button
              onClick={onClose}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#2563EB" }}
            >
              Thử lại
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Screen 1: Input ──────────────────────────────────────
function InputScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmitReport = async () => {
    // Kiểm tra nếu người dùng chưa nhập gì cả thì cảnh báo
    if (!file && !text.trim()) {
      alert("Vui lòng tải lên tệp hoặc nhập nội dung báo cáo!");
      return;
    }

    // 1. Tạo đối tượng FormData để chứa cả File lẫn Text
    const formData = new FormData();

    if (file) {
      formData.append("file", file); // Đính kèm file excel/ảnh
    }
    if (text.trim()) {
      formData.append("report_text", text); // Đính kèm nội dung text
    }

    setStatus("processing");

    try {
      // 2. Gọi API webhook n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: formData, // Truyền trực tiếp formData (Trình duyệt sẽ tự cấu hình Header multipart/form-data)
      });

      if (response.ok) {
        // Đợi n8n trả về kết quả xử lý (workflow nên chạy xong rồi mới response)
        await response.json().catch(() => null);
        setStatus("success");
        // Reset lại form sau khi gửi xong
        setFile(null);
        setText("");
      } else {
        setErrorMessage(`Server n8n trả về lỗi (mã ${response.status}). Vui lòng kiểm tra workflow.`);
        setStatus("error");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMessage("Không thể kết nối đến Backend n8n. Kiểm tra n8n đã bật (Active) và đúng URL webhook chưa.");
      setStatus("error");
    }
  };

  const closeOverlay = () => setStatus("idle");

  // Tải về file Excel mẫu gốc (đặt sẵn trong thư mục public/templates của project)
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/Report_Template.xlsx";
    link.download = "Report_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <SubmitOverlay status={status} errorMessage={errorMessage} onClose={closeOverlay} onNavigate={onNavigate} />

      <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Nhập báo cáo mới
      </h1>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left: Upload */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <Upload size={15} color="#2563EB" />
            <span className="text-sm font-semibold text-gray-700">Tải lên tệp</span>
            <span className="text-xs text-gray-400 ml-1">Excel, ảnh chụp</span>
            <button
              onClick={handleDownloadTemplate}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Download size={13} />
              Tải template mẫu
            </button>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 m-4 rounded-xl transition-colors cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? "#2563EB" : "#D1D5DB"}`,
              background: dragging ? "#EFF6FF" : "transparent",
            }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background:"#EFF6FF" }}>
              <Upload size={24} color="#2563EB" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">Kéo &amp; thả tệp vào đây</p>
              <p className="text-xs text-gray-400 mt-1">hoặc nhấn để chọn từ máy tính</p>
              {file && <p className="text-xs text-blue-600 font-medium mt-2">{file.name}</p>}
            </div>
            <button
              onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background:"#2563EB", whiteSpace:"nowrap" }}
            >
              Chọn tệp
            </button>
            <p className="text-xs text-gray-400">.JPG &nbsp;•&nbsp; .PNG &nbsp;•&nbsp; .XLSX &nbsp;•&nbsp; .CSV — tối đa 25MB</p>
            <input ref={fileRef} type="file" className="hidden" accept=".jpg,.png,.xlsx,.csv" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>

        {/* Right: Textarea */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <List size={15} color="#2563EB" />
            <span className="text-sm font-semibold text-gray-700">Báo cáo</span>
          </div>
          <div className="flex-1 flex flex-col p-4">
            <textarea
              className="flex-1 resize-none text-sm text-gray-700 outline-none leading-relaxed placeholder-gray-300"
              placeholder="Nhập nội dung báo cáo..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            {/* Đã xóa dòng <p>Nhập bất kỳ nội dung nào...</p> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* Thay đổi `justify-between` thành `justify-end gap-3` để hai nút nằm cạnh nhau ở góc phải */}
      <div className="flex items-center justify-end gap-3 mt-5 pt-5 border-t border-gray-200">
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ whiteSpace:"nowrap" }}
          onClick={() => { setFile(null); setText(""); }}
        >
          Hủy
        </button>
        <button
          onClick={handleSubmitReport}
          disabled={status === "processing"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background:"#2563EB", whiteSpace:"nowrap" }}
        >
          {status === "processing" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {status === "processing" ? "Đang gửi..." : "Lưu báo cáo"}
        </button>
      </div>
    </div>
  );
}

// ─── DỮ LIỆU BÁO CÁO LŨY KẾ MỚI ────────────────────────
const OVERVIEW_CUMULATIVE_PROD = [
  { day: "T1", value: 2500 },
  { day: "T2", value: 3200 },
  { day: "T3", value: 4100 },
  { day: "T4", value: 5500 },
  { day: "T5", value: 15349 },
];
const OVERVIEW_CUMULATIVE_PROG = [
  { day: "T1", value: 200 },
  { day: "T2", value: 300 },
  { day: "T3", value: 450 },
  { day: "T4", value: 600 },
  { day: "T5", value: 720 },
];

const CustomBarLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text x={x + width / 2} y={y - 12} fill="#2563EB" textAnchor="middle" fontSize={11} fontWeight="bold">
      {value.toLocaleString("vi-VN")} tấn
    </text>
  );
};

const CustomLineLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x} y={y - 12} fill="#EA580C" textAnchor="middle" fontSize={11} fontWeight="bold">
      {value} mét
    </text>
  );
};

// ─── Screen 2: Overview ───────────────────────────────────
function OverviewScreen({ onOpenAlert }: { onOpenAlert: (alertId: number) => void }) {
  const ALERTS_PER_PAGE = 3;
  const [alertPage, setAlertPage] = useState(1);
  const totalAlertPages = Math.max(1, Math.ceil(OVERVIEW_ALERTS.length / ALERTS_PER_PAGE));
  const pagedOverviewAlerts = OVERVIEW_ALERTS.slice(
    (alertPage - 1) * ALERTS_PER_PAGE,
    alertPage * ALERTS_PER_PAGE
  );

  return (
    <div className="p-8 flex flex-col gap-6 min-h-screen overflow-y-auto bg-[#F8FAFC]">
      <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Báo cáo tổng quan
      </h1>
      
      {/* KPI cards + charts (ĐÃ TĂNG CHIỀU CAO LÊN ~4/3 LẦN) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card 1: Sản lượng lũy kế */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 pb-4 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">SẢN LƯỢNG LŨY KẾ</p>
              <p className="text-[11px] text-gray-400 mt-1">Cập nhật: 10:45 AM, Hôm nay</p>
              <div className="mt-3">
                <span className="text-2xl font-black text-gray-900 tracking-tight">15,349</span>
                <span className="text-gray-400 text-xs font-semibold ml-1">/ 17,280 tấn</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200/70 rounded-2xl px-4 py-2.5 text-center min-w-[110px] shadow-sm">
              <span className="block text-3xl font-black text-[#2563EB] tracking-tight leading-none">88.8%</span>
              <span className="block text-[10px] font-bold text-[#2563EB]/80 uppercase tracking-wider mt-1.5">Kế hoạch</span>
            </div>
          </div>
          
          {/* Tăng chiều cao h-[180px] -> h-[250px] giúp biểu đồ cột cao, thoáng và rõ ràng hơn */}
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OVERVIEW_CUMULATIVE_PROD} margin={{ top: 25, right: 20, left: 20, bottom: 5 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={5} />
                <Tooltip cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                <Bar 
                  dataKey="value" 
                  fill="#2563EB" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  label={({ x, y, width, value }) => (
                    <text x={x + width / 2} y={y - 10} fill="#2563EB" textAnchor="middle" fontSize={11} fontWeight="700">
                      {value.toLocaleString("vi-VN")} tấn
                    </text>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Tiến độ đào lò lũy kế */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 pb-4 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">TIẾN ĐỘ ĐÀO LÒ LŨY KẾ</p>
              <p className="text-[11px] text-gray-400 mt-1">Cập nhật: 10:30 AM, Hôm nay</p>
              <div className="mt-3">
                <span className="text-2xl font-black text-gray-900 tracking-tight">720</span>
                <span className="text-gray-400 text-xs font-semibold ml-1">/ 940 mét</span>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200/70 rounded-2xl px-4 py-2.5 text-center min-w-[110px] shadow-sm">
              <span className="block text-3xl font-black text-[#EA580C] tracking-tight leading-none">76.6%</span>
              <span className="block text-[10px] font-bold text-[#EA580C]/80 uppercase tracking-wider mt-1.5">Kế hoạch</span>
            </div>
          </div>
          
          {/* Tăng chiều cao h-[180px] -> h-[250px] giúp biểu đồ vùng dốc lên nhìn trực quan hơn */}
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OVERVIEW_CUMULATIVE_PROG} margin={{ top: 25, right: 25, left: 25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FFF7ED" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={5} />
                <Tooltip />
                <Area 
                  type="linear" 
                  dataKey="value" 
                  stroke="#EA580C" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorProgress)"
                  dot={{ fill: "#EA580C", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#EA580C", strokeWidth: 0 }}
                  label={({ x, y, value }) => (
                    <text x={x} y={y - 10} fill="#EA580C" textAnchor="middle" fontSize={11} fontWeight="700">
                      {value === 0 ? "0 mét" : `${value} mét`}
                    </text>
                  )}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* COMPACT MAX: Thu hẹp triệt để phần bảng để nhường diện tích cho biểu đồ */}
      <div className="bg-white/80 rounded-xl border border-gray-100 overflow-hidden shadow-sm mt-1">
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cảnh báo mới nhất</span>
          </div>
          <span className="text-[10px] text-gray-400 font-normal">
            {OVERVIEW_ALERTS.length} sự cố
          </span>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/10">
                <th className="px-5 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider w-14">STT</th>
                <th className="px-5 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider w-1/4">Đường lò</th>
                <th className="px-5 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Nội dung</th>
                <th className="px-5 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider w-28">Loại</th>
                <th className="px-5 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider w-28">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pagedOverviewAlerts.map((a, index) => (
                <tr
                  key={a.id}
                  onClick={() => onOpenAlert(a.alertId)}
                  className="border-b last:border-0 border-gray-50/60 hover:bg-gray-50/40 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-2 text-[11px] font-medium text-gray-400">
                    {String((alertPage - 1) * ALERTS_PER_PAGE + index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-2 text-xs font-semibold text-gray-600">{a.location}</td>
                  <td className="px-5 py-2 text-xs text-gray-400 truncate max-w-[300px]" title={a.content}>{a.content}</td>
                  <td className="px-5 py-2 scale-90 origin-left">
                    <SeverityBadge severity={a.type} />
                  </td>
                  <td className="px-5 py-2 scale-90 origin-left">
                    <AlertStatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thanh phân trang: bắt buộc chuyển trang khi có nhiều hơn 3 cảnh báo */}
        {totalAlertPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
            <p className="text-[11px] text-gray-400">
              Trang {alertPage} / {totalAlertPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAlertPage(p => Math.max(1, p - 1))}
                disabled={alertPage === 1}
                className="px-3 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {Array.from({ length: totalAlertPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setAlertPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                    alertPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setAlertPage(p => Math.min(totalAlertPages, p + 1))}
                disabled={alertPage === totalAlertPages}
                className="px-3 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen 3.1: Detail Modal ─────────────────────────────
function TunnelModal({ row, onClose }: { row: typeof TUNNEL_DATA[0]; onClose: () => void }) {
  // Thay đổi ở đây: Trỏ trực tiếp vào mảng dữ liệu giả lập global của bạn
  const modalChartData = CHART_DATA;

  // Tính toán thông số cho SVG Line Chart dựa trên tên biến mới
  const svgWidth = 600;
  const svgHeight = 200;
  const stepX = svgWidth / modalChartData.length;
  
  const points = modalChartData.map((d, i) => {
    const x = stepX * i + (stepX / 2);
    const y = 170 - (d.prog / 100) * 140;
    return { x, y, value: d.prog, date: d.date };
  });

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L ${points[points.length-1].x},180 L ${points[0].x},180 Z`;

  // Tổng lũy kế = giá trị ngày cuối
  const lastPoint = modalChartData[modalChartData.length - 1];
  const totalProd = lastPoint.prod;
  const totalProg = lastPoint.prog;

  const maxProd = Math.max(...modalChartData.map(x => x.prod));

  return (
    // ... Phần JSX bên dưới bạn chỉ cần thay thế CHART_DATA bằng modalChartData khi .map() là xong!
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(15,23,42,0.4)", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{row.name}</h2>
              <StatusDotBadge status={row.status} />
            </div>
            <p className="text-sm text-gray-500">Tổng cộng lũy kế</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - 2x2 Grid */}
        {/* Modal Body - 2x2 Grid */}
        <div className="grid grid-cols-2">
          {/* Top Left: Sản lượng */}
          <div className="p-8 border-b border-r border-gray-100">
            {/* ĐÃ SỬA: Đổi "Tổng sản lượng (lũy kế)" thành "Sản lượng" */}
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Sản lượng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#1D4ED8]">{totalProd.toLocaleString('vi-VN')}</span>
              <span className="text-base text-gray-700 font-medium">tấn</span>
            </div>
          </div>

          {/* Top Right: Tiến độ đào lò */}
          <div className="p-8 border-b border-gray-100">
            {/* ĐÃ SỬA: Đổi "Tiến độ đào lò (lũy kế)" thành "Tiến độ đào lò" */}
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Tiến độ đào lò</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#F97316]">{totalProg}</span>
              <span className="text-base text-gray-700 font-medium">mét</span>
            </div>
          </div>

          {/* Bottom Left: Bar Chart */}
          <div className="p-8 border-r border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Sản lượng theo ngày (tấn)</p>
            <div className="flex items-end justify-between h-48">
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex flex-col items-center group flex-1">
                  <span className="text-sm font-bold text-[#1D4ED8] mb-2">{d.prod.toLocaleString('vi-VN')}</span>
                  <div 
                    className="w-10 bg-[#2563EB] rounded-t-md transition-all group-hover:bg-[#1D4ED8]" 
                    style={{ height: `${(d.prod / maxProd) * 140}px` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2 border-t border-gray-100 w-full text-center pt-2">{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Line Chart (SVG) */}
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

// ─── Screen 3: Detail ─────────────────────────────────────
function DetailScreen() {
  const [selectedRow, setSelectedRow] = useState<typeof TUNNEL_DATA[0] | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filtered = TUNNEL_DATA.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.area.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginatedData = filtered.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  const criticalCount = TUNNEL_DATA.filter(r => r.status === "Nghiêm trọng").length;
  const warningCount  = TUNNEL_DATA.filter(r => r.status === "Cảnh báo").length;

  return (
    // SỬA CHỖ NÀY: Xóa "h-full" và "overflow-hidden" để trang được phép cuộn tổng thể
    <div className="p-8 flex flex-col gap-6 bg-gray-50/30 select-none min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 flex-shrink-0" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Báo cáo chi tiết
      </h1>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-5 flex-shrink-0">
        {/* Card 1 */}
        <div className="bg-[#EBF1FF] rounded-xl border border-[#DCE4FA] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#1E40AF] flex items-center justify-center text-white shadow-sm">
                <List size={22} />
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Tổng đường lò</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-2xl font-bold text-[#1E40AF]" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{TUNNEL_DATA.length}</span>
                </div>
             </div>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-[#1E40AF] bg-[#D1DEFF] rounded-full">
            +2 hôm qua
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FFF9E5] rounded-xl border border-[#FBEAC0] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#D97706] flex items-center justify-center text-white shadow-sm">
                <AlertTriangle size={22} />
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Cảnh báo</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-2xl font-bold text-[#D97706]" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{warningCount}</span>
                </div>
             </div>
          </div>
          <span className="text-sm text-yellow-600 font-medium">Ổn định</span>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FDEBEB] rounded-xl border border-[#F9D5D5] px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#DC2626] flex items-center justify-center text-white shadow-sm">
                <AlertCircle size={22} />
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Nghiêm trọng</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-2xl font-bold text-[#DC2626]" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{criticalCount}</span>
                </div>
             </div>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-[#DC2626] bg-[#FBD5D5] rounded-full">
            -1 hôm qua
          </span>
        </div>
      </div>

      {/* Table Content Card */}
      {/* SỬA CHỖ NÀY: Xóa "overflow-hidden" để bảng tự giãn */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        {/* Header của bảng */}
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

        {/* SỬA CHỖ NÀY: Thêm "overflow-x-auto" để chống vỡ giao diện ngang */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-base text-left table-fixed min-w-[800px]">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="w-[25%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Tên đường lò</th>
                <th className="w-[25%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Khu vực</th>
                <th className="w-[20%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Sản lượng</th>
                <th className="w-[15%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Cập nhật</th>
                <th className="w-[15%] px-6 py-4.5 text-sm font-medium text-gray-500 border-b border-gray-100">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedRow(item)} 
                  // Trả lại class mặc định, xóa h-[...]
                  className="border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  {/* Sử dụng padding px-6 py-4 và text-sm giống hệt Screen 4 */}
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm truncate">{item.name}</td>
                  <td className="px-6 py-4 text-gray-800 text-sm font-medium truncate">{item.area}</td>
                  
                  <td className="px-6 py-4">
                    {item.production === "Không sản xuất" ? (
                        <span className="italic text-gray-400 text-sm">{item.production}</span>
                    ) : (
                       <div className="flex flex-col">
                        {/* Đồng bộ: text-sm, text-xs và mt-0.5 giống ô Thời gian của Cảnh báo */}
                        <span className="text-sm font-bold text-gray-900">{item.production}</span>
                        <span className="text-xs font-semibold text-teal-600 mt-0.5">{item.pct}</span>
                       </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{item.time}</td>
                  
                  <td className="px-6 py-4">
                    <StatusDotBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm text-gray-400">
                    Không tìm thấy kết quả phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-2xl flex-shrink-0">
          <span className="text-sm text-gray-500 font-medium">
            Trang {activePage} / {totalPages}
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                  activePage === page 
                    ? "bg-[#2563EB] text-white shadow-sm" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>

      </div>

      {selectedRow && (
        <TunnelModal 
          row={selectedRow} 
          onClose={() => setSelectedRow(null)} 
        />
      )}
    </div>
  );
}

// ─── Screen 4.1: Alert Modal ──────────────────────────────
function AlertModal({ alert, onClose }: { alert: typeof ALERT_DATA[0]; onClose:()=>void }) {
  const isCritical = alert.severity === "Nghiêm trọng";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background:"rgba(0,0,0,0.3)", backdropFilter:"blur(2px)" }}
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[680px] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
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
              <SeverityBadge severity={alert.severity} />
              <AlertStatusBadge status={alert.status} />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 pr-8">
            {alert.content}
          </h2>
        </div>

        {/* 3-col info */}
        <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100">
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">THỜI GIAN</p>
            <p className="text-sm font-bold text-gray-900">{alert.time}</p>
            <p className="text-sm text-gray-500 mt-0.5">{alert.date}</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">VỊ TRÍ</p>
            <p className="text-sm font-bold text-gray-900 leading-snug">{alert.location}</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">NGƯỜI XỬ LÝ</p>
            {alert.assignee ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: alert.assignee.color }}>
                  {alert.assignee.initials}
                </div>
                <span className="text-sm font-bold text-gray-900">{alert.assignee.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic block mt-1">Chưa phân công</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">MÔ TẢ CHI TIẾT</p>
          <div className="rounded-xl p-5 text-sm text-gray-700 leading-relaxed border border-gray-100" style={{ background:"#F8FAFC" }}>
            {alert.description}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: Alert Center ───────────────────────────────
const ALERT_TABS: { id: AlertTab; label: string }[] = [
  { id:"all",      label:"Tất cả" },
  { id:"critical", label:"Nghiêm trọng" },
  { id:"warning",  label:"Cảnh báo" },
  { id:"normal",   label:"Bình thường" },
];

function AlertScreen({ initialAlertId }: { initialAlertId?: number | null }) {
  const [tab, setTab]       = useState<AlertTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof ALERT_DATA[0] | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  // 1. Giảm số lượng xuống 5 cảnh báo 1 trang
  const ITEMS_PER_PAGE = 5; 

  // Khi được điều hướng tới với một alertId cụ thể (ví dụ từ Báo cáo tổng quan),
  // tự động mở modal chi tiết đúng cảnh báo đó.
  useEffect(() => {
    if (initialAlertId == null) return;
    const target = ALERT_DATA.find(a => a.id === initialAlertId);
    if (target) {
      setTab("all");
      setSearch("");
      setSelected(target);
    }
  }, [initialAlertId]);

  const counts = {
    all:      ALERT_DATA.length,
    critical: ALERT_DATA.filter(a => a.severity === "Nghiêm trọng").length,
    warning:  ALERT_DATA.filter(a => a.severity === "Cảnh báo").length,
    normal:   ALERT_DATA.filter(a => a.severity === "Bình thường").length,
    resolved: ALERT_DATA.filter(a => a.status === "Đã hoàn thành").length,
  };

  const filtered = ALERT_DATA.filter(a => {
    const sev = TAB_SEVERITY[tab];
    if (sev && a.severity !== sev) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.content.toLowerCase().includes(q) && !a.location.toLowerCase().includes(q) && !a.assignee?.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-8 pb-12 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Trung tâm cảnh báo
      </h1>

      {/* 4 summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Tổng cảnh báo", value:counts.all,      sub:"Trong 7 ngày qua",  color:"#2563EB", bg:"#EFF6FF", Icon:BarChart2 },
          { label:"Nghiêm trọng",  value:counts.critical, sub:"Cần xử lý ngay",    color:"#DC2626", bg:"#FEF2F2", Icon:X },
          { label:"Cảnh báo",      value:counts.warning,  sub:"Đang theo dõi",     color:"#D97706", bg:"#FFFBEB", Icon:AlertTriangle },
          { label:"Đã xử lý",      value:counts.resolved, sub:`Tỉ lệ ${Math.round(counts.resolved/counts.all*100)}%`, color:"#059669", bg:"#ECFDF5", Icon:CheckCircle },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 px-6 py-5 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:c.bg }}>
                <c.Icon size={20} style={{ color:c.color }} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 mb-0.5">{c.label}</p>
                <p className="text-3xl font-bold" style={{ color:c.color, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{c.value}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        
        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm cảnh báo..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-700 w-full bg-gray-50/50"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center p-1 bg-gray-100/80 rounded-lg">
            {ALERT_TABS.map(t => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  style={{ whiteSpace:"nowrap" }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
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
              {paginatedData.map(a => (
                <tr 
                  key={a.id} 
                  onClick={() => setSelected(a)}
                  className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900" style={{ whiteSpace:"nowrap" }}>{a.time}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.date}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{a.location}</td>
                  <td className="px-6 py-4 text-gray-600">{a.content}</td>
                  <td className="px-6 py-4"><SeverityBadge severity={a.severity} /></td>
                  <td className="px-6 py-4"><AlertStatusBadge status={a.status} /></td>
                  <td className="px-6 py-4">
                    {a.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: a.assignee.color }}>
                          {a.assignee.initials}
                        </div>
                        <span className="text-sm text-gray-700">{a.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Chưa phân công</span>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">Không tìm thấy cảnh báo nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 2. Cập nhật thanh phân trang giống ảnh thiết kế */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                    currentPage === page 
                      ? "bg-blue-600 text-white" 
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {selected && <AlertModal alert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("input");
  const [pendingAlertId, setPendingAlertId] = useState<number | null>(null);

  const goToAlert = (alertId: number) => {
    setPendingAlertId(alertId);
    setScreen("alerts");
  };

  const handleNav = (s: Screen) => {
    setPendingAlertId(null);
    setScreen(s);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily:"'Inter',sans-serif", background:"#F4F6F8" }}>
      <Sidebar active={screen} onNav={handleNav} />
      <main className="flex-1 overflow-auto min-w-0">
        {screen === "input"    && <InputScreen onNavigate={handleNav} />}
        {screen === "overview" && <OverviewScreen onOpenAlert={goToAlert} />}
        {screen === "detail"   && <DetailScreen />}
        {screen === "alerts"   && <AlertScreen initialAlertId={pendingAlertId} />}
      </main>
    </div>
  );
}