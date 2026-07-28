import express from "express";
import pool from "../db.js";

const router = express.Router();

function clampMonth(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(12, n));
}
function clampYear(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1970, Math.min(9999, n));
}

// Danh sách công trường khai thác (danh sách đầy đủ theo yêu cầu: 1, 2, 3, 5, 6, 8, Cơ giới hóa 1)
const KHAI_THAC_SITES = [
  "CT Khai thác 1", "CT Khai thác 2", "CT Khai thác 3", 
  "CT Khai thác 5", "CT Khai thác 6", "CT Khai thác 8", 
  "Cơ giới hóa 1"
];

// Danh sách công trường đào lò (danh sách đầy đủ: 1, 2, 3, 6)
const DAO_LO_SITES = [
  "CT Đào lò 1", "CT Đào lò 2", "CT Đào lò 3", "CT Đào lò 6"
];

// Kế hoạch năm cho 4 loại công việc (đọc từ env hoặc mặc định)
const KE_HOACH_NAM = {
  lo_cho:   Number(process.env.KE_HOACH_SAN_LUONG) || 1000000,
  dao_lo:   Number(process.env.KE_HOACH_DAO_LO)    || 12000,
  xen_lo:    Number(process.env.KE_HOACH_XEN_LO)     || 6000,
  chong_doi: Number(process.env.KE_HOACH_CHONG_DOI) || 6000,
};

// Helper: tính số ngày còn lại trong tháng
function getRemainingDaysInMonth(month, year) {
  const today = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const isFutureMonth = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1);
  
  if (isCurrentMonth) {
    return Math.max(daysInMonth - today.getDate(), 0);
  }
  return isFutureMonth ? daysInMonth : 0;
}

async function safeQuery(sql, params, defaultValue = { rows: [], rowCount: 0 }) {
  try {
    const r = await pool.query(sql, params);
    return r;
  } catch (e) {
    console.warn("Query failed:", e.message);
    return defaultValue;
  }
}

