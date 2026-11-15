# Unit spec · P4 Heat

Status: **approved and built** · 2026-11-12. The §0 defaults were used:
- surface area and colour/texture are in a Beyond-syllabus toggle and never tested
- no thermometer ranges
- change of state is qualitative
- no metal-versus-metal comparisons

Built with these changes from this draft:
- **E6:** the practice readings are 33, 42 and 26 °C, not 37 °C, so the station does not give away U10.
- **R10, option (4):** the "(Freezing is a special case…)" aside is dropped, and its P now reads "Cooling seems to make a liquid swell." This keeps water's expansion on freezing out of the question bank.
- **R2, option (1):** "(friction)" is dropped. The card says "rubbing two things together", and friction belongs to P5 Forces.
- **E3, part 2:** a static note, not a second animation.
- **E4:** the ball's mass is shown as a label ("Mass of the ball: 150 g") rather than a drawn balance.

Builds: `src/pages/05-energy/P4-heat/` → `05-energy/P4-heat.html` (unit page)
Follows SPEC.md §3.2 (unit page anatomy), §4 (question contract) and §11.2 (unit build).

Heat is the largest P4 topic: eight core ideas and one practice. This spec is long because every option's rationale is written out. Review once: approve, or mark changes inline. **§0 lists the decisions I need from you.**

---

## 0. Decisions I need from you

1. **Rate of heat transfer (surface area; colour and texture).** The sketchnote (book pp. 67–68) teaches three factors:
   - type of conductor
   - surface area
   - colour and texture (black and dull versus white and shiny)

   The 2023 P4 outcomes include only the first: *good and poor conductors*. **Default:** surface area and colour/texture go into a closed Beyond-syllabus toggle and are never tested. Tell me if your school still tests them at P4.
2. **Thermometer ranges.** The sketchnote's ranges (laboratory about −10 °C to 110 °C; clinical about 35 °C to 42 °C) are marked "check against the book". **Default:** the cards don't give ranges; they only say what each thermometer is for. Send me the book's values if you want them shown.
3. **Change of state stays qualitative.** P4 outcome C7 says heat gain or loss can change the state of matter. The exact temperatures (0 °C, 100 °C) are a P5 Water practice. **Default:** this unit says only "gains heat → melts / boils" and "loses heat → freezes / condenses", with no temperatures.
4. **One exclusion honoured:** "Recall of the rate of heat transfer of specific materials (such as different types of metals) is not required." The unit never compares one metal with another. No action needed.

The sketchnote's third "check" marker (the wax-melting times on p. 67) doesn't matter: the unit uses its own numbers.

---

## 1. Learning outcomes and where each is covered

| LO | Wording | Cards | Interactives | Unit check |
|---|---|---|---|---|
| P4.HEA.C1 | Identify some common sources of heat. | H1 | E1 | U1 |
| P4.HEA.C2 | State that the temperature of an object is a measurement of its degree of hotness. | H2 | E3, E6 | U2, U10 |
| P4.HEA.C3 | State that heat is a form of energy. | H1 | E1 | U3 |
| P4.HEA.C4 | Differentiate between heat and temperature. | H2 | E3 | U2 |
| P4.HEA.C5 | Show an understanding that heat flows from a hotter to a colder object/ region/ place until both reach the same temperature. | H3 | E2 | U4, U5 |
| P4.HEA.C6 | Relate the change in temperature of an object to the gain or loss of heat by the object. | H3 | E2, E6 | U5, U6 |
| P4.HEA.C7 | List some effects of heat gain/loss in our everyday life: contraction / expansion of objects (solid, liquid and gas); change in state of matter. | H4 | E4 | U7, U8 |
| P4.HEA.C8 | Identify good and poor conductors of heat (good: metals; poor: wood, plastics, air, rubber). *(Note: recall of the rate of heat transfer of specific materials is not required.)* | H5 | E5 | U9 |
| P4.HEA.P1 | Measure temperature using a thermometer and a datalogger with temperature/heat sensors. | H2 | E6 | U6, U10 |

---

## 2. Page outline

1. **Header**: all nine LOs.
2. **What you need to know**: cards H1–H5 (§3).
3. **Explore**: E1–E6 (§4).
4. **Unit check**: U1–U10, with 17 hidden recap variants (R1–R17).
5. **Go deeper**: no focus pages for Heat yet. The list says so until one is added.
6. **Beyond syllabus** (closed toggle under E5): B1, surface area and colour/texture (decision 1).
7. **Footer**: prev/next unit within Energy (*Light* comes before), and the hub.

---

## 3. Summary cards (exact text)

### H1 · Heat is energy, and where it comes from (from the sketchnote)
> **Heat is a form of energy.** It cannot be seen, but it can be felt. A **source of heat** is anything that produces heat:
> - the Sun
> - burning things, such as a candle, wood or fuel
> - switched-on electrical appliances, such as an iron, a toaster or an oven
> - rubbing two things together (friction)
>
> Most sources of light are also sources of heat. Ice is **not** a source of "cold": cold is just less heat.

