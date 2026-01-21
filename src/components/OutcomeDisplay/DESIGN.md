# OutcomeDisplay Component - Design Document

> Design specification for the outcome display overlay component
> Ticket: 1.4 (Feature 1: Core Game Loop)
> Status: Design Phase - Awaiting approval

---

## Overview

The OutcomeDisplay component shows the immediate result of a player's choice. This is where the PUNCHLINE lands - the surprising, funny, or dramatic consequence of their decision. It appears as a centered overlay, holds for reading, then auto-dismisses before transitioning to the next scene.

### Key Requirements

- Brief text (2-4 sentences max, readable in 2.5 seconds)
- Auto-dismisses after 2-3 seconds total
- Smooth fade in/out animations
- Chaos change indicator (+10 🔥 or -5 😌)
- Overlays current scene (doesn't change background yet)
- Hides choice buttons during display

---

## 1. Component Structure

### Component API

```tsx
interface OutcomeDisplayProps {
  outcomeText: string;              // Result text from selected choice
  chaosChange: number;              // Amount chaos changed (+15, -5, etc.)
  onComplete: () => void;           // Callback when auto-dismiss completes
  visible?: boolean;                // Optional external visibility control
  testId?: string;                  // For testing
}

export default function OutcomeDisplay({
  outcomeText,
  chaosChange,
  onComplete,
  visible = true,
  testId = 'outcome-display',
}: OutcomeDisplayProps): JSX.Element | null;
```

### Props Rationale

| Prop | Why It's Needed |
|------|-----------------|
| `outcomeText` | The punchline - what happened as a result of the choice |
| `chaosChange` | Shows immediate feedback on chaos impact (+ or -) |
| `onComplete` | Parent needs to know when to transition to next scene |
| `visible` | Allows parent to control visibility (for testing, replays) |
| `testId` | Testing and debugging |

### File Organization

```
src/components/OutcomeDisplay/
├── DESIGN.md                    # This file
├── OutcomeDisplay.tsx           # Main component
├── OutcomeDisplay.test.tsx      # Unit tests
└── index.ts                     # Barrel export
```

### Component Usage

```tsx
// Within game scene flow
const [showOutcome, setShowOutcome] = useState(false);
const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

const handleChoiceSelect = (choice: Choice) => {
  setSelectedChoice(choice);
  setShowOutcome(true);
};

const handleOutcomeComplete = () => {
  setShowOutcome(false);
  transitionToNextScene(selectedChoice.nextSceneId);
};

return (
  <SceneContainer backgroundImage={currentScene.backgroundImage}>
    <StoryText text={currentScene.text} />

    {!showOutcome && (
      <ChoiceList
        choices={currentScene.choices}
        onChoiceSelect={handleChoiceSelect}
      />
    )}

    {showOutcome && selectedChoice && (
      <OutcomeDisplay
        outcomeText={selectedChoice.outcomeText}
        chaosChange={selectedChoice.chaosChange}
        onComplete={handleOutcomeComplete}
      />
    )}
  </SceneContainer>
);
```

---

## 2. Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ SceneContainer (same background as current scene)       │
│                                                          │
│                                                          │
│   ┌───────────────────────────────────────────────┐    │
│   │  OutcomeDisplay Overlay (z-index: 40)         │    │
│   │                                                │    │
│   │              +15 🔥                            │    │
│   │                                                │    │
│   │    You headbutt the guard. He's impressed.    │    │
│   │    Unfortunately, so is everyone else.        │    │
│   │                                                │    │
│   └───────────────────────────────────────────────┘    │
│                                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Overlay Design

**Background & Vignette Effect:**

```css
.outcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;

  /* Vignette effect - darkens edges for focus */
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );

  /* Center the content */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Design Rationale:**
- Radial gradient creates subtle vignette, drawing eye to center
- Darker edges ensure outcome text is clearly separated from scene
- Fixed positioning covers entire viewport

### Content Card

```css
.outcome-card {
  /* Layout */
  max-width: 480px;
  width: 90%;
  padding: 32px 24px;

  /* Visual */
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(8px);

  /* Shadow for depth */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);

  /* Center content */
  text-align: center;
}
```

**Design Rationale:**
- Dark semi-transparent background ensures readability
- Border adds definition against any scene
- Blur effect creates modern "glass" feel
- Shadow adds depth, makes it feel layered over scene
- Centered alignment focuses attention

### Typography

**Outcome Text:**

```css
.outcome-text {
  font-size: clamp(1.125rem, 4vw, 1.25rem); /* 18px - 20px */
  font-weight: 400;
  color: #ffffff;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
}
```

**Why this sizing:**
- Slightly larger than choice buttons (outcome is more important)
- Same size as story text for consistency
- Clamp ensures readability across devices

### Chaos Change Indicator

**Position & Styling:**

```tsx
// Above outcome text
<div className="chaos-indicator">
  <span className="chaos-emoji">🔥</span>
  <span className="chaos-amount">+15</span>
