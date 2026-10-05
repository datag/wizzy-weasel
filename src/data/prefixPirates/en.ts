import type { PrefixDataset } from '@/types'
import { registerDataset, assertDatasetValid, validateCrossDataset } from './dataset'
import { DE_DATASET } from './de'

/**
 * English prefix dataset for "Prefix Pirates" (Präfix-Piraten).
 * Content curated and simplified from the Wikipedia articles (CC BY-SA):
 * "Prefix", "English prefix", "List of Greek and Latin roots in English" –
 * https://en.wikipedia.org (accessed 2026-10).
 * This is its own dataset, NOT a translation of the German one (spec FR-013).
 * Each example sentence contains the example word so sentence-gap questions
 * can be generated.
 */

const EN_DATASET: PrefixDataset = {
  language: 'en',
  entries: [
    // ─── Germanic (native English prefixes) ───────────────────────────────
    { id: 'a', prefix: 'a-', origin: 'germanic', meaning: 'in a state, being', examples: [
      { word: 'asleep', sentence: 'The baby is asleep.' },
      { word: 'alive', sentence: 'The fish is still alive.' },
    ] },
    { id: 'back', prefix: 'back-', origin: 'germanic', meaning: 'behind, backward', examples: [
      { word: 'backyard', sentence: 'The dog plays in the backyard.' },
      { word: 'background', sentence: 'The picture has a blue background.' },
    ] },
    { id: 'be', prefix: 'be-', origin: 'germanic', meaning: 'make, cause to be', examples: [
      { word: 'befriend', sentence: 'I want to befriend the new kid.' },
      { word: 'beloved', sentence: 'This is my beloved cat.' },
    ] },
    { id: 'by', prefix: 'by-', origin: 'germanic', meaning: 'near, aside', examples: [
      { word: 'bystander', sentence: 'The bystander saw everything.' },
      { word: 'bypass', sentence: 'We can take the bypass road.' },
    ] },
    { id: 'counter', prefix: 'counter-', origin: 'germanic', meaning: 'against, opposite', examples: [
      { word: 'counterattack', sentence: 'Our team plans a counterattack.' },
      { word: 'counterweight', sentence: 'The counterweight balances the load.' },
    ] },
    { id: 'cross', prefix: 'cross-', origin: 'germanic', meaning: 'across, over', examples: [
      { word: 'crosswalk', sentence: 'We wait at the crosswalk.' },
      { word: 'crosscountry', sentence: 'They go crosscountry skiing.' },
    ] },
    { id: 'down', prefix: 'down-', origin: 'germanic', meaning: 'lower, downward', examples: [
      { word: 'downstairs', sentence: 'The shoes are downstairs.' },
      { word: 'downhill', sentence: 'The sled goes downhill fast.' },
    ] },
    { id: 'for', prefix: 'for-', origin: 'germanic', meaning: 'away, completely', examples: [
      { word: 'forgive', sentence: 'I want to forgive my friend.' },
      { word: 'forget', sentence: 'I will never forget this day.' },
    ] },
    { id: 'fore', prefix: 'fore-', origin: 'germanic', meaning: 'before, in front', examples: [
      { word: 'forehead', sentence: 'He has a bump on his forehead.' },
      { word: 'foretell', sentence: 'Can you foretell the future?' },
    ] },
    { id: 'half', prefix: 'half-', origin: 'germanic', meaning: 'half, halfway', examples: [
      { word: 'halftime', sentence: 'The game stops at halftime.' },
      { word: 'halfway', sentence: 'We are halfway there.' },
    ] },
    { id: 'in', prefix: 'in-', origin: 'germanic', meaning: 'into, inside', examples: [
      { word: 'inside', sentence: 'The toy is inside the box.' },
      { word: 'input', sentence: 'Please give me your input.' },
    ] },
    { id: 'mid', prefix: 'mid-', origin: 'germanic', meaning: 'middle', examples: [
      { word: 'midnight', sentence: 'We reached home at midnight.' },
      { word: 'midway', sentence: 'We stopped midway.' },
    ] },
    { id: 'mini', prefix: 'mini-', origin: 'germanic', meaning: 'small', examples: [
      { word: 'minigolf', sentence: 'We play minigolf in the summer.' },
      { word: 'minivan', sentence: 'The family rides in a minivan.' },
    ] },
    { id: 'mis', prefix: 'mis-', origin: 'germanic', meaning: 'wrongly, bad', examples: [
      { word: 'mistake', sentence: 'I made a mistake.' },
      { word: 'misspell', sentence: 'Do not misspell my name.' },
    ] },
    { id: 'near', prefix: 'near-', origin: 'germanic', meaning: 'close, almost', examples: [
      { word: 'nearsighted', sentence: 'My grandma is nearsighted.' },
      { word: 'nearperfect', sentence: 'The jump was nearperfect.' },
    ] },
    { id: 'off', prefix: 'off-', origin: 'germanic', meaning: 'away, apart', examples: [
      { word: 'offline', sentence: 'The game works offline.' },
      { word: 'offroad', sentence: 'The truck drives offroad.' },
    ] },
    { id: 'on', prefix: 'on-', origin: 'germanic', meaning: 'on, forward', examples: [
      { word: 'online', sentence: 'We meet online.' },
      { word: 'onboard', sentence: 'The captain is onboard.' },
    ] },
    { id: 'out', prefix: 'out-', origin: 'germanic', meaning: 'beyond, outside', examples: [
      { word: 'outside', sentence: 'We play outside.' },
      { word: 'outrun', sentence: 'Can you outrun me?' },
    ] },
    { id: 'over', prefix: 'over-', origin: 'germanic', meaning: 'above, too much', examples: [
      { word: 'overdo', sentence: 'Do not overdo the exercise.' },
      { word: 'overeat', sentence: 'I should not overeat.' },
    ] },
    { id: 'self', prefix: 'self-', origin: 'germanic', meaning: 'oneself, by itself', examples: [
      { word: 'selfconfident', sentence: 'She is very selfconfident.' },
      { word: 'selfhelp', sentence: 'This is a selfhelp book.' },
    ] },
    { id: 'under', prefix: 'under-', origin: 'germanic', meaning: 'below, too little', examples: [
      { word: 'undercook', sentence: 'Do not undercook the eggs.' },
      { word: 'underwater', sentence: 'The plant grows underwater.' },
    ] },
    { id: 'un', prefix: 'un-', origin: 'germanic', meaning: 'not, opposite of', examples: [
      { word: 'unhappy', sentence: 'The bird looks unhappy.' },
      { word: 'unlock', sentence: 'I can unlock the door.' },
    ] },
    { id: 'up', prefix: 'up-', origin: 'germanic', meaning: 'higher, upward', examples: [
      { word: 'upload', sentence: 'I want to upload a photo.' },
      { word: 'upstairs', sentence: 'My room is upstairs.' },
    ] },
    { id: 'well', prefix: 'well-', origin: 'germanic', meaning: 'good, healthy', examples: [
      { word: 'welcome', sentence: 'The welcome was warm.' },
      { word: 'wellbeing', sentence: 'Fresh air is good for your wellbeing.' },
    ] },
    { id: 'with', prefix: 'with-', origin: 'germanic', meaning: 'back, against', examples: [
      { word: 'withstand', sentence: 'The bridge can withstand the storm.' },
      { word: 'withdraw', sentence: 'I want to withdraw money.' },
    ] },

    // ─── Latin ─────────────────────────────────────────────────────────────
    { id: 'la-ab', prefix: 'ab-', origin: 'latin', meaning: 'away from', examples: [
      { word: 'abnormal', sentence: 'The test result is abnormal.' },
      { word: 'absent', sentence: 'Two kids are absent today.' },
    ] },
    { id: 'la-ad', prefix: 'ad-', origin: 'latin', meaning: 'to, toward', examples: [
      { word: 'advance', sentence: 'We watch the game advance.' },
      { word: 'address', sentence: 'Write your address here.' },
    ] },
    { id: 'la-con', prefix: 'con-', variants: ['co-', 'com-', 'col-'], origin: 'latin', meaning: 'together, with', examples: [
      { word: 'connect', sentence: 'The two wires connect the lamps.' },
      { word: 'cooperate', sentence: 'We cooperate in class.' },
    ] },
    { id: 'la-contra', prefix: 'contra-', origin: 'latin', meaning: 'against', examples: [
      { word: 'contradict', sentence: 'Do not contradict the teacher.' },
      { word: 'contrast', sentence: 'The colors make a strong contrast.' },
    ] },
    { id: 'la-circum', prefix: 'circum-', origin: 'latin', meaning: 'around', examples: [
      { word: 'circumference', sentence: 'The circle has a small circumference.' },
      { word: 'circumnavigate', sentence: 'The ship can circumnavigate the globe.' },
    ] },
    { id: 'la-de', prefix: 'de-', origin: 'latin', meaning: 'down, away', examples: [
      { word: 'decrease', sentence: 'The price will decrease.' },
      { word: 'deflate', sentence: 'The balloon will deflate.' },
    ] },
    { id: 'la-dis', prefix: 'dis-', origin: 'latin', meaning: 'not, apart', examples: [
      { word: 'disagree', sentence: 'I disagree with that idea.' },
      { word: 'disappear', sentence: 'The stain will disappear.' },
    ] },
    { id: 'la-ex', prefix: 'ex-', origin: 'latin', meaning: 'out, from', examples: [
      { word: 'exit', sentence: 'We leave through the exit.' },
      { word: 'export', sentence: 'The country can export cars.' },
    ] },
    { id: 'la-extra', prefix: 'extra-', origin: 'latin', meaning: 'beyond, more', examples: [
      { word: 'extraordinary', sentence: 'The view is extraordinary.' },
      { word: 'extraterrestrial', sentence: 'The movie shows an extraterrestrial.' },
    ] },
    { id: 'la-in', prefix: 'in-', variants: ['im-', 'il-', 'ir-'], origin: 'latin', meaning: 'not', examples: [
      { word: 'invisible', sentence: 'The ghost is invisible.' },
      { word: 'incorrect', sentence: 'My first answer was incorrect.' },
    ] },
    { id: 'la-inter', prefix: 'inter-', origin: 'latin', meaning: 'between', examples: [
      { word: 'internet', sentence: 'The internet is down.' },
      { word: 'interrupt', sentence: 'Please do not interrupt me.' },
    ] },
    { id: 'la-multi', prefix: 'multi-', origin: 'latin', meaning: 'many', examples: [
      { word: 'multiplayer', sentence: 'The game has a multiplayer mode.' },
      { word: 'multimedia', sentence: 'The museum shows a multimedia show.' },
    ] },
    { id: 'la-non', prefix: 'non-', origin: 'latin', meaning: 'not', examples: [
      { word: 'nonsense', sentence: 'That idea is nonsense.' },
      { word: 'nonstop', sentence: 'The bus goes nonstop.' },
    ] },
    { id: 'la-per', prefix: 'per-', origin: 'latin', meaning: 'through', examples: [
      { word: 'perfect', sentence: 'My score is perfect.' },
      { word: 'percent', sentence: 'Fifty percent is half.' },
    ] },
    { id: 'la-post', prefix: 'post-', origin: 'latin', meaning: 'after', examples: [
      { word: 'postpone', sentence: 'We postpone the game.' },
      { word: 'postscript', sentence: 'Add a postscript to the letter.' },
    ] },
    { id: 'la-pre', prefix: 'pre-', origin: 'latin', meaning: 'before', examples: [
      { word: 'preview', sentence: 'I want to preview the video.' },
      { word: 'preheat', sentence: 'Preheat the oven first.' },
    ] },
    { id: 'la-pro', prefix: 'pro-', origin: 'latin', meaning: 'forward, for', examples: [
      { word: 'project', sentence: 'We finish the project today.' },
      { word: 'progress', sentence: 'My progress is good.' },
    ] },
    { id: 'la-re', prefix: 're-', origin: 'latin', meaning: 'again, back', examples: [
      { word: 'redo', sentence: 'I need to redo the task.' },
      { word: 'replay', sentence: 'Let us replay the level.' },
    ] },
    { id: 'la-semi', prefix: 'semi-', origin: 'latin', meaning: 'half', examples: [
      { word: 'semicircle', sentence: 'We sit in a semicircle.' },
      { word: 'semifinal', sentence: 'The team reaches the semifinal.' },
    ] },
    { id: 'la-sub', prefix: 'sub-', origin: 'latin', meaning: 'under, below', examples: [
      { word: 'subway', sentence: 'We ride the subway.' },
      { word: 'subtract', sentence: 'Subtract five from ten.' },
    ] },
    { id: 'la-super', prefix: 'super-', origin: 'latin', meaning: 'above, over', examples: [
      { word: 'superhero', sentence: 'My sister likes the superhero.' },
      { word: 'supermarket', sentence: 'We shop at the supermarket.' },
    ] },
    { id: 'la-trans', prefix: 'trans-', origin: 'latin', meaning: 'across, through', examples: [
      { word: 'transport', sentence: 'The transport starts early.' },
      { word: 'translate', sentence: 'Can you translate the word?' },
    ] },
    { id: 'la-ultra', prefix: 'ultra-', origin: 'latin', meaning: 'beyond, very', examples: [
      { word: 'ultrasound', sentence: 'The doctor uses ultrasound.' },
      { word: 'ultramodern', sentence: 'The new train is ultramodern.' },
    ] },
    { id: 'la-uni', prefix: 'uni-', origin: 'latin', meaning: 'one', examples: [
      { word: 'uniform', sentence: 'The scout wears a uniform.' },
      { word: 'universe', sentence: 'The universe has many stars.' },
    ] },
    { id: 'la-vice', prefix: 'vice-', origin: 'latin', meaning: 'in place of', examples: [
      { word: 'vicepresident', sentence: 'She is the vicepresident.' },
      { word: 'vicecaptain', sentence: 'He is the vicecaptain.' },
    ] },

    // ─── Greek ──────────────────────────────────────────────────────────────
    { id: 'gr-anti', prefix: 'anti-', origin: 'greek', meaning: 'against', examples: [
      { word: 'antivirus', sentence: 'The antivirus protects my computer.' },
      { word: 'antisocial', sentence: 'Being rude is antisocial.' },
    ] },
    { id: 'gr-auto', prefix: 'auto-', origin: 'greek', meaning: 'self', examples: [
      { word: 'automatic', sentence: 'The door is automatic.' },
      { word: 'autograph', sentence: 'I got an autograph.' },
    ] },
    { id: 'gr-bio', prefix: 'bio-', origin: 'greek', meaning: 'life', examples: [
      { word: 'biology', sentence: 'Biology is my favorite subject.' },
      { word: 'biography', sentence: 'The book is a biography.' },
    ] },
    { id: 'gr-chrono', prefix: 'chrono-', origin: 'greek', meaning: 'time', examples: [
      { word: 'chronometer', sentence: 'The chronometer shows the time.' },
      { word: 'chronology', sentence: 'The chronology lists the years.' },
    ] },
    { id: 'gr-dia', prefix: 'dia-', origin: 'greek', meaning: 'through, across', examples: [
      { word: 'diagonal', sentence: 'Draw a diagonal line.' },
      { word: 'diameter', sentence: 'The circle has a small diameter.' },
    ] },
    { id: 'gr-dys', prefix: 'dys-', origin: 'greek', meaning: 'bad, difficult', examples: [
      { word: 'dyslexia', sentence: 'Dyslexia makes reading hard.' },
      { word: 'dysfunctional', sentence: 'The printer is dysfunctional.' },
    ] },
    { id: 'gr-eco', prefix: 'eco-', origin: 'greek', meaning: 'environment, home', examples: [
      { word: 'ecosystem', sentence: 'The pond has an ecosystem.' },
      { word: 'ecology', sentence: 'Ecology studies nature.' },
    ] },
    { id: 'gr-geo', prefix: 'geo-', origin: 'greek', meaning: 'earth', examples: [
      { word: 'geography', sentence: 'Geography is about the earth.' },
      { word: 'geology', sentence: 'Geology studies rocks.' },
    ] },
    { id: 'gr-homo', prefix: 'homo-', origin: 'greek', meaning: 'same', examples: [
      { word: 'homophone', sentence: 'A homophone sounds the same.' },
      { word: 'homograph', sentence: 'A homograph is spelled the same.' },
    ] },
    { id: 'gr-hyper', prefix: 'hyper-', origin: 'greek', meaning: 'over, beyond', examples: [
      { word: 'hyperactive', sentence: 'The puppy is hyperactive.' },
      { word: 'hypertext', sentence: 'Hypertext links pages.' },
    ] },
    { id: 'gr-kilo', prefix: 'kilo-', origin: 'greek', meaning: 'thousand', examples: [
      { word: 'kilometer', sentence: 'We walked one kilometer.' },
      { word: 'kilogram', sentence: 'A kilogram is about two pounds.' },
    ] },
    { id: 'gr-mega', prefix: 'mega-', origin: 'greek', meaning: 'large', examples: [
      { word: 'megaphone', sentence: 'The coach uses a megaphone.' },
      { word: 'megabyte', sentence: 'The file has one megabyte.' },
    ] },
    { id: 'gr-micro', prefix: 'micro-', origin: 'greek', meaning: 'small', examples: [
      { word: 'microscope', sentence: 'We look through the microscope.' },
      { word: 'microwave', sentence: 'The microwave heats the soup.' },
    ] },
    { id: 'gr-mono', prefix: 'mono-', origin: 'greek', meaning: 'one, alone', examples: [
      { word: 'monorail', sentence: 'The train is a monorail.' },
      { word: 'monologue', sentence: 'The actor speaks a monologue.' },
    ] },
    { id: 'gr-pan', prefix: 'pan-', origin: 'greek', meaning: 'all, every', examples: [
      { word: 'pandemic', sentence: 'A pandemic affects everyone.' },
      { word: 'panorama', sentence: 'The view is a panorama.' },
    ] },
    { id: 'gr-para', prefix: 'para-', origin: 'greek', meaning: 'beside, near', examples: [
      { word: 'parallel', sentence: 'The lines are parallel.' },
      { word: 'parachute', sentence: 'The pilot opens the parachute.' },
    ] },
    { id: 'gr-peri', prefix: 'peri-', origin: 'greek', meaning: 'around', examples: [
      { word: 'perimeter', sentence: 'The park has a short perimeter.' },
      { word: 'periscope', sentence: 'Look through the periscope.' },
    ] },
    { id: 'gr-photo', prefix: 'photo-', origin: 'greek', meaning: 'light', examples: [
      { word: 'photograph', sentence: 'I take a photograph.' },
      { word: 'photocopy', sentence: 'Make a photocopy of the page.' },
    ] },
    { id: 'gr-poly', prefix: 'poly-', origin: 'greek', meaning: 'many', examples: [
      { word: 'polygon', sentence: 'A polygon has many sides.' },
      { word: 'polyglot', sentence: 'She is a polyglot.' },
    ] },
    { id: 'gr-proto', prefix: 'proto-', origin: 'greek', meaning: 'first', examples: [
      { word: 'prototype', sentence: 'The new robot is a prototype.' },
      { word: 'protocol', sentence: 'Follow the safety protocol.' },
    ] },
    { id: 'gr-pseudo', prefix: 'pseudo-', origin: 'greek', meaning: 'false', examples: [
      { word: 'pseudonym', sentence: 'The author uses a pseudonym.' },
      { word: 'pseudoscience', sentence: 'Astrology is a pseudoscience.' },
    ] },
    { id: 'gr-psycho', prefix: 'psycho-', origin: 'greek', meaning: 'mind, soul', examples: [
      { word: 'psychology', sentence: 'Psychology studies the mind.' },
      { word: 'psychotherapy', sentence: 'Psychotherapy helps the mind.' },
    ] },
    { id: 'gr-syn', prefix: 'syn-', variants: ['sym-'], origin: 'greek', meaning: 'together, with', examples: [
      { word: 'symmetry', sentence: 'The butterfly has symmetry.' },
      { word: 'symphony', sentence: 'The symphony sounds great.' },
    ] },
    { id: 'gr-tele', prefix: 'tele-', origin: 'greek', meaning: 'far, distant', examples: [
      { word: 'telephone', sentence: 'The telephone rings loudly.' },
      { word: 'telescope', sentence: 'Look through the telescope.' },
    ] },
    { id: 'gr-thermo', prefix: 'thermo-', origin: 'greek', meaning: 'heat', examples: [
      { word: 'thermometer', sentence: 'The thermometer shows the heat.' },
      { word: 'thermos', sentence: 'The thermos keeps the tea warm.' },
    ] },
    { id: 'gr-tri', prefix: 'tri-', origin: 'greek', meaning: 'three', examples: [
      { word: 'triangle', sentence: 'Cut the sandwich into a triangle.' },
      { word: 'tricycle', sentence: 'The boy rides a tricycle.' },
    ] },
    { id: 'gr-zoo', prefix: 'zoo-', origin: 'greek', meaning: 'animal', examples: [
      { word: 'zoo', sentence: 'The zoo opens at nine.' },
      { word: 'zoology', sentence: 'Zoology studies animals.' },
    ] },
  ],
  invalidPairs: [
    { id: 'inv-1', prefix: 'un-', root: 'run', explanation: '"unrun" is not a word. You can say "rerun".' },
    { id: 'inv-2', prefix: 're-', root: 'sky', explanation: '"resky" is not a word. The sky cannot be done again.' },
    { id: 'inv-3', prefix: 'pre-', root: 'dog', explanation: '"predog" is not a word. A dog has no "before" form.' },
    { id: 'inv-4', prefix: 'mis-', root: 'table', explanation: '"mistable" is not a word. You can say "mistake" or "misspell".' },
    { id: 'inv-5', prefix: 'over-', root: 'chair', explanation: '"overchair" is not a word. A chair cannot be overdone.' },
    { id: 'inv-6', prefix: 'under-', root: 'moon', explanation: '"undermoon" is not a word. The moon is not under anything here.' },
    { id: 'inv-7', prefix: 'out-', root: 'desk', explanation: '"outdesk" is not a word. You can say "outrun" or "outside".' },
    { id: 'inv-8', prefix: 'down-', root: 'happy', explanation: '"downhappy" is not a word. "Unhappy" is the opposite of happy.' },
    { id: 'inv-9', prefix: 'up-', root: 'sad', explanation: '"upsad" is not a word. You can say "upload" or "upstairs".' },
    { id: 'inv-10', prefix: 'semi-', root: 'dog', explanation: '"semidog" is not a word. Half a dog has no name.' },
    { id: 'inv-11', prefix: 'tele-', root: 'nose', explanation: '"telenose" is not a word. "Tele-" means far, like telephone.' },
    { id: 'inv-12', prefix: 'kilo-', root: 'cat', explanation: '"kilocat" is not a word. A cat is not measured in thousands.' },
  ],
}

// Self-check (contracts/dataset.md invariants) – throws with all violations at module load.
assertDatasetValid(EN_DATASET)
const crossProblems = validateCrossDataset(DE_DATASET, EN_DATASET)
if (crossProblems.length > 0) {
  throw new Error(`[prefixPirates] Cross-dataset violations:\n- ${crossProblems.join('\n- ')}`)
}
registerDataset(EN_DATASET)