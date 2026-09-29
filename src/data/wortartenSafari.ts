import type { SafariStory, SafariToken, SafariWordClass, SafariWordClassConfig } from '@/types'

export const SAFARI_WORD_CLASSES: SafariWordClassConfig[] = [
  {
    key: 'noun',
    nameKey: 'wortartenSafari.classes.noun',
    childNameKey: 'wortartenSafari.classes.nounChild',
    color: '#3b82f6',
    bgClass: 'bg-blue-100 text-blue-900 border-blue-400',
    textClass: 'text-blue-900 font-semibold',
    borderClass: 'border-blue-500',
    badgeClass: 'bg-blue-500 text-white',
    defaultActive: true,
  },
  {
    key: 'verb',
    nameKey: 'wortartenSafari.classes.verb',
    childNameKey: 'wortartenSafari.classes.verbChild',
    color: '#ef4444',
    bgClass: 'bg-rose-100 text-rose-900 border-rose-400',
    textClass: 'text-rose-900 font-semibold',
    borderClass: 'border-rose-500',
    badgeClass: 'bg-rose-500 text-white',
    defaultActive: true,
  },
  {
    key: 'adjective',
    nameKey: 'wortartenSafari.classes.adjective',
    childNameKey: 'wortartenSafari.classes.adjectiveChild',
    color: '#10b981',
    bgClass: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    textClass: 'text-emerald-900 font-semibold',
    borderClass: 'border-emerald-500',
    badgeClass: 'bg-emerald-500 text-white',
    defaultActive: true,
  },
  {
    key: 'article',
    nameKey: 'wortartenSafari.classes.article',
    childNameKey: 'wortartenSafari.classes.articleChild',
    color: '#f59e0b',
    bgClass: 'bg-amber-100 text-amber-900 border-amber-400',
    textClass: 'text-amber-900 font-semibold',
    borderClass: 'border-amber-500',
    badgeClass: 'bg-amber-500 text-white',
    defaultActive: true,
  },
  {
    key: 'pronoun',
    nameKey: 'wortartenSafari.classes.pronoun',
    childNameKey: 'wortartenSafari.classes.pronounChild',
    color: '#8b5cf6',
    bgClass: 'bg-purple-100 text-purple-900 border-purple-400',
    textClass: 'text-purple-900 font-semibold',
    borderClass: 'border-purple-500',
    badgeClass: 'bg-purple-500 text-white',
    defaultActive: false,
  },
  {
    key: 'preposition',
    nameKey: 'wortartenSafari.classes.preposition',
    childNameKey: 'wortartenSafari.classes.prepositionChild',
    color: '#06b6d4',
    bgClass: 'bg-cyan-100 text-cyan-900 border-cyan-400',
    textClass: 'text-cyan-900 font-semibold',
    borderClass: 'border-cyan-500',
    badgeClass: 'bg-cyan-500 text-white',
    defaultActive: false,
  },
]

export const WORD_CLASS_MAP = new Map<SafariWordClass, SafariWordClassConfig>(
  SAFARI_WORD_CLASSES.map(c => [c.key, c])
)

interface RawSentenceDef {
  words: {
    w: string
    c: SafariWordClass
    exp?: string
  }[]
}

function buildStory(id: string, title: string, sentences: RawSentenceDef[]): SafariStory {
  const tokens: SafariToken[] = []
  sentences.forEach((sent, sIdx) => {
    sent.words.forEach((wordDef, wIdx) => {
      const isSentenceEnd = wIdx === sent.words.length - 1
      const isSentenceStart = wIdx === 0
      const isCapitalized = isSentenceStart || wordDef.c === 'noun' || /^[A-ZÄÖÜ]/.test(wordDef.w)
      
      let explanation = wordDef.exp
      if (!explanation) {
        if (wordDef.c === 'noun') {
          explanation = `„${wordDef.w}“ ist ein Nomen (Namenwort). Nomen bezeichnen Lebewesen, Dinge oder Pflanzen und werden immer großgeschrieben.`
        } else if (wordDef.c === 'verb') {
          explanation = `„${wordDef.w}“ ist ein Verb (Tunwort). Verben sagen uns, was jemand tut oder was geschieht.`
        } else if (wordDef.c === 'adjective') {
          explanation = `„${wordDef.w}“ ist ein Adjektiv (Wiewort). Es beschreibt, wie etwas oder jemand ist.`
        } else if (wordDef.c === 'article') {
          explanation = `„${wordDef.w}“ ist ein Artikel (Begleiter). Er steht als Begleiter vor einem Nomen.`
        } else if (wordDef.c === 'pronoun') {
          explanation = `„${wordDef.w}“ ist ein Pronomen (Fürwort). Es vertritt oder ersetzt ein Nomen.`
        } else if (wordDef.c === 'preposition') {
          explanation = `„${wordDef.w}“ ist eine Präposition (Vorwort). Es zeigt zum Beispiel einen Ort oder eine Richtung an.`
        } else {
          explanation = `„${wordDef.w}“ verbindet die Wörter im Satz.`
        }
        if (isSentenceStart && wordDef.c !== 'noun') {
          explanation += ` Am Satzanfang schreiben wir dieses Wort groß.`
        }
      }

      tokens.push({
        id: `${id}-s${sIdx + 1}-w${wIdx + 1}`,
        raw: wordDef.w,
        wordClass: wordDef.c,
        isSentenceEnd,
        isCapitalized,
        explanation: explanation!,
      })
    })
  })

  return { id, title, tokens }
}

