-- ============================================================
-- 004: Chuẩn hóa Kế hoạch năm - xóa dư thừa ke_hoach_nam
-- Vấn đề: chi_tieu_kpi.ke_hoach_nam và bảng ke_hoach_nam chứa cùng dữ liệu (ma_chi_tieu, ten_chi_tieu, dvt/gia_tri)
-- Quyết định: GIỮ chi_tieu_kpi, XÓA ke_hoach_nam
-- Lý do: chi_tieu_kpi đã FK với bao_cao_hang_ngay(chi_tieu_id), khớp Excel (MaChiTieu/TenChiTieu/DonViTinh/KeHoachNam), có cột nam
--         ke_hoach_nam là bảng legacy từ 001, giờ dư thừa gây lệch số khi 2 bảng không đồng bộ
-- ============================================================

-- 1. Đồng bộ dữ liệu cuối cùng từ ke_hoach_nam sang chi_tieu_kpi (nếu chi_tieu_kpi thiếu)
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, dvt, gia_tri, nam
FROM ke_hoach_nam
ON CONFLICT (ma_chi_tieu, nam) DO UPDATE SET
  ten_chi_tieu = EXCLUDED.ten_chi_tieu,
  don_vi_tinh = EXCLUDED.don_vi_tinh,
  ke_hoach_nam = EXCLUDED.ke_hoach_nam
WHERE chi_tieu_kpi.ke_hoach_nam IS DISTINCT FROM EXCLUDED.ke_hoach_nam;

-- 2. Cập nhật 5 chỉ tiêu chuẩn theo yêu cầu mới (Tiêu thụ: 0)
--    Sản lượng than: 16208, Đào lò: 4598, Xén lò: 40, Doanh thu: 10, Tiêu thụ: 0
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam) VALUES
  ('san_luong_than','Sản lượng than','Tấn',16208,2026),
  ('dao_lo','Đào lò','Mét',4598,2026),
  ('xen_lo','Xén lò','Mét',40,2026),
  ('doanh_thu','Doanh thu','Tỷ VNĐ',10,2026),
  ('tieu_thu','Tiêu thụ','Tấn',0,2026)
ON CONFLICT (ma_chi_tieu, nam) DO UPDATE SET
  ten_chi_tieu = EXCLUDED.ten_chi_tieu,
  don_vi_tinh = EXCLUDED.don_vi_tinh,
  ke_hoach_nam = EXCLUDED.ke_hoach_nam,
  updated_at = NOW();

-- Đồng bộ cho 2025/2027 để filter năm không rỗng (giữ 0 cho tieu_thu)
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, 2025 FROM chi_tieu_kpi WHERE nam=2026
ON CONFLICT (ma_chi_tieu, nam) DO UPDATE SET ke_hoach_nam=EXCLUDED.ke_hoach_nam;
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, 2027 FROM chi_tieu_kpi WHERE nam=2026
ON CONFLICT (ma_chi_tieu, nam) DO UPDATE SET ke_hoach_nam=EXCLUDED.ke_hoach_nam;

-- 3. Xóa bảng dư thừa + view pivot
DROP VIEW IF EXISTS v_ke_hoach_nam_pivot;
DROP TABLE IF EXISTS ke_hoach_nam CASCADE;

-- 4. Kiểm tra sau chuẩn hóa
-- SELECT * FROM chi_tieu_kpi ORDER BY nam, ma_chi_tieu;
-- SELECT c.ten_chi_tieu, c.ke_hoach_nam, b.luy_ke_thuc_hien FROM chi_tieu_kpi c LEFT JOIN LATERAL (SELECT luy_ke_thuc_hien FROM bao_cao_hang_ngay WHERE chi_tieu_id=c.id ORDER BY ngay_bao_cao DESC LIMIT 1) b ON true WHERE c.nam=2026;
