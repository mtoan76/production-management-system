import express from "express";
import pool from "../db.js";

const router = express.Router();

// Mục tiêu cả năm (đọc từ .env, fallback nếu không set)
const KE_HOACH_SAN_LUONG = Number(process.env.KE_HOACH_SAN_LUONG) || 1000000;
const KE_HOACH_TIEN_DO   = Number(process.env.KE_HOACH_TIEN_DO)   || 12000;

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

router.get("/tong-quan", async (req, res, next) => {
  try {
    const now = new Date();
    const thang = clampMonth(req.query.thang, now.getMonth() + 1);
    const nam = clampYear(req.query.nam, now.getFullYear());

    const monthQuery = `
      WITH ThongKeTheoThang AS (
        SELECT
          EXTRACT(MONTH FROM ngay)::int AS thang,
          COALESCE(SUM(san_luong_tan),  0) AS tong_san_luong,
          COALESCE(SUM(tien_do_dao_lo), 0) AS tong_tien_do
        FROM nhat_ky_ai_output
        WHERE EXTRACT(YEAR FROM ngay)  = $1
          AND EXTRACT(MONTH FROM ngay) <= $2
          AND ngay IS NOT NULL
        GROUP BY EXTRACT(MONTH FROM ngay)
      )
      SELECT
        thang,
        tong_san_luong,
        tong_tien_do,
        SUM(tong_san_luong) OVER (ORDER BY thang ASC) AS san_luong_luy_ke,
        SUM(tong_tien_do)   OVER (ORDER BY thang ASC) AS tien_do_luy_ke
      FROM ThongKeTheoThang
      ORDER BY thang ASC;
    `;

    const dayQuery = `
      WITH ThongKeTheoNgay AS (
        SELECT
          ngay,
          COALESCE(SUM(san_luong_tan),  0) AS san_luong_ngay,
          COALESCE(SUM(tien_do_dao_lo), 0) AS tien_do_ngay
        FROM nhat_ky_ai_output
        WHERE EXTRACT(YEAR FROM ngay)  = $1
          AND EXTRACT(MONTH FROM ngay) = $2
          AND ngay IS NOT NULL
        GROUP BY ngay
      )
      SELECT
        TO_CHAR(ngay, 'DD/MM') AS ngay,
        san_luong_ngay,
        tien_do_ngay,
        SUM(san_luong_ngay) OVER (ORDER BY ngay ASC) AS san_luong_luy_ke,
        SUM(tien_do_ngay)   OVER (ORDER BY ngay ASC) AS tien_do_luy_ke
      FROM ThongKeTheoNgay
      ORDER BY ngay ASC;
    `;

    const [monthResult, dayResult] = await Promise.all([
      pool.query(monthQuery, [nam, thang]),
      pool.query(dayQuery,   [nam, thang]),
    ]);

    // Lấy giá trị lũy kế từ THÁNG CUỐI CÙNG (cumulative chuẩn)
    const lastMonth = monthResult.rows[monthResult.rows.length - 1];
    const sanLuongThucTe = lastMonth ? Number(lastMonth.san_luong_luy_ke) || 0 : 0;
    const tienDoThucTe   = lastMonth ? Number(lastMonth.tien_do_luy_ke)   || 0 : 0;

    const round1 = (x) => Math.round(x * 10) / 10;
    const tyLeSanLuong = KE_HOACH_SAN_LUONG > 0
      ? round1((sanLuongThucTe / KE_HOACH_SAN_LUONG) * 100)
      : 0;
    const tyLeTienDo = KE_HOACH_TIEN_DO > 0
      ? round1((tienDoThucTe / KE_HOACH_TIEN_DO) * 100)
      : 0;

    res.json({
      thang,
      nam,
      month: monthResult.rows,
      day:   dayResult.rows,
      kpi: {
        san_luong_thuc_te:  sanLuongThucTe,
        san_luong_ke_hoach: KE_HOACH_SAN_LUONG,
        san_luong_ty_le:    tyLeSanLuong,
        tien_do_thuc_te:    tienDoThucTe,
        tien_do_ke_hoach:   KE_HOACH_TIEN_DO,
        tien_do_ty_le:      tyLeTienDo,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
