// Zwei-Geräte-Simulation: Gerät A (localhost) und Gerät B (127.0.0.1) haben getrennte Speicher und gleichen
// über den echten server/worker.js ab (Testserver mit nachgebildeter D1, oder WORKER=https://… für den echten Worker).
// node --experimental-websocket werkzeuge/zwei-geraete.mjs
import { starteChrome } from './chrome.mjs';

const WORKER = process.env.WORKER || 'http://127.0.0.1:8767';
const warte = ms => new Promise(r => setTimeout(r, ms));
const ergebnisse = [];
const pruefe = (titel, ist, soll) => { const ok = JSON.stringify(ist) === JSON.stringify(soll); ergebnisse.push(ok); console.log(`${ok ? 'OK    ' : 'FEHLER'} ${titel}${ok ? '' : `\n       ist:  ${JSON.stringify(ist)}\n       soll: ${JSON.stringify(soll)}`}`); };

const c = await starteChrome();
try {
  const geraet = async (herkunft, name) => {
    const s = await c.seite(`${herkunft}/`);
    await s.js(`localStorage.clear(); localStorage.setItem('pl.syncUrl', ${JSON.stringify(WORKER)}); localStorage.setItem('pl.ich', JSON.stringify({ name: ${JSON.stringify(name)}, geraet: ${JSON.stringify(name + '-geraet')} }))`);
    await s.geheZu(`${herkunft}/`);
    return s;
  };
  const A = await geraet('http://localhost:8766', 'Markus');
  const B = await geraet('http://127.0.0.1:8766', 'L.');
  const sync = async (s, id) => s.js(`synchronisiere(${JSON.stringify(id)}).then(() => SYNCS.get(${JSON.stringify(id)})?.stand.version)`);

  // A legt die Reise an und lädt über die Oberfläche ein
  const idA = await A.js(`(() => { const r = neueReise({ name: 'Peru', personen: ['L.'] }); const [m, l] = r.personen;
    for (const n of ['Stirnlampe', 'Reiseadapter', 'Sonnencreme', 'Erste-Hilfe-Set']) sacheHinzu(r, { name: n, person: m.id });
    sacheHinzu(r, { name: 'Pulli', person: l.id }); sichereReise(r); oeffneReise(r.id); return r.id; })()`);
  await A.js(`document.querySelector('[data-akt="einladen"]').click()`);
  await A.warteAuf(`!!document.querySelector('#eStart')`);
  await A.js(`document.querySelector('#eStart').click()`);
  await A.warteAuf(`!!document.querySelector('.qr-rahmen svg')`);
  const link = await A.js(`einladungsLink(SYNCS.get(${JSON.stringify(idA)}).stand.schluessel)`);
  pruefe('A: Einladung mit QR-Code und Link', /#r=[A-Za-z0-9_-]{22}$/.test(link), true);
  pruefe('A: Server hat die Reise (Version 1)', await A.js(`SYNCS.get(${JSON.stringify(idA)}).stand.version`), 1);
  await A.js(`document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h))`);

  // B öffnet den Link und tritt als „L.“ bei
  await B.geheZu(link.replace('http://localhost:8766', 'http://127.0.0.1:8766'));
  await B.warteAuf(`!!document.querySelector('#bOk')`);
  pruefe('B: „Wer bist du?“ wählt die passende Person vor', await B.js(`document.querySelector('.zeile-wahl.an .zw-text').firstChild.textContent.trim()`), 'L.');
  await B.js(`document.querySelector('#bOk').click()`);
  await B.warteAuf(`document.body.classList.contains('seite-reise')`);
  const idB = await B.js('UI.reiseId');
  pruefe('B: sieht die Reise mit allen Sachen', await B.js(`[aktuelleReise().info.name, aktuelleReise().sachen.length]`), ['Peru', 5]);
  pruefe('B: zeigt die eigene Liste (L.)', await B.js(`[personVon(aktuelleReise(), UI.person).name, [...document.querySelectorAll('#main .name')].map(e => e.textContent)]`), ['L.', ['Pulli']]);
  pruefe('B: Link ist aus der Adresszeile verschwunden', await B.js('location.hash'), '');
  await sync(A, idA);
  pruefe('A: sieht, dass L. verbunden ist', await A.js(`personNachName(REISEN.get(${JSON.stringify(idA)}), 'L.').verbunden`), true);

  // A übergibt zwei Sachen an L. (über die Oberfläche: Detailblatt → Person)
  for (const n of ['Reiseadapter', 'Sonnencreme']) {
    await A.js(`(() => { const r = aktuelleReise(); const s = r.sachen.find(x => x.name === ${JSON.stringify(n)}); oeffneSache(r, s); })()`);
    await A.warteAuf(`!!document.querySelector('#sPerson')`);
    await A.js(`(() => { const sel = document.querySelector('#sPerson'); sel.value = personNachName(aktuelleReise(), 'L.').id; sel.dispatchEvent(new Event('change', { bubbles: true })); document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h)); })()`);
    await A.warteAuf(`!document.querySelector('.hinterlegt')`);   // Tab A ist im Hintergrund, Timer laufen gedrosselt
  }
  await sync(A, idA);
  // B gleicht von selbst ab (alle 10 s bei geöffneter Reise)
  const t0 = Date.now();
  await B.warteAuf(`!!document.querySelector('.banner') && document.querySelector('.banner').textContent.includes('2 Sachen neu von Markus')`, 15000);
  pruefe(`B: Banner „2 Sachen neu von Markus“ erscheint von selbst (${Math.round((Date.now() - t0) / 1000)} s)`, true, true);
  pruefe('B: übergebene Sachen stehen auf Ls Liste, markiert', await B.js(`[...document.querySelectorAll('#main .zeile')].map(z => [z.querySelector('.name').textContent, !!z.querySelector('.marke.neu')]).sort()`),
    [['Pulli', false], ['Reiseadapter', true], ['Sonnencreme', true]]);
  await B.js(`document.querySelector('[data-akt="gesehen"]').click()`);
  await B.js(`[...document.querySelectorAll('#main .zeile')].find(z => z.querySelector('.name').textContent === 'Sonnencreme').querySelector('[data-akt="packen"]').click()`);
  await warte(600);
  await sync(B, idB);
  await sync(A, idA);
  pruefe('A: sieht Ls Haken und „gesehen“', await A.js(`(() => { const s = aktuelleReise().sachen.find(x => x.name === 'Sonnencreme'); return [s.gepackt, s.uebergabe.gesehen]; })()`), [true, true]);

  // Gleichzeitig: A ändert die Menge, B die Notiz derselben Sache; beide laden fast gleichzeitig hoch (409)
  await A.js(`(() => { const s = aktuelleReise().sachen.find(x => x.name === 'Pulli'); s.menge = 2; sichereReise(aktuelleReise()); })()`);
  await B.js(`(() => { const s = aktuelleReise().sachen.find(x => x.name === 'Pulli'); s.notiz = 'der dicke'; sichereReise(aktuelleReise()); })()`);
  await Promise.all([sync(A, idA), sync(B, idB)]);
  await sync(A, idA); await sync(B, idB);
  const pulli = s => s.js(`(() => { const p = aktuelleReise().sachen.find(x => x.name === 'Pulli'); return [p.menge, p.notiz]; })()`);
  pruefe('Gleichzeitig geändert: beide Felder bleiben (A)', await pulli(A), [2, 'der dicke']);
  pruefe('Gleichzeitig geändert: beide Felder bleiben (B)', await pulli(B), [2, 'der dicke']);

  // Offline: B packt und trägt ein, während A auch etwas einträgt
  await B.offline(true);
  await B.js(`(() => { const r = aktuelleReise(); r.sachen.find(x => x.name === 'Pulli').gepackt = true; sacheHinzu(r, { name: 'Kindle', person: UI.person }); sichereReise(r); })()`);
  await sync(B, idB);
  pruefe('B offline: Status sagt offline', await B.js(`syncStatusText(${JSON.stringify(idB)})`), 'Offline – Änderungen werden später abgeglichen');
  await A.js(`(() => { const r = aktuelleReise(); sacheHinzu(r, { name: 'Powerbank', person: personNachName(r, 'Markus').id }); sichereReise(r); })()`);
  await sync(A, idA);
  await B.offline(false);
  await B.js(`dispatchEvent(new Event('online'))`);
  await B.warteAuf(`aktuelleReise().sachen.some(s => s.name === 'Powerbank')`, 8000);
  await sync(A, idA);
  const namen = s => s.js(`aktuelleReise().sachen.map(x => x.name).sort()`);
  pruefe('Nach der Offline-Phase: beide haben alles', [await namen(A), await namen(B)].map(l => l.join(',')),
    Array(2).fill(['Erste-Hilfe-Set', 'Kindle', 'Powerbank', 'Pulli', 'Reiseadapter', 'Sonnencreme', 'Stirnlampe'].join(',')));
  pruefe('Nach der Offline-Phase: Haken von B ist bei A', await A.js(`aktuelleReise().sachen.find(x => x.name === 'Pulli').gepackt`), true);

  // Löschen auf einem Gerät
  await A.js(`(() => { const r = aktuelleReise(); r.sachen = r.sachen.filter(x => x.name !== 'Kindle'); sichereReise(r); })()`);
  await sync(A, idA); await sync(B, idB);
  pruefe('Löschen kommt an', await B.js(`aktuelleReise().sachen.some(x => x.name === 'Kindle')`), false);

  // Server sieht nur unlesbare Daten
  if (WORKER.startsWith('http://127.0.0.1')) {
    const raum = await A.js(`syncSchluessel(SYNCS.get(${JSON.stringify(idA)}).stand.schluessel).then(x => x.raum)`);
    const zeile = (await (await fetch(WORKER + '/__zeilen')).json()).find(z => z.id === raum);
    pruefe('Server: Raum-ID ist ein Hash, nicht der Schlüssel', !!zeile && !link.includes(raum), true);
    pruefe('Server: kein Klartext (Namen, Sachen)', ['Peru', 'Pulli', 'Markus', 'Sonnencreme'].some(w => zeile.daten.includes(w)), false);
  }

  // Für alle löschen: B bekommt Bescheid und behält die Kopie
  await A.js(`loescheRaum(${JSON.stringify(idA)})`);
  await sync(B, idB);
  pruefe('Raum gelöscht: B gleicht nicht mehr ab, Reise bleibt', await B.js(`[syncAn(${JSON.stringify(idB)}), REISEN.has(${JSON.stringify(idB)}), document.querySelector('#toastText').textContent]`),
    [false, true, 'Die gemeinsame Reise wurde auf dem Server gelöscht. Sie bleibt auf diesem Gerät.']);

  for (const k of [...A.konsole, ...B.konsole]) console.log(k);
  console.log(`\nZwei-Geräte-Test: ${ergebnisse.filter(Boolean).length}/${ergebnisse.length}`);
  process.exitCode = ergebnisse.every(Boolean) ? 0 : 1;
} finally { await c.ende(); }
