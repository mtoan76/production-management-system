import express from "express";
import pool from "../db.js";

const router = express.Router();

function clampInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

// GET /api/bao-cao        — LIST các báo cáo đã nộp (gom theo report_id từ bao_cao)
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(clampInt(req.query.limit, 200), 500);

    const query = `
      SELECT
        bc.id AS report_id,
        bc.created_at,
        bcct.ngay,
        bcct.ca,
        (SELECT COUNT(*) FROM bao_cao_hang_muc bch WHERE bch.bao_cao_cong_truong_id = bcct.id) AS so_hang_muc,
        COALESCE(
          (
            SELECT
              CASE
                WHEN bool_or(bch.loai_cong_viec = 'lo_cho') THEN 'Có sản lượng'
                ELSE 'Không có sản lượng'
              END
            FROM bao_cao_hang_muc bch WHERE bch.bao_cao_cong_truong_id = bcct.id
          ),
          'Không có dữ liệu'
        ) AS tinh_trang
      FROM bao_cao bc
      LEFT JOIN LATERAL (
        SELECT * FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id ORDER BY id DESC LIMIT 1
      ) bcct ON true
      ORDER BY bc.created_at DESC, bc.id DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);
    res.json({ total: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/bao-cao/:id    — DETAIL 1 báo cáo (cả 3 bảng mới)
router.get("/:id", async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const reportId = parseInt(req.params.id, 10);

    const [reportRes, congTruongRes, hangMucRes] = await Promise.all([
      pool.query("SELECT * FROM bao_cao WHERE id = $1", [reportId]),
      pool.query("SELECT * FROM bao_cao_cong_truong WHERE bao_cao_id = $1 ORDER BY id", [reportId]),
      pool.query(`
        SELECT bch.*, bcct.ngay, bcct.ca, bcct.duong_lo
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE bcct.bao_cao_id = $1
        ORDER BY bch.id
      `, [reportId]),
    ]);

    if (reportRes.rowCount === 0) {
      return res.status(404).json({ error: "Báo cáo không tồn tại" });
    }

    res.json({
      report: reportRes.rows[0],
      cong_truong: congTruongRes.rows,
      hang_muc: hangMucRes.rows,
    });
  } catch (err) {
    next(err);
  }
});

export default router;