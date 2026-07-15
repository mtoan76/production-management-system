import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

console.log("[db.js] DATABASE_URL =", process.env.DATABASE_URL ? "OK (loaded)" : "UNDEFINED!");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => console.error("[PG POOL ERROR]", err));

export default pool;
