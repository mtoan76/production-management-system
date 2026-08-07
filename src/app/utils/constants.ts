import { StatusType } from '../types';

// ─── URL server ──────────────────────────────────────────────────────────
export const N8N_WEBHOOK_URL =
  (import.meta as any)?.env?.VITE_N8N_WEBHOOK_URL
  || "https://n8n-proxy.manhtoan7620005.workers.dev/webhook/nhap-bao-cao";

export const N8N_OVERVIEW_URL =
  (import.meta as any)?.env?.VITE_N8N_OVERVIEW_URL || `/api/tong-quan`;

export const N8N_DUONG_LO_URL =
  (import.meta as any)?.env?.VITE_N8N_DUONG_LO_URL || `/api/duong-lo`;

export const N8N_BAO_CAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_LIST_URL || `/api/bao-cao`;

export const N8N_BAO_CAO_DETAIL_URL =
  (import.meta as any)?.env?.VITE_N8N_BAO_CAO_DETAIL_URL || `/api/bao-cao`;

export const N8N_CANH_BAO_LIST_URL =
  (import.meta as any)?.env?.VITE_N8N_CANH_BAO_LIST_URL || `/api/canh-bao`;

export const N8N_CANH_BAO_DETAIL_URL =
  (import.meta as any)?.env?.VITE_N8N_CANH_BAO_DETAIL_URL || `/api/canh-bao`;

export const N8N_CONG_TRUONG_CHITIET_URL =
  (import.meta as any)?.env?.VITE_N8N_CONG_TRUONG_CHITIET_URL || `/api/cong-truong-chi-tiet`;

export const N8N_CONG_TRUONG_URL =
  (import.meta as any)?.env?.VITE_N8N_CONG_TRUONG_URL || `/api/cong-truong`;

// ─── Static Data ─────────────────────────────────────────────────────────

export const DAILY_PRODUCTION = [
  { day: "T1", value: 1250 },
  { day: "T2", value: 980 },
  { day: "T3", value: 1420 },
  { day: "T4", value: 1180 },
  { day: "T5", value: 890 },
  { day: "T6", value: 1350 },
  { day: "T7", value: 1100 },
];

export const DAILY_PROGRESS = [
  { day: "T1", value: 85 },
  { day: "T2", value: 62 },
  { day: "T3", value: 94 },
  { day: "T4", value: 78 },
  { day: "T5", value: 45 },
  { day: "T6", value: 88 },
  { day: "T7", value: 71 },
];