### H2 · Temperature, and how it differs from heat (from the sketchnote and the LO)
> **Temperature** is a measurement of how hot something is: its **degree of hotness**. It is measured in **degrees Celsius (°C)** with a **thermometer**, or with a **datalogger** and a temperature sensor, which records the temperature again and again over time.
>
> **Heat is not the same as temperature.** Two beakers of water are both at 60 °C, but beaker B holds twice as much water as beaker A. They have the **same temperature**, yet B has **more heat**, because more heat was needed to warm more water to 60 °C. With the same amount of water, the hotter one has more heat.

### H3 · Heat flows from hotter to colder (from the sketchnote and the LO)
> Heat always flows from a **hotter** object or place to a **colder** one, **until both reach the same temperature**. Then it stops.
> - An object that **gains heat** rises in temperature.
> - An object that **loses heat** falls in temperature.
>
> A drink with ice in it gets colder because the drink **loses heat to the ice**. No "cold" flows out of the ice.

### H4 · Effects of heat gain and loss (from the sketchnote)
> - **Expansion and contraction.** Solids, liquids and gases **expand** (increase in volume) when they gain heat, and **contract** (decrease in volume) when they lose heat. Their **mass stays the same**.
> - **Everyday uses:**
>   - gaps between railway tracks and concrete slabs
>   - a movable joint at one end of a bridge
>   - overhead cables hung loosely
>   - bottles and cans not filled to the top
>   - heating a metal tyre so it expands, fitting it on a wheel, then letting it cool
> - **Change of state.** Gaining heat can make ice **melt** and water **boil** or **evaporate**. Losing heat can make water **freeze** and water vapour **condense**.

### H5 · Good and poor conductors of heat (from the sketchnote)
> - A **good conductor** lets heat flow through it easily. **Metals** are good conductors.
> - A **poor conductor** does not. **Wood, plastics, air and rubber** are poor conductors.
> - Cooking pots are metal, so heat reaches the food quickly. Pot handles are plastic or wood, so the hand stays safe.
> - A metal bench feels colder than a wooden one at the same temperature, because the metal **conducts heat away from your hand faster**.

---

## 4. Interactives

### E1 · Source of heat or not? (C1, C3; exercises HEA-10, HEA-02)
Uses the shared sort widget.

**Cards (12):**
- Source of heat: the Sun · a burning candle · burning wood · a switched-on iron · a switched-on toaster · rubbing your hands together
- Not a source: an ice cube · a switched-off iron · a glass of water at room temperature · the Moon · snow · a metal spoon

**Reasons after each placement**, for example:
- An ice cube: "Ice gives off no heat. It feels cold because it takes heat from your hand."
- The Moon: "The Moon reflects sunlight. It produces no heat of its own."

### E2 · Heat flows from hot to cold (C5, C6; exercises HEA-02, HEA-03, HEA-04)
**Scene A:**
- **Setup:** a cup of hot water (200 mL, 80 °C) stands in a basin of cold water (800 mL, 20 °C). Each has a thermometer.
- **Time slider:** the two temperatures move towards each other and level off at **32 °C**.
- **Heat-flow arrow:** it points from cup to basin and shrinks to nothing once they are equal.
- **Live graph:** both temperatures plotted against time.
- **Caption when they meet:** "Both are at 32 °C. Heat stops flowing when the temperatures are the same."

**Scene B:**
- **Setup:** an ice cube dropped into a glass of juice.
- **Arrows:** they point **from the juice into the ice**.
- **Caption:** "The juice loses heat to the ice, so its temperature falls. The ice gains heat and melts. Nothing 'cold' flows."

### E3 · Heat or temperature? (C2, C4; exercises HEA-01)
**Part 1, same temperature, different amounts:**
- Two beakers, 50 mL and 100 mL, both start at 25 °C on identical burners.
- Press **Heat to 60 °C**. A timer shows 50 mL reaching 60 °C in 2 minutes and 100 mL in 4 minutes.
- Caption: "Same temperature, but the 100 mL beaker needed twice as much heat, so it now holds more heat."

**Part 2, same amount, different temperatures:**
- 100 mL at 40 °C beside 100 mL at 80 °C.
- Caption: "Same amount, so the hotter one holds more heat."

### E4 · Expand, contract, change state (C7; exercises HEA-05, HEA-06, HEA-09)
1. **Metal ball and ring** (from the sketchnote): *Start / Heat the ball / Cool the ball*.
   - The ball passes through, then can't, then can again.
   - A balance under the ball shows the **same mass** every time.
2. **Balloon on a bottle** (from the sketchnote): *Hot water / Ice*. The balloon inflates, then deflates.
   - Caption: "The air in the bottle expands when it gains heat and contracts when it loses heat."
