const http = require('http');

const payload = JSON.stringify({
    "object": "instagram",
    "entry": [
        {
            "id": "17841400000000000",
            "time": 1699000000,
            "messaging": [
                {
                    "sender": {
                        "id": "1234567890"
                    },
                    "recipient": {
                        "id": "9876543210"
                    },
                    "timestamp": 1699000000000,
                    "message": {
                        "mid": "test_mid_instagram_123",
                        "text": "Manual Test from Script"
                    }
                }
            ]
        }
    ]
});

const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(payload);
req.end();
