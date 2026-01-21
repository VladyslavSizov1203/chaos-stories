# EPIC: Chaos Stories - Interactive Story Game MVP

> **Epic ID:** CHAOS-001
> **Status:** Draft
> **Owner:** Product Team
> **Target Release:** MVP v1.0

---

## Executive Summary

A mobile-first, single-player interactive story game where players choose a flawed character (Rupert the Warrior or Milo the Mage), make timed decisions that affect a "Chaos Meter," and experience different story paths leading to multiple endings. Think "choose your own adventure" meets party game energy with comedic fantasy characters.

### The Vibe

**"A short DnD adventure mixed with a party game."**

- **Fast** — 25-second decisions, 10-15 minute total
- **Funny** — Absurd characters, unexpected outcomes
- **Chaotic** — Escalating situations, legendary disasters
- **Emotional choices** — Not "correct vs wrong" but "bold, risky, stupid, or hilarious"
- **Surprising outcomes** — Often unexpected, sometimes absurd
- **Goal** — Players laugh, argue with themselves, immediately want to see what happens next

### The Two Keys to Success

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   KEY #1: HUMOR                                          │
│   Every choice must be TEMPTING to click                │
│   → "I HAVE to see what happens if I pick this"         │
│                                                          │
│              ↕ (interconnected)                          │
│                                                          │
│   KEY #2: REPLAYABILITY                                  │
│   Different options → Different results                 │
│   → "I wonder what happens if I pick the OTHER one"     │
│                                                          │
└─────────────────────────────────────────────────────────┘

