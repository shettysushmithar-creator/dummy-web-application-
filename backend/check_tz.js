require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query("SELECT to_timestamp(1771197796) as t1, current_setting('timezone') as tz").then(res => {
    console.log(res.rows[0]);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
