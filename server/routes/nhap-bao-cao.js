import express from "express";
import multer from "multer";

const router = express.Router();

// Lưu file vào RAM (giới hạn 25MB giống frontend)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// POST /api/nhap-bao-cao → proxy sang n8n để tránh CORS
// Frontend gọi /api/nhap-bao-cao (qua Vite proxy → localhost:3000) thay vì gọi trực tiếp https://n8n-proxy...
// Server sẽ forward tới webhook thực tế lấy từ .env (N8N_WEBHOOK_URL hoặc VITE_N8N_WEBHOOK_URL)
router.post("/nhap-bao-cao", upload.single("file"), async (req, res, next) => {
  try {
    const targetUrl =
      process.env.N8N_WEBHOOK_URL ||
      process.env.VITE_N8N_WEBHOOK_URL ||
      "https://n8n-proxy.manhtoan7620005.workers.dev/webhook/nhap-bao-cao";

    console.log(`[nhap-bao-cao proxy] ${req.file ? req.file.originalname + " (" + req.file.size + " bytes)" : "no file"} → ${targetUrl}`);

    if (!req.file) {
      return res.status(400).json({ error: "Thiếu file báo cáo (field 'file')" });
    }

    // Tạo FormData để forward sang n8n (giữ nguyên field 'file' và 'ngay_bao_cao')
    const form = new FormData();
    // Node 20 có global Blob + FormData
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    form.append("file", blob, req.file.originalname);
    if (req.body?.ngay_bao_cao) form.append("ngay_bao_cao", req.body.ngay_bao_cao);

    const n8nRes = await fetch(targetUrl, {
      method: "POST",
      body: form,
      // Không set Content-Type, fetch tự set multipart boundary
    });

    const contentType = n8nRes.headers.get("content-type") || "";
    const text = await n8nRes.text();

    console.log(`[nhap-bao-cao proxy] n8n responded ${n8nRes.status} ${contentType.slice(0,60)}`);

    // Trả nguyên status + body về frontend (giữ content-type nếu là json)
    res.status(n8nRes.status);
    if (contentType.includes("application/json")) {
      res.setHeader("content-type", contentType);
    }
    // Thêm CORS header cho chắc (dù đã có cors() global)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (err) {
    console.error("[nhap-bao-cao proxy] Lỗi forward tới n8n:", err);
    next(err);
  }
});

export default router;
