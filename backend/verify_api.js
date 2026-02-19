const http = require('http');

http.get('http://localhost:8000/api/messages', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const messages = JSON.parse(data);
        console.log('Top 5 messages:');
        messages.slice(0, 5).forEach(m => {
            const date = new Date(m.timestamp * 1000);
            console.log(`[${m.type}] ${m.from}: "${m.text}" at ${date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (TS: ${m.timestamp})`);
        });
        process.exit(0);
    });
}).on('error', err => {
    console.error(err.message);
    process.exit(1);
});
