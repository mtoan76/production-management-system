import * as React from 'react';
import { useState, useRef, useEffect, useMemo, createElement, Component, ErrorInfo, ReactNode } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,AreaChart, Area,
  Tooltip,
} from "recharts";
import {
  Upload, Bell, BarChart2, List, AlertTriangle, CheckCircle,
  Info, Search, X, Eye, Clock, MapPin, User, LogOut,
  AlertCircle, TrendingUp, ChevronRight, ChevronDown,
  Layers, XCircle,Loader2, Download, History,
  FileText, Sparkles, Filter, ArrowUpRight,
  FileSpreadsheet, FileImage, CheckCircle2, Package,
  Calendar,
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

function HistoryStatusBadge({ status }: { status: string }) {
  // Fallback an toàn: nếu status không có trong HISTORY_STATUS_CFG (vd: từ DB trả về "Bình thường"/"Cảnh báo"/"Nghiêm trọng")
  // thì dùng config mặc định (xanh lá) để không crash trang.
  const cfg = HISTORY_STATUS_CFG[status as HistoryStatus] ?? HISTORY_STATUS_CFG["Hoàn thành"];
  const isFallback = !(HISTORY_STATUS_CFG[status as HistoryStatus]);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
      {isFallback && <span className="text-[10px] opacity-50">(?)</span>}
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
  "Mới":          { badge:"bg-orange-50 border border-orange-200", textColor:"text-orange-700" },
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
function SeverityBadge({ severity }: { severity: string }) {
  // Fallback an toàn: nếu severity không có trong SEVERITY_CFG (vd: "Bình thường" từ DB) thì dùng config mặc định
  const cfg = SEVERITY_CFG[severity as SeverityType] ?? SEVERITY_CFG["Cảnh báo"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge} ${cfg.textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {severity}
    </span>
  );
}

function AlertStatusBadge({ status }: { status: string }) {
  // Fallback an toàn: nếu status không có trong map (vd: "Mới" từ DB nhưng chưa có config), dùng "Mới" làm mặc định
  const cfg = ALERT_STATUS_CFG[status as AlertStatus] ?? ALERT_STATUS_CFG["Mới"];
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

function Sidebar({ active, onNav, criticalCount = 0 }: { active: Screen; onNav:(s:Screen)=>void; criticalCount?: number }) {
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

// ─── URL server ──────────────────────────────────────────────────────────
// Submit (NHẬP báo cáo mới) → Cloudflare Worker → n8n (qua DuckDNS hostname)
//   Worker giải quyết Mixed Content: HTTPS Vercel → HTTP n8n không bị browser chặn
// Đọc dữ liệu (overview, duong-lo, bao-cao, canh-bao) → gọi Vercel Serverless Function
//   (Express server cũ chỉ dùng cho local dev, production dùng /api/* trên Vercel)
const N8N_WEBHOOK_URL =
  (import.meta as any)?.env?.VITE_N8N_WEBHOOK_URL
  || "https://n8n-proxy.manhtoan7620005.workers.dev/webhook/nhap-bao-cao";

// URL lấy dữ liệu tổng quan — Express server (đã có sẵn, kết nối trực tiếp DB)
const N8N_OVERVIEW_URL =
  (import.meta as any)?.env?.VITE_N8N_OVERVIEW_URL || `/api/tong-quan`;

// URL lấy dữ liệu đường lò — Express server
const N8N_DUONG_LO_URL =
  (import.meta as any)?.env?.VITE_N8N_DUONG_LO_URL || `/api/duong-lo`;

// URL lấy danh sách báo cáo đã nộp — Express server
const N8N_BAO_CAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_LIST_URL || `/api/bao-cao`;

// URL lấy chi tiết 1 báo cáo — Express server (Express có path param :id)
const N8N_BAO_CAO_DETAIL_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_DETAIL_URL || `/api/bao-cao`;

// URL lấy danh sách cảnh báo — Express server
const N8N_CANH_BAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_CANH_BAO_LIST_URL || `/api/canh-bao`;

// URL lấy chi tiết 1 cảnh báo — Express server (filter client-side từ list, không cần gọi riêng)
const N8N_CANH_BAO_DETAIL_URL =
  (import.meta as any)?.env?.VITE_N8N_CANH_BAO_DETAIL_URL || `/api/canh-bao`;

// URL lấy danh sách đường lò chi tiết (tiết diện + mét theo ca) cho từng công trường
// Backend trả về: { data: { daoLo: TunnelRow[], xenLo: TunnelRow[], chongDoi: TunnelRow[] } }
// TunnelRow: { duong_lo, tiet_dien?, tien_do, ca1, ca2, ca3 }
const N8N_CONG_TRUONG_CHITIET_URL =
  (import.meta as any)?.env?.VITE_N8N_CONG_TRUONG_CHITIET_URL || `/api/cong-truong-chi-tiet`;


// ─── Kiểu dữ liệu trả về từ 2 truy vấn tổng quan ───────────
type MonthSummary = {
  thang: string | number;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};
type DaySummary = {
  ngay: string;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};
type KpiLoaiItem = { thuc_te: number; ke_hoach_nam: number; ty_le: number };
type KpiSummary = {
  lo_cho: KpiLoaiItem;
  dao_lo: KpiLoaiItem;
  xen_lo: KpiLoaiItem;
  chong_doi: KpiLoaiItem;
};
type TunnelData = {
  duong_lo: string;
  ngay_bao_cao: string;
  thoi_gian_bao_cao: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};

// Chi tiết đường lò trong 1 công trường (dùng cho bảng drill-down bên trong popup công trường)
type TunnelChiTiet = {
  duong_lo: string;
  // Tiết diện (m²) — chỉ áp dụng cho đào lò / xén lò. Chống đội không có tiết diện → undefined
  tiet_dien?: number;
  // Mét lũy kế (đã làm xong từ đầu tháng tới giờ)
  tien_do: number;
  // Mét theo từng ca (Ca 1 / Ca 2 / Ca 3). Nếu backend không tách được → tất cả để 0
  ca1: number;
  ca2: number;
  ca3: number;
};
type CongTruongChiTiet = {
  daoLo: TunnelChiTiet[];
  xenLo: TunnelChiTiet[];
  chongDoi: TunnelChiTiet[];
};
type BaoCaoListItem = {
  report_id: number;
  created_at: string;
  ngay: string | null;
  cong_truong: string | null;
  so_lao_dong: number | null;
  so_ca: number;
  tong_so_lao_dong: number;
  co_su_co: boolean;
};
type CaHangMuc = {
  id: number;
  duong_lo: string | null;
  loai_cong_viec: string;
  san_luong: string | number | null;
  tiet_dien: string | number | null;
  tiet_dien_don_vi: string | null;
};
type CaData = {
  ca: number;
  ngay: string | null;
  cong_truong: string | null;
  so_lao_dong: string | number | null;
  cong_viec_khac: string | null;
  su_co: string | null;
  ghi_chu: string | null;
  hang_muc_by_type: {
    lo_cho: CaHangMuc[];
    dao_lo: CaHangMuc[];
    xen_lo: CaHangMuc[];
    chong_doi: CaHangMuc[];
  };
};
type BaoCaoDetail = {
  report: { id: number; created_at: string };
  ca_list: CaData[];
};
type CanhBaoListItem = {
  id: number;
  report_id: number;
  ngay: string | null;
  ca: number | null;
  duong_lo: string | null;
  vi_tri: string | null;
  severity: string;
  noi_dung: string;
  mo_ta: string | null;
  trang_thai: string;
  nguoi_xu_ly: string | null;
  ghi_chu_xu_ly: string | null;
  created_at: string;
  updated_at: string;
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
  const sanLuong  = getSanLuong(item);
  const tienDo    = item.tien_do_dao_lo ?? item.xen_lo_2;   // tiến độ đào lò (AI trả về)
  const tinhTrang = item.tinh_trang;
  const canhBao   = item.noi_dung_canh_bao;
  const hasCanhBao = !!canhBao && !normalizeVN(canhBao).includes("khong co");
  const isBinhThuong = !tinhTrang || normalizeVN(tinhTrang).includes("binh thuong");

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{item.don_vi_thi_cong || "Không rõ đơn vị"}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="inline-flex items-center gap-1"><Clock size={11} />{item.ngay || "--"} · Ca {item.ca ?? "--"}</span>
            {item.nguoi_bao_cao && (
              <span className="inline-flex items-center gap-1"><User size={11} />{item.nguoi_bao_cao}</span>
            )}
            {item.duong_lo && (
              <span className="inline-flex items-center gap-1"><MapPin size={11} />{item.duong_lo}</span>
            )}
          </div>
        </div>
        {tinhTrang && <StatusPill status={tinhTrang} />}
      </div>

      {/* 3 stat boxes: Sản lượng + Tiến độ + Bố trí */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center">
          <p className="text-base font-black text-blue-700">
            {sanLuong !== undefined ? sanLuong.toLocaleString("vi-VN") : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Sản lượng (tấn)</p>
        </div>
        <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-center">
          <p className="text-base font-black text-orange-600">
            {tienDo !== undefined && tienDo !== null ? tienDo : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Tiến độ đào (mét)</p>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-center">
          <p className="text-sm font-bold text-gray-900 truncate" title={item.bo_tri_lao_dong || ""}>
            {item.bo_tri_lao_dong || (item.so_lao_dong ? `${item.so_lao_dong} LĐ` : "—")}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Bố trí / LĐ</p>
        </div>
      </div>

      {/* Ghi chú (nếu có) */}
      {item.ghi_chu && (
        <p className="text-xs text-gray-600 mb-2 px-2 py-1 rounded bg-gray-50 border border-gray-100">
          <span className="text-gray-400 font-semibold">Ghi chú:</span> {item.ghi_chu}
        </p>
      )}

      {/* Cảnh báo - luôn hiển thị, "Không có" nếu rỗng */}
      <div
        className="flex items-start gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg"
        style={
          hasCanhBao
            ? { background: "#FEF2F2", border: "1px solid #FECACA" }
            : { background: "#F9FAFB", border: "1px solid #E5E7EB" }
        }
      >
        <AlertTriangle
          size={13}
          color={hasCanhBao ? "#DC2626" : "#9CA3AF"}
          className="mt-0.5 flex-shrink-0"
        />
        <p className="text-xs" style={{ color: hasCanhBao ? "#991B1B" : "#6B7280" }}>
          <span className="font-semibold">Cảnh báo: </span>
          {hasCanhBao ? canhBao : "Không có"}
        </p>
      </div>
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
type TemplateType = "daolo" | "khai_thac";
type FileValidation = {
  valid: boolean;
  type?: TemplateType;
  error?: string;
};
const TEMPLATE_FILES: Record<TemplateType, { url: string; name: string; label: string }> = {
  daolo: {
    url: "/templates/baocaocongtruong_daolo.xlsx",
    name: "baocaocongtruong_daolo.xlsx",
    label: "Báo cáo Đào lò",
  },
  khai_thac: {
    url: "/templates/baocaocongtruong_Khai thac.xlsx",
    name: "baocaocongtruong_Khai thac.xlsx",
    label: "Báo cáo Khai thác",
  },
};

// Validate file Excel: check Row 2 headers to determine template type
async function validateExcelFile(file: File): Promise<FileValidation> {
  const excelMatch = file.name.match(/\.xlsx$/i);
  if (!excelMatch) {
    return { valid: false, error: "Chỉ chấp nhận file Excel (.xlsx) theo đúng template mẫu. Vui lòng tải template Đào lò hoặc Khai thác ở mục 1." };
  }
  try {
    const buffer = await file.arrayBuffer();
    // Dynamic import xlsx (đã được cài đặt)
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer);
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return { valid: false, error: "File Excel rỗng" };
    const sheet = wb.Sheets[sheetName];
    const ref = sheet["!ref"];
    if (!ref) return { valid: false, error: "Không đọc được header file" };
    const range = XLSX.utils.decode_range(ref);
    // Đọc Row index 2 (hàng thứ 3) - chứa header chính
    const headers: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 2, c });
      const cell = sheet[addr];
      headers.push(cell?.v?.toString().trim() || "");
    }
    // Marker phân biệt:
    // Đào lò: col index 5 = "Đường lò đào" (không chứa "tấn than")
    // Khai thác: col index 5 = "Lò chợ ... (tấn than)"
    const col5 = (headers[5] || "").toLowerCase();
    const hasTanThan = col5.includes("tấn than") || col5.includes("lò chợ");
    const hasDuongLoDao = col5.includes("đường lò đào");
    if (hasTanThan) return { valid: true, type: "khai_thac" };
    if (hasDuongLoDao) return { valid: true, type: "daolo" };
    return {
      valid: false,
      error: "File không đúng cấu trúc template. Vui lòng tải template mẫu (Đào lò hoặc Khai thác) và điền theo đúng định dạng.",
    };
  } catch (e: any) {
    return { valid: false, error: "Không thể đọc file Excel: " + (e?.message || "lỗi không xác định") };
  }
}

function InputScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<FileValidation | null>(null);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = async (f: File | null) => {
    setFile(f);
    setValidation(null);
    if (!f) return;
    setValidating(true);
    const result = await validateExcelFile(f);
    setValidation(result);
    setValidating(false);
  };

  const handleDownloadTemplate = (type: TemplateType) => {
    const tpl = TEMPLATE_FILES[type];
    const link = document.createElement("a");
    link.href = tpl.url;
    link.download = tpl.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitReport = async () => {
    // Guard chống double-click: state chưa kịp update thì request thứ 2 đã bắn đi
    if (status === "processing") return;

    // Kiểm tra nếu người dùng chưa nhập gì cả thì cảnh báo
    if (!file) {
      alert("Vui lòng tải lên tệp báo cáo!");
      return;
    }
    // Kiểm tra validation (chỉ áp dụng cho file Excel)
    if (validation && !validation.valid) {
      alert(validation.error || "File không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    // 1. Tạo đối tượng FormData để chứa cả File lẫn Text
    const formData = new FormData();

    if (file) {
      formData.append("file", file); // Đính kèm file excel/ảnh
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

        // Chuẩn hoá dữ liệu trả về thành 1 mảng ReportItem
        let items: ReportItem[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray((data as any).data)) {
          items = (data as any).data;
        } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
          items = [data as ReportItem];
        }

        // 🔴 Validate: n8n trả 200 OK nhưng có thể flow fail bên trong
        // (vd: AI rate-limit, Excel parse lỗi, exception trong Code node…)
        // Nếu flow fail, response thường rỗng hoặc có field `error` / `success: false`
        const hasExplicitError = !!(
          data?.error ||
          data?.success === false ||
          (typeof data?.message === "string" && /error|lỗi|exception/i.test(data.message))
        );

        if (items.length === 0 || hasExplicitError) {
          setErrorMessage(
            hasExplicitError && typeof data.error === "string"
              ? `n8n báo lỗi: ${data.error}`
              : "n8n đã xử lý xong nhưng không trả về dữ liệu báo cáo. Vui lòng kiểm tra workflow (đặc biệt là HTTP Request gọi AI)."
          );
          setStatus("error");
          return; // ⚠️ KHÔNG xóa file/text → user sửa rồi thử lại
        }

        setReportItems(items);
        setStatus("success");
        // Reset lại form sau khi gửi xong
        setFile(null);
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

  return (
    <div className="p-8 min-h-full flex flex-col relative">
      <SubmitOverlay status={status} errorMessage={errorMessage} reportItems={reportItems} onClose={closeOverlay} onNavigate={onNavigate} />

      <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        Nhập báo cáo mới
      </h1>

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* ─── Bước 1: Tải template mẫu (2 lựa chọn) ───────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-sm font-semibold text-gray-800">Tải template mẫu</span>
            <span className="text-xs text-gray-500 ml-1">— chọn đúng loại công trường bạn muốn nộp báo cáo</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownloadTemplate("daolo")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={20} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">Template Đào lò</div>
                <div className="text-[11px] text-gray-500 truncate">Báo cáo công trường đào lò (m, m², vì)</div>
              </div>
              <Download size={16} className="text-blue-600 flex-shrink-0" />
            </button>
            <button
              onClick={() => handleDownloadTemplate("khai_thac")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-400 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={20} className="text-orange-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">Template Khai thác</div>
                <div className="text-[11px] text-gray-500 truncate">Báo cáo sản lượng than (tấn)</div>
              </div>
              <Download size={16} className="text-orange-600 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* ─── Bước 2 + 3: Điền dữ liệu + Upload file ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-sm font-semibold text-gray-800">Tải lên tệp đã điền</span>
            <span className="text-xs text-gray-400 ml-1">— chỉ chấp nhận Excel (.xlsx) theo đúng template mẫu, tối đa 25MB</span>
          </div>
          <div
            className="flex-1 min-h-[420px] flex flex-col items-center justify-center gap-8 m-6 py-16 px-10 rounded-xl transition-colors cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? "#2563EB" : (validation && !validation.valid ? "#FCA5A5" : "#D1D5DB")}`,
              background: dragging ? "#EFF6FF" : (validation && !validation.valid ? "#FEF2F2" : "#FAFAFA"),
            }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) validateAndSetFile(f); }}
            onClick={() => fileRef.current?.click()}
          >
            {!file ? (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background:"#EFF6FF" }}>
                  <Upload size={36} color="#2563EB" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-lg">Kéo &amp; thả tệp vào đây</p>
                  <p className="text-sm text-gray-400 mt-2">hoặc nhấn để chọn từ máy tính</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background:"#2563EB", whiteSpace:"nowrap" }}
                >
                  Chọn tệp
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-2 w-full">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm w-full max-w-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                    background: file.name.match(/\.(xlsx|csv)$/i) ? "#DCFCE7" : "#DBEAFE"
                  }}>
                    {file.name.match(/\.(xlsx|csv)$/i) ? (
                      <FileSpreadsheet size={20} className="text-green-700" />
                    ) : (
                      <FileImage size={20} className="text-blue-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-gray-800 text-sm truncate">{file.name}</div>
                    <div className="text-[11px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); validateAndSetFile(null); }}
                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa file"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Validation status */}
                {validating && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Loader2 size={14} className="animate-spin" />
                    Đang kiểm tra cấu trúc file...
                  </div>
                )}
                {!validating && validation?.valid && (
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-full max-w-md">
                    <CheckCircle2 size={16} />
                    <span className="font-semibold">Hợp lệ</span>
                    <span className="text-gray-600">·</span>
                    <span>{validation.type === "daolo" ? "Template Đào lò" : validation.type === "khai_thac" ? "Template Khai thác" : "Ảnh"}</span>
                  </div>
                )}
                {!validating && validation && !validation.valid && (
                  <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200 w-full max-w-md">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="text-left">{validation.error}</span>
                  </div>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" className="hidden" accept=".xlsx" onChange={e => validateAndSetFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-5 pt-5 border-t border-gray-200">
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ whiteSpace:"nowrap" }}
          onClick={() => { setFile(null); }}
        >
          Hủy
        </button>
        <button
          onClick={handleSubmitReport}
          disabled={status === "processing" || !file || (validation !== null && !validation.valid)}
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
function HistoryScreen() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [list, setList] = useState<BaoCaoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const PAGE_SIZE = 5;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams();
        if (fromDate) params.set("tu_ngay", fromDate);
        if (toDate)   params.set("den_ngay", toDate);
        if (search.trim()) params.set("cong_truong", search.trim());
        const qs = params.toString();
        const url = `${N8N_BAO_CAO_LIST_URL}${qs ? "?" + qs : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server trả về ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setList(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải lịch sử báo cáo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [refreshTick, search, fromDate, toDate]);

  const openDetail = (id: number) => {
    setSelectedId(id);
  };

  const filtered = list;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const paginated = filtered.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
  const rangeStart = total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(activePage * PAGE_SIZE, total);

  // Format "dd/mm/yyyy HH:mm" từ timestamp ISO
  const fmtDateTime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  // Lấy phần "dd/mm/yyyy" từ timestamp ISO
  const fmtDateOnly = (iso: string) => fmtDateTime(iso).split(" ")[0];

  // Format ngày từ string "yyyy-mm-dd" hoặc ISO
  const fmtDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

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
            placeholder="Tìm kiếm theo công trường..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
          <Calendar size={14} className="text-gray-400" />
          <input
            type="date"
            value={fromDate}
            onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }}
            title="Từ ngày"
            className="bg-transparent text-sm text-gray-700 outline-none w-[130px]"
          />
          <span className="text-gray-400 text-xs">→</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={e => { setToDate(e.target.value); setCurrentPage(1); }}
            title="Đến ngày"
            className="bg-transparent text-sm text-gray-700 outline-none w-[130px]"
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); setCurrentPage(1); }}
              title="Xoá khoảng ngày"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setRefreshTick(t => t + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-60"
          style={{ background:"#2563EB" }}
          title="Làm mới"
        >
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

      {/* Table */}
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
              {paginated.map(item => {
                return (
                  <tr
                    key={item.report_id}
                    onClick={() => openDetail(item.report_id)}
                    className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap align-top text-xs">
                      {fmtDate(item.ngay)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 align-top">
                      {item.cong_truong || <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top text-center font-semibold">
                      {item.so_ca}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap align-top text-center font-semibold tabular-nums">
                      {item.tong_so_lao_dong ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top text-center">
                      {item.co_su_co ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Có
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          Không
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap align-top text-xs">
                      {item.created_at ? (() => {
                        const d = new Date(item.created_at);
                        if (Number.isNaN(d.getTime())) return item.created_at;
                        const pad = (n: number) => String(n).padStart(2, "0");
                        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                      })() : <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      {item.co_su_co ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Có sự cố
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Bình thường
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">{errorMsg ? "" : "Chưa có báo cáo nào trong hệ thống."}</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">Đang tải dữ liệu...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
  const [detail, setDetail] = useState<BaoCaoDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedCas, setExpandedCas] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (historyId == null) return;
    setExpandedCas(new Set()); // reset accordion khi mở report mới
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${N8N_BAO_CAO_DETAIL_URL}?id=${historyId}`);
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

  // Helper format ngày/giờ
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

  // Phân loại sự cố dựa trên text (bất kỳ ca nào có su_co thật sự)
  const hasIncident = caList.some(ca => {
    const s = (ca.su_co || "").trim().toLowerCase();
    return s && !s.includes("bình thường") && !s.includes("không có sự cố");
  });

  // Mapping 4 loại công việc → màu sắc (đồng bộ với Excel template gốc)
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[92vh] overflow-y-auto p-7 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Chi tiết báo cáo
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
              <span>Mã báo cáo: <span className="font-mono font-semibold">#{historyId}</span></span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                Gửi lúc:&nbsp;
                <span className="font-semibold">{ngayGui}</span>
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
          <button
            onClick={onClose}
            title="Đóng"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {loading && (
          <div className="text-sm text-gray-500 py-8 text-center">Đang tải chi tiết báo cáo...</div>
        )}
        {errorMsg && !loading && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
            <AlertTriangle size={14} />{errorMsg}
          </div>
        )}

        {!loading && !errorMsg && detail && caList.length === 0 && (
          <div className="text-sm text-gray-400 italic py-12 text-center">
            Báo cáo này chưa có dữ liệu ca nào.
          </div>
        )}

        {!loading && !errorMsg && caList.length > 0 && (
          <div className="flex flex-col gap-3">
            {caList.map((ca, idx) => {
              const isOpen = expandedCas.has(ca.ca);
              const s = (ca.su_co || "").trim();
              const isInc = s && !s.toLowerCase().includes("bình thường") && !s.toLowerCase().includes("không có sự cố");
              return (
                <div key={ca.ca ?? idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Ca header — click để expand/collapse */}
                  <button
                    onClick={() => toggleCa(ca.ca)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                      <span className="inline-flex items-center justify-center min-w-[44px] px-3 py-1 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#1E40AF,#2563EB)" }}>
                        Ca {ca.ca}
                      </span>
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
                      {/* Thông tin chung của Ca */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <InfoCell label="Ngày" value={fmtDate(ca.ngay)} />
                        <InfoCell label="Công trường" value={ca.cong_truong || "—"} />
                        <InfoCell label="Số lao động" value={`${Number(ca.so_lao_dong) || 0} người`} />
                        <InfoCell
                          label="Trạng thái"
                          value={isInc ? "Có sự cố" : "Bình thường"}
                          tone={isInc ? "red" : "green"}
                        />
                      </div>

                      {(ca.cong_viec_khac || ca.su_co || ca.ghi_chu) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {ca.cong_viec_khac && (
                            <InfoCell label="Công việc khác" value={ca.cong_viec_khac} />
                          )}
                          {ca.su_co && (
                            <InfoCell label="Sự cố" value={ca.su_co} tone={isInc ? "red" : "gray"} />
                          )}
                          {ca.ghi_chu && (
                            <InfoCell label="Ghi chú" value={ca.ghi_chu} />
                          )}
                        </div>
                      )}

                      {/* 4 nhóm hạng mục */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {(["lo_cho", "dao_lo", "xen_lo", "chong_doi"] as const).map(type => {
                          const cfg = TYPE_CFG[type];
                          const items = (ca.hang_muc_by_type?.[type] as any[]) || [];
                          const total = items.reduce((sum, h) => sum + (Number(h.san_luong) || 0), 0);
                          return (
                            <div key={type} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                              <div
                                className="flex items-center justify-between px-4 py-2.5"
                                style={{ background: `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1]})` }}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                  <span className="text-sm font-bold text-white">{cfg.label}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                                  {items.length} mục · {cfg.unit}
                                </span>
                              </div>
                              {items.length === 0 ? (
                                <p className="text-xs text-gray-400 italic px-4 py-3">Không có hạng mục {cfg.label.toLowerCase()} trong ca này.</p>
                              ) : (
                                <div className="divide-y divide-gray-100">
                                  {items.map(h => (
                                    <div key={h.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-gray-50/60 transition-colors">
                                      <div className="col-span-7 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate" title={h.duong_lo || ""}>
                                          {h.duong_lo || "—"}
                                        </p>
                                        {h.tiet_dien && (
                                          <p className="text-[11px] text-gray-500 mt-0.5">
                                            Tiết diện: <strong className="text-gray-700">{Number(h.tiet_dien).toLocaleString("vi-VN")}</strong> {h.tiet_dien_don_vi || "m²"}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-span-5 text-right">
                                        <p className={`text-base font-black tabular-nums ${cfg.accent.split(" ")[2]}`}>
                                          {Number(h.san_luong || 0).toLocaleString("vi-VN")}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{cfg.unit}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className={`px-4 py-2 flex items-center justify-between ${cfg.accent}`}>
                                    <span className="text-[11px] font-bold uppercase tracking-wide">Tổng {cfg.label.toLowerCase()}</span>
                                    <span className="text-sm font-black tabular-nums">
                                      {total.toLocaleString("vi-VN")} {cfg.unit}
                                    </span>
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

// Cell hiển thị thông tin nhỏ trong panel chi tiết
function InfoCell({ label, value, tone = "gray" }: { label: string; value: string; tone?: "gray" | "red" | "green" }) {
  const valueClass = tone === "red"
    ? "text-red-700"
    : tone === "green"
      ? "text-green-700"
      : "text-gray-900";
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 break-words ${valueClass}`}>{value}</p>
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

// ─── VN date parser (API trả "DD/MM/YYYY HH:MM:SS" - JS Date() không parse được) ──
function parseVNDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  // Thử ISO trước
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;
  // Thử DD/MM/YYYY HH:MM:SS
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!m) return null;
  const [, dd, mm, yyyy, hh = "0", mi = "0", ss = "0"] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
  return isNaN(d.getTime()) ? null : d;
}

// ─── Cache module-level cho Overview data ────────────────────────────────────────
// Lưu data ở scope ngoài component → persist khi component unmount/remount (chuyển tab).
// Chỉ fetch lại khi: cache miss cho (month, year) HOẶC user bấm nút refresh (refreshKey).
// Reset cache khi F5/reload (vì đó là fresh page load).
type OverviewCacheData = {
  kpi: KpiSummary | null;
  monthSummary: MonthSummary | null;
  daySummary: DaySummary[];
  monthList: any[];
  tunnelRows: DuongLoRow[];
};
const overviewCache: Map<string, OverviewCacheData> = new Map();

function useOverviewCache(month: number, year: number) {
  const key = `${year}-${month}`;
  const [data, setData] = useState<OverviewCacheData | null>(overviewCache.get(key) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const cacheHit = overviewCache.has(key);
    const shouldFetch = !cacheHit || refreshKey > 0;

    if (!shouldFetch) return; // Tab switch: dùng lại cache, không fetch

    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      fetch(`${N8N_OVERVIEW_URL}?thang=${month}&nam=${year}`).then(r => r.json()),
      fetch(`${N8N_DUONG_LO_URL}?thang=${month}&nam=${year}`).then(r => r.json()),
    ]).then(([tongQuan, duongLo]) => {
      if (cancelled) return;
      const monthArr: MonthSummary[] = Array.isArray(tongQuan?.month) ? tongQuan.month : (tongQuan?.month ? [tongQuan.month] : []);
      const dayArr: DaySummary[] = Array.isArray(tongQuan?.day) ? tongQuan.day : [];
      const newData: OverviewCacheData = {
        kpi: tongQuan?.kpi ?? null,
        monthSummary: monthArr[0] ?? null,
        daySummary: dayArr,
        monthList: tongQuan?.month ?? [],
        tunnelRows: duongLo?.data ?? [],
      };
      overviewCache.set(key, newData);
      setData(newData);
    }).catch(err => {
      if (cancelled) return;
      setError(err.message || "Lỗi tải dữ liệu");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [month, year, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);
  return { data, loading, error, refresh };
}

// ─── Cache module-level cho Công trường data ───────────────────────────────
type CongTruongCacheData = {
  thang: number;
  nam: number;
  remainingDays: number;
  keHoachThang: { lo_cho: number; dao_lo: number; xen_lo: number; chong_doi: number };
  khaiThac: any[];
  daoLo: any[];
};
const congTruongCache: Map<string, CongTruongCacheData> = new Map();

function useCongTruongCache(month: number, year: number) {
  const key = `${year}-${month}`;
  const [data, setData] = useState<CongTruongCacheData | null>(congTruongCache.get(key) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const cacheHit = congTruongCache.has(key);
    const shouldFetch = !cacheHit || refreshKey > 0;

    if (!shouldFetch) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`${N8N_OVERVIEW_URL.replace('/tong-quan', '/cong-truong')}?thang=${month}&nam=${year}`)
      .then(r => r.json())
      .then(result => {
        if (cancelled) return;
        const newData: CongTruongCacheData = {
          thang: result.thang,
          nam: result.nam,
          remainingDays: result.remainingDays,
          keHoachThang: result.keHoachThang,
          khaiThac: result.khaiThac || [],
          daoLo: result.daoLo || [],
        };
        congTruongCache.set(key, newData);
        setData(newData);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || "Lỗi tải dữ liệu công trường");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [month, year, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);
  return { data, loading, error, refresh };
}

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

  // State cho chart modal (khi click vào số liệu chính)
  const [chartModalOpen, setChartModalOpen] = useState<null | "lo_cho" | "dao_lo" | "xen_lo" | "chong_doi">(null);
  // tunnelRows, tunnelLoading, monthSummary, daySummary, kpi đã lấy từ useOverviewCache ở trên

  // ─── Dữ liệu tổng quan - dùng hook với module-level cache ─────────────
  // Cache persist qua các lần chuyển tab → không fetch lại khi vào lại trang.
  // Chỉ fetch: cache miss HOẶC user bấm nút refresh.
  const {
    data: overviewCacheData,
    loading: loadingOverview,
    error: overviewError,
    refresh: refreshOverview,
  } = useOverviewCache(selectedMonth, selectedYear);
  const kpi = overviewCacheData?.kpi ?? null;
  const monthSummary = overviewCacheData?.monthSummary ?? null;
  const daySummary = overviewCacheData?.daySummary ?? [];
  const monthList = overviewCacheData?.monthList ?? [];
  const tunnelRows = overviewCacheData?.tunnelRows ?? [];

  // ─── Kế hoạch tháng (chia đều từ kế hoạch năm) ─────────────────────────────
  const kpiSLKH = (kpi as any)?.lo_cho?.ke_hoach_nam ?? 0;
  const kpiTDKH = (kpi as any)?.dao_lo?.ke_hoach_nam ?? 0;
  const keHoachThangSL = Number(kpiSLKH) / 12;
  const keHoachThangTD = Number(kpiTDKH) / 12;

  // ─── Số ngày còn lại trong tháng/năm hiện tại (để tính TB cần/ngày) ───────
  const today = new Date();
  const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const isSelectedCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1;
  const isSelectedFutureMonth = selectedYear > today.getFullYear() || (selectedYear === today.getFullYear() && selectedMonth > today.getMonth() + 1);
  const remainingDaysMonth = isSelectedCurrentMonth
    ? Math.max(daysInSelectedMonth - today.getDate(), 0)
    : isSelectedFutureMonth
      ? daysInSelectedMonth
      : 0;

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalDaysYear = isLeapYear(selectedYear) ? 366 : 365;
  const isSelectedCurrentYear = selectedYear === today.getFullYear();
  const isSelectedFutureYear = selectedYear > today.getFullYear();
  const dayOfYearToday = Math.floor((today.getTime() - new Date(selectedYear, 0, 1).getTime()) / 86400000) + 1;
  const remainingDaysYear = isSelectedCurrentYear
    ? Math.max(totalDaysYear - dayOfYearToday, 0)
    : isSelectedFutureYear
      ? totalDaysYear
      : 0;

  // Bảng dữ liệu theo ngày trong tháng, dùng cho 4 biểu đồ
  const dayProdChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.lo_cho_luy_ke) || 0 }));
  const dayDaoLoChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.dao_lo_luy_ke) || 0 }));
  const dayXenLoChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.xen_lo_luy_ke) || 0 }));
  const dayChongDoiChart = daySummary.map(d => ({ day: d.ngay, value: Number(d.chong_doi_luy_ke) || 0 }));

  // Chế độ "Theo tháng": hiện chỉ có 1 tháng đang chọn (chưa có truy vấn xu hướng nhiều tháng),
  // nên tạm hiển thị đúng 1 cột bằng dữ liệu lũy kế của tháng đó.
  const monthProdChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.lo_cho_luy_ke) || 0 }]
    : [];
  const monthDaoLoChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.dao_lo_luy_ke) || 0 }]
    : [];
  const monthXenLoChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.xen_lo_luy_ke) || 0 }]
    : [];
  const monthChongDoiChart = monthSummary
    ? [{ day: `Th${monthSummary.thang}`, value: Number(monthSummary.chong_doi_luy_ke) || 0 }]
    : [];

  // Get chart data based on selected type and view mode
  const getChartData = (type: LoaiCongViec) => {
    switch (type) {
      case "lo_cho":
        return chartView === "month" ? monthProdChart : dayProdChart;
      case "dao_lo":
        return chartView === "month" ? monthDaoLoChart : dayDaoLoChart;
      case "xen_lo":
        return chartView === "month" ? monthXenLoChart : dayXenLoChart;
      case "chong_doi":
        return chartView === "month" ? monthChongDoiChart : dayChongDoiChart;
    }
  };


  // Lấy lũy kế theo từng loại từ data API mới (4 loại)
  type LoaiCongViec = "lo_cho" | "dao_lo" | "xen_lo" | "chong_doi";
  const LOAI_LIST: { type: LoaiCongViec; gradient: [string, string]; unit: string }[] = [
    { type: "lo_cho",   gradient: ["#1E40AF", "#2563EB"], unit: "tấn" },
    { type: "dao_lo",   gradient: ["#92400E", "#D97706"], unit: "mét" },
    { type: "xen_lo",    gradient: ["#065F46", "#10B981"], unit: "mét" },
    { type: "chong_doi", gradient: ["#7C2D12", "#EA580C"], unit: "mét" },
  ];
  // Lấy lũy kế tháng hiện tại (cumulative từ ngày đầu tháng tới ngày chọn)
  const lastDayRow = daySummary.length > 0 ? daySummary[daySummary.length - 1] : null;
  // Build per-type giá trị theo viewMode
  // month view → lấy từ kpi (year cumulative)
  // day view → lấy từ lastDayRow (month cumulative)
  const typeValues: Record<LoaiCongViec, { current: number; unit: string; keHoachNam: number; keHoachThang: number }> = {} as any;
  for (const { type, unit } of LOAI_LIST) {
    const keHoachNam = (kpi as any)?.[type]?.ke_hoach_nam || 0;
    const currentYear = Number((kpi as any)?.[type]?.thuc_te) || 0;
    const currentMonth = lastDayRow ? Number((lastDayRow as any)[type + "_luy_ke"]) || 0 : 0;
    const current = chartView === "month" ? currentYear : currentMonth;
    const keHoachThang = Math.round(keHoachNam / 12);
    typeValues[type] = { current, unit, keHoachNam, keHoachThang };
  }
  const remainingDays = chartView === "month" ? remainingDaysYear : remainingDaysMonth;
  const periodLabel = chartView === "month" ? "năm" : "tháng";

  // Default chart data for width calculation (using sản lượng as default)
  const defaultChartData = getChartData("lo_cho");
  const progChartData = getChartData("dao_lo");

  // Chỉ hiển đúng 7 cột/điểm trong khung nhìn, phần còn lại cuộn ngang để xem tiếp.
  // Đo chiều rộng thực tế của từng khung để chia đều cho đúng số cột/điểm muốn hiển thị,
  // bất kể khung rộng/hẹp thế nào tuỳ theo layout thực tế trên máy người dùng.
  const VISIBLE_ITEMS = 7;
  const [prodBoxRef, prodBoxWidth] = useContainerWidth<HTMLDivElement>();
  const [progBoxRef, progBoxWidth] = useContainerWidth<HTMLDivElement>();
  const prodItemWidth = Math.max(50, prodBoxWidth / VISIBLE_ITEMS);
  const progItemWidth = Math.max(50, progBoxWidth / VISIBLE_ITEMS);
  const prodChartWidth = Math.max(prodBoxWidth, defaultChartData.length * prodItemWidth);
  const progChartWidth = Math.max(progBoxWidth, progChartData.length * progItemWidth);
  const canScrollProd = defaultChartData.length > VISIBLE_ITEMS;
  const canScrollProg = progChartData.length > VISIBLE_ITEMS;

  // ─── Dữ liệu Công trường (khai thác & đào lò) ──────────────────────────
  const {
    data: congTruongCacheData,
    loading: loadingCongTruong,
    error: congTruongError,
    refresh: refreshCongTruong,
  } = useCongTruongCache(selectedMonth, selectedYear);
  const congTruongData = congTruongCacheData ?? null;
  const rawKhaiThacSites = congTruongData?.khaiThac || [];
  const rawDaoLoSites = congTruongData?.daoLo || [];
  const congTruongRemainingDays = congTruongData?.remainingDays ?? 0;
  const keHoachThang = congTruongData?.keHoachThang || { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };

  // Rút gọn tên công trường:
  //  - "CT Khai thác 1"     -> "1"  (chỉ lấy số)
  //  - "Cơ giới hóa 1"      -> "Cơ giới hóa 1"  (giữ nguyên để tránh trùng với CT Khai thác 1)
  //  - "CT Đào lò 1"        -> "Đào lò 1"     (giữ phân loại)
  function simplifySiteName(name: string) {
    if (!name) return name;
    // Cơ giới hóa X: giữ nguyên cả cụm vì khác tiền tố khai thác
    if (/^Cơ giới hóa\b/i.test(name)) return name;
    // CT Đào lò X: rút "CT " + số -> "Đào lò X"
    const daoLoMatch = name.match(/^CT\s+Đào lò\s+(\d+)$/i);
    if (daoLoMatch) return `Đào lò ${daoLoMatch[1]}`;
    // CT Khai thác X (mặc định): chỉ lấy số
    const khaiThacMatch = name.match(/(\d+)$/);
    if (khaiThacMatch) return khaiThacMatch[1];
    return name;
  }

const khaiThacSites = rawKhaiThacSites.map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong) }));
  const daoLoSites = rawDaoLoSites.map(s => ({ ...s, tenCongTruong: simplifySiteName(s.tenCongTruong) }));
  const [congTruongModalOpen, setCongTruongModalOpen] = useState<null | { site: any; type: "khai_thac" | "dao_lo" }>(null);
  // ─── Drill-down: bảng đường lò bên trong popup công trường ─────────────────
  const [congTruongChiTiet, setCongTruongChiTiet] = useState<CongTruongChiTiet | null>(null);
  const [loadingCongTruongChiTiet, setLoadingCongTruongChiTiet] = useState(false);
  // Modal phụ: chi tiết 1 đường lò (tiết diện + mét theo ca)
  const [tunnelDetailModal, setTunnelDetailModal] = useState<null | {
    duong_lo: string;
    loaiCongViec: "Đào lò" | "Xén lò" | "Chống đội";
    row: TunnelChiTiet;
  }>(null);

  useEffect(() => {
    if (!congTruongModalOpen) {
      setCongTruongChiTiet(null);
      return;
    }
    let cancelled = false;
    setLoadingCongTruongChiTiet(true);
    fetch(`${N8N_CONG_TRUONG_CHITIET_URL}?thang=${selectedMonth}&nam=${selectedYear}&site=${encodeURIComponent(congTruongModalOpen.site.tenCongTruong)}&type=${congTruongModalOpen.type}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled) return;
        const d = data?.data || data || null;
        setCongTruongChiTiet(d && typeof d === "object" ? {
          daoLo: Array.isArray(d.daoLo) ? d.daoLo : [],
          xenLo: Array.isArray(d.xenLo) ? d.xenLo : [],
          chongDoi: Array.isArray(d.chongDoi) ? d.chongDoi : [],
        } : null);
      })
      .catch(() => { if (!cancelled) setCongTruongChiTiet(null); })
      .finally(() => { if (!cancelled) setLoadingCongTruongChiTiet(false); });
    return () => { cancelled = true; };
  }, [congTruongModalOpen, selectedMonth, selectedYear]);

  // Tổng hợp dữ liệu đường lò: lấy dòng cumulative cuối cùng của mỗi tunnel
  type TunnelAgg = { id: string; name: string; san_luong: number; tien_do: number; lastReport: string };
  const tunnelAggregated: TunnelAgg[] = useMemo(() => {
    const map = new Map<string, TunnelAgg>();
    for (const row of tunnelRows) {
      const existing = map.get(row.duong_lo);
      if (!existing || (row.thoi_gian_bao_cao || "") > existing.lastReport) {
        map.set(row.duong_lo, {
          id: row.duong_lo,
          name: `Đường lò ${row.duong_lo}`,
          san_luong: Number(row.san_luong_luy_ke) || 0,
          tien_do: Number(row.tien_do_luy_ke) || 0,
          lastReport: row.thoi_gian_bao_cao || "",
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [tunnelRows]);

  return (
    <div className="p-8 flex flex-col gap-6 min-h-screen overflow-y-auto bg-[#F8FAFC]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Báo cáo tổng quan
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Cập nhật: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}, Hôm nay ·{" "}
            {chartView === "month" ? `Năm ${selectedYear}` : `Tháng ${selectedMonth}/${selectedYear}`}
          </p>
        </div>

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
              <option value="month">Theo tháng </option>
              <option value="day">Theo ngày </option>
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
            onClick={refreshOverview}
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

      {/* ─── Section 1: 4 KPI cards (Sản lượng / Đào lò / Xén lò / Chống đội) ────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* ─── 4 KPI cards dynamic theo LOAI_LIST ──────────────────────────── */}
        {LOAI_LIST.map(({ type, gradient, unit }) => {
          const val = typeValues[type];
          const keHoach = chartView === "month" ? val.keHoachNam : val.keHoachThang;
          const phanTram = val.keHoachNam > 0 ? Math.round((val.current / val.keHoachNam) * 1000) / 10 : 0;
          const conLai = Math.max(keHoach - val.current, 0);
          const tbNgay = remainingDays > 0 ? conLai / remainingDays : 0;
          const loaiLabelMap: Record<string, string> = {
            lo_cho: "Sản lượng", dao_lo: "Đào lò", xen_lo: "Xén lò", chong_doi: "Chống đội",
          };
          return (
            <div
              key={type}
              onClick={() => setChartModalOpen(type)}
              className="rounded-2xl overflow-hidden shadow-lg p-6 flex flex-col cursor-pointer hover:shadow-2xl transition-shadow"
              style={{ background: `linear-gradient(135deg,${gradient[0]},${gradient[1]})`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              title={`Click để xem biểu đồ ${loaiLabelMap[type]} chi tiết`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setChartModalOpen(type); }}
            >
          <div className="flex justify-between items-start w-full mb-2 gap-2">
            <div>
              <p className="text-[15px] text-white/90 font-bold leading-tight">{loaiLabelMap[type]} lũy kế</p>
              <p className="text-[12px] text-white/70 mt-0.5">
                {loadingOverview ? "Đang tải..." : chartView === "month" ? `Năm ${selectedYear}` : `Tháng ${selectedMonth}/${selectedYear}`}
              </p>
              <div className="mt-3">
                <span className="text-[42px] font-black text-white tracking-tight leading-none">
                  {Math.round(val.current).toLocaleString("vi-VN")}
                </span>
                <span className="text-white/90 text-base font-medium ml-1">
                  / {Math.round(keHoach).toLocaleString("vi-VN")} {unit}
                </span>
              </div>
            </div>

            <div className="bg-white/20 rounded-full px-3 py-1.5 text-[18px] font-bold text-white flex items-center gap-1 flex-shrink-0 leading-none">
              <ArrowUpRight size={16} />
              {phanTram.toLocaleString("vi-VN")}%
            </div>
          </div>

          {/* Hàng Còn lại + TB cần/ngày */}
          <div className="grid grid-cols-2 gap-3 mt-3 p-3 rounded-xl bg-black/15">
            <div className="text-left">
              <div className="text-[14px] text-white/90 mb-1 font-medium">Còn lại ({periodLabel})</div>
              <div className="text-[24px] font-extrabold text-white leading-tight">
                {Math.round(conLai).toLocaleString("vi-VN")} <span className="text-base font-medium opacity-80">{unit}</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-[14px] text-white/90 mb-1 font-medium">TB cần/ngày ({remainingDays} ngày)</div>
              <div className="text-[24px] font-extrabold text-white leading-tight">
                {Math.round(tbNgay).toLocaleString("vi-VN")} <span className="text-base font-medium opacity-80">{unit}</span>
              </div>
            </div>
          </div>

</div>
      );

        })}
      </div>

      {/* ─── Section 2: 2 bảng Công trường (Khai thác & Đào lò) ───────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-gray-900 text-base" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Chi tiết theo từng công trường</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Lũy kế tháng {selectedMonth}/{selectedYear} · Click vào công trường để xem chi tiết
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg px-2 py-1 text-[11px] text-blue-700 font-semibold">
            Tháng {selectedMonth}/{selectedYear}
          </div>
        </div>

        {loadingCongTruong && khaiThacSites.length === 0 && daoLoSites.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">Đang tải dữ liệu công trường...</div>
        ) : khaiThacSites.length === 0 && daoLoSites.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">Chưa có dữ liệu công trường trong tháng này</div>
        ) : (
          <>
            {/* Khai thác */}
            {khaiThacSites.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                  <Package size={20} className="text-orange-600" />
                  <div className="text-xl font-bold text-gray-900">Công trường Khai thác</div>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: "160px" }} />
                      <col style={{ width: "140px" }} />
                      <col style={{ width: "130px" }} />
                      <col style={{ width: "110px" }} />
                      <col style={{ width: "130px" }} />
                      <col style={{ width: "170px" }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Công trường</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Tấn than</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét lò đào</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét xén</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét chống đội</th>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {khaiThacSites.map(site => (
                        <tr
                          key={site.tenCongTruong}
                          onClick={() => setCongTruongModalOpen({ site, type: "khai_thac" })}
                          className="border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-3 py-2.5 font-semibold text-gray-900 whitespace-nowrap">{site.tenCongTruong}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-blue-700 tabular-nums">{Math.round(site.lo_cho).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-orange-600 tabular-nums">{Math.round(site.dao_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-green-600 tabular-nums">{Math.round(site.xen_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-red-600 tabular-nums">{Math.round(site.chong_doi).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-[11px] text-gray-500 whitespace-nowrap">{site.thoiGianBaoCao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Đào lò */}
            {daoLoSites.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <Layers size={20} className="text-blue-600" />
                  <div className="text-xl font-bold text-gray-900">Công trường Đào lò</div>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: "160px" }} />
                      <col style={{ width: "140px" }} />
                      <col style={{ width: "120px" }} />
                      <col style={{ width: "140px" }} />
                      <col style={{ width: "170px" }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Công trường</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét lò đào</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét xén</th>
                        <th className="px-3 py-2.5 text-right font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Mét chống đội</th>
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-600 text-[12px] uppercase tracking-wider">Cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daoLoSites.map(site => (
                        <tr
                          key={site.tenCongTruong}
                          onClick={() => setCongTruongModalOpen({ site, type: "dao_lo" })}
                          className="border-b last:border-0 border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-3 py-2.5 font-semibold text-gray-900 whitespace-nowrap">{site.tenCongTruong}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-orange-600 tabular-nums">{Math.round(site.dao_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-green-600 tabular-nums">{Math.round(site.xen_lo).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-red-600 tabular-nums">{Math.round(site.chong_doi).toLocaleString("vi-VN")}</td>
                          <td className="px-3 py-2.5 text-[11px] text-gray-500 whitespace-nowrap">{site.thoiGianBaoCao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal chi tiết công trường */}
      {congTruongModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCongTruongModalOpen(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header - FIXED */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0 sticky top-0 z-10 bg-white rounded-t-2xl">
              <div>
                <h2 className="font-bold text-gray-900 text-2xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  Chi tiết: {congTruongModalOpen.site.tenCongTruong} ({congTruongModalOpen.type === "khai_thac" ? "Khai thác" : "Đào lò"})
                </h2>
                <p className="text-base text-gray-600 mt-1">
                  Tháng {selectedMonth}/{selectedYear} · Cập nhật: {congTruongModalOpen.site.thoiGianBaoCao}
                </p>
              </div>
              <button
                onClick={() => setCongTruongModalOpen(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(() => {
                  const site = congTruongModalOpen.site;
                  const isKhaiThac = congTruongModalOpen.type === "khai_thac";
                  const items = isKhaiThac
                    ? [
                        { label: "Tấn than (lũy kế)", value: site.lo_cho, unit: "tấn", keHoach: keHoachThang.lo_cho, conLai: site.conLai?.lo_cho, tbNgay: site.tbNgay?.lo_cho },
                        { label: "Mét lò đào (lũy kế)", value: site.dao_lo, unit: "mét", keHoach: keHoachThang.dao_lo, conLai: site.conLai?.dao_lo, tbNgay: site.tbNgay?.dao_lo },
                        { label: "Mét xén (lũy kế)", value: site.xen_lo, unit: "mét", keHoach: keHoachThang.xen_lo, conLai: site.conLai?.xen_lo, tbNgay: site.tbNgay?.xen_lo },
                        { label: "Mét chống đội (lũy kế)", value: site.chong_doi, unit: "mét", keHoach: keHoachThang.chong_doi, conLai: site.conLai?.chong_doi, tbNgay: site.tbNgay?.chong_doi },
                      ]
                    : [
                        { label: "Mét lò đào (lũy kế)", value: site.dao_lo, unit: "mét", keHoach: keHoachThang.dao_lo, conLai: site.conLai?.dao_lo, tbNgay: site.tbNgay?.dao_lo },
                        { label: "Mét xén (lũy kế)", value: site.xen_lo, unit: "mét", keHoach: keHoachThang.xen_lo, conLai: site.conLai?.xen_lo, tbNgay: site.tbNgay?.xen_lo },
                        { label: "Mét chống đội (lũy kế)", value: site.chong_doi, unit: "mét", keHoach: keHoachThang.chong_doi, conLai: site.conLai?.chong_doi, tbNgay: site.tbNgay?.chong_doi },
                      ];
                  return items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl border-2 border-gray-200 p-5">
                      <p className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2">{item.label}</p>
                      <div className="text-[44px] font-black text-gray-900 leading-none">
                        {Math.round(item.value).toLocaleString("vi-VN")}
                        <span className="text-xl font-bold ml-2 opacity-70">{item.unit}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-2 border-gray-200 text-base">
                        <div className="text-center">
                          <div className="text-gray-500 font-semibold mb-1">KH tháng</div>
                          <div className="font-extrabold text-blue-700 text-lg">{Math.round(item.keHoach).toLocaleString("vi-VN")} <span className="text-sm font-bold">{item.unit}</span></div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 font-semibold mb-1">Còn thiếu</div>
                          <div className="font-extrabold text-red-600 text-lg">{Math.round(item.conLai || 0).toLocaleString("vi-VN")} <span className="text-sm font-bold">{item.unit}</span></div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 font-semibold mb-1">TB/ngày ({remainingDays} ng)</div>
                          <div className="font-extrabold text-orange-600 text-lg">{Math.round(item.tbNgay || 0).toLocaleString("vi-VN")} <span className="text-sm font-bold">{item.unit}</span></div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* ─── Bảng drill-down: danh sách đường lò trong công trường ───────── */}
              <div className="border-t-2 border-gray-200 pt-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  Danh sách đường lò trong công trường {congTruongModalOpen.type === "khai_thac" ? "Khai thác" : "Đào lò"} {congTruongModalOpen.site.tenCongTruong}
                </h3>
                {loadingCongTruongChiTiet ? (
                  <div className="text-center py-6 text-base text-gray-500">Đang tải dữ liệu đường lò...</div>
                ) : !congTruongChiTiet ? (
                  <div className="text-center py-6 text-base text-gray-400">Chưa có dữ liệu đường lò cho công trường này.</div>
                ) : (() => {
                    const groups = [
                      { key: "daoLo"    as const, label: "Lò đào",      color: "#D97706", bgHeader: "#FEF3C7", rows: congTruongChiTiet.daoLo,    showTietDien: true  },
                      { key: "xenLo"    as const, label: "Lò xén",      color: "#10B981", bgHeader: "#D1FAE5", rows: congTruongChiTiet.xenLo,    showTietDien: true  },
                      { key: "chongDoi" as const, label: "Lò chống đội", color: "#EA580C", bgHeader: "#FFEDD5", rows: congTruongChiTiet.chongDoi, showTietDien: false },
                    ];
                    // Số hàng của bảng = max(len) trong 3 danh sách
                    const maxRows = Math.max(...groups.map(g => g.rows.length));
                    const total = groups.reduce((s, g) => s + g.rows.length, 0);
                    if (total === 0) {
                      return <div className="text-center py-6 text-base text-gray-400">Công trường này chưa có đường lò nào trong tháng.</div>;
                    }
                    return (
                      <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
                        <table className="w-full text-base table-fixed">
                          <thead>
                            <tr>
                              {groups.map(g => (
                                <th key={g.key} className="px-4 py-3 text-center font-black text-base" style={{ background: g.bgHeader, color: g.color, width: "33.33%" }}>
                                  {g.label} <span className="font-bold opacity-70">({g.rows.length})</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: maxRows }).map((_, idx) => (
                              <tr key={idx} className="border-t border-gray-100">
                                {groups.map(g => {
                                  const row = g.rows[idx];
                                  return (
                                    <td key={g.key} className="px-4 py-3 text-center align-middle">
                                      {row ? (
                                        <button
                                          onClick={() => setTunnelDetailModal({
                                            duong_lo: row.duong_lo,
                                            loaiCongViec: g.label as any,
                                            row,
                                          })}
                                          className="font-bold text-blue-700 text-base hover:text-blue-900 hover:underline transition-colors break-words"
                                        >
                                          {row.duong_lo}
                                        </button>
                                      ) : (
                                        <span className="text-gray-300 text-base">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phụ: chi tiết 1 đường lò (tiết diện + mét theo ca) */}
      {tunnelDetailModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setTunnelDetailModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b-2 border-gray-200">
              <div>
                <h3 className="font-black text-gray-900 text-2xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {tunnelDetailModal.duong_lo}
                </h3>
                <p className="text-base font-semibold text-gray-600 mt-1">
                  {tunnelDetailModal.loaiCongViec} · Lũy kế tháng {selectedMonth}/{selectedYear}
                </p>
              </div>
              <button
                onClick={() => setTunnelDetailModal(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Đóng"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Hàng 1: Tiết diện + Mét lũy kế */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-4">
                  <p className="text-base font-bold text-gray-700 uppercase mb-2">Tiết diện</p>
                  <div className="text-[40px] font-black text-gray-900 leading-none">
                    {tunnelDetailModal.row.tiet_dien !== undefined && tunnelDetailModal.row.tiet_dien !== null ? tunnelDetailModal.row.tiet_dien.toLocaleString("vi-VN") : "—"}
                    {tunnelDetailModal.row.tiet_dien !== undefined && tunnelDetailModal.row.tiet_dien !== null && <span className="text-xl font-bold ml-2 opacity-70">m²</span>}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-4">
                  <p className="text-base font-bold text-gray-700 uppercase mb-2">Mét lũy kế</p>
                  <div className="text-[40px] font-black text-gray-900 leading-none">
                    {Math.round(tunnelDetailModal.row.tien_do).toLocaleString("vi-VN")}
                    <span className="text-xl font-bold ml-2 opacity-70">mét</span>
                  </div>
                </div>
              </div>

              {/* Hàng 2: Mét theo từng ca */}
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-4">
                <p className="text-base font-bold text-gray-700 uppercase mb-3">Mét theo ca</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { label: "Ca 1", value: tunnelDetailModal.row.ca1 },
                    { label: "Ca 2", value: tunnelDetailModal.row.ca2 },
                    { label: "Ca 3", value: tunnelDetailModal.row.ca3 },
                  ]).map(c => (
                    <div key={c.label} className="bg-white rounded-lg border-2 border-gray-200 p-3 text-center">
                      <div className="text-sm font-bold text-gray-500 uppercase mb-1">{c.label}</div>
                      <div className="text-[32px] font-black text-blue-700 leading-none">
                        {Math.round(c.value || 0).toLocaleString("vi-VN")}
                      </div>
                      <div className="text-sm font-bold text-gray-500 mt-1">mét</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* ─── Modal biểu đồ (khi click vào số liệu chính ở 4 thẻ KPI) ────── */}
      {chartModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setChartModalOpen(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Modal Header - FIXED, outside scroll area */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0 sticky top-0 z-10 bg-white rounded-t-2xl">
              <div>
                <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {(() => {
                    const labels: Record<string, string> = {
                      lo_cho: "Biểu đồ sản lượng (lũy kế)",
                      dao_lo: "Biểu đồ đào lò (lũy kế)",
                      xen_lo: "Biểu đồ xén lò (lũy kế)",
                      chong_doi: "Biểu đồ chống đội (lũy kế)",
                    };
                    return labels[chartModalOpen] || "Biểu đồ";
                  })()}
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {chartView === "month" ? "Theo tháng trong năm" : "Theo ngày trong tháng"} · {chartView === "month" ? `Năm ${selectedYear}` : `Tháng ${selectedMonth}/${selectedYear}`}
                </p>
              </div>
              <button
                onClick={() => setChartModalOpen(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Chart (scrollable horizontally) */}
            <div className="p-5 overflow-x-auto overflow-y-hidden">
              {(() => {
                const chartData = getChartData(chartModalOpen);
                const typeConfig: Record<string, { color: string; gradientId: string; isBar: boolean }> = {
                  lo_cho: { color: "#2563EB", gradientId: "colorProdModal", isBar: true },
                  dao_lo: { color: "#EA580C", gradientId: "colorDaoLoModal", isBar: true },
                  xen_lo: { color: "#10B981", gradientId: "colorXenLoModal", isBar: true },
                  chong_doi: { color: "#EA580C", gradientId: "colorChongDoiModal", isBar: true },
                };
                const cfg = typeConfig[chartModalOpen] || typeConfig.lo_cho;
                const chartWidth = chartModalOpen === "lo_cho" ? prodChartWidth : progChartWidth;
                const itemWidth = chartModalOpen === "lo_cho" ? prodItemWidth : progItemWidth;

                if (cfg.isBar) {
                  return (
                    <BarChart width={chartWidth} height={380} data={chartData} margin={{ top: 30, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={5} />
                      <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "rgba(37,99,235,0.04)" }} />
                      <Bar
                        dataKey="value"
                        fill={cfg.color}
                        radius={[4, 4, 0, 0]}
                        barSize={Math.min(48, itemWidth * 0.45)}
                        label={(props: any) => {
                          const { x = 0, y = 0, width = 0, value = 0 } = props;
                          return (
                            <text x={Number(x) + Number(width) / 2} y={Number(y) - 10} fill={cfg.color} textAnchor="middle" fontSize={12} fontWeight="700">
                              {Math.round(Number(value)).toLocaleString("vi-VN")}
                            </text>
                          );
                        }}
                      />
                    </BarChart>
                  );
                } else {
                  return (
                    <LineChart width={chartWidth} height={380} data={chartData} margin={{ top: 30, right: 25, left: 25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={5} />
                      <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line
                        type="linear"
                        dataKey="value"
                        stroke={cfg.color}
                        strokeWidth={2.5}
                        dot={{ fill: cfg.color, r: 4, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 5, fill: cfg.color, strokeWidth: 0 }}
                      />
                    </LineChart>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
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
function AlertModal({ alert, onClose }: { alert: CanhBaoListItem; onClose:()=>void }) {
  const isCritical = alert.severity === "Nghiêm trọng";

  // Format helpers
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const fmtDate = (s?: string | null): string => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  };
  const fmtTime = (s?: string | null): string => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "—";
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  };
  const getInitials = (name: string): string =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
  const getColor = (name: string): string => {
    const colors = ["#047857", "#1D4ED8", "#7C3AED", "#DC2626", "#D97706", "#0891B2", "#BE185D"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    return colors[Math.abs(hash) % colors.length];
  };

  // Vị trí: ghép duong_lo + vi_tri
  const viTriParts = [
    alert.duong_lo,
    alert.vi_tri,
  ].filter(Boolean);
  const viTri = viTriParts.join(" · ") || "—";

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
              <SeverityBadge severity={alert.severity as SeverityType} />
              <AlertStatusBadge status={alert.trang_thai as AlertStatus} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 pr-8">
            {alert.noi_dung}
          </h2>
        </div>

        {/* 3-col info */}
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

        {/* Description */}
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">MÔ TẢ CHI TIẾT</p>
          <div className="rounded-xl p-5 text-sm text-gray-700 leading-relaxed border border-gray-100" style={{ background:"#F8FAFC" }}>
            {alert.mo_ta || alert.noi_dung}
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
  const [tab, setTab]         = useState<AlertTab>("all");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<CanhBaoListItem | null>(null);
  const [list, setList]         = useState<CanhBaoListItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // Helpers format
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const fmtDate = (s?: string | null): string => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  };
  const fmtTime = (s?: string | null): string => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "—";
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  };
  const getInitials = (name: string): string =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
  const getColor = (name: string): string => {
    const colors = ["#047857", "#1D4ED8", "#7C3AED", "#DC2626", "#D97706", "#0891B2", "#BE185D"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch list từ API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
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
        if (cancelled) return;
        setList(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err?.message || "Lỗi tải cảnh báo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [tab, search, refreshTick]);

  // Khi navigate từ Báo cáo tổng quan với initialAlertId → mở modal detail.
  // Dùng ref để chỉ mở 1 lần, tránh bị effect "list" (auto refresh) bật lại modal sau khi user đã đóng.
  const consumedAlertIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (initialAlertId == null) return;
    if (consumedAlertIdRef.current === initialAlertId) return; // đã xử lý rồi
    const found = list.find(a => a.id === initialAlertId);
    if (found) {
      consumedAlertIdRef.current = initialAlertId;
      setTab("all");
      setSelected(found);
    }
  }, [initialAlertId, list]);

  // Khi user đóng modal thủ công, reset consumed flag để lần click sau từ Overview mở lại được
  useEffect(() => {
    if (selected == null) consumedAlertIdRef.current = null;
  }, [selected]);

  const counts = {
    all:      list.length,
    critical: list.filter(a => a.severity === "Nghiêm trọng").length,
    warning:  list.filter(a => a.severity === "Cảnh báo").length,
    normal:   list.filter(a => a.severity === "Bình thường").length,
    resolved: list.filter(a => a.trang_thai === "Đã hoàn thành").length,
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = list.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <div className="p-8 pb-12 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          Trung tâm cảnh báo
        </h1>
        <button
          onClick={() => setRefreshTick(t => t + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
          title="Làm mới"
        >
          <Loader2 size={14} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertTriangle size={14} />{errorMsg}
        </div>
      )}

      {/* 4 summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Tổng cảnh báo", value:counts.all,      sub:"Tất cả trong hệ thống",  color:"#2563EB", bg:"#EFF6FF", Icon:BarChart2 },
          { label:"Nghiêm trọng",  value:counts.critical, sub:"Cần xử lý ngay",         color:"#DC2626", bg:"#FEF2F2", Icon:X },
          { label:"Cảnh báo",      value:counts.warning,  sub:"Đang theo dõi",          color:"#D97706", bg:"#FFFBEB", Icon:AlertTriangle },
          { label:"Đã xử lý",      value:counts.resolved, sub:`Tỉ lệ ${counts.all ? Math.round(counts.resolved/counts.all*100) : 0}%`, color:"#059669", bg:"#ECFDF5", Icon:CheckCircle },
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
              {paginatedData.map(a => {
                const viTri = [a.duong_lo, a.vi_tri].filter(Boolean).join(" · ") || "—";
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="border-b last:border-0 border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900" style={{ whiteSpace:"nowrap" }}>{fmtTime(a.created_at)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{fmtDate(a.ngay || a.created_at)}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{viTri}</td>
                    <td className="px-6 py-4 text-gray-600">{a.noi_dung}</td>
                    <td className="px-6 py-4"><SeverityBadge severity={a.severity as SeverityType} /></td>
                    <td className="px-6 py-4"><AlertStatusBadge status={a.trang_thai as AlertStatus} /></td>
                    <td className="px-6 py-4">
                      {a.nguoi_xu_ly ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ background: getColor(a.nguoi_xu_ly) }}
                          >
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
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                    safePage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
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

// ─── App root (Desktop) ───────────────────────────────────
const SCREEN_STORAGE_KEY = "pms_active_screen";
const VALID_SCREENS: Screen[] = ["input", "history", "overview", "detail", "alerts"];

function DesktopApp() {
  // Khôi phục màn hình từ localStorage khi load (mặc định "overview" nếu chưa có / không hợp lệ)
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = localStorage.getItem(SCREEN_STORAGE_KEY);
      if (saved && (VALID_SCREENS as string[]).includes(saved)) {
        return saved as Screen;
      }
    } catch {}
    return "overview";
  });
  const [pendingAlertId, setPendingAlertId] = useState<number | null>(null);
  // Số chấm đỏ trên sidebar "Trung tâm cảnh báo" = alert Nghiêm trọng chưa xử lý
  const [criticalAlertCount, setCriticalAlertCount] = useState(0);

  // Mỗi khi screen đổi → lưu vào localStorage để F5 không bị reset
  useEffect(() => {
    try {
      localStorage.setItem(SCREEN_STORAGE_KEY, screen);
    } catch {}
  }, [screen]);

  // Fetch số alert Nghiêm trọng chưa xử lý để hiển thị chấm đỏ trên sidebar
  useEffect(() => {
    let cancelled = false;
    async function loadCritical() {
      try {
        const res = await fetch(`${N8N_CANH_BAO_LIST_URL}?severity=${encodeURIComponent("Nghiêm trọng")}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const list: any[] = Array.isArray(data?.data) ? data.data : [];
        const open = list.filter(a => a.trang_thai !== "Đã hoàn thành");
        setCriticalAlertCount(open.length);
      } catch {
        // Im lặng, không show error
      }
    }
    loadCritical();
    // Poll mỗi 60s để badge luôn fresh
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
    <div className="flex h-screen overflow-hidden" style={{ fontFamily:"'Inter',sans-serif", background:"#F4F6F8" }}>
      <Sidebar active={screen} onNav={handleNav} criticalAlertCount={criticalAlertCount} />
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

// ─── App root (auto-detect thiết bị) ───────────────────────
import MobileApp from "./MobileApp";
import { useDeviceDetect } from "./hooks/useDeviceDetect";


// ─── ErrorBoundary (catch runtime errors, show thay vì trắng màn hình) ──────────────
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

export default function App() {
  const isMobile = useDeviceDetect();
  return <ErrorBoundary>{isMobile ? <MobileApp /> : <DesktopApp />}</ErrorBoundary>;
}