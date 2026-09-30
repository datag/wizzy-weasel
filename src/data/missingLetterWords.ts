import type { MissingLetterWord } from '@/types/index'

/**
 * Didaktische Leitlinien für "Schwierige Wortstellen" (Grundschule Klasse 3–4):
 *
 * Rechtschreibphänomene im Deutschen, bei denen das Laut-Buchstaben-Prinzip
 * ("Schreib wie du sprichst") an seine Grenzen stößt. Beim Hinzufügen neuer Wörter
 * sollte eine ausgewogene Mischung aus folgenden 5 Kategorien angestrebt werden:
 *
 * 1. Vokal-Längen und Dehnungen:
 *    - Dehnungs-h (stummes h vor l, m, n, r): fahren, Zahn, Uhr, Ohr
 *    - Langes i: meist als "ie" (Riese, Sieb, fliegen), seltener nur als langes "i" (Maschine, Tiger)
 *    - Doppelvokale: aa, ee, oo (Saat, Beet, Boot, Meer, Haar)
 *
 * 2. Konsonantenverdopplung (Schärfung nach kurzem Vokal):
 *    - Doppelkonsonanten: bb, dd, ff, ll, mm, nn, pp, rr, ss, tt (Hammer, rennen, Puppe, Ball)
 *    - ck statt kk: Bäcker, Brücke, Schnecke, Wecker
 *    - tz statt zz: Katze, Mütze, Blitz, Schatztruhe
 *
 * 3. Gleich und ähnlich klingende Laute:
 *    - ä/e und äu/eu (Ableitung vom Wortstamm): Wald -> Wälder, Baum -> Bäume, Haus -> Häuser
 *    - Auslautverhärtung b/p, d/t, g/k (Verlängerungsprobe): Hund (Hunde), Berg (Berge), Dieb (Diebe)
 *    - v / f / w (Merkwort): v klingt wie f (Vogel, Vater) oder wie w (Vase, Vulkan)
 *
 * 4. Das S-Laut-Problem (s, ss, ß):
 *    - einfaches stimmhaftes s (Sommer, Hase, lesen)
 *    - kurzer Vokal + stimmloses ss (Wasser, Schloss, Kuss, fressen)
 *    - langer Vokal/Zwielaut + stimmloses ß (Straße, Fuß, weiß, fließen, Gruß)
 *
 * 5. Typische Stolpersteine & Merkwörter:
 *    - Wörter mit festen Merkstellen: bisschen (ss statt ß), vielleicht (v + ll), plötzlich (tz)
 */

