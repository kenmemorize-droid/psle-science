# PSLE Science — interactive HTML learning materials

Interactive HTML pages for one primary-school student preparing for PSLE Science. The student works largely unsupervised on a laptop or tablet. Kenneth sends the requests.

**Read `SPEC.md` before any build.** It is the full contract: architecture, page anatomy, question schema, recap rules, storage, linter, retrofit plan and build order. This file is the short version.

## Source of truth
- `reference/Primary_Science_Syllabus_2023.pdf`: MOE Primary Science syllabus (P3–P6, Standard/Foundation, updated Jan 2026).
- `src/syllabus.json`: every LO quoted from it, with ids.
- Read the relevant topic pages before writing any content, question or spec. Do not work from general science knowledge.
- Constructive alignment is mandatory:
  - Every page declares its theme, topic, level and the exact syllabus LOs it targets.
  - Every question tests one of those LOs.
- Syllabus "Note:" exclusions are honoured: content marked not required appears only inside a closed **Beyond syllabus** toggle, never in the main flow and never in a question.
- Scope is Standard Science. Note a Foundation difference only where the syllabus states one.

## Audience
- P5–P6 reading level, with MOE terminology and phrasing throughout.
- Explain; don't quiz and move on.

## Request types
1. **Mistake-driven page (the default).** Kenneth sends a question the student got wrong, or a concept that needs clarifying.
   - Build a focus page directly, following SPEC §11.1. There is no spec step; ask only if the misconception is genuinely ambiguous.
   - If a focus page for that misconception already exists, extend it instead of duplicating it.
2. **Full unit build.** Write the spec first (SPEC §11.2), then build after one review pass.
3. **Sketchnotes.** The legacy sketchnotes are folded into unit pages: redrawn in house style with all text transcribed, never cropped photos. Items marked "check" in `_legacy/psle-sketchnotes-interactive.html` must be verified against the book before use.

## Non-negotiables
- **Edit `src/`, never the built output.** Build with `node tools/build.mjs`; the linter must pass.
- **Built pages are self-contained:** inline CSS and JS (Three.js inlined only when the page uses 3D), no CDN, no web fonts, no network calls. They must work offline by double-click and when hosted.
- **Every question follows the schema:**
  - exactly one correct option, numbered (1)–(4)
  - every option has `pick` and `why`
  - every wrong option has one misconception tag from `src/misconceptions.json`
  - each tag has at least 3 questions across the platform, for spaced recap
- **First answer is the score.** Spaced recap (about 1 → 3 → 7 days) serves *different* questions on the same misconception.
- **Storage** uses only `psle-sci:` keys, through the engine API, with every read and write in try/catch. Pages work with empty storage. Export/Import merges and never overwrites.
- **Usability:**
  - touch-first, tap targets ≥44px, nothing hover-only
  - colour never carries meaning alone (✓/✗ plus text)
  - all three palettes (`notebook` default, `lab`, `mission`) on `:root[data-theme]`
- **File naming:**
  - unit page: `<level>-<topic-slug>.html`
  - focus page: `<level>-<topic-slug>-<focus-slug>.html`
  - each filed under its theme folder (`01-diversity` … `05-energy`)
- **The hub `index.html` is generated** from page `meta.json` files. Don't edit it by hand.

## Delivery
- **After every build:**
  - run the linter
  - check the changed pages in the browser at 375, 768 and 1280px
  - confirm a wrong answer appears in the hub's recap queue
  - report the files changed, their LOs, any new misconception tags, and anything unverified
- **Working style:** state gaps explicitly rather than filling them with placeholder content. Be direct and concise.
