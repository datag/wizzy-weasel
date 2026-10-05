/**
 * Generic, app-wide dataset self-check (spec FR-019).
 *
 * Scans the recursive `src/data` directory tree for modules exporting a
 * `datasetCheck` object ({ id: string; validate(): string[] }), runs each
 * `validate()`, prints per-dataset results and exits non-zero on any violation
 * or module import error. Datasets without a `datasetCheck` export are
 * intentionally skipped, so the script never needs to know a single game's
 * specifics.
 *
 * Usage:
 *   pnpm run check:datasets          # all datasets
 *   pnpm run check:datasets -- <id>  # only ids containing <id> (substring)
 */
import { globSync, readFileSync } from 'node:fs'
import type { DatasetCheck } from '../src/types'

const CANDIDATE_MARKER = /\bdatasetCheck\b/

/** Files under src/data/ that likely export a datasetCheck (content scan). */
function discoverCandidateFiles(): string[] {
  const files = globSync('src/data/**/*.ts')
  return files.filter(file => CANDIDATE_MARKER.test(readFileSync(file, 'utf8')))
}

async function main(): Promise<void> {
  // tsx forwards: argv[0]=node, argv[1]=tsx cli, argv[2]=this script, argv[3..]=user args
  const argv = process.argv.slice(1)
  const scriptIdx = argv.findIndex((a) => a.endsWith('check-datasets.ts'))
  const rest = scriptIdx >= 0 ? argv.slice(scriptIdx + 1) : argv
  const filter = rest.find((a) => !a.startsWith('-'))
  const candidates = discoverCandidateFiles()

  if (candidates.length === 0) {
    console.error('✗ No datasetCheck exports found under src/data/')
    process.exit(1)
  }

  let failed = false
  let ran = 0

  for (const file of candidates) {
    try {
      // import is relative to this script (scripts/check-datasets.ts)
      const modulePath = `../${file.replace(/\\/g, '/')}`
      const mod = (await import(modulePath)) as { datasetCheck?: DatasetCheck }
      const check = mod.datasetCheck

      if (!check) {
        console.error(`✗ ${file}: module found but no 'datasetCheck' is exported`)
        failed = true
        continue
      }
      if (filter && !check.id.includes(filter)) continue

      const problems = check.validate()
      ran++
      if (problems.length === 0) {
        console.log(`✓ ${check.id} (${file})`)
      } else {
        failed = true
        console.error(`✗ ${check.id} (${file})`)
        for (const problem of problems) console.error(`   - ${problem}`)
      }
    } catch (err) {
      failed = true
      console.error(`✗ ${file}: could not import module`)
      console.error(`   - ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (failed) process.exit(1)
  console.log(`All ${ran} dataset check(s) passed.`)
}

void main()