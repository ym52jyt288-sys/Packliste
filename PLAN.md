# Packliste – Plan und Stand

## Stand — 10.10.2026

**Online unter https://ym52jyt288-sys.github.io/Packliste/** (GitHub Pages, Repo `ym52jyt288-sys/Packliste`, Branch `main`).
Sync-Server: `https://packliste-sync.56nr5tc89d.workers.dev` (Cloudflare-Konto des Nutzers, Worker `packliste-sync`,
D1-Datenbank `packliste`). Prüfung auf dem iPhone durch den Nutzer steht noch aus. `APP_VERSION` / `sw.js` VERSION: 3.

**Version 3 (10.10.2026): Tippen auf eine Sache öffnet das Detailblatt zuverlässig.** Vorher öffnete nur gut die Hälfte
der Zeile das Blatt, ein Viertel reagierte gar nicht (Lücke neben dem Haken, Rand oben/unten, Avatar). Safari sucht bei
einem Tipp ins Leere schräg links oben nach einem Ziel und traf dabei oft den Haken oder die Gruppe. Dazu kamen verschluckte
Tipps. Behoben:
- Die ganze Zeile ist die Tippfläche (`data-akt="details"` am `.item`), der Haken reicht über die volle Zeilenhöhe.
- Der Klick-Handler hängt an `#kopf`, `#main` und `#unten` statt am `document`. So gilt für Safari die Liste als stabiles
  Tippziel, das beim Neuzeichnen bestehen bleibt.
- Neuzeichnen aus dem Hintergrund (Abgleich, Umsortieren nach dem Haken, Blatt zu) wartet, bis der Finger 300 ms weg ist
  (`renderInRuhe()`). Der Kopf schreibt beim 10-s-Abgleich nur Geändertes (`setzeHTML()`).
- Eine aufgewischte Zeile bleibt nach dem Neuzeichnen offen. Vorher war sie unsichtbar zu und schluckte den nächsten Tipp.
- Ein Blatt nimmt beim Ausblenden keine Tipps mehr an. Die nächste Sache lässt sich sofort antippen.
- `touch-action: manipulation` (kein Warten auf Doppeltipp), Zeilentext nicht markierbar (längeres Drücken bleibt ein
  Tipp), Zeile leuchtet beim Antippen kurz auf.

| Datei | Zweck |
|---|---|
| `index.html` | Gerüst, Meta-Tags, CSS (Tokens hell/dunkel, Akzent Reiseblau `#1f5f8b`) |
| `katalog.js` | 10 Kategorien mit Linien-Icon, ≈1.570 Begriffe/Synonyme (`|` Synonym, `~` Falschschreibung) |
| `daten.js` | Datenmodell, Speicher (`pl.`), `klassifiziere()`, Text-Import/-Export, Übernahme, Sicherung. **`APP_VERSION`** |
| `sync.js` | Sync-Kern aus der Einkaufsliste, ein Raum pro Reise. `SYNC_URL_STANDARD` = Worker-Adresse |
| `app.js` | Oberfläche: Start, Reise, Blätter, Wischen, Toasts, Einladen/Beitreten, Einstellungen |
| `test.js` | Selbsttest (`index.html?test`), nur bei `?test` geladen |
| `sw.js` | Offline-Cache. **Bei jeder Änderung `VERSION` erhöhen** (gleiche Zahl wie `APP_VERSION`) |
| `manifest.webmanifest`, `icon.svg` → `icon-180.png`, `icon-512.png` | Home-Bildschirm (PNGs mit `werkzeuge/icons.mjs`) |
| `vendor/qrcode.min.js` | qrcode-generator 1.4.4 (aus der Einkaufsliste), Einladungs-QR-Code |
| `server/` | `worker.js` (Cloudflare Worker, D1-Bindung `DB`, Tabelle `reise`), `schema.sql`, `ANLEITUNG.md` |
| `werkzeuge/` | `server.mjs` (App :8766 + echter worker.js mit D1-Nachbau :8767), `chrome.mjs` (Headless Chrome per CDP), `selbsttest.mjs`, `rundgang.mjs` (Screenshots), `zwei-geraete.mjs`, `tippen.mjs` (Antippen per Touch), `icons.mjs` |
| `privat/` | Deine Beispiellisten zum Testen. **Nicht im Repo** (`.gitignore`) |