3. **Everyday uses**: tap-to-reveal tiles from the sketchnote:
   - railway tracks
   - concrete pavement
   - pipes
   - bridges
   - overhead cables
   - bottles and cans
   - wheel and tyre
4. **Change of state**: a three-step strip, ice ⇄ water ⇄ water vapour.
   - Arrows to the right are labelled "gains heat: melts / boils or evaporates".
   - Arrows to the left are labelled "loses heat: freezes / condenses".
   - Tapping an arrow shows an everyday example: ice cream melting, a puddle drying, water droplets on a cold glass.

### E5 · Good and poor conductors (C8; exercises HEA-07)
1. **Spoon test:**
   - Metal, plastic and wooden spoons stand in hot water, each with a bead of wax on its handle.
   - The wax on the metal spoon melts first; the others take much longer.
   - Caption: "Metal is a good conductor of heat. Plastic and wood are poor conductors."
2. **Touch test:**
   - A metal bench and a wooden bench in the same room. A thermometer shows both at 28 °C, and a hand rests on each.
   - Arrows show heat leaving the hand faster into the metal.
   - Caption: "Both are at the same temperature. The metal feels colder because it conducts heat away from your hand faster."

**B1 · Beyond syllabus (closed toggle):** surface area and colour/texture (decision 1).
- From the sketchnote: the two pots on a hot plate, the elephant's ears, and black versus shiny tins in the sun (with its data table).
- Never tested.

### E6 · Measuring temperature (P1, C2, C6; exercises HEA-08)
1. **Read the thermometer:**
   - A laboratory thermometer marked 20 °C to 50 °C, with long marks every 5 °C and short marks every 1 °C.
   - Three readings to practise. The student picks the reading from four chips and gets feedback: "Find what one small mark is worth first."
2. **Datalogger:**
   - A temperature sensor in the cooling cup from E2.
   - Press **Record**: the datalogger plots a point every minute for 20 minutes.
   - Caption: "A datalogger records the temperature by itself, again and again, and draws the graph."

---

## 5. Misconception tags (all new)

| Id | Label | Fix |
|---|---|---|
| HEA-01 | Thinks heat and temperature are the same thing | Temperature is how hot something is. Heat is energy. More water at the same temperature holds more heat; the same water at a higher temperature holds more heat. |
| HEA-02 | Thinks "cold" is something that flows or is given out | Only heat flows, always from hotter to colder. Something feels or becomes cold because it loses heat. |
| HEA-03 | Thinks heat flow stops before, or goes past, the point where both temperatures are equal | Heat flows from hotter to colder until both reach the same temperature, somewhere in between, and then stops. |
| HEA-04 | Mixes up heat gain and heat loss when a temperature changes | Temperature rises: the object gained heat. Temperature falls: it lost heat. |
| HEA-05 | Thinks mass changes when something expands or contracts | Expanding or contracting changes the volume, not the mass. |
| HEA-06 | Mixes up when things expand and when they contract | Gaining heat: expand. Losing heat: contract. Solids, liquids and gases all do this. |
| HEA-07 | Mixes up good and poor conductors of heat | Metals are good conductors: heat flows through them easily. Wood, plastics, air and rubber are poor conductors. Metal feels cold because it conducts heat away from your hand fast. |
| HEA-08 | Misreads a thermometer, or trusts touch to measure temperature | Find what one small mark is worth, then count from the nearest number. Touch only tells you how fast heat leaves your hand; use a thermometer. |
| HEA-09 | Mixes up heat gain and heat loss in a change of state | Melting, boiling and evaporating need heat gain. Freezing and condensing happen through heat loss. |
| HEA-10 | Mixes up what is and is not a source of heat | A source of heat produces heat: the Sun, burning, switched-on appliances, friction. Ice, the Moon and switched-off appliances produce none. |

**Reused tags:** MTR-06 (thinks heat is matter) in U3 and R8, and MTR-09 (mixes up apparatus for mass and volume) in R16.

**Count after this unit** (each tag needs 3+ questions, 2+ hidden):

| Tag | Questions | Hidden |
|---|---|---|
| HEA-01 | 7 | 4 |
| HEA-02 | 13 | 9 |
| HEA-03 | 3 | 2 |
| HEA-04 | 5 | 2 |
| HEA-05 | 3 | 2 |
| HEA-06 | 4 | 3 |
| HEA-07 | 3 | 2 |
| HEA-08 | 3 | 2 |
| HEA-09 | 3 | 2 |
| HEA-10 | 4 | 3 |

---

## 6. Question bank

Options are numbered (1)–(4). For each wrong option, **P** is why a student would choose it and **W** is why it is wrong. For the correct option (✓), P is how to reach it and W is why it is correct.

### Unit check (shown on the page)

