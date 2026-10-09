// Packliste: Synchronisierung gemeinsamer Reisen über den Cloudflare Worker (server/worker.js).
// Kern aus der Einkaufsliste übernommen: Ende-zu-Ende verschlüsselt, Zusammenführen pro Feld mit Zeitstempel.
// Neu: ein eigener Raum pro Reise. Der Schlüssel steckt nur in der Einladung (…/#r=<schlüssel>) und verlässt die Geräte nie.
'use strict';

const SYNC_URL_STANDARD = '';   // Worker-Adresse, siehe server/ANLEITUNG.md; zum Testen überschreibbar mit localStorage „pl.syncUrl“
const SYNC_URL = (() => { try { return localStorage.getItem('pl.syncUrl') || SYNC_URL_STANDARD; } catch (e) { return SYNC_URL_STANDARD; } })().replace(/\/+$/, '');
const SYNC_LISTEN = ['personen', 'abschnitte', 'sachen'];      // Arrays mit id; „info“ ist ein Objekt mit Feldern
const SYNC_GRABSTEIN_TAGE = 60;
const SYNCS = new Map();   // reiseId → { stand: { schluessel, version, serverHash, uhr, zuletzt }, doc, laeuft, nochmal, zeitgeber, fehler, online }

function ladeSync() {
  SYNCS.clear();
  for (const e of S.reisen) {
    if (!e.schluessel) continue;
    const d = lade('sync.' + e.id, null);
    SYNCS.set(e.id, { stand: (d && d.stand) || { schluessel: e.schluessel, version: 0, serverHash: '', uhr: 0, zuletzt: 0 },
      doc: (d && d.doc) || null, laeuft: false, nochmal: false, zeitgeber: null, fehler: '', online: true });
    if (!SYNCS.get(e.id).doc) erfasseAlles(e.id, 1);   // Stand ohne Dokument: alles mit Zeitstempel 1 (der Server gewinnt)
  }
  SYNC_BEREIT = true;
}
const syncAn = id => !!(SYNCS.get(id) && SYNCS.get(id).stand.schluessel);
function sichereSync(id) {
  const sy = SYNCS.get(id);
  if (sy) sichere('sync.' + id, { stand: sy.stand, doc: sy.doc });
}

// JSON mit sortierten Schlüsseln, damit gleiche Stände auf allen Geräten gleich aussehen
function kanonisch(x) {
  if (Array.isArray(x)) return '[' + x.map(kanonisch).join(',') + ']';
  if (x && typeof x === 'object') return '{' + Object.keys(x).filter(k => x[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + kanonisch(x[k])).join(',') + '}';
  return JSON.stringify(x === undefined ? null : x);
}
function textHash(s) {   // FNV-1a, reicht zum Erkennen von Änderungen
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36) + ':' + s.length;
}

// Hybride Uhr: nie kleiner als ein schon gesehener Zeitstempel, damit eine nachgehende Geräteuhr nicht verliert
function syncUhr(stand) {
  const t = Math.max(Date.now(), (stand.uhr || 0) + 1);
  stand.uhr = t;
  return t;
}

// Sammlung als { schlüssel: wert } (Arrays über die id)
const alsMap = (name, wert) => SYNC_LISTEN.includes(name) ? Object.fromEntries((wert || []).map(e => [e.id, e])) : (wert || {});
const istObjekt = v => v && typeof v === 'object' && !Array.isArray(v);
const felderVon = v => istObjekt(v) ? v : { _: v };
// Ein Eintrag lebt, wenn er Werte hat und ein Feld jünger ist als sein Löschzeitpunkt.
// So bleibt eine Sache vollständig erhalten, wenn jemand sie löscht und ein anderer sie gleichzeitig ändert.
const juengstes = e => Math.max(0, ...Object.values(e.f || {}).map(w => w.at(-1)));
const lebt = e => !!e && Object.values(e.f || {}).some(w => w.length === 2) && juengstes(e) > (e.x || 0);

