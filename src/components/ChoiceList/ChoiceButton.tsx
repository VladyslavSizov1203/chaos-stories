/**
 * ChoiceButton Component
 *
 * Individual choice button with character-specific styling and interaction states.
 * Provides immediate visual feedback for taps/clicks and supports accessibility features.
 *
 * Design principles:
 * - Minimum 56px height for thumb-friendly touch targets
 * - Scale animations for tactile feedback (hover: 1.02, active: 0.98)
 * - Character-specific borders and icons (Rupert: orange/sword, Milo: violet/crystal)
 * - Clear disabled and selected states
 *
 * @see DESIGN.md for full visual specifications
 */

'use client';

import React, { useCallback } from 'react';
import { Choice } from '@/src/types/game';

export interface ChoiceButtonProps {
  /** Full choice object with text, type, and metadata */
  choice: Choice;
  /** Disables interaction when locked or processing */
  disabled: boolean;
  /** Whether this choice was selected by the player */
  isSelected?: boolean;
  /** Callback fired when button is clicked/tapped */
  onSelect: (choiceId: string) => void;
}

/**
 * Individual choice button with character-specific styling
 *
 * Visual states:
 * - Default: Semi-transparent white background with border
 * - Hover: Slight scale up (desktop only)
 * - Active/Pressed: Scale down for tactile feedback
 * - Selected: Green border with checkmark
 * - Disabled: 50% opacity, no interaction
 *
 * Character variants:
 * - Rupert (warrior): Orange border, ⚔️ icon
 * - Milo (mage): Violet border, 🔮 icon
 * - Shared: Default white border
 */
const ChoiceButton = React.memo<ChoiceButtonProps>(({
  choice,
  disabled,
  isSelected = false,
  onSelect,
}) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelect(choice.id);
  }, [disabled, onSelect, choice.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(choice.id);
    }
  }, [disabled, onSelect, choice.id]);

  // Determine character-specific styling
  const isRupert = choice.characterOnly === 'rupert';
  const isMilo = choice.characterOnly === 'milo';
  const characterIcon = isRupert ? '⚔️' : isMilo ? '🔮' : null;

  // Build dynamic class names
  const buttonClasses = [
    // Base layout
    'w-full',
    'min-h-[56px]',
    'px-5',
    'py-4',

    // Flexbox for icon + text
    'flex',
    'items-center',
    'gap-2',

    // Visual base
    'bg-white/10',
    'backdrop-blur-sm',
    'border-2',
    'rounded-lg',

    // Typography
    'text-white',
    'text-base',
    'font-medium',
    'text-left',
    'leading-relaxed',

    // Text shadow for readability
    '[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]',

    // Interaction
    'cursor-pointer',
    'transition-all',
    'duration-150',
    'ease-out',

    // Focus state (keyboard navigation)
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-violet-500',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-transparent',
  ];

  // State-specific classes
  if (disabled) {
    buttonClasses.push(
      'opacity-50',
      'cursor-not-allowed',
      'pointer-events-none',
    );
  } else {
    // Hover state (desktop only)
    buttonClasses.push(
      'hover:bg-white/20',
      'hover:border-white/40',
      'hover:scale-[1.02]',
    );

    // Active/pressed state
    buttonClasses.push(
      'active:scale-[0.98]',
      'active:bg-white/25',
      'active:duration-75',
      'active:ease-in',
    );
  }

  // Selected state
  if (isSelected) {
    buttonClasses.push(
      'border-emerald-500',
      'bg-emerald-500/20',
    );
  } else if (isRupert) {
    // Rupert character styling
    buttonClasses.push(
      'border-orange-500',
      'hover:border-orange-600',
      'hover:bg-orange-500/15',
    );
  } else if (isMilo) {
    // Milo character styling
    buttonClasses.push(
      'border-violet-500',
      'hover:border-violet-600',
      'hover:bg-violet-500/15',
    );
  } else {
    // Shared choice styling
    buttonClasses.push(
      'border-white/20',
    );
  }

  // Reduced motion support
  const reducedMotionClasses = [
    'motion-reduce:transition-none',
    'motion-reduce:hover:scale-100',
    'motion-reduce:active:scale-100',
  ];

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={[...buttonClasses, ...reducedMotionClasses].join(' ')}
      aria-label={
        choice.characterOnly
          ? `${choice.text} - ${choice.characterOnly === 'rupert' ? 'Warrior' : 'Mage'} choice`
          : choice.text
      }
      aria-disabled={disabled}
    >
      {/* Character icon */}
      {characterIcon && (
        <span
          className="text-lg flex-shrink-0"
          aria-hidden="true"
        >
          {characterIcon}
        </span>
      )}

      {/* Choice text */}
      <span className="flex-1">
        {choice.text}
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <span
          className="text-emerald-500 text-xl flex-shrink-0"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.choice.id === nextProps.choice.id &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onSelect === nextProps.onSelect
  );
});

ChoiceButton.displayName = 'ChoiceButton';

export default ChoiceButton;
