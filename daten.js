// Packliste: Datenmodell, Speicher, Klassifizierung, Text-Import/-Export, Übernahme aus früheren Reisen.
// Läuft ohne Oberfläche (der Selbsttest nutzt es direkt). Klassische Skripte teilen sich den globalen Bereich:
// katalog.js → daten.js → sync.js → app.js.
'use strict';

// Versionsnummer, unten in den Einstellungen sichtbar. Bei jeder Änderung erhöhen – zusammen mit VERSION in sw.js.
const APP_VERSION = 1;

/* ============================================================
   Hilfsfunktionen
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const gross = s => s ? s.charAt(0).toLocaleUpperCase('de') + s.slice(1) : s;
const kopie = x => JSON.parse(JSON.stringify(x));

/* ============================================================
   Speicher (localStorage, JSON)
   ============================================================ */

const SPEICHER_PREFIX = 'pl.';
let TESTMODUS = false, SYNC_BEREIT = false;
function lade(schluessel, standard) {
  try {
    const roh = localStorage.getItem(SPEICHER_PREFIX + schluessel);
    return roh == null ? standard : JSON.parse(roh);
  } catch (e) { return standard; }
}
function sichere(schluessel, wert) {
  if (TESTMODUS) return;
  try {
    if (wert === undefined) localStorage.removeItem(SPEICHER_PREFIX + schluessel);
    else localStorage.setItem(SPEICHER_PREFIX + schluessel, JSON.stringify(wert));
  } catch (e) { if (typeof zeigeToast === 'function') zeigeToast('Speichern fehlgeschlagen'); }
}

/* ============================================================
   Zustand
   S.reisen ist der Index aller Reisen auf diesem Gerät: { id, schluessel (Sync-Raum, sonst null), ich (Person) }.
   Die Reisen selbst liegen einzeln unter „pl.reise.<id>“ und im Speicher in REISEN.
   ============================================================ */

const KAT_IDS = KATEGORIEN.map(k => k.id);
const KAT = Object.fromEntries(KATEGORIEN.map(k => [k.id, k]));
const SAMMLUNGEN = ['info', 'personen', 'abschnitte', 'sachen'];
const FARBEN = ['#2f6fb0', '#d0743c', '#2e9d6f', '#9b59b6', '#c94f6d', '#b8932a', '#3a9fb0', '#7a7f87'];
const BEWERTUNGEN = { gebraucht: 'gebraucht', kaum: 'kaum gebraucht', nie: 'nie gebraucht' };

const S = { ich: null, reisen: [], einstellungen: null, korrekturen: {} };
const REISEN = new Map();

function standardEinstellungen() {
  return { thema: 'auto', gepacktUnten: true, gepacktAusblenden: false, ansicht: 'abschnitte', kategorien: [...KAT_IDS], zuletzt: null };
}

function ladeAlles() {
  S.ich = lade('ich', null) || { name: '', geraet: uid() };
  S.reisen = lade('reisen', []).filter(e => e && e.id);
  S.einstellungen = { ...standardEinstellungen(), ...lade('einstellungen', {}) };
  S.einstellungen.kategorien = katReihenfolge(S.einstellungen.kategorien);
  S.korrekturen = lade('korrekturen', {});
  REISEN.clear();
  for (const e of S.reisen) {
    const r = lade('reise.' + e.id, null);
    REISEN.set(e.id, pruefeReise({ ...(r || {}), id: e.id }));
  }
  vergiss();
}

// Gespeicherte Reihenfolge der Kategorien, ergänzt um neue und ohne unbekannte
function katReihenfolge(liste) {
  const l = (Array.isArray(liste) ? liste : []).filter(k => KAT_IDS.includes(k));
  return [...new Set([...l, ...KAT_IDS])];
}

// Fehlende Felder ergänzen (ältere Stände, Daten aus dem Abgleich)
function pruefeReise(r) {
  r.info = r.info && typeof r.info === 'object' ? r.info : {};
  if (typeof r.info.name !== 'string') r.info.name = r.info.name ? String(r.info.name) : 'Reise';
  for (const name of ['personen', 'abschnitte', 'sachen']) if (!Array.isArray(r[name])) r[name] = [];
  r.personen.forEach((p, i) => { if (typeof p.reihenfolge !== 'number') p.reihenfolge = i; if (!p.farbe) p.farbe = FARBEN[i % FARBEN.length]; });
  r.abschnitte.forEach((a, i) => { if (typeof a.reihenfolge !== 'number') a.reihenfolge = i; });
  r.sachen.forEach((s, i) => {
    if (typeof s.name !== 'string') s.name = String(s.name || '');
    if (typeof s.pos !== 'number') s.pos = i + 1;
    s.gepackt = !!s.gepackt;
  });
  return r;
}

const reiseEintrag = id => S.reisen.find(e => e.id === id);
const sichereIndex = () => sichere('reisen', S.reisen);
const sichereEinstellungen = () => sichere('einstellungen', S.einstellungen);
const sichereIch = () => sichere('ich', S.ich);

function sichereReise(r, { ohneSync = false } = {}) {
  sichere('reise.' + r.id, { info: r.info, personen: r.personen, abschnitte: r.abschnitte, sachen: r.sachen });
  vergiss();
  if (SYNC_BEREIT && !ohneSync && typeof syncGeaendert === 'function') syncGeaendert(r);
}

