# ChoiceList Component

## Overview

The ChoiceList component system provides mobile-first, thumb-friendly choice buttons for the Chaos Stories game. It consists of two main components:

1. **ChoiceButton** - Individual choice button with character-specific styling
2. **ChoiceList** - Container that manages multiple buttons and handles filtering

## Files

```
src/components/ChoiceList/
├── ChoiceButton.tsx    # Individual button component
├── ChoiceList.tsx      # Container component
├── index.ts            # Barrel exports
├── DESIGN.md           # Detailed design specification
└── README.md           # This file
```

## Usage

### Basic Example

```tsx
import { ChoiceList } from '@/src/components/ChoiceList';
import { Choice } from '@/src/types/game';

function GameScene() {
  const [selectedCharacter, setSelectedCharacter] = useState<'rupert' | 'milo'>('rupert');

  const handleChoiceSelect = (choice: Choice) => {
    console.log('Selected:', choice);
    // Handle game logic (update chaos, show outcome, etc.)
  };

  return (
    <ChoiceList
      choices={currentScene.choices}
      selectedCharacter={selectedCharacter}
      onChoiceSelect={handleChoiceSelect}
    />
  );
}
```

### With Processing State

```tsx
<ChoiceList
  choices={currentScene.choices}
  selectedCharacter={selectedCharacter}
  onChoiceSelect={handleChoiceSelect}
  isProcessing={showingOutcome}
/>
```

## Props

### ChoiceList

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `choices` | `Choice[]` | Yes | Array of 2-4 choices to display |
| `selectedCharacter` | `'rupert' \| 'milo'` | Yes | Current player character |
| `onChoiceSelect` | `(choice: Choice) => void` | Yes | Callback when choice selected |
| `isProcessing` | `boolean` | No | External lock state (default: false) |

### ChoiceButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `choice` | `Choice` | Yes | Full choice object |
| `disabled` | `boolean` | Yes | Disables interaction |
| `isSelected` | `boolean` | No | Shows selected state |
| `onSelect` | `(choiceId: string) => void` | Yes | Callback on tap/click |

## Features

### Character-Specific Styling

The component automatically applies character-specific visual styles:

**Rupert (Warrior)**
- Orange border (`border-orange-500`)
- ⚔️ Sword icon
- Orange glow on hover

**Milo (Mage)**
- Violet border (`border-violet-500`)
- 🔮 Crystal ball icon
- Violet glow on hover

**Shared Choices**
- White/transparent border
- No icon

### Filtering Logic

The ChoiceList automatically filters choices based on `selectedCharacter`:

- Shows all shared choices (no `characterOnly` property)
- Shows choices specific to the selected character
- Hides choices for the other character

Example:
```typescript
// Input: 4 choices (2 shared, 1 Rupert-only, 1 Milo-only)
// When selectedCharacter = 'rupert'
// Output: 3 choices (2 shared + 1 Rupert-only)
```

### Double-Tap Prevention

Two layers of locking prevent accidental double-taps:

1. **Internal Lock**: Component immediately locks after first selection
2. **External Lock**: Parent can disable via `isProcessing` prop

Both locks work together for robust interaction control.

### Visual States

Each button supports multiple interaction states:

- **Default**: Semi-transparent white background
- **Hover**: Scale 1.02, brighter background (desktop only)
- **Active/Pressed**: Scale 0.98, darker background
- **Selected**: Green border with ✓ checkmark
- **Disabled**: 50% opacity, no interaction

### Animations

- **Entry**: Slide up from bottom (300ms ease-out)
- **Hover**: Smooth scale animation (150ms)
- **Press**: Quick scale animation (75ms)
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

## Responsive Behavior

The component adapts to different screen sizes:

### Mobile Portrait (< 640px)
- Max width: 448px
- Gap: 12px
- Padding: 16px
- Full-width buttons

### Tablet (640px - 1024px)
- Max width: 512px
- Gap: 12px
- Padding: 24px

### Desktop (> 1024px)
- Max width: 576px
- Gap: 16px
- Padding: 32px
- Hover effects enabled

## Accessibility

### Keyboard Navigation

- Full keyboard support (Tab, Enter, Space)
- Clear focus indicators with violet outline
- Proper focus management

### Screen Readers

