import express from "express";
import { getBaoCaoList, getBaoCaoDetail } from "../../lib/queries/bao-cao.js";

const router = express.Router();

// GET /api/bao-cao        — LIST báo cáo
// GET /api/bao-cao?id=X   — DETAIL 1 báo cáo (fallback query-param, đồng bộ với api/bao-cao.js bên Vercel)
router.get("/", async (req, res, next) => {
  try {
    if (req.query.id) {
      res.json(await getBaoCaoDetail({ id: req.query.id }));
      return;
    }
    res.json(await getBaoCaoList({
      limit: req.query.limit,
      tuNgay: req.query.tu_ngay,
      denNgay: req.query.den_ngay,
      congTruong: req.query.cong_truong,
    }));
  } catch (err) {
    if (err.status) res.status(err.status).json({ error: err.message });
    else next(err);
  }
});

// GET /api/bao-cao/:id    — DETAIL 1 báo cáo (accordion theo Ca)
router.get("/:id", async (req, res, next) => {
  try {
    res.json(await getBaoCaoDetail({ id: req.params.id }));
  } catch (err) {
    if (err.status) res.status(err.status).json({ error: err.message });
    else next(err);
  }
});

export default router;
