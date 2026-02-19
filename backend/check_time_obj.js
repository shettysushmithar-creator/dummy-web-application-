require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const res = await pool.query("SELECT timestamp, provider_message_id FROM meta_crm_messages ORDER BY id DESC LIMIT 1");
        if (res.rows.length > 0) {
            const raw = res.rows[0].timestamp;
            console.log('RAW TYPE:', typeof raw);
            console.log('RAW VALUE:', raw);
            console.log('ISO STRING:', new Date(raw).toISOString());
            console.log('UNIX:', Math.floor(new Date(raw).getTime() / 1000));
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
