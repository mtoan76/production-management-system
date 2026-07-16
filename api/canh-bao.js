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

  const query = `
    SELECT
      id, report_id, ngay, ca, duong_lo, vi_tri,
      severity, noi_dung, mo_ta, trang_thai,
      nguoi_xu_ly, ghi_chu_xu_ly, created_at, updated_at
    FROM nhat_ky_canh_bao
    ${where}
    ORDER BY created_at DESC
    LIMIT $${params.length}
  `;

  try {
    const result = await pool.query(query, params);
    res.status(200).json({
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
