# Unit spec · P4 Plant parts

Status: **approved and built** · 2026-11-12. The §0 defaults were used:
- the stem's transport is stated without the tubes
- root hairs are mentioned and observed, not tested
- no "photosynthesis"
- flowers and fruits are labelled only
- topics outside the book page are left out

Built with these changes from this draft:
- **E3, stem cut:** the top part lies on the table beside the pot, because the pot is too small to draw it lying on the soil. Each result also has a text label ("wilted", "grown taller", "not grown, dying"), so the drawing doesn't carry the meaning alone.
- **E4, hand lens:** the buttons are **▲ Move up / ▼ Move down**, because the lens moves up and down the seedling.
- **U6 figure:** the plant grows in garden soil rather than a pot, so the top part can lie flat on the soil as the question says.
- **Engine:** four plant colour tokens (`--leaf --stem --soil --wood`) were added to all three palettes in `theme.css`, and to SPEC §8.

Builds: `src/pages/03-systems/P4-plant-parts/` → `03-systems/P4-plant-parts.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

Plant parts is the smallest P4 topic: one core idea (leaf, stem and root, and their functions) and one practice (observe plant parts). The syllabus puts it in the Systems theme, so the unit is built on that theme's two essential takeaways, quoted from the syllabus:
- "A system is made of different parts. Each part has its own unique function."
- "Different parts of a system influence and work together to perform function(s)."

Review once: approve, or mark changes inline. **§0 lists the decisions I need from you.**

---

## 0. Decisions I need from you

1. **What the stem carries, without the tubes.** The book (p. 28) says the stem carries water from the roots and food from the leaves, through water-carrying and food-carrying tubes. The P4 note says the tubes are introduced in P5.
   - **Default:** the stem card says it carries water and mineral salts from the roots, and food from the leaves, to the other parts. This is tested.
   - The tubes, the ring-removal experiment (book p. 29) and any coloured-water experiment wait for the P5 Plant transport unit. They aren't mentioned here.
2. **Root hairs.** The book says tiny root hairs help the roots take in more water. The P4 outcome lists only leaf, stem and root.
   - **Default:** one sentence in the root card, and the student sees root hairs through the hand lens in E4. Root hairs are not tested.
3. **How leaves make food.** The book adds "(photosynthesis)". That word, and what the process needs, are P6 (P6.PHO.P1: water, light energy and carbon dioxide).
   - **Default:** the cards say only that leaves make food for the plant and need sunlight to do it. That is the book's reason for the stem holding the leaves up.
   - No "photosynthesis", and no list of what is needed. No question asks what happens to a plant kept in the dark.
4. **Flowers and fruits.** The book's diagram labels them. The P4 outcome doesn't list them, and what they do is P5 Reproduction.
   - **Default:** the diagram shows and names them. Tapping one says "You'll learn what this does in P5." They are in no card and no question.
5. **Topics the book page doesn't cover.** Many P4 worksheets also teach types of roots (tap, fibrous), types of stems (woody, non-woody), food stored in roots and stems, and the parts of a leaf. None of these is in the syllabus outcome or on the book page I have.
   - **Default:** left out. If your school tests any of them, send me the book pages and I'll add them.
6. **Exclusion honoured:** stomata, transpiration, xylem and phloem appear only in the closed Beyond-syllabus toggle (B1), and never in a question. No action needed.

The book's one "check" marker on p. 28 (the examples of non-flowering plants) isn't used here. It belongs to the P3 Living things unit.

**Added, not in the book** (built from the book's functions, so you can check them):
- a tree's trunk is its stem, and a seedling already has leaves, a stem and roots (E4, U8, R13, R14)
- the damage cases in E3 and their questions (U5, U6, R7–R10)
- the apparatus questions (hand lens, ruler: U9, R15, R16)
- every sort card and every question item

---

## 1. Learning outcomes and where each is covered

| LO | Wording | Cards | Interactives | Unit check |
|---|---|---|---|---|
| P4.PLP.C1 | Identify the different parts of plants and state their functions: leaf, stem, root. *(Note: food-carrying and water-carrying tubes in the plant transport system are introduced in P5.)* | PP1–PP5 | E1, E2, E3, E4 | U1–U8 |
| P4.PLP.P1 | Observe plant parts. | PP1 | E4 | U8, U9 |

Values outcomes aren't tested. One appears as a line in E4: "Show care and concern by being responsible towards plants."

---

## 2. Page outline

1. **Header**: both LOs.
2. **What you need to know**: cards PP1–PP5 (§3).
3. **Explore**: E1–E4 (§4).
4. **Unit check**: U1–U9, with 16 hidden recap variants (R1–R16).
5. **Go deeper**: no focus pages for Plant parts yet. The list says so until one is added.
6. **Beyond syllabus** (closed toggle under E2): B1, stomata and transpiration (decision 6).
7. **Footer**: next unit within Systems is *Digestive system*, then the hub. The Digestive unit isn't built yet, so that link points to the hub until it is.

---

## 3. Summary cards (exact text)

### PP1 · A plant is a system (from the syllabus Systems takeaways and the book)
> A **system** is made of different parts. **Each part has its own job**, called its **function**, and the parts **work together**.
>
> A plant's main parts are its **leaves**, its **stem** and its **roots**. Many plants also have flowers and fruits; you'll learn what those do in P5.
>
> You can **observe** these parts on any plant: a tiny seedling, a balsam plant or a tall tree.

### PP2 · Leaves make food (from the book)
> The **leaves** make **food** for the whole plant. They need **sunlight** to do this.
>
> A plant does **not** take in food from the soil. It makes its own food, in its leaves.

### PP3 · The stem holds up and carries (from the book)
> The **stem**:
> - **holds the plant upright** and **supports** its branches, leaves, flowers and fruits, so that the leaves get **as much sunlight as possible**
> - **carries water and mineral salts** from the roots **up** to the leaves and other parts
> - **carries food** from the leaves to **all the other parts**, including **down** to the roots
>
> A tree's **trunk** is its stem.

### PP4 · Roots hold on and take in (from the book)
> The **roots**:
> - **hold the plant firmly in the ground**
> - **take in water and mineral salts** from the soil
>
> Tiny **root hairs** help the roots take in more water.
>
> Mineral salts are **not food**. The plant's food is made in its leaves.

### PP5 · The parts work together (the syllabus Systems takeaways; the cases are added)
> Every part of a plant is living, so every part needs water and food.
> - The roots take in water, and the stem carries it up to the leaves.
> - The leaves make food, and the stem carries it to every other part.
>
> So when one part is damaged, the other parts suffer too:
> - **No roots:** no water reaches the leaves, so the plant **wilts** (droops). Nothing holds it firmly in the ground either.
> - **No leaves:** no food is made, so the plant cannot grow, and in time it dies.
> - **A broken stem:** the parts above the break get no water from the roots, so they wilt.

---

## 4. Interactives

### E1 · Parts and their jobs (C1; exercises PLP-01, PLP-02, PLP-03, PLP-04)
1. **Tap the plant.** A flowering plant in soil, redrawn from the book.
   - Tap the leaves, stem or roots to see the part's name and a short version of its card (PP2–PP4).
   - The flower and fruit can be tapped too: "This is a flower (fruit). You'll learn what it does in P5."
2. **Sort the jobs.** Uses the shared sort widget, with four bins: *Leaf · Stem · Root · No part does this*.

   **Cards (13):**
   - Leaf: makes food for the plant · needs sunlight to make food
   - Stem: holds the plant upright · holds the leaves up to the sunlight · carries water up from the roots · carries food from the leaves to the roots
   - Root: holds the plant firmly in the ground · takes in water from the soil · takes in mineral salts from the soil
   - No part does this: takes in food from the soil · makes food underground · takes in water through the stem from the soil · stores food taken in from the soil

   **Reasons after each placement**, for example:
   - "takes in food from the soil": "No part does this. A plant makes its own food in its leaves. The roots take in water and mineral salts, which are not food."
   - "carries food from the leaves to the roots": "The stem. Food travels down the stem as well as up."
   - "holds the plant upright": "The stem. The roots hold the plant in the ground; the stem holds it up."

### E2 · Follow the water and the food (C1; exercises PLP-02, PLP-04, PLP-01)
A step-through on the same plant, with **Back / Next** buttons and step text:
1. The roots take in water and mineral salts from the soil. Water is shown as blue drops ● labelled "water".
2. The stem carries the water up to the leaves and the other parts.
3. The leaves make food, using sunlight. Food is shown as orange squares ■ labelled "food", with the Sun in the corner.
4. The stem carries the food to all the other parts: the flowers, the fruits, and down to the roots.
5. Both together. Caption: "Water goes up from the roots. Food goes from the leaves to every part."

Water and food differ in shape and label as well as colour. With reduced motion, the drops and squares are drawn in place with arrows, and nothing moves.

**B1 · Beyond syllabus (closed toggle):** from the book, the tiny openings on a leaf, mostly on its underside, called stomata. They let gases in and out, and let water vapour escape (transpiration). Never tested.

### E3 · What if a part is damaged? (C1; exercises PLP-05, PLP-03)
Two identical potted plants: A is left alone, and B gets one change. Pick a change:
- Pull it out of the soil and leave it on the table.
- Cut off its roots and push the stem back into the soil.
- Cut through the stem halfway up, and leave the top part lying on the soil.
- Remove all its leaves, and keep watering it.

Press **See what happens**. Plant B changes; plant A stays healthy (or grows, in the leaves case). Time is shown in words only ("A few hours later", "Some weeks later"), with no exact times.

**Captions:**
- **Pulled out:** "A few hours later, the leaves have wilted. The roots are out of the soil, so they cannot take in water, and no water reaches the leaves."
- **Roots cut off:** "The next day, the plant has fallen over and wilted. Nothing holds it firmly in the ground, and nothing takes in water."
- **Stem cut:** "The next day, the top part has wilted. Water from the roots cannot reach it."
- **Leaves removed:** "Some weeks later, plant B has not grown, and in time it dies. With no leaves, no food is made, so the stem and roots get no food. Plant A has grown."

Every caption ends: "Damage to one part affects the whole plant."

### E4 · Observe like a scientist (P1, C1; exercises PLP-06, PLP-07)
1. **Find the parts.** Three plants side by side: a balsam seedling, a balsam plant and a young tree.
   - Tap a part, then choose *Leaf*, *Stem* or *Root*. Every tap zone is at least 44px.
   - Feedback on the tree trunk: "The trunk is the tree's stem. It holds the tree upright and carries water and food, just like the balsam's stem."
   - Feedback on the seedling's root: "Even a tiny seedling has roots. They hold it in the soil and take in water."
2. **Use a hand lens.** Move the hand lens over the seedling's root, either by dragging it or with **◀ / ▶** buttons. Inside the lens, tiny root hairs appear.
   - Caption: "A hand lens makes small parts look bigger, so you can see their details."
   - Values line: "Observe gently. When you've finished, put the seedling back in the soil and water it."

---

## 5. Misconception tags (all new)

| Id | Label | Fix |
|---|---|---|
| PLP-01 | Thinks a plant takes in food from the soil, or that a part other than the leaves makes food | The leaves make the plant's food. The roots take in water and mineral salts from the soil, and mineral salts are not food. |
| PLP-02 | Thinks a part other than the roots takes in water from the soil | The roots take in water and mineral salts from the soil. The stem only carries the water up, and the leaves don't take it in. |
| PLP-03 | Mixes up which part holds the plant in the ground and which holds it upright, or why | The roots hold the plant firmly in the ground. The stem holds the plant upright and supports its leaves, so they get as much sunlight as possible. |
| PLP-04 | Thinks the stem carries only water, or carries things only one way | The stem carries water and mineral salts up from the roots, and food from the leaves to all the other parts, including down to the roots. |
| PLP-05 | Thinks damage to one part affects only that part | The parts work together. Without roots, no water reaches the leaves. Without leaves, no food is made for the rest of the plant. Parts above a broken stem get no water. |
| PLP-06 | Doesn't recognise a leaf, stem or root when it looks different | Look at where the part is and what it does. A tree's trunk is its stem. A tiny seedling already has leaves, a stem and roots. |
| PLP-07 | Picks the wrong apparatus to observe or measure plant parts | A hand lens makes small parts look bigger. A ruler measures length. A measuring cylinder measures volume, a balance measures mass and a thermometer measures temperature. |

**Reused tags:** none.

**Count after this unit** (each tag needs 3+ questions, 2+ hidden):

| Tag | Questions | Hidden |
|---|---|---|
| PLP-01 | 13 | 8 |
| PLP-02 | 10 | 7 |
| PLP-03 | 7 | 4 |
| PLP-04 | 4 | 3 |
| PLP-05 | 5 | 3 |
| PLP-06 | 3 | 2 |
| PLP-07 | 3 | 2 |

---

## 6. Question bank

Options are numbered (1)–(4). Options render in the order written, so the correct answers are spread across positions (1)–(4). For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · Which part takes in water?** (C1; figure: a plant with A on the leaves, B on the stem and C on the roots)
The diagram shows a plant. Which part takes in water from the soil?
1. **A** [PLP-02]
   - P: Rain falls on the leaves, so they seem to drink it.
   - W: The leaves don't take in water from the soil. The roots do, and the stem carries it up to the leaves.
2. **B** [PLP-02]
   - P: The stem carries water, so it seems to take it in too.
   - W: The stem carries water up, but the roots take it in from the soil.
3. **C ✓**
   - P: Which part is in the soil?
   - W: The roots take in water and mineral salts from the soil.
4. **A, B and C** [PLP-02]
   - P: Every part needs water, so every part seems to take it in.
   - W: Every part needs water, but only the roots take it in from the soil. The stem carries it to the rest.

**U2 · What leaves do** (C1)
Which statement about the leaves of a plant is correct?
1. **They take in food from the air.** [PLP-01]
   - P: The leaves are in the air, and the plant must get food from somewhere.
   - W: Leaves don't take in food. They make the plant's food.
2. **They make food for the plant. ✓**
   - P: Recall each part's job.
   - W: The leaves make food for the whole plant, using sunlight.
3. **They take in water and mineral salts for the plant.** [PLP-02]
   - P: The leaves need water, so they seem to collect it.
   - W: The roots take in water and mineral salts from the soil.
4. **They store the food that the roots take in from the soil.** [PLP-01]
   - P: Plants seem to "eat" through their roots.
   - W: The roots take in water and mineral salts, not food. Food is made in the leaves.

**U3 · A windy day** (C1)
During a storm, strong winds blew against a tall plant, but it was not pulled out of the ground. Which part kept it in the ground, and how?
1. **The stem, because it holds the plant upright.** [PLP-03]
   - P: The stem is what keeps the plant standing.
   - W: The stem holds the plant upright, but the roots hold it firmly in the ground.
2. **The stem, because it is the thickest part.** [PLP-03]
   - P: A thick stem looks strong.
   - W: Being thick doesn't hold a plant in the ground. The roots do that.
3. **The roots, because they take in water.** [PLP-03]
   - P: The roots are the right part, and taking in water is one of their jobs.
   - W: The roots do take in water, but that is not what holds the plant in. They hold it firmly in the ground.
4. **The roots, because they hold the plant firmly in the ground. ✓**
   - P: Which part is in the ground, and which of its jobs fits?
   - W: The roots spread through the soil and hold the plant firmly in the ground.

**U4 · What the stem carries** (C1)
Which statement about the stem is correct?
1. **It carries water and mineral salts up from the roots, and food from the leaves to the other parts. ✓**
   - P: Think of both journeys: water from the roots, and food from the leaves.
   - W: The stem carries both: water and mineral salts up, and food to every other part.
2. **It carries water up from the roots, but no food.** [PLP-04]
   - P: Water moving up the stem is the job most people remember.
   - W: The stem carries food too, from the leaves to all the other parts.
3. **It carries food down from the leaves, but no water.** [PLP-04]
   - P: Food has to reach the roots somehow.
   - W: The stem carries water up as well.
4. **It carries food up from the roots to the leaves.** [PLP-01]
   - P: The roots seem to collect food from the soil.
   - W: The roots don't take in food. Food is made in the leaves and carried from there.

**U5 · No leaves** (C1)
Siti removed all the leaves from a potted plant and kept watering it. After some weeks, the plant died. Why?
1. **No food could be made for the plant. ✓**
   - P: Which part makes food? What happens to the rest of the plant without it?
   - W: Only the leaves make food. With none, the stem and roots got no food, so the plant died.
2. **The roots could no longer take in food from the soil.** [PLP-01]
   - P: Plants seem to feed through their roots.
   - W: The roots never take in food. The food was made in the leaves, which were gone.
3. **The stem could no longer hold the plant upright.** [PLP-03]
   - P: Without its leaves, the plant looks weak.
   - W: The stem still held the plant up. The problem was that no food was made.
4. **Removing the leaves harmed only the leaves, so something else killed the plant.** [PLP-05]
   - P: The stem and roots were not touched.
   - W: The parts work together. Without leaves, no food reached the stem and roots.

**U6 · A cut stem** (C1; figure: a potted plant cut through the stem halfway up, with the top part lying on the soil)
Ravi cut through the stem of a plant halfway up and left the top part lying on the soil. What happened to the leaves on the top part a day later?
1. **They stayed fresh, because they could still make food.** [PLP-05]
   - P: The leaves themselves weren't cut.
   - W: The leaves need water from the roots. With the stem cut, none can reach them.
2. **They wilted, because no water could reach them from the roots. ✓**
   - P: Follow the water: roots, then stem, then leaves. Where is it stopped?
   - W: The cut stops the stem from carrying water up, so the leaves wilt.
3. **They wilted, because they could no longer take in food from the soil.** [PLP-01]
   - P: The top part is no longer joined to the roots, which seem to give the plant food.
   - W: The roots don't take in food from the soil. The leaves wilted because they got no water.
4. **They stayed fresh, because they could take in water from the soil they were lying on.** [PLP-02]
   - P: The leaves are touching damp soil.
   - W: Leaves don't take in water from the soil. Only roots do.

**U7 · Match the jobs** (C1; figure: a table)
The table lists three jobs. P: holds the plant upright · Q: holds the plant firmly in the ground · R: makes food. Which parts carry them out?
1. **P root, Q stem, R leaf** [PLP-03]
   - P: Both jobs are about holding, so they are easy to swap.
   - W: The stem holds the plant up, and the roots hold it in the ground.
2. **P stem, Q root, R leaf ✓**
   - P: Take one job at a time, and ask which part does it.
   - W: The stem holds the plant up, the roots hold it in the ground, and the leaves make food.
3. **P stem, Q root, R root** [PLP-01]
   - P: The roots seem to get food from the soil.
   - W: The leaves make the food.
4. **P root, Q root, R leaf** [PLP-03]
   - P: The roots seem to do all the holding.
   - W: The roots hold the plant in the ground, but the stem holds it upright.

**U8 · A young tree** (P1, C1; figure: a young tree with A on the leaves, B on the trunk and C on the roots)
Ali observed a young tree in the school garden and drew it. Which labelled part is the tree's stem?
1. **None: trees have a trunk, not a stem.** [PLP-06]
   - P: The trunk is hard and brown, not like a green stem.
   - W: A trunk is a stem. It holds the tree upright and carries water and food.
2. **C, because the stem is the part in the ground.** [PLP-06]
   - P: The roots are thick and woody too.
   - W: The part in the ground is the roots, which hold the tree firmly in the ground.
3. **B and C, because both are hard and brown.** [PLP-06]
   - P: They look alike, so they seem to be the same part.
   - W: Only B is the stem. C is in the ground: it is the roots.
4. **B ✓**
   - P: Which part holds the tree upright and joins the roots to the leaves?
   - W: B, the trunk, is the tree's stem.

**U9 · Observing a seedling's roots** (P1)
Mei wants to see the small details on the roots of a seedling more clearly. Which should she use?
1. **A ruler** [PLP-07]
   - P: A ruler is used for looking at sizes.
   - W: A ruler measures length. It doesn't make details look bigger.
2. **A measuring cylinder** [PLP-07]
   - P: It is often used in plant experiments with water.
   - W: A measuring cylinder measures the volume of a liquid.
3. **A hand lens ✓**
   - P: Which apparatus makes small things look bigger?
   - W: A hand lens makes the roots look bigger, so she can see their details.
4. **A thermometer** [PLP-07]
   - P: Any science apparatus seems to help you observe.
   - W: A thermometer measures temperature.

### Hidden recap variants (served only by the hub's recap)

**R1 · Mineral salts** [PLP-02, PLP-01]
Which part of a plant takes in mineral salts from the soil?
1. **The roots ✓**
   - P: Which part is in the soil?
   - W: The roots take in mineral salts, together with water, from the soil.
2. **The leaves** [PLP-02]
   - P: The leaves need mineral salts, so they seem to collect them.
   - W: The leaves aren't in the soil. The roots take in mineral salts.
3. **The stem** [PLP-02]
   - P: The stem carries mineral salts.
   - W: The stem carries them, but the roots take them in.
4. **No part: mineral salts are a kind of food made in the leaves.** [PLP-01]
   - P: Mineral salts sound like something a plant "eats".
   - W: Mineral salts are not food. They come from the soil, through the roots.

**R2 · Mineral salts in the soil** [PLP-01, PLP-02]
Mr Tan mixes mineral salts into the soil around his plant. Which statement is correct?
1. **The leaves take in the mineral salts from the soil.** [PLP-02]
   - P: The leaves are the part that seems to need them.
   - W: The leaves aren't in the soil. The roots take in mineral salts.
2. **The mineral salts are food, so the leaves can stop making food.** [PLP-01]
   - P: Adding something to the soil seems to feed the plant.
   - W: Mineral salts are not food. The leaves still make all the plant's food.
3. **The roots take in the mineral salts with water. ✓**
   - P: Which part takes things in from the soil?
   - W: The roots take in water and mineral salts. The stem then carries them to the other parts.
4. **The stem takes in the mineral salts and keeps them.** [PLP-02]
   - P: The bottom of the stem touches the soil.
   - W: The roots take them in, and the stem carries them on.

**R3 · Where a plant's food comes from** [PLP-01]
Where does a plant get its food?
1. **It takes in food from the soil through its roots.** [PLP-01]
   - P: The soil seems to feed the plant.
   - W: The roots take in water and mineral salts, not food.
2. **It makes its own food in its leaves. ✓**
   - P: Which part makes food?
   - W: The leaves make food for the whole plant.
3. **Its stem makes food and sends it to the leaves.** [PLP-01]
   - P: The stem carries food, so it seems to make it too.
   - W: The stem carries food from the leaves. It doesn't make it.
4. **Its roots make food underground.** [PLP-01]
   - P: The roots are busy underground, so they seem to make food there.
   - W: Only the leaves make food. The stem carries some down to the roots.

**R4 · The water's journey** [PLP-02]
How does water get from the soil to the leaves?
1. **soil → stem → roots → leaves** [PLP-02]
   - P: The stem is the main path, so water seems to go there first.
   - W: Water enters through the roots, then goes up the stem.
2. **soil → leaves → stem → roots** [PLP-02]
   - P: The leaves need water most, so it seems to go there first.
   - W: Water can only enter through the roots. The stem then carries it up.
3. **soil → stem → leaves** [PLP-02]
   - P: The stem stands in the soil, so it seems to take in the water.
   - W: The roots take in water first.
4. **soil → roots → stem → leaves ✓**
   - P: Which part takes water in, and which part carries it?
   - W: The roots take in the water, and the stem carries it up to the leaves.

**R5 · How the roots get food** [PLP-01, PLP-04]
Food is made only in the leaves. How do the roots get food?
1. **The stem carries food from the leaves down to the roots. ✓**
   - P: Which part carries food, and which way?
   - W: The stem carries food to all the other parts, including down to the roots.
2. **The roots take in their own food from the soil.** [PLP-01]
   - P: The roots are in the soil, which seems to have food.
   - W: The roots take in water and mineral salts, not food.
3. **The roots don't need food; only the leaves use it.** [PLP-04]
   - P: The food seems to stay where it is made.
   - W: Every part is living and needs food. The stem carries food down to the roots.
4. **The stem carries food up from the roots to the leaves.** [PLP-04]
   - P: Things in a plant seem to move only upwards.
   - W: Food goes from the leaves to the other parts, including down to the roots.

**R6 · Not a job of the stem** [PLP-03, PLP-04]
Which of these is **not** a job of the stem?
1. **Holding the plant upright** [PLP-03]
   - P: Holding seems to be the roots' job.
   - W: The stem does hold the plant upright. The roots hold it in the ground.
2. **Carrying food from the leaves to the roots** [PLP-04]
   - P: The stem seems to carry only water.
   - W: The stem carries food too.
3. **Carrying water from the roots to the leaves** [PLP-04]
   - P: Water seems to soak up through the plant by itself.
   - W: The stem carries the water up.
4. **Taking in water from the soil ✓**
   - P: Which job happens in the soil?
   - W: The roots take in water. The stem only carries it.

**R7 · Pulled out of the soil** [PLP-05, PLP-01]
Mei pulled a plant out of the soil and left it on the table. A few hours later, its leaves had wilted. Why?
1. **Its leaves could no longer take in food from the soil.** [PLP-01]
   - P: The plant seems to feed from the soil.
   - W: The leaves make food. They wilted because they got no water.
2. **Its roots could not take in water, so no water reached the leaves. ✓**
   - P: Which part takes in water, and where was it?
   - W: Out of the soil, the roots couldn't take in water, so none reached the leaves.
3. **Only the roots were harmed, so the leaves wilted because the room was hot.** [PLP-05]
   - P: The leaves were not touched.
   - W: The parts work together. The leaves wilted because the roots could no longer send them water.
4. **Its stem could no longer make food for the leaves.** [PLP-01]
   - P: The stem seems to feed the leaves.
   - W: The stem doesn't make food. The leaves wilted from lack of water.

**R8 · Roots cut off** [PLP-03, PLP-05, PLP-02]
Ravi cut off all the roots of a plant and pushed its stem into the soil. The next day, the plant had fallen over and wilted. Which explains both?
1. **Without roots, the stem could no longer hold the plant upright.** [PLP-03]
   - P: The plant fell over, so the job of holding it up seems lost.
   - W: The stem holds the plant up, but the roots hold it firmly in the ground. Without roots, it fell.
2. **Only the roots were cut, so the leaves should be fine; the wind made it fall.** [PLP-05]
   - P: The leaves and stem were not cut.
   - W: The parts work together. Without roots, no water reached the leaves.
3. **Without roots, nothing held the plant firmly in the ground or took in water. ✓**
   - P: The roots have two jobs. Which result goes with each?
   - W: No roots means nothing holds the plant in (so it fell) and no water is taken in (so it wilted).
4. **The stem took in too much water from the soil.** [PLP-02]
   - P: The cut stem was pushed into wet soil.
   - W: The stem doesn't take in water from the soil, and the plant wilted from too little water.

**R9 · Two plants, one without leaves** [PLP-01, PLP-05]
Two plants of the same kind and size are watered the same. All the leaves of plant B are removed. After four weeks, which is most likely?
1. **Plant A has grown more, because its leaves made food for it. ✓**
   - P: Which plant can still make food?
   - W: Only plant A has leaves to make food, so only A can grow well.
2. **Both have grown the same, because both roots took in food from the soil.** [PLP-01]
   - P: The roots of both plants are still in the soil.
   - W: The roots don't take in food. Plant B has no leaves, so it makes no food.
3. **Plant B has grown more, because its stem made food instead.** [PLP-01]
   - P: The stem seems to take over the leaves' job.
   - W: Only the leaves make food. Plant B made none.
4. **Both have grown the same, because removing leaves harms only the leaves.** [PLP-05]
   - P: The stem and roots of plant B were not touched.
   - W: The parts work together. With no leaves, B's stem and roots get no food.

**R10 · A fallen branch** [PLP-02, PLP-01]
A branch broke off a small tree and fell to the ground. A day later, the leaves on that branch had wilted, but the rest of the tree looked fine. Why?
1. **The leaves on the branch could no longer take in water from the air.** [PLP-02]
   - P: Leaves seem to take in water from around them.
   - W: Leaves don't take in water. It came from the roots, through the stem.
2. **Water from the roots could no longer reach the leaves on that branch. ✓**
   - P: Follow the water from the roots. Can it still reach that branch?
   - W: The branch is no longer joined to the stem, so no water reaches its leaves.
3. **The branch could no longer take in food from the soil.** [PLP-01]
   - P: The tree seems to feed from the soil.
   - W: The roots take in water, not food. The leaves wilted because they got no water.
4. **The leaves stopped making food, and the roots took in no food for them.** [PLP-01]
   - P: Wilting seems to mean the plant is hungry.
   - W: The roots never take in food. The leaves wilted because they got no water.

**R11 · Why the leaves are held up** [PLP-01, PLP-02, PLP-03]
Why does the stem hold the leaves up high?
1. **So the leaves can take in food from the air** [PLP-01]
   - P: The leaves seem to "eat" from the air around them.
   - W: The leaves make food. They don't take it in.
2. **So the leaves can catch rain to take in water** [PLP-02]
   - P: Rain lands on high leaves first.
   - W: The roots take in water from the soil.
3. **So the roots can hold the plant firmly in the ground** [PLP-03]
   - P: Holding the plant up and holding it in seem linked.
   - W: That is a separate job, done by the roots.
4. **So the leaves get as much sunlight as possible to make food ✓**
   - P: What do the leaves need to make food?
   - W: The leaves need sunlight to make food, so the stem holds them up towards it.

**R12 · Match the jobs again** [PLP-02, PLP-04]
(Figure: a table.) The table lists three jobs. P: takes in water from the soil · Q: carries water to the leaves · R: makes food. Which parts carry them out?
1. **P leaf, Q stem, R root** [PLP-02]
   - P: Mixed up the top and the bottom of the plant.
   - W: The roots take in water, and the leaves make food.
2. **P stem, Q stem, R leaf** [PLP-02]
   - P: The stem carries water, so it seems to take it in too.
   - W: The roots take in the water. The stem carries it.
3. **P root, Q stem, R leaf ✓**
   - P: Take one job at a time.
   - W: The roots take in water, the stem carries it to the leaves, and the leaves make food.
4. **P root, Q root, R leaf** [PLP-04]
   - P: The roots take the water in, so they seem to carry it all the way.
   - W: The stem carries the water up to the leaves.

**R13 · A seedling** [PLP-06]
Which statement about a young balsam plant (a seedling) is correct?
1. **It has leaves, a stem and roots, like the adult plant. ✓**
   - P: Observe it closely. Which parts can you find?
   - W: Even a seedling has all three parts. They are just small.
2. **It has leaves and a stem, but its roots grow later.** [PLP-06]
   - P: The roots are hidden, so they seem to come later.
   - W: Even a seedling has roots that hold it in the soil and take in water.
3. **It has no stem yet, because a stem must be hard and brown.** [PLP-06]
   - P: Tree trunks are hard and brown.
   - W: A seedling's stem is short, soft and green, but it is still a stem.
4. **It has no leaves yet; only adult plants have leaves.** [PLP-06]
   - P: Leaves seem to come later, like flowers do.
   - W: A seedling has small leaves that make food for it.

**R14 · The tree's stem** [PLP-06, PLP-03]
Which part of a tree does the same jobs as the stem of a balsam plant?
1. **Its roots** [PLP-03]
   - P: Tree roots are big and woody, and they hold the tree.
   - W: The roots hold the tree in the ground. The trunk holds it upright and carries water and food.
2. **Its trunk ✓**
   - P: Which part holds the tree upright and joins the roots to the leaves?
   - W: The trunk is the tree's stem.
3. **None: a tree has a trunk instead of a stem.** [PLP-06]
   - P: "Trunk" and "stem" are different words.
   - W: The trunk is the tree's stem. It does the same jobs.
4. **Its leaves, because they are green like the balsam's stem** [PLP-06]
   - P: A balsam's stem is green, like leaves.
   - W: Colour doesn't decide the part. The trunk does the stem's jobs.

**R15 · Measuring a leaf** [PLP-07]
Ali wants to find out how long a leaf is. Which should he use?
1. **A hand lens** [PLP-07]
   - P: It is the apparatus for observing plant parts.
   - W: A hand lens makes things look bigger, but it doesn't measure length.
2. **A measuring cylinder** [PLP-07]
   - P: "Measuring" sounds right.
   - W: A measuring cylinder measures the volume of a liquid.
3. **An electronic balance** [PLP-07]
   - P: A balance gives a number for anything.
   - W: A balance measures mass, not length.
4. **A ruler ✓**
   - P: Length is measured with which apparatus?
   - W: A ruler measures length.

**R16 · Why a hand lens** [PLP-07]
Why does Mei use a hand lens to observe a leaf?
1. **It measures how long the leaf is.** [PLP-07]
   - P: Apparatus often measures something.
   - W: A ruler measures length. A hand lens makes things look bigger.
2. **It shows how hot the leaf is.** [PLP-07]
   - P: Some apparatus shows temperature.
   - W: A thermometer measures temperature.
3. **It makes the leaf look bigger, so she can see small details. ✓**
   - P: What does a hand lens do?
   - W: A hand lens makes small parts look bigger.
4. **It measures how much water is in the leaf.** [PLP-07]
   - P: Leaves contain water.
   - W: A hand lens measures nothing. It only makes things look bigger.

---

## 7. Build notes

- **Files:** `src/pages/03-systems/P4-plant-parts/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`.
- **Page-specific code** (all SVG):
  - E1: tap-to-reveal plant diagram.
  - E2: step-through with water drops and food squares.
  - E3: two-plant damage scenes.
  - E4: three-plant tap-and-name, and a hand lens with drag plus ◀ / ▶ buttons.
- **Figures for standalone questions:** they use only theme classes and inline `var()` styles, because they also render in the hub.
  - U1: a plant labelled A–C
  - U6: a cut stem
  - U8: a young tree labelled A–C
  - U7 and R12: tables
- **Classes:** page classes are prefixed `p-`, so they can't clash with engine class names.
- **Registry:** add PLP-01 to PLP-07 (§5).
- **Check after build:**
  - the linter shows no errors and no excluded terms outside B1
  - the 44px tap-target audit passes, including the E4 tap zones
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
