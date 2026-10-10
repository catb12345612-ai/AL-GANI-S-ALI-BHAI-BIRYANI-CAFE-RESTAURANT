/* Minimal static file server for the AXIOM site (no deps). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 8321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (req.method === 'POST' && urlPath === '/__frame') {
    let body = '';
    let aborted = false;
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 12e6) { aborted = true; req.destroy(); }
    });
    req.on('end', () => {
      if (aborted) { res.writeHead(413).end(); return; }
      try {
        const { name, ext, data } = JSON.parse(body);
        if (!/^[0-9]{4}$/.test(name) || !/^(png|jpg)$/.test(ext || '') || !/^[A-Za-z0-9+/=]+$/.test(data || '')) {
          res.writeHead(400).end('bad frame');
          return;
        }
        const dir = path.join(ROOT, 'capture', 'frames');
        fs.mkdir(dir, { recursive: true }, (e) => {
          if (e) { res.writeHead(500).end(); return; }
          fs.writeFile(path.join(dir, `frame_${name}.${ext}`), Buffer.from(data, 'base64'), (err) => {
            if (err) { res.writeHead(500).end(); return; }
            res.writeHead(204).end();
          });
        });
      } catch {
        res.writeHead(400).end('bad json');
      }
    });
    return;
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Site serving at http://127.0.0.1:${PORT} (pid ${process.pid})`);
});
