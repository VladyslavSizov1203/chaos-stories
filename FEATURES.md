# Chaos Stories — Feature Breakdown & Tickets

> Detailed feature specifications for MVP
> For review by: @product-owner, @game-designer, @frontend-lead, @backend-lead

---

## Document Purpose

This document breaks down the MVP Epic into:
- **Features** — Major capabilities
- **Tickets** — Actionable tasks with user stories + acceptance criteria
- **Technical Notes** — For @frontend-lead and @backend-lead review
- **Game Design Notes** — For @game-designer validation

---

## The Two Keys (Reference for All Features)

Every feature must support:

```
KEY #1: HUMOR — Every choice must be TEMPTING to click
KEY #2: REPLAYABILITY — Different options = Different results
```

---

# FEATURE 1: Core Game Loop

> **The heart of the game. Scene → Choice → Outcome → Next Scene**

**Priority:** P0 (Must Have)
**Dependencies:** None (foundational)
**Estimated Tickets:** 6

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CORE GAME LOOP                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐                                       │
│  │ SCENE        │  Player reads story text              │
│  │ DISPLAY      │  Sees background image                │
│  └──────┬───────┘                                       │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │ CHOICES      │  2-4 tappable buttons                 │
│  │ PRESENTED    │  Character-specific option visible    │
│  └──────┬───────┘                                       │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │ PLAYER       │  Tap to select                        │
│  │ CHOOSES      │  (or timer auto-selects)              │
│  └──────┬───────┘                                       │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │ OUTCOME      │  Brief result text (2-3 sec)          │
│  │ SHOWN        │  Chaos meter updates                  │
│  └──────┬───────┘                                       │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │ NEXT SCENE   │  Transition to next scene             │
│  │ OR ENDING    │  Or show ending if complete           │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Ticket 1.1: Scene Container Component

### User Story
```
As a player,
I want to see each scene with an immersive full-screen background,
So that I feel engaged in the story world.
```

### Acceptance Criteria
```
Given I am playing the game,
When a scene loads,
Then the background image fills the entire screen.

Given a scene has a background image,
When it displays,
Then it uses CSS cover behavior (no letterboxing).

Given I am on mobile,
When viewing a scene,
Then there is a semi-transparent overlay for text readability.

Given I am on desktop,
When viewing a scene,
Then the content is centered and not awkwardly stretched.
```

### Technical Notes

**@frontend-lead:**
- Full-viewport container (`100vh`, `100vw`)
- Background image with `object-fit: cover`
- Dark gradient overlay for text contrast
- Consider `next/image` for optimization
- Mobile: edge-to-edge, Desktop: max-width container

**@backend-lead:**
- Scene data includes `backgroundImage` path
- Images stored in `/public/images/scenes/`
- Preload next scene's image during current scene

---

## Ticket 1.2: Story Text Display Component

### User Story
```
As a player,
I want to read the story text clearly against any background,
So that I understand what's happening in the scene.
```

### Acceptance Criteria
```
Given I am on a scene,
When text displays,
Then it has sufficient contrast against the background (WCAG AA).

Given the scene text,
When I read it,
Then font size is comfortable on mobile (min 18px).

Given long text (4+ sentences),
When displayed,
Then it remains readable without scrolling.

Given the text area,
When viewing,
Then it has appropriate padding from screen edges (min 16px).
```

### Technical Notes

**@frontend-lead:**
- Position: top-third of screen or centered
- Text shadow or backdrop blur for readability
- Max 4 sentences per scene (enforce in content)
- Responsive font sizing: `clamp(18px, 4vw, 24px)`

**@game-designer:**
- Text must be readable in under 10 seconds
- Leave 15 seconds for choice consideration
- Shorter = funnier (comedy loves brevity)

---

## Ticket 1.3: Choice Buttons Component

### User Story
```
As a player,
I want to see clear, tappable choice buttons,
So that I can easily make my decisions.
```

### Acceptance Criteria
```
Given I am on a scene,
When choices load,
Then I see 2-4 distinct buttons.

Given I am on mobile,
When I view choices,
Then buttons are full-width and min 56px height.

Given a choice button,
When I tap it,
Then there is immediate visual feedback (pressed state).

Given a choice is selected,
When processing,
Then all buttons become disabled (prevent double-tap).

Given a character-specific choice,
When displayed,
Then it has a visual indicator (icon or border color).
```

### Technical Notes

**@frontend-lead:**
- Stack vertically at bottom of screen
- Touch target: min 48px height, recommend 56px
- States: default, hover, pressed, disabled
- Character choices: Rupert = ⚔️ icon / warm border, Milo = 🔮 icon / cool border
- Transition: scale down slightly on press

**@game-designer:**
- Choice text max 8 words
- All choices visible without scrolling
- No "correct" visual distinction — all equal weight
- Character choice should feel optional, not mandatory

---

## Ticket 1.4: Outcome Display Component

### User Story
```
As a player,
I want to see the immediate result of my choice,
So that I understand what happened before moving on.
```

### Acceptance Criteria
```
Given I select a choice,
When outcome displays,
Then brief text appears on screen (2-4 sentences max).

Given outcome is displayed,
When I wait,
Then it automatically dismisses after 2-3 seconds.

Given outcome appears,
When animating,
Then it fades in smoothly (CSS transition).

Given outcome is showing,
When viewing,
Then choice buttons are hidden.
```

