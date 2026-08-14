import { getBaoCaoList, getBaoCaoDetail } from "../lib/queries/bao-cao.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // GET /api/bao-cao?id=<id>  → DETAIL 1 báo cáo (Vercel không hỗ trợ path param ở file này)
    if (req.query.id) {
      const data = await getBaoCaoDetail({ id: req.query.id });
      return res.status(200).json(data);
    }

    // GET /api/bao-cao  → LIST báo cáo
    const data = await getBaoCaoList({
      limit: req.query.limit,
      tuNgay: req.query.tu_ngay,
      denNgay: req.query.den_ngay,
      congTruong: req.query.cong_truong,
    });
    res.status(200).json(data);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
