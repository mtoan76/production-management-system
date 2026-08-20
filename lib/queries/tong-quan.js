import { UNITS, LABELS, clampMonth, clampYear, safeQuery, clampInt, getKeHoachMap } from "./helpers.js";
import pool from "../db.js";

// ─── Cấu hình 5 thẻ KPI Tổng quan (map với chi_tieu_kpi.ma_chi_tieu) ──
export const KPI_DEFS = [
  { key: "san_luong_than", label: "Sản lượng Than Lũy kế", unit: "Tấn" },
  { key: "dao_lo",        label: "Tiến độ Đào lò Lũy kế", unit: "Mét" },
  { key: "xen_lo",        label: "Xén lò Lũy kế",          unit: "Mét" },
  { key: "doanh_thu",     label: "Doanh thu Lũy kế",       unit: "Tỷ VNĐ" },
  { key: "tieu_thu",      label: "Tiêu thụ Lũy kế",        unit: "Tấn" },
];

// Helper: tính ngày trong năm + số ngày còn lại
function getDayOfYearInfo(refDate = new Date()) {
  const year = refDate.getFullYear();
  const start = new Date(year, 0, 1);
  const dayOfYear = Math.floor((refDate.getTime() - start.getTime()) / 86400000) + 1;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const soNgayConLai = Math.max(totalDays - dayOfYear, 0);
  const tienDoThoiGian = totalDays > 0 ? Math.round((dayOfYear / totalDays) * 1000) / 10 : 0;
  return { year, dayOfYear, totalDays, soNgayConLai, tienDoThoiGian };
}