</div>

.chaos-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 600;
}

.chaos-emoji {
  font-size: 28px;
  animation: chaosPopIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.chaos-amount {
  color: #f97316; /* orange-500 for positive */
  /* or */
  color: #10b981; /* emerald-500 for negative */
}
```

**Dynamic Color Logic:**

```typescript
const getChaosIndicatorStyle = (chaosChange: number) => {
  const isPositive = chaosChange > 0;

  return {
    emoji: getChaosEmoji(chaosChange),
    color: isPositive ? '#f97316' : '#10b981', // orange vs green
    sign: isPositive ? '+' : '', // '+15' vs '-5'
  };
};

const getChaosEmoji = (chaosChange: number): string => {
  if (chaosChange >= 15) return '🔥'; // Big chaos
  if (chaosChange >= 5) return '🤨';  // Medium chaos
  if (chaosChange <= -5) return '😌'; // Reduced chaos
  return '✨';                          // Minimal change
};
```

**Design Rationale:**
- Large, eye-catching display of chaos change
- Color coding: orange/red for chaos increase, green for decrease
- Emoji adds personality and clarity
- Bounce animation draws attention

---

## 3. Animation Timeline

### State Machine

```typescript
type OutcomeAnimationState = 'entering' | 'holding' | 'exiting' | 'complete';

const animationTimeline = {
  fadeIn: 200,      // ms
  hold: 2500,       // ms
  fadeOut: 300,     // ms
  total: 3000,      // ms
};
```

### Full Animation Sequence

```
T=0ms     Outcome component mounts
          ↓
          FADE IN (200ms)
          - Overlay: opacity 0 → 1
          - Card: opacity 0 → 1, translateY(10px) → 0
          - Chaos indicator: scale 0 → 1 (bounce)
          ↓
T=200ms   HOLD (2500ms)
          - Text fully visible, no animation
          - Player reads outcome
          ↓
T=2700ms  FADE OUT (300ms)
          - Overlay: opacity 1 → 0
          - Card: opacity 1 → 0, translateY(0) → -10px
          ↓
T=3000ms  COMPLETE
          - onComplete callback fires
          - Component unmounts
```

### Animation Implementation

**Fade In:**

```css
@keyframes outcomeEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.outcome-card--entering {
  animation: outcomeEnter 200ms ease-out forwards;
}
```

**Fade Out:**

```css
@keyframes outcomeExit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.outcome-card--exiting {
  animation: outcomeExit 300ms ease-in forwards;
}
```

**Chaos Indicator Pop:**

```css
@keyframes chaosPopIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.chaos-indicator {
  animation: chaosPopIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-delay: 100ms;
  animation-fill-mode: backwards;
}
```

**Design Rationale:**
- Slight upward motion on enter creates "floating in" feel
- Downward motion on exit feels like "dissolving away"
- Chaos indicator bounces in slightly delayed for emphasis
- Total time (3s) allows comfortable reading without feeling slow

### Timing Control via useEffect

```typescript
const OutcomeDisplay = ({ outcomeText, chaosChange, onComplete }: Props) => {
  const [animState, setAnimState] = useState<OutcomeAnimationState>('entering');

  useEffect(() => {
    // Start entering
    setAnimState('entering');

    // Transition to holding after fade in
    const holdTimer = setTimeout(() => {
      setAnimState('holding');
    }, 200);

    // Start exiting after hold period
    const exitTimer = setTimeout(() => {
      setAnimState('exiting');
    }, 2700);

    // Complete and notify parent after fade out
    const completeTimer = setTimeout(() => {
      setAnimState('complete');
      onComplete();
    }, 3000);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (animState === 'complete') return null;

  return (
    <div className={`outcome-overlay outcome-overlay--${animState}`}>
      {/* Content */}
    </div>
  );
};
```

---

## 4. Responsive Strategy

### Mobile Portrait (< 640px) - PRIMARY

```tsx
<div className="
  outcome-overlay
  px-4
">
  <div className="
    outcome-card
    max-w-[90%]
    px-6
    py-8
  ">
    {/* Content */}
  </div>
</div>
```

**Design Decisions:**
- 90% width leaves small margin on edges
- 24px horizontal padding inside card
- 32px vertical padding for breathing room
- Text size: 18px (mobile standard)

### Tablet (640px - 1024px)

```tsx
<div className="outcome-card max-w-md px-8 py-10">
  {/* Content */}
</div>
```

**Changes:**
- Max width 28rem (448px) - more constrained
- Increased padding (32px horizontal, 40px vertical)
- Text size scales to 19-20px

### Desktop (> 1024px)

```tsx
<div className="outcome-card max-w-lg px-10 py-12">
  {/* Content */}
</div>
```

**Changes:**
- Max width 32rem (512px)
- Generous padding (40px horizontal, 48px vertical)
- Text size: 20px
- Hover states (if any future interactions)

### Breakpoint Summary

| Viewport | Max Width | H Padding | V Padding | Font Size |
|----------|-----------|-----------|-----------|-----------|
| Mobile (0-639px) | 90% | 24px | 32px | 18px |
| Tablet (640-1023px) | 448px | 32px | 40px | 19px |
| Desktop (1024px+) | 512px | 40px | 48px | 20px |

---

## 5. Integration with Game Flow

### State Machine Integration

```typescript
// Game flow states
type GameFlowState =
  | 'scene_display'
  | 'showing_choices'
  | 'showing_outcome'  // ← OutcomeDisplay active here
  | 'transitioning'
  | 'ending';

// When choice is selected
const handleChoiceSelect = (choice: Choice) => {
  setFlowState('showing_outcome');
  setSelectedOutcome({
    text: choice.outcomeText,
    chaosChange: choice.chaosChange,
  });
};

// When outcome completes
const handleOutcomeComplete = () => {
  setFlowState('transitioning');
  // Apply chaos change to game state
  updateChaosLevel(selectedOutcome.chaosChange);
  // Move to next scene
  setTimeout(() => {
    loadScene(selectedChoice.nextSceneId);
    setFlowState('scene_display');
  }, 300); // Brief pause before new scene
};
```

### Coordination with Other Components

**ChoiceList:**
- Hidden when `flowState === 'showing_outcome'`
- Conditional render: `{flowState === 'showing_choices' && <ChoiceList />}`

**StoryText:**
- Remains visible underneath OutcomeDisplay overlay
- Background scene stays the same
- Creates continuity - player remembers context

**Timer:**
- Stops when choice is selected
- Hidden during outcome display
- Resets when new scene loads

**ChaosMeter:**
- Remains visible (z-index 30, outcome is z-index 40)
- Updates AFTER outcome completes (not during)
- Shows animated transition when chaos changes

### Z-Index Layering

```
Z-Index Stack (during outcome display):
┌─────────────────────────────────────┐
│ 40: OutcomeDisplay Overlay          │ ← Covers everything except HUD
├─────────────────────────────────────┤
│ 30: ChaosMeter (still visible)      │
├─────────────────────────────────────┤
│ 20: StoryText (dimmed by overlay)   │
├─────────────────────────────────────┤
│ 10: Scene overlay gradient          │
├─────────────────────────────────────┤
│  0: Scene background image          │
└─────────────────────────────────────┘
```

---

## 6. Accessibility

### Semantic HTML

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="outcome-overlay"
>
  <div className="outcome-card">
    <div className="chaos-indicator" aria-label={`Chaos ${chaosChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(chaosChange)}`}>
      <span aria-hidden="true">{chaosEmoji}</span>
      <span>{chaosChange > 0 ? '+' : ''}{chaosChange}</span>
    </div>

    <p className="outcome-text">
      {outcomeText}
    </p>
  </div>
</div>
```

**ARIA Rationale:**
- `role="status"` indicates important information update
- `aria-live="polite"` announces when screen reader is ready
- `aria-atomic="true"` reads entire outcome, not just text changes
- Chaos emoji is decorative (aria-hidden), label provides context

### Screen Reader Behavior

**Expected Announcement:**
```
"Status update: Chaos increased by 15.
You headbutt the guard. He's impressed.
Unfortunately, so is everyone else."
```

**Timing Consideration:**
- 2.5 second hold time is sufficient for screen reader to announce
- If user has slow speech rate, they can replay by refreshing (future: replay button)

### Focus Management

**No Interactive Elements:**
- OutcomeDisplay has no buttons or inputs
- Focus remains on last element (selected choice button)
- When outcome completes, focus moves to first choice in new scene

**Implementation:**
```typescript
// When transitioning to new scene
useEffect(() => {
  if (flowState === 'showing_choices') {
    // Auto-focus first choice for keyboard users
    const firstChoice = document.querySelector('[data-choice-button]');
    if (firstChoice instanceof HTMLElement) {
      firstChoice.focus();
    }
  }
}, [flowState]);
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .outcome-card--entering,
  .outcome-card--exiting {
    animation: none;
    transition: opacity 200ms;
  }

  .chaos-indicator {
    animation: none;
  }

  /* Still fade, but no transform animations */
  .outcome-card--entering {
    opacity: 0;
    animation: fadeIn 200ms forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }
}
```

**Rationale:**
- Users with vestibular disorders can be affected by motion
- Keep opacity transitions (less problematic)
- Remove translateY and scale animations
- Same timing, just simplified motion

### Color Contrast

**Text on Overlay:**
- White text (#ffffff) on rgba(0,0,0,0.8) background
- Contrast ratio: ~18:1 (WCAG AAA compliant)

**Chaos Indicator:**
- Orange (#f97316) on dark background: ~4.2:1 (WCAG AA for large text)
- Green (#10b981) on dark background: ~4.1:1 (WCAG AA for large text)

**Border Contrast:**
- White border rgba(255,255,255,0.2) on overlay: 3:1+ (sufficient for non-text)

---

## 7. Edge Cases & Error Handling

### Missing Outcome Text

```typescript
if (!outcomeText || outcomeText.trim() === '') {
  console.error('[OutcomeDisplay] Missing outcomeText prop');

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="outcome-overlay">
        <div className="outcome-card bg-red-900/80">
          <p className="text-red-200 font-mono text-sm">
            Error: outcomeText is required
          </p>
        </div>
      </div>
    );
  }

  // In production, show fallback and complete immediately
  onComplete();
  return null;
}
```

### Extremely Long Text (> 4 sentences)

```typescript
// Warn in development
useEffect(() => {
  const sentenceCount = outcomeText.split(/[.!?]/).filter(s => s.trim()).length;

  if (sentenceCount > 4) {
    console.warn(
      `[OutcomeDisplay] Outcome text has ${sentenceCount} sentences. ` +
      `Recommended: 2-4 sentences max for 2.5s reading time.`
    );
  }
}, [outcomeText]);

// UI fallback: enable scrolling if needed
<div className="outcome-card max-h-[60vh] overflow-y-auto">
  {/* Content */}
</div>
```

**Design Decision:** Allow scrolling as safety net, but content should prevent this

### Zero Chaos Change

```typescript
// Don't show chaos indicator if no change
{chaosChange !== 0 && (
  <div className="chaos-indicator">
    {/* Chaos display */}
  </div>
)}
```

**Rationale:** Some outcomes may be narrative-only with no chaos impact

### Component Unmounts During Animation

```typescript
useEffect(() => {
  const timers = [
    setTimeout(() => setAnimState('holding'), 200),
    setTimeout(() => setAnimState('exiting'), 2700),
    setTimeout(() => {
      setAnimState('complete');
      onComplete();
    }, 3000),
  ];

  // CRITICAL: Clear all timers on unmount
  return () => {
    timers.forEach(clearTimeout);
  };
}, [onComplete]);
```

**Prevents:** Memory leaks and callback after unmount errors

### Rapid Scene Transitions

```typescript
// Parent component protection
const [isOutcomeActive, setIsOutcomeActive] = useState(false);

const handleChoiceSelect = (choice: Choice) => {
  if (isOutcomeActive) {
    console.warn('[GameFlow] Outcome already active, ignoring new selection');
    return;
  }

  setIsOutcomeActive(true);
  // ... show outcome
};

const handleOutcomeComplete = () => {
  setIsOutcomeActive(false);
  // ... transition to next scene
};
```

---

## 8. Performance Considerations

### Rendering Optimization

```typescript
import { memo } from 'react';

const OutcomeDisplay = memo(({
  outcomeText,
  chaosChange,
  onComplete,
}: OutcomeDisplayProps) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Only re-render if these change
  return (
    prevProps.outcomeText === nextProps.outcomeText &&
    prevProps.chaosChange === nextProps.chaosChange
  );
  // Note: Don't compare onComplete (function always changes)
});
```

**Rationale:** Prevent unnecessary re-renders from parent state changes

### Animation Performance

**GPU Acceleration:**

```css
.outcome-overlay,
.outcome-card,
.chaos-indicator {
  will-change: opacity, transform;
}

/* Remove will-change after animation */
.outcome-overlay--complete {
  will-change: auto;
}
```

**Best Practice:** Only use `will-change` during active animations

**Composite Layers:**
- Opacity and transform trigger compositing
- No layout reflows during animation
- Smooth 60fps animation on modern devices

### Memory Management

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Clear all timers
    // Remove event listeners if any
    // Cancel any pending animations
  };
}, []);
```

---

## 9. Testing Strategy

### Visual Testing Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Short outcome (1 sentence) | Text centered, plenty of white space |
| Medium outcome (2-3 sentences) | Text fills card comfortably, readable |
| Long outcome (4 sentences) | Text fits without scroll, still readable in 2.5s |
| Positive chaos (+15) | Orange color, 🔥 emoji, +15 displayed |
| Negative chaos (-5) | Green color, 😌 emoji, -5 displayed |
| Zero chaos (0) | No chaos indicator displayed |
| Large chaos change (+30) | 🔥 emoji, orange, dramatic bounce |

### Animation Testing

```typescript
describe('OutcomeDisplay animations', () => {
  it('fades in over 200ms', async () => {
    render(<OutcomeDisplay {...props} />);
    const overlay = screen.getByTestId('outcome-overlay');

    expect(overlay).toHaveClass('outcome-overlay--entering');

    await waitFor(() => {
      expect(overlay).toHaveClass('outcome-overlay--holding');
    }, { timeout: 300 });
  });

  it('calls onComplete after 3000ms', async () => {
    const onComplete = jest.fn();
    render(<OutcomeDisplay {...props} onComplete={onComplete} />);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 3200 });
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<OutcomeDisplay {...props} />);
    unmount();

    // Should not throw errors or call onComplete after unmount
    jest.advanceTimersByTime(3000);
    expect(props.onComplete).not.toHaveBeenCalled();
  });
});
```

### Accessibility Testing

- [ ] Run axe DevTools - no violations
- [ ] Screen reader announces outcome with correct context
- [ ] Reduced motion mode works (no transform animations)
- [ ] Text contrast passes WCAG AA
- [ ] No keyboard trap (non-interactive)

### Cross-Device Testing

- [ ] iPhone SE (375px width) - text readable, not cramped
- [ ] iPhone 14 Pro (393px width) - proper padding
- [ ] iPad (768px width) - centered, not too wide
- [ ] Desktop (1920px) - max-width constrains, centered
- [ ] Animation smooth on all devices (60fps)

### Integration Testing

```typescript
describe('OutcomeDisplay in game flow', () => {
  it('hides ChoiceList when outcome is showing', () => {
    // Test that choices unmount when outcome appears
  });

  it('triggers scene transition after completion', () => {
    // Test that onComplete callback leads to next scene
  });

  it('updates ChaosMeter after outcome completes', () => {
    // Test that chaos level changes after outcome, not during
  });
});
```

---

## 10. Component Implementation Checklist

Once approved:

1. **Create Component File:** `OutcomeDisplay.tsx`
2. **Implement State Machine:** entering → holding → exiting → complete
3. **Add Styled Overlay:** Vignette effect, centered card
4. **Implement Chaos Indicator:** Dynamic emoji and color based on change
5. **Add Fade Animations:** Entry and exit with timing control
6. **Implement Auto-Dismiss:** useEffect with timers
7. **Add Responsive Styles:** Mobile-first, breakpoint adjustments
8. **Implement Accessibility:** ARIA roles, reduced motion support
9. **Add Error Handling:** Missing text, long text fallbacks
10. **Write Unit Tests:** Animation timing, prop handling, cleanup
11. **Test Integration:** With ChoiceList, SceneContainer, game flow
12. **Visual Testing:** All scenarios on multiple devices
13. **Performance Check:** Smooth 60fps animation, no memory leaks

---

## 11. Open Questions

Before implementation, confirm:

1. **Hold Duration:** 2500ms (2.5 seconds) sufficient for reading? Or should it be adjustable based on text length?
   - *Recommendation:* Fixed 2500ms for MVP. Dynamic timing in v1.1 if needed.

2. **Vignette Intensity:** Current design uses radial gradient. Too subtle or too dramatic?
   - *Recommendation:* Test with darkest and brightest scenes, adjust if needed.

3. **Chaos Indicator Position:** Above text (current) or below text?
   - *Recommendation:* Above text - draws eye first, then reads consequence.

4. **Skip Option:** Should user be able to tap to skip outcome early?
   - *Recommendation:* Not for MVP. Consistent timing is better for comedy pacing.

5. **Sound Effect:** Should outcome appearance have audio feedback?
   - *Recommendation:* Not for MVP. Add in v1.1 with sound settings.

6. **Character-Specific Styling:** Should Rupert/Milo outcomes have different styling?
   - *Recommendation:* Not needed. Outcome text content differentiates, not UI.

---

## 12. Future Enhancements (v1.1+)

### Dynamic Hold Time

```typescript
const calculateHoldTime = (text: string): number => {
  const wordCount = text.split(/\s+/).length;
  const readingTime = (wordCount / 3) * 1000; // 3 words per second
  return Math.max(2000, Math.min(4000, readingTime)); // 2-4 seconds
};
```

### Tap-to-Skip

```typescript
const handleOverlayClick = () => {
  if (animState === 'holding') {
    setAnimState('exiting');
    // Accelerate to completion
  }
};

