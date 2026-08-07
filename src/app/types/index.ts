// ─── Shared Types ────────────────────────────────────────────────

// Screen navigation
export type Screen = "input" | "history" | "overview" | "detail" | "alerts";

// Alert types
export type AlertTab = "all" | "critical" | "warning" | "normal";
export type SeverityType = "Nghiêm trọng" | "Cảnh báo" | "Bình thường";
export type AlertStatus = "Đang xử lý" | "Chờ tiếp nhận" | "Đã hoàn thành";
export type StatusType = "Bình thường" | "Cảnh báo" | "Nghiêm trọng" | "Không sản xuất";
export type HistoryStatus = "Hoàn thành" | "Đang xử lý" | "Nháp";

// Assignee for alerts
export type Assignee = { initials: string; color: string; name: string } | null;

// Overview / KPI data
export type MonthSummary = {
  thang: string | number;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};

export type DaySummary = {
  ngay: string;
  lo_cho_luy_ke: string | number;
  dao_lo_luy_ke: string | number;
  xen_lo_luy_ke: string | number;
  chong_doi_luy_ke: string | number;
};

export type KpiLoaiItem = { thuc_te: number; ke_hoach_nam: number; ty_le: number };
export type KpiSummary = {
  lo_cho: KpiLoaiItem;
  dao_lo: KpiLoaiItem;
  xen_lo: KpiLoaiItem;
  chong_doi: KpiLoaiItem;
};

// Tunnel / Detail data
export type TunnelData = {
  duong_lo: string;
  ngay_bao_cao: string;
  thoi_gian_bao_cao: string;
  san_luong_luy_ke: string;
  tien_do_luy_ke: string;
};

export type UNIT_CHART_DATA = Record<string, { production: {day:string;value:number}[]; progress: {day:string;value:number}[] }>;

// Alert data
export type CanhBaoListItem = {
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

// History data
export type HistoryItem = {
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
  tienDo: { hangMuc: string; giaTri: number; donVi: string; tietDien?: number; tietDienDonVi?: string }[];
  sanLuongCa: number;
  soLaoDong: number;
  sanLuongConLai: number;
  nhanXetAI: string;
  canhBao: { level: "critical" | "warning"; text: string }[];
  nguyenNhan: string;
  caChiTiet?: { ca: string; duongLo: string }[];
  giaChongHienTai?: number;
  congViecKhac?: string;
  ghiChuSuCo?: string;
};

export type BaoCaoListItem = {
  report_id: number;
  created_at: string;
  ngay: string | null;
  cong_truong: string | null;
  so_lao_dong: number | null;
  so_ca: number;
  tong_so_lao_dong: number;
  co_su_co: boolean;
};

export type CaHangMuc = {
  id: number;
  duong_lo: string | null;
  loai_cong_viec: string;
  san_luong: string | number | null;
  tiet_dien: string | number | null;
  tiet_dien_don_vi: string | null;
};

export type CaData = {
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

export type BaoCaoDetail = {
  report: { id: number; created_at: string };
  ca_list: CaData[];
};

// Cong truong chi tiet
export type TunnelChiTiet = {
  duong_lo: string;
  tiet_dien?: number;
  tien_do: number;
  ca1: number;
  ca2: number;
  ca3: number;
};

export type CongTruongChiTiet = {
  daoLo: TunnelChiTiet[];
  xenLo: TunnelChiTiet[];
  chongDoi: TunnelChiTiet[];
};

// Config maps
export type SEVERITY_CFG = Record<SeverityType, { dot: string; badge: string; textColor: string }>;
export type ALERT_STATUS_CFG = Record<AlertStatus, { badge: string; textColor: string }>;
export type HISTORY_STATUS_CFG = Record<HistoryStatus, { badge: string; textColor: string; dot: string }>;
export type TAB_SEVERITY = Record<AlertTab, SeverityType | null>;

// Report submission
export type SubmitStatus = "idle" | "processing" | "success" | "error";

export type ReportItem = {
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
  bo_tri_lao_dong?: string;
  tien_do_dao_lo?: string | number;
  [key: string]: any;
};

export type TemplateType = "daolo" | "khai_thac";
export type FileValidation = {
  valid: boolean;
  type?: TemplateType;
  error?: string;
};

// Mobile types
export type MobileOverviewCache = {
  kpi: any | null;
  monthSummary: any | null;
  daySummary: any[];
  monthList: any[];
  tunnelRows: any[];
};

export type MobileCongTruongCache = {
  thang: number;
  nam: number;
  remainingDays: number;
  keHoachThang: { lo_cho: number; dao_lo: number; xen_lo: number; chong_doi: number };
  khaiThac: any[];
  daoLo: any[];
};

export type TabId = "overview" | "detail" | "submit" | "history" | "alerts";

// Chart data
export type ChartDataPoint = { day: string; value: number };

// Overview alerts
export type OverviewAlert = {
  id: string;
  alertId: number;
  location: string;
  content: string;
  type: SeverityType;
  status: AlertStatus;
};