// ── Hàm chính: JOIN chi_tieu_kpi + bao_cao_hang_ngay ────────────
// Excel → DB: NgayBaoCao → bao_cao_hang_ngay.ngay_bao_cao
//           TenChiTieu/ MaChiTieu → chi_tieu_kpi.ma_chi_tieu / ten_chi_tieu
//           DonViTinh → chi_tieu_kpi.don_vi_tinh
//           KeHoachNam → chi_tieu_kpi.ke_hoach_nam
//           ThucHienTrongNgay → bao_cao_hang_ngay.thuc_hien_trong_ngay
//           LuyKeThucHien → bao_cao_hang_ngay.luy_ke_thuc_hien (lấy bản ghi mới nhất theo ngay)
//           Tỷ lệ = luy_ke / ke_hoach *100
export async function getTongQuan({ thang, nam, bao_cao_id } = {}) {
  const now = new Date();
  const month = clampMonth(thang, now.getMonth() + 1);
  const year = clampYear(nam, now.getFullYear());
  const { dayOfYear, totalDays, soNgayConLai, tienDoThoiGian } = getDayOfYearInfo(now);

  // 1) Query chuẩn: JOIN 2 bảng mới chi_tieu_kpi + bao_cao_hang_ngay
  // Lấy KeHoachNam từ chi_tieu_kpi, LuyKe từ bản ghi mới nhất của bao_cao_hang_ngay
  const sqlNew = `
    SELECT
      c.ma_chi_tieu AS key,
      c.ten_chi_tieu AS ten_chi_tieu,
      c.don_vi_tinh AS dvt,
      c.ke_hoach_nam::float AS ke_hoach_nam,
      COALESCE(b.thuc_hien_trong_ngay, 0)::float AS thuc_hien_ngay,
      COALESCE(b.luy_ke_thuc_hien, 0)::float AS luy_ke,
      b.ngay_bao_cao AS ngay_bao_cao
    FROM chi_tieu_kpi c
    LEFT JOIN LATERAL (
      SELECT ngay_bao_cao, thuc_hien_trong_ngay, luy_ke_thuc_hien
      FROM bao_cao_hang_ngay
      WHERE chi_tieu_id = c.id
      ORDER BY ngay_bao_cao DESC
      LIMIT 1
    ) b ON true
    WHERE c.nam = $1
    ORDER BY c.ma_chi_tieu
  `;

  let rows = [];
  let source = "chi_tieu_kpi+bao_cao_hang_ngay";
  try {
    const r = await pool.query(sqlNew, [year]);
    if (r.rows.length > 0) {
      rows = r.rows;
    } else {
      console.warn(`[tong-quan] chi_tieu_kpi nam=${year} rỗng, thử fallback ke_hoach_nam+sxkd`);
    }
  } catch (e) {
    console.warn("[tong-quan] query chi_tieu_kpi failed:", e.message);
  }

  // 2) Fallback nếu chi_tieu_kpi trống: lấy KeHoach từ chi_tieu_kpi (nếu có) và để luy_ke=0
  // Không còn bảng ke_hoach_nam - đã DROP ở 004, chỉ dùng chi_tieu_kpi
  if (rows.length === 0) {
    try {
      const keHoach = await getKeHoachMap(year);
      if (keHoach._source !== "empty") {
        const keMap = { san_luong_than: keHoach.san_luong_than, dao_lo: keHoach.dao_lo, xen_lo: keHoach.xen_lo, doanh_thu: keHoach.doanh_thu, tieu_thu: keHoach.tieu_thu };
        const dvtMap = keHoach._dvt || {};
        rows = Object.keys(keMap).map(k=> ({
          key: k,
          ten_chi_tieu: KPI_DEFS.find(d=>d.key===k)?.label || k,
          dvt: dvtMap[k] || KPI_DEFS.find(d=>d.key===k)?.unit || "",
          ke_hoach_nam: Number(keMap[k])||0,
          thuc_hien_ngay: 0,
          luy_ke: 0,
          ngay_bao_cao: null,
        }));
        source = "chi_tieu_kpi-empty-luyke";
      }
    } catch (e) {
      console.warn("[tong-quan] fallback chi_tieu_kpi failed:", e.message);
    }
  }

  // 3) Đảm bảo đủ 5 key (nếu chi_tieu_kpi thiếu dòng, bổ sung 0)
  const rowMap = new Map(rows.map(r=>[r.key, r]));
  for (const def of KPI_DEFS) {
    if (!rowMap.has(def.key)) {
      rowMap.set(def.key, { key: def.key, ten_chi_tieu: def.label, dvt: def.unit, ke_hoach_nam: 0, thuc_hien_ngay: 0, luy_ke: 0, ngay_bao_cao: null });
    }
  }

  // 4) Tính toán chuẩn: ty_le, con_phai, binh_quan
  const kpiCards = KPI_DEFS.map(def => {
    const r = rowMap.get(def.key);
    const keHoach = Number(r.ke_hoach_nam) || 0;
    const luyKe = Number(r.luy_ke) || 0;
    const thucNgay = Number(r.thuc_hien_ngay) || 0;
    const tyLe = keHoach > 0 ? Math.round((luyKe / keHoach) * 10000) / 100 : 0;
    const conPhai = Math.max(keHoach - luyKe, 0);
    const binhQuan = soNgayConLai > 0 ? Math.round((conPhai / soNgayConLai) * 100) / 100 : 0;
    return {
      key: def.key,
      label: def.label,
      ten_chi_tieu: r.ten_chi_tieu,
      dvt: r.dvt || def.unit,
      // từ Excel/DB
      ke_hoach_nam: keHoach,
      luy_ke_thuc_hien: luyKe,
      thuc_hien_trong_ngay: thucNgay,
      ngay_bao_cao: r.ngay_bao_cao,
      // alias cũ để frontend không vỡ
      thuc_hien: luyKe,
      luy_ke: luyKe,
      thucHien: luyKe,
      keHoachNam: keHoach,
      // tính toán
      ty_le_hoan_thanh: tyLe,
      tyLe: tyLe,
      con_phai_thuc_hien: conPhai,
      conPhai: conPhai,
      binh_quan_can_dat_ngay: binhQuan,
      binhQuan: binhQuan,
      so_ngay_con_lai: soNgayConLai,
    };
  });

  const bangTongHop = kpiCards.map(c => ({
    chi_tieu: c.ten_chi_tieu.replace(" Lũy kế",""),
    ma_chi_tieu: c.key,
    key: c.key,
    don_vi_tinh: c.dvt,
    ke_hoach_nam: c.ke_hoach_nam,
    luy_ke_thuc_hien: c.luy_ke,
    thuc_hien: c.luy_ke,
    ty_le_hoan_thanh: c.ty_le_hoan_thanh,
    tien_do_thoi_gian: tienDoThoiGian,
    danh_gia: c.ty_le_hoan_thanh >= tienDoThoiGian ? "Đạt" : "Chưa đạt",
    danhGia: c.ty_le_hoan_thanh >= tienDoThoiGian ? "Đạt" : "Chưa đạt",
    con_phai: c.con_phai_thuc_hien,
    binh_quan: c.binh_quan_can_dat_ngay,
    dvt: c.dvt,
  }));

  // legacy kpi cho OverviewScreen cũ (kpi.lo_cho etc.)
  const legacyKpi = {};
  const legacyMap = { san_luong_than: "lo_cho", dao_lo: "dao_lo", xen_lo: "xen_lo", doanh_thu: "doanh_thu", tieu_thu: "tieu_thu" };
  for (const card of kpiCards) {
    const lk = legacyMap[card.key] || card.key;
    legacyKpi[lk] = { thuc_te: card.luy_ke, ke_hoach_nam: card.ke_hoach_nam, ty_le: card.ty_le_hoan_thanh, dvt: card.dvt };
  }
  legacyKpi.chong_doi = legacyKpi.chong_doi || { thuc_te: 0, ke_hoach_nam: 0, ty_le: 0, dvt: "m" };

  // 5) Lịch sử theo ngày/tháng cho 5 KPI (để OverviewScreen hiển thị theo ngày/tháng)
  // Lấy toàn bộ lịch sử năm hiện tại từ bao_cao_hang_ngay để dựng month[] và day[]
  let monthArr = [];
  let dayArr = [];
  try {
    const hist = await pool.query(`
      SELECT b.ngay_bao_cao, c.ma_chi_tieu,
             b.luy_ke_thuc_hien::float AS luy_ke
      FROM bao_cao_hang_ngay b
      JOIN chi_tieu_kpi c ON c.id = b.chi_tieu_id
      WHERE c.nam = $1
        AND EXTRACT(YEAR FROM b.ngay_bao_cao) = $1
      ORDER BY b.ngay_bao_cao ASC, c.ma_chi_tieu
    `, [year]);
    if (hist.rows.length > 0) {
      // Build day map: ngay(DD/MM) -> {san_luong_than, dao_lo, ...}
      const dayMap = new Map();
      const monthMap = new Map();
      for (const r of hist.rows) {
        const d = new Date(r.ngay_bao_cao);
        const dd = String(d.getDate()).padStart(2,'0');
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const dayKey = `${dd}/${mm}`;
        const monthKey = d.getMonth()+1;
        const k = r.ma_chi_tieu;
        if (!dayMap.has(dayKey)) dayMap.set(dayKey, { ngay: dayKey, _date: d });
        if (!monthMap.has(monthKey)) monthMap.set(monthKey, {});
        dayMap.get(dayKey)[k] = Number(r.luy_ke)||0;
        // month lấy luy_ke cuối tháng (ghi đè, do ORDER BY ASC nên cuối cùng là mới nhất)
        monthMap.get(monthKey)[k] = Number(r.luy_ke)||0;
      }
      // Chuyển dayMap thành mảng theo thứ tự ngày, map sang format legacy lo_cho/dao_lo...
      const keyToLegacy = { san_luong_than: "lo_cho", dao_lo: "dao_lo", xen_lo: "xen_lo", doanh_thu: "doanh_thu", tieu_thu: "tieu_thu" };
      dayArr = Array.from(dayMap.values())
        .sort((a,b)=>a._date - b._date)
        .map(entry=>{
          const o = { ngay: entry.ngay };
          for (const [k,legacy] of Object.entries(keyToLegacy)) {
            o[legacy + "_luy_ke"] = entry[k] ?? 0;
            o[k + "_luy_ke"] = entry[k] ?? 0; // cả key mới
          }
          // legacy chong_doi
          o["chong_doi_luy_ke"]=0;
          return o;
        });
      monthArr = Array.from(monthMap.entries())
        .sort((a,b)=>a[0]-b[0])
        .map(([thang, vals])=>{
          const o = { thang };
          for (const [k,legacy] of Object.entries(keyToLegacy)) {
            o[legacy + "_luy_ke"] = vals[k] ?? 0;
            o[k + "_luy_ke"] = vals[k] ?? 0;
          }
          o["chong_doi_luy_ke"]=0;
          return o;
        });
    }
  } catch (e) {
    console.warn("[tong-quan] build month/day history failed:", e.message);
  }

  // Fallback: nếu chưa có lịch sử thì tạo 1 điểm từ luy_ke hiện tại để chart không trống
  if (dayArr.length === 0) {
    const last = {};
    for (const c of kpiCards) {
      last[c.key + "_luy_ke"] = c.luy_ke;
      const legacy = { san_luong_than:"lo_cho", dao_lo:"dao_lo", xen_lo:"xen_lo", doanh_thu:"doanh_thu", tieu_thu:"tieu_thu" }[c.key];
      if (legacy) last[legacy + "_luy_ke"] = c.luy_ke;
    }
    last["chong_doi_luy_ke"]=0;
    const todayStr = String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0');
    dayArr = [{ ngay: todayStr, ...last }];
  }
  if (monthArr.length === 0) {
    const last = {};
    for (const c of kpiCards) {
      last[c.key + "_luy_ke"] = c.luy_ke;
      const legacy = { san_luong_than:"lo_cho", dao_lo:"dao_lo", xen_lo:"xen_lo", doanh_thu:"doanh_thu", tieu_thu:"tieu_thu" }[c.key];
      if (legacy) last[legacy + "_luy_ke"] = c.luy_ke;
    }
    last["chong_doi_luy_ke"]=0;
    monthArr = [{ thang: month, ...last }];
  }

  return {
    thang: month,
    nam: year,
    ngay_hien_tai: now.toISOString(),
    dayOfYear,
    totalDays,
    so_ngay_con_lai: soNgayConLai,
    tien_do_thoi_gian: tienDoThoiGian,
    kpi_cards: kpiCards,
    bang_tong_hop: bangTongHop,
    kpiCards,
    bangTongHop,
    kpi: legacyKpi,
    month: monthArr,
    day: dayArr,
    units: { san_luong_than: "Tấn", dao_lo: "Mét", xen_lo: "Mét", doanh_thu: "Tỷ VNĐ", tieu_thu: "Tấn", chong_doi: "Mét" },
    labels: { san_luong_than: "Sản lượng", dao_lo: "Đào lò", xen_lo: "Xén lò", doanh_thu: "Doanh thu", tieu_thu: "Tiêu thụ" },
    _source: source,
  };
}

