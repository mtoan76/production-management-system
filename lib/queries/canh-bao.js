import { HttpError } from "./helpers.js";

// Danh sách cảnh báo — trả về rỗng vì bảng nhat_ky_canh_bao đã bị xóa khi migrate sang schema 3 bảng.
// Có thể mở rộng sau: cảnh báo từ dữ liệu mới (ví dụ: sản lượng chậm tiến độ).
export async function getCanhBaoList() {
  return { total: 0, data: [] };
}

// Chi tiết 1 cảnh báo — bảng cũ đã xóa nên luôn 404 (đồng bộ với getCanhBaoList).
export async function getCanhBaoDetail({ id } = {}) {
  if (!id || !/^\d+$/.test(String(id))) {
    throw new HttpError(400, "Invalid id");
  }
  throw new HttpError(404, "Cảnh báo không tồn tại (bảng cũ đã xóa)");
}
