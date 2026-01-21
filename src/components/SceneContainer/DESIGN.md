# SceneContainer Component - Design Document

> Design specification for the full-screen scene container
> Ticket: 1.1 (Feature 1: Core Game Loop)
> Status: Design Phase - Awaiting approval

---

## Overview

The SceneContainer is the foundational visual component that wraps every scene in the game. It provides an immersive, full-screen background with proper text contrast and responsive behavior across all devices.

### Key Requirements

- Full-screen background image (no letterboxing)
- Text readability on any background
- Mobile-first, edge-to-edge on small screens
- Centered, max-width container on desktop
- Optimized image loading with Next.js

---

## 1. Component Structure

### Component API

```tsx
interface SceneContainerProps {
  backgroundImage: string;        // Path to image (e.g., "/images/scenes/tavern.jpg")
  children: React.ReactNode;      // Scene content (text, choices, etc.)
  className?: string;             // Optional additional styles
  overlayOpacity?: number;        // Optional: 0-1, default 0.6
  testId?: string;                // For testing
}

export default function SceneContainer({
  backgroundImage,
  children,
  className = '',
  overlayOpacity = 0.6,
  testId = 'scene-container',
}: SceneContainerProps): JSX.Element;
```

### Props Rationale

| Prop | Why It's Needed |
|------|-----------------|
| `backgroundImage` | Each scene has unique background (e.g., tavern, forest, dragon) |
| `children` | Allows scene text, choices, and UI elements to be composed inside |
| `className` | Escape hatch for special scenes (e.g., ending screens) |
| `overlayOpacity` | Different scenes may need lighter/darker overlays |
| `testId` | Enables E2E and unit testing |

### File Organization

```
src/components/SceneContainer/
├── DESIGN.md                    # This file
├── SceneContainer.tsx           # Main component
├── SceneContainer.module.css    # Component-specific styles (if needed)
├── SceneContainer.test.tsx      # Unit tests
└── index.ts                     # Barrel export
```

### Component Composition

```tsx
// Usage example
<SceneContainer backgroundImage="/images/scenes/tavern.jpg">
  <StoryText text="You push open the heavy tavern door..." />
  <ChoiceList choices={currentScene.choices} />
  <ChaosMeter level={chaosState} />
  <Timer secondsRemaining={timeLeft} />
</SceneContainer>
```

---

## 2. Visual Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ SceneContainer (100vh x 100vw)                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Background Image (object-fit: cover)                │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Dark Gradient Overlay (z-index: 10)             │ │ │
│ │ │                                                 │ │ │
│ │ │ ┌─────────────────────────────────────────────┐ │ │ │
│ │ │ │ Content Container (z-index: 20)             │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ │  MOBILE: Full-width, edge-to-edge padding  │ │ │ │
│ │ │ │  DESKTOP: max-w-2xl, centered              │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ │  {children}                                 │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ └─────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Background Image Approach

**Option: CSS Background (Recommended)**

