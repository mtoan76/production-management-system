import { useState, useRef, useEffect, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,AreaChart, Area,
  Tooltip,
} from "recharts";
import {
  Upload, Bell, BarChart2, List, AlertTriangle, CheckCircle,
  Info, Search, X, Eye, Clock, MapPin, User, LogOut,
  AlertCircle, TrendingUp, ChevronRight, ChevronDown,
  Layers, XCircle,Loader2, Download, History,
  FileText, Sparkles, Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────

// Đo chiều rộng thực tế của khung chứa biểu đồ (để chia đều cho đúng số cột/điểm muốn hiển thị,
// bất kể khung rộng hẹp thế nào tuỳ theo layout thực tế trên máy người dùng)
function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

type Screen = "input" | "history" | "overview" | "detail" | "alerts";
type AlertTab = "all" | "critical" | "warning" | "normal";
type StatusType = "Bình thường" | "Cảnh báo" | "Nghiêm trọng" | "Không sản xuất";
type SeverityType = "Nghiêm trọng" | "Cảnh báo" | "Bình thường";
type AlertStatus = "Đang xử lý" | "Chờ tiếp nhận" | "Đã hoàn thành";
type HistoryStatus = "Hoàn thành" | "Đang xử lý" | "Nháp";

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

// ─── History data (Lịch sử báo cáo) ───────────────────────
type HistoryItem = {
  id: number;
  ngayLamViec: string;
  gioBaoCao: string;
  duongLo: string;
  diemThiCong: string;
  nguoiBaoCao: string;
  trangThai: HistoryStatus;
  ca: string;
  donViThiCong: string;
  fileName: string;
  fileSize: string;
  noiDung: string;
  // tietDien: tiết diện (m²) hoặc bước chống (m/vì) — chỉ áp dụng cho Đào lò/Xén lò/Chống giữ.
  // Khấu lò, Lò nối, Tiến độ khấu chung không có tiết diện nên để trống.
  tienDo: { hangMuc: string; giaTri: number; donVi: string; tietDien?: number; tietDienDonVi?: string }[];
  sanLuongCa: number;
  soLaoDong: number;
  sanLuongConLai: number;
  nhanXetAI: string;
  canhBao: { level: "critical" | "warning"; text: string }[];
  nguyenNhan: string;
  // Một dòng báo cáo có thể gồm nhiều ca, mỗi ca ứng với 1 đơn vị đường lò riêng.
  // Nếu không khai báo, mặc định hiển thị 1 dòng duy nhất dùng ca/duongLo ở trên.
  caChiTiet?: { ca: string; duongLo: string }[];
  // Các trường bổ sung theo nhật ký sản xuất theo ca (file Excel gốc) — đều tùy chọn,
  // chỉ hiển thị khi có dữ liệu để tránh làm rối giao diện.
  giaChongHienTai?: number;
  congViecKhac?: string;
  ghiChuSuCo?: string;
};

const HISTORY_DATA: HistoryItem[] = [
  { id:1, ngayLamViec:"01/07/2026", gioBaoCao:"08:10", duongLo:"DVVT LC 30708 A6-A8", diemThiCong:"BL 1", nguoiBaoCao:"Nguyễn Văn A", trangThai:"Hoàn thành",
    ca:"Ca 1", donViThiCong:"DVVT LC 30708 A6-A8", fileName:"Bao_cao_CT_B1_01-07-2026.docx", fileSize:"248 KB",
    noiDung:"Ca 1 ngày 01/07 tại đoạn A6-A8 đã hoàn thành công tác đào lò và xén lò theo kế hoạch. Sản lượng khai thác trong ca đạt 3.5 tấn, số lao động tham gia 32 người. Công tác chống giữ lò được thực hiện đầy đủ, không phát sinh sự cố trong ca.",
    tienDo:[
      {hangMuc:"Đào lò", giaTri:1.0, donVi:"m", tietDien:3.5, tietDienDonVi:"m²"},
      {hangMuc:"Xén lò", giaTri:1.0, donVi:"m", tietDien:2.0, tietDienDonVi:"m²"},
      {hangMuc:"Chống giữ lò", giaTri:2.0, donVi:"m", tietDien:1.0, tietDienDonVi:"m/vì"},
      {hangMuc:"Khấu lò", giaTri:84.0, donVi:"m"},
      {hangMuc:"Lò nối", giaTri:90.0, donVi:"m"},
      {hangMuc:"Tiến độ khấu chung", giaTri:2.8, donVi:"m"},
    ],
    sanLuongCa:3.5, soLaoDong:32, sanLuongConLai:20,
    giaChongHienTai:20, congViecKhac:"Kiểm tra định kỳ hệ thống thông gió cục bộ khu vực A6-A8", ghiChuSuCo:"Ổn định",
    nhanXetAI:"Hệ thống ghi nhận ca làm việc đã hoàn thành đầy đủ các hạng mục đào lò, xén lò và chống giữ lò theo đúng tiến độ kế hoạch đề ra. Tuy nhiên sản lượng thực tế trong ca thấp hơn so với định mức trung bình, cần theo dõi thêm ở các ca kế tiếp.",
    canhBao:[{level:"warning", text:"Tiến độ đào lò chưa đạt so với kế hoạch đề ra trong ca."},{level:"critical", text:"Sản lượng thực tế thấp hơn 40% so với định mức trung bình 7 ngày gần nhất."}],
    nguyenNhan:"Nguyên nhân bổ sung: thiếu hụt nhân lực tại một số vị trí thi công, điều kiện địa chất khu vực gương lò phức tạp hơn dự kiến khiến tốc độ đào lò giảm." },
  { id:2, ngayLamViec:"01/07/2026", gioBaoCao:"16:15", duongLo:"DVVT LC 30708 A6-A8", diemThiCong:"BL 1", nguoiBaoCao:"Trần Văn B", trangThai:"Hoàn thành",
    ca:"Ca 2", donViThiCong:"DVVT LC 30708 A6-A8", fileName:"Bao_cao_CT_B1_01-07-2026-ca2.docx", fileSize:"210 KB",
    noiDung:"Ca 2 tiếp tục công tác đào lò tại đoạn A6-A8, đạt sản lượng 3.8 tấn, đảm bảo tiến độ chung của ngày.",
    tienDo:[{hangMuc:"Đào lò", giaTri:3.8, donVi:"m"},{hangMuc:"Xén lò", giaTri:3.2, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:3.0, donVi:"m"}],
    sanLuongCa:3.8, soLaoDong:30, sanLuongConLai:16.2,
    nhanXetAI:"Ca làm việc đạt tiến độ ổn định, không có bất thường đáng kể so với kế hoạch.",
    canhBao:[], nguyenNhan:"Không phát sinh nguyên nhân bổ sung." },
  { id:3, ngayLamViec:"02/07/2026", gioBaoCao:"23:20", duongLo:"Lò chợ 30705, XV lò TGVT", diemThiCong:"BL 2", nguoiBaoCao:"Lê Văn C", trangThai:"Đang xử lý",
    ca:"Ca 3", donViThiCong:"Lò chợ 30705", fileName:"Bao_cao_LC30705_02-07-2026.jpg", fileSize:"1.4 MB",
    noiDung:"Ca 3 báo cáo bằng ảnh chụp tay, đang chờ hệ thống AI trích xuất và xác nhận lại số liệu sản lượng và tiến độ.",
    tienDo:[{hangMuc:"Đào lò", giaTri:2.4, donVi:"m"},{hangMuc:"Xén lò", giaTri:2.0, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:2.0, donVi:"m"}],
    sanLuongCa:2.4, soLaoDong:28, sanLuongConLai:24.6,
    giaChongHienTai:21, ghiChuSuCo:"Sập lò cục bộ, đã xử lý",
    nhanXetAI:"Dữ liệu đang được xử lý, số liệu bên dưới là kết quả trích xuất sơ bộ, cần người phụ trách xác nhận trước khi hoàn tất.",
    canhBao:[{level:"warning", text:"Đang chờ xác nhận thủ công trước khi lưu chính thức vào hệ thống."}],
    nguyenNhan:"Chưa xác định — đang chờ đối chiếu với báo cáo giấy gốc." },
  { id:4, ngayLamViec:"02/07/2026", gioBaoCao:"08:05", duongLo:"DVVT LC 30712 B2-C1; DVVT LC 30715 đoạn C4-C6", diemThiCong:"KT 1", nguoiBaoCao:"Nguyễn Văn A", trangThai:"Hoàn thành",
    ca:"Ca 1", donViThiCong:"DVVT LC 30712 B2-C1", fileName:"Bao_cao_KT1_02-07-2026.xlsx", fileSize:"96 KB",
    caChiTiet:[
      { ca:"Ca 1", duongLo:"DVVT LC 30712 B2-C1" },
      { ca:"Ca 2", duongLo:"DVVT LC 30715 đoạn C4-C6" },
    ],
    noiDung:"Hoàn thành đầy đủ khối lượng công việc tại 2 vị trí thi công B2-C1 và C4-C6 trong ca 1.",
    tienDo:[{hangMuc:"Đào lò", giaTri:4.1, donVi:"m"},{hangMuc:"Xén lò", giaTri:3.6, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:3.5, donVi:"m"}],
    sanLuongCa:4.1, soLaoDong:34, sanLuongConLai:12,
    nhanXetAI:"Kết quả ca vượt định mức trung bình, chất lượng chống giữ lò được ghi nhận tốt.",
    canhBao:[], nguyenNhan:"Không phát sinh." },
  { id:5, ngayLamViec:"03/07/2026", gioBaoCao:"16:30", duongLo:"Lò chợ 30705, XV lò TGVT; Lò chợ 30716", diemThiCong:"KT 2", nguoiBaoCao:"Hoàng Văn D", trangThai:"Đang xử lý",
    ca:"Ca 2", donViThiCong:"Lò chợ 30705", fileName:"Bao_cao_KT2_03-07-2026.docx", fileSize:"180 KB",
    caChiTiet:[
      { ca:"Ca 2", duongLo:"Lò chợ 30705, XV lò TGVT" },
      { ca:"Ca 3", duongLo:"Lò chợ 30716" },
    ],
    noiDung:"Ca 2 ghi nhận tiến độ chậm hơn kế hoạch tại khu vực lò chợ 30716, cần theo dõi thêm.",
    tienDo:[{hangMuc:"Đào lò", giaTri:2.0, donVi:"m"},{hangMuc:"Xén lò", giaTri:1.8, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:1.8, donVi:"m"}],
    sanLuongCa:2.0, soLaoDong:26, sanLuongConLai:22,
    nhanXetAI:"Tiến độ ca thấp hơn 30% so với kế hoạch, đang chờ xác nhận nguyên nhân từ đơn vị thi công.",
    canhBao:[{level:"warning", text:"Tiến độ đào lò chưa đạt so với kế hoạch đề ra trong ca."}],
    nguyenNhan:"Đang chờ đơn vị thi công bổ sung nguyên nhân cụ thể." },
  { id:6, ngayLamViec:"04/07/2026", gioBaoCao:"08:45", duongLo:"DVVT LC 30708 B2-C1", diemThiCong:"BL 3", nguoiBaoCao:"Phạm Văn E", trangThai:"Hoàn thành",
    ca:"Ca 1", donViThiCong:"DVVT LC 30708 B2-C1", fileName:"Bao_cao_BL3_04-07-2026.docx", fileSize:"230 KB",
    noiDung:"Ca 1 hoàn thành đúng kế hoạch, không có sự cố phát sinh trong suốt ca làm việc.",
    tienDo:[{hangMuc:"Đào lò", giaTri:3.6, donVi:"m"},{hangMuc:"Xén lò", giaTri:3.1, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:3.0, donVi:"m"}],
    sanLuongCa:3.6, soLaoDong:31, sanLuongConLai:17,
    nhanXetAI:"Ca làm việc ổn định, đạt tiến độ đề ra.",
    canhBao:[], nguyenNhan:"Không phát sinh." },
  { id:7, ngayLamViec:"04/07/2026", gioBaoCao:"17:00", duongLo:"Lò chợ 30716", diemThiCong:"KT 3", nguoiBaoCao:"Trương Văn F", trangThai:"Hoàn thành",
    ca:"Ca 2", donViThiCong:"Lò chợ 30716", fileName:"Bao_cao_KT3_04-07-2026.docx", fileSize:"205 KB",
    noiDung:"Ca 2 hoàn thành công tác khai thác tại lò chợ 30716, sản lượng đạt mức kế hoạch đề ra.",
    tienDo:[{hangMuc:"Đào lò", giaTri:3.2, donVi:"m"},{hangMuc:"Xén lò", giaTri:2.9, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:2.8, donVi:"m"}],
    sanLuongCa:3.2, soLaoDong:29, sanLuongConLai:19,
    nhanXetAI:"Kết quả ca phù hợp với kế hoạch, không phát hiện bất thường.",
    canhBao:[], nguyenNhan:"Không phát sinh." },
  { id:8, ngayLamViec:"05/07/2026", gioBaoCao:"08:00", duongLo:"DVVT LC 30708 A6-A8", diemThiCong:"BL 1", nguoiBaoCao:"Nguyễn Văn A", trangThai:"Nháp",
    ca:"Ca 1", donViThiCong:"DVVT LC 30708 A6-A8", fileName:"Bao_cao_BL1_05-07-2026.docx", fileSize:"120 KB",
    noiDung:"Báo cáo đang ở dạng nháp, chưa được người phụ trách gửi chính thức lên hệ thống.",
    tienDo:[{hangMuc:"Đào lò", giaTri:0, donVi:"m"},{hangMuc:"Xén lò", giaTri:0, donVi:"m"},{hangMuc:"Chống giữ lò", giaTri:0, donVi:"m"}],
    sanLuongCa:0, soLaoDong:0, sanLuongConLai:20,
    nhanXetAI:"Chưa có dữ liệu để phân tích do báo cáo chưa được gửi chính thức.",
    canhBao:[], nguyenNhan:"Không áp dụng." },
];

// Chuyển "dd/MM/yyyy" + "HH:mm" thành timestamp để sắp xếp đúng theo thời gian thực tế
function parseVNDateTime(ngay: string, gio: string): number {
  const [d, m, y] = ngay.split("/").map(Number);
  const [hh, mm] = gio.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0).getTime();
}

