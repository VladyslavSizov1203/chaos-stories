# Chaos Stories - Implementation Plan

> **Project:** Chaos Stories MVP
> **Type:** Mobile-first interactive story game
> **Status:** Ready for Implementation

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Project Overview

### What We're Building

A mobile-first, single-player interactive story game with:
- 2 characters (Rupert the Warrior, Milo the Mage)
- Timed decisions (25 seconds)
- Chaos Meter affecting 5 endings
- 10-15 minute playthrough
- ~15 scenes (~12 per playthrough)

### The Two Keys to Success

```
KEY #1: HUMOR          →  Every choice must be TEMPTING to click
KEY #2: REPLAYABILITY  →  Different options = Different results
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | Static JSON |
| State | React Context |

---

## MVP Scope

### In Scope

- 1 story (~15 scenes, ~12 per playthrough)
- 2 characters with unique abilities
- 5 endings (3 shared + 2 character-exclusive)
- Chaos Meter (4 levels)
- 25-second timer with urgency states
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)

### Out of Scope (for MVP)

- Multiplayer
- Multiple stories
- Sound/music
- User accounts
- Achievements
- Database/API

---

## Canonical Values

### Timer System

| Parameter | Value |
|-----------|-------|
| Duration | 25 seconds |
| Warning (Yellow) | 10 seconds |
| Critical (Red) | 5 seconds |
| Timeout Action | Auto-select first choice |

### Chaos Levels

| Level | Range | Emoji | Color |
|-------|-------|-------|-------|
| Calm | 0-25 | 😌 | Green |
| Suspicious | 26-50 | 🤨 | Yellow |
| On Fire | 51-75 | 🔥 | Orange |
| Guards Incoming | 76-100 | 🚨 | Red |

### Ending Thresholds

| Ending | Chaos Range | Character |
|--------|-------------|-----------|
| The Quiet Victory | 0-33 | Any |
| The Messy Success | 34-66 | Any |
| The Glorious Disaster | 67-100 | Any |
| The Legend | Any | Rupert (3+ choices) |
| The Wealthy Fraud | Any | Milo (3+ choices) |

### Content Limits

| Content | Limit |
|---------|-------|
| Scene text | 2-4 sentences |
| Choice text | Max 8 words |
| Outcome text | 2-3 sentences |

### Touch Targets

| Element | Size |
|---------|------|
| Minimum | 48px |
| Choice buttons | 56px+ height, full width |
| Edge padding | 16px minimum |

### Random Events

| Event | Chance |
|-------|--------|
| Rupert's Tourette's | 20-30% per scene |
| Milo's Spell Backfire | 30-50% of magic choices |

---

## Data Schema (TypeScript)

```typescript
// === STORY ===
interface Story {
  storyId: string;
  title: string;
  description: string;
  startSceneId: string;
  characters: Character[];
  scenes: Scene[];
  endings: Ending[];
}

// === CHARACTER ===
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
    tourettesChance?: number;     // Rupert: 0.2-0.3
    spellBackfireChance?: number; // Milo: 0.3-0.5
  };
}

// === SCENE ===
interface Scene {
  id: string;
  text: string;
  backgroundImage: string;
  choices: Choice[];
  isEnding?: boolean;
  arrivalVariants?: {
    [fromSceneId: string]: { text: string; };
  };
}

// === CHOICE ===
interface Choice {
  id: string;
  text: string;
  choiceType: 'flavor' | 'branch';
  nextSceneId: string;
  chaosChange: number;
  outcomeText: string;
  characterOnly?: 'rupert' | 'milo';
  chaosVariance?: { min: number; max: number };
  isMagic?: boolean;
}

// === ENDING ===
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

// === GAME STATE ===
type GameFlowState =
  | 'menu'
  | 'character_select'
  | 'scene_display'
  | 'showing_choices'
  | 'showing_outcome'
  | 'transitioning'
  | 'ending';

