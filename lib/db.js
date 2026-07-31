import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// Pool dùng chung cho cả Express (local) và Vercel serverless.
// Số connection tối đa có thể điều chỉnh qua PG_POOL_MAX (Vercel nên thấp).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: Number(process.env.PG_POOL_MAX) || 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => console.error("[PG POOL ERROR]", err));

export default pool;
