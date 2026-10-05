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

export const EN_DATASET: PrefixDataset = {
  language: 'en',
  entries: [
    // ─── Germanic (native English prefixes) ───────────────────────────────
    { id: 'a', prefix: 'a-', origin: 'germanic', tier: 2, meaning: 'in a state, being', examples: [
      { word: 'asleep', sentence: 'The baby is asleep.' },
      { word: 'alive', sentence: 'The fish is still alive.' },
    ] },
    { id: 'after', prefix: 'after-', origin: 'germanic', tier: 1, meaning: 'later, behind', examples: [
      { word: 'afternoon', sentence: 'We play games in the afternoon.' },
      { word: 'afterthought', sentence: 'His nice comment was an afterthought.' },
    ] },
    { id: 'all', prefix: 'all-', origin: 'germanic', tier: 2, meaning: 'completely, every', examples: [
      { word: 'allknowing', sentence: 'The wise owl seems allknowing.' },
      { word: 'allpowerful', sentence: 'The story tells of an allpowerful wizard.' },
    ] },
    { id: 'back', prefix: 'back-', origin: 'germanic', tier: 1, meaning: 'behind, backward', examples: [
      { word: 'backyard', sentence: 'The dog plays in the backyard.' },
      { word: 'background', sentence: 'The picture has a blue background.' },
    ] },
    { id: 'bare', prefix: 'bare-', origin: 'germanic', tier: 2, meaning: 'uncovered, exposed', examples: [
      { word: 'barefoot', sentence: 'Kids love running barefoot on the grass.' },
      { word: 'bareheaded', sentence: 'He walked bareheaded in the gentle rain.' },
    ] },
    { id: 'be', prefix: 'be-', origin: 'germanic', tier: 2, meaning: 'make, cause to be', examples: [
      { word: 'befriend', sentence: 'I want to befriend the new kid.' },
      { word: 'beloved', sentence: 'This is my beloved cat.' },
    ] },
    { id: 'by', prefix: 'by-', origin: 'germanic', tier: 2, meaning: 'near, aside', examples: [
      { word: 'bystander', sentence: 'The bystander saw everything.' },
      { word: 'bypass', sentence: 'We can take the bypass road.' },
    ] },
    { id: 'clean', prefix: 'clean-', origin: 'germanic', tier: 2, meaning: 'pure, neat', examples: [
      { word: 'cleancut', sentence: 'The board has a very cleancut edge.' },
      { word: 'cleanshaven', sentence: 'My uncle looked neat and cleanshaven.' },
    ] },
    { id: 'cold', prefix: 'cold-', origin: 'germanic', tier: 2, meaning: 'chilly, unfeeling', examples: [
      { word: 'coldhearted', sentence: 'The mean giant was not coldhearted inside.' },
      { word: 'coldblooded', sentence: 'Lizards are coldblooded animals.' },
    ] },
    { id: 'cross', prefix: 'cross-', origin: 'germanic', tier: 1, meaning: 'across, over', examples: [
      { word: 'crosswalk', sentence: 'We wait at the crosswalk.' },
      { word: 'crosscountry', sentence: 'They go crosscountry skiing.' },
    ] },
    { id: 'day', prefix: 'day-', origin: 'germanic', tier: 1, meaning: 'daylight, daytime', examples: [
      { word: 'daylight', sentence: 'We can see clearly in the daylight.' },
      { word: 'daydream', sentence: 'I often daydream about space travel.' },
    ] },
    { id: 'deep', prefix: 'deep-', origin: 'germanic', tier: 2, meaning: 'far down, profound', examples: [
      { word: 'deepsea', sentence: 'Strange creatures swim in the deepsea waters.' },
      { word: 'deeprooted', sentence: 'Oak trees have very deeprooted bases.' },
    ] },
    { id: 'down', prefix: 'down-', origin: 'germanic', tier: 1, meaning: 'lower, downward', examples: [
      { word: 'downstairs', sentence: 'The shoes are downstairs.' },
      { word: 'downhill', sentence: 'The sled goes downhill fast.' },
    ] },
    { id: 'ever', prefix: 'ever-', origin: 'germanic', tier: 1, meaning: 'always, continuously', examples: [
      { word: 'evergreen', sentence: 'The pine tree stays evergreen.' },
      { word: 'everlasting', sentence: 'True friendship is everlasting.' },
    ] },
    { id: 'eye', prefix: 'eye-', origin: 'germanic', tier: 2, meaning: 'sight, visual', examples: [
      { word: 'eyewitness', sentence: 'The honest eyewitness reported what happened.' },
      { word: 'eyeglass', sentence: 'He wiped his clear eyeglass lens.' },
    ] },
    { id: 'fast', prefix: 'fast-', origin: 'germanic', tier: 2, meaning: 'quick, rapid', examples: [
      { word: 'fastmoving', sentence: 'The fastmoving train blew past our station.' },
      { word: 'fastacting', sentence: 'This medicine is helpful and fastacting.' },
    ] },
    { id: 'fire', prefix: 'fire-', origin: 'germanic', tier: 1, meaning: 'flame, burning', examples: [
      { word: 'fireplace', sentence: 'Logs crackled in the warm fireplace.' },
      { word: 'firefly', sentence: 'A tiny firefly glowed in the grass.' },
    ] },
    { id: 'first', prefix: 'first-', origin: 'germanic', tier: 2, meaning: 'earliest, top', examples: [
      { word: 'firsthand', sentence: 'We learned the news firsthand.' },
      { word: 'firstrate', sentence: 'Her school project was firstrate work.' },
    ] },
    { id: 'foot', prefix: 'foot-', origin: 'germanic', tier: 1, meaning: 'walking, base', examples: [
      { word: 'footprint', sentence: 'We saw a bear footprint in the mud.' },
      { word: 'footpath', sentence: 'Follow the stony footpath up the mountain.' },
    ] },
    { id: 'for', prefix: 'for-', origin: 'germanic', tier: 1, meaning: 'away, completely', examples: [
      { word: 'forgive', sentence: 'I want to forgive my friend.' },
      { word: 'forget', sentence: 'I will never forget this day.' },
    ] },
    { id: 'fore', prefix: 'fore-', origin: 'germanic', tier: 2, meaning: 'before, in front', examples: [
      { word: 'forehead', sentence: 'He has a bump on his forehead.' },
      { word: 'foretell', sentence: 'Can you foretell the future?' },
    ] },
    { id: 'forth', prefix: 'forth-', origin: 'germanic', tier: 3, meaning: 'forward, onward', examples: [
      { word: 'forthcoming', sentence: 'Details are forthcoming soon.' },
      { word: 'forthright', sentence: 'She gave a clear and forthright answer.' },
    ] },
    { id: 'free', prefix: 'free-', origin: 'germanic', tier: 1, meaning: 'open, unrestricted', examples: [
      { word: 'freeway', sentence: 'Cars drive quickly along the freeway.' },
      { word: 'freestyle', sentence: 'She won the race in freestyle swimming.' },
    ] },
    { id: 'fresh', prefix: 'fresh-', origin: 'germanic', tier: 2, meaning: 'clean, new', examples: [
      { word: 'freshwater', sentence: 'Trout swim in clear freshwater streams.' },
      { word: 'freshfaced', sentence: 'The freshfaced students smiled for the camera.' },
    ] },
    { id: 'full', prefix: 'full-', origin: 'germanic', tier: 1, meaning: 'complete, total', examples: [
      { word: 'fullscreen', sentence: 'Watch the video in fullscreen mode.' },
      { word: 'fullgrown', sentence: 'The puppy will soon be fullgrown.' },
    ] },
    { id: 'gold', prefix: 'gold-', origin: 'germanic', tier: 1, meaning: 'golden, precious', examples: [
      { word: 'goldfish', sentence: 'A little orange goldfish swam around.' },
      { word: 'goldsmith', sentence: 'The skilled goldsmith shaped the ring.' },
    ] },
    { id: 'half', prefix: 'half-', origin: 'germanic', tier: 1, meaning: 'half, halfway', examples: [
      { word: 'halftime', sentence: 'The game stops at halftime.' },
      { word: 'halfway', sentence: 'We are halfway there.' },
    ] },
    { id: 'hand', prefix: 'hand-', origin: 'germanic', tier: 1, meaning: 'manual, by hand', examples: [
      { word: 'handbook', sentence: 'Read the rules in your student handbook.' },
      { word: 'handshake', sentence: 'They sealed the friendly deal with a handshake.' },
    ] },
    { id: 'hard', prefix: 'hard-', origin: 'germanic', tier: 2, meaning: 'solid, tough', examples: [
      { word: 'hardworking', sentence: 'The hardworking ants gathered food all day.' },
      { word: 'hardwood', sentence: 'The dining table is made of solid hardwood.' },
    ] },
    { id: 'heart', prefix: 'heart-', origin: 'germanic', tier: 2, meaning: 'feeling, core', examples: [
      { word: 'heartfelt', sentence: 'She shared a heartfelt thank you message.' },
      { word: 'heartbeat', sentence: 'The doctor listened to my steady heartbeat.' },
    ] },
    { id: 'high', prefix: 'high-', origin: 'germanic', tier: 1, meaning: 'tall, elevated', examples: [
      { word: 'highland', sentence: 'Sheep graze on the green highland hills.' },
      { word: 'highway', sentence: 'The blue bus drove along the wide highway.' },
    ] },
    { id: 'home', prefix: 'home-', origin: 'germanic', tier: 1, meaning: 'native, dwelling', examples: [
      { word: 'homework', sentence: 'I finished my math homework early.' },
      { word: 'hometown', sentence: 'Everyone cheered for our small hometown.' },
    ] },
    { id: 'in', prefix: 'in-', origin: 'germanic', tier: 1, meaning: 'into, inside', examples: [
      { word: 'inside', sentence: 'The toy is inside the box.' },
      { word: 'input', sentence: 'Please give me your input.' },
    ] },
    { id: 'land', prefix: 'land-', origin: 'germanic', tier: 2, meaning: 'ground, earth', examples: [
      { word: 'landmark', sentence: 'The tall tower is a famous landmark.' },
      { word: 'landscape', sentence: 'The painter captured the green landscape.' },
    ] },
    { id: 'life', prefix: 'life-', origin: 'germanic', tier: 1, meaning: 'living, vital', examples: [
      { word: 'lifeguard', sentence: 'The alert lifeguard watched the swimmers.' },
      { word: 'lifestyle', sentence: 'Healthy food is key to a balanced lifestyle.' },
    ] },
    { id: 'mid', prefix: 'mid-', origin: 'germanic', tier: 1, meaning: 'middle', examples: [
      { word: 'midnight', sentence: 'We reached home at midnight.' },
      { word: 'midway', sentence: 'We stopped midway.' },
    ] },
    { id: 'mis', prefix: 'mis-', origin: 'germanic', tier: 1, meaning: 'wrongly, bad', examples: [
      { word: 'mistake', sentence: 'I made a mistake.' },
      { word: 'misspell', sentence: 'Do not misspell my name.' },
    ] },
    { id: 'near', prefix: 'near-', origin: 'germanic', tier: 2, meaning: 'close, almost', examples: [
      { word: 'nearsighted', sentence: 'My grandma is nearsighted.' },
      { word: 'nearperfect', sentence: 'The jump was nearperfect.' },
    ] },
    { id: 'new', prefix: 'new-', origin: 'germanic', tier: 1, meaning: 'recent, fresh', examples: [
      { word: 'newborn', sentence: 'The newborn puppy sleeps peacefully.' },
      { word: 'newcomer', sentence: 'Everyone welcomed the friendly newcomer.' },
    ] },
    { id: 'night', prefix: 'night-', origin: 'germanic', tier: 1, meaning: 'evening, dark', examples: [
      { word: 'nightfall', sentence: 'Campers lit the fire at nightfall.' },
      { word: 'nightstand', sentence: 'My lamp sits on the wooden nightstand.' },
    ] },
    { id: 'off', prefix: 'off-', origin: 'germanic', tier: 1, meaning: 'away, apart', examples: [
      { word: 'offline', sentence: 'The game works offline.' },
      { word: 'offroad', sentence: 'The truck drives offroad.' },
    ] },
    { id: 'on', prefix: 'on-', origin: 'germanic', tier: 1, meaning: 'on, forward', examples: [
      { word: 'online', sentence: 'We meet online.' },
      { word: 'onboard', sentence: 'The captain is onboard.' },
    ] },
    { id: 'out', prefix: 'out-', origin: 'germanic', tier: 1, meaning: 'beyond, outside', examples: [
      { word: 'outside', sentence: 'We play outside.' },
      { word: 'outrun', sentence: 'Can you outrun me?' },
    ] },
    { id: 'over', prefix: 'over-', origin: 'germanic', tier: 1, meaning: 'above, too much', examples: [
      { word: 'overflow', sentence: 'The river will overflow after the storm.' },
      { word: 'overeat', sentence: 'I should not overeat.' },
    ] },
    { id: 'rain', prefix: 'rain-', origin: 'germanic', tier: 1, meaning: 'wet, shower', examples: [
      { word: 'rainbow', sentence: 'A bright rainbow arched across the sky.' },
      { word: 'raindrop', sentence: 'A single cold raindrop landed on my cheek.' },
    ] },
    { id: 'sea', prefix: 'sea-', origin: 'germanic', tier: 1, meaning: 'ocean, marine', examples: [
      { word: 'seashore', sentence: 'We collected smooth shells at the seashore.' },
      { word: 'seagull', sentence: 'A noisy seagull flew over the beach.' },
    ] },
    { id: 'self', prefix: 'self-', origin: 'germanic', tier: 2, meaning: 'oneself, by itself', examples: [
      { word: 'selfconfident', sentence: 'She is very selfconfident.' },
      { word: 'selfhelp', sentence: 'This is a selfhelp book.' },
    ] },
    { id: 'short', prefix: 'short-', origin: 'germanic', tier: 2, meaning: 'brief, not long', examples: [
      { word: 'shorthand', sentence: 'The clerk took notes in shorthand.' },
      { word: 'shortstop', sentence: 'My friend plays shortstop on the team.' },
    ] },
    { id: 'snow', prefix: 'snow-', origin: 'germanic', tier: 1, meaning: 'frozen, wintry', examples: [
      { word: 'snowman', sentence: 'We built a jolly snowman with a carrot nose.' },
      { word: 'snowflake', sentence: 'Every unique snowflake fell softly.' },
    ] },
    { id: 'under', prefix: 'under-', origin: 'germanic', tier: 1, meaning: 'below, too little', examples: [
      { word: 'undercook', sentence: 'Do not undercook the eggs.' },
      { word: 'underwater', sentence: 'The plant grows underwater.' },
    ] },
    { id: 'un', prefix: 'un-', origin: 'germanic', tier: 1, meaning: 'not, opposite of', examples: [
      { word: 'unhappy', sentence: 'The bird looks unhappy.' },
      { word: 'unlock', sentence: 'I can unlock the door.' },
    ] },
    { id: 'up', prefix: 'up-', origin: 'germanic', tier: 1, meaning: 'higher, upward', examples: [
      { word: 'upload', sentence: 'I want to upload a photo.' },
      { word: 'upstairs', sentence: 'My room is upstairs.' },
    ] },
    { id: 'well', prefix: 'well-', origin: 'germanic', tier: 2, meaning: 'good, healthy', examples: [
      { word: 'wellknown', sentence: 'The author is wellknown.' },
      { word: 'wellbeing', sentence: 'Fresh air is good for your wellbeing.' },
    ] },
    { id: 'with', prefix: 'with-', origin: 'germanic', tier: 3, meaning: 'back, against', examples: [
      { word: 'withstand', sentence: 'The bridge can withstand the storm.' },
      { word: 'withdraw', sentence: 'I want to withdraw money.' },
    ] },

    // ─── Latin ─────────────────────────────────────────────────────────────
    { id: 'counter', prefix: 'counter-', origin: 'latin', tier: 2, meaning: 'against, opposite', examples: [
      { word: 'counterattack', sentence: 'Our team plans a counterattack.' },
      { word: 'counterweight', sentence: 'The counterweight balances the load.' },
    ] },
    { id: 'la-ab', prefix: 'ab-', origin: 'latin', tier: 3, meaning: 'away from', examples: [
      { word: 'abnormal', sentence: 'The test result is abnormal.' },
      { word: 'absent', sentence: 'Two kids are absent today.' },
    ] },
    { id: 'la-ad', prefix: 'ad-', origin: 'latin', tier: 2, meaning: 'to, toward', examples: [
      { word: 'advance', sentence: 'We watch the game advance.' },
      { word: 'address', sentence: 'Write your address here.' },
    ] },
    { id: 'la-ante', prefix: 'ante-', origin: 'latin', tier: 3, meaning: 'before, in front', examples: [
      { word: 'anteroom', sentence: 'We waited in the quiet anteroom.' },
      { word: 'antedate', sentence: 'The old fossils antedate human history.' },
    ] },
    { id: 'la-aqua', prefix: 'aqua-', origin: 'latin', tier: 1, meaning: 'water', examples: [
      { word: 'aquarium', sentence: 'Bright fish swim around the glass aquarium.' },
      { word: 'aquatic', sentence: 'Whales are aquatic mammals.' },
    ] },
    { id: 'la-audi', prefix: 'audio-', origin: 'latin', tier: 2, meaning: 'sound, hearing', examples: [
      { word: 'audioguide', sentence: 'We listened to the museum audioguide.' },
      { word: 'audiobook', sentence: 'I enjoy listening to an audiobook in bed.' },
    ] },
    { id: 'la-bene', prefix: 'bene-', origin: 'latin', tier: 3, meaning: 'good, well', examples: [
      { word: 'benefit', sentence: 'Fresh fruit brings great health benefit.' },
      { word: 'benefactor', sentence: 'A generous benefactor donated new library books.' },
    ] },
    { id: 'la-bi', prefix: 'bi-', origin: 'latin', tier: 1, meaning: 'two, twice', examples: [
      { word: 'bicycle', sentence: 'I ride my blue bicycle to school.' },
      { word: 'bilingual', sentence: 'My cousin is completely bilingual.' },
    ] },
    { id: 'la-cent', prefix: 'centi-', origin: 'latin', tier: 1, meaning: 'hundred', examples: [
      { word: 'centimeter', sentence: 'The bug is only one centimeter long.' },
      { word: 'centipede', sentence: 'A fast centipede crawled under the rock.' },
    ] },
    { id: 'la-circum', prefix: 'circum-', origin: 'latin', tier: 3, meaning: 'around', examples: [
      { word: 'circumference', sentence: 'The circle has a small circumference.' },
      { word: 'circumnavigate', sentence: 'The ship can circumnavigate the globe.' },
    ] },
    { id: 'la-con', prefix: 'con-', variants: ['co-', 'com-', 'col-'], origin: 'latin', tier: 2, meaning: 'together, with', examples: [
      { word: 'connect', sentence: 'The two wires connect the lamps.' },
      { word: 'cooperate', sentence: 'We cooperate in class.' },
    ] },
    { id: 'la-contra', prefix: 'contra-', origin: 'latin', tier: 2, meaning: 'against', examples: [
      { word: 'contradict', sentence: 'Do not contradict the teacher.' },
      { word: 'contrast', sentence: 'The colors make a strong contrast.' },
    ] },
    { id: 'la-de', prefix: 'de-', origin: 'latin', tier: 2, meaning: 'down, away', examples: [
      { word: 'decrease', sentence: 'The price will decrease.' },
      { word: 'deflate', sentence: 'The balloon will deflate.' },
    ] },
    { id: 'la-deci', prefix: 'deci-', origin: 'latin', tier: 2, meaning: 'tenth', examples: [
      { word: 'decimeter', sentence: 'One decimeter equals ten centimeters.' },
      { word: 'deciliter', sentence: 'Pour one deciliter of milk into the bowl.' },
    ] },
    { id: 'la-dent', prefix: 'dent-', origin: 'latin', tier: 2, meaning: 'tooth', examples: [
      { word: 'dentist', sentence: 'I visit the dentist every six months.' },
      { word: 'denture', sentence: 'My grandfather keeps his denture clean.' },
    ] },
    { id: 'la-dis', prefix: 'dis-', origin: 'latin', tier: 2, meaning: 'not, apart', examples: [
      { word: 'disagree', sentence: 'I disagree with that idea.' },
      { word: 'disappear', sentence: 'The stain will disappear.' },
    ] },
    { id: 'la-ex', prefix: 'ex-', origin: 'latin', tier: 2, meaning: 'out, from', examples: [
      { word: 'export', sentence: 'The country can export cars.' },
      { word: 'exit', sentence: 'We leave through the exit.' },
    ] },
    { id: 'la-extra', prefix: 'extra-', origin: 'latin', tier: 2, meaning: 'beyond, more', examples: [
      { word: 'extraordinary', sentence: 'The view is extraordinary.' },
      { word: 'extraterrestrial', sentence: 'The movie shows an extraterrestrial.' },
    ] },
    { id: 'la-in', prefix: 'in-', variants: ['im-', 'il-', 'ir-'], origin: 'latin', tier: 2, meaning: 'not', examples: [
      { word: 'invisible', sentence: 'The ghost is invisible.' },
      { word: 'incorrect', sentence: 'My first answer was incorrect.' },
    ] },
    { id: 'la-infra', prefix: 'infra-', origin: 'latin', tier: 3, meaning: 'below, beneath', examples: [
      { word: 'infrared', sentence: 'The remote control uses infrared light.' },
      { word: 'infrastructure', sentence: 'Bridges are part of the city infrastructure.' },
    ] },
    { id: 'la-inter', prefix: 'inter-', origin: 'latin', tier: 1, meaning: 'between', examples: [
      { word: 'internet', sentence: 'The internet is down.' },
      { word: 'interrupt', sentence: 'Please do not interrupt me.' },
    ] },
    { id: 'la-intra', prefix: 'intra-', origin: 'latin', tier: 3, meaning: 'within, inside', examples: [
      { word: 'intramural', sentence: 'We play in an intramural soccer league.' },
      { word: 'intranet', sentence: 'School documents are saved on the intranet.' },
    ] },
    { id: 'la-intro', prefix: 'intro-', origin: 'latin', tier: 2, meaning: 'inward, inside', examples: [
      { word: 'introduce', sentence: 'Let me introduce my best friend.' },
      { word: 'introvert', sentence: 'The quiet boy is an introvert.' },
    ] },
    { id: 'la-luna', prefix: 'lunar-', origin: 'latin', tier: 3, meaning: 'moon', examples: [
      { word: 'lunarmodule', sentence: 'The astronauts landed in the lunarmodule.' },
      { word: 'lunareclipse', sentence: 'We watched the rare lunareclipse through binoculars.' },
    ] },
    { id: 'la-mal', prefix: 'mal-', origin: 'latin', tier: 3, meaning: 'bad, evil', examples: [
      { word: 'malfunction', sentence: 'The game stopped because of a malfunction.' },
      { word: 'malnutrition', sentence: 'Healthy meals protect against malnutrition.' },
    ] },
    { id: 'la-manu', prefix: 'manu-', origin: 'latin', tier: 3, meaning: 'hand', examples: [
      { word: 'manuscript', sentence: 'The writer turned in her first manuscript.' },
      { word: 'manual', sentence: 'Read the instruction manual before starting.' },
    ] },
    { id: 'la-maxi', prefix: 'maxi-', origin: 'latin', tier: 2, meaning: 'very large', examples: [
      { word: 'maxidress', sentence: 'My sister wore a flowing maxidress.' },
      { word: 'maximize', sentence: 'We want to maximize our study time.' },
    ] },
    { id: 'la-milli', prefix: 'milli-', origin: 'latin', tier: 1, meaning: 'thousand', examples: [
      { word: 'millimeter', sentence: 'The pencil tip is one millimeter wide.' },
      { word: 'milligram', sentence: 'The tiny pill weighs a few milligrams.' },
    ] },
    { id: 'mini', prefix: 'mini-', origin: 'latin', tier: 1, meaning: 'small', examples: [
      { word: 'minigolf', sentence: 'We play minigolf in the summer.' },
      { word: 'minivan', sentence: 'The family rides in a minivan.' },
    ] },
    { id: 'la-mot', prefix: 'motor-', origin: 'latin', tier: 1, meaning: 'moving, engine', examples: [
      { word: 'motorcycle', sentence: 'He wore a helmet while riding his motorcycle.' },
      { word: 'motorboat', sentence: 'A red motorboat zoomed across the bay.' },
    ] },
    { id: 'la-multi', prefix: 'multi-', origin: 'latin', tier: 2, meaning: 'many', examples: [
      { word: 'multiplayer', sentence: 'The game has a multiplayer mode.' },
      { word: 'multimedia', sentence: 'The museum shows a multimedia show.' },
    ] },
    { id: 'la-nav', prefix: 'navi-', origin: 'latin', tier: 2, meaning: 'ship, sailing', examples: [
      { word: 'navigation', sentence: 'The ship captain checked the navigation system.' },
      { word: 'navigator', sentence: 'The skilled navigator pointed toward north.' },
    ] },
    { id: 'la-non', prefix: 'non-', origin: 'latin', tier: 2, meaning: 'not', examples: [
      { word: 'nonsense', sentence: 'That idea is nonsense.' },
      { word: 'nonstop', sentence: 'The bus goes nonstop.' },
    ] },
    { id: 'la-octo', prefix: 'octo-', variants: ['oct-'], origin: 'latin', tier: 2, meaning: 'eight', examples: [
      { word: 'octet', sentence: 'The musical octet played eight instruments together.' },
      { word: 'October', sentence: 'Leaves fall from branches in late October.' },
    ] },
    { id: 'la-omni', prefix: 'omni-', origin: 'latin', tier: 3, meaning: 'all, everywhere', examples: [
      { word: 'omnivore', sentence: 'A brown bear is an omnivore.' },
      { word: 'omnipotent', sentence: 'The legend tells of an omnipotent king.' },
    ] },
    { id: 'la-ped', prefix: 'ped-', origin: 'latin', tier: 2, meaning: 'foot', examples: [
      { word: 'pedal', sentence: 'Push down hard on the bike pedal.' },
      { word: 'pedestrian', sentence: 'Cars must stop for each waiting pedestrian.' },
    ] },
    { id: 'la-per', prefix: 'per-', origin: 'latin', tier: 2, meaning: 'through', examples: [
      { word: 'perfect', sentence: 'My score is perfect.' },
      { word: 'percent', sentence: 'Fifty percent is half.' },
    ] },
    { id: 'la-post', prefix: 'post-', origin: 'latin', tier: 2, meaning: 'after', examples: [
      { word: 'postpone', sentence: 'We postpone the game.' },
      { word: 'postscript', sentence: 'Add a postscript to the letter.' },
    ] },
    { id: 'la-pre', prefix: 'pre-', origin: 'latin', tier: 1, meaning: 'before', examples: [
      { word: 'preview', sentence: 'I want to preview the video.' },
      { word: 'preheat', sentence: 'Preheat the oven first.' },
    ] },
    { id: 'la-pro', prefix: 'pro-', origin: 'latin', tier: 2, meaning: 'forward, for', examples: [
      { word: 'project', sentence: 'We finish the project today.' },
      { word: 'progress', sentence: 'My progress is good.' },
    ] },
    { id: 'la-quad', prefix: 'quad-', variants: ['quadri-'], origin: 'latin', tier: 2, meaning: 'four', examples: [
      { word: 'quadruple', sentence: 'Our total points can quadruple tonight.' },
      { word: 'quadrilateral', sentence: 'A square is a type of quadrilateral.' },
    ] },
    { id: 'la-re', prefix: 're-', origin: 'latin', tier: 1, meaning: 'again, back', examples: [
      { word: 'replay', sentence: 'Let us replay the level.' },
      { word: 'redo', sentence: 'I need to redo the task.' },
    ] },
    { id: 'la-retro', prefix: 'retro-', origin: 'latin', tier: 2, meaning: 'backward, past', examples: [
      { word: 'retroactive', sentence: 'The new rule is not retroactive.' },
      { word: 'retrospect', sentence: 'In retrospect, that was a wise choice.' },
    ] },
    { id: 'la-semi', prefix: 'semi-', origin: 'latin', tier: 2, meaning: 'half', examples: [
      { word: 'semicircle', sentence: 'We sit in a semicircle.' },
      { word: 'semifinal', sentence: 'The team reaches the semifinal.' },
    ] },
    { id: 'la-sept', prefix: 'sept-', origin: 'latin', tier: 2, meaning: 'seven', examples: [
      { word: 'septet', sentence: 'The musical septet performed on the small stage.' },
      { word: 'September', sentence: 'School starts again in cool September.' },
    ] },
    { id: 'la-sol', prefix: 'solar-', origin: 'latin', tier: 2, meaning: 'sun', examples: [
      { word: 'solarium', sentence: 'Plants thrive in the sunny solarium.' },
      { word: 'solarpower', sentence: 'Our roof collects green solarpower.' },
    ] },
    { id: 'la-sub', prefix: 'sub-', origin: 'latin', tier: 2, meaning: 'under, below', examples: [
      { word: 'subway', sentence: 'We ride the subway.' },
      { word: 'subtract', sentence: 'Subtract five from ten.' },
    ] },
    { id: 'la-super', prefix: 'super-', origin: 'latin', tier: 1, meaning: 'above, over', examples: [
      { word: 'superhero', sentence: 'My sister likes the superhero.' },
      { word: 'supermarket', sentence: 'We shop at the supermarket.' },
    ] },
    { id: 'la-terra', prefix: 'terra-', origin: 'latin', tier: 2, meaning: 'land, earth', examples: [
      { word: 'terrarium', sentence: 'The lizard lives in a warm terrarium.' },
      { word: 'terrain', sentence: 'The hiker crossed rocky mountain terrain.' },
    ] },
    { id: 'la-trans', prefix: 'trans-', origin: 'latin', tier: 2, meaning: 'across, through', examples: [
      { word: 'transport', sentence: 'The transport starts early.' },
      { word: 'translate', sentence: 'Can you translate the word?' },
    ] },
    { id: 'la-ultra', prefix: 'ultra-', origin: 'latin', tier: 3, meaning: 'beyond, very', examples: [
      { word: 'ultrasound', sentence: 'The doctor uses ultrasound.' },
      { word: 'ultramodern', sentence: 'The new train is ultramodern.' },
    ] },
    { id: 'la-uni', prefix: 'uni-', origin: 'latin', tier: 3, meaning: 'one', examples: [
      { word: 'uniform', sentence: 'The scout wears a uniform.' },
      { word: 'universe', sentence: 'The universe has many stars.' },
    ] },
    { id: 'la-vice', prefix: 'vice-', origin: 'latin', tier: 3, meaning: 'in place of', examples: [
      { word: 'vicepresident', sentence: 'She is the vicepresident.' },
      { word: 'vicecaptain', sentence: 'He is the vicecaptain.' },
    ] },
    { id: 'la-video', prefix: 'video-', origin: 'latin', tier: 1, meaning: 'seeing, vision', examples: [
      { word: 'videogame', sentence: 'We played a fun videogame together.' },
      { word: 'videotape', sentence: 'Grandma showed us an old family videotape.' },
    ] },
    { id: 'la-visu', prefix: 'visu-', variants: ['vis-'], origin: 'latin', tier: 3, meaning: 'seeing, vision', examples: [
      { word: 'visual', sentence: 'Pictures provide helpful visual clues.' },
      { word: 'vision', sentence: 'The brave inventor had a wonderful vision.' },
    ] },

    // ─── Greek ──────────────────────────────────────────────────────────────
    { id: 'gr-a', prefix: 'a-', variants: ['an-'], origin: 'greek', tier: 3, meaning: 'without, not', examples: [
      { word: 'amoral', sentence: 'Acting without caring about right and wrong is amoral.' },
      { word: 'anonymous', sentence: 'The friendly donor chose to stay anonymous.' },
    ] },
    { id: 'gr-amphi', prefix: 'amphi-', origin: 'greek', tier: 2, meaning: 'both, around', examples: [
      { word: 'amphibian', sentence: 'A green tree frog is an amphibian.' },
      { word: 'amphitheater', sentence: 'The choir sang in the open amphitheater.' },
    ] },
    { id: 'gr-ana', prefix: 'ana-', origin: 'greek', tier: 3, meaning: 'up, back, again', examples: [
      { word: 'analysis', sentence: 'The science lab completed the soil analysis.' },
      { word: 'anagram', sentence: 'Rearrange the letters to form an anagram.' },
    ] },
    { id: 'gr-anti', prefix: 'anti-', origin: 'greek', tier: 2, meaning: 'against', examples: [
      { word: 'antivirus', sentence: 'The antivirus protects my computer.' },
      { word: 'antisocial', sentence: 'Being rude is antisocial.' },
    ] },
    { id: 'gr-apo', prefix: 'apo-', origin: 'greek', tier: 3, meaning: 'away from, off', examples: [
      { word: 'apology', sentence: 'She wrote a sincere apology letter.' },
      { word: 'apostle', sentence: 'The story mentions an ancient apostle.' },
    ] },
    { id: 'gr-archaeo', prefix: 'archaeo-', origin: 'greek', tier: 3, meaning: 'ancient, primitive', examples: [
      { word: 'archaeology', sentence: 'Archaeology digs uncover ancient buried relics.' },
      { word: 'archaeologist', sentence: 'The archaeologist brushed dust off pottery.' },
    ] },
    { id: 'gr-astro', prefix: 'astro-', origin: 'greek', tier: 1, meaning: 'star, space', examples: [
      { word: 'astronaut', sentence: 'An astronaut floats weightless in the shuttle.' },
      { word: 'astronomy', sentence: 'Stargazing inspires a deep love for astronomy.' },
    ] },
    { id: 'gr-auto', prefix: 'auto-', origin: 'greek', tier: 1, meaning: 'self', examples: [
      { word: 'automatic', sentence: 'The door is automatic.' },
      { word: 'autograph', sentence: 'I got an autograph.' },
    ] },
    { id: 'gr-biblio', prefix: 'biblio-', origin: 'greek', tier: 3, meaning: 'book', examples: [
      { word: 'bibliography', sentence: 'Include sources in the research bibliography.' },
      { word: 'bibliophile', sentence: 'A true bibliophile loves buying rare stories.' },
    ] },
    { id: 'gr-bio', prefix: 'bio-', origin: 'greek', tier: 1, meaning: 'life', examples: [
      { word: 'biology', sentence: 'Biology is my favorite subject.' },
      { word: 'biography', sentence: 'The book is a biography.' },
    ] },
    { id: 'gr-cata', prefix: 'cata-', origin: 'greek', tier: 3, meaning: 'down, completely', examples: [
      { word: 'catacombs', sentence: 'Explorers walked through the dark catacombs.' },
      { word: 'catalyst', sentence: 'Heat acts as a catalyst in this reaction.' },
    ] },
    { id: 'gr-chrono', prefix: 'chrono-', origin: 'greek', tier: 2, meaning: 'time', examples: [
      { word: 'chronometer', sentence: 'The chronometer shows the time.' },
      { word: 'chronology', sentence: 'The chronology lists the years.' },
    ] },
    { id: 'gr-demo', prefix: 'demo-', origin: 'greek', tier: 2, meaning: 'people', examples: [
      { word: 'democracy', sentence: 'Citizens vote for leaders in a democracy.' },
      { word: 'demographic', sentence: 'The report shows the demographic mix.' },
    ] },
    { id: 'gr-di', prefix: 'di-', origin: 'greek', tier: 2, meaning: 'two, double', examples: [
      { word: 'dioxide', sentence: 'Trees absorb invisible carbon dioxide.' },
      { word: 'dilemma', sentence: 'Choosing between two parties was a tough dilemma.' },
    ] },
    { id: 'gr-dia', prefix: 'dia-', origin: 'greek', tier: 2, meaning: 'through, across', examples: [
      { word: 'diagonal', sentence: 'Draw a diagonal line.' },
      { word: 'diameter', sentence: 'The circle has a small diameter.' },
    ] },
    { id: 'gr-dys', prefix: 'dys-', origin: 'greek', tier: 3, meaning: 'bad, difficult', examples: [
      { word: 'dyslexia', sentence: 'Dyslexia makes reading hard.' },
      { word: 'dysfunctional', sentence: 'The printer is dysfunctional.' },
    ] },
    { id: 'gr-eco', prefix: 'eco-', origin: 'greek', tier: 2, meaning: 'environment, home', examples: [
      { word: 'ecosystem', sentence: 'The pond has an ecosystem.' },
      { word: 'ecology', sentence: 'Ecology studies nature.' },
    ] },
    { id: 'gr-endo', prefix: 'endo-', origin: 'greek', tier: 3, meaning: 'inside, within', examples: [
      { word: 'endoskeleton', sentence: 'Mammals have a bony endoskeleton inside.' },
      { word: 'endoscope', sentence: 'The surgeon examined the knee using an endoscope.' },
    ] },
    { id: 'gr-epi', prefix: 'epi-', origin: 'greek', tier: 3, meaning: 'upon, beside', examples: [
      { word: 'epicenter', sentence: 'The earthquake shook towns near the epicenter.' },
      { word: 'epidemic', sentence: 'Clean water helped stop the rapid epidemic.' },
    ] },
    { id: 'gr-eu', prefix: 'eu-', origin: 'greek', tier: 3, meaning: 'good, well', examples: [
      { word: 'euphoria', sentence: 'The winning team felt pure euphoria.' },
      { word: 'eucalyptus', sentence: 'Koala bears chew tender eucalyptus leaves.' },
    ] },
    { id: 'gr-exo', prefix: 'exo-', origin: 'greek', tier: 3, meaning: 'outside, outer', examples: [
      { word: 'exoskeleton', sentence: 'A crab protects itself with a tough exoskeleton.' },
      { word: 'exoplanet', sentence: 'Astronomers discovered an Earth-like exoplanet.' },
    ] },
    { id: 'gr-geo', prefix: 'geo-', origin: 'greek', tier: 1, meaning: 'earth', examples: [
      { word: 'geography', sentence: 'Geography is about the earth.' },
      { word: 'geology', sentence: 'Geology studies rocks.' },
    ] },
    { id: 'gr-helio', prefix: 'helio-', origin: 'greek', tier: 3, meaning: 'sun', examples: [
      { word: 'heliocentric', sentence: 'Earth orbits the sun in a heliocentric system.' },
      { word: 'heliograph', sentence: 'The scout signaled using a reflective heliograph.' },
    ] },
    { id: 'gr-hemi', prefix: 'hemi-', origin: 'greek', tier: 3, meaning: 'half', examples: [
      { word: 'hemisphere', sentence: 'We live in the northern hemisphere.' },
      { word: 'hemicycle', sentence: 'Chairs were arranged in a wide hemicycle.' },
    ] },
    { id: 'gr-hetero', prefix: 'hetero-', origin: 'greek', tier: 3, meaning: 'different, other', examples: [
      { word: 'heterogeneous', sentence: 'The mixed salad is quite heterogeneous.' },
      { word: 'heteronym', sentence: 'Lead the metal and lead the verb form a heteronym.' },
    ] },
    { id: 'gr-homo', prefix: 'homo-', origin: 'greek', tier: 3, meaning: 'same', examples: [
      { word: 'homophone', sentence: 'A homophone sounds the same.' },
      { word: 'homograph', sentence: 'A homograph is spelled the same.' },
    ] },
    { id: 'gr-hydro', prefix: 'hydro-', origin: 'greek', tier: 2, meaning: 'water', examples: [
      { word: 'hydrofoil', sentence: 'The fast hydrofoil lifted above the waves.' },
      { word: 'hydropower', sentence: 'Dams generate clean hydropower for homes.' },
    ] },
    { id: 'gr-hyper', prefix: 'hyper-', origin: 'greek', tier: 3, meaning: 'over, beyond', examples: [
      { word: 'hyperactive', sentence: 'The puppy is hyperactive.' },
      { word: 'hypertext', sentence: 'Hypertext links pages.' },
    ] },
    { id: 'gr-hypo', prefix: 'hypo-', origin: 'greek', tier: 3, meaning: 'under, below', examples: [
      { word: 'hypothermia', sentence: 'Warm blankets protect lost hikers from hypothermia.' },
      { word: 'hypoallergenic', sentence: 'The cozy pillow is hypoallergenic.' },
    ] },
    { id: 'gr-kilo', prefix: 'kilo-', origin: 'greek', tier: 1, meaning: 'thousand', examples: [
      { word: 'kilometer', sentence: 'We walked one kilometer.' },
      { word: 'kilogram', sentence: 'A kilogram is about two pounds.' },
    ] },
    { id: 'gr-macro', prefix: 'macro-', origin: 'greek', tier: 3, meaning: 'large, long', examples: [
      { word: 'macrophotography', sentence: 'We admired the stunning macrophotography of insects.' },
      { word: 'macrocosm', sentence: 'The macrocosm includes galaxies and starry clusters.' },
    ] },
    { id: 'gr-mega', prefix: 'mega-', origin: 'greek', tier: 1, meaning: 'large', examples: [
      { word: 'megaphone', sentence: 'The coach uses a megaphone.' },
      { word: 'megabyte', sentence: 'The file has one megabyte.' },
    ] },
    { id: 'gr-meta', prefix: 'meta-', origin: 'greek', tier: 3, meaning: 'beyond, change', examples: [
      { word: 'metamorphosis', sentence: 'A tadpole becomes a frog through metamorphosis.' },
      { word: 'metaphor', sentence: 'Calling time a thief is a clever metaphor.' },
    ] },
    { id: 'gr-micro', prefix: 'micro-', origin: 'greek', tier: 1, meaning: 'small', examples: [
      { word: 'microscope', sentence: 'We look through the microscope.' },
      { word: 'microwave', sentence: 'The microwave heats the soup.' },
    ] },
    { id: 'gr-mono', prefix: 'mono-', origin: 'greek', tier: 2, meaning: 'one, alone', examples: [
      { word: 'monorail', sentence: 'The train is a monorail.' },
      { word: 'monologue', sentence: 'The actor speaks a monologue.' },
    ] },
    { id: 'gr-neo', prefix: 'neo-', origin: 'greek', tier: 3, meaning: 'new, recent', examples: [
      { word: 'neonatal', sentence: 'Nurses work carefully in the neonatal ward.' },
      { word: 'neolith', sentence: 'Archaeologists uncovered a sharp stone neolith.' },
    ] },
    { id: 'gr-ortho', prefix: 'ortho-', origin: 'greek', tier: 2, meaning: 'straight, correct', examples: [
      { word: 'orthodontist', sentence: 'The orthodontist checked my shiny braces.' },
      { word: 'orthography', sentence: 'Dictionary spelling follows standard orthography.' },
    ] },
    { id: 'gr-paleo', prefix: 'paleo-', origin: 'greek', tier: 3, meaning: 'ancient, old', examples: [
      { word: 'paleontology', sentence: 'Paleontology uncovers prehistoric life.' },
      { word: 'paleontologist', sentence: 'The paleontologist cleaned the fossil.' },
    ] },
    { id: 'gr-pan', prefix: 'pan-', origin: 'greek', tier: 3, meaning: 'all, every', examples: [
      { word: 'pandemic', sentence: 'A pandemic affects everyone.' },
      { word: 'panorama', sentence: 'The view is a panorama.' },
    ] },
    { id: 'gr-para', prefix: 'para-', origin: 'greek', tier: 2, meaning: 'beside, near', examples: [
      { word: 'parallel', sentence: 'The lines are parallel.' },
      { word: 'parachute', sentence: 'The pilot opens the parachute.' },
    ] },
    { id: 'gr-peri', prefix: 'peri-', origin: 'greek', tier: 3, meaning: 'around', examples: [
      { word: 'perimeter', sentence: 'The park has a short perimeter.' },
      { word: 'periscope', sentence: 'Look through the periscope.' },
    ] },
    { id: 'gr-phono', prefix: 'phono-', variants: ['phon-'], origin: 'greek', tier: 2, meaning: 'sound, voice', examples: [
      { word: 'phonograph', sentence: 'Grandfather spun a vinyl record on the phonograph.' },
      { word: 'phonics', sentence: 'First graders practice reading through phonics.' },
    ] },
    { id: 'gr-photo', prefix: 'photo-', origin: 'greek', tier: 1, meaning: 'light', examples: [
      { word: 'photograph', sentence: 'I take a photograph.' },
      { word: 'photocopy', sentence: 'Make a photocopy of the page.' },
    ] },
    { id: 'gr-poly', prefix: 'poly-', origin: 'greek', tier: 2, meaning: 'many', examples: [
      { word: 'polygon', sentence: 'A polygon has many sides.' },
      { word: 'polyglot', sentence: 'She is a polyglot.' },
    ] },
    { id: 'gr-proto', prefix: 'proto-', origin: 'greek', tier: 2, meaning: 'first', examples: [
      { word: 'prototype', sentence: 'The new robot is a prototype.' },
      { word: 'protocol', sentence: 'Follow the safety protocol.' },
    ] },
    { id: 'gr-pseudo', prefix: 'pseudo-', origin: 'greek', tier: 2, meaning: 'false', examples: [
      { word: 'pseudonym', sentence: 'The author uses a pseudonym.' },
      { word: 'pseudoscience', sentence: 'Astrology is a pseudoscience.' },
    ] },
    { id: 'gr-psycho', prefix: 'psycho-', origin: 'greek', tier: 2, meaning: 'mind, soul', examples: [
      { word: 'psychology', sentence: 'Psychology studies the mind.' },
      { word: 'psychotherapy', sentence: 'Psychotherapy helps the mind.' },
    ] },
    { id: 'gr-syn', prefix: 'syn-', variants: ['sym-'], origin: 'greek', tier: 2, meaning: 'together, with', examples: [
      { word: 'symmetry', sentence: 'The butterfly has symmetry.' },
      { word: 'symphony', sentence: 'The symphony sounds great.' },
    ] },
    { id: 'gr-techno', prefix: 'techno-', variants: ['techni-'], origin: 'greek', tier: 2, meaning: 'art, skill', examples: [
      { word: 'technology', sentence: 'Modern technology makes our homework easier.' },
      { word: 'technician', sentence: 'The technician repaired the broken laptop.' },
    ] },
    { id: 'gr-tele', prefix: 'tele-', origin: 'greek', tier: 1, meaning: 'far, distant', examples: [
      { word: 'telephone', sentence: 'The telephone rings loudly.' },
      { word: 'telescope', sentence: 'Look through the telescope.' },
    ] },
    { id: 'gr-tetra', prefix: 'tetra-', origin: 'greek', tier: 3, meaning: 'four', examples: [
      { word: 'tetrahedron', sentence: 'A pyramid shape can be a neat tetrahedron.' },
      { word: 'tetrapod', sentence: 'Any four-legged creature is a tetrapod.' },
    ] },
    { id: 'gr-thermo', prefix: 'thermo-', origin: 'greek', tier: 1, meaning: 'heat', examples: [
      { word: 'thermometer', sentence: 'The thermometer shows the heat.' },
      { word: 'thermos', sentence: 'The thermos keeps the tea warm.' },
    ] },
    { id: 'gr-topo', prefix: 'topo-', origin: 'greek', tier: 3, meaning: 'place, location', examples: [
      { word: 'topography', sentence: 'The relief map illustrates the local topography.' },
      { word: 'topology', sentence: 'College students study geometric topology.' },
    ] },
    { id: 'gr-tri', prefix: 'tri-', origin: 'greek', tier: 1, meaning: 'three', examples: [
      { word: 'triangle', sentence: 'Cut the sandwich into a triangle.' },
      { word: 'tricycle', sentence: 'The boy rides a tricycle.' },
    ] },
    { id: 'gr-zoo', prefix: 'zoo-', origin: 'greek', tier: 1, meaning: 'animal', examples: [
      { word: 'zoology', sentence: 'Zoology studies animals.' },
      { word: 'zoologist', sentence: 'A zoologist works with animals.' },
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
    { id: 'inv-13', prefix: 'un-', root: 'chair', explanation: '"unchair" is not an English word.' },
    { id: 'inv-14', prefix: 'dis-', root: 'apple', explanation: '"disapple" is not a word. You can say "disappear".' },
    { id: 'inv-15', prefix: 're-', root: 'cloud', explanation: '"recloud" is not a word. Clouds cannot be redone.' },
    { id: 'inv-16', prefix: 'anti-', root: 'table', explanation: '"antitable" is not a real word.' },
    { id: 'inv-17', prefix: 'super-', root: 'spoon', explanation: '"superspoon" is not a real English word.' },
    { id: 'inv-18', prefix: 'sub-', root: 'banana', explanation: '"subbanana" is not a word. Fruit has no "sub-" form.' },
    { id: 'inv-19', prefix: 'inter-', root: 'shoe', explanation: '"intershoe" is not a word. Shoes do not connect like that.' },
    { id: 'inv-20', prefix: 'micro-', root: 'cat', explanation: '"microcat" is not a real word.' },
    { id: 'inv-21', prefix: 'auto-', root: 'pencil', explanation: '"autopencil" is not a word. A pencil does not write by itself.' },
    { id: 'inv-22', prefix: 'bio-', root: 'rock', explanation: '"biorock" is not a standard English word for kids.' },
    { id: 'inv-23', prefix: 'over-', root: 'fork', explanation: '"overfork" is not a word. You can say "overeat" or "overflow".' },
    { id: 'inv-24', prefix: 'under-', root: 'spoon', explanation: '"underspoon" is not a word. Utensils do not take "under-".' },
  ],
}

// Self-check (contracts/dataset.md invariants) – throws with all violations at module load.
assertDatasetValid(EN_DATASET)
const crossProblems = validateCrossDataset(DE_DATASET, EN_DATASET)
if (crossProblems.length > 0) {
  throw new Error(`[prefixPirates] Cross-dataset violations:\n- ${crossProblems.join('\n- ')}`)
}
registerDataset(EN_DATASET)