If choices aren't funny → players won't replay
If outcomes are same → humor doesn't matter
BOTH must work together.
```

### Full Product Vision (Beyond MVP)

| Version | Players | Characters | Stories |
|---------|---------|------------|---------|
| **MVP (v1.0)** | 1 (solo) | 2 (Rupert, Milo) | 1 story |
| **v1.1** | 1 | 4-6 | 2-3 stories |
| **v2.0** | 1-8 (multiplayer voting) | 10+ catalog | 5+ stories |
| **v3.0+** | 1-8 | Full catalog + UGC | Community stories |

**MVP validates:** Can we make players laugh and replay?
**v2.0 unlocks:** Social chaos (voting, arguing, shared hilarity)

---

## Problem Statement

### The Gap
Mobile users seeking quick entertainment (10-15 minutes) lack engaging interactive experiences where choices feel meaningful. Current options are either too long, too passive, or require other players.

### Who Feels This Pain
- **Primary:** Casual mobile gamers (18-35) during short breaks
- **Secondary:** Interactive fiction fans wanting lighter, faster experiences
- **Tertiary:** Party game enthusiasts playing solo

### Current Alternatives & Why They Fail
| Alternative | Failure Point |
|-------------|---------------|
| Mobile games | Require grinding, long sessions, or IAP walls |
| Interactive fiction apps | Slow-paced, serious, no urgency |
| Social media | Passive, unfulfilling, no agency |
| Party games | Require multiple players |

---

## Vision & Success

### Product Vision
*"The go-to app for a quick, chaotic, replayable story adventure you can finish in one bus ride."*

### Success Metrics (MVP)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion Rate | >70% | Players who start finish at least one playthrough |
| Replay Rate | >50% | Players who play again (now with 2 characters!) |
| Character Variety | ~50/50 | Both characters get played |
| Mobile Usability | 0 critical issues | No rage-quit moments from UI/UX friction |
| Time to Complete | 10-15 min | Average playthrough duration |
| Ending Variety | 5 reached | All endings discovered across user base |

---

## User Persona

### "Break-Time Gamer" - Alex, 27

**Demographics:** Urban professional, commutes 30 min each way, owns iPhone

**Behaviors:**
- Plays mobile games in 10-20 minute sessions
- Prefers games with clear start/end (not endless)
- Enjoys humor and doesn't take gaming too seriously
- Shares funny game moments with friends

**Frustrations:**
- "Most mobile games want me to play for hours or pay money"
- "I want to make choices that actually matter"
- "I don't always have friends available for party games"

**Goals:**
- Quick entertainment that respects my time
- Feel clever/amused by outcomes
- Something to talk about ("you won't believe what happened")

---

## Character System

### Overview
Two playable characters with distinct personalities, flaws, and unique abilities. Each character sees 2-3 shared choices plus 1 character-specific choice per scene.

---

### Rupert (Warrior)

**Visual:** Tough warrior in dented armor, battle-scarred, carries a big sword

**Personality:**
- Brave and loyal
- Heart of gold, brain of potato
- Has Tourette's syndrome — blurts things out at the worst moments
- Drinks too much — impaired judgment leads to chaos

**Unique Ability: "Warrior's Way"**
Rupert gets physical/confrontational options others don't have.

**Example Unique Choices:**
| Scene Context | Rupert's Unique Option | Chaos Effect |
|---------------|------------------------|--------------|
| Guard blocks the path | "Headbutt him and charge through" | +15 chaos |
| Tense negotiation | *[Tourette's triggers]* "YOUR MOTHER WAS A HAMSTER!" | +20 chaos |
| Need information | "Intimidate with sword" | +10 chaos |
| Party at tavern | "Chug the mystery barrel" | +12 chaos, random outcome |
| Stealth required | "Stealth is for cowards. CHARGE!" | +25 chaos |

**Exclusive Ending:** "The Legend" — Rupert becomes a folk hero through sheer chaos

---

### Milo (Mage)

**Visual:** Shabby robes, shifty eyes, carrying a staff with a cracked crystal

**Personality:**
- "Genius" who knows very little actual magic
- Kicked out of magic school for theft
- Doesn't love magic — loves money
- Believes magic is the easiest path to getting rich
- Spells are unreliable with weird side effects

**Unique Ability: "Questionable Magic"**
Milo gets risky spell options and theft/scam opportunities.

**Example Unique Choices:**
| Scene Context | Milo's Unique Option | Chaos Effect |
|---------------|----------------------|--------------|
| Guard blocks the path | "Cast 'Sleep'... probably" | +5 to +20 (random) |
| Tense negotiation | "Pickpocket while they're distracted" | +8 chaos |
| Need information | "Bribe them (with counterfeit coins)" | +12 chaos |
| Party at tavern | "Sell fake potions to drunk patrons" | +10 chaos, gain leverage |
| Stealth required | "Cast 'Invisibility'... sort of" | +5 to +15 (spell might backfire) |

**Exclusive Ending:** "The Wealthy Fraud" — Milo scams his way to riches (temporarily)

---

### Character Mechanics

**Choice Structure Per Scene:**
```
┌─────────────────────────────────────┐
│         SCENE CHOICES               │
├─────────────────────────────────────┤
│ [Shared Option 1] — Available to all│
│ [Shared Option 2] — Available to all│
│ [Shared Option 3] — Available to all│
│ [CHARACTER OPTION] — Rupert OR Milo │
│   ⚔️ Rupert: Physical/Impulsive     │
│   🔮 Milo: Magic/Theft              │
└─────────────────────────────────────┘
```

**Chaos Tendency:**
- Rupert: Higher chaos spikes, less control (Tourette's/drinking)
- Milo: Variable chaos (spells can backfire OR work too well)

---

## Scope Definition

### In Scope (MVP)

| Component | Details |
|-----------|---------|
| Platform | Mobile-first web (responsive, works on desktop) |
| Players | Single-player only |
| Characters | 2 playable (Rupert, Milo) |
| Content | 1 complete story with character variants |
| Scenes | ~15 total scenes (~12 per playthrough) |
| Choices | 2-3 shared + 1 character-specific per scene |
| Endings | 5 total (3 shared + 1 per character) |
| Duration | 10-15 minute playthrough |
| Timer | 25-second decision countdown |
| Chaos System | 4-level meter affecting endings |
| Data | Static JSON (no backend) |

### Out of Scope (Future Versions)

| Feature | Target Version | Rationale |
|---------|----------------|-----------|
| Multiplayer/co-op | v2.0 | Validate single-player first |
| Multiple stories | v1.1 | Prove concept with one story |
| User accounts | v2.0 | No persistence needed for MVP |
| Sound/music | v1.1 | Enhancement, not core |
| Additional characters | v1.1+ | 2 characters validates the system |
| Achievements/badges | v1.1 | Engagement feature |
| Social sharing | v1.1 | Growth feature |
| Leaderboards | v2.0 | Requires backend |
| Offline mode | v1.1 | PWA enhancement |

---

## Core User Journey

```
┌─────────────────────────────────────┐
│            HOME PAGE                │
│  Title + "Start Game" button        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       CHARACTER SELECT              │
│  ┌───────────┐    ┌───────────┐     │
│  │ ⚔️ RUPERT │    │ 🔮 MILO   │     │
│  │ Warrior   │    │ Mage      │     │
│  │ (toggle)  │    │ (toggle)  │     │
│  └───────────┘    └───────────┘     │
│         [ BEGIN ADVENTURE ]         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           SCENE LOOP                │
│  ┌─────────────────────────────┐    │
│  │ 1. Display scene            │    │
│  │    - Background image       │    │
│  │    - Story text             │    │
│  │    - Chaos Meter            │    │
│  │    - Character portrait     │    │
│  └──────────────┬──────────────┘    │
│                 ▼                   │
│  ┌─────────────────────────────┐    │
│  │ 2. Show choices + timer     │    │
│  │    - 2-3 shared options     │    │
│  │    - 1 character option     │    │
│  │    - 25 sec countdown       │    │
│  └──────────────┬──────────────┘    │
│                 ▼                   │
│  ┌─────────────────────────────┐    │
│  │ 3. Player picks (or timeout)│    │
│  └──────────────┬──────────────┘    │
│                 ▼                   │
│  ┌─────────────────────────────┐    │
│  │ 4. Show outcome (2-3 sec)   │    │
│  │    - May include Tourette's │    │
│  │      outburst or spell fail │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│        ┌───────┴───────┐            │
│        ▼               ▼            │
│   [Next Scene]    [Is Ending?]      │
│        │               │            │
│        └───────┬───────┘            │
└────────────────┼────────────────────┘
                 │
                 ▼ (if ending)
