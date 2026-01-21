/**
 * useGameState Hook
 *
 * Type-safe game flow state machine for Chaos Stories.
 * Manages all game state transitions with defensive logging.
 *
 * Ticket: #6 (1.6: Game Flow State Machine)
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { Scene, Character, Choice, Ending } from '@/src/types/game';

// === STATE MACHINE DEFINITION ===

/**
 * All possible game flow states
 */
export type GameFlowState =
  | 'menu'
  | 'character_select'
  | 'scene_display'
  | 'showing_choices'
  | 'showing_outcome'
  | 'transitioning'
  | 'dead'
  | 'ending';

/**
 * Valid state transitions map
 * Each state maps to an array of allowed next states
 */
const VALID_TRANSITIONS: Record<GameFlowState, GameFlowState[]> = {
  menu: ['character_select'],
  character_select: ['scene_display', 'character_select'], // Allow re-selecting character
  scene_display: ['showing_choices'],
  showing_choices: ['showing_outcome'],
  showing_outcome: ['transitioning'],
  transitioning: ['scene_display', 'dead', 'ending'],
  dead: ['menu'],
  ending: ['menu'],
};

/**
 * Complete game state
 */
export interface GameState {
  // Flow control
  flowState: GameFlowState;

  // Core game data
  selectedCharacter: Character | null;
  currentScene: Scene | null;
  previousSceneId: string | null;
  chaosLevel: number;

  // Choice tracking
  selectedChoice: Choice | null;
  characterChoiceCount: number;
  choiceHistory: Array<{
    choiceId: string;
    sceneId: string;
    wasCharacterSpecific: boolean;
    wasTimeout: boolean;
    chaosChange: number;
  }>;

  // Death state
  deathText: string | null;

  // Ending state
  currentEnding: Ending | null;
}

/**
 * State machine actions
 */
export type GameAction =
  | { type: 'SELECT_CHARACTER'; character: Character }
  | { type: 'START_GAME'; startScene: Scene }
  | { type: 'SHOW_CHOICES' }
  | { type: 'MAKE_CHOICE'; choice: Choice }
  | { type: 'SHOW_OUTCOME' }
  | { type: 'COMPLETE_OUTCOME'; chaosChange: number }
  | { type: 'START_TRANSITION' }
  | { type: 'COMPLETE_TRANSITION'; nextScene: Scene }
  | { type: 'SET_DEAD'; deathText: string }
  | { type: 'SET_ENDING'; ending: Ending }
  | { type: 'RESTART' };

/**
 * Hook return value
 */
export interface UseGameStateReturn {
  // Current state
  state: GameState;

  // State queries
  flowState: GameFlowState;
  isLocked: boolean; // True when UI should be locked

  // Actions
  goToCharacterSelect: () => void;
  selectCharacter: (character: Character) => void;
  startGame: (startScene: Scene) => void;
  showChoices: () => void;
  makeChoice: (choice: Choice) => void;
  showOutcome: () => void;
  completeOutcome: (chaosChange: number) => void;
  startTransition: () => void;
  completeTransition: (nextScene: Scene) => void;
  setDead: (deathText: string) => void;
  setEnding: (ending: Ending) => void;
  restart: () => void;
}

// === HELPER FUNCTIONS ===

/**
 * Validate state transition
 * Returns true if transition is valid, false otherwise
 */
