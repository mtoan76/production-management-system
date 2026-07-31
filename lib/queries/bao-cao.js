import { pool, clampInt, HttpError } from "./helpers.js";

// Danh sách báo cáo (1 dòng = 1 báo cáo từ bao_cao, chỉ các report có dữ liệu).
// Params: { limit, tuNgay (YYYY-MM-DD), denNgay (YYYY-MM-DD), congTruong (keyword) }
export async function getBaoCaoList({ limit, tuNgay, denNgay, congTruong } = {}) {
  const safeLimit = Math.min(clampInt(limit, 200), 500);
  const tu = typeof tuNgay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(tuNgay) ? tuNgay : null;
  const den = typeof denNgay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(denNgay) ? denNgay : null;
  const kw = typeof congTruong === "string" && congTruong.trim() !== "" ? `%${congTruong.trim()}%` : null;

  const conds = [];
  const params = [];
  if (tu) {
    params.push(tu);
    conds.push(`bao_cao_cong_truong.ngay >= $${params.length}::date`);
  }
  if (den) {
    params.push(den);
    conds.push(`bao_cao_cong_truong.ngay <= $${params.length}::date`);
  }
  if (kw) {
    params.push(kw);
    conds.push(`bao_cao_cong_truong.cong_truong ILIKE $${params.length}`);
  }
  const whereExtra = conds.length ? `AND ${conds.join(" AND ")}` : "";

  params.push(safeLimit);
  const query = `
    SELECT
      bc.id AS report_id,
      bc.created_at,
      bcct.ngay,
      bcct.cong_truong,
      bcct.so_lao_dong,
      bcct.cong_viec_khac,
      bcct.su_co,
      bcct.ghi_chu,
      (SELECT COUNT(DISTINCT ca) FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS so_ca,
      (SELECT bool_or(su_co IS NOT NULL AND su_co != '' AND su_co != 'bình thường' AND su_co != 'Bình thường' AND su_co != 'Không có sự cố')
       FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS co_su_co,
      (SELECT COALESCE(SUM(so_lao_dong), 0)::int
       FROM bao_cao_cong_truong WHERE bao_cao_id = bc.id) AS tong_so_lao_dong
    FROM bao_cao bc
    INNER JOIN LATERAL (
      SELECT * FROM bao_cao_cong_truong
       WHERE bao_cao_id = bc.id
       ${whereExtra}
       ORDER BY id DESC LIMIT 1
    ) bcct ON true
    ORDER BY bc.created_at DESC, bc.id DESC
    LIMIT $${params.length};
  `;
  const result = await pool.query(query, params);
  return { total: result.rowCount, data: result.rows };
}

// Chi tiết 1 báo cáo (accordion theo Ca): { report, ca_list }
// Trong đó mỗi ca có hang_muc_by_type = { lo_cho, dao_lo, xen_lo, chong_doi }.
export async function getBaoCaoDetail({ id } = {}) {
  if (!id || !/^\d+$/.test(String(id))) {
    throw new HttpError(400, "Invalid id");
  }
  const reportId = parseInt(String(id), 10);

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
    throw new HttpError(404, "Báo cáo không tồn tại");
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

  return {
    report: reportRes.rows[0],
    ca_list,
  };
}