**U1 · Which are sources of heat?** (C1)
A: the Sun · B: a burning candle · C: a switched-on iron · D: an ice cube. Which of these are sources of heat?
1. **A, B and C only ✓**
   - P: Ask of each one: does it produce heat?
   - W: The Sun, a burning candle and a switched-on iron all produce heat. An ice cube produces none.
2. **A, B, C and D** [HEA-02]
   - P: Ice seems to give out cold, so it seems to be a source of something.
   - W: Ice produces no heat, and there is no such thing as "cold" flowing out. Ice feels cold because it takes heat from your hand.
3. **A and B only** [HEA-10]
   - P: Only things with a flame or the Sun seem to give heat.
   - W: A switched-on iron is an electrical appliance that produces heat, so it is a source too.
4. **A only** [HEA-10]
   - P: The Sun is the one heat source everyone knows.
   - W: Burning things and switched-on appliances also produce heat.

**U2 · Two beakers at 60 °C** (C2, C4)
Beaker A has 100 mL of water at 60 °C. Beaker B has 50 mL of water at 60 °C. Which statement is correct?
1. **They have the same temperature, but A has more heat. ✓**
   - P: Temperature is how hot; heat is energy. Which one depends on the amount of water?
   - W: Both are equally hot (60 °C), but warming 100 mL to 60 °C took more heat than warming 50 mL.
2. **They have the same amount of heat, because they have the same temperature.** [HEA-01]
   - P: The same reading seems to mean the same heat.
   - W: Temperature does not tell you the amount of heat. More water at the same temperature holds more heat.
3. **A has a higher temperature, because it has more water.** [HEA-01]
   - P: More water seems to mean more hotness.
   - W: The thermometer reads 60 °C in both. The amount of water does not change how hot it is.
4. **B has more heat, because a smaller amount heats up faster.** [HEA-01]
   - P: The smaller beaker warms up quicker, which seems to mean more heat.
   - W: It warms quicker because it needs less heat. It holds less heat than A.

**U3 · What is heat?** (C3)
Which statement about heat is correct?
1. **Heat is a form of energy. ✓**
   - P: Recall what heat is, not how it feels.
   - W: Heat is energy. It can flow from one object to another and change their temperature.
2. **Heat is the temperature of an object.** [HEA-01]
   - P: Heat and temperature both seem to mean how hot something is.
   - W: Temperature measures how hot something is. Heat is the energy that flows.
3. **Heat is a substance that flows like water.** [MTR-06]
   - P: Heat "flows", so it seems to be some kind of stuff.
   - W: Heat is not matter. It has no mass and takes up no space.
4. **Cold is a form of energy that flows into warm objects.** [HEA-02]
   - P: Cold things seem to give out coldness.
   - W: Only heat flows. Cold is simply less heat.

**U4 · A cup of hot tea** (C5)
A cup of hot tea is left on a table in a room at 30 °C. What happens to the tea?
1. **It loses heat to the surroundings until it reaches 30 °C. ✓**
   - P: Heat flows from hotter to colder. When does it stop?
   - W: Heat flows from the hot tea to the cooler room until both are at the same temperature.
2. **It loses heat until it is colder than the room.** [HEA-03]
   - P: Once it starts cooling, it seems to keep cooling.
   - W: Heat stops flowing when the tea reaches the room's temperature. It cannot cool below it this way.
3. **Cold from the room flows into the tea.** [HEA-02]
   - P: The room is cooler, so its coolness seems to move in.
   - W: Nothing called "cold" flows. Heat flows out of the tea.
4. **It stays hot, because heat stays inside liquids.** [HEA-03]
   - P: Hot drinks often stay warm for a while.
   - W: Heat keeps flowing out until the tea and the room are at the same temperature.

**U5 · Ice in juice** (C5, C6)
Ice cubes are put into a glass of juice, and the juice becomes colder. Why?
1. **The juice loses heat to the ice. ✓**
   - P: Which is hotter, the juice or the ice? Which way does heat flow?
   - W: Heat flows from the warmer juice to the colder ice. The juice loses heat, so its temperature falls.
2. **The ice gives coldness to the juice.** [HEA-02]
   - P: Ice seems to spread its cold.
   - W: There is no "coldness" to give. The juice gets colder by losing heat.
3. **The juice gains heat from the ice.** [HEA-04]
   - P: The ice and juice are swapping something, and heat is the word used.
   - W: Gaining heat would make the juice warmer. It got colder, so it lost heat.
4. **Both the ice and the juice gain heat.** [HEA-04]
   - P: The ice melts, so heat seems to be involved everywhere.
   - W: The ice gains heat, but the juice loses it. That is why the juice's temperature falls.

**U6 · A datalogger graph** (C6, P1; figure: line graph)
A temperature sensor and datalogger recorded the temperature of a beaker of hot water left in a room. The temperature fell from 80 °C at 0 min to 30 °C at 20 min, then stayed at 30 °C.
What happened to the water between 0 and 20 minutes?
1. **It lost heat, so its temperature fell. ✓**
   - P: The line goes down. Is the water gaining or losing heat?
   - W: A falling temperature means the water was losing heat to the cooler room.
