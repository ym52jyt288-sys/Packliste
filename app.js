// Packliste: Oberfläche. Bildschirme „Reisen“ (Start) und „Reise“, Blätter (Bottom Sheets), Wischen, Toasts.
'use strict';

/* ============================================================
   Icons (Linien, 24 × 24)
   ============================================================ */

const svg = (inhalt, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inhalt}</svg>`;
const ICON = {
  zurueck: svg('<path d="M15 5l-7 7 7 7"/>'),
  zahnrad: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  mehr: svg('<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>'),
  einladen: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M19 8v6M16 11h6"/>'),
  gemeinsam: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M15.5 4.7a3.5 3.5 0 0 1 0 6.6M17.5 14.2A6.5 6.5 0 0 1 21.5 20"/>'),
  haken: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  hakenLinie: '<svg class="haken" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  uebergeben: svg('<path d="M4 12h13M13 7l5 5-5 5"/>'),
  papierkorb: svg('<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  klapp: svg('<path d="M6 9l6 6 6-6"/>', 'ico klapp'),
  pfeil: '<svg class="pfeil" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  hoch: svg('<path d="M6 15l6-6 6 6"/>'),
  runter: svg('<path d="M6 9l6 6 6-6"/>'),
  kreuz: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  auge: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  augeZu: svg('<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
  koffer: svg('<path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"/><rect x="3.5" y="6" width="17" height="14" rx="2.5"/><path d="M8 6v14M16 6v14"/>'),
  abschnitt: svg('<path d="M4 6h16M4 12h10M4 18h13"/>'),
  text: svg('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>'),
  verlauf: svg('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/>'),
  teilen: svg('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2"/>'),
  bearbeiten: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  auswerten: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 9.8"/>'),
  fahne: svg('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  zuruecksetzen: svg('<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/>'),
  link: svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
  homescreen: svg('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 8v6M9 11h6"/>'),
  person: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
};
const katIcon = (kat, cls = 'ico kat-ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${(KAT[kat] || KAT.sonstiges).icon}</svg>`;
const avatarHTML = (p, cls = '') => p
  ? `<span class="avatar ${cls}" style="--pf:${esc(p.farbe)}" aria-hidden="true">${esc(initialen(p.name))}</span>`
  : `<span class="avatar leer ${cls}" aria-hidden="true">?</span>`;
const mehrzahl = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;

// Notizen: Links anklickbar
function linkify(text) {
  return esc(text).replace(/https?:\/\/[^\s<]+[^\s<.,;:)!?]/g, url => {
    let kurz = url.replace(/^https?:\/\/(www\.)?/, '');
    if (kurz.length > 34) kurz = kurz.slice(0, 32) + '…';
    return `<a href="${url}" target="_blank" rel="noopener">${kurz}</a>`;
  });
}

function ringHTML(f) {
  const u = 2 * Math.PI * 12, anteil = f.gesamt ? f.gepackt / f.gesamt : 0;
  return `<svg class="ring" viewBox="0 0 30 30" aria-label="${f.gepackt} von ${f.gesamt} gepackt"><circle class="spur" cx="15" cy="15" r="12"/>`
    + (anteil ? `<circle class="wert" cx="15" cy="15" r="12" stroke-dasharray="${(u * anteil).toFixed(1)} ${u.toFixed(1)}"${anteil === 1 ? ' style="stroke:var(--ok)"' : ''}/>` : '') + '</svg>';
}

function qrSvg(text, rand = 2) {
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte'); qr.make();
  const n = qr.getModuleCount();
  let pfad = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) pfad += `M${x + rand} ${y + rand}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="qr" viewBox="0 0 ${n + 2 * rand} ${n + 2 * rand}" role="img" aria-label="QR-Code"><rect width="100%" height="100%" fill="#fff"/><path d="${pfad}" fill="#000"/></svg>`;
}

/* ============================================================
   Zustand der Oberfläche
   ============================================================ */

const UI = { seite: 'start', reiseId: null, person: null, auswerten: false, zu: new Set(), abschnitt: {}, geoeffnet: null, renderZeit: null };
const aktuelleReise = () => UI.seite === 'reise' ? REISEN.get(UI.reiseId) || null : null;
const istHomescreen = () => navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const istIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const ansichtArt = r => r.abschnitte.length && S.einstellungen.ansicht === 'abschnitte' ? 'abschnitte' : 'kategorien';
// Wer eine neu eingetippte Sache bekommt: die gewählte Person; unter „Alle“ bleibt sie unverteilt
const zielPerson = r => UI.person && UI.person !== 'alle' && personVon(r, UI.person) ? UI.person
  : r.personen.length === 1 ? r.personen[0].id : null;

function wendeDarstellungAn() {
  const e = S.einstellungen, root = document.documentElement;
  if (e.thema === 'light' || e.thema === 'dark') root.dataset.theme = e.thema; else delete root.dataset.theme;
  const dunkel = e.thema === 'dark' || (e.thema !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  const start = UI.seite !== 'reise';
  $('#themeFarbe').content = dunkel ? (start ? '#0c0d0f' : '#111214') : (start ? '#f2f3f5' : '#ffffff');
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (S.einstellungen) wendeDarstellungAn(); });

const versteckeToast = () => { clearTimeout(toastTimer); $('#toast').classList.remove('zeigen'); };

function oeffneReise(id, { person = null, verlauf = true } = {}) {
  if (!REISEN.has(id)) return;
  versteckeToast();
  UI.seite = 'reise'; UI.reiseId = id; UI.person = person; UI.auswerten = false; UI.geoeffnet = null;
  S.einstellungen.zuletzt = id; sichereEinstellungen();
  if (verlauf && !(history.state && history.state.reise === id)) history.pushState({ reise: id }, '');
  render();
  scrollTo(0, 0);
  if (syncAn(id)) planeSync(id, 50);
}
function zurStart({ verlauf = true } = {}) {
  if (verlauf && history.state && history.state.reise) { history.back(); return; }   // popstate rendert
  versteckeToast();
  UI.seite = 'start'; UI.reiseId = null; UI.auswerten = false; UI.geoeffnet = null;
  S.einstellungen.zuletzt = null; sichereEinstellungen();
  render();
  scrollTo(0, 0);
}
addEventListener('popstate', () => {
  const id = history.state && history.state.reise;
  if (id && REISEN.has(id)) { if (UI.reiseId !== id || UI.seite !== 'reise') oeffneReise(id, { verlauf: false }); }
  else if (UI.seite !== 'start') zurStart({ verlauf: false });
});

/* ============================================================
   Darstellung
   ============================================================ */

function render() {
  const r = aktuelleReise();
  if (UI.seite === 'reise' && !r) UI.seite = 'start';
  document.body.className = UI.seite === 'reise' ? 'seite-reise' + (UI.auswerten ? ' auswerten' : '') : 'seite-start';
  wendeDarstellungAn();
  if (UI.seite === 'reise') renderReise(r); else renderStart();
}

/* ---------- Start: Reisen ---------- */

const nachStart = (a, b) => {
  const sa = gueltigesDatum(a.info.start), sb = gueltigesDatum(b.info.start);
  if (sa && sb) return a.info.start.localeCompare(b.info.start);
  if (sa) return -1;
  if (sb) return 1;
  return (b.info.erstellt || 0) - (a.info.erstellt || 0);
};

function renderStart() {
  const kopf = $('#kopf');
  kopf.dataset.kopf = '';
  kopf.innerHTML = `<div class="kopfzeile"><h1 class="grosstitel">Reisen</h1>
    <button type="button" class="icon-btn" data-akt="einstellungen" aria-label="Einstellungen">${ICON.zahnrad}</button></div>`;
  const alle = [...REISEN.values()];
  const aktiv = alle.filter(r => ['geplant', 'unterwegs'].includes(reiseStatus(r))).sort(nachStart);
  // Vergangen: noch auszuwertende zuerst, sonst neueste zuerst
  const vergangen = alle.filter(r => ['vorbei', 'abgeschlossen'].includes(reiseStatus(r)))
    .sort((a, b) => (reiseStatus(b) === 'vorbei') - (reiseStatus(a) === 'vorbei') || reiseZeit(b) - reiseZeit(a));
  let html = installHinweisHTML();
  if (!alle.length) {
    html += `<div class="leer">${ICON.koffer}<strong>Noch keine Reise</strong>
      Lege deine erste Packliste an. Alte Listen aus Notizen kannst du einfügen – samt Anmerkungen wie „nie gebraucht“.
      <div class="knopfreihe"><button type="button" class="knopf zweit" data-akt="importieren">${ICON.text}Frühere Liste einfügen</button>
      <button type="button" class="knopf zweit" data-akt="einladungOeffnen">${ICON.link}Einladung öffnen</button></div></div>`;
  } else {
    if (aktiv.length) html += `<h2 class="start-abschnitt">${reiseStatus(aktiv[0]) === 'unterwegs' ? 'Unterwegs' : 'Als Nächstes'}</h2>${reiseKarteHTML(aktiv[0])}`;
    if (aktiv.length > 1) html += `<h2 class="start-abschnitt">Geplant</h2><div class="gruppe-karte">${aktiv.slice(1).map(reiseZeileHTML).join('')}</div>`;
    if (vergangen.length) html += `<h2 class="start-abschnitt">Vergangen</h2><div class="gruppe-karte">${vergangen.map(reiseZeileHTML).join('')}</div>`;
    html += `<div class="start-links"><button type="button" data-akt="importieren">Frühere Liste einfügen</button>
      <button type="button" data-akt="einladungOeffnen">Einladung öffnen</button></div>`;
  }
  $('#main').innerHTML = html;
  $('#unten').hidden = false;
  $('#unten').innerHTML = `<button type="button" class="knopf" data-akt="neueReise">${ICON.plus}Neue Reise</button>`;
}

function installHinweisHTML() {
  if (!istIOS() || istHomescreen() || lade('hinweisWeg', false)) return '';
  return `<div class="hinweis-karte">${ICON.homescreen}<p><strong>Als App nutzen:</strong> In Safari auf „Teilen“ tippen, dann „Zum Home-Bildschirm“.
    So startet die Packliste im Vollbild und funktioniert auch offline.</p>
    <button type="button" data-akt="hinweisWeg" aria-label="Hinweis schließen">${ICON.kreuz}</button></div>`;
}

function reiseKarteHTML(r) {
  const ich = ichIn(r);
  const dauer = reiseDauer(r);
  const datum = [datumBereich(r.info.start, r.info.ende), dauer && dauer > 1 ? `${dauer} Tage` : '', syncAn(r.id) ? 'gemeinsam' : ''].filter(Boolean).join(' · ');
  const personen = personenSortiert(r).map(p => {
    const f = fortschritt(r, p.id), anteil = f.gesamt ? Math.round(100 * f.gepackt / f.gesamt) : 0;
    return `<div class="pb">${avatarHTML(p, 'klein')}<span class="pb-name">${esc(p.name)}</span>
      <span class="pb-spur"><i style="width:${anteil}%;--pf:${esc(p.farbe)}"></i></span><span class="pb-zahl">${f.gepackt}/${f.gesamt}</span></div>`;
  }).join('');
  const offen = r.sachen.filter(s => !personVon(r, s.person)).length;
  const neu = ich ? neuUebergeben(r, ich.id).length : 0;
  return `<button type="button" class="reise-karte" data-reise="${r.id}">
    <div class="rk-kopf"><span class="rk-name">${esc(r.info.name)}</span><span class="rk-tage">${esc(countdownText(r))}</span></div>
    ${datum ? `<div class="rk-datum">${esc(datum)}</div>` : ''}
    ${r.sachen.length ? `<div class="rk-personen">${personen}</div>` : '<div class="rk-datum">Noch leer – tippen, um die Liste zu füllen</div>'}
    ${offen ? `<div class="rk-datum" style="margin-top:10px">${mehrzahl(offen, 'Sache', 'Sachen')} noch nicht verteilt</div>` : ''}
    ${neu ? `<div class="rk-hinweis">${mehrzahl(neu, 'Sache', 'Sachen')} neu für dich</div>` : ''}
  </button>`;
}

function reiseZeileHTML(r) {
  const st = reiseStatus(r), f = fortschritt(r);
  const datum = datumBereich(r.info.start, r.info.ende);
  const klein = [st === 'geplant' ? countdownText(r) : '', datum, mehrzahl(r.sachen.length, 'Sache', 'Sachen'), syncAn(r.id) ? 'gemeinsam' : ''].filter(Boolean).join(' · ');
  const rechts = st === 'vorbei' ? '<span class="pille">Auswerten</span>' : st === 'abgeschlossen' ? '' : ringHTML(f);
  return `<button type="button" class="reise-zeile" data-reise="${r.id}"><span class="rz-text"><span class="rz-name">${esc(r.info.name)}</span>
    <small>${esc(klein)}</small></span>${rechts}${ICON.pfeil}</button>`;
}

/* ---------- Reise ---------- */