// Überträgt den aktuellen Stand einer Sammlung ins Dokument; geänderte Felder bekommen den Zeitstempel t
function erfasse(doc, name, wert, t) {
  const alt = doc[name] || (doc[name] = {});
  const jetzt = alsMap(name, wert);
  let geaendert = false;
  for (const [key, v] of Object.entries(jetzt)) {
    const e = alt[key] || (alt[key] = { f: {} });
    const felder = felderVon(v);
    for (const [feld, fw] of Object.entries(felder)) {
      if (fw === undefined || feld === 'id') continue;
      const bisher = e.f[feld];
      if (!bisher || bisher.length === 1 || kanonisch(bisher[0]) !== kanonisch(fw)) { e.f[feld] = [JSON.parse(JSON.stringify(fw)), t]; geaendert = true; }
    }
    for (const [feld, bisher] of Object.entries(e.f)) {
      if (bisher.length === 2 && !(feld in felder && felder[feld] !== undefined)) { e.f[feld] = [t]; geaendert = true; }
    }
  }
  for (const [key, e] of Object.entries(alt)) {
    if (!(key in jetzt) && lebt(e)) { alt[key] = { f: {}, x: t }; geaendert = true; }
  }
  return geaendert;
}

// Führt zwei Dokumente zusammen (reine Funktion). Pro Feld gewinnt der jüngere Zeitstempel,
// bei Gleichstand der größere Wert, damit alle Geräte zum selben Ergebnis kommen.
function zusammenfuehren(a, b, jetzt = Date.now()) {
  const erg = {}, grenze = jetzt - SYNC_GRABSTEIN_TAGE * 864e5;
  for (const name of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    const sa = (a || {})[name] || {}, sb = (b || {})[name] || {}, ziel = erg[name] = {};
    for (const key of new Set([...Object.keys(sa), ...Object.keys(sb)])) {
      const ea = sa[key] || { f: {} }, eb = sb[key] || { f: {} };
      const x = Math.max(ea.x || 0, eb.x || 0);
      const f = {};
      for (const feld of new Set([...Object.keys(ea.f || {}), ...Object.keys(eb.f || {})])) {
        const va = (ea.f || {})[feld], vb = (eb.f || {})[feld];
        f[feld] = !va ? vb : !vb ? va : va.at(-1) !== vb.at(-1) ? (va.at(-1) > vb.at(-1) ? va : vb)
          : kanonisch(va) >= kanonisch(vb) ? va : vb;
      }
      const neu = x ? { f, x } : { f };
      if (x && !lebt(neu)) {
        if (x >= grenze) ziel[key] = { f: {}, x };   // Grabstein; alte fallen weg
        continue;
      }
      if (Object.keys(f).length) ziel[key] = neu;
    }
  }
  return erg;
}

// Wert eines Eintrags aus dem Dokument; null = gelöscht
function eintragWert(e) {
  if (!lebt(e)) return null;
  if ('_' in e.f) return e.f._.length === 2 ? e.f._[0] : null;
  return Object.fromEntries(Object.entries(e.f).filter(([, w]) => w.length === 2).map(([k, w]) => [k, JSON.parse(JSON.stringify(w[0]))]));
}
const ersterZeitstempel = e => Math.min(...Object.values(e.f || {}).map(w => w.at(-1)));

// Schreibt das Dokument in eine Sammlung zurück. Vorhandene Objekte werden an Ort und Stelle geändert,
// damit offene Blätter (z. B. das Detailblatt einer Sache) weiter auf dasselbe Objekt zeigen.
function ausDokument(doc, name, bisher) {
  const s = doc[name] || {};
  const angleichen = (obj, wert) => {
    if (!istObjekt(obj) || !istObjekt(wert)) return wert;
    for (const k of Object.keys(obj)) if (!(k in wert)) delete obj[k];
    return Object.assign(obj, wert);
  };
  if (SYNC_LISTEN.includes(name)) {
    const alt = new Map((bisher || []).map(e => [e.id, e]));
    const erg = [];
    for (const e of bisher || []) {
      const w = eintragWert(s[e.id]);
      if (w) erg.push(angleichen(e, { ...w, id: e.id }));
    }
    const neu = Object.entries(s).filter(([k, e]) => !alt.has(k) && eintragWert(e)).sort((x, y) => ersterZeitstempel(x[1]) - ersterZeitstempel(y[1]));
    for (const [k, e] of neu) erg.push({ ...eintragWert(e), id: k });
    return erg;
  }
  const erg = {};
  for (const [k, e] of Object.entries(s)) {
    const w = eintragWert(e);
    if (w != null) erg[k] = angleichen((bisher || {})[k], w);
  }
  return erg;
}

/* Verschlüsselung */
function b64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const ausB64url = str => Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const durchStrom = async (bytes, strom) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(strom)).arrayBuffer());

