// Headless Chrome über das DevTools-Protokoll steuern (ohne Zusatzpakete). Node 21 braucht --experimental-websocket.
//   const c = await starteChrome();  const s = await c.seite('http://localhost:8766/', { breite: 390, hoehe: 844 });
//   await s.js('document.title');  await s.bild('pfad.png');  await c.ende();
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const warte = ms => new Promise(r => setTimeout(r, ms));

export async function starteChrome({ port = 9333 } = {}) {
  const profil = mkdtempSync(path.join(process.env.TMPDIR || tmpdir(), 'pl-chrome-'));
  const proz = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
  const basis = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) { try { await fetch(basis + '/json/version'); break; } catch (e) { await warte(100); } }

  async function seite(url, { breite = 390, hoehe = 844, dunkel = false, touch = true, skala = 2, mobil = true } = {}) {
    const ziel = await (await fetch(`${basis}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(ziel.webSocketDebuggerUrl);
    await new Promise((ok, f) => { ws.onopen = ok; ws.onerror = f; });
    let n = 0;
    const offen = new Map(), konsole = [];
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && offen.has(m.id)) { const { ok, f } = offen.get(m.id); offen.delete(m.id); m.error ? f(new Error(m.error.message)) : ok(m.result); }
      if (m.method === 'Runtime.exceptionThrown') konsole.push('FEHLER ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') konsole.push('console.error ' + m.params.args.map(a => a.value ?? a.description).join(' '));
    };
    const cdp = (method, params = {}) => new Promise((ok, f) => { const id = ++n; offen.set(id, { ok, f }); ws.send(JSON.stringify({ id, method, params })); });
    await cdp('Page.enable'); await cdp('Runtime.enable');
    await cdp('Emulation.setDeviceMetricsOverride', { width: breite, height: hoehe, deviceScaleFactor: skala, mobile: mobil });
    if (touch) await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dunkel ? 'dark' : 'light' }] });
    const s = {
      cdp, konsole,
      async geheZu(u) { await cdp('Page.navigate', { url: u }); await warte(300); await s.warteAuf('document.readyState === "complete"'); },
      async js(ausdruck) {
        const r = await cdp('Runtime.evaluate', { expression: ausdruck, awaitPromise: true, returnByValue: true, userGesture: true });
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
        return r.result.value;
      },
      async warteAuf(ausdruck, ms = 10000) {
        const ende = Date.now() + ms;
        while (Date.now() < ende) { try { if (await s.js(ausdruck)) return true; } catch (e) {} await warte(100); }
        throw new Error('Zeitüberschreitung: ' + ausdruck);
      },
      async bild(datei, { ganz = false } = {}) {
        const r = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: ganz });
        writeFileSync(datei, Buffer.from(r.data, 'base64'));
      },
      async offline(an) { await cdp('Network.enable'); await cdp('Network.emulateNetworkConditions', { offline: an, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }); },
      async tippe(x, y) {
        for (const type of ['touchStart', 'touchEnd']) await cdp('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
      },
      async wische(x1, y1, x2, y2, schritte = 8) {
        await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
        for (let i = 1; i <= schritte; i++) { await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * i / schritte, y: y1 + (y2 - y1) * i / schritte }] }); await warte(16); }
        await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      },
      zu() { ws.close(); },
    };
    if (url) await s.geheZu(url);
    return s;
  }
  return {
    seite,
    async ende() { proz.kill('SIGKILL'); await warte(200); try { rmSync(profil, { recursive: true, force: true }); } catch (e) {} },
  };
}