const DE: MissingLetterWord[] = [
  { sentenceBefore: 'Berlin ist eine sehr große ', before: 'Sta', solution: 'd', after: 't', sentenceAfter: ' mit vielen Museen.' }, // Stadt
  { sentenceBefore: 'Die Rehe spazieren friedlich durch den grünen ', before: 'Wal', solution: 'd', after: '', sentenceAfter: '.' }, // Wald
  { sentenceBefore: 'Auf dem Spielplatz lacht ein fröhliches ', before: 'Kin', solution: 'd', after: '', sentenceAfter: '.' }, // Kind
  { sentenceBefore: 'Mama trinkt zum Frühstück am liebsten eine Tasse ', before: 'Ka', solution: 'ff', after: 'ee', sentenceAfter: '.' }, // Kaffee
  { sentenceBefore: 'Mit einem schweren ', before: 'Ha', solution: 'mm', after: 'er', sentenceAfter: ' schlägt Opa den Nagel in die Wand.' }, // Hammer
  { sentenceBefore: 'Leo schwingt auf der ', before: 'Schau', solution: 'k', after: 'el', sentenceAfter: ' hoch in die Luft.' }, // Schaukel
  { sentenceBefore: 'Die alte ', before: 'Brü', solution: 'ck', after: 'e', sentenceAfter: ' führt über den breiten Fluss.' }, // Brücke
  { sentenceBefore: 'Mia fährt jeden Morgen mit dem ', before: 'Fahr', solution: 'r', after: 'ad', sentenceAfter: ' zur Schule.' }, // Fahrrad
  { sentenceBefore: 'Zum Müsli gibt es frische Beeren und cremigen ', before: 'Jo', solution: 'gh', after: 'urt', sentenceAfter: '.' }, // Joghurt
  { sentenceBefore: 'An heißen Sommertagen gehen wir gerne ins ', before: 'Schwi', solution: 'mm', after: 'bad', sentenceAfter: '.' }, // Schwimmbad
  { sentenceBefore: 'Mit dem schnellen ', before: 'Fahr', solution: 's', after: 'tuhl', sentenceAfter: ' fahren wir in den zehnten Stock.' }, // Fahrstuhl
  { sentenceBefore: 'Im Garten pflücke ich eine süße rote ', before: 'Him', solution: 'b', after: 'eere', sentenceAfter: '.' }, // Himbeere
  { sentenceBefore: 'Die Läufer rennen eine weite ', before: 'Stre', solution: 'ck', after: 'e', sentenceAfter: ' durch den Park.' }, // Strecke
  { sentenceBefore: 'Im bunten ', before: 'Her', solution: 'b', after: 'st', sentenceAfter: ' weht der Wind die Blätter von den Bäumen.' }, // Herbst
  { sentenceBefore: 'Ein bunter ', before: 'Schme', solution: 'tt', after: 'erling', sentenceAfter: ' flattert von Blume zu Blume.' }, // Schmetterling
  { sentenceBefore: 'Zur Musik klatschen alle Kinder im gleichen ', before: 'Rhy', solution: 'th', after: 'mus', sentenceAfter: '.' }, // Rhythmus
  { sentenceBefore: 'In der stillen ', before: 'Biblio', solution: 'th', after: 'ek', sentenceAfter: ' leihen wir uns spannende Bücher aus.' }, // Bibliothek
  { sentenceBefore: 'Jeden Tag lerne ich eine neue englische ', before: 'Voka', solution: 'b', after: 'el', sentenceAfter: '.' }, // Vokabel
  { sentenceBefore: 'Der ', before: 'Zy', solution: 'k', after: 'lus', sentenceAfter: ' der Natur beginnt im Frühling von vorn.' }, // Zyklus
  { sentenceBefore: 'Der Postbote wirft einen Brief in unseren gelben ', before: 'Brief', solution: 'k', after: 'asten', sentenceAfter: '.' }, // Briefkasten
  // ── Neue Wörter nach den 5 Kategorien der schwierigen Wortstellen ──
  { sentenceBefore: 'Der Zahnarzt untersucht vorsichtig jeden einzelnen ', before: 'Za', solution: 'h', after: 'n', sentenceAfter: ' im Mund.' }, // Zahn (Dehnungs-h)
  { sentenceBefore: 'Der Zeiger an der großen ', before: 'U', solution: 'h', after: 'r', sentenceAfter: ' tickt leise an der Wand.' }, // Uhr (Dehnungs-h)
  { sentenceBefore: 'Im Märchen stapft der freundliche ', before: 'R', solution: 'ie', after: 'se', sentenceAfter: ' mit riesigen Schritten.' }, // Riese (langes i als ie)
  { sentenceBefore: 'In der Werkstatt repariert die Mechanikerin die große ', before: 'Masch', solution: 'i', after: 'ne', sentenceAfter: '.' }, // Maschine (langes i als i)
  { sentenceBefore: 'Mit dem kleinen ', before: 'B', solution: 'oo', after: 't', sentenceAfter: ' rudern wir über den ruhigen See.' }, // Boot (Doppelvokal oo)
  { sentenceBefore: 'Im Garten pflanzen wir bunte Blumen in das ', before: 'B', solution: 'ee', after: 't', sentenceAfter: '.' }, // Beet (Doppelvokal ee)
  { sentenceBefore: 'Die getigerte ', before: 'Ka', solution: 'tz', after: 'e', sentenceAfter: ' schleicht leise auf weichen Pfoten.' }, // Katze (tz nach kurzem Vokal)
  { sentenceBefore: 'Jeden Morgen backt der ', before: 'Bä', solution: 'ck', after: 'er', sentenceAfter: ' frische, knusprige Brötchen.' }, // Bäcker (ck nach kurzem Vokal)
  { sentenceBefore: 'Wenn es draußen schneit, setze ich eine warme ', before: 'Mü', solution: 'tz', after: 'e', sentenceAfter: ' auf.' }, // Mütze (tz)
  { sentenceBefore: 'Auf dem Schaukelstuhl sitzt eine alte ', before: 'Pu', solution: 'pp', after: 'e', sentenceAfter: ' aus Stoff.' }, // Puppe (Doppelkonsonant pp)
  { sentenceBefore: 'Im Sportunterricht wirft Jonas den roten ', before: 'Ba', solution: 'll', after: '', sentenceAfter: ' hoch in die Luft.' }, // Ball (Doppelkonsonant ll)
  { sentenceBefore: 'In den dichten ', before: 'W', solution: 'ä', after: 'lder', sentenceAfter: 'n leben viele Rehe und Füchse.' }, // Wälder (ä abgeleitet von Wald)
  { sentenceBefore: 'Im Frühling blühen die hohen ', before: 'B', solution: 'äu', after: 'me', sentenceAfter: ' im Garten wunderschön.' }, // Bäume (äu abgeleitet von Baum)
  { sentenceBefore: 'Der treue ', before: 'Hun', solution: 'd', after: '', sentenceAfter: ' wedelt aufgeregt mit dem Schwanz.' }, // Hund (Auslautverhärtung d statt t)
  { sentenceBefore: 'Im Urlaub wandern wir auf einen steilen ', before: 'Ber', solution: 'g', after: '', sentenceAfter: ' hinauf.' }, // Berg (Auslautverhärtung g statt k)
  { sentenceBefore: 'Ein kleiner bunter ', before: '', solution: 'V', after: 'ogel', sentenceAfter: ' zwitschert fröhlich auf dem Ast.' }, // Vogel (v klingt wie f)
  { sentenceBefore: 'Auf dem Esstisch steht eine schöne gläserne ', before: '', solution: 'V', after: 'ase', sentenceAfter: ' mit frischen Tulpen.' }, // Vase (v klingt wie w)
  { sentenceBefore: 'Nach dem schnellen Dauerlauf trinke ich ein Glas kühles ', before: 'Wa', solution: 'ss', after: 'er', sentenceAfter: '.' }, // Wasser (ss nach kurzem Vokal)
  { sentenceBefore: 'Vor dem Überqueren der breiten ', before: 'Stra', solution: 'ß', after: 'e', sentenceAfter: ' schauen wir nach links und rechts.' }, // Straße (ß nach langem Vokal)
  { sentenceBefore: 'Darf ich bitte noch ein kleines ', before: 'bi', solution: 'ss', after: 'chen', sentenceAfter: ' Nachtisch haben?' }, // bisschen (Merkwort ss statt ß)
  // ── Weitere 30 Wörter nach den 5 Kategorien ──
  { sentenceBefore: 'Der Hund spitzt aufmerksam sein rechtes ', before: 'O', solution: 'h', after: 'r', sentenceAfter: ', als er ein Geräusch hört.' }, // Ohr (Dehnungs-h)
  { sentenceBefore: 'In der kniffligen Rechenaufgabe fehlt die richtige ', before: 'Za', solution: 'h', after: 'l', sentenceAfter: ' im Kästchen.' }, // Zahl (Dehnungs-h)
  { sentenceBefore: 'Der stolze Vater geht mit seinem ', before: 'So', solution: 'h', after: 'n', sentenceAfter: ' zum Fußballtraining.' }, // Sohn (Dehnungs-h)
  { sentenceBefore: 'Am ruhigen Waldrand äst ein scheues braunes ', before: 'Re', solution: 'h', after: '', sentenceAfter: ' im weichen Moos.' }, // Reh (Dehnungs-h)
  { sentenceBefore: 'Beim Hinfallen auf dem Schulhof schmerzte Tims linkes ', before: 'Kn', solution: 'ie', after: '', sentenceAfter: '.' }, // Knie (langes i als ie)
  { sentenceBefore: 'Jeden Morgen bürstet sich Mia die Haare vor dem großen ', before: 'Sp', solution: 'ie', after: 'gel', sentenceAfter: '.' }, // Spiegel (langes i als ie)
  { sentenceBefore: 'Im Tierpark schleicht der hungrige ', before: 'T', solution: 'i', after: 'ger', sentenceAfter: ' leise durch sein Gehege.' }, // Tiger (langes i als i)
  { sentenceBefore: 'Am kühlen Bachlauf baut der fleißige ', before: 'B', solution: 'i', after: 'ber', sentenceAfter: ' eine Burg aus Ästen.' }, // Biber (langes i als i)
  { sentenceBefore: 'Nach dem Waschen glänzt ihr langes blondes ', before: 'H', solution: 'aa', after: 'r', sentenceAfter: ' im Sonnenlicht.' }, // Haar (Doppelvokal aa)
  { sentenceBefore: 'In den Sommerferien schwimmen wir gerne im weiten blauen ', before: 'M', solution: 'ee', after: 'r', sentenceAfter: '.' }, // Meer (Doppelvokal ee)
  { sentenceBefore: 'Auf den schattigen Steinen im Wald wächst weiches ', before: 'M', solution: 'oo', after: 's', sentenceAfter: '.' }, // Moos (Doppelvokal oo)
  { sentenceBefore: 'Nach dem warmen Sommerregen kriecht eine kleine ', before: 'Schne', solution: 'ck', after: 'e', sentenceAfter: ' über den Gehweg.' }, // Schnecke (ck nach kurzem Vokal)
  { sentenceBefore: 'Bei dem heftigen Sommergewitter zuckte ein greller ', before: 'Bli', solution: 'tz', after: '', sentenceAfter: ' am Himmel.' }, // Blitz (tz nach kurzem Vokal)
  { sentenceBefore: 'Am Fahrrad sprang gestern unterwegs die ölige ', before: 'Ke', solution: 'tt', after: 'e', sentenceAfter: ' herunter.' }, // Kette (Doppelkonsonant tt)
  { sentenceBefore: 'An kalten Wintertagen schmeckt eine dampfende ', before: 'Su', solution: 'pp', after: 'e', sentenceAfter: ' besonders gut.' }, // Suppe (Doppelkonsonant pp)
  { sentenceBefore: 'Oma strickt aus kuscheliger bunter ', before: 'Wo', solution: 'll', after: 'e', sentenceAfter: ' warme Handschuhe.' }, // Wolle (Doppelkonsonant ll)
  { sentenceBefore: 'Vorsichtig stellt Ben die heiße ', before: 'Ta', solution: 'ss', after: 'e', sentenceAfter: ' Kakao auf den Küchentisch.' }, // Tasse (Doppelkonsonant ss)
  { sentenceBefore: 'Die mutigen Piraten suchen auf der Insel einen wertvollen ', before: 'Scha', solution: 'tz', after: '', sentenceAfter: '.' }, // Schatz (tz nach kurzem Vokal)
  { sentenceBefore: 'An jedem Schultag klingelt der laute ', before: 'We', solution: 'ck', after: 'er', sentenceAfter: ' pünktlich um sieben Uhr.' }, // Wecker (ck nach kurzem Vokal)
  { sentenceBefore: 'Vor jedem Mittagessen waschen sich die Kinder gründlich die ', before: 'H', solution: 'ä', after: 'nde', sentenceAfter: '.' }, // Hände (ä abgeleitet von Hand)
  { sentenceBefore: 'Im gemütlichen Bett hatte Lisa wunderschöne ', before: 'Tr', solution: 'äu', after: 'me', sentenceAfter: '.' }, // Träume (äu abgeleitet von Traum)
  { sentenceBefore: 'Aus großer Höhe wirken die vielen ', before: 'H', solution: 'äu', after: 'ser', sentenceAfter: ' wie bunte Spielzeugklötze.' }, // Häuser (äu abgeleitet von Haus)
  { sentenceBefore: 'Die schnelle Polizei fasste den flüchtenden ', before: 'Die', solution: 'b', after: '', sentenceAfter: ' noch am Bahnhof.' }, // Dieb (Auslautverhärtung b)
  { sentenceBefore: 'Rotkäppchen trug einen geflochtenen ', before: 'Kor', solution: 'b', after: '', sentenceAfter: ' mit Kuchen durch den Wald.' }, // Korb (Auslautverhärtung b)
  { sentenceBefore: 'Im Märchen regiert ein gerechter alter ', before: 'Köni', solution: 'g', after: '', sentenceAfter: ' auf seinem goldenen Thron.' }, // König (Auslautverhärtung g)
  { sentenceBefore: 'Am Wochenende baut Felix mit seinem ', before: '', solution: 'V', after: 'ater', sentenceAfter: ' eine Seifenkiste.' }, // Vater (v klingt wie f)
  { sentenceBefore: 'Der junge Welpe wartet vor dem Laden ganz geduldig und ', before: 'bra', solution: 'v', after: '', sentenceAfter: '.' }, // brav (v klingt wie f)
  { sentenceBefore: 'Nach der langen Bergwanderung schmerzte sein rechter ', before: 'Fu', solution: 'ß', after: '', sentenceAfter: ' ein wenig.' }, // Fuß (ß nach langem Vokal)
  { sentenceBefore: 'Hoch oben auf dem steilen Felsen steht ein prächtiges altes ', before: 'Schlo', solution: 'ss', after: '', sentenceAfter: '.' }, // Schloss (ss nach kurzem Vokal)
  { sentenceBefore: 'Wenn morgen die Sonne scheint, gehen wir ', before: 'vie', solution: 'll', after: 'eicht', sentenceAfter: ' an den Badesee.' }, // vielleicht (Merkwort mit v und ll)
]

