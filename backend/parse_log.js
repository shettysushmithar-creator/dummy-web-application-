const fs = require('fs');
const content = fs.readFileSync('webhook_history.log', 'utf8');
const blocks = content.split('---');
const igHit = blocks.reverse().find(b => b.includes('"object": "instagram"'));
if (igHit) {
    console.log('--- LATEST IG HIT ---');
    console.log(igHit);
} else {
    console.log('No Instagram hits found.');
}
