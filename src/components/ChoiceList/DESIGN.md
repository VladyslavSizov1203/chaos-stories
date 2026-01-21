# ChoiceList & ChoiceButton Component Design

> Design document for Ticket 1.3: Choice Buttons Component
> Status: Design Phase - Awaiting Approval
> Last Updated: January 2026

---

## Understanding

The ChoiceList and ChoiceButton components are critical to player interaction. They must:

1. Display 2-4 choices clearly without scrolling
2. Provide immediate visual feedback on tap/click
3. Prevent double-tap through disabled states
4. Distinguish character-specific choices visually
5. Work perfectly on mobile (thumb-friendly, 56px+ height)

These components are the primary interaction point during gameplay. They must feel responsive, clear, and fun to interact with.

---

## 1. Component Structure

### Component Hierarchy

```
<ChoiceList>
  └─ <ChoiceButton> (2-4 instances)
```

### ChoiceButton Component

**Purpose:** Individual choice button with all interaction states

**Props:**
```typescript
interface ChoiceButtonProps {
  choice: Choice;                    // Full choice object
  disabled: boolean;                 // True when any choice is processing
  characterIcon?: '⚔️' | '🔮';       // Icon for character-specific choices
  onSelect: (choiceId: string) => void; // Callback when button is tapped
  isSelected?: boolean;              // True after this choice is selected
}
```

**Rationale:**
- Pass full `Choice` object for access to all properties
- `disabled` prop allows parent to disable all buttons simultaneously
- `characterIcon` makes character choices visually distinct without requiring logic in button
- `onSelect` callback keeps interaction logic in parent
- `isSelected` enables visual feedback after selection

### ChoiceList Component

**Purpose:** Container that manages button layout and processing state

**Props:**
```typescript
interface ChoiceListProps {
  choices: Choice[];                 // Array of 2-4 choices
  selectedCharacter: 'rupert' | 'milo'; // Current player character
  onChoiceSelect: (choice: Choice) => void; // Callback to parent game logic
  isProcessing?: boolean;            // Optional: locks buttons during outcome display
}
```

**State:**
```typescript
interface ChoiceListState {
  selectedChoiceId: string | null;   // Track which choice was selected
  isLocked: boolean;                 // Prevent double-tap
}
```

**Rationale:**
- Container knows selected character to determine which icon to show
- Single `onChoiceSelect` callback simplifies parent integration
- Internal state manages button locking to prevent race conditions
- `isProcessing` prop allows external locking (e.g., during timer countdown)

---

## 2. Visual Design

### Base Button Style

```css
/* Tailwind classes equivalent */
.choice-button {
  /* Layout */
  width: 100%;
  min-height: 56px;
  padding: 16px 20px;

  /* Visual */
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;

  /* Typography */
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  text-align: left;
  line-height: 1.4;

  /* Interaction */
  cursor: pointer;
  transition: all 150ms ease-out;
}
```

**Design Rationale:**
- Full width ensures large touch target
- 56px minimum height exceeds WCAG AAA (48px) for mobile
- 16px vertical, 20px horizontal padding creates breathing room
- Semi-transparent background works over any scene image
- Text-align left feels more natural for reading options
- Left-aligned text allows for icon placement on the left

### Character-Specific Styling

#### Rupert (Warrior) Choices
```css
.choice-button--rupert {
  border-color: #f97316; /* orange-500 */
  position: relative;
}

.choice-button--rupert:hover {
  border-color: #ea580c; /* orange-600 */
  background: rgba(249, 115, 22, 0.15);
}

.choice-button--rupert::before {
  content: '⚔️';
  margin-right: 8px;
  font-size: 18px;
}
```

**Visual Identity:**
- Warm orange border (matches chaos "On Fire" state)
- Sword emoji immediately signals physical/confrontational option
- Hover adds orange tint to background

