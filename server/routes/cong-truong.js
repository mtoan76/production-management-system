import express from "express";
import { getCongTruong, getCongTruongChiTiet } from "../../lib/queries/cong-truong.js";

const router = express.Router();

// GET /api/cong-truong — lũy kế tháng theo công trường + chỉ số detail
router.get("/cong-truong", async (req, res, next) => {
  try {
    res.json(await getCongTruong({ thang: req.query.thang, nam: req.query.nam }));
  } catch (err) {
    next(err);
  }
});

// GET /api/cong-truong-chi-tiet — danh sách đường lò × loại công việc trong 1 công trường
router.get("/cong-truong-chi-tiet", async (req, res, next) => {
  try {
    res.json(await getCongTruongChiTiet({
      thang: req.query.thang,
      nam: req.query.nam,
      site: req.query.site,
      type: req.query.type,
    }));
  } catch (err) {
    if (err.status) res.status(err.status).json({ error: err.message });
    else next(err);
  }
});

export default router;
