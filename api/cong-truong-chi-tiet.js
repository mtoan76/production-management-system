import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

// ─── Danh sách công trường (đồng bộ với /api/cong-truong) ──────────────────
const KHAI_THAC_SITES = [
  "CT Khai thác 1", "CT Khai thác 2", "CT Khai thác 3",
  "CT Khai thác 5", "CT Khai thác 6", "CT Khai thác 8",
  "Cơ giới hóa 1",
];
const DAO_LO_SITES = [
  "CT Đào lò 1", "CT Đào lò 2", "CT Đào lò 3", "CT Đào lò 6",
];

// ─── Map site name đã được simplify ở frontend về tên gốc trong DB ────────
// Frontend hiển thị "1" thay vì "CT Khai thác 1", "Đào lò 1" thay vì "CT Đào lò 1"
// → backend cần reverse map để query đúng `cong_truong`
function resolveSiteName(siteParam, type) {
  const s = (siteParam || "").trim();
  if (!s) return "";
  if (type === "khai_thac") {
    if (s.startsWith("Cơ giới hóa")) return s;          // giữ nguyên
    if (/^\d+$/.test(s)) return `CT Khai thác ${s}`;   // "1" → "CT Khai thác 1"
    return s;
  }
  if (type === "dao_lo") {
    if (s.startsWith("Đào lò ")) return `CT ${s}`;     // "Đào lò 1" → "CT Đào lò 1"
    return s;
  }
  return s;
}

function clampMonth(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(12, n));
}
function clampYear(v, fallback) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1970, Math.min(9999, n));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());
    const type = req.query.type === "dao_lo" ? "dao_lo" : "khai_thac";
    const siteParam = req.query.site;
    if (!siteParam) {
      return res.status(400).json({ error: "Missing required query param: site" });
    }

    const originalSite = resolveSiteName(siteParam, type);
    // Whitelist check: chỉ chấp nhận site nằm trong danh sách → chặn SQL injection / query lung tung
    const validSites = type === "khai_thac" ? KHAI_THAC_SITES : DAO_LO_SITES;
    if (!validSites.includes(originalSite)) {
      return res.status(200).json({
        data: { daoLo: [], xenLo: [], chongDoi: [] },
        thang, nam, site: originalSite, type,
      });
    }

    // ─── Query chính ─────────────────────────────────────────────────────────
    // Lấy lũy kế tháng + per-ca (Ca 1/2/3) cho từng đường lò × loại công việc,
    // giới hạn trong 1 công trường cụ thể.
    //
    // Lưu ý về schema:
    //   bao_cao_hang_muc.san_luong = số lượng theo ngày (tấn cho lò chợ, mét cho đào/xén/chống)
    //   bao_cao_cong_truong.ca = ca làm việc (1/2/3)
    //   bao_cao_cong_truong.cong_truong = tên công trường
    const query = `
      WITH filtered AS (
        SELECT
          bcct.ngay,
          bcct.ca,
          bch.duong_lo,
          bch.loai_cong_viec,
          bch.san_luong,
          bch.tiet_dien
        FROM bao_cao_hang_muc bch
        JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id
        WHERE bcct.cong_truong = $1
          AND EXTRACT(YEAR  FROM bcct.ngay) = $3
          AND EXTRACT(MONTH FROM bcct.ngay) = $2
          AND bch.duong_lo IS NOT NULL
          AND bch.loai_cong_viec IN ('dao_lo', 'xen_lo', 'chong_doi')
      ),
      daily AS (
        SELECT duong_lo, loai_cong_viec, ngay,
               SUM(san_luong)::numeric AS val
        FROM filtered
        GROUP BY duong_lo, loai_cong_viec, ngay
      ),
      cumulative AS (
        SELECT duong_lo, loai_cong_viec, ngay, val,
               SUM(val) OVER (PARTITION BY duong_lo, loai_cong_viec ORDER BY ngay) AS tien_do,
               ROW_NUMBER() OVER (PARTITION BY duong_lo, loai_cong_viec ORDER BY ngay DESC) AS rn
        FROM daily
      ),
      -- Tiết diện: lấy giá trị KHÔNG NULL gần nhất của 1 đường lò × loại CV (1 tunnel có thể báo nhiều ca, lấy tiết diện từ bất kỳ record nào)
      tiet_dien_pick AS (
        SELECT DISTINCT ON (duong_lo, loai_cong_viec)
          duong_lo,
          loai_cong_viec,
          tiet_dien
        FROM filtered
        WHERE tiet_dien IS NOT NULL
        ORDER BY duong_lo, loai_cong_viec, ngay DESC
      ),
      per_ca AS (
        SELECT duong_lo, loai_cong_viec,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 1), 0)::numeric AS ca1,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 2), 0)::numeric AS ca2,
               COALESCE(SUM(san_luong) FILTER (WHERE ca = 3), 0)::numeric AS ca3
        FROM filtered
        GROUP BY duong_lo, loai_cong_viec
      )
      SELECT
        c.duong_lo,
        c.loai_cong_viec,
        c.tien_do,
        p.ca1,
        p.ca2,
        p.ca3,
        td.tiet_dien
      FROM cumulative c
      JOIN per_ca p
        ON p.duong_lo = c.duong_lo
       AND p.loai_cong_viec = c.loai_cong_viec
      LEFT JOIN tiet_dien_pick td
        ON td.duong_lo = c.duong_lo
       AND td.loai_cong_viec = c.loai_cong_viec
      WHERE c.rn = 1
      ORDER BY c.loai_cong_viec, c.duong_lo;
    `;

    const result = await pool.query(query, [originalSite, thang, nam]);

    // ─── Group rows theo loai_cong_viec → trả về 3 mảng cho frontend ────────
    const toTunnel = (r) => ({
      duong_lo: r.duong_lo,
      tiet_dien: r.tiet_dien !== null && r.tiet_dien !== undefined ? Number(r.tiet_dien) : null,
      tien_do: Number(r.tien_do) || 0,
      ca1: Number(r.ca1) || 0,
      ca2: Number(r.ca2) || 0,
      ca3: Number(r.ca3) || 0,
    });

    const daoLo    = result.rows.filter((r) => r.loai_cong_viec === "dao_lo").map(toTunnel);
    const xenLo    = result.rows.filter((r) => r.loai_cong_viec === "xen_lo").map(toTunnel);
    const chongDoi = result.rows.filter((r) => r.loai_cong_viec === "chong_doi").map(toTunnel);

    return res.status(200).json({
      data: { daoLo, xenLo, chongDoi },
      thang, nam, site: originalSite, type,
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}