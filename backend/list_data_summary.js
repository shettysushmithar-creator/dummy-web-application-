require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        const channels = await pool.query("SELECT * FROM channels");
        console.log('--- CHANNELS ---');
        console.log(channels.rows);

        const counts = await pool.query("SELECT platform, count(*) FROM meta_crm_messages GROUP BY platform");
        console.log('--- MESSAGE COUNTS ---');
        console.log(counts.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
