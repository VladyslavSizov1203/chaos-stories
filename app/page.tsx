/**
 * Chaos Stories - Main Game Page
 *
 * Full game flow using the new useGameState hook:
 * - Menu screen
 * - Character selection
 * - Scene display with choices
 * - Outcome display
 * - Scene transitions (fade animation)
 * - Death screen
 * - Ending screen
 *
 * Ticket: #6 (1.6: Game Flow State Machine) - Phase 2
 */

'use client';

import { useCallback, useEffect } from 'react';
import SceneContainer from '@/src/components/SceneContainer';
import StoryText from '@/src/components/StoryText';
import { ChoiceList } from '@/src/components/ChoiceList';
import OutcomeDisplay from '@/src/components/OutcomeDisplay';
import { useGameState } from '@/src/hooks/useGameState';
import { useSceneTransition } from '@/src/hooks';
import { depositJobStory } from '@/src/data/stories/deposit-job';
import { characters } from '@/src/data/characters';
import type { Choice, Scene, Character } from '@/src/types/game';

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

// Helper function to get scene by ID
const getSceneById = (sceneId: string): Scene | undefined => {
  return depositJobStory.scenes.find((s) => s.id === sceneId);
};

export default function Home() {
  // Game state machine
  const {
    state,
    flowState,
    isLocked,
    goToCharacterSelect,
    selectCharacter,
    startGame,
    showChoices,
    makeChoice,
    showOutcome,
    completeOutcome,
    completeTransition,
    setDead,
    reachEnding,
    restart,
  } = useGameState();

  // Scene transition hook (works alongside useGameState)
  const {
    transitionState,
    isLocked: transitionLocked,
    opacity,
    transitionTo,
    preloadImage,
  } = useSceneTransition({
    fadeOutDuration: 150,
    fadeInDuration: 150,
    onTransitionStart: () => {
      // Transition hook handles its own state
    },
    onSceneReady: (scene) => {
      // Update game state: transitioning → scene_display
      completeTransition(scene);
    },
    onTransitionComplete: () => {
      // Update game state: scene_display → showing_choices
      showChoices();
    },
    onEndingReached: (scene) => {
      console.log('Ending reached:', scene.id);
      reachEnding(scene);
    },
  });

  // Preload adjacent scenes when current scene changes
  useEffect(() => {
    if (state.currentScene) {
      state.currentScene.choices.forEach((choice) => {
        const nextScene = getSceneById(choice.nextSceneId);
        if (nextScene) {
          preloadImage(sceneBackgrounds[nextScene.id] || nextScene.backgroundImage);
        }
      });
    }
  }, [state.currentScene, preloadImage]);

  // Get scene text (with arrival variant if applicable)
  const getSceneText = useCallback(() => {
    if (!state.currentScene) return '';

    // Check for scene-based arrival variant first
    if (state.previousSceneId && state.currentScene.arrivalVariants?.[state.previousSceneId]) {
      return state.currentScene.arrivalVariants[state.previousSceneId].text;
    }

    // Check for chaos-based arrival variant (for endings)
    if (state.currentScene.arrivalVariants) {
      const chaosKey =
        state.chaosLevel <= 25 ? 'chaos-0-25' :
        state.chaosLevel <= 50 ? 'chaos-26-50' :
        state.chaosLevel <= 75 ? 'chaos-51-75' : 'chaos-76-100';
      if (state.currentScene.arrivalVariants[chaosKey]) {
        return state.currentScene.arrivalVariants[chaosKey].text;
      }
    }

    return state.currentScene.text;
  }, [state.currentScene, state.previousSceneId, state.chaosLevel]);

  // Handle character selection and start game
  const handleCharacterSelect = useCallback((character: Character) => {
    selectCharacter(character);
    const startScene = getSceneById(depositJobStory.startSceneId);
    if (startScene) {
      startGame(startScene);
      showChoices();
    }
  }, [selectCharacter, startGame, showChoices]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: Choice) => {
    if (isLocked || transitionLocked || flowState !== 'showing_choices') return;

    // Check for death condition BEFORE applying chaos change
    if (choice.deathCondition && state.chaosLevel >= choice.deathCondition.minChaos) {
      // Player dies!
      setDead(choice.deathText || 'You died.');
      return;
    }

    makeChoice(choice);
    showOutcome();
  }, [isLocked, transitionLocked, flowState, state.chaosLevel, makeChoice, showOutcome, setDead]);

  // Handle outcome complete - trigger scene transition
  const handleOutcomeComplete = useCallback(() => {
    if (!state.selectedChoice) return;

    // Calculate chaos change
    let chaosChange = state.selectedChoice.chaosChange;
    if (state.selectedChoice.chaosVariance) {
      const { min, max } = state.selectedChoice.chaosVariance;
      chaosChange += Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Update game state with chaos change
    completeOutcome(chaosChange);

    const nextScene = getSceneById(state.selectedChoice.nextSceneId);
    if (nextScene) {
      // Trigger visual transition
      transitionTo(nextScene, state.currentScene?.id || '');
    } else {
      // Same scene (flavor choice) - just return to choosing
      showChoices();
    }
  }, [state.selectedChoice, state.currentScene, completeOutcome, transitionTo, showChoices]);

  // Get background for current scene
  const background = state.currentScene
    ? (sceneBackgrounds[state.currentScene.id] || state.currentScene.backgroundImage)
    : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';

  // Get character flavor text (if available)
  const characterId = state.selectedCharacter?.id as 'rupert' | 'milo' | undefined;
  const characterFlavorText = characterId ? state.currentScene?.characterFlavor?.[characterId] : undefined;

  // MENU SCREEN
  if (flowState === 'menu') {
    return (
      <SceneContainer
        backgroundImage="linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
        testId="menu-screen"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              Chaos Stories
            </h1>
            <h2 className="text-2xl md:text-3xl text-yellow-400 mb-12">
              The Deposit Job
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
              Deliver a mysterious box to the Royal Bank. Make timed decisions. Create legendary chaos.
            </p>
            <button
              onClick={goToCharacterSelect}
              className="px-12 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105"
            >
              Choose Your Hero
            </button>
          </div>
        </div>
      </SceneContainer>
    );
  }

  // CHARACTER SELECT SCREEN
  if (flowState === 'character_select') {
    const rupert = characters.find((c) => c.id === 'rupert');
    const milo = characters.find((c) => c.id === 'milo');

    return (
      <SceneContainer
        backgroundImage="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        testId="character-select-screen"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
              Choose Your Hero
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Rupert Card */}
              {rupert && (
                <button
                  onClick={() => handleCharacterSelect(rupert)}
                  className="bg-gradient-to-br from-orange-900/40 to-orange-950/40 border-4 border-orange-500/50 hover:border-orange-400 rounded-lg p-8 text-left transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
                >
                  <div className="text-6xl mb-4">⚔️</div>
                  <h2 className="text-3xl font-bold text-orange-400 mb-3">
                    {rupert.name}
                  </h2>
                  <p className="text-lg text-orange-300 mb-4">{rupert.class}</p>
                  <p className="text-white/80 text-base leading-relaxed mb-4">
                    {rupert.description}
                  </p>
                  <div className="border-t border-orange-500/30 pt-4">
                    <p className="text-orange-400 font-semibold text-sm mb-1">
                      Ability: {rupert.ability.name}
                    </p>
                    <p className="text-white/70 text-sm">
                      {rupert.ability.description}
                    </p>
                  </div>
                </button>
              )}

              {/* Milo Card */}
              {milo && (
                <button
                  onClick={() => handleCharacterSelect(milo)}
                  className="bg-gradient-to-br from-violet-900/40 to-violet-950/40 border-4 border-violet-500/50 hover:border-violet-400 rounded-lg p-8 text-left transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20"
                >
                  <div className="text-6xl mb-4">🔮</div>
                  <h2 className="text-3xl font-bold text-violet-400 mb-3">
                    {milo.name}
                  </h2>
                  <p className="text-lg text-violet-300 mb-4">{milo.class}</p>
                  <p className="text-white/80 text-base leading-relaxed mb-4">
                    {milo.description}
                  </p>
                  <div className="border-t border-violet-500/30 pt-4">
                    <p className="text-violet-400 font-semibold text-sm mb-1">
                      Ability: {milo.ability.name}
                    </p>
                    <p className="text-white/70 text-sm">
                      {milo.ability.description}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </SceneContainer>
    );
  }

  // DEATH SCREEN
  if (flowState === 'dead') {
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
              {state.deathText}
            </div>
            <div className="text-white/60 text-sm mb-6">
              Final Chaos Level: <span className="text-red-400 font-bold">{state.chaosLevel}</span>
            </div>
            <button
              onClick={restart}
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
  if (flowState === 'ending') {
    return (
      <SceneContainer
        backgroundImage={background}
        testId="ending-screen"
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-black/90 border-4 border-yellow-500 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-6">{state.currentScene?.text}</h1>
            <div className="text-white/90 text-lg leading-relaxed whitespace-pre-line mb-8">
              {getSceneText()}
            </div>
            <div className="text-white/60 text-sm mb-6">
              Final Chaos Level: <span className={`font-bold ${
                state.chaosLevel <= 25 ? 'text-green-400' :
                state.chaosLevel <= 50 ? 'text-yellow-400' :
                state.chaosLevel <= 75 ? 'text-orange-400' : 'text-red-400'
              }`}>{state.chaosLevel}</span>
            </div>
            {characterFlavorText && (
              <div className="text-white/70 italic text-base mb-6 border-t border-white/20 pt-6">
                {characterFlavorText}
              </div>
            )}
            <button
              onClick={restart}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg rounded-lg transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </SceneContainer>
    );
  }

  // MAIN GAME SCREEN (scene_display, showing_choices, showing_outcome, transitioning)
  if (!state.currentScene) return null;

  return (
    <SceneContainer
      backgroundImage={background}
      testId="game-scene"
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
        {/* Chaos meter display (no character toggle - character is locked) */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${
              state.selectedCharacter?.id === 'rupert' ? 'text-orange-400' : 'text-violet-400'
            }`}>
              {state.selectedCharacter?.id === 'rupert' ? '⚔️' : '🔮'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/80 text-sm font-semibold">
                  {state.selectedCharacter?.name}
                </span>
                <span className="text-white/60 text-xs">
                  Chaos: {state.chaosLevel}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    state.chaosLevel < 26 ? 'bg-green-500' :
                    state.chaosLevel < 51 ? 'bg-yellow-500' :
                    state.chaosLevel < 76 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${state.chaosLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scene text */}
        <StoryText
          text={getSceneText()}
          position="top"
        />

        {/* Character flavor text (if available) */}
        {characterFlavorText && flowState === 'showing_choices' && (
          <div className="absolute top-24 left-4 right-4 z-10">
            <div className="bg-black/60 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3">
              <p className="text-white/90 text-sm italic text-center">
                {characterFlavorText}
              </p>
            </div>
          </div>
        )}

        {/* Choice list - only when showing choices */}
        {flowState === 'showing_choices' && (
          <ChoiceList
            choices={state.currentScene.choices}
            selectedCharacter={state.selectedCharacter?.id as 'rupert' | 'milo'}
            onChoiceSelect={handleChoiceSelect}
            isProcessing={isLocked || transitionLocked}
          />
        )}

        {/* Outcome display - after choice */}
        {flowState === 'showing_outcome' && state.selectedChoice && (
          <OutcomeDisplay
            outcomeText={state.selectedChoice.outcomeText}
            chaosChange={state.selectedChoice.chaosChange}
            onComplete={handleOutcomeComplete}
          />
        )}

        {/* Transition indicator */}
        {flowState === 'transitioning' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60 text-sm animate-pulse">
              Loading next scene...
            </div>
          </div>
        )}

        {/* Scene info footer */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-xs pb-2 bg-gradient-to-t from-black/50 to-transparent pt-8">
          <p>Scene: {state.currentScene.id} | Story: {depositJobStory.title}</p>
          <p className="mt-1">
            Flow: {flowState} | Transition: {transitionState}
          </p>
        </div>
      </div>
    </SceneContainer>
  );
}