interface GameState {
  flowState: GameFlowState;
  selectedCharacter: 'rupert' | 'milo' | null;
  currentSceneId: string;
  previousSceneId: string | null;
  chaosLevel: number;
  characterChoiceCount: number;
  choiceHistory: Array<{
    choiceId: string;
    wasCharacterSpecific: boolean;
    wasTimeout: boolean;
  }>;
}
```

---

## Build Phases

### Phase 1: Foundation

**Goal:** Project setup and core types

| Task | Agent | Priority |
|------|-------|----------|
| Next.js + Tailwind + TypeScript setup | - | P0 |
| Type definitions (`src/types/game.ts`) | @backend-lead | P0 |
| Story JSON schema + sample data | @backend-lead | P0 |
| Basic scene display (no choices) | @frontend-lead | P0 |

### Phase 2: Core Loop

**Goal:** Playable scene → choice → outcome flow

| Task | Agent | Priority |
|------|-------|----------|
| Scene Container Component | @frontend-lead | P0 |
| Story Text Display | @frontend-lead | P0 |
| Choice Buttons Component | @frontend-lead | P0 |
| Outcome Display Component | @frontend-lead | P0 |
| Scene Transition Logic | @backend-lead | P0 |
| Game Flow State Machine | @backend-lead | P0 |

### Phase 3: Game Feel

**Goal:** Timer, chaos, and character systems

| Task | Agent | Priority |
|------|-------|----------|
| Countdown Timer Component | @frontend-lead | P0 |
| Timer Urgency States | @frontend-lead | P0 |
| Auto-Select on Timeout | @backend-lead | P0 |
| Chaos Meter UI Component | @frontend-lead | P0 |
| Chaos Calculation Logic | @backend-lead | P0 |
| Character Selection UI | @frontend-lead | P0 |
| Character Choice Filtering | @backend-lead | P0 |

### Phase 4: Content & Polish

**Goal:** Full story, endings, and polish

| Task | Agent | Priority |
|------|-------|----------|
| Write Story Script (~15 scenes) | @story-writer | P0 |
| Write Character-Specific Content | @story-writer | P0 |
| Write 5 Endings | @story-writer | P0 |
| Ending Screen UI | @frontend-lead | P0 |
| Ending Selection Logic | @backend-lead | P0 |
| Random Events (Tourette's/Backfire) | @backend-lead | P1 |
| Home Screen UI | @frontend-lead | P2 |

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home/menu screen
│   └── play/
│       └── page.tsx          # Game screen
├── components/
│   ├── game/
│   │   ├── SceneContainer.tsx
│   │   ├── StoryText.tsx
│   │   ├── ChoiceButtons.tsx
│   │   ├── OutcomeDisplay.tsx
│   │   ├── ChaosMeter.tsx
│   │   ├── Timer.tsx
│   │   └── EndingScreen.tsx
│   ├── character/
│   │   ├── CharacterSelect.tsx
│   │   └── CharacterCard.tsx
│   └── ui/
│       ├── Button.tsx
│       └── LoadingState.tsx
├── context/
│   └── GameContext.tsx
├── data/
│   └── stories/
│       └── tavern-heist.json
├── hooks/
│   ├── useGame.ts
│   ├── useTimer.ts
│   └── useChaos.ts
├── types/
│   └── game.ts
└── utils/
    ├── storyLoader.ts
    ├── endingSelector.ts
    └── chaosCalculator.ts
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Completion Rate | >70% |
| Replay Rate | >50% |
| Character Split | ~50/50 |
| Session Length | 10-15 min |

---

## Available Agents

| Agent | Use For |
|-------|---------|
| `@product-owner` | Break down features into tickets, define scope |
| `@game-designer` | Mechanics, balance, pacing, player experience |
| `@frontend-lead` | UI components, mobile-first design, styling |
| `@backend-lead` | Data schema, game state, technical architecture |
| `@story-writer` | Write scenes, choices, dialogue, endings |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `EPIC.md` | Full product spec |
| `FEATURES.md` | All 28 tickets with acceptance criteria |
| `STORY-ARCHITECTURE.md` | Branching model, choice types |
| `VALIDATION.md` | Cross-agent sign-off, canonical schemas |
| `RESEARCH.md` | Market research, competitors |
| `CLAUDE.md` | Project context for agents |

---

## Definition of Done

### Ticket DoD
- [ ] Code implemented and working
- [ ] All acceptance criteria pass
- [ ] TypeScript: no errors
- [ ] Mobile: tested on iOS Safari + Android Chrome
- [ ] Accessibility: keyboard navigable, no contrast issues

### MVP DoD
- [ ] All P0 features complete
- [ ] Full playthrough possible (both characters)
- [ ] All 5 endings reachable
- [ ] Works on mobile (primary) and desktop (secondary)
- [ ] 10-15 minute session length validated
- [ ] No critical bugs

---

## Quick Reference

### Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Check for errors
npm run test     # Run tests
```

### Chaos Change Guidelines

| Action Type | Typical Change |
|-------------|----------------|
| Diplomatic solution | -5 to +5 |
| Minor lie/avoidance | +5 to +8 |
| Confrontation | +10 to +15 |
| Rupert's outbursts | +15 to +25 |
| Milo's spells | +5 to +20 (variable) |
| Violence | +15 to +25 |

### Animation Timing

| Animation | Duration |
|-----------|----------|
| Outcome fade in | 200ms |
| Outcome hold | 2.5s |
| Outcome fade out | 200ms |
| Scene crossfade | 300ms |
| New text fade in | 200ms |
| Choices slide up | 300ms (staggered 50ms) |
| **Total transition** | ~3.5s |

---

*Chaos Stories MVP — Let's make bad decisions entertaining!*
