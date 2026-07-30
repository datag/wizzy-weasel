import type { Bundesland, BundeslandQuestion, BundeslandMode } from '@/types'

// Import all flag SVGs as URLs at build time
const _flagModules = import.meta.glob('../assets/bundeslaender/flags/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const FLAG_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(_flagModules).map(([path, url]) => {
    const key = path.split('/').pop()!.replace('.svg', '')
    return [key, url]
  })
)

export const BUNDESLAENDER: Bundesland[] = [
  {
    id: 'DE-BW',
    svgPathId: 'Baden__x26__Württemberg',
    nameKey: 'bundeslaenderQuiz.states.bw',
    flagPath: 'de-bw',
    capital: 'Stuttgart',
  },
  {
    id: 'DE-BY',
    svgPathId: 'Bayern',
    nameKey: 'bundeslaenderQuiz.states.by',
    flagPath: 'de-by',
    capital: 'München',
  },
  {
    id: 'DE-BE',
    svgPathId: 'Berlin',
    nameKey: 'bundeslaenderQuiz.states.be',
    flagPath: 'de-be',
    capital: 'Berlin',
  },
  {
    id: 'DE-BB',
    svgPathId: 'Brandenburg',
    nameKey: 'bundeslaenderQuiz.states.bb',
    flagPath: 'de-bb',
    capital: 'Potsdam',
  },
  {
    id: 'DE-HB',
    svgPathId: 'Bremen',
    nameKey: 'bundeslaenderQuiz.states.hb',
    flagPath: 'de-hb',
    capital: 'Bremen',
  },
  {
    id: 'DE-HH',
    svgPathId: 'Hamburg',
    nameKey: 'bundeslaenderQuiz.states.hh',
    flagPath: 'de-hh',
    capital: 'Hamburg',
  },
  {
    id: 'DE-HE',
    svgPathId: 'Hessen',
    nameKey: 'bundeslaenderQuiz.states.he',
    flagPath: 'de-he',
    capital: 'Wiesbaden',
  },
  {
    id: 'DE-MV',
    svgPathId: 'Mecklenburg-Vorpommern',
    nameKey: 'bundeslaenderQuiz.states.mv',
    flagPath: 'de-mv',
    capital: 'Schwerin',
  },
  {
    id: 'DE-NI',
    svgPathId: 'Niedersachsen',
    nameKey: 'bundeslaenderQuiz.states.ni',
    flagPath: 'de-ni',
    capital: 'Hannover',
  },
  {
    id: 'DE-NW',
    svgPathId: 'Nordrhein-Westfalen',
    nameKey: 'bundeslaenderQuiz.states.nw',
    flagPath: 'de-nw',
    capital: 'Düsseldorf',
  },
  {
    id: 'DE-RP',
    svgPathId: 'Rheinland-Pfalz',
    nameKey: 'bundeslaenderQuiz.states.rp',
    flagPath: 'de-rp',
    capital: 'Mainz',
  },
  {
    id: 'DE-SL',
    svgPathId: 'Saarland',
    nameKey: 'bundeslaenderQuiz.states.sl',
    flagPath: 'de-sl',
    capital: 'Saarbrücken',
  },
  {
    id: 'DE-SN',
    svgPathId: 'Sachsen',
    nameKey: 'bundeslaenderQuiz.states.sn',
    flagPath: 'de-sn',
    capital: 'Dresden',
  },
  {
    id: 'DE-ST',
    svgPathId: 'Sachsen-Anhalt',
    nameKey: 'bundeslaenderQuiz.states.st',
    flagPath: 'de-st',
    capital: 'Magdeburg',
  },
  {
    id: 'DE-SH',
    svgPathId: 'Schleswig-Holstein',
    nameKey: 'bundeslaenderQuiz.states.sh',
    flagPath: 'de-sh',
    capital: 'Kiel',
  },
  {
    id: 'DE-TH',
    svgPathId: 'Thüringen',
    nameKey: 'bundeslaenderQuiz.states.th',
    flagPath: 'de-th',
    capital: 'Erfurt',
  },
]

export const VALID_SVG_IDS = new Set(BUNDESLAENDER.map(b => b.svgPathId))

export const ROUND_SIZE = 15

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(correct: Bundesland, count: number): Bundesland[] {
  const pool = BUNDESLAENDER.filter(b => b.id !== correct.id)
  return shuffle(pool).slice(0, count)
}

export function buildSession(): BundeslandQuestion[] {
  const modes: BundeslandMode[] = ['map-to-name', 'name-to-map']
  const selected = shuffle(BUNDESLAENDER).slice(0, ROUND_SIZE)

  return selected.map(bundesland => {
    const mode = modes[Math.floor(Math.random() * modes.length)]
    const distractors = pickDistractors(bundesland, 3)
    const options = shuffle([bundesland, ...distractors])
    return { bundesland, mode, options }
  })
}