export const SAFARI_STORIES: SafariStory[] = [
  buildStory('story-01', 'Das freche Wiesel in der Küche', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'kleines', c: 'adjective' }, { w: 'Wiesel', c: 'noun' }, { w: 'schleicht', c: 'verb' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Küche', c: 'noun' }] },
    { words: [{ w: 'Dort', c: 'other' }, { w: 'steht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'großer', c: 'adjective' }, { w: 'Topf', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'riecht', c: 'verb' }, { w: 'nach', c: 'preposition' }, { w: 'leckerer', c: 'adjective' }, { w: 'Suppe', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tier', c: 'noun' }, { w: 'nascht', c: 'verb' }, { w: 'heimlich', c: 'adjective' }, { w: 'Käse', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Koch', c: 'noun' }, { w: 'lacht', c: 'verb' }, { w: 'sehr', c: 'other' }, { w: 'laut', c: 'adjective' }] },
  ]),

  buildStory('story-02', 'Der schläfrige Bär im Baumhaus', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'braune', c: 'adjective' }, { w: 'Bär', c: 'noun' }, { w: 'gähnt', c: 'verb' }, { w: 'herzhaft', c: 'adjective' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'klettert', c: 'verb' }, { w: 'auf', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'hohe', c: 'adjective' }, { w: 'Baumhaus', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'weiches', c: 'adjective' }, { w: 'Kissen', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'bereit', c: 'adjective' }] },
    { words: [{ w: 'Draußen', c: 'other' }, { w: 'weht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'kühler', c: 'adjective' }, { w: 'Wind', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Bär', c: 'noun' }, { w: 'schläft', c: 'verb' }, { w: 'schnell', c: 'adjective' }, { w: 'ein', c: 'other' }] },
  ]),

  buildStory('story-03', 'Die kleine Eule lernt fliegen', [
    { words: [{ w: 'Die', c: 'article' }, { w: 'junge', c: 'adjective' }, { w: 'Eule', c: 'noun' }, { w: 'sitzt', c: 'verb' }, { w: 'auf', c: 'preposition' }, { w: 'einem', c: 'article' }, { w: 'Ast', c: 'noun' }] },
    { words: [{ w: 'Ihre', c: 'pronoun' }, { w: 'großen', c: 'adjective' }, { w: 'Augen', c: 'noun' }, { w: 'leuchten', c: 'verb' }, { w: 'hell', c: 'adjective' }] },
    { words: [{ w: 'Sie', c: 'pronoun' }, { w: 'breitet', c: 'verb' }, { w: 'die', c: 'article' }, { w: 'braunen', c: 'adjective' }, { w: 'Flügel', c: 'noun' }, { w: 'aus', c: 'other' }] },
    { words: [{ w: 'Mutig', c: 'adjective' }, { w: 'hüpft', c: 'verb' }, { w: 'sie', c: 'pronoun' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Luft', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'erste', c: 'adjective' }, { w: 'Flug', c: 'noun' }, { w: 'gelingt', c: 'verb' }, { w: 'wunderbar', c: 'adjective' }] },
  ]),

  buildStory('story-04', 'Der Zauberer verliert seinen Stab', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'alter', c: 'adjective' }, { w: 'Zauberer', c: 'noun' }, { w: 'sucht', c: 'verb' }, { w: 'seinen', c: 'pronoun' }, { w: 'Zauberstab', c: 'noun' }] },
    { words: [{ w: 'Überall', c: 'other' }, { w: 'liegen', c: 'verb' }, { w: 'dicke', c: 'adjective' }, { w: 'Bücher', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'bunte', c: 'adjective' }, { w: 'Katze', c: 'noun' }, { w: 'spielt', c: 'verb' }, { w: 'mit', c: 'preposition' }, { w: 'einer', c: 'article' }, { w: 'Feder', c: 'noun' }] },
    { words: [{ w: 'Plötzlich', c: 'other' }, { w: 'funkelt', c: 'verb' }, { w: 'etwas', c: 'pronoun' }, { w: 'unter', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Sessel', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Magier', c: 'noun' }, { w: 'strahlt', c: 'verb' }, { w: 'vor', c: 'preposition' }, { w: 'Freude', c: 'noun' }] },
  ]),

  buildStory('story-05', 'Der hungrige Frosch am Teich', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'grüner', c: 'adjective' }, { w: 'Frosch', c: 'noun' }, { w: 'sitzt', c: 'verb' }, { w: 'am', c: 'preposition' }, { w: 'ruhigem', c: 'adjective' }, { w: 'Teich', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'dicke', c: 'adjective' }, { w: 'Fliege', c: 'noun' }, { w: 'kreist', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Wasser', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'schnappt', c: 'verb' }, { w: 'mit', c: 'preposition' }, { w: 'der', c: 'article' }, { w: 'langen', c: 'adjective' }, { w: 'Zunge', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Insekt', c: 'noun' }, { w: 'entwischt', c: 'verb' }, { w: 'in', c: 'preposition' }, { w: 'letzter', c: 'adjective' }, { w: 'Sekunde', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Frosch', c: 'noun' }, { w: 'quakt', c: 'verb' }, { w: 'ganz', c: 'other' }, { w: 'enttäuscht', c: 'adjective' }] },
  ]),

  buildStory('story-06', 'Das flinke Eichhörnchen sucht Nüsse', [
    { words: [{ w: 'Das', c: 'article' }, { w: 'rote', c: 'adjective' }, { w: 'Eichhörnchen', c: 'noun' }, { w: 'hüpft', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'Moos', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'gräbt', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'tiefes', c: 'adjective' }, { w: 'Loch', c: 'noun' }] },
    { words: [{ w: 'Drei', c: 'other' }, { w: 'braune', c: 'adjective' }, { w: 'Eicheln', c: 'noun' }, { w: 'versteckt', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'Tier', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'grauer', c: 'adjective' }, { w: 'Vogel', c: 'noun' }, { w: 'beobachtet', c: 'verb' }, { w: 'die', c: 'article' }, { w: 'Arbeit', c: 'noun' }] },
    { words: [{ w: 'Zufrieden', c: 'adjective' }, { w: 'klettert', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'Hörnchen', c: 'noun' }, { w: 'hinauf', c: 'other' }] },
  ]),

  buildStory('story-07', 'Der lustige Papagei im Zoo', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'bunte', c: 'adjective' }, { w: 'Papagei', c: 'noun' }, { w: 'ruft', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'lustiges', c: 'adjective' }, { w: 'Wort', c: 'noun' }] },
    { words: [{ w: 'Viele', c: 'pronoun' }, { w: 'Kinder', c: 'noun' }, { w: 'bleiben', c: 'verb' }, { w: 'neugierig', c: 'adjective' }, { w: 'stehen', c: 'verb' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Vogel', c: 'noun' }, { w: 'wackelt', c: 'verb' }, { w: 'mit', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Kopf', c: 'noun' }] },
    { words: [{ w: 'Alle', c: 'pronoun' }, { w: 'Zuschauer', c: 'noun' }, { w: 'klatschen', c: 'verb' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Hände', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Papagei', c: 'noun' }, { w: 'verbeugt', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'stolz', c: 'adjective' }] },
  ]),

  buildStory('story-08', 'Das mutige Kaninchen im Garten', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'weißes', c: 'adjective' }, { w: 'Kaninchen', c: 'noun' }, { w: 'hoppelt', c: 'verb' }, { w: 'durch', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Garten', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'entdeckt', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'saftige', c: 'adjective' }, { w: 'Karotte', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Beute', c: 'noun' }, { w: 'schmeckt', c: 'verb' }, { w: 'herrlich', c: 'adjective' }, { w: 'süß', c: 'adjective' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'Schmetterling', c: 'noun' }, { w: 'landet', c: 'verb' }, { w: 'auf', c: 'preposition' }, { w: 'seiner', c: 'pronoun' }, { w: 'Nase', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tierchen', c: 'noun' }, { w: 'niest', c: 'verb' }, { w: 'ganz', c: 'other' }, { w: 'kräftig', c: 'adjective' }] },
  ]),

  buildStory('story-09', 'Der kleine Drache und die Blasen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'kleiner', c: 'adjective' }, { w: 'Drache', c: 'noun' }, { w: 'übt', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'Feuerspucken', c: 'noun' }] },
    { words: [{ w: 'Statt', c: 'preposition' }, { w: 'Flammen', c: 'noun' }, { w: 'entstehen', c: 'verb' }, { w: 'nur', c: 'other' }, { w: 'bunte', c: 'adjective' }, { w: 'Seifenblasen', c: 'noun' }] },
    { words: [{ w: 'Sie', c: 'pronoun' }, { w: 'schweben', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'grüne', c: 'adjective' }, { w: 'Wiese', c: 'noun' }] },
    { words: [{ w: 'Seine', c: 'pronoun' }, { w: 'Freunde', c: 'noun' }, { w: 'fangen', c: 'verb' }, { w: 'die', c: 'article' }, { w: 'Kugeln', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Drache', c: 'noun' }, { w: 'freut', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'riesig', c: 'adjective' }] },
  ]),

  buildStory('story-10', 'Der verirrte Pinguin auf Rollschuhen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'fröhlicher', c: 'adjective' }, { w: 'Pinguin', c: 'noun' }, { w: 'trägt', c: 'verb' }, { w: 'rote', c: 'adjective' }, { w: 'Rollschuhe', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'fährt', c: 'verb' }, { w: 'geschickt', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Marktplatz', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Leute', c: 'noun' }, { w: 'staunen', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'seine', c: 'pronoun' }, { w: 'Kunststücke', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'dreht', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'schnelle', c: 'adjective' }, { w: 'Pirouette', c: 'noun' }] },
    { words: [{ w: 'Alle', c: 'pronoun' }, { w: 'jubeln', c: 'verb' }, { w: 'dem', c: 'article' }, { w: 'Sportler', c: 'noun' }, { w: 'zu', c: 'other' }] },
  ]),

  buildStory('story-11', 'Das neugierige Kätzchen im Wollkorb', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'graues', c: 'adjective' }, { w: 'Kätzchen', c: 'noun' }, { w: 'schleicht', c: 'verb' }, { w: 'ins', c: 'preposition' }, { w: 'Wohnzimmer', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'sieht', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'großen', c: 'adjective' }, { w: 'Korb', c: 'noun' }, { w: 'mit', c: 'preposition' }, { w: 'Wolle', c: 'noun' }] },
    { words: [{ w: 'Mit', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Pfoten', c: 'noun' }, { w: 'rollt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'ein', c: 'article' }, { w: 'Knäuel', c: 'noun' }] },
    { words: [{ w: 'Schnell', c: 'adjective' }, { w: 'verheddert', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'der', c: 'article' }, { w: 'Faden', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tier', c: 'noun' }, { w: 'schnurrt', c: 'verb' }, { w: 'trotzdem', c: 'other' }, { w: 'zufrieden', c: 'adjective' }] },
  ]),

  buildStory('story-12', 'Der alte Uhu liest ein Buch', [
    { words: [{ w: 'In', c: 'preposition' }, { w: 'der', c: 'article' }, { w: 'Nacht', c: 'noun' }, { w: 'wacht', c: 'verb' }, { w: 'der', c: 'article' }, { w: 'weise', c: 'adjective' }, { w: 'Uhu', c: 'noun' }, { w: 'auf', c: 'other' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'setzt', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'goldene', c: 'adjective' }, { w: 'Brille', c: 'noun' }, { w: 'auf', c: 'other' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'altes', c: 'adjective' }, { w: 'Buch', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'vor', c: 'preposition' }, { w: 'ihm', c: 'pronoun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Geschichten', c: 'noun' }, { w: 'erzählen', c: 'verb' }, { w: 'von', c: 'preposition' }, { w: 'fernen', c: 'adjective' }, { w: 'Ländern', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Vogel', c: 'noun' }, { w: 'lauscht', c: 'verb' }, { w: 'dem', c: 'article' }, { w: 'Wind', c: 'noun' }] },
  ]),

  buildStory('story-13', 'Der hungrige Igel im Laubhaufen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'kleiner', c: 'adjective' }, { w: 'Igel', c: 'noun' }, { w: 'raschelt', c: 'verb' }, { w: 'im', c: 'preposition' }, { w: 'trockenen', c: 'adjective' }, { w: 'Laub', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'sucht', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'leckeren', c: 'adjective' }, { w: 'Wurm', c: 'noun' }] },
    { words: [{ w: 'Seine', c: 'pronoun' }, { w: 'feine', c: 'adjective' }, { w: 'Nase', c: 'noun' }, { w: 'schnuppert', c: 'verb' }, { w: 'an', c: 'preposition' }, { w: 'einem', c: 'article' }, { w: 'Apfel', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Obst', c: 'noun' }, { w: 'schmeckt', c: 'verb' }, { w: 'frisch', c: 'adjective' }, { w: 'und', c: 'other' }, { w: 'süß', c: 'adjective' }] },
    { words: [{ w: 'Satt', c: 'adjective' }, { w: 'rollt', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'das', c: 'article' }, { w: 'Tier', c: 'noun' }, { w: 'zusammen', c: 'other' }] },
  ]),

  buildStory('story-14', 'Das kleine Gespenst mag Eis', [
    { words: [{ w: 'Um', c: 'preposition' }, { w: 'Mitternacht', c: 'noun' }, { w: 'schwebt', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'weißes', c: 'adjective' }, { w: 'Gespenst', c: 'noun' }, { w: 'herum', c: 'other' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'fliegt', c: 'verb' }, { w: 'direkt', c: 'adjective' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Eisdiele', c: 'noun' }] },
    { words: [{ w: 'Dort', c: 'other' }, { w: 'gibt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'kühles', c: 'adjective' }, { w: 'Erdbeereis', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Geistchen', c: 'noun' }, { w: 'schleckt', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'große', c: 'adjective' }, { w: 'Kugel', c: 'noun' }] },
    { words: [{ w: 'Fröhlich', c: 'adjective' }, { w: 'spukt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'durch', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Gassen', c: 'noun' }] },
  ]),

  buildStory('story-15', 'Der kleine Hund jagt Schmetterlinge', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'junger', c: 'adjective' }, { w: 'Hund', c: 'noun' }, { w: 'tollt', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Wiese', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'gelber', c: 'adjective' }, { w: 'Falter', c: 'noun' }, { w: 'fliegt', c: 'verb' }, { w: 'vorbei', c: 'other' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Welpe', c: 'noun' }, { w: 'springt', c: 'verb' }, { w: 'hoch', c: 'adjective' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Luft', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'landet', c: 'verb' }, { w: 'in', c: 'preposition' }, { w: 'einer', c: 'article' }, { w: 'tiefen', c: 'adjective' }, { w: 'Pfütze', c: 'noun' }] },
    { words: [{ w: 'Sein', c: 'pronoun' }, { w: 'Fell', c: 'noun' }, { w: 'ist', c: 'verb' }, { w: 'völlig', c: 'other' }, { w: 'nass', c: 'adjective' }] },
  ]),

  buildStory('story-16', 'Der schlaue Fuchs findet eine Brille', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'rote', c: 'adjective' }, { w: 'Fuchs', c: 'noun' }, { w: 'schnüffelt', c: 'verb' }, { w: 'am', c: 'preposition' }, { w: 'Waldrand', c: 'noun' }] },
    { words: [{ w: 'Im', c: 'preposition' }, { w: 'Gras', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'runde', c: 'adjective' }, { w: 'Brille', c: 'noun' }] },
    { words: [{ w: 'Neugierig', c: 'adjective' }, { w: 'setzt', c: 'verb' }, { w: 'er', c: 'pronoun' }, { w: 'das', c: 'article' }, { w: 'Gestell', c: 'noun' }, { w: 'auf', c: 'other' }] },
    { words: [{ w: 'Plötzlich', c: 'other' }, { w: 'sieht', c: 'verb' }, { w: 'er', c: 'pronoun' }, { w: 'jeden', c: 'pronoun' }, { w: 'Käfer', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Fuchs', c: 'noun' }, { w: 'fühlt', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'sehr', c: 'other' }, { w: 'klug', c: 'adjective' }] },
  ]),

  buildStory('story-17', 'Der faule Dachs schläft gern', [
    { words: [{ w: 'In', c: 'preposition' }, { w: 'seinem', c: 'pronoun' }, { w: 'Bau', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'der', c: 'article' }, { w: 'dicke', c: 'adjective' }, { w: 'Dachs', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Sonne', c: 'noun' }, { w: 'scheint', c: 'verb' }, { w: 'warm', c: 'adjective' }, { w: 'auf', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Eingang', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'dreht', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'auf', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Rücken', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'leises', c: 'adjective' }, { w: 'Schnarchen', c: 'noun' }, { w: 'ertönt', c: 'verb' }, { w: 'im', c: 'preposition' }, { w: 'Wald', c: 'noun' }] },
    { words: [{ w: 'Niemand', c: 'pronoun' }, { w: 'weckt', c: 'verb' }, { w: 'den', c: 'article' }, { w: 'müden', c: 'adjective' }, { w: 'Schläfer', c: 'noun' }] },
  ]),

  buildStory('story-18', 'Das flinke Wiesel backt Pizza', [
    { words: [{ w: 'Das', c: 'article' }, { w: 'Wiesel', c: 'noun' }, { w: 'knetet', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'weichen', c: 'adjective' }, { w: 'Teig', c: 'noun' }] },
    { words: [{ w: 'Rote', c: 'adjective' }, { w: 'Tomaten', c: 'noun' }, { w: 'verteilt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'darauf', c: 'other' }] },
    { words: [{ w: 'Viel', c: 'pronoun' }, { w: 'Käse', c: 'noun' }, { w: 'schmilzt', c: 'verb' }, { w: 'im', c: 'preposition' }, { w: 'heißen', c: 'adjective' }, { w: 'Ofen', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'würziger', c: 'adjective' }, { w: 'Duft', c: 'noun' }, { w: 'zieht', c: 'verb' }, { w: 'durch', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'Haus', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Essen', c: 'noun' }, { w: 'schmeckt', c: 'verb' }, { w: 'allen', c: 'pronoun' }, { w: 'Gästen', c: 'noun' }] },
  ]),

  buildStory('story-19', 'Das verzauberte Schloss im Wald', [
    { words: [{ w: 'Hinter', c: 'preposition' }, { w: 'hohen', c: 'adjective' }, { w: 'Bäumen', c: 'noun' }, { w: 'steht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'altes', c: 'adjective' }, { w: 'Schloss', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'großen', c: 'adjective' }, { w: 'Tore', c: 'noun' }, { w: 'öffnen', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'wie', c: 'other' }, { w: 'von', c: 'preposition' }, { w: 'Zauberhand', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'freundlicher', c: 'adjective' }, { w: 'Ritter', c: 'noun' }, { w: 'winkt', c: 'verb' }, { w: 'den', c: 'article' }, { w: 'Besuchern', c: 'noun' }] },
    { words: [{ w: 'Im', c: 'preposition' }, { w: 'Saal', c: 'noun' }, { w: 'brennen', c: 'verb' }, { w: 'tausend', c: 'other' }, { w: 'Kerzen', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'schöne', c: 'adjective' }, { w: 'Musik', c: 'noun' }, { w: 'erklingt', c: 'verb' }, { w: 'leise', c: 'adjective' }] },
  ]),

  buildStory('story-20', 'Die tanzende Schnecke im Regen', [
    { words: [{ w: 'Dunkle', c: 'adjective' }, { w: 'Wolken', c: 'noun' }, { w: 'bringen', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'warmen', c: 'adjective' }, { w: 'Sommerregen', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'kleine', c: 'adjective' }, { w: 'Schnecke', c: 'noun' }, { w: 'kriecht', c: 'verb' }, { w: 'aus', c: 'preposition' }, { w: 'ihrem', c: 'pronoun' }, { w: 'Haus', c: 'noun' }] },
    { words: [{ w: 'Sie', c: 'pronoun' }, { w: 'gleitet', c: 'verb' }, { w: 'fröhlich', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'ein', c: 'article' }, { w: 'grünes', c: 'adjective' }, { w: 'Blatt', c: 'noun' }] },
    { words: [{ w: 'Kleine', c: 'adjective' }, { w: 'Tropfen', c: 'noun' }, { w: 'perlen', c: 'verb' }, { w: 'auf', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Boden', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tierchen', c: 'noun' }, { w: 'tanzt', c: 'verb' }, { w: 'durch', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Garten', c: 'noun' }] },
  ]),
]
