import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/canh-bao        — LIST cảnh báo (tạm trả về rỗng vì bảng cũ đã xóa)
router.get("/", async (req, res, next) => {
  try {
    // Trả về mảng rỗng vì bảng nhat_ky_canh_bao đã bị xóa
    // Có thể mở rộng sau: cảnh báo từ dữ liệu mới (ví dụ: sản lượng chậm tiến độ)
    res.json({ total: 0, data: [] });
  } catch (err) {
    next(err);
  }
});

// GET /api/canh-bao/:id    — DETAIL 1 cảnh báo
router.get("/:id", async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    return res.status(404).json({ error: "Cảnh báo không tồn tại (bảng cũ đã xóa)" });
  } catch (err) {
    next(err);
  }
});

export default router;