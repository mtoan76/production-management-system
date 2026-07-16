// Server entry — chạy bằng `node --watch server/index.js`
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import tongQuanRouter from "./routes/tong-quan.js";
import duongLoRouter from "./routes/duong-lo.js";
import baoCaoRouter from "./routes/bao-cao.js";
import canhBaoRouter from "./routes/canh-bao.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use("/api", tongQuanRouter);
app.use("/api", duongLoRouter);
app.use("/api/bao-cao", baoCaoRouter);
app.use("/api/canh-bao", canhBaoRouter);

app.use((err, _req, res, _next) => {
  console.error("[API ERROR]", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
