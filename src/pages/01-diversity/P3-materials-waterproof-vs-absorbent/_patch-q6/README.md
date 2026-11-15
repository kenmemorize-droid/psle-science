# Patch: add Q6 (water droplet on two papers) to P3-materials-waterproof-vs-absorbent

Source question: school paper, Q9. A similar size water droplet is dropped onto papers A and B; after five minutes A shows a droplet with a small wet patch, B shows a wet patch with no droplet.

LO: P3.MAT.P1 (Compare physical properties of materials: waterproof). Syllabus note used: a material is "waterproof" when it does not absorb water.
Tag reused: MAT-09 (no new tag, so no new recap-variant debt).

## Apply (page folder: src/pages/01-diversity/P3-materials-waterproof-vs-absorbent/)
1. Replace `page.js` with the `page.js` in this folder. Soak bench is unchanged; a droplet bench is added and chosen by `q.bench.kind === 'drop'`. The shared lock message is now generic ("Finish the bench to unlock the options.") plus the per-bench "Still to do" list.
2. In `questions.json`, insert the object from `q6.fragment.json` after `...q5` and before `...v1`.
3. `meta.json` `fixes`: append " It also covers reading a droplet-on-paper observation: a wet patch means water went in, and water sitting on top is not absorbed."
4. `body.html`, "Check yourself" lead: change "Soak every material on the bench." to "Questions 1 to 5 use the soaking bench. Question 6 uses a droplet bench: drop the water, wait, then read the wet patch."
5. `node tools/build.mjs`, run the linter, check 375 / 768 / 1280 px, answer Q6 wrongly once and confirm MAT-09 lands in the hub recap queue.

## Answer key (decided from the syllabus, please confirm)
Correct: (3) Paper B is more absorbent than paper A.
- (2) fails because A has a wet patch, so some water went in; by the syllabus note A is not waterproof.
- (4) "less waterproof" is the weakest distractor: waterproof is defined as "does not absorb", so it is not graded. If your school key treats (4) as correct, tell me and I will reword (4).

## Not verified
- Bench logic tested in jsdom against a stub of the engine (23 checks pass). Not run in a browser with the real engine, not run through the linter or build.
- `showFigureOnPage` is read by the engine but no existing question uses it; confirm the linter accepts it.
