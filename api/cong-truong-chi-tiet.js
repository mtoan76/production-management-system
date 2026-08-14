import { getCongTruongChiTiet } from "../lib/queries/cong-truong.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await getCongTruongChiTiet({
      thang: req.query.thang,
      nam: req.query.nam,
      site: req.query.site,
      type: req.query.type,
    });
    res.status(200).json(data);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
