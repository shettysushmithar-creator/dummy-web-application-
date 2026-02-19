require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        console.log('Running query...');
        const result = await pool.query(`
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'whatsapp' AS platform
            FROM whatsapp_messages
            UNION ALL
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'instagram' AS platform
            FROM instagram_messages
            UNION ALL
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'facebook' AS platform
            FROM facebook_messages
            UNION ALL
            SELECT id, sender_id, receiver_id, message_text, message_type,
                to_timestamp(timestamp) AS timestamp,
                COALESCE(platform, 'whatsapp') AS platform
            FROM meta_crm_messages
            ORDER BY timestamp DESC
        `);
        console.log('Success!', result.rows.length, 'rows found.');
        process.exit(0);
    } catch (err) {
        console.error('QUERY ERROR:', err);
        process.exit(1);
    }
};

run();
