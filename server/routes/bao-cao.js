import express from "express";
import pool from "../db.js";

const router = express.Router();

function clampInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

// GET /api/bao-cao        — LIST báo cáo (1 dòng = 1 báo cáo từ bao_cao, chỉ các report có dữ liệu)
// Query params: ?limit=&tu_ngay=YYYY-MM-DD&den_ngay=YYYY-MM-DD&cong_truong=<keyword>
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(clampInt(req.query.limit, 200), 500);
    const tuNgay = typeof req.query.tu_ngay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.tu_ngay)
      ? req.query.tu_ngay : null;
    const denNgay = typeof req.query.den_ngay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.den_ngay)
      ? req.query.den_ngay : null;
    const congTruongKw = typeof req.query.cong_truong === "string" && req.query.cong_truong.trim() !== ""
      ? `%${req.query.cong_truong.trim()}%` : null;

    const conds = [];
    const params = [];
    if (tuNgay) {
      params.push(tuNgay);
      conds.push(`bao_cao_cong_truong.ngay >= $${params.length}::date`);
    }
    if (denNgay) {
      params.push(denNgay);
      conds.push(`bao_cao_cong_truong.ngay <= $${params.length}::date`);
    }
    if (congTruongKw) {
      params.push(congTruongKw);
      conds.push(`bao_cao_cong_truong.cong_truong ILIKE $${params.length}`);
    }
    const whereExtra = conds.length ? `AND ${conds.join(" AND ")}` : "";

    params.push(limit);
    const query = `
      SELECT
        bc.id AS report_id,
        bc.created_at,
        bcct.ngay,
        bcct.cong_truong,
        bcct.so_lao_dong,
        bcct.cong_viec_khac,
        bcct.su_co,
        bcct.ghi_chu,
        (SELECT COUNT(DISTINCT ca) FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS so_ca,
        (SELECT bool_or(su_co IS NOT NULL AND su_co != '' AND su_co != 'bình thường' AND su_co != 'Bình thường' AND su_co != 'Không có sự cố')
         FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS co_su_co,
        (SELECT COALESCE(SUM(so_lao_dong), 0)::int
         FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS tong_so_lao_dong
      FROM bao_cao bc
      INNER JOIN LATERAL (
        SELECT * FROM bao_cao_cong_truong
         WHERE bao_cao_id = bc.id
         ${whereExtra}
         ORDER BY id DESC LIMIT 1
      ) bcct ON true
      ORDER BY bc.created_at DESC, bc.id DESC
      LIMIT $${params.length};
    `;
    const result = await pool.query(query, params);
    res.json({ total: result.rowCount, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/bao-cao/:id    — DETAIL 1 báo cáo (accordion theo Ca)
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
        SELECT bch.*, bcct.ngay, bcct.ca, bcct.cong_truong, bcct.so_lao_dong, bcct.cong_viec_khac, bcct.su_co, bcct.ghi_chu
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE bcct.bao_cao_id = $1
        ORDER BY bcct.ca, bch.loai_cong_viec, bch.id
      `, [reportId]),
    ]);

    if (reportRes.rowCount === 0) {
      return res.status(404).json({ error: "Báo cáo không tồn tại" });
    }

    // Group hang_muc by Ca, then by loai_cong_viec
    const caMap = new Map();
    for (const ct of congTruongRes.rows) {
      caMap.set(ct.ca, {
        ca: ct.ca,
        ngay: ct.ngay,
        cong_truong: ct.cong_truong,
        so_lao_dong: ct.so_lao_dong,
        cong_viec_khac: ct.cong_viec_khac,
        su_co: ct.su_co,
        ghi_chu: ct.ghi_chu,
        hang_muc_by_type: {
          lo_cho: [],
          dao_lo: [],
          xen_lo: [],
          chong_doi: [],
        },
      });
    }

    for (const hm of hangMucRes.rows) {
      const caData = caMap.get(hm.ca);
      if (caData && caData.hang_muc_by_type[hm.loai_cong_viec] !== undefined) {
        caData.hang_muc_by_type[hm.loai_cong_viec].push({
          id: hm.id,
          duong_lo: hm.duong_lo,
          loai_cong_viec: hm.loai_cong_viec,
          san_luong: hm.san_luong,
          tiet_dien: hm.tiet_dien,
          tiet_dien_don_vi: hm.tiet_dien_don_vi,
        });
      }
    }

    const caList = Array.from(caMap.values()).sort((a, b) => a.ca - b.ca);

    res.json({
      report: reportRes.rows[0],
      ca_list: caList,
    });
  } catch (err) {
    next(err);
  }
});

export default router;