function baueKopf(r) {
  const kopf = $('#kopf');
  if (kopf.dataset.kopf === r.id) return;
  kopf.dataset.kopf = r.id;
  kopf.innerHTML = `<div class="kopfzeile">
      <button type="button" class="icon-btn zurueck-btn" data-akt="start" aria-label="Zurück zu den Reisen">${ICON.zurueck}</button>
      <div class="titel" id="kTitel"></div>
      <button type="button" class="icon-btn" data-akt="einladen" id="kEinladen" aria-label="Mitreisende einladen"></button>
      <button type="button" class="icon-btn" data-akt="menue" aria-label="Mehr">${ICON.mehr}</button>
    </div>
    <div id="kPersonen"></div>
    <form class="eingabe" id="formEingabe" autocomplete="off">
      ${svg('<path d="M12 5v14M5 12h14"/>', 'ico plus')}
      <input id="eingabe" type="text" enterkeyhint="done" autocapitalize="sentences" autocorrect="off" spellcheck="false"
        placeholder="Sache hinzufügen" aria-label="Sache hinzufügen">
      <label class="abschnitt-wahl" id="kAbschnitt" hidden></label>
    </form>
    <ul class="vorschlaege" id="vorschlaege" hidden></ul>
    <div class="fortschritt" id="kFortschritt"><i></i></div>`;
}

function waehlePerson(r) {
  const personen = personenSortiert(r);
  if (personen.length <= 1) { UI.person = personen.length ? personen[0].id : 'alle'; return; }
  if (UI.person === 'alle' || personVon(r, UI.person)) return;
  const ich = ichIn(r);
  UI.person = ich ? ich.id : personen[0].id;
}