const HISTORY_STATUS_CFG: Record<HistoryStatus, { badge: string; textColor: string; dot: string }> = {
  "Hoàn thành":  { badge:"bg-green-50 border border-green-200",  textColor:"text-green-700",  dot:"bg-green-500" },
  "Đang xử lý":  { badge:"bg-orange-50 border border-orange-200", textColor:"text-orange-700", dot:"bg-orange-500" },
  "Nháp":        { badge:"bg-gray-100 border border-gray-200",   textColor:"text-gray-600",   dot:"bg-gray-400" },
};

function HistoryStatusBadge({ status }: { status: HistoryStatus }) {
  const cfg = HISTORY_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}

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
  { id:"overview", label:"Báo cáo tổng quan",  Icon: BarChart2 },
  { id:"detail",   label:"Báo cáo chi tiết",   Icon: List },
  { id:"input",    label:"Nhập báo cáo mới",   Icon: Upload },
  { id:"history",  label:"Lịch sử báo cáo",    Icon: History },
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
                  style={{
                    background: "#DC2626",
                    color: "#fff",
                    boxShadow: isActive ? "0 0 0 2px rgba(255,255,255,0.35)" : "none",
                  }}>
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

// URL webhook n8n để LẤY dữ liệu tổng quan (2 truy vấn: theo tháng + theo ngày trong tháng)
// Webhook này là GET, nhận query param ?thang=&nam=
const N8N_OVERVIEW_URL =
  (import.meta as any)?.env?.VITE_N8N_OVERVIEW_URL || "/api/tong-quan";

