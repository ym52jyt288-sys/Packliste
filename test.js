// Selbsttest der Packliste: index.html?test. Schreibt nichts in den Speicher (TESTMODUS).
// Ergebnis im Seitentitel („Test 123/123“) und in window.TESTERGEBNIS.
'use strict';

async function selbsttest() {
  const ergebnisse = [];
  const pruefe = (titel, ist, soll) => ergebnisse.push({ titel, ok: JSON.stringify(ist) === JSON.stringify(soll), ist, soll });
  const sauber = () => {
    S.ich = { name: 'Markus', geraet: 'geraet-a' }; S.reisen = []; S.einstellungen = standardEinstellungen(); S.korrekturen = {};
    REISEN.clear(); SYNCS.clear(); vergiss();
  };
  sauber();

  /* ---------- Kategorien: jede Sache aus den drei Beispiellisten ---------- */
  const erwartet = {
    kleidung: ['Unterhosen', 'T-Shirts', 'Mini-Flauschi', 'Longsleeve', 'Stirnband', 'Badehose', 'Sporthose', 'Socken', 'Hardshell-Jacke',
      'Sonnenbrille', 'Kappe (Sonnenschutz)', 'Halstuch (Sonnenschutz)', 'Wanderhose', 'Fleece-Pulli', 'Pulli', 'Polo-Shirts (mit tshirts  gesamt 7 St)',
      'Schlafhose', 'bequeme Hose', 'Hose', 'Zip-Hose', 'Sporthose kurz', 'Flauschi', 'ärmelloses Flauschi', 'Merino-Longsleeve', 'Merino-Shirts',
      'Fleecepulli', 'Schlafhose (=bequeme Hose)', 'Windjacke orange', 'Badezeug'],
    schuhe: ['Sportschuhe', 'Wanderschuhe'],
    hygiene: ['Taschentücher', 'Kompakthandtuch', 'Sonnencreme', 'Zahnpasta', 'Shampoo', 'Tempo-Taschentücher', 'Reisehandtücher', 'Klopapier'],
    medizin: ['Erste-Hilfe-Set', 'Voltarene kle', 'Bienen-Notfallset'],
    elektronik: ['Fotoapparat', 'Powerbank', 'iPhone-Ladegerät', 'Power Bank', 'iPhone Ladegerät', 'ESIM', 'Reiseadapter'],
    dokumente: ['Kartenmaterial ausgedruckt', 'Bargeld', 'Roter Gürtel für Wertsachen'],
    ausruestung: ['Flaschen (Kapa: 1,5 - 2.0 L)', 'Hüttenschlafsack', 'schwarzer Rucksack', 'Taschenmesser', 'Stirnlampen', 'Hüttenschlafsäcke', 'Insektennetz'],
    essen: ['Proviant', 'Gewürze', 'Plastikmesser bzw. Plastikbesteck', 'Proviant (3 x Müsli-Riegel,'],
    freizeit: ['Würfel', 'Reiseführer', 'Economists', 'Würfel zum Spielen'],
  };
  let anzahl = 0;
  for (const [kat, namen] of Object.entries(erwartet)) for (const n of namen) { pruefe(`Kategorie: ${n}`, klassifiziere(n).kat, kat); anzahl++; }
  pruefe('Kategorien: Beispiellisten vollständig geprüft', anzahl >= 65, true);

  const weitere = {
    'Voltarene': 'medizin', 'Sonencreme': 'hygiene', 'Zahnbürschte': 'hygiene', 'Ladegeret': 'elektronik', 'Unterhosn': 'kleidung',
    'Wanderhandschuhe': 'kleidung', 'Kletterschuhe': 'schuhe', 'Leselampe': 'ausruestung', 'Kopfschmerztabletten': 'medizin',
    'Reisezahnbürste': 'hygiene', 'Fleecemütze': 'kleidung', 'Ladeg': 'elektronik', 'Reisepass': 'dokumente', 'Laptop': 'elektronik',
    'Schnorchelset': 'freizeit', 'Mückenspray': 'medizin', 'Badeschlappen': 'schuhe', 'Ohropax': 'ausruestung', 'Müsliriegel': 'essen',
    '3 T-Shirts': 'kleidung', 'Kompass': 'ausruestung', 'Handschuhe': 'kleidung', 'Gastgeschenk': 'sonstiges',
  };
  for (const [n, kat] of Object.entries(weitere)) pruefe(`Kategorie: ${n}`, klassifiziere(parseMenge(n).name).kat, kat);
  pruefe('Kategorie: Unbekanntes ist „Sonstiges“, als unbekannt markiert', klassifiziere('Quxzlt'), { kat: 'sonstiges', quelle: 'unbekannt' });
  pruefe('Kategorie: „Sonstiges“ aus dem Katalog ist nicht unbekannt', klassifiziere('Gastgeschenk').quelle !== 'unbekannt', true);

  lerneKategorie('Gewürze', 'sonstiges');
  pruefe('Korrektur hat Vorrang vor dem Katalog', klassifiziere('Gewürze'), { kat: 'sonstiges', quelle: 'korrektur' });
  pruefe('Korrektur gilt unabhängig von Schreibweise', klassifiziere('gewürze').kat, 'sonstiges');
  pruefe('Katalog-Kategorie bleibt abrufbar', katalogKategorie('Gewürze'), 'essen');
  lerneKategorie('Gewürze', null);
  pruefe('Korrektur zurückgenommen', klassifiziere('Gewürze').kat, 'essen');
  {
    const r = neueReise({ name: 'Lernen' });
    sacheHinzu(r, { name: 'Quxzlt', kategorie: 'freizeit' });
    vergiss();
    pruefe('Gelernt aus einer früheren Reise (von Hand gesetzt)', klassifiziere('quxzlt'), { kat: 'freizeit', quelle: 'reisen' });
    pruefe('kategorieVon nutzt die gesetzte Kategorie', kategorieVon({ name: 'Socken', kategorie: 'sonstiges' }), 'sonstiges');
    pruefe('unbekannt() nur ohne Treffer und ohne gesetzte Kategorie', [unbekannt({ name: 'Qwrtz' }), unbekannt({ name: 'Qwrtz', kategorie: 'essen' }), unbekannt({ name: 'Socken' })], [true, false, false]);
  }
  sauber();

  /* ---------- Eingabe: Mengen, mehrere auf einmal ---------- */
  const mengen = {
    'Unterhosen (7 St.)': ['Unterhosen', 7], 'Merino-Shirts (3 x)': ['Merino-Shirts', 3], 'Merino-Shirts (3x)': ['Merino-Shirts', 3],
    '3 T-Shirts': ['T-Shirts', 3], '3x T-Shirts': ['T-Shirts', 3], 'T-Shirts 3x': ['T-Shirts', 3], 'T-Shirts x3': ['T-Shirts', 3],
    'iPhone 15': ['iPhone 15', null], 'Socken (9 St.)': ['Socken', 9], 'Flaschen (Kapa: 1,5 - 2.0 L)': ['Flaschen (Kapa: 1,5 - 2.0 L)', null],
    '1 Pulli': ['Pulli', null], '3-Tages-Rucksack': ['3-Tages-Rucksack', null], '2 Paar Socken': ['Socken', 2],
  };
  for (const [t, [n, m]] of Object.entries(mengen)) pruefe(`Menge: ${t}`, [parseMenge(t).name, parseMenge(t).menge], [n, m]);
  pruefe('Mehrfacheingabe mit Komma und Semikolon', zerlegeEingabe('Zahnbürste, Zahnpasta (2x); Deo').map(t => [t.name, t.menge]),
    [['Zahnbürste', null], ['Zahnpasta', 2], ['Deo', null]]);
  pruefe('Mehrfacheingabe: Komma in Klammern trennt nicht', zerlegeEingabe('Proviant (Riegel, Nüsse), Wasser').map(t => t.name), ['Proviant (Riegel, Nüsse)', 'Wasser']);

  /* ---------- Bewertung aus Anmerkungen ---------- */
  const bew = {
    'nie gebraucht': 'nie', 'nie benutzt, da Hostels gut ausgestattet waren': 'nie', 'einmal benutzt, kleinere wäre besser gewesen': 'kaum',
    'Abends und in Lissabon genutzt': 'gebraucht', 'Tube war zu klein, 50 mL nachgekauft': null, '1.5 L pro Pers war okay': null,
    'nicht gebraucht': 'nie', 'kaum getragen': 'kaum', '': null,
  };
  for (const [t, b] of Object.entries(bew)) pruefe(`Bewertung aus „${t}“`, bewertungAus(t), b);

  /* ---------- Text-Import (synthetische Listen in den Formaten der drei Beispiele) ---------- */
  const liste1 = `Mitnehmen (Markus)
- [x] Taschentücher
- [x] Mini-Flauschi Anm.: nie gebraucht
- [x] Badehose Anm.: einmal benutzt, kleinere wäre besser gewesen
- [x] Flaschen (Kapa: 1,5 - 2.0 L) Anm.: 1.5 L pro Person war okay
- [x] Sportschuhe Anm.: Abends genutzt
- [ ] Voltarene kle
- [ ] Kappe (Sonnenschutz)

Gleich Anziehen (Markus)
- [ ] Wanderhose
- [ ] Wanderschuhe`;
  const l1 = parseListe(liste1);
  pruefe('Import 1: Abschnitte aus Überschriften', l1.abschnitte, ['Mitnehmen', 'Gleich Anziehen']);
  pruefe('Import 1: Person aus Klammern', l1.personen, ['Markus']);
  pruefe('Import 1: Anzahl Sachen', l1.sachen.length, 9);
  pruefe('Import 1: Haken', l1.sachen.filter(s => s.gepackt).length, 5);
  pruefe('Import 1: Notiz und Bewertung', l1.sachen.filter(s => s.notiz).map(s => [s.name, s.bewertung]),
    [['Mini-Flauschi', 'nie'], ['Badehose', 'kaum'], ['Flaschen (Kapa: 1,5 - 2.0 L)', null], ['Sportschuhe', 'gebraucht']]);
  pruefe('Import 1: Zuordnung zu Abschnitt und Person', [l1.sachen[7].name, l1.sachen[7].abschnitt, l1.sachen[7].person], ['Wanderhose', 'Gleich Anziehen', 'Markus']);

  const liste2 = `Packliste Japan

Stadt - Kleidung

- [ ] Pulli
- [x] Unterhosen
- [x] Polo-Shirts (mit tshirts  gesamt 7 St)

allgemeine Ausrüstung:

- [x] Power Bank
- [x] Würfel

Wanderung

- [x] Proviant (3 x Müsli-Riegel,
- [x] Merino-Shirts (3 x)`;
  const l2 = parseListe(liste2);
  pruefe('Import 2: Titel „Packliste …“', l2.titel, 'Japan');
  pruefe('Import 2: Überschriften mit Doppelpunkt', l2.abschnitte, ['Stadt - Kleidung', 'allgemeine Ausrüstung', 'Wanderung']);
  pruefe('Import 2: keine Personen', l2.personen, []);
  pruefe('Import 2: Namen', l2.sachen.map(s => s.name), ['Pulli', 'Unterhosen', 'Polo-Shirts (mit tshirts gesamt 7 St)', 'Power Bank', 'Würfel', 'Proviant (3 x Müsli-Riegel', 'Merino-Shirts']);
  pruefe('Import 2: Menge in Klammern', l2.sachen[6].menge, 3);

  const liste3 = `Packliste Peru

Stadt - Kleidung

- [ ] Unterhosen (7 St.)
- [ ] Windjacke orange ?

Stadt - Sonstiges:

- [x] ESIM: https://esim.example/peru (Anbieter A, B) s. Netzabdeckung: https://netz.example

allgemeine Ausrüstung:

- [ ] Würfel zum Spielen
- [ ]
- [x] Reiseadapter

Reiseapotheke:

- [ ]

Ausrüstung-Wanderung

- [ ] Taschenmesser?`;
  const l3 = parseListe(liste3);
  pruefe('Import 3: leere Zeilen und leere Abschnitte fallen weg', l3.abschnitte, ['Stadt - Kleidung', 'Stadt - Sonstiges', 'allgemeine Ausrüstung', 'Ausrüstung-Wanderung']);
  pruefe('Import 3: Menge „(7 St.)“', [l3.sachen[0].name, l3.sachen[0].menge], ['Unterhosen', 7]);
  pruefe('Import 3: „?“ wird zu vielleicht', l3.sachen.filter(s => s.vielleicht).map(s => s.name), ['Windjacke orange', 'Taschenmesser']);
  pruefe('Import 3: Link wandert in die Notiz', [l3.sachen[2].name, l3.sachen[2].notiz.startsWith('https://esim.example/peru')], ['ESIM', true]);
  pruefe('Import: einfache Zeilen ohne Aufzählung', parseListe('Zahnbürste\nDeo\n\nSocken').sachen.map(s => s.name), ['Zahnbürste', 'Deo', 'Socken']);
  pruefe('Import: Aufzählungszeichen und Symbole', parseListe('Kleidung\n• Pulli\n☑ Socken\n☐ Mütze\n1. Schal').sachen.map(s => [s.name, s.gepackt, s.abschnitt]),
    [['Pulli', false, 'Kleidung'], ['Socken', true, 'Kleidung'], ['Mütze', false, 'Kleidung'], ['Schal', false, 'Kleidung']]);
  pruefe('Import: „(offen)“ ist keine Person', parseUeberschrift('Kleidung (offen)'), { abschnitt: 'Kleidung', person: '' });
  pruefe('Import: Klammer mit Kleinbuchstaben ist keine Person', parseUeberschrift('Proviant (für unterwegs)'), { abschnitt: 'Proviant (für unterwegs)', person: null });

  {
    const r = neueReise({ name: 'Archiv' });
    uebernimmGeparst(r, l1, { archiv: true, standardPerson: r.personen[0].id });
    pruefe('Archiv: Person wird über den Namen zugeordnet (Markus = ich)', [r.personen.length, r.sachen.every(s => s.person === r.personen[0].id)], [1, true]);
    pruefe('Archiv: Haken und Bewertungen bleiben', [r.sachen.filter(s => s.gepackt).length, r.sachen.filter(s => s.bewertung === 'nie').map(s => s.name)], [5, ['Mini-Flauschi']]);
    const v = neueReise({ name: 'Vorlage' });
    uebernimmGeparst(v, l1, { standardPerson: v.personen[0].id });
    pruefe('Vorlage: alles ungepackt, ohne Bewertung', [v.sachen.some(s => s.gepackt), v.sachen.some(s => s.bewertung)], [false, false]);
  }
  sauber();

  /* ---------- Text-Export und wieder einlesen ---------- */
  {
    const r = neueReise({ name: 'Rundreise', personen: ['L.'] });
    const [m, l] = r.personen;
    const a = abschnittHinzu(r, 'Wanderung');
    sacheHinzu(r, { name: 'Stirnlampe', person: m.id, abschnitt: a.id, gepackt: true, bewertung: 'nie', notiz: 'Akku reicht' });
    sacheHinzu(r, { name: 'Socken', person: l.id, abschnitt: a.id, menge: 5, vielleicht: true });
    sacheHinzu(r, { name: 'Reiseadapter', person: null, abschnitt: null });
    const text = alsText(r);
    pruefe('Export: Format', text.split('\n').slice(0, 5), ['Packliste Rundreise', '', 'Wanderung (Markus)', '- [x] Stirnlampe Anm.: nie gebraucht · Akku reicht', '']);
    const zurueck = parseListe(text);
    pruefe('Export → Import: Titel, Abschnitte, Personen', [zurueck.titel, zurueck.abschnitte, zurueck.personen], ['Rundreise', ['Wanderung', 'Ohne Abschnitt'], ['Markus', 'L.']]);
    pruefe('Export → Import: Sachen ohne Verlust', zurueck.sachen.map(s => [s.name, s.menge, s.gepackt, s.vielleicht, s.bewertung, s.person]),
      [['Stirnlampe', null, true, false, 'nie', 'Markus'], ['Socken', 5, false, true, null, 'L.'], ['Reiseadapter', null, false, false, null, '']]);
    const neu = neueReise({ name: 'Wieder' });
    uebernimmGeparst(neu, zurueck, { archiv: true, standardPerson: neu.personen[0].id });
    pruefe('Export → Import: „(offen)“ bleibt unverteilt', neu.sachen.find(s => s.name === 'Reiseadapter').person, null);
  }
  sauber();

  /* ---------- Übernahme aus früheren Reisen ---------- */
  {
    const japan = neueReise({ name: 'Japan', start: '2025-04-01', ende: '2025-04-20', personen: ['L.'] });
    const peru = neueReise({ name: 'Peru', start: '2026-03-01', ende: '2026-03-20', personen: ['L.'] });
    const [jm, jl] = japan.personen, [pm, pl] = peru.personen;
    const jw = abschnittHinzu(japan, 'Wanderung'), pw = abschnittHinzu(peru, 'Wanderung');
    sacheHinzu(japan, { name: 'Stirnlampe', person: jm.id, abschnitt: jw.id, gepackt: true, bewertung: 'gebraucht' });
    sacheHinzu(japan, { name: 'Flauschi', person: jm.id, gepackt: true, bewertung: 'nie' });
    sacheHinzu(japan, { name: 'Socken', person: jl.id, menge: 5 });
    sacheHinzu(peru, { name: 'Stirnlampe', person: pm.id, abschnitt: pw.id, gepackt: true, bewertung: 'nie', notiz: 'Hütten hatten Licht' });
    sacheHinzu(peru, { name: 'Socken', person: pl.id, menge: 9 });
    sacheHinzu(peru, { name: 'Socken', person: pm.id, menge: 7 });
    const k = kandidatenAus([japan, peru]);
    const stirn = k.find(x => x.name === 'Stirnlampe');
    pruefe('Übernahme: Doppelte zusammengefasst (Name + Person)', k.map(x => `${x.name}|${x.person}`).sort(), ['Flauschi|Markus', 'Socken|L.', 'Socken|Markus', 'Stirnlampe|Markus']);
    pruefe('Übernahme: neueste Reise gibt Notiz und Menge vor', [stirn.notiz, k.find(x => x.name === 'Socken' && x.person === 'L.').menge], ['Hütten hatten Licht', 9]);
    pruefe('Übernahme: Verlauf neueste zuerst', stirn.verlauf.map(v => [v.reise, v.bewertung]), [['Peru', 'nie'], ['Japan', 'gebraucht']]);
    pruefe('Übernahme: Verlaufstext', verlaufText(stirn), 'Peru: nie gebraucht · Japan: gebraucht');
    pruefe('Übernahme: „nie“ nach der letzten Reise', k.filter(x => x.nie).map(x => x.name).sort(), ['Flauschi', 'Stirnlampe']);
    pruefe('Bibliothek: neueste Reise gibt die Menge vor, Häufigkeit zählt', [bibliothek().get('stirnlampe').anzahl, bibliothek().get('socken').menge], [2, 9]);
    const ziel = neueReise({ name: 'Island' });   // nur ich
    uebernimmKandidaten(ziel, k, { standardPerson: ziel.personen[0].id });
    pruefe('Übernahme: fehlende Person → ich, ohne doppelte Socken', ziel.sachen.map(s => s.name).sort(), ['Flauschi', 'Socken', 'Stirnlampe']);
    pruefe('Übernahme: meine eigenen Socken gehen vor', ziel.sachen.find(s => s.name === 'Socken').menge, 7);
    pruefe('Übernahme: Abschnitt wird angelegt, alles ungepackt', [ziel.abschnitte.map(a => a.name), ziel.sachen.some(s => s.gepackt || s.bewertung)], [['Wanderung'], false]);
    const zwei = neueReise({ name: 'Chile', personen: ['L.'] });
    uebernimmKandidaten(zwei, k, { standardPerson: zwei.personen[0].id });
    pruefe('Übernahme: Personen über den Namen', zwei.sachen.filter(s => s.name === 'Socken').map(s => [personVon(zwei, s.person).name, s.menge]).sort(), [['L.', 9], ['Markus', 7]]);
    pruefe('Bekannte Personen ohne mich', bekanntePersonen(), ['L.']);
    pruefe('Vorschläge: frühere Reisen zuerst', vorschlaege('Sti').map(v => [v.name, v.quelle])[0], ['Stirnlampe', 'reisen']);
    pruefe('Vorschläge: dann Katalog', vorschlaege('Sonnenc').slice(0, 1).map(v => [v.name, v.quelle]), [['Sonnencreme', 'katalog']]);
    pruefe('Vorschläge: schon vorhandenes wird ausgelassen', vorschlaege('Sti', new Set(['stirnlampe'])).some(v => v.name === 'Stirnlampe'), false);
  }
  sauber();

  /* ---------- Übergeben, Fortschritt ---------- */
  {
    const r = neueReise({ name: 'Übergabe', personen: ['L.'] });
    const [m, l] = r.personen;
    const s = sacheHinzu(r, { name: 'Reiseadapter', person: m.id });
    sacheHinzu(r, { name: 'Pulli', person: l.id, gepackt: true });
    sacheHinzu(r, { name: 'Kappe', person: l.id, vielleicht: true });
    const zurueck = uebergeben(r, s, l.id, m.id);
    pruefe('Übergeben: Person und Markierung', [s.person, s.uebergabe.von, s.uebergabe.an, s.uebergabe.gesehen], [l.id, m.id, l.id, false]);
    pruefe('Übergeben: neu für den Empfänger', neuUebergeben(r, l.id).map(x => x.name), ['Reiseadapter']);
    pruefe('Fortschritt: Unsicheres zählt erst gepackt', fortschritt(r, l.id), { gepackt: 1, gesamt: 2 });
    zurueck();
    pruefe('Übergeben: Rückgängig', [s.person, 'uebergabe' in s], [m.id, false]);
    uebergeben(r, s, l.id, m.id);
    pruefe('Gesehen: Banner verschwindet', [alsGesehen(r, l.id), neuUebergeben(r, l.id).length], [1, 0]);
    uebergeben(r, s, null, l.id);
    pruefe('Übergeben an niemanden: unverteilt ohne Markierung', [s.person, 'uebergabe' in s], [null, false]);
  }
  sauber();

  /* ---------- Datum und Zustand ---------- */
  {
    pruefe('Datum: gleicher Monat', datumBereich('2026-10-12', '2026-10-26'), '12.–26. Okt. 2026');
    pruefe('Datum: zwei Monate', datumBereich('2026-09-28', '2026-10-04'), '28. Sept. – 4. Okt. 2026');
    pruefe('Datum: ohne Datum', datumBereich('', ''), '');
    const tag = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const zust = (start, ende, abg = false) => reiseStatus({ info: { start, ende, abgeschlossen: abg } });
    pruefe('Zustand: geplant, unterwegs, vorbei, abgeschlossen, ohne Datum',
      [zust(tag(3), tag(9)), zust(tag(-1), tag(2)), zust(tag(-9), tag(-2)), zust(tag(-9), tag(-2), true), zust('', '')],
      ['geplant', 'unterwegs', 'vorbei', 'abgeschlossen', 'geplant']);
    pruefe('Countdown', [countdownText({ info: { start: tag(12), ende: tag(20) } }), countdownText({ info: { start: tag(1), ende: tag(3) } }), countdownText({ info: { start: tag(-1), ende: tag(2) } })],
      ['in 12 Tagen', 'morgen', 'unterwegs · noch 2 Tage']);
  }

  /* ---------- Synchronisierung: Zusammenführen pro Feld, Löschen, Grabsteine ---------- */
  {
    const s0 = { id: 'a', name: 'Socken', menge: 5, gepackt: false, person: 'p1' };
    const d0 = {}; erfasse(d0, 'sachen', [s0], 100);
    const dA = kopie(d0); erfasse(dA, 'sachen', [{ ...s0, gepackt: true }], 200);
    const dB = kopie(d0); erfasse(dB, 'sachen', [{ ...s0, menge: 7 }], 210);
    const m = zusammenfuehren(dA, dB);
    pruefe('Sync: verschiedene Felder bleiben beide', kanonisch(ausDokument(m, 'sachen', [])), kanonisch([{ ...s0, menge: 7, gepackt: true }]));
    pruefe('Sync: Reihenfolge egal', kanonisch(zusammenfuehren(dB, dA)), kanonisch(m));
    pruefe('Sync: zweimal zusammenführen ändert nichts', kanonisch(zusammenfuehren(m, m)), kanonisch(m));
    const dC = kopie(d0); erfasse(dC, 'sachen', [{ ...s0, menge: 9 }], 220);
    pruefe('Sync: gleiches Feld, jüngerer Wert gewinnt', ausDokument(zusammenfuehren(dB, dC), 'sachen', [])[0].menge, 9);
    const weg = kopie(d0); erfasse(weg, 'sachen', [], 200);
    pruefe('Sync: Löschen', ausDokument(zusammenfuehren(d0, weg), 'sachen', []), []);
    pruefe('Sync: späteres Ändern rettet die ganze Sache', kanonisch(ausDokument(zusammenfuehren(weg, dB), 'sachen', [])), kanonisch([{ ...s0, menge: 7 }]));
    const wegSpaet = kopie(d0); erfasse(wegSpaet, 'sachen', [], 300);
    pruefe('Sync: späteres Löschen gewinnt', ausDokument(zusammenfuehren(dB, wegSpaet), 'sachen', []), []);
    pruefe('Sync: alter Grabstein fällt weg', Object.keys(zusammenfuehren(weg, {}, 200 + 61 * 864e5).sachen), []);
    // Übergeben auf einem Gerät, gleichzeitig abhaken auf dem anderen
    const uA = kopie(d0); erfasse(uA, 'sachen', [{ ...s0, person: 'p2', uebergabe: { von: 'p1', an: 'p2', t: 1, gesehen: false } }], 300);
    const uB = kopie(d0); erfasse(uB, 'sachen', [{ ...s0, gepackt: true }], 310);
    const u = ausDokument(zusammenfuehren(uA, uB), 'sachen', [])[0];
    pruefe('Sync: Übergeben und Abhaken gleichzeitig', [u.person, u.uebergabe.an, u.gepackt], ['p2', 'p2', true]);
    const uC = kopie(uA); erfasse(uC, 'sachen', [{ ...s0, person: 'p2' }], 400);
    pruefe('Sync: entferntes Feld wird übertragen', 'uebergabe' in ausDokument(zusammenfuehren(uA, uC), 'sachen', [])[0], false);
    const i0 = {}; erfasse(i0, 'info', { name: 'Peru', start: '2026-10-12' }, 100);
    const i1 = kopie(i0); erfasse(i1, 'info', { name: 'Peru & Bolivien', start: '2026-10-12' }, 200);
    pruefe('Sync: Reise-Infos', ausDokument(zusammenfuehren(i0, i1), 'info', {}), { name: 'Peru & Bolivien', start: '2026-10-12' });
    const obj = { id: 'a', name: 'Socken' };
    const erg = ausDokument(m, 'sachen', [obj]);
    pruefe('Sync: Objekte bleiben dieselben (offene Blätter)', erg[0] === obj && obj.menge === 7, true);
    pruefe('Sync: nichts geändert wird nicht erfasst', erfasse(kopie(m), 'sachen', ausDokument(m, 'sachen', []), 999), false);
    pruefe('Sync: Uhr läuft nie rückwärts', (() => { const st = { uhr: Date.now() + 1e7 }; return syncUhr(st) > Date.now() + 1e7 - 1; })(), true);

    // Gleichzeitig dieselbe Sache auf zwei Geräten eingetragen
    const r = pruefeReise({ id: 'x', info: { name: 'X' }, personen: [{ id: 'p1', name: 'M' }] });
    const t = Date.now();
    r.sachen = [{ id: 'b', name: 'Deo', person: 'p1', erstellt: t, geraet: 'g1', menge: null }, { id: 'a', name: 'deo', person: 'p1', erstellt: t + 1000, geraet: 'g2', menge: 2, notiz: 'klein' }];
    pruefe('Doppelte von zwei Geräten werden zusammengefasst', [fasseDoppelteZusammen(r), r.sachen.map(s => [s.id, s.menge, s.notiz])], [true, [['a', 2, 'klein']]]);
    r.sachen = [{ id: 'b', name: 'Deo', person: 'p1', erstellt: t, geraet: 'g1' }, { id: 'a', name: 'Deo', person: 'p1', erstellt: t, geraet: 'g1' }];
    pruefe('Bewusst doppelt auf einem Gerät bleibt doppelt', [fasseDoppelteZusammen(r), r.sachen.length], [false, 2]);
  }

  /* ---------- Verschlüsselung ---------- */
  {
    const schluessel = neuerSyncSchluessel();
    const a = await syncSchluessel(schluessel), b = await syncSchluessel(schluessel), c = await syncSchluessel(neuerSyncSchluessel());
    pruefe('Schlüssel: 22 Zeichen, Raum-ID 43 Zeichen, gleich auf allen Geräten', [schluessel.length, a.raum.length, a.raum === b.raum, a.raum === c.raum], [22, 43, true, false]);
    const doc = { sachen: { a: { f: { name: ['Stirnlampe', 1] } } } };
    const geheim = await verschluessele(doc, a.aes);
    pruefe('Verschlüsselung: Rundweg', await entschluessele(geheim, b.aes), doc);
    pruefe('Verschlüsselung: Server sieht keinen Klartext', geheim.includes('Stirnlampe') || atob(geheim.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(geheim.length / 4) * 4, '=')).includes('Stirnlampe'), false);
    let fehler = '';
    try { await entschluessele(geheim, c.aes); } catch (e) { fehler = e.name; }
    pruefe('Verschlüsselung: falscher Schlüssel scheitert', fehler, 'OperationError');
    pruefe('Einladungslink erkennen', [linkAus(`https://x.example/Packliste/#r=${schluessel}`), linkAus('#r=kurz'), linkAus('nichts')], [schluessel, null, null]);
  }

  /* ---------- Sicherung ---------- */
  {
    sauber();
    const r = neueReise({ name: 'Sicher', personen: ['L.'] });
    sacheHinzu(r, { name: 'Pass', person: r.personen[1].id, gepackt: true });
    reiseEintrag(r.id).schluessel = 'abcdefghijklmnopqrstuv';
    S.korrekturen = { quxzlt: 'freizeit' };
    const d = kopie(sicherungsDaten());
    sauber();
    const n = sicherungEinspielen(d);
    const r2 = REISEN.get(r.id);
    pruefe('Sicherung: Rundweg', [n, r2.info.name, r2.sachen[0].name, r2.sachen[0].gepackt, reiseEintrag(r.id).schluessel, S.korrekturen.quxzlt],
      [1, 'Sicher', 'Pass', true, 'abcdefghijklmnopqrstuv', 'freizeit']);
    let fehler = '';
    try { sicherungEinspielen({ foo: 1 }); } catch (e) { fehler = e.message; }
    pruefe('Sicherung: fremdes Format wird abgelehnt', fehler, 'Format');
  }
  sauber();

  /* ---------- Oberfläche: Ansicht nach Abschnitten und Kategorien ---------- */
  {
    const r = neueReise({ name: 'Ansicht', personen: ['L.'] });
    const [m, l] = r.personen;
    const wand = abschnittHinzu(r, 'Wanderung'), stadt = abschnittHinzu(r, 'Stadt');
    sacheHinzu(r, { name: 'Zahnbürste', person: m.id, abschnitt: stadt.id });
    sacheHinzu(r, { name: 'Wanderschuhe', person: m.id, abschnitt: wand.id });
    sacheHinzu(r, { name: 'Stirnlampe', person: m.id, abschnitt: wand.id, gepackt: true });
    sacheHinzu(r, { name: 'Socken', person: m.id, abschnitt: stadt.id });
    sacheHinzu(r, { name: 'T-Shirts', person: m.id, abschnitt: null, menge: 5 });
    sacheHinzu(r, { name: 'Pulli', person: l.id, abschnitt: stadt.id });
    UI.seite = 'reise'; UI.reiseId = r.id; UI.person = m.id;
    S.einstellungen.ansicht = 'abschnitte';
    render();
    const gruppen = () => $$('#main .gruppe .g-name').map(e => e.textContent);
    const namen = () => $$('#main .gruppe').map(g => [$('.g-name', g).textContent, $$('.name', g).map(n => n.textContent)]);
    pruefe('Ansicht Abschnitte: eigene Reihenfolge, „Ohne Abschnitt“ zuletzt', gruppen(), ['Wanderung', 'Stadt', 'Ohne Abschnitt']);
    pruefe('Ansicht Abschnitte: Gepacktes nach unten', namen()[0], ['Wanderung', ['Wanderschuhe', 'Stirnlampe']]);
    pruefe('Ansicht Abschnitte: nur die gewählte Person', $$('#main .name').map(n => n.textContent).includes('Pulli'), false);
    $('[data-akt="ansicht"][data-wert="kategorien"]').click();
    pruefe('Umschalten auf Kategorien', [S.einstellungen.ansicht, gruppen()], ['kategorien', ['Kleidung', 'Schuhe', 'Kosmetik & Hygiene', 'Ausrüstung & Gepäck']]);
    pruefe('Kategorien: alphabetisch innerhalb der Kategorie', namen()[0], ['Kleidung', ['Socken', 'T-Shirts']]);
    S.einstellungen.kategorien = ['ausruestung', ...KAT_IDS.filter(k => k !== 'ausruestung')];
    render();
    pruefe('Kategorien: eigene Reihenfolge aus den Einstellungen', gruppen()[0], 'Ausrüstung & Gepäck');
    S.einstellungen.kategorien = [...KAT_IDS];
    UI.person = 'alle'; render();
    pruefe('Alle: Sachen aller Personen, mit Kürzel', [$$('#main .name').length, $$('#main .item .avatar').length], [6, 6]);
    S.einstellungen.gepacktAusblenden = true; UI.person = m.id; render();
    pruefe('Gepacktes ausblenden', [$$('#main .name').map(n => n.textContent).includes('Stirnlampe'), !!$('#main [data-akt="ausblenden"]')], [false, true]);
    S.einstellungen.gepacktAusblenden = false;
    // Neue Sache eintippen: Kategorie automatisch, Abschnitt aus der Auswahl
    S.einstellungen.ansicht = 'abschnitte'; UI.abschnitt[r.id] = wand.id; render();
    eintragen('2 Merino-Shirts, Ladegeret');
    const neu = r.sachen.slice(-2);
    pruefe('Eintippen: Menge, Person, Abschnitt', neu.map(s => [s.name, s.menge, s.person === m.id, s.abschnitt === wand.id]), [['Merino-Shirts', 2, true, true], ['Ladegeret', null, true, true]]);
    pruefe('Eintippen: Kategorie automatisch (auch mit Tippfehler)', neu.map(kategorieVon), ['kleidung', 'elektronik']);
    eintragen('merino-shirts');
    pruefe('Eintippen: schon vorhandenes wird nicht doppelt angelegt', r.sachen.filter(s => kompakt(s.name) === 'merinoshirts').length, 1);
    eintragen('zahnseide');
    pruefe('Eintippen: Großschreibung am Anfang', r.sachen.at(-1).name, 'Zahnseide');
    UI.person = 'alle'; render();
    eintragen('Kartenspiel');
    pruefe('Eintippen unter „Alle“: unverteilt', r.sachen.at(-1).person, null);
    UI.seite = 'start'; UI.reiseId = null;
  }
  sauber();

  const fehler = ergebnisse.filter(e => !e.ok);
  document.body.className = '';
  document.body.innerHTML = `<div class="testbericht"><h2>Selbsttest: ${ergebnisse.length - fehler.length}/${ergebnisse.length} bestanden</h2>
    ${ergebnisse.map(e => `<div class="${e.ok ? 'ok' : 'fehler'}">${e.ok ? 'OK  ' : 'FEHLER'} ${esc(e.titel)}${e.ok ? '' : `<br>&nbsp;&nbsp;ist:  ${esc(JSON.stringify(e.ist))}<br>&nbsp;&nbsp;soll: ${esc(JSON.stringify(e.soll))}`}</div>`).join('')}</div>`;
  document.title = `Test ${ergebnisse.length - fehler.length}/${ergebnisse.length}`;
  window.TESTERGEBNIS = { bestanden: ergebnisse.length - fehler.length, gesamt: ergebnisse.length, fehler };
}
