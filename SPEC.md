# PSLE Science platform — spec v1

Status: **draft for review** · 2026-11-11
Source of truth for content: MOE Primary Science Syllabus 2023 (updated Jan 2026). LO ids below are defined in §10 and Appendix A.

Review this once. Mark changes inline or reply with section numbers. Section 14 lists the decisions I still need from you.

---

## 0. Decisions already made (2026-11-11)

| Area | Decision |
|---|---|
| Where | Built from Claude Code in `G:\My Drive\_Claude\PSLE-Science` |
| How | One shared engine + theme source. A build script inlines it into every page, so each output page is still one self-contained file. The hub's catalogue is generated from page metadata. |
| Hosting | Later (needed for iPad). Nothing in this design blocks it. |
| Existing 9 files | All retrofitted onto the shared template |
| Base layer | One full unit page per syllabus topic, spec first, then build |
| Sketchnotes | Folded into unit pages as summary cards; the single file is retired once every unit exists |
| Recap | Spaced, per misconception, using a *different* question each time (about 1 → 3 → 7 days) |
| Open-ended (Booklet B) | Phase 2, after the MCQ layer is consistent |
| Order | P4 units, then P3, then P5 and P6 (see §10) |

---

## 1. What the platform is

- **Unit pages** (base layer): one per syllabus topic, 18 in total. Each covers every LO of its topic and ends with a unit check.
- **Focus pages** (repair layer): each one makes a single concept or misconception visible, then tests it with 3–6 diagnostic MCQs. Every mistake-driven page is a focus page.
- **Hub** (`index.html`): library, recap queue, mistake book, report, export/import, palette switcher.
- **Misconception registry**: every wrong option in every question names the one wrong idea it tests. The mistake book and the recap queue work on misconceptions, not on individual questions.

---

## 2. Folder layout

```
PSLE-Science/
  CLAUDE.md                  working brief for Claude Code
  SPEC.md                    this file
  index.html                 hub                                  (generated)
  01-diversity/ … 05-energy/ built pages, self-contained           (generated)
  assets/_theme.css          reference copy of the house style    (generated)
  src/
    syllabus.json            every LO quoted, with ids and "Note:" exclusions
    misconceptions.json      global misconception registry (§5)
    engine/
      shell.html             page template (header block, footer nav)
      theme.css              3 palettes + every component
      core.js                storage, recap scheduler, header, nav, export/import
      question.js            the one question component
      widgets/               diagram, stepper, classify, graph, bench, scene3d
    vendor/three.r149.min.js one pinned Three.js build, inlined only where a page asks for it
    pages/<theme>/<page-id>/
      meta.json  body.html  page.js  questions.json
  tools/
    build.mjs                node tools/build.mjs [--page <id>]
    lint.mjs                 run by build; stops the build on a contract breach (§12)
  specs/                     one spec per unit, reviewed before the unit is built (§11.2)
  reference/                 Primary_Science_Syllabus_2023.pdf
  _legacy/                   the 9 original files, untouched, for reference
```

Rules:
- Built files are never edited by hand. Each one opens with `<!-- GENERATED from src/pages/… — edit the source, then rebuild -->`.
- Build tooling is plain Node (v24 is installed). There are no npm dependencies, so the build runs on any machine with Node.
- Page code never touches `localStorage` directly. It goes through the engine API, so storage behaves the same on every page.

### meta.json (one per page)

```json
{
  "id": "P3-magnets-magnet-vs-magnetic-material",
  "type": "focus",
  "theme": "interactions",
  "topic": "MAG",
  "level": "P3",
  "title": "Magnet or not?",
  "lo": ["P3.MAG.C2", "P3.MAG.P1"],
  "fixes": "Telling a magnet from a magnetic material using only attract, repel and no-force results.",
  "origin": "retrofit",
  "built": "2026-11-11",
  "updated": "2026-11-11",
  "uses": ["bench"],
  "order": 2
}
```

`origin` is `base` (unit page), `mistake` (built from a question the student got wrong) or `retrofit`. `order` sets prev/next within the topic. The hub catalogue, prev/next links and back-to-hub links all come from these files.