// URL lấy dữ liệu đường lò (lũy kế sản lượng + tiến độ theo ngày) — để mở modal chi tiết
const N8N_DUONG_LO_URL =
  (import.meta as any)?.env?.VITE_N8N_DUONG_LO_URL || "/api/duong-lo";


// ─── Kiểu dữ liệu trả về từ 2 truy vấn tổng quan ───────────
type MonthSummary = {
  thang: string;
  tong_san_luong: string;
  tong_tien_do: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};
type DaySummary = {
  ngay: string;
  san_luong_ngay: string;
  tien_do_ngay: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};
type KpiSummary = {
  san_luong_thuc_te: number;
  san_luong_ke_hoach: number;
  san_luong_ty_le: number;
  tien_do_thuc_te: number;
  tien_do_ke_hoach: number;
  tien_do_ty_le: number;
};
type TunnelData = {
  duong_lo: string;
  ngay_bao_cao: string;
  thoi_gian_bao_cao: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};

type SubmitStatus = "idle" | "processing" | "success" | "error";

// ─── Overlay: đang xử lý / thành công / lỗi ────────────────
// Cấu trúc 1 dòng báo cáo trả về từ n8n (khớp với node Code cuối cùng trong workflow)
type ReportItem = {
  ma_bao_cao?: string;
  ngay?: string;
  ca?: string | number;
  don_vi_thi_cong?: string;
  nguoi_bao_cao?: string;
  so_lao_dong?: string | number;
  san_luong?: string | number;
  san_luong_tan?: string | number;
  dao_lo_1?: string | number;
  dao_lo_2?: string | number;
  xen_lo_1?: string | number;
  xen_lo_2?: string | number;
  ghi_chu?: string | number;
  tinh_trang?: string;
  noi_dung_canh_bao?: string;
  [key: string]: any;
};

// Bỏ dấu tiếng Việt + viết thường để so khớp linh hoạt, không phụ thuộc AI viết đúng dấu 100%
function normalizeVN(s?: string) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Lấy sản lượng bất kể n8n đặt tên field là san_luong_tan hay san_luong
function getSanLuong(item: ReportItem) {
  const v = item.san_luong_tan ?? item.san_luong;
  return v === undefined || v === null || v === "" ? undefined : v;
}

