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

  const idStr = req.query.id;
  if (!idStr || !/^\d+$/.test(String(idStr))) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    // Bảng nhat_ky_canh_bao đã bị xóa khi migrate sang schema 3 bảng mới
    // → trả 404 để frontend biết không có dữ liệu (đồng bộ với server/routes/canh-bao.js)
    return res.status(404).json({ error: "Cảnh báo không tồn tại (bảng cũ đã xóa)" });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}