#### Milo (Mage) Choices
```css
.choice-button--milo {
  border-color: #8b5cf6; /* violet-500 */
  position: relative;
}

.choice-button--milo:hover {
  border-color: #7c3aed; /* violet-600 */
  background: rgba(139, 92, 246, 0.15);
}

.choice-button--milo::before {
  content: '🔮';
  margin-right: 8px;
  font-size: 18px;
}
```

**Visual Identity:**
- Cool violet border (mystical, magical feel)
- Crystal ball emoji signals magic/trickery
- Hover adds violet tint to background

### Button States

#### Default (Idle)
```css
.choice-button:default {
  transform: scale(1);
  opacity: 1;
}
```

#### Hover (Desktop Only)
```css
@media (hover: hover) {
  .choice-button:hover {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
}
```

**Note:** Use `@media (hover: hover)` to prevent hover styles on touch devices

#### Pressed (Active Touch/Click)
```css
.choice-button:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.2);
  transition: all 50ms ease-in; /* Faster for immediate feedback */
}
```

**Design Rationale:**
- Scale down creates tactile "press" feeling
- Slightly brighter background confirms interaction
- Fast transition (50ms) makes it feel instant

#### Selected (After Choice Made)
```css
.choice-button--selected {
  border-color: #10b981; /* emerald-500 - success green */
  background: rgba(16, 185, 129, 0.2);
  transform: scale(1.0);
}

.choice-button--selected::after {
  content: '✓';
  position: absolute;
  right: 16px;
  font-size: 20px;
  color: #10b981;
}
```

**Design Rationale:**
- Green indicates "this one was selected"
- Checkmark provides clear confirmation
- Scale returns to normal (no animation bounce)

#### Disabled (Processing/Locked)
```css
.choice-button:disabled,
.choice-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  transform: scale(1);
}
```

**Design Rationale:**
- 50% opacity universal "disabled" signal
- Remove pointer events prevents any interaction
- No scale animation when disabled

---

## 3. Responsive Strategy

### Mobile Portrait (< 640px) - PRIMARY TARGET

```tsx
<div className="flex flex-col gap-3 w-full max-w-md mx-auto px-4 pb-6">
  {/* All buttons stack vertically */}
  <ChoiceButton ... />
  <ChoiceButton ... />
  <ChoiceButton ... />
  <ChoiceButton ... />
</div>
```

**Layout:**
- Vertical stack with 12px gap
- Full width (with 16px horizontal padding from edges)
- Bottom padding ensures buttons don't touch bottom edge
- Max-width 28rem (448px) prevents buttons from being too wide on larger phones

**Position:**
- Fixed to bottom of viewport OR
- Positioned after StoryText component

**Recommendation:** Use fixed positioning at bottom for consistent thumb accessibility

### Mobile Landscape / Tablet (640px - 1024px)

```tsx
<div className="flex flex-col gap-3 w-full max-w-lg mx-auto px-6 pb-8">
  {/* Same vertical stack, slightly more breathing room */}
</div>
```

**Changes:**
- Increase max-width to 32rem (512px)
- More horizontal padding (24px)
- More bottom padding (32px)

### Desktop (> 1024px)

```tsx
<div className="flex flex-col gap-4 w-full max-w-xl mx-auto px-8 pb-12">
  {/* Vertical stack with more generous spacing */}
</div>
```

**Changes:**
- Max-width 36rem (576px) - comfortable reading width
- 16px gap between buttons
- Hover states enabled
- More generous padding overall

**Alternative Layout (Optional Enhancement):**
```tsx
{/* When 4 choices: 2x2 grid on desktop */}
<div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
  <ChoiceButton ... />
  <ChoiceButton ... />
  <ChoiceButton ... />
  <ChoiceButton ... />
</div>
```

**Rationale:** For later polish - keeps all choices visible without scrolling on large screens

---

## 4. Interaction Design

### Tap/Click Flow

```
USER TAPS BUTTON
     ↓
1. Visual press state (scale 0.98) - INSTANT
     ↓
2. onSelect callback fires
     ↓
3. Parent sets isLocked = true
     ↓
4. Selected button gets green border + checkmark
     ↓
5. All other buttons fade to 50% opacity
     ↓
6. Outcome displays (parent responsibility)
```

