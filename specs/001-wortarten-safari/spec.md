# Feature Specification: Wortarten-Safari

**Feature Branch**: `001-wortarten-safari`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "Wortarten-Safari (reverse specification): browser-based learning game for Grade 3 (3. Klasse) children in which they discover, mark and review sentence endings, capitalization and German word classes across four steps, using short animal stories."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a complete safari and earn points (Priority: P1)

A child starts a safari: it can optionally choose which word classes (Wortarten) to hunt for, marks the five sentence endings in step 1, marks all words that must be capitalized in step 2, colors the word classes with a paint brush in step 3, and receives a review in step 4. Finally, the child sees a summary ("Gesamtwertung") with the XP earned.

**Why this priority**: The four-step playthrough is the core of the learning game — without this flow there is no usable game. All other behavior (configuration, review details) builds on it.

**Independent Test**: Can be fully tested by playing a safari from the start through to the summary and verifying that the displayed score matches the child's marks and mistakes.

**Acceptance Scenarios**:

1. **Given** a child is on the intro screen, **When** it confirms the word class selection and taps "Safari starten", **Then** step 1 (sentence endings / "Satzenden finden") begins with a randomly selected story consisting of 5 sentences.
2. **Given** step 1 is active, **When** the child taps a gap between two words, **Then** the gap is marked with a period (tapping it again removes the mark) and the "Satzenden markiert: X von 5" counter updates.
3. **Given** step 1 is active, **When** the child taps "Weiter", **Then** the view switches to step 2 (capitalization / "Großschreibung markieren").
4. **Given** step 2 is active, **When** the child taps a word, **Then** the word is marked as capitalized (an "Aa" badge appears and the word is displayed capitalized) and tapping it again unmarks it.
5. **Given** step 3 is active and the child has picked a word class from the palette, **When** it taps a word matching that class, **Then** the word is colored in the class color; tapping the same word again with the same class removes the coloring.
6. **Given** step 3 is finished (the child tapped "Auswerten"), **When** the review appears, **Then** it marks correct decisions green (✓), mistakes red (with "?") and awards XP according to a fixed formula.
7. **Given** the review (step 4) is left via "Zur Gesamtwertung", **When** the summary appears, **Then** it shows the partial results (sentence endings X/5, capitalization X/word count, word classes X/words hunted) and the total XP as the "Erfolgs-Prämie" (success bonus).
8. **Given** the summary is visible, **When** the child taps "Neue Safari starten", **Then** a new safari begins with a story that has not yet been used in this pass (see edge cases for a fully exhausted pool).

---

### User Story 2 - Explore the review and read explanations (Priority: P2)

In step 4 a child can tap any marked or faulty word or gap and receive an explanation popover with the didactic reasoning ("Forscher-Regel") plus the information whether its own decision was right or wrong.

**Why this priority**: The learning effect mainly comes from the comprehension explanations after working through the text; however, it is an added benefit over simply playing through the steps.

**Independent Test**: Can be tested by tapping a correct word, a wrong word, a non-hunted word, a correct sentence-ending gap and a wrong gap in step 4, and comparing the respective popover contents.

**Acceptance Scenarios**:

1. **Given** step 4 is active and a word is tapped, **When** the popover appears, **Then** it contains the word, its word class as a badge, the evaluation of the capitalization decision, the evaluation of the word class (or a note that this word class was not part of this safari), and an understandable explanation.
2. **Given** step 4 is active and a gap is tapped, **When** the popover appears, **Then** it shows whether a sentence ending was correctly set here, a sentence ending is missing, an extra sentence ending was set, or a comma appears here instead.
3. **Given** a popover is open, **When** the child taps "Schließen" (close) or outside the popover, **Then** the popover closes and the review stays unchanged.

---

### User Story 3 - Configure word classes and use pause (Priority: P3)

Before starting, a child can decide which word classes are part of the safari (at least one), and during play it can pause, resume or exit at any time.

**Why this priority**: Configuration and pause increase fit-to-purpose and allow shorter play sessions, but are not required for the core flow of User Story 1.

**Independent Test**: Can be tested by activating exactly one word class in the intro (expect the usual word-class palette in step 3) and by opening the pause during play, resuming, and exiting.

**Acceptance Scenarios**:

1. **Given** the intro shows the word class selection, **When** the child deselects an active word class, **Then** it becomes inactive (no checkmark); if it is the last active class, it cannot be deselected.
2. **Given** a safari is active in steps 1–4 and the child taps the pause icon (or presses Escape), **When** the pause dialog appears, **Then** it can resume (same view, all marks preserved) or end the game and return to the menu.
3. **Given** the child selected only word classes that do not occur in the displayed story, **When** step 3 starts, **Then** no word is tappable and the review shows "0 of 0" for word classes.

---

### Edge Cases

