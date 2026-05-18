// scratch/check_local_status.js
const http = require('http');

function check() {
  console.log('Fetching local status from http://127.0.0.1:3001/api/status...');
  
  const req = http.get('http://127.0.0.1:3001/api/status', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('✅ Local WhatsApp Service Status:');
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.error('Failed to parse response JSON:', e.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Could not connect to local WhatsApp service:', err.message);
  });
}

check();
