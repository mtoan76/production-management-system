import express from "express";
import { getDuongLo } from "../../lib/queries/duong-lo.js";

const router = express.Router();

router.get("/duong-lo", async (req, res, next) => {
  try {
    res.json(await getDuongLo({ thang: req.query.thang, nam: req.query.nam }));
  } catch (err) {
    next(err);
  }
});

export default router;
