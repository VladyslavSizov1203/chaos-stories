/**
 * Chaos Stories - Character Definitions
 * Based on "The Deposit Job" story script
 */

import { Character } from '../types/game';

export const rupert: Character = {
  id: 'rupert',
  name: 'Rupert',
  class: 'Warrior',
  description: 'A brave warrior with Tourette\'s syndrome. Loyal, loud, and loves a good drink. His choices tend to be physical and confrontational.',
  portrait: '/images/characters/rupert.png',
  ability: {
    name: 'Tourette\'s Outburst',
    description: 'Occasionally blurts out inappropriate things at the worst possible moments.'
  },
  traits: {
    tourettesChance: 0.25 // 25% chance in eligible scenes
  }
};

export const milo: Character = {
  id: 'milo',
  name: 'Milo',
  class: 'Mage',
  description: 'A scheming mage expelled from magic school. Loves money more than magic. His spells are unreliable but sometimes useful.',
  portrait: '/images/characters/milo.png',
  ability: {
    name: 'Spell Backfire',
    description: 'Magic spells work... sort of. Side effects guaranteed.'
  },
  traits: {
    spellBackfireChance: 0.4 // 40% chance when casting spells
  }
};

export const characters: Character[] = [rupert, milo];