### Preventing Double-Tap

**Strategy 1: Internal Lock (Recommended)**
```typescript
const ChoiceList = ({ choices, onChoiceSelect }: ChoiceListProps) => {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (choice: Choice) => {
    if (isLocked) return; // Exit early if already processing

    setIsLocked(true);    // Lock immediately
    setSelectedId(choice.id);
    onChoiceSelect(choice); // Notify parent
  };

  return (
    <div className="choice-list">
      {choices.map(choice => (
        <ChoiceButton
          key={choice.id}
          choice={choice}
          disabled={isLocked}
          isSelected={selectedId === choice.id}
          onSelect={() => handleSelect(choice)}
        />
      ))}
    </div>
  );
};
```

**Why This Works:**
- State update happens synchronously before callback
- React batches state updates, preventing race conditions
- All buttons immediately become disabled
- Selected button gets visual confirmation

**Strategy 2: Parent-Controlled Lock**
```typescript
// Parent component passes isProcessing prop
<ChoiceList
  choices={availableChoices}
  onChoiceSelect={handleChoice}
  isProcessing={gameState === 'showing_outcome'}
/>
```

**Use Case:** When timer or game flow needs to lock buttons externally

**Recommended Approach:** Use both - internal lock for immediate feedback, parent prop for flow control

### Processing State Visual Feedback

```typescript
const ChoiceButton = ({ choice, disabled, isSelected, onSelect }: Props) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled) return;

    setIsPressed(true);
    onSelect(choice.id);

    // Keep pressed state for 150ms for visual feedback
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={cn(
        'choice-button',
        isPressed && 'choice-button--pressed',
        isSelected && 'choice-button--selected',
        disabled && 'choice-button--disabled',
        choice.characterOnly === 'rupert' && 'choice-button--rupert',
        choice.characterOnly === 'milo' && 'choice-button--milo',
      )}
    >
      {choice.text}
    </button>
  );
};
```

### Animation Timing

| Interaction | Duration | Easing | Purpose |
|-------------|----------|--------|---------|
| Hover scale | 150ms | ease-out | Smooth preview |
| Press scale | 50ms | ease-in | Instant feedback |
| Disabled fade | 200ms | ease-out | Graceful disable |
| Selection border | 300ms | ease-out | Confirmation |

---

## 5. Accessibility

### Keyboard Navigation

**Tab Order:**
1. First choice button
2. Second choice button
3. Third choice button
4. Fourth choice button (if present)

**Keyboard Support:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent, choice: Choice) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelect(choice.id);
  }
};

<button
  onKeyDown={(e) => handleKeyDown(e, choice)}
  // ... other props
>
```

### Focus States

```css
.choice-button:focus-visible {
  outline: 3px solid #8b5cf6; /* violet-500 */
  outline-offset: 2px;
  border-color: rgba(255, 255, 255, 0.6);
}
```

**Design Rationale:**
- Clear focus ring for keyboard users
- Violet matches brand color
- 2px offset prevents overlap with border
- `:focus-visible` only shows for keyboard, not mouse clicks

### Screen Reader Support

```tsx
<button
  aria-label={
    choice.characterOnly
      ? `${choice.text} - ${choice.characterOnly === 'rupert' ? 'Warrior' : 'Mage'} choice`
      : choice.text
  }
  aria-disabled={disabled}
  role="button"
>
  {choice.characterOnly && (
    <span aria-hidden="true">
      {choice.characterOnly === 'rupert' ? '⚔️' : '🔮'}
    </span>
  )}
  <span>{choice.text}</span>
</button>
```

**Announcements:**
- Character icon is decorative (aria-hidden), label describes it
- Text content is announced naturally
- Disabled state is conveyed via aria-disabled

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .choice-button {
    transition: none;
  }

  .choice-button:hover,
  .choice-button:active {
    transform: none; /* No scale animations */
  }
}
```

### Color Contrast

