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

  // Path-based: /api/bao-cao/:id → Vercel route file api/bao-cao/[id].js
  // req.query.id được Vercel tự điền từ path segment
  const idStr = req.query.id;
  if (!idStr || !/^\d+$/.test(String(idStr))) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const reportId = parseInt(String(idStr), 10);

  try {
    const [reportRes, congTruongRes, hangMucRes] = await Promise.all([
      pool.query("SELECT * FROM bao_cao WHERE id = $1", [reportId]),
      pool.query("SELECT * FROM bao_cao_cong_truong WHERE bao_cao_id = $1 ORDER BY id", [reportId]),
      pool.query(`
        SELECT bch.*, bcct.ngay, bcct.ca, bcct.cong_truong, bcct.so_lao_dong, bcct.cong_viec_khac, bcct.su_co, bcct.ghi_chu
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE bcct.bao_cao_id = $1
        ORDER BY bcct.ca, bch.loai_cong_viec, bch.id
      `, [reportId]),
    ]);

    if (reportRes.rowCount === 0) {
      return res.status(404).json({ error: "Báo cáo không tồn tại" });
    }

    // Group hang_muc by Ca, then by loai_cong_viec
    const caMap = new Map();
    for (const ct of congTruongRes.rows) {
      caMap.set(ct.ca, {
        ca: ct.ca,
        ngay: ct.ngay,
        cong_truong: ct.cong_truong,
        so_lao_dong: ct.so_lao_dong,
        cong_viec_khac: ct.cong_viec_khac,
        su_co: ct.su_co,
        ghi_chu: ct.ghi_chu,
        hang_muc_by_type: {
          lo_cho: [],
          dao_lo: [],
          xen_lo: [],
          chong_doi: [],
        },
      });
    }

    for (const hm of hangMucRes.rows) {
      const caData = caMap.get(hm.ca);
      if (caData && caData.hang_muc_by_type[hm.loai_cong_viec] !== undefined) {
        caData.hang_muc_by_type[hm.loai_cong_viec].push({
          id: hm.id,
          duong_lo: hm.duong_lo,
          loai_cong_viec: hm.loai_cong_viec,
          san_luong: hm.san_luong,
          tiet_dien: hm.tiet_dien,
          tiet_dien_don_vi: hm.tiet_dien_don_vi,
        });
      }
    }

    const ca_list = Array.from(caMap.values()).sort((a, b) => a.ca - b.ca);

    res.status(200).json({
      report: reportRes.rows[0],
      ca_list,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}