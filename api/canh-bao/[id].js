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
  const alertId = parseInt(id, 10);

  try {
    const result = await pool.query(
      "SELECT * FROM nhat_ky_canh_bao WHERE id = $1",
      [alertId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cảnh báo không tồn tại" });
    }
    res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
