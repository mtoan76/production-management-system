-- ============================================================
-- Task 1: Thiết kế lại DB phù hợp file Excel đầu vào
-- Excel có các cột: NgayBaoCao, MaChiTieu/TenChiTieu, DonViTinh,
-- KeHoachNam, ThucHienTrongNgay, LuyKeThucHien
-- Tạo 2 bảng chuẩn 3NF:
--   chi_tieu_kpi      : danh mục KPI + KeHoachNam (master)
--   bao_cao_hang_ngay : lịch sử nhập hàng ngày (fact)
-- ============================================================

-- 1. Bảng danh mục chỉ tiêu (master) - 1 dòng = 1 chỉ tiêu của 1 năm
CREATE TABLE IF NOT EXISTS chi_tieu_kpi (
  id SERIAL PRIMARY KEY,
  ma_chi_tieu TEXT NOT NULL,          -- VD: san_luong_than, dao_lo, xen_lo, doanh_thu, tieu_thu
  ten_chi_tieu TEXT NOT NULL,         -- VD: Sản lượng than, Đào lò...
  don_vi_tinh TEXT NOT NULL,          -- Tấn, Mét, Tỷ VNĐ
  ke_hoach_nam NUMERIC NOT NULL CHECK (ke_hoach_nam >= 0),
  nam INT NOT NULL CHECK (nam BETWEEN 2000 AND 2100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ma_chi_tieu, nam)
);
CREATE INDEX IF NOT EXISTS idx_chi_tieu_kpi_nam ON chi_tieu_kpi(nam);
CREATE INDEX IF NOT EXISTS idx_chi_tieu_kpi_ma ON chi_tieu_kpi(ma_chi_tieu);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_chi_tieu_kpi_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_chi_tieu_kpi_updated_at ON chi_tieu_kpi;
CREATE TRIGGER trg_chi_tieu_kpi_updated_at BEFORE UPDATE ON chi_tieu_kpi FOR EACH ROW EXECUTE FUNCTION update_chi_tieu_kpi_updated_at();

-- 2. Bảng báo cáo hàng ngày (fact) - 1 dòng = 1 chỉ tiêu của 1 ngày
CREATE TABLE IF NOT EXISTS bao_cao_hang_ngay (
  id SERIAL PRIMARY KEY,
  ngay_bao_cao DATE NOT NULL,
  chi_tieu_id INT NOT NULL REFERENCES chi_tieu_kpi(id) ON DELETE CASCADE,
  thuc_hien_trong_ngay NUMERIC NOT NULL DEFAULT 0 CHECK (thuc_hien_trong_ngay >= 0),
  luy_ke_thuc_hien NUMERIC NOT NULL DEFAULT 0 CHECK (luy_ke_thuc_hien >= 0),
  ghi_chu TEXT,
  nguon_file TEXT, -- tên file Excel gốc nếu cần trace
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ngay_bao_cao, chi_tieu_id)
);
CREATE INDEX IF NOT EXISTS idx_bao_cao_hang_ngay_ngay ON bao_cao_hang_ngay(ngay_bao_cao DESC);
CREATE INDEX IF NOT EXISTS idx_bao_cao_hang_ngay_chi_tieu ON bao_cao_hang_ngay(chi_tieu_id);

-- 3. Seed danh mục 5 chỉ tiêu chuẩn (từ ke_hoach_nam hiện tại nếu có)
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, dvt, gia_tri, nam
FROM ke_hoach_nam
ON CONFLICT (ma_chi_tieu, nam) DO UPDATE SET
  ten_chi_tieu = EXCLUDED.ten_chi_tieu,
  don_vi_tinh = EXCLUDED.don_vi_tinh,
  ke_hoach_nam = EXCLUDED.ke_hoach_nam,
  updated_at = NOW();

-- Fallback nếu ke_hoach_nam trống (chèn 5 dòng mẫu theo yêu cầu đề bài)
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam) VALUES
  ('san_luong_than','Sản lượng than','Tấn',16208,2026),
  ('dao_lo','Đào lò','Mét',4598,2026),
  ('xen_lo','Xén lò','Mét',40,2026),
  ('doanh_thu','Doanh thu','Tỷ VNĐ',10,2026),
  ('tieu_thu','Tiêu thụ','Tấn',16000,2026)