- Semantic HTML (`<button>` elements)
- Descriptive `aria-label` attributes
- Character type announced for character-specific choices
- `role="group"` on container with `aria-label`

### WCAG Compliance

- Minimum 56px touch targets (exceeds AAA standard)
- 4.5:1+ color contrast on all text
- Text shadows for readability over backgrounds
- Reduced motion support

## Testing

### Demo Page

View the component in action:
```bash
npm run dev
# Visit http://localhost:3000
```

The demo page (`app/page.tsx`) demonstrates:
- Character toggle (Rupert/Milo)
- Choice filtering
- Visual states
- Selection feedback

### Test Scenarios

1. **Character Filtering**: Toggle between characters, verify correct choices appear
2. **Double-Tap**: Rapidly tap buttons, ensure only first registers
3. **Keyboard**: Use Tab/Enter to navigate and select
4. **Mobile**: Test on actual mobile device for touch interactions
5. **Accessibility**: Test with screen reader (VoiceOver/NVDA)

## Integration Example

Complete game scene integration:

```tsx
import { useState } from 'react';
import SceneContainer from '@/src/components/SceneContainer';
import StoryText from '@/src/components/StoryText';
import { ChoiceList } from '@/src/components/ChoiceList';
import { Choice } from '@/src/types/game';

function GameScene({ scene, character }) {
  const [showingOutcome, setShowingOutcome] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowingOutcome(true);

    // Show outcome for 2.5 seconds
    setTimeout(() => {
      // Transition to next scene
      navigateToScene(choice.nextSceneId);
    }, 2500);
  };

  return (
    <SceneContainer backgroundImage={scene.backgroundImage}>
      <StoryText text={scene.text} position="top" />

      {/* Show outcome or choices */}
      {showingOutcome && selectedChoice ? (
        <div className="outcome-display">
          {selectedChoice.outcomeText}
        </div>
      ) : (
        <ChoiceList
          choices={scene.choices}
          selectedCharacter={character}
          onChoiceSelect={handleChoiceSelect}
        />
      )}
    </SceneContainer>
  );
}
```

## Design Decisions

### Why Character Icons?

Icons provide immediate visual distinction without requiring players to read labels. The sword/crystal metaphors are intuitive and match the character archetypes.

### Why Internal Locking?

Double-tap is a common mobile UX issue. Internal locking provides instant protection while external props allow parent control for game flow.

### Why Vertical Stack?

On mobile, vertical stacking is:
- Easier to scan (natural reading direction)
- More accessible for one-handed use
- Accommodates varying text lengths better than grids

### Why 56px Minimum Height?

Exceeds WCAG AAA standard (48px) with comfortable margin. Makes buttons easy to tap even for users with motor difficulties or larger fingers.

## Related Components

- **SceneContainer**: Background container for scenes
- **StoryText**: Displays scene narrative text
- **Timer**: Countdown timer (future integration)
- **ChaosMeter**: Chaos level indicator (future integration)

## Future Enhancements

Ideas for post-MVP improvements:

1. **Staggered Entry**: Buttons appear one-by-one (50ms delay)
2. **Haptic Feedback**: Vibration on mobile tap
3. **Sound Effects**: Audio cues for selection
4. **Character Glow**: Subtle gradient glow for character choices
5. **Long Press**: Hold to see choice consequences preview

See `DESIGN.md` Section 10 for detailed enhancement specs.

## Troubleshooting

### Choices Not Filtering

Ensure `characterOnly` property matches character ID:
```typescript
// Correct
characterOnly: 'rupert'  // lowercase

// Incorrect
characterOnly: 'Rupert'  // uppercase - won't match
```

### Buttons Not Responding

Check for multiple disabled states:
```typescript
// Both must be false for interaction
isLocked === false
isProcessing === false
```

### Animation Not Working

Verify Tailwind config includes animation:
```typescript
// tailwind.config.ts
animation: {
  'slide-up': 'slide-up 300ms ease-out',
}
```

## Support

For issues or questions:
- See `DESIGN.md` for detailed visual specifications
- Check `VALIDATION.md` for schema definitions
- Reference Ticket 1.3 in `FEATURES.md`

---

**Status**: ✅ Completed
**Ticket**: 1.3 - Choice Buttons Component
**Last Updated**: January 2026
