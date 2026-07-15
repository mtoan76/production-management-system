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

  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const reportId = parseInt(id, 10);

  try {
    const [reportRes, aiRes, duongLoRes, textRawRes] = await Promise.all([
      pool.query("SELECT * FROM nhat_ky_report    WHERE id = $1", [reportId]),
      pool.query("SELECT * FROM nhat_ky_ai_output  WHERE report_id = $1 ORDER BY id", [reportId]),
      pool.query("SELECT * FROM nhat_ky_duong_lo WHERE report_id = $1 ORDER BY id", [reportId]),
      pool.query("SELECT * FROM nhat_ky_text_raw  WHERE report_id = $1 LIMIT 1", [reportId]),
    ]);

    if (reportRes.rowCount === 0) {
      return res.status(404).json({ error: "Báo cáo không tồn tại" });
    }

    res.status(200).json({
      report:    reportRes.rows[0],
      ai_output: aiRes.rows,
      duong_lo:  duongLoRes.rows,
      text_raw:  textRawRes.rows[0] || null,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
