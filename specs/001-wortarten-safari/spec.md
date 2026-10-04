# Feature Specification: Wortarten-Safari

**Feature Branch**: `001-wortarten-safari`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "Wortarten-Safari (Reverse-Specification): Browser-Lernspiel für die 3. Klasse, in dem Kinder an kurzen Tier-Geschichten in vier Schritten Satzenden, Großschreibung und Wortarten entdecken, markieren und eine Auswertung mit Erklärungen erhalten."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Eine komplette Safari spielen und Punkte sammeln (Priority: P1)

Ein Kind startet eine Safari: Es wählt (optional) die zu jagenden Wortarten aus, markiert in Schritt 1 die 5 Satzenden, in Schritt 2 alle großzuschreibenden Wörter, in Schritt 3 die Wortarten mit einem Farbpinsel und erhält in Schritt 4 eine Auswertung. Abschließend sieht es eine Gesamtwertung mit den erreichten XP.

**Why this priority**: Der vierstufige Durchlauf ist der Kern des Lernspiels — ohne diesen Flow existiert kein nutzbares Spiel. Alle übrigen Verhalten (Konfiguration, Auswertungs-Detailansicht) bauen darauf auf.

**Independent Test**: Kann vollständig getestet werden, indem eine Safari vom Start bis zur Gesamtwertung durchgespielt wird und die angezeigte Punktzahl den Fehlern/Markierungen des Kindes entspricht.

**Acceptance Scenarios**:

1. **Given** ein Kind befindet sich im Intro, **When** es die Wortarten-Auswahl bestätigt und „Safari starten" tippt, **Then** beginnt Schritt 1 (Satzenden finden) mit einem zufällig ausgewählten Text aus 5 Sätzen.
2. **Given** Schritt 1 ist aktiv, **When** das Kind eine Lücke zwischen zwei Wörtern antippt, **Then** wird diese Lücke mit einem Punkt markiert (erneutes Tippen entfernt die Markierung) und der Zähler „Satzenden markiert: X von 5" aktualisiert sich.
3. **Given** Schritt 1 ist aktiv, **When** das Kind „Weiter" tippt, **Then** wechselt die Ansicht zu Schritt 2 (Großschreibung markieren).
4. **Given** Schritt 2 ist aktiv, **When** das Kind auf ein Wort tippt, **Then** wird das Wort als großgeschrieben markiert („Aa"-Badge, Wort erscheint großgeschrieben) und erneutes Tippen macht die Markierung rückgängig.
5. **Given** Schritt 3 ist aktiv und ein Kind hat eine Wortart aus der Palette gewählt, **When** es auf ein zu dieser Wortart passendes Wort tippt, **Then** färbt sich das Wort in der Farbe der Wortart; tippt es mit derselben Wortart erneut, wird die Färbung entfernt.
6. **Given** Schritt 3 ist abgeschlossen („Auswerten" getippt), **When** die Auswertung erscheint, **Then** zeigt die Auswertung korrekte Markierungen grün (✓) und Fehler rot (mit „?") an und vergibt XP nach festgelegter Formel.
7. **Given** die Auswertung (Schritt 4) wird „Zur Gesamtwertung" mit „Weiter" verlassen, **When** die Gesamtwertung erscheint, **Then** zeigt sie die Teil-Ergebnisse (Satzenden X/5, Großschreibung X/Anzahl Wörter, Wortarten X/Anzahl gesuchter Wörter) und die Gesamt-XP als Erfolgs-Prämie.
8. **Given** die Gesamtwertung ist sichtbar, **When** das Kind „Neue Safari starten" tippt, **Then** beginnt eine neue Safari mit einem noch nicht (in diesem Zyklus) verwendeten Text.

---

### User Story 2 - Auswertung erkunden und Erklärungen lesen (Priority: P2)

Ein Kind kann in Schritt 4 auf jedes markierte oder fehlerhafte Wort bzw. jede Lücke tippen und erhält ein Erklärungs-Popover mit der didaktischen Begründung („Forscher-Regel") sowie der Angabe, ob die eigene Entscheidung richtig oder falsch war.

**Why this priority**: Der Lerneffekt entsteht vor allem durch die Verständnis-Erklärungen nach der Bearbeitung; er ist aber ein Zusatznutzen gegenüber dem reinen Durchspielen.

**Independent Test**: Kann getestet werden, indem in Schritt 4 ein korrektes, ein falsches und ein nicht gesuchtes Wort sowie eine korrekte und eine falsche Satzend-Lücke angetippt und die jeweiligen Popover-Inhalte verglichen werden.

**Acceptance Scenarios**:

1. **Given** Schritt 4 ist aktiv und ein Wort wird angetippt, **When** das Popover erscheint, **Then** enthält es das Wort, die zugehörige Wortart als Badge, die Bewertung der Großschreibung, die Bewertung der Wortart (oder den Hinweis, dass die Wortart nicht Teil dieser Safari war) und eine verständliche Erklärung.
2. **Given** Schritt 4 ist aktiv und eine Lücke wird angetippt, **When** das Popover erscheint, **Then** zeigt es, ob hier ein Satzende korrekt gesetzt wurde, ein Satzende fehlt, ein Satzende zu viel gesetzt wurde oder hier ein Komma stattdessen steht.
3. **Given** ein Popover ist geöffnet, **When** das Kind auf „Schließen" oder außerhalb des Popovers tippt, **Then** schließt sich das Popover und die Auswertung bleibt unverändert.

---

### User Story 3 - Wortarten konfigurieren und Pause nutzen (Priority: P3)

Ein Kind kann vor dem Start festlegen, welche Wortarten Teil der Safari sind (mindestens eine), und während des Spiels jederzeit pausieren, fortsetzen oder verlassen.

**Why this priority**: Konfiguration und Pause erhöhen die Passgenauigkeit und kürzere Spiel-Sessions, sind aber keine Voraussetzung für den Kern-Flow in User Story 1.

**Independent Test**: Kann getestet werden, indem im Intro genau eine Wortart aktiviert wird (mit der gewohnten Wortarten-Palette in Schritt 3) und während des Spiels die Pause geöffnet und fortgesetzt bzw. das Spiel verlassen wird.

**Acceptance Scenarios**:

1. **Given** das Intro zeigt die Wortarten-Auswahl, **When** das Kind eine aktive Wortart abwählt, **Then** wird sie deaktiviert (kein Häkchen); ist sie die letzte aktive Wortart, kann sie nicht abgewählt werden.
2. **Given** eine Safari ist in Schritt 1–4 aktiv und das Kind tippt auf das Pause-Symbol (oder drückt Escape), **When** der Pause-Dialog erscheint, **Then** kann es fortsetzen (gleiche Ansicht, alle Markierungen erhalten) oder das Spiel beenden und zum Menü zurückkehren.
3. **Given** das Kind hat im Intro nur Wortarten ausgewählt, die im angezeigten Text nicht vorkommen, **When** Schritt 3 startet, **Then** ist kein Wort antippbar und die Auswertung zeigt „0 von 0" für die Wortarten.

---

### Edge Cases

- **Letzte Wortart**: Ist nur noch eine Wortart aktiv, lässt sie sich nicht abwählen; das Spiel startet trotzdem.
- **Keine gesuchten Wörter im Text**: Enthält der Text keine Wörter der gewählten Wortarten, ist in Schritt 3 nichts markierbar; die Auswertung behandelt diesen Fall als „0 von 0".
- **Mehr als 5 Markierungen in Schritt 1**: Das Kind kann beliebig viele Lücken markieren (auch mehr als die 5 echten Satzenden); in der Auswertung zählen nur Übereinstimmungen, zusätzliche Markierungen gelten als Fehler.
- **Beliebige Markierungen in Schritt 2**: Das Kind kann jedes Wort markieren, auch zu Unrecht; in der Auswertung zählt nur Übereinstimmung mit der korrekten Großschreibung.
- **Zurück-Navigation**: Zurückspringen (Schritt 2 → 1, Schritt 3 → 2) erhält alle Markierungen unverändert; eine erneute Auswertung ist erst nach „Auswerten" in Schritt 3 möglich.
- **Text erschöpft**: Sind alle 20 Texte in einem Durchgang verwendet worden, beginnt die Auswahl von vorn (Wiederholungen möglich), ohne dass das Spiel unterbrochen wird.
- **Escape im Popover**: Bei geöffnetem Auswertungs-Popover schließt Escape zuerst das Popover, erst ein weiteres Escape öffnet die Pause.
- **Pause im Intro/Summary**: In Intro und Gesamtwertung ist die Pause nicht verfügbar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das Spiel MUSS dem Kind vor Spielbeginn eine Auswahl aller unterstützten Wortarten anzeigen (Nomen, Verb, Adjektiv, Artikel, Pronomen, Numerali, Adverb, Präposition, Konjunktion, Interjektion), jeweils mit begleitendem Schülernamen.
- **FR-002**: Das Spiel MUSS standardmäßig die Wortarten Nomen, Verb, Adjektiv und Artikel als aktiv vorsehen und MUSS zulassen, dass das Kind die aktiven Wortarten ändert; dabei MUSS mindestens eine Wortart aktiv bleiben.
- **FR-003**: Das Spiel MUSS pro Safari einen Text aus einem Pool von 20 Texten (je 5 Sätze) zufällig ohne Wiederholung auswählen; sind alle Texte verwendet worden, MUSS die Auswahl von vorn beginnen.
- **FR-004**: In Schritt 1 (Satzenden finden) MUSS das Kind durch Antippen einer Lücke zwischen zwei Wörtern ein Satzende markieren können; erneutes Antippen MUSS die Markierung entfernen.
- **FR-005**: In Schritt 1 MUSS das Spiel die Anzahl der markierten Satzenden live anzeigen („X von 5"); Kommata MÜSSEN in diesem Schritt ausgeblendet und nicht markierbar sein.
- **FR-006**: In Schritt 2 (Großschreibung markieren) MUSS das Kind einzelne Wörter als großgeschrieben markieren können; markierte Wörter MÜSSEN großgeschrieben erscheinen und ein sichtbares Kennzeichen („Aa") tragen.
- **FR-007**: In Schritt 2 MUSS das Spiel die Anzahl der markierten Wörter live anzeigen; die Markierungen MÜSSEN die Auswertung in Schritt 4 beeinflussen.
- **FR-008**: In Schritt 3 (Wortarten jagen) MUSS das Kind aus einer Palette genau der zuvor gewählten Wortarten ein Werkzeug auswählen und Wörter damit einfärben; erneutes Antippen mit derselben Wortart MUSS die Färbung entfernen.
- **FR-009**: In Schritt 3 MÜSSEN Wörter, deren Wortart nicht Teil der aktiven Auswahl ist, sichtbar abgeschwächt und nicht antippbar sein; das Spiel MUSS den Fortschritt als „X von Y markierten Wörtern" anzeigen.
- **FR-010**: Das Spiel MUSS nach „Auswerten" eine Ergebnisauswertung (Schritt 4) anzeigen, die jede Markierung als richtig (grün/✓) oder falsch (rot/„?") kennzeichnet — getrennt nach Satzenden, Großschreibung und Wortart.
- **FR-011**: Die Punktzahl MUSS sich je Safari ergeben aus: 10 Punkten je richtig gesetztem Satzende (maximal 5), 5 Punkten je richtig entschiedener Großschreibung (je Wort des Textes) und 8 Punkten je richtig zugeordneter Wortart (nur für aktive Wortarten).
- **FR-012**: Die erreichten Punkte MÜSSEN der laufenden Spiel-Sitzung gutgeschrieben und über die Gesamtwertung hinaus gespeichert werden (Fortschritt ergänzt sich über mehrere Safaris hinweg).
- **FR-013**: In Schritt 4 MUSS das Kind durch Antippen eines Wortes oder einer Lücke ein Erklärungs-Popover öffnen können; das Popover MUSS die Bewertung der jeweiligen Entscheidung sowie eine verständliche Begründung („Forscher-Regel") enthalten.
- **FR-014**: Die Gesamtwertung MUSS die Teil-Ergebnisse (Satzenden X/5, Großschreibung X/Gesamtwörter, Wortarten X/gesuchte Wörter), die Gesamt-XP dieser Safari sowie Aktionen „Neue Safari starten" und „Zurück zum Menü" anzeigen.
- **FR-015**: Das Spiel MUSS während Schritt 1–4 per Pause-Symbol oder Escape-Taste einen Pause-Dialog anbieten, mit dem das Kind fortsetzen (Zustand unverändert) oder das Spiel beenden und zum Menü zurückkehren kann.
- **FR-016**: Die Zurück-Navigation (Schritt 2 → 1, Schritt 3 → 2) MUSS die bisherigen Markierungen vollständig erhalten und ohne Neuauswertung zurückführen.

### Key Entities *(include if feature involves data)*

- **SafariStory**: Ein auswählbarer Übungstext; umfasst einen eindeutigen Bezeichner, einen Titel und genau 5 Sätze; insgesamt existieren 20 Geschichten.
- **SafariToken**: Ein einzelnes Wort eines Textes mit seiner Wortart, der Angabe, ob es ein Satzende ist, ob eine Komma-Folge besteht, ob es großgeschrieben wird, sowie einer Schülergerechten Erklärung für das Popover.
- **SafariWordClass**: Eine der 10 unterstützten Wortarten mit Anzeigename, Schülernamen und Zuordnung zur Konfiguration (aktiv/inaktiv, Standardzustand aktiv für Nomen/Verb/Adjektiv/Artikel).
- **SafariSession (Runde)**: Der Zustand einer laufenden Safari — gewählte Wortarten, aktueller Text, gesetzte Satzend-Markierungen, Großschreib-Markierungen, Wortart-Zuordnungen, aktives Farbwerkzeug, Teilergebnisse und Punkte.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ein Kind kann in einer Sitzung 20 unterschiedliche Texte (je 5 Sätze) ohne Wiederholung spielen; jeder Text lässt sich vollständig in den vier Schritten bearbeiten und in der Gesamtwertung abschließen.
- **SC-002**: Die Punktevergabe ist für jeden Text eindeutig nachvollziehbar: maximal 50 Punkte für Satzenden (5 × 10), maximal 5 × Wortanzahl für Großschreibung und maximal 8 × Anzahl aktiver Textwörter für Wortarten; die angezeigte Gesamt-XP entspricht exakt der Summe.
- **SC-003**: 100 % der Wörter und Lücken eines Textes öffnen in Schritt 4 ein Erklärungs-Popover, das die eigene Entscheidung als richtig oder falsch einordnet und eine Begründung enthält.
- **SC-004**: Ein Kind kann jeden Schritt der Safari unterbrechen (Pause), unverändert fortsetzen und dabei alle bisherigen Markierungen beibehalten; zurückgesprungene Schritte zeigen denselben Zwischenstand wie vor dem Verlassen.
- **SC-005**: Die vollständige Wortarten-Auswahl (10 Arten) ist jederzeit verfügbar und konfigurierbar; jede Kombination mit mindestens einer aktiven Wortart führt zu einer spielbaren und auswertbaren Safari.

## Assumptions

- Die Zielgruppe sind Kinder der 3. Klasse im Deutschunterricht; alle Texte und Erklärungen sind entsprechend einfach gehalten.
- Jeder Text enthält per Konvention genau 5 Sätze und wird als zusammenhängende Geschichte angezeigt (überwiegend Tier-Geschichten).
- Kommata sind in Schritt 1 bewusst ausgeblendet und nicht Teil der Bewertung; sie werden erst ab Schritt 2 als Hinweis eingeblendet.
- Die Wortart „Sonstiges" existiert in der Datenbasis, ist in den aktuellen Texten jedoch nicht vergeben und nicht konfigurierbar.
- Die angezeigten Texte (inklusive aller Anzeigenamen) entsprechen exakt dem aktuellen Stand; das Spiel wird als funktionierendes Ergebnis behandelt, nicht als Entwurf.
- Alle Inhalte müssen ohne Internetverbindung nutzbar sein (Offline-Betrieb über den Browser).