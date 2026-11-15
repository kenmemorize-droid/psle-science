# Unit spec · P3 Living things

Status: **approved and built** · 2026-11-12. The §0 defaults were used:
- the syllabus's four characteristics, with "moves" in B1
- animal groups tested on observable features only
- fern and moss as the non-flowering examples, **still to be confirmed against book p. 28**
- fungi and bacteria: what they are is tested; useful/harmful is shown as tiles and not tested
- `allowTerms: ["vein", "veins"]` for leaf patterns

Built as drafted. The build notes said six sort widgets; there are five, because E4's useful/harmful part is tap-to-reveal tiles, as §4 describes.

Builds: `src/pages/01-diversity/P3-living-things/` → `01-diversity/P3-living-things.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

The topic has two core ideas and two practices:
- **C1:** the characteristics of living things.
- **C2:** the broad groups of living things: plants, animals, fungi and bacteria.
- **P1:** observe living and non-living things and infer differences.
- **P2:** classify plants and animals by common observable characteristics.

There are no focus pages yet, only the legacy sketchnotes (book pp. 2–6). Review once: approve, or mark changes inline. **§0 lists the decisions I need from you.**

---

## 0. Decisions I need from you

1. **"Can move by themselves."** The book (p. 2) gives five characteristics, including "can move by themselves". The 2023 syllabus lists only four:
   - need water, food and air
   - grow
   - respond
   - reproduce

   **Default:** the unit teaches the syllabus's four. "Moving" goes in a Beyond-syllabus note (B1), which explains that plants are living but don't move from place to place. Questions test the idea that **moving, or getting bigger, does not by itself make something living** (tag LIV-01).
2. **How deep to go on the animal groups.** The book (p. 3) gives each group's body covering, how it breathes, whether it lays eggs or gives birth, milk, and exceptions such as the platypus, spiny anteater, guppies, mollies, swordtails, silverfish and termites. The syllabus says to classify "based on … common **observable** characteristics", and that recall of specific living things and their characteristics (its examples: the guppy, "give birth to young alive") is not required.
   - **Default:** the observable features are taught and tested. These are body covering (hair or fur, feathers, scales, moist skin, a hard covering), legs, wings, fins, beaks and the three body parts of an insect.
   - The book's other group facts (lungs, gills, spiracles, eggs or live birth, milk) appear on the group cards under "Your book also says", and are not tested.
   - The book's exceptions and specific names go in a Beyond toggle (B2) and are never tested.
3. **Examples of non-flowering plants.** The book's p. 28 list (fern, algae, moss) is one of the sketchnote's "check against the book" items.
   - **Default:** the unit uses **fern and moss**. Three questions rely on them (U10, R15, R16).
   - Algae is left out, because algae are not usually counted as plants now.
   - **Please confirm the book's examples.**
4. **Fungi and bacteria.** The book (pp. 5–6) covers:
   - what fungi and bacteria are
   - how they feed, and where fungi grow
   - decomposition
   - many useful and harmful examples, with named species

   **Default:**
   - **Taught and tested:** fungi (mould, mushroom, yeast) are not plants: they are not green and cannot make their own food. Bacteria are living things too small to see without a microscope, found everywhere.
   - **Taught, not tested:** fungi grow from spores (P5 Reproduction covers spores), they grow best in damp, warm, dark places, and the useful and harmful examples by kind ("yeast helps bread rise", "mould spoils food").
   - **Beyond only (B3), never tested:** decomposition (a P6 Environment idea), and named species (*Lactobacillus*, *Salmonella*, *E. coli*, penicillin, fly agaric), because names of specific living things are not required.
5. **Leaf patterns and the word "vein".** The book (p. 4) groups leaves by "network" or "parallel" vein patterns. "Vein" is on the linter's excluded-terms list, for blood vessels (P5).
   - **Default:** the page sets `allowTerms: ["vein", "veins"]`, so leaf patterns can be shown in the main flow, as SPEC §12 permits. The linter keeps the word out of every question, so leaf patterns are not tested.

Nothing else on pp. 2–6 is marked "check against the book". The p. 11 larva names belong to Life cycles, not this unit.

**Added, not in the book** (so you can check them):
- the seed-and-pebble test in E1
- the living / non-living sort cards (toy robot dog, balloon, clock)
- the classification-chart puzzles in E3
- every question item

---

## 1. Learning outcomes and where each is covered

| LO | Wording | Cards | Interactives | Unit check |
|---|---|---|---|---|
| P3.LIV.C1 | Describe the characteristics of living things: need water, food and air to survive; grow, respond and reproduce. | V1 | E1 | U1–U4 |
| P3.LIV.C2 | Recognise some broad groups of living things based on similarities and differences: plants (flowering, non-flowering); animals (amphibians, birds, fish, insects, mammals, reptiles); fungi (mould, mushroom, yeast); bacteria. *(Note: recall of names of specific living things and their characteristics is not required.)* | V2–V4 | E2, E3, E4 | U5–U10 |
| P3.LIV.P1 | Observe a variety of living and non-living things and infer differences between them. | V1 | E1 | U2, U4 |
| P3.LIV.P2 | Classify living things into broad groups (in plants and animals) based on similarities and differences of common observable characteristics. | V2, V3 | E2, E3 | U5, U7, U10 |

Values outcomes (curiosity, and care for living things) appear as a line in E1, and aren't tested.

---

## 2. Page outline

1. **Header**: all four LOs.
2. **What you need to know**: cards V1–V4 (§3).
3. **Explore**: E1–E4 (§4).
4. **Unit check**: U1–U10, with 18 hidden recap variants (R1–R18).
5. **Go deeper**: no focus pages yet.
6. **Beyond syllabus** (closed toggles):
   - B1, under E1: moving
   - B2, under E2: animal exceptions and named examples
   - B3, under E4: decomposition and named microbes
7. **Footer**: next unit within Diversity is *Materials*, then the hub.

---

## 3. Summary cards (exact text)

### V1 · What makes something alive (the syllabus; examples from the book)
> Every living thing:
> - **needs water, food and air** to survive
> - **grows**: a chick grows into a hen, and a seed grows into a plant
> - **responds** to changes around it: a snail pulls into its shell when touched, and a plant bends towards the light
> - **reproduces**: it makes young of its own kind
>
> A living thing does **all** of these. Something that only moves, or only gets bigger, is not living: a car moves, and a balloon gets bigger when you blow into it.
>
> Plants are living things. They need water, air and food (they make their own), grow, respond and reproduce, even though they don't walk about.

### V2 · Six groups of animals (the book; observable features)
> Group animals by what you can **see** on their bodies, not by where they live or whether they can fly.
>
> | Group | What you can see |
> |---|---|
> | **Mammals** | bodies covered with **hair or fur** |
> | **Birds** | **feathers**, a **beak**, **two wings** and two legs |
> | **Fish** | **scales** and **fins**; they live in water |
> | **Amphibians** | **moist, smooth skin** with no scales |
> | **Reptiles** | **dry, scaly skin** |
> | **Insects** | a hard body covering, **3 body parts** (head, thorax, abdomen) and **6 legs**; most have wings |
>
> A bat flies but has fur, so it is a mammal. A penguin can't fly but has feathers and a beak, so it is a bird. A spider has 8 legs and 2 body parts, so it is **not** an insect.
>
> *Your book also says* (not tested):
> - mammals breathe with lungs and feed their young milk
> - fish breathe with gills
> - young amphibians breathe with gills, and adults with lungs or moist skin
> - reptiles lay eggs with leathery shells
> - insects breathe through tiny holes called spiracles
> - birds lay eggs

### V3 · Plants with and without flowers (the book; examples to confirm, decision 3)
> - **Flowering plants** make flowers, and then seeds. Examples: hibiscus, sunflower, balsam, mango tree.
> - **Non-flowering plants** never make flowers. Examples: fern, moss.
>
> We can also group plants by other things we can see:
> - land or water plants
> - strong or weak stems
> - roots under or above the ground
> - leaf shape, leaf edge, and the pattern of veins on the leaf (network or parallel)
> - flowers that grow singly or in clusters
> - fruits with one, a few or many seeds

### V4 · Fungi and bacteria (the book)
> - **Fungi** include **mould**, **mushrooms** and **yeast**. They are **not plants**: they are not green and **cannot make their own food**. They feed on other things, living or dead. They grow from tiny spores, and grow best in damp, warm, dark places.
> - **Bacteria** are living things so tiny that they can be seen only through a **microscope**. They are found **everywhere**.
> - Some fungi and bacteria are **useful**: yeast helps bread rise, mushrooms are food, and some bacteria help make yoghurt and cheese. Others are **harmful**: mould spoils food, and some bacteria cause illness.

---

## 4. Interactives

### E1 · Alive or not? (C1, P1; exercises LIV-01, LIV-02, LIV-03)
1. **Seed and pebble.** A bean seed and a pebble sit on wet cotton wool. Step through Day 0, Day 2, Day 5 and Day 8.
   - The seed swells, sends out a root, then a shoot, then leaves. The pebble doesn't change.
   - Each step names what you can observe.
   - Caption at Day 8: "The seed grew, so it is living. The pebble did not change: it is not living."
2. **Living or not living?** Uses the shared sort widget, with two bins.
   - **Living (7):** a cat · a rose bush · a bean seed · a mushroom · mould on bread · yeast · bacteria
   - **Non-living (6):** a pebble · a toy car that moves · a toy robot dog that barks · a balloon being blown up · a ticking clock · a wooden chair

   **Reasons**, for example:
   - Toy robot dog: "It moves and makes sounds, but it doesn't grow, reproduce or need food, water and air."
   - Wooden chair: "The wood came from a tree, but the chair is not living now."
3. **Which characteristic?** Uses the shared sort widget, with four bins: *Needs water, food and air · Grows · Responds · Reproduces*.
   - **Cards (8):** a chick becomes a hen · a seedling gets taller · a snail pulls into its shell when touched · a plant bends towards a window · a cat has kittens · a plant makes seeds · a hamster must be given food and water · a goldfish dies if its water has no air in it
   - The last card is my wording, to avoid naming the gas, which is P5.

   **Values line:** "Handle living things gently, and put them back where you found them."

**B1 · Beyond syllabus (closed toggle):** "Your book also says living things can move by themselves. The syllabus doesn't list this, because plants are living but do not move from place to place."

### E2 · Six groups of animals (C2, P2; exercises LIV-04, LIV-05)
1. **Six tiles**, one per group. Each tile shows a simple drawing of the group's features and its card text (V2), with "Your book also says" in small print.
2. **Which group?** Uses the shared sort widget, with six bins. Each card describes what you can see, with a common name in brackets.
   - **Mammals:** a flying animal with fur on its body (a bat) · an animal with fur that lives in a burrow (a rabbit)
   - **Birds:** a swimming animal with feathers, a beak and two wings that cannot fly (a penguin) · an animal with feathers and a hooked beak (an eagle)
   - **Fish:** a sea animal with scales and fins (a shark)
   - **Amphibians:** an animal with moist, smooth skin that lives near ponds (a frog)
   - **Reptiles:** a sea animal with flippers and dry, scaly skin that lays eggs on the beach (a sea turtle) · a long animal with no legs and dry, scaly skin (a snake)
   - **Insects:** an animal with 6 legs, 3 body parts and no wings (an ant) · an animal with 6 legs, 3 body parts and 2 pairs of wings (a butterfly)
   - One more card goes in no group: an animal with 8 legs and 2 body parts (a spider). The sort shows a seventh bin, *None of these six*, for it.
3. **Caption:** "Look at body features. Where an animal lives, and whether it flies or swims, can fool you."

**B2 · Beyond syllabus (closed toggle):** the book's exceptions. These are not required by the syllabus and never tested:
- the duck-billed platypus and spiny anteater are mammals that lay eggs
- guppies, mollies and swordtails are fish that give birth to live young
- silverfish and termites are insects without wings

### E3 · Plants and classification charts (C2, P2; exercises LIV-08, LIV-09)
1. **With or without flowers?** Uses the shared sort widget.
   - **Flowering:** hibiscus, sunflower, balsam, mango tree, rose
   - **Non-flowering:** fern, moss
   - Reason for fern: "A fern has leaves, a stem and roots, but it never makes flowers."
2. **Build a classification chart.** Eight plant cards, each with a simple drawing and its features (flowers or not; land or water; strong or weak stem; roots under or above the ground). Each puzzle shows a target split, for example "Group A: fern, moss · Group B: the rest".
   - The student chooses the question that makes that split, from *Does it have flowers? · Does it grow in water? · Does it have a strong stem? · Are some of its roots above the ground?*
   - The cards then slide into Yes and No columns, with ✓ or ✗ and a reason.
   - There are three puzzles, one for each of flowers, water and stem.
   - The plants are named only by kind, such as "a water lily (floats on water)".

### E4 · Fungi and bacteria (C2; exercises LIV-06, LIV-07)
1. **A mushroom**, redrawn from the book, with its cap, gills, spores and stalk labelled. Tapping a part shows a line about it.
2. **Mould on bread:** a slice over Day 1, Day 4 and Day 7, with fuzzy patches spreading. Caption: "Mould is a fungus. It grows on food, especially in damp, warm places."
3. **Bacteria:** a drop of water, then **Look through a microscope**, which shows tiny rod and ball shapes. Caption: "Bacteria are living things too small to see with your eyes alone."
4. **Plant, animal, fungus or bacteria?** Uses the shared sort widget.
   - **Cards:** mushroom · mould · yeast · bacteria in yoghurt · fern · moss · frog · butterfly
   - Reason for mushroom: "A fungus, not a plant: it is not green and cannot make its own food."
5. **Useful or harmful?** Tap-to-reveal tiles using V4's kinds of examples. Not tested.

**B3 · Beyond syllabus (closed toggle):** from the book, never tested:
- Fungi and bacteria break down dead things into simpler substances (decomposition), returning nutrients to the soil.
- Named examples: *Lactobacillus* (yoghurt), penicillin (a medicine made from a fungus), *Salmonella* and *E. coli* (cause illness), and fly agaric (a poisonous mushroom).

---

## 5. Misconception tags (all new)

| Id | Label | Fix |
|---|---|---|
| LIV-01 | Thinks something is living because it moves, makes sounds or gets bigger | A living thing needs water, food and air, grows, responds and reproduces: all of these. A car moves and a balloon gets bigger, but neither is living. |
| LIV-02 | Thinks plants or seeds are not living, or that plants don't need air or food | Plants are living. They need water, air and food (they make their own), grow, respond and reproduce. A seed is living: it grows when it gets water. |
| LIV-03 | Mixes up which characteristic of living things an example shows | Getting bigger: grows. Reacting to a change (touch, light): responds. Making young: reproduces. Dying without water, food or air: needs them to survive. |
| LIV-04 | Groups an animal by where it lives or how it moves, not by its body features | Look at body features. A bat flies but has fur: a mammal. A penguin can't fly but has feathers: a bird. A sea turtle lives in the sea but has dry, scaly skin: a reptile. |
| LIV-05 | Mixes up the body features of the animal groups | Fur or hair: mammal. Feathers and a beak: bird. Scales and fins: fish. Moist, smooth skin: amphibian. Dry, scaly skin: reptile. 6 legs and 3 body parts: insect (a spider, with 8 legs, is not one). |
| LIV-06 | Thinks fungi are plants | Fungi (mould, mushrooms, yeast) are not plants: they are not green and cannot make their own food. |
| LIV-07 | Thinks bacteria can be seen with the eyes alone, or are not living | Bacteria are living things too small to see without a microscope. They are found everywhere, even where we can't see them. |
| LIV-08 | Thinks every plant has flowers, or that a plant without flowers is not a plant | Non-flowering plants, such as ferns and mosses, never make flowers, but they are still plants. |
| LIV-09 | Groups living things by a feature the chart or table does not use | Read the chart's question, or the table's headings, and use only that feature. Size, colour and favourite places don't count unless the chart asks about them. |

**Count after this unit** (each tag needs 3+ questions, 2+ hidden):

| Tag | Questions | Hidden |
|---|---|---|
| LIV-01 | 9 | 4 |
| LIV-02 | 4 | 2 |
| LIV-03 | 5 | 4 |
| LIV-04 | 4 | 3 |
| LIV-05 | 8 | 5 |
| LIV-06 | 4 | 3 |
| LIV-07 | 3 | 2 |
| LIV-08 | 3 | 2 |
| LIV-09 | 3 | 2 |

---

## 6. Question bank

Options are numbered (1)–(4) and render in the order written, so the correct answers are spread across positions; the linter checks this. For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · What every living thing does** (C1)
Which of these is true of every living thing?
1. **It moves from place to place.** [LIV-01]
   - P: Animals move about, so living things seem to move.
   - W: Plants are living but stay in one place.
2. **It makes sounds.** [LIV-01]
   - P: Many animals make sounds.
   - W: Plants and fish are living but make no sounds we can hear.
3. **It grows.** ✓
   - P: Which one is true of plants and animals alike?
   - W: Every living thing grows: a chick into a hen, a seed into a plant.
4. **It has legs.** [LIV-01]
   - P: Most animals we know have legs.
   - W: Snakes, fish and plants have no legs, but they are living.

**U2 · A seed and a pebble** (C1, P1; figure: a table)
Ali put a bean seed and a pebble on wet cotton wool. Day 0: both unchanged · Day 5: the seed has a root and a shoot; the pebble is the same. What does this show?
1. **Seeds are not living until they are planted in soil.** [LIV-02]
   - P: A seed looks hard and still, like a pebble.
   - W: The seed grew on cotton wool, without soil. It is living.
2. **The pebble is living, because it sat in water too.** [LIV-01]
   - P: It had the same water as the seed.
   - W: The pebble did not grow or change. It is not living.
3. **The seed is living, because it grew when it had water.** ✓
   - P: Which one showed a characteristic of living things?
   - W: The seed grew a root and a shoot. Growing shows it is living.
4. **Both are not living, because neither moved.** [LIV-01]
   - P: Living things seem to move.
   - W: Moving is not what tells us. The seed grew, so it is living.

**U3 · A plant at the window** (C1)
A potted plant on a windowsill slowly bends towards the light. Which characteristic of living things does this show?
1. **It responds to changes around it.** ✓
   - P: Is the plant getting bigger, or reacting to something?
   - W: The plant reacts to where the light is coming from: it responds.
2. **It grows.** [LIV-03]
   - P: Bending seems to be a kind of growing.
   - W: The bending is a reaction to light. That is responding.
3. **It reproduces.** [LIV-03]
   - P: Something is changing, and reproducing is a change.
   - W: Reproducing means making young. No new plant is made here.
4. **It moves from place to place.** [LIV-01]
   - P: The plant is moving.
   - W: It stays in its pot. It only turns towards the light.

**U4 · A toy robot dog** (C1, P1)
A toy robot dog walks, barks and turns its head when you clap. Which statement is correct?
1. **It is living, because it moves and responds to sound.** [LIV-01]
   - P: It does things that animals do.
   - W: A living thing must also need food, water and air, grow and reproduce. The robot does none of these.
2. **It is living, because it needs batteries the way we need food.** [LIV-01]
   - P: Batteries seem like its food.
   - W: It doesn't grow or reproduce, so it is not living.
3. **Only animals with fur are living, so it is not living.** [LIV-02]
   - P: Real dogs have fur.
   - W: Plants, fish and birds are living without fur. The robot is not living because it doesn't grow or reproduce.
4. **It is not living, because it does not grow, reproduce or need food, water and air.** ✓
   - P: Check every characteristic, not just one.
   - W: Moving and making sounds are not enough. It lacks the other characteristics.

**U5 · A penguin** (C2, P2)
A penguin cannot fly, swims in the sea, and has feathers and a beak. Which group of animals does it belong to?
1. **Fish, because it swims in the sea** [LIV-04]
   - P: It lives in water.
   - W: Fish have scales and fins. A penguin has feathers and a beak.
2. **Birds, because it has feathers and a beak** ✓
   - P: Look at its body, not where it swims.
   - W: Feathers and a beak make it a bird, even though it cannot fly.
3. **Mammals, because it cannot fly** [LIV-04]
   - P: Birds seem to be the animals that fly.
   - W: Not flying doesn't decide the group. Feathers do.
4. **Reptiles, because it lays eggs** [LIV-05]
   - P: Reptiles lay eggs.
   - W: Birds lay eggs too. Feathers and a beak make it a bird.

**U6 · Which one is an insect?** (C2)
Which animal is an insect?
1. **An animal with 6 legs and 3 body parts** ✓
   - P: Count the legs and the body parts.
   - W: 6 legs and 3 body parts (head, thorax, abdomen) make an insect.
2. **An animal with 8 legs and 2 body parts** [LIV-05]
   - P: It is small and has many legs.
   - W: That is a spider. Insects have 6 legs and 3 body parts.
3. **An animal with many legs and a long body made of many parts** [LIV-05]
   - P: It is a small creeping animal.
   - W: Insects have exactly 6 legs and 3 body parts.
4. **An animal with a shell and no legs** [LIV-05]
   - P: It is small, like many insects.
   - W: Insects have 6 legs.

**U7 · Body coverings** (C2, P2; figure: a table)
P: dry, scaly skin · Q: moist, smooth skin · R: feathers · S: fur. Which animal could be a frog?
1. **P** [LIV-05]
   - P: Frogs and lizards look a bit alike.
   - W: Dry, scaly skin belongs to reptiles. A frog's skin is moist and smooth.
2. **R** [LIV-05]
   - P: Picked at random.
   - W: Feathers belong to birds.
3. **S** [LIV-05]
   - P: Many animals are furry.
   - W: Fur belongs to mammals.
4. **Q** ✓
   - P: Which skin do amphibians have?
   - W: Frogs are amphibians, with moist, smooth skin.

**U8 · A mushroom** (C2)
Which statement about a mushroom is correct?
1. **It is a plant, because it grows out of the ground.** [LIV-06]
   - P: It grows where plants grow.
   - W: A mushroom is a fungus. It is not green and cannot make its own food.
2. **It is a fungus. It is not green and cannot make its own food.** ✓
   - P: Is it green? Can it make its own food?
   - W: Mushrooms are fungi, not plants.
3. **It is not living, because it does not move.** [LIV-01]
   - P: It stays in one place, like a stone.
   - W: Mushrooms grow and reproduce, so they are living.
4. **It is a plant, because it has a stalk.** [LIV-06]
   - P: The stalk looks like a stem.
   - W: Having a stalk doesn't make it a plant. It is a fungus.

**U9 · Bacteria** (C2)
Which statement about bacteria is correct?
1. **They can be seen easily on dirty hands.** [LIV-07]
   - P: Dirt on hands seems to be the bacteria.
   - W: Bacteria are too small to see without a microscope.
2. **They are not living, because we cannot see them.** [LIV-07]
   - P: Things we can't see seem not to be alive.
   - W: Bacteria are living things. They are just very tiny.
3. **They are a kind of plant.** [LIV-07]
   - P: They are not animals, so they seem to be plants.
   - W: Bacteria are a group of their own.
4. **They are living things that can be seen only through a microscope.** ✓
   - P: How big are bacteria?
   - W: Bacteria are living, and too small to see with the eyes alone.

**U10 · Group Y** (P2, C2; figure: a table)
Mei sorted some plants into two groups. Group X: hibiscus, sunflower, mango tree · Group Y: fern, moss. Which heading is correct for Group Y?
1. **Water plants** [LIV-09]
   - P: Ferns and mosses like damp places.
   - W: Liking damp places isn't a heading here. Both groups grow on land.
2. **Plants with weak stems** [LIV-09]
   - P: Ferns and mosses are small.
   - W: Size and stem strength aren't what separates the groups. Flowers are.
3. **Non-flowering plants** ✓
   - P: What do hibiscus, sunflowers and mango trees have that ferns and mosses never have?
   - W: Ferns and mosses never make flowers.
4. **Not plants** [LIV-08]
   - P: They have no flowers, so they seem not to be plants.
   - W: Ferns and mosses are plants that don't flower.

### Hidden recap variants (served only by the hub's recap)

**R1 · Which is living?** [LIV-01, LIV-07]
Which of these is a living thing?
1. **A toy car that moves on its own** [LIV-01]
   - P: It moves by itself.
   - W: It doesn't grow, reproduce or need food, water and air.
2. **A balloon that gets bigger** [LIV-01]
   - P: It grows.
   - W: It gets bigger only because air is blown in. It can't grow by itself.
3. **A ticking clock** [LIV-01]
   - P: Its hands move.
   - W: Moving isn't enough. It doesn't grow or reproduce.
4. **Mould growing on bread** ✓
   - P: Which one grows and reproduces on its own?
   - W: Mould is a fungus. It grows and spreads, so it is living.

**R2 · A growing balloon** [LIV-01, LIV-03]
A balloon gets bigger as air is blown into it. Is it growing the way a living thing grows?
1. **Yes, because it gets bigger.** [LIV-01]
   - P: Getting bigger sounds like growing.
   - W: It gets bigger only because air is pushed in. It cannot grow by itself.
2. **No. It gets bigger only when air is pushed in. It cannot grow by itself, or reproduce.** ✓
   - P: Would it get bigger on its own?
   - W: A living thing grows by itself. The balloon doesn't.
3. **Yes, because it needs air.** [LIV-01]
   - P: Living things need air.
   - W: Needing air alone doesn't make something living.
4. **Yes, because it is responding to the air.** [LIV-03]
   - P: It changes when air comes in.
   - W: Responding is a living thing reacting to a change. The balloon is only being filled.

**R3 · Is a plant living?** [LIV-02]
Which shows that a plant is a living thing?
1. **It stays in one place.** [LIV-02]
   - P: That is something plants do.
   - W: A stone stays in one place too.
2. **It is green.** [LIV-02]
   - P: Plants are green.
   - W: A green ball is not living.
3. **It is made of wood.** [LIV-02]
   - P: Trees are wood.
   - W: A wooden chair is not living.
4. **It grows and makes new plants.** ✓
   - P: Which characteristics of living things does a plant show?
   - W: Growing and reproducing show that it is living.

**R4 · Do plants need air?** [LIV-02]
Siti says plants do not need air, only water. Which is correct?
1. **Plants need water, food and air to survive, like all living things.** ✓
   - P: What do all living things need?
   - W: Plants are living, so they need water, food and air. They make their own food.
2. **Plants need only water.** [LIV-02]
   - P: We water plants, but don't feed them.
   - W: Plants also need air, and food, which they make themselves.
3. **Plants need only soil.** [LIV-02]
   - P: Plants grow in soil.
   - W: Plants need water, food and air.
4. **Plants need nothing, because they are not living.** [LIV-02]
   - P: Plants don't move or eat like animals.
   - W: Plants are living things.

**R5 · A chick to a hen** [LIV-03]
A chick hatches, and some weeks later it has become a hen. Which characteristic does this show?
1. **It reproduces.** [LIV-03]
   - P: A hen is a grown-up chick, and hens lay eggs.
   - W: Becoming a hen is getting bigger. That is growing.
2. **It responds.** [LIV-03]
   - P: The chick changes.
   - W: Responding is reacting to something around it.
3. **It grows.** ✓
   - P: What is changing about the chick?
   - W: The chick gets bigger and becomes a hen: it grows.
4. **It needs food.** [LIV-03]
   - P: The chick eats to get bigger.
   - W: It does need food, but the change shown is growing.

**R6 · A snail** [LIV-03, LIV-01]
A snail pulls into its shell when it is touched. Which characteristic does this show?
1. **It grows.** [LIV-03]
   - P: The snail changes shape.
   - W: It doesn't get bigger. It reacts to the touch.
2. **It responds to changes around it.** ✓
   - P: What makes the snail pull in?
   - W: The snail reacts to the touch: it responds.
3. **It reproduces.** [LIV-03]
   - P: Snails make young.
   - W: Pulling in is not making young.
4. **It moves from place to place.** [LIV-01]
   - P: The snail moved.
   - W: It pulled into its shell. That is a reaction to the touch.

**R7 · Kittens** [LIV-03]
A cat has a litter of kittens. Which characteristic does this show?
1. **It grows.** [LIV-03]
   - P: The kittens will grow.
   - W: The cat making kittens is reproducing.
2. **It needs air.** [LIV-03]
   - P: Cats need air.
   - W: True, but it is not what is shown here.
3. **It responds.** [LIV-03]
   - P: The cat looks after its kittens.
   - W: Making young is reproducing.
4. **It reproduces.** ✓
   - P: What does making young show?
   - W: Making young of its own kind is reproducing.

**R8 · A bat** [LIV-04, LIV-05]
A bat flies with wings, and its body is covered with fur. Which group does it belong to?
1. **Birds, because it flies** [LIV-04]
   - P: Flying animals seem to be birds.
   - W: Birds have feathers and beaks. The bat has fur.
2. **Insects, because it has wings** [LIV-04]
   - P: Insects have wings.
   - W: Insects have 6 legs and 3 body parts.
3. **Mammals, because it has fur** ✓
   - P: What covers its body?
   - W: Fur makes it a mammal, even though it flies.
4. **Reptiles** [LIV-05]
   - P: Bats live in dark caves, like some reptiles.
   - W: Reptiles have dry, scaly skin, not fur.

**R9 · A sea turtle** [LIV-04, LIV-05]
A sea turtle lives in the sea and swims with flippers. It has dry, scaly skin and lays its eggs on the beach. Which group does it belong to?
1. **Reptiles** ✓
   - P: What is its skin like?
   - W: Dry, scaly skin makes it a reptile, even though it lives in the sea.
2. **Fish, because it lives in the sea** [LIV-04]
   - P: It lives in water.
   - W: Fish have fins and scales; the turtle has flippers and dry, scaly skin.
3. **Amphibians, because it lives in water and on land** [LIV-04]
   - P: It goes onto the beach.
   - W: Amphibians have moist, smooth skin.
4. **Mammals** [LIV-05]
   - P: It is a big animal.
   - W: Mammals have fur or hair.

**R10 · Birds' covering** [LIV-05]
What covers the body of a bird?
1. **Scales** [LIV-05]
   - P: Birds' legs look scaly.
   - W: A bird's body is covered with feathers.
2. **Fur** [LIV-05]
   - P: Some birds look fluffy.
   - W: The fluff is feathers.
3. **Moist skin** [LIV-05]
   - P: Water birds get wet.
   - W: Moist skin belongs to amphibians.
4. **Feathers** ✓
   - P: What do all birds have?
   - W: Feathers cover a bird's body.

**R11 · A frog and a lizard** [LIV-05]
Which statement is correct?
1. **A frog has moist, smooth skin, and a lizard has dry, scaly skin.** ✓
   - P: Which one lives near water and feels slippery?
   - W: Frogs are amphibians with moist skin; lizards are reptiles with dry, scaly skin.
2. **A frog has dry, scaly skin, and a lizard has moist, smooth skin.** [LIV-05]
   - P: They look alike, so they are easy to swap.
   - W: It is the other way round.
3. **Both have dry, scaly skin.** [LIV-05]
   - P: Both are small, four-legged animals.
   - W: A frog's skin is moist and smooth.
4. **Both have moist, smooth skin.** [LIV-05]
   - P: Both are found in gardens after rain.
   - W: A lizard's skin is dry and scaly.

**R12 · Mould on bread** [LIV-06, LIV-01, LIV-07]
Fuzzy mould grows on an old slice of bread. What is the mould?
1. **A fungus** ✓
   - P: Mould is one of the fungi named in the syllabus.
   - W: Mould is a fungus, a living thing.
2. **A plant** [LIV-06]
   - P: It grows like a tiny plant.
   - W: Mould is not green and cannot make its own food. It is a fungus.
3. **Dust, which is not living** [LIV-01]
   - P: It looks like fluff.
   - W: The mould grows and spreads. It is living.
4. **Bacteria** [LIV-07]
   - P: It makes food go bad.
   - W: We can see mould with our eyes. Bacteria are too small to see.

**R13 · Why a mushroom is not a plant** [LIV-06]
Why is a mushroom not a plant?
1. **It is a plant, because it grows in the ground.** [LIV-06]
   - P: It grows where plants grow.
   - W: Growing in the ground doesn't make it a plant.
2. **It is a plant, because it has a stalk.** [LIV-06]
   - P: The stalk looks like a stem.
   - W: It is a fungus with a stalk, not a plant with a stem.
3. **It is not green and cannot make its own food.** ✓
   - P: What can plants do that a mushroom can't?
   - W: Plants are green and make their own food. Mushrooms can't, so they are fungi.
4. **It is a plant, because it does not move.** [LIV-06]
   - P: Plants don't move.
   - W: Not moving doesn't make it a plant.

**R14 · Clean-looking hands** [LIV-07]
Ravi's hands look clean. Which statement is correct?
1. **There can be no bacteria on them.** [LIV-07]
   - P: Clean-looking means nothing is there.
   - W: Bacteria are too small to see. They may still be there.
2. **Bacteria may still be there. They are too small to see without a microscope.** ✓
   - P: Can you see bacteria with your eyes?
   - W: Bacteria are everywhere, and too small to see without a microscope.
3. **Bacteria live only in dirty water.** [LIV-07]
   - P: Dirty water seems to be where germs live.
   - W: Bacteria are found everywhere.
4. **Bacteria are not living, so it doesn't matter.** [LIV-07]
   - P: Tiny things seem not to be alive.
   - W: Bacteria are living things.

**R15 · A fern** [LIV-08, LIV-06]
Which statement about a fern is correct?
1. **It is not a plant, because it has no flowers.** [LIV-08]
   - P: Plants seem to need flowers.
   - W: Ferns are plants that never make flowers.
2. **It is a flowering plant, because it has leaves.** [LIV-08]
   - P: Most plants with leaves seem to flower.
   - W: Ferns have leaves but never make flowers.
3. **It is a fungus, because it grows in damp places.** [LIV-06]
   - P: Fungi like damp places.
   - W: Ferns are green plants.
4. **It is a non-flowering plant.** ✓
   - P: Does a fern ever make flowers?
   - W: A fern is a plant that never makes flowers.

**R16 · A plant with no flowers** [LIV-08]
Which plant never makes flowers?
1. **Moss** ✓
   - P: Which one is a non-flowering plant?
   - W: Moss never makes flowers.
2. **A sunflower** [LIV-08]
   - P: It has big leaves.
   - W: A sunflower makes a big flower.
3. **A mango tree** [LIV-08]
   - P: We see its fruit more than its flowers.
   - W: A mango tree flowers before it fruits.
4. **A hibiscus** [LIV-08]
   - P: Picked at random.
   - W: A hibiscus makes large flowers.

**R17 · A classification chart** [LIV-09, LIV-05]
(Figure: a chart.) "Does it have 6 legs?" Yes → Group A. No → "Does it have feathers?" Yes → Group B. No → Group C. Into which group does a spider (8 legs, no feathers) go?
1. **Group A** [LIV-05]
   - P: Spiders seem to be insects.
   - W: A spider has 8 legs, not 6.
2. **Group B** [LIV-09]
   - P: It goes past the first question.
   - W: A spider has no feathers, so it goes to C.
3. **Group C** ✓
   - P: Answer each question in turn: 6 legs? No. Feathers? No.
   - W: No to both questions leads to Group C.
4. **It can't be placed, because the chart doesn't mention spiders.** [LIV-09]
   - P: Spiders aren't named.
   - W: The chart sorts by features. Answer its questions about the spider.

**R18 · Two groups of animals** [LIV-09, LIV-04]
(Figure: a table.) Group 1: cat, dog, rabbit · Group 2: hen, duck, penguin. Which headings could Mei have used?
1. **Group 1: lives on land · Group 2: lives in water** [LIV-04]
   - P: Ducks and penguins swim.
   - W: Hens live on land. The groups are not split by where they live.
2. **Group 1: big · Group 2: small** [LIV-09]
   - P: Some look bigger.
   - W: A rabbit is not bigger than a penguin. Size doesn't split them.
3. **Group 1: cannot fly · Group 2: can fly** [LIV-04]
   - P: Birds seem to fly.
   - W: A penguin cannot fly, but it is in Group 2.
4. **Group 1: has fur · Group 2: has feathers** ✓
   - P: What body covering do all the animals in each group share?
   - W: Cats, dogs and rabbits have fur. Hens, ducks and penguins have feathers.

---

## 7. Build notes

- **Files:** `src/pages/01-diversity/P3-living-things/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`, order 0, `allowTerms: ["vein", "veins"]` (decision 5).
- **Page-specific code** (all SVG):
  - E1: seed-and-pebble days.
  - E2: six group tiles with simple feature drawings.
  - E3: eight plant cards and the classification-chart puzzles.
  - E4: mushroom parts, mould days, microscope view.
- **Sort widgets:** six (E1 ×2, E2, E3, E4 ×2), all through the shared classify widget.
- **Figures for standalone questions:** U2, U7, U10 and R18 are tables; R17 is a chart drawn as a nested list. All use theme classes only.
- **Classes:** page classes are prefixed `v-`.
- **Registry:** add LIV-01 to LIV-09 (§5).
- **Check after build:**
  - the linter shows no errors and no answer-position warnings
  - "vein" appears only in the main flow, and "spiracles" only in V2's "Your book also says"
  - the 44px tap-target audit passes
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