const EN: MissingLetterWord[] = [
  { sentenceBefore: 'She scraped her left ', before: '', solution: 'kn', after: 'ee', sentenceAfter: ' when she slipped.' }, // knee
  { sentenceBefore: 'Please help me ', before: '', solution: 'wr', after: 'ap', sentenceAfter: ' this gift in colorful paper.' }, // wrap
  { sentenceBefore: 'The brave ', before: 'kni', solution: 'gh', after: 't', sentenceAfter: ' guarded the gates of the castle.' }, // knight
  { sentenceBefore: 'Every morning, I tidy my hair with a small ', before: 'com', solution: 'b', after: '', sentenceAfter: '.' }, // comb
  { sentenceBefore: 'A flock of birds flew across the tropical ', before: 'is', solution: 'l', after: 'and', sentenceAfter: '.' }, // island
  { sentenceBefore: 'The ancient stone ', before: 'cas', solution: 'tl', after: 'e', sentenceAfter: ' sits high upon the green hill.' }, // castle
  { sentenceBefore: 'We clapped our hands to the lively ', before: 'rhy', solution: 'th', after: 'm', sentenceAfter: ' of the drums.' }, // rhythm
  { sentenceBefore: 'The gentle little ', before: 'lam', solution: 'b', after: '', sentenceAfter: ' followed its mother across the meadow.' }, // lamb
  { sentenceBefore: 'A friendly garden ', before: '', solution: 'g', after: 'nome', sentenceAfter: ' stands next to the flowers.' }, // gnome
  { sentenceBefore: 'The grand building was supported by a tall stone ', before: 'col', solution: 'u', after: 'mn', sentenceAfter: '.' }, // column
  { sentenceBefore: 'Carefully cut the paper with your safety ', before: 'sci', solution: 'ss', after: 'ors', sentenceAfter: '.' }, // scissors
  { sentenceBefore: 'We have our favorite art class every ', before: 'Wed', solution: 'n', after: 'esday', sentenceAfter: ' afternoon.' }, // Wednesday
  { sentenceBefore: 'He was so hungry that he ate the ', before: '', solution: 'w', after: 'hole', sentenceAfter: ' apple in one go.' }, // whole
  { sentenceBefore: 'She gave a big ', before: 'thum', solution: 'b', after: '', sentenceAfter: 's-up when she finished the puzzle.' }, // thumb
  { sentenceBefore: 'It is always best to be truthful and ', before: '', solution: 'h', after: 'onest', sentenceAfter: ' with your friends.' }, // honest
  { sentenceBefore: 'There was no ', before: 'dou', solution: 'b', after: 't', sentenceAfter: ' that our team played great.' }, // doubt
  { sentenceBefore: 'Please sit quietly and ', before: 'li', solution: 's', after: 'ten', sentenceAfter: ' to the story.' }, // listen
  { sentenceBefore: 'Golden leaves fall softly to the ground during cool ', before: 'autu', solution: 'mn', after: '', sentenceAfter: '.' }, // autumn
  { sentenceBefore: 'Always remember to ', before: 'fas', solution: 't', after: 'en', sentenceAfter: ' your seatbelt in the car.' }, // fasten
  { sentenceBefore: 'The coach blew a loud silver ', before: 'whis', solution: 't', after: 'le', sentenceAfter: ' to start the match.' }, // whistle
]

export const WORD_LISTS: Record<string, MissingLetterWord[]> = { de: DE, en: EN }
