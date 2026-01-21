/**
 * Chaos Stories - "The Deposit Job"
 * A comedy heist story about delivering a mysterious box to a bank
 */

import { Story, Scene } from '../../types/game';
import { characters } from '../characters';

const scenes: Scene[] = [
  // ===== SCENE 1: The Flyer =====
  {
    id: 'scene-1',
    text: 'A flyer that\'s seen better days—and possibly crimes—sits on a suspiciously sticky tavern table. The handwriting screams "no questions asked" louder than the actual words: "Deliver small box. Royal Bank. Easy money."',
    backgroundImage: '/images/scenes/tavern.jpg',
    characterFlavor: {
      rupert: '"Easy money! That\'s what my cellmate always said. Well, former cellmate. He\'s dead now. Unrelated."',
      milo: '"Finally, a job that matches my skill set: carrying things and not asking why."'
    },
    choices: [
      {
        id: 'scene-1-choice-a',
        text: 'Take the job.',
        choiceType: 'flavor',
        nextSceneId: 'scene-2',
        chaosChange: 0,
        outcomeText: 'You pocket the flyer. It radiates warmth, possibly from proximity to poor decisions. Somewhere, a god of wisdom sighs.'
      },
      {
        id: 'scene-1-choice-b',
        text: 'Ask who posted it.',
        choiceType: 'flavor',
        nextSceneId: 'scene-2',
        chaosChange: 25,
        outcomeText: 'The bartender shrugs with the energy of someone who\'s seen everything. "Hooded figure. Paid in gold. Vanished." You\'re starting to detect a pattern in your life choices.'
      },
      {
        id: 'scene-1-choice-c',
        text: 'Liquid courage first. What could go wrong?',
        choiceType: 'flavor',
        nextSceneId: 'scene-2',
        chaosChange: 25,
        outcomeText: 'You down a shot that tastes like regret and smells like evidence. Your confidence increases by exactly zero percent, but your commitment to bad decisions is now bulletproof.'
      }
    ]
  },

  // ===== SCENE 2: The Box =====
  {
    id: 'scene-2',
    text: 'A nervous courier thrusts a small box at you like it personally wronged them. It\'s unnaturally warm. It hums like it knows something you don\'t. The note reads: "DO NOT OPEN. DO NOT SHAKE. SERIOUSLY."',
    backgroundImage: '/images/scenes/street.jpg',
    choices: [
      {
        id: 'scene-2-choice-a',
        text: 'Carry it carefully.',
        choiceType: 'flavor',
        nextSceneId: 'scene-3',
        chaosChange: 0,
        outcomeText: 'You cradle the box like a baby made of consequences and questionable life insurance. It hums contentedly. You\'re now emotionally bonded to a mysterious object. This is fine.'
      },
      {
        id: 'scene-2-choice-b',
        text: 'Shake it. Just once.',
        choiceType: 'flavor',
        nextSceneId: 'scene-3',
        chaosChange: 25,
        outcomeText: 'You give it the tiniest shake. The humming stops. You feel briefly victorious. Then it resumes, LOUDER, with what you can only describe as aggressive intent. The box has chosen violence.'
      },
      {
        id: 'scene-2-choice-c',
        text: 'Hide it, walk suspiciously fast.',
        choiceType: 'flavor',
        nextSceneId: 'scene-3',
        chaosChange: 25,
        outcomeText: 'You stuff it under your coat and speed-walk with the energy of someone absolutely, definitely, 100% not smuggling magical contraband. A child points at you. You walk faster.'
      }
    ]
  },

  // ===== SCENE 3: Guards at the Gate =====
  {
    id: 'scene-3',
    text: 'Two exhausted guards block the bank district gates like human disappointment. One looks at your humming box. The other looks at your face. Neither seems impressed. "What\'s in it?" asks Guard One, with the enthusiasm of someone already filling out paperwork.',
    backgroundImage: '/images/scenes/gate.jpg',
    choices: [
      {
        id: 'scene-3-choice-a',
        text: '"Official delivery. Boring bank stuff."',
        choiceType: 'flavor',
        nextSceneId: 'scene-4',
        chaosChange: 0,
        outcomeText: 'You deliver this line with the dead-eyed confidence of a career criminal. The guard yawns and waves you through. You\'ve just learned that 90% of crime is mediocre acting.'
      },
      {
        id: 'scene-3-choice-b',
        text: '"It\'s nothing. Just a box."',
        choiceType: 'flavor',
        nextSceneId: 'scene-4',
        chaosChange: 25,
        outcomeText: 'The guard narrows his eyes like he\'s calculating whether investigating this is worth his salary. The answer is no. You pass through. The box hums louder, as if celebrating.'
      },
      {
        id: 'scene-3-choice-c',
        text: 'Create a distraction. Big one.',
        choiceType: 'branch',
        nextSceneId: 'scene-3b',
        chaosChange: 50,
        outcomeText: 'Your brain, that magnificent disaster factory, produces a plan. You\'re going to regret this. You smile anyway.'
      }
    ]
  },

  // ===== SCENE 3B: The Chaos Works Too Well =====
  {
    id: 'scene-3b',
    text: 'Your "little distraction" has escalated into what scholars would call "a legitimate incident." People scatter. Guards shout contradictory orders. Somewhere, a chicken is involved. You have created art.',
    backgroundImage: '/images/scenes/chaos-street.jpg',
    characterFlavor: {
      rupert: 'You picked a fight with the largest man in the district. He swung. You dodged. He hit a fruit cart. The vendor hit him. Now there\'s a mob and you\'re somehow not part of it.',
      milo: 'You cast a "harmless illusion spell." The street signs are now screaming personal insults at passersby. One of them knows someone\'s middle name. You have no idea how. This is fine.'
    },
    choices: [
      {
        id: 'scene-3b-choice-a',
        text: 'Walk in like you belong.',
        choiceType: 'flavor',
        nextSceneId: 'scene-4',
        chaosChange: 25,
        outcomeText: 'You stride through the mayhem with the confidence of someone who definitely didn\'t cause this. The guards don\'t even look at you. You are a ghost. A guilty, successful ghost.'
      },
      {
        id: 'scene-3b-choice-b',
        text: 'Sprint through the chaos.',
        choiceType: 'flavor',
        nextSceneId: 'scene-4',
        chaosChange: 25,
        outcomeText: 'You run full speed through the disaster zone. Someone yells "STOP!" You don\'t. They\'re probably not even talking to you. Probably.'
      },
      {
        id: 'scene-3b-choice-c',
        text: 'Make it SO MUCH worse.',
        choiceType: 'flavor',
        nextSceneId: 'scene-4',
        chaosChange: 50,
        outcomeText: 'You add more chaos to the chaos. A fire starts. You didn\'t start it, but you definitely encouraged it. The situation achieves legendary status. You slip through the gates. Guards will talk about this day for years.'
      }
    ]
  },

  // ===== SCENE 4: Bank Lobby (Character Event #1) =====
  {
    id: 'scene-4',
    text: 'The bank lobby is aggressively pristine. Marble floors. Gold trim. A sign in threatening calligraphy reads: "NO SHOUTING. NO MAGIC. NO DRAMA." You are holding a humming mystery box. You are drama incarnate.',
    backgroundImage: '/images/scenes/bank-lobby.jpg',
    choices: [
      {
        id: 'scene-4-choice-a',
        text: 'Wait in line like functional adult.',
        choiceType: 'flavor',
        nextSceneId: 'scene-5',
        chaosChange: 0,
        outcomeText: 'You queue like a responsible citizen. The elderly woman ahead of you makes eye contact and nods with respect. You\'ve never felt this powerful. This must be what adulthood feels like.'
      },
      {
        id: 'scene-4-choice-b',
        text: 'Try to skip the line.',
        choiceType: 'flavor',
        nextSceneId: 'scene-5',
        chaosChange: 25,
        outcomeText: 'You attempt to slide past the queue with the confidence of someone who\'s never heard the word "consequences." Three people glare at you with the unified hatred of the justifiably annoyed. You keep going anyway.'
      },
      {
        id: 'scene-4-choice-c',
        text: 'Deploy sad face. Whisper "please."',
        choiceType: 'flavor',
        nextSceneId: 'scene-5',
        chaosChange: 25,
        outcomeText: 'You summon your most pathetic expression—years of poor decisions have made you extremely good at this. Someone takes pity and lets you through. You feel grateful, ashamed, and oddly validated.'
      },
      {
        id: 'scene-4-event-rupert',
        text: '[RUPERT EVENT] Blurt something inappropriate',
        choiceType: 'flavor',
        nextSceneId: 'scene-5',
        chaosChange: 50,
        outcomeText: 'Your mouth moves before your brain catches up. "LOVE THE ARCHITECTURE! DOES CORRUPTION COST EXTRA OR IS IT INCLUDED?" The lobby goes silent. A security guard stops mid-sip of coffee. You have achieved legendary attention.',
        characterOnly: 'rupert'
      },
      {
        id: 'scene-4-event-milo',
        text: '[MILO EVENT] Try tiny prestige magic',
        choiceType: 'flavor',
        nextSceneId: 'scene-5',
        chaosChange: 50,
        outcomeText: 'You attempt to casually levitate a coin to look sophisticated. It works! For two seconds. Then it shoots across the lobby like a tiny golden missile and strikes a senior banker in the forehead. He drops his monocle. You are now famous.',
        characterOnly: 'milo',
        isMagic: true
      }
    ]
  },

  // ===== SCENE 5: The Wrong Desk =====
  {
    id: 'scene-5',
    text: 'Desk 7 sends you to Desk 3. Desk 3 sends you to Desk 9. Desk 9 looks confused and sends you to Desk 1. You\'ve now visited desks that don\'t exist. The box hums louder, judging you. This is bureaucratic purgatory.',
    backgroundImage: '/images/scenes/bank-desks.jpg',
    choices: [
      {
        id: 'scene-5-choice-a',
        text: 'Follow process. Like a hostage.',
        choiceType: 'flavor',
        nextSceneId: 'scene-6',
        chaosChange: 0,
        outcomeText: 'You surrender to the machine. After the seventh desk transfer, your soul briefly leaves your body. When it returns, you\'re somehow at the right place. Capitalism has defeated you, but technically you won.'
      },
      {
        id: 'scene-5-choice-b',
        text: 'Summon the forbidden power: MANAGER.',
        choiceType: 'flavor',
        nextSceneId: 'scene-6',
        chaosChange: 25,
        outcomeText: 'You speak the ancient incantation: "I want to speak to your manager." The air crackles with power. A weary supervisor materializes from the break room, coffee in hand, ready to end this.'
      },
      {
        id: 'scene-5-choice-c',
        text: 'Slam box down. "I LIVE HERE NOW."',
        choiceType: 'flavor',
        nextSceneId: 'scene-6',
        chaosChange: 50,
        outcomeText: 'You declare squatter\'s rights on Desk 4. Security appears with the speed of people who\'ve trained for this exact scenario. "Special deposits," they say, gripping your shoulders. "This way." This is either very good or apocalyptically bad.'
      }
    ]
  },

  // ===== SCENE 6: The Metal Door =====
  {
    id: 'scene-6',
    text: 'Security escorts you to a reinforced metal door. The sign reads: "SPECIAL DEPOSITS - AUTHORIZED PERSONNEL ONLY." The box hums with what you can only describe as smug satisfaction. It knows something you don\'t.',
    backgroundImage: '/images/scenes/metal-door.jpg',
    choices: [
      {
        id: 'scene-6-choice-a',
        text: 'Hand over box. Say nothing.',
        choiceType: 'flavor',
        nextSceneId: 'scene-7',
        chaosChange: 0,
        outcomeText: 'You silently transfer the box and seal your lips. Professional. Competent. The guard looks mildly shocked. You\'ve apparently broken character. You feel oddly proud.'
      },
      {
        id: 'scene-6-choice-b',
        text: '"So... what\'s a special deposit?"',
        choiceType: 'flavor',
        nextSceneId: 'scene-7',
        chaosChange: 25,
        outcomeText: 'The guard turns slowly, like a predator spotting movement. "It means... special deposits." His tone suggests this is the most obvious thing in the world. You have learned nothing except that this man hates you.'
      },
      {
        id: 'scene-6-choice-c',
        text: 'Deploy a joke. Defuse tension.',
        choiceType: 'flavor',
        nextSceneId: 'scene-7',
        chaosChange: 25,
        outcomeText: 'You launch into what you believe is a hilarious observation about bank security. The guards stare at you. One blinks. The silence stretches like pulled taffy. You\'ve somehow made this worse. Impressive.'
      }
    ]
  },

  // ===== SCENE 7: The Problem (DEATH POSSIBLE) =====
  {
    id: 'scene-7',
    text: 'The guard examines the box with growing concern. His frown deepens into what can only be called "professional dread." "This deposit is late. And it\'s... active." The box hums innocently. You do not feel innocent.',
    backgroundImage: '/images/scenes/problem.jpg',
    choices: [
      {
        id: 'scene-7-choice-a',
        text: '"Delivered. Job done. Goodbye forever."',
        choiceType: 'flavor',
        nextSceneId: 'scene-8',
        chaosChange: 25,
        outcomeText: 'You attempt to exit your involvement in this situation with the speed of someone fleeing responsibility. The guard sighs like a man who\'s done this dance before. "You\'re coming with me." You are, apparently, still involved.'
      },
      {
        id: 'scene-7-choice-b',
        text: '"Hypothetically, what if we ignore it?"',
        choiceType: 'flavor',
        nextSceneId: 'scene-8',
        chaosChange: 25,
        outcomeText: 'The guard considers your question with the weariness of someone who\'s seen Some Things. "Something bad," he says. You wait for elaboration. None comes. This is peak customer service.'
      },
      {
        id: 'scene-7-choice-c',
        text: '"Open it. Let\'s meet our fate."',
        choiceType: 'flavor',
        nextSceneId: 'scene-8',
        chaosChange: 50,
        outcomeText: 'The guard carefully opens the box. Light erupts. You flinch. Everyone flinches. Then... nothing explodes. You\'re alive. The guard looks as surprised as you feel. The box sits there smugly.',
        deathCondition: {
          minChaos: 50
        },
        deathText: 'The guard opens the box with trembling hands. What emerges is best described as "aggressive disappointment with reality." The light is blinding. Your last thought is surprisingly calm: "This is exactly how my mother predicted I\'d die."\n\nThe box was sentient. The box remembered your chaos. The box chose violence.\n\n💀 GAME OVER - THE BOX WINS'
      }
    ]
  },

  // ===== SCENE 8: Alarm Lights (Character Event #2) =====
  {
    id: 'scene-8',
    text: 'Red lights strobe the lobby like an angry disco. A bell clangs with aggressive enthusiasm. The guard turns to you, his voice dead calm: "Okay. Now it\'s everyone\'s problem." You\'ve officially escalated from "your problem" to "societal crisis."',
    backgroundImage: '/images/scenes/alarm.jpg',
    choices: [
      {
        id: 'scene-8-choice-a',
        text: 'Obey security. Be helpful.',
        choiceType: 'flavor',
        nextSceneId: 'scene-9',
        chaosChange: 0,
        outcomeText: 'You follow every instruction with the compliance of someone who\'s finally learned fear. The guards look confused by your cooperation. One mouths "thank you" silently. Character development is happening.'
      },
      {
        id: 'scene-8-choice-b',
        text: 'Pretend to be staff. Blend in.',
        choiceType: 'flavor',
        nextSceneId: 'scene-9',
        chaosChange: 25,
        outcomeText: 'You adopt the posture of a bank employee: shoulders slumped, eyes dead, soul crushed by capitalism. Someone hands you a clipboard. You nod like you understand it. You have become invisible through shared misery.'
      },
      {
        id: 'scene-8-choice-c',
        text: 'Hide behind the decorative ferns.',
        choiceType: 'flavor',
        nextSceneId: 'scene-9',
        chaosChange: 25,
        outcomeText: 'You crouch behind a potted fern with the desperation of prey hiding from predators. Security sprints past. You are one with the foliage. The plant accepts you as its own. This is your life now.'
      },
      {
        id: 'scene-8-event-rupert',
        text: '[RUPERT EVENT] Yell tactical encouragement',
        choiceType: 'flavor',
        nextSceneId: 'scene-9',
        chaosChange: 50,
        outcomeText: 'Your mouth opens. Your brain is not involved in this decision. "WE\'VE GOT THIS! NOBODY PANIC!" you bellow with the confidence of someone who has never had anything under control. Everyone stops. Everyone stares. You have achieved the opposite of helping.',
        characterOnly: 'rupert'
      },
      {
        id: 'scene-8-event-milo',
        text: '[MILO EVENT] Cast a "helpful" spell',
        choiceType: 'flavor',
        nextSceneId: 'scene-9',
        chaosChange: 50,
        outcomeText: 'You remember a spell from Academy—"Silence the Bells," or possibly "Silence the Hells." You cast it. The alarm stops! Victory! Then the lights go out. Then the doors lock. You\'ve trapped everyone inside a pitch-black bank. A voice in the darkness whispers: "Who did that?" You do not answer.',
        characterOnly: 'milo',
        isMagic: true
      }
    ]
  },

  // ===== SCENE 9: The Offer =====
  {
    id: 'scene-9',
    text: 'A senior banker materializes from the chaos like a final boss wearing pinstripes. Her expression suggests she\'s done with today, this job, and possibly existence. "We\'ll triple your payment if you help us resolve this... safely." The pause before "safely" is deeply concerning.',
    backgroundImage: '/images/scenes/banker.jpg',
    choices: [
      {
        id: 'scene-9-choice-a',
        text: 'Accept immediately. Need money.',
        choiceType: 'flavor',
        nextSceneId: 'scene-10',
        chaosChange: 0,
        outcomeText: 'You accept before your brain can list all the reasons this is a terrible idea. The banker\'s shoulders sag with relief. You are now complicit in whatever fresh horror awaits. The money will be nice, though.'
      },
      {
        id: 'scene-9-choice-b',
        text: 'Try to leave. Absolutely not.',
        choiceType: 'flavor',
        nextSceneId: 'scene-10',
        chaosChange: 25,
        outcomeText: 'You turn toward the exit with the determination of someone who\'s learned nothing. Two security guards materialize, blocking your escape. "Please stay," the banker says in a voice that is absolutely not a request. You are staying.'
      },
      {
        id: 'scene-9-choice-c',
        text: 'Demand cash up front. Trust no one.',
        choiceType: 'flavor',
        nextSceneId: 'scene-10',
        chaosChange: 25,
        outcomeText: 'You channel your inner mercenary: "Payment. Now. Gold." The banker produces a hefty coin purse without blinking. You feel momentarily powerful, like a dragon hoarding treasure. Then you remember you still have to finish the job. The feeling fades.'
      }
    ]
  },

  // ===== SCENE 10: The Vault (DEATH POSSIBLE) =====
  {
    id: 'scene-10',
    text: 'You stand before the vault. It\'s massive. Intimidating. The box in your hands hums with what you swear is anticipation—like it KNOWS what comes next. The banker watches you with the expression of someone reconsidering all their life choices.',
    backgroundImage: '/images/scenes/vault.jpg',
    choices: [
      {
        id: 'scene-10-choice-a',
        text: 'Lock it away. Walk away. Live.',
        choiceType: 'flavor',
        nextSceneId: 'scene-11a',
        chaosChange: 0,
        outcomeText: 'You place the box inside the vault with the gentleness of someone handling a sleeping tiger. The humming stops. The vault door closes with a satisfying THUNK. The banker shakes your hand. You have survived. Against all odds, you have SURVIVED.'
      },
      {
        id: 'scene-10-choice-b',
        text: 'Open it. Face your curiosity.',
        choiceType: 'branch',
        nextSceneId: 'scene-11b',
        chaosChange: 50,
        outcomeText: 'You crack open the lid with trembling hands. Light spills out. Inside is... something. Something that should not be in a bank. Or possibly this dimension. The banker whispers, "Oh no."',
        deathCondition: {
          minChaos: 75
        },
        deathText: 'You open the box. The contents react to your accumulated chaos like gasoline meeting a match. There\'s a flash of light that tastes like regret, a sound like the universe sighing in disappointment, and then—\n\nNothing.\n\nYour last coherent thought: "Mom was right about literally everything."\n\nThe box was a chaos detector. You failed the test.\n\n💀 GAME OVER - CONSUMED BY YOUR OWN TERRIBLE DECISIONS'
      },
      {
        id: 'scene-10-choice-c',
        text: 'YEET IT. MAXIMUM SPEED.',
        choiceType: 'flavor',
        nextSceneId: 'scene-11c',
        chaosChange: 25,
        outcomeText: 'You wind up like a professional box-hurler and LAUNCH that cursed object into the vault with every ounce of strength. It sails through the air in a perfect arc. The banker gasps. Maximum efficiency. Minimum grace. Peak performance.'
      }
    ]
  },

  // ===== SCENE 11A: Ending - Clean Enough =====
  {
    id: 'scene-11a',
    text: 'ENDING: Clean Enough',
    backgroundImage: '/images/scenes/ending-clean.jpg',
    isEnding: true,
    choices: [],
    arrivalVariants: {
      'chaos-0-25': {
        text: 'Against all expectations—yours, the banker\'s, possibly the gods themselves—you completed this job CORRECTLY.\n\nThe banker stares at you like you\'re a mythical creature. She pays you double and offers you a business card. "If you ever need work..." she trails off, still processing.\n\nYou leave with gold, zero arrest warrants, and the unfamiliar sensation of pride. People will tell stories about the day you functioned like a responsible adult.\n\nIt\'s unsettling, honestly.\n\n🎉 ENDING: THE IMPOSSIBLE PROFESSIONAL'
      },
      'chaos-26-50': {
        text: 'You delivered the box. There were incidents. Minor ones. Mostly minor. Nothing exploded PERMANENTLY.\n\nThe banker pays you with the exhausted smile of someone who\'s grateful this didn\'t become a legal situation. "You did... fine," she says, in a tone that means "please never return."\n\nYou leave with money and moderate regret. The guards watch you go. One makes a note in a ledger.\n\nYou\'re not banned, but you\'re definitely on a list.\n\n✅ ENDING: ACCEPTABLE (BARELY) CHAOS'
      },
      'chaos-51-75': {
        text: 'You delivered the box through what historians will call "a series of escalating theatrical choices."\n\nThe banker pays you, immediately signals security, and hands you a lifetime ban notice already filled out with your name. "How did you—" you start. "We prepared it an hour ago," she interrupts.\n\nYou leave with gold, bruises, three different guards escorting you, and a reputation that will follow you to other cities.\n\nWorth it? Unclear. Memorable? Absolutely.\n\n🔥 ENDING: BANNED BUT FINANCIALLY COMPENSATED'
      },
      'chaos-76-100': {
        text: 'You delivered the box. The bank is now a "situation." Smoke—metaphorical and possibly literal—rises from several locations. Alarms blare. Someone is crying.\n\nThe banker doesn\'t hand you money. She THROWS it at your face and screams "LEAVE. JUST LEAVE." You catch most of the coins. Security forms a corridor toward the exit, their weapons drawn not AT you but around you, like you\'re a biohazard being escorted to containment.\n\nYou escape with your reward, your life, and a warrant with a surprisingly accurate sketch of your face.\n\nThe city guard captain pins it to his board with a sigh. "Of course," he mutters.\n\n🚨 ENDING: LEGENDARY DISASTER (WANTED IN FOUR DISTRICTS)'
      }
    }
  },

  // ===== SCENE 11B: Ending - The Weird Reveal =====
  {
    id: 'scene-11b',
    text: 'ENDING: The Weird Reveal',
    backgroundImage: '/images/scenes/ending-reveal.jpg',
    isEnding: true,
    choices: [],
    arrivalVariants: {
      'chaos-0-25': {
        text: 'You open the box carefully. Inside: a glowing crystal pulsing with ancient magic and what you\'re pretty sure is judgmental energy.\n\nThe banker watches your face. "It\'s a chaos detector," she explains. "Tests our security personnel. You passed." She slides a contract across the table. "We\'d like to offer you a permanent position."\n\nYou stare at the crystal. The crystal stares back. You politely decline and take the MASSIVE bonus instead.\n\nYou leave knowing you could have been responsible forever. You chose freedom and gold. The crystal dims, possibly with disappointment.\n\n💎 ENDING: THE RESPONSIBLE ONE (WHO CHOSE CHAOS ANYWAY)'
      },
      'chaos-26-50': {
        text: 'Inside the box is a pulsing magical artifact covered in runes you definitely can\'t read but definitely shouldn\'t touch.\n\n"It feeds on chaos energy," the banker explains, way too casually. "Your moderate chaos levels charged it perfectly. It\'s now worth triple."\n\nShe pays you a percentage that makes your eyes water. Then she leans close: "You tell NO ONE what you saw. Sign this."\n\nYou sign. You take the money. You leave.\n\nYears later, you\'ll wonder what that artifact powered. You\'ll never ask.\n\n⚡ ENDING: CHAOS BATTERY (WILLFUL IGNORANCE INCLUDED)'
      },
      'chaos-51-75': {
        text: 'You crack open the box. A small, glowing, FURIOUS creature explodes out like a tiny comet of rage.\n\n"CATCH IT!" the banker screams.\n\nWhat follows is ten minutes of chaos: you dive over desks, crash through plants, tackle a security guard by accident, and finally corner the creature in a filing cabinet. It hisses. You hiss back. You win.\n\nThe banker pays you triple. "Creature handling bonus," she gasps, still catching her breath. You leave before round two.\n\nOutside, you check your pockets. Something is moving. Oh no.\n\n🐉 ENDING: THE GREAT ESCAPE (IT FOLLOWED YOU HOME)'
      },
      'chaos-76-100': {
        text: 'You open the box. Inside is something that violates several laws of physics and possibly ethics.\n\nIt looks at you.\n\nYou look at it.\n\nIt has too many eyes. They blink in sequence. One winks.\n\nThe banker SLAMS the box shut with the speed of someone who\'s seen this before and hated it every time. She produces an enormous bag of gold. "You forget this. Right now. Forever."\n\nYou agree. You leave. You drink. You drink MORE. \n\nSometimes you wake up and it\'s there, in your dreams, winking.\n\nYou never speak of this. Ever.\n\n👁️ ENDING: THE FORBIDDEN KNOWLEDGE (IT KNOWS YOUR NAME NOW)'
      }
    }
  },

  // ===== SCENE 11C: Ending - Maximum Shortcut =====
  {
    id: 'scene-11c',
    text: 'ENDING: Maximum Shortcut',
    backgroundImage: '/images/scenes/ending-shortcut.jpg',
    isEnding: true,
    choices: [],
    arrivalVariants: {
      'chaos-0-25': {
        text: 'You wind up and throw the box with the precision of someone who\'s made exactly one good decision in their life. It sails through the air in a perfect arc and lands dead center in the vault.\n\nThe banker blinks. "Most people overthink it," she says, genuinely impressed.\n\nYou\'re paid, complimented, and offered future work. You briefly consider a career change: Professional Box Yeeter. \n\nThe business cards would be incredible.\n\n🎯 ENDING: PERFECT THROW (NEW CAREER UNLOCKED)'
      },
      'chaos-26-50': {
        text: 'You YEET that box with the confidence of someone who has never considered consequences.\n\nIt flies. It spins. It lands safely. Somehow.\n\nThe banker watches this display with an expression that combines annoyance, disbelief, and grudging respect. She pays you. She does not smile.\n\n"The throw-and-pray method," she mutters, updating her notes. "Somehow effective."\n\nYou leave before she can elaborate on why that\'s bad.\n\n💪 ENDING: THE YEET METHOD (CHAOS APPROVED)'
      },
      'chaos-51-75': {
        text: 'You launch the box like you\'re competing in the Olympic Games of Bad Ideas.\n\nIt bounces off the left wall. Ricochets off the right wall. Clips the ceiling. Your heart stops. The banker gasps. Security reaches for weapons.\n\nThen it settles perfectly in the center of the vault.\n\n"You broke... nothing?" the banker whispers, checking her clipboard. "Technically?"\n\nYou\'re paid. You\'re immediately escorted out by four guards. Your throwing technique is officially banned from all future deposits.\n\nWorth it.\n\n🏀 ENDING: CHAOS BASKETBALL (BANNED FROM THE SPORT)'
      },
      'chaos-76-100': {
        text: 'You wind up like a trebuchet operator who\'s had too much coffee and not enough sleep.\n\nYou HURL that box with every ounce of strength, spite, and accumulated bad decisions.\n\nIt ricochets off the vault door. Hits the ceiling with a CRACK. Bounces off a support beam. The banker screams. Security dives for cover.\n\nThen—impossibly, miraculously, LEGENDARILY—it lands exactly where it needs to be.\n\nSilence.\n\nThe banker stares. Security stares. You stare at your own hands, betrayed by their success.\n\n"That was..." the banker starts. She can\'t finish. There are no words.\n\nYou\'re paid DOUBLE. You\'re told to NEVER RETURN. You\'re added to a list titled "Persons of Concern."\n\nOutside, people are already spreading rumors. You\'re a legend.\n\n🌟 ENDING: MIRACLE THROW (BANNED BY PHYSICS)'
      }
    }
  }
];

