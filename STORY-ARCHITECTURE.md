# Story Architecture — Branching Model

> **Critical design document for narrative structure**
> For validation by: @product-owner, @game-designer, @story-writer, @frontend-lead, @backend-lead

---

## Core Principle

**The story is NOT linear.** It has branching paths that create genuinely different experiences, but all paths ultimately converge to a limited set of endings.

---

## Two Types of Choices

Not all choices are equal. We distinguish between:

```
┌─────────────────────────────────────────────────────────┐
│              TWO TYPES OF CHOICES                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔀 BRANCHING CHOICES (Story-Changing)                  │
│  ─────────────────────────────────────                  │
│  • Lead to DIFFERENT scenes                             │
│  • Change the story direction                           │
│  • Create genuinely different experiences               │
│  • Affect which ending is POSSIBLE                      │
│  • Maybe 2-4 per playthrough                            │
│                                                          │
│  Example: "Go through the front door" vs                │
│           "Sneak through the kitchen"                   │
│  → These lead to completely different next scenes       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🎭 FLAVOR CHOICES (Chaos/Humor-Changing)               │
│  ─────────────────────────────────────────              │
│  • Lead to SAME next scene                              │
│  • Change chaos level and outcome TEXT                  │
│  • Create different humor/tone                          │
│  • Don't change story direction                         │
│  • Maybe 8-10 per playthrough                           │
│                                                          │
│  Example: "Talk politely" (+5 chaos) vs                 │
│           "Insult his mother" (+20 chaos)               │
│  → Both continue to same next scene, different chaos    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## The Branching Structure

```
                         START
                           │
                           ▼
                      ┌─────────┐
                      │ Scene 1 │
                      └────┬────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         [Choice A]   [Choice B]   [Choice C]
         (Flavor)     (BRANCH)     (Flavor)
              │            │            │
              │      ┌─────┴─────┐      │
              │      ▼           ▼      │
              │  Scene 2A    Scene 2B   │
              │      │           │      │
              └──────┼───────────┼──────┘
                     │           │
                     ▼           ▼
                ┌─────────┐ ┌─────────┐
                │ Scene 3A│ │ Scene 3B│
                └────┬────┘ └────┬────┘
                     │           │
                     │    ┌──────┘
                     │    │
                     ▼    ▼
              ┌──────────────────┐
              │ Scene 4 (MERGE)  │  ← Paths can reconverge
              └────────┬─────────┘
                       │
                       ▼
                   [Continue...]
                       │
                       ▼
              ┌────────┴────────┐
              ▼                 ▼
         ┌─────────┐      ┌─────────┐
         │ Ending A│      │ Ending B│
         └─────────┘      └─────────┘
```

---

## Key Rules

### Rule 1: Branches Eventually Converge
Branches don't explode infinitely. After 2-3 scenes, paths can merge back together at key story beats.

```
Scene 2A ──┐
           ├──→ Scene 5 (Convergence Point)
Scene 2B ──┘
```

### Rule 2: Limited Endings Per Playthrough
Not all 5 endings are reachable in every playthrough. A single playthrough leads to 1-2 possible endings based on the path taken.

```
PATH A (Front door)  → Can reach: Endings 1, 2, 3
PATH B (Kitchen)     → Can reach: Endings 2, 3, 4
PATH C (Rupert-only) → Can reach: Endings 3, 5 (The Legend)
```

### Rule 3: Chaos Affects Ending WITHIN a Path
Within the endings available to your path, chaos level determines which one you get.

```
PATH A + Low Chaos    → Ending 1
PATH A + Medium Chaos → Ending 2
PATH A + High Chaos   → Ending 3
```

### Rule 4: Character Choices Can Unlock Paths
Some branches are only available to specific characters, creating character-exclusive routes.

```
Scene 3:
├── [Shared] "Negotiate" → Scene 4A
├── [Shared] "Run away"  → Scene 4B
├── [⚔️ Rupert] "Charge through wall" → Scene 4C (Rupert-only path)
└── [🔮 Milo] "Teleport... maybe" → Scene 4D (Milo-only path)
```

---

## Example: 12-Scene Structure with Branching

```
ACT 1: SETUP (Scenes 1-3)
════════════════════════
Scene 1: The Tavern
    │
    ├── [Flavor] Talk to bartender → Scene 2
    ├── [Flavor] Look around → Scene 2
    └── [BRANCH] Investigate back room → Scene 2-ALT

Scene 2 / 2-ALT: The Proposition
    │
    └── [BRANCH] Accept mission → Scene 3A
    └── [BRANCH] Refuse (chaos way) → Scene 3B

Scene 3A/3B: The Plan (converge on same plot, different context)


ACT 2: ESCALATION (Scenes 4-8)
═══════════════════════════════
Scene 4: Entering the Manor
    │
    ├── [BRANCH] Front door → Scene 5-FRONT
    ├── [BRANCH] Kitchen → Scene 5-KITCHEN
    └── [BRANCH] Sewers → Scene 5-SEWER

Scene 5-FRONT/KITCHEN/SEWER: Different challenges, same goal
    │
    └── All converge at Scene 6: The Guard Room

Scene 6-8: Escalating complications (mostly Flavor choices)


