import type { MissingLetterWord } from '@/types/index'

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
