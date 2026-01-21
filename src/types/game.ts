/**
 * Chaos Stories - Game Type Definitions
 * Based on canonical schema from VALIDATION.md
 */

// === CHARACTER ===
export interface Character {
  id: 'rupert' | 'milo';
  name: string;
  class: string;
  description: string;
  portrait: string;
  ability: {
    name: string;
    description: string;
  };
  traits: {
    tourettesChance?: number;     // Rupert: 0.2-0.3
    spellBackfireChance?: number; // Milo: 0.3-0.5
  };
}

// === CHOICE ===
export interface Choice {
  id: string;
  text: string;
  choiceType: 'flavor' | 'branch';
  nextSceneId: string;
  chaosChange: number;
  outcomeText: string;
  characterOnly?: 'rupert' | 'milo';
  chaosVariance?: { min: number; max: number };
  isMagic?: boolean; // For Milo's spell backfire checks
}

// === SCENE ===
export interface Scene {
  id: string;
  text: string;
  backgroundImage: string;
  choices: Choice[];
  isEnding?: boolean;
  arrivalVariants?: {
    [fromSceneId: string]: { text: string; };
  };
}

// === ENDING ===
export interface Ending {
  id: string;
  title: string;
  description: string;
  image?: string;
  conditions: {
    chaosMin?: number;
    chaosMax?: number;
    characterOnly?: 'rupert' | 'milo';
    requiresCharacterChoices?: number;
  };
}

// === STORY ===
export interface Story {
  storyId: string;
  title: string;
  description: string;
  startSceneId: string;
  characters: Character[];
  scenes: Scene[];
  endings: Ending[];
}

// === GAME STATE ===
export type GameFlowState =
  | 'menu'
  | 'character_select'
  | 'scene_display'
  | 'showing_choices'
  | 'showing_outcome'
  | 'transitioning'
  | 'ending';

export interface GameState {
  flowState: GameFlowState;
  selectedCharacter: 'rupert' | 'milo' | null;
  currentSceneId: string;
  previousSceneId: string | null;  // For arrivalVariants
  chaosLevel: number;
  characterChoiceCount: number;
  choiceHistory: Array<{
    choiceId: string;
    wasCharacterSpecific: boolean;
    wasTimeout: boolean;
  }>;
}

// === RANDOM EVENT ===
export interface RandomEvent {
  type: 'tourettes' | 'spell_backfire';
  text: string;
  chaosChange: number;
}