// Zwischenspeicher (Bibliothek, gelernte Kategorien, Klassifizierung) nach Änderungen verwerfen
let CACHE = {};
function vergiss() { CACHE = {}; }

function neueReise({ name, start = '', ende = '', personen = [], ichName = S.ich.name } = {}) {
  const r = pruefeReise({ id: uid(), info: { name: name || 'Reise', start, ende, notiz: '', abgeschlossen: false, erstellt: Date.now() } });
  const namen = [];
  for (const n of [ichName, ...personen].map(x => String(x || '').trim()).filter(Boolean)) {
    if (!namen.some(m => norm(m) === norm(n))) namen.push(n);
  }
  if (!namen.length) namen.push(ichName || 'Ich');
  for (const n of namen) personHinzu(r, n);
  REISEN.set(r.id, r);
  S.reisen.push({ id: r.id, schluessel: null, ich: r.personen[0].id });
  sichereIndex();
  sichereReise(r);
  return r;
}

function loescheReiseLokal(id) {
  REISEN.delete(id);
  S.reisen = S.reisen.filter(e => e.id !== id);
  sichereIndex();
  sichere('reise.' + id, undefined);
  sichere('sync.' + id, undefined);
  if (S.einstellungen.zuletzt === id) { S.einstellungen.zuletzt = null; sichereEinstellungen(); }
  vergiss();
}

/* Personen und Abschnitte */
function personHinzu(r, name) {
  const belegt = new Set(r.personen.map(p => p.farbe));
  const p = { id: uid(), name: String(name).trim() || 'Person', farbe: FARBEN.find(f => !belegt.has(f)) || FARBEN[r.personen.length % FARBEN.length],
    reihenfolge: r.personen.reduce((m, x) => Math.max(m, x.reihenfolge + 1), 0) };
  r.personen.push(p);
  return p;
}
const personVon = (r, id) => r.personen.find(p => p.id === id) || null;
const personNachName = (r, name) => r.personen.find(p => norm(p.name) === norm(name)) || null;
const personenSortiert = r => r.personen.slice().sort((a, b) => a.reihenfolge - b.reihenfolge);
const initialen = name => {
  const w = String(name || '?').trim().split(/[\s.-]+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?')[0]).toLocaleUpperCase('de');
};
// Die Person, die dieses Gerät auf der Reise ist (bei rein lokalen Reisen die erste)
function ichIn(r) {
  const e = reiseEintrag(r.id);
  return (e && personVon(r, e.ich)) || null;
}

function abschnittHinzu(r, name) {
  const vorhanden = r.abschnitte.find(a => norm(a.name) === norm(name));
  if (vorhanden) return vorhanden;
  const a = { id: uid(), name: String(name).trim(), reihenfolge: r.abschnitte.reduce((m, x) => Math.max(m, x.reihenfolge + 1), 0) };
  r.abschnitte.push(a);
  return a;
}
const abschnittVon = (r, id) => r.abschnitte.find(a => a.id === id) || null;
const abschnitteSortiert = r => r.abschnitte.slice().sort((a, b) => a.reihenfolge - b.reihenfolge);

/* Sachen */
const naechstePos = r => r.sachen.reduce((m, s) => Math.max(m, s.pos || 0), 0) + 1;
function sacheHinzu(r, felder) {
  const s = { id: uid(), name: '', menge: null, notiz: '', person: null, abschnitt: null, gepackt: false, vielleicht: false, bewertung: null,
    pos: naechstePos(r), erstellt: Date.now(), geraet: S.ich ? S.ich.geraet : '', ...felder };
  for (const k of Object.keys(s)) if (s[k] === undefined) delete s[k];
  r.sachen.push(s);
  return s;
}
const sacheVon = (r, id) => r.sachen.find(s => s.id === id) || null;

// Zählt für den Fortschritt: Unsicheres („vielleicht“) nur, wenn es gepackt ist
function fortschritt(r, personId = undefined) {
  const l = r.sachen.filter(s => (personId === undefined || s.person === personId) && (!s.vielleicht || s.gepackt));
  return { gepackt: l.filter(s => s.gepackt).length, gesamt: l.length };
}

/* Übergeben: Sache wandert in die Liste einer anderen Person. Rückgabe: Funktion zum Rückgängigmachen. */
function uebergeben(r, s, anId, vonId) {
  const vorher = { person: s.person, uebergabe: s.uebergabe ? { ...s.uebergabe } : null };
  s.person = anId || null;
  if (anId) s.uebergabe = { von: vonId || vorher.person || null, an: anId, t: Date.now(), gesehen: false };
  else delete s.uebergabe;
  return () => {
    s.person = vorher.person;
    if (vorher.uebergabe) s.uebergabe = vorher.uebergabe; else delete s.uebergabe;
  };
}
const neuUebergeben = (r, personId) => r.sachen.filter(s => s.uebergabe && s.uebergabe.an === personId && s.person === personId && !s.uebergabe.gesehen);
function alsGesehen(r, personId) {
  let n = 0;
  for (const s of neuUebergeben(r, personId)) { s.uebergabe = { ...s.uebergabe, gesehen: true }; n++; }
  return n;
}

/* ============================================================
   Datum und Zustand einer Reise
   ============================================================ */

const heute = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const alsDatum = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const tageBis = s => Math.round((alsDatum(s) - alsDatum(heute())) / 864e5);
const MONAT = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' });
const MONAT_JAHR = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
const gueltigesDatum = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');

function datumBereich(start, ende) {
  const a = gueltigesDatum(start), b = gueltigesDatum(ende);
  if (!a && !b) return '';
  if (a && !b) return MONAT_JAHR.format(alsDatum(start));
  if (!a && b) return 'bis ' + MONAT_JAHR.format(alsDatum(ende));
  const s = alsDatum(start), e = alsDatum(ende);
  if (start === ende) return MONAT_JAHR.format(s);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) return `${s.getDate()}.–${MONAT_JAHR.format(e)}`;
  if (s.getFullYear() === e.getFullYear()) return `${MONAT.format(s)} – ${MONAT_JAHR.format(e)}`;
  return `${MONAT_JAHR.format(s)} – ${MONAT_JAHR.format(e)}`;
}

