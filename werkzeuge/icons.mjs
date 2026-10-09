// Erzeugt icon-180.png und icon-512.png aus icon.svg (Headless Chrome). Erwartet den laufenden Testserver.
import { starteChrome } from './chrome.mjs';
const c = await starteChrome();
try {
  for (const n of [512, 180]) {
    const s = await c.seite('http://localhost:8766/icon.svg', { breite: n, hoehe: n, skala: 1, mobil: false, touch: false });
    await s.bild(new URL(`../icon-${n}.png`, import.meta.url).pathname);
    s.zu();
  }
} finally { await c.ende(); }