2. **It gained coldness from the room.** [HEA-02]
   - P: The room is cooler, so it seems to give coolness.
   - W: Cold does not flow. The water lost heat.
3. **It gained heat, because its temperature changed.** [HEA-04]
   - P: Something changed, and heat seems to be the cause of all change.
   - W: A temperature that falls means heat was lost, not gained.
4. **Its heat stayed the same; only its temperature changed.** [HEA-01]
   - P: Heat and temperature seem to be separate, so one could change alone.
   - W: The temperature fell because heat left the water. The two go together.

**U7 · The ball and the ring** (C7)
A metal ball just passes through a metal ring. After the ball is heated, it cannot pass through. Which statement is correct?
1. **The ball expanded when it gained heat, and its mass stayed the same. ✓**
   - P: Gaining heat makes things expand. Does expanding change the mass?
   - W: The ball's volume increased, so it no longer fits. Its mass did not change.
2. **The ball expanded and became heavier.** [HEA-05]
   - P: Bigger seems to mean heavier.
   - W: Expansion increases volume, not mass.
3. **The ring contracted, because the ball became hot.** [HEA-06]
   - P: Something must have got smaller to stop the ball.
   - W: The ring was not heated. The ball expanded because it gained heat.
4. **The ball contracted when it gained heat.** [HEA-06]
   - P: Heating seems to tighten things.
   - W: Gaining heat makes things expand, not contract.

**U8 · A melting ice block** (C7)
A block of ice on a plate slowly melts in a room. Which statement is correct?
1. **The ice gains heat from the surroundings and melts. ✓**
   - P: Melting is a change of state. Does it need heat gain or heat loss?
   - W: The warmer room gives heat to the ice. Gaining heat makes it melt.
2. **The ice loses heat and melts.** [HEA-09]
   - P: The ice seems to "give up" something as it disappears.
   - W: Melting needs heat gain. Losing heat would keep it frozen.
3. **The ice loses its coldness to the air.** [HEA-02]
   - P: The ice seems to give its cold away.
   - W: There is no coldness to lose. The ice gains heat.
4. **The surroundings gain heat from the ice.** [HEA-04]
   - P: Heat seems to come out of the ice as it changes.
   - W: The ice is colder than the room, so heat flows into the ice, not out of it.

**U9 · The metal and wooden spoons** (C8)
A metal spoon and a wooden spoon have been in the same room for a long time. The metal spoon feels colder to touch. Why?
1. **Metal is a good conductor of heat, so it conducts heat away from the hand faster. ✓**
   - P: Both have been in the room for ages. Are their temperatures really different?
   - W: Both are at room temperature. The metal takes heat from your hand faster, so it feels colder.
2. **The metal spoon is at a lower temperature.** [HEA-07]
   - P: It feels colder, so it seems to be colder.
   - W: Both have reached room temperature. The difference is how fast heat leaves your hand.
3. **Wood is a good conductor of heat, so it feels warmer.** [HEA-07]
   - P: The wood feels warm, so it seems to pass heat well.
   - W: Wood is a poor conductor. It takes heat from your hand slowly, so it does not feel cold.
4. **The metal gives out coldness.** [HEA-02]
   - P: Cold metal seems to spread cold to your hand.
   - W: Nothing gives out cold. The metal takes heat from your hand.

**U10 · Reading a thermometer** (P1, C2; figure: a thermometer scale from 20 °C to 50 °C, long marks every 5 °C, short marks every 1 °C, level at 37 °C)
What temperature does the thermometer show?
1. **37 °C ✓**
   - P: Each short mark is 1 °C. Count up from 35.
   - W: The liquid stops two short marks above 35, at 37 °C.
2. **35 °C** [HEA-08]
   - P: 35 is the nearest number to the top of the liquid.
   - W: The liquid is above the 35 mark. Count the small marks above it.
3. **38 °C** [HEA-08]
   - P: Counted the marks, but started the count at the 35 mark itself.
   - W: The 35 mark is zero extra. Two marks above it is 37.
4. **47 °C** [HEA-08]
   - P: Read from the 45 mark instead of the 35 mark.
   - W: Check which labelled number is just below the liquid: it is 35, not 45.

### Hidden recap variants (served only by the hub's recap)

**R1 · Which is a source of heat?** [HEA-10, HEA-02]
1. **A switched-on hairdryer ✓**
   - P: Which one produces heat right now?
   - W: A switched-on electrical appliance produces heat.
2. **A bag of ice** [HEA-02]
   - P: Ice seems to give out cold.
   - W: Ice produces no heat, and cold is not something that is given out.
3. **A switched-off toaster** [HEA-10]
   - P: A toaster is a heating appliance.
   - W: It produces heat only while it is switched on.