export const TUNNEL_DATA = [
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

export const UNIT_CHART_DATA: Record<string, { production: {day:string;value:number}[]; progress: {day:string;value:number}[] }> = {
  "Lò 101 – Vận tải": {
    production: [{ day:"T1",value:750 },{ day:"T2",value:820 },{ day:"T3",value:890 },{ day:"T4",value:810 },{ day:"T5",value:780 },{ day:"T6",value:870 },{ day:"T7",value:850 }],
    progress:   [{ day:"T1",value:11 },{ day:"T2",value:13 },{ day:"T3",value:15 },{ day:"T4",value:12 },{ day:"T5",value:10 },{ day:"T6",value:14 },{ day:"T7",value:13 }],
  },
  "Lò Chợ I-10-5": {
    production: [{ day:"T1",value:1100 },{ day:"T2",value:980 },{ day:"T3",value:1300 },{ day:"T4",value:1180 },{ day:"T5",value:900 },{ day:"T6",value:1250 },{ day:"T7",value:1240 }],
    progress:   [{ day:"T1",value:8 },{ day:"T2",value:6 },{ day:"T3",value:10 },{ day:"T4",value:9 },{ day:"T5",value:5 },{ day:"T6",value:11 },{ day:"T7",value:9 }],
  },
};

export const CHART_DATA = [
  { date: "10/10", prod: 200,  prog: 15 },
  { date: "11/10", prod: 450,  prog: 32 },
  { date: "12/10", prod: 780,  prog: 50 },
  { date: "13/10", prod: 1100, prog: 71 },
  { date: "14/10", prod: 1320, prog: 85 },
  { date: "15/10", prod: 1440, prog: 92 },
];

export const ALERT_DATA = [
  { id:1, time:"14:22:15", date:"15/10/2023", location:"Lò thượng – Via 14",        content:"Nồng độ khí CH4 vượt mức",                     severity:"Nghiêm trọng", status:"Đang xử lý",    assignee:{ initials:"HP", color:"#047857", name:"Hoàng Văn Phong" }, description:"Nồng độ khí CH4 tại gương lò Lò thượng – Via 14 ghi nhận giá trị 1.8%, vượt mức cho phép 1.5%. Cần sơ tán nhân lực ngay lập tức và kiểm tra hệ thống thông gió." },
  { id:2, time:"13:50:02", date:"15/10/2023", location:"Đường lò vận tải 2",         content:"Băng tải số 3 quá nhiệt",                      severity:"Cảnh báo",     status:"Chờ tiếp nhận", assignee:null, description:"Nhiệt độ động cơ băng tải số 3 trên đường lò vận tải 2 đạt 85°C, vượt ngưỡng cảnh báo 80°C. Cần kiểm tra và bôi trơn hệ thống truyền động." },
  { id:3, time:"11:15:30", date:"15/10/2023", location:"Via 12 – Tây mỏ",            content:"Mất kết nối cảm biến áp suất",                 severity:"Cảnh báo",     status:"Đã hoàn thành", assignee:{ initials:"LN", color:"#1D4ED8", name:"Lê Nam" }, description:"Cảm biến áp suất thủy lực tại chân lò Via 12 mất kết nối lúc 11:15. Đã kiểm tra và khôi phục kết nối thành công. Theo dõi tiếp trong 24h." },
  { id:4, time:"10:05:00", date:"15/10/2023", location:"Trạm phát điện 1",           content:"Cập nhật phần mềm hệ thống định kỳ",           severity:"Bình thường",  status:"Đã hoàn thành", assignee:{ initials:"TV", color:"#7C3AED", name:"Trần Văn A" }, description:"Hoàn thành cập nhật phần mềm SCADA phiên bản 4.2.1. Hệ thống hoạt động bình thường sau khi khởi động lại." },
  { id:5, time:"09:40:12", date:"15/10/2023", location:"Phân xưởng Khai thác 5",     content:"Áp lực thông gió giảm nhẹ",                    severity:"Nghiêm trọng", status:"Chờ tiếp nhận", assignee:null, description:"Hệ thống đo áp lực tại gương lò Phân xưởng Khai thác 5 ghi nhận giá trị 18 Pa, thấp hơn mức tối thiểu quy định 25 Pa. Nguyên nhân nghi do quạt thông gió phụ số 2 bị sự cố. Cần kiểm tra và khởi động lại quạt. Tạm thời dừng tất cả hoạt động nổ mìn cho đến khi áp lực được phục hồi." },
  { id:6, time:"08:22:55", date:"15/10/2023", location:"Trạm bơm nước B3",           content:"Mức nước hầm vượt mức cấp 2",                  severity:"Cảnh báo",     status:"Đang xử lý",    assignee:{ initials:"NT", color:"#DC2626", name:"Nguyễn Thành" }, description:"Mức nước tại hầm bơm B3 đạt cấp độ 2 (85% dung tích). Máy bơm số 2 đã được kích hoạt bổ sung. Theo dõi liên tục mỗi 30 phút." },
  { id:7, time:"07:15:20", date:"15/10/2023", location:"Cổng ra sản phẩm",           content:"Kiểm tra cảm biến bụi",                        severity:"Bình thường",  status:"Đã hoàn thành", assignee:{ initials:"HV", color:"#047857", name:"Hoàng Văn" }, description:"Kiểm tra định kỳ cảm biến bụi tại cổng ra sản phẩm. Kết quả trong mức cho phép. Làm sạch bộ lọc và hiệu chỉnh thiết bị." },
];

export const OVERVIEW_ALERTS = [
  { id:"01", alertId:1, location:"Khu vực Lò thượng",       content:"Nồng độ khí CH4 vượt mức cho phép (>1.5%) tại gương lò", type:"Nghiêm trọng", status:"Đang xử lý" },
  { id:"02", alertId:5, location:"Phân xưởng Khai thác 5",  content:"Áp lực thông gió giảm dưới mức tối thiểu tại gương lò", type:"Nghiêm trọng", status:"Chờ tiếp nhận" },
  { id:"03", alertId:2, location:"Đường lò vận tải số 2",   content:"Băng tải số 3 có dấu hiệu quá nhiệt động cơ chính",     type:"Cảnh báo",     status:"Chờ tiếp nhận" },
  { id:"04", alertId:3, location:"Via 12 – Tây mỏ",          content:"Mất kết nối cảm biến áp suất thủy lực chân lò",         type:"Cảnh báo",     status:"Đã hoàn thành" },
  { id:"05", alertId:6, location:"Trạm bơm nước ngầm B3",   content:"Mức nước hầm vượt cảnh báo cấp 2",                       type:"Cảnh báo",     status:"Đang xử lý" },
];

export const HISTORY_DATA = [
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

export const TEMPLATE_FILES = {
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

export const OVERVIEW_CUMULATIVE_PROD_MONTH = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const value = 1300 + Math.round(Math.sin(month / 1.8) * 250) + (month === 7 ? 200 : 0);
  return { day: `Th${month}`, value };
});

export const OVERVIEW_CUMULATIVE_PROG_MONTH = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const value = 75 + Math.round(Math.cos(month / 1.8) * 22) + (month === 7 ? 10 : 0);
  return { day: `Th${month}`, value };
});