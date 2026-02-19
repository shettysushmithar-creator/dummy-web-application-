const http = require('http');
const url = require('url');

const PORT = 8000; // Updated to match your Ngrok!
const VERIFY_TOKEN = 'small_business';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/api/webhook') {
        const mode = parsedUrl.query['hub.mode'];
        const token = parsedUrl.query['hub.verify_token'];
        const challenge = parsedUrl.query['hub.challenge'];

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ WEBHOOK_VERIFIED SUCCESSFULLY!');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(challenge);
            return;
        }
    }

    res.writeHead(404);
    res.end();
});

server.listen(PORT, () => {
    console.log(`🚀 Verification Server running on port ${PORT}`);
    console.log(`Verify Token is set to: ${VERIFY_TOKEN}`);
});
