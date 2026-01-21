# StoryText Component - Design Document

> Design specification for the scene story text display component
> Ticket: 1.2 (Feature 1: Core Game Loop)
> Status: Design Phase - Awaiting approval

---

## Overview

The StoryText component displays the narrative text for each scene. It must be readable in under 10 seconds on any background, with excellent contrast and mobile-optimized typography. This is the player's primary source of story information.

### Key Requirements

- WCAG AA contrast (4.5:1 minimum) on all backgrounds
- Mobile-first font sizing (min 18px)
- Readable without scrolling (max 4 sentences)
- Minimum 16px padding from screen edges
- Fast reading time (under 10 seconds)
- Support for arrival variants (contextual text based on previous scene)

---

## 1. Component Structure

### Component API

```tsx
interface StoryTextProps {
  text: string;                    // Main scene text
  arrivalText?: string;            // Optional: variant text based on previous scene
  position?: 'top' | 'center';     // Layout position, default 'top'
  className?: string;              // Optional additional styles
  testId?: string;                 // For testing
  animate?: boolean;               // Enable fade-in animation, default true
}

export default function StoryText({
  text,
  arrivalText,
  position = 'top',
  className = '',
  testId = 'story-text',
  animate = true,
}: StoryTextProps): JSX.Element;
```

### Props Rationale

| Prop | Why It's Needed |
|------|-----------------|
| `text` | Core scene narrative (required) |
| `arrivalText` | Some scenes have different text based on how you arrived (arrivalVariants in Scene type) |
| `position` | Most scenes use top-third, but endings might center text |
| `className` | Escape hatch for special styling |
| `testId` | Testing and debugging |
| `animate` | Fade-in on scene transition for polish |

### Display Logic

```tsx
// Which text to show?
const displayText = arrivalText || text;

// Priority:
// 1. If arrivalText provided → show arrivalText
// 2. Otherwise → show default text
```

### File Organization

```
src/components/StoryText/
├── DESIGN.md                 # This file
├── StoryText.tsx             # Main component
├── StoryText.test.tsx        # Unit tests
└── index.ts                  # Barrel export
```

### Component Composition

```tsx
// Usage within SceneContainer
<SceneContainer backgroundImage="/images/scenes/tavern.jpg">
  <StoryText
    text="You push open the heavy tavern door..."
    position="top"
  />
  <ChoiceList choices={scene.choices} />
  <ChaosMeter level={chaosLevel} />
</SceneContainer>

// Usage with arrival variant
<StoryText
  text="The forest path stretches ahead."
  arrivalText="You stumble out of the tavern, blinking in the sunlight."
/>
```

---

## 2. Visual Design

### Typography

**Font Sizing (Mobile-First)**

```css
/* Recommended: Use clamp for fluid sizing */
.story-text {
  font-size: clamp(1.125rem, 4vw, 1.375rem);
  /* Translates to: 18px → 22px based on viewport */
}
```

**Tailwind Alternative:**
```tsx
className="text-lg md:text-xl"
// Mobile: 18px (1.125rem)
// Desktop: 20px (1.25rem)
```

**Why clamp is better:**
- Smooth scaling between breakpoints
- No sudden jumps at breakpoints
- Better for readability across devices

**Font Weight & Line Height**

```css
font-weight: 400;        /* Regular - easy to read */
line-height: 1.5;        /* Normal - comfortable reading */
letter-spacing: 0.01em;  /* Slight tracking for readability */
```

From design tokens:
- Weight: `font-normal` (400)
- Leading: `leading-normal` (1.5)

### Color & Contrast

**Text Color:**
```css
color: #ffffff;          /* Pure white for maximum contrast */
```

Tailwind: `text-white`

**Text Shadow for Readability:**
```css
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
```

From design tokens: `--shadow-text: 0 2px 4px rgba(0, 0, 0, 0.8)`

**Why this works:**
- Dark shadow creates halo effect
- Readable on bright AND dark backgrounds
- WCAG AA compliant when combined with overlay

**Contrast Testing:**
- Text: `#ffffff` (white)
- Background (with overlay): darkest area is `rgba(0, 0, 0, 0.8)` = ~19:1 ratio
- Passes WCAG AAA (7:1 minimum for normal text)

### Position & Layout

**Position Options:**

