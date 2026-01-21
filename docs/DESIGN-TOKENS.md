# Chaos Stories — Design Tokens

> **Reference document for all frontend tickets**
> **Status:** MVP Foundation
> **Last Updated:** January 2026

---

## Color Palette

### Brand Colors

```css
:root {
  /* Primary - CTA buttons, accents */
  --color-primary: #8b5cf6;        /* violet-500 */
  --color-primary-hover: #7c3aed;  /* violet-600 */

  /* Secondary - secondary actions */
  --color-secondary: #6366f1;      /* indigo-500 */
  --color-secondary-hover: #4f46e5; /* indigo-600 */
}
```

### Chaos State Colors

| State | Level | Color | Hex | Tailwind |
|-------|-------|-------|-----|----------|
| Calm | 0-25 | Green | `#10b981` | `emerald-500` |
| Suspicious | 26-50 | Yellow | `#fbbf24` | `amber-400` |
| On Fire | 51-75 | Orange | `#f97316` | `orange-500` |
| Guards Incoming | 76-100 | Red | `#ef4444` | `red-500` |

```css
:root {
  --chaos-calm: #10b981;
  --chaos-suspicious: #fbbf24;
  --chaos-onfire: #f97316;
  --chaos-guards: #ef4444;
}
```

### Character Accent Colors

| Character | Role | Primary | Border | Tailwind |
|-----------|------|---------|--------|----------|
| Rupert | Warrior | `#f97316` | `#ea580c` | `orange-500/600` |
| Milo | Mage | `#8b5cf6` | `#7c3aed` | `violet-500/600` |

```css
:root {
  --rupert-primary: #f97316;
  --rupert-border: #ea580c;
  --milo-primary: #8b5cf6;
  --milo-border: #7c3aed;
}
```

### Neutral Colors

```css
:root {
  /* Backgrounds */
  --bg-overlay: rgba(0, 0, 0, 0.6);
  --bg-card: rgba(0, 0, 0, 0.4);
  --bg-button: rgba(255, 255, 255, 0.1);
  --bg-button-hover: rgba(255, 255, 255, 0.2);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;      /* gray-300 */
  --text-muted: #9ca3af;          /* gray-400 */
  --text-on-light: #111827;       /* gray-900 */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-default: rgba(255, 255, 255, 0.2);
}
```

---

## Typography

### Font Stack

```css
:root {
  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Font Sizes (Responsive)

| Use Case | Mobile | Desktop | Tailwind |
|----------|--------|---------|----------|
| Title (H1) | 32px | 48px | `text-3xl md:text-5xl` |
| Scene heading | 24px | 32px | `text-2xl md:text-3xl` |
| Scene text | 18px | 22px | `text-lg md:text-xl` |
| Choice button | 16px | 18px | `text-base md:text-lg` |
| Outcome text | 18px | 20px | `text-lg md:text-xl` |
| UI labels | 14px | 16px | `text-sm md:text-base` |
| Caption | 12px | 14px | `text-xs md:text-sm` |

### Responsive Clamp (Recommended)

```css
.scene-text {
  font-size: clamp(1.125rem, 4vw, 1.375rem); /* 18px to 22px */
}

.choice-text {
  font-size: clamp(1rem, 3.5vw, 1.125rem); /* 16px to 18px */
}

.title {
  font-size: clamp(2rem, 8vw, 3rem); /* 32px to 48px */
}
```

### Font Weights

| Weight | Use Case |
|--------|----------|
| 400 (Regular) | Body text, scene text |
| 500 (Medium) | Choice buttons, labels |
| 600 (Semibold) | Headings, emphasis |
| 700 (Bold) | Titles, ending names |

### Line Heights

```css
:root {
  --leading-tight: 1.25;    /* Headings */
  --leading-normal: 1.5;    /* Body text */
  --leading-relaxed: 1.625; /* Long-form reading */
}
```

---

## Spacing

### Base Scale (4px increments)

| Token | Value | Tailwind |
|-------|-------|----------|
| `--space-1` | 4px | `p-1` |
| `--space-2` | 8px | `p-2` |
| `--space-3` | 12px | `p-3` |
| `--space-4` | 16px | `p-4` |
| `--space-5` | 20px | `p-5` |
| `--space-6` | 24px | `p-6` |
| `--space-8` | 32px | `p-8` |
| `--space-10` | 40px | `p-10` |
| `--space-12` | 48px | `p-12` |

### Component Spacing

| Component | Padding | Gap |
|-----------|---------|-----|
| Scene container | 16px (mobile), 24px (desktop) | - |
| Choice buttons | 16px vertical, 20px horizontal | 12px between |
| Chaos meter | 8px | - |
| Cards | 16px | - |
| Modals | 24px | 16px |

---

## Touch Targets

### Minimum Sizes

| Element | Min Height | Min Width | Notes |
|---------|------------|-----------|-------|
| Buttons | 48px | 48px | WCAG AAA |
| Choice buttons | 56px | 100% | Full width on mobile |
| Icon buttons | 44px | 44px | With padding |
| Links (inline) | 44px tap area | - | Use padding |

### Tailwind Classes

```html
<!-- Choice button -->
<button class="min-h-[56px] w-full px-5 py-4">