- **Last word class**: If only one word class remains active, it cannot be deselected; the game still starts.
- **No hunted words in the story**: If the story contains no words of the chosen word classes, nothing can be marked in step 3; the review handles this case as "0 of 0".
- **More than 5 marks in step 1**: The child may mark any number of gaps (including more than the 5 real sentence endings); in the review only matches count, additional marks are treated as mistakes.
- **Arbitrary marks in step 2**: The child may mark any word, even wrongly; in the review only the match with the correct capitalization counts.
- **Back navigation**: Going back (step 2 → 1, step 3 → 2) preserves all marks unchanged; a new review is only possible after tapping "Auswerten" in step 3.
- **Story pool exhausted**: Once all 20 stories have been used in one pass, selection restarts (repeats become possible) without interrupting the game.
- **Escape in popover**: With a review popover open, Escape first closes the popover; only a further Escape opens the pause.
- **Pause in intro/summary**: The pause is not available in the intro or on the summary screen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST show the child a selection of all supported word classes before the game starts (Nomen, Verb, Adjektiv, Artikel, Pronomen, Numerali, Adverb, Präposition, Konjunktion, Interjektion), each with its child-friendly alias (e.g., "Namenwort", "Tunwort", "Wiewort").
- **FR-002**: The game MUST preselect the word classes Nomen, Verb, Adjektiv and Artikel as active by default and MUST allow the child to change the active classes; at least one class MUST remain active.
- **FR-003**: The game MUST select one story per safari from a pool of 20 stories (5 sentences each) at random without repetition; once every story has been used, selection MUST restart from the beginning.
- **FR-004**: In step 1 (sentence endings, "Satzenden finden") the child MUST be able to mark a sentence ending by tapping a gap between two words; tapping it again MUST remove the mark.
- **FR-005**: In step 1 the game MUST show the number of marked sentence endings live ("Satzenden markiert: X von 5"); commas MUST be hidden and not markable in this step.
- **FR-006**: In step 2 (capitalization, "Großschreibung markieren") the child MUST be able to mark individual words as capitalized; marked words MUST be displayed capitalized and MUST carry a visible marker (the "Aa" badge).
- **FR-007**: In step 2 the game MUST show the number of marked words live; the marks MUST influence the review in step 4.
- **FR-008**: In step 3 (word classes, "Wortarten jagen") the child MUST select one tool from a palette containing exactly the previously chosen word classes and color words with it; tapping the same word again with the same class MUST remove the coloring.
- **FR-009**: In step 3 words whose class is not part of the active selection MUST be visually dimmed and not tappable; the game MUST show the progress as "X of Y words marked".
- **FR-010**: After tapping "Auswerten" the game MUST display a review (step 4) that marks every decision as correct (green/✓) or wrong (red/"?") — separately for sentence endings, capitalization and word classes.
- **FR-011**: The score per safari MUST be computed as: 10 points per correctly set sentence ending (max. 5), 5 points per correctly decided capitalization (per word of the story) and 8 points per correctly assigned word class (only for active word classes).
- **FR-012**: The earned points MUST be credited to the running game session and MUST be stored beyond the summary (progress accumulates across multiple safaris).
- **FR-013**: In step 4 the child MUST be able to open an explanation popover by tapping a word or a gap; the popover MUST contain the evaluation of the respective decision as well as an understandable explanation ("Forscher-Regel").
- **FR-014**: The summary ("Gesamtwertung") MUST show the partial results (sentence endings X/5, capitalization X/total words, word classes X/hunted words), the total XP of this safari, and the actions "Neue Safari starten" (play again) and "Zurück zum Menü" (back to menu).
- **FR-015**: During steps 1–4 the game MUST offer a pause dialog via the pause icon or the Escape key, allowing the child to resume (state unchanged) or to end the game and return to the menu.
- **FR-016**: The back navigation (step 2 → 1, step 3 → 2) MUST preserve all marks and return without re-evaluating.

### Key Entities *(include if feature involves data)*

- **SafariStory**: A selectable practice story; comprises a unique identifier, a title and exactly 5 sentences; 20 stories exist in total.
- **SafariToken**: A single word of a story with its word class, whether it is a sentence ending, whether a comma follows, whether it must be capitalized, and a child-friendly explanation for the popover.
- **SafariWordClass**: One of the 10 supported word classes with display name, child-friendly alias and configuration state (active/inactive; default active for Nomen, Verb, Adjektiv, Artikel).
- **SafariSession (round)**: The state of a running safari — chosen word classes, current story, set sentence-ending marks, capitalization marks, word-class assignments, active color tool, partial results and points.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child can play 20 different stories (5 sentences each) in one session without repetition; each story can be worked through completely in the four steps and finished in the summary.
- **SC-002**: The scoring is unambiguously traceable for every story: max. 50 points for sentence endings (5 × 10), max. 5 × word count for capitalization, and max. 8 × number of active story words for word classes; the displayed total XP equals exactly that sum.
- **SC-003**: 100 % of the words and gaps of a story open an explanation popover in step 4 that classifies the child's own decision as right or wrong and contains a reason.
- **SC-004**: A child can interrupt a safari at any step (pause), resume unchanged and keep all previous marks; steps returned to show the same intermediate state as before leaving.
- **SC-005**: The full word-class selection (10 classes) is always available and configurable; every combination with at least one active class leads to a playable and reviewable safari.

## Assumptions

- The target group is children in Grade 3 (3. Klasse) of German primary school; all stories and explanations are accordingly simple.
- Each story contains exactly 5 sentences by convention and is displayed as one continuous story (mostly animal stories).
- Commas are deliberately hidden in step 1 and are not part of the scoring; they are only shown as a hint from step 2 onwards.
- The word class "Sonstiges" (other) exists in the data model, is not assigned in the current stories and cannot be configured.
- The displayed texts and all display names correspond exactly to the current state; the game is treated as a working result, not a draft.
- All content must be usable without an internet connection (offline operation in the browser).