**Text on Button:**
- White text (#ffffff) on semi-transparent background
- Text shadow for readability: `0 1px 3px rgba(0, 0, 0, 0.8)`
- Minimum contrast ratio: 4.5:1 (WCAG AA)

**Border Contrast:**
- Default: rgba(255, 255, 255, 0.2) - 3:1 against dark backgrounds
- Character borders (orange/violet): 3:1+ against backgrounds
- Hover states increase contrast further

**Verification:** Test against darkest scene backgrounds to ensure readability

---

## 6. Edge Cases & Error Handling

### No Choices Available

```tsx
{choices.length === 0 ? (
  <div className="text-center text-white/60 py-8">
    <p>Choices unavailable. Please refresh.</p>
  </div>
) : (
  <ChoiceList choices={choices} ... />
)}
```

### More Than 4 Choices (Data Error)

```typescript
// Log warning but render all choices
if (choices.length > 4) {
  console.warn(`Scene has ${choices.length} choices. Maximum recommended: 4`);
}

// Add scroll if needed
<div className={cn(
  "choice-list",
  choices.length > 4 && "overflow-y-auto max-h-[60vh]"
)}>
```

**Design Decision:** Support overflow gracefully, but story design should never exceed 4

### Text Overflow (Long Choice Text)

```css
.choice-button {
  /* Allow text wrapping */
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;

  /* Max 3 lines before ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Design Decision:** Wrap text naturally, but story writers should limit to 8 words per choice

### Character Icon Missing

```typescript
const getCharacterIcon = (characterId?: 'rupert' | 'milo') => {
  if (!characterId) return null;
  return characterId === 'rupert' ? '⚔️' : '🔮';
};
```

**Fallback:** If character data is malformed, simply don't show icon

---

## 7. Integration with Game Flow

### Scene Display Flow

```typescript
// Parent component (GameScene)
const [flowState, setFlowState] = useState<GameFlowState>('scene_display');

// When scene text is fully displayed
useEffect(() => {
  if (flowState === 'scene_display') {
    const timer = setTimeout(() => {
      setFlowState('showing_choices');
    }, 1000); // 1 second delay for reading
    return () => clearTimeout(timer);
  }
}, [flowState]);

return (
  <>
    <StoryText text={currentScene.text} />

    {flowState === 'showing_choices' && (
      <ChoiceList
        choices={availableChoices}
        onChoiceSelect={handleChoice}
      />
    )}
  </>
);
```

**Integration Points:**
1. Choices appear after scene text is displayed
2. Timer starts when ChoiceList appears
3. Selecting choice triggers outcome display
4. ChoiceList unmounts during outcome/transition

### Animation Entry

```css
.choice-list {
  animation: slideUp 300ms ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Design Rationale:**
- Choices slide up from bottom (natural mobile gesture direction)
- 300ms matches other scene transitions
- Stagger individual buttons for polish (future enhancement)

---

## 8. Performance Considerations

### Rendering Optimization

```typescript
const ChoiceButton = React.memo(({ choice, disabled, onSelect }: Props) => {
  // Button implementation
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.choice.id === nextProps.choice.id &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.isSelected === nextProps.isSelected
  );
});
```

**Rationale:** Prevent unnecessary re-renders when parent state changes

### Event Handler Optimization

```typescript
// DON'T create new functions in render
{choices.map(choice => (
  <ChoiceButton onSelect={() => handleSelect(choice)} /> // NEW FUNCTION EACH RENDER
))}

// DO: Use stable callback
const handleSelect = useCallback((choiceId: string) => {
  // handle selection
}, [dependencies]);

{choices.map(choice => (
  <ChoiceButton
    choice={choice}
    onSelect={handleSelect} // SAME REFERENCE
  />
))}
```

---

## 9. Testing Considerations

### Visual Testing Scenarios

1. **2 choices** - Standard layout, no character choices
2. **4 choices** - Maximum density, mix of shared + character choices
3. **All character choices** - Rupert playing with all Rupert options visible
4. **Long text** - Choice text approaching 3-line wrap
5. **Disabled state** - All buttons locked during processing
6. **Selected state** - One button selected, others faded

### Interaction Testing

- [ ] Tap button - immediate visual feedback
- [ ] Tap disabled button - no response
- [ ] Tap selected button again - no response
- [ ] Rapid tap two buttons - only first registers
- [ ] Keyboard Tab navigation - focus visible
- [ ] Keyboard Enter - selects focused choice
- [ ] Screen reader - announces choice text and character type

### Cross-Device Testing

- [ ] iPhone SE (small screen) - 375px width
- [ ] iPhone 14 Pro - 393px width
- [ ] iPad - 768px width
- [ ] Desktop Chrome - 1920px width
- [ ] Touch vs mouse interactions
- [ ] Reduced motion mode

---

## 10. Future Enhancements (Post-MVP)

### Staggered Entry Animation

```typescript
{choices.map((choice, index) => (
  <ChoiceButton
    style={{ animationDelay: `${index * 50}ms` }}
    choice={choice}
    ...
  />
))}
```

**Effect:** Choices appear one after another (50ms stagger) - adds polish

### Haptic Feedback (Mobile)

```typescript
const handleSelect = (choice: Choice) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // 10ms vibration on tap
  }
  onSelect(choice.id);
};
```

### Sound Effects

```typescript
const tapSound = new Audio('/sounds/choice-tap.mp3');
tapSound.volume = 0.3;

const handleSelect = (choice: Choice) => {
  tapSound.play();
  onSelect(choice.id);
};
```

**Consideration:** Add settings toggle for sound before implementing

### Character Choice Glow

```css
.choice-button--rupert::after {
  position: absolute;
  inset: -2px;
  border-radius: 8px;
  background: linear-gradient(135deg, transparent, rgba(249, 115, 22, 0.3));
  opacity: 0;
  transition: opacity 150ms;
}

.choice-button--rupert:hover::after {
  opacity: 1;
}
```

**Effect:** Subtle glow on hover for character choices - adds "special" feel

---

## Summary & Recommendation

### Recommended Approach

**Component Structure:**
- Separate ChoiceButton and ChoiceList components
- ChoiceList manages layout and locking logic
- ChoiceButton handles individual button states

**Visual Design:**
- Full-width buttons, 56px height
- Character choices: orange border + ⚔️ (Rupert), violet border + 🔮 (Milo)
- Clear hover/press/disabled states
- Scale animation for tactile feedback

**Interaction:**
- Internal lock prevents double-tap immediately
- Parent prop allows external locking during game flow
- Keyboard and screen reader support built-in
- Reduced motion respected

**Responsive:**
- Mobile-first vertical stack
- Fixed/absolute positioning at bottom of screen
- Max-width constraints for larger screens
- Consistent padding and spacing

### Open Questions for Product Owner

1. **Fixed vs Relative Positioning:** Should ChoiceList be fixed to bottom of viewport, or positioned after StoryText? Fixed is more consistent for thumb reach.

2. **Entry Animation:** Should buttons appear all at once, or staggered (50ms delay each)?

3. **Desktop Layout:** Keep vertical stack, or use 2x2 grid when 4 choices present?

4. **Character Icon Position:** Left side (before text) or right side (after text)?

### Acceptance Criteria Coverage

- [x] **2-4 distinct buttons visible** - Layout handles 2-4, warns if more
- [x] **Full-width and min 56px height on mobile** - Specified in styles
- [x] **Immediate visual feedback (pressed state)** - Scale animation on press
- [x] **All buttons disabled when processing** - Internal lock + disabled prop
- [x] **Character-specific choices have visual indicator** - Icon + border color

### Next Steps

1. Review this design document with product owner
2. Confirm open questions (positioning, animations)
3. Approve visual design approach
4. Proceed to implementation (ChoiceButton.tsx, ChoiceList.tsx)

---

**Design Status:** Ready for Review
**Estimated Implementation Time:** 4-6 hours
**Dependencies:** Choice type definition (already exists), Design tokens
**Blocks:** Timer component (needs ChoiceList positioning finalized)