```css
.scene-background {
  background-image: url('/images/scenes/tavern.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

Pros:
- Simple implementation
- Perfect for full-screen backgrounds
- No aspect ratio concerns
- Works with gradient overlay naturally

Cons:
- Less optimization than next/image
- No automatic WebP conversion

**Rationale:** For MVP, CSS backgrounds are simpler and sufficient. We can migrate to next/image in v1.1 if performance becomes an issue.

### Overlay Design

**Gradient Overlay (Recommended for MVP)**

```css
.overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
```

Pros:
- Better readability for bottom-positioned choices
- Subtle, doesn't block the background art
- No harsh edges

Cons:
- None significant

**Alternative: Solid Overlay (Backup)**

```css
.overlay-solid {
  background: rgba(0, 0, 0, 0.6);
}
```

Only use if gradient causes contrast issues in testing.

### Content Layout

**Mobile (< 640px):**
```css
.content-container {
  width: 100%;
  padding: 16px;           /* Edge-to-edge with breathing room */
  display: flex;
  flex-direction: column;
  min-height: 100vh;       /* Allow scrolling if needed */
}
```

**Desktop (1024px+):**
```css
.content-container {
  max-width: 640px;        /* md breakpoint from design tokens */
  margin: 0 auto;
  padding: 24px;
}
```

---

## 3. Responsive Strategy

### Breakpoints & Behavior

| Breakpoint | Width | Background Behavior | Content Behavior |
|------------|-------|---------------------|------------------|
| Mobile (default) | 0-639px | Full-screen, cover | Full-width, 16px padding |
| Large phone (sm) | 640-767px | Full-screen, cover | Max 640px, centered, 20px padding |
| Tablet (md) | 768-1023px | Full-screen, cover | Max 640px, centered, 24px padding |
| Desktop (lg+) | 1024px+ | Full-screen, cover | Max 640px, centered, 24px padding |

### Responsive Implementation

```tsx
// Tailwind classes approach
<div className="
  relative
  w-full
  min-h-screen
  overflow-hidden
  bg-cover
  bg-center
  bg-no-repeat
">
  {/* Overlay */}
  <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

  {/* Content */}
  <div className="
    relative
    z-20
    flex
    flex-col
    min-h-screen
    px-4 py-4
    sm:px-5 sm:py-5
    md:px-6 md:py-6
    lg:max-w-2xl lg:mx-auto
  ">
    {children}
  </div>
</div>
```

### Portrait vs Landscape Considerations

**Mobile Portrait (default):**
- Vertical space for story text (top 40%)
- Choices stacked at bottom (bottom 50%)
- No issues

**Mobile Landscape:**
- Less vertical space
- Content may need to scroll
- Allow overflow-y-auto on content container

**Implementation:**
```css
/* Allow scrolling on short viewports */
.content-container {
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
}
```

---

## 4. Tailwind CSS Approach

### Core Utility Classes

```tsx
const SceneContainer = ({ backgroundImage, children, overlayOpacity = 0.6 }) => {
  return (
    <div
      className="
        relative
        w-full
        min-h-screen
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Gradient overlay */}
      <div
        className="
          absolute
          inset-0
          z-10
          bg-gradient-to-b
          from-black/40
          via-black/60
          to-black/80
        "
        style={{ opacity: overlayOpacity }}
      />

      {/* Content container */}
      <div className="
        relative
        z-20
        flex
        flex-col
        min-h-screen
        px-4 py-4
        sm:px-5 sm:py-5
        md:px-6 md:py-6
        lg:max-w-2xl lg:mx-auto
      ">
        {children}
      </div>
    </div>
  );
};
```

### Design Token Mapping

From `/docs/DESIGN-TOKENS.md`:

| Design Token | Tailwind Class | Value |
|--------------|----------------|-------|
| Overlay opacity | `from-black/40 via-black/60 to-black/80` | 0.4, 0.6, 0.8 |
| Mobile padding | `px-4 py-4` | 16px |
| Desktop padding | `md:px-6 md:py-6` | 24px |
| Max width | `lg:max-w-2xl` | 640px |
| Z-index overlay | `z-10` | 10 |
| Z-index content | `z-20` | 20 |

### Custom Utilities (if needed)

If Tailwind's gradient doesn't suffice:

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'scene-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
      },
    },
  },
};
```

Then use: `bg-scene-overlay`

---

## 5. Next.js Image Considerations

### Should We Use next/image for Backgrounds?

**Analysis:**

| Approach | Pros | Cons |
|----------|------|------|
| CSS background | Simple, cover behavior is native, works with gradients | No automatic optimization, no WebP |
| next/image with fill | Automatic optimization, WebP, blur placeholder | Requires wrapper, harder to layer gradient, more complex |

**Recommendation for MVP: CSS backgrounds**

