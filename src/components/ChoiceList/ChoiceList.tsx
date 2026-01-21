/**
 * ChoiceList Component
 *
 * Container component that manages multiple ChoiceButtons and handles selection logic.
 * Filters choices based on selected character and prevents double-tap interactions.
 *
 * Features:
 * - Filters character-specific choices (shows shared + current character's choices)
 * - Internal locking to prevent double-tap/double-click
 * - Responsive vertical stack layout
 * - Smooth entry animation (slide up from bottom)
 *
 * @see DESIGN.md for layout specifications
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Choice } from '@/src/types/game';
import ChoiceButton from './ChoiceButton';

export interface ChoiceListProps {
  /** Array of 2-4 choices to display */
  choices: Choice[];
  /** Currently selected character ('rupert' or 'milo') */
  selectedCharacter: 'rupert' | 'milo';
  /** Callback fired when a choice is selected */
  onChoiceSelect: (choice: Choice) => void;
  /** External lock state (e.g., during timer countdown or outcome display) */
  isProcessing?: boolean;
}

/**
 * Manages display and interaction for multiple choice buttons
 *
 * Filtering logic:
 * - Shows all shared choices (no characterOnly property)
 * - Shows choices specific to the selected character
 * - Hides choices for the other character
 *
 * Locking mechanism:
 * - Internal lock prevents double-tap immediately after selection
 * - External isProcessing prop allows parent to control locking
 * - Both locks work together for robust interaction control
 */
const ChoiceList: React.FC<ChoiceListProps> = ({
  choices,
  selectedCharacter,
  onChoiceSelect,
  isProcessing = false,
}) => {
  // Internal state to track selection and prevent double-tap
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Filter choices based on selected character
  const filteredChoices = useMemo(() => {
    return choices.filter(choice => {
      // Always show shared choices
      if (!choice.characterOnly) return true;
      // Show character-specific choices only if they match selected character
      return choice.characterOnly === selectedCharacter;
    });
  }, [choices, selectedCharacter]);

  // Warn if we have more than 4 choices (story design issue)
  if (filteredChoices.length > 4) {
    console.warn(
      `ChoiceList: ${filteredChoices.length} choices after filtering. ` +
      `Maximum recommended: 4. Consider revising story design.`
    );
  }

  // Handle choice selection with double-tap prevention
  const handleSelect = useCallback((choiceId: string) => {
    // Exit early if already locked
    if (isLocked || isProcessing) return;

    // Find the selected choice
    const selectedChoice = filteredChoices.find(c => c.id === choiceId);
    if (!selectedChoice) return;

    // Lock immediately to prevent double-tap
    setIsLocked(true);
    setSelectedChoiceId(choiceId);

    // Notify parent
    onChoiceSelect(selectedChoice);
  }, [isLocked, isProcessing, filteredChoices, onChoiceSelect]);

  // Determine if buttons should be disabled
  const isDisabled = isLocked || isProcessing;

  // Empty state fallback
  if (filteredChoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <p className="text-white/60 text-center">
          No choices available. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        flex-col
        gap-3
        w-full
        max-w-md
        mx-auto
        px-4
        pb-6
        animate-slide-up
        sm:max-w-lg
        sm:px-6
        sm:pb-8
        lg:max-w-xl
        lg:gap-4
        lg:px-8
        lg:pb-12
      "
      role="group"
      aria-label="Available choices"
    >
      {filteredChoices.map((choice) => (
        <ChoiceButton
          key={choice.id}
          choice={choice}
          disabled={isDisabled}
          isSelected={selectedChoiceId === choice.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default ChoiceList;
