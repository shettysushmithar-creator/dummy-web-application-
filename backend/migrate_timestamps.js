require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const tables = ['whatsapp_messages', 'instagram_messages', 'facebook_messages', 'meta_crm_messages'];

const migrate = async () => {
    try {
        for (const table of tables) {
            console.log(`Migrating ${table}...`);
            await pool.query(`
                ALTER TABLE ${table} 
                ALTER COLUMN timestamp TYPE TIMESTAMPTZ 
                USING timestamp AT TIME ZONE 'UTC';
            `);
            console.log(`✅ ${table} migrated.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
