import {
  pool,
  KE_HOACH_NAM,
  KHAI_THAC_SITES,
  DAO_LO_SITES,
  clampMonth,
  clampYear,
  getRemainingDaysInMonth,
  resolveSiteName,
  HttpError,
} from "./helpers.js";

// Lũy kế tháng theo công trường × loại công việc + tính sẵn các chỉ số detail
// (KH tháng, còn lại, TB/ngày) để modal không phải tính lại.
export async function getCongTruong({ thang, nam } = {}) {
  const now = new Date();
  const month = clampMonth(thang, now.getMonth() + 1);
  const year = clampYear(nam, now.getFullYear());

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

  const result = await pool.query(query, [month, year]);

  // Phân loại dữ liệu theo 2 nhóm công trường
  const khaiThacData = [];
  const daoLoData = [];

  for (const row of result.rows) {
    const isKhaiThac = KHAI_THAC_SITES.includes(row.tenCongTruong);
    const isDaoLo = DAO_LO_SITES.includes(row.tenCongTruong);
    if (isKhaiThac) khaiThacData.push(row);
    if (isDaoLo) daoLoData.push(row);
  }

  // Tạo map khởi tạo tất cả công trường với giá trị 0
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

  const khaiThacMap = createSiteMap(KHAI_THAC_SITES, true);
  const daoLoMap = createSiteMap(DAO_LO_SITES, false);

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
  const remainingDays = getRemainingDaysInMonth(month, year);
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

  return {
    thang: month,
    nam: year,
    remainingDays,
    keHoachThang,
    khaiThac: khaiThacDetail,
    daoLo: daoLoDetail,
  };
}

// Chi tiết 1 công trường: danh sách đường lò × loại công việc trong tháng.
// Trả về { daoLo, xenLo, chongDoi }, mỗi dòng = { duong_lo, tiet_dien, tien_do, ca1, ca2, ca3 }.
export async function getCongTruongChiTiet({ thang, nam, site, type } = {}) {
  const now = new Date();
  const month = clampMonth(thang, now.getMonth() + 1);
  const year = clampYear(nam, now.getFullYear());
  const workType = type === "dao_lo" ? "dao_lo" : "khai_thac";
  const siteParam = (site || "").trim();
  if (!siteParam) {
    throw new HttpError(400, "Missing required query param: site");
  }

  const originalSite = resolveSiteName(siteParam, workType);
  // Whitelist check: chỉ chấp nhận site nằm trong danh sách → chặn SQL injection / query lung tung
  const validSites = workType === "khai_thac" ? KHAI_THAC_SITES : DAO_LO_SITES;
  if (!validSites.includes(originalSite)) {
    return {
      data: { daoLo: [], xenLo: [], chongDoi: [] },
      thang: month,
      nam: year,
      site: originalSite,
      type: workType,
    };
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

  const result = await pool.query(query, [originalSite, month, year]);

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

  return {
    data: { daoLo, xenLo, chongDoi },
    thang: month,
    nam: year,
    site: originalSite,
    type: workType,
  };
}
