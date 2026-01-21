# SceneContainer Component

Full-screen scene container with background image and gradient overlay for the Chaos Stories game.

## Implementation Status

Status: Complete
Ticket: 1.1 (Feature 1: Core Game Loop)
Date: 2026-01-21

## Features

- Full-screen background with CSS backgrounds
- Dark gradient overlay for text readability (from-black/40 via-black/60 to-black/80)
- Mobile-first responsive design
- Edge-to-edge on mobile, centered max-width on desktop
- Supports both image URLs and CSS gradients
- Vertical scrolling for tall content
- TypeScript with full type safety
- Accessible with WCAG AA compliance

## Usage

```tsx
import SceneContainer from '@/src/components/SceneContainer';

<SceneContainer backgroundImage="/images/scenes/tavern.jpg">
  <StoryText text="You push open the heavy tavern door..." />
  <ChoiceList choices={currentScene.choices} />
  <ChaosMeter level={chaosState} />
</SceneContainer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundImage` | string | required | Path to image or CSS gradient |
| `children` | React.ReactNode | required | Scene content |
| `className` | string | '' | Optional additional CSS classes |
| `overlayOpacity` | number | 0.6 | Overlay opacity (0-1) |
| `testId` | string | 'scene-container' | Test ID for E2E testing |

## Responsive Behavior

### Mobile Portrait (< 640px)
- Full-width, edge-to-edge
- 16px padding
- Vertical scrolling enabled

### Mobile Landscape / Tablet (640px - 1023px)
- Max-width container, centered
- 20-24px padding
- Vertical scrolling enabled

### Desktop (1024px+)
- Max-width 640px (max-w-2xl), centered
- 24px padding
- Vertical scrolling enabled

## Component Structure

```
SceneContainer
├── Background layer (z-index: 0)
│   └── CSS background-image with cover
├── Gradient overlay (z-index: 10)
│   └── from-black/40 via-black/60 to-black/80
└── Content container (z-index: 20)
    └── {children}
```

## Accessibility

- Background images marked as decorative (`role="presentation"`)
- Gradient overlay ensures 4.5:1 contrast ratio for text
- No animations (respects `prefers-reduced-motion`)
- Scrollable content for accessibility zoom

## Design Decisions

### Why CSS backgrounds instead of next/image?

For MVP, CSS backgrounds provide:
- Simpler implementation
- Natural cover behavior
- Easier gradient overlay integration
- Acceptable performance for static, cacheable images

We can migrate to next/image in v1.1 if optimization is needed.

### Why gradient overlay instead of solid?

The gradient overlay (darker at bottom):
- Improves readability for bottom-positioned choices
- Doesn't block the background art
- Creates visual hierarchy (text > background)

## Testing

The component is demonstrated on the demo page at `app/page.tsx`.

To test:
```bash
npm run dev
# Visit http://localhost:3000
```

Test scenarios:
- Resize browser to check responsive behavior
- Test on mobile devices (iOS Safari, Android Chrome)
- Verify text readability on different backgrounds
- Check vertical scrolling with tall content

## Files

```
src/components/SceneContainer/
├── SceneContainer.tsx       # Main component
├── index.ts                 # Barrel export
├── DESIGN.md                # Design specification
└── README.md                # This file
```

## Next Steps

This component will be integrated with:
- Ticket 1.2: Story Text Display Component
- Ticket 1.3: Choice Button Component
- Ticket 5.2: Countdown Timer Display
- Ticket 6.2: Chaos Meter Display

## Technical Notes

### Background Image Format
- Format: JPEG (< 300KB)
- Dimensions: 1920x1080 (16:9)
- Location: `/public/images/scenes/`

### Placeholder Strategy
For MVP, using CSS gradients as placeholders until scene artwork is available.

```tsx
// Placeholder example
const placeholderBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
<SceneContainer backgroundImage={placeholderBg}>
```

## Dependencies

- React 19
- Next.js 15
- Tailwind CSS 3.4

## Browser Support

- Modern evergreen browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari 14+
- Android Chrome 90+
