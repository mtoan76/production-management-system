import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

// Kế hoạch năm cho 4 loại chỉ số (đơn vị: tấn cho lo_cho, mét cho các loại khác)
const KE_HOACH_NAM: Record<string, number> = {
  lo_cho:   Number(process.env.KE_HOACH_SAN_LUONG) || 1000000,  // Sản lượng (tấn/năm)
  dao_lo:   Number(process.env.KE_HOACH_DAO_LO)   || 12000,      // Đào lò (mét/năm)
  xen_lo:    Number(process.env.KE_HOACH_XEN_LO)    || 6000,       // Xén lò (mét/năm)
  chong_doi: Number(process.env.KE_HOACH_CHONG_DOI) || 6000,       // Chống đội (mét/năm)
};

// Đơn vị cho mỗi loại (dùng để hiển thị UI)
const UNITS: Record<string, string> = {
  lo_cho:   "tấn",
  dao_lo:   "mét",
  xen_lo:    "mét",
  chong_doi: "mét",
};

// Tên tiếng Việt hiển thị
const LABELS: Record<string, string> = {
  lo_cho:   "Sản lượng",
  dao_lo:   "Đào lò",
  xen_lo:    "Xén lò",
  chong_doi: "Chống đội",
};

function clampMonth(v: string | undefined, fallback: number): number {
  const n = parseInt(v || "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(12, n));
}
function clampYear(v: string | undefined, fallback: number): number {
  const n = parseInt(v || "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1970, Math.min(9999, n));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());

    // KPI summary: tổng lũy kế theo loại từ đầu năm đến selectedMonth
    const kpiQuery = `
      SELECT
        bch.loai_cong_viec,
        COALESCE(SUM(bch.san_luong), 0)::numeric AS thuc_te
      FROM bao_cao_hang_muc bch
      JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
      WHERE EXTRACT(YEAR FROM bcct.ngay)  = $1
        AND EXTRACT(MONTH FROM bcct.ngay) <= $2
      GROUP BY bch.loai_cong_viec;
    `;
    const kpiResult = await pool.query(kpiQuery, [nam, thang]);

    // Build kpi object cho 4 loại (mặc định 0 nếu không có dữ liệu)
    const kpiMap: Record<string, number> = {
      lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0,
    };
    for (const row of kpiResult.rows) {
      const type = row.loai_cong_viec;
      if (type in kpiMap) {
        kpiMap[type] = Number(row.thuc_te) || 0;
      }
    }

    // Monthly chart: lũy kế theo từng tháng trong năm
    const monthQuery = `
      WITH daily_by_type AS (
        SELECT
          bcct.ngay,
          bch.loai_cong_viec,
          SUM(bch.san_luong) AS val
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE EXTRACT(YEAR FROM bcct.ngay) = $1
          AND EXTRACT(MONTH FROM bcct.ngay) <= $2
        GROUP BY bcct.ngay, bch.loai_cong_viec
      )
      SELECT
        EXTRACT(MONTH FROM ngay)::int AS thang,
        loai_cong_viec,
        SUM(val) AS val
      FROM daily_by_type
      GROUP BY EXTRACT(MONTH FROM ngay), loai_cong_viec
      ORDER BY thang, loai_cong_viec;
    `;
    const monthResult = await pool.query(monthQuery, [nam, thang]);

    // Build monthly array với cumulative theo loại
    // Để đơn giản: pivot thành 1 row per tháng với 4 cột loai_cong_viec lũy kế
    const monthByType: Record<number, Record<string, number>> = {};
    for (const row of monthResult.rows) {
      const t = Number(row.thang);
      if (!monthByType[t]) monthByType[t] = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
      monthByType[t][row.loai_cong_viec] = Number(row.val) || 0;
    }
    // Tính cumulative
    const monthCum: Record<string, number> = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
    const monthArray: any[] = [];
    const sortedMonths = Object.keys(monthByType).map(Number).sort((a, b) => a - b);
    for (const t of sortedMonths) {
      const data = monthByType[t];
      for (const type of Object.keys(data)) {
        if (type in monthCum) {
          monthCum[type] += data[type];
        }
      }
      monthArray.push({
        thang: t,
        ...Object.fromEntries(
          Object.keys(monthCum).map(k => [k + "_luy_ke", monthCum[k]])
        ),
      });
    }

    // Daily chart: lũy kế theo từng ngày trong tháng đang chọn
    const dayQuery = `
      WITH daily_by_type AS (
        SELECT
          bcct.ngay,
          bch.loai_cong_viec,
          SUM(bch.san_luong) AS val
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE EXTRACT(YEAR FROM bcct.ngay) = $1
          AND EXTRACT(MONTH FROM bcct.ngay) = $2
        GROUP BY bcct.ngay, bch.loai_cong_viec
      )
      SELECT
        to_char(ngay, 'DD/MM') AS ngay,
        loai_cong_viec,
        SUM(val) AS val
      FROM daily_by_type
      GROUP BY ngay, loai_cong_viec
      ORDER BY to_date(ngay, 'DD/MM'), loai_cong_viec;
    `;
    const dayResult = await pool.query(dayQuery, [nam, thang]);

    const dayByType: Record<string, Record<string, number>> = {};
    for (const row of dayResult.rows) {
      const ngay = row.ngay;
      if (!dayByType[ngay]) dayByType[ngay] = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
      dayByType[ngay][row.loai_cong_viec] = Number(row.val) || 0;
    }
    const dayCum: Record<string, number> = { lo_cho: 0, dao_lo: 0, xen_lo: 0, chong_doi: 0 };
    const dayArray: any[] = [];
    const sortedDays = Object.keys(dayByType).sort((a, b) => {
      // "DD/MM" → so sánh theo tháng + ngày
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
        ...Object.fromEntries(
          Object.keys(dayCum).map(k => [k + "_luy_ke", dayCum[k]])
        ),
      });
    }

    // Build response
    const kpiObj: Record<string, any> = {};
    for (const type of Object.keys(KE_HOACH_NAM)) {
      const thuc_te = kpiMap[type] || 0;
      const ke_hoach_nam = KE_HOACH_NAM[type];
      const ty_le = ke_hoach_nam > 0 ? Math.round((thuc_te / ke_hoach_nam) * 1000) / 10 : 0;
      kpiObj[type] = {
        thuc_te,
        ke_hoach_nam,
        ty_le,
      };
    }

    res.status(200).json({
      thang,
      nam,
      kpi: kpiObj,
      month: monthArray,
      day: dayArray,
      units: UNITS,
      labels: LABELS,
    });
  } catch (err: any) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
