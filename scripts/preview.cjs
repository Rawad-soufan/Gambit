// Serve the exported web preview locally, including Expo Router deep links.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.ttf': 'font/ttf' };
http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const requested = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
  if (!requested.startsWith(`${root}${path.sep}`) && requested !== root) { response.writeHead(403); response.end(); return; }
  const file = fs.existsSync(requested) && fs.statSync(requested).isFile() ? requested : path.join(root, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404); response.end('Export the web app first: npx expo export --platform web'); return; }
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); response.end(data);
  });
}).listen(8081, '127.0.0.1', () => console.log('Gambit preview: http://127.0.0.1:8081'));
