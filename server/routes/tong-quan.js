import express from "express";
import { getTongQuan } from "../../lib/queries/tong-quan.js";

const router = express.Router();

router.get("/tong-quan", async (req, res, next) => {
  try {
    res.json(await getTongQuan({ thang: req.query.thang, nam: req.query.nam }));
  } catch (err) {
    next(err);
  }
});

export default router;
