import { pool, clampMonth, clampYear } from "./helpers.js";

// Đường lò theo ngày: sản lượng lũy kế (lo_cho) + tiến độ lũy kế (dao_lo) của từng đường lò trong tháng.
export async function getDuongLo({ thang, nam } = {}) {
  const now = new Date();
  const month = clampMonth(thang, now.getMonth() + 1);
  const year = clampYear(nam, now.getFullYear());

  const query = `
    WITH raw AS (
      SELECT
          bcct.ngay,
          bch.duong_lo,
          bch.loai_cong_viec,
          bch.san_luong,
          bc.created_at
      FROM bao_cao_hang_muc bch
      JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
      JOIN bao_cao bc ON bc.id = bcct.bao_cao_id
      WHERE EXTRACT(YEAR  FROM bcct.ngay) = $2
        AND EXTRACT(MONTH FROM bcct.ngay) = $1
        AND bch.duong_lo IS NOT NULL
    ),
    daily AS (
      SELECT
          ngay,
          duong_lo,
          COALESCE(SUM(san_luong) FILTER (WHERE loai_cong_viec = 'lo_cho'), 0)::numeric AS lo_cho_val,
          COALESCE(SUM(san_luong) FILTER (WHERE loai_cong_viec = 'dao_lo'), 0)::numeric AS dao_lo_val,
          MAX(created_at) AS last_report_at
      FROM raw
      GROUP BY ngay, duong_lo
    )
    SELECT
        duong_lo,
        TO_CHAR(ngay, 'DD/MM')                                       AS ngay_bao_cao,
        TO_CHAR(last_report_at, 'DD/MM/YYYY HH24:MI:SS')             AS thoi_gian_bao_cao,
        SUM(lo_cho_val) OVER (PARTITION BY duong_lo ORDER BY ngay)    AS san_luong_luy_ke,
        SUM(dao_lo_val) OVER (PARTITION BY duong_lo ORDER BY ngay)    AS tien_do_luy_ke
    FROM daily
    ORDER BY duong_lo, ngay;
  `;

  const result = await pool.query(query, [month, year]);

  return {
    thang: month,
    nam: year,
    data: result.rows,
  };
}
