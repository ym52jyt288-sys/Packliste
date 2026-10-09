// Lokaler Testserver: liefert die App (Port 8766) und den echten server/worker.js mit nachgebildeter D1-Datenbank (Port 8767).
// Start: node werkzeuge/server.mjs   ·   App: http://localhost:8766/ bzw. http://127.0.0.1:8766/ (getrennte Speicher)
// In der App die Worker-Adresse setzen: localStorage['pl.syncUrl'] = 'http://127.0.0.1:8767'
// /__zeilen am Worker-Port zeigt, was der Server gespeichert hat (nur hier, nicht beim echten Worker).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_PORT = Number(process.env.APP_PORT || 8766), WORKER_PORT = Number(process.env.WORKER_PORT || 8767);
const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };

// D1-Nachbau für genau die Anweisungen in worker.js
const zeilen = new Map();
const D1 = {
  prepare(sql) {
    let werte = [];
    const anw = {
      bind(...w) { werte = w; return anw; },
      async first() {
        if (/^SELECT version, daten FROM reise WHERE id = \?$/.test(sql)) { const z = zeilen.get(werte[0]); return z ? { version: z.version, daten: z.daten } : null; }
        throw new Error('SQL nicht nachgebildet: ' + sql);
      },
      async run() {
        let changes = 0;
        if (sql.startsWith('INSERT INTO reise')) { const [id, daten, t] = werte; if (!zeilen.has(id)) { zeilen.set(id, { version: 1, daten, geaendert: t }); changes = 1; } }
        else if (sql.startsWith('UPDATE reise')) { const [daten, t, id, basis] = werte; const z = zeilen.get(id); if (z && z.version === basis) { z.version++; z.daten = daten; z.geaendert = t; changes = 1; } }
        else if (sql.startsWith('DELETE FROM reise')) { changes = zeilen.delete(werte[0]) ? 1 : 0; }
        else throw new Error('SQL nicht nachgebildet: ' + sql);
        return { meta: { changes } };
      },
    };
    return anw;
  },
};

const workerCode = await readFile(path.join(WURZEL, 'server/worker.js'), 'utf8');
const worker = (await import('data:text/javascript;base64,' + Buffer.from(workerCode).toString('base64'))).default;

http.createServer(async (req, res) => {
  if (req.url === '/__zeilen') {
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
    return res.end(JSON.stringify([...zeilen.entries()].map(([id, z]) => ({ id, ...z }))));
  }
  const teile = [];
  for await (const t of req) teile.push(t);
  const body = Buffer.concat(teile);
  const anfrage = new Request(`http://127.0.0.1:${WORKER_PORT}${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const antwort = await worker.fetch(anfrage, { DB: D1 });
  res.writeHead(antwort.status, Object.fromEntries(antwort.headers));
  res.end(Buffer.from(await antwort.arrayBuffer()));
}).listen(WORKER_PORT, '127.0.0.1');

http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const datei = path.join(WURZEL, path.normalize(p));
  if (!datei.startsWith(WURZEL)) { res.writeHead(403); return res.end(); }
  try {
    const inhalt = await readFile(datei);
    res.writeHead(200, { 'content-type': TYPEN[path.extname(datei)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(inhalt);
  } catch (e) { res.writeHead(404); res.end('nicht gefunden'); }
}).listen(APP_PORT, '127.0.0.1');

console.log(`App: http://localhost:${APP_PORT}/  ·  Worker: http://127.0.0.1:${WORKER_PORT}`);
