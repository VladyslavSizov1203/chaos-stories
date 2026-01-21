# Epic: Chaos Stories MVP

> Mobile-first interactive story game with timed choices and chaos meter

## Overview

Build a single-player interactive story game where players make timed decisions as one of two characters (Rupert or Milo), affecting a Chaos Meter that determines their ending.

**The Two Keys to Success:**
- **KEY #1: HUMOR** — Every choice must be TEMPTING to click
- **KEY #2: REPLAYABILITY** — Different options = Different results

## MVP Scope

- 1 story (~15 scenes, ~12 per playthrough)
- 2 characters with unique abilities
- 5 endings (3 shared + 2 character-exclusive)
- 25-second timer with urgency states
- Chaos Meter (4 levels: Calm, Suspicious, On Fire, Guards Incoming)
- Mobile-first responsive design

## Tech Stack

- Next.js 15 / React
- TypeScript
- Tailwind CSS
- Static JSON (no backend)

---

## Features Checklist

### Feature 1: Core Game Loop (P0)
- [ ] 1.1 Scene Container Component (@frontend-lead)
- [ ] 1.2 Story Text Display (@frontend-lead)
- [ ] 1.3 Choice Buttons Component (@frontend-lead)
- [ ] 1.4 Outcome Display Component (@frontend-lead)
- [ ] 1.5 Scene Transition Logic (@backend-lead)
- [ ] 1.6 Game Flow State Machine (@backend-lead)

### Feature 2: Timer System (P0)
- [ ] 2.1 Countdown Timer Component (@frontend-lead)
- [ ] 2.2 Timer Urgency States (@frontend-lead)
- [ ] 2.3 Auto-Select on Timeout (@backend-lead)
- [ ] 2.4 Timer Integration with State (@backend-lead)

### Feature 3: Chaos Meter (P0)
- [ ] 3.1 Chaos Meter UI Component (@frontend-lead)
- [ ] 3.2 Chaos Meter Animations (@frontend-lead) [P1]
- [ ] 3.3 Chaos Calculation Logic (@backend-lead)
- [ ] 3.4 Chaos-Based Ending Selection (@backend-lead)

### Feature 4: Character System (P0)
- [ ] 4.1 Character Data Structure (@backend-lead)
- [ ] 4.2 Character Selection UI (@frontend-lead)
- [ ] 4.3 Character Choice Filtering (@backend-lead)
- [ ] 4.4 Random Events (Tourette's/Backfire) (@backend-lead) [P1]
- [ ] 4.5 Character Choice Tracking (@backend-lead)

### Feature 5: Ending System (P0)
- [ ] 5.1 Ending Screen UI (@frontend-lead)
- [ ] 5.2 Ending Data Structure (@backend-lead)
- [ ] 5.3 Ending Unlocks & Replay Hooks (@backend-lead) [P1]

### Feature 6: Story Content (P0)
- [ ] 6.1 Story JSON Schema (@backend-lead)
- [ ] 6.2 Write Story Script (~15 scenes) (@story-writer)
- [ ] 6.3 Write Character-Specific Content (@story-writer)
- [ ] 6.4 Write 5 Endings (@story-writer)

### Feature 7: Home Screen (P2)
- [ ] 7.1 Home Screen UI (@frontend-lead)
- [ ] 7.2 Home Screen Polish (@frontend-lead)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Completion Rate | >70% |
| Replay Rate | >50% |
| Character Split | ~50/50 |
| Session Length | 10-15 min |

---

## Build Order

1. **Phase 1: Foundation** — Project setup, types, sample data
2. **Phase 2: Core Loop** — Scene → Choice → Outcome flow
3. **Phase 3: Game Feel** — Timer, chaos, characters
4. **Phase 4: Content & Polish** — Full story, endings, polish

---

## Related Documents

- `PLAN.md` — Consolidated implementation plan
- `FEATURES.md` — Detailed tickets with acceptance criteria
- `VALIDATION.md` — Canonical data schemas
- `STORY-ARCHITECTURE.md` — Branching model

---

**Total: 28 tickets (22 P0, 4 P1, 2 P2)**

Labels: `epic`, `mvp`