async function syncSchluessel(schluessel) {
  const roh = new TextEncoder().encode(schluessel);
  const raum = b64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('raum|' + schluessel))));
  const basis = await crypto.subtle.importKey('raw', roh, 'HKDF', false, ['deriveKey']);
  const aes = await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('packliste'), info: new TextEncoder().encode('daten') },
    basis, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { raum, aes };
}
async function verschluessele(obj, aes) {
  const roh = new TextEncoder().encode(JSON.stringify(obj));
  const komp = typeof CompressionStream !== 'undefined';
  const inhalt = komp ? await durchStrom(roh, new CompressionStream('deflate-raw')) : roh;
  const klar = new Uint8Array(inhalt.length + 1);
  klar[0] = komp ? 1 : 0; klar.set(inhalt, 1);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const geheim = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, klar));
  const alles = new Uint8Array(12 + geheim.length);
  alles.set(iv); alles.set(geheim, 12);
  return b64url(alles);
}
async function entschluessele(text, aes) {
  const alles = ausB64url(text);
  const klar = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: alles.subarray(0, 12) }, aes, alles.subarray(12)));
  const inhalt = klar.subarray(1);
  const roh = klar[0] === 1 ? await durchStrom(inhalt, new DecompressionStream('deflate-raw')) : inhalt;
  return JSON.parse(new TextDecoder().decode(roh));
}
const neuerSyncSchluessel = () => b64url(crypto.getRandomValues(new Uint8Array(16)));

/* Server */
async function syncAnfrage(methode, raum, body, parameter = '') {
  const ctrl = new AbortController();
  const zeit = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(`${SYNC_URL}/r/${raum}${parameter}`, {
      method: methode, signal: ctrl.signal, cache: 'no-store',
      headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined,
    });
    const d = r.status === 204 ? {} : await r.json().catch(() => ({}));
    return { status: r.status, ...d };
  } finally { clearTimeout(zeit); }
}

/* Lokale Änderungen: sichereReise() ruft das für jede gespeicherte Reise auf */
function erfasseAlles(id, t) {
  const sy = SYNCS.get(id), r = REISEN.get(id);
  if (!sy || !r) return false;
  if (!sy.doc) sy.doc = {};
  let geaendert = false;
  for (const name of SAMMLUNGEN) geaendert = erfasse(sy.doc, name, r[name], t) || geaendert;
  return geaendert;
}
function syncGeaendert(r) {
  const sy = SYNCS.get(r.id);
  if (!sy || !sy.stand.schluessel || sy.anwenden) return;
  if (erfasseAlles(r.id, syncUhr(sy.stand))) {
    sichereSync(r.id);
    planeSync(r.id, 1500);
  }
}
function planeSync(id, ms) {
  const sy = SYNCS.get(id);
  if (!sy) return;
  clearTimeout(sy.zeitgeber);
  sy.zeitgeber = setTimeout(() => synchronisiere(id).catch(() => {}), ms);
}

// Übernimmt ein zusammengeführtes Dokument in die Reise
function syncAnwenden(id, doc) {
  const sy = SYNCS.get(id), r = REISEN.get(id);
  const vorher = kanonisch(sy.doc);
  sy.doc = doc;
  if (kanonisch(doc) === vorher) return false;
  sy.anwenden = true;
  try {
    for (const name of SAMMLUNGEN) r[name] = ausDokument(doc, name, r[name]);
    pruefeReise(r);
    if (fasseDoppelteZusammen(r)) erfasseAlles(id, syncUhr(sy.stand));
    sichereReise(r, { ohneSync: true });
  } finally { sy.anwenden = false; }
  return true;
}