### Geprüft (Mac, Headless Chrome 150)
- Tipp-Test **24/24** (`werkzeuge/tippen.mjs`, Version 3): Ränder, Lücke und Avatar öffnen das Detailblatt, Haken über die
  volle Höhe, kein Neuzeichnen unter dem Finger, offene Wisch-Zeile, Tipp während ein Blatt ausblendet, Aufleuchten.
  Gegenprobe mit Version 2: 8 von 13 dieser Prüfungen scheitern dort.
- Selbsttest **211/211**: alle ≈70 Sachen der drei Beispiellisten in der erwarteten Kategorie, Tippfehler, zusammengesetzte
  Wörter, Korrektur vor Katalog, Lernen aus früheren Reisen, Mengen, Mehrfacheingabe, Bewertung aus „Anm.: …“,
  Text-Import in allen drei Formaten, Export → Import, Übernahme (Doppelte, Verlauf, „nie“-Filter, Personen über den Namen),
  Übergabe und Rückgängig, Datum/Zustand, Zusammenführen pro Feld, Verschlüsselung, Sicherung, Ansicht Abschnitte/Kategorien,
  Eintippen mit automatischer Kategorie.
- UI-Rundgang bei 390 px hell und dunkel (`werkzeuge/rundgang.mjs`, 29 Screenshots) mit den echten Beispiellisten:
  Willkommen, Import, neue Reise aus drei früheren Reisen, Übernahme, Kategorien-Ansicht, Packen, Wischen, Übergeben,
  Banner beim Empfänger, Vorschläge, Detailblatt, Kategorie-Wahl, Menü, Auswerten, Einstellungen.
- Zwei-Geräte-Test **19/19** (`werkzeuge/zwei-geraete.mjs`): getrennte Speicher (localhost / 127.0.0.1) gegen den echten
  `worker.js` mit D1-Nachbau. Einladen per Oberfläche, Beitreten per Link als „L.“, Übergabe-Banner kommt von selbst
  (10-s-Abgleich), Haken zurück, gleichzeitige Änderungen mit 409, Offline-Phase, Löschen, Server sieht keinen Klartext,
  „Für alle löschen“.
- Echter Worker (09.10.2026): `curl` für 404, Anlegen, doppeltes Anlegen (409), Ändern, veralteter Stand (409),
  `unveraendert`, Löschen, CORS für GitHub Pages; Zwei-Geräte-Test gegen den echten Worker **17/17** (die zwei
  Server-Speicher-Prüfungen gehen nur lokal). Testräume wurden am Ende gelöscht.

### Offen
- **Nur auf dem iPhone prüfbar**: Antippen der Sachen (Version 3), Home-Bildschirm, Flugmodus, Wischen mit dem Finger, Datumsauswahl, echte Übergabe
  zwischen zwei iPhones, Einladung per Nachricht → „Einladung öffnen“ in der Home-Bildschirm-App.
- Runde 2 (Komfort, noch nicht gebaut): automatisches Einladen über ein persönliches „Postfach“, Sicherungsschlüssel für ein
  neues iPhone, QR-Scan in der App (zxing), mehrere Sachen auf einmal übergeben.

### Abweichungen vom Entwurf unten
| Thema | Entwurf | Umsetzung |
|---|---|---|
| Ansicht „Kategorien“ | — | zeigt den Abschnitt nicht mehr unter jeder Sache (war zu unruhig) |
| Übernahme in eine Reise mit weniger Personen | — | fehlt die Person, bekommt die Sache „ich“; eigene Sachen gehen vor, nichts doppelt |
| Gleichzeitig eingetragen | — | `fasseDoppelteZusammen()` nur bei verschiedenen Geräten innerhalb von 10 Minuten |
| Übergeben | Wischen oder Detailblatt | zusätzlich: Person im Detailblatt ändern zählt als Übergabe |