```
┌─────────────────────────────────────────────────────┐
│ SceneContainer                                      │
│                                                     │
│  OPTION A: TOP-THIRD (default)                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Story Text                                    │ │
│  │ "You push open the heavy door..."            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│                                                     │
│                                                     │
│  OPTION B: CENTER (endings, dramatic moments)      │
│                                                     │
│          ┌─────────────────────────────┐           │
│          │ Story Text                  │           │
│          │ "You have won!"             │           │
│          └─────────────────────────────┘           │
│                                                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// position='top' (default - most scenes)
<div className="flex-1 flex items-start justify-center pt-8 md:pt-12">
  <p className="...">
    {displayText}
  </p>
</div>

// position='center' (endings)
<div className="flex-1 flex items-center justify-center">
  <p className="...">
    {displayText}
  </p>
</div>
```

### Padding & Spacing

**Horizontal Padding:**
- Already handled by SceneContainer (16px mobile, 24px desktop)
- StoryText inherits this naturally

**Vertical Spacing:**
- Top position: `pt-8` (32px mobile), `md:pt-12` (48px desktop)
- Center position: Flexbox centers automatically
- Bottom margin: `mb-8` to separate from choices

**Max Width:**
- Constrain for optimal reading: `max-w-2xl` (672px)
- Prevents long lines on ultra-wide screens
- Reading studies show 60-75 characters per line is optimal

```tsx
<p className="max-w-2xl mx-auto text-center">
  {displayText}
</p>
```

---

## 3. Responsive Strategy

### Breakpoint Behavior

| Viewport | Font Size | Line Height | Padding Top | Max Width |
|----------|-----------|-------------|-------------|-----------|
| Mobile (0-639px) | 18px | 1.5 | 32px | 100% |
| Tablet (640-1023px) | 19px | 1.5 | 40px | 672px |
| Desktop (1024px+) | 22px | 1.5 | 48px | 672px |

### Reading Time Optimization

**Design Goal:** Text readable in under 10 seconds

**Reading Speed Reference:**
- Average: 200-250 words per minute = 3-4 words per second
- Under time pressure: 150-200 WPM = 2.5-3 words per second

**Max Length Calculation:**
- 10 seconds × 3 words/sec = 30 words max
- 4 sentences ≈ 6-8 words each = 24-32 words
- **Target: 25-30 words per scene**

**Content Enforcement:**
- Max 4 sentences (enforced in story content)
- Estimated reading time: 8-10 seconds
- Leaves 15 seconds for choice consideration (25 sec timer)

### Responsive Font Sizing

**Option 1: Clamp (Recommended)**

```css
.story-text {
  font-size: clamp(1.125rem, 4vw, 1.375rem);
}
```

Pros:
- Smooth scaling
- No breakpoint jumps
- Optimal readability at all sizes

Cons:
- Slightly less control at specific breakpoints

**Option 2: Breakpoint-based (Fallback)**

```tsx
className="text-lg sm:text-xl md:text-[1.375rem]"
```

Pros:
- Explicit control
- Easier to debug

Cons:
- Sudden size jumps at breakpoints

**Recommendation:** Use clamp in production, breakpoint-based for testing.

### Long Text Handling

**Scenario:** Content exceeds 4 sentences (edge case)

**Solutions:**

1. **Truncation (Content-level):**
   ```tsx
   // In story editing, enforce max length
   if (text.split('.').length > 4) {
     console.warn('Scene text exceeds 4 sentences!');
   }
   ```

2. **Scroll (UI-level, fallback):**
   ```tsx
   <div className="max-h-[40vh] overflow-y-auto">
     <p>{text}</p>
   </div>
   ```

3. **Font Size Reduction (Not recommended):**
   - Violates minimum 18px requirement
   - Avoid at all costs

**Recommendation:** Enforce at content level. If overflow happens, allow scroll as safety net.

---

## 4. Tailwind CSS Approach

### Core Utility Classes

```tsx
const StoryText = ({ text, arrivalText, position = 'top', animate = true }) => {
  const displayText = arrivalText || text;

  // Position wrapper classes
  const wrapperClasses = position === 'center'
    ? 'flex-1 flex items-center justify-center'
    : 'flex-1 flex items-start justify-center pt-8 md:pt-12';

  // Text classes
  const textClasses = `
    max-w-2xl
    mx-auto
    text-center
    text-white
    text-lg
    md:text-xl
    font-normal
    leading-normal
    mb-8
    ${animate ? 'animate-fade-in' : ''}
  `;

  return (
    <div className={wrapperClasses} data-testid="story-text-wrapper">
      <p
        className={textClasses}
        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
      >
        {displayText}
      </p>
    </div>
  );
};
```

