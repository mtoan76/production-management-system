-- 003: Tạo bảng legacy rỗng để các endpoint cũ (duong-lo, cong-truong) không báo lỗi
-- Sau khi chuyển sang chi_tieu_kpi + bao_cao_hang_ngay, các bảng cũ không còn dùng nhưng
-- các query cũ vẫn SELECT để trả về [] thay vì 42P01. Tạo bảng rỗng tương thích.

CREATE TABLE IF NOT EXISTS bao_cao (
  id SERIAL PRIMARY KEY,
  tieu_de TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bao_cao_cong_truong (
  id SERIAL PRIMARY KEY,
  bao_cao_id INT REFERENCES bao_cao(id) ON DELETE CASCADE,
  cong_truong TEXT,
  ngay DATE,
  ca INT,
  so_lao_dong NUMERIC,
  cong_viec_khac TEXT,
  su_co TEXT,
  ghi_chu TEXT
);

CREATE TABLE IF NOT EXISTS bao_cao_hang_muc (
  id SERIAL PRIMARY KEY,
  bao_cao_cong_truong_id INT REFERENCES bao_cao_cong_truong(id) ON DELETE CASCADE,
  duong_lo TEXT,
  loai_cong_viec TEXT,
  san_luong NUMERIC,
  tiet_dien NUMERIC,
  tiet_dien_don_vi TEXT
);