---

## 3. Page types and anatomy

### 3.1 Header block (identical on every page)

From top to bottom:
1. Theme · Topic · Level (e.g. "Interactions · Interaction of Forces (Magnets) · P3")
2. Page title, plus a one-line purpose
3. "Learning outcomes" — the targeted LOs quoted from the syllabus (collapsible on narrow screens)
4. Tools: ← Hub · Look (palette) · Export · Import

### 3.2 Unit page — `<level>-<topic>.html` (e.g. `P4-heat.html`)

1. Header block (every LO in the topic)
2. **What you need to know**: summary cards, taken from the sketchnote for that topic after checking it against the syllabus; click-to-reveal
3. **Explore**: one interactive per group of related LOs (diagram, step-through, sort-into-groups, graph, simulation)
4. **Unit check**: 6–10 MCQs; every core-idea LO is tested at least once
5. **Go deeper**: the topic's focus pages, listed automatically with their "fixes" line and the student's status on each
6. Beyond-syllabus toggles inside sections where needed
7. Footer: prev/next unit within the theme, back to hub

### 3.3 Focus page — `<level>-<topic>-<focus>.html` (e.g. `P3-magnets-compass-needle.html`)

1. Header block
2. **The question that started this** (mistake-driven pages only): the original question transcribed and redrawn (never a photo), with the student's answer and the correct one
3. **See it**: the interactive that makes the concept visible, with step text
4. **Key idea**: one card, 1–2 sentences
5. **Check yourself**: 3–6 diagnostic MCQs
6. Beyond-syllabus toggles where needed
7. Footer: prev/next within the topic, back to hub

### 3.4 Beyond-syllabus toggle

- A `<details class="beyond">` block, closed by default, with a dashed amber border and a "Beyond syllabus" badge.
- Content the syllabus marks "not required" may appear only inside these blocks.
- It never appears in any question stem or option.

---

## 4. Question contract

### 4.1 Schema (`questions.json`)

```json
{
  "id": "P3-magnets-magnet-vs-magnetic-material.q1",
  "lo": ["P3.MAG.C2"],
  "kind": "exam",
  "pool": "page",
  "source": "School paper (Mala's objects K, L, M)",
  "stem": "Mala had three objects K, L and M …",
  "figure": "<svg …>…</svg>",
  "layout": "table",
  "cols": ["Object K", "Object L", "Object M"],
  "options": [
    { "text": ["Steel block", "Magnet", "Magnet"], "mis": "MAG-01",
      "pick": "Why a student would choose it …", "why": "Why it is not correct …" },
    { "text": ["Magnet", "Steel block", "Magnet"], "correct": true,
      "pick": "How to reach it …", "why": "Why it is correct …" }
  ]
}
```

- `kind`:
  - `exam`: follows a real school or PSLE question
  - `diag`: a diagnostic question written for the page
  - `variant`: a recap question for an existing misconception
- `pool`:
  - `page`: shown on the page
  - `recap`: kept back for the recap queue, so recap never repeats a question the student has just seen
- `figure` is optional and is either an inline SVG or an HTML table.
- Every question must be answerable from its stem and figure alone, without the page's interactive, so the hub can serve it during recap.
- `type: "oeq"` is reserved for Phase 2 (§13).

### 4.2 Rules (the linter enforces most of these, see §12)

