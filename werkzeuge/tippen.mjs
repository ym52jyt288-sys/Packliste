// Tipp-Test: Antippen der Zeilen mit echten Touch-Ereignissen (Headless Chrome, CDP). Erwartet den laufenden Testserver.
// node --experimental-websocket werkzeuge/tippen.mjs
// Geprüft: ganze Zeile öffnet das Detailblatt, Neuzeichnen wartet auf den Finger, aufgewischte Zeile übersteht das Neuzeichnen,
// Tipp während ein Blatt ausblendet, Rückmeldung beim Antippen, Kopf wird nur bei Änderungen neu geschrieben.
// Kleiner Fingerradius, damit Chromes eigene Tipp-Korrektur (bevorzugt den innersten Knopf in der Nähe) nicht mitmisst.
import { starteChrome } from './chrome.mjs';
const warte = ms => new Promise(r => setTimeout(r, ms));
const c = await starteChrome();
let ok = 0, fehl = 0;
const pruefe = (name, b) => { if (b) ok++; else fehl++; console.log((b ? 'OK     ' : 'FEHLER ') + name); };
try {
  const s = await c.seite('http://localhost:8766/');
  const touch = (type, x, y) => s.cdp('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 0.1, radiusY: 0.1 }] });
  await s.warteAuf('!!document.querySelector("#wiName")');
  await s.js(`(() => { const e = document.querySelector('#wiName'); e.value = 'Markus'; e.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#wiOk').click(); })()`);
  await warte(400);
  await s.js(`(() => { const r = neueReise({ name: 'Test', personen: ['L.'] }); oeffneReise(r.id);
    eintragen('Socken, Wanderschuhe, Zahnbürste, Ladekabel, Reisepass, Sonnencreme'); versteckeToast(); })()`);
  await warte(500);
  const rect = i => s.js(`(() => { const r = document.querySelectorAll('.zeile .item')[${i}].getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, name: document.querySelectorAll('.zeile .name')[${i}].textContent }; })()`);
  const blattName = () => s.js(`(() => { const b = document.querySelector('.hinterlegt:not(.schliesst) #sName'); return b ? b.value : null; })()`);
  const zu = async () => { await s.js(`document.querySelectorAll('.hinterlegt').forEach(h => schliesseBlatt(h))`); await s.warteAuf('!document.querySelector(".hinterlegt")'); await warte(400); };
  const tippe = async (x, y) => { await touch('touchStart', x, y); await warte(40); await touch('touchEnd'); };

  // A: Ränder der Zeile öffnen das Detailblatt
  for (const [name, fx, fy] of [['oberer Rand', 0.5, 0.05], ['unterer Rand', 0.5, 0.95], ['Lücke neben dem Haken', null, 0.5], ['rechter Rand', 0.98, 0.5]]) {
    const r = await rect(2);
    const x = fx === null ? r.x + 37 : r.x + r.w * fx;
    await tippe(x, r.y + r.h * fy);
    await s.warteAuf('!!document.querySelector(".hinterlegt #sName")', 3000).catch(() => {});
    pruefe(`A ${name}: Detailblatt „${r.name}“`, await blattName() === r.name);
    await zu();
  }
  {
    await s.js(`UI.person = 'alle'; aktuelleReise().sachen[2].person = aktuelleReise().personen[0].id; render()`);
    await warte(300);
    const r = await rect(2);
    await tippe(r.x + r.w - 20, r.y + r.h / 2);
    await s.warteAuf('!!document.querySelector(".hinterlegt #sName")', 3000).catch(() => {});
    pruefe(`A Avatar unter „Alle“: Detailblatt „${r.name}“`, await blattName() === r.name);
    await zu();
    await s.js(`UI.person = aktuelleReise().personen[0].id; render()`);
    await warte(300);
  }
  // Haken über die ganze Zeilenhöhe
  {
    const r = await rect(0);
    await tippe(r.x + 8, r.y + 3);
    await warte(150);
    pruefe('A Haken am oberen Rand packt', await s.js(`document.querySelectorAll('.zeile .item')[0].classList.contains('gepackt')`));
    await tippe(r.x + 8, r.y + 3);
    await warte(800);
  }

  // B: Neuzeichnen aus dem Hintergrund wartet, solange der Finger liegt
  {
    const r = await rect(2);
    await s.js(`document.querySelectorAll('.zeile')[2]._alt = true`);
    await touch('touchStart', r.x + r.w / 2, r.y + r.h / 2);
    await s.js('renderInRuhe()');
    await warte(150);
    pruefe('B während der Berührung nicht neu gezeichnet', await s.js(`!!document.querySelectorAll('.zeile')[2]._alt`));
    await touch('touchEnd');
    await s.warteAuf('!!document.querySelector(".hinterlegt #sName")', 3000).catch(() => {});
    pruefe('B Tipp öffnet trotzdem das Detailblatt', await blattName() === r.name);
    await s.warteAuf(`!document.querySelectorAll('.zeile')[2]._alt`, 3000).catch(() => {});
    pruefe('B danach neu gezeichnet', await s.js(`!document.querySelectorAll('.zeile')[2]._alt`));
    await zu();
  }

  // C: Aufgewischte Zeile bleibt nach dem Neuzeichnen offen; der nächste Tipp schließt sie sichtbar
  {
    const r = await rect(0);
    await s.wische(r.x + r.w - 30, r.y + r.h / 2, r.x + r.w - 230, r.y + r.h / 2);
    await warte(500);
    pruefe('C Zeile aufgewischt', !!(await s.js('UI.geoeffnet')));
    await s.js('render()');
    pruefe('C nach render() weiter offen', await s.js(`document.querySelectorAll('.zeile .item')[0].style.transform === 'translateX(-160px)'`));
    const r3 = await rect(3);
    await tippe(r3.x + r3.w / 2, r3.y + r3.h / 2);
    await warte(300);
    pruefe('C erster Tipp schließt nur die offene Zeile', !(await s.js('UI.geoeffnet')) && !(await s.js(`!!document.querySelector('.hinterlegt')`))
      && await s.js(`document.querySelectorAll('.zeile .item')[0].style.transform === ''`));
    await tippe(r3.x + r3.w / 2, r3.y + r3.h / 2);
    await s.warteAuf('!!document.querySelector(".hinterlegt #sName")', 3000).catch(() => {});
    pruefe('C zweiter Tipp öffnet das Detailblatt', await blattName() === r3.name);
    await zu();
    // offene Zeile, dann Neuzeichnen ohne diese Zeile (z. B. gelöscht) → Zustand zurückgesetzt
    await s.wische(r.x + r.w - 30, r.y + r.h / 2, r.x + r.w - 230, r.y + r.h / 2);
    await warte(500);
    await s.js(`(() => { const r = aktuelleReise(); r.sachen = r.sachen.filter(x => x.id !== UI.geoeffnet); sichereReise(r); render(); })()`);
    pruefe('C gelöschte offene Zeile: Zustand zurückgesetzt', (await s.js('UI.geoeffnet')) === null);
    const r1 = await rect(1);
    await tippe(r1.x + r1.w / 2, r1.y + r1.h / 2);
    await s.warteAuf('!!document.querySelector(".hinterlegt #sName")', 3000).catch(() => {});
    pruefe('C danach öffnet schon der erste Tipp', await blattName() === r1.name);
    await zu();
  }

  // D: Gleich nach „Fertig“ die nächste Zeile antippen
  {
    const r1 = await rect(1), r2 = await rect(2);
    await tippe(r1.x + r1.w / 2, r1.y + r1.h / 2);
    await s.warteAuf('!!document.querySelector(".hinterlegt.offen #sName")', 3000);
    await warte(300);
    const f = await s.js(`(() => { const b = document.querySelector('.hinterlegt [data-schliessen]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    await tippe(f.x, f.y);
    await tippe(r2.x + r2.w / 2, r2.y + r2.h / 2);
    await s.warteAuf('!!document.querySelector(".hinterlegt:not(.schliesst) #sName")', 3000).catch(() => {});
    pruefe('D Tipp während des Ausblendens öffnet die nächste Sache', await blattName() === r2.name);
    await zu();
  }

  // E: Rückmeldung beim Antippen
  {
    const r = await rect(1), x = r.x + r.w / 2, y = r.y + r.h / 2;
    const gedrueckt = () => s.js(`document.querySelectorAll('.zeile .item')[1].classList.contains('gedrueckt')`);
    await touch('touchStart', x, y);
    await warte(200);
    pruefe('E langer Druck: Zeile leuchtet', await gedrueckt());
    for (let i = 1; i <= 4; i++) await touch('touchMove', x, y + i * 8);
    pruefe('E Scrollen: Leuchten weg', !(await gedrueckt()));
    await touch('touchEnd');
    await warte(300);
    await touch('touchStart', x, y); await touch('touchEnd');
    pruefe('E kurzer Tipp: kurz aufgeleuchtet', await gedrueckt());
    await warte(1200);
    pruefe('E danach wieder normal', !(await gedrueckt()));
    await zu();
    const k = await s.js(`(() => { const r = document.querySelector('.zeile .check').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await touch('touchStart', k.x, k.y);
    await warte(200);
    pruefe('E Haken: Zeile leuchtet nicht', !(await s.js(`document.querySelectorAll('.zeile .item')[0].classList.contains('gedrueckt')`)));
    await touch('touchEnd');
    await warte(800);
  }

  // F: Kopf wird beim Abgleich nur bei Änderungen neu geschrieben
  {
    await s.js(`window._k = document.querySelector('#kPersonen button'); aktualisiereKopf(aktuelleReise())`);
    pruefe('F Personen-Knöpfe bleiben dieselben Elemente', await s.js(`document.querySelector('#kPersonen button') === window._k`));
    await s.js(`(() => { const r = aktuelleReise(); r.sachen[0].gepackt = !r.sachen[0].gepackt; aktualisiereKopf(r); })()`);
    pruefe('F bei geänderter Zahl neu geschrieben', await s.js(`document.querySelector('#kPersonen button') !== window._k`));
  }
  for (const k of s.konsole) console.log(k);
  pruefe('keine Fehler in der Konsole', !s.konsole.length);
  console.log(`\nTipp-Test: ${ok}/${ok + fehl}`);
  process.exitCode = fehl ? 1 : 0;
} finally { await c.ende(); }