// Haben zwei Geräte gleichzeitig dieselbe Sache für dieselbe Person eingetragen, steht sie nach dem Abgleich zweimal da.
// Es bleibt die kleinste id (auf allen Geräten dieselbe), mit der größeren Menge; Notiz und Häkchen werden übernommen.
function fasseDoppelteZusammen(r) {
  const gruppen = new Map();
  for (const s of r.sachen) {
    const key = kompakt(s.name) + '|' + (s.person || '') + '|' + (s.abschnitt || '');
    if (!gruppen.has(key)) gruppen.set(key, []);
    gruppen.get(key).push(s);
  }
  let geaendert = false;
  for (const l of gruppen.values()) {
    if (l.length < 2) continue;
    // Nur frisch und gleichzeitig Eingetragenes zusammenfassen, nicht bewusst doppelt Angelegtes von früher
    // (verschiedene Geräte, innerhalb von 10 Minuten angelegt)
    const neu = l.filter(s => s.erstellt && Math.abs(s.erstellt - l[0].erstellt) < 10 * 60 * 1000);
    if (neu.length < 2 || new Set(neu.map(s => s.geraet)).size < 2) continue;
    neu.sort((a, b) => (a.id < b.id ? -1 : 1));
    const [bleibt, ...weg] = neu;
    for (const w of weg) {
      if (w.menge && (!bleibt.menge || w.menge > bleibt.menge)) bleibt.menge = w.menge;
      if (!bleibt.notiz && w.notiz) bleibt.notiz = w.notiz;
      if (w.gepackt) bleibt.gepackt = true;
      r.sachen.splice(r.sachen.indexOf(w), 1);
    }
    geaendert = true;
  }
  return geaendert;
}

// Holen, zusammenführen, bei Bedarf hochladen. Bei 409 (jemand war schneller) noch einmal.
async function synchronisiere(id) {
  const sy = SYNCS.get(id);
  if (!sy || !sy.stand.schluessel || !SYNC_URL || !REISEN.has(id)) return;
  if (sy.laeuft) { sy.nochmal = true; return; }
  sy.laeuft = true;
  const st = sy.stand;
  let geaendert = false;
  try {
    const { raum, aes } = await syncSchluessel(st.schluessel);
    if (!sy.doc) sy.doc = {};
    for (let versuch = 0; versuch < 4; versuch++) {
      const r = await syncAnfrage('GET', raum, null, st.version ? `?v=${st.version}` : '');
      if (r.status === 404) {
        if (st.version) { beendeSync(id); if (typeof zeigeToast === 'function') zeigeToast('Die gemeinsame Reise wurde auf dem Server gelöscht. Sie bleibt auf diesem Gerät.'); return; }
      } else if (r.status !== 200) throw new Error('status ' + r.status);
      else if (!r.unveraendert) {
        const serverDoc = await entschluessele(r.daten, aes);
        const neu = zusammenfuehren(sy.doc, serverDoc);
        for (const s of Object.values(serverDoc)) for (const e of Object.values(s)) for (const w of Object.values(e.f || {}).concat(e.x ? [[e.x]] : [])) st.uhr = Math.max(st.uhr || 0, w.at(-1));
        if (syncAnwenden(id, neu)) geaendert = true;
        st.version = r.version; st.serverHash = textHash(kanonisch(serverDoc));
      }
      const hash = textHash(kanonisch(sy.doc));
      if (r.status === 200 && hash === st.serverHash) break;            // Server kennt schon alles
      const p = await syncAnfrage('PUT', raum, { basis: r.status === 404 ? 0 : st.version, daten: await verschluessele(sy.doc, aes) });
      if (p.status === 200) { st.version = p.version; st.serverHash = hash; break; }
      if (p.status !== 409) throw new Error('status ' + p.status);
    }
    st.zuletzt = Date.now(); sy.fehler = ''; sy.online = true;
    sichereSync(id);
  } catch (e) {
    const netz = navigator.onLine === false || e.name === 'AbortError' || e instanceof TypeError;
    sy.online = !netz;
    sy.fehler = netz ? '' : e.name === 'OperationError' ? 'Schlüssel passt nicht zu den Daten' : 'Synchronisierung fehlgeschlagen';
  } finally {
    sy.laeuft = false;
    document.dispatchEvent(new CustomEvent('sync', { detail: { id, geaendert } }));
    if (sy.nochmal) { sy.nochmal = false; planeSync(id, 300); }
  }
}

// Gemeinsame Reise einrichten: neuer Raum aus einer vorhandenen Reise
async function starteSync(id, schluessel = neuerSyncSchluessel()) {
  const e = reiseEintrag(id);
  e.schluessel = schluessel;
  sichereIndex();
  const sy = { stand: { schluessel, version: 0, serverHash: '', uhr: 0, zuletzt: 0 }, doc: {}, laeuft: false, nochmal: false, zeitgeber: null, fehler: '', online: true };
  SYNCS.set(id, sy);
  erfasseAlles(id, syncUhr(sy.stand));
  sichereSync(id);
  await synchronisiere(id);
  return schluessel;
}

