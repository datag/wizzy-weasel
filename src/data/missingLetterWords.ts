import type { MissingLetterWord } from '@/types/index'

const DE: MissingLetterWord[] = [
  { before: 'Sta',     solution: 'd',  after: 't'       }, // Stadt
  { before: 'Wal',     solution: 'd',  after: ''        }, // Wald
  { before: 'Kin',     solution: 'd',  after: ''        }, // Kind
  { before: 'Ka',      solution: 'ff', after: 'ee'      }, // Kaffee
  { before: 'Ha',      solution: 'mm', after: 'er'      }, // Hammer
  { before: 'Schau',   solution: 'k',  after: 'el'      }, // Schaukel
  { before: 'Brü',     solution: 'ck', after: 'e'       }, // Brücke
  { before: 'Fahr',    solution: 'r',  after: 'ad'      }, // Fahrrad
  { before: 'Jo',      solution: 'gh', after: 'urt'     }, // Joghurt
  { before: 'Schwi',   solution: 'mm', after: 'bad'     }, // Schwimmbad
  { before: 'Fahr',    solution: 's',  after: 'tuhl'    }, // Fahrstuhl
  { before: 'Him',     solution: 'b',  after: 'eere'    }, // Himbeere
  { before: 'Stre',    solution: 'ck', after: 'e'       }, // Strecke
  { before: 'Her',     solution: 'b',  after: 'st'      }, // Herbst
  { before: 'Schme',   solution: 'tt', after: 'erling'  }, // Schmetterling
  { before: 'Rhy',     solution: 'th', after: 'mus'     }, // Rhythmus
  { before: 'Biblio',  solution: 'th', after: 'ek'      }, // Bibliothek
  { before: 'Voka',    solution: 'b',  after: 'el'      }, // Vokabel
  { before: 'Zy',      solution: 'k',  after: 'lus'     }, // Zyklus
  { before: 'Brief',   solution: 'k',  after: 'asten'   }, // Briefkasten
]

const EN: MissingLetterWord[] = [
  { before: '',      solution: 'kn', after: 'ee'      }, // knee
  { before: '',      solution: 'wr', after: 'ap'      }, // wrap
  { before: 'kni',   solution: 'gh', after: 't'       }, // knight
  { before: 'com',   solution: 'b',  after: ''        }, // comb
  { before: 'is',    solution: 'l',  after: 'and'     }, // island
  { before: 'cas',   solution: 'tl', after: 'e'       }, // castle
  { before: 'rhy',   solution: 'th', after: 'm'       }, // rhythm
  { before: 'lam',   solution: 'b',  after: ''        }, // lamb
  { before: '',      solution: 'g',  after: 'nome'    }, // gnome
  { before: 'col',   solution: 'u',  after: 'mn'      }, // column
  { before: 'sci',   solution: 'ss', after: 'ors'     }, // scissors
  { before: 'Wed',   solution: 'n',  after: 'esday'   }, // Wednesday
  { before: '',      solution: 'w',  after: 'hole'    }, // whole
  { before: 'thum',  solution: 'b',  after: ''        }, // thumb
  { before: '',      solution: 'h',  after: 'onest'   }, // honest
  { before: 'dou',   solution: 'b',  after: 't'       }, // doubt
  { before: 'li',    solution: 's',  after: 'ten'     }, // listen
  { before: 'autu',  solution: 'mn', after: ''        }, // autumn
  { before: 'fas',   solution: 't',  after: 'en'      }, // fasten
  { before: 'whis',  solution: 't',  after: 'le'      }, // whistle
]

export const WORD_LISTS: Record<string, MissingLetterWord[]> = { de: DE, en: EN }
