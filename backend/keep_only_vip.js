require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const keepOnlyTheseContacts = async () => {
    const keepSenderIds = ['4512350872321971', '917019676428'];

    try {
        console.log('🗑️  Starting cleanup...');
        console.log('📌 Keeping messages from:', keepSenderIds.join(', '));

        // Delete all messages NOT from these sender IDs
        const result = await pool.query(
            `DELETE FROM meta_crm_messages 
             WHERE sender_id NOT IN ($1, $2)
             RETURNING id, sender_id, message_text`,
            keepSenderIds
        );

        console.log(`✅ Deleted ${result.rowCount} messages`);

        if (result.rows.length > 0) {
            console.log('\nDeleted messages:');
            result.rows.forEach(row => {
                console.log(`  - ID ${row.id}: ${row.sender_id} - "${row.message_text}"`);
            });
        }

        // Show remaining messages
        const remaining = await pool.query(
            'SELECT sender_id, COUNT(*) as count FROM meta_crm_messages GROUP BY sender_id'
        );

        console.log('\n📊 Remaining conversations:');
        remaining.rows.forEach(row => {
            console.log(`  - ${row.sender_id}: ${row.count} messages`);
        });

        await pool.end();
        console.log('\n✅ Cleanup complete!');

    } catch (err) {
        console.error('❌ Error during cleanup:', err.message);
        await pool.end();
        process.exit(1);
    }
};

keepOnlyTheseContacts();
