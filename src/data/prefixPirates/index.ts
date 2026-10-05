// Barrel for "Präfix-Piraten" data. Importing this module (once) also
// registers both datasets (side effects of de.ts / en.ts), so loadDataset()
// can find them – see contracts/dataset.md (§Module surface).
import './de'
import './en'

export { loadDataset, entriesByOrigin, validatePrefixDataset, validateCrossDataset } from './dataset'
export { buildRound, buildQuestion, prefixLabel, ROUND_LENGTH, ORIGIN_ORDER, OPTION_COUNTS, TYPES_BY_DIFFICULTY } from './generator'