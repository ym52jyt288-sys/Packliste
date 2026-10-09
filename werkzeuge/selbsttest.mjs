// Selbsttest in Headless Chrome: node --experimental-websocket werkzeuge/selbsttest.mjs [Adresse]
// Erwartet den laufenden Testserver (werkzeuge/server.mjs). Gibt die fehlgeschlagenen Prüfungen aus.
import { starteChrome } from './chrome.mjs';
const adresse = process.argv[2] || 'http://localhost:8766/index.html?test';
const c = await starteChrome();
try {
  const s = await c.seite(adresse);
  await s.warteAuf('/^Test (\\d+\\/\\d+|abgebrochen)/.test(document.title)', 30000);
  const titel = await s.js('document.title');
  console.log(titel);
  const fehler = await s.js('[...document.querySelectorAll(".testbericht .fehler")].map(e => e.innerText)');
  for (const f of fehler || []) console.log(f);
  if (titel === 'Test abgebrochen') console.log(await s.js('document.body.innerText'));
  for (const k of s.konsole) console.log(k);
  process.exitCode = fehler && fehler.length || titel === 'Test abgebrochen' ? 1 : 0;
} finally { await c.ende(); }