### Custom Text Shadow

**Option A: Inline Style (Recommended for MVP)**

```tsx
<p style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>
  {text}
</p>
```

Pros:
- Simple, no config needed
- Matches design tokens exactly

Cons:
- Not reusable (but only used here)

**Option B: Tailwind Plugin (Future)**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      textShadow: {
        'story': '0 2px 4px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
```

Then: `className="text-shadow-story"`

**Recommendation:** Use inline style for MVP. Consider plugin if text shadows needed elsewhere.

### Animation Classes

**Fade In Animation:**

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 300ms ease-out;
}
```

Add to `globals.css`:

```css
@layer utilities {
  .animate-fade-in {
    animation: fade-in 300ms ease-out;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Design Token Mapping

From `/docs/DESIGN-TOKENS.md`:

| Design Token | Tailwind Class | Value |
|--------------|----------------|-------|
| Scene text size (mobile) | `text-lg` | 18px |
| Scene text size (desktop) | `md:text-xl` | 20px |
| Font weight | `font-normal` | 400 |
| Line height | `leading-normal` | 1.5 |
| Text color | `text-white` | #ffffff |
| Max width | `max-w-2xl` | 672px |
| Bottom margin | `mb-8` | 32px |
| Top padding | `pt-8 md:pt-12` | 32px / 48px |

---

## 5. Accessibility

### Semantic HTML

**Correct Element Choice:**

```tsx
// Option A: <p> tag (Recommended)
<p className="story-text">
  {displayText}
</p>
```

Rationale:
- Paragraph is semantically correct for narrative text
- Screen readers announce as text block
- Natural pause at end for pacing

**Alternative: <div> with role**

```tsx
<div role="text" className="story-text">
  {displayText}
</div>
```

Only use if complex nested structure needed.

### Screen Reader Considerations

**Announcement Behavior:**

```tsx
<div
  className={wrapperClasses}
  role="region"
  aria-label="Scene description"
>
  <p>{displayText}</p>
</div>
```

**Rationale:**
- `role="region"` groups scene text as a landmark
- `aria-label` provides context
- Screen reader announces: "Scene description: You push open the door..."

**Alternative (Simpler):**

```tsx
<p>{displayText}</p>
```

No extra roles needed if SceneContainer already has semantic structure.

**Recommendation:** Use simple `<p>` tag. Parent containers handle semantic structure.

### Live Region for Scene Changes

**Challenge:** When scene changes, screen reader should announce new text.

**Solution:**

```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <p>{displayText}</p>
</div>
```

**How it works:**
- `aria-live="polite"` waits for screen reader to finish current announcement
- `aria-atomic="true"` reads entire paragraph, not just changes
- Scene transitions trigger new announcement

**Recommendation:** Implement in v1.1 after testing. May conflict with other live regions (timer, chaos meter).

### Contrast Compliance

**WCAG AA Requirements:**
- Normal text: 4.5:1 contrast ratio
- Large text (24px+): 3:1 contrast ratio

**Our Implementation:**
- Text: `#ffffff` (white)
- Background: `rgba(0, 0, 0, 0.6)` overlay minimum
- Text shadow: `0 2px 4px rgba(0, 0, 0, 0.8)`

**Contrast Ratio Calculation:**
```
White (#ffffff) on Black overlay (0.6 alpha) on any image
Worst case: Bright image
Effective background: ~rgba(77, 77, 77) due to overlay
Contrast: 15:1 (passes WCAG AAA)
```

**Testing:**
- Use browser DevTools contrast checker
- Test on brightest scene backgrounds
- Ensure ratio never drops below 4.5:1

### Focus Management

StoryText is non-interactive, so no focus states needed. Screen reader cursor can land on text naturally.

### Motion Sensitivity

**Fade-in Animation Concern:**
- Some users have `prefers-reduced-motion` enabled
- Respect their preference

**Implementation:**

```tsx
// Detect motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<p
  className={prefersReducedMotion ? '' : 'animate-fade-in'}
  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
>
  {displayText}
</p>
```

**CSS Alternative:**

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
}
```

**Recommendation:** Use CSS media query. Simpler, no JS needed.

---

## 6. Integration with SceneContainer

### Layout Hierarchy

```tsx
<SceneContainer backgroundImage="/images/scenes/tavern.jpg">
  {/* z-index: 20 (content layer) */}
  <div className="flex flex-col min-h-screen">

    {/* Story Text - top section */}
    <StoryText
      text="You push open the door..."
      position="top"
    />

    {/* Spacer - pushes choices to bottom */}
    <div className="flex-1" />

    {/* Choices - bottom section */}
    <ChoiceList choices={scene.choices} />

    {/* HUD Elements - absolute positioned */}
    <ChaosMeter level={chaosLevel} />
    <Timer secondsRemaining={timeLeft} />
  </div>
