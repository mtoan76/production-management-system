import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);

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

    res.status(200).json({
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