ON CONFLICT (ma_chi_tieu, nam) DO NOTHING;

-- Nhân bản cho 2025, 2027 để demo filter năm không rỗng
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, 2025 FROM chi_tieu_kpi WHERE nam=2026
ON CONFLICT (ma_chi_tieu, nam) DO NOTHING;
INSERT INTO chi_tieu_kpi (ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, nam)
SELECT ma_chi_tieu, ten_chi_tieu, don_vi_tinh, ke_hoach_nam, 2027 FROM chi_tieu_kpi WHERE nam=2026
ON CONFLICT (ma_chi_tieu, nam) DO NOTHING;

-- 4. Seed lịch sử hàng ngày mẫu (để Dashboard có số LuyKeThucHien >0 khi mới cài)
--    Nếu đã có dữ liệu thật từ Excel thì bỏ qua (ON CONFLICT DO NOTHING)
--    Lấy luy_ke gần đúng 65-75% kế hoạch để demo "Đạt" / "Chưa đạt"
DO $$
DECLARE
  r RECORD;
  demo_date DATE := CURRENT_DATE;
BEGIN
  FOR r IN SELECT * FROM chi_tieu_kpi WHERE nam = 2026 LOOP
    INSERT INTO bao_cao_hang_ngay (ngay_bao_cao, chi_tieu_id, thuc_hien_trong_ngay, luy_ke_thuc_hien, ghi_chu)
    VALUES (
      demo_date,
      r.id,
      CASE r.ma_chi_tieu WHEN 'tieu_thu' THEN 120 WHEN 'doanh_thu' THEN 0.08 WHEN 'xen_lo' THEN 0.5 ELSE 80 END,
      CASE r.ma_chi_tieu
        WHEN 'san_luong_than' THEN 10500
        WHEN 'dao_lo' THEN 3100
        WHEN 'xen_lo' THEN 28
        WHEN 'doanh_thu' THEN 6.8
        WHEN 'tieu_thu' THEN 9800
        ELSE 0
      END,
      'Seed demo - thay bằng dữ liệu Excel thực tế'
    )
    ON CONFLICT (ngay_bao_cao, chi_tieu_id) DO NOTHING;
  END LOOP;
END $$;

-- 5. View thống kê cho Dashboard: JOIN 2 bảng + tính tỷ lệ
CREATE OR REPLACE VIEW v_tong_quan_kpi AS
SELECT
  c.nam,
  c.ma_chi_tieu,
  c.ten_chi_tieu,
  c.don_vi_tinh,
  c.ke_hoach_nam,
  COALESCE(b.thuc_hien_trong_ngay, 0) AS thuc_hien_trong_ngay,
  COALESCE(b.luy_ke_thuc_hien, 0) AS luy_ke_thuc_hien,
  CASE WHEN c.ke_hoach_nam > 0 THEN ROUND(COALESCE(b.luy_ke_thuc_hien,0) / c.ke_hoach_nam * 100, 2) ELSE 0 END AS ty_le_hoan_thanh,
  GREATEST(c.ke_hoach_nam - COALESCE(b.luy_ke_thuc_hien,0), 0) AS con_phai_thuc_hien
FROM chi_tieu_kpi c
LEFT JOIN LATERAL (
  SELECT thuc_hien_trong_ngay, luy_ke_thuc_hien
  FROM bao_cao_hang_ngay
  WHERE chi_tieu_id = c.id
  ORDER BY ngay_bao_cao DESC
  LIMIT 1
) b ON true;

-- Kiểm tra
-- SELECT * FROM chi_tieu_kpi ORDER BY nam, ma_chi_tieu;
-- SELECT * FROM bao_cao_hang_ngay ORDER BY ngay_bao_cao DESC LIMIT 10;
-- SELECT * FROM v_tong_quan_kpi WHERE nam=2026;
