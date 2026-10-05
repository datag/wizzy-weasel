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
    // ─── Germanisch (deutsche Erbpräfixe) ────────────────────────────────
    { id: 'ab', prefix: 'ab-', origin: 'germanic', meaning: 'weg, fort', examples: [
      { word: 'abfahren', sentence: 'Wir wollen gleich abfahren.' },
      { word: 'abholen', sentence: 'Ich will dich am Bahnhof abholen.' },
    ] },
    { id: 'an', prefix: 'an-', origin: 'germanic', meaning: 'hin, dazu', examples: [
      { word: 'ankommen', sentence: 'Der Zug soll gleich ankommen.' },
      { word: 'anziehen', sentence: 'Ich will die Jacke anziehen.' },
    ] },
    { id: 'auf', prefix: 'auf-', origin: 'germanic', meaning: 'nach oben, offen', examples: [
      { word: 'aufstehen', sentence: 'Ich muss morgen früh aufstehen.' },
      { word: 'aufmachen', sentence: 'Kannst du das Fenster aufmachen?' },
    ] },
    { id: 'aus', prefix: 'aus-', origin: 'germanic', meaning: 'heraus', examples: [
      { word: 'auspacken', sentence: 'Wir wollen die Geschenke auspacken.' },
      { word: 'ausgehen', sentence: 'Heute Abend will ich gerne ausgehen.' },
    ] },
    { id: 'bei', prefix: 'bei-', origin: 'germanic', meaning: 'dazu, heran', examples: [
      { word: 'beibringen', sentence: 'Ich will dir etwas beibringen.' },
      { word: 'beifügen', sentence: 'Ich will eine Zeichnung beifügen.' },
    ] },
    { id: 'ein', prefix: 'ein-', origin: 'germanic', meaning: 'hinein', examples: [
      { word: 'einsteigen', sentence: 'Wir wollen schnell einsteigen.' },
      { word: 'einkaufen', sentence: 'Wir wollen heute einkaufen.' },
    ] },
    { id: 'ent', prefix: 'ent-', origin: 'germanic', meaning: 'weg, davon', examples: [
      { word: 'entdecken', sentence: 'Wir wollen den Schatz entdecken.' },
      { word: 'entfernen', sentence: 'Du sollst den Fleck entfernen.' },
    ] },
    { id: 'er', prefix: 'er-', origin: 'germanic', meaning: 'ein Ziel erreichen', examples: [
      { word: 'erfahren', sentence: 'Ich will mehr darüber erfahren.' },
      { word: 'erkennen', sentence: 'Ich will das Tier erkennen.' },
    ] },
    { id: 'fest', prefix: 'fest-', origin: 'germanic', meaning: 'fest, sicher', examples: [
      { word: 'festhalten', sentence: 'Du sollst das Seil festhalten.' },
      { word: 'festmachen', sentence: 'Wir wollen das Boot festmachen.' },
    ] },
    { id: 'fort', prefix: 'fort-', origin: 'germanic', meaning: 'weg, weiter', examples: [
      { word: 'fortgehen', sentence: 'Ich will noch nicht fortgehen.' },
      { word: 'fortsetzen', sentence: 'Wir wollen die Geschichte fortsetzen.' },
    ] },
    { id: 'her', prefix: 'her-', origin: 'germanic', meaning: 'hierher, zu mir', examples: [
      { word: 'herkommen', sentence: 'Du kannst einfach herkommen.' },
      { word: 'herholen', sentence: 'Ich will meinen Ball herholen.' },
    ] },
    { id: 'hin', prefix: 'hin-', origin: 'germanic', meaning: 'dorthin, von mir weg', examples: [
      { word: 'hingehen', sentence: 'Ich will dorthin hingehen.' },
      { word: 'hinsetzen', sentence: 'Du sollst dich hinsetzen.' },
    ] },
    { id: 'hoch', prefix: 'hoch-', origin: 'germanic', meaning: 'nach oben', examples: [
      { word: 'hochheben', sentence: 'Kannst du die Kiste hochheben?' },
      { word: 'hochspringen', sentence: 'Der Hund kann hochspringen.' },
    ] },
    { id: 'los', prefix: 'los-', origin: 'germanic', meaning: 'beginnt, löst sich', examples: [
      { word: 'losfahren', sentence: 'Wir wollen bald losfahren.' },
      { word: 'loslassen', sentence: 'Du sollst nicht loslassen.' },
    ] },
    { id: 'mit', prefix: 'mit-', origin: 'germanic', meaning: 'zusammen, dabei', examples: [
      { word: 'mitspielen', sentence: 'Darf ich auch mitspielen?' },
      { word: 'mitgehen', sentence: 'Willst du mitgehen?' },
    ] },
    { id: 'nach', prefix: 'nach-', origin: 'germanic', meaning: 'hinterher, danach', examples: [
      { word: 'nachsehen', sentence: 'Ich will kurz nachsehen.' },
      { word: 'nachfragen', sentence: 'Du sollst im Büro nachfragen.' },
    ] },
    { id: 'um', prefix: 'um-', origin: 'germanic', meaning: 'ringsherum', examples: [
      { word: 'umarmen', sentence: 'Ich will dich fest umarmen.' },
      { word: 'umrunden', sentence: 'Wir wollen den See umrunden.' },
    ] },
    { id: 'ueber', prefix: 'über-', origin: 'germanic', meaning: 'darüber, hinüber', examples: [
      { word: 'überholen', sentence: 'Das Auto will uns überholen.' },
      { word: 'überkochen', sentence: 'Die Milch kann leicht überkochen.' },
    ] },
    { id: 'unter', prefix: 'unter-', origin: 'germanic', meaning: 'darunter, nach unten', examples: [
      { word: 'untergehen', sentence: 'Wir wollen nicht untergehen.' },
      { word: 'unterlegen', sentence: 'Ich will ein Blatt unterlegen.' },
    ] },
    { id: 'ver', prefix: 'ver-', origin: 'germanic', meaning: 'verändert, weg', examples: [
      { word: 'verstecken', sentence: 'Ich will mich verstecken.' },
      { word: 'verreisen', sentence: 'Wir wollen im Sommer verreisen.' },
    ] },
    { id: 'vor', prefix: 'vor-', origin: 'germanic', meaning: 'davor, voraus', examples: [
      { word: 'vorlesen', sentence: 'Ich will dir eine Geschichte vorlesen.' },
      { word: 'vorsagen', sentence: 'Kannst du mir die Antwort vorsagen?' },
    ] },
    { id: 'weg', prefix: 'weg-', origin: 'germanic', meaning: 'weg, fort', examples: [
      { word: 'weglaufen', sentence: 'Ich will nicht weglaufen.' },
      { word: 'wegnehmen', sentence: 'Du sollst das Spielzeug nicht wegnehmen.' },
    ] },
    { id: 'wieder', prefix: 'wieder-', origin: 'germanic', meaning: 'noch einmal', examples: [
      { word: 'wiederholen', sentence: 'Wir wollen das Wort wiederholen.' },
      { word: 'wiedersehen', sentence: 'Wir wollen uns bald wiedersehen.' },
    ] },
    { id: 'zer', prefix: 'zer-', origin: 'germanic', meaning: 'kaputt, auseinander', examples: [
      { word: 'zerbrechen', sentence: 'Die Tasse kann zerbrechen.' },
      { word: 'zerreißen', sentence: 'Ich will das Papier zerreißen.' },
    ] },
    { id: 'zu', prefix: 'zu-', origin: 'germanic', meaning: 'geschlossen, hin', examples: [
      { word: 'zumachen', sentence: 'Du sollst das Fenster zumachen.' },
      { word: 'zulaufen', sentence: 'Der Hund will auf mich zulaufen.' },
    ] },
    { id: 'zusammen', prefix: 'zusammen-', origin: 'germanic', meaning: 'gemeinsam, zusammen', examples: [
      { word: 'zusammenbauen', sentence: 'Wir wollen das Modell zusammenbauen.' },
      { word: 'zusammenlegen', sentence: 'Wir wollen die Sticker zusammenlegen.' },
    ] },

    // ─── Lateinisch ───────────────────────────────────────────────────────
    { id: 'lat-ad', prefix: 'ad-', variants: ['ak-', 'af-'], origin: 'latin', meaning: 'heran, dazu', examples: [
      { word: 'addieren', sentence: 'Wir wollen die Zahlen addieren.' },
      { word: 'Addition', sentence: 'Die Addition ist leicht zu lernen.' },
    ] },
    { id: 'lat-con', prefix: 'kon-', variants: ['kom-', 'kol-', 'ko-'], origin: 'latin', meaning: 'mit, zusammen', examples: [
      { word: 'Konzert', sentence: 'Wir hören ein Konzert.' },
      { word: 'Kontakt', sentence: 'Wir bleiben in Kontakt.' },
    ] },
    { id: 'lat-contra', prefix: 'kontra-', variants: ['kontr-'], origin: 'latin', meaning: 'gegen', examples: [
      { word: 'Kontrast', sentence: 'Der Kontrast ist sehr stark.' },
      { word: 'Kontrabass', sentence: 'Der Kontrabass klingt tief.' },
    ] },
    { id: 'lat-de', prefix: 'de-', origin: 'latin', meaning: 'weg, herunter', examples: [
      { word: 'demontieren', sentence: 'Wir wollen die Maschine demontieren.' },
      { word: 'defekt', sentence: 'Der Drucker ist leider defekt.' },
    ] },
    { id: 'lat-deci', prefix: 'dezi-', origin: 'latin', meaning: 'zehn', examples: [
      { word: 'Dezimeter', sentence: 'Ein Dezimeter ist zehn Zentimeter.' },
      { word: 'Deziliter', sentence: 'Ein Deziliter ist ein Zehntelliter.' },
    ] },
    { id: 'lat-dis', prefix: 'dis-', origin: 'latin', meaning: 'auseinander, un-', examples: [
      { word: 'Distanz', sentence: 'Wir halten etwas Distanz.' },
      { word: 'Diskussion', sentence: 'Die Diskussion dauert lange.' },
    ] },
    { id: 'lat-du', prefix: 'du-', variants: ['duo-'], origin: 'latin', meaning: 'zwei', examples: [
      { word: 'Duo', sentence: 'Das Duo singt ein Lied.' },
      { word: 'Duett', sentence: 'Sie singen ein Duett.' },
    ] },
    { id: 'lat-ex', prefix: 'ex-', origin: 'latin', meaning: 'aus, heraus', examples: [
      { word: 'Expedition', sentence: 'Wir starten eine Expedition.' },
      { word: 'Exkursion', sentence: 'Unsere Klasse macht eine Exkursion.' },
    ] },
    { id: 'lat-extra', prefix: 'extra-', origin: 'latin', meaning: 'außerhalb, zusätzlich', examples: [
      { word: 'Extraportion', sentence: 'Ich möchte eine Extraportion.' },
      { word: 'extragroß', sentence: 'Die Torte ist extragroß.' },
    ] },
    { id: 'lat-in', prefix: 'in-', variants: ['im-', 'il-', 'ir-'], origin: 'latin', meaning: 'nicht, un-', examples: [
      { word: 'inkorrekt', sentence: 'Diese Antwort ist inkorrekt.' },
      { word: 'illegal', sentence: 'Das Parken ist hier illegal.' },
    ] },
    { id: 'lat-inter', prefix: 'inter-', origin: 'latin', meaning: 'zwischen', examples: [
      { word: 'Internet', sentence: 'Das Internet ist gerade langsam.' },
      { word: 'Intervall', sentence: 'Zwischen den Tönen ist ein Intervall.' },
    ] },
    { id: 'lat-milli', prefix: 'milli-', origin: 'latin', meaning: 'tausend', examples: [
      { word: 'Millimeter', sentence: 'Ein Millimeter ist sehr klein.' },
      { word: 'Milliliter', sentence: 'Ein Milliliter ist ganz wenig.' },
    ] },
    { id: 'lat-multi', prefix: 'multi-', origin: 'latin', meaning: 'viele', examples: [
      { word: 'Multiplikation', sentence: 'Die Multiplikation ist nicht schwer.' },
      { word: 'Multivitaminsaft', sentence: 'Der Multivitaminsaft schmeckt lecker.' },
    ] },
    { id: 'lat-non', prefix: 'non-', origin: 'latin', meaning: 'nicht', examples: [
      { word: 'Nonstop', sentence: 'Der Film läuft nonstop.' },
      { word: 'Nonsens', sentence: 'Diese Ausrede ist Nonsens.' },
    ] },
    { id: 'lat-omni', prefix: 'omni-', origin: 'latin', meaning: 'alles', examples: [
      { word: 'Omnibus', sentence: 'Der Omnibus hält an der Haltestelle.' },
      { word: 'Omnipräsenz', sentence: 'Omnipräsenz heißt überall sein.' },
    ] },
    { id: 'lat-prae', prefix: 'prä-', origin: 'latin', meaning: 'vor, vorne', examples: [
      { word: 'Präfix', sentence: 'Ein Präfix steht vorne.' },
      { word: 'Präposition', sentence: 'Die Präposition ist ein Wortteil.' },
    ] },
    { id: 'lat-pro', prefix: 'pro-', origin: 'latin', meaning: 'vorwärts, für', examples: [
      { word: 'Projekt', sentence: 'Wir planen ein Projekt.' },
      { word: 'probieren', sentence: 'Ich will das Eis probieren.' },
    ] },
    { id: 'lat-re', prefix: 're-', origin: 'latin', meaning: 'zurück, wieder', examples: [
      { word: 'reparieren', sentence: 'Wir wollen das Fahrrad reparieren.' },
      { word: 'renovieren', sentence: 'Sie wollen das Zimmer renovieren.' },
    ] },
    { id: 'lat-se', prefix: 'se-', origin: 'latin', meaning: 'getrennt, ohne', examples: [
      { word: 'separat', sentence: 'Die Socken liegen separat.' },
      { word: 'separieren', sentence: 'Wir wollen die Farben separieren.' },
    ] },
    { id: 'lat-semi', prefix: 'semi-', origin: 'latin', meaning: 'halb', examples: [
      { word: 'Semifinale', sentence: 'Das Semifinale beginnt bald.' },
      { word: 'Semikolon', sentence: 'Ein Semikolon ist ein halbes Zeichen.' },
    ] },
    { id: 'lat-sub', prefix: 'sub-', origin: 'latin', meaning: 'unter', examples: [
      { word: 'subtrahieren', sentence: 'Wir wollen die Zahlen subtrahieren.' },
      { word: 'Subtraktion', sentence: 'Die Subtraktion rechnet weg.' },
    ] },
    { id: 'lat-super', prefix: 'super-', origin: 'latin', meaning: 'über, ganz toll', examples: [
      { word: 'Superheld', sentence: 'Der Superheld kommt schnell.' },
      { word: 'Supermarkt', sentence: 'Der Supermarkt öffnet um acht.' },
    ] },
    { id: 'lat-trans', prefix: 'trans-', origin: 'latin', meaning: 'hinüber, hindurch', examples: [
      { word: 'Transport', sentence: 'Der Transport dauert lange.' },
      { word: 'Transfer', sentence: 'Der Transfer klappt gut.' },
    ] },
    { id: 'lat-ultra', prefix: 'ultra-', origin: 'latin', meaning: 'jenseits, sehr', examples: [
      { word: 'Ultraschall', sentence: 'Der Arzt nutzt den Ultraschall.' },
      { word: 'ultramodern', sentence: 'Das Stadion ist ultramodern.' },
    ] },
    { id: 'lat-uni', prefix: 'uni-', origin: 'latin', meaning: 'eins', examples: [
      { word: 'Universum', sentence: 'Das Universum ist riesig.' },
      { word: 'Uniform', sentence: 'Die Uniform passt genau.' },
    ] },
    { id: 'lat-vice', prefix: 'vize-', variants: ['vice-'], origin: 'latin', meaning: 'stellvertretend', examples: [
      { word: 'Vizekapitän', sentence: 'Der Vizekapitän hilft dem Kapitän.' },
      { word: 'Vizeweltmeister', sentence: 'Der Vizeweltmeister steht auf Platz zwei.' },
    ] },
    { id: 'lat-centi', prefix: 'centi-', origin: 'latin', meaning: 'hundert', examples: [
      { word: 'Zentimeter', sentence: 'Ein Zentimeter ist klein.' },
      { word: 'Zentiliter', sentence: 'Ein Zentiliter ist ganz wenig.' },
    ] },

    // ─── Griechisch ───────────────────────────────────────────────────────
    { id: 'gr-anti', prefix: 'anti-', origin: 'greek', meaning: 'gegen', examples: [
      { word: 'Antirutschmatte', sentence: 'Die Antirutschmatte liegt in der Badewanne.' },
      { word: 'antibakteriell', sentence: 'Diese Seife ist antibakteriell.' },
    ] },
    { id: 'gr-archaeo', prefix: 'archäo-', origin: 'greek', meaning: 'alt', examples: [
      { word: 'Archäologie', sentence: 'Archäologie erforscht alte Schätze.' },
      { word: 'Archäologe', sentence: 'Der Archäologe gräbt vorsichtig.' },
    ] },
    { id: 'gr-auto', prefix: 'auto-', origin: 'greek', meaning: 'selbst', examples: [
      { word: 'Automat', sentence: 'Der Automat gibt Süßigkeiten aus.' },
      { word: 'Autogramm', sentence: 'Ich will ein Autogramm haben.' },
    ] },
    { id: 'gr-bio', prefix: 'bio-', origin: 'greek', meaning: 'Leben', examples: [
      { word: 'Biologie', sentence: 'Biologie ist mein Lieblingsfach.' },
      { word: 'biologisch', sentence: 'Das Obst ist biologisch angebaut.' },
    ] },
    { id: 'gr-chrono', prefix: 'chrono-', origin: 'greek', meaning: 'Zeit', examples: [
      { word: 'Chronometer', sentence: 'Der Chronometer misst die Zeit.' },
      { word: 'Chronik', sentence: 'Die Chronik erzählt die Geschichte.' },
    ] },
    { id: 'gr-demo', prefix: 'demo-', origin: 'greek', meaning: 'Volk', examples: [
      { word: 'Demokratie', sentence: 'Die Demokratie ist wichtig.' },
      { word: 'Demokrat', sentence: 'Der Demokrat wählt mit.' },
    ] },
    { id: 'gr-dia', prefix: 'dia-', origin: 'greek', meaning: 'durch, quer', examples: [
      { word: 'Diagonale', sentence: 'Die Diagonale geht quer durch das Viereck.' },
      { word: 'Dialog', sentence: 'Der Dialog hilft uns beiden.' },
    ] },
    { id: 'gr-dys', prefix: 'dys-', origin: 'greek', meaning: 'schlecht, gestört', examples: [
      { word: 'Dysfunktion', sentence: 'Die Maschine hat eine Dysfunktion.' },
      { word: 'Dyslexie', sentence: 'Dyslexie macht das Lesen schwer.' },
    ] },
    { id: 'gr-geo', prefix: 'geo-', origin: 'greek', meaning: 'Erde', examples: [
      { word: 'Geografie', sentence: 'Geografie ist das Fach über die Erde.' },
      { word: 'Geologie', sentence: 'Die Geologie erforscht die Steine.' },
    ] },
    { id: 'gr-hyper', prefix: 'hyper-', origin: 'greek', meaning: 'über, sehr', examples: [
      { word: 'hyperaktiv', sentence: 'Der kleine Hund ist hyperaktiv.' },
      { word: 'hypermodern', sentence: 'Die neue Bahn ist hypermodern.' },
    ] },
    { id: 'gr-hypo', prefix: 'hypo-', origin: 'greek', meaning: 'unter', examples: [
      { word: 'Hypothermie', sentence: 'Hypothermie ist gefährliche Kälte.' },
      { word: 'hypoallergen', sentence: 'Diese Decke ist hypoallergen.' },
    ] },
    { id: 'gr-kilo', prefix: 'kilo-', origin: 'greek', meaning: 'tausend', examples: [
      { word: 'Kilometer', sentence: 'Der Weg ist einen Kilometer lang.' },
      { word: 'Kilogramm', sentence: 'Ein Kilogramm wiegt viel.' },
    ] },
    { id: 'gr-kosmo', prefix: 'kosmo-', origin: 'greek', meaning: 'Weltall, Ordnung', examples: [
      { word: 'Kosmonaut', sentence: 'Der Kosmonaut fliegt ins All.' },
      { word: 'Kosmos', sentence: 'Der Kosmos hat viele Sterne.' },
    ] },
    { id: 'gr-mega', prefix: 'mega-', origin: 'greek', meaning: 'groß', examples: [
      { word: 'Megafon', sentence: 'Das Megafon macht den Ton laut.' },
      { word: 'Megabyte', sentence: 'Ein Megabyte ist eine Speichergröße.' },
    ] },
    { id: 'gr-mikro', prefix: 'mikro-', origin: 'greek', meaning: 'klein', examples: [
      { word: 'Mikroskop', sentence: 'Wir sehen Zellen mit dem Mikroskop.' },
      { word: 'Mikrowelle', sentence: 'Die Mikrowelle wärmt das Essen.' },
    ] },
    { id: 'gr-mono', prefix: 'mono-', origin: 'greek', meaning: 'eins, allein', examples: [
      { word: 'Monolog', sentence: 'Der Schauspieler hält einen Monolog.' },
      { word: 'monochrom', sentence: 'Das Bild ist monochrom.' },
    ] },
    { id: 'gr-ortho', prefix: 'ortho-', origin: 'greek', meaning: 'richtig, gerade', examples: [
      { word: 'Orthografie', sentence: 'Orthografie heißt richtiges Schreiben.' },
      { word: 'Orthopäde', sentence: 'Der Orthopäde hilft dem Rücken.' },
    ] },
    { id: 'gr-para', prefix: 'para-', origin: 'greek', meaning: 'neben', examples: [
      { word: 'parallel', sentence: 'Die zwei Linien sind parallel.' },
      { word: 'Parallele', sentence: 'Die Parallele läuft daneben.' },
    ] },
    { id: 'gr-peri', prefix: 'peri-', origin: 'greek', meaning: 'rundherum', examples: [
      { word: 'Periskop', sentence: 'Das Periskop schaut um die Ecke.' },
      { word: 'Peripherie', sentence: 'Am Rand liegt die Peripherie.' },
    ] },
    { id: 'gr-phono', prefix: 'phono-', origin: 'greek', meaning: 'Klang, Laut', examples: [
      { word: 'Phonetik', sentence: 'Phonetik ist die Lehre von den Lauten.' },
      { word: 'Phonograph', sentence: 'Der Phonograph spielt alte Töne.' },
    ] },
    { id: 'gr-photo', prefix: 'photo-', origin: 'greek', meaning: 'Licht', examples: [
      { word: 'Fotografie', sentence: 'Die Fotografie hängt an der Wand.' },
      { word: 'Fotokopie', sentence: 'Die Fotokopie ist gut lesbar.' },
    ] },
    { id: 'gr-poly', prefix: 'poly-', origin: 'greek', meaning: 'viel', examples: [
      { word: 'Polygon', sentence: 'Ein Polygon hat viele Ecken.' },
      { word: 'polyglott', sentence: 'Der Mann ist polyglott.' },
    ] },
    { id: 'gr-proto', prefix: 'proto-', origin: 'greek', meaning: 'als Erstes, vorher', examples: [
      { word: 'Prototyp', sentence: 'Der Prototyp ist die erste Version.' },
      { word: 'Protokoll', sentence: 'Das Protokoll hält alles fest.' },
    ] },
    { id: 'gr-pseudo', prefix: 'pseudo-', origin: 'greek', meaning: 'falsch, unecht', examples: [
      { word: 'Pseudonym', sentence: 'Er schreibt unter einem Pseudonym.' },
      { word: 'Pseudofreund', sentence: 'Ein Pseudofreund ist kein echter Freund.' },
    ] },
    { id: 'gr-psycho', prefix: 'psycho-', origin: 'greek', meaning: 'Seele', examples: [
      { word: 'Psychologie', sentence: 'Psychologie erforscht die Seele.' },
      { word: 'Psychotherapie', sentence: 'Die Psychotherapie hilft der Seele.' },
    ] },
    { id: 'gr-syn', prefix: 'syn-', variants: ['sym-'], origin: 'greek', meaning: 'zusammen, mit', examples: [
      { word: 'Symmetrie', sentence: 'Der Schmetterling hat Symmetrie.' },
      { word: 'Symphonie', sentence: 'Die Symphonie klingt großartig.' },
    ] },
    { id: 'gr-tele', prefix: 'tele-', origin: 'greek', meaning: 'fern', examples: [
      { word: 'Telefon', sentence: 'Das Telefon klingelt laut.' },
      { word: 'Teleskop', sentence: 'Mit dem Teleskop sehe ich Sterne.' },
    ] },
    { id: 'gr-thermo', prefix: 'thermo-', origin: 'greek', meaning: 'warm', examples: [
      { word: 'Thermosflasche', sentence: 'Die Thermosflasche hält den Tee warm.' },
      { word: 'Thermometer', sentence: 'Das Thermometer zeigt die Wärme.' },
    ] },
    { id: 'gr-tri', prefix: 'tri-', origin: 'greek', meaning: 'drei', examples: [
      { word: 'Triangel', sentence: 'Die Triangel klingt schön.' },
      { word: 'Triathlon', sentence: 'Der Triathlon hat drei Teile.' },
    ] },
    { id: 'gr-zoo', prefix: 'zoo-', origin: 'greek', meaning: 'Tier', examples: [
      { word: 'Zoo', sentence: 'Der Zoo öffnet um neun Uhr.' },
      { word: 'Zoologie', sentence: 'Zoologie ist die Lehre von den Tieren.' },
    ] },
  ],
  invalidPairs: [
    { id: 'inv-1', prefix: 'un-', root: 'laufen', explanation: 'Es gibt kein Wort „unlaufen“. Richtig ist „umlaufen“ oder „anlaufen“.' },
    { id: 'inv-2', prefix: 'ent-', root: 'glücklich', explanation: 'Das Wort „entglücklich“ gibt es nicht. Richtig ist „unglücklich“.', },
    { id: 'inv-3', prefix: 'zer-', root: 'rot', explanation: '„Rot“ kann man nicht mit „zer-“ beginnen: „zerrot“ ist kein Wort.' },
    { id: 'inv-4', prefix: 'auf-', root: 'gestern', explanation: 'Auf ein Zeitwort passt kein „auf-“: „aufgestern“ gibt es nicht.' },
    { id: 'inv-5', prefix: 'ein-', root: 'rot', explanation: '„Einrot“ ist kein deutsches Wort. Du kannst aber „einfärben“ sagen.' },
    { id: 'inv-6', prefix: 'mit-', root: 'Tisch', explanation: 'Für Tische gibt es kein „mit-“: „Mittisch“ ist kein Wort.' },
    { id: 'inv-7', prefix: 'nach-', root: 'grün', explanation: 'Farben bekommen kein „nach-“: „nachgrün“ ist kein Wort.' },
    { id: 'inv-8', prefix: 'ver-', root: 'Banane', explanation: '„Verbanane“ ist kein Wort. Obst bekommt kein „ver-“.' },
    { id: 'inv-9', prefix: 're-', root: 'Spiel', explanation: '„Respiel“ ist kein deutsches Wort. „Re-“ passt nur zu Fremdwörtern.' },
    { id: 'inv-10', prefix: 'ab-', root: 'Himbeere', explanation: '„Abhimbeere“ gibt es nicht. Beeren bekommen kein „ab-“.' },
  ],
}

// Self-check (contracts/dataset.md invariants) – throws with all violations at module load.
assertDatasetValid(DE_DATASET)
registerDataset(DE_DATASET)