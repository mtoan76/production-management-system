-- ============================================================
-- Task 1: Bổ sung dữ liệu "Kế hoạch năm" cho Dashboard Tổng quan
-- Bảng lưu 5 chỉ tiêu Kế hoạch năm (san_luong_than, dao_lo, xen_lo, doanh_thu, tieu_thu)
-- Thực tế trước đây Dashboard hardcode 16208, 4598, 40, 10... Giờ chuyển vào DB
-- ============================================================

-- 1. Tạo bảng ke_hoach_nam (1 dòng = 1 chỉ tiêu của 1 năm)
CREATE TABLE IF NOT EXISTS ke_hoach_nam (
  id SERIAL PRIMARY KEY,
  nam INT NOT NULL CHECK (nam BETWEEN 2000 AND 2100),
  ma_chi_tieu TEXT NOT NULL CHECK (ma_chi_tieu IN ('san_luong_than','dao_lo','xen_lo','doanh_thu','tieu_thu')),
  ten_chi_tieu TEXT NOT NULL,
  gia_tri NUMERIC NOT NULL CHECK (gia_tri >= 0),
  dvt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nam, ma_chi_tieu)
);

CREATE INDEX IF NOT EXISTS idx_ke_hoach_nam_nam ON ke_hoach_nam(nam);

-- Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_ke_hoach_nam_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ke_hoach_nam_updated_at ON ke_hoach_nam;
CREATE TRIGGER trg_ke_hoach_nam_updated_at
  BEFORE UPDATE ON ke_hoach_nam
  FOR EACH ROW EXECUTE FUNCTION update_ke_hoach_nam_updated_at();

-- 2. Seed dữ liệu mẫu (theo yêu cầu Task 1)
--    Sản lượng than 16.208 tấn, Đào lò 4.598 m, Xén lò 40 m, Doanh thu 10 tỷ
--    Tiêu thụ chưa cho số → tạm đặt 16.000 tấn (có thể sửa lại)
INSERT INTO ke_hoach_nam (nam, ma_chi_tieu, ten_chi_tieu, gia_tri, dvt) VALUES
  (2026, 'san_luong_than', 'Sản lượng Than', 16208, 'tấn'),
  (2026, 'dao_lo',        'Tiến độ Đào lò', 4598,  'm'),
  (2026, 'xen_lo',        'Xén lò',         40,    'm'),
  (2026, 'doanh_thu',     'Doanh thu',      10,    'tỷ'),
  (2026, 'tieu_thu',      'Tiêu thụ',       16000, 'tấn')
ON CONFLICT (nam, ma_chi_tieu) DO UPDATE SET
  ten_chi_tieu = EXCLUDED.ten_chi_tieu,
  gia_tri = EXCLUDED.gia_tri,
  dvt = EXCLUDED.dvt,
  updated_at = NOW();

-- Copy kế hoạch 2026 sang các năm lân cận để demo không bị thiếu khi đổi năm filter
INSERT INTO ke_hoach_nam (nam, ma_chi_tieu, ten_chi_tieu, gia_tri, dvt)
SELECT 2025, ma_chi_tieu, ten_chi_tieu, gia_tri, dvt FROM ke_hoach_nam WHERE nam = 2026
ON CONFLICT (nam, ma_chi_tieu) DO NOTHING;

INSERT INTO ke_hoach_nam (nam, ma_chi_tieu, ten_chi_tieu, gia_tri, dvt)
SELECT 2027, ma_chi_tieu, ten_chi_tieu, gia_tri, dvt FROM ke_hoach_nam WHERE nam = 2026
ON CONFLICT (nam, ma_chi_tieu) DO NOTHING;

-- 3. View tiện lợi cho API (pivot 5 chỉ tiêu thành 1 dòng/năm)
CREATE OR REPLACE VIEW v_ke_hoach_nam_pivot AS
SELECT
  nam,
  MAX(gia_tri) FILTER (WHERE ma_chi_tieu = 'san_luong_than') AS san_luong_than,
  MAX(gia_tri) FILTER (WHERE ma_chi_tieu = 'dao_lo')        AS dao_lo,
  MAX(gia_tri) FILTER (WHERE ma_chi_tieu = 'xen_lo')        AS xen_lo,
  MAX(gia_tri) FILTER (WHERE ma_chi_tieu = 'doanh_thu')     AS doanh_thu,
  MAX(gia_tri) FILTER (WHERE ma_chi_tieu = 'tieu_thu')      AS tieu_thu
FROM ke_hoach_nam
GROUP BY nam;

-- Kiểm tra nhanh
-- SELECT * FROM ke_hoach_nam WHERE nam = 2026 ORDER BY ma_chi_tieu;
-- SELECT * FROM v_ke_hoach_nam_pivot;