- Exactly one correct option. Options are numbered **(1)–(4)**, as in PSLE.
- Options are shown in the order they are written, **never shuffled**, so a page's correct answers must be spread across (1)–(4). An exam question copied from a paper keeps the paper's order, and the other questions balance around it.
- Every option, right or wrong, has `pick` (why a student would choose it, or for the correct one, how to reach it) and `why` (why it is or isn't right).
- Every wrong option has exactly one `mis` tag from the registry. Distractors encode real misconceptions, not filler.
- Every question's `lo` is a subset of its page's `lo`.
- Wording follows MOE terms. No term the syllabus excludes may appear in a stem or option (§12).
- Wherever the topic supports it, a page's set includes at least one fair-test question (changed and unchanged variables) and one data-table or graph question.

### 4.3 Answering and scoring

- **The first answer is the score.** Only a wrong first answer creates a mistake.
- After a wrong answer:
  - the feedback shows why that option looks right, why it is wrong, and which given fact it contradicts
  - the option is struck out, and the student may keep trying (unscored) until they find the right one
- Once the student finds the right answer, the full rationale for every option is shown.

This keeps the step-by-step elimination the materials pages already use, while the score still reflects the first answer only.

---

## 5. Misconceptions and spaced recap

### 5.1 Registry (`src/misconceptions.json`)

```json
{ "id": "MAG-01", "topic": "MAG", "lo": "P3.MAG.C2",
  "label": "Thinks iron or steel can repel",
  "fix": "Only a magnet can push another object away. If two objects repel, both are magnets.",
  "learn": "P3-magnets-magnet-vs-magnetic-material.html#see-it" }
```

- One tag means one wrong idea. Reuse an existing tag before creating a new one.
- Each tag needs at least **3 questions** across the platform: the one on its page, plus at least 2 recap variants in different contexts (not the same question reworded). The linter warns when a tag has fewer.

### 5.2 Schedule

| Event | Result |
|---|---|
| First answer wrong on a question; the chosen option is tagged T | T becomes active, due **tomorrow** |
| Recap 1 on T answered correctly | due **+3 days** |
| Recap 2 answered correctly | due **+7 days** |
| Recap 3 answered correctly | T **cleared** (kept in history as "fixed on …") |
| Any recap on T answered wrong | back to the start, due tomorrow |
| New miss on a cleared T | reactivated, due tomorrow |

- **Picking the question:** recap serves a question with T on one of its wrong options. It prefers a question never seen, then one not seen for at least 7 days, then the one seen longest ago (options shuffled; the report flags that T needs more variants).
- **Daily cap:** 10 recap items per day, most overdue first.
- **Where recap runs:** in the hub's Recap tab, which has every question built in. A page with due tags shows a banner that links there.

### 5.3 State is worked out from the attempt log

Nothing about recap state is stored. Due dates, steps and cleared status are all recalculated from the attempt log every time a page or the hub loads. This makes Import a plain merge with no conflicts (§6).

---

## 6. Storage

| Key | Content |
|---|---|
| `psle-sci:theme` | `"notebook"` / `"lab"` / `"mission"` |
| `psle-sci:attempts` | Append-only list of `{q, page, choice, ok, first, mode: "page"\|"recap", at}`, capped at 5,000 |
| `psle-sci:pages` | `{pageId: {visited, goals: {name: date}}}` |
| `psle-sci:meta` | `{schema: 2, created}` |

- Every read and write is wrapped in try/catch. Every page renders and works correctly with nothing stored; if storage is unavailable, progress is kept in memory for that visit.
- **Export:** a single file, `{app: "psle-science", schema: 2, exportedAt, data}`, available from the hub and from every page.
- **Import:** merges and never overwrites. Attempts are unioned on (question, time, mode), page visits keep the latest date, and the current palette is kept. Importing the same file twice changes nothing.
- **Opening from disk:** tested 2026-11-12 on this laptop. In both Chrome and Edge, a page in a theme folder and the hub at the root share storage when opened by double-click: a wrong answer written from a theme folder appeared in the real hub's Recap and Mistake book. Firefox keeps local files apart, so it isn't supported from disk. Once hosted, any modern browser works, including iPad Safari.
- **Old storage keys** (four schemes in the legacy files) are ignored by default (decision 3 in §14).

---

## 7. Hub (`index.html`)

Tabs: **Library · Recap (n due) · Mistake book · Report**, plus the palette switcher and Export/Import.

- **Library**
  - Themes → topics (unit page) → focus pages.
  - Each entry shows: level, LO tags, date built or updated, the one-line "fixes", and the student's status (not started / in progress / done / needs recap).
  - P3–P6 level filter.
  - A topic with no unit page yet links to its module in the legacy sketchnotes file (`_legacy/psle-sketchnotes-interactive.html#<module>`), so all 49 sketchnote topics are reachable from day one.
- **Recap**
  - Today's due items run as one session, with full rationale after each question and a summary at the end.
- **Mistake book**
  - Grouped by misconception. Each group shows the label, the correction line, the questions missed and the answer chosen, its status (step 1/2/3 and next due date, or "cleared on …"), and a Re-learn link.
- **Report** (for you)
  - First-try accuracy per LO and per topic
  - Active vs cleared misconceptions
  - Misconceptions that need more variants
  - Activity over the last 30 days

The catalogue is generated by the build from `meta.json` files. No one edits it by hand.

---

## 8. House style

- **One token set**, in three palettes on `:root[data-theme]`:
  - The names come from the materials pages: `--bg --paper --card --sunk --topbar --topink --topmute --ink --muted --primary --primary-soft --primary-ink --accent --accent-soft --ok --ok-soft --no --no-soft --line --stroke --fa --fb --fc --radius --bw --f-display --f-body --f-label --ls`.
  - Science colours are added as tokens too: `--npole --spole --sim-1 --sim-2 --sim-3`, and for plants `--leaf --stem --soil --wood`.
  - Canvas and 3D scenes read these tokens on load and again whenever the palette changes.
- **Palettes:**
  - `notebook` is the default.
  - Amber `#F59E0B` is used only for fills and highlights. Amber text uses `#9A6400`, which is readable on the paper colour.
  - `lab` and `mission` are as in your brief.
- **Components**, each with exactly one implementation in `theme.css`:
  - header block, tabs, card, buttons (primary, ghost, small), chip, step pills
  - question, rationale card, key-idea card, beyond toggle
  - toast, figure + caption, tick table, observation log
- **Diagram style:** 2px strokes; classes `.ln .sl .lbl .lbl.sm .fa .fb2 .fc2 .hot`.
- **Spacing:** 4 / 8 / 12 / 16 / 20 / 24 / 32 px. Body text 17px (16px below 560px wide).
- **Access:**
  - Tap targets ≥44px, and nothing works only on hover.
  - Correct and incorrect are always shown with ✓/✗ plus text, never by colour alone.
  - Keyboard operable, with visible focus.
  - Feedback is announced to screen readers (`aria-live`).
  - Animation is reduced when the device asks for less motion.
- **No web fonts and no network requests.** System font stacks only.

---

## 9. Retrofit plan for the 9 legacy files

All of them move onto the shared engine, the unified storage and the question schema. Each wrong option gets a misconception tag, and each tag gets at least 2 recap variants. The table lists only what is specific to each file.

| Legacy file | New file | LOs | Specific fixes |
|---|---|---|---|
| P3-materials-strong-vs-flexible | `01-diversity/P3-materials-strong-vs-flexible.html` | P3.MAT.C1, P3.MAT.P1 | The page defines flexibility as "bent **into a new shape** without breaking", but the syllabus says "ability to bend without breaking". Reword the test results, the rules card and the T1 correction. Q1's rationale names "transparent" in the main flow; move that into a beyond toggle. |
| P3-materials-match-part-to-property | `01-diversity/P3-materials-match-part-to-property.html` | P3.MAT.C1 | Structural changes only |
| P3-materials-waterproof-vs-absorbent | `01-diversity/P3-materials-waterproof-vs-absorbent.html` | P3.MAT.P1 | Structural changes only |
| magnet-or-not | `04-interactions/P3-magnets-magnet-vs-magnetic-material.html` | P3.MAG.C2, P3.MAG.P1 | Has its own palette (Verdana/Trebuchet), its own storage key and no hub link. Keep its bench logic (which lists what each option contradicts in the student's log) as the page's `bench` widget. |
| P3-magnets-compass-and-earth | `04-interactions/P3-magnets-compass-needle.html` | P3.MAG.C1, P3.MAG.C2 | "The Earth behaves like a giant magnet" is not an LO, but it sits in the main flow, in the Earth on/off toggle and in Q5. Move it behind a beyond toggle and rewrite Q5 so it doesn't need it. Q6 (pull weakens with distance) tests something that isn't a P3 LO; replace it. Change answer labels A–D to (1)–(4). |
| Air in a bottle with a balloon | `02-cycles/P4-matter-air-occupies-space.html` | P4.MTR.C1, P4.MTR.C2 | Loads the Lexend web font (breaks the offline rule); remove it. Replace its own dark mode with the palette tokens. Add the header block. Add 4–6 MCQs (it has none). |
| shadow-walk | `05-energy/P4-light-shadow-length.html` | P4.LGT.C2, P4.LGT.P1 | Uses Three.js r147; move to r149. Own dark palette → tokens. The inline "Beyond P4" sections (similar-triangles formula, two-lamp shading) become toggles. The "Think about it" reveals become scored MCQs. Main misconception to target: "further from the light always means a bigger shadow" (true for a torch and a wall, not for a lamppost and the ground). |
| digestive-system | `03-systems/P4-digestive-system-food-journey.html` | P4.DIG.C2 (+ C1 if the whole-body view covers it) | Own palette and storage key. Its 4 checkpoint questions already have a reason per option (`tempt`/`why`); map them straight onto the schema. Keep the 2D/3D toggle. |
| psle-sketchnotes-interactive | Retired gradually into the unit pages | all | 49 modules, with no level or LO tags. **22 "check against the book" markers** where the photo text was hard to read; each needs verifying before it moves into a unit. 12 inline "extra" (beyond-syllabus) items become toggles. Its widgets (Diagram, Stepper, Classify, HeatGraph, QuickAsk) become engine widgets in Phase 1. Until its unit exists, each module stays linked from the hub. |

Three.js: the two 3D pages carry two different versions (r147 and r149, about 610 KB each). Standardise on **r149**: it is the newest version these pages already use, and it still ships as a single classic `three.min.js` file that can be inlined. It is inlined only into pages whose `meta.uses` includes `scene3d`.

---

## 10. Syllabus map and build order

### 10.1 The 18 topics

| Folder | Code | Topic (syllabus wording) | Level | Unit file | Material already built |
|---|---|---|---|---|---|
| 01-diversity | LIV | Diversity of Living and Non-Living Things | P3 | `P3-living-things.html` | sketchnotes |
| 01-diversity | MAT | Diversity of Materials | P3 | `P3-materials.html` | 3 focus pages, sketchnotes |
| 02-cycles | LCY | Cycles in Plants and Animals (Life Cycles) | P3 | `P3-life-cycles.html` | sketchnotes |
| 02-cycles | MTR | Cycles in Matter and Water (Matter) | P4 | `P4-matter.html` | air-in-a-bottle, sketchnotes |
| 02-cycles | REP | Cycles in Plants and Animals (Reproduction) | P5 | `P5-reproduction.html` | sketchnotes |
| 02-cycles | WAT | Cycles in Matter and Water (Water) | P5 | `P5-water.html` | sketchnotes |
| 03-systems | PLP | Plant System (Plant parts and functions) | P4 | `P4-plant-parts.html` | sketchnotes |
| 03-systems | DIG | Human System (Digestive System) | P4 | `P4-digestive-system.html` | 3D journey, sketchnotes |
| 03-systems | PRC | Plant System (Respiratory and circulatory systems) | P5 | `P5-plant-transport.html` | sketchnotes |
| 03-systems | HRC | Human System (Respiratory and circulatory systems) | P5 | `P5-respiratory-circulatory.html` | sketchnotes |
| 03-systems | ELE | Electrical System | P5 | `P5-electrical-system.html` | sketchnotes |
| 04-interactions | MAG | Interaction of Forces (Magnets) | P3 | `P3-magnets.html` | 2 focus pages, sketchnotes |
| 04-interactions | FOR | Interaction of Forces (Frictional, gravitational, elastic spring force) | P6 | `P6-forces.html` | sketchnotes |
| 04-interactions | ENV | Interactions within the Environment | P6 | `P6-environment.html` | sketchnotes |
| 05-energy | LGT | Energy Forms and Uses (Light) | P4 | `P4-light.html` | shadow-walk, sketchnotes |
| 05-energy | HEA | Energy Forms and Uses (Heat) | P4 | `P4-heat.html` | sketchnotes |
| 05-energy | PHO | Energy Forms and Uses (Photosynthesis) | P6 | `P6-photosynthesis.html` | sketchnotes |
| 05-energy | ENC | Energy Conversion | P6 | `P6-energy-conversion.html` | sketchnotes |

**Heat is a P4 topic.** The overview table in the PDF converts to text with its columns shifted, but the topic pages and the table's actual column positions both put it in P4.

LO ids look like `<level>.<code>.<C|P><n>`: C for a core idea, P for a practice. Values outcomes aren't tested. P3–P4 LOs are quoted in Appendix A; P5–P6 LOs are added to `syllabus.json` in Phase 1.

### 10.2 Phases

1. **Foundation**
   - engine, palettes, build, linter, hub
   - `syllabus.json` (all levels), the misconception registry
   - retrofit 8 legacy pages (all except sketchnotes)
   - test storage sharing when pages are opened from disk in Chrome/Edge
2. **P4 units**: Matter, Light, Heat, Plant parts, Digestive system. The retrofitted focus pages attach under their units.
3. **P3 units**: Materials, Magnets, Living things, Life cycles.
4. **P5 units**, in the order the school teaches them (you confirm the term plan).
5. **P6 units.**
6. **Open-ended practice** (§13).

Mistake-driven pages can be requested at any point and always jump the queue.

Each unit page goes through one spec review before it is built (§11.2). Sketchnotes is retired once all 18 units exist.

---

## 11. Workflows

### 11.1 Mistake-driven page (the default request)

**You send:** the question (photo or text), the student's answer, the correct answer if you have it, and the student's reasoning if you know it.

**I do:**
1. Identify the LO(s) and the misconception: reuse a registry tag or create a new one. I ask only if the misconception is genuinely ambiguous.
2. If a focus page for that misconception already exists, add to it (new questions, variants, a clearer interactive) instead of making a duplicate page.
3. Otherwise, build a new focus page (§3.3): the original question redrawn, the interactive, a key idea, 3–6 MCQs, and at least 2 recap variants for each new tag.
4. Build, lint, and check it in the browser (§11.4). The hub entry updates automatically.
5. Report: the file, its LOs, the tags it added, and anything I couldn't verify.

### 11.2 Unit build

**The spec contains:**
- the LOs, quoted and mapped to sections
- the sketchnote content being folded in, with its "check against the book" items listed for you to verify
- the list of scenes and interactions
- the full question bank (unit check plus variants), with every option's rationale written out

**Then:** one review pass, then the build.

### 11.3 Definition of done (every page)

- The linter passes with no errors.
- The page declares its LOs, and every question tests one of them.
- Every misconception tag the page introduces has at least 3 questions.
- It works with empty storage and when storage throws.
- It works with no network: zero external requests (checked in the browser).
- It is usable at 375px, 768px and 1280px wide; tap targets ≥44px; nothing hover-only.
- It is readable in all three palettes.
- Its hub entry is present, and prev/next and back-to-hub links resolve.

### 11.4 Verification

- Build into the folder, serve it locally, and open each changed page in the in-app browser at all three widths.
- Answer one question right and one wrong, and confirm the wrong one appears in the hub's Recap and Mistake book.
- Check the console for errors and the network log for zero requests.
- Where the browser allows it, spot-check opening from disk as well.

---

## 12. Linter (`tools/lint.mjs`)

**Errors (the build stops):**
- `meta.json`:
  - unknown theme, topic, level or LO id
  - level doesn't match the topic
  - file name doesn't follow the naming pattern
- **Questions:**
  - not exactly one correct option
  - an option without `pick` or `why`
  - a wrong option without a known `mis` tag
  - a question LO not declared by the page
  - an empty stem
- **Excluded terms** in any question stem or option, or anywhere in the main flow outside a `<details class="beyond">` block. The list comes from the syllabus "Note:" lines:
  - *transparent, translucent, opaque*
  - *density*
  - *law of reflection*
  - *nickel, cobalt*
  - *magnetic shielding, magnetic induction*
  - *xylem, phloem, stomata, artery, vein, capillary*
  - *alveoli*, heart chambers/valves
  - *pollen tube*
  - *chemical / gravitational / elastic potential energy*
  - *air resistance*

  A page may allow a term in its main flow when it is needed (e.g. "leaf vein"), but never inside a question.
- **Output:**
  - any `http(s)://` request, web font or `@import url(`
  - a generated file edited since the last build

**Warnings:**
- a misconception tag with fewer than 3 questions
- a unit page with a core-idea LO that no question tests
- correct answers bunched in one position:
  - more than half of a page's questions (4 or more) have the same answer position, checked for the whole page and again for the questions shown on the page
  - a page with 8 or more questions never uses one of the four positions
- a page over 1 MB without `scene3d`

---

## 13. Phase 2: open-ended (Booklet B), outline only

- **Question type:** `type: "oeq"`, with a stem and a figure.
- **Answering:**
  1. The student types an answer.
  2. They then see the model answer split into keyword points.
  3. They tick the points their answer contains.
- **Mistakes:** each missing point is linked to a misconception tag and goes into the mistake book.
- **Recap:** works the same way as for MCQs, using variants.
- **Not built until Phase 1–3 are done.** The schema field is reserved now so nothing has to be reworked later.

---

## 14. Decisions I need from you

1. **Level and term.**
   - I'm assuming the student has finished P4 and starts P5 in January 2027, so the order is P4 → P3 → P5 → P6.
   - If the student is still in P4, the P4 units follow the school's current order instead.
2. **Report tab.**
   - It shows you accuracy per LO and which misconceptions are active or cleared.
   - Default: include it; it's small, because the data is already there.
3. **Old progress.**
   - Has the student used the downloaded files enough that their saved mistakes matter?
   - Default: start clean. Migrating four old storage schemes is work that pays off only if real history exists.
4. **Variants on pages.**
   - Default: recap variants are hidden from the page, so recap always uses unseen questions.
   - The alternative is to show everything on the page and rely on reshuffling.
5. **Sketchnotes check markers.**
   - 22 places need the book page or a photo to verify.
   - I'll list them per unit in each unit spec rather than all at once.
6. **Hosting.** Deferred. Nothing above depends on the choice.
   - Note for later: git repositories inside Google Drive tend to get corrupted by syncing.
   - If you want version history, keep the repository outside Drive and publish into it, or use a host that takes a direct folder upload.

---

## Appendix A — P3 and P4 learning outcomes (quoted)

Wording is quoted from the syllabus; the ids are mine.

**P3 · Diversity of Living and Non-Living Things (LIV)**
- P3.LIV.C1 Describe the characteristics of living things. – Need water, food and air to survive – Grow, respond and reproduce
- P3.LIV.C2 Recognise some broad groups of living things based on similarities and differences. – Plants (flowering, non-flowering) – Animals (amphibians, birds, fish, insects, mammals, reptiles) – Fungi (mould, mushroom, yeast) – Bacteria
  - *Note: Recall of names of specific living things (e.g., guppy) and their characteristics (e.g., give birth to young alive) is not required.*
- P3.LIV.P1 Observe a variety of living and non-living things and infer differences between them.
- P3.LIV.P2 Classify living things into broad groups (in plants and animals) based on similarities and differences of common observable characteristics.

**P3 · Diversity of Materials (MAT)**
- P3.MAT.C1 Relate the use of various types of materials (wood, metal, ceramic, rubber, glass, plastic, fabric) to their physical properties.
- P3.MAT.P1 Compare physical properties of materials. – Strength – Flexibility – Ability to float/sink in water – Waterproof – Transparency
  - *Notes:*
    - *The focus is on how the properties of materials are used.*
    - *"Strength" is the ability to be subjected to loads without breaking.*
    - *"Flexibility" is the ability to bend without breaking.*
    - *"Ability to float on water" is whether an object stays on or near the surface and does not sink (density not required).*
    - *A material is "waterproof" when it does not absorb water.*
    - *"Transparency" is whether the material allows most/some/no light to pass through (transparent/translucent/opaque not required).*

**P3 · Cycles in Plants and Animals (Life Cycles) (LCY)**
- P3.LCY.C1 Show an understanding that different living things have different life cycles. – Plants – Animals
- P3.LCY.P1 Observe and compare the life cycles of plants grown from seeds over a period of time.
  - *Note: The focus is on the stages (seed, young plant, adult plant) of flowering plants. Processes in plant reproduction (pollination, fertilisation, seed dispersal and germination) are introduced in P5.*
- P3.LCY.P2 Observe and compare the life cycles of animals over a period of time (chicken, cockroach, frog, grasshopper, beetle, butterfly, mosquito).

**P3 · Interaction of Forces (Magnets) (MAG)**
- P3.MAG.C1 Recognise that a magnet can exert a push or a pull.
- P3.MAG.C2 Identify the characteristics of magnets. – Magnets can be made of iron or steel. – Magnets have two poles. A freely suspended bar magnet comes to rest pointing in a North-South direction. – Unlike poles attract and like poles repel. – Magnets attract magnetic materials.
  - *Note: Recall of magnetic materials such as nickel and cobalt is not required. Magnetic shielding and magnetic induction are not required.*
- P3.MAG.C3 Recognise uses of magnets in everyday objects.
- P3.MAG.P1 Compare magnets, non-magnetic materials and magnetic materials.
- P3.MAG.P2 Make a magnet by the stroke method and the electrical method.

**P4 · Plant System (Plant parts and functions) (PLP)**
- P4.PLP.C1 Identify the different parts of plants and state their functions. – Leaf – Stem – Root
  - *Note: Food-carrying and water-carrying tubes are introduced in P5.*
- P4.PLP.P1 Observe plant parts.

**P4 · Human System (Digestive System) (DIG)**
- P4.DIG.C1 Identify the human systems in the body and state their functions (digestive, respiratory, circulatory, skeletal and muscular).
  - *Note: This is an overview of human systems in the body. Detailed knowledge of the muscular and skeletal systems (such as names of the bones/muscles and how they work) is not required.*
- P4.DIG.C2 Identify the parts in the human digestive system (mouth, gullet, stomach, small intestine and large intestine) and describe their functions.

**P4 · Cycles in Matter and Water (Matter) (MTR)**
- P4.MTR.C1 State that matter is anything that has mass and occupies space.
- P4.MTR.C2 Differentiate among the three states of matter (solid, liquid, gas) in terms of shape and volume.
- P4.MTR.P1 Measure mass and volume using appropriate apparatus.

**P4 · Energy Forms and Uses (Light) (LGT)**
- P4.LGT.C1 Recognise that an object can be seen when it reflects light or when it is a source of light.
  - *Note: The law of reflection is not required.*
- P4.LGT.C2 Recognise that light travels in straight lines and thus a shadow is formed when light is completely or partially blocked by an object.
- P4.LGT.P1 Investigate the variables that affect shadows formed. – Shape, size and position of object(s) – Distance between light source-object and object-screen
  - *Note: The use of specific terms (transparent, translucent, opaque) is not required.*

**P4 · Energy Forms and Uses (Heat) (HEA)**
- P4.HEA.C1 Identify some common sources of heat.
- P4.HEA.C2 State that the temperature of an object is a measurement of its degree of hotness.
- P4.HEA.C3 State that heat is a form of energy.
- P4.HEA.C4 Differentiate between heat and temperature.
- P4.HEA.C5 Show an understanding that heat flows from a hotter to a colder object/ region/ place until both reach the same temperature.
- P4.HEA.C6 Relate the change in temperature of an object to the gain or loss of heat by the object.
- P4.HEA.C7 List some effects of heat gain/loss in our everyday life. – Contraction / expansion of objects (solid, liquid and gas) – Change in state of matter
- P4.HEA.C8 Identify good and poor conductors of heat. – Good conductors: metals – Poor conductors: wood, plastics, air, rubber
  - *Note: Recall of the rate of heat transfer of specific materials (such as different types of metals) is not required.*
- P4.HEA.P1 Measure temperature using a thermometer and a datalogger with temperature/heat sensors.