4. **The Moon** [HEA-10]
   - P: The Moon shines like the Sun.
   - W: The Moon only reflects sunlight. It produces no heat of its own.

**R2 · Rubbing your hands** [HEA-10, HEA-02]
Rubbing your hands together makes them warm. What is the source of heat?
1. **The rubbing (friction) between the hands ✓**
   - P: What is happening that was not happening before?
   - W: Rubbing two things together produces heat.
2. **The air around the hands** [HEA-10]
   - P: The air touches the hands.
   - W: The air is not producing heat. The rubbing is.
3. **There is no source; the hands were already warm.** [HEA-10]
   - P: Hands are always warm.
   - W: The hands get warmer while you rub, so the rubbing is producing heat.
4. **The cold leaves the hands.** [HEA-02]
   - P: Warming up seems to mean the cold goes away.
   - W: Cold does not move. The hands gain heat produced by the rubbing.

**R3 · A bathtub and a cup** [HEA-01]
A bathtub of water and a cup of water are both at 40 °C. Which statement is correct?
1. **They have the same temperature, but the bathtub has more heat. ✓**
   - P: Which depends on the amount of water: temperature or heat?
   - W: Both are equally hot, but the bathtub's much larger amount of water holds far more heat.
2. **They have the same amount of heat.** [HEA-01]
   - P: The same temperature seems to mean the same heat.
   - W: More water at the same temperature holds more heat.
3. **The cup has a higher temperature, because it is smaller.** [HEA-01]
   - P: Small things seem to heat up more.
   - W: Both thermometers read 40 °C. Size does not change the reading.
4. **The bathtub has a higher temperature, because it has more water.** [HEA-01]
   - P: More water seems to mean hotter.
   - W: Both are at 40 °C. The bathtub has more heat, not a higher temperature.

**R4 · Same water, different temperatures** [HEA-01]
Beakers A and B each hold 200 mL of water. A is at 30 °C and B is at 70 °C. Which has more heat?
1. **B ✓**
   - P: The amounts are the same. Which one is hotter?
   - W: With the same amount of water, the hotter one holds more heat.
2. **A** [HEA-01]
   - P: A is cooler, so it seems to hold heat better.
   - W: A is cooler, so it has less heat.
3. **They have the same heat, because they hold the same amount of water.** [HEA-01]
   - P: The same amount seems to mean the same heat.
   - W: The temperature matters too. B is hotter, so it has more heat.
4. **It cannot be known without measuring their heat on a balance.** [HEA-01]
   - P: Amounts are usually measured on a balance.
   - W: A balance measures mass. Same amount and higher temperature means more heat.

**R5 · A hot block in water** [HEA-03, HEA-02]
A metal block at 90 °C is put into water at 30 °C in a closed, well-insulated container. What happens?
1. **Heat flows from the block to the water until both reach the same temperature, between 30 °C and 90 °C. ✓**
   - P: Heat flows from hotter to colder. When does it stop, and where?
   - W: The block cools and the water warms until they are equal. They meet somewhere in between.
2. **They swap: the block ends at 30 °C and the water at 90 °C.** [HEA-03]
   - P: The heat seems to move completely from one to the other.
   - W: Heat stops flowing as soon as the temperatures are equal. They meet in between.
3. **Both end at 90 °C.** [HEA-03]
   - P: The hot block seems to heat everything to its own temperature.
   - W: The block loses heat as the water gains it, so the block's temperature falls.
4. **Cold flows from the water into the block.** [HEA-02]
   - P: The water is colder, so it seems to cool the block by sending cold.
   - W: Only heat flows, from the block into the water.

**R6 · A cold drink on the table** [HEA-03, HEA-02]
A cold drink at 5 °C is left on a table in a room at 30 °C. Hours later, what is its temperature most likely to be?
1. **30 °C ✓**
   - P: Heat flows into the drink until when?
   - W: The drink gains heat from the room until it reaches the room's temperature.
2. **5 °C, because it stays cold** [HEA-03]
   - P: Cold drinks seem to stay cold.
   - W: Heat keeps flowing in from the warmer room until the temperatures are equal.
3. **Higher than 30 °C** [HEA-03]
   - P: It keeps warming up, so it seems it could go past the room temperature.
   - W: Heat stops flowing once the drink reaches 30 °C. It cannot go higher this way.
4. **Lower than 5 °C, because it gives its cold to the room** [HEA-02]
   - P: The drink seems to spread its cold out.
   - W: The drink gains heat. It does not give out cold.

**R7 · Datalogger readings** [HEA-04, HEA-02, HEA-01]
(Figure: a table of datalogger readings. 0 min: 25 °C · 5 min: 40 °C · 10 min: 55 °C.) What happened to the water?
1. **It gained heat. ✓**
   - P: The temperature went up.
   - W: A rising temperature means the water gained heat.
