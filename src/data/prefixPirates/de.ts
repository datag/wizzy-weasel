import type { PrefixDataset } from '@/types'
import { registerDataset, assertDatasetValid } from './dataset'

/**
 * Deutsches Präfix-Datensatz für "Präfix-Piraten".
 * Inhalte wurden aus den Wikipedia-Artikeln (CC BY-SA) kuratiert und stark vereinfacht:
 * "Präfix", "Präfix- und Partikelverben im Deutschen", "Liste lateinischer Präfixe",
 * "Liste griechischer Präfixe" – https://de.wikipedia.org (Abruf 2026-10).
 * Jeder Beispielsatz enthält das Beispielwort, damit Lückensatz-Fragen (sentence-gap)
 * erzeugt werden können.
 */

export const DE_DATASET: PrefixDataset = {
  language: 'de',
  entries: [
    // ─── Germanisch (deutsche Erbpräfixe und Partikel) ───────────────────
    { id: 'ab', prefix: 'ab-', origin: 'germanic', tier: 1, meaning: 'weg, fort', examples: [
      { word: 'abfahren', sentence: 'Wir wollen gleich abfahren.', conflictsWith: ['weg-', 'auto-', 'mit-', 'weiter-', 'zurück-', 'nach-', 'um-', 'aus-', 'ein-'] },
      { word: 'abholen', sentence: 'Ich will dich am Bahnhof abholen.' },
    ] },
    { id: 'an', prefix: 'an-', origin: 'germanic', tier: 1, meaning: 'hin, dazu', examples: [
      { word: 'ankommen', sentence: 'Der Zug soll gleich ankommen.' },
      { word: 'anziehen', sentence: 'Ich will die Jacke anziehen.', conflictsWith: ['aus-'] },
    ] },
    { id: 'auf', prefix: 'auf-', origin: 'germanic', tier: 1, meaning: 'nach oben, offen', examples: [
      { word: 'aufstehen', sentence: 'Ich muss morgen früh aufstehen.' },
      { word: 'aufmachen', sentence: 'Kannst du das Fenster aufmachen?' },
    ] },
    { id: 'aus', prefix: 'aus-', origin: 'germanic', tier: 1, meaning: 'heraus', examples: [
      { word: 'auspacken', sentence: 'Wir wollen die Geschenke auspacken.', conflictsWith: ['ein-'] },
      { word: 'ausgehen', sentence: 'Heute Abend will ich gerne ausgehen.' },
    ] },
    { id: 'be', prefix: 'be-', origin: 'germanic', tier: 1, meaning: 'macht etwas zu', examples: [
      { word: 'bemalen', sentence: 'Ich will das Blatt bunt bemalen.' },
      { word: 'beladen', sentence: 'Wir wollen den Wagen beladen.', conflictsWith: ['ent-', 'um-', 'auf-'] },
    ] },
    { id: 'bei', prefix: 'bei-', origin: 'germanic', tier: 1, meaning: 'dazu, heran', examples: [
      { word: 'beibringen', sentence: 'Ich will dir etwas beibringen.' },
      { word: 'beifügen', sentence: 'Ich will eine Zeichnung beifügen.' },
    ] },
    { id: 'durch', prefix: 'durch-', origin: 'germanic', tier: 1, meaning: 'hindurch, von vorne bis hinten', examples: [
      { word: 'durchqueren', sentence: 'Wir wollen den Wald durchqueren.' },
      { word: 'durchlesen', sentence: 'Ich will das Buch durchlesen.' },
    ] },
    { id: 'ein', prefix: 'ein-', origin: 'germanic', tier: 1, meaning: 'hinein', examples: [
      { word: 'einsteigen', sentence: 'Wir wollen schnell einsteigen.', conflictsWith: ['um-', 'aus-'] },
      { word: 'einkaufen', sentence: 'Wir wollen heute einkaufen.', conflictsWith: ['ver-'] },
    ] },
    { id: 'emp', prefix: 'emp-', origin: 'germanic', tier: 2, meaning: 'aufnehmen, entgegen', examples: [
      { word: 'empfangen', sentence: 'Wir wollen die Gäste empfangen.' },
      { word: 'empfehlen', sentence: 'Ich kann dir das Buch empfehlen.' },
    ] },
    { id: 'empor', prefix: 'empor-', origin: 'germanic', tier: 3, meaning: 'nach oben', examples: [
      { word: 'emporsteigen', sentence: 'Die Ballons wollen hoch emporsteigen.' },
      { word: 'emporheben', sentence: 'Er will den Pokal emporheben.' },
    ] },
    { id: 'ent', prefix: 'ent-', origin: 'germanic', tier: 1, meaning: 'weg, davon', examples: [
      { word: 'entdecken', sentence: 'Wir wollen den Schatz entdecken.' },
      { word: 'entfernen', sentence: 'Du sollst den Fleck entfernen.' },
    ] },
    { id: 'entgegen', prefix: 'entgegen-', origin: 'germanic', tier: 2, meaning: 'auf jemanden zu', examples: [
      { word: 'entgegenkommen', sentence: 'Ich will dir ein Stück entgegenkommen.' },
      { word: 'entgegenlaufen', sentence: 'Der Hund will mir fröhlich entgegenlaufen.' },
    ] },
    { id: 'er', prefix: 'er-', origin: 'germanic', tier: 1, meaning: 'ein Ziel erreichen', examples: [
      { word: 'erfahren', sentence: 'Ich will mehr darüber erfahren.' },
      { word: 'erkennen', sentence: 'Ich will das Tier erkennen.' },
    ] },
    { id: 'fehl', prefix: 'fehl-', origin: 'germanic', tier: 2, meaning: 'falsch, daneben', examples: [
      { word: 'fehlschlagen', sentence: 'Der Versuch kann leider fehlschlagen.' },
      { word: 'Fehlstart', sentence: 'Der Läufer hatte einen Fehlstart.' },
    ] },
    { id: 'fest', prefix: 'fest-', origin: 'germanic', tier: 1, meaning: 'fest, sicher', examples: [
      { word: 'festhalten', sentence: 'Du sollst das Seil festhalten.' },
      { word: 'festmachen', sentence: 'Wir wollen das Boot festmachen.' },
    ] },
    { id: 'fort', prefix: 'fort-', origin: 'germanic', tier: 2, meaning: 'weg, weiter', examples: [
      { word: 'fortgehen', sentence: 'Ich will noch nicht fortgehen.' },
      { word: 'fortsetzen', sentence: 'Wir wollen die Geschichte fortsetzen.' },
    ] },
    { id: 'ge', prefix: 'ge-', origin: 'germanic', tier: 2, meaning: 'zusammen, ganzheitlich', examples: [
      { word: 'Gefährte', sentence: 'Mein Hund ist ein treuer Gefährte.' },
      { word: 'Gebirge', sentence: 'Das Gebirge hat hohe Berge.' },
    ] },
    { id: 'heim', prefix: 'heim-', origin: 'germanic', tier: 1, meaning: 'nach Hause', examples: [
      { word: 'heimkehren', sentence: 'Die Matrosen wollen bald heimkehren.', conflictsWith: ['zurück-'] },
      { word: 'heimfahren', sentence: 'Nach dem Training wollen wir heimfahren.', conflictsWith: ['weg-', 'auto-', 'mit-', 'weiter-', 'zurück-'] },
    ] },
    { id: 'her', prefix: 'her-', origin: 'germanic', tier: 1, meaning: 'hierher, zu mir', examples: [
      { word: 'herkommen', sentence: 'Du kannst einfach herkommen.' },
      { word: 'herholen', sentence: 'Ich will meinen Ball herholen.' },
    ] },
    { id: 'herauf', prefix: 'herauf-', origin: 'germanic', tier: 2, meaning: 'von unten nach oben', examples: [
      { word: 'heraufkommen', sentence: 'Du darfst zu mir heraufkommen.' },
      { word: 'heraufziehen', sentence: 'Dunkle Wolken wollen heraufziehen.' },
    ] },
    { id: 'heraus', prefix: 'heraus-', origin: 'germanic', tier: 1, meaning: 'von innen nach außen', examples: [
      { word: 'herausfinden', sentence: 'Ich will das Geheimnis herausfinden.' },
      { word: 'herausnehmen', sentence: 'Du darfst ein Buch herausnehmen.' },
    ] },
    { id: 'herein', prefix: 'herein-', origin: 'germanic', tier: 1, meaning: 'von außen nach innen', examples: [
      { word: 'hereinkommen', sentence: 'Bitte klopfen und dann hereinkommen.' },
      { word: 'hereinbringen', sentence: 'Ich will die Post hereinbringen.' },
    ] },
    { id: 'herum', prefix: 'herum-', origin: 'germanic', tier: 1, meaning: 'im Kreis, umher', examples: [
      { word: 'herumlaufen', sentence: 'Die Kinder wollen auf der Wiese herumlaufen.' },
      { word: 'herumdrehen', sentence: 'Du sollst das Rad einmal herumdrehen.' },
    ] },
    { id: 'herunter', prefix: 'herunter-', origin: 'germanic', tier: 1, meaning: 'von oben nach unten', examples: [
      { word: 'herunterladen', sentence: 'Ich will ein neues Lied herunterladen.' },
      { word: 'herunterklettern', sentence: 'Vorsichtig sollst du vom Baum herunterklettern.' },
    ] },
    { id: 'hin', prefix: 'hin-', origin: 'germanic', tier: 1, meaning: 'dorthin, von mir weg', examples: [
      { word: 'hingehen', sentence: 'Ich will dorthin hingehen.' },
      { word: 'hinsetzen', sentence: 'Du sollst dich hinsetzen.' },
    ] },
    { id: 'hinab', prefix: 'hinab-', origin: 'germanic', tier: 3, meaning: 'nach unten weg', examples: [
      { word: 'hinabsteigen', sentence: 'Wir wollen in die Höhle hinabsteigen.' },
      { word: 'hinabschauen', sentence: 'Vom Turm wollen wir hinabschauen.' },
    ] },
    { id: 'hinaus', prefix: 'hinaus-', origin: 'germanic', tier: 1, meaning: 'nach draußen weg', examples: [
      { word: 'hinausgehen', sentence: 'Wir wollen in den Hof hinausgehen.' },
      { word: 'hinauswerfen', sentence: 'Niemand soll den Ball hinauswerfen.', conflictsWith: ['weg-'] },
    ] },
    { id: 'hinein', prefix: 'hinein-', origin: 'germanic', tier: 1, meaning: 'in etwas hinein', examples: [
      { word: 'hineinlegen', sentence: 'Ich will den Brief hineinlegen.', conflictsWith: ['weg-'] },
      { word: 'hineinschauen', sentence: 'Darf ich kurz in die Kiste hineinschauen?' },
    ] },
    { id: 'hinter', prefix: 'hinter-', origin: 'germanic', tier: 1, meaning: 'hinter, nach hinten', examples: [
      { word: 'hinterlassen', sentence: 'Ich will eine Nachricht hinterlassen.' },
      { word: 'hinterherlaufen', sentence: 'Der Hund will hinterherlaufen.' },
    ] },
    { id: 'hoch', prefix: 'hoch-', origin: 'germanic', tier: 1, meaning: 'nach oben', examples: [
      { word: 'hochheben', sentence: 'Kannst du die Kiste hochheben?' },
      { word: 'hochspringen', sentence: 'Der Hund kann hochspringen.' },
    ] },
    { id: 'los', prefix: 'los-', origin: 'germanic', tier: 1, meaning: 'beginnt, löst sich', examples: [
      { word: 'losfahren', sentence: 'Wir wollen bald losfahren.', conflictsWith: ['weg-', 'auto-', 'mit-', 'weiter-', 'zurück-'] },
      { word: 'loslassen', sentence: 'Du sollst nicht loslassen.' },
    ] },
    { id: 'miss', prefix: 'miss-', variants: ['miß-'], origin: 'germanic', tier: 2, meaning: 'falsch, schlecht', examples: [
      { word: 'missverstehen', sentence: 'Ich will dich nicht missverstehen.' },
      { word: 'misslingen', sentence: 'Der Kuchen kann leicht misslingen.' },
    ] },
    { id: 'mit', prefix: 'mit-', origin: 'germanic', tier: 1, meaning: 'zusammen, dabei', examples: [
      { word: 'mitspielen', sentence: 'Darf ich auch mitspielen?', conflictsWith: ['vor-'] },
      { word: 'mitgehen', sentence: 'Willst du mitgehen?', conflictsWith: ['weg-'] },
    ] },
    { id: 'nach', prefix: 'nach-', origin: 'germanic', tier: 1, meaning: 'hinterher, danach', examples: [
      { word: 'nachsehen', sentence: 'Ich will kurz nachsehen.' },
      { word: 'nachfragen', sentence: 'Du sollst im Büro nachfragen.' },
    ] },
    { id: 'nieder', prefix: 'nieder-', origin: 'germanic', tier: 3, meaning: 'nach unten, zu Boden', examples: [
      { word: 'niederlegen', sentence: 'Ich will mich kurz niederlegen.' },
      { word: 'niederschreiben', sentence: 'Wir wollen die Ideen niederschreiben.' },
    ] },
    { id: 'ueber', prefix: 'über-', origin: 'germanic', tier: 1, meaning: 'darüber, hinüber', examples: [
      { word: 'überholen', sentence: 'Das Auto will uns überholen.' },
      { word: 'überkochen', sentence: 'Die Milch kann leicht überkochen.' },
    ] },
    { id: 'um', prefix: 'um-', origin: 'germanic', tier: 1, meaning: 'ringsherum', examples: [
      { word: 'umarmen', sentence: 'Ich will dich fest umarmen.' },
      { word: 'umrunden', sentence: 'Wir wollen den See umrunden.' },
    ] },
    { id: 'un', prefix: 'un-', origin: 'germanic', tier: 1, meaning: 'nicht, das Gegenteil', examples: [
      { word: 'unglücklich', sentence: 'Niemand soll heute unglücklich sein.' },
      { word: 'unsicher', sentence: 'Der alte Steg ist unsicher.' },
    ] },
    { id: 'unter', prefix: 'unter-', origin: 'germanic', tier: 1, meaning: 'darunter, nach unten', examples: [
      { word: 'untergehen', sentence: 'Wir wollen nicht untergehen.' },
      { word: 'untertauchen', sentence: 'Im Wasser wollen wir kurz untertauchen.' },
    ] },
    { id: 'ur', prefix: 'ur-', origin: 'germanic', tier: 1, meaning: 'sehr alt, ursprünglich', examples: [
      { word: 'Urwald', sentence: 'Im Urwald wachsen riesige Bäume.' },
      { word: 'uralt', sentence: 'Die Eiche im Park ist uralt.' },
    ] },
    { id: 'ver', prefix: 'ver-', origin: 'germanic', tier: 1, meaning: 'verändert, weg', examples: [
      { word: 'verstecken', sentence: 'Ich will mich verstecken.' },
      { word: 'verreisen', sentence: 'Wir wollen im Sommer verreisen.' },
    ] },
    { id: 'voll', prefix: 'voll-', origin: 'germanic', tier: 2, meaning: 'ganz, vollständig', examples: [
      { word: 'vollenden', sentence: 'Wir wollen das Bild vollenden.' },
      { word: 'vollpacken', sentence: 'Ich will die Tasche nicht vollpacken.' },
    ] },
    { id: 'vor', prefix: 'vor-', origin: 'germanic', tier: 1, meaning: 'davor, voraus', examples: [
      { word: 'vorlesen', sentence: 'Ich will dir eine Geschichte vorlesen.' },
      { word: 'vorsagen', sentence: 'Kannst du mir die Antwort vorsagen?' },
    ] },
    { id: 'voran', prefix: 'voran-', origin: 'germanic', tier: 2, meaning: 'nach vorne', examples: [
      { word: 'vorangehen', sentence: 'Die Lehrerin will als Erste vorangehen.' },
      { word: 'vorankommen', sentence: 'Mit der Arbeit wollen wir schnell vorankommen.' },
    ] },
    { id: 'voraus', prefix: 'voraus-', origin: 'germanic', tier: 2, meaning: 'vorab, vorne', examples: [
      { word: 'voraussehen', sentence: 'Das Wetter kann niemand sicher voraussehen.' },
      { word: 'voraussagen', sentence: 'Die Zukunft kann niemand voraussagen.' },
    ] },
    { id: 'vorbei', prefix: 'vorbei-', origin: 'germanic', tier: 1, meaning: 'an etwas entlang, vorüber', examples: [
      { word: 'vorbeifahren', sentence: 'Wir wollen am Schloss vorbeifahren.', conflictsWith: ['mit-', 'weiter-'] },
      { word: 'vorbeigehen', sentence: 'Der Schmerz wird bald vorbeigehen.' },
    ] },
    { id: 'weg', prefix: 'weg-', origin: 'germanic', tier: 1, meaning: 'weg, fort', examples: [
      { word: 'weglaufen', sentence: 'Ich will nicht weglaufen.', conflictsWith: ['mit-', 'fort-', 'los-'] },
      { word: 'wegnehmen', sentence: 'Du sollst das Spielzeug nicht wegnehmen.' },
    ] },
    { id: 'weiter', prefix: 'weiter-', origin: 'germanic', tier: 1, meaning: 'fort, noch mehr', examples: [
      { word: 'weitergehen', sentence: 'Wir wollen jetzt zügig weitergehen.' },
      { word: 'weiterspielen', sentence: 'Nach der Pause wollen wir weiterspielen.' },
    ] },
    { id: 'wider', prefix: 'wider-', origin: 'germanic', tier: 3, meaning: 'dagegen', examples: [
      { word: 'widersprechen', sentence: 'Du sollst mir nicht widersprechen.' },
      { word: 'widerstehen', sentence: 'Der Schokolade kann ich kaum widerstehen.' },
    ] },
    { id: 'wieder', prefix: 'wieder-', origin: 'germanic', tier: 1, meaning: 'noch einmal', examples: [
      { word: 'wiederholen', sentence: 'Wir wollen das Wort wiederholen.' },
      { word: 'wiedersehen', sentence: 'Wir wollen uns bald wiedersehen.' },
    ] },
    { id: 'zer', prefix: 'zer-', origin: 'germanic', tier: 1, meaning: 'kaputt, auseinander', examples: [
      { word: 'zerbrechen', sentence: 'Die Tasse kann zerbrechen.' },
      { word: 'zerreißen', sentence: 'Ich will das Papier zerreißen.' },
    ] },
    { id: 'zu', prefix: 'zu-', origin: 'germanic', tier: 1, meaning: 'geschlossen, hin', examples: [
      { word: 'zumachen', sentence: 'Du sollst das Fenster zumachen.' },
      { word: 'zulaufen', sentence: 'Der Hund will auf mich zulaufen.' },
    ] },
    { id: 'zurecht', prefix: 'zurecht-', origin: 'germanic', tier: 2, meaning: 'in Ordnung, passend', examples: [
      { word: 'zurechtfinden', sentence: 'Ich kann mich im Schulhaus gut zurechtfinden.' },
      { word: 'zurechtlegen', sentence: 'Ich will mir meine Stifte zurechtlegen.' },
    ] },
    { id: 'zurueck', prefix: 'zurück-', origin: 'germanic', tier: 1, meaning: 'wieder nach hinten', examples: [
      { word: 'zurückkommen', sentence: 'Wann wirst du nach Hause zurückkommen?', conflictsWith: ['heim-'] },
      { word: 'zurückgeben', sentence: 'Ich will dir dein Buch zurückgeben.' },
    ] },
    { id: 'zusammen', prefix: 'zusammen-', origin: 'germanic', tier: 1, meaning: 'gemeinsam, zusammen', examples: [
      { word: 'zusammenbauen', sentence: 'Wir wollen das Modell zusammenbauen.' },
      { word: 'zusammenlegen', sentence: 'Wir wollen die Sticker zusammenlegen.' },
    ] },

    // ─── Lateinisch ───────────────────────────────────────────────────────
    { id: 'lat-ad', prefix: 'ad-', variants: ['ak-', 'af-'], origin: 'latin', tier: 1, meaning: 'heran, dazu', examples: [
      { word: 'addieren', sentence: 'Wir wollen die Zahlen addieren.' },
      { word: 'Addition', sentence: 'Die Addition ist leicht zu lernen.' },
    ] },
    { id: 'lat-ambi', prefix: 'ambi-', origin: 'latin', tier: 3, meaning: 'beide, ringsum', examples: [
      { word: 'Ambivalenz', sentence: 'Er spürt eine innere Ambivalenz.' },
      { word: 'Ambiente', sentence: 'Das Restaurant hat ein gemütliches Ambiente.' },
    ] },
    { id: 'lat-aqua', prefix: 'aqua-', origin: 'latin', tier: 1, meaning: 'Wasser', examples: [
      { word: 'Aquarium', sentence: 'Im Aquarium schwimmen viele bunte Fische.' },
      { word: 'Aquaplaning', sentence: 'Bei starkem Regen droht Aquaplaning.' },
    ] },
    { id: 'lat-audi', prefix: 'audio-', origin: 'latin', tier: 2, meaning: 'hören', examples: [
      { word: 'Audioguide', sentence: 'Im Museum hören wir den Audioguide.' },
      { word: 'Audiodatei', sentence: 'Ich spiele die Audiodatei auf dem Tablet ab.' },
    ] },
    { id: 'lat-bene', prefix: 'bene-', origin: 'latin', tier: 3, meaning: 'gut, wohl', examples: [
      { word: 'Benefizkonzert', sentence: 'Wir spielen auf einem Benefizkonzert.' },
      { word: 'Benefizspiel', sentence: 'Das Benefizspiel sammelt Spenden.' },
    ] },
    { id: 'lat-bi', prefix: 'bi-', origin: 'latin', tier: 2, meaning: 'zwei, doppelt', examples: [
      { word: 'Bimetall', sentence: 'Das Bimetall biegt sich bei Wärme.' },
      { word: 'bilingual', sentence: 'Er wächst bilingual auf.' },
    ] },
    { id: 'lat-con', prefix: 'kon-', variants: ['kom-', 'kol-', 'ko-'], origin: 'latin', tier: 2, meaning: 'mit, zusammen', examples: [
      { word: 'Konzert', sentence: 'Wir hören ein Konzert.' },
      { word: 'Kontakt', sentence: 'Wir bleiben in Kontakt.' },
    ] },
    { id: 'lat-contra', prefix: 'kontra-', variants: ['kontr-'], origin: 'latin', tier: 2, meaning: 'gegen', examples: [
      { word: 'Kontrabass', sentence: 'Der Kontrabass klingt tief.' },
      { word: 'Kontrast', sentence: 'Der Kontrast ist sehr stark.' },
    ] },
    { id: 'lat-de', prefix: 'de-', origin: 'latin', tier: 2, meaning: 'weg, herunter', examples: [
      { word: 'demontieren', sentence: 'Wir wollen die Maschine demontieren.' },
      { word: 'defekt', sentence: 'Der Drucker ist leider defekt.' },
    ] },
    { id: 'lat-deci', prefix: 'dezi-', origin: 'latin', tier: 1, meaning: 'zehn', examples: [
      { word: 'Dezimeter', sentence: 'Ein Dezimeter ist zehn Zentimeter.' },
      { word: 'Deziliter', sentence: 'Ein Deziliter ist ein Zehntelliter.' },
    ] },
    { id: 'lat-dent', prefix: 'dent-', origin: 'latin', tier: 2, meaning: 'Zahn', examples: [
      { word: 'Dentalhygiene', sentence: 'Für weiße Zähne hilft gute Dentalhygiene.' },
      { word: 'Dentist', sentence: 'Früher nannte man den Zahnarzt Dentist.' },
    ] },
    { id: 'lat-dis', prefix: 'dis-', origin: 'latin', tier: 2, meaning: 'auseinander, un-', examples: [
      { word: 'Distanz', sentence: 'Wir halten etwas Distanz.' },
      { word: 'Diskussion', sentence: 'Die Diskussion dauert lange.' },
    ] },
    { id: 'lat-du', prefix: 'du-', origin: 'latin', tier: 2, meaning: 'zwei', examples: [
      { word: 'Duell', sentence: 'Die Ritter kämpfen in einem Duell.' },
      { word: 'Duo', sentence: 'Das Duo singt ein Lied.' },
    ] },
    { id: 'lat-ex', prefix: 'ex-', origin: 'latin', tier: 2, meaning: 'aus, heraus', examples: [
      { word: 'Expedition', sentence: 'Wir starten eine Expedition.' },
      { word: 'Exkursion', sentence: 'Unsere Klasse macht eine Exkursion.' },
    ] },
    { id: 'lat-extra', prefix: 'extra-', origin: 'latin', tier: 1, meaning: 'außerhalb, zusätzlich', examples: [
      { word: 'Extraportion', sentence: 'Ich möchte eine Extraportion.' },
      { word: 'extragroß', sentence: 'Die Torte ist extragroß.' },
    ] },
    { id: 'lat-in', prefix: 'in-', variants: ['im-', 'il-', 'ir-'], origin: 'latin', tier: 2, meaning: 'nicht, un-', examples: [
      { word: 'inkorrekt', sentence: 'Diese Antwort ist inkorrekt.' },
      { word: 'illegal', sentence: 'Das Parken ist hier illegal.' },
    ] },
    { id: 'lat-infra', prefix: 'infra-', origin: 'latin', tier: 3, meaning: 'unterhalb', examples: [
      { word: 'Infrarot', sentence: 'Die Fernbedienung nutzt Infrarot.' },
      { word: 'Infrastruktur', sentence: 'Gute Straßen gehören zur Infrastruktur.' },
    ] },
    { id: 'lat-inter', prefix: 'inter-', origin: 'latin', tier: 1, meaning: 'zwischen', examples: [
      { word: 'Internet', sentence: 'Das Internet ist gerade langsam.' },
      { word: 'Intervall', sentence: 'Zwischen den Tönen ist ein Intervall.' },
    ] },
    { id: 'lat-intra', prefix: 'intra-', origin: 'latin', tier: 3, meaning: 'innerhalb', examples: [
      { word: 'Intranet', sentence: 'In der Firma nutzen alle das Intranet.' },
      { word: 'intravenös', sentence: 'Die Ärztin gibt die Medizin intravenös.' },
    ] },
    { id: 'lat-intro', prefix: 'intro-', origin: 'latin', tier: 3, meaning: 'hinein, nach innen', examples: [
      { word: 'introvertiert', sentence: 'Er ist eher ruhig und introvertiert.' },
      { word: 'Introspektion', sentence: 'Introspektion bedeutet Selbstbeobachtung.' },
    ] },
    { id: 'lat-lunar', prefix: 'lunar-', origin: 'latin', tier: 3, meaning: 'Mond', examples: [
      { word: 'Lunarkalender', sentence: 'Manche Völker nutzen einen Lunarkalender.' },
      { word: 'Lunarstation', sentence: 'Astronauten träumen von einer Lunarstation.' },
    ] },
    { id: 'lat-mal', prefix: 'mal-', origin: 'latin', tier: 3, meaning: 'schlecht', examples: [
      { word: 'Malfunktion', sentence: 'Der Roboter stoppt wegen einer Malfunktion.' },
      { word: 'Malheur', sentence: 'Ihm passierte ein kleines Malheur.' },
    ] },
    { id: 'lat-manu', prefix: 'manu-', origin: 'latin', tier: 3, meaning: 'Hand', examples: [
      { word: 'Manuskript', sentence: 'Der Schriftsteller schreibt an seinem Manuskript.' },
      { word: 'Manufaktur', sentence: 'Die Schokolade entsteht in einer Manufaktur.' },
    ] },
    { id: 'lat-maxi', prefix: 'maxi-', origin: 'latin', tier: 1, meaning: 'sehr groß', examples: [
      { word: 'Maxirock', sentence: 'Sie trägt einen bunten Maxirock.' },
      { word: 'Maxipackung', sentence: 'Wir kaufen Kekse in der Maxipackung.' },
    ] },
    { id: 'lat-medi', prefix: 'medi-', origin: 'latin', tier: 3, meaning: 'Mitte, vermitteln', examples: [
      { word: 'Mediation', sentence: 'Die Streitschlichter helfen durch eine Mediation.' },
      { word: 'Mediator', sentence: 'Der Mediator schlichtet den Streit.' },
    ] },
    { id: 'lat-milli', prefix: 'milli-', origin: 'latin', tier: 1, meaning: 'tausend', examples: [
      { word: 'Millimeter', sentence: 'Ein Millimeter ist sehr klein.' },
      { word: 'Milliliter', sentence: 'Ein Milliliter ist ganz wenig.' },
    ] },
    { id: 'lat-mini', prefix: 'mini-', origin: 'latin', tier: 1, meaning: 'sehr klein', examples: [
      { word: 'Minigolf', sentence: 'Am Wochenende spielen wir Minigolf.' },
      { word: 'Minivan', sentence: 'Die große Familie fährt einen Minivan.' },
    ] },
    { id: 'lat-mot', prefix: 'motor-', origin: 'latin', tier: 1, meaning: 'Bewegung', examples: [
      { word: 'Motorrad', sentence: 'Mein Onkel fährt gerne Motorrad.' },
      { word: 'Motorboot', sentence: 'Über den See flitzt ein Motorboot.' },
    ] },
    { id: 'lat-multi', prefix: 'multi-', origin: 'latin', tier: 2, meaning: 'viele', examples: [
      { word: 'Multiplikation', sentence: 'Die Multiplikation ist nicht schwer.' },
      { word: 'Multivitaminsaft', sentence: 'Der Multivitaminsaft schmeckt lecker.' },
    ] },
    { id: 'lat-nav', prefix: 'navi-', origin: 'latin', tier: 2, meaning: 'Schiff, führen', examples: [
      { word: 'Navigation', sentence: 'Die Navigation führt uns sicher ans Ziel.' },
      { word: 'Navigator', sentence: 'Der Navigator liest die Seekarte.' },
    ] },
    { id: 'lat-non', prefix: 'non-', origin: 'latin', tier: 2, meaning: 'nicht', examples: [
      { word: 'Nonstop', sentence: 'Der Film läuft nonstop.' },
      { word: 'Nonsens', sentence: 'Diese Ausrede ist Nonsens.' },
    ] },
    { id: 'lat-okto', prefix: 'okto-', variants: ['okt-'], origin: 'latin', tier: 2, meaning: 'acht', examples: [
      { word: 'Oktett', sentence: 'Das Oktett spielt mit acht Instrumenten.' },
      { word: 'Oktober', sentence: 'Im Oktober färben sich die Blätter bunt.' },
    ] },
    { id: 'lat-omni', prefix: 'omni-', origin: 'latin', tier: 3, meaning: 'alles', examples: [
      { word: 'Omnibus', sentence: 'Der Omnibus hält an der Haltestelle.' },
      { word: 'Omnipräsenz', sentence: 'Omnipräsenz heißt überall sein.' },
    ] },
    { id: 'lat-ped', prefix: 'ped-', origin: 'latin', tier: 2, meaning: 'Fuß', examples: [
      { word: 'Pedal', sentence: 'Ich trete kräftig in das Pedal.' },
      { word: 'Pediküre', sentence: 'Oma geht zur Pediküre.' },
    ] },
    { id: 'lat-per', prefix: 'per-', origin: 'latin', tier: 2, meaning: 'durch, völlig', examples: [
      { word: 'perfekt', sentence: 'Deine Zeichnung ist einfach perfekt.' },
      { word: 'Perkussion', sentence: 'In der Musikgruppe spielt er Perkussion.' },
    ] },
    { id: 'lat-prae', prefix: 'prä-', origin: 'latin', tier: 2, meaning: 'vor, vorne', examples: [
      { word: 'Präfix', sentence: 'Ein Präfix steht vorne.' },
      { word: 'Präposition', sentence: 'Die Präposition ist ein Wortteil.' },
    ] },
    { id: 'lat-priv', prefix: 'privat-', origin: 'latin', tier: 2, meaning: 'eigen, persönlich', examples: [
      { word: 'Privatleben', sentence: 'Jeder Mensch braucht etwas Privatleben.' },
      { word: 'Privatschule', sentence: 'Sie geht seit zwei Jahren auf eine Privatschule.' },
    ] },
    { id: 'lat-pro', prefix: 'pro-', origin: 'latin', tier: 2, meaning: 'vorwärts, für', examples: [
      { word: 'Projekt', sentence: 'Wir planen ein Projekt.' },
      { word: 'probieren', sentence: 'Ich will das Eis probieren.' },
    ] },
    { id: 'lat-quadri', prefix: 'quadro-', variants: ['quadri-', 'quadru-'], origin: 'latin', tier: 2, meaning: 'vier', examples: [
      { word: 'Quadrocopter', sentence: 'Der Quadrocopter fliegt durch den Park.' },
      { word: 'Quadrupel', sentence: 'Das Team feiert ein Quadrupel.' },
    ] },
    { id: 'lat-re', prefix: 're-', origin: 'latin', tier: 2, meaning: 'zurück, wieder', examples: [
      { word: 'reparieren', sentence: 'Wir wollen das Fahrrad reparieren.' },
      { word: 'renovieren', sentence: 'Sie wollen das Zimmer renovieren.' },
    ] },
    { id: 'lat-retro', prefix: 'retro-', origin: 'latin', tier: 2, meaning: 'rückwärts, zurück', examples: [
      { word: 'Retrostil', sentence: 'Das Fahrrad ist im Retrostil gebaut.' },
      { word: 'retroaktiv', sentence: 'Die Regel gilt nicht retroaktiv.' },
    ] },
    { id: 'lat-se', prefix: 'se-', origin: 'latin', tier: 3, meaning: 'getrennt, ohne', examples: [
      { word: 'separat', sentence: 'Die Socken liegen separat.' },
      { word: 'separieren', sentence: 'Wir wollen die Farben separieren.' },
    ] },
    { id: 'lat-semi', prefix: 'semi-', origin: 'latin', tier: 2, meaning: 'halb', examples: [
      { word: 'Semifinale', sentence: 'Das Semifinale beginnt bald.' },
      { word: 'Semikolon', sentence: 'Ein Semikolon ist ein halbes Zeichen.' },
    ] },
    { id: 'lat-sept', prefix: 'sept-', origin: 'latin', tier: 2, meaning: 'sieben', examples: [
      { word: 'Septett', sentence: 'Das Septett besteht aus sieben Musikern.' },
      { word: 'September', sentence: 'Im September beginnt für viele die Schule.' },
    ] },
    { id: 'lat-sol', prefix: 'solar-', origin: 'latin', tier: 1, meaning: 'Sonne', examples: [
      { word: 'Solaranlage', sentence: 'Auf dem Dach glänzt die Solaranlage.' },
      { word: 'Solarzelle', sentence: 'Die kleine Solarzelle liefert Strom.' },
    ] },
    { id: 'lat-sub', prefix: 'sub-', origin: 'latin', tier: 2, meaning: 'unter', examples: [
      { word: 'subtrahieren', sentence: 'Wir wollen die Zahlen subtrahieren.' },
      { word: 'Subtraktion', sentence: 'Die Subtraktion rechnet weg.' },
    ] },
    { id: 'lat-super', prefix: 'super-', origin: 'latin', tier: 1, meaning: 'über, ganz toll', examples: [
      { word: 'Superheld', sentence: 'Der Superheld kommt schnell.' },
      { word: 'Supermarkt', sentence: 'Der Supermarkt öffnet um acht.' },
    ] },
    { id: 'lat-supra', prefix: 'supra-', origin: 'latin', tier: 3, meaning: 'über, oberhalb', examples: [
      { word: 'Supraleiter', sentence: 'Ein Supraleiter leitet Strom ohne Verlust.' },
      { word: 'supranational', sentence: 'Die Union ist eine supranationale Gruppe.' },
    ] },
    { id: 'lat-terra', prefix: 'terra-', origin: 'latin', tier: 2, meaning: 'Erde, Land', examples: [
      { word: 'Terrarium', sentence: 'Die Echse lebt im warmen Terrarium.' },
      { word: 'Terrain', sentence: 'Die Bergsteiger erkunden das schwere Terrain.' },
    ] },
    { id: 'lat-trans', prefix: 'trans-', origin: 'latin', tier: 2, meaning: 'hinüber, hindurch', examples: [
      { word: 'Transport', sentence: 'Der Transport dauert lange.' },
      { word: 'Transfer', sentence: 'Der Transfer klappt gut.' },
    ] },
    { id: 'lat-ultra', prefix: 'ultra-', origin: 'latin', tier: 3, meaning: 'jenseits, sehr', examples: [
      { word: 'Ultraschall', sentence: 'Der Arzt nutzt den Ultraschall.' },
      { word: 'ultramodern', sentence: 'Das Stadion ist ultramodern.' },
    ] },
    { id: 'lat-uni', prefix: 'uni-', origin: 'latin', tier: 3, meaning: 'eins', examples: [
      { word: 'Universum', sentence: 'Das Universum ist riesig.' },
      { word: 'Uniform', sentence: 'Die Uniform passt genau.' },
    ] },
    { id: 'lat-video', prefix: 'video-', origin: 'latin', tier: 1, meaning: 'sehen', examples: [
      { word: 'Videospiel', sentence: 'Am Freitag darf ich ein Videospiel spielen.' },
      { word: 'Videokamera', sentence: 'Opa filmt das Fest mit der Videokamera.' },
    ] },
    { id: 'lat-visu', prefix: 'visu-', variants: ['vis-'], origin: 'latin', tier: 3, meaning: 'sehen', examples: [
      { word: 'visuell', sentence: 'Der Film ist ein visuelles Erlebnis.' },
      { word: 'Vision', sentence: 'Die Forscherin hat eine große Vision.' },
    ] },
    { id: 'lat-vice', prefix: 'vize-', variants: ['vice-'], origin: 'latin', tier: 3, meaning: 'stellvertretend', examples: [
      { word: 'Vizekapitän', sentence: 'Der Vizekapitän hilft dem Kapitän.' },
      { word: 'Vizeweltmeister', sentence: 'Der Vizeweltmeister steht auf Platz zwei.' },
    ] },
    { id: 'lat-centi', prefix: 'zenti-', variants: ['centi-'], origin: 'latin', tier: 1, meaning: 'hundert', examples: [
      { word: 'Zentimeter', sentence: 'Ein Zentimeter ist klein.' },
      { word: 'Zentiliter', sentence: 'Ein Zentiliter ist ganz wenig.' },
    ] },

    // ─── Griechisch ───────────────────────────────────────────────────────
    { id: 'gr-a', prefix: 'a-', variants: ['an-'], origin: 'greek', tier: 3, meaning: 'nicht, ohne', examples: [
      { word: 'asozial', sentence: 'Drängeln an der Kasse ist asozial.' },
      { word: 'anonym', sentence: 'Der Briefschreiber möchte anonym bleiben.' },
    ] },
    { id: 'gr-amphi', prefix: 'amphi-', origin: 'greek', tier: 2, meaning: 'beiderseits, rundherum', examples: [
      { word: 'Amphibie', sentence: 'Ein Frosch ist eine bekannte Amphibie.' },
      { word: 'Amphitheater', sentence: 'Im alten Rom gab es ein Amphitheater.' },
    ] },
    { id: 'gr-ana', prefix: 'ana-', origin: 'greek', tier: 3, meaning: 'hinauf, auseinander', examples: [
      { word: 'Analyse', sentence: 'Die chemische Analyse liefert ein klares Ergebnis.' },
      { word: 'Anagramm', sentence: 'Aus den Buchstaben bilden wir ein Anagramm.' },
    ] },
    { id: 'gr-anti', prefix: 'anti-', origin: 'greek', tier: 2, meaning: 'gegen', examples: [
      { word: 'Antirutschmatte', sentence: 'Die Antirutschmatte liegt in der Badewanne.' },
      { word: 'antibakteriell', sentence: 'Diese Seife ist antibakteriell.' },
    ] },
    { id: 'gr-apo', prefix: 'apo-', origin: 'greek', tier: 3, meaning: 'ab, weg von', examples: [
      { word: 'Apostel', sentence: 'In der Bibelgeschichte spricht der Apostel.' },
      { word: 'Apotheke', sentence: 'Mama holt Hustensaft aus der Apotheke.' },
    ] },
    { id: 'gr-archaeo', prefix: 'archäo-', origin: 'greek', tier: 3, meaning: 'alt', examples: [
      { word: 'Archäologie', sentence: 'Archäologie erforscht alte Schätze.' },
      { word: 'Archäologe', sentence: 'Der Archäologe gräbt vorsichtig.' },
    ] },
    { id: 'gr-astro', prefix: 'astro-', origin: 'greek', tier: 1, meaning: 'Stern', examples: [
      { word: 'Astronaut', sentence: 'Der Astronaut schwebt durch die Raumstation.' },
      { word: 'Astronomie', sentence: 'Astronomie ist die Wissenschaft von den Sternen.' },
    ] },
    { id: 'gr-auto', prefix: 'auto-', origin: 'greek', tier: 1, meaning: 'selbst', examples: [
      { word: 'Automat', sentence: 'Der Automat gibt Süßigkeiten aus.' },
      { word: 'Autogramm', sentence: 'Ich will ein Autogramm haben.' },
    ] },
    { id: 'gr-biblio', prefix: 'biblio-', origin: 'greek', tier: 2, meaning: 'Buch', examples: [
      { word: 'Bibliothek', sentence: 'In der Bibliothek leihen wir viele Bücher aus.' },
      { word: 'Bibliothekar', sentence: 'Der Bibliothekar hilft uns bei der Suche.' },
    ] },
    { id: 'gr-bio', prefix: 'bio-', origin: 'greek', tier: 1, meaning: 'Leben', examples: [
      { word: 'Biologie', sentence: 'Biologie ist mein Lieblingsfach.' },
      { word: 'biologisch', sentence: 'Das Obst ist biologisch angebaut.' },
    ] },
    { id: 'gr-cata', prefix: 'kata-', variants: ['cata-'], origin: 'greek', tier: 2, meaning: 'hinab, ganz', examples: [
      { word: 'Katamaran', sentence: 'Der Katamaran gleitet schnell über das Wasser.' },
      { word: 'Katalog', sentence: 'Wir blättern im neuen Spielzeugkatalog.' },
    ] },
    { id: 'gr-chrono', prefix: 'chrono-', variants: ['chron-'], origin: 'greek', tier: 2, meaning: 'Zeit', examples: [
      { word: 'Chronometer', sentence: 'Der Chronometer misst die Zeit.' },
      { word: 'Chronik', sentence: 'Die Chronik erzählt die Geschichte.' },
    ] },
    { id: 'gr-demo', prefix: 'demo-', origin: 'greek', tier: 2, meaning: 'Volk', examples: [
      { word: 'Demokratie', sentence: 'Die Demokratie ist wichtig.' },
      { word: 'Demokrat', sentence: 'Der Demokrat wählt mit.' },
    ] },
    { id: 'gr-di', prefix: 'di-', origin: 'greek', tier: 2, meaning: 'zwei', examples: [
      { word: 'Dilemma', sentence: 'Ich stecke in einem schwierigen Dilemma.' },
      { word: 'Dioxid', sentence: 'Pflanzen brauchen Kohlenstoffdioxid.' },
    ] },
    { id: 'gr-dia', prefix: 'dia-', origin: 'greek', tier: 2, meaning: 'durch, quer', examples: [
      { word: 'Diagonale', sentence: 'Die Diagonale geht quer durch das Viereck.' },
      { word: 'Dialog', sentence: 'Der Dialog hilft uns beiden.' },
    ] },
    { id: 'gr-dys', prefix: 'dys-', origin: 'greek', tier: 3, meaning: 'schlecht, gestört', examples: [
      { word: 'Dysfunktion', sentence: 'Die Maschine hat eine Dysfunktion.' },
      { word: 'Dyslexie', sentence: 'Dyslexie macht das Lesen schwer.' },
    ] },
    { id: 'gr-endo', prefix: 'endo-', origin: 'greek', tier: 3, meaning: 'innen, innerhalb', examples: [
      { word: 'Endoskop', sentence: 'Der Arzt schaut mit dem Endoskop nach.' },
      { word: 'Endoskelett', sentence: 'Wir Menschen haben ein festes Endoskelett.' },
    ] },
    { id: 'gr-epi', prefix: 'epi-', origin: 'greek', tier: 3, meaning: 'auf, darauf', examples: [
      { word: 'Epidemie', sentence: 'Die Forscher bekämpfen die gefährliche Epidemie.' },
      { word: 'Epizentrum', sentence: 'Das Erdbeben begann im Epizentrum.' },
    ] },
    { id: 'gr-eu', prefix: 'eu-', origin: 'greek', tier: 3, meaning: 'gut, schön', examples: [
      { word: 'Euphorie', sentence: 'Nach dem Sieg herrschte große Euphorie.' },
      { word: 'Eukalyptus', sentence: 'Der Koala frisst am liebsten Eukalyptus.' },
    ] },
    { id: 'gr-exo', prefix: 'exo-', origin: 'greek', tier: 3, meaning: 'außen, außerhalb', examples: [
      { word: 'Exoskelett', sentence: 'Käfer haben ein hartes Exoskelett.' },
      { word: 'Exoplanet', sentence: 'Das Teleskop findet einen fernen Exoplaneten.' },
    ] },
    { id: 'gr-geo', prefix: 'geo-', origin: 'greek', tier: 1, meaning: 'Erde', examples: [
      { word: 'Geografie', sentence: 'Geografie ist das Fach über die Erde.' },
      { word: 'Geologie', sentence: 'Die Geologie erforscht die Steine.' },
    ] },
    { id: 'gr-helio', prefix: 'helio-', origin: 'greek', tier: 3, meaning: 'Sonne', examples: [
      { word: 'Heliotrop', sentence: 'Die Sonnenblume ist ein bekanntes Heliotrop.' },
      { word: 'Heliozentrisch', sentence: 'Das heliozentrische Weltbild stellt die Sonne ins Zentrum.' },
    ] },
    { id: 'gr-hemi', prefix: 'hemi-', origin: 'greek', tier: 3, meaning: 'halb', examples: [
      { word: 'Hemisphäre', sentence: 'Deutschland liegt auf der nördlichen Hemisphäre.' },
      { word: 'Hemisphärenmodell', sentence: 'Im Erdkundeunterricht nutzen wir ein Hemisphärenmodell.' },
    ] },
    { id: 'gr-hetero', prefix: 'hetero-', origin: 'greek', tier: 3, meaning: 'anders, verschieden', examples: [
      { word: 'heterogen', sentence: 'Die Schülergruppe ist bunt und heterogen.' },
      { word: 'Heteronym', sentence: 'Zwei verschiedene Wörter nennt man Heteronym.' },
    ] },
    { id: 'gr-homo', prefix: 'homo-', origin: 'greek', tier: 3, meaning: 'gleich', examples: [
      { word: 'homogen', sentence: 'Die Flüssigkeit ist ganz homogen vermischt.' },
      { word: 'Homophon', sentence: 'Zwei gleich klingende Wörter bilden ein Homophon.' },
    ] },
    { id: 'gr-hydro', prefix: 'hydro-', origin: 'greek', tier: 3, meaning: 'Wasser', examples: [
      { word: 'Hydrokultur', sentence: 'Die Zimmerpflanze wächst in Hydrokultur.' },
      { word: 'Hydrodynamik', sentence: 'Hydrodynamik erforscht die Bewegung des Wassers.' },
    ] },
    { id: 'gr-hyper', prefix: 'hyper-', origin: 'greek', tier: 3, meaning: 'über, sehr', examples: [
      { word: 'hyperaktiv', sentence: 'Der kleine Hund ist hyperaktiv.' },
      { word: 'hypermodern', sentence: 'Die neue Bahn ist hypermodern.' },
    ] },
    { id: 'gr-hypo', prefix: 'hypo-', origin: 'greek', tier: 3, meaning: 'unter', examples: [
      { word: 'Hypothermie', sentence: 'Hypothermie ist gefährliche Kälte.' },
      { word: 'hypoallergen', sentence: 'Diese Decke ist hypoallergen.' },
    ] },
    { id: 'gr-kilo', prefix: 'kilo-', origin: 'greek', tier: 1, meaning: 'tausend', examples: [
      { word: 'Kilometer', sentence: 'Der Weg ist einen Kilometer lang.' },
      { word: 'Kilogramm', sentence: 'Ein Kilogramm wiegt viel.' },
    ] },
    { id: 'gr-kosmo', prefix: 'kosmo-', origin: 'greek', tier: 2, meaning: 'Weltall, Ordnung', examples: [
      { word: 'Kosmonaut', sentence: 'Der Kosmonaut fliegt ins All.' },
      { word: 'Kosmos', sentence: 'Der Kosmos hat viele Sterne.' },
    ] },
    { id: 'gr-makro', prefix: 'makro-', variants: ['macro-'], origin: 'greek', tier: 3, meaning: 'groß, weit', examples: [
      { word: 'Makrofotografie', sentence: 'Mit Makrofotografie sehen wir kleine Insekten riesig.' },
      { word: 'Makrokosmos', sentence: 'Der Makrokosmos umfasst die riesige Welt der Sterne.' },
    ] },
    { id: 'gr-mega', prefix: 'mega-', origin: 'greek', tier: 1, meaning: 'groß', examples: [
      { word: 'Megafon', sentence: 'Das Megafon macht den Ton laut.' },
      { word: 'Megabyte', sentence: 'Ein Megabyte ist eine Speichergröße.' },
    ] },
    { id: 'gr-meta', prefix: 'meta-', origin: 'greek', tier: 3, meaning: 'nach, über, mitten', examples: [
      { word: 'Metapher', sentence: 'Rabeneltern ist eine bekannte Metapher.' },
      { word: 'Metamorphose', sentence: 'Die Raupe wird durch Metamorphose zum Schmetterling.' },
    ] },
    { id: 'gr-mikro', prefix: 'mikro-', origin: 'greek', tier: 1, meaning: 'klein', examples: [
      { word: 'Mikroskop', sentence: 'Wir sehen Zellen mit dem Mikroskop.' },
      { word: 'Mikrowelle', sentence: 'Die Mikrowelle wärmt das Essen.' },
    ] },
    { id: 'gr-mono', prefix: 'mono-', origin: 'greek', tier: 2, meaning: 'eins, allein', examples: [
      { word: 'Monolog', sentence: 'Der Schauspieler hält einen Monolog.' },
      { word: 'monochrom', sentence: 'Das Bild ist monochrom.' },
    ] },
    { id: 'gr-neo', prefix: 'neo-', origin: 'greek', tier: 2, meaning: 'neu', examples: [
      { word: 'Neonlicht', sentence: 'Am Abend leuchtet das bunte Neonlicht.' },
      { word: 'Neolithikum', sentence: 'Die Jungsteinzeit nennt man auch Neolithikum.' },
    ] },
    { id: 'gr-ortho', prefix: 'ortho-', origin: 'greek', tier: 2, meaning: 'richtig, gerade', examples: [
      { word: 'Orthografie', sentence: 'Orthografie heißt richtiges Schreiben.' },
      { word: 'Orthopäde', sentence: 'Der Orthopäde hilft dem Rücken.' },
    ] },
    { id: 'gr-palaeo', prefix: 'paläo-', variants: ['palaeo-'], origin: 'greek', tier: 3, meaning: 'alt, vorzeitlich', examples: [
      { word: 'Paläontologie', sentence: 'Die Paläontologie erforscht alte Fossilien.' },
      { word: 'Paläontologe', sentence: 'Der Paläontologe gräbt nach Dinosaurierknochen.' },
    ] },
    { id: 'gr-pan', prefix: 'pan-', origin: 'greek', tier: 3, meaning: 'ganz, all', examples: [
      { word: 'Panorama', sentence: 'Vom Berggipfel haben wir ein tolles Panorama.' },
      { word: 'Pandemie', sentence: 'Ärzte schützen uns vor einer weltweiten Pandemie.' },
    ] },
    { id: 'gr-para', prefix: 'para-', origin: 'greek', tier: 2, meaning: 'neben', examples: [
      { word: 'parallel', sentence: 'Die zwei Linien sind parallel.' },
      { word: 'Parallele', sentence: 'Die Parallele läuft daneben.' },
    ] },
    { id: 'gr-peri', prefix: 'peri-', origin: 'greek', tier: 3, meaning: 'rundherum', examples: [
      { word: 'Periskop', sentence: 'Das Periskop schaut um die Ecke.' },
      { word: 'Peripherie', sentence: 'Am Rand liegt die Peripherie.' },
    ] },
    { id: 'gr-phono', prefix: 'phono-', variants: ['phon-'], origin: 'greek', tier: 2, meaning: 'Klang, Laut', examples: [
      { word: 'Phonetik', sentence: 'Phonetik ist die Lehre von den Lauten.' },
      { word: 'Phonograph', sentence: 'Der Phonograph spielt alte Töne.' },
    ] },
    { id: 'gr-photo', prefix: 'foto-', variants: ['photo-'], origin: 'greek', tier: 1, meaning: 'Licht', examples: [
      { word: 'Fotografie', sentence: 'Die Fotografie hängt an der Wand.' },
      { word: 'Fotokopie', sentence: 'Die Fotokopie ist gut lesbar.' },
    ] },
    { id: 'gr-poly', prefix: 'poly-', origin: 'greek', tier: 2, meaning: 'viel', examples: [
      { word: 'Polygon', sentence: 'Ein Polygon hat viele Ecken.' },
      { word: 'polyglott', sentence: 'Der Mann ist polyglott.' },
    ] },
    { id: 'gr-proto', prefix: 'proto-', origin: 'greek', tier: 2, meaning: 'als Erstes, vorher', examples: [
      { word: 'Prototyp', sentence: 'Der Prototyp ist die erste Version.' },
      { word: 'Protokoll', sentence: 'Das Protokoll hält alles fest.' },
    ] },
    { id: 'gr-pseudo', prefix: 'pseudo-', origin: 'greek', tier: 2, meaning: 'falsch, unecht', examples: [
      { word: 'Pseudonym', sentence: 'Er schreibt unter einem Pseudonym.' },
      { word: 'Pseudofreund', sentence: 'Ein Pseudofreund ist kein echter Freund.' },
    ] },
    { id: 'gr-psycho', prefix: 'psycho-', origin: 'greek', tier: 2, meaning: 'Seele', examples: [
      { word: 'Psychologie', sentence: 'Psychologie erforscht die Seele.' },
      { word: 'Psychotherapie', sentence: 'Die Psychotherapie hilft der Seele.' },
    ] },
    { id: 'gr-syn', prefix: 'syn-', variants: ['sym-'], origin: 'greek', tier: 2, meaning: 'zusammen, mit', examples: [
      { word: 'Symmetrie', sentence: 'Der Schmetterling hat Symmetrie.' },
      { word: 'Symphonie', sentence: 'Die Symphonie klingt großartig.' },
    ] },
    { id: 'gr-techno', prefix: 'techno-', variants: ['techni-'], origin: 'greek', tier: 2, meaning: 'Kunst, Handwerk', examples: [
      { word: 'Technologie', sentence: 'Moderne Technologie hilft im Alltag.' },
      { word: 'Techniker', sentence: 'Der Techniker repariert die Anlage.' },
    ] },
    { id: 'gr-tele', prefix: 'tele-', origin: 'greek', tier: 1, meaning: 'fern', examples: [
      { word: 'Telefon', sentence: 'Das Telefon klingelt laut.' },
      { word: 'Teleskop', sentence: 'Mit dem Teleskop sehe ich Sterne.' },
    ] },
    { id: 'gr-tetra', prefix: 'tetra-', origin: 'greek', tier: 2, meaning: 'vier', examples: [
      { word: 'Tetraeder', sentence: 'Ein Tetraeder hat vier dreieckige Seiten.' },
      { word: 'Tetrapak', sentence: 'Den Saft gibt es im praktischen Tetrapak.' },
    ] },
    { id: 'gr-thermo', prefix: 'thermo-', origin: 'greek', tier: 1, meaning: 'warm', examples: [
      { word: 'Thermosflasche', sentence: 'Die Thermosflasche hält den Tee warm.' },
      { word: 'Thermometer', sentence: 'Das Thermometer zeigt die Wärme.' },
    ] },
    { id: 'gr-topo', prefix: 'topo-', origin: 'greek', tier: 3, meaning: 'Ort, Platz', examples: [
      { word: 'Topografie', sentence: 'Im Atlas lernen wir die Topografie von Europa.' },
      { word: 'Topologie', sentence: 'Die Topologie ist ein Teil der Mathematik.' },
    ] },
    { id: 'gr-tri', prefix: 'tri-', origin: 'greek', tier: 1, meaning: 'drei', examples: [
      { word: 'Triangel', sentence: 'Die Triangel klingt schön.' },
      { word: 'Triathlon', sentence: 'Der Triathlon hat drei Teile.' },
    ] },
    { id: 'gr-zoo', prefix: 'zoo-', origin: 'greek', tier: 1, meaning: 'Tier', examples: [
      { word: 'Zoologe', sentence: 'Der Zoologe beobachtet die Tiere.' },
      { word: 'Zoologie', sentence: 'Zoologie ist die Lehre von den Tieren.' },
    ] },
  ],
  invalidPairs: [
    { id: 'inv-1', prefix: 'un-', root: 'laufen', explanation: 'Es gibt kein Wort „unlaufen“. Richtig ist „umlaufen“ oder „anlaufen“.' },
    { id: 'inv-2', prefix: 'ent-', root: 'glücklich', explanation: 'Das Wort „entglücklich“ gibt es nicht. Richtig ist „unglücklich“.' },
    { id: 'inv-3', prefix: 'zer-', root: 'rot', explanation: '„Rot“ kann man nicht mit „zer-“ beginnen: „zerrot“ ist kein Wort.' },
    { id: 'inv-4', prefix: 'auf-', root: 'gestern', explanation: 'Auf ein Zeitwort passt kein „auf-“: „aufgestern“ gibt es nicht.' },
    { id: 'inv-5', prefix: 'ein-', root: 'rot', explanation: '„Einrot“ ist kein deutsches Wort. Du kannst aber „einfärben“ sagen.' },
    { id: 'inv-6', prefix: 'mit-', root: 'Tisch', explanation: 'Für Tische gibt es kein „mit-“: „Mittisch“ ist kein Wort.' },
    { id: 'inv-7', prefix: 'nach-', root: 'grün', explanation: 'Farben bekommen kein „nach-“: „nachgrün“ ist kein Wort.' },
    { id: 'inv-8', prefix: 'ver-', root: 'Banane', explanation: '„Verbanane“ ist kein Wort. Obst bekommt kein „ver-“.' },
    { id: 'inv-9', prefix: 're-', root: 'Spiel', explanation: '„Respiel“ ist kein deutsches Wort. „Re-“ passt nur zu Fremdwörtern.' },
    { id: 'inv-10', prefix: 'ab-', root: 'Himbeere', explanation: '„Abhimbeere“ gibt es nicht. Beeren bekommen kein „ab-“.' },
    { id: 'inv-11', prefix: 'hoch-', root: 'Banane', explanation: 'Obst kann man nicht hoch-tun: „Hochbanane“ ist kein Wort.' },
    { id: 'inv-12', prefix: 'ab-', root: 'Käse', explanation: '„Abkäse“ gibt es nicht. Käse bekommt keine Vorsilbe ab-.' },
    { id: 'inv-13', prefix: 'zer-', root: 'Hund', explanation: 'Tiere bekommen kein „zer-“: „zerhund“ ist kein Wort.' },
    { id: 'inv-14', prefix: 'vor-', root: 'blau', explanation: 'Farben bekommen kein „vor-“: „vorblau“ ist kein Wort.' },
    { id: 'inv-15', prefix: 'aus-', root: 'Sonne', explanation: '„Aussonne“ ist kein deutsches Wort.' },
    { id: 'inv-16', prefix: 'mit-', root: 'Himmel', explanation: '„Mithimmel“ gibt es in der deutschen Sprache nicht.' },
    { id: 'inv-17', prefix: 'weg-', root: 'Zucker', explanation: '„Wegzucker“ ist kein Wort. Zucker bekommt kein „weg-“.' },
    { id: 'inv-18', prefix: 'anti-', root: 'Wurst', explanation: '„Antiwurst“ ist kein echtes deutsches Wort.' },
    { id: 'inv-19', prefix: 'bio-', root: 'Wolke', explanation: '„Biowolke“ gibt es nicht. Wolken sind von Natur aus da.' },
    { id: 'inv-20', prefix: 'tele-', root: 'Apfel', explanation: '„Teleapfel“ ist kein Wort. Äpfel kann man nicht fern-essen.' },
    { id: 'inv-21', prefix: 'sub-', root: 'Katze', explanation: '„Subkatze“ ist kein Wort. „Sub-“ passt nicht zu Haustieren.' },
  ],
}

// Self-check (contracts/dataset.md invariants) – throws with all violations at module load.
assertDatasetValid(DE_DATASET)
registerDataset(DE_DATASET)