### Testen
```
node werkzeuge/server.mjs &                                   # App :8766, Worker :8767
node --experimental-websocket werkzeuge/selbsttest.mjs        # Test n/m
node --experimental-websocket werkzeuge/rundgang.mjs <ordner> # Screenshots 390 px
node --experimental-websocket werkzeuge/zwei-geraete.mjs      # WORKER=https://… für den echten Worker
node --experimental-websocket werkzeuge/tippen.mjs            # Antippen mit Touch-Ereignissen
```

---

## Entwurf (freigegeben am 09.10.2026)

## Kontext

Bisher führst du deine Packlisten als Text-Checklisten, z. B. in Notizen. Pro Reise und Person gibt es eine Liste, die Kategorien heißen etwa „Stadt – Kleidung“, „Wanderung“ oder „Gleich anziehen“. Nach der Reise schreibst du Erfahrungen dazu („Anm.: nie gebraucht“, „Tube war zu klein“). Daraus soll eine App werden, die auf dem iPhone einfach zu bedienen und sauber gestaltet ist. Sie soll:

- Packlisten anlegen und beim Packen abhaken,
- **frühere Packlisten wiederverwenden**, samt der Erfahrungen von damals,
- Sachen **an Mitreisende übergeben**, sodass sie live auf deren iPhone erscheinen,
- jede Sache **automatisch einer Kategorie zuordnen** (Kleidung, Kosmetik, Medikamente …) wie bei der Einkaufsliste. Die Liste lässt sich auf eine Ansicht **sortiert nach diesen Kategorien** umschalten.

Deine Entscheidungen:
- **Web-App (PWA)**, über Safari zum Home-Bildschirm hinzugefügt, läuft auch offline.
- **Gemeinsame Reise live**.
- **Cloudflare wie bei der Einkaufsliste**, weil du dort schon ein Konto hast.

Deshalb übernimmt die Packliste den Aufbau von `~/Claude/Einkaufsliste`:
- kein Build-Schritt, Vanilla-JS, GitHub Pages,
- Service Worker mit `VERSION`,
- Selbsttest per `?test`,
- Sync ohne Nutzerkonto über einen Cloudflare Worker mit D1. Die Daten werden Ende-zu-Ende verschlüsselt, der Schlüssel steckt nur im Einladungslink.

## Architektur

**Ort:** `~/Claude/Packliste/`. Das wird ein Git-Repo, veröffentlicht unter `https://ym52jyt288-sys.github.io/Packliste/`. Das ist dieselbe Herkunft wie bei der Einkaufsliste.

| Datei | Inhalt |
|---|---|
| `index.html` | Gerüst, Meta-Tags und CSS. Design-Tokens hell/dunkel wie in der Einkaufsliste, Akzent in Reiseblau statt Grün |
| `app.js` | Oberfläche: Bildschirme, Blätter, Wischen, Toasts |
| `daten.js` | Datenmodell, Speichern (localStorage, Präfix `pl.`), Wiederverwenden, Auswertung, Text-Import und -Export |
| `sync.js` | Sync-Kern aus der Einkaufsliste, erweitert auf **einen Raum pro Reise** |
| `katalog.js` | Die 10 Kategorien mit SVG-Icon und etwa 500 Reise-Begriffe samt Synonymen und Falschschreibungen, im selben Format wie `Einkaufsliste/katalog.js` (siehe „Automatische Kategorien“) |
| `test.js` | Selbsttest, wird nur bei `?test` geladen |
| `sw.js`, `manifest.webmanifest`, `icon.svg` → `icon-180.png`, `icon-512.png` | Offline-Betrieb und Home-Bildschirm |
| `vendor/qrcode.min.js` | Kopie aus der Einkaufsliste, für den Einladungs-QR-Code |
| `server/worker.js`, `server/schema.sql`, `server/ANLEITUNG.md` | Sync-Server, angepasste Kopie aus der Einkaufsliste |
| `PLAN.md` | Plan mit „Stand“ oben, wie bei der Einkaufsliste |

