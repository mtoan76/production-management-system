import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

function clampInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // GET /api/bao-cao/:id — DETAIL 1 báo cáo
    if (req.query.id) {
      if (!/^\d+$/.test(req.query.id)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      const reportId = parseInt(req.query.id, 10);

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

      return res.status(200).json({
        report: reportRes.rows[0],
        cong_truong: congTruongRes.rows,
        hang_muc: hangMucRes.rows,
      });
    }

    // GET /api/bao-cao — LIST các báo cáo đã nộp
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

    res.status(200).json({
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}