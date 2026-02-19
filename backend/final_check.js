require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const res = await pool.query("SELECT id, sender_id, message_text, platform, TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI:SS') as time FROM meta_crm_messages ORDER BY id DESC LIMIT 10");
        console.log('--- DB INSPECTION (LAST 10) ---');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

run();