2. **It lost heat.** [HEA-04]
   - P: Heat seems to be used up as time passes.
   - W: Losing heat would make the temperature fall. It rose.
3. **It lost coldness.** [HEA-02]
   - P: Getting warmer seems to mean losing cold.
   - W: There is no coldness. The water gained heat.
4. **Only its temperature changed, not its heat.** [HEA-01]
   - P: Heat and temperature are different things.
   - W: They are different, but a temperature rise is caused by gaining heat.

**R8 · Heated water's mass** [HEA-05, MTR-06]
A bottle of water is warmed and the water expands. What happens to the mass of the water?
1. **It stays the same. ✓**
   - P: Expanding changes the volume. Does anything get added?
   - W: No water is added or lost, so the mass stays the same.
2. **It increases, because the volume increased.** [HEA-05]
   - P: Bigger seems to mean heavier.
   - W: The water takes up more space but has the same mass.
3. **It decreases, because the water spreads out.** [HEA-05]
   - P: Spread-out things seem lighter.
   - W: Spreading out changes the volume only. The mass stays the same.
4. **It increases, because the water gained heat, and heat has mass.** [MTR-06]
   - P: Something was added, so the mass seems to go up.
   - W: Heat is energy, not matter. It has no mass.

**R9 · Railway tracks** [HEA-06, HEA-05]
Why are small gaps left between sections of a railway track?
1. **So the tracks can expand on hot days without bending ✓**
   - P: When do metal tracks get bigger?
   - W: The tracks gain heat on hot days and expand. The gaps give them room.
2. **So the tracks can contract on hot days** [HEA-06]
   - P: The tracks change size in the heat.
   - W: Gaining heat makes them expand, not contract.
3. **So the tracks become lighter when they expand** [HEA-05]
   - P: Gaps seem to save weight.
   - W: Expansion does not change mass. The gaps are space to expand into.
4. **So the tracks have room to expand on cold nights** [HEA-06]
   - P: Temperature changes at night too.
   - W: On cold nights the tracks lose heat and contract. They expand on hot days.

**R10 · Bottles not filled to the top** [HEA-06, HEA-05]
Why are bottled drinks never filled right to the top?
1. **To leave room for the drink to expand when it gains heat ✓**
   - P: What happens to a liquid when it gets warmer?
   - W: The drink expands when it gains heat. The space stops the bottle from bursting.
2. **To leave room for the drink to contract on hot days** [HEA-06]
   - P: Liquids change size in the heat.
   - W: Gaining heat makes the drink expand, not contract.
3. **So the drink weighs less when it is hot** [HEA-05]
   - P: A hot drink seems lighter.
   - W: The mass does not change when the drink expands.
4. **Because liquids expand when they are cooled** [HEA-06]
   - P: Water expands when it freezes, so cooling seems to make liquids expand.
   - W: A cooled liquid loses heat and contracts. (Freezing is a special case, not taught at P4.)

**R11 · A cloth drying in the sun** [HEA-09, HEA-02]
A wet cloth hung in the sun becomes dry. What happens to the water?
1. **It gains heat and changes into water vapour. ✓**
   - P: Liquid water changes to a gas. Does that need heat gain or heat loss?
   - W: The water gains heat from the Sun and the air, and evaporates into water vapour.
2. **It loses heat and changes into water vapour.** [HEA-09]
   - P: The water seems to give something up as it disappears.
   - W: Evaporation needs heat gain, not heat loss.
3. **It loses heat and soaks deeper into the cloth.** [HEA-09]
   - P: The water seems to hide inside the cloth.
   - W: The water leaves the cloth as water vapour, after gaining heat.
4. **It gains coldness from the air.** [HEA-02]
   - P: Drying can feel cool.
   - W: There is no coldness. The water gains heat and evaporates.

**R12 · Drops on a cold glass** [HEA-09, HEA-02]
Water droplets form on the outside of a glass of iced water. What happens to the water vapour in the air?
1. **It loses heat to the cold glass and changes into water. ✓**
   - P: The gas becomes liquid. Does that need heat gain or heat loss?
   - W: The water vapour touches the cold glass, loses heat and condenses into droplets.
2. **It gains heat from the glass and changes into water.** [HEA-09]
   - P: Something changes state, so heat seems to be gained.
   - W: The glass is colder, so the water vapour loses heat to it.
3. **It gains coldness from the glass and changes into water.** [HEA-02]
   - P: The cold glass seems to pass its cold on.
   - W: Nothing cold flows. The water vapour loses heat.
4. **It loses heat and changes into ice.** [HEA-09]
   - P: Losing heat seems to mean freezing.
   - W: It loses enough heat to condense into liquid water, not to freeze.

**R13 · A frying pan handle** [HEA-07]
Which material is most suitable for the handle of a frying pan?
1. **Plastic ✓**
   - P: The handle must stop heat from reaching your hand.
   - W: Plastic is a poor conductor, so little heat flows along the handle to your hand.