Reasons:
1. Simpler implementation
2. Cover behavior is straightforward
3. Gradient overlay integration is trivial
4. Performance is acceptable for MVP (scenes are static, cacheable)
5. Can migrate to next/image in v1.1 if needed

### Future Optimization (v1.1)

If we need next/image later:

```tsx
<div className="relative w-full min-h-screen overflow-hidden">
  {/* Background image */}
  <Image
    src={backgroundImage}
    alt="Scene background"
    fill
    className="object-cover"
    priority
    quality={85}
    sizes="100vw"
  />

  {/* Overlay */}
  <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

  {/* Content */}
  <div className="relative z-20 ...">
    {children}
  </div>
</div>
```

### Image Format & Size Guidelines

**For MVP:**
- Format: JPEG (good compression, wide support)
- Dimensions: 1920x1080 (16:9 landscape)
- File size: < 300KB per image
- Location: `/public/images/scenes/`

**Asset Naming Convention:**
```
/public/images/scenes/
  tavern-entrance.jpg
  forest-path.jpg
  dragon-lair.jpg
```

### Placeholder Strategy

**Loading State:**
```tsx
const [imageLoaded, setImageLoaded] = useState(false);

<div className={`
  transition-opacity duration-300
  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
`}>
  {/* Scene content */}
</div>

{/* Simple loading spinner or blur */}
{!imageLoaded && (
  <div className="absolute inset-0 bg-gray-900 animate-pulse" />
)}
```

For MVP, a simple color placeholder is sufficient. Add blur placeholders in v1.1 if needed.

---

## 6. Accessibility

### Contrast & Readability

**Text-on-Image Requirements:**
- WCAG AA: 4.5:1 contrast for normal text
- WCAG AA: 3:1 contrast for large text (24px+)

**Our Implementation:**
- Gradient overlay: 0.4 → 0.6 → 0.8 alpha
- Text color: white (`#ffffff`)
- Text shadow: `0 2px 4px rgba(0, 0, 0, 0.8)` (from design tokens)

**Testing:** Run contrast checker on scene text in each background image.

### Screen Reader Considerations

**Background Images:**
```tsx
<div
  className="..."
  style={{ backgroundImage: `url(${backgroundImage})` }}
  role="presentation"
  aria-hidden="true"
>
```

Rationale: Background images are decorative. Story context comes from text, not images.

**Alternative Approach:**
If background conveys crucial info (e.g., "You're in a tavern"):
```tsx
<div aria-label="Scene: Tavern Interior">
```

But for our game, the story text provides context, so `role="presentation"` is appropriate.

### Focus Management

SceneContainer itself is non-interactive, so no focus concerns. Child components (choices, buttons) handle their own focus.

### Reduced Motion

Some users have `prefers-reduced-motion` enabled. For SceneContainer:

```css
@media (prefers-reduced-motion: reduce) {
  .scene-container {
    /* Disable any subtle background animations if added later */
    animation: none;
    transition: none;
  }
}
```

For MVP, SceneContainer has no animations, so this is not a concern yet.

---

## 7. Technical Implementation Notes

### Performance Considerations

1. **Image Preloading**
   - Preload next scene's background during current scene
   - Implementation: `<link rel="preload" as="image" href="/images/scenes/next-scene.jpg" />`

2. **Caching**
   - Images are static assets in `/public`
   - Next.js automatically serves with cache headers
   - Browser caching handles repeat visits

3. **Lazy Loading Children**
   - SceneContainer renders immediately
   - Child components (text, choices) can lazy load if needed

### Edge Cases

| Edge Case | Solution |
|-----------|----------|
| Image fails to load | Show fallback gradient background (`bg-gray-900`) |
| Very tall content on mobile | Enable vertical scrolling (`overflow-y-auto`) |
| Very short viewport (< 500px height) | Allow content to scroll, maintain full-screen background |
| User zooms in (accessibility) | Background stays cover, content reflows naturally |

### Browser Support