ACT 3: CLIMAX (Scenes 9-12)
═══════════════════════════
Scene 9: The Vault
    │
    ├── [BRANCH] Stealth approach → Scene 10A
    └── [BRANCH] Chaos approach → Scene 10B

Scene 10A/10B: Different final challenges
    │
    └── Both lead to Scene 11: The Escape

Scene 11: The Escape (Final major branch)
    │
    ├── [BRANCH] Fight through → Ending Path 1
    ├── [BRANCH] Clever escape → Ending Path 2
    └── [CHARACTER] Special escape → Character Ending Path

Scene 12: ENDINGS
    │
    ├── Ending 1: The Quiet Victory (Low chaos + clean escape)
    ├── Ending 2: The Messy Success (Medium chaos)
    ├── Ending 3: The Glorious Disaster (High chaos)
    ├── Ending 4: The Legend (Rupert path + 3+ Rupert choices)
    └── Ending 5: The Wealthy Fraud (Milo path + 3+ Milo choices)
```

---

## Why This Matters for Each Key

### KEY #1: HUMOR
- **Flavor choices** are where most comedy lives
- Same scene, wildly different reactions/outcomes
- Player can be chaotic without derailing story
- Branching choices have DRAMATIC humor (whole different scenario)

### KEY #2: REPLAYABILITY
- **Branching choices** create "I wonder what happens if..."
- Player KNOWS they missed content
- Different paths = genuinely different experiences
- Not just different chaos, different SCENES

---

## Replayability Math

```
Single Playthrough:
├── ~12 scenes seen
├── ~3 branching choices made
├── ~9 flavor choices made
└── 1 ending reached

Total Possible Content:
├── ~18-20 unique scenes (with branches)
├── ~6-8 major branch points
├── 5 endings
└── 2 characters × different paths = MORE variety

Replay Value:
├── Play 1: See ~60% of content, 1 ending
├── Play 2 (other character): See ~40% new content, different ending
├── Play 3 (different branches): See remaining content
└── Full discovery: 3-4 playthroughs
```

---

## Data Structure Implications

### Scene Schema Update

```typescript
interface Scene {
  id: string;
  text: string;
  backgroundImage: string;
  choices: Choice[];
  // NEW: Scene can have variant text based on how you arrived
  arrivalVariants?: {
    [fromSceneId: string]: {
      text: string;  // Different text if you came from this scene
    };
  };
}
```

### Choice Schema Update

```typescript
interface Choice {
  id: string;
  text: string;
  chaosChange: number;
  outcomeText: string;

  // CHOICE TYPE
  choiceType: 'flavor' | 'branch';

  // For FLAVOR choices: same next scene
  // For BRANCH choices: different next scene
  nextSceneId: string;

  // Character restriction (optional)
  characterOnly?: 'rupert' | 'milo';

  // Chaos variance for Milo's magic
  chaosVariance?: { min: number; max: number };
}
```

### Story Graph Validation

```typescript
// The story must be validated to ensure:
// 1. All scenes are reachable
// 2. All paths lead to an ending
// 3. No dead ends
// 4. Branch points clearly marked
// 5. Convergence points work from all incoming paths

function validateStoryGraph(story: Story): ValidationResult {
  // Check all scenes reachable from start
  // Check all paths terminate at endings
  // Check no orphaned scenes
  // Check convergence scenes make sense from all arrivals
}
```

---

## Visual Indicators in UI

### For Players (Subtle)
- Branch choices could have slightly different styling (bolder?)
- Or: Don't differentiate — let discovery be natural

### For Developers (Debug Mode)
- Show choice type: `[B]` for branch, `[F]` for flavor
- Show scene graph position

---

## Validation Questions for Each Agent

### @game-designer
1. Does the branch/flavor distinction support HUMOR?
2. Does the limited-endings-per-path model create good REPLAYABILITY?
3. Is 3-4 playthroughs for full content the right target?
4. Should branch choices be visually different from flavor choices?

### @story-writer
1. Is the 3 branch + 9 flavor per playthrough ratio workable?
2. Can convergence points be written to make sense from multiple arrivals?
3. How do we handle character-specific branches in the narrative?
4. Is 18-20 total scenes (with branches) manageable for MVP?

### @frontend-lead
1. How do we handle arrival variants in scene display?
2. Should branch choices look different from flavor choices?
3. Any UI implications for the story graph structure?

### @backend-lead
1. Is the updated schema complete?
2. How do we validate the story graph has no dead ends?
3. How do we track which path the player is on?
4. Does this affect ending selection logic?

### @product-owner
1. Does this increase scope significantly?
2. Is 18-20 scenes (vs 12 linear) acceptable for MVP?
3. Should we track which branches players take for analytics?

---

## Recommendation

### For MVP
- **2-3 major branch points** (not every scene)
- **12-15 unique scenes** (some branches, some convergence)
- **3 shared endings + 2 character endings** (as planned)
- **Clear convergence points** (Act 2 → Act 3 transition)

### Branch Point Locations
1. **Act 1 End (Scene 3)**: How you approach the mission
2. **Act 2 Mid (Scene 6)**: How you handle the complication
3. **Act 3 Start (Scene 9)**: How you approach the climax

Everything else = Flavor choices (chaos + humor, same path)

---

*Document Status: PENDING VALIDATION*
*Requires sign-off from all agents before implementation*