function aktualisiereKopf(r) {
  if (!r || $('#kopf').dataset.kopf !== r.id) return;
  const sub = [datumBereich(r.info.start, r.info.ende), countdownText(r)].filter(Boolean).join(' · ') || mehrzahl(r.sachen.length, 'Sache', 'Sachen');
  $('#kTitel').innerHTML = `<h1>${esc(r.info.name)}</h1><small>${esc(sub)}</small>`;
  const sy = SYNCS.get(r.id);
  $('#kEinladen').innerHTML = sy ? ICON.gemeinsam + (sy.online && !sy.fehler ? '<span class="punkt-an"></span>' : '') : ICON.einladen;
  const personen = personenSortiert(r);
  $('#kPersonen').innerHTML = personen.length > 1 ? `<div class="segment personen" role="tablist">${personen.map(p => {
    const f = fortschritt(r, p.id);
    return `<button type="button" role="tab" data-akt="person" data-person="${p.id}" class="${UI.person === p.id ? 'an' : ''}" aria-selected="${UI.person === p.id}">
      ${avatarHTML(p, 'klein')}${personen.length <= 3 ? `<span class="seg-name">${esc(p.name)}</span>` : ''}<span class="zahl">${f.gepackt}/${f.gesamt}</span></button>`;
  }).join('')}<button type="button" role="tab" data-akt="person" data-person="alle" class="${UI.person === 'alle' ? 'an' : ''}" aria-selected="${UI.person === 'alle'}">Alle</button></div>` : '';
  $('#formEingabe').hidden = UI.auswerten;
  if (UI.auswerten) $('#vorschlaege').hidden = true;
  const wahl = $('#kAbschnitt');
  if (ansichtArt(r) === 'abschnitte' && !UI.auswerten) {
    if (!abschnittVon(r, UI.abschnitt[r.id]) && UI.abschnitt[r.id] !== '') UI.abschnitt[r.id] = abschnitteSortiert(r)[0].id;
    const a = abschnittVon(r, UI.abschnitt[r.id]);
    wahl.hidden = false;
    wahl.innerHTML = `<span>${esc(a ? a.name : 'Ohne Abschnitt')}</span>${svg('<path d="M6 9l6 6 6-6"/>')}
      <select id="abschnittSelect" aria-label="Abschnitt für neue Sachen">${abschnitteSortiert(r).map(x => `<option value="${x.id}"${a && x.id === a.id ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}
      <option value=""${a ? '' : ' selected'}>Ohne Abschnitt</option></select>`;
  } else { wahl.hidden = true; wahl.innerHTML = ''; }
  const f = fortschritt(r, UI.person === 'alle' ? undefined : UI.person);
  const balken = $('#kFortschritt');
  balken.classList.toggle('fertig', f.gesamt > 0 && f.gepackt === f.gesamt);
  $('i', balken).style.width = (f.gesamt ? 100 * f.gepackt / f.gesamt : 0) + '%';
}

function sachenFuer(r) {
  return UI.person === 'alle' ? r.sachen.slice() : r.sachen.filter(s => s.person === UI.person);
}

function renderReise(r) {
  baueKopf(r);
  waehlePerson(r);
  aktualisiereKopf(r);
  const art = ansichtArt(r);
  const alle = sachenFuer(r);
  const ausblenden = S.einstellungen.gepacktAusblenden && !UI.auswerten;
  const mitPerson = UI.person === 'alle' && r.personen.length > 1;
  const st = reiseStatus(r);
  let html = '';

  if (r.sachen.length) {
    html += `<div class="werkzeuge">${r.abschnitte.length ? `<div class="segment klein" role="tablist">
        <button type="button" role="tab" data-akt="ansicht" data-wert="abschnitte" class="${art === 'abschnitte' ? 'an' : ''}">Abschnitte</button>
        <button type="button" role="tab" data-akt="ansicht" data-wert="kategorien" class="${art === 'kategorien' ? 'an' : ''}">Kategorien</button></div>`
      : '<span class="text-muted">Nach Kategorien sortiert</span>'}
      ${UI.auswerten ? '' : `<button type="button" class="knopf-klein rechts${ausblenden ? ' an' : ''}" data-akt="ausblenden" aria-pressed="${ausblenden}"
        aria-label="${ausblenden ? 'Gepacktes wieder zeigen' : 'Gepacktes ausblenden'}">${ausblenden ? ICON.augeZu : ICON.auge}Gepacktes</button>`}</div>`;
  }

  // Hinweise oben
  if (UI.auswerten) {
    const gepackt = r.sachen.filter(s => s.gepackt);
    html += `<div class="auswertung-kopf"><strong>Auswerten · ${gepackt.filter(s => s.bewertung).length} von ${gepackt.length} bewertet</strong>
      <p>Was wurde gebraucht? Beim nächsten Packen siehst du das und kannst Ungenutztes gleich weglassen.</p></div>`;
  } else {
    if (UI.person !== 'alle') {
      const neu = neuUebergeben(r, UI.person);
      if (neu.length) {
        const geber = [...new Set(neu.map(s => s.uebergabe.von))].map(id => personVon(r, id)).filter(Boolean);
        const von = geber.length === 1 && geber[0].id !== UI.person ? geber[0] : null;
        html += `<div class="banner">${von ? avatarHTML(von) : ICON.uebergeben}<div class="b-text"><strong>${mehrzahl(neu.length, 'Sache', 'Sachen')} neu${von ? ` von ${esc(von.name)}` : ''}</strong>
          <small>${esc(neu.slice(0, 4).map(s => s.name).join(', '))}${neu.length > 4 ? ' …' : ''}</small></div>
          <button type="button" data-akt="gesehen">Alles klar</button></div>`;
      }
      const offen = r.personen.length > 1 ? r.sachen.filter(s => !personVon(r, s.person)).length : 0;
      if (offen) html += `<div class="banner neutral"><div class="b-text">${mehrzahl(offen, 'Sache ist', 'Sachen sind')} noch niemandem zugeteilt</div>
        <button type="button" data-akt="person" data-person="alle">Ansehen</button></div>`;
    }
    if (st === 'vorbei' && r.sachen.some(s => s.gepackt)) html += `<div class="banner neutral"><div class="b-text"><strong>Die Reise ist vorbei.</strong><small>Kurz auswerten, was gebraucht wurde?</small></div>
      <button type="button" data-akt="auswerten">Auswerten</button></div>`;
  }

  if (!alle.length) {
    const p = UI.person !== 'alle' ? personVon(r, UI.person) : null;
    const andere = [...REISEN.values()].some(x => x.id !== r.id && x.sachen.length);
    html += !r.sachen.length
      ? `<div class="leer">${ICON.koffer}<strong>Noch nichts auf der Liste</strong>Tippe oben ein, was mit soll – auch mehreres mit Komma. Die Kategorie ordnet die App selbst zu.
        <div class="knopfreihe">${andere ? `<button type="button" class="knopf zweit" data-akt="ergaenzen">${ICON.verlauf}Aus früheren Reisen übernehmen</button>` : ''}
        <button type="button" class="knopf zweit" data-akt="textEinfuegen">${ICON.text}Text einfügen</button></div></div>`
      : `<div class="leer">${p ? `Für ${esc(p.name)} steht noch nichts auf der Liste.` : 'Hier ist nichts.'}</div>`;
  } else {
    let ausgeblendet = 0;
    for (const g of gruppiere(r, alle, art)) {
      let l = art === 'abschnitte' ? g.sachen.slice().sort((a, b) => a.pos - b.pos) : g.sachen.slice().sort(nachName);
      if (UI.auswerten) l = [...l.filter(s => s.gepackt), ...l.filter(s => !s.gepackt)];   // Bewertbares zuerst
      else if (S.einstellungen.gepacktUnten) l = [...l.filter(s => !s.gepackt), ...l.filter(s => s.gepackt)];
      const gepackt = l.filter(s => s.gepackt && (!s.vielleicht || s.gepackt)).length;
      const gesamt = l.filter(s => !s.vielleicht || s.gepackt).length;
      if (ausblenden) { ausgeblendet += l.filter(s => s.gepackt).length; l = l.filter(s => !s.gepackt); }
      if (!l.length) continue;
      const key = `${r.id}|${art}|${g.id}`;
      const icon = art === 'kategorien' ? katIcon(g.kat, 'ico') : ICON.abschnitt;
      html += `<section class="gruppe${UI.zu.has(key) ? ' zu' : ''}" data-gruppe="${esc(key)}"><div class="gruppe-zeile">
        <button type="button" class="gruppe-kopf" data-akt="gruppe" aria-expanded="${!UI.zu.has(key)}">${icon}<span class="g-name">${esc(g.name)}</span>
        <span class="zahl${gesamt && gepackt === gesamt ? ' fertig' : ''}">${gepackt}/${gesamt}</span>${ICON.klapp}</button>
        ${art === 'abschnitte' && g.id && !UI.auswerten ? `<button type="button" class="gruppe-plus" data-akt="inAbschnitt" data-abschnitt="${g.id}" aria-label="In „${esc(g.name)}“ hinzufügen">${ICON.plus}</button>` : ''}
        </div><ul class="sachen">${l.map(s => zeileHTML(r, s, { art, mitPerson })).join('')}</ul></section>`;
    }
    if (ausgeblendet) html += `<div class="banner neutral" style="margin-top:18px"><div class="b-text">${mehrzahl(ausgeblendet, 'gepackte Sache', 'gepackte Sachen')} ausgeblendet</div>
      <button type="button" data-akt="ausblenden">Zeigen</button></div>`;
    else if (!html.includes('<section')) html += '<div class="leer">Alles gepackt.</div>';
  }
  $('#main').innerHTML = html;

  const unten = $('#unten');
  if (UI.auswerten) {
    unten.hidden = false;
    unten.innerHTML = st === 'vorbei'
      ? `<button type="button" class="knopf zweit" data-akt="auswertenFertig">Später</button><button type="button" class="knopf" data-akt="abschliessen">${ICON.fahne}Reise abschließen</button>`
      : `<button type="button" class="knopf" data-akt="auswertenFertig">Fertig</button>`;
  } else { unten.hidden = true; unten.innerHTML = ''; }
}

function zeileHTML(r, s, { art, mitPerson }) {
  const p = personVon(r, s.person);
  const neu = s.uebergabe && !s.uebergabe.gesehen && s.uebergabe.an === s.person ? personVon(r, s.uebergabe.von) : null;
  const sub = [];
  if (s.notiz) sub.push(linkify(s.notiz));
  const rechts = UI.auswerten
    ? (s.gepackt ? `<div class="bewerten" role="group" aria-label="Gebraucht?">${[['gebraucht', 'Ja'], ['kaum', 'Kaum'], ['nie', 'Nie']]
      .map(([w, t]) => `<button type="button" data-akt="bewerten" data-wert="${w}" class="${s.bewertung === w ? 'an' : ''}" aria-pressed="${s.bewertung === w}">${t}</button>`).join('')}</div>`
      : '<span class="nicht-dabei">nicht dabei</span>')
    : (unbekannt(s) ? '<button type="button" class="zuordnen" data-akt="zuordnen">Zuordnen</button>' : '')
      + (mitPerson ? (p ? avatarHTML(p) : (ichIn(r) ? '<button type="button" class="nehme" data-akt="nehmen">Nehme ich</button>' : avatarHTML(null))) : '');
  return `<li class="zeile" data-id="${s.id}">
    ${UI.auswerten ? '' : `<div class="aktionen" aria-hidden="true"><button type="button" data-akt="uebergeben" tabindex="-1">${ICON.uebergeben}Übergeben</button>
      <button type="button" class="loeschen" data-akt="loeschen" tabindex="-1">${ICON.papierkorb}Löschen</button></div>`}
    <div class="item${s.gepackt ? ' gepackt' : ''}${s.vielleicht ? ' vielleicht' : ''}">
      ${UI.auswerten ? '' : `<button type="button" class="check" data-akt="packen" aria-pressed="${s.gepackt}" aria-label="${esc(s.name)} ${s.gepackt ? 'gepackt' : 'packen'}"><span>${ICON.haken}</span></button>`}
      <div class="txt" data-akt="details"><span class="name">${esc(s.name)}</span>${s.menge ? `<span class="menge">×${s.menge}</span>` : ''}${s.vielleicht ? '<span class="marke">vielleicht</span>' : ''}${neu ? `<span class="marke neu">von ${esc(neu.name)}</span>` : ''}${sub.length ? `<span class="sub">${sub.join(' · ')}</span>` : ''}</div>
      ${rechts}
    </div></li>`;
}

function blitze(id) {
  requestAnimationFrame(() => {
    const el = $(`.zeile[data-id="${id}"] .item`);
    if (!el) return;
    el.classList.remove('aufblitzen'); void el.offsetWidth; el.classList.add('aufblitzen');
    const rect = el.getBoundingClientRect(), kopf = $('#kopf').getBoundingClientRect().bottom;
    if (rect.top < kopf || rect.bottom > innerHeight - 20) scrollBy({ top: rect.top - kopf - (innerHeight - kopf) / 3, behavior: 'smooth' });
  });
}

/* ============================================================
   Toast und Blätter
   ============================================================ */

let toastTimer;
function zeigeToast(text, aktion, beiAktion) {
  const t = $('#toast');
  $('#toastText').textContent = text;
  const b = $('#toastAktion');
  b.hidden = !aktion;
  b.textContent = aktion || '';
  b.onclick = () => { t.classList.remove('zeigen'); if (beiAktion) beiAktion(); };
  t.classList.add('zeigen');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('zeigen'), aktion ? 5000 : 2600);
}

function oeffneBlatt(html, { voll = false } = {}) {
  const hint = document.createElement('div');
  hint.className = 'hinterlegt';
  hint.innerHTML = `<div class="blatt${voll ? ' voll' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(hint);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => hint.classList.add('offen'));
  hint.addEventListener('click', e => { if (e.target === hint) schliesseBlatt(hint); });
  hint.addEventListener('click', e => { if (e.target.closest('[data-schliessen]')) schliesseBlatt(hint); });
  return hint;
}
function schliesseBlatt(hint) {
  if (!hint || !hint.isConnected || hint._zu) return;
  hint._zu = true;
  if (document.activeElement && hint.contains(document.activeElement)) document.activeElement.blur();
  hint.classList.remove('offen');
  setTimeout(() => {
    hint.remove();
    if (!$('.hinterlegt')) document.body.style.overflow = '';
    if (hint._beimSchliessen) hint._beimSchliessen();
  }, 200);
}
const blattKopf = (titel, { links = 'Abbrechen', rechts = '', rechtsId = '', rechtsAus = false } = {}) =>
  `<div class="blatt-kopf"><button type="button" class="zurueck" data-schliessen>${links}</button><h3>${esc(titel)}</h3>
   ${rechts ? `<button type="button" class="zurueck rechts" id="${rechtsId}"${rechtsAus ? ' disabled' : ''}>${rechts}</button>` : '<span style="min-width:64px"></span>'}</div>`;

// Kleines Blatt mit einem Textfeld. Rückgabe: Promise mit dem Text oder null
function frageText(titel, { text = '', wert = '', platzhalter = '', knopf = 'Fertig', vorschlaege = [] } = {}) {
  return new Promise(fertig => {
    let ergebnis = null;
    const b = oeffneBlatt(`${blattKopf(titel, { rechts: knopf, rechtsId: 'fOk', rechtsAus: !wert })}
      ${text ? `<p class="unter-titel">${esc(text)}</p>` : ''}
      <label class="feld"><input type="text" id="fText" value="${esc(wert)}" placeholder="${esc(platzhalter)}" autocapitalize="sentences" enterkeyhint="done"></label>
      ${vorschlaege.length ? `<div class="chips">${vorschlaege.map(v => `<button type="button" class="chip" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>` : ''}`);
    const feld = $('#fText', b), ok = $('#fOk', b);
    const fertigMit = v => { ergebnis = v; schliesseBlatt(b); };
    feld.addEventListener('input', () => { ok.disabled = !feld.value.trim(); });
    feld.addEventListener('keydown', e => { if (e.key === 'Enter' && feld.value.trim()) fertigMit(feld.value.trim()); });
    ok.addEventListener('click', () => fertigMit(feld.value.trim()));
    b.addEventListener('click', e => { const c = e.target.closest('[data-v]'); if (c) fertigMit(c.dataset.v); });
    b._beimSchliessen = () => fertig(ergebnis);
    setTimeout(() => feld.focus(), 250);
  });
}

async function teile(text, titel) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  // Safari verlangt fürs Teilen ein frisches Antippen; dann über ein Blatt mit eigenem Knopf
  const b = oeffneBlatt(`${blattKopf(titel, { links: 'Fertig' })}
    <label class="feld"><textarea class="gross" readonly>${esc(text)}</textarea></label>
    <div class="knopfreihe">${navigator.share ? `<button type="button" class="knopf" id="tTeilen">${ICON.teilen}Teilen</button>` : ''}
      <button type="button" class="knopf zweit" id="tKopieren">Kopieren</button></div>`);
  b.addEventListener('click', async e => {
    if (e.target.closest('#tTeilen')) { try { await navigator.share({ text }); schliesseBlatt(b); } catch (x) {} }
    if (e.target.closest('#tKopieren')) {
      try { await navigator.clipboard.writeText(text); } catch (x) { $('textarea', b).select(); document.execCommand('copy'); }
      schliesseBlatt(b); zeigeToast('Kopiert');
    }
  });
}

/* ============================================================
   Eingabe und Vorschläge
   ============================================================ */

function zeigeVorschlaege(text) {
  const ul = $('#vorschlaege'), r = aktuelleReise();
  if (!ul) return;
  if (!r || !text.trim() || /[,;]/.test(text)) { ul.hidden = true; ul.innerHTML = ''; ul._liste = []; return; }
  const person = zielPerson(r);
  const schonDa = new Set(r.sachen.filter(s => s.person === person).map(s => kompakt(s.name)));
  const p = parseMenge(text);
  const l = vorschlaege(p.name, schonDa, 5);
  ul._liste = l.map(v => ({ ...v, menge: p.menge || v.menge || null }));
  ul.innerHTML = l.map((v, i) => {
    const kat = klassifiziere(v.name).kat;
    const hinweis = v.quelle === 'reisen' ? (v.anzahl > 1 ? `aus ${v.anzahl} Reisen` : 'frühere Reise') : KAT[kat].name;
    return `<li><button type="button" data-vorschlag="${i}">${katIcon(kat)}<span class="v-name">${esc(v.name)}${v.menge ? ` <span class="text-muted">×${v.menge}</span>` : ''}</span>
      <span class="hinweis">${esc(hinweis)}</span></button></li>`;
  }).join('');
  ul.hidden = !l.length;
}

function eintragen(text, vorschlag = null) {
  const r = aktuelleReise();
  if (!r) return;
  const teile = vorschlag ? [{ name: vorschlag.name, menge: vorschlag.menge || null, notiz: vorschlag.notiz || '' }] : zerlegeEingabe(text);
  if (!teile.length) return;
  const person = zielPerson(r);
  const abschnitt = ansichtArt(r) === 'abschnitte' && abschnittVon(r, UI.abschnitt[r.id]) ? UI.abschnitt[r.id] : null;
  const neu = [], vorhanden = [];
  for (const t of teile) {
    const name = /^[a-zäöü][a-zäöüß]/.test(t.name) ? gross(t.name) : t.name;
    const da = r.sachen.find(s => kompakt(s.name) === kompakt(name) && s.person === person);
    if (da) { if (t.menge) da.menge = t.menge; vorhanden.push(da); continue; }
    neu.push(sacheHinzu(r, { name, menge: t.menge || null, notiz: t.notiz || '', person, abschnitt }));
  }
  // Gruppe der neuen Sache aufklappen
  for (const s of neu) UI.zu.delete(`${r.id}|${ansichtArt(r)}|${ansichtArt(r) === 'abschnitte' ? s.abschnitt || '' : kategorieVon(s)}`);
  sichereReise(r);
  render();
  for (const s of [...neu, ...vorhanden]) blitze(s.id);
  if (neu.length === 1 && !vorhanden.length) {
    const s = neu[0], k = klassifiziere(s.name);
    zeigeToast(`${s.name} → ${KAT[k.kat].name}`, 'Ändern', () => oeffneKategorieWahl(r, s));
  } else if (neu.length > 1) zeigeToast(`${neu.length} Sachen hinzugefügt`);
  else if (vorhanden.length) zeigeToast(vorhanden.length === 1 ? `${vorhanden[0].name} steht schon auf der Liste` : `${vorhanden.length} Sachen standen schon auf der Liste`);
}

document.addEventListener('submit', e => {
  if (e.target.id !== 'formEingabe') return;
  e.preventDefault();
  const feld = $('#eingabe');
  const text = feld.value;
  feld.value = '';
  zeigeVorschlaege('');
  eintragen(text);
});
document.addEventListener('input', e => { if (e.target.id === 'eingabe') zeigeVorschlaege(e.target.value); });
document.addEventListener('change', e => {
  if (e.target.id !== 'abschnittSelect') return;
  UI.abschnitt[UI.reiseId] = e.target.value;
  aktualisiereKopf(aktuelleReise());
});
// Vorschlag antippen, ohne dass die Tastatur zugeht
document.addEventListener('pointerdown', e => { if (e.target.closest('[data-vorschlag]')) e.preventDefault(); });

/* ============================================================
   Aktionen (ein Klick-Handler für die Seite; Blätter haben eigene)
   ============================================================ */

document.addEventListener('click', e => {
  if (e.target.closest('.hinterlegt') || e.target.closest('.toast')) return;
  if (e.target.closest('a')) return;
  const zeile = e.target.closest('.zeile');
  if (UI.geoeffnet && !e.target.closest('.aktionen')) { schliesseWisch(); if (zeile) return; }
  if (zeile && zeile._gewischt) return;
  const el = e.target.closest('[data-akt], [data-reise], [data-vorschlag]');
  if (!el) return;
  if (el.dataset.reise) return oeffneReise(el.dataset.reise);
  const r = aktuelleReise();
  if (el.dataset.vorschlag != null) {
    const v = ($('#vorschlaege')._liste || [])[+el.dataset.vorschlag];
    $('#eingabe').value = '';
    zeigeVorschlaege('');
    if (v) eintragen('', v);
    return;
  }
  const s = r && zeile ? sacheVon(r, zeile.dataset.id) : null;
  switch (el.dataset.akt) {
    case 'start': return zurStart();
    case 'einstellungen': return oeffneEinstellungen();
    case 'neueReise': return oeffneNeueReise();
    case 'importieren': return oeffneArchivImport();
    case 'einladungOeffnen': return oeffneEinladungEinfuegen();
    case 'hinweisWeg': sichere('hinweisWeg', true); return render();
    case 'einladen': return oeffneEinladen(r);
    case 'menue': return oeffneMenue(r);
    case 'person': UI.person = el.dataset.person; UI.geoeffnet = null; render(); return scrollTo(0, 0);
    case 'ansicht': S.einstellungen.ansicht = el.dataset.wert; sichereEinstellungen(); return render();
    case 'ausblenden': S.einstellungen.gepacktAusblenden = !S.einstellungen.gepacktAusblenden; sichereEinstellungen(); return render();
    case 'gruppe': {
      const sec = el.closest('.gruppe'), key = sec.dataset.gruppe;
      if (UI.zu.has(key)) UI.zu.delete(key); else UI.zu.add(key);
      sec.classList.toggle('zu', UI.zu.has(key));
      el.setAttribute('aria-expanded', !UI.zu.has(key));
      return;
    }
    case 'inAbschnitt':
      UI.abschnitt[r.id] = el.dataset.abschnitt;
      aktualisiereKopf(r);
      scrollTo({ top: 0, behavior: 'smooth' });
      return $('#eingabe').focus();
    case 'packen': return s && packen(r, s, el);
    case 'details': return s && oeffneSache(r, s);
    case 'zuordnen': return s && oeffneKategorieWahl(r, s);
    case 'nehmen': {
      const ich = ichIn(r);
      if (!s || !ich) return;
      s.person = ich.id; delete s.uebergabe;
      sichereReise(r); render();
      return zeigeToast(`${s.name} nimmst du mit`);
    }
    case 'uebergeben': schliesseWisch(); return s && oeffneUebergeben(r, s);
    case 'loeschen': schliesseWisch(); return s && loescheSache(r, s);
    case 'bewerten': {
      if (!s) return;
      s.bewertung = s.bewertung === el.dataset.wert ? null : el.dataset.wert;
      sichereReise(r);
      $$('button', el.parentNode).forEach(b => { b.classList.toggle('an', b.dataset.wert === s.bewertung); b.setAttribute('aria-pressed', b.dataset.wert === s.bewertung); });
      const k = $('.auswertung-kopf strong');
      if (k) { const g = r.sachen.filter(x => x.gepackt); k.textContent = `Auswerten · ${g.filter(x => x.bewertung).length} von ${g.length} bewertet`; }
      return;
    }
    case 'gesehen': alsGesehen(r, UI.person); sichereReise(r); return render();
    case 'auswerten': UI.auswerten = true; render(); return scrollTo(0, 0);
    case 'auswertenFertig': UI.auswerten = false; render(); return scrollTo(0, 0);
    case 'abschliessen':
      r.info.abgeschlossen = true; UI.auswerten = false; sichereReise(r);
      zeigeToast(`${r.info.name} abgeschlossen`);
      return zurStart();
    case 'ergaenzen': return oeffneUebernehmenWahl(r);
    case 'textEinfuegen': return oeffneTextEinfuegen(r);
  }
});

function packen(r, s, el) {
  s.gepackt = !s.gepackt;
  if (s.uebergabe && !s.uebergabe.gesehen && s.uebergabe.an === s.person) s.uebergabe = { ...s.uebergabe, gesehen: true };
  el.closest('.item').classList.toggle('gepackt', s.gepackt);
  el.setAttribute('aria-pressed', s.gepackt);
  sichereReise(r);
  aktualisiereKopf(r);
  clearTimeout(UI.renderZeit);
  UI.renderZeit = setTimeout(() => { if (aktuelleReise() === r) render(); }, 450);
  if (s.gepackt && UI.person !== 'alle') {
    const f = fortschritt(r, UI.person);
    if (f.gesamt > 1 && f.gepackt === f.gesamt) zeigeToast('Alles gepackt – gute Reise!');
  }
}

function loescheSache(r, s) {
  const i = r.sachen.indexOf(s);
  if (i < 0) return;
  r.sachen.splice(i, 1);
  sichereReise(r);
  render();
  zeigeToast(`${s.name} gelöscht`, 'Rückgängig', () => { r.sachen.splice(Math.min(i, r.sachen.length), 0, s); sichereReise(r); render(); });
}

/* Nach links wischen: Aktionen „Übergeben“ und „Löschen“ aufdecken */
const WISCH_BREITE = 160;
function schliesseWisch() {
  if (!UI.geoeffnet) return;
  const z = $(`.zeile[data-id="${UI.geoeffnet}"]`);
  if (z) $('.item', z).style.transform = '';
  UI.geoeffnet = null;
}
(function wischen() {
  let st = null;
  const main = $('#main');
  main.addEventListener('touchstart', e => {
    const item = e.target.closest('.item');
    if (!item || e.touches.length > 1 || UI.auswerten || !item.closest('.zeile')) { st = null; return; }
    const zeile = item.closest('.zeile');
    const offen = UI.geoeffnet === zeile.dataset.id;
    st = { x: e.touches[0].clientX, y: e.touches[0].clientY, item, zeile, basis: offen ? -WISCH_BREITE : 0, pos: 0, aktiv: false };
  }, { passive: true });
  main.addEventListener('touchmove', e => {
    if (!st) return;
    const dx = e.touches[0].clientX - st.x, dy = e.touches[0].clientY - st.y;
    if (!st.aktiv) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { st = null; return; }
      if (Math.abs(dx) < 10) return;
      st.aktiv = true;
      if (UI.geoeffnet && UI.geoeffnet !== st.zeile.dataset.id) schliesseWisch();
      st.item.classList.add('zieht');
    }
    st.pos = Math.max(-WISCH_BREITE - 40, Math.min(0, st.basis + dx));
    st.item.style.transform = `translateX(${st.pos}px)`;
  }, { passive: true });
  const ende = () => {
    if (!st) return;
    const { item, zeile, pos, aktiv } = st;
    st = null;
    if (!aktiv) return;
    item.classList.remove('zieht');
    zeile._gewischt = true;
    setTimeout(() => { zeile._gewischt = false; }, 350);
    if (pos < -WISCH_BREITE / 2) { item.style.transform = `translateX(${-WISCH_BREITE}px)`; UI.geoeffnet = zeile.dataset.id; }
    else { item.style.transform = ''; if (UI.geoeffnet === zeile.dataset.id) UI.geoeffnet = null; }
  };
  main.addEventListener('touchend', ende);
  main.addEventListener('touchcancel', ende);
})();

/* ============================================================
   Sache: Detailblatt, Kategorie, Übergeben
   ============================================================ */

function oeffneSache(r, s) {
  const personen = personenSortiert(r);
  const mitBewertung = s.gepackt && (UI.auswerten || ['unterwegs', 'vorbei', 'abgeschlossen'].includes(reiseStatus(r)) || s.bewertung);
  const katZeile = () => {
    const kat = kategorieVon(s);
    return `${katIcon(kat)}<span class="zw-text">${esc(KAT[kat].name)}<small>${s.kategorie ? 'von Hand gewählt' : unbekannt(s) ? 'nicht erkannt – tippen zum Zuordnen' : 'automatisch erkannt'}</small></span>${ICON.pfeil}`;
  };
  const abschnittOptionen = () => `<option value="">Ohne Abschnitt</option>${abschnitteSortiert(r).map(a => `<option value="${a.id}"${a.id === s.abschnitt ? ' selected' : ''}>${esc(a.name)}</option>`).join('')}<option value="+neu">Neuer Abschnitt …</option>`;
  const b = oeffneBlatt(`<div class="blatt-kopf"><span style="min-width:64px"></span><h3>Sache</h3><button type="button" class="zurueck rechts" data-schliessen>Fertig</button></div>
    <label class="feld"><span>Name</span><input type="text" id="sName" value="${esc(s.name)}" autocapitalize="sentences" enterkeyhint="done"></label>
    <div class="zwei">
      <div class="feld"><span>Anzahl</span><div class="stepper"><button type="button" id="sMinus" aria-label="Weniger">−</button><output id="sMenge">${s.menge || 1}</output><button type="button" id="sPlus" aria-label="Mehr">+</button></div></div>
      <label class="feld"><span>Wer nimmt es mit?</span><select id="sPerson">${personen.map(p => `<option value="${p.id}"${p.id === s.person ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}
        <option value=""${personVon(r, s.person) ? '' : ' selected'}>Noch niemand</option></select></label>
    </div>
    <div class="feld"><span>Kategorie</span><button type="button" class="zeile-wahl" id="sKat">${katZeile()}</button></div>
    <label class="feld"><span>Abschnitt</span><select id="sAbschnitt">${abschnittOptionen()}</select></label>
    <label class="feld"><span>Notiz</span><textarea id="sNotiz" rows="2" placeholder="z. B. 1,5 L pro Person reicht">${esc(s.notiz || '')}</textarea></label>
    <label class="schalter"><span>Vielleicht<small>Noch unsicher, ob es mit soll</small></span><input type="checkbox" id="sVielleicht"${s.vielleicht ? ' checked' : ''}></label>
    ${mitBewertung ? `<div class="feld"><span>Gebraucht?</span><div class="segment" id="sBewertung">${[['gebraucht', 'Gebraucht'], ['kaum', 'Kaum'], ['nie', 'Nie']]
      .map(([w, t]) => `<button type="button" data-wert="${w}" class="${s.bewertung === w ? 'an' : ''}">${t}</button>`).join('')}</div></div>` : ''}
    <div class="knopfreihe">
      ${personen.length > 1 ? `<button type="button" class="knopf zweit" id="sUebergeben">${ICON.uebergeben}Übergeben an …</button>` : ''}
      <button type="button" class="knopf gefahr" id="sLoeschen">${ICON.papierkorb}Löschen</button>
    </div>`);
  const speichern = () => sichereReise(r);
  $('#sName', b).addEventListener('change', e => { const v = e.target.value.trim(); if (v) { s.name = v; speichern(); $('#sKat', b).innerHTML = katZeile(); } else e.target.value = s.name; });
  $('#sName', b).addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  const menge = d => { const n = Math.max(1, Math.min(999, (s.menge || 1) + d)); s.menge = n > 1 ? n : null; $('#sMenge', b).textContent = n; speichern(); };
  $('#sMinus', b).addEventListener('click', () => menge(-1));
  $('#sPlus', b).addEventListener('click', () => menge(1));
  $('#sPerson', b).addEventListener('change', e => {
    const an = e.target.value || null;
    if (an === s.person) return;
    const von = s.person || (ichIn(r) || {}).id || null;
    uebergeben(r, s, an, von);
    speichern();
  });
  $('#sKat', b).addEventListener('click', () => oeffneKategorieWahl(r, s, () => { $('#sKat', b).innerHTML = katZeile(); }));
  $('#sAbschnitt', b).addEventListener('change', async e => {
    if (e.target.value === '+neu') {
      const name = await frageText('Neuer Abschnitt', { platzhalter: 'z. B. Wanderung', vorschlaege: ABSCHNITT_VORSCHLAEGE.filter(v => !r.abschnitte.some(a => norm(a.name) === norm(v))).slice(0, 6) });
      if (name) { s.abschnitt = abschnittHinzu(r, name).id; speichern(); }
      e.target.innerHTML = abschnittOptionen();
      return;
    }
    s.abschnitt = e.target.value || null;
    speichern();
  });
  $('#sNotiz', b).addEventListener('input', e => { s.notiz = e.target.value; });
  $('#sNotiz', b).addEventListener('change', speichern);
  $('#sVielleicht', b).addEventListener('change', e => { s.vielleicht = e.target.checked; speichern(); });
  const bew = $('#sBewertung', b);
  if (bew) bew.addEventListener('click', e => {
    const k = e.target.closest('[data-wert]');
    if (!k) return;
    s.bewertung = s.bewertung === k.dataset.wert ? null : k.dataset.wert;
    $$('button', bew).forEach(x => x.classList.toggle('an', x.dataset.wert === s.bewertung));
    speichern();
  });
  const ueb = $('#sUebergeben', b);
  if (ueb) ueb.addEventListener('click', () => { schliesseBlatt(b); setTimeout(() => oeffneUebergeben(r, s), 220); });
  $('#sLoeschen', b).addEventListener('click', () => { b._beimSchliessen = null; schliesseBlatt(b); loescheSache(r, s); });
  b._beimSchliessen = () => { s.notiz = (s.notiz || '').trim(); speichern(); render(); };
}

function oeffneKategorieWahl(r, s, nachher) {
  const aktuell = kategorieVon(s);
  const b = oeffneBlatt(`${blattKopf('Kategorie')}
    <p class="unter-titel">Für „${esc(s.name)}“. Die Wahl wird gemerkt und gilt auch auf künftigen Reisen.</p>
    ${S.einstellungen.kategorien.map(k => `<button type="button" class="zeile-wahl${k === aktuell ? ' an' : ''}" data-kat="${k}">${katIcon(k)}<span class="zw-text">${esc(KAT[k].name)}</span>${k === aktuell ? ICON.hakenLinie : ''}</button>`).join('')}`);
  b.addEventListener('click', e => {
    const k = e.target.closest('[data-kat]');
    if (!k) return;
    const kat = k.dataset.kat;
    const auto = katalogKategorie(s.name);
    if (kat === auto) { delete s.kategorie; lerneKategorie(s.name, null); } else { s.kategorie = kat; lerneKategorie(s.name, kat); }
    sichereReise(r);
    schliesseBlatt(b);
    render();
    if (nachher) nachher();
    zeigeToast(`Gemerkt: ${s.name} → ${KAT[kat].name}`);
  });
}

function oeffneUebergeben(r, s) {
  const andere = personenSortiert(r).filter(p => p.id !== s.person);
  const b = oeffneBlatt(`${blattKopf('Übergeben')}
    <p class="unter-titel">Wer soll „${esc(s.name)}“ mitnehmen?</p>
    ${andere.map(p => `<button type="button" class="zeile-wahl" data-an="${p.id}">${avatarHTML(p, 'gross')}<span class="zw-text">${esc(p.name)}<small>${mehrzahl(fortschritt(r, p.id).gesamt, 'Sache', 'Sachen')} auf der Liste</small></span>${ICON.pfeil}</button>`).join('')}
    ${personVon(r, s.person) && r.personen.length > 1 ? `<button type="button" class="zeile-wahl" data-an="">${avatarHTML(null, 'gross')}<span class="zw-text">Noch niemand<small>Zu den unverteilten Sachen</small></span>${ICON.pfeil}</button>` : ''}
    <button type="button" class="zeile-wahl" data-an="+neu"><span class="avatar gross leer">+</span><span class="zw-text">Neue Person …<small>Jemand, der noch nicht auf der Reise steht</small></span>${ICON.pfeil}</button>`);
  b.addEventListener('click', async e => {
    const k = e.target.closest('[data-an]');
    if (!k) return;
    let an = k.dataset.an || null;
    if (an === '+neu') {
      schliesseBlatt(b);
      const name = await frageText('Neue Person', { platzhalter: 'Name' });
      if (!name) return;
      an = (personNachName(r, name) || personHinzu(r, name)).id;
    } else schliesseBlatt(b);
    const von = s.person || (ichIn(r) || {}).id || null;
    const zurueck = uebergeben(r, s, an, von);
    sichereReise(r);
    render();
    const ziel = personVon(r, an);
    zeigeToast(ziel ? `${s.name} an ${ziel.name} übergeben` : `${s.name} ist wieder unverteilt`, 'Rückgängig', () => { zurueck(); sichereReise(r); render(); });
  });
}

/* ============================================================
   Menü, Reise bearbeiten
   ============================================================ */

function oeffneMenue(r) {
  const st = reiseStatus(r);
  const andere = [...REISEN.values()].some(x => x.id !== r.id && x.sachen.length);
  const eintrag = (akt, icon, titel, klein = '', extra = '') => `<button type="button" class="zeile-wahl" data-m="${akt}"${extra}>${icon}<span class="zw-text">${titel}${klein ? `<small>${klein}</small>` : ''}</span></button>`;
  const b = oeffneBlatt(`${blattKopf(r.info.name, { links: 'Schließen' })}
    ${eintrag('einladen', ICON.einladen, syncAn(r.id) ? 'Gemeinsam packen' : 'Mitreisende einladen', syncAn(r.id) ? esc(syncStatusText(r.id)) : 'Jede Person packt auf ihrem eigenen iPhone')}
    ${eintrag('bearbeiten', ICON.bearbeiten, 'Reise bearbeiten', 'Name, Datum, Personen, Abschnitte')}
    ${andere ? eintrag('ergaenzen', ICON.verlauf, 'Aus früheren Reisen übernehmen', 'Samt Erfahrungen von damals') : ''}
    ${eintrag('text', ICON.text, 'Text einfügen', 'Liste aus Notizen oder einer Nachricht')}
    ${eintrag('auswerten', ICON.auswerten, 'Auswerten', 'Was wurde gebraucht, was nicht?')}
    ${eintrag('teilen', ICON.teilen, 'Als Text teilen', 'Im Format „- [x] Sache Anm.: …“')}
    ${r.sachen.some(s => s.gepackt) ? eintrag('haken', ICON.zuruecksetzen, 'Alle Haken entfernen', 'Zum erneuten Packen') : ''}
    ${eintrag('abschliessen', ICON.fahne, st === 'abgeschlossen' ? 'Wieder öffnen' : 'Reise abschließen', st === 'abgeschlossen' ? 'Zurück zu den geplanten Reisen' : 'Kommt zu den vergangenen Reisen')}
    ${eintrag('loeschen', ICON.papierkorb, '<span style="color:var(--danger)">Reise löschen</span>')}`);
  b.addEventListener('click', e => {
    const k = e.target.closest('[data-m]');
    if (!k) return;
    schliesseBlatt(b);
    const weiter = f => setTimeout(f, 220);
    switch (k.dataset.m) {
      case 'einladen': return weiter(() => oeffneEinladen(r));
      case 'bearbeiten': return weiter(() => oeffneReiseBearbeiten(r));
      case 'ergaenzen': return weiter(() => oeffneUebernehmenWahl(r));
      case 'text': return weiter(() => oeffneTextEinfuegen(r));
      case 'auswerten': UI.auswerten = true; render(); return scrollTo(0, 0);
      case 'teilen': return teile(alsText(r), 'Als Text teilen');
      case 'haken': {
        const vorher = r.sachen.filter(s => s.gepackt);
        vorher.forEach(s => { s.gepackt = false; });
        sichereReise(r); render();
        return zeigeToast(`${mehrzahl(vorher.length, 'Haken', 'Haken')} entfernt`, 'Rückgängig', () => { vorher.forEach(s => { s.gepackt = true; }); sichereReise(r); render(); });
      }
      case 'abschliessen':
        r.info.abgeschlossen = st !== 'abgeschlossen';
        sichereReise(r);
        if (r.info.abgeschlossen) { zeigeToast(`${r.info.name} abgeschlossen`); return zurStart(); }
        return render();
      case 'loeschen': return weiter(() => loescheReiseFragen(r));
    }
  });
}

function loescheReiseFragen(r) {
  const gemeinsam = syncAn(r.id);
  const b = oeffneBlatt(`${blattKopf('Reise löschen')}
    <p>„${esc(r.info.name)}“ mit ${mehrzahl(r.sachen.length, 'Sache', 'Sachen')} löschen?${gemeinsam ? ' Die Reise ist mit anderen geteilt.' : ''}</p>
    <div class="knopfreihe">
      <button type="button" class="knopf gefahr" id="lHier">${gemeinsam ? 'Nur auf diesem Gerät löschen' : 'Löschen'}</button>
      ${gemeinsam ? '<button type="button" class="knopf gefahr" id="lAlle">Für alle löschen</button>' : ''}
      <button type="button" class="knopf zweit" data-schliessen>Abbrechen</button>
    </div>
    ${gemeinsam ? '<p class="text-muted">„Für alle löschen“ entfernt die Reise vom Server. Die anderen behalten ihre Kopie, aber ohne Abgleich.</p>' : ''}`);
  b.addEventListener('click', async e => {
    const hier = e.target.closest('#lHier'), alle = e.target.closest('#lAlle');
    if (!hier && !alle) return;
    if (alle) await loescheRaum(r.id);
    if (SYNCS.has(r.id)) { clearTimeout(SYNCS.get(r.id).zeitgeber); SYNCS.delete(r.id); }
    loescheReiseLokal(r.id);
    schliesseBlatt(b);
    zurStart();
    zeigeToast(`${r.info.name} gelöscht`);
  });
}

function oeffneReiseBearbeiten(r) {
  const b = oeffneBlatt('', { voll: true });
  const blatt = $('.blatt', b);
  const zeige = () => {
    const ich = ichIn(r);
    blatt.innerHTML = `<div class="blatt-kopf"><span style="min-width:64px"></span><h3>Reise bearbeiten</h3><button type="button" class="zurueck rechts" data-schliessen>Fertig</button></div>
      <label class="feld"><span>Name</span><input type="text" id="rName" value="${esc(r.info.name)}" autocapitalize="sentences"></label>
      <div class="zwei"><label class="feld"><span>Von</span><input type="date" id="rStart" value="${esc(r.info.start || '')}"></label>
        <label class="feld"><span>Bis</span><input type="date" id="rEnde" value="${esc(r.info.ende || '')}"></label></div>
      <div class="abschnitt">Personen</div>
      <ul class="einst-liste">${personenSortiert(r).map(p => `<li data-p="${p.id}">${avatarHTML(p)}<input type="text" value="${esc(p.name)}" data-name-p="${p.id}" aria-label="Name">
        ${ich && ich.id === p.id ? '<span class="klein">ich</span>' : ''}${p.verbunden ? '<span class="klein">verbunden</span>' : ''}
        <button type="button" class="mini" data-weg-p="${p.id}" aria-label="${esc(p.name)} entfernen"${r.personen.length < 2 ? ' disabled' : ''}>${ICON.kreuz}</button></li>`).join('')}
        <li><button type="button" class="fuellen" id="rPerson" style="color:var(--accent)">${ICON.plus}Person hinzufügen</button></li></ul>
      ${r.personen.length > 1 ? `<label class="feld"><span>Wer bist du auf diesem Gerät?</span><select id="rIch">${personenSortiert(r).map(p => `<option value="${p.id}"${ich && ich.id === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label>` : ''}
      <div class="abschnitt">Abschnitte</div>
      <p class="text-muted" style="margin:0 0 6px">Deine eigene Gliederung, z. B. „Wanderung“ oder „Gleich anziehen“. Die Kategorien ordnet die App selbst zu.</p>
      <ul class="einst-liste">${abschnitteSortiert(r).map((a, i, l) => `<li>${ICON.abschnitt}<input type="text" value="${esc(a.name)}" data-name-a="${a.id}" aria-label="Name des Abschnitts">
        <button type="button" class="mini" data-hoch="${a.id}" aria-label="Nach oben"${i ? '' : ' disabled'}>${ICON.hoch}</button>
        <button type="button" class="mini" data-runter="${a.id}" aria-label="Nach unten"${i < l.length - 1 ? '' : ' disabled'}>${ICON.runter}</button>
        <button type="button" class="mini" data-weg-a="${a.id}" aria-label="${esc(a.name)} entfernen">${ICON.kreuz}</button></li>`).join('')}
        <li><button type="button" class="fuellen" id="rAbschnitt" style="color:var(--accent)">${ICON.plus}Abschnitt hinzufügen</button></li></ul>
      <label class="feld"><span>Notiz zur Reise</span><textarea id="rNotiz" rows="3" placeholder="z. B. Unterkünfte, Wetter">${esc(r.info.notiz || '')}</textarea></label>`;
  };
  zeige();
  const speichern = () => sichereReise(r);
  blatt.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'rName') { if (t.value.trim()) r.info.name = t.value.trim(); else t.value = r.info.name; }
    else if (t.id === 'rStart') { r.info.start = t.value; if (t.value && (!r.info.ende || r.info.ende < t.value)) { r.info.ende = t.value; $('#rEnde', blatt).value = t.value; } }
    else if (t.id === 'rEnde') r.info.ende = t.value;
    else if (t.id === 'rNotiz') r.info.notiz = t.value.trim();
    else if (t.id === 'rIch') { const e2 = reiseEintrag(r.id); e2.ich = t.value; sichereIndex(); const p = personVon(r, t.value); if (p && syncAn(r.id)) p.verbunden = true; UI.person = t.value; }
    else if (t.dataset.nameP) { const p = personVon(r, t.dataset.nameP); if (t.value.trim()) p.name = t.value.trim(); else t.value = p.name; }
    else if (t.dataset.nameA) { const a = abschnittVon(r, t.dataset.nameA); if (t.value.trim()) a.name = t.value.trim(); else t.value = a.name; }
    else return;
    speichern();
  });
  blatt.addEventListener('click', async e => {
    const k = e.target.closest('button');
    if (!k) return;
    if (k.id === 'rPerson') {
      const name = await frageText('Person hinzufügen', { platzhalter: 'Name', vorschlaege: bekanntePersonen().filter(n => !personNachName(r, n)).slice(0, 6) });
      if (name && !personNachName(r, name)) { personHinzu(r, name); speichern(); }
      return zeige();
    }
    if (k.id === 'rAbschnitt') {
      const name = await frageText('Abschnitt hinzufügen', { platzhalter: 'z. B. Wanderung', vorschlaege: ABSCHNITT_VORSCHLAEGE.filter(v => !r.abschnitte.some(a => norm(a.name) === norm(v))).slice(0, 6) });
      if (name) { abschnittHinzu(r, name); speichern(); }
      return zeige();
    }
    if (k.dataset.wegP) {
      const p = personVon(r, k.dataset.wegP), n = r.sachen.filter(s => s.person === p.id).length;
      if (n && !confirm(`${p.name} entfernen? ${mehrzahl(n, 'Sache wird', 'Sachen werden')} unverteilt.`)) return;
      r.sachen.forEach(s => { if (s.person === p.id) { s.person = null; delete s.uebergabe; } });
      r.personen = r.personen.filter(x => x !== p);
      const e2 = reiseEintrag(r.id); if (e2.ich === p.id) { e2.ich = r.personen[0] ? r.personen[0].id : null; sichereIndex(); }
      speichern(); return zeige();
    }
    if (k.dataset.wegA) {
      const a = abschnittVon(r, k.dataset.wegA);
      r.sachen.forEach(s => { if (s.abschnitt === a.id) s.abschnitt = null; });
      r.abschnitte = r.abschnitte.filter(x => x !== a);
      speichern(); return zeige();
    }
    const verschiebe = (id, d) => {
      const l = abschnitteSortiert(r), i = l.findIndex(a => a.id === id), j = i + d;
      if (j < 0 || j >= l.length) return;
      [l[i], l[j]] = [l[j], l[i]];
      l.forEach((a, n) => { a.reihenfolge = n; });
      speichern(); zeige();
    };
    if (k.dataset.hoch) verschiebe(k.dataset.hoch, -1);
    if (k.dataset.runter) verschiebe(k.dataset.runter, 1);
  });
  b._beimSchliessen = () => { speichern(); render(); };
}

/* ============================================================
   Neue Reise, Übernehmen aus früheren Reisen, Text einfügen
   ============================================================ */

function oeffneNeueReise() {
  if (!S.ich.name) return oeffneWillkommen(() => oeffneNeueReise());
  const W = { schritt: 'reise', name: '', start: '', ende: '', personen: [S.ich.name], extra: [], quelle: null, reisen: new Set(), text: '' };
  const frueher = [...REISEN.values()].filter(r => r.sachen.length).sort((a, b) => reiseZeit(b) - reiseZeit(a));
  if (frueher.length) W.reisen.add(frueher[0].id);
  const b = oeffneBlatt('', { voll: true });
  const blatt = $('.blatt', b);
  const bekannte = () => [...new Set([...bekanntePersonen(), ...W.extra])];

  const zeige = () => {
    if (W.schritt === 'reise') {
      blatt.innerHTML = `${blattKopf('Neue Reise', { rechts: 'Weiter', rechtsId: 'wWeiter', rechtsAus: !W.name.trim() })}
        <h2 class="seiten-titel">Wohin geht’s?</h2>
        <label class="feld"><span>Name</span><input type="text" id="wName" value="${esc(W.name)}" placeholder="z. B. Peru, Wandern im Allgäu" autocapitalize="sentences" enterkeyhint="next"></label>
        <div class="zwei"><label class="feld"><span>Von</span><input type="date" id="wStart" value="${esc(W.start)}"></label>
          <label class="feld"><span>Bis</span><input type="date" id="wEnde" value="${esc(W.ende)}"></label></div>
        <div class="abschnitt">Wer reist mit?</div>
        <div class="chips" id="wPersonen">
          <button type="button" class="chip an" disabled>${esc(S.ich.name)} (ich)</button>
          ${bekannte().map(n => `<button type="button" class="chip${W.personen.includes(n) ? ' an' : ''}" data-person="${esc(n)}">${esc(n)}</button>`).join('')}
          <button type="button" class="chip neu-person" id="wNeuePerson">+ Person</button>
        </div>
        <p class="text-muted">Jede Person bekommt eine eigene Liste. Sachen lassen sich jederzeit übergeben.</p>`;
      setTimeout(() => { const f = $('#wName', blatt); if (f && !W.name) f.focus(); }, 250);
    } else if (W.schritt === 'quelle') {
      blatt.innerHTML = `${blattKopf('Neue Reise', { links: 'Zurück' }).replace('data-schliessen', 'id="wZurueck"')}
        <h2 class="seiten-titel">Womit starten?</h2>
        <div class="wahl">
          ${frueher.length ? `<button type="button" data-quelle="frueher">${ICON.verlauf}<span><span class="titel-w">Aus früheren Reisen</span><small>Sachen samt Erfahrungen von damals übernehmen – Ungenutztes ist schon abgewählt</small></span></button>` : ''}
          <button type="button" data-quelle="text">${ICON.text}<span><span class="titel-w">Text einfügen</span><small>Liste aus Notizen, einer Nachricht oder einer alten Packliste</small></span></button>
          <button type="button" data-quelle="leer">${ICON.plus}<span><span class="titel-w">Leere Liste</span><small>Selbst eintippen – die Kategorien ordnet die App zu</small></span></button>
        </div>`;
    } else if (W.schritt === 'reisen') {
      blatt.innerHTML = `${blattKopf('Frühere Reisen', { links: 'Zurück', rechts: 'Weiter', rechtsId: 'wWeiter', rechtsAus: !W.reisen.size }).replace('data-schliessen', 'id="wZurueck"')}
        <h2 class="seiten-titel">Welche Reisen?</h2>
        <p class="unter-titel">Mehrere gehen auch – Doppeltes wird zusammengefasst.</p>
        <ul class="auswahl-liste">${frueher.map(r => `<li><label><input type="checkbox" data-reise-w="${r.id}"${W.reisen.has(r.id) ? ' checked' : ''}>
          <span class="a-text"><span class="a-name">${esc(r.info.name)}</span><small>${esc([datumBereich(r.info.start, r.info.ende), mehrzahl(r.sachen.length, 'Sache', 'Sachen'), bewertetAnzahl(r) ? `${bewertetAnzahl(r)} bewertet` : ''].filter(Boolean).join(' · '))}</small></span></label></li>`).join('')}</ul>`;
    } else if (W.schritt === 'text') {
      blatt.innerHTML = textEinfuegenHTML('Neue Reise', 'Reise anlegen', W.text, '', 'Zurück').replace('data-schliessen', 'id="wZurueck"');
      bindeTextVorschau(blatt, W);
    }
  };
  const anlegen = (kandidaten = null, liste = null) => {
    const r = neueReise({ name: W.name.trim(), start: W.start, ende: W.ende || W.start, personen: W.personen.filter(n => n !== S.ich.name) });
    const ich = r.personen[0].id;
    if (kandidaten) uebernimmKandidaten(r, kandidaten, { standardPerson: ich });
    if (liste) uebernimmGeparst(r, liste, { standardPerson: ich });
    sichereReise(r);
    b._beimSchliessen = null;
    schliesseBlatt(b);
    oeffneReise(r.id);
    zeigeToast(`${r.info.name} angelegt${r.sachen.length ? ` · ${mehrzahl(r.sachen.length, 'Sache', 'Sachen')}` : ''}`);
  };
  zeige();
  blatt.addEventListener('input', e => {
    if (e.target.id === 'wName') { W.name = e.target.value; $('#wWeiter', blatt).disabled = !W.name.trim(); }
  });
  blatt.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'wStart') { W.start = t.value; if (t.value && (!W.ende || W.ende < t.value)) { W.ende = t.value; $('#wEnde', blatt).value = t.value; } }
    if (t.id === 'wEnde') W.ende = t.value;
    if (t.dataset.reiseW) { if (t.checked) W.reisen.add(t.dataset.reiseW); else W.reisen.delete(t.dataset.reiseW); $('#wWeiter', blatt).disabled = !W.reisen.size; }
  });
  blatt.addEventListener('keydown', e => { if (e.target.id === 'wName' && e.key === 'Enter') e.target.blur(); });
  blatt.addEventListener('click', async e => {
    const k = e.target.closest('button');
    if (!k) return;
    if (k.id === 'wZurueck') { W.schritt = { quelle: 'reise', reisen: 'quelle', text: 'quelle' }[W.schritt]; return zeige(); }
    if (k.dataset.person) {
      const n = k.dataset.person;
      W.personen = W.personen.includes(n) ? W.personen.filter(x => x !== n) : [...W.personen, n];
      k.classList.toggle('an', W.personen.includes(n));
      return;
    }
    if (k.id === 'wNeuePerson') {
      const name = await frageText('Wer reist mit?', { platzhalter: 'Name' });
      if (name && norm(name) !== norm(S.ich.name)) { if (!bekannte().some(n => norm(n) === norm(name))) W.extra.push(name); const n = bekannte().find(x => norm(x) === norm(name)); if (!W.personen.includes(n)) W.personen.push(n); }
      return zeige();
    }
    if (k.id === 'wWeiter' && W.schritt === 'reise') { W.schritt = 'quelle'; return zeige(); }
    if (k.dataset.quelle === 'leer') return anlegen();
    if (k.dataset.quelle === 'frueher') { W.schritt = 'reisen'; return zeige(); }
    if (k.dataset.quelle === 'text') { W.schritt = 'text'; return zeige(); }
    if (k.id === 'wWeiter' && W.schritt === 'reisen') {
      const reisen = [...W.reisen].map(id => REISEN.get(id)).filter(Boolean);
      const personen = [S.ich.name, ...W.personen.filter(n => n !== S.ich.name)];
      oeffneUebernahme(kandidatenAus(reisen), { personen, knopf: 'Reise anlegen', fertig: auswahl => anlegen(auswahl) });
      return;
    }
    if (k.id === 'tUebernehmen' && W.schritt === 'text') {
      const liste = parseListe(W.text);
      if (!liste.sachen.length) return zeigeToast('Keine Sachen erkannt');
      if (!W.name.trim() && liste.titel) W.name = liste.titel;
      return anlegen(null, liste);
    }
  });
  b._beimSchliessen = null;
}

// Gemeinsames Blatt: Kandidaten auswählen (neue Reise oder Ergänzen einer bestehenden)
function oeffneUebernahme(kandidaten, { personen = [], knopf = 'Übernehmen', fertig }) {
  if (!kandidaten.length) return zeigeToast('Nichts zu übernehmen');
  const U = { nieWeg: true, art: kandidaten.some(k => k.abschnitt) ? 'abschnitte' : 'kategorien', aus: new Set(kandidaten.filter(k => k.nie).map(k => k.key)) };
  const mehrere = personen.length > 1;
  const nie = kandidaten.filter(k => k.nie).length;
  const b = oeffneBlatt('', { voll: true });
  const blatt = $('.blatt', b);
  const gruppenVon = () => {
    const m = new Map();
    const key = k => U.art === 'abschnitte' ? (k.abschnitt || 'Ohne Abschnitt') : (KAT_IDS.includes(k.kategorie) ? k.kategorie : klassifiziere(k.name).kat);
    const reihe = U.art === 'abschnitte' ? null : S.einstellungen.kategorien;
    for (const k of kandidaten) { const g = key(k); if (!m.has(g)) m.set(g, []); m.get(g).push(k); }
    let l = [...m.entries()];
    if (reihe) l.sort((a, b) => reihe.indexOf(a[0]) - reihe.indexOf(b[0]));
    else l.sort((a, b) => (a[0] === 'Ohne Abschnitt') - (b[0] === 'Ohne Abschnitt'));
    return l.map(([g, ks]) => ({ id: g, name: U.art === 'abschnitte' ? g : KAT[g].name, kat: U.art === 'abschnitte' ? null : g, ks: U.art === 'abschnitte' ? ks : ks.slice().sort(nachName) }));
  };
  const anzahl = () => kandidaten.filter(k => !U.aus.has(k.key)).length;
  const zeige = () => {
    const pos = blatt.scrollTop;
    blatt.innerHTML = `${blattKopf('Übernehmen', { links: 'Zurück' })}
      <h2 class="seiten-titel">Was soll mit?</h2>
      <p class="unter-titel" id="uZahl">${anzahl()} von ${kandidaten.length} ausgewählt</p>
      ${nie ? `<label class="schalter"><span>Nie Gebrauchtes weglassen<small>${mehrzahl(nie, 'Sache wurde', 'Sachen wurden')} zuletzt nicht gebraucht</small></span><input type="checkbox" id="uNie"${U.nieWeg ? ' checked' : ''}></label>` : ''}
      ${kandidaten.some(k => k.abschnitt) ? `<div class="segment klein" style="margin-top:12px"><button type="button" data-art="abschnitte" class="${U.art === 'abschnitte' ? 'an' : ''}">Abschnitte</button><button type="button" data-art="kategorien" class="${U.art === 'kategorien' ? 'an' : ''}">Kategorien</button></div>` : ''}
      ${gruppenVon().map(g => `<div class="auswahl-kopf">${g.kat ? katIcon(g.kat) : ''}<span class="g-name">${esc(g.name)}</span>
        <button type="button" data-gruppe-alle="${esc(g.id)}">${g.ks.every(k => !U.aus.has(k.key)) ? 'Keine' : 'Alle'}</button></div>
        <ul class="auswahl-liste">${g.ks.map(k => {
          const v = verlaufText(k);
          const p = mehrere && k.person && norm(k.person) !== norm(S.ich.name) ? personen.find(n => norm(n) === norm(k.person)) : null;
          return `<li class="${U.aus.has(k.key) ? 'aus' : ''}"><label><input type="checkbox" data-key="${esc(k.key)}"${U.aus.has(k.key) ? '' : ' checked'}>
            <span class="a-text"><span class="a-name">${esc(k.name)}${k.menge ? ` <span class="text-muted">×${k.menge}</span>` : ''}</span>
            ${v ? `<small class="${k.nie ? 'nie' : ''}">${esc(v)}</small>` : ''}${k.notiz ? `<small>${linkify(k.notiz)}</small>` : ''}</span></label>
            ${p ? `<span class="klein text-muted">${esc(p)}</span>` : ''}</li>`;
        }).join('')}</ul>`).join('')}
      <div class="knopfreihe"><button type="button" class="knopf" id="uFertig">${esc(knopf)} · ${mehrzahl(anzahl(), 'Sache', 'Sachen')}</button></div>`;
    blatt.scrollTop = pos;
  };
  const zaehle = () => { $('#uZahl', blatt).textContent = `${anzahl()} von ${kandidaten.length} ausgewählt`; $('#uFertig', blatt).textContent = `${knopf} · ${mehrzahl(anzahl(), 'Sache', 'Sachen')}`; };
  zeige();
  blatt.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'uNie') {
      U.nieWeg = t.checked;
      for (const k of kandidaten.filter(k => k.nie)) { if (U.nieWeg) U.aus.add(k.key); else U.aus.delete(k.key); }
      return zeige();
    }
    if (t.dataset.key) {
      if (t.checked) U.aus.delete(t.dataset.key); else U.aus.add(t.dataset.key);
      t.closest('li').classList.toggle('aus', !t.checked);
      zaehle();
    }
  });
  blatt.addEventListener('click', e => {
    const k = e.target.closest('button');
    if (!k) return;
    if (k.dataset.art) { U.art = k.dataset.art; return zeige(); }
    if (k.dataset.gruppeAlle != null) {
      const g = gruppenVon().find(x => x.id === k.dataset.gruppeAlle);
      const alleAn = g.ks.every(x => !U.aus.has(x.key));
      for (const x of g.ks) { if (alleAn) U.aus.add(x.key); else U.aus.delete(x.key); }
      return zeige();
    }
    if (k.id === 'uFertig') {
      const auswahl = kandidaten.filter(x => !U.aus.has(x.key));
      schliesseBlatt(b);
      fertig(auswahl);
    }
  });
}

// Bestehende Reise aus früheren Reisen ergänzen
function oeffneUebernehmenWahl(r) {
  const frueher = [...REISEN.values()].filter(x => x.id !== r.id && x.sachen.length).sort((a, b) => reiseZeit(b) - reiseZeit(a));
  if (!frueher.length) return zeigeToast('Noch keine früheren Reisen');
  const gewaehlt = new Set([frueher[0].id]);
  const b = oeffneBlatt(`${blattKopf('Frühere Reisen', { rechts: 'Weiter', rechtsId: 'eWeiter' })}
    <p class="unter-titel">Aus welchen Reisen soll etwas dazukommen? Was schon auf der Liste steht, wird ausgelassen.</p>
    <ul class="auswahl-liste">${frueher.map(x => `<li><label><input type="checkbox" data-r="${x.id}"${gewaehlt.has(x.id) ? ' checked' : ''}>
      <span class="a-text"><span class="a-name">${esc(x.info.name)}</span><small>${esc([datumBereich(x.info.start, x.info.ende), mehrzahl(x.sachen.length, 'Sache', 'Sachen')].filter(Boolean).join(' · '))}</small></span></label></li>`).join('')}</ul>`);
  b.addEventListener('change', e => {
    const t = e.target;
    if (!t.dataset.r) return;
    if (t.checked) gewaehlt.add(t.dataset.r); else gewaehlt.delete(t.dataset.r);
    $('#eWeiter', b).disabled = !gewaehlt.size;
  });
  $('#eWeiter', b).addEventListener('click', () => {
    const vorhanden = new Set(r.sachen.map(s => kompakt(s.name) + '|' + norm((personVon(r, s.person) || {}).name || '')));
    const namen = new Set(r.sachen.map(s => kompakt(s.name)));
    const kandidaten = kandidatenAus([...gewaehlt].map(id => REISEN.get(id)))
      .filter(k => !vorhanden.has(k.key) && !(r.personen.length === 1 && namen.has(kompakt(k.name))));
    schliesseBlatt(b);
    if (!kandidaten.length) return zeigeToast('Alles steht schon auf der Liste');
    setTimeout(() => oeffneUebernahme(kandidaten, { personen: personenSortiert(r).map(p => p.name), knopf: 'Hinzufügen', fertig: auswahl => {
      const vorher = r.sachen.length;
      uebernimmKandidaten(r, auswahl, { standardPerson: zielPerson(r) || (ichIn(r) || r.personen[0]).id });
      sichereReise(r); render();
      zeigeToast(`${mehrzahl(r.sachen.length - vorher, 'Sache', 'Sachen')} hinzugefügt`);
    } }), 220);
  });
}

function textEinfuegenHTML(titel, knopf, text, extra = '', links = 'Abbrechen') {
  return `${blattKopf(titel, { links })}
    <h2 class="seiten-titel">Liste einfügen</h2>
    <p class="unter-titel">Aus Notizen, einer Nachricht oder einer alten Packliste. Überschriften werden zu Abschnitten, „(Name)“ dahinter zur Person. „Anm.: …“ wird zur Notiz.</p>
    <label class="feld"><textarea class="gross" id="tText" placeholder="Kleidung&#10;- [ ] T-Shirts (5x)&#10;- [ ] Pulli&#10;&#10;Wanderung&#10;- [ ] Stirnlampe">${esc(text)}</textarea></label>
    <p class="vorschau" id="tVorschau"></p>
    ${navigator.clipboard && navigator.clipboard.readText ? '<button type="button" class="knopf-klein akzent" id="tAblage">Aus der Zwischenablage einfügen</button>' : ''}
    ${extra}
    <div class="knopfreihe"><button type="button" class="knopf" id="tUebernehmen">${esc(knopf)}</button></div>`;
}
function bindeTextVorschau(blatt, zustand, nachher = () => {}) {
  const feld = $('#tText', blatt), vorschau = $('#tVorschau', blatt);
  const aktualisiere = () => {
    zustand.text = feld.value;
    const l = parseListe(feld.value);
    vorschau.textContent = l.sachen.length ? [mehrzahl(l.sachen.length, 'Sache', 'Sachen'), l.abschnitte.length ? mehrzahl(l.abschnitte.length, 'Abschnitt', 'Abschnitte') : '',
      l.personen.length ? 'Personen: ' + l.personen.join(', ') : '', l.sachen.some(s => s.bewertung) ? `${l.sachen.filter(s => s.bewertung).length} mit Erfahrung` : ''].filter(Boolean).join(' · ') : '';
    nachher(l);
  };
  feld.addEventListener('input', aktualisiere);
  const ablage = $('#tAblage', blatt);
  if (ablage) ablage.addEventListener('click', async () => {
    try { const t = await navigator.clipboard.readText(); if (t) { feld.value = feld.value ? feld.value + '\n' + t : t; aktualisiere(); } } catch (e) { zeigeToast('Zwischenablage nicht lesbar – bitte lange tippen und „Einsetzen“'); }
  });
  aktualisiere();
}

// Text in eine bestehende Reise einfügen
function oeffneTextEinfuegen(r) {
  const Z = { text: '' };
  const b = oeffneBlatt(textEinfuegenHTML('Text einfügen', 'Hinzufügen', ''), { voll: true });
  bindeTextVorschau(b, Z);
  $('#tUebernehmen', b).addEventListener('click', () => {
    const l = parseListe(Z.text);
    if (!l.sachen.length) return zeigeToast('Keine Sachen erkannt');
    const vorher = r.sachen.length;
    uebernimmGeparst(r, l, { standardPerson: zielPerson(r) });
    sichereReise(r);
    schliesseBlatt(b);
    render();
    zeigeToast(`${mehrzahl(r.sachen.length - vorher, 'Sache', 'Sachen')} hinzugefügt`);
  });
}

// Alte Liste als vergangene Reise speichern (mit Haken und Erfahrungen)
function oeffneArchivImport() {
  if (!S.ich.name) return oeffneWillkommen(() => oeffneArchivImport());
  const Z = { text: '', name: '', start: '', ende: '', nameGeaendert: false };
  const extra = `<label class="feld"><span>Name der Reise</span><input type="text" id="aName" placeholder="z. B. Portugal 2024" autocapitalize="sentences"></label>
    <div class="zwei"><label class="feld"><span>Von (optional)</span><input type="date" id="aStart"></label><label class="feld"><span>Bis (optional)</span><input type="date" id="aEnde"></label></div>
    <p class="text-muted">Gespeichert als vergangene Reise. Haken und Anmerkungen wie „nie gebraucht“ bleiben erhalten und helfen beim nächsten Packen.</p>`;
  const b = oeffneBlatt(textEinfuegenHTML('Frühere Liste', 'Als vergangene Reise speichern', '', extra).replace('<h2 class="seiten-titel">Liste einfügen</h2>', '<h2 class="seiten-titel">Frühere Liste einfügen</h2>'), { voll: true });
  const name = $('#aName', b);
  bindeTextVorschau(b, Z, l => { if (!Z.nameGeaendert && l.titel) name.value = l.titel; });
  name.addEventListener('input', () => { Z.nameGeaendert = true; });
  $('#aStart', b).addEventListener('change', e => { if (!$('#aEnde', b).value) $('#aEnde', b).value = e.target.value; });
  $('#tUebernehmen', b).addEventListener('click', () => {
    const l = parseListe(Z.text);
    if (!l.sachen.length) return zeigeToast('Keine Sachen erkannt');
    const n = name.value.trim() || l.titel || 'Frühere Reise';
    const r = neueReise({ name: n, start: $('#aStart', b).value, ende: $('#aEnde', b).value || $('#aStart', b).value });
    r.info.abgeschlossen = true;
    uebernimmGeparst(r, l, { archiv: true, standardPerson: r.personen[0].id });
    // Bin ich in der Liste gar nicht vorgekommen, aber jemand anderes schon: meine leere Person entfernen
    const ich = r.personen[0];
    if (l.personen.length && !r.sachen.some(s => s.person === ich.id) && !l.personen.some(p => norm(p) === norm(ich.name))) {
      r.personen = r.personen.filter(p => p !== ich);
      reiseEintrag(r.id).ich = null; sichereIndex();
    }
    sichereReise(r);
    schliesseBlatt(b);
    render();
    zeigeToast(`${r.info.name} gespeichert · ${mehrzahl(r.sachen.length, 'Sache', 'Sachen')}`);
  });
}

/* ============================================================
   Gemeinsam packen: Einladen, Beitreten
   ============================================================ */

function oeffneEinladen(r) {
  const b = oeffneBlatt('');
  const blatt = $('.blatt', b);
  const zeige = () => {
    const sy = SYNCS.get(r.id);
    if (!SYNC_URL) {
      blatt.innerHTML = `${blattKopf('Gemeinsam packen', { links: 'Schließen' })}
        <p>Mitreisende sehen die Reise auf ihrem eigenen iPhone, haken selbst ab, und was du ihnen übergibst, landet direkt auf ihrer Liste.</p>
        <p class="text-muted">Dafür fehlt noch der Sync-Server (Cloudflare, siehe server/ANLEITUNG.md). Bis dahin kannst du alle Personen auf diesem Gerät verwalten und Listen als Text teilen.</p>
        <div class="knopfreihe"><button type="button" class="knopf zweit" id="eText">${ICON.teilen}Als Text teilen</button></div>`;
      return;
    }
    if (!sy) {
      blatt.innerHTML = `${blattKopf('Mitreisende einladen', { links: 'Schließen' })}
        <p>Mitreisende sehen „${esc(r.info.name)}“ auf ihrem eigenen iPhone, haken selbst ab, und was du ihnen übergibst, landet direkt auf ihrer Liste.</p>
        <p class="text-muted">Die Daten werden verschlüsselt abgeglichen. Den Schlüssel enthält nur die Einladung – wer den Link hat, kann mitpacken.</p>
        <div class="knopfreihe"><button type="button" class="knopf" id="eStart">${ICON.einladen}Einladung erstellen</button></div>`;
      return;
    }
    const link = einladungsLink(sy.stand.schluessel);
    const ich = ichIn(r);
    blatt.innerHTML = `${blattKopf('Gemeinsam packen', { links: 'Schließen' })}
      <div class="qr-rahmen">${qrSvg(link)}</div>
      <div class="status-zeile"><i class="${sy.online && !sy.fehler ? 'an' : ''}"></i>${esc(syncStatusText(r.id))}</div>
      <div class="knopfreihe"><button type="button" class="knopf" id="eTeilen">${ICON.teilen}Einladung teilen</button>
        <button type="button" class="knopf zweit" id="eKopieren">${ICON.link}Link kopieren</button></div>
      <p class="text-muted">Die andere Person öffnet den Link. Nutzt sie die App vom Home-Bildschirm, fügt sie ihn dort unter „Einladung öffnen“ ein. Danach wählt sie, wer sie auf der Reise ist.</p>
      <div class="abschnitt">Personen</div>
      <ul class="einst-liste">${personenSortiert(r).map(p => `<li>${avatarHTML(p)}<span class="fuellen">${esc(p.name)}${ich && ich.id === p.id ? ' <span class="klein">(dieses Gerät)</span>' : ''}</span>
        <span class="klein">${p.verbunden ? 'verbunden' : 'noch nicht verbunden'}</span></li>`).join('')}</ul>
      <div class="knopfreihe"><button type="button" class="knopf gefahr" id="eTrennen">Auf diesem Gerät nicht mehr abgleichen</button></div>`;
  };
  zeige();
  const beiSync = e => { if (e.detail.id === r.id && b.isConnected && !blatt.querySelector('input:focus')) zeige(); };
  document.addEventListener('sync', beiSync);
  b._beimSchliessen = () => { document.removeEventListener('sync', beiSync); render(); };
  blatt.addEventListener('click', async e => {
    const k = e.target.closest('button');
    if (!k) return;
    if (k.id === 'eText') { schliesseBlatt(b); return teile(alsText(r), 'Als Text teilen'); }
    if (k.id === 'eStart') {
      k.disabled = true; k.innerHTML = '<span class="laedt"></span>Wird eingerichtet';
      const ich = ichIn(r) || r.personen[0];
      if (ich) { ich.verbunden = true; reiseEintrag(r.id).ich = ich.id; sichereIndex(); sichereReise(r, { ohneSync: true }); }
      await starteSync(r.id);
      const sy = SYNCS.get(r.id);
      if (!sy || !sy.stand.zuletzt) zeigeToast('Server nicht erreichbar – die Einladung funktioniert, sobald du online bist');
      zeige(); render();
      return;
    }
    const link = SYNCS.get(r.id) ? einladungsLink(SYNCS.get(r.id).stand.schluessel) : '';
    if (k.id === 'eTeilen') return teile(`Packliste „${r.info.name}“ – lass uns gemeinsam packen:\n${link}\n\nÖffne den Link auf dem iPhone. Nutzt du die Packliste vom Home-Bildschirm, füge ihn dort unter „Einladung öffnen“ ein.`, 'Einladung teilen');
    if (k.id === 'eKopieren') {
      try { await navigator.clipboard.writeText(link); zeigeToast('Link kopiert'); } catch (x) { teile(link, 'Link'); }
      return;
    }
    if (k.id === 'eTrennen') {
      if (!confirm('Diese Reise auf diesem Gerät nicht mehr abgleichen? Sie bleibt hier erhalten; die anderen packen weiter gemeinsam.')) return;
      beendeSync(r.id);
      zeige(); render();
    }
  });
}

function oeffneEinladungEinfuegen() {
  const b = oeffneBlatt(`${blattKopf('Einladung öffnen', { rechts: 'Öffnen', rechtsId: 'iOk', rechtsAus: true })}
    <p class="unter-titel">Füge den Link ein, den du bekommen hast (z. B. per Nachricht). Er beginnt mit „${esc(location.origin + location.pathname)}#r=“.</p>
    <label class="feld"><input type="url" id="iLink" placeholder="Link einfügen" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
    ${navigator.clipboard && navigator.clipboard.readText ? '<button type="button" class="knopf-klein akzent" id="iAblage">Aus der Zwischenablage einfügen</button>' : ''}`);
  const feld = $('#iLink', b), ok = $('#iOk', b);
  const pruefe = () => { ok.disabled = !linkAus(feld.value); };
  feld.addEventListener('input', pruefe);
  const ablage = $('#iAblage', b);
  if (ablage) ablage.addEventListener('click', async () => { try { feld.value = await navigator.clipboard.readText(); pruefe(); } catch (e) { zeigeToast('Zwischenablage nicht lesbar – bitte lange tippen und „Einsetzen“'); } });
  ok.addEventListener('click', () => { const s = linkAus(feld.value); if (!s) return; schliesseBlatt(b); setTimeout(() => oeffneBeitreten(s), 220); });
  setTimeout(() => feld.focus(), 250);
}

function linkAusAdresse() {
  const s = linkAus(location.hash);
  if (!s) return;
  history.replaceState(history.state, '', location.pathname + location.search);
  oeffneBeitreten(s);
}

async function oeffneBeitreten(schluessel) {
  const vorhanden = S.reisen.find(e => e.schluessel === schluessel);
  if (vorhanden) return oeffneReise(vorhanden.id);
  if (!SYNC_URL) return zeigeToast('Der Sync-Server ist noch nicht eingerichtet.');
  const b = oeffneBlatt(`${blattKopf('Gemeinsame Reise')}<p class="text-muted"><span class="laedt"></span>Reise wird geladen …</p>`);
  const blatt = $('.blatt', b);
  let geteilt;
  try { geteilt = await holeGeteilteReise(schluessel); }
  catch (e) {
    blatt.innerHTML = `${blattKopf('Gemeinsame Reise', { links: 'Schließen' })}<p>${e.name === 'OperationError' ? 'Der Link ist beschädigt.' : 'Der Server ist nicht erreichbar. Bitte später noch einmal versuchen.'}</p>`;
    return;
  }
  if (!geteilt) { blatt.innerHTML = `${blattKopf('Gemeinsame Reise', { links: 'Schließen' })}<p>Diese Einladung ist nicht mehr gültig – die Reise wurde gelöscht.</p>`; return; }
  const r = geteilt.reise;
  const personen = personenSortiert(r);
  const passt = S.ich.name ? personen.find(p => norm(p.name) === norm(S.ich.name)) : null;
  let wahl = passt ? passt.id : (personen.find(p => !p.verbunden) || {}).id || '+neu';
  const zeige = () => {
    blatt.innerHTML = `${blattKopf('Gemeinsame Reise', { rechts: 'Beitreten', rechtsId: 'bOk' })}
      <h2 class="seiten-titel">${esc(r.info.name)}</h2>
      <p class="unter-titel">${esc([datumBereich(r.info.start, r.info.ende), mehrzahl(r.sachen.length, 'Sache', 'Sachen')].filter(Boolean).join(' · '))}</p>
      <div class="abschnitt">Wer bist du?</div>
      ${personen.map(p => `<button type="button" class="zeile-wahl${wahl === p.id ? ' an' : ''}" data-wahl="${p.id}">${avatarHTML(p, 'gross')}<span class="zw-text">${esc(p.name)}<small>${p.verbunden ? 'schon auf einem Gerät verbunden' : mehrzahl(fortschritt(r, p.id).gesamt, 'Sache', 'Sachen')}</small></span>${wahl === p.id ? ICON.hakenLinie : ''}</button>`).join('')}
      <button type="button" class="zeile-wahl${wahl === '+neu' ? ' an' : ''}" data-wahl="+neu"><span class="avatar gross leer">+</span><span class="zw-text">Jemand anderes</span>${wahl === '+neu' ? ICON.hakenLinie : ''}</button>
      ${wahl === '+neu' || !S.ich.name ? `<label class="feld"><span>Dein Name</span><input type="text" id="bName" value="${esc(S.ich.name || (personVon(r, wahl) || {}).name || '')}" autocapitalize="words"></label>` : ''}
      ${istIOS() && !istHomescreen() ? `<p class="text-muted">Nutzt du die Packliste vom Home-Bildschirm? Dann öffne sie dort und füge den Link unter „Einladung öffnen“ ein – Safari und die App haben getrennte Speicher.</p>` : ''}`;
  };
  zeige();
  blatt.addEventListener('click', async e => {
    const k = e.target.closest('button');
    if (!k) return;
    if (k.dataset.wahl) { const n = $('#bName', blatt); const alt = n ? n.value : ''; wahl = k.dataset.wahl; zeige(); const n2 = $('#bName', blatt); if (n2 && alt) n2.value = alt; return; }
    if (k.id !== 'bOk') return;
    const nameFeld = $('#bName', blatt);
    const name = nameFeld ? nameFeld.value.trim() : '';
    if (wahl === '+neu' && !name) { nameFeld.focus(); return zeigeToast('Bitte deinen Namen eingeben'); }
    if (!S.ich.name) { S.ich.name = name || (personVon(r, wahl) || {}).name || ''; sichereIch(); }
    k.disabled = true;
    const neu = await trittBei(schluessel, geteilt, wahl === '+neu' ? { neuName: name } : { ichPersonId: wahl });
    schliesseBlatt(b);
    oeffneReise(neu.id, { person: (ichIn(neu) || {}).id || null });
    zeigeToast(`Willkommen bei „${neu.info.name}“`);
  });
}

/* ============================================================
   Willkommen, Einstellungen, Sicherung
   ============================================================ */

function oeffneWillkommen(nachher = null) {
  if ($('.hinterlegt .willkommen')) return;
  const b = oeffneBlatt(`<div class="willkommen">
    <div class="leer" style="padding-top:28px">${ICON.koffer}<strong>Willkommen bei der Packliste</strong>Packen, abhaken, Sachen an Mitreisende übergeben – und beim nächsten Mal wissen, was du wirklich gebraucht hast.</div>
    <label class="feld"><span>Wie heißt du?</span><input type="text" id="wiName" placeholder="Dein Vorname" autocapitalize="words" enterkeyhint="done"></label>
    <div class="knopfreihe"><button type="button" class="knopf" id="wiOk" disabled>Los geht’s</button></div></div>`);
  const feld = $('#wiName', b), ok = $('#wiOk', b);
  feld.addEventListener('input', () => { ok.disabled = !feld.value.trim(); });
  const fertig = () => {
    if (!feld.value.trim()) return;
    S.ich.name = feld.value.trim(); sichereIch();
    // Bestehende Reisen ohne Namen (z. B. aus der Sicherung) bekommen ihn nicht automatisch; nur die Anzeige
    schliesseBlatt(b);
    render();
    if (nachher) setTimeout(nachher, 240);
  };
  feld.addEventListener('keydown', e => { if (e.key === 'Enter') fertig(); });
  ok.addEventListener('click', fertig);
  setTimeout(() => feld.focus(), 300);
}

function oeffneEinstellungen() {
  const b = oeffneBlatt('', { voll: true });
  const blatt = $('.blatt', b);
  let seite = 'haupt';
  const zeige = () => {
    const e = S.einstellungen;
    if (seite === 'gelernt') {
      const l = Object.entries(S.korrekturen);
      const namen = new Map();
      for (const r of REISEN.values()) for (const s of r.sachen) namen.set(kompakt(s.name), s.name);
      blatt.innerHTML = `<div class="blatt-kopf"><button type="button" class="zurueck" id="eZurueck">Zurück</button><h3>Gelernte Kategorien</h3><span style="min-width:64px"></span></div>
        <p class="unter-titel">Diese Zuordnungen hast du von Hand gewählt. Sie gelten für alle Reisen.</p>
        ${l.length ? `<ul class="einst-liste">${l.map(([k, kat]) => `<li>${katIcon(kat)}<span class="fuellen">${esc(namen.get(k) || k)}<span class="klein" style="margin-left:auto">${esc(KAT[kat] ? KAT[kat].name : kat)}</span></span>
          <button type="button" class="mini" data-vergiss="${esc(k)}" aria-label="Vergessen">${ICON.kreuz}</button></li>`).join('')}</ul>
          <div class="knopfreihe"><button type="button" class="knopf gefahr" id="eAlleVergessen">Alle zurücksetzen</button></div>` : '<p class="text-muted">Noch nichts gelernt.</p>'}`;
      return;
    }
    const gemeinsam = [...SYNCS.keys()].length;
    blatt.innerHTML = `<div class="blatt-kopf"><span style="min-width:64px"></span><h3>Einstellungen</h3><button type="button" class="zurueck rechts" data-schliessen>Fertig</button></div>
      <label class="feld"><span>Dein Name</span><input type="text" id="eName" value="${esc(S.ich.name)}" autocapitalize="words" placeholder="Dein Vorname"></label>
      <div class="abschnitt">Darstellung</div>
      <div class="segment" id="eThema">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([w, t]) => `<button type="button" data-thema="${w}" class="${e.thema === w ? 'an' : ''}">${t}</button>`).join('')}</div>
      <label class="schalter"><span>Gepacktes nach unten<small>Sonst bleibt es an seinem Platz</small></span><input type="checkbox" id="eUnten"${e.gepacktUnten ? ' checked' : ''}></label>
      <div class="abschnitt">Kategorien</div>
      <ul class="einst-liste">${e.kategorien.map((k, i, l) => `<li>${katIcon(k)}<span class="fuellen">${esc(KAT[k].name)}</span>
        <button type="button" class="mini" data-k-hoch="${k}" aria-label="Nach oben"${i ? '' : ' disabled'}>${ICON.hoch}</button>
        <button type="button" class="mini" data-k-runter="${k}" aria-label="Nach unten"${i < l.length - 1 ? '' : ' disabled'}>${ICON.runter}</button></li>`).join('')}
        <li><button type="button" class="fuellen" id="eGelernt"><span>Gelernte Zuordnungen</span><span class="klein" style="margin-left:auto">${Object.keys(S.korrekturen).length}</span>${ICON.pfeil}</button></li></ul>
      <div class="abschnitt">Daten</div>
      <ul class="einst-liste">
        <li><button type="button" class="fuellen" id="eArchiv">${ICON.text}Frühere Liste einfügen</button></li>
        <li><button type="button" class="fuellen" id="eEinladung">${ICON.link}Einladung öffnen</button></li>
        <li><button type="button" class="fuellen" id="eExport">${ICON.teilen}Sicherung exportieren</button></li>
        <li><label class="fuellen" style="cursor:pointer">${ICON.verlauf}Sicherung einspielen<input type="file" id="eImport" accept="application/json,.json" hidden></label></li>
      </ul>
      <p class="text-muted">Die Sicherung enthält alle Reisen und die Einladungsschlüssel gemeinsamer Reisen. Bewahre sie privat auf, z. B. in iCloud Drive.</p>
      <div class="abschnitt">Gemeinsam packen</div>
      <p class="text-muted">${SYNC_URL ? `Sync-Server eingerichtet · ${mehrzahl(gemeinsam, 'gemeinsame Reise', 'gemeinsame Reisen')} auf diesem Gerät. Die Daten sind Ende-zu-Ende verschlüsselt.` : 'Der Sync-Server ist noch nicht eingerichtet (siehe server/ANLEITUNG.md). Bis dahin bleiben alle Reisen auf diesem Gerät.'}</p>
      <p class="version">Packliste · Version ${APP_VERSION}</p>`;
  };
  zeige();
  blatt.addEventListener('change', async ev => {
    const t = ev.target;
    if (t.id === 'eName') { if (t.value.trim()) { S.ich.name = t.value.trim(); sichereIch(); } else t.value = S.ich.name; }
    if (t.id === 'eUnten') { S.einstellungen.gepacktUnten = t.checked; sichereEinstellungen(); }
    if (t.id === 'eImport' && t.files[0]) {
      try {
        const d = JSON.parse(await t.files[0].text());
        if (!confirm(`Sicherung vom ${d.exportiert ? new Date(d.exportiert).toLocaleDateString('de-DE') : '?'} einspielen? Reisen daraus werden hinzugefügt oder ersetzt.`)) return;
        const n = sicherungEinspielen(d);
        ladeSync();
        zeigeToast(`${mehrzahl(n, 'Reise', 'Reisen')} eingespielt`);
        for (const id of SYNCS.keys()) planeSync(id, 500);
        render(); zeige();
      } catch (e) { zeigeToast('Datei konnte nicht gelesen werden'); }
      t.value = '';
    }
  });
  blatt.addEventListener('click', async ev => {
    const k = ev.target.closest('button');
    if (!k) return;
    if (k.dataset.thema) { S.einstellungen.thema = k.dataset.thema; sichereEinstellungen(); wendeDarstellungAn(); return zeige(); }
    const verschiebe = (id, d) => {
      const l = S.einstellungen.kategorien, i = l.indexOf(id), j = i + d;
      if (j < 0 || j >= l.length) return;
      [l[i], l[j]] = [l[j], l[i]];
      sichereEinstellungen(); zeige();
    };
    if (k.dataset.kHoch) return verschiebe(k.dataset.kHoch, -1);
    if (k.dataset.kRunter) return verschiebe(k.dataset.kRunter, 1);
    if (k.id === 'eGelernt') { seite = 'gelernt'; return zeige(); }
    if (k.id === 'eZurueck') { seite = 'haupt'; return zeige(); }
    if (k.dataset.vergiss) { delete S.korrekturen[k.dataset.vergiss]; sichere('korrekturen', S.korrekturen); vergiss(); return zeige(); }
    if (k.id === 'eAlleVergessen') { if (!confirm('Alle gelernten Zuordnungen zurücksetzen?')) return; S.korrekturen = {}; sichere('korrekturen', S.korrekturen); vergiss(); return zeige(); }
    if (k.id === 'eArchiv') { schliesseBlatt(b); return setTimeout(oeffneArchivImport, 220); }
    if (k.id === 'eEinladung') { schliesseBlatt(b); return setTimeout(oeffneEinladungEinfuegen, 220); }
    if (k.id === 'eExport') return exportieren();
  });
  b._beimSchliessen = () => render();
}

async function exportieren() {
  const name = `packliste-${heute()}.json`;
  const datei = new File([JSON.stringify(sicherungsDaten(), null, 1)], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try { await navigator.share({ files: [datei], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(datei); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/* ============================================================
   Start
   ============================================================ */

if (new URLSearchParams(location.search).has('test')) {
  // Der Test schreibt nichts in den Speicher, gespeicherte Daten bleiben unberührt
  TESTMODUS = true;
  const sk = document.createElement('script');
  sk.src = 'test.js?' + APP_VERSION;
  sk.onload = () => selbsttest().catch(e => { document.body.innerHTML = `<pre class="testbericht">Selbsttest abgebrochen: ${esc(e.stack || e)}</pre>`; document.title = 'Test abgebrochen'; });
  document.body.appendChild(sk);
} else {
  ladeAlles();
  ladeSync();
  const z = S.einstellungen.zuletzt;
  if (z && REISEN.has(z) && ['geplant', 'unterwegs'].includes(reiseStatus(REISEN.get(z)))) {
    UI.seite = 'reise'; UI.reiseId = z;
    history.replaceState(null, '');
    history.pushState({ reise: z }, '');
  }
  render();
  if (!S.ich.name && !linkAus(location.hash)) oeffneWillkommen();
  linkAusAdresse();
  addEventListener('hashchange', linkAusAdresse);
  starteSyncZeitgeber(() => UI.seite === 'reise' ? UI.reiseId : null);
  document.addEventListener('sync', e => {
    const { id, geaendert } = e.detail || {};
    if (UI.seite === 'reise' && UI.reiseId === id) { if (geaendert) render(); else aktualisiereKopf(aktuelleReise()); }
    else if (UI.seite === 'start' && geaendert) render();
  });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
