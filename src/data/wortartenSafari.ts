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
    key: 'numeral',
    nameKey: 'wortartenSafari.classes.numeral',
    childNameKey: 'wortartenSafari.classes.numeralChild',
    color: '#ea580c',
    bgClass: 'bg-orange-100 text-orange-950 border-orange-400',
    textClass: 'text-orange-950 font-semibold',
    borderClass: 'border-orange-500',
    badgeClass: 'bg-orange-500 text-white',
    defaultActive: false,
  },
  {
    key: 'adverb',
    nameKey: 'wortartenSafari.classes.adverb',
    childNameKey: 'wortartenSafari.classes.adverbChild',
    color: '#6366f1',
    bgClass: 'bg-indigo-100 text-indigo-950 border-indigo-400',
    textClass: 'text-indigo-950 font-semibold',
    borderClass: 'border-indigo-500',
    badgeClass: 'bg-indigo-500 text-white',
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
  {
    key: 'conjunction',
    nameKey: 'wortartenSafari.classes.conjunction',
    childNameKey: 'wortartenSafari.classes.conjunctionChild',
    color: '#65a30d',
    bgClass: 'bg-lime-100 text-lime-950 border-lime-400',
    textClass: 'text-lime-950 font-semibold',
    borderClass: 'border-lime-500',
    badgeClass: 'bg-lime-600 text-white',
    defaultActive: false,
  },
  {
    key: 'interjection',
    nameKey: 'wortartenSafari.classes.interjection',
    childNameKey: 'wortartenSafari.classes.interjectionChild',
    color: '#db2777',
    bgClass: 'bg-pink-100 text-pink-950 border-pink-400',
    textClass: 'text-pink-950 font-semibold',
    borderClass: 'border-pink-500',
    badgeClass: 'bg-pink-600 text-white',
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
    comma?: boolean
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
        } else if (wordDef.c === 'numeral') {
          explanation = `„${wordDef.w}“ ist ein Numerali (Zahlwort). Es nennt eine genaue Anzahl oder Menge.`
        } else if (wordDef.c === 'adverb') {
          explanation = `„${wordDef.w}“ ist ein Adverb (Umstandswort). Es beschreibt die Umstände näher, zum Beispiel wo, wann oder wie etwas geschieht.`
        } else if (wordDef.c === 'conjunction') {
          explanation = `„${wordDef.w}“ ist eine Konjunktion (Bindewort). Es verbindet Wörter oder Satzteile miteinander.`
        } else if (wordDef.c === 'interjection') {
          explanation = `„${wordDef.w}“ ist eine Interjektion (Ausrufewort). Es drückt ein Gefühl oder einen plötzlichen Ausruf aus.`
        } else {
          explanation = `„${wordDef.w}“ ist ein weiteres Begleitwort im Satz.`
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
        hasComma: !!wordDef.comma,
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
    { words: [{ w: 'Dort', c: 'adverb' }, { w: 'steht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'großer', c: 'adjective' }, { w: 'Topf', c: 'noun' }] },
    { words: [{ w: 'Mmh', c: 'interjection', comma: true }, { w: 'es', c: 'pronoun' }, { w: 'riecht', c: 'verb' }, { w: 'nach', c: 'preposition' }, { w: 'leckerer', c: 'adjective' }, { w: 'Suppe', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tier', c: 'noun' }, { w: 'nascht', c: 'verb' }, { w: 'heimlich', c: 'adjective' }, { w: 'zwei', c: 'numeral' }, { w: 'Stücke', c: 'noun' }, { w: 'Käse', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Koch', c: 'noun' }, { w: 'lacht', c: 'verb' }, { w: 'laut', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'fröhlich', c: 'adjective' }] },
  ]),

  buildStory('story-02', 'Der schläfrige Bär im Baumhaus', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'braune', c: 'adjective' }, { w: 'Bär', c: 'noun' }, { w: 'gähnt', c: 'verb' }, { w: 'heute', c: 'adverb' }, { w: 'herzhaft', c: 'adjective' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'klettert', c: 'verb' }, { w: 'flink', c: 'adjective' }, { w: 'auf', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'hohe', c: 'adjective' }, { w: 'Baumhaus', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'weiches', c: 'adjective' }, { w: 'Kissen', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'schon', c: 'adverb' }, { w: 'bereit', c: 'adjective' }] },
    { words: [{ w: 'Draußen', c: 'adverb' }, { w: 'weht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'kühler', c: 'adjective' }, { w: 'Wind', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Bär', c: 'noun' }, { w: 'schläft', c: 'verb' }, { w: 'ruhig', c: 'adjective', comma: true }, { w: 'tief', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'fest', c: 'adjective' }] },
  ]),

  buildStory('story-03', 'Die kleine Eule lernt fliegen', [
    { words: [{ w: 'Die', c: 'article' }, { w: 'junge', c: 'adjective' }, { w: 'Eule', c: 'noun' }, { w: 'sitzt', c: 'verb' }, { w: 'auf', c: 'preposition' }, { w: 'einem', c: 'article' }, { w: 'Ast', c: 'noun' }] },
    { words: [{ w: 'Ihre', c: 'pronoun' }, { w: 'zwei', c: 'numeral' }, { w: 'großen', c: 'adjective' }, { w: 'Augen', c: 'noun' }, { w: 'leuchten', c: 'verb' }, { w: 'hell', c: 'adjective' }] },
    { words: [{ w: 'Sie', c: 'pronoun' }, { w: 'schlägt', c: 'verb' }, { w: 'kräftig', c: 'adjective' }, { w: 'mit', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'braunen', c: 'adjective' }, { w: 'Flügeln', c: 'noun' }] },
    { words: [{ w: 'Mutig', c: 'adjective' }, { w: 'hüpft', c: 'verb' }, { w: 'sie', c: 'pronoun' }, { w: 'jetzt', c: 'adverb' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Luft', c: 'noun' }] },
    { words: [{ w: 'Hui', c: 'interjection', comma: true }, { w: 'der', c: 'article' }, { w: 'erste', c: 'adjective' }, { w: 'Flug', c: 'noun' }, { w: 'gelingt', c: 'verb' }, { w: 'wunderbar', c: 'adjective' }] },
  ]),

  buildStory('story-04', 'Der Zauberer verliert seinen Stab', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'alter', c: 'adjective' }, { w: 'Zauberer', c: 'noun' }, { w: 'sucht', c: 'verb' }, { w: 'seinen', c: 'pronoun' }, { w: 'Zauberstab', c: 'noun' }] },
    { words: [{ w: 'Überall', c: 'adverb' }, { w: 'liegen', c: 'verb' }, { w: 'dicke', c: 'adjective', comma: true }, { w: 'bunte', c: 'adjective' }, { w: 'Bücher', c: 'noun' }, { w: 'und', c: 'conjunction' }, { w: 'alte', c: 'adjective' }, { w: 'Schriftrollen', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'bunte', c: 'adjective' }, { w: 'Katze', c: 'noun' }, { w: 'spielt', c: 'verb' }, { w: 'mit', c: 'preposition' }, { w: 'einer', c: 'article' }, { w: 'Feder', c: 'noun' }] },
    { words: [{ w: 'Plötzlich', c: 'adverb' }, { w: 'funkelt', c: 'verb' }, { w: 'etwas', c: 'pronoun' }, { w: 'unter', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Sessel', c: 'noun' }] },
    { words: [{ w: 'Oho', c: 'interjection', comma: true }, { w: 'der', c: 'article' }, { w: 'Magier', c: 'noun' }, { w: 'strahlt', c: 'verb' }, { w: 'vor', c: 'preposition' }, { w: 'Freude', c: 'noun' }] },
  ]),

  buildStory('story-05', 'Der hungrige Frosch am Teich', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'grüner', c: 'adjective' }, { w: 'Frosch', c: 'noun' }, { w: 'sitzt', c: 'verb' }, { w: 'am', c: 'preposition' }, { w: 'ruhigen', c: 'adjective' }, { w: 'Teich', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'dicke', c: 'adjective' }, { w: 'Fliege', c: 'noun' }, { w: 'kreist', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Wasser', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'schnappt', c: 'verb' }, { w: 'blitzschnell', c: 'adjective' }, { w: 'mit', c: 'preposition' }, { w: 'der', c: 'article' }, { w: 'langen', c: 'adjective' }, { w: 'Zunge', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Insekt', c: 'noun' }, { w: 'entwischt', c: 'verb' }, { w: 'aber', c: 'conjunction' }, { w: 'in', c: 'preposition' }, { w: 'letzter', c: 'adjective' }, { w: 'Sekunde', c: 'noun' }] },
    { words: [{ w: 'Quak', c: 'interjection', comma: true }, { w: 'der', c: 'article' }, { w: 'Frosch', c: 'noun' }, { w: 'schaut', c: 'verb' }, { w: 'sehr', c: 'adverb' }, { w: 'traurig', c: 'adjective' }] },
  ]),

  buildStory('story-06', 'Das flinke Eichhörnchen sucht Nüsse', [
    { words: [{ w: 'Das', c: 'article' }, { w: 'rote', c: 'adjective' }, { w: 'Eichhörnchen', c: 'noun' }, { w: 'hüpft', c: 'verb' }, { w: 'über', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'feuchte', c: 'adjective' }, { w: 'Moos', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'gräbt', c: 'verb' }, { w: 'schnell', c: 'adjective' }, { w: 'ein', c: 'article' }, { w: 'tiefes', c: 'adjective' }, { w: 'Loch', c: 'noun' }] },
    { words: [{ w: 'Drei', c: 'numeral' }, { w: 'braune', c: 'adjective', comma: true }, { w: 'runde', c: 'adjective' }, { w: 'Eicheln', c: 'noun' }, { w: 'versteckt', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'fleißige', c: 'adjective' }, { w: 'Tier', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'grauer', c: 'adjective' }, { w: 'Vogel', c: 'noun' }, { w: 'beobachtet', c: 'verb' }, { w: 'neugierig', c: 'adjective' }, { w: 'die', c: 'article' }, { w: 'Arbeit', c: 'noun' }] },
    { words: [{ w: 'Zufrieden', c: 'adjective' }, { w: 'klettert', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'Hörnchen', c: 'noun' }, { w: 'wieder', c: 'adverb' }, { w: 'hinauf', c: 'adverb' }] },
  ]),

  buildStory('story-07', 'Der lustige Papagei im Zoo', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'bunte', c: 'adjective' }, { w: 'Papagei', c: 'noun' }, { w: 'ruft', c: 'verb' }, { w: 'fünf', c: 'numeral' }, { w: 'lustige', c: 'adjective' }, { w: 'Wörter', c: 'noun' }] },
    { words: [{ w: 'Viele', c: 'pronoun' }, { w: 'Kinder', c: 'noun' }, { w: 'bleiben', c: 'verb' }, { w: 'neugierig', c: 'adjective' }, { w: 'am', c: 'preposition' }, { w: 'Käfig', c: 'noun' }, { w: 'stehen', c: 'verb' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Vogel', c: 'noun' }, { w: 'wackelt', c: 'verb' }, { w: 'lustig', c: 'adjective' }, { w: 'mit', c: 'preposition' }, { w: 'dem', c: 'article' }, { w: 'Kopf', c: 'noun' }] },
    { words: [{ w: 'Alle', c: 'pronoun' }, { w: 'Zuschauer', c: 'noun' }, { w: 'klatschen', c: 'verb' }, { w: 'laut', c: 'adjective' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Hände', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Papagei', c: 'noun' }, { w: 'verbeugt', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'stolz', c: 'adjective', comma: true }, { w: 'heiter', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'glücklich', c: 'adjective' }] },
  ]),

  buildStory('story-08', 'Das mutige Kaninchen im Garten', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'weißes', c: 'adjective' }, { w: 'Kaninchen', c: 'noun' }, { w: 'hoppelt', c: 'verb' }, { w: 'durch', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Garten', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'entdeckt', c: 'verb' }, { w: 'vier', c: 'numeral' }, { w: 'frische', c: 'adjective' }, { w: 'Karotten', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Beute', c: 'noun' }, { w: 'schmeckt', c: 'verb' }, { w: 'herrlich', c: 'adjective' }, { w: 'süß', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'saftig', c: 'adjective' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'Schmetterling', c: 'noun' }, { w: 'landet', c: 'verb' }, { w: 'sanft', c: 'adjective' }, { w: 'auf', c: 'preposition' }, { w: 'seiner', c: 'pronoun' }, { w: 'Nase', c: 'noun' }] },
    { words: [{ w: 'Hatschi', c: 'interjection', comma: true }, { w: 'das', c: 'article' }, { w: 'Tierchen', c: 'noun' }, { w: 'niest', c: 'verb' }, { w: 'sehr', c: 'adverb' }, { w: 'kräftig', c: 'adjective' }] },
  ]),

  buildStory('story-09', 'Der kleine Drache und die Blasen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'kleiner', c: 'adjective' }, { w: 'Drache', c: 'noun' }, { w: 'übt', c: 'verb' }, { w: 'fleißig', c: 'adjective' }, { w: 'das', c: 'article' }, { w: 'Feuerspucken', c: 'noun' }] },
    { words: [{ w: 'Statt', c: 'preposition' }, { w: 'Flammen', c: 'noun' }, { w: 'entstehen', c: 'verb' }, { w: 'heute', c: 'adverb' }, { w: 'nur', c: 'adverb' }, { w: 'bunte', c: 'adjective' }, { w: 'Seifenblasen', c: 'noun' }] },
    { words: [{ w: 'Hui', c: 'interjection', comma: true }, { w: 'sie', c: 'pronoun' }, { w: 'schweben', c: 'verb' }, { w: 'hoch', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Wiese', c: 'noun' }] },
    { words: [{ w: 'Zehn', c: 'numeral' }, { w: 'fröhliche', c: 'adjective' }, { w: 'Freunde', c: 'noun' }, { w: 'fangen', c: 'verb' }, { w: 'die', c: 'article' }, { w: 'Kugeln', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Drache', c: 'noun' }, { w: 'freut', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'riesig', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'tanzt', c: 'verb' }] },
  ]),

  buildStory('story-10', 'Der verirrte Pinguin auf Rollschuhen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'fröhlicher', c: 'adjective' }, { w: 'Pinguin', c: 'noun' }, { w: 'trägt', c: 'verb' }, { w: 'zwei', c: 'numeral' }, { w: 'rote', c: 'adjective' }, { w: 'Rollschuhe', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'fährt', c: 'verb' }, { w: 'geschickt', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'glatten', c: 'adjective' }, { w: 'Marktplatz', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Leute', c: 'noun' }, { w: 'staunen', c: 'verb' }, { w: 'sehr', c: 'adverb' }, { w: 'über', c: 'preposition' }, { w: 'seine', c: 'pronoun' }, { w: 'Kunststücke', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'dreht', c: 'verb' }, { w: 'geschwind', c: 'adjective' }, { w: 'eine', c: 'article' }, { w: 'elegante', c: 'adjective' }, { w: 'Pirouette', c: 'noun' }] },
    { words: [{ w: 'Juhu', c: 'interjection', comma: true }, { w: 'alle', c: 'pronoun' }, { w: 'Menschen', c: 'noun' }, { w: 'klatschen', c: 'verb' }, { w: 'begeistert', c: 'adjective' }, { w: 'Beifall', c: 'noun' }] },
  ]),

  buildStory('story-11', 'Das neugierige Kätzchen im Wollkorb', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'graues', c: 'adjective' }, { w: 'Kätzchen', c: 'noun' }, { w: 'schleicht', c: 'verb' }, { w: 'leise', c: 'adjective' }, { w: 'ins', c: 'preposition' }, { w: 'Wohnzimmer', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'sieht', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'großen', c: 'adjective', comma: true }, { w: 'gemütlichen', c: 'adjective' }, { w: 'Korb', c: 'noun' }, { w: 'mit', c: 'preposition' }, { w: 'Wolle', c: 'noun' }] },
    { words: [{ w: 'Mit', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Pfoten', c: 'noun' }, { w: 'rollt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'drei', c: 'numeral' }, { w: 'bunte', c: 'adjective' }, { w: 'Knäuel', c: 'noun' }] },
    { words: [{ w: 'Doch', c: 'conjunction' }, { w: 'schnell', c: 'adjective' }, { w: 'verheddert', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'der', c: 'article' }, { w: 'lange', c: 'adjective' }, { w: 'Faden', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Tier', c: 'noun' }, { w: 'schnurrt', c: 'verb' }, { w: 'trotzdem', c: 'adverb' }, { w: 'zufrieden', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'schläft', c: 'verb' }] },
  ]),

  buildStory('story-12', 'Der alte Uhu liest ein Buch', [
    { words: [{ w: 'In', c: 'preposition' }, { w: 'der', c: 'article' }, { w: 'dunklen', c: 'adjective' }, { w: 'Nacht', c: 'noun' }, { w: 'erwacht', c: 'verb' }, { w: 'der', c: 'article' }, { w: 'weise', c: 'adjective' }, { w: 'Uhu', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'putzt', c: 'verb' }, { w: 'seine', c: 'pronoun' }, { w: 'zwei', c: 'numeral' }, { w: 'großen', c: 'adjective' }, { w: 'Flügel', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'altes', c: 'adjective', comma: true }, { w: 'spannendes', c: 'adjective' }, { w: 'Buch', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'direkt', c: 'adverb' }, { w: 'vor', c: 'preposition' }, { w: 'ihm', c: 'pronoun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'spannenden', c: 'adjective' }, { w: 'Geschichten', c: 'noun' }, { w: 'erzählen', c: 'verb' }, { w: 'von', c: 'preposition' }, { w: 'fernen', c: 'adjective' }, { w: 'Ländern', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Vogel', c: 'noun' }, { w: 'lauscht', c: 'verb' }, { w: 'aufmerksam', c: 'adjective' }, { w: 'dem', c: 'article' }, { w: 'leisen', c: 'adjective' }, { w: 'Wind', c: 'noun' }] },
  ]),

  buildStory('story-13', 'Der hungrige Igel im Laubhaufen', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'kleiner', c: 'adjective' }, { w: 'Igel', c: 'noun' }, { w: 'raschelt', c: 'verb' }, { w: 'emsig', c: 'adjective' }, { w: 'im', c: 'preposition' }, { w: 'trockenen', c: 'adjective' }, { w: 'Laub', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'sucht', c: 'verb' }, { w: 'überall', c: 'adverb' }, { w: 'nach', c: 'preposition' }, { w: 'einem', c: 'article' }, { w: 'saftigen', c: 'adjective' }, { w: 'Wurm', c: 'noun' }] },
    { words: [{ w: 'Seine', c: 'pronoun' }, { w: 'feine', c: 'adjective' }, { w: 'Nase', c: 'noun' }, { w: 'schnuppert', c: 'verb' }, { w: 'an', c: 'preposition' }, { w: 'einem', c: 'article' }, { w: 'roten', c: 'adjective' }, { w: 'Apfel', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Obst', c: 'noun' }, { w: 'schmeckt', c: 'verb' }, { w: 'frisch', c: 'adjective', comma: true }, { w: 'saftig', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'süß', c: 'adjective' }] },
    { words: [{ w: 'Zufrieden', c: 'adjective' }, { w: 'schläft', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'stachlige', c: 'adjective' }, { w: 'Tier', c: 'noun' }, { w: 'heute', c: 'adverb' }, { w: 'ein', c: 'adverb' }] },
  ]),

  buildStory('story-14', 'Das kleine Gespenst mag Eis', [
    { words: [{ w: 'Um', c: 'preposition' }, { w: 'Mitternacht', c: 'noun' }, { w: 'schwebt', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'weißes', c: 'adjective' }, { w: 'Gespenst', c: 'noun' }, { w: 'durch', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Burg', c: 'noun' }] },
    { words: [{ w: 'Es', c: 'pronoun' }, { w: 'fliegt', c: 'verb' }, { w: 'heimlich', c: 'adjective', comma: true }, { w: 'leise', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'lautlos', c: 'adjective' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'kalte', c: 'adjective' }, { w: 'Küche', c: 'noun' }] },
    { words: [{ w: 'Dort', c: 'adverb' }, { w: 'gibt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'köstliches', c: 'adjective' }, { w: 'Eis', c: 'noun' }] },
    { words: [{ w: 'Das', c: 'article' }, { w: 'Geistchen', c: 'noun' }, { w: 'nascht', c: 'verb' }, { w: 'drei', c: 'numeral' }, { w: 'riesige', c: 'adjective' }, { w: 'Kugeln', c: 'noun' }] },
    { words: [{ w: 'Huhu', c: 'interjection', comma: true }, { w: 'das', c: 'article' }, { w: 'kleine', c: 'adjective' }, { w: 'Wesen', c: 'noun' }, { w: 'kichert', c: 'verb' }, { w: 'vor', c: 'preposition' }, { w: 'Freude', c: 'noun' }] },
  ]),

  buildStory('story-15', 'Der kleine Hund jagt Schmetterlinge', [
    { words: [{ w: 'Ein', c: 'article' }, { w: 'verspielter', c: 'adjective' }, { w: 'Hund', c: 'noun' }, { w: 'tollt', c: 'verb' }, { w: 'munter', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Wiese', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'bunter', c: 'adjective' }, { w: 'Falter', c: 'noun' }, { w: 'flattert', c: 'verb' }, { w: 'schnell', c: 'adjective' }, { w: 'vorbei', c: 'adverb' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Welpe', c: 'noun' }, { w: 'springt', c: 'verb' }, { w: 'mutig', c: 'adjective' }, { w: 'hoch', c: 'adjective' }, { w: 'in', c: 'preposition' }, { w: 'die', c: 'article' }, { w: 'Luft', c: 'noun' }] },
    { words: [{ w: 'Platsch', c: 'interjection', comma: true }, { w: 'er', c: 'pronoun' }, { w: 'landet', c: 'verb' }, { w: 'mitten', c: 'adverb' }, { w: 'in', c: 'preposition' }, { w: 'einer', c: 'article' }, { w: 'tiefen', c: 'adjective' }, { w: 'Pfütze', c: 'noun' }] },
    { words: [{ w: 'Sein', c: 'pronoun' }, { w: 'nasses', c: 'adjective' }, { w: 'Fell', c: 'noun' }, { w: 'tropft', c: 'verb' }, { w: 'nun', c: 'adverb' }, { w: 'ganz', c: 'adverb' }, { w: 'gewaltig', c: 'adjective' }] },
  ]),

  buildStory('story-16', 'Der schlaue Fuchs findet eine Brille', [
    { words: [{ w: 'Der', c: 'article' }, { w: 'rote', c: 'adjective' }, { w: 'Fuchs', c: 'noun' }, { w: 'schnüffelt', c: 'verb' }, { w: 'neugierig', c: 'adjective' }, { w: 'am', c: 'preposition' }, { w: 'Waldrand', c: 'noun' }] },
    { words: [{ w: 'Im', c: 'preposition' }, { w: 'grünen', c: 'adjective' }, { w: 'Gras', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'eine', c: 'article' }, { w: 'runde', c: 'adjective' }, { w: 'Brille', c: 'noun' }] },
    { words: [{ w: 'Oho', c: 'interjection', comma: true }, { w: 'das', c: 'article' }, { w: 'schlaue', c: 'adjective' }, { w: 'Tier', c: 'noun' }, { w: 'probiert', c: 'verb' }, { w: 'die', c: 'article' }, { w: 'Gläser', c: 'noun' }] },
    { words: [{ w: 'Plötzlich', c: 'adverb' }, { w: 'sieht', c: 'verb' }, { w: 'er', c: 'pronoun' }, { w: 'vier', c: 'numeral' }, { w: 'kleine', c: 'adjective' }, { w: 'Käfer', c: 'noun' }] },
    { words: [{ w: 'Der', c: 'article' }, { w: 'Fuchs', c: 'noun' }, { w: 'fühlt', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'schlau', c: 'adjective', comma: true }, { w: 'mutig', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'sehr', c: 'adverb' }, { w: 'weise', c: 'adjective' }] },
  ]),

  buildStory('story-17', 'Der faule Dachs schläft gern', [
    { words: [{ w: 'In', c: 'preposition' }, { w: 'seinem', c: 'pronoun' }, { w: 'gemütlichen', c: 'adjective' }, { w: 'Bau', c: 'noun' }, { w: 'liegt', c: 'verb' }, { w: 'der', c: 'article' }, { w: 'dicke', c: 'adjective' }, { w: 'Dachs', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'Sonne', c: 'noun' }, { w: 'scheint', c: 'verb' }, { w: 'heute', c: 'adverb' }, { w: 'warm', c: 'adjective' }, { w: 'auf', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Eingang', c: 'noun' }] },
    { words: [{ w: 'Er', c: 'pronoun' }, { w: 'dreht', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'langsam', c: 'adjective' }, { w: 'auf', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Rücken', c: 'noun' }] },
    { words: [{ w: 'Drei', c: 'numeral' }, { w: 'Vögel', c: 'noun' }, { w: 'zwitschern', c: 'verb' }, { w: 'laut', c: 'adjective', comma: true }, { w: 'aber', c: 'conjunction' }, { w: 'er', c: 'pronoun' }, { w: 'schläft', c: 'verb' }, { w: 'weiter', c: 'adverb' }] },
    { words: [{ w: 'Niemand', c: 'pronoun' }, { w: 'weckt', c: 'verb' }, { w: 'diesen', c: 'pronoun' }, { w: 'friedlichen', c: 'adjective' }, { w: 'Schläfer', c: 'noun' }] },
  ]),

  buildStory('story-18', 'Das flinke Wiesel backt Pizza', [
    { words: [{ w: 'Das', c: 'article' }, { w: 'fleißige', c: 'adjective' }, { w: 'Wiesel', c: 'noun' }, { w: 'knetet', c: 'verb' }, { w: 'einen', c: 'article' }, { w: 'weichen', c: 'adjective' }, { w: 'Teig', c: 'noun' }] },
    { words: [{ w: 'Rote', c: 'adjective' }, { w: 'Tomaten', c: 'noun' }, { w: 'und', c: 'conjunction' }, { w: 'gelben', c: 'adjective' }, { w: 'Mais', c: 'noun' }, { w: 'legt', c: 'verb' }, { w: 'es', c: 'pronoun' }, { w: 'darauf', c: 'adverb' }] },
    { words: [{ w: 'Viel', c: 'pronoun' }, { w: 'Käse', c: 'noun' }, { w: 'schmilzt', c: 'verb' }, { w: 'im', c: 'preposition' }, { w: 'heißen', c: 'adjective' }, { w: 'Ofen', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'herrlicher', c: 'adjective' }, { w: 'Duft', c: 'noun' }, { w: 'zieht', c: 'verb' }, { w: 'schnell', c: 'adjective' }, { w: 'durch', c: 'preposition' }, { w: 'das', c: 'article' }, { w: 'Haus', c: 'noun' }] },
    { words: [{ w: 'Mmh', c: 'interjection', comma: true }, { w: 'sechs', c: 'numeral' }, { w: 'hungrige', c: 'adjective' }, { w: 'Gäste', c: 'noun' }, { w: 'loben', c: 'verb' }, { w: 'das', c: 'article' }, { w: 'feine', c: 'adjective' }, { w: 'Essen', c: 'noun' }] },
  ]),

  buildStory('story-19', 'Das verzauberte Schloss im Wald', [
    { words: [{ w: 'Hinter', c: 'preposition' }, { w: 'hohen', c: 'adjective' }, { w: 'Bäumen', c: 'noun' }, { w: 'steht', c: 'verb' }, { w: 'ein', c: 'article' }, { w: 'uraltes', c: 'adjective' }, { w: 'Schloss', c: 'noun' }] },
    { words: [{ w: 'Die', c: 'article' }, { w: 'schweren', c: 'adjective' }, { w: 'Tore', c: 'noun' }, { w: 'öffnen', c: 'verb' }, { w: 'sich', c: 'pronoun' }, { w: 'wie', c: 'conjunction' }, { w: 'durch', c: 'preposition' }, { w: 'Zauberei', c: 'noun' }] },
    { words: [{ w: 'Ein', c: 'article' }, { w: 'freundlicher', c: 'adjective' }, { w: 'Ritter', c: 'noun' }, { w: 'winkt', c: 'verb' }, { w: 'den', c: 'article' }, { w: 'erstaunten', c: 'adjective' }, { w: 'Besuchern', c: 'noun' }] },
    { words: [{ w: 'Im', c: 'preposition' }, { w: 'großen', c: 'adjective' }, { w: 'Saal', c: 'noun' }, { w: 'brennen', c: 'verb' }, { w: 'tausend', c: 'numeral' }, { w: 'helle', c: 'adjective' }, { w: 'Kerzen', c: 'noun' }] },
    { words: [{ w: 'Wunderschöne', c: 'adjective' }, { w: 'Musik', c: 'noun' }, { w: 'erklingt', c: 'verb' }, { w: 'leise', c: 'adjective', comma: true }, { w: 'sanft', c: 'adjective' }, { w: 'und', c: 'conjunction' }, { w: 'verzaubert', c: 'verb' }, { w: 'alle', c: 'pronoun' }] },
  ]),

  buildStory('story-20', 'Die tanzende Schnecke im Regen', [
    { words: [{ w: 'Dunkle', c: 'adjective' }, { w: 'Wolken', c: 'noun' }, { w: 'bringen', c: 'verb' }, { w: 'heute', c: 'adverb' }, { w: 'einen', c: 'article' }, { w: 'warmen', c: 'adjective' }, { w: 'Sommerregen', c: 'noun' }] },
    { words: [{ w: 'Eine', c: 'article' }, { w: 'kleine', c: 'adjective' }, { w: 'Schnecke', c: 'noun' }, { w: 'kriecht', c: 'verb' }, { w: 'neugierig', c: 'adjective' }, { w: 'aus', c: 'preposition' }, { w: 'ihrem', c: 'pronoun' }, { w: 'Haus', c: 'noun' }] },
    { words: [{ w: 'Sie', c: 'pronoun' }, { w: 'gleitet', c: 'verb' }, { w: 'langsam', c: 'adjective' }, { w: 'über', c: 'preposition' }, { w: 'zwei', c: 'numeral' }, { w: 'nasse', c: 'adjective' }, { w: 'Blätter', c: 'noun' }] },
    { words: [{ w: 'Juhu', c: 'interjection', comma: true }, { w: 'das', c: 'article' }, { w: 'Tierchen', c: 'noun' }, { w: 'tanzt', c: 'verb' }, { w: 'fröhlich', c: 'adjective' }, { w: 'durch', c: 'preposition' }, { w: 'den', c: 'article' }, { w: 'Garten', c: 'noun' }] },
    { words: [{ w: 'Kleine', c: 'adjective' }, { w: 'Tropfen', c: 'noun' }, { w: 'glitzern', c: 'verb' }, { w: 'bunt', c: 'adjective' }, { w: 'wie', c: 'conjunction' }, { w: 'Diamanten', c: 'noun' }] },
  ]),
]
