require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const res = await pool.query("SELECT EXTRACT(EPOCH FROM (timestamp AT TIME ZONE 'UTC')) as seconds FROM meta_crm_messages ORDER BY id DESC LIMIT 1");
        if (res.rows.length > 0) {
            console.log('UNIX FROM DB:', res.rows[0].seconds);
            console.log('IST TIME:', new Date(res.rows[0].seconds * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        } else {
            console.log('No messages found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
