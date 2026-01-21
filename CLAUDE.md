# Chaos Stories - Interactive Story Game

> A mobile-first, single-player interactive story game with timed choices, a Chaos Meter, and two playable characters.

---

## The Vibe

**"A short DnD adventure mixed with a party game."**

| Principle | What It Means |
|-----------|---------------|
| **Fast** | 25-second decisions, 10-15 min total |
| **Funny** | Absurd characters, unexpected outcomes |
| **Chaotic** | Escalating situations, legendary disasters |
| **Emotional choices** | Not "correct vs wrong" — bold, risky, stupid, or hilarious |
| **Surprising outcomes** | Often unexpected, sometimes absurd |
| **Goal** | Players laugh, argue with themselves, want to see what's next |

## The Two Keys to Success

```
KEY #1: HUMOR          →  Every choice must be TEMPTING to click
KEY #2: REPLAYABILITY  →  Different options = Different results

These are INTERCONNECTED. Both must work.
```

## Product Vision

| Version | Players | Characters | Stories |
|---------|---------|------------|---------|
| **MVP** | 1 (solo) | 2 | 1 |
| **v2.0** | 1-8 (multiplayer voting) | 10+ catalog | 5+ |

MVP validates: **Can we make players laugh and replay?**

---

## Project Overview

**What we're building:**
- Choose your own adventure game with party game energy
- 2 characters: Rupert (Warrior) and Milo (Mage)
- Timed decisions (25 seconds)
- Chaos Meter affecting endings
- 5 endings (3 shared + 2 character-exclusive)
- 10-15 minute playthrough

**Tech Stack:**
- Framework: Next.js 15 / React
- Language: TypeScript
- Styling: Tailwind CSS
- Data: Static JSON (no backend for MVP)

---

## Available Agents

Use these specialized agents with `@agent-name`:

| Agent | When to Use |
|-------|-------------|
| `@product-owner` | Break down features into tickets, define scope |
| `@game-designer` | Mechanics, balance, pacing, player experience |
| `@frontend-lead` | UI components, mobile-first design, styling |
| `@backend-lead` | Data schema, game state, technical architecture |
| `@story-writer` | Write scenes, choices, dialogue, endings |

### Agent Collaboration Model

```
@product-owner ←→ @game-designer ←→ @story-writer
   (WHAT)            (HOW)            (WHY)
   Scope           Mechanics        Narrative
   Tickets         Balance          Dialogue
```

### Example Usage

```
@product-owner break down Feature 5: Choice & Timer System into tickets

@game-designer is the chaos balance right for this scene?

@frontend-lead design the Chaos Meter component

@backend-lead what should the game state structure look like?

@story-writer write Scene 1: The Tavern Entrance
```

---

## Key Documents

| File | Purpose |
|------|---------|
| `EPIC.md` | Product vision, scope, success metrics |
| `FEATURES.md` | Detailed features + 28 tickets with acceptance criteria |
| `RESEARCH.md` | Market research, competitors, positioning |
| `STORY-ARCHITECTURE.md` | Branching model, choice types, scene structure |
| `VALIDATION.md` | All-agent sign-off, canonical schemas, ready for implementation |
| `CLAUDE.md` | This file - project context |
| `.claude/agents/` | 5 specialized agents |

---

## The Characters

### Rupert (Warrior)
- Brave, loyal, brain of potato
- Has Tourette's (blurts things out)
- Drinks too much
- Unique choices: Physical, confrontational

### Milo (Mage)
- Fake genius, expelled from magic school
- Loves money, not magic
- Spells are unreliable
- Unique choices: Magic (with side effects), theft, scams

---

## Chaos Meter Levels

| Level | Range | Emoji | Color |
|-------|-------|-------|-------|
| Calm | 0-25 | 😌 | Green |
| Suspicious | 26-50 | 🤨 | Yellow |
| On Fire | 51-75 | 🔥 | Orange |
| Guards Incoming | 76-100 | 🚨 | Red |

---

## Quick Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # Check for errors
```

---

## MVP Scope

**In:**
- 1 story (~12 scenes)
- 2 characters
- 5 endings
- Chaos Meter
- 25-second timer
- Mobile-first responsive

**Out (for now):**
- Multiplayer
- Multiple stories
- Sound/music
- User accounts
- Achievements

---

## Getting Started

1. Review `EPIC.md` for full product spec
2. Use `@product-owner` to get tickets for a feature
3. Use `@backend-lead` for data structure questions
4. Use `@frontend-lead` for UI/component design
5. Use `@story-writer` to write the actual story content

---

*Chaos Stories MVP — Let's make bad decisions entertaining!*
