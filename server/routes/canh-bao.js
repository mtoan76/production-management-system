import express from "express";
import { getCanhBaoList, getCanhBaoDetail } from "../../lib/queries/canh-bao.js";

const router = express.Router();

// GET /api/canh-bao        — LIST cảnh báo
router.get("/", async (req, res, next) => {
  try {
    res.json(await getCanhBaoList());
  } catch (err) {
    next(err);
  }
});

// GET /api/canh-bao/:id    — DETAIL 1 cảnh báo
router.get("/:id", async (req, res, next) => {
  try {
    res.json(await getCanhBaoDetail({ id: req.params.id }));
  } catch (err) {
    if (err.status) res.status(err.status).json({ error: err.message });
    else next(err);
  }
});

export default router;
