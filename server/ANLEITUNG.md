# Sync-Server einrichten (Cloudflare, einmalig, ca. 10 Minuten)

Gemeinsames Packen braucht einen kleinen Server, der die **verschlüsselten** Reisen zwischen den iPhones weitergibt.
Er läuft kostenlos in deinem Cloudflare-Konto, neben dem Server der Einkaufsliste. Die Mitreisenden brauchen kein Konto.
Alles geht im Browser, installiert wird nichts.

Der Server kann die Listen nicht lesen: Der Schlüssel steckt nur in der Einladung (Link oder QR-Code) und verlässt die
Geräte nie. Gespeichert werden je gemeinsamer Reise ein unlesbarer Datenblock und eine Versionsnummer.

Warum ein eigener Server und nicht der der Einkaufsliste? Der löscht Räume, die drei Monate niemand geändert hat.
Vergangene Reisen ruhen oft länger und sollen beim nächsten Packen noch da sein.

## 1. Datenbank anlegen
1. Auf <https://dash.cloudflare.com> anmelden.
2. Links **Storage & Databases → D1 SQL Database** → **Create** (bzw. „Create database“).
3. Name: `packliste` → **Create**.
4. In der Datenbank den Reiter **Console** öffnen, diese eine Zeile einfügen und **Execute** drücken:
   ```sql
   CREATE TABLE IF NOT EXISTS reise (id TEXT PRIMARY KEY, version INTEGER NOT NULL, daten TEXT NOT NULL, geaendert INTEGER NOT NULL);
   ```
   Danach steht unter „Tables“ die Tabelle `reise`. (Keine Zeilen mit `--`-Kommentaren einfügen: Die Konsole zieht den
   Text zu einer Zeile zusammen, dann verschluckt der Kommentar den Rest.)

## 2. Worker anlegen
1. Links **Compute (Workers) → Workers & Pages** → **Create** → **Worker** („Start with Hello World“).
2. Name: `packliste-sync` → **Deploy**.
3. **Edit code**: den ganzen Beispielcode löschen, den Inhalt von [`worker.js`](worker.js) einfügen → **Deploy**.

## 3. Datenbank mit dem Worker verbinden
1. Im Worker **Settings → Bindings** → **Add** → **D1 database**.
2. Variable name: `DB` (genau so, in Großbuchstaben), Database: `packliste` → **Save** bzw. **Deploy**.

## 4. Prüfen
Die Adresse des Workers steht oben in der Übersicht, etwa `https://packliste-sync.<name>.workers.dev`
(bei der Einkaufsliste war es `https://einkaufsliste-sync.56nr5tc89d.workers.dev`, hier also vermutlich
`https://packliste-sync.56nr5tc89d.workers.dev`). Im Browser öffnen:

```
https://packliste-sync.<name>.workers.dev/r/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

- `{"fehler":"unbekannt"}` → alles richtig (diese Reise gibt es nur nicht).
- `{"fehler":"Server"}` → die Bindung `DB` aus Schritt 3 fehlt oder heißt anders, oder die Tabelle aus Schritt 1 fehlt.

## 5. Adresse eintragen
Die Worker-Adresse an Claude geben. Sie kommt als `SYNC_URL_STANDARD` in `sync.js`. Danach ist in der App der Knopf
„Mitreisende einladen“ aktiv.

## Gut zu wissen
- **Kosten**: Das Gratis-Kontingent von Workers und D1 reicht um ein Vielfaches: Die App fragt nur bei der gerade
  offenen Reise alle 10 Sekunden nach, und nur solange sie offen ist.
- **Erlaubte Herkunft**: `worker.js` nimmt Anfragen nur von `https://ym52jyt288-sys.github.io` an (und von
  `localhost:8766` zum Testen). Zieht die App um, die Liste `ERLAUBT` oben in `worker.js` anpassen und erneut „Deploy“.
- **Wer den Link hat, kann mitpacken.** Ist eine Einladung in falsche Hände geraten: Reise → „…“ → „Reise löschen“ →
  „Für alle löschen“ und die Reise neu anlegen (z. B. über „Aus früheren Reisen übernehmen“).
