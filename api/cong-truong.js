import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

const KHAI_THAC_SITES = ["CT Khai thác 1", "CT Khai thác 2", "CT Khai thác 3", "CT Khai thác 5", "CT Khai thác 6", "CT Khai thác 8", "Cơ giới hóa 1"];
const DAO_LO_SITES = ["CT Đào lò 1", "CT Đào lò 2", "CT Đào lò 3", "CT Đào lò 6"];

const KE_HOACH_NAM = {
  lo_cho:   Number(process.env.KE_HOACH_SAN_LUONG) || 1000000,
  dao_lo:   Number(process.env.KE_HOACH_DAO_LO)    || 12000,
  xen_lo:    Number(process.env.KE_HOACH_XEN_LO)     || 6000,
  chong_doi: Number(process.env.KE_HOACH_CHONG_DOI) || 6000,
};

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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());

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

    const khaiThacData = [];
    const daoLoData = [];

    for (const row of result.rows) {
      const isKhaiThac = KHAI_THAC_SITES.includes(row.tenCongTruong);
      const isDaoLo = DAO_LO_SITES.includes(row.tenCongTruong);

      if (isKhaiThac) khaiThacData.push(row);
      if (isDaoLo) daoLoData.push(row);
    }

    function createSiteMap(sites, includeLoCho) {
      const map = new Map();
      for (const name of sites) {
        const site = { tenCongTruong: name, lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0, thoiGianBaoCao: "—" };
        if (!includeLoCho) site.lo_cho = undefined;
        map.set(name, site);
      }
      return map;
    }

    function mergeData(map, rows) {
      for (const row of rows) {
        const site = map.get(row.tenCongTruong);
        if (site) {
          site[row.loaiCongViec] = Number(row.sanLuongLuyKe) || 0;
          if (row.thoiGianBaoCao && (!site.thoiGianBaoCao || row.thoiGianBaoCao > site.thoiGianBaoCao)) {
            site.thoiGianBaoCao = row.thoiGianBaoCao;
          }
        }
      }
    }

    const khaiThacMap = createSiteMap(KHAI_THAC_SITES, true);
    const daoLoMap = createSiteMap(DAO_LO_SITES, false);

    mergeData(khaiThacMap, khaiThacData);
    mergeData(daoLoMap, daoLoData);

    const sortByList = (arr, list) => {
      const order = new Map(list.map((v, i) => [v, i]));
      return [...arr].sort((a, b) => (order.get(a.tenCongTruong) ?? 999) - (order.get(b.tenCongTruong) ?? 999));
    };

    const khaiThacSorted = sortByList(Array.from(khaiThacMap.values()), KHAI_THAC_SITES);
    const daoLoSorted = sortByList(Array.from(daoLoMap.values()), DAO_LO_SITES);

    const remainingDays = getRemainingDaysInMonth(thang, nam);
    const keHoachThang = {
      lo_cho:   Math.round(KE_HOACH_NAM.lo_cho / 12),
      dao_lo:   Math.round(KE_HOACH_NAM.dao_lo / 12),
      xen_lo:    Math.round(KE_HOACH_NAM.xen_lo / 12),
      chong_doi: Math.round(KE_HOACH_NAM.chong_doi / 12),
    };

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

    res.status(200).json({
      thang,
      nam,
      remainingDays,
      keHoachThang,
      khaiThac: khaiThacDetail,
      daoLo: daoLoDetail,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}