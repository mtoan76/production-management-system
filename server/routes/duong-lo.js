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

router.get("/duong-lo", async (req, res, next) => {
  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());

    const query = `
      WITH DailyTotals AS (
        SELECT
            duong_lo,
            ngay,
            MAX(created_at) AS thoi_gian_bao_cao,
            COALESCE(SUM(san_luong_tan),  0) AS san_luong_ngay,
            COALESCE(SUM(tien_do_dao_lo), 0) AS tien_do_ngay
        FROM nhat_ky_ai_output
        WHERE duong_lo IN ('Đường lò 1', 'Đường lò 2', 'Đường lò 3')
          AND EXTRACT(MONTH FROM ngay) = $1
          AND EXTRACT(YEAR FROM ngay)  = $2
          AND ngay IS NOT NULL
        GROUP BY duong_lo, ngay
      )
      SELECT
          duong_lo,
          TO_CHAR(ngay, 'DD/MM') AS ngay_bao_cao,
          TO_CHAR(thoi_gian_bao_cao, 'DD/MM/YYYY HH24:MI:SS') AS thoi_gian_bao_cao,
          SUM(san_luong_ngay) OVER (PARTITION BY duong_lo ORDER BY ngay) AS san_luong_luy_ke,
          SUM(tien_do_ngay)   OVER (PARTITION BY duong_lo ORDER BY ngay) AS tien_do_luy_ke
      FROM DailyTotals
      ORDER BY duong_lo, ngay;
    `;

    const result = await pool.query(query, [thang, nam]);

    res.json({
      thang,
      nam,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
