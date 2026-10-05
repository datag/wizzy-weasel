# Feature Specification: Präfix-Piraten (Prefix Pirates)

**Feature Branch**: `002-praefix-piraten`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "Ich möchte ein neues Mini-Game schaffen, das Präfixe (insbesondere auch lateinische und griechische Präfixe) spielerisch anfragt. Das Spiel soll in Deutsch und in Englisch verfügbar sein; also nicht nur rein lokalisiert, sondern mit jeweils eigenen Datensätzen. Nutze Wikipedia als Quelle, insbesondere https://de.wikipedia.org/wiki/Präfix , https://de.wikipedia.org/wiki/Präfix-_und_Partikelverben_im_Deutschen , https://de.wikipedia.org/wiki/Liste_griechischer_Präfixe , https://de.wikipedia.org/wiki/Liste_lateinischer_Präfixe für Deutsch, und https://en.wikipedia.org/wiki/Prefix , https://en.wikipedia.org/wiki/English_prefix und https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English für Englisch. Das Spiel sollte Spieloptionen haben für Schwierigkeit und Begrenzung auf Ursprung/Wurzel (also z.B. ob aus dem Deutschen, Lateinischen, Griechischen, ...). Auch dieses Spiel richtet sich primär an Grundschüler. Der Name und Thema des Spiels sollte wieder spielerisch gewählt werden. Es soll verschiedene Abfragearten geben, die zufällig gewählt werden. Abfragearten sind die Art und Weise, wie eine Aufgabe gestellt wird und beantwortet werden muss – mache hierzu ein paar Vorschläge."

## Clarifications

### Session 2026-10-05