export const depositJobStory: Story = {
  storyId: 'deposit-job',
  title: 'The Deposit Job',
  description: 'Deliver a mysterious humming box to the Royal Bank. What could possibly go wrong?',
  startSceneId: 'scene-1',
  characters: characters,
  scenes: scenes,
  endings: [
    {
      id: 'ending-clean',
      title: 'Clean Professional',
      description: 'You completed the job with minimal chaos. Boring, but effective.',
      conditions: {
        chaosMin: 0,
        chaosMax: 25
      }
    },
    {
      id: 'ending-acceptable',
      title: 'Acceptable Chaos',
      description: 'You made some questionable choices, but nothing exploded.',
      conditions: {
        chaosMin: 26,
        chaosMax: 50
      }
    },
    {
      id: 'ending-banned',
      title: 'Banned But Paid',
      description: 'You\'re never allowed back, but at least you got the money.',
      conditions: {
        chaosMin: 51,
        chaosMax: 75
      }
    },
    {
      id: 'ending-legendary',
      title: 'Legendary Disaster',
      description: 'Everything is on fire. You are a legend. The guard is looking for you.',
      conditions: {
        chaosMin: 76,
        chaosMax: 100
      }
    },
    {
      id: 'ending-reveal',
      title: 'The Weird Reveal',
      description: 'You opened the box and discovered its secret. You wish you hadn\'t.',
      conditions: {}
    }
  ]
};
