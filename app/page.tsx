/**
 * Demo Page - Full Game Loop Components
 *
 * Displays the tavern entrance scene to demonstrate:
 * - SceneContainer with background gradient
 * - StoryText component
 * - ChoiceList with character filtering
 * - OutcomeDisplay with auto-dismiss flow
 *
 * This page serves as a visual test for responsive behavior and styling.
 */

'use client';

import { useState } from 'react';
import SceneContainer from '@/src/components/SceneContainer';
import StoryText from '@/src/components/StoryText';
import { ChoiceList } from '@/src/components/ChoiceList';
import OutcomeDisplay from '@/src/components/OutcomeDisplay';
import { tavernEntranceScene } from '@/src/data/test-scenes';
import { Choice } from '@/src/types/game';

export default function Home() {
  // Character selection state for testing character-specific choices
  const [selectedCharacter, setSelectedCharacter] = useState<'rupert' | 'milo'>('rupert');

  // Outcome display state
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showNextSceneMessage, setShowNextSceneMessage] = useState(false);

  // Using a placeholder gradient since we don't have actual images yet
  // In production, this would be: tavernEntranceScene.backgroundImage
  const placeholderBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  const handleChoiceSelect = (choice: Choice) => {
    // Show the outcome display
    setSelectedChoice(choice);
    setShowOutcome(true);
    setShowNextSceneMessage(false);
  };

  const handleOutcomeComplete = () => {
    // Hide outcome and show "Next scene" message
    setShowOutcome(false);

    // Show next scene message
    setShowNextSceneMessage(true);

    // After 2 seconds, hide message and allow new choice selection
    setTimeout(() => {
      setShowNextSceneMessage(false);
      setSelectedChoice(null);
    }, 2000);
  };

  return (
    <SceneContainer
      backgroundImage={placeholderBackground}
      testId="demo-scene"
    >
      {/* Character toggle buttons */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setSelectedCharacter('rupert')}
          className={`
            flex-1
            px-4
            py-2
            rounded-lg
            font-semibold
            text-sm
            transition-all
            ${selectedCharacter === 'rupert'
              ? 'bg-orange-500 text-white border-2 border-orange-400'
              : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
            }
          `}
        >
          ⚔️ Rupert
        </button>
        <button
          onClick={() => setSelectedCharacter('milo')}
          className={`
            flex-1
            px-4
            py-2
            rounded-lg
            font-semibold
            text-sm
            transition-all
            ${selectedCharacter === 'milo'
              ? 'bg-violet-500 text-white border-2 border-violet-400'
              : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
            }
          `}
        >
          🔮 Milo
        </button>
      </div>

      {/* Scene text using StoryText component */}
      <StoryText
        text={tavernEntranceScene.text}
        position="top"
      />

      {/* ChoiceList - hidden when outcome is showing */}
      {!showOutcome && !showNextSceneMessage && (
        <ChoiceList
          choices={tavernEntranceScene.choices}
          selectedCharacter={selectedCharacter}
          onChoiceSelect={handleChoiceSelect}
        />
      )}

      {/* OutcomeDisplay - shows after choice selection */}
      {showOutcome && selectedChoice && (
        <OutcomeDisplay
          outcomeText={selectedChoice.outcomeText}
          chaosChange={selectedChoice.chaosChange}
          onComplete={handleOutcomeComplete}
        />
      )}

      {/* Next scene message */}
      {showNextSceneMessage && (
        <div className="absolute bottom-24 left-4 right-4 p-4 bg-emerald-500/90 rounded-lg text-white text-center animate-fade-in">
          <p className="text-lg font-semibold">Next scene would load here...</p>
          <p className="text-sm mt-1 opacity-80">
            Chaos changed by {selectedChoice?.chaosChange}
          </p>
        </div>
      )}

      {/* Demo info */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-xs pb-2 bg-gradient-to-t from-black/50 to-transparent pt-8">
        <p>Full Game Loop Demo</p>
        <p className="mt-1">
          Toggle character | Select choice to see outcome display flow
        </p>
      </div>
    </SceneContainer>
  );
}