**Aus `Einkaufsliste/index.html` wiederverwendet:**
- **Sync-Kern:** `kanonisch`, `textHash`, `syncUhr`, `erfasse`, `zusammenfuehren`, `eintragWert`, `ausDokument`, `syncSchluessel` (mit Salt `packliste`), `verschluessele`/`entschluessele`, `syncAnfrage` sowie die Schleife aus `synchronisiere()` mit GET `?v=`, Zusammenführen, PUT mit `basis` und 409-Wiederholung.
- **Klassifizierung:** `norm`, `kompakt`, `staemme`, `exakt`, `distanz`, `naechsterTreffer`, `erkenne` und `klassifiziere` (ab Zeile ~740) sowie der Aufbau von `INDEX` aus dem Katalog.
- **Oberfläche:** `oeffneBlatt`/`schliesseBlatt`, `zeigeToast` mit „Rückgängig“, `wischen()`, `teile()`, `qrSvg`.
- **Links und Daten:** `linkAusAdresse`/`oeffneBeitreten` mit dem Hinweis, dass Safari und die Home-Bildschirm-App getrennte Speicher haben, außerdem `exportieren`/`importieren`.
- **Rahmen:** Muster des Selbsttests, Theme-Umschaltung und Safe-Area-CSS.

**Sync-Server:** Ein neuer Worker `packliste-sync` mit eigener D1-Datenbank `packliste`. Der Code ist `worker.js` aus der Einkaufsliste, mit drei Änderungen:
- Zähler und Statistik (`/z`, `/statistik`) entfallen.
- Es gibt keine automatische Löschung. Der Cron der Einkaufsliste löscht Räume nach drei Monaten ohne Änderung, und vergangene Reisen ruhen oft länger.
- `ERLAUBT` enthält GitHub Pages und die lokalen Testports.

Die Einrichtung im Cloudflare-Dashboard dauert etwa 10 Minuten und läuft wie bei der Einkaufsliste. Die Schritte stehen in `server/ANLEITUNG.md`.

## Datenmodell

Jede Reise ist ein eigenes synchronisiertes Dokument mit Zeitstempel pro Feld. Bei Konflikten gewinnt die jüngste Änderung, wie in der Einkaufsliste.

- `info`: `{ name, start, ende, notiz, abgeschlossen }`
- `personen`: `{ id → { name, farbe, reihenfolge } }`. Eine Person braucht kein Gerät; ein Kind ohne iPhone geht auch.
- `abschnitte`: `{ id → { name, reihenfolge } }`. Das sind deine eigenen, optionalen Gruppen wie „Wanderung“, „Stadt“ oder „Gleich anziehen“.
- `sachen`: `{ id → { name, abschnitt|null, kategorie|null, menge, notiz, person|null, gepackt, vielleicht, bewertung: 'gebraucht'|'kaum'|'nie'|null, reihenfolge, uebergabe: { von, t, gesehen } } }`. `kategorie` ist nur gesetzt, wenn jemand die automatische Kategorie von Hand geändert hat. Die Änderung wird synchronisiert, die anderen sehen sie also auch.

Nur lokal gespeichert werden:
- `pl.ich` (dein Name, Geräte-ID),
- `pl.korrekturen` (gelernte Kategorien: Name → Kategorie),
- `pl.reisen` (Index mit Reise-ID, Raumschlüssel und welche Person „ich“ bin),
- `pl.einstellungen` (Erscheinungsbild, Gepacktes nach unten oder an seinem Platz, Ansicht „Abschnitte“ oder „Kategorien“, Reihenfolge der Kategorien).

Die Bibliothek für Vorschläge wird bei Bedarf aus allen Reisen auf dem Gerät berechnet.

## Automatische Kategorien

**Die 10 Kategorien**, Reihenfolge in den Einstellungen änderbar:
1. Kleidung
2. Schuhe
3. Kosmetik & Hygiene
4. Medikamente & Erste Hilfe
5. Elektronik
6. Dokumente & Geld
7. Ausrüstung & Gepäck
8. Essen & Küche
9. Freizeit & Lesen
10. Sonstiges

