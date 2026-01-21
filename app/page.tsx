/**
 * Demo Page - Full Game Loop with Scene Transitions
 *
 * Demonstrates the complete game flow:
 * - Scene display with background
 * - Character selection
 * - Choice selection
 * - Outcome display
 * - Scene transitions (fade animation)
 * - Death screen
 * - Ending screen
 *
 * Ticket: #5 (1.5: Scene Transition Logic) - FIXED VERSION
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import SceneContainer from '@/src/components/SceneContainer';
import StoryText from '@/src/components/StoryText';
import { ChoiceList } from '@/src/components/ChoiceList';
import OutcomeDisplay from '@/src/components/OutcomeDisplay';
import { useSceneTransition } from '@/src/hooks';
import { depositJobStory } from '@/src/data/stories/deposit-job';
import type { Choice, Scene } from '@/src/types/game';

// Background gradients for demo (since we don't have actual images yet)
const sceneBackgrounds: Record<string, string> = {
  'scene-1': 'linear-gradient(135deg, #3d2e1f 0%, #6b4423 50%, #8b5a3c 100%)',
  'scene-2': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'scene-3': 'linear-gradient(135deg, #2d4059 0%, #ea5455 50%, #f07b3f 100%)',
  'scene-3b': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
  'scene-4': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'scene-5': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)',
  'scene-6': 'linear-gradient(135deg, #232526 0%, #414345 50%, #606060 100%)',
  'scene-7': 'linear-gradient(135deg, #c31432 0%, #240b36 50%, #1a1a1a 100%)',
  'scene-8': 'linear-gradient(135deg, #ff0000 0%, #cc0000 50%, #8b0000 100%)',
  'scene-9': 'linear-gradient(135deg, #141e30 0%, #243b55 50%, #3a5f7d 100%)',
  'scene-10': 'linear-gradient(135deg, #000000 0%, #2c3e50 50%, #34495e 100%)',
  'scene-11a': 'linear-gradient(135deg, #56ab2f 0%, #a8e063 50%, #d4fc79 100%)',
  'scene-11b': 'linear-gradient(135deg, #aa076b 0%, #61045f 50%, #4e0d3a 100%)',
  'scene-11c': 'linear-gradient(135deg, #f2994a 0%, #f2c94c 50%, #f2e863 100%)',
};

type GamePhase = 'choosing' | 'showing_outcome' | 'transitioning' | 'dead' | 'ending';

// Helper function to get scene by ID
const getSceneById = (sceneId: string): Scene | undefined => {
  return depositJobStory.scenes.find((s) => s.id === sceneId);
};

export default function Home() {
  // Character selection
  const [selectedCharacter, setSelectedCharacter] = useState<'rupert' | 'milo'>('rupert');

  // Current scene
  const [currentScene, setCurrentScene] = useState<Scene>(
    getSceneById(depositJobStory.startSceneId) || depositJobStory.scenes[0]
  );
  const [previousSceneId, setPreviousSceneId] = useState<string | null>(null);

  // Game phase
  const [gamePhase, setGamePhase] = useState<GamePhase>('choosing');

  // Selected choice for outcome display
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  // Chaos level
  const [chaosLevel, setChaosLevel] = useState(0);

  // Death state
  const [deathText, setDeathText] = useState<string>('');

  // Chaos change tracking (for endings)
  const [pendingChaosChange, setPendingChaosChange] = useState(0);

  // Scene transition hook
  const {
    transitionState,
    isLocked,
    opacity,
    transitionTo,
    preloadImage,
  } = useSceneTransition({
    fadeOutDuration: 150,
    fadeInDuration: 150,
    onTransitionStart: () => {
      setGamePhase('transitioning');
    },
    onSceneReady: (scene) => {
      setPreviousSceneId(currentScene.id);
      setCurrentScene(scene);
      // Apply chaos change AFTER transition (for ending calculation)
      if (pendingChaosChange !== 0) {
        setChaosLevel((prev) => Math.max(0, Math.min(100, prev + pendingChaosChange)));
        setPendingChaosChange(0);
      }
    },
    onTransitionComplete: () => {
      setSelectedChoice(null);
      setGamePhase('choosing');
    },
    onEndingReached: (scene) => {
      console.log('Ending reached:', scene.id);
      setGamePhase('ending');
      setPreviousSceneId(currentScene.id);
      setCurrentScene(scene);
      setSelectedChoice(null);
    },
  });

  // Preload adjacent scenes on mount and scene change
  useEffect(() => {
    currentScene.choices.forEach((choice) => {
      const nextScene = getSceneById(choice.nextSceneId);
      if (nextScene) {
        preloadImage(sceneBackgrounds[nextScene.id] || nextScene.backgroundImage);
      }
    });
  }, [currentScene, preloadImage]);

  // Get scene text (with arrival variant if applicable)
  const getSceneText = useCallback(() => {
    // Check for scene-based arrival variant first
    if (previousSceneId && currentScene.arrivalVariants?.[previousSceneId]) {
      return currentScene.arrivalVariants[previousSceneId].text;
    }

    // Check for chaos-based arrival variant (for endings)
    if (currentScene.arrivalVariants) {
      const chaosKey =
        chaosLevel <= 25 ? 'chaos-0-25' :
        chaosLevel <= 50 ? 'chaos-26-50' :
        chaosLevel <= 75 ? 'chaos-51-75' : 'chaos-76-100';
      if (currentScene.arrivalVariants[chaosKey]) {
        return currentScene.arrivalVariants[chaosKey].text;
      }
    }

    return currentScene.text;
  }, [currentScene, previousSceneId, chaosLevel]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: Choice) => {
    if (isLocked || gamePhase !== 'choosing') return;

    // Check for death condition BEFORE applying chaos change
    if (choice.deathCondition && chaosLevel >= choice.deathCondition.minChaos) {
      // Player dies!
      setGamePhase('dead');
      setDeathText(choice.deathText || 'You died.');
      return;
    }

    setSelectedChoice(choice);
    setGamePhase('showing_outcome');

    // Calculate chaos change (but don't apply yet - wait for transition)
    let chaosChange = choice.chaosChange;
    if (choice.chaosVariance) {
      const { min, max } = choice.chaosVariance;
      chaosChange += Math.floor(Math.random() * (max - min + 1)) + min;
    }
    setPendingChaosChange(chaosChange);

    // Update chaos immediately for visual feedback (meter animation)
    setChaosLevel((prev) => Math.max(0, Math.min(100, prev + chaosChange)));
  }, [isLocked, gamePhase, chaosLevel]);

  // Handle outcome complete - trigger scene transition
  const handleOutcomeComplete = useCallback(() => {
    if (!selectedChoice) return;

    const nextScene = getSceneById(selectedChoice.nextSceneId);
    if (nextScene) {
      transitionTo(nextScene, currentScene.id);
    } else {
      // Same scene (flavor choice) - just return to choosing
      setSelectedChoice(null);
      setGamePhase('choosing');
    }
  }, [selectedChoice, currentScene.id, transitionTo]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    const startScene = getSceneById(depositJobStory.startSceneId);
    if (startScene) {
      setCurrentScene(startScene);
      setPreviousSceneId(null);
      setChaosLevel(0);
      setSelectedChoice(null);
      setGamePhase('choosing');
      setDeathText('');
      setPendingChaosChange(0);
    }
  }, []);

  // Get background for current scene
  const background = sceneBackgrounds[currentScene.id] || currentScene.backgroundImage;

  // Determine if UI should be interactive
  const canInteract = gamePhase === 'choosing' && !isLocked;

  // Get character flavor text (if available)
  const characterFlavorText = currentScene.characterFlavor?.[selectedCharacter];

  // DEATH SCREEN
  if (gamePhase === 'dead') {
    return (
      <SceneContainer
        backgroundImage="linear-gradient(135deg, #000000 0%, #1a0000 50%, #330000 100%)"
        testId="death-screen"
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-black/80 border-4 border-red-500 rounded-lg p-8 text-center">
            <div className="text-8xl mb-6">💀</div>
            <h1 className="text-4xl font-bold text-red-500 mb-6">GAME OVER</h1>
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-line mb-8">
              {deathText}
            </div>
            <div className="text-white/60 text-sm mb-6">
              Final Chaos Level: <span className="text-red-400 font-bold">{chaosLevel}</span>
            </div>
            <button
              onClick={handlePlayAgain}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </SceneContainer>
    );
  }

  // ENDING SCREEN
  if (gamePhase === 'ending') {
    return (
      <SceneContainer
        backgroundImage={background}
        testId="ending-screen"
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-black/90 border-4 border-yellow-500 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">{currentScene.text}</h1>
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-line mb-8">
              {getSceneText()}
            </div>
            <div className="text-white/60 text-sm mb-6">
              Final Chaos Level: <span className={`font-bold ${
                chaosLevel <= 25 ? 'text-green-400' :
                chaosLevel <= 50 ? 'text-yellow-400' :
                chaosLevel <= 75 ? 'text-orange-400' : 'text-red-400'
              }`}>{chaosLevel}</span>
            </div>
            {characterFlavorText && (
              <div className="text-white/70 italic text-base mb-6 border-t border-white/20 pt-6">
                {characterFlavorText}
              </div>
            )}
            <button
              onClick={handlePlayAgain}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg rounded-lg transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </SceneContainer>
    );
  }

  // MAIN GAME SCREEN
  return (
    <SceneContainer
      backgroundImage={background}
      testId="demo-scene"
    >
      {/* Transition overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        style={{ opacity: 1 - opacity }}
      >
        <div className="absolute inset-0 bg-black" />
      </div>

      {/* Main content with opacity transition */}
      <div
        className="absolute inset-0 transition-opacity duration-150"
        style={{ opacity }}
      >
        {/* Header: Character toggle + Chaos meter */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => canInteract && setSelectedCharacter('rupert')}
            disabled={!canInteract}
            className={`
              flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${!canInteract ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedCharacter === 'rupert'
                ? 'bg-orange-500 text-white border-2 border-orange-400'
                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
              }
            `}
          >
            ⚔️ Rupert
          </button>
          <button
            onClick={() => canInteract && setSelectedCharacter('milo')}
            disabled={!canInteract}
            className={`
              flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${!canInteract ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedCharacter === 'milo'
                ? 'bg-violet-500 text-white border-2 border-violet-400'
                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
              }
            `}
          >
            🔮 Milo
          </button>
        </div>

        {/* Chaos meter display */}
        <div className="absolute top-16 left-4 right-4 z-10">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">Chaos:</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  chaosLevel < 26 ? 'bg-green-500' :
                  chaosLevel < 51 ? 'bg-yellow-500' :
                  chaosLevel < 76 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${chaosLevel}%` }}
              />
            </div>
            <span className="text-white/80 text-sm w-8">{chaosLevel}</span>
          </div>
        </div>

        {/* Scene text */}
        <StoryText
          text={getSceneText()}
          position="top"
        />

        {/* Character flavor text (if available) */}
        {characterFlavorText && gamePhase === 'choosing' && (
          <div className="absolute top-32 left-4 right-4 z-10">
            <div className="bg-black/60 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3">
              <p className="text-white/90 text-sm italic text-center">
                {characterFlavorText}
              </p>
            </div>
          </div>
        )}

        {/* Choice list - only when choosing */}
        {gamePhase === 'choosing' && (
          <ChoiceList
            choices={currentScene.choices}
            selectedCharacter={selectedCharacter}
            onChoiceSelect={handleChoiceSelect}
            isProcessing={isLocked}
          />
        )}

        {/* Outcome display - after choice */}
        {gamePhase === 'showing_outcome' && selectedChoice && (
          <OutcomeDisplay
            outcomeText={selectedChoice.outcomeText}
            chaosChange={selectedChoice.chaosChange}
            onComplete={handleOutcomeComplete}
          />
        )}

        {/* Transition indicator */}
        {gamePhase === 'transitioning' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60 text-sm animate-pulse">
              Loading next scene...
            </div>
          </div>
        )}

        {/* Scene info footer */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-xs pb-2 bg-gradient-to-t from-black/50 to-transparent pt-8">
          <p>Scene: {currentScene.id} | Story: {depositJobStory.title}</p>
          <p className="mt-1">
            {transitionState !== 'idle' ? `Transition: ${transitionState}` : 'Select a choice'}
          </p>
        </div>
      </div>
    </SceneContainer>
  );
}
