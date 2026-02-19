require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const res = await pool.query("SELECT * FROM meta_crm_messages ORDER BY id DESC LIMIT 10");
        console.log('--- LATEST 10 MESSAGES ---');
        console.log(JSON.stringify(res.rows, null, 2));
        console.log('--------------------------');
        process.exit(0);
    } catch (err) {
        console.error('DATABASE ERROR:', err.message);
        process.exit(1);
    }
};

run();
