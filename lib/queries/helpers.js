import pool from "../db.js";

export { pool };

// ─── Parse / clamp helpers ────────────────────────────────
export function clampMonth(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(12, n));
}

export function clampYear(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1970, Math.min(9999, n));
}

export function clampInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

// Lỗi HTTP có status → route layer quyết định res.status()
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Query an toàn: nếu bảng chưa tồn tại thì trả về rỗng thay vì crash
export async function safeQuery(sql, params, defaultValue = { rows: [], rowCount: 0 }) {
  try {
    return await pool.query(sql, params);
  } catch (e) {
    console.warn("Query failed (bảng có thể chưa tồn tại):", e.message);
    return defaultValue;
  }
}

// ─── Kế hoạch năm - XÓA HARDCODE, LẤY TỪ DB chi_tieu_kpi/ke_hoach_nam ──
// Task yêu cầu xóa KE_HOACH_NAM hardcode, mọi số liệu phải từ DB thực tế (Excel)
// Giữ lại UNITS/LABELS cho hiển thị, nhưng KE_HOACH_NAM đã xóa
// Sử dụng getKeHoachMap(nam) để lấy kế hoạch năm từ DB

// Helper lấy kế hoạch năm từ DB chi_tieu_kpi - KHÔNG còn hardcode, KHÔNG fallback ke_hoach_nam (đã xóa bảng)
export async function getKeHoachMap(nam) {
  const y = clampYear(nam, new Date().getFullYear());
  try {
    const r = await pool.query(
      `SELECT ma_chi_tieu, ke_hoach_nam::float AS gia_tri, don_vi_tinh AS dvt
       FROM chi_tieu_kpi WHERE nam = $1`,
      [y]
    );
    if (r.rows.length > 0) {
      const map = {};
      for (const row of r.rows) map[row.ma_chi_tieu] = { gia_tri: Number(row.gia_tri)||0, dvt: row.dvt };
      return {
        san_luong_than: map.san_luong_than?.gia_tri ?? 0,
        lo_cho:         map.san_luong_than?.gia_tri ?? 0,
        dao_lo:         map.dao_lo?.gia_tri ?? 0,
        xen_lo:         map.xen_lo?.gia_tri ?? 0,
        doanh_thu:      map.doanh_thu?.gia_tri ?? 0,
        tieu_thu:       map.tieu_thu?.gia_tri ?? 0,
        chong_doi:      map.chong_doi?.gia_tri ?? 0,
        _dvt: { san_luong_than: map.san_luong_than?.dvt, dao_lo: map.dao_lo?.dvt, xen_lo: map.xen_lo?.dvt, doanh_thu: map.doanh_thu?.dvt, tieu_thu: map.tieu_thu?.dvt },
        _source: "chi_tieu_kpi",
        _year: y,
      };
    }
  } catch (e) {
    console.warn("[getKeHoachMap] chi_tieu_kpi failed:", e.message);
  }
  return { san_luong_than: 0, lo_cho: 0, dao_lo: 0, xen_lo: 0, doanh_thu: 0, tieu_thu: 0, chong_doi: 0, _source: "empty", _year: y };
}
export async function getKeHoachNam(nam) { return getKeHoachMap(nam); }

export const UNITS = {
  lo_cho: "tấn", dao_lo: "mét", xen_lo: "mét", chong_doi: "mét",
};

export const LABELS = {
  lo_cho: "Sản lượng", dao_lo: "Đào lò", xen_lo: "Xén lò", chong_doi: "Chống đội",
};

// ─── Danh sách công trường (tên gốc trong DB, không có tiền tố "CT ") ──
export const KHAI_THAC_SITES = [
  "Khai thác 1", "Khai thác 2", "Khai thác 3",
  "Khai thác 5", "Khai thác 6", "Khai thác 8",
  "Cơ giới hóa 1",
];

export const DAO_LO_SITES = [
  "Đào lò 1", "Đào lò 2", "Đào lò 3", "Đào lò 6",
];

// Map site name đã simplify ở frontend về tên gốc trong DB.
//  - "1"          -> "Khai thác 1"
//  - "Đào lò 1"   -> "Đào lò 1"
//  - "CT Khai thác 1" -> "Khai thác 1" (fallback cho client cũ)
//  - "Cơ giới hóa 1"  -> "Cơ giới hóa 1" (giữ nguyên)
export function resolveSiteName(siteParam, type) {
  const s = (siteParam || "").trim();
  if (!s) return "";
  const strip = (name) => name.replace(/^CT\s+/i, "");
  if (type === "khai_thac") {
    if (/^Cơ giới hóa/i.test(s)) return s;
    if (/^\d+$/.test(s)) return `Khai thác ${s}`;
    return strip(s);
  }
  if (type === "dao_lo") {
    if (/^\d+$/.test(s)) return `Đào lò ${s}`;
    return strip(s);
  }
  return s;
}

// Số ngày còn lại trong tháng (tính theo ngày hiện tại)
export function getRemainingDaysInMonth(month, year) {
  const today = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const isFutureMonth = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1);

  if (isCurrentMonth) {
    return Math.max(daysInMonth - today.getDate(), 0);
  }
  return isFutureMonth ? daysInMonth : 0;
}