- Q: Which question types should the first version of the game ship with? → A: All six proposed types (Option A), as specified in FR-004/FR-005.
- Q: How should the yes/no verdict question type ("Falschmünzer") produce its "no" (invalid) cases? → A: Curated invalid prefix+root pairs per language (Option A).
- Q: Which language should determine the dataset and UI when a round is started? → A: The app's current language determines both (Option A).
- Q: Should consecutive correct answers (the "coin chain") change the scoring, or stay purely visual? → A: Purely visual, flat 10 XP per correct answer (Option A).
- Q: Should the game keep the proposed name and theme "Präfix-Piraten" / "Prefix Pirates"? → A: Yes, keep name and theme (Option A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set sail: configure and play a full pirate round (Priority: P1)

A child opens "Präfix-Piraten" from the game menu, chooses a difficulty and the origin families that may appear, sails a round of 10 questions in which the question type is chosen randomly, answers each question by tapping, receives immediate feedback plus a short explanation, and finally sees the summary with score, coin chain, best score and the XP credited.

**Why this priority**: The complete playable round is the core of the learning game — without this flow there is no usable feature. Everything else (explanations, bilingual datasets, pause) builds on it.

**Independent Test**: Can be fully tested by configuring options, playing a round through to the summary, and verifying that the displayed score and coins match the child's right and wrong answers.

**Acceptance Scenarios**:

1. **Given** the child tapped "Präfix-Piraten" in the game menu, **When** the intro screen appears, **Then** it shows a playful pirate scene with difficulty options, origin filters (German, Latin, Greek) and a "Segel setzen" (set sail) button.
2. **Given** the intro shows the origin filters, **When** the child deselects an active origin, **Then** it becomes inactive; if it is the last active origin it cannot be deselected, and the game still starts.
3. **Given** the child confirmed the options, **When** the first question appears, **Then** the question type is chosen at random from those allowed for the chosen difficulty and the content comes exclusively from the active origin families.
4. **Given** a question is shown, **When** the child taps an answer, **Then** the game immediately marks it correct (green + treasure coin) or wrong (red + reveal of the correct answer) and then shows the explanation card before the next question.
5. **Given** the round of 10 questions is finished, **When** the summary appears, **Then** it shows the correct-answer count (X of 10), the score/coins, whether a new best score was reached, and the actions "play again" and "back to menu".

---

### User Story 2 - Learn the pirate lore: read the explanations (Priority: P2)

After every answered question a child can read a short explanation card: the prefix, its meaning in child-friendly words, its origin family and an example word in a short sentence. The message is encouraging on correct answers and shows the right answer without blaming on wrong answers.

**Why this priority**: The learning effect comes mainly from understanding what a prefix means and where it comes from; however, it is an enhancement over simply collecting points.

**Independent Test**: Can be tested by answering a question correctly and another one wrongly and comparing the two explanation cards for the required contents.

**Acceptance Scenarios**:

1. **Given** a question has been answered, **When** the explanation card appears, **Then** it contains the prefix, its child-friendly meaning, its origin family (Germanic, Latin or Greek) and an example word inside a short sentence.
2. **Given** the answer was correct, **When** the card appears, **Then** the feedback is positive (e.g. "Schatz gefunden!") and the chosen option is highlighted as correct.
3. **Given** the answer was wrong, **When** the card appears, **Then** the correct answer is clearly revealed and the message is motivating and non-punishing (no scolding, no negative score numbers).

---

### User Story 3 - Sail the English word sea: separate datasets (Priority: P2)

When the app runs in English, the game title, UI and all explanations are in English and every task draws from a dedicated English dataset with its own prefixes, meanings and examples. In German mode the game draws only from the German dataset. The two datasets are not translations of each other.

**Why this priority**: Bilingual availability with separate datasets is an explicit goal of the feature and doubles its reach; the core play flow (User Story 1) already exists before this story is added.

**Independent Test**: Can be tested by switching the app language and playing a round in each language, then comparing that no task content is a translation of the other dataset.

**Acceptance Scenarios**:

1. **Given** the app language is English, **When** "Prefix Pirates" is opened, **Then** title, UI, task texts, explanations and feedback are in English and every task comes from the English dataset.
2. **Given** the app language is German, **When** "Präfix-Piraten" is opened, **Then** the game runs on the German dataset with German UI and no English content leaks into the tasks.
3. **Given** the child changes the app language while a round is running, **When** that round finishes and a new one starts, **Then** the new round is played in the new language while the finished round kept its original language.

---

### User Story 4 - Pause, resume and safe exits (Priority: P3)

During a round a child can pause via the pause icon or the Escape key, resume the current question unchanged or end the round and return to the menu. XP is only credited for completed rounds and is never double-counted.

**Why this priority**: Pausing and exiting allow shorter play sessions and protect the child's progress, but they are not required for the core flow of User Story 1.

**Independent Test**: Can be tested by pausing in the middle of a question, resuming (same question, unchanged), pausing again and ending the round, then starting a new round and checking the credited score.

**Acceptance Scenarios**:

1. **Given** a round is active, **When** the child taps the pause icon or presses Escape, **Then** the pause dialog appears and lets the child resume (the current question is shown unchanged) or end the round and return to the menu.
2. **Given** the child ends a round via the pause dialog, **When** a new round is started, **Then** no XP of the finished round is lost or counted twice and the best score already reflects completed rounds.
3. **Given** the intro screen or the summary is visible, **When** Escape is pressed, **Then** no pause dialog appears (pause exists only during active questions).

---

### Edge Cases

- **Last origin stays active**: At least one origin family must remain selected; if only one is active, all questions of the round come from that family.
- **Pool exhausted**: Once every entry matching the active origins has been used in a round, selection restarts from the beginning (repeats become possible) without interrupting the round.
- **Ambiguous combinations**: Combinations where a distractor would also form a valid word with the given root (e.g. German separable/inseparable pairs such as "umfahren") are excluded from the curated content so that every task has exactly one intended correct answer.
- **Invalid pairs must not be real words**: Curated invalid pairs for the yes/no verdict type must be verified as non-words in the respective language (e.g. "umlaufen" would be a wrong example because "umlaufen" exists as a real word).
- **Rapid double-tapping**: After the first answer tap, further taps on the same question must be ignored until the next question is shown (an answer can never be scored twice).
- **Language switch mid-round**: The running round keeps its language; the change takes effect with the next round.
- **No internet**: All prefix data is bundled with the app; the game must remain fully playable offline (Wikipedia is only a content source during authoring, never at runtime).
- **Interrupted round**: If the app is closed mid-round, the unanswered remainder of the round is not scored and no summary is shown; already credited XP of other finished rounds is preserved.
- **Sparse origin pools**: Even with a single origin active at hard difficulty, a 10-question round must remain completable; the pool restarts and distractors are drawn from the same language's pools.
- **Missing content fields**: Every entry in both datasets carries every field needed by all question types; content is validated so that no task can reference an empty meaning, origin or example.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST be reachable from the game menu under a playful name and theme ("Präfix-Piraten" / "Prefix Pirates") and MUST provide the standard game experience of the app: full-screen game view without the normal navigation, and pause available during active questions.
- **FR-002**: The intro screen MUST offer exactly three difficulty levels — Leicht (Schiffsjunge), Mittel (Kapitän), Schwer (Piratenkönig) — with "Leicht" as the default, and the difficulty MUST be selectable before each round.
- **FR-003**: The intro screen MUST offer an origin filter for the three families Germanic (Deutsch / native), Latin and Greek; all three MUST be active by default and at least one MUST remain active at all times.
- **FR-004**: The game MUST provide six question types: prefix choice for a given root ("Schatzsucher-Wahl"), meaning match ("Bedeutungs-Juwel"), prefix-in-word recognition ("Wort-Schmiede"), sentence gap fill ("Satz-Schatz"), origin assignment ("Ursprungs-Inseln") and real-vs.-non-real word verdict ("Falschmünzer").
- **FR-005**: The game MUST choose the question type uniformly at random per question from the types allowed for the active difficulty: Leicht = Schatzsucher-Wahl and Satz-Schatz; Mittel = Schatzsucher-Wahl, Bedeutungs-Juwel, Wort-Schmiede and Satz-Schatz; Schwer = all six types.
- **FR-006**: The number of answer options MUST be 2 at Leicht, 3 at Mittel and 4 at Schwer; every task MUST have exactly one correct answer and all options MUST be tappable touch targets.
- **FR-007**: Each question MUST draw from the entries matching the active origin filter; the entry used by the previous question MUST NOT be used again immediately, and once all matching entries have been used the selection MUST restart from the beginning.
- **FR-008**: After an answer tap the game MUST immediately show the verdict — correct in green (with a treasure coin) or wrong in red revealing the correct option — and MUST then display a child-friendly explanation card (prefix, meaning, origin, example sentence) before the next question can start.
- **FR-009**: A round MUST consist of exactly 10 questions. Each correct answer MUST award 10 XP and each wrong answer MUST reduce the boost by exactly 1 charge (minimum 0); XP and boost MUST be credited through the app's existing profile system.
- **FR-010**: The game MUST show a coin chain of consecutive correct answers in the feedback and in the summary MUST show the round result, the longest coin chain and whether a new best score was reached; the coin chain MUST NOT affect the score. The game MUST persist the best score per game across sessions.
- **FR-011**: The game MUST be fully playable in German and in English with two SEPARATE, non-translated datasets: German content based on the German Wikipedia articles "Präfix", "Präfix- und Partikelverben im Deutschen", "Liste griechischer Präfixe" and "Liste lateinischer Präfixe", and English content based on the English Wikipedia articles "Prefix", "English prefix" and "List of Greek and Latin roots in English". All UI strings and explanations MUST be localized through the app's language switching system.
- **FR-012**: Each dataset MUST contain at least 25 curated entries per origin family (≥ 75 per language) and every entry MUST include the prefix (with spelling variants where applicable), its origin family, a child-friendly meaning (at most a few words) and at least two example words, each with a short example sentence. In addition, each dataset MUST contain at least 10 curated invalid prefix+root pairs for the yes/no verdict type, and these pairs MUST NOT form a real word in the respective language.
- **FR-013**: The English dataset MUST support the same three origin families and all six question types, but its prefixes, meanings and examples MUST be its own curated content rather than translations of the German dataset.
- **FR-014**: The game MUST guarantee exactly one correct answer per task: distractor options and root combinations that would produce a second valid word for the same root MUST be excluded from the curated content, and curated invalid pairs MUST be verified as non-words in the respective language.
- **FR-015**: During active questions the game MUST offer a pause dialog (pause icon or Escape key) allowing the child to resume the current question unchanged or to end the round and return to the menu, without losing or double-counting XP.
- **FR-016**: The summary MUST offer the actions "play again" and "back to menu", and the intro and summary screens MUST NOT offer the pause dialog.
- **FR-017**: All game content and both datasets MUST be bundled with the app and remain fully playable without an internet connection.
- **FR-018**: The project's game list documentation (the Games table in the README) MUST be updated to include the new game.

### Key Entities *(include if feature involves data)*

- **PrefixEntry**: A single curated prefix entry: the prefix string (incl. variants such as kon-/kom-/ko-), its origin family (Germanic/Latin/Greek), its language (German/English), a child-friendly meaning and at least two example words with short sentences.
- **PrefixInvalidPair**: A curated (prefix, root) combination that does NOT form a real word in the given language (e.g. "un- + laufen" in German); supplies the "no" cases for the yes/no verdict type and carries a child-friendly explanation.
- **PrefixQuestion**: A concrete task generated from PrefixEntry content during play: question type, root or sentence, the answer options and the single correct option.
- **PrefixQuestionType**: One of the six question types, each with its answer mode (multiple-choice, meaning match, word recognition, gap fill, origin assignment, yes/no) and its per-difficulty availability.
- **PrefixDifficulty**: One of the three levels; defines the allowed question types and the number of answer options.
- **PrefixOriginFilter**: The three origin families with their display names and selection state (active/inactive, at least one active).
- **PrefixRound (session)**: The state of a running round — chosen difficulty, active origins, the 10 questions, the used-entries bookkeeping, correct count, coin chain, current score and reference to the persisted best score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child can complete a full 10-question round from intro to summary in under 5 minutes, including reading the explanation card after every question.
- **SC-002**: Across three consecutive rounds at "Schwer" (hard) difficulty all six question types appear at least once, and within a single round at least two different question types occur.
- **SC-003**: With exactly one origin family active, 100 % of the questions in the round are drawn from that family only; with all three active, every family can appear within a round.
- **SC-004**: Both language variants are complete: switching the app between German and English produces a fully localized game in the respective language, and no prefix, meaning or example of one dataset is a translation of the other (verified by comparing the datasets' example words).
- **SC-005**: 100 % of the generated tasks have exactly one correct answer verified against the curated content; no task with two valid answers exists in either dataset.
- **SC-006**: In a play test with 10 primary-school children (ages 7–10), at least 8 complete a round and reach the summary without help, and at least 6 voluntarily start a second round.

## Assumptions

- The target group is primary-school children (approx. Grades 2–4); all texts and examples are deliberately simple and every interactive target is at least 44×44 px.
- The game name "Präfix-Piraten" / "Prefix Pirates" is confirmed (not a proposal); the menu entry uses a playful pirate icon and a sea-inspired theme, following the project's existing playful game naming.
- A round consists of 10 questions and there is no per-question time limit in v1 (no time pressure for younger children).
- Scoring follows the app's existing convention: 10 XP per correct answer, −1 boost charge per mistake, boost refilled on level-up; the coin chain is purely visual and does not modify the score (confirmed).
- The game uses the app's current language (German or English) for its UI and its dataset (confirmed); changing the language during a round takes effect only from the next round on.
- Wikipedia is the content source during authoring/curation only; at runtime the datasets are bundled and the game runs fully offline.
- The origin concept maps to the three families Germanic (German-native prefixes in the German dataset, native English/Germanic prefixes in the English dataset), Latin and Greek; both datasets use the same families with language-appropriate labels.
- Latin and Greek prefixes that exist identically in both languages (e.g. "tele-", "re-") appear independently in each dataset with language-appropriate examples.
- Ambiguous combinations (e.g. German words with both separable and inseparable readings such as "umfahren") are excluded from the dataset so every task has exactly one intended answer.
- The six question types (FR-004) are confirmed for v1; every allowed type has equal probability (uniform random selection).
- Content volume target: at least 25 curated entries per origin family per language (≥ 75 per language) at launch.