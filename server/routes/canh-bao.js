import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/canh-bao        — LIST cảnh báo (filter severity/status/search)
router.get("/", async (req, res, next) => {
  try {
    const { severity, status, search, limit = "200" } = req.query;

    let where = "WHERE 1=1";
    const params = [];
    if (severity) {
      params.push(severity);
      where += ` AND severity = $${params.length}`;
    }
    if (status) {
      params.push(status);
      where += ` AND trang_thai = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (noi_dung ILIKE $${params.length} OR duong_lo ILIKE $${params.length} OR nguoi_xu_ly ILIKE $${params.length})`;
    }

    const lim = Math.min(parseInt(limit, 10) || 200, 500);
    params.push(lim);

    const result = await pool.query(
      `SELECT id, report_id, ngay, ca, duong_lo, vi_tri,
              severity, noi_dung, mo_ta, trang_thai,
              nguoi_xu_ly, ghi_chu_xu_ly, created_at, updated_at
       FROM nhat_ky_canh_bao
       ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length}`,
      params
    );
    res.json({ total: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/canh-bao/:id    — DETAIL 1 cảnh báo
router.get("/:id", async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const result = await pool.query(
      "SELECT * FROM nhat_ky_canh_bao WHERE id = $1",
      [parseInt(req.params.id, 10)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cảnh báo không tồn tại" });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