router.get("/cong-truong", async (req, res, next) => {
  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());

    // Query lấy lũy kế tháng theo công trường và loại công việc
    // Trả về: ten_cong_truong, loai_cong_viec, san_luong_luy_ke, ngay_cap_nhat
    const query = `
      WITH daily_by_site AS (
        SELECT
          bcct.cong_truong as ten_cong_truong,
          bch.loai_cong_viec,
          bcct.ngay,
          SUM(bch.san_luong) AS val,
          MAX(bc.created_at) AS last_report_at
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        JOIN bao_cao bc ON bc.id = bcct.bao_cao_id
        WHERE EXTRACT(YEAR FROM bcct.ngay) = $2
          AND EXTRACT(MONTH FROM bcct.ngay) = $1
          AND bcct.cong_truong IS NOT NULL
        GROUP BY bcct.cong_truong, bch.loai_cong_viec, bcct.ngay
      ),
      cumulative AS (
        SELECT
          ten_cong_truong,
          loai_cong_viec,
          SUM(val) OVER (PARTITION BY ten_cong_truong, loai_cong_viec ORDER BY ngay) AS luy_ke,
          MAX(last_report_at) OVER (PARTITION BY ten_cong_truong, loai_cong_viec) AS last_report_at,
          ROW_NUMBER() OVER (PARTITION BY ten_cong_truong, loai_cong_viec ORDER BY ngay DESC) AS rn
        FROM daily_by_site
      )
      SELECT
        ten_cong_truong AS "tenCongTruong",
        loai_cong_viec AS "loaiCongViec",
        luy_ke AS "sanLuongLuyKe",
        TO_CHAR(last_report_at, 'DD/MM/YYYY HH24:MI:SS') AS "thoiGianBaoCao"
      FROM cumulative
      WHERE rn = 1
      ORDER BY ten_cong_truong, loai_cong_viec;
    `;

    const result = await pool.query(query, [thang, nam]);

    // Phân loại dữ liệu theo 2 bảng
    const khaiThacData = [];
    const daoLoData = [];

    for (const row of result.rows) {
      const isKhaiThac = KHAI_THAC_SITES.includes(row.tenCongTruong);
      const isDaoLo = DAO_LO_SITES.includes(row.tenCongTruong);

      if (isKhaiThac) khaiThacData.push(row);
      if (isDaoLo) daoLoData.push(row);
    }

    // Helper: tạo map khởi tạo tất cả công trường từ danh sách cố định
    function createSiteMap(sites, includeLoCho) {
      const map = new Map();
      for (const name of sites) {
        const site = {
          tenCongTruong: name,
          lo_cho: 0,
          dao_lo: 0,
          xen_lo: 0,
          chong_doi: 0,
          thoiGianBaoCao: "—",
        };
        if (!includeLoCho) delete site.lo_cho;
        map.set(name, site);
      }
      return map;
    }

    // Khởi tạo tất cả công trường với giá trị 0
    const khaiThacMap = createSiteMap(KHAI_THAC_SITES, true);
    const daoLoMap = createSiteMap(DAO_LO_SITES, false);

    // Merge dữ liệu từ database
    function mergeData(map, rows) {
      for (const row of rows) {
        const name = row.tenCongTruong;
        const site = map.get(name);
        if (site) {
          site[row.loaiCongViec] = Number(row.sanLuongLuyKe) || 0;
          if (row.thoiGianBaoCao) {
            site.thoiGianBaoCao = row.thoiGianBaoCao;
          }
        }
      }
    }

    mergeData(khaiThacMap, khaiThacData);
    mergeData(daoLoMap, daoLoData);

    // Sắp xếp theo thứ tự danh sách cố định
    const sortByList = (arr, list) => {
      const order = new Map(list.map((v, i) => [v, i]));
      return [...arr].sort((a, b) => (order.get(a.tenCongTruong) ?? 999) - (order.get(b.tenCongTruong) ?? 999));
    };

    const khaiThacSorted = sortByList(Array.from(khaiThacMap.values()), KHAI_THAC_SITES);
    const daoLoSorted = sortByList(Array.from(daoLoMap.values()), DAO_LO_SITES);

    // Tính toán các chỉ số bổ sung cho modal detail
    const remainingDays = getRemainingDaysInMonth(thang, nam);
    const keHoachThang = {
      lo_cho:   Math.round(KE_HOACH_NAM.lo_cho / 12),
      dao_lo:   Math.round(KE_HOACH_NAM.dao_lo / 12),
      xen_lo:    Math.round(KE_HOACH_NAM.xen_lo / 12),
      chong_doi: Math.round(KE_HOACH_NAM.chong_doi / 12),
    };

    // Gắn thêm thông tin detail cho từng công trường
    function enrichWithDetail(sites, includeLoCho = true) {
      return sites.map(site => {
        const detail = {
          tenCongTruong: site.tenCongTruong,
          lo_cho: site.lo_cho || 0,
          dao_lo: site.dao_lo || 0,
          xen_lo: site.xen_lo || 0,
          chong_doi: site.chong_doi || 0,
          thoiGianBaoCao: site.thoiGianBaoCao || "—",
        };
        
        if (includeLoCho) {
          detail.keHoachThang = keHoachThang;
          detail.conLai = {
            lo_cho: Math.max(keHoachThang.lo_cho - detail.lo_cho, 0),
            dao_lo: Math.max(keHoachThang.dao_lo - detail.dao_lo, 0),
            xen_lo: Math.max(keHoachThang.xen_lo - detail.xen_lo, 0),
            chong_doi: Math.max(keHoachThang.chong_doi - detail.chong_doi, 0),
          };
          detail.tbNgay = {
            lo_cho: remainingDays > 0 ? detail.conLai.lo_cho / remainingDays : 0,
            dao_lo: remainingDays > 0 ? detail.conLai.dao_lo / remainingDays : 0,
            xen_lo: remainingDays > 0 ? detail.conLai.xen_lo / remainingDays : 0,
            chong_doi: remainingDays > 0 ? detail.conLai.chong_doi / remainingDays : 0,
          };
        } else {
          detail.keHoachThang = {
            dao_lo: keHoachThang.dao_lo,
            xen_lo: keHoachThang.xen_lo,
            chong_doi: keHoachThang.chong_doi,
          };
          detail.conLai = {
            dao_lo: Math.max(keHoachThang.dao_lo - detail.dao_lo, 0),
            xen_lo: Math.max(keHoachThang.xen_lo - detail.xen_lo, 0),
            chong_doi: Math.max(keHoachThang.chong_doi - detail.chong_doi, 0),
          };
          detail.tbNgay = {
            dao_lo: remainingDays > 0 ? detail.conLai.dao_lo / remainingDays : 0,
            xen_lo: remainingDays > 0 ? detail.conLai.xen_lo / remainingDays : 0,
            chong_doi: remainingDays > 0 ? detail.conLai.chong_doi / remainingDays : 0,
          };
        }
        return detail;
      });
    }

    const khaiThacDetail = enrichWithDetail(khaiThacSorted, true);
    const daoLoDetail = enrichWithDetail(daoLoSorted, false);

    res.json({
      thang,
      nam,
      remainingDays,
      keHoachThang,
      khaiThac: khaiThacDetail,
      daoLo: daoLoDetail,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Helper chung: map tên site đã được frontend simplify về tên gốc trong DB ──
// Frontend hiển thị "1" thay vì "CT Khai thác 1", "Đào lò 1" thay vì "CT Đào lò 1"
// → backend cần reverse map để query đúng `cong_truong`
function resolveSiteName(siteParam, type) {
  const s = (siteParam || "").trim();
  if (!s) return "";
  if (type === "khai_thac") {
    if (s.startsWith("Cơ giới hóa")) return s;
    if (/^\d+$/.test(s)) return `CT Khai thác ${s}`;
    return s;
  }
  if (type === "dao_lo") {
    if (s.startsWith("Đào lò ")) return `CT ${s}`;
    return s;
  }
  return s;
}

// GET /api/cong-truong-chi-tiet?thang=X&nam=Y&site=TEN_DA_SIMPLIFY&type=khai_thac|dao_lo
// Trả về danh sách đường lò × loại công việc trong 1 công trường:
//   - daoLo / xenLo / chongDoi: mỗi mảng gồm { duong_lo, tiet_dien, tien_do, ca1, ca2, ca3 }
//   - tiet_dien: hiện trả null (chưa có cột trong DB) → frontend hiển thị "—"
//   - tien_do: lũy kế tháng (mét)
//   - ca1/ca2/ca3: tổng mét trong tháng theo từng ca
router.get("/cong-truong-chi-tiet", async (req, res, next) => {
  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam   = clampYear(req.query.nam, now.getFullYear());
    const type  = req.query.type === "dao_lo" ? "dao_lo" : "khai_thac";
    const siteParam = req.query.site;
    if (!siteParam) {
      return res.status(400).json({ error: "Missing required query param: site" });
    }

    const originalSite = resolveSiteName(siteParam, type);
    const validSites = type === "khai_thac" ? KHAI_THAC_SITES : DAO_LO_SITES;
    if (!validSites.includes(originalSite)) {
      return res.json({
        data: { daoLo: [], xenLo: [], chongDoi: [] },
        thang, nam, site: originalSite, type,
      });
    }

    const query = `
      WITH filtered AS (
        SELECT
          bcct.ngay,
          bcct.ca,
          bch.duong_lo,
          bch.loai_cong_viec,
          bch.san_luong,
          bch.tiet_dien
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE bcct.cong_truong = $1
          AND EXTRACT(YEAR  FROM bcct.ngay) = $3
          AND EXTRACT(MONTH FROM bcct.ngay) = $2
          AND bch.duong_lo IS NOT NULL
          AND bch.loai_cong_viec IN ('dao_lo', 'xen_lo', 'chong_doi')
      ),
      daily AS (
        SELECT duong_lo, loai_cong_viec, ngay,
               SUM(san_luong)::numeric AS val
        FROM filtered
        GROUP BY duong_lo, loai_cong_viec, ngay
      ),
      cumulative AS (
        SELECT duong_lo, loai_cong_viec, ngay, val,
               SUM(val) OVER (PARTITION BY duong_lo, loai_cong_viec ORDER BY ngay) AS tien_do,
               ROW_NUMBER() OVER (PARTITION BY duong_lo, loai_cong_viec ORDER BY ngay DESC) AS rn
        FROM daily
      ),
      tiet_dien_pick AS (
        SELECT DISTINCT ON (duong_lo, loai_cong_viec)
          duong_lo,
          loai_cong_viec,
          tiet_dien
        FROM filtered
        WHERE tiet_dien IS NOT NULL
        ORDER BY duong_lo, loai_cong_viec, ngay DESC
      ),
      per_ca AS (
        SELECT duong_lo, loai_cong_viec,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 1), 0)::numeric AS ca1,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 2), 0)::numeric AS ca2,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 3), 0)::numeric AS ca3
        FROM filtered
        GROUP BY duong_lo, loai_cong_viec
      )
      SELECT
        c.duong_lo,
        c.loai_cong_viec,
        c.tien_do,
        p.ca1,
        p.ca2,
        p.ca3,
        td.tiet_dien
      FROM cumulative c
      JOIN per_ca p
        ON p.duong_lo = c.duong_lo
       AND p.loai_cong_viec = c.loai_cong_viec
      LEFT JOIN tiet_dien_pick td
        ON td.duong_lo = c.duong_lo
       AND td.loai_cong_viec = c.loai_cong_viec
      WHERE c.rn = 1
      ORDER BY c.loai_cong_viec, c.duong_lo;
    `;

    const result = await pool.query(query, [originalSite, thang, nam]);

    const toTunnel = (r) => ({
      duong_lo: r.duong_lo,
      tiet_dien: r.tiet_dien !== null && r.tiet_dien !== undefined ? Number(r.tiet_dien) : null,
      tien_do: Number(r.tien_do) || 0,
      ca1: Number(r.ca1) || 0,
      ca2: Number(r.ca2) || 0,
      ca3: Number(r.ca3) || 0,
    });

    const daoLo    = result.rows.filter((r) => r.loai_cong_viec === "dao_lo").map(toTunnel);
    const xenLo    = result.rows.filter((r) => r.loai_cong_viec === "xen_lo").map(toTunnel);
    const chongDoi = result.rows.filter((r) => r.loai_cong_viec === "chong_doi").map(toTunnel);

    res.json({
      data: { daoLo, xenLo, chongDoi },
      thang, nam, site: originalSite, type,
    });
  } catch (err) {
    next(err);
  }
});

export default router;