// 'geplant' (Start in der Zukunft oder ohne Datum), 'unterwegs', 'vorbei' (Ende vorbei, noch nicht abgeschlossen), 'abgeschlossen'
function reiseStatus(r) {
  const i = r.info;
  if (i.abgeschlossen) return 'abgeschlossen';
  const h = heute();
  const start = gueltigesDatum(i.start) ? i.start : null, ende = gueltigesDatum(i.ende) ? i.ende : start;
  if (ende && ende < h) return 'vorbei';
  if (start && start <= h) return 'unterwegs';
  return 'geplant';
}
function countdownText(r) {
  const st = reiseStatus(r), i = r.info;
  if (st === 'abgeschlossen') return '';
  if (st === 'vorbei') return 'vorbei';
  if (st === 'unterwegs') {
    const rest = gueltigesDatum(i.ende) ? tageBis(i.ende) : null;
    return rest == null ? 'unterwegs' : rest === 0 ? 'unterwegs · letzter Tag' : `unterwegs · noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'}`;
  }
  if (!gueltigesDatum(i.start)) return '';
  const d = tageBis(i.start);
  return d === 0 ? 'heute' : d === 1 ? 'morgen' : `in ${d} Tagen`;
}
const reiseDauer = r => gueltigesDatum(r.info.start) && gueltigesDatum(r.info.ende) ? tageBis(r.info.ende) - tageBis(r.info.start) + 1 : null;
// Sortierschlüssel: Startdatum, sonst Erstellungszeit
const reiseZeit = r => gueltigesDatum(r.info.start) ? alsDatum(r.info.start).getTime() : (r.info.erstellt || 0);
const bewertetAnzahl = r => r.sachen.filter(s => s.bewertung).length;

/* ============================================================
   Normalisierung und Klassifizierung (aus der Einkaufsliste übernommen)
   ============================================================ */

function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[-'’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}
const kompakt = s => norm(s).replace(/ /g, '');

// Füllwörter, Mengen, Farben und Eigenschaften: zählen bei der Zuordnung nicht („schwarzer Rucksack“ → Rucksack)
const STOPWOERTER = new Set(['und', 'oder', 'bzw', 'mit', 'ohne', 'fuer', 'von', 'vom', 'zum', 'zur', 'im', 'in', 'an', 'am', 'auf', 'aus',
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einer', 'eines', 'st', 'stk', 'stueck', 'x', 'paar', 'pack', 'packung',
  'evtl', 'ggf', 'vllt', 'vielleicht', 'optional', 'extra', 'reserve', 'mini', 'gross', 'grosse', 'grosser', 'grosses', 'klein', 'kleine',
  'kleiner', 'kleines', 'kle', 'kurz', 'kurze', 'kurzer', 'kurzes', 'lang', 'lange', 'langer', 'langes', 'neu', 'neue', 'neuer', 'neues',
  'alt', 'alte', 'alter', 'altes', 'warm', 'warme', 'warmer', 'warmes', 'dick', 'dicke', 'dicker', 'duenn', 'duenne', 'duenner', 'leicht',
  'leichte', 'leichter', 'leichtes', 'gut', 'gute', 'guter', 'gutes', 'zweite', 'zweiter', 'zweites', 'ersatz', 'eigene', 'eigener', 'eigenes',
  'rot', 'rote', 'roter', 'rotes', 'roten', 'schwarz', 'schwarze', 'schwarzer', 'schwarzes', 'schwarzen', 'weiss', 'weisse', 'weisser',
  'weisses', 'blau', 'blaue', 'blauer', 'blaues', 'gruen', 'gruene', 'gruener', 'gruenes', 'grau', 'graue', 'grauer', 'graues', 'gelb',
  'gelbe', 'gelber', 'gelbes', 'braun', 'braune', 'brauner', 'braunes', 'orange', 'orangene', 'orangener', 'pink', 'rosa', 'lila', 'bunt',
  'bunte', 'bunter', 'buntes', 'beige', 'dunkel', 'hell', 'dunkle', 'dunkler', 'helle', 'heller', 'ausgedruckt', 'ausgedruckte', 'gedruckt',
  'spielen', 'unterwegs', 'reise', 'jeweils', 'pro', 'person', 'je', 'alle', 'beide', 'l', 'g', 'ml', 'kg', 'cm']);

// Schlüssel (kompakt) → { name: Hauptname, text: Schreibweise, kat, fehler, key }
const INDEX = new Map();
let INDEX_KEYS = [];
function baueIndex() {
  INDEX.clear();
  const ohneStopp = [];
  const setze = (key, eintrag) => { if (key && !INDEX.has(key)) INDEX.set(key, { ...eintrag, key }); };
  for (const kat of KAT_IDS) {
    for (const eintrag of (KATALOG[kat] || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean)) {
      const varianten = eintrag.split('|').map(v => v.trim()).filter(Boolean);
      const hauptname = varianten[0].replace(/^~/, '');
      for (const v of varianten) {
        const text = v.replace(/^~/, '');
        const e = { name: hauptname, text, kat, fehler: v.startsWith('~') };
        setze(kompakt(text), e);
        ohneStopp.push([norm(text).split(' ').filter(w => !STOPWOERTER.has(w)).join(''), e]);
      }
    }
  }
  // Zusätzlich ohne Füllwörter („Gürtel für Wertsachen“ → „guertelwertsachen“), so wie erkenne() den Namen sieht
  for (const [key, e] of ohneStopp) setze(key, e);
  INDEX_KEYS = [...INDEX.keys()];
}
baueIndex();

function staemme(t) {
  const s = new Set([t]);
  for (const end of ['n', 'e', 's']) if (t.endsWith(end)) s.add(t.slice(0, -1));
  for (const end of ['en', 'er', 'es', 'ns']) if (t.endsWith(end)) s.add(t.slice(0, -2));
  for (const end of ['n', 'e', 'en', 's', 'es']) s.add(t + end);
  return [...s].filter(x => x.length >= 2);
}
function exakt(key) {
  for (const k of staemme(key)) { const e = INDEX.get(k); if (e) return e; }
  return null;
}

// Damerau-Levenshtein (optimale Zeichenkettenausrichtung)
function distanz(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let zeilenMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const k = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + k);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
      d[i][j] = v;
      if (v < zeilenMin) zeilenMin = v;
    }
    if (zeilenMin > max) return max + 1;
  }
  return d[a.length][b.length];
}
const fehlerGrenze = len => len <= 4 ? 0 : len <= 6 ? 1 : 2;

