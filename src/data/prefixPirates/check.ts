import type { DatasetCheck } from '@/types'
import { DE_DATASET } from './de'
import { EN_DATASET } from './en'
import { validatePrefixDataset, validateCrossDataset } from './dataset'

/**
 * Präfix-Piraten dataset check – first consumer of the generic app-wide
 * dataset self-check (spec FR-019). Importing this module also loads both
 * datasets, whose module-level `assertDatasetValid` guards still apply.
 */
export const datasetCheck: DatasetCheck = {
  id: 'prefix-pirates',
  validate: () => [
    ...validatePrefixDataset(DE_DATASET).map(p => `[de] ${p}`),
    ...validatePrefixDataset(EN_DATASET).map(p => `[en] ${p}`),
    ...validateCrossDataset(DE_DATASET, EN_DATASET),
  ],
}