// Màu sắc nhãn trạng thái, tái sử dụng đúng bảng màu đã dùng ở Báo cáo chi tiết
function StatusPill({ status }: { status?: string }) {
  const norm = normalizeVN(status);
  let label = "Không rõ";
  let bg = "#F3F4F6";
  let color = "#6B7280";
  if (norm.includes("nghiem trong")) {
    label = "Nghiêm trọng"; bg = "#FEF2F2"; color = "#DC2626";
  } else if (norm.includes("canh bao")) {
    label = "Cảnh báo"; bg = "#FFFBEB"; color = "#D97706";
  } else if (norm.includes("binh thuong")) {
    label = "Bình thường"; bg = "#ECFDF5"; color = "#059669";
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ─── Thẻ hiển thị 1 dòng báo cáo (1 lò/vị trí) trả về từ n8n ─
function ReportItemCard({ item }: { item: ReportItem }) {
  const sanLuong = getSanLuong(item);
  const hasTinhTrang = !!item.tinh_trang;

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-left">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{item.don_vi_thi_cong || "Không rõ đơn vị"}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1"><Clock size={11} />{item.ngay || "--"} · Ca {item.ca ?? "--"}</span>
            {item.nguoi_bao_cao && (
              <span className="inline-flex items-center gap-1"><User size={11} />{item.nguoi_bao_cao}</span>
            )}
          </div>
        </div>
        {hasTinhTrang && <StatusPill status={item.tinh_trang} />}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
        {sanLuong !== undefined && (
          <div><span className="text-gray-400">Sản lượng:</span> {sanLuong} tấn</div>
        )}
        {item.so_lao_dong !== undefined && item.so_lao_dong !== 0 && (
          <div><span className="text-gray-400">Lao động:</span> {item.so_lao_dong}</div>
        )}
        {item.dao_lo_1 !== undefined && (
          <div><span className="text-gray-400">Đào lò 1:</span> {item.dao_lo_1} m</div>
        )}
        {item.dao_lo_2 !== undefined && (
          <div><span className="text-gray-400">Đào lò 2:</span> {item.dao_lo_2} m</div>
        )}
        {item.xen_lo_1 !== undefined && (
          <div><span className="text-gray-400">Xén lò 1:</span> {item.xen_lo_1} m</div>
        )}
        {item.xen_lo_2 !== undefined && (
          <div><span className="text-gray-400">Xén lò 2:</span> {item.xen_lo_2} m</div>
        )}
      </div>

      {item.ghi_chu !== undefined && item.ghi_chu !== "" && (
        <p className="text-xs text-gray-700 mb-1"><span className="text-gray-400">Ghi chú:</span> {item.ghi_chu}</p>
      )}

      {hasTinhTrang && !normalizeVN(item.tinh_trang).includes("binh thuong") && item.noi_dung_canh_bao && !normalizeVN(item.noi_dung_canh_bao).includes("khong co") && (
        <div className="flex items-start gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg" style={{ background: "#FEF2F2" }}>
          <AlertTriangle size={13} color="#DC2626" className="mt-0.5 flex-shrink-0" />
          <p className="text-xs" style={{ color: "#991B1B" }}>{item.noi_dung_canh_bao}</p>
        </div>
      )}
    </div>
  );
}

// ─── Overlay: đang xử lý / thành công / lỗi ────────────────
function SubmitOverlay({
  status,
  errorMessage,
  reportItems,
  onClose,
  onNavigate,
}: {
  status: SubmitStatus;
  errorMessage: string;
  reportItems: ReportItem[];
  onClose: () => void;
  onNavigate: (s: Screen) => void;
}) {
  if (status === "idle") return null;

  const hasReport = status === "success" && reportItems.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full flex flex-col items-center text-center transition-all ${
          hasReport ? "max-w-[720px] max-h-[85vh]" : "max-w-[420px] p-8"
        }`}
      >
        {status === "processing" && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#EFF6FF" }}>
              <Loader2 size={30} color="#2563EB" className="animate-spin" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đang xử lý dữ liệu báo cáo...
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hệ thống đang gửi báo cáo lên n8n để trích xuất và phân tích dữ liệu. Vui lòng chờ trong giây lát.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className={`w-full flex flex-col items-center text-center ${hasReport ? "p-6 overflow-hidden" : ""}`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0" style={{ background: "#ECFDF5" }}>
              <CheckCircle size={30} color="#059669" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đã xử lý xong báo cáo!
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4 leading-relaxed">
              {hasReport
                ? `n8n đã phân tích và trả về ${reportItems.length} dòng báo cáo bên dưới.`
                : "Dữ liệu đã được lưu và phân tích thành công."}
            </p>

            {hasReport && (
              <div className="w-full flex flex-col gap-2.5 overflow-y-auto text-left pr-1" style={{ maxHeight: "48vh" }}>
                {reportItems.map((item, idx) => (
                  <ReportItemCard key={item.ma_bao_cao || idx} item={item} />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 w-full mt-5 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "#2563EB" }}
              >
                Đóng và nhập báo cáo khác
              </button>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => onNavigate("overview")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <BarChart2 size={13} />
                  Báo cáo tổng quan
                </button>
                <button
                  onClick={() => onNavigate("detail")}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <List size={13} />
                  Báo cáo chi tiết
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="p-8 flex flex-col items-center text-center">
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
          </div>
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
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
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
    // Luôn gửi kèm ngày hôm nay (dd/mm/yyyy) -> dùng làm "ngày" mặc định cho các ghi chú
    // không kèm Excel (vì lúc đó không có dòng Excel nào để biết ngày báo cáo là ngày nào)
    const today = new Date();
    const ngayBaoCao = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    formData.append("ngay_bao_cao", ngayBaoCao);

    setStatus("processing");

    try {
      // 2. Gọi API webhook n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: formData, // Truyền trực tiếp formData (Trình duyệt sẽ tự cấu hình Header multipart/form-data)
      });

      if (response.ok) {
        // Đợi n8n trả về kết quả xử lý (workflow nên chạy xong rồi mới response)
        const data = await response.json().catch(() => null);
        console.log("n8n response:", data); // 👈 để debug: mở F12 Console xem đúng shape trả về

        // Chuẩn hoá dữ liệu trả về thành 1 mảng ReportItem, vì tuỳ cấu hình
        // "Response Data" trong node Webhook mà n8n có thể trả về:
        // - 1 mảng nhiều dòng (khi có nhiều lò/vị trí)              -> dùng thẳng
        // - 1 object bọc { data: [...] }                            -> lấy .data
        // - 1 object đơn (khi Webhook chỉ trả "First Entry JSON")   -> gói vào mảng 1 phần tử
        // - rỗng/không hợp lệ                                        -> mảng rỗng
        let items: ReportItem[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray((data as any).data)) {
          items = (data as any).data;
        } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
          items = [data as ReportItem];
        }

        setReportItems(items);
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

  const closeOverlay = () => {
    setStatus("idle");
    setReportItems([]);
  };

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
      <SubmitOverlay status={status} errorMessage={errorMessage} reportItems={reportItems} onClose={closeOverlay} onNavigate={onNavigate} />

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
          </div>
        </div>
      </div>

      {/* Footer */}
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

// ─── Screen 1.1: Lịch sử báo cáo ──────────────────────────
function HistoryScreen({ onOpenHistory }: { onOpenHistory?: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-13");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const PAGE_SIZE = 5;

  const openDetail = (id: number) => {
    setSelectedId(id);
    onOpenHistory?.(id);
  };

  const filtered = HISTORY_DATA
    .filter(item => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        item.duongLo.toLowerCase().includes(q) ||
        item.diemThiCong.toLowerCase().includes(q) ||
        item.nguoiBaoCao.toLowerCase().includes(q)
      );
    })
    // Sắp xếp đúng theo thời gian thực tế (ngày làm việc + giờ báo cáo),
    // để báo cáo gửi trước luôn đứng trước báo cáo gửi sau.
    .sort((a, b) => parseVNDateTime(a.ngayLamViec, a.gioBaoCao) - parseVNDateTime(b.ngayLamViec, b.gioBaoCao));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginated = filtered.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const rangeStart = total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(activePage * PAGE_SIZE, total);

  return (
    <div className="p-8 flex flex-col gap-6 min-h-screen bg-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Lịch sử báo cáo
          </h1>
          <p className="text-sm text-gray-500 mt-1">Tra cứu, tìm kiếm và xem lại toàn bộ báo cáo đã nhập vào hệ thống</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm theo nội dung, đường lò, người báo cáo..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 outline-none focus:border-blue-400 transition-colors"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <button
          onClick={() => setCurrentPage(1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background:"#2563EB" }}
        >
          <Filter size={14} />
          Lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Ngày làm việc</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Giờ báo cáo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Ca</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100">Đường lò</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Điểm thi công</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Người báo cáo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-100 whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(item => {
                // Mỗi ca ứng với 1 đơn vị đường lò riêng làm ca đó, nên 1 dòng báo cáo
                // có thể chứa 2-3 ca cùng lúc → hiển thị xếp chồng theo đúng thứ tự.
                const rows = item.caChiTiet ?? [{ ca: item.ca, duongLo: item.duongLo }];
                return (
                  <tr
                    key={item.id}
                    onClick={() => openDetail(item.id)}
                    className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap align-top">{item.ngayLamViec}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-top">{item.gioBaoCao}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top">
                      <div className="flex flex-col gap-1.5">
                        {rows.map((r, i) => <span key={i}>{r.ca}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-[260px] align-top">
                      <div className="flex flex-col gap-1.5">
                        {rows.map((r, i) => <span key={i}>{r.duongLo}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-top">{item.diemThiCong}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top">{item.nguoiBaoCao}</td>
                    <td className="px-6 py-4 align-top"><HistoryStatusBadge status={item.trangThai} /></td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">Không tìm thấy báo cáo nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Hiển thị {rangeStart}-{rangeEnd} trong tổng số {total} báo cáo
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                    activePage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedId != null && (
        <HistoryDetailModal
          historyId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

// ─── Popup: Chi tiết lịch sử báo cáo ────────────────────────
function HistoryDetailModal({ historyId, onClose }: { historyId: number | null; onClose: () => void }) {
  const item = HISTORY_DATA.find(h => h.id === historyId) ?? HISTORY_DATA[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background:"rgba(0,0,0,0.3)", backdropFilter:"blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-y-auto p-8 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
      {/* Header */}
      <div className="flex flex-col gap-2 pb-5 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Chi tiết báo cáo
          </h1>
          <button
            onClick={onClose}
            title="Đóng"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Thông tin báo cáo */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin báo cáo</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Ngày báo cáo</p>
            <p className="text-sm font-bold text-gray-900">{item.ngayLamViec}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Ca báo</p>
            <p className="text-sm font-bold text-gray-900">{item.ca}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Đơn vị thi công</p>
            <p className="text-sm font-bold text-gray-900">{item.donViThiCong}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Người báo cáo</p>
            <p className="text-sm font-bold text-gray-900">{item.nguoiBaoCao}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Giờ báo cáo</p>
            <p className="text-sm font-bold text-gray-900">{item.gioBaoCao}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
            <HistoryStatusBadge status={item.trangThai} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* File đính kèm */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tệp đính kèm</p>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"#EFF6FF" }}>
                <FileText size={18} color="#2563EB" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.fileSize}</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0">
                <Download size={13} />
                Tải xuống
              </button>
            </div>
          </div>

          {/* Nội dung báo cáo */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Nội dung báo cáo</p>
            <p className="text-sm text-gray-700 leading-relaxed rounded-xl p-4 border border-gray-100" style={{ background:"#F8FAFC" }}>
              {item.noiDung}
            </p>

            {(item.congViecKhac || item.ghiChuSuCo) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                {item.congViecKhac && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-gray-400 flex-shrink-0">Công việc khác:</span>
                    <span className="text-gray-600">{item.congViecKhac}</span>
                  </div>
                )}
                {item.ghiChuSuCo && (() => {
                  // Không có "sự cố", "sập", "hỏng", "dừng"... trong ghi chú → coi là tình trạng ổn định (xanh).
                  const coSuCo = /su co|sap|hong|dung|ro ri|chay/.test(normalizeVN(item.ghiChuSuCo));
                  return (
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-semibold text-gray-400 flex-shrink-0">Ghi chú / sự cố:</span>
                      <span className={`font-medium ${coSuCo ? "text-orange-600" : "text-green-700"}`}>{item.ghiChuSuCo}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right column: AI analysis */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Báo cáo phân tích AI</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
              <Sparkles size={11} />
              Phân tích tự động
            </span>
          </div>

          {/* 1. Tiến độ thực hiện */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">1. Tiến độ thực hiện</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Hạng mục</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">Tiết diện / bước KT</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500 text-right">Thực hiện</th>
                  </tr>
                </thead>
                <tbody>
                  {item.tienDo.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {row.tietDien != null ? (
                        <>
                          <td className="px-4 py-2.5 text-gray-700">{row.hangMuc}</td>
                          <td className="px-4 py-2.5 text-gray-500">
                            {`${row.tietDien} ${row.tietDienDonVi ?? ""}`.trim()}
                          </td>
                        </>
                      ) : (
                        <td className="px-4 py-2.5 text-gray-700" colSpan={2}>{row.hangMuc}</td>
                      )}
                      <td className="px-4 py-2.5 font-semibold text-gray-900 text-right">
                        {row.giaTri} <span className="font-normal text-gray-400">{row.donVi}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

          {/* 2. Sản lượng */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">2. Sản lượng</p>
            <div className={`grid gap-3 ${item.giaChongHienTai != null ? "grid-cols-4" : "grid-cols-3"}`}>
              <div className="rounded-xl border border-gray-100 p-3 text-center" style={{ background:"#F8FAFC" }}>
                <p className="text-lg font-bold text-gray-900">{item.sanLuongCa}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Sản lượng ca (tấn)</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 text-center" style={{ background:"#F8FAFC" }}>
                <p className="text-lg font-bold text-gray-900">{item.soLaoDong}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Số lao động</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 text-center" style={{ background:"#F8FAFC" }}>
                <p className="text-lg font-bold text-gray-900">{item.sanLuongConLai}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Sản lượng còn lại (tấn)</p>
              </div>
              {item.giaChongHienTai != null && (
                <div className="rounded-xl border border-gray-100 p-3 text-center" style={{ background:"#F8FAFC" }}>
                  <p className="text-lg font-bold text-gray-900">{item.giaChongHienTai}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Giá chống hiện tại</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Nhận xét AI */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">3. Nhận xét kết quả</p>
            <p className="text-sm text-gray-600 leading-relaxed">{item.nhanXetAI}</p>
          </div>

          {/* 4. Cảnh báo */}
          {item.canhBao.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">4. Cảnh báo</p>
              <div className="flex flex-col gap-2">
                {item.canhBao.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg"
                    style={{ background: w.level === "critical" ? "#FEF2F2" : "#FFFBEB" }}
                  >
                    <AlertTriangle size={14} color={w.level === "critical" ? "#DC2626" : "#D97706"} className="mt-0.5 flex-shrink-0" />
                    <p className="text-xs" style={{ color: w.level === "critical" ? "#991B1B" : "#92400E" }}>{w.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Nguyên nhân bổ sung */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">5. Nguyên nhân bổ sung</p>
            <p className="text-sm text-gray-600 leading-relaxed">{item.nguyenNhan}</p>
          </div>

          <button
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity mt-1"
            style={{ background:"#2563EB" }}
          >
            <CheckCircle size={15} />
            Xác nhận
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── DỮ LIỆU BÁO CÁO LŨY KẾ MỚI ────────────────────────
const OVERVIEW_CUMULATIVE_PROD_MONTH = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const value = 1300 + Math.round(Math.sin(month / 1.8) * 250) + (month === 7 ? 200 : 0);
  return { day: `Th${month}`, value };
});
const OVERVIEW_CUMULATIVE_PROG_MONTH = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const value = 75 + Math.round(Math.cos(month / 1.8) * 22) + (month === 7 ? 10 : 0);
  return { day: `Th${month}`, value };
});

// Số ngày thực tế của 1 tháng trong năm (tự tính đúng 28/30/31 ngày)
function getDaysInMonth(month: number, year = 2026) {
  return new Date(year, month, 0).getDate();
}
// Sinh dữ liệu sản lượng theo ngày cho đúng tháng/năm được chọn (VD: tháng 7 → 31 ngày, tháng 6 → 30 ngày)
function genProdByDay(month: number, year = 2026) {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const value = 450 + Math.round(Math.sin(dayNum / 3 + month) * 90);
    return { day: `${String(dayNum).padStart(2, "0")}/${String(month).padStart(2, "0")}`, value };
  });
}
function genProgByDay(month: number, year = 2026) {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const value = 25 + Math.round(Math.cos(dayNum / 4 + month) * 7);
    return { day: `${String(dayNum).padStart(2, "0")}/${String(month).padStart(2, "0")}`, value };
  });
}

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
  const [chartView, setChartView] = useState<"month" | "day">("month");
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const totalAlertPages = Math.max(1, Math.ceil(OVERVIEW_ALERTS.length / ALERTS_PER_PAGE));
  const pagedOverviewAlerts = OVERVIEW_ALERTS.slice(
    (alertPage - 1) * ALERTS_PER_PAGE,
    alertPage * ALERTS_PER_PAGE
  );

  // ─── Dữ liệu tổng quan THẬT, lấy từ n8n (thay cho dữ liệu giả) ───
  const [monthSummary, setMonthSummary] = useState<MonthSummary | null>(null);
  const [daySummary, setDaySummary] = useState<DaySummary[]>([]);
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadOverview() {
      setLoadingOverview(true);
      setOverviewError("");
      try {
        const url = `${N8N_OVERVIEW_URL}?thang=${selectedMonth}&nam=${selectedYear}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server trả về lỗi ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const monthArr: MonthSummary[] = Array.isArray(data?.month) ? data.month : (data?.month ? [data.month] : []);
        const dayArr: DaySummary[] = Array.isArray(data?.day) ? data.day : [];
        setMonthSummary(monthArr[0] ?? null);
        setDaySummary(dayArr);
        setKpi(data?.kpi ?? null);
      } catch (err) {
        console.error("Lỗi tải dữ liệu tổng quan:", err);
        if (!cancelled) setOverviewError("Không tải được dữ liệu tổng quan. Kiểm tra n8n/API đã bật chưa.");
      } finally {
        if (!cancelled) setLoadingOverview(false);
      }
    }
    loadOverview();
    return () => { cancelled = true; };
    // Refetch khi đổi tháng/năm xem, hoặc khi bấm nút "Làm mới" (refreshTick),
    // và LUÔN chạy lại mỗi khi màn hình này được mở (component mount) — tức là
    // sau khi nộp báo cáo mới rồi bấm "Báo cáo tổng quan", dữ liệu sẽ tự cập nhật.
  }, [selectedMonth, selectedYear, refreshTick]);

  // Bảng dữ liệu theo ngày trong tháng, dùng cho cả 2 biểu đồ
  const dayProdChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.san_luong_luy_ke) || 0 }));
  const dayProgChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.tien_do_luy_ke) || 0 }));

  // Chế độ "Theo tháng": hiện chỉ có 1 tháng đang chọn (chưa có truy vấn xu hướng nhiều tháng),
  // nên tạm hiển thị đúng 1 cột bằng dữ liệu lũy kế của tháng đó.
  const monthProdChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.san_luong_luy_ke) || 0 }]
    : [];
  const monthProgChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.tien_do_luy_ke) || 0 }]
    : [];

  const prodData = chartView === "month" ? monthProdChart : dayProdChart;
  const progData = chartView === "month" ? monthProgChart : dayProgChart;

  // Số liệu cho 2 thẻ KPI ở đầu trang — lấy từ truy vấn tháng
  const kpiSanLuong = kpi ? kpi.san_luong_thuc_te : (monthSummary ? Number(monthSummary.san_luong_luy_ke) || 0 : 0);
  const kpiSanLuongKeHoach = kpi?.san_luong_ke_hoach ?? 0;
  const kpiSanLuongTyLe = kpi?.san_luong_ty_le ?? 0;
  const kpiTienDoThucTe = kpi?.tien_do_thuc_te ?? 0;
  const kpiTienDoKeHoach = kpi?.tien_do_ke_hoach ?? 0;
  const kpiTienDoTyLe = kpi?.tien_do_ty_le ?? 0;
  // Chỉ hiện đúng 7 cột/điểm trong khung nhìn, phần còn lại cuộn ngang để xem tiếp.
  // Đo chiều rộng thật của từng khung để chia đều — không dùng số px cố định,
  // vì khung có thể rộng/hẹp khác nhau tuỳ màn hình.
  const VISIBLE_ITEMS = 7;
  const [prodBoxRef, prodBoxWidth] = useContainerWidth<HTMLDivElement>();
  const [progBoxRef, progBoxWidth] = useContainerWidth<HTMLDivElement>();
  const prodItemWidth = Math.max(50, prodBoxWidth / VISIBLE_ITEMS);
  const progItemWidth = Math.max(50, progBoxWidth / VISIBLE_ITEMS);
  const prodChartWidth = Math.max(prodBoxWidth, prodData.length * prodItemWidth);
  const progChartWidth = Math.max(progBoxWidth, progData.length * progItemWidth);
  const canScrollProd = prodData.length > VISIBLE_ITEMS;
  const canScrollProg = progData.length > VISIBLE_ITEMS;

  return (
    <div className="p-8 flex flex-col gap-6 min-h-screen overflow-y-auto bg-[#F8FAFC]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          Báo cáo tổng quan
        </h1>

        {/* Bộ lọc khoảng thời gian dùng chung cho cả 2 biểu đồ bên dưới */}
        <div className="flex items-center gap-2 bg-white border-2 border-blue-200 rounded-xl shadow-sm px-3 py-2">
          <BarChart2 size={15} className="text-blue-600" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wide mr-1">Xem biểu đồ:</span>
          <div className="relative">
            <select
              value={chartView}
              onChange={e => setChartView(e.target.value as "month" | "day")}
              className="appearance-none text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="month">Theo tháng (summary)</option>
              <option value="day">Theo ngày (summary)</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="appearance-none text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {/* Hiện tạm chỉ năm 2026 (dữ liệu hiện có); thêm option năm khác khi có dữ liệu thật */}
              <option value={2026}>Năm 2026</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
          </div>
          {chartView === "day" && (
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="appearance-none text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
            </div>
          )}
          <button
            onClick={() => setRefreshTick(t => t + 1)}
            disabled={loadingOverview}
            title="Làm mới dữ liệu"
            className="ml-1 flex items-center justify-center w-7 h-7 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <Loader2 size={14} className={loadingOverview ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {overviewError && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertTriangle size={14} />
          {overviewError}
        </div>
      )}

      {/* KPI cards + charts (ĐÃ TĂNG CHIỀU CAO LÊN ~4/3 LẦN) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card 1: Sản lượng lũy kế */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 pb-4 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">SẢN LƯỢNG LŨY KẾ</p>
              <p className="text-[11px] text-gray-400 mt-1">{loadingOverview ? "Đang tải..." : `Tháng ${selectedMonth}/${selectedYear}`}</p>
              <div className="mt-3">
                <span className="text-2xl font-black text-gray-900 tracking-tight">{kpiSanLuong.toLocaleString("vi-VN")}</span>
                {kpiSanLuongKeHoach > 0 && (
                  <span className="text-gray-400 text-xs font-semibold ml-1">/ {kpiSanLuongKeHoach.toLocaleString("vi-VN")} tấn</span>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200/70 rounded-2xl px-4 py-2.5 text-center min-w-[110px] shadow-sm">
              <span className="block text-3xl font-black text-[#2563EB] tracking-tight leading-none">{kpiSanLuongTyLe.toLocaleString("vi-VN")}%</span>
              <span className="block text-[10px] font-bold text-[#2563EB]/80 uppercase tracking-wider mt-1.5">Kế hoạch</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 mb-1">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Biểu đồ sản lượng</span>
            {canScrollProd && (
              <span className="text-[10px] text-gray-400">← kéo để xem thêm →</span>
            )}
          </div>
          <div ref={prodBoxRef} className="w-full h-[270px] overflow-x-auto overflow-y-hidden pb-4">
            <BarChart width={prodChartWidth} height={250} data={prodData} margin={{ top: 25, right: 20, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={5}
              />
              <Tooltip cursor={{ fill: "rgba(37,99,235,0.04)" }} />
              <Bar 
                dataKey="value" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]} 
                barSize={Math.min(48, prodItemWidth * 0.45)}
                label={(props: any) => {
                  const { x = 0, y = 0, width = 0, value = 0 } = props;
                  return (
                    <text x={Number(x) + Number(width) / 2} y={Number(y) - 10} fill="#2563EB" textAnchor="middle" fontSize={11} fontWeight="700">
                      {Number(value).toLocaleString("vi-VN")} tấn
                    </text>
                  );
                }}
              />
            </BarChart>
          </div>
        </div>

        {/* Card 2: Tiến độ đào lò lũy kế */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 pb-4 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">TIẾN ĐỘ ĐÀO LÒ LŨY KẾ</p>
              <p className="text-[11px] text-gray-400 mt-1">Cập nhật: 10:30 AM, Hôm nay</p>
              <div className="mt-3">
                <span className="text-2xl font-black text-gray-900 tracking-tight">{kpiTienDoThucTe.toLocaleString("vi-VN")}</span>
                {kpiTienDoKeHoach > 0 && (
                  <span className="text-gray-400 text-xs font-semibold ml-1">/ {kpiTienDoKeHoach.toLocaleString("vi-VN")} mét</span>
                )}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200/70 rounded-2xl px-4 py-2.5 text-center min-w-[110px] shadow-sm">
              <span className="block text-3xl font-black text-[#EA580C] tracking-tight leading-none">{kpiTienDoTyLe.toLocaleString("vi-VN")}%</span>
              <span className="block text-[10px] font-bold text-[#EA580C]/80 uppercase tracking-wider mt-1.5">Kế hoạch</span>
            </div>
          </div>
          
          {/* Tăng chiều cao h-[180px] -> h-[250px] giúp biểu đồ vùng dốc lên nhìn trực quan hơn */}
          <div className="flex items-center gap-1.5 mt-4 mb-1">
            {canScrollProg && (
              <span className="text-[10px] text-gray-400 ml-auto">← kéo để xem thêm →</span>
            )}
          </div>
          <div ref={progBoxRef} className="w-full h-[270px] overflow-x-auto overflow-y-hidden pb-4">
            <AreaChart width={progChartWidth} height={250} data={progData} margin={{ top: 25, right: 25, left: 25, bottom: 5 }}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#FFF7ED" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={5}
              />
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
                label={(props: any) => {
                  const { x = 0, y = 0, value } = props;
                  return (
                    <text x={Number(x)} y={Number(y) - 10} fill="#EA580C" textAnchor="middle" fontSize={11} fontWeight="700">
                      {value === 0 ? "0 mét" : `${value} mét`}
                    </text>
                  );
                }}
              />
            </AreaChart>
          </div>
        </div>
      </div>

      {/* COMPACT MAX: Thu hẹp triệt để phần bảng để nhường diện tích cho biểu đồ */}
      <div className="bg-white/80 rounded-xl border border-gray-100 overflow-hidden shadow-sm mt-1">
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cảnh báo mới nhất</span>
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

  // Tính toán thông số cho SVG Line Chart dựa trên tên biến mới
  const svgWidth = 600;
  const svgHeight = 200;
  const stepX = modalChartData.length > 0 ? svgWidth / modalChartData.length : svgWidth;

  const maxProg = Math.max(...modalChartData.map(d => d.prog), 1);
  const points = modalChartData.map((d, i) => {
    const x = stepX * i + (stepX / 2);
    const y = 170 - (d.prog / maxProg) * 140;
    return { x, y, value: d.prog, date: d.date };
  });

  const linePath = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : "";
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},180 L ${points[0].x},180 Z`
    : "";

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

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{tunnelName}</h2>
            <p className="text-sm text-gray-500">Tổng cộng lũy kế</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - 2x2 Grid */}
        <div className="grid grid-cols-2">
          {/* Top Left: Sản lượng */}
          <div className="p-8 border-b border-r border-gray-100">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Sản lượng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] leading-none font-bold text-[#1D4ED8]">{totalProd.toLocaleString('vi-VN')}</span>
              <span className="text-base text-gray-700 font-medium">tấn</span>
            </div>
          </div>

          {/* Top Right: Tiến độ đào lò */}
          <div className="p-8 border-b border-gray-100">
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
              {modalChartData.map((d, i) => (
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
  const [tunnelData, setTunnelData] = useState<TunnelData[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState("");
  const [selectedTunnelName, setSelectedTunnelName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    let cancelled = false;
    async function loadDetail() {
      setLoadingDetail(true);
      setDetailError("");
      try {
        const url = `${N8N_DUONG_LO_URL}?thang=${selectedMonth}&nam=${selectedYear}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server trả về ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setTunnelData(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setDetailError(err?.message || "Lỗi tải dữ liệu đường lò");
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    }
    loadDetail();
    return () => { cancelled = true; };
  }, [selectedMonth, selectedYear, refreshTick]);

  // Mỗi đường lò chỉ giữ 1 dòng (dòng cuối cùng theo `ngay` ASC từ SQL → lũy kế lớn nhất)
  const latestByTunnel = useMemo(() => {
    const map = new Map<string, TunnelData>();
    for (const row of tunnelData) {
      map.set(row.duong_lo, row); // overwrite: dòng cuối cùng trong mảng đã sort theo ngay ASC là dòng mới nhất
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
  // API hiện không trả về "trạng thái" cảnh báo → tạm để 0, có thể tính lại sau từ `tinh_trang`
  const warningCount = 0;
  const criticalCount = 0;

  return (
    <div className="p-8 flex flex-col gap-6 bg-gray-50/30 select-none min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 flex-shrink-0" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Báo cáo chi tiết
      </h1>

      {/* Bộ lọc tháng/năm */}
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
          onClick={() => setRefreshTick(t => t + 1)}
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
                  <span className="text-2xl font-bold text-[#1E40AF]" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{totalTunnels}</span>
                </div>
             </div>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-[#1E40AF] bg-[#D1DEFF] rounded-full">
            đang hoạt động
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
        </div>
      </div>

      {/* Table Content Card */}
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
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">
                    {detailError ? "" : "Không có dữ liệu đường lò trong tháng này."}
                  </td>
                </tr>
              )}
              {loadingDetail && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">
                    Đang tải dữ liệu...
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
  const [screen, setScreen] = useState<Screen>("overview");
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
        {screen === "history"  && <HistoryScreen />}
        {screen === "overview" && <OverviewScreen onOpenAlert={goToAlert} />}
        {screen === "detail"   && <DetailScreen />}
        {screen === "alerts"   && <AlertScreen initialAlertId={pendingAlertId} />}
      </main>
    </div>
  );
}