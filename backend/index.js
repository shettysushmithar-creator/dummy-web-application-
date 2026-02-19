require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Bypass ngrok browser warning for all incoming webhook requests (Facebook, etc.)
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

// Initialize Database Tables — one per platform
const initDb = async () => {
    const tableSchema = `
        id SERIAL PRIMARY KEY,
        provider_message_id TEXT UNIQUE,
        sender_id TEXT NOT NULL,
        receiver_id TEXT,
        message_text TEXT,
        message_type TEXT,
        status TEXT,
        timestamp TIMESTAMP
    `;
    try {
        // Keep the old shared table (preserves existing data)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS meta_crm_messages (
                id SERIAL PRIMARY KEY,
                provider_message_id TEXT UNIQUE,
                sender_id TEXT NOT NULL,
                receiver_id TEXT,
                message_text TEXT,
                message_type TEXT,
                status TEXT,
                platform TEXT,
                timestamp BIGINT
            );
        `);
        // Create separate tables per platform
        await pool.query(`CREATE TABLE IF NOT EXISTS whatsapp_messages (${tableSchema});`);
        await pool.query(`CREATE TABLE IF NOT EXISTS instagram_messages (${tableSchema});`);
        await pool.query(`CREATE TABLE IF NOT EXISTS facebook_messages (${tableSchema});`);
        console.log('✅ Database Ready: 3 platform tables active (whatsapp, instagram, facebook).');
    } catch (err) {
        console.error('❌ Database Initialization Error:', err);
    }
};
initDb();

// 1. Meta Webhook Verification
app.get('/api/webhook', (req, res) => {
    console.log('🔍 Received Verification Request:', req.query);
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log('✅ Webhook Verified!');
        res.status(200).send(challenge);
    } else {
        console.error('❌ Webhook Verification Failed: Token Mismatch');
        res.sendStatus(403);
    }
});

const fs = require('fs');

// 2. Meta Webhook Reception (RECEIVE & SAVE)
app.post('/api/webhook', async (req, res) => {
    const body = req.body;
    console.log('\n🚀 >>> WEBHOOK HIT! <<< 🚀');

    // Log for debugging
    const hitId = Date.now();
    fs.writeFileSync(`hit_${hitId}.json`, JSON.stringify(body, null, 2));

    console.log(JSON.stringify(body, null, 2));

    let msgData = null;

    if (body.object === 'instagram') {
        try {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const messaging = entry?.messaging?.[0];

            if (changes && changes.value && changes.value.message) {
                const val = changes.value;
                msgData = {
                    provider_message_id: val.message.mid || `test_mid_${Date.now()}`,
                    sender_id: val.sender?.id || 'unknown_sender',
                    receiver_id: val.recipient?.id || 'unknown_recipient',
                    message_text: val.message.text || '[Media/Interaction]',
                    message_type: 'text',
                    platform: 'instagram',
                    timestamp: val.timestamp ? Math.floor(parseInt(val.timestamp) / 1000) : Math.floor(Date.now() / 1000)
                };
            } else if (messaging) {
                // Standard messaging or message_edit
                const message = messaging.message || messaging.messaging?.message;
                if (message) {
                    msgData = {
                        provider_message_id: message.mid,
                        sender_id: messaging.sender?.id || 'unknown_sender',
                        receiver_id: messaging.recipient?.id || 'unknown_recipient',
                        message_text: message.text || message.body || '[Interaction/No Text]',
                        message_type: 'text',
                        platform: 'instagram',
                        timestamp: Math.floor((messaging.timestamp || Date.now()) / 1000)
                    };
                } else {
                    console.log('❓ Unknown Instagram Messaging Structure:', JSON.stringify(messaging, null, 2));
                }
            }
            if (msgData) console.log('✅ Parsed Instagram Message:', msgData.message_text);
        } catch (e) {
            console.error('❌ Instagram Parse Error:', e.message);
            console.error('Full body was:', JSON.stringify(body, null, 2));
        }
    } else if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        const message = value?.messages?.[0];

        if (message) {
            msgData = {
                provider_message_id: message.id,
                sender_id: message.from,
                receiver_id: value.metadata?.display_phone_number || 'whatsapp_biz',
                message_text: message.text?.body || `[Media: ${message.type}]`,
                message_type: message.type,
                platform: 'whatsapp',
                timestamp: parseInt(message.timestamp)
            };
        }
    } else if (body.object === 'page') {
        const entry = body.entry?.[0];
        // Facebook messages can come in 'messaging' (active) or 'standby' (handover) arrays
        const messaging = (entry?.messaging || entry?.standby)?.[0];

        if (messaging && messaging.message) {
            msgData = {
                provider_message_id: messaging.message.mid,
                sender_id: messaging.sender.id,
                receiver_id: messaging.recipient.id,
                message_text: messaging.message.text || `[Media interaction]`,
                message_type: 'text',
                platform: 'facebook',
                timestamp: Math.floor(messaging.timestamp / 1000)
            };
            console.log('✅ Parsed Facebook Message:', msgData.message_text);
        } else {
            console.log('ℹ️ Facebook Event Received (not a standard message):', JSON.stringify(entry, null, 2));
        }
    }

    if (msgData) {
        try {
            // Route to the correct platform table
            const tableMap = {
                whatsapp: 'whatsapp_messages',
                instagram: 'instagram_messages',
                facebook: 'facebook_messages'
            };
            const tableName = tableMap[msgData.platform] || 'meta_crm_messages';

            await pool.query(`
                INSERT INTO ${tableName} (provider_message_id, sender_id, receiver_id, message_text, message_type, timestamp)
                VALUES ($1, $2, $3, $4, $5, to_timestamp($6))
                ON CONFLICT (provider_message_id) DO NOTHING
            `, [msgData.provider_message_id, msgData.sender_id, msgData.receiver_id, msgData.message_text, msgData.message_type, msgData.timestamp]);

            console.log(`✅ [${msgData.platform.toUpperCase()}] Saved to ${tableName}: "${msgData.message_text}"`);
        } catch (err) {
            console.error('❌ Error saving to DB:', err.message);
        }
    }

    // Return appropriate response for each platform
    if (body.object === 'whatsapp_business_account') {
        res.sendStatus(200);
    } else {
        res.status(200).send('EVENT_RECEIVED');
    }
});

// 3. API for Frontend (FETCH MESSAGES) — reads from all 3 platform tables
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'whatsapp' AS platform
            FROM whatsapp_messages
            UNION ALL
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'instagram' AS platform
            FROM instagram_messages
            UNION ALL
            SELECT id, sender_id, receiver_id, message_text, message_type, timestamp, 'facebook' AS platform
            FROM facebook_messages
            ORDER BY timestamp DESC
        `);
        const messages = result.rows.map(row => ({
            id: row.id,
            from: row.sender_id,
            text: row.message_text,
            timestamp: Math.floor(new Date(row.timestamp).getTime() / 1000),
            type: row.platform
        }));
        res.json(messages);
    } catch (err) {
        console.error('Fetch Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// 4. Facebook Send Message API
app.post('/api/send-message', async (req, res) => {
    const { platform, recipientId, text } = req.body;

    if (platform !== 'facebook') {
        return res.status(400).json({ error: 'Only facebook platform is supported for sending via this endpoint.' });
    }

    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    if (!token || token === 'YOUR_FB_PAGE_ACCESS_TOKEN_HERE') {
        return res.status(500).json({ error: 'FB_PAGE_ACCESS_TOKEN not configured in .env' });
    }

    const payload = JSON.stringify({
        recipient: { id: recipientId },
        message: { text }
    });

    const options = {
        hostname: 'graph.facebook.com',
        path: `/v19.0/me/messages?access_token=${token}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const fbReq = https.request(options, (fbRes) => {
        let data = '';
        fbRes.on('data', chunk => data += chunk);
        fbRes.on('end', () => {
            const parsed = JSON.parse(data);
            if (fbRes.statusCode === 200) {
                console.log(`✅ [FACEBOOK] Reply sent to ${recipientId}: "${text}"`);
                res.json({ success: true, result: parsed });
            } else {
                console.error('❌ Facebook Send Error:', parsed);
                res.status(fbRes.statusCode).json({ error: parsed });
            }
        });
    });

    fbReq.on('error', (err) => {
        console.error('❌ Facebook Request Error:', err.message);
        res.status(500).json({ error: err.message });
    });

    fbReq.write(payload);
    fbReq.end();
});

app.listen(PORT, () => {
    console.log(`🚀 CRM Full Stack Server running on port ${PORT}`);
});
