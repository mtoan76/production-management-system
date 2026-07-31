import { KE_HOACH_NAM, UNITS, LABELS, clampMonth, clampYear, safeQuery } from "./helpers.js";

// Báo cáo tổng quan: KPI lũy kế năm, lũy kế theo tháng, lũy kế theo ngày.
export async function getTongQuan({ thang, nam } = {}) {
  const now = new Date();
  const month = clampMonth(thang, now.getMonth() + 1);
  const year = clampYear(nam, now.getFullYear());

  const kpiResult = await safeQuery(
    `SELECT bch.loai_cong_viec,
            COALESCE(SUM(bch.san_luong), 0)::numeric AS thuc_te
     FROM bao_cao_hang_muc bch
     JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
     WHERE EXTRACT(YEAR FROM bcct.ngay)  = $1
       AND EXTRACT(MONTH FROM bcct.ngay) <= $2
     GROUP BY bch.loai_cong_viec;`,
    [year, month]
  );

  const kpiMap = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
  for (const row of kpiResult.rows) {
    const type = row.loai_cong_viec;
    if (type in kpiMap) {
      kpiMap[type] = Number(row.thuc_te) || 0;
    }
  }

  const monthResult = await safeQuery(
    `WITH daily_by_type AS (
       SELECT bcct.ngay,
              bch.loai_cong_viec,
              SUM(bch.san_luong) AS val
       FROM bao_cao_hang_muc bch
       JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
       WHERE EXTRACT(YEAR FROM bcct.ngay) = $1
         AND EXTRACT(MONTH FROM bcct.ngay) <= $2
       GROUP BY bcct.ngay, bch.loai_cong_viec
     )
     SELECT EXTRACT(MONTH FROM ngay)::int AS thang,
            loai_cong_viec,
            SUM(val) AS val
     FROM daily_by_type
     GROUP BY EXTRACT(MONTH FROM ngay), loai_cong_viec
     ORDER BY thang, loai_cong_viec;`,
    [year, month]
  );

  const monthByType = {};
  for (const row of monthResult.rows) {
    const t = Number(row.thang);
    if (!monthByType[t]) monthByType[t] = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
    monthByType[t][row.loai_cong_viec] = Number(row.val) || 0;
  }
  const monthCum = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
  const monthArray = [];
  const sortedMonths = Object.keys(monthByType).map(Number).sort((a, b) => a - b);
  for (const t of sortedMonths) {
    const data = monthByType[t];
    for (const type of Object.keys(data)) {
      if (type in monthCum) monthCum[type] += data[type];
    }
    monthArray.push({
      thang: t,
      lo_cho_luy_ke: monthCum.lo_cho,
      dao_lo_luy_ke: monthCum.dao_lo,
      xen_lo_luy_ke: monthCum.xen_lo,
      chong_doi_luy_ke: monthCum.chong_doi,
    });
  }

  const dayResult = await safeQuery(
    `WITH daily_by_type AS (
       SELECT bcct.ngay,
              bch.loai_cong_viec,
              SUM(bch.san_luong) AS val
       FROM bao_cao_hang_muc bch
       JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
       WHERE EXTRACT(YEAR FROM bcct.ngay) = $1
         AND EXTRACT(MONTH FROM bcct.ngay) = $2
       GROUP BY bcct.ngay, bch.loai_cong_viec
     )
     SELECT to_char(ngay, 'DD/MM') AS ngay,
            loai_cong_viec,
            SUM(val) AS val
     FROM daily_by_type
     GROUP BY ngay, loai_cong_viec
     ORDER BY ngay, loai_cong_viec;`,
    [year, month]
  );

  const dayByType = {};
  for (const row of dayResult.rows) {
    const ngay = row.ngay;
    if (!dayByType[ngay]) dayByType[ngay] = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
    dayByType[ngay][row.loai_cong_viec] = Number(row.val) || 0;
  }
  const dayCum = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
  const dayArray = [];
  const sortedDays = Object.keys(dayByType).sort((a, b) => {
    const [da, ma] = a.split("/").map(Number);
    const [db, mb] = b.split("/").map(Number);
    return ma !== mb ? ma - mb : da - db;
  });
  for (const ngay of sortedDays) {
    const data = dayByType[ngay];
    for (const type of Object.keys(data)) {
      if (type in dayCum) dayCum[type] += data[type];
    }
    dayArray.push({
      ngay,
      lo_cho_luy_ke: dayCum.lo_cho,
      dao_lo_luy_ke: dayCum.dao_lo,
      xen_lo_luy_ke: dayCum.xen_lo,
      chong_doi_luy_ke: dayCum.chong_doi,
    });
  }

  const kpiObj = {};
  for (const type of Object.keys(KE_HOACH_NAM)) {
    const thuc_te = kpiMap[type] || 0;
    const ke_hoach_nam = KE_HOACH_NAM[type];
    const ty_le = ke_hoach_nam > 0 ? Math.round((thuc_te / ke_hoach_nam) * 1000) / 10 : 0;
    kpiObj[type] = { thuc_te, ke_hoach_nam, ty_le };
  }

  return {
    thang: month,
    nam: year,
    kpi: kpiObj,
    month: monthArray,
    day: dayArray,
    units: UNITS,
    labels: LABELS,
  };
}
