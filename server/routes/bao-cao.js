import express from "express";
import pool from "../db.js";

const router = express.Router();

function clampInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

// GET /api/bao-cao        — LIST các báo cáo đã nộp (gom theo report_id)
// GET /api/bao-cao/:id    — DETAIL 1 báo cáo (cả 4 bảng)
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(clampInt(req.query.limit, 200), 500);

    const query = `
      SELECT
        r.id AS report_id,
        r.created_at,
        a.ngay,
        a.ca,
        a.duong_lo,
        a.don_vi_thi_cong,
        a.nguoi_bao_cao,
        (SELECT COUNT(*) FROM nhat_ky_ai_output  WHERE report_id = r.id) AS so_dong_ai,
        (SELECT COUNT(*) FROM nhat_ky_duong_lo WHERE report_id = r.id) AS so_dong_duong_lo,
        EXISTS (SELECT 1 FROM nhat_ky_text_raw  WHERE report_id = r.id) AS co_text,
        COALESCE(
          (
            SELECT
              CASE
                WHEN bool_or(tinh_trang = 'Nghiêm trọng') THEN 'Nghiêm trọng'
                WHEN bool_or(tinh_trang = 'Cảnh báo')     THEN 'Cảnh báo'
                WHEN bool_or(tinh_trang = 'Bình thường')  THEN 'Bình thường'
                ELSE 'Bình thường'
              END
            FROM nhat_ky_ai_output WHERE report_id = r.id
          ),
          'Bình thường'
        ) AS tinh_trang
      FROM nhat_ky_report r
      LEFT JOIN LATERAL (
        SELECT * FROM nhat_ky_ai_output WHERE report_id = r.id ORDER BY id DESC LIMIT 1
      ) a ON true
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    res.json({ total: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const reportId = parseInt(req.params.id, 10);

    const [reportRes, aiRes, duongLoRes, textRawRes] = await Promise.all([
      pool.query("SELECT * FROM nhat_ky_report    WHERE id = $1", [reportId]),
      pool.query("SELECT * FROM nhat_ky_ai_output  WHERE report_id = $1 ORDER BY id", [reportId]),
      pool.query("SELECT * FROM nhat_ky_duong_lo WHERE report_id = $1 ORDER BY id", [reportId]),
      pool.query("SELECT * FROM nhat_ky_text_raw  WHERE report_id = $1 LIMIT 1", [reportId]),
    ]);

    if (reportRes.rowCount === 0) {
      return res.status(404).json({ error: "Báo cáo không tồn tại" });
    }

    res.json({
      report:    reportRes.rows[0],
      ai_output: aiRes.rows,
      duong_lo:  duongLoRes.rows,
      text_raw:  textRawRes.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
