/**
 * Chaos Stories - Test Scenes
 * Mock data for testing Scene Container Component
 */

import type { Scene } from '../types/game';

/**
 * Scene 1: Tavern Entrance
 * The starting point - players approach a sketchy tavern
 */
export const tavernEntranceScene: Scene = {
  id: 'tavern-entrance',
  text: 'The Rusty Flagon looms before you, reeking of ale and poor decisions. A brawl erupts through the front window. The back door hangs open, unguarded.',
  backgroundImage: '/images/scenes/tavern-entrance.jpg',
  choices: [
    {
      id: 'choice-entrance-front',
      text: 'Walk through the front door',
      choiceType: 'branch',
      nextSceneId: 'tavern-bar',
      chaosChange: 5,
      outcomeText: 'You stride in confidently. Every head turns. The music stops. Not great.',
    },
    {
      id: 'choice-entrance-back',
      text: 'Sneak through the back door',
      choiceType: 'branch',
      nextSceneId: 'tavern-backroom',
      chaosChange: 0,
      outcomeText: 'You slip into the shadows. Nobody notices. Yet.',
    },
    {
      id: 'choice-entrance-rupert-kick',
      text: 'Kick the front door down',
      choiceType: 'branch',
      nextSceneId: 'tavern-bar',
      chaosChange: 15,
      outcomeText: 'The door explodes inward. You roar a battle cry. Everyone stares.',
      characterOnly: 'rupert',
    },
    {
      id: 'choice-entrance-milo-illusion',
      text: 'Create an illusion to distract the guards',
      choiceType: 'branch',
      nextSceneId: 'tavern-bar',
      chaosChange: 10,
      chaosVariance: { min: -5, max: 20 },
      outcomeText: 'You wave your hands dramatically. Something happens. Probably.',
      characterOnly: 'milo',
      isMagic: true,
    },
  ],
};

/**
 * Scene 2: Tavern Bar
 * Inside at the bar - sketchy patrons and expensive ale
 */
export const tavernBarScene: Scene = {
  id: 'tavern-bar',
  text: 'The bar is packed with sellswords and cutthroats. A twitchy barkeep eyes you suspiciously. Gold coins change hands in dark corners.',
  backgroundImage: '/images/scenes/tavern-bar.jpg',
  arrivalVariants: {
    'tavern-entrance': {
      text: 'The bar goes quiet as you walk in. The barkeep\'s hand drifts toward something under the counter.',
    },
  },
  choices: [
    {
      id: 'choice-bar-order-drink',
      text: 'Order the strongest drink',
      choiceType: 'flavor',
      nextSceneId: 'tavern-bar',
      chaosChange: -5,
      outcomeText: 'You down a shot of something that tastes like regret. The barkeep nods approvingly.',
    },
    {
      id: 'choice-bar-backroom',
      text: 'Head to the back room',
      choiceType: 'branch',
      nextSceneId: 'tavern-backroom',
      chaosChange: 0,
      outcomeText: 'You casually walk toward the back. Nobody stops you.',
    },
    {
      id: 'choice-bar-milo-steal',
      text: 'Swipe coins from the bar',
      choiceType: 'flavor',
      nextSceneId: 'tavern-bar',
      chaosChange: 10,
      outcomeText: 'Your fingers brush a gold pouch. You pocket it smoothly. Wait, was that barkeep watching?',
      characterOnly: 'milo',
    },
  ],
};

/**
 * Scene 3: Tavern Backroom
 * A mysterious back room with questionable activities
 */
export const tavernBackroomScene: Scene = {
  id: 'tavern-backroom',
  text: 'The back room reeks of smoke and danger. Three cloaked figures play cards. A chest sits in the corner, poorly locked.',
  backgroundImage: '/images/scenes/tavern-backroom.jpg',
  arrivalVariants: {
    'tavern-entrance': {
      text: 'You slip into the back room unnoticed. Three cloaked figures play cards, oblivious.',
    },
    'tavern-bar': {
      text: 'You push through the beaded curtain. The card players look up briefly, then return to their game.',
    },
  },
  choices: [
    {
      id: 'choice-backroom-chest',
      text: 'Go for the chest',
      choiceType: 'branch',
      nextSceneId: 'tavern-bar',
      chaosChange: 20,
      outcomeText: 'You lunge for the chest. A crossbow bolt slams into the wall beside you. Time to go.',
    },
    {
      id: 'choice-backroom-watch',
      text: 'Watch the card game',
      choiceType: 'flavor',
      nextSceneId: 'tavern-backroom',
      chaosChange: 0,
      outcomeText: 'You lean against the wall. One player glances at you. They\'re cheating, obviously.',
    },
    {
      id: 'choice-backroom-milo-unlock',
      text: 'Unlock chest with magic',
      choiceType: 'flavor',
      nextSceneId: 'tavern-backroom',
      chaosChange: 5,
      chaosVariance: { min: -10, max: 15 },
      outcomeText: 'You whisper a spell. The lock glows, then... well, it does something.',
      characterOnly: 'milo',
      isMagic: true,
    },
  ],
};

/**
 * All test scenes exported as an array
 */
export const testScenes: Scene[] = [
  tavernEntranceScene,
  tavernBarScene,
  tavernBackroomScene,
];

/**
 * Helper to get a scene by ID
 */
export function getSceneById(sceneId: string): Scene | undefined {
  return testScenes.find((scene) => scene.id === sceneId);
}
