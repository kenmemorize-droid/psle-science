# Unit spec · P4 Digestive system

Status: **approved and built** · 2026-11-12. The §0 defaults were used:
- the other systems' main parts are named
- *skull* and *ribcage* appear only in B1 and are now on the excluded-terms list
- the anus appears only in B2
- the large intestine card says "water and mineral salts", and questions test water only

Built with these changes from this draft:
- **E2:** the digestive tube is drawn as one long schematic tube rather than in body shape, so each part and the blood vessel have room for labels and moving food. The body-shaped drawing is in question U7, and the 3D view is on the focus page.
- **Engine:** cards in "What you need to know" can now shrink below the width of a table inside them (`.know>*{min-width:0}` in `theme.css`). Before this, the G1 and G4 tables pushed the page wider than a 375px screen. This affects all pages.
- **Focus page, beyond the planned reorder of v1–v9:** its five food-legend chips were 30px tall on phones, below the 44px minimum. They now sit in a row above the 3D viewer at 44px, instead of over it, where they would have covered the mouth.

Builds: `src/pages/03-systems/P4-digestive-system/` → `03-systems/P4-digestive-system.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

The topic has two core ideas and no practice:
- **C1:** an overview of five human body systems.
- **C2:** the digestive system's parts and what each does.

The retrofitted 3D focus page *Follow a meal through the body* (`P4-digestive-system-food-journey`) already teaches C2 in depth, with 13 questions and tags DIG-01 to DIG-06. This unit adds C1, gives C2 its summary cards, 2D interactives and unit check, and lists the focus page under **Go deeper**. It reuses the six DIG tags and adds four.

Review once: approve, or mark changes inline. **§0 lists the decisions I need from you.**

---

## 0. Decisions I need from you

1. **How much to name in the other four systems.** C1 asks the student to identify the systems and state what they do. Naming the parts of the respiratory and circulatory systems, and saying what those parts do, is a P5 outcome (P5.HRC.C2).
   - The book (p. 26) lists each system's parts: nose, windpipe, air tubes and lungs; heart, blood and blood vessels; bones; muscles.
   - **Default:** each system card names its main parts in one line, so the student can recognise them in a picture: nose, windpipe and lungs; heart, blood and blood vessels; bones; muscles. "Air tubes" is left out, because P5 lists only the nose, windpipe and lungs.
   - Questions may ask which system a named part belongs to (U2, R4–R6). No question asks what the heart or the lungs do on their own; that waits for P5.
2. **Names of bones.** The C1 note says the names of bones and muscles are not required. The book names the skull (protects the brain) and the ribcage (protects the heart and lungs).
   - **Default:** the main flow says "the bones of the head protect the brain, and the bones of the chest protect the heart and lungs". The words *skull* and *ribcage* appear only in the closed Beyond-syllabus toggle B1.
   - I'll add *skull*, *ribcage* and *rib cage* to the linter's excluded-terms list, so they can't slip into a question. A P5 page that needs "ribcage" (for example, the lung model) can allow it in its own `meta.json`.
3. **The anus.** The syllabus lists five parts: mouth, gullet, stomach, small intestine and large intestine. The book adds the anus ("passes out waste material"). The existing focus page shows the anus only in its Beyond-syllabus notes.
   - **Default:** the same as the focus page. The main flow says undigested food "leaves the body as faeces"; the anus is named only in toggle B2, and never tested.
4. **What the large intestine absorbs.** The book says water and mineral salts. The focus page and its questions say water only.
   - **Default:** the card says "water and mineral salts"; questions test water only, so the two pages never disagree in a question.

**Fix to the existing focus page (no decision needed).** Options render in the order they are written, and all nine of the focus page's hidden recap variants (v1–v9) have the correct answer at (1). A student doing recap could learn "pick (1)". I'll reorder their options during this build so the correct answers spread across (1)–(4). Only the order changes, not the wording.

Nothing on book pp. 26–27 is marked "check against the book". The sketchnote tags villi as extra; it goes in B2.

**Added or changed from the book** (so you can check them):
- The book says chewing "increases the exposed surface area for faster digestion". The card says "smaller pieces are digested faster", because "exposed surface area" is P5 wording.
- The tick-table station (E4) and every sort card and question item are mine, built from the book's facts.

---

## 1. Learning outcomes and where each is covered

| LO | Wording | Cards | Interactives | Unit check |
|---|---|---|---|---|
| P4.DIG.C1 | Identify the human systems in the body and state their functions (digestive, respiratory, circulatory, skeletal and muscular). *(Note: an overview only; detailed knowledge of the muscular and skeletal systems, such as names of bones and muscles and how they work, is not required.)* | G1 | E1 | U1–U4 |
| P4.DIG.C2 | Identify the parts in the human digestive system (mouth, gullet, stomach, small intestine and large intestine) and describe their functions. | G2–G4 | E2, E3, E4; focus page | U5–U10 |

Values outcomes aren't tested.

---

## 2. Page outline

1. **Header**: both LOs.
2. **What you need to know**: cards G1–G4 (§3).
3. **Explore**: E1–E4 (§4).
4. **Unit check**: U1–U10, with 12 hidden recap variants (R1–R12).
5. **Go deeper**: lists *Follow a meal through the body* automatically (topic DIG), with its "fixes" line and the student's status.
6. **Beyond syllabus** (closed toggles):
   - B1, under E1: the skull and the ribcage (decision 2).
   - B2, under E2: the anus and villi (decision 3).
7. **Footer**: previous unit within Systems is *Plant parts*, then the hub.

---

## 3. Summary cards (exact text)

### G1 · Five body systems (from the book, p. 26)
> A **system** is a group of parts that work together to do a job. Your body has many systems. Five of them are:
>
> | System | What it does | Main parts |
> |---|---|---|
> | **Respiratory** | takes in **oxygen** and removes **carbon dioxide** | nose, windpipe, lungs |
> | **Circulatory** | carries **digested food, water and oxygen** to all parts of the body, and carries **carbon dioxide and other waste** away | heart, blood, blood vessels |
> | **Digestive** | **breaks down food** into simpler substances that can pass into the blood | mouth, gullet, stomach, small intestine, large intestine |
> | **Skeletal** | **supports** the body, gives it **shape** and **protects** soft organs: the bones of the head protect the brain, and the bones of the chest protect the heart and lungs | bones |
> | **Muscular** | works **with the skeletal system** to **move** parts of the body | muscles |

### G2 · What digestion is for (from the book)
> **Digestion** breaks food down into **simpler substances**. Only digested food is small enough to **pass into the blood**, which carries it to all parts of the body.
>
> Some food, such as the **fibre** in vegetables, cannot be digested. It does not pass into the blood. It leaves the body as **faeces**.

### G3 · The digestive parts, in order (from the book, p. 27)
> Food passes through: **mouth → gullet → stomach → small intestine → large intestine**.
> - **Mouth:** digestion **begins** here. The **teeth** cut and grind the food into smaller pieces, which are digested faster. **Saliva**, a digestive juice, softens and moistens the food and starts to digest it. The **tongue** rolls the food into a ball so it can be swallowed.
> - **Gullet:** its **muscles** squeeze the food down to the stomach. **No digestion** takes place here.
> - **Stomach:** its muscles **churn** the food while a digestive juice (**gastric juice**) mixes in. The food is **partly digested** into a thick liquid.
> - **Small intestine:** more digestive juices **complete digestion**. The **digested food passes into the blood** through its wall.
> - **Large intestine:** **water and mineral salts** are absorbed from the **undigested food**. What is left becomes **faeces**. **No digestion** takes place here.

### G4 · Where digestion and absorption happen (summary of G3)
> | Part | Digestion takes place | Digested food passes into the blood | Water is absorbed from undigested food |
> |---|---|---|---|
> | Mouth | ✓ (it begins here) | ✗ | ✗ |
> | Gullet | ✗ | ✗ | ✗ |
> | Stomach | ✓ (partly) | ✗ | ✗ |
> | Small intestine | ✓ (completed here) | ✓ | ✗ |
> | Large intestine | ✗ | ✗ | ✓ |

---

## 4. Interactives

### E1 · Five body systems (C1; exercises DIG-07, DIG-08, DIG-09)
1. **Pick a system.** A body outline with five buttons: *Respiratory · Circulatory · Digestive · Skeletal · Muscular*.
   - The chosen system is drawn on the body; the others stay hidden.
   - A panel shows what the system does and its main parts (as in G1).
   - The drawings are simple: lungs and windpipe; heart with blood vessels running to the arms and legs; the digestive tube; a simplified skeleton; muscles on the arms and legs. Each system is named in text, never shown by colour alone.
2. **Which system?** Uses the shared sort widget, with five bins.

   **Cards (11):**
   - Respiratory: takes in oxygen · nose, windpipe and lungs
   - Circulatory: carries digested food and oxygen to all parts of the body · heart, blood and blood vessels
   - Digestive: breaks food down so it can pass into the blood · mouth, gullet, stomach and intestines
   - Skeletal: supports the body and gives it shape · protects the brain, heart and lungs · bones
   - Muscular: works with the bones to move parts of the body · muscles

   **Reasons after each placement**, for example:
   - "carries digested food and oxygen to all parts of the body": "Circulatory. The digestive system breaks food down; the blood carries it around."
   - "works with the bones to move parts of the body": "Muscular. Bones can't move on their own."

**B1 · Beyond syllabus (closed toggle):** from the book, the bones of the head form the **skull**, which protects the brain, and the bones of the chest form the **ribcage**, which protects the heart and lungs. Never tested.

### E2 · Follow the food (C2; exercises DIG-02, DIG-03, DIG-04, DIG-05, DIG-06, DIG-10)
A 2D drawing of the digestive tube (mouth, gullet, stomach, small intestine, large intestine) with a step-through: **Back / Next**, one step per part.

A meal is shown as a ball of food: six food squares ■ and two fibre strands. At each step, the drawing and three status lines change.

| Step | What the food does | Digestion | Into the blood | Water absorbed |
|---|---|---|---|---|
| Mouth | the squares break into smaller pieces | begins | nothing | nothing |
| Gullet | the ball is squeezed down | none here | nothing | nothing |
| Stomach | it is churned into a thick liquid; the pieces get smaller | partly digested | nothing | nothing |
| Small intestine | the pieces become dots that move through the wall into a blood vessel; only the fibre is left | completed | digested food | nothing |
| Large intestine | water drops leave the fibre; what is left is faeces | none here | nothing | water |

Each step's text quotes G3. The last step ends: "The faeces leave the body." A button under the drawing opens the 3D focus page: *See it in 3D: Follow a meal through the body*.

With reduced motion, each step is drawn in its end state with arrows, and nothing moves.

**B2 · Beyond syllabus (closed toggle):** from the book:
- The inner wall of the small intestine has many tiny folds called **villi**. They give a large surface for digested food to pass into the blood.
- Faeces leave the body through the **anus**, the opening at the end of the digestive system.

Never tested.

### E3 · What happens where? (C2; exercises DIG-02, DIG-03, DIG-01)
Uses the shared sort widget, with five bins (the five parts).

**Cards (10):**
- Mouth: teeth cut and grind the food · saliva mixes with the food and starts to digest it · the tongue rolls the food into a ball to swallow
- Gullet: muscles squeeze the food down to the stomach
- Stomach: muscles churn the food with gastric juice · the food is partly digested into a thick liquid
- Small intestine: digestion is completed · digested food passes into the blood
- Large intestine: water is absorbed from undigested food · what is left becomes faeces

**Reasons after each placement**, for example:
- "digested food passes into the blood": "Small intestine. Digestion is completed there, and the digested food passes through its wall into the blood."
- "water is absorbed from undigested food": "Large intestine. Only undigested food reaches it."

### E4 · The tick table (C2; exercises DIG-01, DIG-03, DIG-04, DIG-10)
The G4 table with every cell blank. Each cell is a 44px toggle button that shows ✓ or nothing, with an aria-label such as "Stomach: digestion takes place, ticked".
- Press **Check**. Each row then shows ✓ "Right" or ✗ "Check this row" with a one-line reason, for example: "Gullet: no digestion here. Its muscles only push the food down."
- **Show the answer** fills in the table.

This is the table shape PSLE questions use (U8, R12).

---

## 5. Misconception tags

**Reused, from the focus page:**

| Id | Label |
|---|---|
| DIG-01 | Thinks water is absorbed somewhere other than the large intestine |
| DIG-02 | Mixes up what the mouth, gullet and stomach each do |
| DIG-03 | Thinks digested food is absorbed somewhere other than the small intestine |
| DIG-04 | Thinks digestion is finished in the stomach |
| DIG-05 | Gets the order of the digestive parts wrong |
| DIG-06 | Mixes up what happens to digested and undigested food |

**New:**

| Id | Label | Fix |
|---|---|---|
| DIG-07 | Mixes up the jobs of the body systems | Respiratory: takes in oxygen and removes carbon dioxide. Circulatory: carries digested food, water and oxygen to all parts of the body. Digestive: breaks food down. Skeletal: supports, shapes and protects. Muscular: works with the skeleton to move body parts. |
| DIG-08 | Puts a body part in the wrong system | Nose, windpipe, lungs: respiratory. Heart, blood, blood vessels: circulatory. Mouth to large intestine: digestive. Bones: skeletal. Muscles: muscular. |
| DIG-09 | Doesn't know what digestion is for | Digestion breaks food down into simpler substances that are small enough to pass into the blood. Carrying them around the body is the circulatory system's job. |
| DIG-10 | Thinks digestion begins somewhere after the mouth | Digestion begins in the mouth. The teeth cut and grind the food, and saliva, a digestive juice, starts to digest it. |

**Count after this unit**, across the platform (this unit plus the focus page). Each tag needs 3+ questions, 2+ of them hidden.

| Tag | Questions | Hidden |
|---|---|---|
| DIG-01 | 8 | 4 |
| DIG-02 | 11 | 5 |
| DIG-03 | 8 | 4 |
| DIG-04 | 6 | 4 |
| DIG-05 | 6 | 3 |
| DIG-06 | 8 | 4 |
| DIG-07 | 7 | 5 |
| DIG-08 | 4 | 3 |
| DIG-09 | 5 | 3 |
| DIG-10 | 4 | 2 |

---

## 6. Question bank

Options are numbered (1)–(4) and render in the order written, so the correct answers are spread across positions. For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · Match the systems** (C1; figure: a table)
The table describes systems X, Y and Z. X: takes in oxygen and removes carbon dioxide · Y: carries digested food, water and oxygen to all parts of the body · Z: works with the skeleton to move parts of the body. Which correctly names X, Y and Z?
1. **X respiratory, Y digestive, Z muscular** [DIG-09]
   - P: Y mentions digested food, so it seems to be the digestive system.
   - W: The digestive system breaks food down. Carrying digested food, water and oxygen around the body is the circulatory system's job.
2. **X circulatory, Y respiratory, Z muscular** [DIG-07]
   - P: X and Y both mention oxygen, so they are easy to swap.
   - W: The respiratory system takes in oxygen. The circulatory system carries it around the body.
3. **X respiratory, Y circulatory, Z muscular ✓**
   - P: Take one job at a time.
   - W: Respiratory takes in oxygen, circulatory carries substances around, and muscular works with the skeleton to move.
4. **X respiratory, Y circulatory, Z skeletal** [DIG-07]
   - P: Moving involves the bones, so it seems to be the skeletal system.
   - W: Bones support and protect. The muscular system works with them to move body parts.

**U2 · The heart** (C1)
Which system is the heart part of?
1. **The respiratory system, because the heart is in the chest next to the lungs** [DIG-08]
   - P: The heart and lungs are close together.
   - W: Being near the lungs doesn't make it part of breathing. The heart, blood and blood vessels form the circulatory system.
2. **The circulatory system ✓**
   - P: Which system includes the blood and blood vessels?
   - W: The heart, blood and blood vessels make up the circulatory system.
3. **The skeletal system, because bones in the chest protect it** [DIG-08]
   - P: The bones of the chest surround the heart.
   - W: Bones protect the heart, but the heart itself is part of the circulatory system.
4. **The digestive system, because digested food travels round the body** [DIG-08]
   - P: Digested food does travel round the body.
   - W: The circulatory system carries digested food. The heart belongs to it, not to the digestive system.

**U3 · Kicking a ball** (C1)
When you kick a ball, your leg moves. Which systems work together to move it?
1. **The skeletal and muscular systems ✓**
   - P: Moving needs something to move, and something to move it.
   - W: The muscular system works with the skeletal system to move parts of the body.
2. **The skeletal system only** [DIG-07]
   - P: The bones of the leg are what moves.
   - W: Bones can't move on their own. The muscular system works with them.
3. **The muscular and circulatory systems** [DIG-07]
   - P: Blood reaches the leg muscles.
   - W: The circulatory system carries substances. Moving is done by the muscles working with the bones.
4. **The muscular system only** [DIG-07]
   - P: Muscles do the moving.
   - W: Muscles work with the skeleton. Both systems are needed.

**U4 · Why food is digested** (C1)
Why must the food we eat be digested?
1. **So that it can be stored in the stomach** [DIG-09]
   - P: The stomach holds food for a while.
   - W: Food is digested so that it can pass into the blood, not so that it can be stored.
2. **So that it becomes waste that leaves the body** [DIG-09]
   - P: Food leaves the body as faeces in the end.
   - W: Only undigested food becomes faeces. Digested food passes into the blood.
3. **So that it is broken down into simpler substances that can pass into the blood ✓**
   - P: What must happen to food before it can pass into the blood?
   - W: Digestion breaks food into simpler substances, small enough to pass into the blood, which carries them to all parts of the body.
4. **So that the blood can digest it further** [DIG-09]
   - P: The blood carries the food, so it seems to work on it too.
   - W: Digestion happens in the digestive system. The blood only carries the digested food.

**U5 · Where digestion begins** (C2)
In which part of the digestive system does digestion begin?
1. **The mouth ✓**
   - P: Where is the food first broken up and mixed with a digestive juice?
   - W: The teeth cut and grind the food, and saliva, a digestive juice, starts to digest it.
2. **The stomach** [DIG-10]
   - P: The stomach is the part most people link with digestion.
   - W: The stomach carries on digestion, but it begins in the mouth.
3. **The gullet** [DIG-02]
   - P: It is the first tube the food goes down.
   - W: The gullet only pushes food down. No digestion takes place there.
4. **The small intestine** [DIG-10]
   - P: Most digestion happens there.
   - W: Digestion is completed in the small intestine, but it begins in the mouth.

**U6 · The order of the parts** (C2)
Which shows the order in which food passes through the digestive system?
1. **mouth → stomach → gullet → small intestine → large intestine** [DIG-05]
   - P: The stomach is the best-known part, so it seems to come straight after the mouth.
   - W: The gullet joins the mouth to the stomach.
2. **mouth → gullet → stomach → large intestine → small intestine** [DIG-05]
   - P: The two intestine names are easy to swap.
   - W: The small intestine comes before the large intestine.
3. **mouth → gullet → small intestine → stomach → large intestine** [DIG-05]
   - P: The intestines seem to come straight after the gullet.
   - W: The stomach comes before both intestines.
4. **mouth → gullet → stomach → small intestine → large intestine ✓**
   - P: Follow the tube down from the mouth.
   - W: Food passes through the parts in this order.

**U7 · Where digestion is completed** (C2; figure: the digestive system with A on the gullet, B on the stomach, C on the small intestine and D on the large intestine)
The diagram shows the human digestive system. In which part is digestion completed?
1. **B** [DIG-04]
   - P: The stomach churns the food into a thick liquid.
   - W: B is the stomach. It only partly digests the food. Digestion is completed in the small intestine.
2. **C ✓**
   - P: Which part finishes digestion and lets the digested food into the blood?
   - W: C is the small intestine. Digestion is completed there.
3. **D** [DIG-06]
   - P: It is the last part, so digestion seems to finish there.
   - W: D is the large intestine. No digestion takes place there; water is absorbed from undigested food.
4. **A** [DIG-02]
   - P: It is a long tube, like the intestines.
   - W: A is the gullet. It pushes food down. No digestion takes place there.

**U8 · Which part is the small intestine?** (C2; figure: a tick table)
The table shows what happens in four parts of the digestive system, W, X, Y and Z.

| Part | Digestion takes place | Digested food passes into the blood | Water is absorbed from undigested food |
|---|---|---|---|
| W | ✓ | ✗ | ✗ |
| X | ✗ | ✗ | ✗ |
| Y | ✓ | ✓ | ✗ |
| Z | ✗ | ✗ | ✓ |

Which part is the small intestine?
1. **W** [DIG-03]
   - P: Digestion takes place in the small intestine, and W has digestion.
   - W: Digested food also passes into the blood in the small intestine. W could be the mouth or the stomach.
2. **X** [DIG-03]
   - P: The small intestine seems to be just a tube the food passes along.
   - W: X does nothing to the food. It could be the gullet.
3. **Y ✓**
   - P: Which part both digests food and lets digested food into the blood?
   - W: Digestion is completed in the small intestine, and the digested food passes into the blood there.
4. **Z** [DIG-01]
   - P: Both intestines seem to absorb water.
   - W: Water is absorbed from undigested food in the large intestine. Z is the large intestine.

**U9 · A large intestine that isn't working** (C2)
Siti's large intestine is not working well. Which is most likely to happen?
1. **Digested food cannot pass into her blood.** [DIG-03]
   - P: The intestines seem to do all the absorbing.
   - W: Digested food passes into the blood in the small intestine.
2. **Her food is not pushed down to her stomach.** [DIG-02]
   - P: Something must stop the food from moving.
   - W: The gullet pushes food down to the stomach.
3. **Her food is not digested, because the large intestine finishes digestion.** [DIG-06]
   - P: It is the last part, so it seems to do the final digesting.
   - W: Digestion is completed in the small intestine. The large intestine only absorbs water from undigested food.
4. **Her faeces are watery. ✓**
   - P: What does the large intestine take out of undigested food?
   - W: The large intestine absorbs water from undigested food. If it doesn't, too much water stays in the faeces.

**U10 · The mouth** (C2)
Which statement about the mouth is correct?
1. **Digested food passes into the blood through the tongue.** [DIG-03]
   - P: Tasting food seems to be the start of taking it in.
   - W: Digested food passes into the blood in the small intestine.
2. **The teeth cut and grind the food, and saliva starts to digest it. ✓**
   - P: What do the teeth and saliva each do?
   - W: The teeth break food into smaller pieces, and saliva is a digestive juice that starts digestion.
3. **No digestion takes place in the mouth; it only chews the food.** [DIG-10]
   - P: Chewing just seems to make the pieces smaller.
   - W: Saliva is a digestive juice, so digestion begins in the mouth.
4. **Muscles churn the food with gastric juice.** [DIG-02]
   - P: The mouth moves the food around a lot.
   - W: That happens in the stomach.

### Hidden recap variants (served only by the hub's recap)

**R1 · Taking in oxygen** [DIG-07]
Which system takes in oxygen and removes carbon dioxide from the body?
1. **The respiratory system ✓**
   - P: Which system is about breathing?
   - W: The respiratory system takes in oxygen and removes carbon dioxide.
2. **The circulatory system, because blood carries oxygen** [DIG-07]
   - P: Oxygen travels in the blood.
   - W: The blood carries oxygen around the body, but the respiratory system takes it in.
3. **The digestive system, because air and food both go in through the mouth** [DIG-07]
   - P: The mouth takes things in.
   - W: The digestive system breaks food down. Air goes to the lungs.
4. **The skeletal system, because bones surround the lungs** [DIG-07]
   - P: The bones of the chest are around the lungs.
   - W: Bones protect the lungs, but taking in oxygen is the respiratory system's job.

**R2 · Carrying things around the body** [DIG-09, DIG-07]
Which system carries digested food, water and oxygen to all parts of the body?
1. **The digestive system** [DIG-09]
   - P: It deals with food.
   - W: The digestive system breaks food down. The circulatory system carries it around the body.
2. **The respiratory system** [DIG-07]
   - P: It deals with oxygen.
   - W: It takes oxygen in. The circulatory system carries it around.
3. **The circulatory system ✓**
   - P: Which system reaches every part of the body through blood vessels?
   - W: The circulatory system carries digested food, water and oxygen to all parts of the body.
4. **The muscular system, because muscles push things around** [DIG-07]
   - P: Muscles make things move.
   - W: Muscles move body parts. The circulatory system carries substances.

**R3 · Protecting soft organs** [DIG-07]
Which system protects soft organs such as the brain, the heart and the lungs?
1. **The muscular system** [DIG-07]
   - P: Muscles are strong.
   - W: The muscular system moves body parts. Bones protect soft organs.
2. **The circulatory system** [DIG-07]
   - P: The blood reaches all these organs.
   - W: The circulatory system carries substances. It doesn't protect organs.
3. **The respiratory system** [DIG-07]
   - P: The lungs are in the chest with the heart.
   - W: The respiratory system takes in oxygen. Bones protect the organs.
4. **The skeletal system ✓**
   - P: Which part of the body is hard enough to protect soft organs?
   - W: The skeletal system supports the body, gives it shape and protects soft organs.

**R4 · The lungs** [DIG-08]
The lungs are part of which system?
1. **The circulatory system, because blood flows through them** [DIG-08]
   - P: Blood passes through the lungs.
   - W: The lungs are where air goes when we breathe in. They belong to the respiratory system.
2. **The respiratory system ✓**
   - P: What do the lungs do with air?
   - W: The nose, windpipe and lungs make up the respiratory system.
3. **The skeletal system, because bones protect them** [DIG-08]
   - P: The bones of the chest surround the lungs.
   - W: Bones protect the lungs, but the lungs belong to the respiratory system.
4. **The digestive system, because air goes in through the mouth** [DIG-08]
   - P: Air and food both pass through the mouth.
   - W: Food goes down the gullet to the stomach. Air goes to the lungs.

**R5 · A part of the digestive system** [DIG-08]
Which of these is part of the digestive system?
1. **The windpipe** [DIG-08]
   - P: It is a tube from the throat, like the gullet.
   - W: The windpipe carries air. It is part of the respiratory system.
2. **The blood vessels** [DIG-08]
   - P: They carry digested food.
   - W: They carry it, but they are part of the circulatory system.
3. **The small intestine ✓**
   - P: Which part does food pass through?
   - W: The small intestine is the part of the digestive system where digestion is completed.
4. **The lungs** [DIG-08]
   - P: They are in the chest, near the gullet.
   - W: The lungs are part of the respiratory system.

**R6 · Parts of one system** [DIG-08]
Which group lists parts of the same system?
1. **nose, windpipe and lungs ✓**
   - P: Which three parts does air pass through?
   - W: All three are parts of the respiratory system.
2. **heart, blood and lungs** [DIG-08]
   - P: Blood flows through the lungs.
   - W: The lungs are respiratory. The heart and blood are circulatory.
3. **mouth, gullet and windpipe** [DIG-08]
   - P: All three start at the mouth or throat.
   - W: The windpipe is respiratory. The mouth and gullet are digestive.
4. **stomach, heart and blood vessels** [DIG-08]
   - P: Digested food goes from the digestive system into the blood.
   - W: The stomach is digestive. The heart and blood vessels are circulatory.

**R7 · How we move** [DIG-07]
Which statement about how we move is correct?
1. **Bones move on their own.** [DIG-07]
   - P: The bones are the parts that move.
   - W: Bones can't move by themselves. The muscular system works with them.
2. **The circulatory system moves the bones.** [DIG-07]
   - P: Blood reaches every bone.
   - W: The circulatory system carries substances. Muscles move the bones.
3. **The skeletal system only protects; it has no part in moving.** [DIG-07]
   - P: The muscles seem to do all the moving.
   - W: The muscular system works with the skeleton. Both are needed.
4. **The muscular system works with the skeletal system to move parts of the body. ✓**
   - P: Which two systems are needed to move an arm?
   - W: Muscles and bones work together to move body parts.

**R8 · Before rice can enter the blood** [DIG-09, DIG-01]
Rice cannot pass into the blood until it has been…
1. **digested into simpler substances ✓**
   - P: What must happen to food before it can pass into the blood?
   - W: Only digested food can pass into the blood. This happens in the small intestine.
2. **stored in the stomach for a day** [DIG-09]
   - P: The stomach holds food.
   - W: Storing food doesn't change it. Digestion does.
3. **chewed into small pieces, and nothing more** [DIG-09]
   - P: Small pieces sound small enough.
   - W: Chewed pieces are still far too big. The food must be digested.
4. **mixed with water in the large intestine** [DIG-01]
   - P: Water seems to help food pass into the blood.
   - W: The large intestine absorbs water from undigested food. Digested food passes into the blood in the small intestine.

**R9 · The digestive system's job** [DIG-09, DIG-07]
Which is the job of the digestive system?
1. **To carry food to all parts of the body** [DIG-09]
   - P: Food has to reach every part somehow.
   - W: The circulatory system carries digested food around the body.
2. **To break food down into simpler substances that can pass into the blood ✓**
   - P: What happens to food in the digestive system?
   - W: The digestive system breaks food down so that it can pass into the blood.
3. **To take in oxygen along with the food** [DIG-07]
   - P: Food and air both go in through the mouth.
   - W: The respiratory system takes in oxygen.
4. **To store food until the body needs it** [DIG-09]
   - P: The stomach holds food for a while.
   - W: The digestive system breaks food down. It isn't a store.

**R10 · Chewing bread** [DIG-10, DIG-04]
Mei chews a piece of bread for a long time. Which statement is correct?
1. **No digestion takes place until the bread reaches her stomach.** [DIG-10]
   - P: Chewing seems to only make the pieces smaller.
   - W: Saliva is a digestive juice. Digestion begins in the mouth.
2. **Digestion begins in her gullet.** [DIG-10]
   - P: The gullet comes next.
   - W: The gullet doesn't digest. Digestion has already begun in the mouth.
3. **Digestion has begun in her mouth. ✓**
   - P: Where does food first meet a digestive juice?
   - W: The teeth break up the bread, and saliva starts to digest it.
4. **The bread is completely digested in her mouth.** [DIG-04]
   - P: She chewed it for a long time.
   - W: Digestion begins in the mouth, but it is completed in the small intestine.

**R11 · Where digestion takes place** [DIG-10, DIG-04, DIG-02]
In which parts of the digestive system does digestion take place?
1. **The stomach and small intestine only** [DIG-10]
   - P: Those are the parts with the most digestive juice.
   - W: Digestion begins in the mouth, with saliva.
2. **The mouth, stomach and small intestine ✓**
   - P: Which parts add a digestive juice?
   - W: Saliva, gastric juice and the juices in the small intestine all digest food.
3. **The stomach only** [DIG-04]
   - P: The stomach seems to do all the digesting.
   - W: The stomach only partly digests food. Digestion begins in the mouth and is completed in the small intestine.
4. **All five parts: mouth, gullet, stomach, small intestine and large intestine** [DIG-02]
   - P: Food passes through all of them.
   - W: No digestion takes place in the gullet or the large intestine.

**R12 · Which part is the large intestine?** [DIG-06, DIG-01, DIG-03] (figure: the same tick table as U8)
Which part is the large intestine?
1. **W** [DIG-06]
   - P: The large intestine seems to finish off the digestion.
   - W: No digestion takes place in the large intestine. W could be the mouth or the stomach.
2. **X** [DIG-01]
   - P: The large intestine seems to just pass the food along.
   - W: The large intestine absorbs water from undigested food. X does nothing to the food.
3. **Y** [DIG-03]
   - P: Both intestines seem to let food into the blood.
   - W: Digested food passes into the blood in the small intestine. Y is the small intestine.
4. **Z ✓**
   - P: Which part takes water out of undigested food?
   - W: Z only absorbs water from undigested food. It is the large intestine.

---

## 7. Build notes

- **Files:** `src/pages/03-systems/P4-digestive-system/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`, order 0. No Three.js: the 3D view stays on the focus page.
- **Page-specific code** (all SVG):
  - E1: body outline with five system overlays.
  - E2: digestive tube step-through, with food squares, fibre strands, dots into a blood vessel and water drops.
  - E4: tick table with Check and Show the answer.
- **Figures for standalone questions:** they use only theme classes and inline `var()` styles.
  - U7: the digestive tube labelled A–D
  - U1: a table
  - U8 and R12: the tick table, with ✓ and ✗ as text
- **Classes:** page classes are prefixed `d-`.
- **Registry:** add DIG-07 to DIG-10 (§5).
- **Linter:** add *skull*, *ribcage* and *rib cage* to `excludedTerms` in `src/syllabus.json` (decision 2).
- **Focus page fix:** reorder the options of `P4-digestive-system-food-journey` v1–v9 so the correct answers spread across (1)–(4). Only the order changes, not the wording.
- **Check after build:**
  - the linter shows no errors
  - the 44px tap-target audit passes, including the E4 table cells
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
  - the Go deeper list shows the focus page