function naechsterTreffer(key) {
  const max = fehlerGrenze(key.length);
  if (!max) return null;
  let best = null;
  for (const k of INDEX_KEYS) {
    if (Math.abs(k.length - key.length) > max) continue;
    const dist = distanz(key, k, max);
    if (dist <= max && (!best || dist < best.dist || (dist === best.dist && Math.abs(k.length - key.length) < Math.abs(best.e.key.length - key.length)))) {
      best = { e: INDEX.get(k), dist };
    }
  }
  return best;
}

// Findet den passenden Katalogeintrag zu einem frei eingegebenen Namen.
// Rückgabe: { e: Eintrag, art: 'exakt'|'praefix'|'suffix'|'fuzzy', ganz: deckt den ganzen Namen ab } oder null.
function erkenne(name) {
  const woerter = norm(name).split(' ').filter(w => w && !STOPWOERTER.has(w) && !/^\d/.test(w));
  if (!woerter.length) return null;
  const n = woerter.length;

  // 1. Exakte Treffer, längste zusammenhängende Wortgruppe zuerst; bei gleicher Länge der längere Begriff
  for (let len = n; len >= 1; len--) {
    let best = null;
    for (let i = 0; i + len <= n; i++) {
      const e = exakt(woerter.slice(i, i + len).join(''));
      if (e && (!best || e.key.length >= best.key.length)) best = e;
    }
    if (best) return { e: best, art: 'exakt', ganz: len === n };
  }
  // 2. Zusammengesetztes Wort: längster Katalogbegriff am Wortende („Kompakthandtuch“ → Handtuch)
  for (const t of woerter.slice().reverse()) {
    let best = null;
    for (const s of staemme(t)) {
      for (const k of INDEX_KEYS) {
        if (k.length >= 4 && s.length > k.length + 1 && s.endsWith(k) && (!best || k.length > best.length)) best = k;
      }
    }
    if (best) return { e: INDEX.get(best), art: 'suffix', ganz: n === 1 };
  }
  // 3. Abgekürzt: Wort ist Anfang eines Katalogbegriffs („Ladeg“ → Ladegerät)
  const kandidaten = [woerter.join(''), ...woerter.slice().reverse()];
  for (const t of kandidaten) {
    if (t.length < 4) continue;
    let best = null;
    for (const k of INDEX_KEYS) if (k.length > t.length && k.startsWith(t) && (!best || k.length < best.length)) best = k;
    if (best) return { e: INDEX.get(best), art: 'praefix', ganz: t === kandidaten[0] };
  }
  // 4. Tippfehler
  let best = null;
  for (const t of kandidaten) {
    const f = naechsterTreffer(t);
    if (f && (!best || f.dist < best.dist)) best = { ...f, ganz: t === kandidaten[0] };
  }
  if (best) return { e: best.e, art: 'fuzzy', ganz: best.ganz };
  return null;
}

// Kategorie, die jemand auf einer anderen Reise für diesen Namen von Hand gesetzt hat (jüngste Reise gewinnt)
function gelernteKategorien() {
  if (CACHE.gelernt) return CACHE.gelernt;
  const m = new Map();
  for (const r of [...REISEN.values()].sort((a, b) => reiseZeit(a) - reiseZeit(b))) {
    for (const s of r.sachen) if (s.kategorie && KAT_IDS.includes(s.kategorie)) m.set(kompakt(s.name), s.kategorie);
  }
  return (CACHE.gelernt = m);
}

