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
    // GET /api/canh-bao/:id — DETAIL 1 cảnh báo
    if (req.query.id) {
      if (!/^\d+$/.test(req.query.id)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      return res.status(404).json({ error: "Cảnh báo không tồn tại (bảng cũ đã xóa)" });
    }

    // GET /api/canh-bao — LIST cảnh báo (trả về rỗng vì bảng nhat_ky_canh_bao đã bị xóa)
    // Có thể mở rộng sau: cảnh báo từ dữ liệu mới (ví dụ: sản lượng chậm tiến độ)
    res.status(200).json({ total: 0, data: [] });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}