</SceneContainer>
```

### Z-Index Management

From design tokens:

| Layer | Z-Index | Component |
|-------|---------|-----------|
| Scene background | 0 | Background image |
| Scene overlay | 10 | Dark gradient |
| Scene content | 20 | StoryText, choices |
| HUD elements | 30 | Chaos meter, timer |

StoryText inherits `z-index: 20` from SceneContainer's content layer. No additional z-index needed.

### Coordination with Other Components

**With ChoiceList:**
- StoryText uses `mb-8` to create gap
- ChoiceList has its own top margin/padding
- Total space: ~12-16px between text and choices

**With Timer:**
- Timer is fixed/absolute positioned
- No layout conflict with StoryText

**With ChaosMeter:**
- ChaosMeter is fixed top-right
- StoryText is centered, no overlap on mobile

**With Outcome Display:**
- Outcome replaces StoryText temporarily
- Same position and styling
- Smooth transition via fade

---

## 7. Animation & Transitions

### Scene Transition Flow

```
User clicks choice
  ↓
Outcome text appears (fade in, 200ms)
  ↓
Hold for reading (2.5s)
  ↓
Outcome fades out (200ms)
  ↓
SceneContainer crossfades to new background (300ms)
  ↓
NEW StoryText fades in (300ms) ← StoryText animation
  ↓
Choices slide up (300ms, staggered)
```

### StoryText Animation Timing

**Entry Animation:**
```css
animation: fade-in 300ms ease-out;
```

**Reasoning:**
- 300ms is perceptible but not slow
- Matches design token for "medium" transitions
- Coordinates with scene crossfade timing

**Exit Animation:**
- Not needed (handled by outcome component)
- StoryText simply unmounts/remounts on scene change

### Animation Variants

**Standard Fade-In (Default):**
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

No transform for motion-sensitive users.

**No Animation (animate={false}):**
```tsx
<StoryText text="..." animate={false} />
```

Instant appearance, useful for:
- Testing
- Debug mode
- Replay when skipping transitions

---

## 8. Testing Strategy

### Visual Regression Testing

| Test Case | Expected Result |
|-----------|-----------------|
| Short text (1 sentence) | Centered, readable, no overflow |
| Medium text (2-3 sentences) | Well-spaced, centered, readable |
| Long text (4 sentences) | Still readable, no scroll needed |
| Very long text (5+ sentences) | Scrollable fallback (edge case) |
| Mobile portrait (375x667) | 18px font, 32px top padding |
| Mobile landscape (667x375) | Same font, possibly scrolls |
| Tablet (768x1024) | 20px font, 40px top padding |
| Desktop (1920x1080) | 22px font, 48px top padding, max 672px width |

### Contrast Testing

**Procedure:**
1. Load each scene background
2. Use browser DevTools "Inspect" → "Accessibility" tab
3. Check text contrast ratio
4. Ensure ≥ 4.5:1 for all scenes

**Test Scenarios:**
- Brightest background (outdoor daylight)
- Darkest background (cave, night)
- High-contrast background (fire, explosions)
- Medium-tone background (forest, indoor)

### Screen Reader Testing

**Tools:**
- VoiceOver (macOS/iOS)
- NVDA (Windows)
- TalkBack (Android)

**Test Flow:**
1. Navigate to scene
2. Confirm text is announced
3. Verify proper pacing (doesn't interrupt timer or other announcements)
4. Check scene transition announces new text

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import StoryText from './StoryText';

describe('StoryText', () => {
  it('renders text prop', () => {
    render(<StoryText text="Test scene text" />);
    expect(screen.getByText('Test scene text')).toBeInTheDocument();
  });

  it('prioritizes arrivalText over text', () => {
    render(
      <StoryText
        text="Default text"
        arrivalText="Arrival variant text"
      />
    );
    expect(screen.getByText('Arrival variant text')).toBeInTheDocument();
    expect(screen.queryByText('Default text')).not.toBeInTheDocument();
  });

  it('applies top position by default', () => {
    const { container } = render(<StoryText text="Test" />);
    const wrapper = container.querySelector('[data-testid="story-text-wrapper"]');
    expect(wrapper).toHaveClass('items-start');
  });

  it('applies center position when specified', () => {
    const { container } = render(<StoryText text="Test" position="center" />);
    const wrapper = container.querySelector('[data-testid="story-text-wrapper"]');
    expect(wrapper).toHaveClass('items-center');
  });

  it('includes fade animation by default', () => {
    const { container } = render(<StoryText text="Test" />);
    const text = container.querySelector('p');
    expect(text).toHaveClass('animate-fade-in');
  });

  it('omits animation when animate=false', () => {
    const { container } = render(<StoryText text="Test" animate={false} />);
    const text = container.querySelector('p');
    expect(text).not.toHaveClass('animate-fade-in');
  });

  it('applies text shadow style', () => {
    const { container } = render(<StoryText text="Test" />);
    const text = container.querySelector('p');
    expect(text).toHaveStyle({ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' });
  });
});
```