// Ordnet einen Namen einer Kategorie zu. Reihenfolge: eigene Korrektur, gelernt aus früheren Reisen, Katalog.
// Klammern sind Erklärungen („Kappe (Sonnenschutz)“) und zählen nur, wenn ohne sie nichts gefunden wird.
function klassifiziere(name) {
  const key = kompakt(name);
  if (KAT_IDS.includes(S.korrekturen[key])) return { kat: S.korrekturen[key], quelle: 'korrektur' };
  const gelernt = gelernteKategorien().get(key);
  if (gelernt) return { kat: gelernt, quelle: 'reisen' };
  const cache = CACHE.klass || (CACHE.klass = new Map());
  if (cache.has(key)) return cache.get(key);
  const r = erkenneOhneKlammern(name);
  const erg = r ? { kat: r.e.kat, quelle: r.art } : { kat: 'sonstiges', quelle: 'unbekannt' };
  cache.set(key, erg);
  return erg;
}
function erkenneOhneKlammern(name) {
  const ohne = String(name || '').replace(/\([^)]*\)?/g, ' ');
  return erkenne(ohne) || (ohne !== name ? erkenne(name) : null);
}
// Kategorie nur aus dem Katalog, ohne Korrekturen (für „automatisch“)
const katalogKategorie = name => { const r = erkenneOhneKlammern(name); return r ? r.e.kat : 'sonstiges'; };
const kategorieVon = s => (s.kategorie && KAT_IDS.includes(s.kategorie)) ? s.kategorie : klassifiziere(s.name).kat;
const unbekannt = s => !s.kategorie && klassifiziere(s.name).quelle === 'unbekannt';

// Merkt sich eine Korrektur (gilt für künftige Sachen gleichen Namens, auch auf neuen Reisen)
function lerneKategorie(name, kat) {
  const key = kompakt(name);
  if (!key) return;
  if (kat) S.korrekturen[key] = kat; else delete S.korrekturen[key];
  sichere('korrekturen', S.korrekturen);
  vergiss();
}

/* ============================================================
   Eingabe zerlegen: Menge, mehrere Sachen auf einmal
   ============================================================ */

const MENGE_WORT = String.raw`(?:x|×|st\.?|stk\.?|stück|stueck|mal|paar)`;
const MENGE_KLAMMER = new RegExp(String.raw`\s*\(\s*(\d{1,3})\s*${MENGE_WORT}?\s*\)\s*$`, 'i');
const MENGE_VORNE = new RegExp(String.raw`^(\d{1,3})\s*${MENGE_WORT}?\s+(?=\S)`, 'i');
const MENGE_HINTEN = new RegExp(String.raw`\s+(?:x|×)?\s*(\d{1,3})\s*${MENGE_WORT}\.?\s*$|\s+(?:x|×)\s*(\d{1,3})\s*$`, 'i');

// „3 T-Shirts“, „3x T-Shirts“, „T-Shirts (3)“, „Socken (9 St.)“, „Merino-Shirts (3 x)“, „T-Shirts 3x“ → { name, menge }
function parseMenge(text) {
  let name = String(text || '').trim(), menge = null, m;
  if ((m = name.match(MENGE_KLAMMER))) { menge = +m[1]; name = name.slice(0, m.index).trim(); }
  else if ((m = name.match(MENGE_VORNE))) { menge = +m[1]; name = name.slice(m[0].length).trim(); }
  else if ((m = name.match(MENGE_HINTEN)) && name.slice(0, m.index).trim()) { menge = +(m[1] || m[2]); name = name.slice(0, m.index).trim(); }
  if (menge === 0 || menge === 1) menge = null;
  return { name, menge };
}

// Trennt an Kommas und Semikolons außerhalb von Klammern
function zerlegeEingabe(text) {
  const teile = [];
  let tiefe = 0, aktuell = '';
  for (const z of String(text || '')) {
    if (z === '(') tiefe++;
    if (z === ')') tiefe = Math.max(0, tiefe - 1);
    if ((z === ',' || z === ';' || z === '\n') && !tiefe) { teile.push(aktuell); aktuell = ''; } else aktuell += z;
  }
  teile.push(aktuell);
  return teile.map(t => parseMenge(t)).filter(t => t.name);
}

/* ============================================================
   Text-Import: deine bisherigen Listen („- [x] Name Anm.: …“, Überschriften als Abschnitte)
   ============================================================ */

// Liest aus einer Anmerkung, ob die Sache gebraucht wurde
function bewertungAus(notiz) {
  const n = norm(notiz);
  if (!n) return null;
  const verb = String.raw`(gebraucht|benutzt|genutzt|getragen|verwendet|angezogen|gegessen|gelesen|gespielt|benoetigt|angewendet)`;
  if (new RegExp(String.raw`\b(nie|nicht|niemals|garnicht|keinmal)\b(\s+\w+){0,2}\s+${verb}\b`).test(n) || /\b(unnoetig|ueberfluessig|umsonst mitgenommen)\b/.test(n)) return 'nie';
  if (new RegExp(String.raw`\b(einmal|kaum|selten|wenig|1x|1 mal)\b(\s+\w+){0,2}\s+${verb}\b`).test(n)) return 'kaum';
  if (new RegExp(String.raw`\b${verb}\b`).test(n)) return 'gebraucht';
  return null;
}