// Fallback legacy giữ lại để không vỡ khi chi_tieu_kpi trống hoàn toàn và test cũ
async function getTongQuanLegacy({ thang, nam }) {
  const month = clampMonth(thang, new Date().getMonth() + 1);
  const year = clampYear(nam, new Date().getFullYear());
  const kpiResult = await safeQuery(
    `SELECT bch.loai_cong_viec, COALESCE(SUM(bch.san_luong),0)::numeric AS thuc_te
     FROM bao_cao_hang_muc bch JOIN bao_cao_cong_truong bcct ON bcct.id=bch.bao_cao_cong_truong_id
     WHERE EXTRACT(YEAR FROM bcct.ngay)=$1 AND EXTRACT(MONTH FROM bcct.ngay)<=$2 GROUP BY bch.loai_cong_viec`,
    [year, month]
  );
  const kpiMap = { lo_cho:0, dao_lo:0, xen_lo:0, chong_doi:0 };
  for (const r of kpiResult.rows) if (r.loai_cong_viec in kpiMap) kpiMap[r.loai_cong_viec]=Number(r.thuc_te)||0;
  const keHoach = await getKeHoachMap(year);
  const kpiObj={};
  for (const k of Object.keys(kpiMap)) {
    const thuc=kpiMap[k], plan=keHoach[k]||0, ty=plan>0?Math.round(thuc/plan*1000)/10:0;
    kpiObj[k]={ thuc_te:thuc, ke_hoach_nam:plan, ty_le:ty };
  }
  return { thang: month, nam: year, kpi: kpiObj, month:[], day:[], units: UNITS, labels: LABELS, _source:"legacy", kpi_cards:[], bang_tong_hop:[] };
}
