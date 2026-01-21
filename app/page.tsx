/**
 * Demo Page - SceneContainer, StoryText, and ChoiceList Components
 *
 * Displays the tavern entrance scene to demonstrate:
 * - SceneContainer with background gradient
 * - StoryText component
 * - ChoiceList with character filtering
 *
 * This page serves as a visual test for responsive behavior and styling.
 */

'use client';

import { useState } from 'react';
import SceneContainer from '@/src/components/SceneContainer';
import StoryText from '@/src/components/StoryText';
import { ChoiceList } from '@/src/components/ChoiceList';
import { tavernEntranceScene } from '@/src/data/test-scenes';
import { Choice } from '@/src/types/game';

export default function Home() {
  // Character selection state for testing character-specific choices
  const [selectedCharacter, setSelectedCharacter] = useState<'rupert' | 'milo'>('rupert');
  const [lastChoice, setLastChoice] = useState<string | null>(null);

  // Using a placeholder gradient since we don't have actual images yet
  // In production, this would be: tavernEntranceScene.backgroundImage
  const placeholderBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  const handleChoiceSelect = (choice: Choice) => {
    setLastChoice(`${choice.text} (Chaos: ${choice.chaosChange > 0 ? '+' : ''}${choice.chaosChange})`);

    // Simulate choice processing - in real game, this would transition to outcome display
    setTimeout(() => {
      setLastChoice(null);
    }, 3000);
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

      {/* Show last selected choice */}
      {lastChoice && (
        <div className="absolute top-20 left-4 right-4 mt-4 p-3 bg-emerald-500/90 rounded-lg text-white text-sm text-center animate-slide-up">
          <strong>Selected:</strong> {lastChoice}
        </div>
      )}

      {/* ChoiceList component */}
      <ChoiceList
        choices={tavernEntranceScene.choices}
        selectedCharacter={selectedCharacter}
        onChoiceSelect={handleChoiceSelect}
      />

      {/* Demo info */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-xs pb-2 bg-gradient-to-t from-black/50 to-transparent pt-8">
        <p>ChoiceList Component Demo</p>
        <p className="mt-1">
          Toggle character to see filtering | Tap choices to test interaction
        </p>
      </div>
    </SceneContainer>
  );
}