### Accessibility Testing

**Automated:**
- Run axe DevTools on component
- Check for contrast violations
- Verify semantic HTML

**Manual:**
- Tab navigation (should skip, as non-interactive)
- Screen reader navigation (should read text)
- Zoom to 200% (text should reflow, not truncate)

---

## 9. Performance Considerations

### Rendering Performance

**Concern:** Does text re-render unnecessarily on timer updates?

**Solution:** Memoize component

```tsx
import { memo } from 'react';

const StoryText = memo(({ text, arrivalText, position, animate }: StoryTextProps) => {
  // ... component logic
});

export default StoryText;
```

**When to re-render:**
- Scene changes (new text)
- Arrival variant changes
- Position prop changes

**When NOT to re-render:**
- Timer updates (different component)
- Chaos meter updates (different component)
- Parent re-renders (unless props change)

### Animation Performance

**Fade-in Animation Optimization:**

```css
.animate-fade-in {
  animation: fade-in 300ms ease-out;
  will-change: opacity, transform;
}
```

`will-change` hints browser to optimize animation layers.

**Concern:** Over-use of `will-change` can hurt performance.

**Solution:** Apply only during animation

```tsx
// In component
const [isAnimating, setIsAnimating] = useState(animate);

useEffect(() => {
  if (animate) {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }
}, [animate, text]);

<p
  className={`... ${animate ? 'animate-fade-in' : ''}`}
  style={{
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    willChange: isAnimating ? 'opacity, transform' : 'auto',
  }}
>
```

**Recommendation for MVP:** Skip `will-change` optimization. Add in v1.1 if performance issues arise.

### Text Rendering

**Font Loading:**
- Inter font (from design tokens)
- Should be preloaded in `_document.tsx` or `layout.tsx`
- Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

StoryText inherits font automatically.

---

## 10. Edge Cases & Fallbacks

### Edge Case Matrix

| Scenario | Behavior | Solution |
|----------|----------|----------|
| Empty text prop | Display nothing or placeholder | Show error in dev, empty in prod |
| Very long text (10+ sentences) | Overflows screen | Enable scroll, warn in console |
| Text with HTML/markdown | Renders as plain text | Sanitize or parse if needed (v1.1) |
| Missing arrivalText | Falls back to default text | Built into logic (arrivalText || text) |
| Scene with no text | Shows blank area | Content validation should prevent |
| Ultra-wide screen (3440px+) | Text spreads too wide | Max-width (672px) prevents this |
| Very small screen (<320px) | Text too small | Min font size (18px) maintained |

### Error Handling

**Missing Text Prop:**