**Katalog:** Etwa 500 Begriffe im Format der Einkaufsliste:
- `|` trennt Synonyme,
- `~` markiert Falschschreibungen.

Deine Wörter sind ausdrücklich dabei. Einige Beispiele:
- Flauschi, Merino-Longsleeve, Zip-Hose → Kleidung
- Hüttenschlafsack, Stirnlampe → Ausrüstung & Gepäck
- Voltaren, Bienen-Notfallset → Medikamente & Erste Hilfe
- Reiseadapter, eSIM → Elektronik
- Roter Gürtel für Wertsachen → Dokumente & Geld
- Economist, Würfel → Freizeit & Lesen

**`klassifiziere(name)`** arbeitet wie in der Einkaufsliste und prüft der Reihe nach:
1. Deine Korrektur (`pl.korrekturen`), danach die Kategorie derselben Sache in früheren Reisen.
2. Einen exakten Treffer oder ein Synonym. Vorher wird normalisiert: Kleinschreibung, Umlaute, Plural, Mengen und Farben wie „schwarzer“ oder „orange“ werden abgetrennt.
3. Das Grundwort zusammengesetzter Wörter („Kompakt**handtuch**“, „Hardshell-**Jacke**“).
4. Abkürzungen („Voltarene kle“).
5. Tippfehler über Damerau-Levenshtein.
6. Sonst „Sonstiges“, dezent markiert. Ein Tipp auf die Markierung weist die Kategorie zu. Das wird gelernt und gilt dann auch für künftige Reisen.

**Ansicht umschalten:** Oben in der Reise gibt es den Umschalter **[Abschnitte | Kategorien]**.
- „Kategorien“ sortiert die Liste nach den 10 Kategorien in fester Reihenfolge, innerhalb einer Kategorie alphabetisch.
- „Abschnitte“ zeigt deine eigene Gliederung, z. B. aus importierten Listen.
- Hat eine Reise keine Abschnitte, gibt es nur die Kategorien-Ansicht.
- Die Wahl merkt sich das Gerät.
- In beiden Ansichten steht bei jeder Gruppe Icon und Fortschritt („5/8“).

## Bedienung und Design

Schlicht, ohne Emojis, Systemschrift, Linien-Icons, große Tippflächen (mindestens 44 pt), hell und dunkel.

1. **Start „Reisen“**
   - Oben die aktuelle oder nächste Reise als Karte: Name, „in 12 Tagen“ und ein Fortschrittsbalken je Person mit Initialen.
   - Darunter „Geplant“ und „Vergangen“.
   - Unten der Knopf „Neue Reise“, oben rechts die Einstellungen.
   - Ist das Enddatum vorbei, erscheint der Hinweis „Peru ist vorbei – kurz auswerten?“.
2. **Neue Reise** (Blatt mit drei Schritten)
   - Schritt 1: Name und Ziel, Zeitraum (optional).
   - Schritt 2: Mitreisende. Du bist vorausgewählt, dazu kommen bekannte Personen aus früheren Reisen oder „+ Person“.
   - Schritt 3: Starten mit **Leer**, **Früheren Reisen** (eine oder mehrere) oder **Text einfügen**.
   - Bei früheren Reisen folgt eine Übernahme-Ansicht: alle Sachen mit Häkchen und Erfahrungen von damals, z. B. „Peru: nie gebraucht · Japan: gebraucht“. Auch hier lässt sich zwischen Abschnitten und Kategorien umschalten.
   - Mit dem Schalter „Nie Gebrauchtes weglassen“ lässt sich alles Ungenutzte abwählen. Doppelte werden über den normalisierten Namen zusammengefasst. Die neueste Fassung gibt Menge, Notiz, Abschnitt und Kategorie vor. Die Zuordnung zur Person bleibt über den Namen erhalten.