const ZEILE_HAKEN = /^\s*(?:[-*+•◦▪‣–]\s*)?\[\s*([xX✓✔]?)\s*\]\s*(.*)$/;
const ZEILE_SYMBOL = /^\s*([☐☑✅✓✔□■])\s*(.*)$/;
const ZEILE_PUNKT = /^\s*(?:[-*+•◦▪‣–]|\d{1,2}[.)])\s+(.+)$/;
const URL_MUSTER = /https?:\/\/\S+/i;

function parseSacheText(roh) {
  let text = String(roh || '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  let notiz = '';
  const anm = text.match(/\s*\bAnm\.?\s*:\s*/i);
  if (anm) { notiz = text.slice(anm.index + anm[0].length).trim(); text = text.slice(0, anm.index).trim(); }
  // „ESIM: https://… (Claro, Movistar)“ → Name „ESIM“, Rest in die Notiz
  const url = text.match(URL_MUSTER);
  if (url) {
    const vorne = text.slice(0, url.index).replace(/[\s:–-]+$/, '').trim();
    const rest = text.slice(url.index).trim();
    text = vorne || rest;
    notiz = vorne ? [rest, notiz].filter(Boolean).join(' · ') : notiz;
  }
  let vielleicht = false;
  if (/\s*\?+\s*$/.test(text)) { vielleicht = true; text = text.replace(/\s*\?+\s*$/, '').trim(); }
  const { name: roh2, menge } = parseMenge(text);
  const name = roh2.replace(/[\s,;:]+$/, '').trim();
  if (!name) return null;
  return { name, menge, notiz, vielleicht, bewertung: bewertungAus(notiz) };
}

function parseUeberschrift(zeile) {
  let t = zeile.replace(/^\s*#+\s*/, '').replace(/[*_]+/g, '').replace(/\s*:\s*$/, '').trim();
  // Person in Klammern am Ende („Mitnehmen (Markus)“); „(offen)“ = noch niemandem zugeteilt (person '')
  let person = null;
  const m = t.match(/^(.*?)\s*\(([^()]{1,30})\)\s*$/);
  if (m && m[1].trim()) {
    const innen = m[2].trim();
    if (/^(offen|noch offen|niemand|unverteilt)$/i.test(innen)) { person = ''; t = m[1].trim(); }
    else if (/^\p{Lu}[\p{L}.'’-]*(\s+\p{Lu}[\p{L}.'’-]*)?$/u.test(innen)) { person = innen; t = m[1].trim(); }
  }
  return { abschnitt: t || null, person };
}

// Rückgabe: { titel, personen: [Namen], abschnitte: [Namen], sachen: [{ name, menge, notiz, vielleicht, bewertung, gepackt, abschnitt, person }] }
function parseListe(text) {
  const zeilen = String(text || '').replace(/\r/g, '').split('\n');
  const erg = { titel: '', personen: [], abschnitte: [], sachen: [] };
  const mitPunkten = zeilen.some(z => ZEILE_HAKEN.test(z) || ZEILE_SYMBOL.test(z) || ZEILE_PUNKT.test(z));
  let abschnitt = null, person = null, erste = true;
  const merke = (liste, wert) => { if (wert && !liste.some(x => norm(x) === norm(wert))) liste.push(wert); };
  for (const z of zeilen) {
    if (!z.trim()) continue;
    const istErste = erste; erste = false;
    if (istErste && /^\s*#*\s*packliste\b/i.test(z)) {
      erg.titel = z.replace(/^\s*#*\s*packliste\s*[:\-–]?\s*/i, '').replace(/\s*:\s*$/, '').trim();
      continue;
    }
    let m, gepackt = false, inhalt = null;
    if ((m = z.match(ZEILE_HAKEN))) { gepackt = !!m[1]; inhalt = m[2]; }
    else if ((m = z.match(ZEILE_SYMBOL))) { gepackt = /[☑✅✓✔■]/.test(m[1]); inhalt = m[2]; }
    else if ((m = z.match(ZEILE_PUNKT))) inhalt = m[1];
    else if (!mitPunkten) inhalt = z;
    if (inhalt === null) {
      const u = parseUeberschrift(z);
      abschnitt = u.abschnitt; person = u.person;
      continue;
    }
    const s = parseSacheText(inhalt);
    if (!s) continue;
    merke(erg.abschnitte, abschnitt);
    merke(erg.personen, person);
    erg.sachen.push({ ...s, gepackt, abschnitt, person });
  }
  return erg;
}

// Legt aus einer geparsten Liste Personen, Abschnitte und Sachen in einer Reise an.
// archiv = true: Häkchen und Bewertungen bleiben (alte Reise); sonst ist alles ungepackt (Vorlage).
// Sachen ohne Person gehören standardPerson (oder bleiben unverteilt, wenn null).
function uebernimmGeparst(r, liste, { archiv = false, standardPerson = null } = {}) {
  const pIds = new Map(), aIds = new Map();
  for (const n of liste.personen) pIds.set(norm(n), (personNachName(r, n) || personHinzu(r, n)).id);
  for (const n of liste.abschnitte) aIds.set(norm(n), abschnittHinzu(r, n).id);
  for (const s of liste.sachen) {
    sacheHinzu(r, {
      name: s.name, menge: s.menge || null, notiz: s.notiz || '', vielleicht: !!s.vielleicht,
      person: s.person ? pIds.get(norm(s.person)) : s.person === '' ? null : standardPerson,
      abschnitt: s.abschnitt ? aIds.get(norm(s.abschnitt)) : null,
      gepackt: archiv ? !!s.gepackt : false,
      bewertung: archiv ? s.bewertung || null : null,
    });
  }
}

/* ============================================================
   Text-Export im selben Format (für Notizen, Nachrichten)
   ============================================================ */

function sacheAlsText(s) {
  let anm = s.notiz || '';
  if (s.bewertung && s.bewertung !== 'gebraucht' && bewertungAus(anm) !== s.bewertung) anm = [BEWERTUNGEN[s.bewertung], anm].filter(Boolean).join(' · ');
  return `- [${s.gepackt ? 'x' : ' '}] ${s.name}${s.menge ? ` (${s.menge}x)` : ''}${s.vielleicht ? ' ?' : ''}${anm ? ` Anm.: ${anm}` : ''}`;
}

// Gruppen einer Personenliste: nach Abschnitten (falls vorhanden) oder Kategorien
function gruppiere(r, sachen, art) {
  if (art === 'abschnitte' && r.abschnitte.length) {
    const gruppen = abschnitteSortiert(r).map(a => ({ id: a.id, name: a.name, sachen: sachen.filter(s => s.abschnitt === a.id) }));
    gruppen.push({ id: '', name: 'Ohne Abschnitt', sachen: sachen.filter(s => !abschnittVon(r, s.abschnitt)) });
    return gruppen.filter(g => g.sachen.length);
  }
  return S.einstellungen.kategorien.map(k => ({ id: k, name: KAT[k].name, kat: k, sachen: sachen.filter(s => kategorieVon(s) === k) }))
    .filter(g => g.sachen.length);
}
const nachName = (a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });

function alsText(r) {
  const art = r.abschnitte.length ? 'abschnitte' : 'kategorien';
  const mehrere = r.personen.length > 1;
  const bloecke = [];
  const listen = personenSortiert(r).map(p => [p.name, r.sachen.filter(s => s.person === p.id)]);
  listen.push(['offen', r.sachen.filter(s => !personVon(r, s.person))]);
  for (const [pname, sachen] of listen) {
    if (!sachen.length) continue;
    for (const g of gruppiere(r, sachen, art)) {
      const l = art === 'abschnitte' ? g.sachen.slice().sort((a, b) => a.pos - b.pos) : g.sachen.slice().sort(nachName);
      bloecke.push(`${g.name}${mehrere || pname === 'offen' ? ` (${pname})` : ''}\n${l.map(sacheAlsText).join('\n')}`);
    }
  }
  return `Packliste ${r.info.name}\n\n${bloecke.join('\n\n')}\n`;
}

/* ============================================================
   Bibliothek: alles, was je auf einer Reise stand (für Vorschläge)
   ============================================================ */

function bibliothek() {
  if (CACHE.bib) return CACHE.bib;
  const m = new Map();
  for (const r of [...REISEN.values()].sort((a, b) => reiseZeit(b) - reiseZeit(a))) {   // neueste zuerst
    for (const s of r.sachen) {
      const key = kompakt(s.name);
      if (!key) continue;
      const e = m.get(key);
      if (e) { e.anzahl++; continue; }
      m.set(key, { key, name: s.name, menge: s.menge || null, notiz: s.notiz || '', kategorie: s.kategorie || null, anzahl: 1 });
    }
  }
  return (CACHE.bib = m);
}

// Vorschläge beim Tippen: zuerst aus früheren Reisen, dann aus dem Katalog. schonDa: Set kompakter Namen.
function vorschlaege(text, schonDa = new Set(), max = 6) {
  const q = norm(text), qk = kompakt(text);
  if (!qk) return [];
  const erg = [], gesehen = new Set(schonDa);
  const passt = name => {
    const n = norm(name);
    if (kompakt(name).startsWith(qk)) return 3;
    if (n.split(' ').some(w => w.startsWith(q))) return 2;
    return 0;
  };
  const kandidaten = [];
  for (const e of bibliothek().values()) {
    const p = passt(e.name);
    if (p && !gesehen.has(e.key)) kandidaten.push({ name: e.name, menge: e.menge, notiz: e.notiz, punkte: p * 100 + Math.min(e.anzahl, 50), quelle: 'reisen', anzahl: e.anzahl });
  }
  kandidaten.sort((a, b) => b.punkte - a.punkte || nachName(a, b));
  for (const k of kandidaten) { gesehen.add(kompakt(k.name)); erg.push(k); if (erg.length >= max) return erg; }
  const katalog = [];
  const namen = new Set();
  for (const e of INDEX.values()) {
    if (e.fehler) continue;
    const pText = passt(e.text), pName = passt(e.name);
    if (!pText && !pName) continue;
    const name = pName >= pText ? e.name : e.text;   // die Schreibweise zeigen, die zum Getippten passt
    if (namen.has(kompakt(name))) continue;
    namen.add(kompakt(name));
    if (!gesehen.has(kompakt(name))) katalog.push({ name, punkte: Math.max(pText, pName), quelle: 'katalog' });
  }
  katalog.sort((a, b) => b.punkte - a.punkte || a.name.length - b.name.length || nachName(a, b));
  for (const k of katalog) { if (gesehen.has(kompakt(k.name))) continue; gesehen.add(kompakt(k.name)); erg.push(k); if (erg.length >= max) break; }
  return erg;
}

/* ============================================================
   Neue Reise aus früheren Reisen: Kandidaten mit Erfahrungen von damals
   ============================================================ */

// reisen: die gewählten früheren Reisen. Doppelte (gleicher Name und gleiche Person) werden zusammengefasst;
// die neueste Reise gibt Menge, Notiz, Abschnitt und Kategorie vor. verlauf: neueste zuerst.
function kandidatenAus(reisen) {
  const sortiert = reisen.slice().sort((a, b) => reiseZeit(b) - reiseZeit(a));
  const m = new Map();
  for (const r of sortiert) {
    for (const s of r.sachen.slice().sort((a, b) => a.pos - b.pos)) {
      const pname = (personVon(r, s.person) || {}).name || '';
      const key = kompakt(s.name) + '|' + norm(pname);
      if (!kompakt(s.name)) continue;
      let k = m.get(key);
      if (!k) {
        k = { key, name: s.name, menge: s.menge || null, notiz: s.notiz || '', kategorie: s.kategorie || null, vielleicht: !!s.vielleicht,
          abschnitt: (abschnittVon(r, s.abschnitt) || {}).name || '', person: pname, verlauf: [] };
        m.set(key, k);
      }
      if (!k.verlauf.some(v => v.reiseId === r.id)) k.verlauf.push({ reiseId: r.id, reise: r.info.name, bewertung: s.bewertung || null });
    }
  }
  const liste = [...m.values()];
  for (const k of liste) k.nie = !!(k.verlauf[0] && k.verlauf[0].bewertung === 'nie');
  return liste;
}
const verlaufText = k => k.verlauf.filter(v => v.bewertung).map(v => `${v.reise}: ${BEWERTUNGEN[v.bewertung]}`).join(' · ');

// Übernimmt die gewählten Kandidaten in die (neue) Reise r. Personen über den Namen, sonst die Standardperson.
// Fehlt die Person auf der neuen Reise, bekommt die Sache die Standardperson; was diese schon hat, kommt nicht doppelt.
function uebernimmKandidaten(r, kandidaten, { standardPerson = null, mitAbschnitten = true } = {}) {
  const da = new Set(r.sachen.map(s => kompakt(s.name) + '|' + (s.person || '')));
  // Zuerst die Sachen, deren Person es auch auf der neuen Reise gibt (meine Socken vor Ls Socken)
  const passend = k => !!(k.person && personNachName(r, k.person));
  for (const k of [...kandidaten.filter(passend), ...kandidaten.filter(k => !passend(k))]) {
    const p = k.person ? personNachName(r, k.person) : null;
    const person = p ? p.id : (r.personen.length === 1 ? r.personen[0].id : standardPerson);
    const key = kompakt(k.name) + '|' + (person || '');
    if (da.has(key)) continue;
    da.add(key);
    const a = mitAbschnitten && k.abschnitt ? abschnittHinzu(r, k.abschnitt) : null;
    sacheHinzu(r, { name: k.name, menge: k.menge, notiz: k.notiz, vielleicht: k.vielleicht, kategorie: k.kategorie || undefined,
      person, abschnitt: a ? a.id : null });
  }
}

// Personen früherer Reisen (für „Mitreisende“ beim Anlegen), ohne dich selbst
function bekanntePersonen() {
  const m = new Map();
  for (const r of [...REISEN.values()].sort((a, b) => reiseZeit(b) - reiseZeit(a))) {
    for (const p of r.personen) {
      if (norm(p.name) === norm(S.ich.name) || m.has(norm(p.name))) continue;
      m.set(norm(p.name), p.name);
    }
  }
  return [...m.values()];
}

/* ============================================================
   Sicherung (JSON)
   ============================================================ */

function sicherungsDaten() {
  return {
    app: 'packliste', version: 1, exportiert: new Date().toISOString(), ich: { name: S.ich.name },
    einstellungen: S.einstellungen, korrekturen: S.korrekturen,
    reisen: S.reisen.map(e => { const r = REISEN.get(e.id); return r && { id: e.id, schluessel: e.schluessel || null, ich: e.ich || null,
      info: r.info, personen: r.personen, abschnitte: r.abschnitte, sachen: r.sachen }; }).filter(Boolean),
  };
}

// Spielt eine Sicherung ein: Reisen werden hinzugefügt oder ersetzt (gleiche id). Rückgabe: Anzahl Reisen.
function sicherungEinspielen(d) {
  if (!d || d.app !== 'packliste' || !Array.isArray(d.reisen)) throw new Error('Format');
  if (d.ich && d.ich.name && !S.ich.name) { S.ich.name = d.ich.name; sichereIch(); }
  if (d.korrekturen && typeof d.korrekturen === 'object') { S.korrekturen = { ...d.korrekturen, ...S.korrekturen }; sichere('korrekturen', S.korrekturen); }
  let n = 0;
  for (const x of d.reisen) {
    if (!x || !x.id || !x.info) continue;
    const r = pruefeReise({ id: x.id, info: x.info, personen: x.personen, abschnitte: x.abschnitte, sachen: x.sachen });
    REISEN.set(r.id, r);
    const e = reiseEintrag(r.id);
    if (e) { e.schluessel = e.schluessel || x.schluessel || null; e.ich = e.ich || x.ich || null; }
    else S.reisen.push({ id: r.id, schluessel: x.schluessel || null, ich: x.ich || null });
    sichereReise(r, { ohneSync: true });
    n++;
  }
  sichereIndex();
  vergiss();
  return n;
}
