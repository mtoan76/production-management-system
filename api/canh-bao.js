import { getCanhBaoList, getCanhBaoDetail } from "../lib/queries/canh-bao.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // GET /api/canh-bao?id=<id> → DETAIL 1 cảnh báo
    if (req.query.id) {
      const data = await getCanhBaoDetail({ id: req.query.id });
      return res.status(200).json(data);
    }

    // GET /api/canh-bao → LIST cảnh báo
    res.status(200).json(await getCanhBaoList());
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