3. **Reise**
   - Kopf: Name, Zeitraum und ein Fortschrittsring.
   - Segment-Umschalter **[Markus 12/30] [L. 8/25] [Alle]**. Standard ist „ich“. Unter „Alle“ erscheinen noch nicht verteilte Sachen mit „Nehme ich“.
   - Darunter der Ansichts-Umschalter **[Abschnitte | Kategorien]** (siehe „Automatische Kategorien“). Die Gruppen lassen sich einklappen.
   - Jede Zeile hat einen runden Haken, den Namen, die Menge (×7), die Notiz klein darunter (Links anklickbar) sowie bei Bedarf die Marken „vielleicht“ (für „?“) und „von Markus“.
   - Unten ein Eingabefeld „Sache hinzufügen…“ mit Vorschlägen aus allen früheren Reisen. Die Kategorie wird automatisch gesetzt und erscheint als Chip, ein Tipp darauf ändert sie. Gibt es Abschnitte, kommt die Sache in den zuletzt benutzten Abschnitt. Nach Enter bleibt das Feld offen, so geht das Eintragen schnell.
   - Ein Tipp auf die Zeile öffnet das Detailblatt: Name, Menge, Kategorie, Abschnitt, Person, Notiz, vielleicht, Übergeben, Löschen.
   - Menü „…“: Mitreisende einladen, Reise bearbeiten, Auswerten, Als Text teilen, Löschen.
4. **Übergeben**
   - Nach links wischen → „Übergeben“ oder „Löschen“. Alternativ geht das über das Detailblatt.
   - Es öffnet sich ein Blatt mit den Mitreisenden. Nach der Auswahl wandert die Sache sofort in deren Liste. Der Toast „Wanderschuhe an L. übergeben · Rückgängig“ erlaubt das Zurücknehmen.
   - Beim Empfänger erscheint oben das Banner **„3 Sachen neu von Markus“**. Die Sachen tragen die Marke „von Markus“, bis „Alles klar“ getippt wird.
5. **Auswerten**
   - Pro gepackter Sache gibt es die Knöpfe gebraucht / kaum / nie und eine Notiz. Oben steht „12 von 40 bewertet“.
   - Diese Bewertung taucht später in der Übernahme-Ansicht wieder auf.
6. **Text-Import und -Export** in deinem bisherigen Format:
   - `- [x] Name Anm.: …`, Überschriften werden zu Abschnitten, die Kategorien kommen automatisch.
   - Personen in Klammern („Mitnehmen (Markus)“).
   - Mengen aus „(7 St.)“, „(3x)“ und „3 x“.
   - Ein „?“ am Ende wird zu „vielleicht“.
   - Aus „nie gebraucht/benutzt“ wird `bewertung: 'nie'`, aus „einmal benutzt“ wird `'kaum'`.
   - Damit holst du deine drei Beispiellisten als vergangene Reisen in die App, per Einfügen auf dem iPhone. Sie kommen nicht ins öffentliche Repo.
7. **Einstellungen**
   - Dein Name, Erscheinungsbild, Gepacktes nach unten oder an seinem Platz.
   - Reihenfolge der Kategorien und gelernte Zuordnungen (ansehen, zurücksetzen).
   - Synchronisierung: Status und verbundene Geräte.
   - Sicherung: Export und Import als JSON, z. B. in iCloud Drive.

**Gemeinsam reisen**
- „Mitreisende einladen“ erzeugt für die Reise einen Raumschlüssel. Teilen geht per Link (`…/Packliste/#r=<schlüssel>`, über das iOS-Teilen-Menü) oder per QR-Code.
- Die andere Person öffnet den Link. Nutzt sie die App vom Home-Bildschirm, fügt sie den Link dort unter „Einladung einfügen“ ein.
- Danach fragt die App „Wer bist du?“ und zeigt die Personen der Reise. Die zum eigenen Namen passende ist vorausgewählt.
- Abgeglichen wird beim Start, beim Zurückkehren in die App, bei Wiederverbindung, 1,5 s nach jeder Änderung und alle 10 s für die offene Reise.
- Offline läuft alles lokal weiter.

## Umsetzungsreihenfolge

