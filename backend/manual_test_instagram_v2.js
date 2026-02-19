const http = require('http');

// Payload matching the structure seen in logs earlier
const payload = JSON.stringify({
    "object": "instagram",
    "entry": [
        {
            "id": "17841400000000000",
            "time": 1699000000,
            "changes": [
                {
                    "field": "messages",
                    "value": {
                        "sender": {
                            "id": "12334"
                        },
                        "recipient": {
                            "id": "23245"
                        },
                        "timestamp": "1527459824",
                        "message": {
                            "mid": "manual_test_mid_changes_123",
                            "text": "Manual Test (Changes Format)"
                        }
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
