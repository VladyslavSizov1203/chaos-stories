# ChoiceList - Quick Start Guide

> Get up and running with the ChoiceList component in 2 minutes.

---

## Installation

Component is already installed in the project. Import it:

```tsx
import { ChoiceList } from '@/src/components/ChoiceList';
```

---

## Basic Usage

```tsx
'use client';

import { useState } from 'react';
import { ChoiceList } from '@/src/components/ChoiceList';
import type { Choice } from '@/src/types/game';

function MyScene() {
  const [character, setCharacter] = useState<'rupert' | 'milo'>('rupert');

  const choices: Choice[] = [
    {
      id: 'choice-1',
      text: 'Walk through the front door',
      choiceType: 'branch',
      nextSceneId: 'next-scene',
      chaosChange: 5,
      outcomeText: 'You walk in confidently.',
    },
    {
      id: 'choice-2',
      text: 'Sneak around back',
      choiceType: 'branch',
      nextSceneId: 'next-scene',
      chaosChange: 0,
      outcomeText: 'You slip into the shadows.',
    },
  ];

  const handleSelect = (choice: Choice) => {
    console.log('Selected:', choice.text);
    // Your game logic here
  };

  return (
    <ChoiceList
      choices={choices}
      selectedCharacter={character}
      onChoiceSelect={handleSelect}
    />
  );
}
```

---

## Character-Specific Choices

Add `characterOnly` to make a choice visible only to specific character:

```tsx
const choices: Choice[] = [
  {
    id: 'shared-choice',
    text: 'Walk through the door',
    // ... no characterOnly means ALL characters see this
  },
  {
    id: 'rupert-choice',
    text: 'Kick down the door',
    characterOnly: 'rupert', // Only Rupert sees this
    // ...
  },
  {
    id: 'milo-choice',
    text: 'Pick the lock with magic',
    characterOnly: 'milo', // Only Milo sees this
    isMagic: true,
    // ...
  },
];
```

**Result:**
- Rupert players see: shared-choice + rupert-choice
- Milo players see: shared-choice + milo-choice

---

## Locking During Processing

Disable buttons while showing outcome or transitioning:

```tsx
function MyScene() {
  const [processing, setProcessing] = useState(false);

  const handleSelect = (choice: Choice) => {
    setProcessing(true); // Lock buttons

    // Show outcome
    showOutcome(choice.outcomeText);

    // Transition after 2.5 seconds
    setTimeout(() => {
      navigateToScene(choice.nextSceneId);
      setProcessing(false);
    }, 2500);
  };

  return (
    <ChoiceList
      choices={choices}
      selectedCharacter={character}
      onChoiceSelect={handleSelect}
      isProcessing={processing} // External lock
    />
  );
}
```

---

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `choices` | `Choice[]` | ✅ Yes | - | Array of 2-4 choices |
| `selectedCharacter` | `'rupert' \| 'milo'` | ✅ Yes | - | Current character |
| `onChoiceSelect` | `(choice) => void` | ✅ Yes | - | Selection callback |
| `isProcessing` | `boolean` | No | `false` | External lock state |

---

## Visual Customization

The component automatically styles based on choice data:

### Rupert Choices
```tsx
characterOnly: 'rupert'
// → Orange border + ⚔️ icon
```

### Milo Choices
```tsx
characterOnly: 'milo'
// → Violet border + 🔮 icon
```

### Shared Choices
```tsx
// No characterOnly property
// → White border, no icon
```

---

## Common Patterns

### Pattern 1: Scene with Outcome Display

```tsx
function GameScene({ scene, character }) {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  if (selectedChoice) {
    // Show outcome
    return (
      <div className="outcome">
        {selectedChoice.outcomeText}
      </div>
    );
  }

  // Show choices
  return (
    <ChoiceList
      choices={scene.choices}
      selectedCharacter={character}
      onChoiceSelect={setSelectedChoice}
    />
  );
}
```

### Pattern 2: With Timer Integration

```tsx
function GameScene({ scene, character }) {
  const [timeUp, setTimeUp] = useState(false);

  const handleTimeout = () => {
    // Auto-select first choice when time runs out
    const defaultChoice = scene.choices[0];
    handleChoiceSelect(defaultChoice);
  };

  return (
    <>
      <Timer onTimeout={handleTimeout} duration={25} />
      <ChoiceList
        choices={scene.choices}
        selectedCharacter={character}
        onChoiceSelect={handleChoiceSelect}
        isProcessing={timeUp}
      />
    </>
  );
}
```

### Pattern 3: With Chaos Updates

```tsx
function GameScene({ scene, character }) {
  const [chaos, setChaos] = useState(0);

  const handleSelect = (choice: Choice) => {
    // Update chaos level
    setChaos(prev => prev + choice.chaosChange);

    // Handle character trait effects
    if (choice.isMagic && Math.random() < 0.3) {
      // Milo's spell backfire!
      setChaos(prev => prev + 10);
    }

    // Continue game flow...
  };

  return (
    <>
      <ChaosMeter level={chaos} />
      <ChoiceList
        choices={scene.choices}
        selectedCharacter={character}
        onChoiceSelect={handleSelect}
      />
    </>
  );
}
```

---

## Testing Tips

### Desktop Testing
1. Open browser dev tools (F12)
2. Test hover states (mouse)
3. Test keyboard navigation (Tab, Enter)
4. Check console for warnings

### Mobile Testing
1. Open dev tools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device preset
4. Test touch interactions
5. Check touch target sizes (56px minimum)

### Accessibility Testing
1. Use screen reader (NVDA/VoiceOver)
2. Verify all choices announced
3. Check character type descriptions
4. Test keyboard-only navigation

---

## Troubleshooting

### Q: Choices not filtering by character?

**A**: Check `characterOnly` spelling (lowercase):
```tsx
characterOnly: 'rupert' // ✅ Correct
characterOnly: 'Rupert' // ❌ Won't match
```

---

### Q: Buttons not responding to clicks?

**A**: Check both lock states:
```tsx
// Internal lock - check component state
// External lock - check isProcessing prop
<ChoiceList isProcessing={false} ... />
```

---

### Q: Animation not playing?

**A**: Ensure Tailwind config has animation:
```typescript
// tailwind.config.ts
animation: {
  'slide-up': 'slide-up 300ms ease-out',
}
```

Run: `npm run dev` to rebuild.

---

### Q: TypeScript errors?

**A**: Import Choice type:
```tsx
import type { Choice } from '@/src/types/game';
```

---

## More Resources

- **Detailed Docs**: See `README.md` in this folder
- **Design Spec**: See `DESIGN.md` in this folder
- **Type Definitions**: See `/src/types/game.ts`
- **Demo**: Run `npm run dev` and visit homepage

---

## Need Help?

1. Check the README.md in this folder
2. Review the demo page: `app/page.tsx`
3. Reference the design doc: `DESIGN.md`
4. Check test data: `src/data/test-scenes.ts`

---

**Component Status**: ✅ Production Ready
**Last Updated**: January 2026
