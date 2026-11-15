# Unit spec · P4 Matter

Status: **approved and built** · 2026-11-12
Built with one change from this draft: the three example lists in card A2 were not checked against the book, so the page uses my own examples instead (solid: stone, wooden block, ice · liquid: water, milk, cooking oil · gas: air, oxygen, steam). Swap in the book's lists once they are confirmed (§0 item 1).

**Later change (2026-11-12):** the options are not shuffled when shown, and every question had its correct answer at (1). The built `questions.json` now uses all four positions equally. The wording is unchanged, but the option order in §6 below no longer matches the page.
Builds: `src/pages/02-cycles/P4-matter/` → `02-cycles/P4-matter.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

Review once: approve, or mark changes inline. **§0 lists what I need from you.**

---

## 0. What I need from you

1. **Three example lists to check against the book (page 13).** The photo text was hard to read in the sketchnote, so each list is marked "check" there:
   - Solid examples: *chair, table, pencil, ruler*
   - Liquid examples: *water, milk, coffee, alcohol*
   - Gas examples: *oxygen, nitrogen, hydrogen*

   Confirm, correct, or tell me to drop any list. I won't publish them unchecked.
2. **New content that is not in the book.** The sketchnote has nothing on measuring (LO P4.MTR.P1) or on powders. Cards A3 and A4, interactive E3 and questions U3, U5, U6 and U9 are written from the syllabus wording and standard P4 practice. Approve them or tell me what your school uses (for example, if the school uses "overflow can" or "displacement can").
3. **Units.** I've written volume as **mL for liquids** and **cm³ for solids**, with "1 mL = 1 cm³" stated once. Tell me if the school uses only one of them.

---

## 1. Learning outcomes and where each is covered

All three Matter LOs, quoted from the syllabus.

| LO | Wording | Summary card | Interactive | Questions |
|---|---|---|---|---|
| P4.MTR.C1 | State that matter is anything that has mass and occupies space. | A1 | E1 | U1, U7, U9 |
| P4.MTR.C2 | Differentiate among the three states of matter (solid, liquid, gas) in terms of shape and volume. | A2, A3 | E2 | U2, U3, U4, U8 |
| P4.MTR.P1 | Measure mass and volume using appropriate apparatus. | A4 | E3 | U5, U6, U7 |

Notes:
- The syllabus has no "Note:" exclusions for this topic.
- The particle picture of matter isn't in the P4 syllabus, so it goes only in a Beyond-syllabus toggle (§2, B1). It never appears in a question.
- Density is excluded elsewhere in the syllabus (P3 Materials) and is already on the linter's excluded-terms list. U7 and R5 compare mass and volume without it.

---

## 2. Page outline

1. **Header**: all three LOs.
2. **What you need to know**: cards A1–A4 (§3), each tap-to-reveal, all open on a wide screen.
3. **Explore**:
   - E1, Matter or not? (sort the cards)
   - E2, Squeeze and pour (the three states)
   - E3, Measuring lab (mass and volume)
4. **Unit check**: 9 questions (U1–U9), with 7 hidden recap variants (R1–R7).
5. **Go deeper**: the existing focus page *Air in a bottle with a balloon*, listed automatically.
6. **Beyond syllabus**: B1, "A particle picture of the three states" (closed toggle under E2).
7. **Footer**: prev/next unit within Cycles (none built yet), and the hub.

Once this page exists, the hub stops linking the old sketchnote module for Matter. This happens automatically.

---

## 3. Summary cards (exact text)

### A1 · What is matter? (from the sketchnote)
> **Matter** is anything that has **mass** and **occupies space**. Solids, liquids and gases are all matter, including air, which you cannot see.
>
> Two balloons hang balanced at the ends of a stick. Pop one, and the side with the full balloon tips down: the air in it has mass. An "empty" bottle is full of air, and that air takes up the space inside it.
>
> **Not matter:** light, heat, sound, thunder, lightning, shadows. They have no mass and take up no space.

### A2 · Three states (from the sketchnote; the example lists need checking, see §0)

| | Solid | Liquid | Gas |
|---|---|---|---|
| Shape | Definite shape | No definite shape: takes the shape of its container | No definite shape: fills the whole container |
| Volume | Definite volume | Definite volume | No definite volume |
| Can it be squashed into less space? | No | No | Yes |
| Examples | chair, table, pencil, ruler | water, milk, coffee, alcohol | oxygen, nitrogen, hydrogen |

### A3 · Powders are solids (new)
> Sand, sugar, salt and flour can be poured, and a heap of them takes the shape of its container. They are still **solids**. Look at a single grain: it keeps its own definite shape and definite volume. The heap only changes shape because the tiny grains slide past one another.

### A4 · Measuring mass and volume (new)
> - **Mass** is measured with an **electronic balance**, in grams (g) or kilograms (kg).
> - The **volume of a liquid** is measured with a **measuring cylinder**, in millilitres (mL). Read the level with your eye level with the water.
> - The **volume of a solid that sinks** and has an odd shape, like a stone, is found by **displacement**: read the water level, lower the stone in, read the level again. Volume of the stone = level after − level before.
> - 1 mL = 1 cm³. Liquid volumes are usually given in mL and solid volumes in cm³.
> - Mass and volume are different. Volume is how much space something takes up. You cannot tell an object's mass from its size.

---

## 4. Interactives

### E1 · Matter or not? (LO C1; exercises MTR-01, MTR-06)
- **Widget:** the sketchnotes "Classify" interaction, ported once into `src/engine/widgets/classify.js` so later units can reuse it.
- **Cards (12):**
  - matter: air in a balloon, water, a stone, steam, sand, oxygen, orange juice, a wooden block
  - not matter: light, heat, sound, a shadow
- **Interaction:** tap a card, then tap a bin ("Matter" / "Not matter"). Dragging also works with a mouse. A wrong placement bounces back with its reason. Each reason answers two questions, "Does it have mass? Does it take up space?". For example:
  - Light: "Light is a form of energy. It has no mass and takes up no space."
  - Air: "You cannot see air, but it has mass and takes up space."
- **Done state:** all 12 placed, with the number right first time shown. It is practice only, so nothing goes to the mistake book.

### E2 · Squeeze and pour (LO C2; exercises MTR-02, MTR-04, MTR-07)
Rebuilt from the sketchnote's "Try it: squeeze and pour", in house style, with three panels:

1. **Three sealed syringes**: a wooden block that fills the barrel, water, and air. One slider pushes all three plungers.
   - Only the air plunger moves, and it stops part of the way.
   - Readout: "The solid and the liquid cannot be squashed: they have a definite volume. The air is squashed into less space, and it pushes back harder the further you push."
2. **Pour it**: pick a sample (a wooden block, 200 mL of water, or coloured gas), then a container (tall narrow glass, wide bowl, or closed box).
   - A table fills in as the student tries combinations, with columns *Shape changed?* and *Volume*. Water always reads 200 mL.
   - The gas spreads, shown as dots filling the whole box, with the caption "simplified model".
3. **Zoom on sand**: pour sand into the tall glass and the bowl. A magnifier shows a few grains keeping their shape.
   - Caption: "The heap takes the container's shape. Each grain keeps its own."

### E3 · Measuring lab (LO P1; exercises MTR-08, MTR-09)
Three stations:

1. **Balance**:
   - Place three objects of different sizes (a small stone, a large sponge, a wooden block) on an electronic balance one at a time.
   - The readings show that the biggest object is not the heaviest.
   - No inflated balloon goes on the balance: the reading would mislead, because the air around it holds a balloon up.
2. **Measuring cylinder**: read three levels. The student picks the reading from four chips, with immediate unscored feedback.
3. **Displacement**:
   - Lower a stone into a cylinder holding 50 mL. The level rises to 72 mL.
   - The student picks the stone's volume from 22, 50, 72 and 122 cm³, with feedback on each choice.
   - Then repeat with a second stone, using different numbers.

Practice only: the scored questions are in the unit check.

### B1 · Beyond syllabus: a particle picture (closed toggle)
In a solid the particles are packed closely in fixed places. In a liquid they are close but can move past one another. In a gas they are far apart and move about freely, which is why a gas can be squashed into less space. This is not in the P4 syllabus and is never tested here.

---

## 5. Misconception tags

**New tags:**

| Id | Label | Fix |
|---|---|---|
| MTR-07 | Thinks powders like sand or sugar are liquids because they can be poured | Each grain keeps its own definite shape and volume, so a powder is a solid. The heap only takes the container's shape because the grains slide past one another. |
| MTR-08 | Reads the final water level as the volume of the object | The level after includes the water. Volume of the object = level after − level before (or the volume of water that overflows). |
| MTR-09 | Mixes up mass and volume | Mass is measured on a balance (g, kg). Volume is the space taken up, measured in mL or cm³. A bigger object is not always the heavier one. |

**Changed tag:** MTR-06 widens to "Thinks light, heat, sound or a shadow is matter". U1 has a shadow option.

**Reused tags:**
- MTR-01, MTR-02, MTR-03 and MTR-04, from the air-in-a-bottle page.
- MAT-05 (fair test) in U9. Its label is general enough for a matter context.

**Count after this unit** (each tag needs 3+ questions, 2+ of them hidden): MTR-07 has 3 (2 hidden), MTR-08 has 3 (2 hidden), MTR-09 has 7 (5 hidden).

---

## 6. Question bank

Options are numbered (1)–(4). For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · Which are matter?** (C1)
Which of the following are matter? A: the air inside a football · B: the light from a torch · C: water vapour in the air · D: the shadow of a tree
1. **A and C only ✓**
   - P: Check each one: does it have mass, and does it take up space?
   - W: Air and water vapour are gases. They have mass and take up space. Light is energy, and a shadow is only where light is blocked.
2. **A, B and C only** [MTR-06]
   - P: Light seems to fill a room, so it seems to take up space.
   - W: Light is a form of energy. It has no mass and takes up no space.
3. **C only** [MTR-01]
   - P: Water vapour is water, which is clearly matter, but air seems to be nothing.
   - W: The air in the football has mass (a pumped-up ball is heavier) and takes up space.
4. **A, C and D only** [MTR-06]
   - P: A shadow has a shape and a size you can see.
   - W: A shadow is not stuff. It is the area where light is blocked, so it has no mass.

**U2 · Pouring juice** (C2)
Ali pours 200 mL of juice from a tall, narrow glass into a wide, shallow bowl. Which statement is correct?
1. **The juice changes shape, but its volume stays 200 mL. ✓**
   - P: Ask what changed when the juice moved: its shape, its amount, or both?
   - W: A liquid takes the shape of its container but has a definite volume. Nothing was added or lost.
2. **The volume becomes less, because the level in the bowl is lower.** [MTR-04]
   - P: The level drops a lot, so it looks like there is less juice.
   - W: The level is lower because the juice is spread over a wider area. There is still 200 mL.
3. **The juice keeps both its shape and its volume.** [MTR-04]
   - P: Pouring does not seem to change the juice itself.
   - W: A liquid has no definite shape: it takes the shape of the bowl.
4. **The volume becomes more, because the juice spreads out further.** [MTR-04]
   - P: It covers more of the bowl, so it seems bigger.
   - W: Spreading out changes the shape, not the volume.

**U3 · Is sand a solid?** (C2)
Sand can be poured, and it takes the shape of the container it is poured into. Why is sand still a solid?
1. **Each grain of sand has a definite shape and a definite volume. ✓**
   - P: Look closely at one grain instead of the whole heap.
   - W: The heap takes the container's shape only because the grains slide past one another. Each grain keeps its own shape and volume.
2. **It is not. Sand is a liquid because it can be poured.** [MTR-07]
   - P: Things that pour, like water, are liquids.
   - W: Pouring is not the test. Each grain keeps its own shape and volume, which no liquid does.
3. **Sand is a solid only when it is wet and sticks together.** [MTR-07]
   - P: Wet sand holds a shape, like a sandcastle, so it seems solid only then.
   - W: Dry sand is a solid too. Each grain has a definite shape and volume, wet or dry.
4. **Sand is a solid because it has mass.** [MTR-04]
   - P: Solids feel like they have a fixed amount of stuff.
   - W: Liquids and gases have mass too. Sand is a solid because each grain has a definite shape and volume.

**U4 · Three sealed syringes** (C2)
Three identical sealed syringes, P, Q and R, each contain either air, water, or a block of wax that fills the syringe. When each plunger is pushed, only P's plunger moves in. Which statement is correct?
1. **P contains air. Its plunger moves in part of the way. ✓**
   - P: Which state has no definite volume?
   - W: A gas can be squashed into less space, but it still takes up space and pushes back.
2. **P contains water.** [MTR-04]
   - P: Water flows easily, so it seems it would let the plunger move.
   - W: Water flows, but it has a definite volume and cannot be squashed.
3. **P contains the wax.** [MTR-04]
   - P: Wax is soft, so it seems squashable.
   - W: The wax fills the syringe and has a definite volume, so it cannot be squashed into less space.
4. **P contains air. Its plunger can be pushed all the way to the end.** [MTR-02]
   - P: Air is easy to squash, so it seems it could be squashed away completely.
   - W: Air can be squashed into less space, but never into no space.

**U5 · The volume of a stone** (P1; figure: two measuring cylinders, before and after)
A measuring cylinder contains 50 mL of water. A stone is lowered in and the water level rises to 72 mL. What is the volume of the stone? (1 mL = 1 cm³)
1. **22 cm³ ✓**
   - P: The stone pushed the water up. Subtract: 72 − 50.
   - W: The rise in the level equals the space the stone takes up: 22 mL, which is 22 cm³.
2. **72 cm³** [MTR-08]
   - P: 72 is the reading with the stone in it.
   - W: 72 mL is the water and the stone together. Subtract the 50 mL of water.
3. **122 cm³** [MTR-08]
   - P: Both numbers seem to belong in the answer, so add them.
   - W: The stone's volume is the change in the level, so subtract.
4. **50 cm³** [MTR-08]
   - P: 50 mL is the first reading, so it seems to be the measurement.
   - W: 50 mL is the water before the stone went in. It says nothing about the stone.

**U6 · Finding the mass of a stone** (P1)
Which apparatus should be used to measure the mass of a stone?
1. **An electronic balance ✓**
   - P: Mass is found by weighing.
   - W: An electronic balance measures mass in g or kg.
2. **A measuring cylinder with water** [MTR-09]
   - P: You have seen stones put into measuring cylinders in class.
   - W: That finds the stone's volume (the space it takes up), not its mass.
3. **A ruler** [MTR-09]
   - P: Measuring the stone's size seems to tell you how much there is.
   - W: A ruler measures length. Size does not tell you mass.
4. **A beaker** [MTR-09]
   - P: Beakers are used for measuring in the lab.
   - W: A beaker only roughly measures the volume of a liquid. It cannot measure mass.

**U7 · A big balloon and a small marble** (C1, P1)
A balloon blown up with air is much bigger than a glass marble. Which statement is correct?
1. **The balloon takes up more space than the marble. ✓**
   - P: Bigger means more volume. Ask what size alone can tell you.
   - W: Volume is the space something takes up. Size tells you nothing certain about mass.
2. **The balloon has a greater mass because it is bigger.** [MTR-09]
   - P: Bigger things are usually heavier.
   - W: Size tells you volume, not mass. You would need a balance to compare their masses.
3. **The balloon has no mass because it is filled with air.** [MTR-03]
   - P: Balloons float about, so they seem to weigh nothing.
   - W: The rubber and the air inside both have mass. It is just small.
4. **The marble takes up more space because it is heavier.** [MTR-09]
   - P: Heavier things seem to be bigger.
   - W: Mass and volume are different. Being heavier does not make something take up more space.

**U8 · Where does the gas go?** (C2)
Some coloured gas is released into one corner of a closed glass box. After some time, where is the coloured gas?
1. **Spread out through the whole box ✓**
   - P: A gas has no definite shape or volume.
   - W: A gas spreads out to fill the whole of its container.
2. **Lying on the bottom of the box, like a liquid** [MTR-04]
   - P: Liquids settle at the bottom, so gases seem to as well.
   - W: A liquid has a definite volume and collects at the bottom. A gas fills the whole box.
3. **Still in the corner where it was released** [MTR-04]
   - P: Nothing pushed it, so it seems to stay put.
   - W: A gas does not keep its shape or stay in one place.
4. **Gone, because a gas takes up no space** [MTR-01]
   - P: The colour may be harder to see later.
   - W: Gas is matter and takes up space. The colour fades only because the gas has spread out.

**U9 · A fair test with balloons** (C1)
Ravi wants to show that air has mass. He hangs two balloons at the two ends of a stick and balances it, then lets the air out of one balloon. Which must be the same about the two balloons at the start?
1. **They must be the same kind, blown up the same amount, and hung at the same distance from the middle. ✓**
   - P: The only difference allowed is whether a balloon still has its air.
   - W: If anything else differs, the stick could tip because of that, not because of the air.
2. **They must be different colours so they can be told apart.** [MAT-05]
   - P: It is easy to keep track of them that way.
   - W: Colour has no effect on the balance, so it is not something that needs controlling.
3. **Only their distance from the middle must be the same. Their size does not matter.** [MAT-05]
   - P: The distance from the middle obviously matters for balancing.
   - W: A bigger balloon holds more air and more rubber. Different sizes would spoil the test.
4. **Nothing needs to be the same, because air has no mass anyway.** [MTR-03]
   - P: Air feels weightless, so the test seems pointless.
   - W: The stick does tip when one balloon loses its air. That is the evidence that air has mass.

### Hidden recap variants (served only by the hub's recap)

**R1 · Which are solids?** [MTR-07, MTR-04]
Which of these are solids? A: sugar · B: flour · C: cooking oil · D: ice
1. **A, B and D only ✓**
   - P: Check each one: does it keep its own definite shape and volume?
   - W: Each sugar crystal and flour grain keeps its own shape and volume, and so does ice. Oil takes the shape of its container.
2. **D only** [MTR-07]
   - P: Sugar and flour can be poured, so they seem to be liquids.
   - W: Each grain keeps its own definite shape and volume, so powders are solids.
3. **A and B only** [MTR-04]
   - P: Ice melts into water, so it seems to be a liquid.
   - W: Ice is water in its solid state. While it is ice, it has a definite shape and volume.
4. **A, B, C and D** [MTR-04]
   - P: Cooking oil is thick, so it seems solid.
   - W: Oil takes the shape of its container, so it is a liquid.

**R2 · Sugar in a jar** [MTR-07]
Sugar takes the shape of the jar it is poured into. Why is it still a solid?
1. **Each crystal keeps its own definite shape and volume. ✓**
   - P: Look at one crystal instead of the whole heap.
   - W: The heap takes the jar's shape only because the crystals slide past one another. Each crystal keeps its own shape and volume.
2. **It is a liquid, because it takes the shape of the jar.** [MTR-07]
   - P: Liquids take the shape of their container, and so does the sugar.
   - W: Taking the container's shape is not the test for a powder. Each crystal keeps its own shape and volume, which no liquid does.
3. **It is a gas, because it spreads across the bottom of the jar.** [MTR-07]
   - P: The sugar spreads out to cover the bottom.
   - W: A gas fills the whole container. Sugar settles at the bottom, and each crystal keeps its shape and volume.
4. **It is a solid only when it is in a lump.** [MTR-07]
   - P: A sugar cube clearly holds its shape, but loose sugar does not.
   - W: Loose sugar is a solid too. Each crystal has a definite shape and volume, whether in a lump or loose.

**R3 · The overflowing container** [MTR-08, MTR-09]
A container is filled with water to the brim. When a stone is lowered in, 35 mL of water overflows into a measuring cylinder. What is the volume of the stone?
1. **35 cm³ ✓**
   - P: The stone pushed some water out. How much space did it need?
   - W: The stone pushed out exactly as much water as the space it takes up: 35 mL, which is 35 cm³.
2. **The volume of water left in the container** [MTR-08]
   - P: That is the other water reading, so it seems to be the answer.
   - W: The water left behind tells you nothing about the stone. The overflow does.
3. **It cannot be found without the stone's mass** [MTR-09]
   - P: Measuring a stone usually seems to mean weighing it.
   - W: Volume is found from the water pushed out. Mass is not needed.
4. **35 g** [MTR-09]
   - P: The number 35 is right, and grams are a familiar unit.
   - W: The overflow measures volume, in mL or cm³. Grams measure mass.

**R4 · Two stones** [MTR-08, MTR-09]
(Figure: a table of readings. Stone X: 30 mL before, 48 mL after. Stone Y: 50 mL before, 64 mL after.)
Which stone has the bigger volume?
1. **X: 18 cm³ compared with 14 cm³ ✓**
   - P: Work out the rise for each stone: 48 − 30 and 64 − 50.
   - W: X raised the water by 18 mL and Y by 14 mL, so X takes up more space.
2. **Y, because its water level ended higher** [MTR-08]
   - P: 64 mL is the highest reading.
   - W: Y's cylinder started with more water. Only the rise counts: Y's is 14 mL, smaller than X's 18 mL.
3. **They are the same, because both made the water rise** [MTR-08]
   - P: Both stones pushed the water up.
   - W: They pushed it up by different amounts: 18 mL and 14 mL.
4. **It cannot be told without weighing them** [MTR-09]
   - P: Comparing stones seems to need their masses.
   - W: Volume comes from the rise in water level. Weighing gives mass, which is a different quantity.

**R5 · Taking up the same space** [MTR-09, MTR-03]
A stone and a bag of feathers take up the same amount of space. Which statement is correct?
1. **They have the same volume, but their masses may be different. ✓**
   - P: "Same space" tells you about volume. Does it tell you about mass?
   - W: Taking up the same space means the same volume. Mass is a separate measurement and can be very different.
2. **They must have the same mass.** [MTR-09]
   - P: Things the same size seem to weigh the same.
   - W: The same volume does not mean the same mass. You would need a balance to compare.
3. **The feathers have no mass.** [MTR-03]
   - P: Feathers feel weightless.
   - W: Feathers are matter, so they have mass. It is just small.
4. **They have the same mass and volume because both are solids.** [MTR-09]
   - P: Being in the same state seems to make them alike.
   - W: Solids can have very different masses for the same volume. The state does not decide the mass.

**R6 · Mass and volume of a toy car** [MTR-09] (table layout)
Which apparatus should be used to find the mass and the volume of a small toy car that sinks in water?

| Option | To find its mass | To find its volume |
|---|---|---|
| (1) ✓ | electronic balance | measuring cylinder with water |
| (2) [MTR-09] | measuring cylinder with water | electronic balance |
| (3) [MTR-09] | ruler | electronic balance |
| (4) [MTR-09] | electronic balance | electronic balance |

1. ✓
   - P: Mass is found by weighing. The volume of an odd-shaped object is found by displacement.
   - W: A balance gives the mass. The rise in water in a measuring cylinder gives the volume.
2. [MTR-09]
   - P: Both pieces of apparatus are right for the toy car, so the order seems not to matter.
   - W: They are swapped. A measuring cylinder finds volume, and a balance finds mass.
3. [MTR-09]
   - P: A ruler measures the car's size, which seems to show how much there is.
   - W: A ruler measures length, not mass. And a balance cannot find volume.
4. [MTR-09]
   - P: A balance shows a number for anything you put on it.
   - W: A balance measures mass only. Volume needs the measuring cylinder.

**R7 · Milk in a tall glass** [MTR-04, MTR-09]
150 mL of milk is poured from a carton into a tall, narrow glass, and the level looks high. What is the volume of the milk now?
1. **150 mL ✓**
   - P: Nothing was added or spilled. What changed?
   - W: A liquid has a definite volume. Only its shape changed, so it is still 150 mL.
2. **More than 150 mL, because the level is higher** [MTR-04]
   - P: A higher level looks like more milk.
   - W: The level is higher because the glass is narrow. The volume has not changed.
3. **Less than 150 mL, because the glass is narrower** [MTR-04]
   - P: A narrow glass seems to hold less.
   - W: The milk is squeezed into a taller shape, not a smaller amount. It is still 150 mL.
4. **It cannot be known without measuring its mass** [MTR-09]
   - P: Checking an amount seems to need a balance.
   - W: Volume is not found from mass. Nothing was added or lost, so the volume is still 150 mL.

---

## 7. Build notes

- **Files:** `src/pages/02-cycles/P4-matter/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`, order 0 (the unit page comes before the air-in-a-bottle focus page).
- **New engine widget:** `classify.js`, ported from the sketchnotes Classify. Tap-to-place with drag as an extra, 44px targets, keyboard operable.
- **Page-specific code:** E2 (syringes, pouring, sand zoom) and E3 (balance, cylinder, displacement). All SVG, no 3D.
- **Registry changes:** add MTR-07, MTR-08 and MTR-09, and relabel MTR-06 (§5).
- **Check after build:**
  - the linter shows no errors, and its check that every core LO has a question passes
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