### Technical Notes

**@frontend-lead:**
- Overlay on current scene (don't change background yet)
- Fade in: 200ms, hold: 2500ms, fade out: 300ms
- Position: center of screen
- Consider slight zoom or vignette effect for drama

**@game-designer:**
- Outcome must deliver on the humor promise
- This is where the PUNCHLINE lands
- Surprising outcomes > predictable outcomes
- Include chaos change indicator (+10 🔥)

---

## Ticket 1.5: Scene Transition Logic

### User Story
```
As a player,
I want smooth transitions between scenes,
So that the story feels continuous and engaging.
```

### Acceptance Criteria
```
Given I've seen an outcome,
When transition triggers,
Then the next scene loads within 500ms.

Given I'm transitioning,
When the new scene loads,
Then there's a brief fade or slide animation.

Given I reach a scene marked as ending,
When transition logic runs,
Then I'm taken to the Ending Screen instead.

Given I'm mid-transition,
When waiting,
Then I cannot interact with UI (prevent glitches).
```

### Technical Notes

**@frontend-lead:**
- Crossfade between scenes (300ms)
- Preload next scene's background image
- Lock interactions during transition
- Consider subtle parallax or zoom for polish

**@backend-lead:**
- `nextSceneId` determines next scene
- Check `isEnding` flag on scene
- Track transition in game state to prevent double-transitions

---

## Ticket 1.6: Game Flow State Machine

### User Story
```
As a developer,
I want a clear state machine for game flow,
So that transitions are predictable and bug-free.
```

### Acceptance Criteria
```
Given the game state machine,
When I check states,
Then valid states are: menu, character_select, scene_display,
     showing_choices, showing_outcome, transitioning, ending.

Given I'm in scene_display state,
When choices appear,
Then state changes to showing_choices.

Given I'm in showing_choices state,
When I pick a choice,
Then state changes to showing_outcome.

Given I'm in showing_outcome state,
When timeout completes,
Then state changes to transitioning.

Given invalid state transition is attempted,
When it fires,
Then it's ignored and logged (defensive programming).
```

### Technical Notes

**@backend-lead:**
```typescript
type GameFlowState =
  | 'menu'
  | 'character_select'
  | 'scene_display'
  | 'showing_choices'
  | 'showing_outcome'
  | 'transitioning'
  | 'ending';

// Valid transitions:
// menu → character_select
// character_select → scene_display
// scene_display → showing_choices
// showing_choices → showing_outcome
// showing_outcome → transitioning
// transitioning → scene_display | ending
// ending → menu (restart)
```

---

# FEATURE 2: Timer System

> **Creates party game energy through time pressure**

**Priority:** P0 (Must Have)
**Dependencies:** Feature 1 (Core Game Loop)
**Estimated Tickets:** 4

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                    TIMER SYSTEM                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PHASE 1: CALM (25-11 seconds)                          │
│  ┌────────────────────────────────────┐                 │
│  │ ████████████████████░░░░░░░░░░░░░░ │  White/neutral  │
│  │           "18"                      │  Normal pace    │
│  └────────────────────────────────────┘                 │
│                                                          │
│  PHASE 2: WARNING (10-6 seconds)                        │
│  ┌────────────────────────────────────┐                 │
│  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░ │  Yellow         │
│  │           "8"                       │  Subtle pulse   │
│  └────────────────────────────────────┘                 │
│                                                          │
│  PHASE 3: CRITICAL (5-1 seconds)                        │
│  ┌────────────────────────────────────┐                 │
│  │ ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  Red            │
│  │           "3"                       │  Fast pulse     │
│  └────────────────────────────────────┘                 │
│                                                          │
│  TIMEOUT (0 seconds)                                    │
│  → Auto-select first choice                             │
│  → Show "Time's up!" indicator                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Ticket 2.1: Countdown Timer Component

### User Story
```
As a player,
I want to see a countdown timer when making choices,
So that I feel urgency and excitement.
```

### Acceptance Criteria
```
Given choices are displayed,
When timer starts,
Then it counts down from 25 seconds.

Given the timer,
When I view it,
Then remaining time is clearly visible (number + visual bar).

Given timer reaches 0,
When it expires,
Then the first choice is automatically selected.

Given I make a choice,
When I tap,
Then timer stops immediately.
```

### Technical Notes

**@frontend-lead:**
- Display: number (large, readable) + progress bar
- Position: above choices or top of screen
- Update every 100ms for smooth progress bar
- Use `requestAnimationFrame` or CSS animation for smoothness

**@backend-lead:**
- Timer state: `startTime`, `duration`, `isRunning`
- Calculate remaining on render, don't store ticks
- Clear timer on unmount to prevent memory leaks

---

## Ticket 2.2: Timer Urgency States

### User Story
```
As a player,
I want visual feedback as time runs low,
So that I feel increasing pressure to decide.
```

### Acceptance Criteria
```
Given timer has 25-11 seconds,
When displayed,
Then it shows calm state (white/neutral color).

Given timer has 10-6 seconds,
When displayed,
Then it shows warning state (yellow, subtle pulse).

Given timer has 5-1 seconds,
When displayed,
Then it shows critical state (red, fast pulse animation).

Given timer transitions between states,
When colors change,
Then transition is smooth (not jarring).
```

### Technical Notes

**@frontend-lead:**
```css
/* Urgency states */
.timer-calm { color: white; }
.timer-warning {
  color: #fbbf24; /* yellow-400 */
  animation: pulse 1s infinite;
}
.timer-critical {
  color: #ef4444; /* red-500 */
  animation: pulse 0.3s infinite;
}
```

**@game-designer:**
- Warning at 10 sec = gives 40% of time as "pressure"
- Critical at 5 sec = final push to decide
- Test if these thresholds feel fun, not stressful
- Consider screen edge glow for additional urgency

---

## Ticket 2.3: Auto-Select on Timeout

### User Story
```
As a player,
I want the game to continue even if I don't choose in time,
So that I'm not stuck and the chaos continues.
```

### Acceptance Criteria
```
Given timer reaches 0,
When timeout occurs,
Then first choice option is automatically selected.

Given timeout selection happens,
When it triggers,
Then a "Time's up!" indicator briefly shows.

Given timeout outcome,
When displayed,
Then it's the same as if player manually picked first option.

Given timeout occurs,
When tracking,
Then it's logged for analytics (future: understand timeout rate).
```

### Technical Notes

**@backend-lead:**
- Timeout triggers same flow as manual selection
- First choice = `choices[0]`
- Track `wasTimeout: boolean` in choice history

**@game-designer:**
- First option should never be the "worst" chaos option
- Timeout shouldn't feel like punishment
- Consider: "You hesitated too long..." flavor text
- Timeout rate target: <20% of choices

---

## Ticket 2.4: Timer Integration with Game Flow

### User Story
```
As a developer,
I want the timer properly integrated with game state,
So that it starts, stops, and resets at correct moments.
```

### Acceptance Criteria
```
Given game state changes to showing_choices,
When state updates,
Then timer starts from 25 seconds.

Given player makes a choice,
When choice is selected,
Then timer immediately stops.

Given game state changes to showing_outcome,
When state updates,
Then timer is hidden.

Given transitioning to new scene,
When new choices appear,
Then timer resets to 25 seconds and starts fresh.
```

### Technical Notes

**@backend-lead:**
```typescript
// Timer hook interface
interface UseTimer {
  timeRemaining: number;
  isRunning: boolean;
  urgencyLevel: 'calm' | 'warning' | 'critical';
  start: () => void;
  stop: () => void;
  reset: () => void;
}

// Start timer when entering showing_choices state
// Stop timer when choice is made
// Reset timer on scene transition
```

---

# FEATURE 3: Chaos Meter

> **Visual consequence tracker that makes choices feel meaningful**

**Priority:** P0 (Must Have)
**Dependencies:** Feature 1 (Core Game Loop)
**Estimated Tickets:** 4

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CHAOS METER                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  LEVEL 1: CALM (0-25)                                   │
│  ┌────────────────────────────────────┐                 │
│  │ 😌  ████░░░░░░░░░░░░░░░░░░░░░░░░░░ │  Green          │
│  │     "Everything's under control"   │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
│  LEVEL 2: SUSPICIOUS (26-50)                            │
│  ┌────────────────────────────────────┐                 │
│  │ 🤨  ████████████░░░░░░░░░░░░░░░░░░ │  Yellow         │
│  │     "People are noticing..."       │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
│  LEVEL 3: ON FIRE (51-75)                               │
│  ┌────────────────────────────────────┐                 │
│  │ 🔥  ████████████████████░░░░░░░░░░ │  Orange         │
│  │     "Things are getting wild"      │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
│  LEVEL 4: GUARDS INCOMING (76-100)                      │
│  ┌────────────────────────────────────┐                 │
│  │ 🚨  ████████████████████████████░░ │  Red            │
│  │     "TOTAL CHAOS"                  │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Ticket 3.1: Chaos Meter UI Component

### User Story
```
As a player,
I want to see my current chaos level at all times,
So that I understand the consequences of my choices.
```

### Acceptance Criteria
```
Given I am playing,
When I look at the screen,
Then the Chaos Meter is visible (corner position, not obstructing).

Given chaosLevel is 0-25,
When meter renders,
Then it shows 😌 Calm state with green color.

Given chaosLevel is 26-50,
When meter renders,
Then it shows 🤨 Suspicious state with yellow color.

Given chaosLevel is 51-75,
When meter renders,
Then it shows 🔥 On Fire state with orange color.

Given chaosLevel is 76-100,
When meter renders,
Then it shows 🚨 Guards Incoming state with red color.
```

### Technical Notes

**@frontend-lead:**
- Position: top-right corner (mobile + desktop)
- Size: compact but readable (emoji 24px, bar 80px wide)
- Semi-transparent background so it doesn't clash
- Always on top (z-index above scene content)

```tsx
interface ChaosMeterProps {
  level: number; // 0-100
}

const getChaosTier = (level: number) => {
  if (level <= 25) return { emoji: '😌', label: 'Calm', color: 'green' };
  if (level <= 50) return { emoji: '🤨', label: 'Suspicious', color: 'yellow' };
  if (level <= 75) return { emoji: '🔥', label: 'On Fire', color: 'orange' };
  return { emoji: '🚨', label: 'Guards Incoming', color: 'red' };
};
```

---

## Ticket 3.2: Chaos Meter Animations

### User Story
```
As a player,
I want visual feedback when chaos changes,
So that I feel the impact of my choices.
```

### Acceptance Criteria
```
Given chaos increases,
When meter updates,
Then bar animates smoothly to new position (300ms).

Given chaos changes by 10+,
When it updates,
Then there's a brief flash/pulse effect.

Given chaos level changes tier (e.g., Calm → Suspicious),
When it crosses threshold,
Then emoji changes with a bounce animation.

Given chaos changes,
When outcome shows,
Then "+15 🔥" indicator appears briefly near meter.
```

### Technical Notes

**@frontend-lead:**
```css
/* Smooth bar transition */
.chaos-bar-fill {
  transition: width 300ms ease-out;
}

/* Tier change animation */
.chaos-emoji-change {
  animation: bounce 400ms ease-out;
}

/* Change indicator */
.chaos-change-indicator {
  animation: fadeUpOut 1s forwards;
}
```

**@game-designer:**
- Big chaos spikes (+15 or more) deserve drama
- Consider brief screen shake for massive spikes
- Tier changes are milestones — celebrate/warn them

---

## Ticket 3.3: Chaos Calculation Logic

### User Story
```
As a developer,
I want consistent chaos calculation,
So that choices affect the meter predictably.
```

### Acceptance Criteria
```
Given a choice with chaosChange: +10,
When player selects it,
Then chaosLevel increases by 10.

Given chaosLevel would exceed 100,
When calculated,
Then it's clamped to 100.

Given chaosLevel would go below 0,
When calculated,
Then it's clamped to 0.

Given a Milo choice with chaosVariance: {min: 5, max: 20},
When selected,
Then chaos change is random within that range.

Given a Rupert Tourette's event triggers,
When it fires,
Then additional chaos is added to the choice's base chaos.
```

### Technical Notes

**@backend-lead:**
```typescript
function calculateChaos(
  currentChaos: number,
  choice: Choice,
  randomEvent?: RandomEvent
): { newChaos: number; change: number } {
  let change = choice.chaosChange;

  // Apply variance for Milo's unreliable magic
  if (choice.chaosVariance) {
    const { min, max } = choice.chaosVariance;
    change = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Add random event chaos (Tourette's, spell backfire)
  if (randomEvent) {
    change += randomEvent.chaosChange;
  }

  // Clamp to 0-100
  const newChaos = Math.max(0, Math.min(100, currentChaos + change));

  return { newChaos, change };
}
```

---

## Ticket 3.4: Chaos-Based Ending Selection

### User Story
```
As a player,
I want my ending to reflect my chaos level,
So that my choices feel like they mattered.
```

### Acceptance Criteria
```
Given I reach an ending scene with chaosLevel 0-33,
When ending is selected,
Then I get "The Quiet Victory" (low chaos ending).

Given I reach an ending scene with chaosLevel 34-66,
When ending is selected,
Then I get "The Messy Success" (medium chaos ending).

Given I reach an ending scene with chaosLevel 67-100,
When ending is selected,
Then I get "The Glorious Disaster" (high chaos ending).

Given I made 3+ Rupert-specific choices,
When ending is selected,
Then "The Legend" ending is possible (overrides chaos-based).

Given I made 3+ Milo-specific choices,
When ending is selected,
Then "The Wealthy Fraud" ending is possible (overrides chaos-based).
```

### Technical Notes

**@backend-lead:**
```typescript
function selectEnding(
  chaosLevel: number,
  character: 'rupert' | 'milo',
  characterChoiceCount: number,
  endings: Ending[]
): Ending {
  // Check for character-exclusive ending first
  if (characterChoiceCount >= 3) {
    const exclusive = endings.find(e =>
      e.conditions.characterOnly === character
    );
    if (exclusive) return exclusive;
  }

  // Fall back to chaos-based ending
  return endings.find(e =>
    !e.conditions.characterOnly &&
    chaosLevel >= (e.conditions.chaosMin || 0) &&
    chaosLevel <= (e.conditions.chaosMax || 100)
  )!;
}
```

**@game-designer:**
- Character endings require COMMITMENT (3+ choices)
- This rewards players who lean into a character
- Chaos endings are the "default" path
- All endings should feel earned, not random

---

# FEATURE 4: Character System

> **Two playable characters with distinct abilities and choices**

**Priority:** P1 (Important)
**Dependencies:** Feature 1 (Core Game Loop)
**Estimated Tickets:** 5

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                  CHARACTER SYSTEM                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CHARACTER SELECT SCREEN                                │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │                 │    │                 │            │
│  │    ⚔️ RUPERT    │    │    🔮 MILO      │            │
│  │    Warrior      │    │    Mage         │            │
│  │                 │    │                 │            │
│  │  "Brave, loud,  │    │  "Clever, greedy│            │
│  │   drinks too    │    │   spells might  │            │
│  │   much"         │    │   backfire"     │            │
│  │                 │    │                 │            │
│  │  [ SELECT ]     │    │  [ SELECT ]     │            │
│  └─────────────────┘    └─────────────────┘            │
│                                                          │
│  IN-GAME CHOICES                                        │
│  ┌─────────────────────────────────────────┐           │
│  │ [Shared] "Talk to the guard"            │           │
│  │ [Shared] "Try to sneak past"            │           │
│  │ [⚔️ Rupert] "Headbutt him"              │           │
│  │ [🔮 Milo] "Cast sleep... probably"      │           │
│  └─────────────────────────────────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Ticket 4.1: Character Data Structure

### User Story
```
As a developer,
I want a clear data structure for characters,
So that character abilities and traits are consistently applied.
```

### Acceptance Criteria
```
Given the character data,
When I read a character object,
Then it contains: id, name, class, description, portrait, abilities.

Given Rupert's data,
When I check his traits,
Then he has: Tourette's event chance, drinking references.

Given Milo's data,
When I check his traits,
Then he has: spell backfire chance, theft/scam options.

Given both characters,
When compared,
Then they have the same structure but different values.
```

### Technical Notes

**@backend-lead:**
```typescript
interface Character {
  id: 'rupert' | 'milo';
  name: string;
  class: string;
  description: string;
  portrait: string;
  ability: {
    name: string;
    description: string;
  };
  traits: {
    tourettesChance?: number;  // Rupert: 0.2-0.3
    spellBackfireChance?: number;  // Milo: 0.3-0.5
  };
}

const CHARACTERS: Character[] = [
  {
    id: 'rupert',
    name: 'Rupert',
    class: 'Warrior',
    description: 'Brave, loyal, brain of potato. Has Tourette\'s and drinks too much.',
    portrait: '/images/characters/rupert.png',
    ability: {
      name: "Warrior's Way",
      description: 'Physical and confrontational options'
    },
    traits: {
      tourettesChance: 0.25
    }
  },
  {
    id: 'milo',
    name: 'Milo',
    class: 'Mage',
    description: 'Fake genius, loves money, spells are unreliable.',
    portrait: '/images/characters/milo.png',
    ability: {
      name: 'Questionable Magic',
      description: 'Risky spells and theft opportunities'
    },
    traits: {
      spellBackfireChance: 0.4
    }
  }
];
```

---

## Ticket 4.2: Character Selection UI

### User Story
```
As a player,
I want to choose my character before starting,
So that I can experience different story paths.
```

### Acceptance Criteria
```
Given I tap "Start Game",
When the character select screen appears,
Then I see both Rupert and Milo as options.

Given I view a character option,
When I look at it,
Then I see: portrait, name, class, brief description.

Given I tap on a character,
When selected,
Then that character is highlighted visually.

Given I've selected a character,
When I tap "Begin Adventure",
Then the game starts with my chosen character.
```

### Technical Notes

**@frontend-lead:**
- Two-column layout on mobile (side by side)
- Card-style selection with border highlight
- Portrait: 120x120px or larger
- Quick toggle feel — not a complicated menu
- Consider swipe between characters on mobile

---

## Ticket 4.3: Character-Specific Choice Filtering

### User Story
```
As a player,
I want to see choices unique to my character,
So that playing as Rupert feels different from Milo.
```

### Acceptance Criteria
```
Given I'm playing as Rupert,
When choices display,
Then I see shared choices + Rupert-only choices.

Given I'm playing as Milo,
When choices display,
Then I see shared choices + Milo-only choices.

Given a Rupert-only choice,
When displayed,
Then it has a ⚔️ indicator.

Given a Milo-only choice,
When displayed,
Then it has a 🔮 indicator.
```

### Technical Notes

**@backend-lead:**
```typescript
function getAvailableChoices(
  scene: Scene,
  character: 'rupert' | 'milo'
): Choice[] {
  return scene.choices.filter(choice =>
    !choice.characterOnly || choice.characterOnly === character
  );
}
```

**@frontend-lead:**
- Character choices: distinct border color + icon
- Rupert: warm tone (orange/red border), ⚔️ icon
- Milo: cool tone (purple/blue border), 🔮 icon
- Don't make character choices look "special" or "better" — just different

---

## Ticket 4.4: Random Character Events (Tourette's / Backfire)

### User Story
```
As a player,
I want unexpected character-specific events,
So that my character's flaws create surprises.
```

### Acceptance Criteria
```
Given I'm playing as Rupert,
When certain scenes trigger,
Then there's a 20-30% chance of a Tourette's outburst.

Given Tourette's triggers,
When it fires,
Then extra text appears and chaos increases.

Given I'm playing as Milo and pick a magic choice,
When the spell resolves,
Then there's a 30-50% chance of a backfire effect.

Given a spell backfires,
When it happens,
Then the outcome text includes the side effect.
```

### Technical Notes

**@backend-lead:**
```typescript
interface RandomEvent {
  type: 'tourettes' | 'spell_backfire';
  text: string;
  chaosChange: number;
}

function checkForRandomEvent(
  character: Character,
  choice: Choice
): RandomEvent | null {
  // Rupert's Tourette's
  if (character.id === 'rupert' && character.traits.tourettesChance) {
    if (Math.random() < character.traits.tourettesChance) {
      return {
        type: 'tourettes',
        text: getRandomTourettesOutburst(),
        chaosChange: Math.floor(Math.random() * 10) + 10 // +10 to +20
      };
    }
  }

  // Milo's spell backfire (only on magic choices)
  if (character.id === 'milo' && choice.isMagic && character.traits.spellBackfireChance) {
    if (Math.random() < character.traits.spellBackfireChance) {
      return {
        type: 'spell_backfire',
        text: getRandomBackfireEffect(),
        chaosChange: Math.floor(Math.random() * 10) + 5 // +5 to +15
      };
    }
  }

  return null;
}
```

**@game-designer:**
- Tourette's outbursts should be FUNNY, not offensive
- Spell backfires should be creative side effects
- These events add chaos + humor, not punishment
- Player should laugh when these trigger, not groan

---

## Ticket 4.5: Character Choice Tracking

### User Story
```
As a player,
I want my character-specific choices tracked,
So that I can unlock my character's exclusive ending.
```

### Acceptance Criteria
```
Given I pick a Rupert-specific choice,
When it's selected,
Then my Rupert choice count increases by 1.

Given I pick a Milo-specific choice,
When it's selected,
Then my Milo choice count increases by 1.

Given I reach an ending with 3+ character choices,
When ending is calculated,
Then character-exclusive ending becomes available.

Given I'm on the ending screen,
When displayed,
Then I see how many character-specific choices I made.
```

### Technical Notes

**@backend-lead:**
```typescript
interface GameState {
  // ... other fields
  characterChoiceCount: number;
  choiceHistory: Array<{
    choiceId: string;
    wasCharacterSpecific: boolean;
  }>;
}

// Increment on character choice
if (choice.characterOnly === gameState.selectedCharacter) {
  gameState.characterChoiceCount++;
}
```

---

# FEATURE 5: Ending System

> **Satisfying conclusions with replay hooks**

**Priority:** P1 (Important)
**Dependencies:** Feature 1, Feature 3, Feature 4
**Estimated Tickets:** 3

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────┐
│                   ENDING SCREEN                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                  │    │
│  │              🏆 THE GLORIOUS DISASTER            │    │
│  │                                                  │    │
│  │     The tavern is on fire. The guards are       │    │
│  │     coming. But somehow, against all odds,      │    │
│  │     you're holding the artifact and running.    │    │
│  │                                                  │    │
│  │     This will be a story told for generations.  │    │
│  │     Mostly by wanted posters.                   │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  FINAL CHAOS: 🚨 87/100                                 │
│  CHARACTER CHOICES: ⚔️ 4/12                             │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   PLAY AGAIN     │  │  TRY OTHER HERO  │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                          │
│  You've discovered 2 of 5 endings                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Ticket 5.1: Ending Screen UI

### User Story
```
As a player,
I want a satisfying ending screen,
So that I feel closure and see the result of my choices.
```

### Acceptance Criteria
```
Given I reach an ending,
When the screen loads,
Then I see the ending title prominently displayed.

Given the ending screen,
When displayed,
Then I see the ending description/narrative.

Given the ending screen,
When displayed,
Then I see my final chaos level with emoji indicator.

Given the ending screen,
When I look for actions,
Then I see "Play Again" and "Try Other Hero" buttons.

Given I tap "Play Again",
When it triggers,
Then game resets with same character.

Given I tap "Try Other Hero",
When it triggers,
Then game resets and goes to character select.
```

### Technical Notes

**@frontend-lead:**
- Full-screen with ending-appropriate background
- Large title with dramatic typography
- Ending text: readable, centered, max 5 sentences
- Stats section: chaos level + character choices
- Two CTAs equally weighted
- Consider confetti/particles for high-chaos endings

---

## Ticket 5.2: Ending Data Structure

### User Story
```
As a developer,
I want a clear data structure for endings,
So that the right ending is shown based on player choices.
```

### Acceptance Criteria
```
Given the endings data,
When I check structure,
Then each ending has: id, title, description, conditions.

Given ending conditions,
When specified,
Then they can include: chaosMin, chaosMax, characterOnly, requiresCharacterChoices.

Given 5 endings exist,
When I list them,
Then there are 3 shared + 2 character-exclusive.
```

### Technical Notes

**@backend-lead:**
```typescript
interface Ending {
  id: string;
  title: string;
  description: string;
  image?: string;
  conditions: {
    chaosMin?: number;
    chaosMax?: number;
    characterOnly?: 'rupert' | 'milo';
    requiresCharacterChoices?: number;
  };
}

const ENDINGS: Ending[] = [
  {
    id: 'quiet-victory',
    title: 'The Quiet Victory',
    description: 'Against all odds, you kept it together...',
    conditions: { chaosMin: 0, chaosMax: 33 }
  },
  {
    id: 'messy-success',
    title: 'The Messy Success',
    description: 'You got what you came for. The collateral damage? Acceptable.',
    conditions: { chaosMin: 34, chaosMax: 66 }
  },
  {
    id: 'glorious-disaster',
    title: 'The Glorious Disaster',
    description: 'Everything is on fire. You are a LEGEND.',
    conditions: { chaosMin: 67, chaosMax: 100 }
  },
  {
    id: 'the-legend',
    title: 'The Legend',
    description: 'Through sheer chaos, Rupert becomes a folk hero...',
    conditions: { characterOnly: 'rupert', requiresCharacterChoices: 3 }
  },
  {
    id: 'wealthy-fraud',
    title: 'The Wealthy Fraud',
    description: 'Milo scams his way to riches. For now...',
    conditions: { characterOnly: 'milo', requiresCharacterChoices: 3 }
  }
];
```

---

## Ticket 5.3: Ending Unlocks & Replay Hooks

### User Story
```
As a player,
I want to know there are other endings to discover,
So that I'm motivated to replay.
```

### Acceptance Criteria
```
Given I reach an ending,
When displayed,
Then I see "You've discovered X of 5 endings."

Given I haven't seen all endings,
When viewing count,
Then it teases undiscovered content.

Given I got a chaos-based ending,
When shown,
Then there's a hint: "Try more/less chaos next time?"

Given I didn't get character-exclusive ending,
When shown,
Then there's a hint: "Commit to [character]'s style for a special ending."
```

### Technical Notes

**@backend-lead:**
- Store discovered endings in localStorage (MVP)
- Track: `{ discoveredEndings: string[] }`
- Future: sync to account when auth exists

**@game-designer:**
- The "X of 5" counter is a powerful replay hook
- Don't reveal ending names until discovered
- Hints should tease without spoiling

---

# FEATURE 6: Story Content

> **The actual comedy — scenes, choices, outcomes**

**Priority:** P0 (Must Have)
**Dependencies:** All other features (consumes data structures)
**Estimated Tickets:** 4

---

## Ticket 6.1: Story JSON Data Structure

### User Story
```
As a developer,
I want a complete JSON schema for story content,
So that writers can create content in a consistent format.
```

### Acceptance Criteria
```
Given the story JSON,
When I validate it,
Then it contains: storyId, title, startSceneId, characters, scenes, endings.

Given each scene,
When I check it,
Then it has: id, text, backgroundImage, choices array.

Given each choice,
When I check it,
Then it has: id, text, choiceType (flavor/branch), nextSceneId, chaosChange, outcomeText.

Given a branch choice,
When it's different from other choices,
Then it leads to a different nextSceneId than flavor choices in the same scene.

Given a convergence scene,
When it can be reached from multiple paths,
Then it may have arrivalVariants with context-specific text.

Given the complete story,
When I trace all paths,
Then every choice leads to a valid scene or ending.
```

### Technical Notes

**@backend-lead:**
See full schema in `backend-lead.md` agent documentation.

File location: `/src/data/stories/tavern-heist.json`

---

## Ticket 6.2: Write Story Script (~15 Scenes)

### User Story
```
As a player,
I want an engaging 10-15 minute story,
So that I have fun and want to replay for different outcomes.
```

### Acceptance Criteria
```
Given the story,
When mapped out,
Then it contains ~15 total scenes (~12 per playthrough) across 3 acts.

Given the branching,
When analyzed,
Then at least 3 distinct endings are reachable via different paths.

Given each scene,
When read,
Then text is concise (2-4 sentences max).

Given choices,
When presented,
Then they feel meaningfully different and FUNNY.

Given the story,
When played through,
Then it takes 10-15 minutes.
```

### Technical Notes

**@story-writer:**
- Act 1 (1-3): Setup, introduce situation
- Act 2 (4-8): Escalation, complications
- Act 3 (9-12): Climax, resolution
- Every choice should make player think "I HAVE to see what happens"

---

## Ticket 6.3: Write Character-Specific Content

### User Story
```
As a player,
I want Rupert and Milo to feel genuinely different,
So that replaying as the other character is worthwhile.
```

### Acceptance Criteria
```
Given each scene,
When playing as Rupert,
Then there's at least one Rupert-specific choice available.

Given each scene,
When playing as Milo,
Then there's at least one Milo-specific choice available.

Given Rupert choices,
When I read them,
Then they involve: physical action, blunt honesty, drinking.

Given Milo choices,
When I read them,
Then they involve: magic (unreliable), theft, scams, lying.

Given character-specific outcomes,
When resolved,
Then they lead to different next scenes or different chaos values.
```

### Technical Notes

**@story-writer:**
- Rupert voice: short sentences, no subtlety, accidental offense
- Milo voice: big words used wrong, always an angle, pretends competence
- Character choices should be TEMPTING, not obviously worse

---

## Ticket 6.4: Write 5 Endings

### User Story
```
As a player,
I want each ending to feel satisfying and distinct,
So that discovering all 5 is rewarding.
```

### Acceptance Criteria
```
Given "The Quiet Victory",
When reached,
Then it celebrates low-chaos success with a twist.

Given "The Messy Success",
When reached,
Then it acknowledges the chaos while claiming victory.

Given "The Glorious Disaster",
When reached,
Then it revels in maximum chaos as legendary achievement.

Given "The Legend" (Rupert),
When reached,
Then Rupert's chaos becomes folk hero status.

Given "The Wealthy Fraud" (Milo),
When reached,
Then Milo's schemes pay off (temporarily).

Given any ending,
When read,
Then it's funny and makes player want to see other endings.
```

### Technical Notes

**@story-writer:**
- Endings are the PAYOFF for the whole experience
- Each ending should have a joke/twist
- Even "bad" chaos outcomes should feel like LEGENDARY failure
- Final line of each ending = memorable punchline

---

# FEATURE 7: Home Screen

> **Entry point to the game**

**Priority:** P2 (Polish)
**Dependencies:** None
**Estimated Tickets:** 2

---

## Ticket 7.1: Home Screen UI

### User Story
```
As a player,
I want a clear and inviting home screen,
So that I understand what the game is and can start playing immediately.
```

### Acceptance Criteria
```
Given I open the app,
When the home page loads,
Then I see the game title "Chaos Stories" prominently.

Given I'm on the home page,
When I look for actions,
Then I see a large "Start Game" button.

Given I'm on mobile,
When I view the home page,
Then all elements are properly sized for touch.

Given I tap "Start Game",
When it triggers,
Then I go to character select screen.
```

### Technical Notes

**@frontend-lead:**
- Full-screen with thematic background
- Title: large, memorable typography
- Single CTA: "Start Game" or "Begin Adventure"
- Consider animated elements (subtle flame, sparkle)
- Future: settings gear, sound toggle

---

## Ticket 7.2: Home Screen Polish

### User Story
```
As a player,
I want the home screen to set the mood,
So that I'm excited to start playing.
```

### Acceptance Criteria
```
Given the home screen,
When I view it,
Then there's a sense of adventure/humor in the design.

Given the background,
When displayed,
Then it hints at the fantasy tavern setting.

Given the title,
When displayed,
Then it has a playful, chaotic energy.

Given I wait on the home screen,
When 5+ seconds pass,
Then there may be subtle animation or tagline rotation.
```

### Technical Notes

**@frontend-lead:**
- Background: tavern scene or fantasy landscape
- Consider: rotating taglines ("Make terrible decisions", "Embrace the chaos")
- Subtle parallax or floating elements
- Load story data in background while on this screen

---

# Summary

## All Tickets by Feature

| Feature | Tickets | Priority |
|---------|---------|----------|
| F1: Core Game Loop | 1.1-1.6 (6 tickets) | P0 |
| F2: Timer System | 2.1-2.4 (4 tickets) | P0 |
| F3: Chaos Meter | 3.1-3.4 (4 tickets) | P0 |
| F4: Character System | 4.1-4.5 (5 tickets) | P1 |
| F5: Ending System | 5.1-5.3 (3 tickets) | P1 |
| F6: Story Content | 6.1-6.4 (4 tickets) | P0 |
| F7: Home Screen | 7.1-7.2 (2 tickets) | P2 |

**Total: 28 tickets**

---

## Recommended Build Order

```
SPRINT 1: Core Experience
├── 1.1 Scene Container
├── 1.2 Story Text Display
├── 1.3 Choice Buttons
├── 1.4 Outcome Display
├── 1.5 Scene Transition
├── 6.1 Story JSON Structure
└── 6.2 Write 3 test scenes

SPRINT 2: Game Feel
├── 2.1 Countdown Timer
├── 2.2 Timer Urgency States
├── 2.3 Auto-Select on Timeout
├── 3.1 Chaos Meter UI
├── 3.2 Chaos Meter Animations
└── 3.3 Chaos Calculation Logic

SPRINT 3: Characters & Endings
├── 4.1 Character Data Structure
├── 4.2 Character Selection UI
├── 4.3 Character Choice Filtering
├── 5.1 Ending Screen UI
├── 5.2 Ending Data Structure
└── 6.3 Write character-specific content

SPRINT 4: Polish & Complete
├── 1.6 Game Flow State Machine
├── 2.4 Timer Integration
├── 3.4 Chaos-Based Ending Selection
├── 4.4 Random Character Events
├── 4.5 Character Choice Tracking
├── 5.3 Ending Unlocks
├── 6.4 Write all 5 endings
├── 7.1 Home Screen UI
└── 7.2 Home Screen Polish
```

---

## Agent Review Checklist

### @game-designer Review
- [ ] Do all features support KEY #1 (Humor)?
- [ ] Do all features support KEY #2 (Replayability)?
- [ ] Is timer duration (25 sec) correct?
- [ ] Are chaos thresholds balanced?
- [ ] Do character events feel fun, not punishing?

### @frontend-lead Review
- [ ] Are all touch targets 48px+?
- [ ] Is mobile-first approach clear?
- [ ] Are animations specified clearly?
- [ ] Is component hierarchy logical?
- [ ] Are responsive breakpoints defined?

### @backend-lead Review
- [ ] Are all data structures complete?
- [ ] Is state management clear?
- [ ] Are edge cases covered?
- [ ] Is the JSON schema validatable?
- [ ] Are calculations deterministic (except intentional randomness)?

### @story-writer Review
- [ ] Is scene text length specified (2-4 sentences)?
- [ ] Is choice text length specified (max 8 words)?
- [ ] Are character voice guidelines clear?
- [ ] Is the comedy tone defined?
- [ ] Are outcome writing rules clear?

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Status: Ready for Agent Review*
