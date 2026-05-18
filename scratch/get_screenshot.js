const fs = require('fs');
fetch('http://localhost:3000/api/whatsapp/screenshot')
  .then(res => {
    if (!res.ok) return res.json().then(e => { throw new Error(e.message) });
    return res.arrayBuffer();
  })
  .then(buffer => {
    fs.writeFileSync('whatsapp_debug.png', Buffer.from(buffer));
    console.log('Saved debug screenshot to whatsapp_debug.png!');
  })
  .catch(console.error);
