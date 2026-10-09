// UI-Rundgang mit Screenshots bei 390 px (hell und dunkel). Erwartet den laufenden Testserver.
// node --experimental-websocket werkzeuge/rundgang.mjs <Ausgabeordner>
// Nutzt die Beispiellisten aus privat/ (nicht im Repo), sonst kurze Testlisten.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { starteChrome } from './chrome.mjs';

const aus = process.argv[2] || '/tmp/pl-rundgang';
mkdirSync(aus, { recursive: true });
const privat = new URL('../privat/', import.meta.url).pathname;
const warte = ms => new Promise(r => setTimeout(r, ms));
const tag = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const liste = (datei, ersatz) => existsSync(privat + datei) ? readFileSync(privat + datei, 'utf8') : ersatz;

const c = await starteChrome();
let n = 0;
const bild = async (s, name) => { await warte(380); await s.bild(`${aus}/${String(++n).padStart(2, '0')}-${name}.png`); };
try {
  const s = await c.seite('http://localhost:8766/');
  const setze = (sel, wert, ereignis = 'input') => s.js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(wert)}; e.dispatchEvent(new Event(${JSON.stringify(ereignis)}, { bubbles: true })); })()`);
  const klick = sel => s.js(`document.querySelector(${JSON.stringify(sel)}).click()`);
  const da = sel => s.warteAuf(`!!document.querySelector(${JSON.stringify(sel)})`);

  await da('#wiName');
  await bild(s, 'willkommen');
  await setze('#wiName', 'Markus');
  await klick('#wiOk');
  await bild(s, 'start-leer');

  for (const [datei, name, start, ende] of [['portugal.md', 'Portugal', '2024-05-04', '2024-05-18'], ['japan.md', 'Japan', '2025-04-02', '2025-04-20'], ['peru.md', 'Peru', '2026-03-01', '2026-03-22']]) {
    await s.js('oeffneArchivImport()');
    await da('#tText');
    await setze('#tText', liste(datei, `${name}\n- [x] Socken Anm.: nie gebraucht\n- [x] Pulli`));
    await setze('#aName', name);
    await setze('#aStart', start, 'change');
    await setze('#aEnde', ende, 'change');
    if (datei === 'peru.md') await bild(s, 'import-peru');
    await klick('#tUebernehmen');
    await warte(300);
  }
  await bild(s, 'start-vergangen');

  // Neue Reise aus früheren Reisen
  await klick('[data-akt="neueReise"]');
  await da('#wName');
  await setze('#wName', 'Island');
  await setze('#wStart', tag(12), 'change');
  await setze('#wEnde', tag(26), 'change');
  await klick('#wNeuePerson');
  await da('#fText');
  await setze('#fText', 'L.');
  await klick('#fOk');
  await warte(300);
  await bild(s, 'neue-reise');
  await klick('#wWeiter');
  await bild(s, 'neue-reise-quelle');
  await klick('[data-quelle="frueher"]');
  await da('[data-reise-w]');
  await s.js(`document.querySelectorAll('[data-reise-w]').forEach(e => { if (!e.checked) e.click(); })`);
  await bild(s, 'neue-reise-reisen');
  await klick('#wWeiter');
  await da('#uFertig');
  await bild(s, 'uebernahme');
  await s.js(`document.querySelectorAll('.hinterlegt')[1].querySelector('.blatt').scrollTop = 900`);
  await bild(s, 'uebernahme-weiter');
  await klick('#uFertig');
  await s.warteAuf(`document.body.classList.contains('seite-reise')`);
  await bild(s, 'reise-abschnitte');
  await klick('[data-akt="ansicht"][data-wert="kategorien"]');
  await bild(s, 'reise-kategorien');
  await s.js(`[...document.querySelectorAll('[data-akt="packen"]')].slice(0, 4).forEach(b => b.click())`);
  await warte(700);
  await bild(s, 'reise-gepackt');

  // Wischen und übergeben
  const r = await s.js(`(() => { const e = document.querySelectorAll('.zeile .item')[2].getBoundingClientRect(); return { x: e.left, y: e.top + e.height / 2, w: e.width, name: document.querySelectorAll('.zeile .name')[2].textContent }; })()`);
  await s.wische(r.x + r.w - 30, r.y, r.x + r.w - 230, r.y);
  await bild(s, 'wischen');
  await s.js(`document.querySelector('.zeile [data-akt="uebergeben"]') && [...document.querySelectorAll('.zeile')].find(z => z.querySelector('.item').style.transform).querySelector('[data-akt="uebergeben"]').click()`);
  await da('[data-an]');
  await bild(s, 'uebergeben');
  await klick('[data-an]:not([data-an=""]):not([data-an="+neu"])');
  await bild(s, 'uebergeben-toast');
  await s.js(`[...document.querySelectorAll('[data-akt="person"]')][1].click()`);
  await bild(s, 'person-l-banner');
  await s.js(`[...document.querySelectorAll('[data-akt="person"]')].at(-1).click()`);
  await bild(s, 'alle');
  await s.js(`[...document.querySelectorAll('[data-akt="person"]')][0].click()`);

  // Eintippen mit Vorschlägen
  await s.js(`document.querySelector('#eingabe').focus()`);
  await setze('#eingabe', 'Sonn');
  await bild(s, 'vorschlaege');
  await s.js(`document.querySelector('#formEingabe').requestSubmit()`);
  await setze('#eingabe', 'Thermoskanne');
  await s.js(`document.querySelector('#formEingabe').requestSubmit()`);
  await bild(s, 'eingetragen-toast');

  // Detailblatt und Kategorie
  await s.js(`document.querySelector('.zeile [data-akt="details"]').click()`);
  await da('#sKat');
  await bild(s, 'details');
  await klick('#sKat');
  await da('[data-kat]');
  await bild(s, 'kategorie-wahl');
  await s.js(`document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h))`);
  await warte(300);

  // Menü, Einladen, Auswerten
  await klick('[data-akt="menue"]');
  await bild(s, 'menue');
  await s.js(`document.querySelector('[data-m="auswerten"]').click()`);
  await warte(300);
  await s.js(`[...document.querySelectorAll('[data-akt="bewerten"][data-wert="gebraucht"]')].slice(0, 2).forEach(b => b.click()); document.querySelector('[data-akt="bewerten"][data-wert="nie"]:not(.an)')?.click()`);
  await bild(s, 'auswerten');
  await klick('[data-akt="auswertenFertig"]');
  await klick('[data-akt="einladen"]');
  await bild(s, 'einladen-ohne-server');
  await s.js(`document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h))`);
  await klick('[data-akt="start"]');
  await bild(s, 'start');
  await klick('[data-akt="einstellungen"]');
  await bild(s, 'einstellungen');
  await s.js(`document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h))`);
  for (const k of s.konsole) console.log(k);
  s.zu();

  const d = await c.seite('http://localhost:8766/', { dunkel: true });
  await bild(d, 'dunkel-start');
  await d.js(`document.querySelector('#main [data-reise]').click()`);
  await bild(d, 'dunkel-reise');
  await d.js(`document.querySelector('.zeile [data-akt="details"]').click()`);
  await bild(d, 'dunkel-details');
  for (const k of d.konsole) console.log(k);
  console.log(`${n} Bilder in ${aus}`);
} finally { await c.ende(); }
