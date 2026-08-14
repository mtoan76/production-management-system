import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
async function test() {
  const r = await pool.query('SELECT bcct.cong_truong, bch.loai_cong_viec, bcct.ngay, SUM(bch.san_luong) AS val FROM bao_cao_hang_muc bch JOIN bao_cao_cong_truong bcct ON bcct.id = bch.bao_cao_cong_truong_id JOIN bao_cao bc ON bc.id = bcct.bao_cao_id WHERE bcct.cong_truong = $1 AND EXTRACT(YEAR FROM bcct.ngay) = 2026 AND EXTRACT(MONTH FROM bcct.ngay) = 7 AND bch.loai_cong_viec IN (\'dao_lo\', \'xen_lo\', \'chong_doi\') GROUP BY bcct.cong_truong, bch.loai_cong_viec, bcct.ngay', ['Khai thác 1']);
  console.log('Rows:', r.rows.length);
  console.log(r.rows);
  await pool.end();
}
test().catch(console.error);