**Target:**
- Modern evergreen browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari 14+
- Android Chrome 90+

**Fallbacks:**
- `object-fit: cover` is widely supported (IE11 not needed)
- CSS gradients work everywhere
- No need for vendor prefixes in 2026

---

## 8. Testing Strategy

### Visual Testing

| Test Case | Expected Result |
|-----------|-----------------|
| Mobile portrait (375x667) | Background covers full screen, no letterboxing |
| Mobile landscape (667x375) | Background covers full screen, content scrolls if needed |
| Tablet (768x1024) | Content centered, max 640px wide |
| Desktop (1920x1080) | Content centered, max 640px wide, background fills screen |
| Ultra-wide (3440x1440) | Background covers, content stays centered |

### Contrast Testing

- Test story text readability on all background images
- Use browser DevTools contrast checker
- Ensure 4.5:1 minimum ratio

### Accessibility Testing

- Run axe DevTools or Lighthouse
- Verify no contrast violations
- Check screen reader behavior

### Unit Tests

```tsx
describe('SceneContainer', () => {
  it('renders children', () => {
    render(<SceneContainer backgroundImage="/test.jpg"><div>Test</div></SceneContainer>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies background image style', () => {
    const { container } = render(<SceneContainer backgroundImage="/test.jpg"><div /></SceneContainer>);
    expect(container.firstChild).toHaveStyle({ backgroundImage: 'url(/test.jpg)' });
  });

  it('applies custom overlay opacity', () => {
    render(<SceneContainer backgroundImage="/test.jpg" overlayOpacity={0.8}><div /></SceneContainer>);
    // Test overlay has correct opacity
  });
});
```

---

## 9. Open Questions

Before implementation, confirm:

1. **Image Aspect Ratio:** 16:9 (1920x1080) or different? What if artist provides 4:3?
   - *Recommendation:* Accept any ratio, `cover` handles it gracefully

2. **Overlay Customization:** Should some scenes (e.g., bright outdoor scenes) have lighter overlays?
   - *Recommendation:* Yes, make `overlayOpacity` prop configurable per scene

3. **Preloading Strategy:** Should we preload all scene images on game start, or one-at-a-time?
   - *Recommendation:* Preload next scene only (saves bandwidth)

4. **Fallback Image:** If background fails to load, show solid color or generic image?
   - *Recommendation:* Solid dark gray (`bg-gray-900`)

5. **Desktop Max Width:** 640px or 800px?
   - *Recommendation:* 640px (design tokens say `max-w-2xl`), but could bump to 800px if content feels cramped

---

## 10. Approval Checklist

Before building, confirm:

- [ ] Acceptance criteria understood and achievable
- [ ] Component API approved (props, children structure)
- [ ] Visual design approved (overlay gradient, content layout)
- [ ] Responsive strategy approved (mobile edge-to-edge, desktop centered)
- [ ] CSS background approach approved (vs next/image)
- [ ] Accessibility approach approved (decorative images, contrast)
- [ ] Design tokens referenced correctly
- [ ] Testing strategy makes sense

---

## 11. Next Steps

Once approved:

1. **Create Component File:** `SceneContainer.tsx`
2. **Implement with Tailwind:** Use classes from Section 4
3. **Test Responsive Behavior:** Check on mobile/tablet/desktop
4. **Run Contrast Tests:** Verify text readability
5. **Write Unit Tests:** Cover props and rendering
6. **Document Usage:** Add JSDoc comments
7. **Integration:** Use in first test scene

---

## 12. Related Tickets

This component will be used by:
- Ticket 1.2: Story Text Display Component (child)
- Ticket 1.3: Choice Button Component (child)
- Ticket 5.2: Countdown Timer Display (child)
- Ticket 6.2: Chaos Meter Display (child)

---

*SceneContainer Design - Chaos Stories MVP*
*Version: 1.0 (Design Phase)*
*Ready for implementation: Pending approval*