1. **Kern, lokal:** Datenmodell, Start, Neue Reise (leer), Reise-Ansicht mit Personen, Hinzufügen mit Vorschlägen, Abhaken, Detailblatt, Übergeben zwischen Personen, Wischen, Toasts, Einstellungen, JSON-Sicherung.
2. **Automatische Kategorien:** `katalog.js`, `klassifiziere()` mit Lernen und der Umschalter Abschnitte/Kategorien.
3. **Wiederverwenden und Auswerten:** Übernahme aus früheren Reisen, Auswerten, Text-Import und -Export.
4. **Veröffentlichen:** Icon, Manifest, `sw.js`, `git init`. Du legst auf github.com das leere öffentliche Repo `Packliste` an und schaltest Pages ein (Branch `main`, Ordner `/`). Vor dem ersten Push frage ich nach. **Ab hier läuft die App auf deinem iPhone.**
5. **Gemeinsam reisen:** `server/` und ANLEITUNG. Du richtest den Worker und die Datenbank ein und gibst mir die Worker-Adresse. Dann folgen `sync.js` mit mehreren Räumen, Einladen und Beitreten, „Wer bist du?“, Übergabe-Banner und Status.
6. **Komfort (danach):**
   - Automatisches Einladen bekannter Mitreisender über ein persönliches „Postfach“. Das ist ein eigener verschlüsselter Raum je Person; sein Schlüssel steht nur in gemeinsamen Reisen. So erscheint eine neue Reise bei L. ohne neuen Link.
   - Sicherungsschlüssel für ein neues iPhone.
   - QR-Scan in der App (zxing aus der Einkaufsliste).
   - Mehrere Sachen auf einmal übergeben.
7. `PLAN.md` mit „Stand“ anlegen und einen Speicher-Eintrag für das Projekt ergänzen.

## Prüfung

- **Selbsttest `index.html?test`** läuft in Headless Chrome per DevTools-Protokoll (siehe Speicher-Eintrag „Testen ohne iPhone“ der Einkaufsliste: Node 21 braucht `--experimental-websocket`, Aufrufe mit `perl -e 'alarm …'` begrenzen). Geprüft werden:
  - Text-Parser mit allen Varianten deiner drei Listen (synthetische Testtexte),
  - Mengen,
  - **Kategorien:** Jede Sache aus deinen drei Listen (etwa 80) landet in der erwarteten Kategorie, so wie der Beispiellisten-Test der Einkaufsliste. Dazu kommen Tippfehler („Voltarene“, „Sonencreme“), zusammengesetzte Wörter, Lernen aus Korrekturen und der Vorrang der Korrektur vor dem Katalog,
  - Sortierung der Ansicht „Kategorien“ und das Umschalten auf „Abschnitte“,
  - Übernahme aus mehreren Reisen (Doppelte, Hinweise, „nie“-Filter),
  - Übergabe-Felder,
  - Export → Import ohne Verlust,
  - Zusammenführen bei gleichzeitigen Änderungen (Fälle aus der Einkaufsliste übernommen).
- **UI-Durchlauf** bei 390 px, hell und dunkel, mit Screenshots: Reise anlegen, aus früherer Reise übernehmen, Ansicht umschalten, Kategorie korrigieren, packen, übergeben, auswerten.
- **Zwei-Geräte-Simulation:** zwei iframes auf `localhost` und `127.0.0.1`, also mit getrennten Speichern, gegen den echten `worker.js` in Node mit nachgebildeter D1. Durchgespielt werden:
  - A lädt ein, B tritt als „L.“ bei,
  - A übergibt zwei Sachen und B sieht das Banner,
  - B packt und A sieht es,
  - gleichzeitige Änderungen, Offline-Phase, 409-Konflikte,
  - der Server sieht nur unlesbare Daten.
- **Echter Worker** nach deiner Einrichtung: `curl` für 404, Anlegen, 409 und CORS, dazu die Zwei-Geräte-Simulation gegen den echten Server.
- **Auf dem iPhone, durch dich:** Home-Bildschirm, Flugmodus, Wischen und echte Übergabe zwischen zwei iPhones. Ich sage bei jedem Schritt dazu, was am Mac geprüft ist und was offen bleibt.