// Liest eine gemeinsame Reise vom Server (zum Beitreten), ohne etwas zu speichern
async function holeGeteilteReise(schluessel) {
  const { raum, aes } = await syncSchluessel(schluessel);
  const r = await syncAnfrage('GET', raum);
  if (r.status === 404) return null;
  if (r.status !== 200) throw new Error('status ' + r.status);
  const doc = await entschluessele(r.daten, aes);
  const reise = pruefeReise({ id: '' });
  for (const name of SAMMLUNGEN) reise[name] = ausDokument(doc, name, reise[name]);
  return { doc, version: r.version, reise: pruefeReise(reise) };
}

// Beitreten: lokale Reise aus dem Server-Stand anlegen. ichPersonId: gewählte Person, oder neuName für eine neue Person.
async function trittBei(schluessel, geteilt, { ichPersonId = null, neuName = '' } = {}) {
  const id = uid();
  const r = pruefeReise({ id, ...kopie({ info: geteilt.reise.info, personen: geteilt.reise.personen, abschnitte: geteilt.reise.abschnitte, sachen: geteilt.reise.sachen }) });
  REISEN.set(id, r);
  const sy = { stand: { schluessel, version: geteilt.version, serverHash: textHash(kanonisch(geteilt.doc)), uhr: 0, zuletzt: Date.now() },
    doc: kopie(geteilt.doc), laeuft: false, nochmal: false, zeitgeber: null, fehler: '', online: true };
  for (const s of Object.values(sy.doc)) for (const e of Object.values(s)) for (const w of Object.values(e.f || {}).concat(e.x ? [[e.x]] : [])) sy.stand.uhr = Math.max(sy.stand.uhr, w.at(-1));
  SYNCS.set(id, sy);
  let ich = personVon(r, ichPersonId);
  if (!ich && neuName) ich = personHinzu(r, neuName);
  if (ich) ich.verbunden = true;
  S.reisen.push({ id, schluessel, ich: ich ? ich.id : null });
  sichereIndex();
  sichereReise(r);         // erfasst die neue Person bzw. „verbunden“ und lädt hoch
  sichereSync(id);
  await synchronisiere(id);
  return r;
}

function beendeSync(id) {
  const sy = SYNCS.get(id);
  if (sy) clearTimeout(sy.zeitgeber);
  SYNCS.delete(id);
  const e = reiseEintrag(id);
  if (e) { e.schluessel = null; sichereIndex(); }
  sichere('sync.' + id, undefined);
  document.dispatchEvent(new CustomEvent('sync', { detail: { id, geaendert: true } }));
}

// Reise für alle löschen: Raum auf dem Server entfernen (die anderen behalten ihre Kopie, ohne Abgleich)
async function loescheRaum(id) {
  const sy = SYNCS.get(id);
  if (!sy) return;
  const { raum } = await syncSchluessel(sy.stand.schluessel);
  await syncAnfrage('DELETE', raum).catch(() => {});
}

const einladungsLink = schluessel => `${location.origin}${location.pathname}#r=${schluessel}`;
function linkAus(text) {
  const m = String(text || '').match(/#r=([A-Za-z0-9_-]{20,})/);
  return m ? m[1] : null;
}

function syncStatusText(id) {
  const sy = SYNCS.get(id);
  if (!SYNC_URL) return 'Der Sync-Server ist noch nicht eingerichtet.';
  if (!sy) return 'Nur auf diesem Gerät';
  if (sy.fehler) return sy.fehler;
  if (!sy.online) return 'Offline – Änderungen werden später abgeglichen';
  if (sy.laeuft && !sy.stand.zuletzt) return 'Wird verbunden …';
  if (!sy.stand.zuletzt) return 'Noch nicht abgeglichen';
  const sek = Math.round((Date.now() - sy.stand.zuletzt) / 1000);
  return sek < 60 ? 'Gerade abgeglichen' : sek < 3600 ? `Abgeglichen vor ${Math.round(sek / 60)} Min.` : `Abgeglichen am ${new Date(sy.stand.zuletzt).toLocaleString('de-DE', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
}

// Auslöser: Start, zurück in die App, wieder online, alle 10 s für die offene Reise
function starteSyncZeitgeber(offeneReise) {
  const alle = () => { let ms = 100; for (const id of SYNCS.keys()) { planeSync(id, ms); ms += 400; } };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') alle(); });
  addEventListener('online', alle);
  setInterval(() => {
    const id = offeneReise();
    if (document.visibilityState === 'visible' && id && syncAn(id)) synchronisiere(id).catch(() => {});
  }, 10000);
  alle();
}