<div className="outcome-overlay" onClick={handleOverlayClick}>
  {/* Content */}
  <p className="text-xs text-white/50 mt-4">Tap to continue</p>
</div>
```

### Character-Specific Effects

```typescript
// Rupert: screen shake
if (character === 'rupert' && Math.abs(chaosChange) >= 15) {
  triggerScreenShake();
}

// Milo: sparkle particles
if (character === 'milo' && choice.isMagic) {
  triggerSparkleEffect();
}
```

### Outcome History Replay

```typescript
// Allow players to review past outcomes
const [outcomeHistory, setOutcomeHistory] = useState<Outcome[]>([]);

// Store outcomes for review on ending screen
<EndingScreen outcomes={outcomeHistory} />
```

---

## 13. Approval Checklist

Before building, confirm:

- [ ] Acceptance criteria understood and achievable
- [ ] Component API approved (props, timing, callbacks)
- [ ] Visual design approved (overlay, card, chaos indicator)
- [ ] Animation timing approved (200ms / 2500ms / 300ms)
- [ ] Responsive strategy approved (mobile-first, max-widths)
- [ ] Accessibility approach approved (ARIA, reduced motion, contrast)
- [ ] Integration with game flow understood (state machine coordination)
- [ ] Z-index layering approved (z-40, above content, below HUD)
- [ ] Edge cases covered (missing text, long text, cleanup)
- [ ] Testing strategy makes sense

---

## 14. Related Tickets

This component depends on:
- Ticket 1.1: SceneContainer (parent container)
- Ticket 1.2: StoryText (similar styling reference)
- Ticket 1.3: ChoiceList (hides when outcome shows)
- `src/types/game.ts` (Choice interface with outcomeText)

This component blocks:
- Ticket 1.5: Scene Transition Logic (needs onComplete callback)
- Ticket 1.6: Game Flow State Machine (showing_outcome state)

---

*OutcomeDisplay Design - Chaos Stories MVP*
*Version: 1.0 (Design Phase)*
*Ready for implementation: Pending approval*