┌─────────────────────────────────────┐
│          ENDING SCREEN              │
│  - Ending title + description       │
│  - Character-specific commentary    │
│  - Final chaos level                │
│  - "Play Again" / "Try Other Hero"  │
└─────────────────────────────────────┘
```

---

## Chaos Meter System

The Chaos Meter is the core differentiator. It creates tension, consequence, and replayability.

### Chaos Levels

| Level | Range | Visual | Emoji | Description |
|-------|-------|--------|-------|-------------|
| 1 | 0-25 | Green | 😌 | Calm - Everything's under control |
| 2 | 26-50 | Yellow | 🤨 | Suspicious - People are noticing |
| 3 | 51-75 | Orange | 🔥 | On Fire - Things are getting wild |
| 4 | 76-100 | Red | 🚨 | Guards Incoming - Total chaos |

### Mechanics
- Starts at 0
- Choices add or subtract chaos points
- Character-specific choices tend to add MORE chaos (that's the fun!)
- Rupert's Tourette's can trigger random chaos spikes
- Milo's spells have variable chaos (dice roll element)
- Final chaos level + character determines ending

### Ending Matrix

| Chaos Level | Shared Ending | Character Exclusive |
|-------------|---------------|---------------------|
| 0-33 (Low) | "The Quiet Victory" | — |
| 34-66 (Medium) | "The Messy Success" | — |
| 67-100 (High) | "The Glorious Disaster" | — |
| Any + Rupert path | — | "The Legend" (Rupert only) |
| Any + Milo path | — | "The Wealthy Fraud" (Milo only) |

*Note: Exclusive endings require taking 3+ character-specific choices*

---

## Technical Constraints

| Constraint | Decision | Rationale |
|------------|----------|-----------|
| No backend | JSON data files | Simplicity, no infrastructure |
| No auth | Anonymous play | Reduces friction, MVP scope |
| Animations | CSS only | Performance, maintainability |
| Images | Static assets | No CDN complexity |
| Framework | React/Next.js | Modern, mobile-friendly |
| Styling | Tailwind CSS | Rapid mobile-first development |

---

## Features Breakdown

### Feature 1: Project Foundation
Set up technical infrastructure and data architecture.

**Tickets:**
- 1.1: Initialize project (Next.js, Tailwind, structure)
- 1.2: Define and create game data schema (JSON) — *updated for characters*

### Feature 2: Character System
Allow player to select and play as different characters.

**Tickets:**
- 2.1: Define character data structure (abilities, traits, unique choices)
- 2.2: Build character selection UI (quick toggle, portraits)
- 2.3: Implement character-specific choice filtering

### Feature 3: Game State Management
Track player progress, chaos level, character, and scene flow.

**Tickets:**
- 3.1: Implement game state (context/hook) — *includes selectedCharacter*
- 3.2: Implement scene transition logic
- 3.3: Implement chaos calculation with character modifiers

### Feature 4: Home Screen
Entry point with clear call-to-action.

**Tickets:**
- 4.1: Build home page UI (title, start button)

### Feature 5: Scene Display System
Core gameplay view with immersive visuals.

**Tickets:**
- 5.1: Build scene container (full-screen background)
- 5.2: Build story text display
- 5.3: Build Chaos Meter UI component
- 5.4: Build character portrait/indicator component

### Feature 6: Choice & Timer System
Decision mechanics with time pressure.

**Tickets:**
- 6.1: Build choice buttons (mobile-optimized, character-specific styling)
- 6.2: Implement countdown timer (25 sec, visual urgency)
- 6.3: Build outcome display (brief result text)
- 6.4: Implement random events (Tourette's outbursts, spell backfires)

### Feature 7: Ending System
Satisfying conclusion with replay option.

**Tickets:**
- 7.1: Build ending screen UI (includes "Try Other Hero" prompt)
- 7.2: Implement ending selection logic (chaos + character path)

### Feature 8: Story Content
Actual narrative for MVP.

**Tickets:**
- 8.1: Write complete story script (~12 scenes, shared choices)
- 8.2: Write Rupert-specific choices and outcomes
- 8.3: Write Milo-specific choices and outcomes
- 8.4: Write 5 endings (3 shared + 2 exclusive)
- 8.5: Source/create background images
- 8.6: Create character portraits (Rupert, Milo)
- 8.7: Populate story JSON data file

### Feature 9: Mobile-First Polish
Ensure excellent experience across devices.

**Tickets:**
- 9.1: Implement responsive layout
- 9.2: Add touch interaction polish

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Story isn't engaging | Medium | High | Playtest early, iterate on writing |
| Characters feel same-y | Medium | High | Ensure unique choices have distinct outcomes |
| Timer feels stressful not fun | Medium | Medium | Make timeout consequence mild, tune duration |
| Mobile performance issues | Low | High | Optimize images, test on low-end devices |
| Chaos system feels arbitrary | Medium | Medium | Clear visual feedback, logical consequences |
| Scope creep | High | Medium | Strict MVP boundaries, parking lot for ideas |
| Random events frustrating | Medium | Medium | Keep random chaos spikes funny, not punishing |

---

## Open Questions

1. ~~**Story theme:** What's the story about?~~ → **Fantasy adventure/heist**
2. **Timer duration:** Is 25 seconds right, or should we test 20/30?
3. ~~**Chaos starting point:**~~ → **Start at 0**
4. **Image sourcing:** Stock photos, AI-generated, or illustrated?
5. **Tourette's frequency:** How often should Rupert's outbursts trigger?
6. **Spell backfire rate:** What % of Milo's spells should have weird effects?

---

## Definition of Done (MVP)

- [ ] Player can start game from home screen
- [ ] Player can select Rupert or Milo before starting
- [ ] Character selection affects available choices
- [ ] Player reads scenes with background images
- [ ] Character portrait visible during gameplay
- [ ] Chaos Meter displays and updates correctly
- [ ] Character-specific chaos modifiers work
- [ ] Timer counts down with visual urgency
- [ ] Auto-select triggers at timeout
- [ ] Outcome text shows after each choice
- [ ] Random events trigger appropriately (Tourette's, spell fails)
- [ ] 5 different endings are reachable (3 shared + 2 exclusive)
- [ ] Ending screen shows with "Play Again" and "Try Other Hero" options
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Full playthrough takes 10-15 minutes
- [ ] No critical bugs or broken paths

---

## Appendix: Ticket Summary

| ID | Ticket Name | Feature | Priority |
|----|-------------|---------|----------|
| 1.1 | Initialize project | Foundation | P0 |
| 1.2 | Create game data schema | Foundation | P0 |
| 2.1 | Define character data structure | Character | P0 |
| 2.2 | Build character selection UI | Character | P0 |
| 2.3 | Character-specific choice filtering | Character | P0 |
| 3.1 | Implement game state | State | P0 |
| 3.2 | Scene transition logic | State | P0 |
| 3.3 | Chaos calculation with modifiers | State | P0 |
| 4.1 | Build home page UI | Home | P0 |
| 5.1 | Build scene container | Scene | P0 |
| 5.2 | Build story text display | Scene | P0 |
| 5.3 | Build Chaos Meter UI | Scene | P0 |
| 5.4 | Build character portrait component | Scene | P1 |
| 6.1 | Build choice buttons | Choice | P0 |
| 6.2 | Implement countdown timer | Choice | P0 |
| 6.3 | Build outcome display | Choice | P0 |
| 6.4 | Implement random events | Choice | P1 |
| 7.1 | Build ending screen UI | Ending | P0 |
| 7.2 | Ending selection logic | Ending | P0 |
| 8.1 | Write story script (shared) | Content | P0 |
| 8.2 | Write Rupert choices | Content | P0 |
| 8.3 | Write Milo choices | Content | P0 |
| 8.4 | Write 5 endings | Content | P0 |
| 8.5 | Source background images | Content | P1 |
| 8.6 | Create character portraits | Content | P1 |
| 8.7 | Populate story JSON | Content | P0 |
| 9.1 | Responsive layout | Polish | P1 |
| 9.2 | Touch interaction polish | Polish | P1 |

**Total: 28 tickets** (19 P0, 9 P1)

---

*Document Version: 2.0*
*Last Updated: 2026-01-21*
*Change: Added 2-character system (Rupert & Milo) with unique abilities and exclusive endings*
