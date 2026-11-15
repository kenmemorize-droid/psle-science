# Unit spec · P4 Light

Status: **approved and built** · 2026-11-12. The §0 defaults were used: the Sun-position demo is in a Beyond-syllabus toggle and never tested; "almost no shadow"; "lets most / some / no light through".

**Later change (2026-11-12):** the options are not shuffled when shown, and every question had its correct answer at (1). The built `questions.json` now uses all four positions. The wording is unchanged, but the option order in the question bank below no longer matches the page.
Builds: `src/pages/05-energy/P4-light/` → `05-energy/P4-light.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

Review once: approve, or mark changes inline. **§0 lists the decisions I need from you.**

---

## 0. Decisions I need from you

1. **Shadow length through the day.** The sketchnote has a "Sun's position" demo: shadows are long in the morning and evening and shortest at noon, explained by the Earth rotating.
   - The P4 Light outcomes don't include the Sun's position. They list the shape, size and position of objects, and the light-to-object and object-to-screen distances.
   - **Default:** I put the demo in a closed Beyond-syllabus toggle and never test it.
   - Tell me if your school tests it at P4; then I'll move it into the main flow and add questions.
2. **"Lets most light through" makes "almost no shadow".** The sketchnote says "no shadow". Strictly, clear materials still make a very faint shadow, so I've written "almost no shadow".
   - Tell me if the school's answer key expects "no shadow".
3. **Excluded words.** The sketchnote's materials table uses *transparent / translucent / opaque*. The syllabus says these words are not required, so the unit says "lets most / some / no light through" everywhere. No action is needed unless you disagree.

Nothing in these two modules is marked "check against the book", so nothing else needs verifying.

---

## 1. Learning outcomes and where each is covered

| LO | Wording | Cards | Interactives | Questions |
|---|---|---|---|---|
| P4.LGT.C1 | Recognise that an object can be seen when it reflects light or when it is a source of light. *(Note: the law of reflection is not required.)* | L1, L2 | E1, E2 | U1, U2, U3, U9 |
| P4.LGT.C2 | Recognise that light travels in straight lines and thus a shadow is formed when light is completely or partially blocked by an object. | L3, L4 | E3, E4 | U4, U5 |
| P4.LGT.P1 | Investigate the variables that affect shadows formed: shape, size and position of object(s); distance between light source-object and object-screen. *(Note: transparent, translucent, opaque are not required.)* | L5 | E4 | U6, U7, U8 |

Exclusions honoured:
- No angles of reflection anywhere: mirrors only "reflect light into our eyes".
- None of the three excluded material words.
- The Sun's position stays in a Beyond-syllabus toggle (decision 1).

---

## 2. Page outline

1. **Header**: all three LOs.
2. **What you need to know**: cards L1–L5 (§3).
3. **Explore**:
   - E1, Source of light or not? (sort the cards)
   - E2, How do we see it? (dark room and two mirrors)
   - E3, Straight lines (three cards with holes)
   - E4, Shadow lab
4. **Unit check**: U1–U9, with 9 hidden recap variants (R1–R9).
5. **Go deeper**: the existing focus page *Shadows on the move*, listed automatically.
6. **Beyond syllabus** (closed toggle): B1, shadow length through the day (decision 1).
7. **Footer**: prev/next unit within Energy (none built yet), and the hub.

---

## 3. Summary cards (exact text)

### L1 · Sources of light (from the sketchnote)
> A **source of light** gives off its own light. Natural sources: the Sun, stars, lightning, fireflies. Man-made sources: a table lamp, a candle, a traffic light. A torch is a source only while it is switched on.
>
> **The Moon is not a source of light.** It reflects light from the Sun into our eyes.

### L2 · How we see things (from the sketchnote, extended to the LO)
> We see an object when **light from it enters our eyes**.
> - A source of light sends its own light into our eyes.
> - Every other object is seen because it **reflects** light from a source into our eyes. We see a bird in sunlight because it reflects the Sun's light to us.
> - Two mirrors can reflect light from an umbrella around a corner into our eyes, so we can see it even though it is not in a straight line from us.
> - In complete darkness nothing can be seen: no light reaches our eyes.

### L3 · Light travels in straight lines (from the sketchnote)
> Look at a candle through three cards, each with a hole. You can see the flame only when the three holes are in a **straight line**. Move one card and the light is blocked.

### L4 · How shadows form (from the sketchnote, without the excluded words)
> Light travels in straight lines. When an object **completely or partially blocks** the light, a shadow forms behind it, on the side away from the light.

| The material… | Shadow | Examples |
|---|---|---|
| lets **no** light through | dark shadow | wooden chair, stone, book, metal bottle |
| lets **some** light through | lighter shadow | frosted glass, tracing paper, shower curtain |
| lets **most** light through | almost no shadow | clear glass, clear plastic, food wrap |

### L5 · What changes a shadow (from the sketchnote and the syllabus)
> - **Size:** with the torch and screen still, an object **closer to the torch** makes a **bigger** shadow. Closer to the screen, it makes a smaller one. A bigger object makes a bigger shadow. Moving the **screen further** from the object also makes the shadow **bigger**.
> - **Shape:** a shadow has the outline of the object as seen from the light. Turn the object, or move the light, and the shape can change: a round plate seen edge-on makes a thin straight shadow.
> - **Fair test:** change only one of these at a time and keep everything else the same.

---

## 4. Interactives

### E1 · Source of light or not? (LO C1; exercises LGT-07)
Uses the shared sort widget built for Matter.

**Cards (12):**
- Source of light: the Sun · a star · lightning · a firefly · a lit candle · a switched-on table lamp
- Not a source: the Moon · a mirror · a bird in sunlight · a book · a switched-off torch · a shiny spoon

**Reasons after each placement:**
- Each source: "It gives off its own light."
- The Moon: "The Moon reflects light from the Sun. It gives off no light of its own."
- The switched-off torch: "A torch is a source only while it is switched on."
- The other non-sources: "It is seen only because it reflects light into our eyes."

### E2 · How do we see it? (LO C1; exercises LGT-08)
**Scene 1, room:** a lamp, a book and an eye, with a *Lamp on / Lamp off* toggle.
- Lamp on: arrows go from the lamp to the book to the eye.
  - Caption: "Light from the lamp is reflected by the book into the eye, so the book is seen."
- Lamp off: no arrows, and the book is drawn as a dark outline.
  - Caption: "No light reaches the book, so none is reflected into the eye. The book cannot be seen."
- The arrows always point **into** the eye, never out of it.

**Scene 2, around a corner:** a wall hides an umbrella from the eye. A *Put the mirrors in* toggle adds two mirrors, and arrows then run from the umbrella to mirror 1, to mirror 2, to the eye.
- Caption: "The mirrors reflect light from the umbrella into the eye."
- No angles are drawn or mentioned.

### E3 · Straight lines (LO C2; exercises LGT-03)
Rebuilt from the sketchnote: three cards with holes, a candle at one end and an eye at the other.
- A slider moves the middle card.
- Aligned: a dashed ray reaches the eye. Caption: "The holes are in a straight line, so the candle can be seen."
- Moved: the ray stops at the middle card. Caption: "Light travels in straight lines. It cannot bend through the holes, so the candle cannot be seen."

### E4 · Shadow lab (LO C2, P1; exercises LGT-04, LGT-05, LGT-09, LGT-10, LGT-11)
A torch on the left, an object, and a screen on the right, drawn side-on, with the shadow on the screen drawn face-on beside it.

**Controls:**
- **Object:** a round plate, a square card, or a can.
- **Turn:** face-on or edge-on. The plate edge-on gives a thin bar, and the can end-on gives a circle.
- **Material:** lets no / some / most light through. The shadow is dark, lighter, or almost none.
- **Size:** small or big.
- **Sliders:** torch-to-object distance, and object-to-screen distance, in cm.

**Readout:** the shadow's height in cm, worked out from the straight-line geometry, which is hidden from the student.

**"Record this trial"** adds a row to a results table: object · turn · material · size · torch–object · object–screen · shadow height. A note above the table reads "Change one thing at a time."

It is practice only and logs nothing.

### B1 · Beyond syllabus: shadow length through the day (closed toggle; decision 1)
The sketchnote's time-of-day slider (8 am to 5 pm), with its caption ("the shadow is shortest when the Sun is highest…"). It is never tested.

---

## 5. Misconception tags

**New tags:**

| Id | Label | Fix |
|---|---|---|
| LGT-07 | Mixes up which objects are light sources and which only reflect light | A source gives off its own light: the Sun, a lit candle, a firefly. The Moon, mirrors and shiny objects only reflect light from a source. |
| LGT-08 | Mixes up how we see objects (light from the eyes, or only light sources can be seen) | We see an object when light from it enters our eyes. A source gives off its own light; any other object is seen when it reflects light from a source into our eyes. |
| LGT-09 | Thinks a material that lets light through makes no shadow, or an equally dark one | No light through: dark shadow. Some light through: lighter shadow. Most light through: almost no shadow. |
| LGT-10 | Thinks a shadow keeps the same shape whichever way the object faces | A shadow has the outline of the object as seen from the light. Turn the object and the shadow's shape can change. |
| LGT-11 | Thinks moving the screen further from the object makes the shadow smaller | With the torch and object still, the further the screen is from the object, the bigger the shadow. |

**Reused tags:** LGT-03, LGT-04, LGT-05 and LGT-06, from the *Shadows on the move* focus page.

**Count after this unit** (each tag needs 3+ questions, 2+ hidden):
- LGT-07: 6 (3 hidden)
- LGT-08: 6 (2 hidden)
- LGT-09: 3 (2 hidden)
- LGT-10: 3 (2 hidden)
- LGT-11: 3 (2 hidden)

---

## 6. Question bank

Options are numbered (1)–(4). For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · Which are sources of light?** (C1)
A: the Sun · B: the Moon · C: a lit candle · D: a mirror. Which of these are sources of light?
1. **A and C only ✓**
   - P: Ask of each one: does it give off its own light?
   - W: The Sun and a lit candle give off their own light. The Moon and a mirror only reflect light.
2. **A, B and C only** [LGT-07]
   - P: The Moon shines brightly at night, so it seems to make its own light.
   - W: The Moon reflects light from the Sun. It gives off no light of its own.
3. **A, B, C and D** [LGT-07]
   - P: All four look bright, so they all seem to be sources.
   - W: Looking bright is not enough. The Moon and a mirror only reflect light from a source.
4. **A and B only** [LGT-07]
   - P: The Sun and the Moon are both lights in the sky.
   - W: Only the Sun gives off its own light. A lit candle does too, so it is a source.

**U2 · A book in a dark room** (C1)
Ali is in a room with no light at all. He cannot see the book on the table. Why?
1. **No light reaches the book, so none is reflected into his eyes. ✓**
   - P: Ask where the light that lets him see the book would come from.
   - W: A book is seen only when it reflects light from a source into the eyes. With no light, nothing is reflected.
2. **The light from his eyes is too weak to reach the book.** [LGT-08]
   - P: It feels as if we look out at things, so sight seems to go out from the eyes.
   - W: Light does not come out of our eyes. It must travel from the object into the eyes.
3. **The book is not a source of light, so it can never be seen.** [LGT-08]
   - P: Only things that give off light seem to be visible in the dark.
   - W: Books are seen all the time: when there is light, they reflect it into our eyes. In the dark there is none to reflect.
4. **The darkness blocks the light coming from the book.** [LGT-08]
   - P: Darkness seems to be something that gets in the way.
   - W: Darkness is just the absence of light. The book has no light to reflect in the first place.

**U3 · Seeing the Moon** (C1)
We can see the Moon at night because…
1. **it reflects light from the Sun into our eyes. ✓**
   - P: The Moon is not a source of light. Where does its light come from?
   - W: Sunlight falls on the Moon and is reflected to the Earth, into our eyes.
2. **it gives off its own light.** [LGT-07]
   - P: The Moon glows brightly, like a lamp.
   - W: The Moon gives off no light of its own. It reflects the Sun's light.
3. **light from our eyes lights it up.** [LGT-08]
   - P: We look at the Moon, so our eyes seem to reach out to it.
   - W: Light does not come out of our eyes. Light from the Moon must enter our eyes.
4. **it is a source of light at night, but not in the day.** [LGT-07]
   - P: The Moon seems to shine only at night.
   - W: The Moon is never a source of light. It always reflects light from the Sun; at night it simply stands out against the dark sky.

**U4 · Three cards with holes** (C2)
Siti looks through holes in three cards, P, Q and R, and sees a candle flame. Card Q is then moved a little to one side, and she can no longer see the flame. Why?
1. **Light travels in straight lines, and the holes are no longer in a straight line. ✓**
   - P: Picture the path of the light from the flame to her eye.
   - W: Light can reach her eye only along a straight line through all three holes. Moving Q puts card in the way.
2. **The light bends around card Q but cannot bend back into the next hole.** [LGT-03]
   - P: Light seems able to curve a little around things.
   - W: Light does not bend around the card. It travels in straight lines, so card Q simply blocks it.
3. **The light still reaches her eye, but card Q makes it too dark to see.** [LGT-08]
   - P: The flame is still burning, so its light seems to be getting through.
   - W: If light from the flame entered her eye, she would see it. Card Q blocks the light, so none enters her eye.
4. **Light can pass through card Q only when it is in the middle.** [LGT-03]
   - P: The candle was visible when Q was in the middle.
   - W: Light never passes through the card itself. It passes through the hole only when the hole is in line with the others.

**U5 · Tracing paper in front of a torch** (C2)
A torch shines on a sheet of tracing paper held in front of a screen. Tracing paper lets some light through. Which describes the shadow on the screen?
1. **A lighter shadow, because the paper blocks only some of the light ✓**
   - P: The paper partly blocks the light. What does partial blocking give?
   - W: Some light still reaches the screen behind the paper, so the shadow is lighter than one from a book.
2. **No shadow, because light passes through the paper** [LGT-09]
   - P: Light gets through, so there seems to be nothing to make a shadow.
   - W: Only some light gets through. The rest is blocked, so a lighter shadow forms.
3. **A dark shadow, the same as a book's** [LGT-09]
   - P: Any object in the way seems to make the same shadow.
   - W: A book lets no light through and makes a dark shadow. The paper lets some through, so its shadow is lighter.
4. **A shadow on the torch side of the paper** [LGT-02]
   - P: The shadow seems to belong near the light.
   - W: A shadow always forms on the side of the object away from the light.

**U6 · Moving the screen** (P1; figure: results table)
Wei moved the screen further and further from an object. The torch and the object did not move.

| Distance between object and screen (cm) | Height of shadow (cm) |
|---|---|
| 10 | 6 |
| 20 | 9 |
| 30 | 12 |

What can he conclude?
1. **The further the screen is from the object, the bigger the shadow. ✓**
   - P: Read the table in one direction: as the distance goes up, what does the shadow do?
   - W: From 10 cm to 30 cm, the shadow grows from 6 cm to 12 cm.
2. **The further the screen is from the object, the smaller the shadow.** [LGT-11]
   - P: Moving things apart seems to make them look smaller.
   - W: The table shows the opposite: the shadow is biggest when the screen is furthest away.
3. **The size of the shadow depends only on the size of the object.** [LGT-05]
   - P: The object decides the shadow's shape, so it seems to decide its size too.
   - W: The object did not change, yet the shadow changed. The screen's distance made the difference.
4. **He cannot conclude anything, because the object did not move.** [LGT-06]
   - P: An experiment seems to need the object to move.
   - W: He meant to change the screen's distance and keep everything else the same. That is a fair test.

**U7 · Turning a plate** (P1)
A round plate is held between a torch and a screen, with its flat face towards the torch. Its shadow is a circle. The plate is then turned so that its edge faces the torch. What shape is the shadow now?
1. **A thin bar ✓**
   - P: Picture the plate as the torch sees it once it is edge-on.
   - W: Edge-on, the plate blocks only a thin strip of light, so the shadow is a thin bar.
2. **Still a circle, because the plate is round** [LGT-10]
   - P: The plate has not changed, so its shadow seems not to change.
   - W: The shadow has the outline the light sees. Edge-on, that outline is a thin bar, not a circle.
3. **No shadow, because the plate is too thin to block the light** [LGT-10]
   - P: A thin edge does not seem to block anything.
   - W: The edge still blocks a strip of light, so there is a thin shadow.
4. **A bigger circle** [LGT-10]
   - P: Turning the plate seems to spread its shadow out.
   - W: Turning the plate edge-on makes it block less light, and the shadow becomes a thin bar.

**U8 · A fair test on screen distance** (P1; table layout)
Mei wants to find out how the distance between an object and the screen affects the size of the object's shadow.

| Option | She changes | She keeps the same |
|---|---|---|
| (1) ✓ | the distance between the object and the screen | the object, the torch, and the distance between the torch and the object |
| (2) [LGT-06] | the distance between the object and the screen, and the distance between the torch and the object | the torch |
| (3) [LGT-06] | the size of the object | the distances between the torch, the object and the screen |
| (4) [LGT-06] | the distance between the torch and the object | the distance between the object and the screen |

1. ✓
   - P: Change only the distance being asked about; keep everything else the same.
   - W: Any change in the shadow can then come only from the object-to-screen distance.
2. [LGT-06]
   - P: Moving both distances seems to give more results.
   - W: Two things change at once, so she cannot tell which one changed the shadow.
3. [LGT-06]
   - P: Changing the object will certainly change the shadow.
   - W: That tests the size of the object, not the screen distance.
4. [LGT-06]
   - P: It is a distance, so it seems to fit the question.
   - W: That tests the torch-to-object distance, which is a different variable.

**U9 · Seeing around a corner** (C1)
Bala uses two mirrors to see an umbrella around a corner. Which explains how he sees it?
1. **Light from the umbrella is reflected by the two mirrors into his eyes. ✓**
   - P: Follow the light from the umbrella to Bala's eyes.
   - W: Each mirror reflects the light on, so light from the umbrella reaches his eyes even though it is not in a straight line from him.
2. **Light from his eyes travels to the mirrors and then to the umbrella.** [LGT-08]
   - P: He is looking into the mirrors, so his sight seems to travel out.
   - W: Light travels from the umbrella into his eyes, not the other way.
3. **The mirrors give off light that shows him the umbrella.** [LGT-07]
   - P: Mirrors look bright, so they seem to make light.
   - W: Mirrors give off no light of their own. They only reflect light.
4. **Light bends around the corner to reach his eyes.** [LGT-03]
   - P: The light does get around the corner somehow.
   - W: Light travels in straight lines. The mirrors change its direction by reflecting it.

### Hidden recap variants (served only by the hub's recap)

**R1 · Not a source** [LGT-07]
Which of these is not a source of light?
1. **The Moon ✓**
   - P: Which of these only reflects light?
   - W: The Moon reflects light from the Sun and gives off none of its own.
2. **A firefly** [LGT-07]
   - P: An insect does not seem like something that makes light.
   - W: A firefly gives off its own light, so it is a source.
3. **Lightning** [LGT-07]
   - P: Lightning is weather, not an object.
   - W: Lightning gives off its own light, so it is a natural source.
4. **A lit candle** [LGT-07]
   - P: A candle is just wax and a string.
   - W: When it is lit, its flame gives off light, so it is a source.

**R2 · A mirror in the dark** [LGT-07, LGT-08]
Ahmad looks into a mirror in a completely dark room. What does he see?
1. **Nothing, because no light reaches the mirror to be reflected ✓**
   - P: A mirror only reflects light. Is there any light to reflect?
   - W: With no light at all, the mirror has nothing to reflect into his eyes.
2. **His face, because a mirror gives off light** [LGT-07]
   - P: Mirrors always seem bright.
   - W: A mirror gives off no light of its own. It only reflects light.
3. **His face, because light from his eyes is reflected back to him** [LGT-08]
   - P: When he looks into a mirror, he sees his own eyes looking back.
   - W: Light does not come out of our eyes. Without a light source, there is nothing to reflect.
4. **A faint picture, because mirrors store some light** [LGT-07]
   - P: Shiny things seem to keep a little glow.
   - W: Mirrors do not store light. In the dark there is no light to reflect.

**R3 · Seeing an apple** [LGT-08, LGT-07]
How does Lina see a red apple on a table in a sunny room?
1. **The apple reflects light from the Sun into her eyes. ✓**
   - P: The apple is not a source of light. Where does the light that reaches her eyes come from?
   - W: Sunlight falls on the apple, and the apple reflects some of it into her eyes.
2. **Light from her eyes travels to the apple.** [LGT-08]
   - P: She points her eyes at the apple, so her sight seems to go out.
   - W: Light travels from the apple into her eyes, not the other way.
3. **The apple gives off red light.** [LGT-07]
   - P: The apple looks bright red, as if it glows.
   - W: The apple gives off no light of its own. It reflects sunlight.
4. **Sunlight enters her eyes, and her eyes then find the apple.** [LGT-08]
   - P: The room is bright, so her eyes seem to be ready to see anything.
   - W: To see the apple, light must come from the apple into her eyes. That happens because the apple reflects sunlight.

**R4 · The darkest shadow** [LGT-09]
Which object of the same size makes the darkest shadow?
1. **A wooden board, which lets no light through ✓**
   - P: The more light an object blocks, the darker its shadow.
   - W: The board blocks all the light, so its shadow gets no light at all.
2. **A sheet of frosted glass, which lets some light through** [LGT-09]
   - P: Frosted glass looks cloudy, so it seems to block a lot.
   - W: Some light still passes through, so its shadow is lighter.
3. **A sheet of clear plastic, which lets most light through** [LGT-09]
   - P: Plastic is solid, so it seems to make a solid shadow.
   - W: Most light passes through, so it makes almost no shadow.
4. **They all make equally dark shadows, because they are the same size.** [LGT-09]
   - P: Same size seems to mean same shadow.
   - W: How dark a shadow is depends on how much light the object blocks, not only on its size.

**R5 · Three objects, three shadows** [LGT-09, LGT-05]
A book, a sheet of tracing paper and a sheet of clear glass, all the same size, are held in front of a torch one at a time. Which describes their shadows?
1. **Book: dark. Tracing paper: lighter. Glass: almost none. ✓**
   - P: Rank them by how much light each one lets through.
   - W: The book lets no light through, the paper some, and the glass most.
2. **All three shadows are the same, because the objects are the same size.** [LGT-05]
   - P: Size seems to decide the shadow.
   - W: Size decides how big the shadow is. How dark it is depends on how much light gets through.
3. **The glass makes the darkest shadow, because glass is the thickest.** [LGT-09]
   - P: A thicker sheet seems to block more.
   - W: Clear glass lets most light through, so it makes almost no shadow.
4. **The tracing paper makes no shadow, because light passes through it.** [LGT-09]
   - P: Some light gets through, so there seems to be no shadow.
   - W: Only some light gets through. The rest is blocked, so there is a lighter shadow.

**R6 · A cone pointing at the torch** [LGT-10]
A cone is held with its pointed tip facing a torch. What shape is its shadow?
1. **A circle ✓**
   - P: Picture the cone as the torch sees it, tip first.
   - W: Seen from the torch, the cone's outline is its round base, so the shadow is a circle.
2. **A triangle, because a cone looks like a triangle from the side** [LGT-10]
   - P: Cones are usually drawn as triangles.
   - W: That is its side view. The torch sees it tip-on, and from there its outline is a circle.
3. **A small dot, because only the tip faces the torch** [LGT-10]
   - P: Only the point seems to be in the way.
   - W: The whole cone is behind the tip, and its round base blocks a circle of light.
4. **The shape cannot be known without turning the cone.** [LGT-10]
   - P: It seems you need to see it from several sides.
   - W: The shadow's shape is the outline the torch sees right now: a circle.

**R7 · Which object?** [LGT-10]
An object's shadow is a rectangle when the torch shines on its side, and a circle when the torch shines on its end. What could the object be?
1. **A can ✓**
   - P: Find a shape that is round at its ends and rectangular from the side.
   - W: A can is a cylinder: a rectangle from the side, a circle from the end.
2. **A ball** [LGT-10]
   - P: A ball is round, which fits the circle.
   - W: A ball makes a circle from every side, never a rectangle.
3. **A book** [LGT-10]
   - P: A book fits the rectangle.
   - W: A book makes a rectangle from every side, never a circle.
4. **A cone** [LGT-10]
   - P: A cone has a round end, which fits the circle.
   - W: From the side, a cone makes a triangle, not a rectangle.

**R8 · Screen moved closer** [LGT-11, LGT-04]
A toy and a torch stay still. The screen is moved closer to the toy. What happens to the shadow?
1. **It becomes smaller. ✓**
   - P: The shadow spreads out as it travels further. What happens if it travels less far?
   - W: With the screen closer to the toy, the blocked light has less distance to spread, so the shadow is smaller.
2. **It becomes bigger, because the screen is closer.** [LGT-11]
   - P: Things look bigger when you get closer to them.
   - W: The shadow is not looked at from closer. It spreads less before reaching the screen, so it is smaller.
3. **It stays the same size, because the toy has not changed.** [LGT-05]
   - P: The toy is the same, so its shadow seems the same.
   - W: The screen's distance also changes the shadow's size.
4. **It becomes bigger, because the toy is now nearer the torch.** [LGT-04]
   - P: Nearer the torch does make a bigger shadow.
   - W: The toy did not move, so it is no nearer the torch. Only the screen moved closer.

**R9 · Reading the results** [LGT-11, LGT-05]
(Figure: results table. The torch and toy did not move. Distance between toy and screen: 40 cm → shadow 12 cm; 30 cm → 10 cm; 20 cm → 8 cm.)
Which change made the shadow smaller?
1. **Moving the screen closer to the toy ✓**
   - P: Follow the table: as the distance shrinks, what happens to the shadow?
   - W: The shadow fell from 12 cm to 8 cm as the screen came from 40 cm to 20 cm.
2. **Moving the screen further from the toy** [LGT-11]
   - P: Moving away seems to make things smaller.
   - W: The furthest screen (40 cm) gave the biggest shadow.
3. **Changing the size of the toy** [LGT-05]
   - P: A smaller toy would make a smaller shadow.
   - W: The toy was not changed. Only the screen moved.
4. **Moving the screen made no difference** [LGT-11]
   - P: The toy and torch stayed still, so the shadow seems fixed.
   - W: The table shows the shadow changing from 12 cm to 8 cm as the screen moved.

---

## 7. Build notes

- **Files:** `src/pages/05-energy/P4-light/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`, order 0 (the unit page comes before *Shadows on the move*).
- **Page-specific code:** E2, E3, E4 and B1, all SVG.
- **E4 geometry:** shadow height = object height × (torch-to-screen ÷ torch-to-object). Never shown to the student; the formula is on the focus page's Beyond toggle.
- **Registry:** add LGT-07 to LGT-11 (§5).
- **Linter:** "transparent", "translucent", "opaque" and "law of reflection" are excluded terms, and the build will reject them anywhere in the main flow or any question.
- **Check after build:**
  - the linter shows no errors, and its check that every core LO has a question passes
  - the 44px tap-target audit passes
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
