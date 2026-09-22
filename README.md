# Startklar

Persönlicher Arbeitsplatz für den neuen Job – eine Mischung aus Notion und Miro:
Notizen mit Formatierung, Boards, Datenbanken, Projekte, Studien, Aufgaben, Kalender und mehr.

Die App läuft komplett im Browser. **Alle Daten bleiben auf deinem Gerät** (im Browser-Speicher „IndexedDB").
Es gibt keinen Server, kein Konto, keine Cloud und **keine KI**. Im GitHub-Repository liegt nur der Programmcode, nie deine Inhalte.

**Keine Verbindung nach außen:** Schriften und alle Hilfsbibliotheken sind im Paket enthalten. Eine eingebaute
Sicherheitsregel (Content-Security-Policy) verbietet der App technisch, Daten an fremde Server zu senden oder von dort zu laden.
Einzige Ausnahme: Links, die du selbst anklickst, öffnen sich normal im Browser.

---

## Installation über GitHub Pages (empfohlen)

So bekommst du eine eigene Web-Adresse, die du wie eine App installieren kannst – auf dem Computer und auf dem Handy, auch offline nutzbar.

1. **GitHub-Konto anlegen** (falls noch nicht vorhanden) auf https://github.com.
2. **Neues Repository erstellen:** oben rechts auf „+" → „New repository".
   Name z. B. `startklar`, Sichtbarkeit **Public**, dann „Create repository".
   *(GitHub Pages für private Repositories gibt es je nach GitHub-Tarif nur in bezahlten Plänen. Da im Repository nur Code liegt, ist „Public" unproblematisch.)*
3. **Dateien hochladen:** Im neuen Repository auf „uploading an existing file" klicken und **alle Dateien und den Ordner `icons`** aus diesem Paket hineinziehen
   (`index.html`, `shim.js`, `sw.js`, `manifest.webmanifest`, `README.md`, `.nojekyll` sowie die Ordner `icons`, `lib` und `fonts`). Unten auf „Commit changes".
4. **GitHub Pages einschalten:** Im Repository auf **Settings → Pages**.
   Bei „Build and deployment" → Source: **Deploy from a branch**, Branch: **main**, Ordner: **/ (root)** → „Save".
5. Nach ein bis zwei Minuten ist die App erreichbar unter
   `https://DEIN-BENUTZERNAME.github.io/startklar/`

### Als App installieren

| Gerät | So geht's |
|---|---|
| Windows / Mac mit Chrome oder Edge | Adresse öffnen → in der Adressleiste auf das Symbol „App installieren" (Bildschirm mit Pfeil) klicken |
| iPhone / iPad (Safari) | Adresse öffnen → Teilen-Symbol → „Zum Home-Bildschirm" |
| Android (Chrome) | Adresse öffnen → Menü ⋮ → „App installieren" |

Danach startet Startklar in einem eigenen Fenster mit eigenem Symbol und funktioniert auch ohne Internet.

---

## Alternative: ohne GitHub Pages, direkt vom Rechner

1. Im Repository auf **Code → Download ZIP** (oder dieses Paket direkt verwenden) und entpacken.
2. `index.html` per Doppelklick im Browser öffnen (Chrome, Edge oder Firefox).

Das funktioniert, aber: Installation als App und Offline-Modus gibt es nur über eine Web-Adresse (GitHub Pages).
Außerdem speichert der Browser Daten **pro Adresse** – die lokal geöffnete Datei und die GitHub-Pages-Version haben getrennte Daten.

---

## Daten aus der Claude-Version übernehmen

1. In der Startklar-Version auf claude.ai: unten links auf **⋯ → „Sicherung inkl. aller Dateien"**. Es wird eine `.json`-Datei heruntergeladen.
2. In der neuen App: **⋯ → „Sicherung einspielen"** und die Datei auswählen.
   Tipp: Häkchen bei „Alle aktuellen Seiten vorher in den Papierkorb legen" setzen, dann verschwinden die Beispielseiten.

Seiten, Reiter, Boards, Datenbanken, Personen, Glossar, Erfolge, Probezeit **und hochgeladene Dateien** werden übernommen.
Die Sicherungsdatei enthält deine Inhalte – bewahre sie gut auf und lade sie nicht ins Repository hoch.

---

## Wichtig zu deinen Daten

- **Sicherungen machen:** Da alles lokal liegt, gilt: Wird der Browser-Speicher gelöscht (z. B. „Browserdaten löschen"), sind die Daten weg.
  Mach regelmäßig über **⋯ → „Sicherung inkl. aller Dateien"** eine Sicherung, z. B. einmal pro Woche.
- **Mehrere Geräte:** Es gibt keine automatische Synchronisierung. Zum Umziehen auf ein anderes Gerät: Sicherung herunterladen → auf dem anderen Gerät einspielen.
- **Speicherplatz:** **⋯ → „Speicherplatz & Daten"** zeigt, wie viel belegt ist.

---

## Updates

Neue Version einspielen: die geänderten Dateien im Repository ersetzen („Add file → Upload files", gleiche Dateinamen).
Deine Daten bleiben erhalten, weil sie nicht im Repository, sondern im Browser liegen.
Nach einem Update die App einmal neu laden (bei installierter App: schließen und wieder öffnen).

---

## Technisches

- Reine Web-App ohne Build-Schritt:
  - `index.html` – die App
  - `shim.js` – lokaler Speicher (IndexedDB), Dateien und Downloads
  - `sw.js` – Offline-Modus
  - `manifest.webmanifest` – Installation als App
  - `lib/` – Hilfsbibliotheken: mammoth (Word lesen, BSD-2), docx (Word erzeugen, MIT), jsPDF (PDF erzeugen, MIT), pdf.js (PDF lesen, Apache-2.0)
  - `fonts/` – Schriften Atkinson Hyperlegible und Bricolage Grotesque (SIL Open Font License)
- Die Lizenztexte liegen jeweils in `lib/` und `fonts/`.
- Getestet mit aktuellen Versionen von Chrome, Edge und Safari.

## Fehlerbehebung

- **Seite zeigt nach Update noch die alte Version:** Seite mit Strg+Umschalt+R (Mac: ⌘+Umschalt+R) neu laden.
- **GitHub Pages zeigt 404:** Prüfen, ob `index.html` direkt im Hauptordner des Repositories liegt (nicht in einem Unterordner) und ob Pages auf „main / (root)" steht.
- **Word-/PDF-Export funktioniert nicht:** Prüfen, ob der Ordner `lib` vollständig mit hochgeladen wurde.