function isValidTransition(from: GameFlowState, to: GameFlowState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Clamp chaos level to 0-100 range
 */
function clampChaos(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Get initial game state
 */
function getInitialState(): GameState {
  return {
    flowState: 'menu',
    selectedCharacter: null,
    currentScene: null,
    previousSceneId: null,
    chaosLevel: 0,
    selectedChoice: null,
    characterChoiceCount: 0,
    choiceHistory: [],
    deathText: null,
    currentEnding: null,
  };
}

// === MAIN HOOK ===

/**
 * Game state machine hook
 *
 * Provides type-safe state transitions with defensive logging.
 * Prevents invalid state transitions and maintains game state integrity.
 *
 * @example
 * ```tsx
 * const { state, flowState, selectCharacter, startGame } = useGameState();
 *
 * // Select character
 * selectCharacter(rupertCharacter);
 *
 * // Start game
 * startGame(firstScene);
 *
 * // Make a choice
 * makeChoice(selectedChoice);
 * ```
 */
export function useGameState(): UseGameStateReturn {
  const [state, setState] = useState<GameState>(getInitialState());

  // Use ref for logging to avoid stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * Attempt state transition with validation
   */
  const transition = useCallback((to: GameFlowState, updater?: Partial<GameState>) => {
    const from = stateRef.current.flowState;

    if (!isValidTransition(from, to)) {
      console.error(
        `[GameState] Invalid transition attempted: ${from} → ${to}`,
        `\nAllowed transitions from ${from}:`,
        VALID_TRANSITIONS[from]
      );
      return false;
    }

    console.log(`[GameState] Transition: ${from} → ${to}`);

    // Update ref immediately so chained synchronous calls see the new state
    const newState = {
      ...stateRef.current,
      flowState: to,
      ...updater,
    };
    stateRef.current = newState;

    setState(newState);

    return true;
  }, []);

  // === ACTION HANDLERS ===

  const goToCharacterSelect = useCallback(() => {
    transition('character_select');
  }, [transition]);

  const selectCharacter = useCallback(
    (character: Character) => {
      transition('character_select', {
        selectedCharacter: character,
        chaosLevel: 0,
        characterChoiceCount: 0,
        choiceHistory: [],
      });
    },
    [transition]
  );

  const startGame = useCallback(
    (startScene: Scene) => {
      transition('scene_display', {
        currentScene: startScene,
        previousSceneId: null,
      });
    },
    [transition]
  );

  const showChoices = useCallback(() => {
    transition('showing_choices');
  }, [transition]);

  const makeChoice = useCallback(
    (choice: Choice) => {
      // Update ref immediately so chained synchronous calls see the choice
      const newState = {
        ...stateRef.current,
        selectedChoice: choice,
      };
      stateRef.current = newState;
      setState(newState);
    },
    []
  );

  const showOutcome = useCallback(() => {
    // Check ref instead of state for synchronous calls
    if (!stateRef.current.selectedChoice) {
      console.error('[GameState] Cannot show outcome: no choice selected');
      return;
    }

    transition('showing_outcome');
  }, [transition]);

  const completeOutcome = useCallback(
    (chaosChange: number) => {
      if (!state.selectedChoice) {
        console.error('[GameState] Cannot complete outcome: no choice selected');
        return;
      }

      const wasCharacterSpecific = state.selectedChoice.characterOnly !== undefined;
      const newChaosLevel = clampChaos(state.chaosLevel + chaosChange);

      transition('transitioning', {
        chaosLevel: newChaosLevel,
        characterChoiceCount:
          state.characterChoiceCount + (wasCharacterSpecific ? 1 : 0),
        choiceHistory: [
          ...state.choiceHistory,
          {
            choiceId: state.selectedChoice.id,
            sceneId: state.currentScene?.id ?? '',
            wasCharacterSpecific,
            wasTimeout: false, // Will be set by timer logic
            chaosChange,
          },
        ],
      });
    },
    [state.selectedChoice, state.chaosLevel, state.characterChoiceCount, state.choiceHistory, state.currentScene, transition]
  );

  const startTransition = useCallback(() => {
    transition('transitioning');
  }, [transition]);

  const completeTransition = useCallback(
    (nextScene: Scene) => {
      transition('scene_display', {
        previousSceneId: state.currentScene?.id ?? null,
        currentScene: nextScene,
        selectedChoice: null,
      });
    },
    [state.currentScene, transition]
  );

  const setDead = useCallback(
    (deathText: string) => {
      transition('dead', {
        deathText,
      });
    },
    [transition]
  );

  const setEnding = useCallback(
    (ending: Ending) => {
      transition('ending', {
        currentEnding: ending,
      });
    },
    [transition]
  );

  const restart = useCallback(() => {
    transition('menu', getInitialState());
  }, [transition]);

  // === COMPUTED VALUES ===

  const isLocked =
    state.flowState === 'showing_outcome' ||
    state.flowState === 'transitioning';

  return {
    state,
    flowState: state.flowState,
    isLocked,
    goToCharacterSelect,
    selectCharacter,
    startGame,
    showChoices,
    makeChoice,
    showOutcome,
    completeOutcome,
    startTransition,
    completeTransition,
    setDead,
    setEnding,
    restart,
  };
}

export default useGameState;