2. **Steel, because it is a good conductor of heat** [HEA-07]
   - P: Good conductor sounds like a good thing.
   - W: A good conductor would carry heat straight to your hand. The handle needs a poor conductor.
3. **Copper, because metals are good for cooking** [HEA-07]
   - P: The pan is metal, so the handle seems fine as metal.
   - W: The pan is metal so heat reaches the food. The handle needs the opposite.
4. **Aluminium, because it is light** [HEA-07]
   - P: A light handle is easy to hold.
   - W: Aluminium is a metal and a good conductor, so the handle would get hot.

**R14 · A metal cooking pot** [HEA-07, HEA-10, HEA-02]
Why are cooking pots made of metal?
1. **Metal is a good conductor of heat, so heat flows quickly to the food. ✓**
   - P: What does a pot need to do with the heat from the stove?
   - W: Heat flows easily through metal from the flame to the food.
2. **Metal is a poor conductor, so it keeps the heat in.** [HEA-07]
   - P: Keeping heat in sounds useful for cooking.
   - W: Metal is a good conductor. Heat flows through it easily.
3. **Metal produces heat of its own.** [HEA-10]
   - P: Metal pots get very hot.
   - W: The pot gets hot because heat flows into it from the stove. It is not a source.
4. **Metal stops cold from getting into the food.** [HEA-02]
   - P: Pots protect the food.
   - W: Cold does not flow. The pot lets heat flow into the food.

**R15 · Another thermometer** [HEA-08]
(Figure: a thermometer scale from 0 °C to 50 °C, labels every 10 °C, short marks every 2 °C, level at 24 °C.) What temperature does it show?
1. **24 °C ✓**
   - P: Each short mark is 2 °C. Count up from 20.
   - W: The liquid is two marks above 20: 20 + 2 + 2 = 24 °C.
2. **22 °C** [HEA-08]
   - P: Counted each short mark as 1 °C.
   - W: There are five spaces between 20 and 30, so each short mark is 2 °C.
3. **26 °C** [HEA-08]
   - P: Counted one mark too many.
   - W: Count the spaces above 20, not the marks including 20.
4. **34 °C** [HEA-08]
   - P: Started counting from the 30 label.
   - W: The labelled number just below the liquid is 20, not 30.

**R16 · Measuring how hot** [HEA-08, MTR-09]
Which should you use to find out how hot a beaker of water is?
1. **A thermometer ✓**
   - P: How hot something is is its temperature.
   - W: A thermometer measures temperature in °C.
2. **A measuring cylinder** [MTR-09]
   - P: It is the usual apparatus for water.
   - W: A measuring cylinder measures volume, not temperature.
3. **An electronic balance** [MTR-09]
   - P: Balances give a reading for anything.
   - W: A balance measures mass, not temperature.
4. **Your hand** [HEA-08]
   - P: You can feel whether water is hot.
   - W: Touch is not reliable. It only tells you how fast heat moves to or from your hand.

**R17 · A thermometer moved into cold water** [HEA-04, HEA-06, HEA-02]
A thermometer is moved from warm water into cold water, and its reading falls. Why?
1. **The liquid in the thermometer loses heat and contracts. ✓**
   - P: The reading falls. What happens to a liquid that loses heat?
   - W: In the cold water, the liquid in the thermometer loses heat, contracts, and moves down the tube.
2. **The liquid gains heat and contracts.** [HEA-04]
   - P: Something changed, so heat seems to be gained.
   - W: The water is colder, so the liquid loses heat.
3. **The liquid gains coldness from the water.** [HEA-02]
   - P: Cold water seems to make things cold by passing cold on.
   - W: Nothing cold flows. The liquid loses heat.
4. **The liquid loses heat and expands.** [HEA-06]
   - P: Losing heat changes the liquid's size.
   - W: Losing heat makes it contract, which is why the level falls.

---

## 7. Build notes

- **Files:** `src/pages/05-energy/P4-heat/{meta.json, body.html, page.js, page.css, questions.json}`.
- **meta:** `type: unit`, `uses: ["classify"]`, order 0.
- **Page-specific code:**
  - E2: two-body cooling plus a graph.
  - E3: two heating timers.
  - E4: ball and ring, balloon, tiles, state strip.
  - E5: spoon wax race, touch test.
  - E6: thermometer reading and datalogger plot.
  - B1: sketchnote panels.

  All SVG.
- **Figures for standalone questions:**
  - U6: line graph
  - U10 and R15: thermometer scales
  - R7: table
- **Registry:** add HEA-01 to HEA-10 (§5).
- **Check after build:**
  - the linter shows no errors, and its check that every core LO has a question passes
  - the 44px tap-target audit passes
  - the page works at 375, 768 and 1280px in all three palettes
  - a wrong answer reaches the hub's recap
  - the page works from disk in Chrome and Edge