<!-- Icon button -->
<button class="min-h-[44px] min-w-[44px] p-2">
```

---

## Animation

### Timing

| Speed | Duration | Use Case |
|-------|----------|----------|
| Fast | 150ms | Hover states, micro-interactions |
| Medium | 300ms | Transitions, fades |
| Slow | 500ms | Page transitions, dramatic reveals |

### Easing Functions

```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);  /* ease-out */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Component Animations

| Component | Animation | Duration | Easing |
|-----------|-----------|----------|--------|
| Scene fade | opacity | 300ms | ease-out |
| Choice hover | scale(1.02) | 150ms | ease-out |
| Choice press | scale(0.98) | 100ms | ease-in |
| Outcome appear | opacity + translateY | 200ms | ease-out |
| Outcome dismiss | opacity | 300ms | ease-in |
| Timer pulse (warning) | scale | 1000ms | ease-in-out |
| Timer pulse (critical) | scale | 300ms | ease-in-out |
| Chaos bar fill | width | 300ms | ease-out |
| Chaos tier change | scale (bounce) | 400ms | bounce |

### Keyframes

```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes fadeUpOut {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
```

---

## Responsive Breakpoints

### Tailwind Defaults

| Breakpoint | Width | Target |
|------------|-------|--------|
| Default | 0px+ | Mobile (primary) |
| `sm` | 640px+ | Large phones (landscape) |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Large desktop |

### Primary Targets

- **Mobile (375px - 428px):** Primary design target
- **Tablet (768px+):** Secondary
- **Desktop (1024px+):** Max-width container

### Container Max Widths

```css
/* Scene content on desktop */
.scene-container {
  max-width: 640px; /* md */
  margin: 0 auto;
}

/* Choice buttons on desktop */
.choices-container {
  max-width: 480px;
  margin: 0 auto;
}
```

---

## Shadows & Effects

### Box Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3); /* Purple glow */
}
```

### Text Shadows (for readability on images)

```css
.text-on-image {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
```

### Backdrop Blur

```css
.glass-effect {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.4);
}
```

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Buttons, cards |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Feature cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## Z-Index Scale

| Layer | Z-Index | Use Case |
|-------|---------|----------|
| Base | 0 | Default content |
| Scene background | 0 | Background images |
| Scene overlay | 10 | Dark gradient overlay |
| Scene content | 20 | Text, choices |
| Chaos meter | 30 | Always visible HUD |
| Timer | 30 | Always visible HUD |
| Outcome overlay | 40 | Outcome display |
| Modal backdrop | 50 | Modal backgrounds |
| Modal content | 60 | Modal panels |
| Toast/Alert | 70 | Notifications |

---

## Component Reference

### Choice Button States

```tsx
// Tailwind classes for choice buttons
const choiceButtonClasses = {
  base: "w-full min-h-[56px] px-5 py-4 rounded-lg font-medium transition-all duration-150",
  default: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
  pressed: "scale-[0.98] bg-white/20",
  disabled: "opacity-50 cursor-not-allowed",
  rupert: "border-orange-500 hover:border-orange-400",
  milo: "border-violet-500 hover:border-violet-400",
};
```

### Chaos Meter Styling

```tsx
const chaosMeterClasses = {
  container: "fixed top-4 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur",
  bar: "w-20 h-2 rounded-full bg-white/20 overflow-hidden",
  fill: "h-full transition-all duration-300 ease-out",
  emoji: "text-2xl",
};

const chaosColors = {
  calm: "bg-emerald-500",
  suspicious: "bg-amber-400",
  onfire: "bg-orange-500",
  guards: "bg-red-500",
};
```

---

## Usage in Tickets

All frontend tickets should reference this document:

```markdown
## Design Reference

See `/docs/DESIGN-TOKENS.md` for:
- Color palette (chaos states, character accents)
- Typography (font sizes, weights)
- Spacing (padding, gaps)
- Animation (timing, easing)
- Touch targets (minimum sizes)
```

---

*Design Tokens v1.0 — Chaos Stories MVP*