```tsx
const StoryText = ({ text, arrivalText, ...props }: StoryTextProps) => {
  const displayText = arrivalText || text;

  if (!displayText) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="text-red-500 font-bold p-4 bg-red-100 rounded">
          Error: StoryText requires text prop
        </div>
      );
    }
    return null; // Fail silently in production
  }

  // ... render logic
};
```

**Long Text Warning:**

```tsx
useEffect(() => {
  if (displayText.split('.').length > 4) {
    console.warn(
      `[StoryText] Text exceeds 4 sentences (${displayText.split('.').length} found). ` +
      `Reading time may exceed 10 seconds. Scene: ${displayText.substring(0, 50)}...`
    );
  }
}, [displayText]);
```

Helps content authors catch issues during development.

---

## 11. Open Questions

Before implementation, confirm:

1. **Arrival Variants:** Should StoryText handle variant selection, or receive pre-selected text?
   - *Recommendation:* Receive pre-selected text (simpler, separates concerns)

2. **Animation Control:** Should animation be opt-in or opt-out?
   - *Recommendation:* Opt-out (animate by default, disable for testing)

3. **Max Width:** 672px (max-w-2xl) or wider (800px)?
   - *Recommendation:* 672px matches design tokens, optimal for reading

4. **Font Size (clamp vs breakpoints):** Use fluid clamp or discrete breakpoints?
   - *Recommendation:* Start with clamp, test readability, fall back to breakpoints if issues

5. **Position Prop:** Just 'top' and 'center', or more options ('bottom', 'top-left', etc.)?
   - *Recommendation:* Just 'top' and 'center' for MVP. Add more if needed.

6. **Text Parsing:** Should we support bold/italic formatting in text?
   - *Recommendation:* Not for MVP. Plain text only. Add Markdown parser in v1.1 if requested.

---

## 12. Approval Checklist

Before building, confirm:

- [ ] Acceptance criteria understood and achievable
- [ ] Component API approved (props, text selection logic)
- [ ] Visual design approved (font size, shadow, positioning)
- [ ] Responsive strategy approved (clamp vs breakpoints)
- [ ] Animation approved (fade-in, timing, motion sensitivity)
- [ ] Accessibility approach approved (semantic HTML, contrast, screen readers)
- [ ] Integration with SceneContainer understood
- [ ] Testing strategy makes sense
- [ ] Edge cases and fallbacks covered
- [ ] Design tokens referenced correctly

---

## 13. Implementation Checklist

Once approved:

1. **Create Component File:** `StoryText.tsx`
2. **Implement Text Display:** With text/arrivalText logic
3. **Add Responsive Styling:** Font sizes, padding, max-width
4. **Apply Text Shadow:** For readability on any background
5. **Add Fade-In Animation:** With reduced motion support
6. **Add Position Variants:** Top and center options
7. **Test on Multiple Backgrounds:** Verify contrast on all scenes
8. **Write Unit Tests:** Cover props, rendering, and logic
9. **Test with Screen Reader:** Verify announcement behavior
10. **Document Usage:** Add JSDoc comments and examples
11. **Integration Test:** Use in first test scene with SceneContainer

---

## 14. Related Tickets

This component will be used by:
- Ticket 1.1: SceneContainer (parent container)
- Ticket 1.3: Choice Buttons Component (sibling, layout coordination)
- Ticket 1.4: Scene Transition Logic (provides text for scenes)

This component depends on:
- `src/types/game.ts` (Scene interface with text and arrivalVariants)
- `/docs/DESIGN-TOKENS.md` (typography, spacing, colors)

---

## 15. Future Enhancements (v1.1+)

### Text Formatting
- Support for **bold** and *italic* text
- Markdown or simple BBCode parser
- Character names in different color

### Advanced Typography
- Variable font for smoother scaling
- Optical sizing for readability
- Hanging punctuation for quotes

### Animation Variants
- Different entrance styles per scene type (tavern = fade, combat = shake)
- Character-specific text animations (Rupert = bold appear, Milo = glitch)

### Accessibility Enhancements
- Dyslexia-friendly font option
- User-adjustable font size
- High contrast mode toggle

### Performance
- Preload fonts with critical CSS
- GPU acceleration for animations
- Virtualized rendering for very long text

---

*StoryText Design - Chaos Stories MVP*
*Version: 1.0 (Design Phase)*
*Ready for implementation: Pending approval*
