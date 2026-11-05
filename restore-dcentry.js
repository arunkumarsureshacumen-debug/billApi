const http = require('http');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync(__dirname + '/dcentry-data.json', 'utf8'));

async function restore() {
  let success = 0, fail = 0;
  for (const rec of data) {
    const { _id, id, createdAt, updatedAt, client, ...body } = rec;
    const postData = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 1400,
      path: '/DcEntry',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            success++;
          } else {
            const msg = `${rec.date} ${rec.varientName} ${rec.name} [${res.statusCode}] ${body.substring(0,100)}`;
            console.log(`FAIL: ${msg}`);
            fail++;
          }
          resolve();
        });
      });
      req.on('error', (e) => { console.log(`ERROR: ${rec.date} ${rec.varientName} ${rec.name}: ${e.message}`); fail++; resolve(); });
      req.write(postData);
      req.end();
    });
  }
  console.log(`\nDone. Success: ${success}, Failed: ${fail}`);
}

restore();
